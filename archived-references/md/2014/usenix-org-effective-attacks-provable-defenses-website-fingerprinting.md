---
type: Article
title: Effective Attacks and Provable Defenses for Website Fingerprinting
description: A k-nearest-neighbour classifier over a large weighted feature set lets a passive local eavesdropper tell which of 100 monitored pages a Tor user is loading, at 85 percent true positive and 0.6 percent false positive in an open world. The paper then builds provably private simulatable defences from supersequences over anonymity sets.
resource: "https://www.usenix.org/conference/usenixsecurity14/technical-sessions/presentation/wang_tao"
tags: [article, webseclist-reference, usenix-org, side-channel, info-leak, https, tls, proxy, defence, measurement-study, owasp-a02-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-14T15:05:45+00:00"
status: stable
stale_after: 2027-08-14
sources:
  - id: original
    resource: "https://www.usenix.org/conference/usenixsecurity14/technical-sessions/presentation/wang_tao"
    title: Effective Attacks and Provable Defenses for Website Fingerprinting
    author: Tao Wang, Xiang Cai, Rishab Nithyanand, Rob Johnson, Ian Goldberg
also_at:
  - "https://www.usenix.org/system/files/conference/usenixsecurity14/sec14-paper-wang-tao.pdf"
authors:
  - Tao Wang
  - Xiang Cai
  - Rishab Nithyanand
  - Rob Johnson
  - Ian Goldberg
canonical_url: ""
cited_by:
  - "2014.md:77"
commit: ""
content_sha256: 8e9f6c34bae97fd0f995377edb541ae7e206306325fed4df3e4df537d93e15ed
depth: full
depth_reason: default
kind: article
language: ""
licence: unknown
original_url: "https://www.usenix.org/conference/usenixsecurity14/technical-sessions/presentation/wang_tao"
published: ""
publisher: usenix.org
publisher_english: ""
raw_sha256: b0540d4f4a4238a25fe5dd4aa42803f5213d541c4099cd8e4aef16f3124bdef8
retrieved_from: "https://www.usenix.org/conference/usenixsecurity14/technical-sessions/presentation/wang_tao"
retrieved_kind: manual-import
retrieved_utc: "2026-08-14T15:05:45+00:00"
slug: usenix-org-effective-attacks-provable-defenses-website-fingerprinting
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Effective Attacks and Provable Defenses for Website Fingerprinting

**Effective Attacks and Provable Defenses for Website Fingerprinting** - Tao Wang, Xiang Cai, Rishab Nithyanand, Rob Johnson, Ian Goldberg, usenix.org.

- Published: date not stated
- Original: <https://www.usenix.org/conference/usenixsecurity14/technical-sessions/presentation/wang_tao>
- Also published at: <https://www.usenix.org/system/files/conference/usenixsecurity14/sec14-paper-wang-tao.pdf>
- Preserved from: https://www.usenix.org/conference/usenixsecurity14/technical-sessions/presentation/wang_tao (manual-import) on 2026-08-14
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# Effective Attacks and Provable Defenses for Website Fingerprinting

Effective Attacks and Provable Defenses
            for Website Fingerprinting
Tao Wang, University of Waterloo; Xiang Cai, Rishab Nithyanand, and Rob Johnson,
          Stony Brook University; Ian Goldberg, University of Waterloo
 https://www.usenix.org/conference/usenixsecurity14/technical-sessions/presentation/wang_tao




           This paper is included in the Proceedings of the
                  23rd USENIX Security Symposium.
                          August 20–22, 2014 • San Diego, CA
                                   ISBN 978-1-931971-15-7




                                                  Open access to the Proceedings of
                                                the 23rd USENIX Security Symposium
                                                       is sponsored by USENIX
       Effective Attacks and Provable Defenses for Website Fingerprinting

      Tao Wang 1         Xiang Cai 2        Rishab Nithyanand 2               Rob Johnson 2         Ian Goldberg 1
               1 University of Waterloo                                    2 Stony Brook University

        {t55wang,iang}@cs.uwaterloo.ca                        {xcai,rnithyanand,rob}@cs.stonybrook.edu



                       Abstract                                       When a client browses the web, she reveals her desti-
Website fingerprinting attacks allow a local, passive              nation and packet content to intermediate routers, which
eavesdropper to identify a user’s web activity by lever-           are controlled by ISPs who may be susceptible to ma-
aging packet sequence information. These attacks break             licious attackers, eavesdroppers, and legal pressure. To
the privacy expected by users of privacy technologies,             protect her web-browsing privacy, the client would need
including low-latency anonymity networks such as Tor.              to encrypt her communication traffic and obscure her
In this paper, we show a new attack that achieves sig-             destinations with a proxy such as Tor. Website finger-
nificantly higher accuracy than previous attacks in the            printing refers to the set of techniques that seek to re-
same field, further highlighting website fingerprinting as         identify these clients’ destination web pages by passively
a genuine threat to web privacy. We test our attack under          observing their communication traffic. The traffic will
a large open-world experimental setting, where the client          contain packet lengths, order, and timing information
can visit pages that the attacker is not aware of. We found        that could uniquely identify the page, and website fin-
that our new attack is much more accurate than previous            gerprinting attacks use machine classification to extract
attempts, especially for an attacker monitoring a set of           and use this information (see Section 2).
sites with low base incidence rate. We can correctly de-              A number of attacks have been proposed that would
termine which of 100 monitored web pages a client is               compromise a client’s expected privacy, and defenses
visiting (out of a significantly larger universe) at an 85%        have been proposed to counter these attacks (see Sec-
true positive rate with a false positive rate of 0.6%, com-        tion 3). Most previous defenses have been shown to fail
pared to the best of 83% true positive rate with a false           against more advanced attacks [4, 6, 15]; this is because
positive rate of 6% in previous work.                              they were evaluated only against specific attacks, with no
   To defend against such attacks, we need provably ef-            notion of provable effectiveness (against all possible at-
fective defenses. We show how simulatable, determinis-             tacks). In this paper, we will show an attack that further
tic defenses can be provably private, and we show that             highlights the fact that clients need a provably effective
bandwidth overhead optimality can be achieved for these            defense, for which an upper bound on the accuracy of
defenses by using a supersequence over anonymity sets              any possible attack can be given. We will then show how
of packet sequences. We design a new defense by ap-                such a defense can be constructed. Only with a prov-
proximating this optimal strategy and demonstrate that             ably effective defense can we be certain that clients are
this new defense is able to defeat any attack at a lower           protected against website fingerprinting.
cost on bandwidth than the previous best.
                                                                      The contributions of our paper are as follows:

1   Introduction
                                                                    1. We propose a significantly improved attack that
Privacy technologies are becoming more popular: Tor,                   achieves a higher accuracy with a training and test-
a low-latency anonymity network, currently has 500,000                 ing time that is orders of magnitude lower than the
daily users and the number has been growing [21]. How-                 previous best. Our attack is a k-Nearest Neigh-
ever, users of Tor are vulnerable to website fingerprinting            bour classifier applied on a large feature set with
attacks [4, 17, 23]. Users of other privacy technologies               weight adjustment. Our attack is designed to find
such as SSH tunneling, VPNs and IPsec are also vulner-                 flaws in defenses and achieve high success rates
able to website fingerprinting [10].                                   even with those defenses, and we demonstrate that


                                                               1
USENIX Association                                                                    23rd USENIX Security Symposium 143
       several known defenses have almost no impact on                  and, sometimes, involve tampering with the client’s de-
       our attack. We describe this attack in Section 4.                vice [12]. Our attack achieves high accuracy with only a
                                                                        local, passive attacker.
    2. Using this attack, we tackle a large open-world                     In general, the attacker’s strategy is as follows. The
       problem, in which the attacker must determine                    attacker collects packet traces from several web pages
       which of 100 monitored pages the client is visiting,             that he is interested in monitoring. Then, the attacker
       but the client can visit a large number of pages that            observes packet traces generated by the client during her
       the attacker cannot train on. We demonstrate that                web browsing, and compares these traces with the ones
       the attack is still truly effective in this realistic sce-       he collected by performing supervised classification. We
       nario in Section 5, and that it outperforms the previ-           note two assumptions that all previous works on WF have
       ous best attack by Wang and Goldberg [23] (which                 made of the attacker:
       we call OSAD) on the same data set.
                                                                         1. Well-defined packet traces. It is assumed that the
    3. We show that simulatable, deterministic defenses                     attacker knows where the packet trace of a single
       can be turned into provably private defenses in our                  page load starts and ends. If the client takes much
       model. In our model, we consider a defense to be                     longer to load the next page after the current one is
       successful only if it produces packet sequences that                 loaded, this assumption can be justified.
       are identical (in time, order, and packet lengths) to
       packet sequences from different web pages. This                   2. No other activity. We assume the client is not per-
       strong notion of indistinguishability of packet se-                  forming any other activity that could be confused
       quences yields our provably private defenses. We                     for page-loading behaviour, such as downloading a
       found that the bandwidth-optimal simulatable, de-                    file.
       terministic defense is to transmit packets using su-
       persequences over anonymity sets. We construct a                    These assumptions are used by all previous works on
       principled defense using an approximation of the                 WF as they simplify the problem, though it should be
       smallest common supersequence problem and clus-                  noted that these assumptions are advantageous for the at-
       tering techniques in Section 6 and evaluate it in Sec-           tacker. We discuss how the attacker can carry out a suc-
       tion 7.                                                          cessful attack without these assumptions in Section 8.
                                                                           Website fingerprinting is harder on Tor than simple
   We follow up with a discussion on realistic applica-                 SSH or VPN tunneling [10]. This is because Tor uses cell
bility and reproducibility of our results in Section 8 and              padding, such that data is sent in fixed-size (512-byte)
conclude in Section 9.                                                  cells. In addition, Tor has background noise (circuit con-
                                                                        struction, SENDME packets, etc.) which interferes with
                                                                        website fingerprinting [23]. As Tor has a large user base
2     Basics                                                            and an extensive architecture upon which defenses can
                                                                        be applied, recent works and our work are interested in
2.1      Website Fingerprinting on Tor                                  attacking and defending Tor, especially as Tor develop-
                                                                        ers remain unconvinced that website fingerprinting poses
Website fingerprinting (WF) refers to the process of at-                a real threat [19].
tempting to identify a web-browsing client’s behaviour—
specifically, which web pages she is visiting—by observ-
                                                                        2.2    Classification
ing her traffic traces. We assume that the client is using a
proxy to hide her true destination, as well as encryption               Given a packet sequence, the attacker learns the client’s
to hide her packet contents, as without these basic de-                 destination web page with a classification algorithm
fenses she reveals her destination to a trivial eavesdrop-              (classifier). The attacker first gathers packet sequences
per. Users of Tor have these defenses.                                  of known pages that he is interested in monitoring (the
   More recent attacks can successfully perform web-                    training set). This is known as supervised training as the
site fingerprinting with an attacker that only has local                true labels of these packet sequences are known to the
observation capacity; i.e. the attacker merely observes                 attacker. We can test the effectiveness of such a classifier
the traffic traces of the client without any interference.              by applying it to a data set of packet sequences that the
The attacker is located on the client’s network, such as                attacker did not train on (the testing set), and measuring
the client’s ISP, or he has gained control of some router               the accuracy of the classifier’s predictions.
near the client. Attacks requiring more capabilities have                  Central to the classifier is a notion of distance between
been proposed, such as attacks which leverage active                    packet sequences. A larger distance indicates that the
traffic-shaping strategies [8], remote ping detection [9]               two packet sequences are less likely to be from the same

                                                                    2
144 23rd USENIX Security Symposium                                                                             USENIX Association
page. Previous authors have used varying formulae for                           ing the Naı̈ve Bayes classifier. Under the first attack,
distance, ranging from comparing the occurrence counts                          the classifier mapped each packet sequence to its set
of unique packet lengths to variations of Levenshtein dis-                      of unique packet lengths (discarding ordering and fre-
tance. The distance used reflects how features are used to                      quency). Then, it used the Jaccard coefficient as a mea-
distinguish web pages. These features are, explicitly or                        surement of the distance between two packet sequences.
implicitly, extracted from packet sequences to compare                          The Naı̈ve Bayes classifier used packet lengths and their
them with each other.                                                           occurrence frequencies as well, but also discarded order-
   Our attack is based on the important observation that                        ing and timing. The Naı̈ve Bayes assumption is that the
a class representing a web page is multi-modal. Several                         occurrence probabilities of different packet lengths are
factors cause a web page to vary: network conditions,                           independent of each other. Later, Herrmann et al. [10]
random advertisements and content, updating data over                           proposed a number of improvements to this attack by in-
time, and unpredictable order of resources. Client con-                         corporating techniques from text mining.
figuration may also affect page loading.1 An attacker can                          Bissias et al. in 2006 [2] published an attack based
deal with multi-modal data sets by gathering enough data                        on cross-correlation with interpacket timings, but it is
to have representative elements from each mode. For ex-                         less accurate than the Naı̈ve Bayes attacks. Lu et al.
ample, an attacker can gather two modes of a page, one                          in 2010 [15] published an attack that heavily focuses on
for low-bandwidth connections, and another for high-                            capturing packet burst patterns with packet ordering, dis-
bandwidth connections.2 We use a classifier designed                            carding packet frequencies and packet timing.
for multi-modal classes, for which different modes of
the class do not need to have any relationship with each
other.
                                                                                3.3    Hidden packet length attacks
                                                                                Herrmann et al. were not able to successfully perform
3     Related Work                                                              WF on Tor [17], where unique packet lengths are hidden
                                                                                by fixed-size Tor cells. In 2009, Panchenko et al. [17]
This section surveys the related work on website finger-                        showed an attack that succeeded against web-browsing
printing (WF). We classify attacks into those which de-                         clients that use Tor. As unique packet lengths are hidden
pend on revealed resource lengths (HTTP 1.0), revealed                          on Tor, Panchenko et al. used other features, which are
packet lengths (HTTP 1.1, VPNs, SSH tunneling, etc.),                           processed by a Support Vector Machine (SVM). These
and hidden packet lengths (Tor). We also survey the pre-                        features attempted to capture burst patterns, main docu-
vious work on defenses in this section.                                         ment size, ratios of incoming and outgoing packets, and
                                                                                total packet counts, which helped identify a page. Dyer
                                                                                et al. in 2012 [6] used a similar but smaller set of features
3.1     Resource length attacks                                                 for a variable n-gram classifier, but their classifier did not
In HTTP 1.0, web page resources (images, scripts, etc.)                         perform better in any of the scenarios they considered.
are each requested with a separate TCP connection. This                            Cai et al. in 2011 improved the accuracy of WF on Tor.
implies that an attacker who is able to distinguish be-                         Using the edit distance to compare packet sequences,
tween different connections can identify the total length                       they modified the kernel of the SVM and showed an
of each resource. The earliest attacks were performed                           attack with significantly increased accuracy on Tor [4].
in this scenario: Cheng et al. in 1998 [5], Sun et al.                          Wang and Goldberg in 2013 further improved the accu-
in 2002 [20], and Hintz in 2003 [11]. These works                               racy of Cai et al.’s scheme on Tor by modifying the edit
showed that observing resource lengths can help iden-                           distance algorithm [23], creating OSAD. These modifi-
tify a page. HTTP 1.1 uses persistent connections, and                          cations were based on observations on how web pages
therefore more recent browsers and privacy technologies                         are loaded. As it is the current state of the art under
are not susceptible to resource length attacks.                                 the same attack scenario, we will compare our attack to
                                                                                OSAD.
3.2     Unique packet length attacks
                                                                                3.4    Defenses
Liberatore and Levine in 2006 [14] showed how unique
packet lengths are a powerful WF feature with two at-                           Defenses are applied on the client’s connection in or-
tacks: one using the Jaccard coefficient and another us-                        der to protect her against website fingerprinting attacks.
   1 On the Tor Browser changing the browser configuration is discour-
                                                                                We present a new classification of defenses in this sec-
aged as it makes browser fingerprinting easy.
                                                                                tion. First, defenses can be “simulatable” or “non-
   2 Data collection on Tor will naturally result in such a situation be-       simulatable”. A simulatable defense can be written as
cause of random circuit selection.                                              a defense function D that takes in a packet sequence and


                                                                            3
USENIX Association                                                                                  23rd USENIX Security Symposium 145
outputs another packet sequence. The function does not                     4     Attack
look at the true contents of the packets, but only their
length, direction and time. An advantage of simulatable                    In this section, we describe our new attack, which is de-
defenses is the implementation cost, as non-simulatable                    signed to break website fingerprinting defenses. Our at-
defenses would need to be implemented on the browser                       tack is based on the well-known k-Nearest Neighbours
and would have access to client data, which may be dif-                    (k-NN) classifier, which we briefly overview in Sec-
ficult for some clients to accept. The implementation of                   tion 4.1. The attack finds flaws in defenses by relying
a simulatable defense requires no more access to infor-                    on a large feature set, which we describe in Section 4.2.
mation than a website fingerprinting attacker would typ-                   We then train the attack to focus on features which the
ically have.                                                               defense fails to cover and which therefore remain use-
   Secondly, defenses can be “deterministic” or                            ful for classification. We describe the weight adjustment
“random”—for deterministic defenses the function                           process in Section 4.3.
D always returns the same packet sequence for each
input packet sequence p.3 Our goal is to design a                          4.1    k-NN classifier
provably private defense that has an upper bound on the
accuracy of any attack. Random defenses (noise) have                       k-NN is a simple supervised machine learning algorithm.
the disadvantage that choosing a good covering is not                      Suppose the training set is Strain and the testing set is
guaranteed. An attacker that can link together different                   Stest . The classifier is given a set of training points
page loads can partially remove the noise. Furthermore,                    (packet sequences) Strain = {P1 , P2 , . . .}. The training
implementations of random defenses must be careful                         points are labeled with classes (the page the packet se-
so that noise cannot be easily distinguished from real                     quence was loaded from); let the class of Pi be denoted
packets.                                                                   C(Pi ). Given a testing point Ptest ∈ Stest , the classifier
                                                                           guesses C(Ptest ) by computing the distance D(Ptest , Ptrain )
Non-simulatable, random: This includes Tor’s request                       for each Ptrain ∈ Strain . The algorithm then classifies Ptest
    order randomization defense.       Responding to                       based on the classes of the k closest training points.
    Panchenko’s attack, Tor developers decided to en-                          Despite its simplicity, the k-NN classifier has a number
    able pipelining on Tor and randomize pipeline size                     of advantages over other classifiers. Training involves
    and request orders [18]. The randomization was fur-                    learning a distance between pairs of points; the classi-
    ther increased after OSAD [19]. We test our attack                     fier could use a known (e.g. Euclidean) distance, though
    against the more randomized version that is built                      selecting the distance function carefully can greatly im-
    into Tor Browser Bundle 3.5.                                           prove the classification accuracy. Testing time is very
                                                                           short, with a single distance computation to each train-
Non-simulatable, deterministic: This includes por-
                                                                           ing point. Multi-modal sets can be classified accurately,
    tions of HTTPOS [16]. The HTTPOS defense is
                                                                           as the classifier would only need to refer to a single mode
    built into the client’s browser, allowing the client
                                                                           of each training set.
    to hide unique packet lengths by sending an HTTP
                                                                               The k-NN classifier needs a distance function d for
    range request strategically.
                                                                           pairs of packet sequences. The distance is non-trivial for
Simulatable, random: This includes traffic morph-                          packet sequences. We want the distance to be accurate
    ing [24], which allows a client to load a web                          on simple encrypted data without extra padding, but also
    page using a packet size distribution from a differ-                   accurate when defenses are applied that remove features
    ent page, and Panchenko’s background noise [17],                       from our available feature set. We therefore start with a
    where a decoy page is loaded simultaneously with                       large feature set F = { f1 , f2 , . . .}. Each feature is a func-
    the real page to hide the real packet sequence.                        tion f which takes in a packet sequence P and computes
Simulatable, deterministic: This includes packet                            f (P), a non-negative number. Conceptually, each feature
    padding, which is done on Tor, and BuFLO,                              is designed such that members of the same class are more
    presented and analyzed by Dyer et al. [6]. BuFLO                       likely to have similar features than members of different
    sends data at a constant rate in both directions                       classes. We give our feature set in Section 4.2. The dis-
    until data transfer ends. In this work, we will show                   tance between P and P is computed as:
    that defenses in this category can be made to be
    provably private,4 and we will show such a defense                                 d(P, P ) =     ∑ wi | fi (P) − fi (P )|
                                                                                                     1≤i≤|F|
    with a much lower overhead than BuFLO.
   3 Using a random procedure to learn D does not make D itself ran-          The weights W = {w1 , w2 , . . . , w|F| } are learned as in
dom.                                                                       Section 4.3, where we describe how the weights for un-
  4 BuFLO is not provably private on its own.                              informative features (such as one that a defense success-

                                                                       4
146 23rd USENIX Security Symposium                                                                                    USENIX Association
fully covers) are reduced. As weight learning proceeds,             • Initial packets. We also add the lengths of the first
the k-NN distance comes to focus on features that are                 20 packets (with direction) in the sequence as fea-
useful for classification.                                            tures.
   We tried a number of other distances, including the
edit distance used by Cai et al. [4] and OSAD, which                  Some feature sets, such as packet ordering, have vari-
they used to compute the kernel of SVMs. The results for          able numbers of features. We define a maximum number
using their distances on the k-NN classifier are similar to       of features for the set, and if the packet sequence does
those using the SVM. As we shall see in Section 5, using          not have this many features, we pad with a special char-
our proposed distance allows a significant improvement            acter (X) until it reaches the maximum number. Recall
in accuracy over these distances, with or without extra           that our distance is the weighted sum of absolute differ-
defenses.                                                         ences between features; let us denote the difference as
                                                                  d fi (P, P ). For each feature fi , if at least one of the two
                                                                  values is X, then we define d fi (P, P ) to be 0, such that
4.2    Feature set                                                the difference is ignored and does not contribute to the
                                                                  total distance. Otherwise, we compute the difference as
Our feature set is intended to be diverse. The construc-
                                                                  usual.
tion of the feature set is based on prior knowledge of how
                                                                      We treat all features equally. However, we note that
website fingerprinting attacks work and how defenses
                                                                  as the general features are amongst the strongest indica-
fail.
                                                                  tors of whether or not two packet sequences belong to the
   Our feature set includes the following:
                                                                  same mode of a page, we could use them with a search al-
                                                                  gorithm to significantly reduce training and testing time
  • General features. This includes total transmission            (i.e. reject pages with significantly different values in the
    size, total transmission time, and numbers of incom-          general feature without computing the whole distance).
    ing and outgoing packets.
                                                                      The total number of features is close to 4,000 (3,000
                                                                  of which are just for the unique packet lengths). If a
  • Unique packet lengths. For each packet length be-
                                                                  defense covers some features and leaves others open (e.g.
    tween 1 and 1500, and each direction, we include
                                                                  traffic morphing retains total transmission size and burst
    a feature which is defined as 1 if it occurs in the
                                                                  features), our algorithm should be successful in adjusting
    data set and 0 if it does not. This is similar to the
                                                                  weights to focus on useful features.
    algorithms used by Liberatore and Levine [14] and
                                                                      We design our attack by drawing from previous
    Herrmann et al. [10], where the presence of unique
                                                                  successful attacks, while allowing automatic defense-
    packet lengths is an important feature. These fea-
                                                                  breaking. In particular, we note that there exists a choice
    tures are not useful when packet padding is applied,
                                                                  of weights for which our attack uses a similar distance
    as on Tor.
                                                                  metric as the attacks proposed by Cai et al. [4] and Wang
  • Packet ordering. For each outgoing packet, we add,            and Goldberg [23], as well as the Jaccard coefficient
    in order, a feature that indicates the total number of        by Liberatore and Levine [14]. However, we will find
    packets before it in the sequence. We also add a              better choices of weights in the next subsection. We
    feature that indicates the total number of incoming           drew the inspiration for some features from the work
    packets between this outgoing packet and the previ-           by Panchenko et al. [17], in particular, those concern-
    ous one. This captures the burst patterns that helped         ing the start of the page (which may indicate the size of
    Cai et al. achieve their high accuracy rates.                 the HTML document). We note that unlike Panchenko
                                                                  et al. [17], we do not add the entire packet sequence as
  • Concentration of outgoing packets. We count the               features.
    number of outgoing packets in non-overlapping
    spans of 30 packets, and add that as a feature. This          4.3    Weight initialization and adjustment
    indicates where the outgoing packets are concen-
    trated without the fineness (and volatility) of the           In this subsection, we describe how we learn
    packet ordering features above.                               w1 , w2 , . . . , w|F| , the weights that determine our distance
                                                                  computation. The values of these weights determine the
  • Bursts. We define a burst of outgoing packets as a            quality of our classifier. We learn the weights using an
    sequence of outgoing packets, in which there are no           iterative, local weight-learning process as follows. The
    two adjacent incoming packets. We find the maxi-              weight-learning process is carried out for R rounds (we
    mum and mean burst length, as well as the number              will see how the choice of R affects the accuracy later).
    of bursts, and add them as features.                          For each round, we focus on a point Ptrain ∈ Strain (in or-


                                                              5
USENIX Association                                                                     23rd USENIX Security Symposium 147
der), performing two steps: the weight recommendation                       points which are already well-classified in each iter-
step and the weight adjustment step.                                        ation have less of an impact on the weights. The ad-
   Weight recommendation. The objective of the                              dition of 0.2 indicates that even perfectly classified
weight recommendation step is to find the weights that                      points still have some small impact on the weights
we want to reduce. During the weight recommendation                         (so that the weight adjustment will not nullify their
step, the distances between Ptrain and all other P ∈ Strain                perfect classification).
are computed. We then take the closest kreco points
(for a parameter kreco ) within the same class Sgood =                   Both of these above changes improved our classifica-
{P1 , P2 , . . .} and the closest kreco points within all other       tion accuracy. We achieved our best results with kreco =
classes Sbad = {P1 , P2 , . . .}; we will focus only on those       5.
points.                                                                  We initialized the weight vector W randomly by
   We denote d(P, S), where S is a set of packet se-                  choosing a random value for each wi uniformly between
quences, as the sum of the distances between P and each               0.5 and 1.5. Adding randomness gave us a chance of
sequence in S.                                                        finding better solutions than a deterministic algorithm
   Let us denote                                                      as we could avoid local maxima that bind our classifier
                                                                      away from the global maximum.
       dmaxgoodi = max({d fi (Ptrain , P)|P ∈ Sgood })                   Note that we are not claiming these particular choices
                                                                      of parameters and constants yield an optimal attack, and
  For each feature, we compute the number of relevant                 further work may yet uncover improved attacks against
bad distances, nbadi , as                                             defenses without provable privacy guarantees.

     nbadi = |{P ∈ Sbad |d fi (Ptrain , P ) ≤ dmaxgoodi }|
                                                                      5     Attack evaluation
   This indicates how bad feature fi is in helping to dis-
                                                                      Our attack is specifically designed to find gaps in de-
tinguish Sbad from Sgood . A large value of nbadi means
                                                                      fenses, and in this section we will demonstrate its effi-
that feature fi is not useful at distinguishing members of
                                                                      cacy with experimentation on real web traffic. We will
Ptrain ’s class from members of other classes, and so the
                                                                      first begin by showing the effectiveness of our scheme
weight of fi should be decreased; for example, features
                                                                      against Tor with its default packet padding and order ran-
perfectly covered by a defence (such as unique packet
                                                                      domization defense in Section 5.1. This setting is a good
lengths in Tor) will always have nbadi = kreco , its maxi-
                                                                      standard basis of comparison as WF is a threat to the
mum possible value. Conversely, small values of nbadi
                                                                      privacy guarantees provided by Tor, and several of the
indicate helpful features whose weights should be in-
                                                                      latest state-of-the-art attacks are designed for and evalu-
creased.
                                                                      ated on Tor. We will see that our attack performs better
   Weight adjustment.             We adjust the weights
                                                                      than the best known attacks. The parameters of our at-
to keep d(Ptrain , Sbad ) the same while reduc-
                                                                      tack can be modified to decrease the false positive rate at
ing d(Ptrain , Sgood ).    Then, for each i such that
                                                                      the cost of decreasing the true positive rate, and we ex-
nbadi = min({nbad1 , nbad2 , . . . , nbad|F| }), we reduce
                                                                      amine the tradeoff in Section 5.2. Then, we show that our
the weight by ∆wi = wi · 0.01. We then increase all
                                                                      attack is also more powerful than known attacks on vari-
weights wi with nbadi = min({nbad1 , nbad2 , . . . , nbad|F| })
                                                                      ous known and published defenses in Section 5.3, with a
equally such that d(Ptrain , Sbad ) remains the same.                 number of defenses shown to be nearly completely inef-
   We achieved our best results with two more changes                 fective against our scheme.
to the way weights are reduced, as follows:

  • We further multiply ∆wi = wi · 0.01 by nbadi /kreco .             5.1    Attack on Tor
    Therefore, a weight with greater nbadi (a less infor-
    mative weight) will be reduced more.                              We validate our attack in two experimental settings to
                                                                      demonstrate the effectiveness of our attack on Tor.
  • We also decrease ∆wi if Ptrain is already well classi-               First, we perform experiments in an open-world ex-
    fied. Nbad is defined as:                                         perimental setting. Even though the number of pages in
                                                                      the world wide web is far too large for us to train on, we
         Nbad = |{P ∈ Sbad |d(Ptrain , P ) ≤ dmaxgood }|            can achieve realistic results by limiting the objective of
                                                                      the attacker. Here, the attacker wants to decide whether
     Specifically, we multiply ∆wi by 0.2 + Nbad /kreco .             or not a packet sequence comes from a monitored page;
     Nbad can be considered an overall measure of how                 additionally, for monitored pages, the attacker aims to
     poorly the current point is classified, such that                identify the page. We denote the non-monitored page set

                                                                  6
148 23rd USENIX Security Symposium                                                                            USENIX Association
                                                                                False Positive Rate
that the attacker uses for training as C0 , and the effects of                                                      1
varying its size will be tested in evaluation. This open-
                                                                                                                   0.1
world experimental setting gives us realistic results for
plausible attackers.                                                                                              0.01
                                                                                                                             k=5, |C0| = 5000
   We use a list of 90 instances each of 100 sensitive                                                                                           k=2, |C0| = 5000

pages as well as 1 instance each of 5,000 non-monitored                                                          0.001
                                                                                                                         0.6 0.65 0.7 0.75 0.8 0.85 0.9 0.95 1
pages. We note that this problem is more difficult for
                                                                                                                                   True Positive Rate
the attacker than any that has been evaluated in the field,
as other authors have evaluated their schemes on either                        Figure 1: Performance of our attack while varying the
strictly closed-world settings or very small open-world                        attack parameters k and |C0 |. Only the y-axis is logarith-
problems (a few monitored pages). It is a realistic goal                       mically scaled.
for the attacker to monitor a large set of pages in the
open-world setting.                                                                                                  1
   Our list of 100 monitored pages was compiled from a                                                             0.8




                                                                                                      Accuracy
list of blocked web pages from China, the UK, and Saudi                                                            0.6                          TPR
Arabia. These include pages ranging from adult content,                                                            0.4                          FPR
torrent trackers, and social media to sensitive religious                                                          0.2
and political topics. We selected our list of 5,000 non-                                                             0
monitored pages from Alexa’s top 10,000 [1], in order,                                                                   0     1000 2000 3000 4000 5000
excluding pages that are in the list of monitored pages                                                                      Number of non-monitored pages
by domain name. The inherent differences between the
above data sets used for training and testing assist classi-                   Figure 2: True Positive Rate and False Positive Rate
fication, just as they would for a realistic attacker. Page                    changes in OSAD [23] as the open set size increases.
loading was done with regular circuit resetting, no caches                     There is almost no change in either value after |C0 | >
and time gaps between multiple loads of the same page                          2500.
(as suggested by Wang and Goldberg [23]), such that the
attacker will not use the same circuits as the target client,                  ular monitored page, and the False Positive Rate (FPR),
or collect its data at the same time. We used iMacros                          which is the probability that a non-monitored page is in-
8.6.0 on Tor Browser 3.5.1 to collect our data.                                correctly identified as being monitored.6 We can achieve
   Training the k-Nearest Neighbour classifier is required                     TPR 0.85 ± 0.04 for FPR 0.006 ± 0.004, or respectively
to learn the correct weights. We learn the weights by                          TPR 0.76 ± 0.06 for FPR 0.001 ± 0.001.
splitting part of the training set for weight adjustment and                      We compare these values to OSAD, which we apply
evaluation as above. We perform weight adjustment for                          to our data set as well, and show the results in Figure 2.
R = 6000 rounds on 100 pages and 60 instances each,                            Increasing the number of non-monitored pages |C0 | in-
which means that every instance is cycled over once.                           creases TPR and reduces FPR. After |C0 | > 2500, we
Then, accuracy is computed over the remaining 30 in-                           could not see a significant benefit in adding more ele-
stances each, on which we perform all-but-one cross val-                       ments. At |C0 | = 5000, the classifier achieves a TPR of
idation. The use of cross validation implies that the at-                      0.83 ± 0.03 and a FPR of 0.06 ± 0.02.
tacker will never train on the same non-monitored pages
                                                                                  We see that OSAD cannot achieve FPR values nearly
that the client visits.
                                                                               as low as ours, and it may be considered impractical for
   For our attack, we decided that a point should be clas-
                                                                               the attacker to monitor large sets in the open-world set-
sified as a monitored page only if all k neighbours agree
                                                                               ting with the old classifier, especially if the base inci-
on which page it is, and otherwise it will be classified as
                                                                               dence rate is low. For example, if the base incidence rate
a non-monitored page. This helped reduce false positives
                                                                               of the whole sensitive set is 0.01 (99% of the time the
at a relatively small cost to the true positives. We vary the
                                                                               client is visiting none of these pages), and our new clas-
number of neighbours k from 1 to 15 as well as the num-
                                                                               sifier claims to have found a sensitive site, the decision
ber of non-monitored training pages |C0 | used from 10 to
                                                                               is correct at least 80% of the time, the rest being false
5000,5 and we show our results in Figure 1. We measure
                                                                               positives. For Wang and Goldberg’s classifier, the same
the True Positive Rate (TPR), which is the probability
                                                                               value would be about 12%. The difference is further ex-
that a monitored page is correctly classified as that partic-
                                                                               acerbated with a lower base incidence rate, which may
    5 We note that the choice of |C | does not represent a world with          be realistic for particularly sensitive web sites.
                                    0
fewer pages available to the client—it is the attacker’s decision on how
much he wishes the bias towards non-monitored sites to be. The visited             6 If a monitored page is incorrectly classified as a different moni-

sites are always drawn from Alexa’s top 10,000.                                tored page or as a non-monitored page, it is a false negative.


                                                                           7
USENIX Association                                                                                                              23rd USENIX Security Symposium 149
                                                                                                      False Positive Rate
                       True Positive Rate
                                              0.8                                                                              1
                                              0.7
                                                                                                                              0.1
                                                                                                                                                            k=2
                                              0.6
                                                                                                                             0.01                     k=6
                                              0.5
                                              0.4                                                                           0.001
                                                    0    400      800            1200     1600                                      0.5   0.6       0.7     0.8    0.9   1
                                                                Rounds                                                                          True Positive Rate

Figure 3: TPR when varying the number of rounds used                                                 Figure 5: Best results for FPR vs. TPR while varying
for training our attack, with k = 5 and |C0 | = 500. FPR is                                          number of neighbours k. |C0 | = 500.
not shown because there is very little change over time.
                                                                                                     for these experiments. Although the closed-world set-
 False Positive Rate




                                               1                                                     ting does not carry the same realistic implications as the
                                              0.1                                                    open-world setting, it focuses attention on the ability of
                                                                                                     the classifier to distinguish between pages and it has been
                                                                             |C0| = 500
                                             0.01              |C0| = 3000                           a useful basis of comparison in the field. We also tested
                                                                                                     our classifier on the data set used by Wang and Goldberg
                                            0.001                                                    to facilitate a more direct comparison, and the accuracy
                                                0.845   0.85 0.855 0.86 0.865             0.87
                                                                                                     was 0.95 ± 0.02 compared to 0.91 ± 0.06 for OSAD and
                                                            True Positive Rate
                                                                                                     0.88 ± 0.03 for Cai et al. We also compared them on our
Figure 4: Results for FPR vs. TPR while varying bias                                                 new data set, and the accuracy was 0.91 ± 0.03 for ours
towards non-monitored data set C0 . k = 2.                                                           and 0.90 ± 0.02 for OSAD. There appears to be no sig-
                                                                                                     nificant difference in the closed-world scenario, although
   The training and testing time for our classifier (weight                                          the superior accuracy of our classifier under the realistic
adjustment) is very small compared to previous state-of-                                             open-world scenario is clear.
the-art classifiers. The number of rounds, R, determines
the quality of our weights. We show in Figure 3 how
the true positive rate changes with R on |C0 | = 500 non-                                            5.2                    Training confidence
monitored sites and k = 5 neighbours. We see that the
accuracy levels off at around 800 rounds, and did not                                                The numbers for true and false positive rates as shown
drop up to 30,000 rounds.                                                                            above may not be desirable for some cases. The optimal
   The weight training time scales linearly with R and                                               numbers depend on the expected base rate of the moni-
also scales linearly with the number of instances used                                               tored activity as well as the application intended by the
for weight training. The training time is around 8 ·                                                 attacker. Parameters of our attack can be adjusted to in-
10−6 · |Strain | · R CPU seconds, measured using a com-                                              crease true positive rate at the cost of increasing false
puting cluster with AMD Opteron 2.2 GHz cores. This                                                  positive rate, or vice versa.
amounts to around 120 CPU seconds for 1000 rounds in                                                    We can vary the size of the non-monitored training
our set with |C0 | = 5000. This can be compared to around                                            page set to affect accuracy as our implementation of the
1600 CPU hours on the same data set using OSAD and                                                   k-Nearest Neighbour classifier is susceptible to bias to-
500 CPU hours using that of Cai et al. Training time                                                 wards larger classes. We fix the number of neighbours at
also scales quadratically with the number of training in-                                            k = 2, vary the number of non-monitored training pages
stances with these previous classifiers.                                                             |C0 | from 10 to 5000 and show the results in Figure 4.
   The testing time amounts to around 0.1 CPU seconds                                                   We can also vary k, the number of neighbours. We
to classify one instance for our classifier and around 800                                           fix the number of non-monitored pages, |C0 |, at 500, and
CPU seconds for OSAD, and 450 CPU seconds for Cai et                                                 vary k from 1 to 15, showing the results in Figure 5. De-
al. The testing time per instance scales linearly with the                                           creasing |C0 | and decreasing k each increases both true
number of training elements for all three classifiers. We                                            positives and false positives.
can reduce the training and testing time for our classifier                                             We can see that varying the number of neighbours
further by around 4 times if we remove the unique packet                                             used is much more important for determining TPR than
length features, which are useless for Tor cells.                                                    varying the size of C0 , the set of non-monitored pages.
   We also perform experiments on the closed-world ex-                                               In fact, almost all of the graph in Figure 1 can be drawn
perimental setting. Under the closed-world experimen-                                                only by varying k with |C0 | = 5000, suggesting that it is
tal setting, the client does not visit non-monitored pages.                                          advantageous for the attacker to have a large number of
We use the same data set of sensitive pages as above                                                 non-monitored training pages.

                                                                                                 8
150 23rd USENIX Security Symposium                                                                                                                           USENIX Association
                                                                                 and collects training instances on which the defense is
Table 1: Accuracy of our attack on various defenses.
                                                                                 applied; this is realistic as the above defenses are all dis-
Closed-world simulation is used to enable comparison
                                                                                 tinctive and identifiable.
with previous known results.
                                                                                    We apply our attack, and show the results in Table 1.
                                         Bandwidth                               This can be compared to a minimum accuracy of 0.01 for
             Defense               Accuracy                                      random guessing. We see that even with large overhead,
                                          overhead
                                                                                 the defenses often fail to cover the page, and our attack
      Traffic morphing [24] 0.82 ± 0.06 50% ± 10%
                                                                                 always performs significantly better than random guess-
      HTTPOS split [16]     0.86 ± 0.03 5.0% ± 0.6%                              ing. For BuFLO, our particular data set gave a larger
      Decoy pages [17]      0.30 ± 0.06 130% ± 20%                               overhead than previous work [22] because most packet
      BuFLO [6]             0.10 ± 0.03 190% ± 20%                               sequences could be loaded within 10 seconds and there-
                                                                                 fore required end-of-sequence padding to 10 seconds. In
5.3     Attack on Other Defenses                                                 particular, traffic morphing and HTTPOS split have al-
                                                                                 most no effect on the accuracy of our attack.
Our attack is specifically designed to break WF defenses
that leave features open for classification. The analysis in
previous sections was performed on Tor packets, which                            6     Defense
already uses padding, pipelining and order randomiza-
tion. We add further defenses on top of Tor’s defenses.                          In this section, we design a provably private defense—
The list of defenses we evaluate in this section are as fol-                     a defense for which there exists an upper bound on the
lows:                                                                            accuracy of any attack (given the data set). As Tor is
                                                                                 bandwidth-starved [21], we attempt to give such a de-
   • Traffic morphing [24]. Traffic morphing maps                                fense with the minimum bandwidth cost. This is an ex-
     packet sizes from one site to a packet distribution                         tension of the idea proposed by Wang and Goldberg [22]
     drawn from another site, in an attempt to mimic the                         for their defense, Tamaraw.
     destination site. In our implementation, each site at-                         In Section 6.1, we first show how such an upper bound
     tempted to mimic google.com as it is reasonable                             can be given for simulatable, deterministic defenses—
     to assume that the client wishes to mimic the most                          that is, this class of defenses can be made to be provably
     popular page.                                                               private. We then show in Section 6.2 that the optimal de-
                                                                                 fense strategy (lowest bandwidth cost) in such a class is
   • HTTPOS split [16]. Although HTTPOS has a large
                                                                                 to compute supersequences over sets of packet sequences
     number of features, one of its core features is a ran-
                                                                                 (anonymity sets). We try to approximate the optimal de-
     dom split on unique packet lengths by cleverly uti-
                                                                                 fense strategy, by describing how these sets can be cho-
     lizing HTTP range requests. We analyze HTTPOS
                                                                                 sen in Section 6.3, and how the supersequence can be
     by splitting incoming packets and also padding out-
                                                                                 estimated in Section 6.4.
     going packets.7

   • Panchenko’s decoy pages [17]. As a defense against                          6.1     Attacker’s upper bound
     their own attack, Panchenko et al. suggested that
     each real page should be loaded with a decoy page.                          We describe how we can obtain an upper bound on the
     We chose non-monitored pages randomly as decoy                              accuracy of any attack given a defended data set. The at-
     pages.                                                                      tacker, given an observation (packet sequence) p, wishes
                                                                                 to find the class it belonged to, C(p).
   • BuFLO [6]. Maximum size packets are sent in                                    To calculate the maximum success probability given
     both directions at equal, constant rates until the                          the testing set, we assume the greatest possible advantage
     data has been sent, or until 10 seconds have passed,                        for the attacker. This is where the attacker is allowed
     whichever is longer.                                                        to train on the testing set.8 In this case the attacker’s
                                                                                 optimal classification strategy is to record the true class
   We implement these defenses as simulations. For
                                                                                 of each observation, (p,C(p)). The attacker will only
Panchenko’s noise and BuFLO we implement them us-
                                                                                 ever make an error if the same observation is mapped to
ing Tor cells as a basic unit in order to reduce unneces-
                                                                                 several different classes, which are indistinguishable for
sary overhead from these defenses when applied on Tor.
                                                                                 the observation. We denote the possibility set of p as the
We assume that the attacker is aware of these defenses
                                                                                 multiset of classes with the same observation p, Q(p) =
    7 HTTPOS has been significantly modified by its authors since their

original publication, in part due to the fact that Cai et al. were able to          8 Our testing set is in fact a multiset as repeated observation-class

break it easily [4].                                                             pairs are possible.


                                                                             9
USENIX Association                                                                                       23rd USENIX Security Symposium 151
{C1 ,C2 , . . .} (C(p) ∈ Q(p)), where the occurrence count           a set of packet sequences the overhead is B(D(S)) =
of a class is the same as in the testing set with observation        ∑ p∈S |D(p)| − ∑ p∈S |p|
                                                                                              . Given S, we want to identify D
p.                                                                            ∑ p∈S |p|
   The attacker’s optimal strategy is to find the class Cmax         such that B(D(S)) is minimal.
that occurs the most frequently for the same observation                For each packet sequence p1 , let us consider the set of
p, and during classification the attacker will return Cmax           packet sequences that map to the same observation after
for the observation p. This will induce an accuracy value            the defense is applied, which we call the anonymity set
upon p:                                                              of p1 . We write the set as A(p1 ) = {p1 , p2 , . . . , pE }; i.e.
                                                                     D(p1 ) = D(pi ) for each i. The shortest D(p1 ) that sat-
                       |{C ∈ Q(p)|C = Cmax }|
           Acc(p) =                                                  isfies the above condition is in fact the shortest common
                              |Q(p)|                                 supersequence, written as fscs (A(p1 )) = D(pi ) for each
   This method returns the best possible accuracy for a              1 ≤ i ≤ E.
given testing set as it makes the lowest possible error for             In other words, the optimal solution is to apply the
observations mapping to multiple classes.                            shortest common supersequence function to anonymity
   Cai et al. [3] have proposed two different ways to de-            sets of input sequences. This defense can be applied with
note the overall accuracy of a set of packet sequences:              the cooperation of a proxy on the other side of the adver-
                                                                     sary; on Tor, for example, this could be the exit node of
  • Non-uniform accuracy. This is the mean of accura-                the circuit. However, finding such an optimal solution
    cies Acc(p) for p ∈ Stest .                                      requires solving two hard problems.

  • Uniform accuracy. This is the maximum accuracy                   Anonymity set selection. First, given the set of all pos-
    Acc(p) for p ∈ Stest                                                sible packet sequences, we want to group them into
                                                                        anonymity sets such that, for a given bound on at-
   Tamaraw can only achieve non-uniform accuracy. In                    tacker accuracy, the overhead will be minimized.
this work, we design a defense for uniform accuracy, but
the defense can be extended to other notions as well.                The shortest common supersequence (SCS) problem.
While we will use different sets to train our defense and                Then, we must determine the SCS of all the packet
test it on client behaviour, we will say that the defense                sequences in the anonymity set. This is in general
has a maximum uniform accuracy as long as it does so                     NP-hard. [13]
on the training set (as it is always possible to construct
a testing set on simulatable, deterministic defenses on              In the next two sections we describe our solutions to the
which at least one page has an accuracy of 1). A defense             above problems.
that achieves a maximum uniform accuracy of Au auto-
matically does so for non-uniform accuracy, but not vice-            6.3    Anonymity set selection
versa. In the following we work with a uniform prior on
a fixed-size testing set to facilitate comparison with pre-          We note that the client is not always able to choose
vious work.                                                          anonymity sets freely. For example, the client cannot
                                                                     easily know which anonymity set a page load should be-
                                                                     long to before seeing the packet sequence. While the
6.2    Optimal defense                                               client can gain information that assists in making this de-
In this section, we show the bandwidth-optimal simu-                 cision (the URL, previous page load data, training data,
latable, deterministic defense. As we work with Tor                  information about the client network, the first few pack-
cells, in the following a packet sequence can be con-                ets of the sequence, etc.), the mere storage and usage of
sidered a sequence of −1’s and 1’s (downstream and                   this information carries additional privacy risks. In par-
upstream packets respectively), which is useful for hid-             ticular, the Tor Browser keeps no disk storage (including
ing unique packet lengths [22]. We say that sequence                 no cache except from memory), so that storing extrane-
q is a subsequence of sequence p (or that p is a su-                 ous information puts the client at additional risk. In this
persequence of q) if there exists a set of deletions of              section, we describe how realistic conditions impose re-
−1 and 1 in p to make them equal (maintaining or-                    strictions on the power of the client to choose anonymity
der). With abuse of notation, we say that if S is the in-            sets.
put packet sequence multiset, then D(S) = {D(p)|p ∈ S}                  We formalize this observation by imposing additional
denotes the output packet sequence multiset after appli-             limits on anonymity set selection in the defense D trained
cation of the defense. The cost (bandwidth overhead)                 on testing set Stest . We define four levels of information
                         |D(p)| − |p|                                for a client applying a simulatable, deterministic website
of D(p) is B(D(p)) =                  , and similarly for            fingerprinting defense:
                             |p|

                                                                10
152 23rd USENIX Security Symposium                                                                              USENIX Association
Table 2: Relationship between different levels of information and how we train and test our supersequences. Under
“Supersequence”, we describe what supersequences we would use at this level of information. Clustering is done if
we want multiple supersequences.
        Information               Supersequence                             Training and Testing
        No information            One supersequence                         Different sites, instances
        Sequence end information One supersequence, stopping points         Different sites, instances
        Class information         Multiple supersequences, stopping points Same sites, different instances
        Full information          Multiple supersequences                   Same sites, instances

 1. No information. The client has no information at all           points. We find the stopping points by selecting the earli-
    about the packet sequence to be loaded. This means             est points where our maximum uniform accuracy would
    A(p) = Stest , that is to say all sequences map to a           be satisfied. All packet sequences sent under this defense
    single anonymity set.                                          will be padded to the next stopping point. This is similar
                                                                   to a strategy suggested by Cai et al. [3]
 2. Sequence end information. The client knows when                   If we have class-level information, we need to per-
    the sequence has ended, but this is the only infor-            form two levels of anonymity set selection. On the
    mation the client gets about the packet sequence.              first level, we cluster the packet sequences within each
    This means that D can only vary in length; for any             class to decide which supersequence the client should
    p, q, such that |D(p)| ≥ |D(q)|, then the first |D(q)|         use. For this level of clustering, we first decide on the
    packets of D(p) are exactly D(q), that is, we say              number of supersequences in the set. Then, we ran-
    that D(q) is a prefix of D(p).                                 domly choose a number of “roots” equal to this num-
                                                                   ber of supersequences. We cycle over every root, as-
 3. Class-specific information. Only the identity of the
                                                                   signing the closest packet sequence that has not yet been
    page is known to the client, and the client has loaded
                                                                   classified. For this we need to define a distance be-
    the page before with some information about the
                                                                   tween each pair of packet sequences p and q. Suppose
    page, possibly with realistic offline training. The
                                                                   p and q are the first min(|p|, |q|) packets of p and q
    client cannot distinguish between different packet
                                                                   respectively. The distance between p and q is given as
    sequences of the same page (even though the page
                                                                   2| fscs (p , q )| − |p | − |q |. We use this distance to mea-
    may be multi-modal). This is the same as the above
                                                                   sure how different two packet sequences are, without
    restriction but only applied if p and q are packet se-
                                                                   considering their respective lengths, which would be ad-
    quences from the same web page.
                                                                   dressed by the second level. On the second level, we find
 4. Full information. No restrictions are added to D.              stopping points, with the same strategy as that used un-
    The client has prescient information of the full               der sequence end information. The use of an additional
    packet sequence. Beyond class-specific informa-                first level of clustering reduces the number of stopping
    tion, the client can gain further information by look-         points available for use, given a fixed number of clusters,
    ing into the future at the contents of the packet se-          so that using too many clusters may in fact have a higher
    quence, learning about her network, and possibly               bandwidth overhead (see Section 7).
    using other types of extraneous information. This                 For full information, we perform clustering with the
    level is not generally of practical interest except for        distance between two packet sequences p and q as
    serving as a bound for any realistic defense.                  2| fscs (p, q)| − |p| − |q|. Here we select roots with evenly
                                                                   spread out lengths.
   We use clustering, an unsupervised machine learning
technique, to find our anonymity sets. We show how the             6.4    SCS approximation
above levels of information affect how supersequences
will be computed and how testing needs to be performed             For the SCS of two packet sequences there is an exact
in Table 2.                                                        solution that can be found using dynamic programming;
   Optimality under the above levels of informa-                   however, the SCS of multiple sequences is in general NP-
tion requires the computation of supersequences over               hard [13].
anonymity sets. If we have only sequence end informa-                 We present a simple algorithm that approximates a
tion, there is only one supersequence, and we do not need          solution to the shortest common supersequence prob-
to perform clustering. Instead, possible outputs of the de-        lem. To approximate fscs ({p1 , p2 , . . . , pn }), we define
fense simply correspond to a prefix of the one superse-            a counter for each packet sequence c1 , c2 , . . . , cn , which
quence, terminating at one of a specified set of stopping          starts at 1. We count the number of sequences for which


                                                              11

USENIX Association                                                                      23rd USENIX Security Symposium 153
    Bandwidth overhead (%)
                                                                                              We implemented our defenses with different levels of
                                          150
                                                               Seq. end                   information as seen above. We used the same data set
                                          120
                                                                  Class                   used to test our attacks—100 sites, 30 instances each—
                                           90                       Full                  and attempted to protect them. The defender attempts to
                                           60
                                                                                          achieve a given maximum uniform accuracy (by deter-
                                           30
                                                                                          mining the number of clusters or stopping points). We
                                            0
                                                0    0.05     0.1     0.15     0.2        show the results in Figure 6. For class-level information,
                                                                                          we used two supersequences and N/2 stopping points
                                                    Maximum uniform accuracy
                                                                                          in each supersequence. We can see the full information
Figure 6: Bandwidth overhead for three levels of in-                                      setting has a much lower bandwidth overhead than se-
formation: sequence end information (Seq. end), class-                                    quence end information or class-level information. With
specific information (Class), and full information (Full).                                our clustering strategy, using two supersequences un-
Using no information results in a bandwidth overhead                                      der class-level information is only sometimes beneficial
that is much higher than that shown in the graph.                                         for the overhead. It is possible that a clever clustering
                                                                                          strategy for class-level information could achieve lower
                 Bandwidth overhead (%)




                                                                                          bandwidth overheads.
                                          90                                                  For class-level information, we used two superse-
                                          80                                              quences as above. It is interesting to know if increas-
                                                                                          ing the number of supersequences (and correspondingly
                                          70
                                                                                          lowering the number of stopping points) will give better
                                          60                                              bandwidth overhead. In other words, we want to know if
                                          50                                              it is worth suffering greater overhead for padding to stop-
                                                0     2     4      6     8     10         ping points to have more finely tuned supersequences.
                                                    Number of Supersequences              We fix the target maximum uniform accuracy to 20%.
                                                                                          The results are shown in Figure 7. We can see that using
Figure 7: Bandwidth overhead for class-specific infor-
                                                                                          more than two supersequences only increases the band-
mation if more than two supersequences are used, at 20
                                                                                          width overhead. It is possible that if the defender can tol-
clusters. The number of stopping points available de-
                                                                                          erate a higher maximum uniform accuracy, then it would
creases, but the total number of supersequences times the
                                                                                          be optimal to use more than two supersequences.
number of stopping points is always at least 20.
                                                                                              Finally, we apply our new attack to a class-level de-
                                                                                          fense with a maximum uniform accuracy of 0.1, where
the ci -th element of pi is an outgoing packet. If the num-                               the overhead is approximately 59% ± 3%. We achieved
ber exceeds n/4, we append an outgoing packet to the                                      an accuracy of 0.068 ± 0.007. This can be compared to
common supersequence, and increment all ci for which                                      Table 1, where we can see that the attack achieved an ac-
the ci -th element of pi is an outgoing packet by 1. Else,                                curacy of 0.30 ± 0.06 for Panchenko’s decoy pages with
we append an incoming packet, and increase the cor-                                       an overhead of 130% ± 20% and an accuracy of 0.10 ±
responding counts by 1. We do this iteratively until                                      0.03 for BuFLO with an overhead of 190% ± 20%. Fur-
each counter ci becomes |pi | + 1, and the algorithm ter-                                 thermore, we do not know if there exist better attacks for
minates. The choice of n/4 is because for web page                                        these defenses, but we know that no attack can achieve a
loading, there are fewer outgoing packets than incom-                                     better accuracy than 0.1 on our defense (using the same
ing packets, and this choice reduces our overhead signif-                                 data set). We also compared our work with Tamaraw,
icantly.                                                                                  which had a 96% ± 9% overhead on the same data set for
   We note that it is easy to construct cases where the                                   non-uniform accuracy. Our attack achieved an accuracy
above algorithm performs very poorly. In fact, it is                                      of 0.09 ± 0.02, although highly non-uniformly. Indeed,
known that any polynomial-time approximation algo-                                        on 16 sites out of 100, the accuracy of the attacker was
rithm of shortest common supersequences cannot have                                       more than 0.2, and the most accurately classified site had
bounded error [13].                                                                       accuracy 0.6.


                                                                                          8     Discussion
7           Defense evaluation
                                                                                          8.1    Realistically applying an attack
In this section we evaluate our defense for bandwidth
overhead, as well as its effectiveness in stopping our new                                Like other website fingerprinting works in the field, we
attack.                                                                                   make the assumption that the attacker has an oracle that


                                                                                     12
154 23rd USENIX Security Symposium                                                                                               USENIX Association
can answer whether or not a particular sequence is gen-            information on a web page, or that she has just posted a
erated from a single page load, and that the user does not         sensitive or incendiary article on a blog, and it is known
prematurely halt the page load or perform other types of           that this whistleblower is likely to use Tor. The agency
web activity. Here we discuss a few strategies to deal             will only need to search amongst Tor streams in the last
with possible sources of noise when applying website               few minutes within the nation (or a smaller local area).
fingerprinting to the real world.                                  As Tor streams are easily identifiable [7], the number of
   The attacker can use a number of signals to identify            Tor users at any given moment is small enough for our
the start of a packet sequence. We found that the start of         accurate attack to lead to the capture of a Tor-using dis-
a packet sequence generally contains around three times            sident. This strongly suggests that some sort of defense
more outgoing packets than the rest of the sequence. If            is necessary to protect the privacy of web clients.
the user is accessing a page for which she does not have
a current connection (i.e. most likely the user is visit-
                                                                   8.3     Reproducibility of our results
ing a page from another domain), then the user will al-
ways send one or two outgoing connections (depending               To ensure reproducibility and scientific correctness, we
on the browser setting) to the server, followed by accep-          publish the following: 9
tance from the server, followed by a GET request from
the main page, and then by data from the server. This                  • The code for our new attack. This includes our fea-
particular sequence could be identifiable.                               ture set, parameters used for our weight learning
   Unfortunately for Tor users, website fingerprinting is                process, and a number of weight vectors we learned
made easier due to a number of design decisions. On                      which succeeded at classification against specific
Tor, users are discouraged from loading videos, using                    defenses, including the Tor data set.
torrents, and downloading large files over Tor, which are
types of noise that would interfere with website finger-               • The code for our new defense. This includes the
printing. It is hard to change user settings on the Tor                  clustering strategy and the computation for stop
Browser; the configuration file is reset every time the                  points, as well as the supersequences we eventually
Tor Browser is restarted, which implies that different                   used to achieve the results in this paper.
Tor users have similar browser settings. As there is no
                                                                       • Our implementations of known attacks and de-
disk caching, Tor users have to log in every time the Tor
                                                                         fenses, which we compared and evaluated against
Browser is restarted before seeing personalized pages.
                                                                         ours.
For example, Facebook users on Tor must go through the
front page, which has no variation and is easily identifi-             • The data sets we used for evaluation. This includes
able. This is meant to preserve privacy from server-side                 the list of monitored and non-monitored sites we
browser fingerprinting attacks, but they also make web-                  visited over Tor, and the TCP packets we collected
site fingerprinting easier.                                              while visiting those sites and which we processed
                                                                         into Tor cells. We also include the feature vectors
8.2    Realistic consequences of an attack                               we computed over this data set.

Here we discuss how our attack can be used realistically
to break the privacy of web users. Our attack is not all-          9     Conclusion
powerful; it is not likely to find a single sensitive page
access among millions without error. The quality of the            In this work, we have shown that using an attack which
results depends on the base incidence rate of the client’s         exploits the multi-modal property of web pages with the
access. With our classifier, if an attacker wishes to iden-        k-Nearest Neighbour classifier gives us a much higher
tify exactly which of a set of 100 pages a client is vis-          accuracy than previous work. We use a large feature
iting, and she almost never visits those pages (less than          set and learn feature weights by adjusting them based on
0.1% of page visits), then false alarms will overwhelm             shortening the distance towards points in the same class,
the number of true positives. We note that many sensi-             and we show that our procedure is robust. The k-NN
tive pages have high rates of incidence as they are within         costs only seconds to train on a large database, com-
Alexa’s top 100 (torrent sites, adult sites, social media),        pared to hundreds of hours for previous state-of-the-art
especially if the client feels it necessary to use Tor.            attacks. The attack further performs well in the open-
   We envision our attack as a strong source of informa-           world experiments if the attacker chooses k and the bias
tion that becomes more powerful with the use of other or-          towards non-monitored pages properly. Furthermore, as
thogonal sources of information. For instance, a govern-             9 They can be found at https://crysp.uwaterloo.ca/

ment agency observes that a whistleblower has released             software/webfingerprint/


                                                              13
USENIX Association                                                                     23rd USENIX Security Symposium 155
the attack is designed to automatically converge on un-            [7] D. Fifield, N. Hardison, J. Ellithorpe, E. Stark,
protected features, we have shown that our attack is pow-              D. Boneh, R. Dingledine, and P. Porras. Evading
erful against all known defenses.                                      censorship with browser-based proxies. In Privacy
   This indicates that we need a strong, provable defense              Enhancing Technologies, pages 239–258, 2012.
to protect ourselves against ever-improving attacks in the
field. We identify that the optimal simulatable, determin-         [8] Y. Gilad and A. Herzberg. Spying in the Dark: TCP
istic defense is one with supersequences computed over                 and Tor Traffic Analysis. In Privacy Enhancing
the correct anonymity sets. We show how to construct a                 Technologies, pages 100–119. Springer, 2012.
class of such defenses based on how much information
                                                                   [9] X. Gong, N. Kiyavash, and N. Borisov. Fingerprint-
the defender is expected to have, and we evaluate these
                                                                       ing Websites using Remote Traffic Analysis. In
defenses based on approximations over supersequence
                                                                       Proceedings of the 17th ACM Conference on Com-
computation and anonymity set selection. We show a sig-
                                                                       puter and Communications Security, pages 684–
nificantly improved overhead over previous simulatable,
                                                                       686. ACM, 2010.
deterministic defenses such as BuFLO and Tamaraw at
the same security level.                                          [10] D. Herrmann, R. Wendolsky, and H. Federrath.
                                                                       Website Fingerprinting: Attacking Popular Pri-
Acknowledgements We would like to thank the                            vacy Enhancing Technologies with the Multino-
anonymous reviewers for their suggestions. This re-                    mial Naı̈ve-Bayes Classifier. In Proceedings of the
search was funded by NSERC, ORF, and The Tor                           2009 ACM Workshop on Cloud Computing Secu-
Project, Inc. This work was made possible by the facili-               rity, pages 31–42, 2009.
ties of the Shared Hierarchical Academic Research Com-
puting Network (SHARCNET: www.sharcnet.ca)                        [11] A. Hintz. Fingerprinting Websites Using Traf-
and Compute/Calcul Canada.                                             fic Analysis. In Privacy Enhancing Technologies,
                                                                       pages 171–178. Springer, 2003.

References                                                        [12] S. Jana and V. Shmatikov. Memento: Learning se-
                                                                       crets from process footprints. In Proceedings of
 [1] Alexa — The Web Information Company.                              the 2012 IEEE Symposium on Security and Privacy,
     www.alexa.com.                                                    pages 143–157. IEEE, 2012.

 [2] G. D. Bissias, M. Liberatore, D. Jensen, and B. N.           [13] T. Jiang and M. Li. On the approximation of
     Levine. Privacy Vulnerabilities in Encrypted HTTP                 shortest common supersequences and longest com-
     Streams. In Privacy Enhancing Technologies,                       mon subsequences. SIAM Journal on Computing,
     pages 1–11. Springer, 2006.                                       24(5):1122–1139, 1995.

 [3] X. Cai, R. Nithyanand, and R. Johnson. New                   [14] M. Liberatore and B. Levine. Inferring the Source
     Approaches to Website Fingerprinting Defenses.                    of Encrypted HTTP Connections. In Proceedings
     arXiv, abs/1401.6022, 2014.                                       of the 13th ACM Conference on Computer and
                                                                       Communications Security, pages 255–263, 2006.
 [4] X. Cai, X. Zhang, B. Joshi, and R. Johnson. Touch-
     ing from a Distance: Website Fingerprinting At-              [15] L. Lu, E.-C. Chang, and M. C. Chan. Website Fin-
     tacks and Defenses. In Proceedings of the 19th                    gerprinting and Identification Using Ordered Fea-
     ACM Conference on Computer and Communica-                         ture Sequences. In Computer Security–ESORICS
     tions Security, pages 605–616, 2012.                              2010, pages 199–214. Springer, 2010.

 [5] H. Cheng and R. Avnur.   Traffic Anal-                       [16] X. Luo, P. Zhou, E. W. Chan, W. Lee, R. K. Chang,
     ysis of SSL-Encrypted Web Browsing.                               and R. Perdisci. HTTPOS: Sealing Information
     http://www.cs.berkeley.edu/˜daw/                                  Leaks with Browser-side Obfuscation of Encrypted
     teaching/cs261-f98/projects/                                      Flows. In Proceedings of the 18th Network and Dis-
     final-reports/ronathan-heyning.ps.                                tributed Security Symposium, 2011.

 [6] K. Dyer, S. Coull, T. Ristenpart, and T. Shrimpton.          [17] A. Panchenko, L. Niessen, A. Zinnen, and T. Engel.
     Peek-a-Boo, I Still See You: Why Efficient Traffic                Website Fingerprinting in Onion Routing Based
     Analysis Countermeasures Fail. In Proceedings of                  Anonymization Networks. In Proceedings of the
     the 2012 IEEE Symposium on Security and Privacy,                  10th ACM Workshop on Privacy in the Electronic
     pages 332–346, 2012.                                              Society, pages 103–114, 2011.


                                                             14
156 23rd USENIX Security Symposium                                                                     USENIX Association
[18] M. Perry.     Experimental Defense for Web-
     site Traffic Fingerprinting.        https:
     //blog.torproject.org/blog/
     experimental-defense-website-
     traffic-fingerprinting,            September
     2011. Accessed Feb. 2014.
[19] M. Perry. A Critique of Website Traffic Fingerprint-
     ing Attacks. https://blog.torproject.
     org/blog/critique-website-
     traffic-fingerprinting-attacks,
     November 2013. Accessed Feb. 2014.
[20] Q. Sun, D. R. Simon, Y.-M. Wang, W. Russell,
     V. N. Padmanabhan, and L. Qiu. Statistical Iden-
     tification of Encrypted Web Browsing Traffic. In
     Proceedings of the 2002 IEEE Symposium on Se-
     curity and Privacy, pages 19–30. IEEE, 2002.
[21] Tor. Tor Metrics Portal. https://metrics.
     torproject.org/. Accessed Oct. 2013.

[22] T. Wang and I. Goldberg.        Comparing
     website fingerprinting attacks   and  de-
     fenses.  Technical Report 2013-30, CACR,
     2013.     http://cacr.uwaterloo.ca/
     techreports/2013/cacr2013-30.pdf.

[23] T. Wang and I. Goldberg. Improved Website Fin-
     gerprinting on Tor. In Proceedings of the 12th
     ACM Workshop on Privacy in the Electronic Soci-
     ety, 2013.
[24] C. Wright, S. Coull, and F. Monrose. Traffic
     Morphing: An Efficient Defense against Statistical
     Traffic Analysis. In Proceedings of the 16th Net-
     work and Distributed Security Symposium, pages
     237–250, 2009.




                                                            15
USENIX Association                                               23rd USENIX Security Symposium 157
