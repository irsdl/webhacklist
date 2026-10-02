---
type: Article
title: "[1801.02265] Deep Fingerprinting: Undermining Website Fingerprinting Defenses with Deep Learning"
resource: "https://arxiv.org/abs/1801.02265"
tags: [article, webseclist-reference, en, arxiv-org]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:42:28+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://arxiv.org/abs/1801.02265"
    title: "[1801.02265] Deep Fingerprinting: Undermining Website Fingerprinting Defenses with Deep Learning"
    author: Payap Sirinam, Mohsen Imani, Marc Juarez, Matthew Wright
also_at:
  - "https://arxiv.org/pdf/1801.02265"
authors:
  - Payap Sirinam
  - Mohsen Imani
  - Marc Juarez
  - Matthew Wright
canonical_url: ""
cited_by:
  - "2018.md:80"
commit: ""
content_sha256: 120eb1abbba6c9b7cef5d8d2a02bba216769c799986a283c9774f9b867d25f33
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://arxiv.org/abs/1801.02265"
published: ""
publisher: arXiv.org
publisher_english: ""
raw_sha256: 130f2749d1dc7b050eb02f5be4d048918661187bf1484cbf063ec0d1327407d1
retrieved_from: "https://arxiv.org/pdf/1801.02265"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:42:28+00:00"
slug: arxiv-org-deep-fingerprinting-undermining-website-fingerprinting-learning
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# [1801.02265] Deep Fingerprinting: Undermining Website Fingerprinting Defenses with Deep Learning

**[1801.02265] Deep Fingerprinting: Undermining Website Fingerprinting Defenses with Deep Learning** - Payap Sirinam, Mohsen Imani, Marc Juarez, Matthew Wright, arXiv.org.

- Published: date not stated
- Original: <https://arxiv.org/abs/1801.02265>
- Also published at: <https://arxiv.org/pdf/1801.02265>
- Preserved from: https://arxiv.org/pdf/1801.02265 (live) on 2026-08-19
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Deep Fingerprinting: Undermining Website Fingerprinting
                                                            Defenses with Deep Learning
                                                                    Payap Sirinam                                                            Mohsen Imani
                                                          Rochester Institute of Technology                                         University of Texas at Arlington
                                                               Rochester, New York                                                         Arlington, Texas
                                                            payap.sirinam@mail.rit.edu                                               mohsen.imani@mavs.uta.edu

                                                                      Marc Juarez                                                          Matthew Wright
                                                               imec-COSIC KU Leuven                                                Rochester Institute of Technology
arXiv:1801.02265v5 [cs.CR] 20 Aug 2018




                                                                   Leuven, Belgium                                                      Rochester, New York
                                                               marc.juarez@kuleuven.be                                                 matthew.wright@rit.edu

                                         ABSTRACT                                                                      are unique to each website. To deploy the attack, the adversary
                                         Website fingerprinting enables a local eavesdropper to determine              uses the classifier to match traces of a victim to one of those sites.
                                         which websites a user is visiting over an encrypted connection.               The effectiveness of WF depends heavily on both the classifier al-
                                         State-of-the-art website fingerprinting attacks have been shown               gorithm and the set of features used. Previous WF attacks use a
                                         to be effective even against Tor. Recently, lightweight website fin-          set of hand-crafted features to represent Tor traffic, achieving 90%+
                                         gerprinting defenses for Tor have been proposed that substantially            accuracy against Tor using classifiers such as Support Vector Ma-
                                         degrade existing attacks: WTF-PAD and Walkie-Talkie. In this work,            chine (SVM) [27], k-Nearest Neighbors (k-NN) [38], and random
                                         we present Deep Fingerprinting (DF), a new website fingerprinting             forests [14].
                                         attack against Tor that leverages a type of deep learning called                 In response to these attacks, a number of defenses have been
                                         Convolutional Neural Networks (CNN) with a sophisticated ar-                  proposed. WF defenses add dummy packets into the traffic and add
                                         chitecture design, and we evaluate this attack against WTF-PAD                delays to real packets, aiming to hide features exploited by WF at-
                                         and Walkie-Talkie. The DF attack attains over 98% accuracy on Tor             tacks such as traffic bursts and packet lengths. Notably, Tor Project
                                         traffic without defenses, better than all prior attacks, and it is also       developers have shown an interest in deploying adaptive padding
                                         the only attack that is effective against WTF-PAD with over 90%               as a possible defense [29, 30]. Based on this, Juarez et al. proposed
                                         accuracy. Walkie-Talkie remains effective, holding the attack to just         WTF-PAD and showed that it effectively defends against WF at-
                                         49.7% accuracy. In the more realistic open-world setting, our attack          tacks with reasonable overheads, such that it would be practical for
                                         remains effective, with 0.99 precision and 0.94 recall on undefended          deployment in Tor [20]. Recently, Wang and Goldberg proposed
                                         traffic. Against traffic defended with WTF-PAD in this setting, the           another effective and low-overhead defense called Walkie-Talkie
                                         attack still can get 0.96 precision and 0.68 recall. These findings           (W-T) [41]. These proposals raise the question of whether attacks
                                         highlight the need for effective defenses that protect against this           could be improved to undermine the effectiveness of the new de-
                                         new attack and that could be deployed in Tor. .                               fenses, a question we address in this work.
                                                                                                                          While the state-of-the-art attacks use classifiers that are popular
                                         KEYWORDS                                                                      in many applications, deep learning (DL) has shown to outper-
                                                                                                                       form traditional machine learning techniques in many domains,
                                         Tor; privacy; website fingerprinting; deep learning
                                                                                                                       such as speech recognition, visual object recognition, and object
                                                                                                                       detection [23]. Furthermore, DL does not require selecting and
                                         1   INTRODUCTION                                                              fine-tuning features by hand [31]. In this work, we thus explore
                                         With more than two million daily users, Tor has emerged as the de             whether we can leverage deep learning to improve classification
                                         facto tool to anonymously browse the Internet [2]. Tor is, however,           results against defended Tor traffic. The key contributions of our
                                         known to be vulnerable to traffic analysis. In particular, website            work are as follows:
                                         fingerprinting (WF) is a traffic analysis attack with the potential
                                         ability to break the privacy that Tor aims to provide. WF allows                   • We propose Deep Fingerprinting (DF), a new WF attack
                                         the attacker to identify web pages in an encrypted connection by                      based on a Convolutional Neural Network (CNN) designed
                                         analyzing patterns in network traffic. This allows a local and passive                using cutting-edge DL methods. The attack uses a simple
                                         network adversary, such as a user’s Internet service provider or                      input format and does not require handcrafting features
                                         someone sniffing the user’s wireless connection, to identify the                      for classification. We describe how DF leverages advances
                                         websites that the user has visited despite her use of Tor.                            from computer vision research for effective and robust
                                            WF exploits the fact that differences in website content (e.g.,                    classification performance.
                                         different images, scripts, styles) can be inferred from network traf-              • To study the attack in detail, we experiment in a closed-
                                         fic, even if traffic has been encrypted. From a machine learning                      world setting using a new dataset that we collected with
                                         perspective, WF is a classification problem: the adversary trains a                   95 sites and 1,000 traces per site. We find that our DF WF
                                         classifier on a set of sites, extracting network traffic features that
                                                                                                                   1
        attack is more accurate against Tor than the state-of-the-
        art attacks with 98.3% accuracy. We also show results for
        how the number of training epochs and training dataset
        size affect the classification accuracy.
     • We then show the effectiveness of the DF attack in the
        closed-world setting against Tor traffic defended with WTF-
        PAD and W-T. Against WTF-PAD, the attack reaches 90%
        accuracy, which is significantly better than all other attacks.
        Against W-T, the attack reaches 49.7% accuracy, which is                                Figure 1: The WF threat model
        better than all other attacks and nearly the theoretical
        maximum accuracy [41].
     • To investigate in a more realistic setting, we use an open
                                                                                  Figure 1 depicts the attack scenario: the client surfs the Web over
        world with 20,000 unmonitored sites. On non-defended
                                                                               the Tor anonymity system and the attacker intercepts the traffic
        traffic, the attack achieves 0.99 precision and 0.94 recall.
                                                                               between the client and the Tor network. We assume the adversary
        On traffic defended with WTF-PAD, the attack yields 0.95
                                                                               knows the client’s identity and only aims at identifying the website.
        precision and 0.70 recall. We also examine the possibilities
                                                                               Note that the adversary can trivially obtain the client’s IP address
        for attacking weak implementations of W-T.
                                                                               as long as he has access to the TLS connection between the user
     • Based on our experimental findings, we propose a number
                                                                               and the entry node. Beyond the entry node, Tor has stripped a layer
        of new directions to explore in both attack and defense.
                                                                               of encryption and the IP of the client is no longer present in the
   Overall, we find that the new DF WF attack undermines at least              headers of network packets.
one defense that had been considered seriously for deployment in                  Within this scenario, we draw on prior work to make several
Tor [29, 30]. We have disclosed our findings to the Tor Project, and           assumptions about the attacker goals and capabilities.
they have expressed their concerns about WTF-PAD, setting the                  Closed- vs Open-world Scenario: A closed-word assumes the user
stage for more exploration of the design of realistic defenses.                can only visit a small set of sites and that the adversary has samples
                                                                               to train on all of them [10, 16, 17, 35]. This assumption was criti-
2    THREAT MODEL                                                              cized for being unrealistic [19, 29], as the world of sites that can
                                                                               be potentially visited is so large that not even the most powerful
Among its goals, Tor aims to protect users against local eavesdrop-            adversaries have the resources to collect data and train for every
pers from learning what sites the user is going to. WF attacks,                site. Subsequent studies have considered an open-world scenario, a
however, use traffic analysis to undermine Tor’s protections. Prior            more realistic setting in which the adversary can only train on a
work has shown that, under certain conditions, a local and passive             small fraction of the sites the user can visit. We use closed-world
adversary can identify the pages visited by a Tor user by exploiting           experiments for detailed comparison of different algorithms and
patterns in network traffic [8, 14, 16, 27, 28, 39, 40].                       parameter settings, and we report the results of open-world exper-
   To deploy the attack, the adversary captures the sequence of                iments for a more realistic evaluation of the attack. In the open
packets, also known as a traffic trace, from each of a series of his           world, we follow the terminology used in prior work: the monitored
own visits to a representative set of websites, including sites he is          set includes sites that the adversary is interested in detecting, while
interested in detecting. From each trace, he then extracts features            the unmonitored set are all other sites.
that are unique to each website. In the WF literature, we find a myr-
iad of such features: packet size frequencies [16], total transmission         Website vs Webpage Fingerprinting: In an abuse of language, most
time and volume in both directions [28], edit-distance score [8, 39],          authors in the field use “website fingerprinting” to refer to the
and the number of traffic bursts in each direction [28, 38], just to           fingerprinting of only the home page of those websites. There is
mention a few. As a result, the adversary obtains several feature              research that has attempted to fingerprint pages that are linked from
vectors for each website that are used to train a supervised classifier        the homepage [8], but virtually all studies on website fingerprinting
that learns how to identify the site from its features. Finally, the ad-       train and test the attacks on home pages. For comparison with prior
versary can collect new traffic traces from the user’s connection to           work we make same assumptions in our evaluation.
the Tor network, extract the features, and use the trained classifier          Traffic Parsing: As pointed out by Juarez et al. [19], the attacker
to guess the website.                                                          is assumed to be able to parse all the traffic generated by a web
   In this work, we assume a network-level adversary that is: local,           visit and isolate it from other traffic (e.g., traffic generated by visits
meaning that he has access only to the link between the user and               in other tabs, non-HTTP traffic over Tor, and so on). We note that
the entry node to the Tor network, and passive, i.e., he can record            the adversary is able to do so only if he deploys the attack from an
network packets but not modify, delay, drop or decrypt them. Po-               entry node under his control. In that case, the adversary can select
tential adversaries that might be in a position to deploy a WF attack          a domain’s traffic by its Tor circuit ID. Concurrent and subsequent
include: eavesdroppers on the user’s local network, local system               visits to the same domain would still go through the same circuit.
administrators, Internet Service Providers (ISP), Autonomous Sys-              If the adversary is eavesdropping the link between the client and
tems (AS) between the user and the entry node, and the operators               the entry, all Tor traffic is multiplexed in the TLS connection to the
of the entry node.                                                             entry. However, recent research has developed techniques to parse
                                                                           2
visits from multiplexed TLS traffic [40]. As with prior work, we              the random forest. The authors argue this representation is more
assume that such parsing has already been done or is not needed.              effective for WF than the one based on the original features. To
                                                                              solve the open world problem, they feed these new feature vectors
3     BACKGROUND AND RELATED WORK                                             to a k-NN classifier. They also analyze the importance of their
In this section, we categorize and summarize prior work on WF                 features and ranked them. The results show that the top 20 most
attacks and defenses and then give the necessary background on                important features involve counting the number of packets in a
deep learning to follow the rest of the paper.                                sequence, and that these leak more information about the identity
                                                                              of a web page than complex features such as packet ordering or
                                                                              packet inter-arrival time features. k-FP achieved 91% accuracy in a
3.1    WF Attacks                                                             closed-world setting and 88% TPR and a 0.5% FPR in an open-world
Herrmann et al. were the first to evaluate WF against Tor [16].               setting.
However, they only achieved 3% accuracy in a closed world of 775
sites. The main problem with their approach was their reliance on             3.2    WF defenses
packet length frequencies – Tor sends data in fixed-size (512-byte)
                                                                              The fundamental strategy to defend against WF attacks is to add
packets known as cells – which renders this feature useless for
                                                                              dummy packets and/or delay packets. This cover traffic makes WF
classification of Tor traffic. In 2011, Panchenko et al. devised new
                                                                              features less distinctive, thus increasing the rate of classification
features and improved the attack to 55% accuracy on Herrmann et
                                                                              errors committed by the adversary. The first defense that used
al.’s dataset [28]. Since then, the success rate of WF attacks against
                                                                              this strategy against WF was BuFLO [12], proposed by Dyer et al.,
Tor has been incrementally improved, reaching 90% accuracy by
                                                                              whose strategy was to modify the traffic to make it look constant
two classifiers using edit-distances [8, 39]. These attacks, however,
                                                                              rate and thus remove packet-specific features. However, coarse
imposed high computational costs on the adversary, which makes
                                                                              features such as total volume, size and time were hard to conceal
them impractical for real-world deployment.
                                                                              without incurring high bandwidth overheads [12]. Tamaraw [6]
    Recently, a new series of WF attacks have been proposed with ad-
                                                                              and CS-BuFLO [7] tried to solve this problem by grouping sites that
vanced feature sets and more sophisticated classifiers that maintain
                                                                              are similar in size and padding all the sites in a group to the greatest
the accuracy at 90% while reducing the cost of the attack [14, 27, 38].
                                                                              size in that group. Even so, these defenses still require more than
These attacks have become the state-of-the-art WF attacks and are
                                                                              130% extra bandwidth than unprotected Tor and, on average, pages
used to benchmark other attacks and defenses. We have selected
                                                                              load between two to four times slower [6, 7, 12].
them in this study to compare against our deep-learning-based DF
                                                                                 Recently, two lightweight countermeasures have been proposed
attack.
                                                                              for deployment in Tor for their low latency overhead: WTF-PAD
k-NN. Wang et al. [38] proposed the k-NN attack. This approach                and Walkie-Talkie.
consists in applying a k-Nearest Neighbors (k-NN) classifier, in-
                                                                              WTF-PAD. Tor developers have expressed a preference for using
cluding features such as packet ordering, number of incoming and
                                                                              adaptive padding as a WF defense [29, 30]. Adaptive padding [33]
outgoing cells and numbers of bursts. These features are used in
                                                                              saves bandwidth by adding the padding only upon low usage of
combination to form a distance metric (e.g., Euclidean distance) to
                                                                              the channel, thus masking traffic bursts and their corresponding
measure the similarity between different websites. k-NN exhibits
                                                                              features. Since adaptive padding was originally designed as a de-
very good performance: in a closed-world setting with 100 sites,
                                                                              fense against end-to-end timing analysis, Juarez et al. proposed
it achieved 91% accuracy, and in an open-world setting with 5,000
                                                                              WTF-PAD, a system design for deploying adaptive padding for
sites, it achieved 86% True Positive Rate (TPR) and 0.6% False Posi-
                                                                              WF defense in Tor [20]. WTF-PAD has been shown to be effective
tive Rate (FPR).
                                                                              against all state-of-the-art attacks with relatively moderate band-
CUMUL. Panchenko et al. [27] proposed an attack based on a                    width overheads compared to the BuFLO-style defenses (e.g. 54%).
Support Vector Machine (SVM) classifier and devised a novel feature           Plus, since WTF-PAD does not delay packets, it does not incur any
set based on the cumulative sum of packet lengths constructed as              latency overhead.
follows: the first coordinate in the feature vector is the length of
                                                                              Walkie-Talkie. Walkie-Talkie (W-T) has the Tor browser communi-
the first packet in the traffic trace and the i-th coordinate is the
                                                                              cate with the web server in half-duplex mode, in which the client
sum of the value in the (i − 1)-th coordinate plus the length of
                                                                              sends a request (such as for an image file) only after the server has
the i-th packet, where lengths for incoming packets are negative.
                                                                              fulfilled all previous requests. As a result, the server and the client
The attack achieved 91% accuracy in a closed-world setting. In the
                                                                              send non-overlapping bursts in alternate directions. Moreover, the
open-world, they study two different scenarios: multi-class, where
                                                                              defense also adds dummy packets and delays to create collisions,
each monitored site is treated as a different class, and two-class,
                                                                              in which two or more sites have the same features as used by the
where the whole set of monitored pages is treated as a single class.
                                                                              adversary’s classifier. The key idea is that the traces that result from
The open world results are 96% TPR and 9.61% FPR for multi-class
                                                                              half-duplex communication can be transformed to create a colli-
and 96% TPR and 1.9% FPR for two-class.
                                                                              sion with less padding than it would with full-duplex traces. W-T
k-FP. Hayes and Danezis [14] proposed the k-fingerprinting attack             provides strong security guarantees with 31% bandwidth overhead
(k-FP). k-FP uses a random forest classifier to extract fingerprints          and 34% latency overhead.
of pages: they train the random forest with traditional features,                Despite the low cost of these two defenses, their evaluations
but the actual fingerprint is represented by the leafs of the trees in        have shown that each defense can significantly reduce the accuracy
                                                                          3
of the attacks to less than 30%. As of today, they are the main              (the hidden layer). The AE then performs decoding, in which it
candidates to be implemented in Tor. In this paper, we evaluate all          attempts to reconstruct the original input from the hidden layer
the attacks against them.                                                    while minimizing error. The main benefit of AE is to extract high-
                                                                             level features from the training data, resulting in dimensionality
3.3    WF Attacks using Deep Learning                                        reduction.
Many applications have adopted deep learning (DL) to solve com-                 A Denoising Autoencoder (DAE) uses the basic concept of AE
plex problems such as speech recognition, visual object recognition,         but also adds noise to the input. The DAE tries to reconstruct the
and object detection in images [23]. DL does not require selecting           original values from the noisy inputs, which helps it to better gener-
and fine-tuning features by hand. In the WF domain, there are four           alize and thus handle a wider variety of inputs after training. SDAE
works that have begun to examine the use of DL.                              combines ("stacks") multiple DAEs by overlapping a hidden layer as
   Abe and Goto studied the application of Stacked Denoising Au-             an input of the next DAE. Vincent et al. showed that SDAE achieves
toencoders (SDAE) [3] to WF attacks. They showed that SDAE is                lower classification error rates for image classification compared
effective with 88% accuracy in the closed world and 86% TPR and              to SVM, Deep Belief Networks (DBN), and Stacked Autoencoders
2% FPR in the open world. Although most work in deep learning                (SAE) [37].
recommends large data sets be used, their work was successful with
only a small dataset.
   Rimmer et al. proposed to apply DL for automated feature extrac-
tion in WF attacks [31]. The results show that the adversary can                3.4.2 Convolutional Neural Networks (CNN). CNNs have be-
use DL to automate the feature engineering process to effectively            come the gold standard in image classification after Krizhevsky
create WF classifiers. Thus, it can eliminate the need for feature           et al. won the Large Scale Visual Recognition Challenge (ILSVRC)
design and selection. In the closed-world scenario, their CNN-based          in 2012 [22]. Schuster et al. recently proposed applying a CNN on
attack (which we refer to as Automated Website Fingerprinting, or            encrypted video streams, and they show that the encrypted stream
AWF) trained on 2,500 traces per site could achieve 96.3% accuracy.          could be uniquely characterized by their burst patterns with high ac-
In their open-world evaluation, SDAE performs the best of their              curacy [32]. This suggests that CNNs could be useful for WF attacks
models with 71.3% TPR and 3.4% FPR when optimizing for low FPR.              as well. Figure 2 shows the basic architecture of a CNN [22, 24]. The
However, AWF could not outperform state-of-the-art WF attacks                architecture consists of two major components: Feature Extraction
such as CUMUL.                                                               and Classification.
   Recently, Bhat et al. [5] and Oh et al. [26] have released prelimi-          In Feature Extraction, the input is first fed into a convolutional
nary reports on their explorations of a CNN variant and unsuper-             layer, which comprises a set of filters. Each region of input is con-
vised DNNs with autoencoders, respectively. While both papers                volved with each filter, essentially by taking the dot product of the
include interesting contributions, neither paper reports accuracy            two vectors, to get an intermediate set of values. These values are
rates as high as those shown in our results. Additionally, neither           input to an activation function – this is similar to neurons being
attack was shown to be effective against WTF-PAD.                            activated based on whether or not the filtered input has certain
   In this work we aim to bridge this gap by developing a pow-               features. Having more filters means being able to extract more fea-
erful CNN-based deep learning model called deep fingerprinting               tures from the input. The output of the activation function is then
(DF) that can substantially outperform all previous state-of-the art         fed into a pooling layer. The pooling layer progressively reduces the
WF attacks. The DF model uses a more sophisticated variant of                spatial size of the representation from the feature map to reduce
CNN than AWF, with more convolutional layers, better protections             the number of parameters and amount of computation. The most
against overfitting, hyperparameters that vary with the depth of             common approach used in pooling is Max Pooling, which simply
each layer, activation functions tailored to our input format, and a         selects the maximum value in a spatial neighborhood within a par-
two-layer fully connected classification network. These differences          ticular region of the feature map to be a representation of the data.
in the architectural model from AWF, which are described in more             This has the advantage of being invariant to small transformations,
detail in Section 5.3, lead to a deeper and more effective network.          distortions and translations in the input, since the largest signals
We show that the DF model works significantly better than AWF                in each neighborhood are retained. The final part of the feature
and all other attacks, particularly against WF defenses and in the           extraction component (Optimized techniques in Figure 2) mainly
more realistic open-world setting.                                           consists of a stochastic dropout function and Batch Normalization
                                                                             that help improve classifier performance and prevent overfitting.
3.4    Deep Learning                                                            The CNN then passes the output from the convolutional and
                                                                             pooling layers, which represents high-level features of the input,
In our work, we mainly focus on two deep learning techniques that            into the Classification component. In this component, a set of fully-
previous work has shown to be promising for WF attacks.                      connected layers uses the features to classify the input. During
    3.4.1 Stacked Denoising Autoencoders (SDAE). Vincent et al. [37]         training, the loss value of classification is used to not only update
proposed SDAEs in 2010 to improve classification performance in              weights in the classification component but also the filters used
recognizing visual data. SDAE leverages the concept of an autoen-            in feature extraction. To estimate the loss value, we use categor-
coder (AE), a simple 3-layer neural network including input, hidden          ical cross-entropy, which is suitable for multi-class classification
and output layers. In AE, the input data is first encoded, passing           problems such as WF.
it through a layer of neurons to a more condensed representation
                                                                         4
                                                     Feature Extraction                                  Classification




                                                                                                     Fully Connected Layers




                                Figure 2: A basic architecture of convolutional neural networks (CNN)


4    DATA COLLECTION                                                           Table 1: Hyperparameters selection for DF model from Ex-
                                                                               tensive Candidates Search method
For the closed-world dataset, we visited the homepage of each of the
top Alexa 100 sites 1,250 times and dumped the traffic generated by                Hyperparameters                Search Range        Final
each visit separately using tcpdump. We used ten low-end machines                  Input Dimension                [500 ... 7000]      5000
in our university’s campus to collect the data. We have followed                                                  [Adam, Adamax,
prior work’s methodology for data collection [19, 39]; on each                     Optimizer                                          Adamax
                                                                                                                  RMSProp, SGD]
machine, the visits were sequential and were ordered according                     Learning Rate                  [0.001 ... 0.01]    0.002
to Wang and Goldberg’s batched methodology to control for long-                    Training Epochs                [10 ... 50]         30
and short-term time variance [39]. More specifically, we split the                 Mini-batch Size                [16 ... 256]        128
visits to each site in five chunks, so that the websites are accessed              [Filter, Pool, Stride] Sizes   [2 ... 16]          [8, 8, 4]
in a round-robin fashion: in each batch we access each site 25 times.              Activation Functions           [Tanh, ReLU, ELU]   ELU, ReLU
                                                                                   Number of Filters
As a result of batching, the visits to a site are spread over time. The
                                                                                    Block 1 [Conv1, Conv2]        [8 ... 64]          [32, 32]
rationale for this is twofold: i) to avoid having our IP addresses
                                                                                    Block 2 [Conv3, Conv4]        [32 ... 128]        [64, 64]
banned by the web servers; and, ii) to capture variants of the sites                Block 3 [Conv5, Conv6]        [64 ... 256]        [128, 128]
over time for more robust training and testing.                                     Block 4 [Conv7, Conv8]        [128 ... 512]       [256, 256]
   We used tor-browser-crawler [19] to drive the Tor Browser to                    Pooling Layers                 [Average, Max]      Max
visit websites. This allows for more realistic crawls than using tools             Number of FC Layers            [1 ... 4]           2
like wget or curl because the setting resembles a real user browsing               Hidden units (each FCs)        [256 ... 2048]      [512, 512]
the Web with Tor. We acknowledge that to be more realistic, our                    Dropout [Pooling, FC1, FC2]    [0.1 .. 0.8]        [0.1, 0.7, 0.5]
crawler should model user browsing behavior when crawling sites.
However, modeling user behavior in Tor is challenging, as user
statistics are not collected for privacy reasons. Virtually all existing
                                                                               denied page, a CAPTCHA page, and a timeout error page. The final
datasets collected for WF follow the same simplistic user model we
                                                                               dataset has a total of 40,716 traffic traces.
use in this study.
   After the crawls were finished, we discarded corrupted traffic              Defended dataset. To evaluate the defenses, we produced datasets
traces. For instance, we removed traces that did not have any in-              with traces protected by each defense: for BuFLO, Tamaraw and
coming or outgoing packets or were too short – less than 50 packets.           WTF-PAD, we protect traces by padding them according to the
After removing corrupted traces, we only kept the sites, or classes,           defense protocols, using the scripts and simulators provided by the
that had at least 1,000 visits. We ended having 95 sites with 1,000            authors [6, 12, 20]. Walkie-Talkie, however, cannot be completely
visits for our closed-world evaluations. We refer to the set of the            simulated, as half-duplex communication is hard to model. We
data used for closed-world evaluations as the closed-world dataset.            thus performed a new crawl with a Tor Browser in half-duplex
                                                                               mode. Since the implementation of half-duplex for the original
Open-world dataset. For the open-world dataset, we visited the sites
                                                                               implementation of Walkie-Talkie was done in an outdated version
from Alexa’s top 50,000, excluding the first 100 sites used to build
                                                                               of the Tor Browser, we had to implement half-duplex in the latest
the closed-world dataset. We used the same ten machines to collect
                                                                               version of Tor Browser at the time of our crawls (Tor Browser
the data, where each machine collected the data for 5,000 different
                                                                               Bundle version 7.0.6). With this modified Tor Browser, we collected
sites sequentially. We visited each open-world site only once and
                                                                               closed- and open-world datasets of size similar to the undefended
took a screenshot of their homepages. After collecting the data,
                                                                               ones. Walkie-Talkie also requires padding the bursts in the half-
we discarded corrupted visits the same way we did for the closed-
                                                                               duplex traces. To that end, we followed the mold padding strategy
world dataset. During the crawling of the open-world, we found
                                                                               as described in the Walkie-Talkie paper [41].
sites returning an access denied error message, a timeout error, or
a blank page. Moreover, many of the sites were behind Cloudflare’s
CDN, which presents a CAPTCHA to connections coming from Tor                   5    EXPERIMENTAL EVALUATION
exit relays. We removed those sites from our dataset by comparing              In this section, we evaluate WF attacks based on SDAE, DF and
their homepage’s screenshot with each of: a blank page, an access              AWF. We compare them with the state-of-the-art WF attacks. We
                                                                               used our datasets for these evaluations.
                                                                           5
5.1    Implementation                                                        architecture and tune the model’s hyperparameters that best fit for
Our implementation of the DF model uses the Python deep learn-               WF.
ing libraries Keras as the front-end and Tensorflow as the back-                 We adapted the base CNN model of DF to our needs, as there
end [1]. The source code of the implementation and a dataset to              are important differences between traffic analysis and traditional
reproduce our results is publicly available at https://github.com/           applications of CNN-based models such as image recognition. For
deep-fingerprinting/df.                                                      example, standard activation functions such as sigmoid and rectified
                                                                             linear unit (ReLU) do not activate on negative values and thus will
   5.1.1 Data Representation. In WF, a website trace is represented          not use the information conveyed by the sign of the input (i.e., cell
as a sequence of tuples <timestamp, ±packet_size>, where the sign            direction). Activation functions that can handle negative inputs
of packet_size indicates the direction of the packet: positive means         include tanh, leaky ReLU (LReLU), parametrized ReLU (PReLU)
outgoing and, negative, incoming.                                            and Exponential Linear Unit (ELU). Prior work has shown that
   Prior work in WF has shown that the most important features               ELU provides fast and accurate classification [11, 25]. We compared
are derived from the lengths of traces in each direction [14, 38].           ELU with other activation functions during hyperparameter tuning
Wang et al. [38] simplified the raw traffic traces into a sequence           and it performed the best among all the functions we tested (see
of values from [−1, +1], where they ignored packet size and times-           Section 5.2). Although the traditional tanh function can also handle
tamps and only take the traffic direction of each packet. However,           negative inputs, it is vulnerable to the vanishing gradient issue [4],
we performed preliminary evaluations to compare the WF attack                which slows down optimization.
performance between using packet lengths and without packet                      Another difference between traffic and image data is that images
lengths, i.e., only packet direction, as feature representations. Our        are two-dimensional, whereas our data is a vector. This means that
result showed that using packet lengths does not provide a no-               filter and pool sizes cannot be two-dimensional (e.g., 2x4) but have
ticeable improvement in the accuracy of the attack. Therefore, we            to be cast to one dimension (e.g., 1x4).
follow Wang et al.’s methodology and consider only the direction
of the packets.                                                              5.2    DF’s Hyperparameter Tuning
   SDAE, DF and AWF require the input to have a fixed length. In
                                                                             A fundamental process in supervised classification is to tune the
order to find the input length that performs best, we parameterized
                                                                             hyperparameters of the classification model, such as the kernel
it and explored the range [500, 7, 000], which contains most of
                                                                             used in an SVM or the number of hidden layers in a CNN. This
the length distribution in our data. Our results show that 5,000
                                                                             process involves adjusting the trade-off between variance, bias and
cells provide the best results in terms of classification accuracy.
                                                                             classification performance, so that the model fits the training data
In practice, most of the traces are either longer or shorter than
                                                                             while still generalizing to samples that it has not been trained on. For
that. We padded shorter traces by appending zeros to them and
                                                                             DF, however, the large amount of training data and the large number
truncated longer traces after 5,000 cells. Out of 95,000 traces in the
                                                                             of hyperparameters the model has render an exhaustive search
closed-world dataset, only 8,121 were longer than 5,000 cells and
                                                                             prohibitive in terms of computational resources. To demonstrate
had to be truncated, while the rest were padded.
                                                                             our attacks, we thus only aim at a good-enough classifier and we
   5.1.2 SDAE. We reproduced Abe and Goto’s results [3], as de-              acknowledge that someone with more resources might be able to
scribed in Section 3. Following guidance from the authors, we suc-           optimize our model further.
cessfully re-implemented their SDAE neural network on the same                  To select the hyperparameters for our models, we perform an
architecture and dataset they used. We achieved 89% accuracy, a              extensive search through the hyperparameter space, in which we
slightly higher accuracy than the one Abe and Goto reported in               build each layer of the deep learning model block by block. In
their paper. We believe that using different Python DL modules               each building block, we vary the hyperparameters to estimate the
(Kera and Tensorflow) and randomly initializing the weights ac-              gradient of the parameter and determine whether we must increase
counts for this difference. Furthermore, we slightly changed their           or decrease its value. Once this process is done, we select the best
SDAE model’s hyperparameters to improve its performance in our               top-n parameters and use them as the initial parameters for the
experiments.                                                                 optimization in the next block. When all layers are set, we select
                                                                             the best combination of hyperparameters.
   5.1.3 AWF. Rimmer et al. provided us with their source code                  By the transferability property of neural networks [42], WF at-
to re-produce their results. We strictly followed their proposed             tacks based on other models can use the values we found for the DF
hyperparameters and evaluate the model in our dataset to make a              hyperparamters to bootstrap the hyperparameters of their model.
fair comparison for our model and the previous state-of-the-art WF           We thus used the transferability property to find the parameters
attacks.                                                                     for the defended datasets from the hyperparameters found using
                                                                             the undefended dataset. We only needed to slightly adjust some
   5.1.4 DF. To develop our DF model to effectively perform WF
                                                                             hyperparameters to optimize our model, significantly reducing the
attacks on both non-defended and defended dataset, we have fol-
                                                                             time spent in hyperparameter tuning. We thoroughly illustrate and
lowed techniques in the deep learning literature [21, 22, 36] to
                                                                             explain our design of DF model in Appendix A. The search space
improve the performance of the model, such as using the appro-
                                                                             as well as the final selected values are shown in Table 1.
priate number of convolutional layers, mitigation and prevention
of overfitting [34] and a suitable activation function for our WF            Evaluating overfitting Even though deep neural networks (DNN)
input data [25]. These studies helped us design the sophisticate             are a powerful supervised classification model, they are, as with as
                                                                         6
                                                                             is inspired by modern large image classification networks such
                                                                             as VGG [21], GoogleNet [36] and ResNet [15] that apply at least
                                                                             two consecutive convolutional layers before a max pooling layer
                                                                             as shown in Figure 3(b). Max pooling typically reduces the data to
                                                                             a smaller size, so it is not possible to have deeper networks when
                                                                             pooling after every convolutional layer. Adding more convolutional
                                                                             layers in each basic block thus enables more convolutional layers in
                                                                             total and a deeper network with more effective feature extraction.
                                                                             Overfitting Concerns. Rimmer et al. criticized the CNN model for
                                                                             having a higher risk of overfitting which was shown in their ex-
                                                                             perimental results. We argue that a more carefully crafted model
                                                                             can mitigate overfitting. The AWF model includes a dropout layer
                                                                             before the first basic block as shown in Figure 3(a). While dropout
                                                                             is a common technique to help prevent overfitting, this placement
                                                                             is atypical in CNN designs, as it may result in the loss of meaning-
                                                                             ful features extracted from the input and may not be sufficient to
      Figure 3: Comparison between AWF and DF models                         prevent overfitting. In DF, we used overfitting-contention mech-
                                                                             anisms that are applied in the state-of-the-art CNN networks for
                                                                             computer vision, including a batch normalization (BN) layer that
most machine learning models, vulnerable to overfitting. Overfit-            is added right after each convolutional layer and a dropout layer
ting occurs when the model errs on samples that it has not been              after the activation function, as explained in Section 5.2. With these
trained on, meaning that the model cannot generalize. For small              mechanisms, the DF model shows no evidence of overfitting in our
datasets, overfitting can be measured with cross-validation tech-            experiments.
niques. For large datasets like ours, however, we can just split the
                                                                             Varying Hyperparameters In the AWF model, the value of some
data into three mutually exclusive sets: training, validation and
                                                                             hyperparameters are fixed such as using 32 filters in every convo-
testing, with a ratio of 8:1:1. We then measure the difference in
                                                                             lutional layer. Using a fixed number of filters over all the layers
error rate between different sets. In case of overfitting, the model
                                                                             reduces the capability of the model to learn. In contrast, the DF
would achieve a substantially higher accuracy on the training set
                                                                             model follows the state-of-the-art in computer vision by varying
than on the testing set.
                                                                             hyperparameter values for different layers [21]. For example, we
   During the training of our DF model, we applied Dropout [34]
                                                                             increase the number of filters as we get deeper in the network. The
and Batch Normalization (BN) [18] to prevent overfitting. These
                                                                             intuition behind varying the values is that the CNN uses hierarchi-
are regularization techniques that loosen the model and allow for
                                                                             cal features in its processing pipeline. The features in lower layers
greater generalization. In dropout, the model randomly selects
                                                                             (close to the input) are primitive, like edge detection, while features
hidden units, including their incoming and outgoing connections,
                                                                             in upper layers are high-level abstract features, like object detection,
and temporarily removed them from the network while training.
                                                                             made from combinations of lower-level features. We increase the
BN normalizes the fully-connected and convolutional layers’ out-
                                                                             number of filters at higher layers to improve the ability to encode
puts and helps accelerate learning while also reducing overfitting.
                                                                             richer representations.
Moreover, we analyze the error rates between training and testing
datasets during hyperparameter tuning to ensure that our model is            Activation Function. The AWF model only uses the ReLU activation
not overfitting.                                                             function. ReLU is popular in CNNs, but it maps all negative values
   Figure 4 depicts the training and testing error rates. The differ-        to zero. Our input formats include negative values that represent
ence between training and testing error of the DF model is less than         incoming packets, so using ReLU in convolutional layers close the
2%, suggesting that overfitting is unlikely.                                 input can substantially reduce the information available to deeper
                                                                             layers in the model. In the DF model, the activation function in
5.3    Differences Between DF and AWF                                        the first basic block is ELU, which can learn a data representation
                                                                             containing negative values to ensure that the model can learn all
We now explain the significant differences of the DF model com-
                                                                             meaningful representations from the input.
pared to the AWF model proposed by Rimmer et al. [31] that help
explain the superior performance of DF.                                      Fully-connected Layers. The AWF model directly connects the last
                                                                             max pooling layer to the prediction layer, a densely connected layer
Basic Block Design. The basic block is the group of convolutional
                                                                             with an output size equal to number of classes. In more recent
layer(s), max pooling layer, filters and activation layer(s) that per-
                                                                             CNNs, there are a set of fully connected (FC) layers that follow the
form feature extraction in a CNN. Generally, the basic block is
                                                                             convolutional layers and precede the prediction layer. The FC layers
repeatedly appended to create deeper networks.
                                                                             play an important role in the learning and classification processes
   We observe that the AWF model is similar to Imagenet [22], one
                                                                             of the model. Essentially, the convolutional layers perform feature
of the earliest CNN models proposed in 2012. The basic block of this
                                                                             extraction, but that means that it is important to carefully design the
model only contains one convolutional layer followed by one max
                                                                             classifier that uses the extracted features, which is the role of the FC
pooling layer as shown in Figure 3(a). In contrast, our DF model
                                                                         7
layer. In the DF model, we add two FC layers with the combination                               100                                                            10
of BN and dropout to prevent the overfitting that normally occurs
in FC layers.                                                                                          98                                                      8
   Overall, our DF model was specifically designed to effectively




                                                                                                                                                                    Error Rate
                                                                                 Accuracy
                                                                                                       96                        DF Training Accuracy          6
perform WF attacks by leveraging the state-of-the-art techniques
                                                                                                                                 DF Testing Accuracy
from computer vision research. We provide a thorough explanation                                                                 DF Testing Error Rate
on how the DF model was developed and a visualization of the                                           94                        DF Training Error Rate        4
DF model in Appendix A to allow other researchers to gain better
understanding and reproduce our work. Our experimental results
                                                                                                       92                                                      2
confirm that DF performs better than AWF model in defended and
non-defended and on both closed-world and more realistic open-
world scenarios. These results help to illustrate the impact of the                                    90                                                      0
                                                                                                             10         20          30                   40
DL architecture design on the performance of the attacks.                                                              Number of epochs
5.4    Closed-world Evaluation on Non-defended
                                                                               Figure 4: Closed World: Impact of the number of training
       Dataset                                                                 epochs on DF accuracy and error rate
We evaluate the performance of the DF attack in the closed-world
scenario on the non-defended dataset, which comprises website
                                                                                                        100
traces from the closed-world dataset with no WF defenses in place.
Moreover, we compare DF model with the state-of-the-art WF
attacks: k-NN, CUMUL, k-FP, AWF, and SDAE. We re-evaluate
these attacks on our non-defended dataset and apply k-fold cross-
                                                                                                            90
validation for training their classifiers and testing their performance,
as was done in the papers presenting these attacks [14, 27, 38].
                                                                                            Accuracy



Table 2: Closed World: Accuracy on the non-defended                                                         80
dataset for state-of-the-art attacks.
                                                                                                                                                    DF
 Classifier   SDAE      DF       AWF      k-NN     CUMUL       k-FP
                                                                                                                                                    CUMUL
 Accuracy     92.3%     98.3%    94.9%    95.0%    97.3%       95.5%
                                                                                                            70                                      k-NN
                                                                                                                                                    k-FP
   Table 2 shows the accuracy results. Our DF model attains 98.3%                                                                                   AWF
accuracy, which is better than the other attacks and higher than any                                                                                SDAE
previously reported result for a WF attack in Tor. Our DF model                                             60
performs better than AWF. Our results for AWF (94.9%) are a bit                                                  0   200     400       600               800
lower than the reported results by Rimmer et al. (96.5%), we believe                                                        Training Size
this is due to the larger dataset used by them. We observe that
CUMUL, k-FP, k-NN and SDAE benefit from the larger training data               Figure 5: Closed World: Impact of numbers of training traces
set with 2-4% higher accuracies than previously reported results               on classification accuracy
that used smaller datasets (usually 90 training instances). SDAE
was not as accurate as the other attacks.
   Additionally, we investigate how fast the model can learn to                consistently outperform the other attacks for all training sizes. With
distinguish patterns from the input data, also known as convergence            just 50 traces per site, both DF and CUMUL achieve 90% accuracy.
of the model. This depends on many factors such as the method                  k-NN, k-FP and AWF require 250 traces to reach this accuracy, and
used for data pre-processing, the DL architecture and the hyperpa-             SDAE requires 750 traces. The observed accuracies mostly saturate
rameters used to create the model. This evaluation helps to validate           after 550 traces, except for SDAE. The results show that the var-
the quality of our hyperparameter tuning method. Moreover, the                 ious techniques used in the DF model lead to significantly better
attacker can use this to estimate the number of training epochs,               performance compared to the simpler AWF model.
rounds of feeding training data into the classifier, required for the
classifier to reach the expected level of accuracy. Normally, the              5.5                Training Cost
classifier gradually learns better with more training epochs.                  We now examine the training time for WF attacks using DL in
   Figure 4 shows that with only 10 training epochs, DF can reach              comparison to state-of-the-art WF attacks. We found that with
testing accuracy of about 97%, DF consistently improves with more              GPU acceleration by using NVIDIA GTX 1070 with 8 GB of GPU
training epochs, until accuracy levels off after 30 epochs.                    Memory, SDAE required 16 minutes for training (13 minutes for
   Finally, we investigate the impact of dataset size on classifier ac-        pre-training and 3 minutes for fine-tuning processes), DF required
curacy. The results shown in Figure 5 indicate that DF and CUMUL               64 minutes for 30-epoch training. The relatively simpler AWF model
                                                                           8
      Table 3: Accuracy in a closed-world scenario on defended datasets, SDAE, DF, and AWF vs. the state-of-art WF attacks
                                                  Overhead                Accuracy of WF attacks on defended datasets
                             Defenses
                                            Bandwidth      Latency    SDAE          DF      AWF     k -NN    CUMUL       k-FP
                              BuFLO            246%         137%          9.2%     12.6%    11.7%   10.4%     13.5%     13.1%
                             Tamaraw           328%         242%      11.8%        11.8%    12.9%    9.7%     16.8%     11.0%
                            WTF-PAD             64%          0%       36.9%       90.7%     60.8%   16.0%     60.3%     69.0%
                          Walkie-Talkie         31%          34%      23.1%        49.7%    45.8%   20.2%     38.4%      7.0%


requires 4 minutes for 30-epoch training. Without a GPU, SDAE                    than BuFLO, which contradicts the purposed intended with its
required 96 minutes, DF required approximately 10 hours, and                     design and the overheads reported in previous evaluations. The
AWF required 1 hour. For training the other attacks, we found it                 cause of this is a greater amount of padding after the transmission
required 12.5 hours for k-NN, 57 hours for CUMUL (parallelized                   has finished in Tamaraw compared to BuFLO. BuFLO stops padding
with 4 processes), and 1 hour for k-FP. Overall, SDAE, DF and AWF                immediately after the transmission has finished, as long as the
have reasonable training times, particularly when using a GPU.                   transmission has lasted for longer than ten seconds, which is the
                                                                                 case for most of the traces in our dataset.
5.6     Closed-world Evaluation on the Defended                                     With such heavy overheads, BuFLO and Tamaraw are not practi-
        Dataset                                                                  cal to deploy as a WF defense in Tor. WTF-PAD and Walkie-Talkie
                                                                                 have lower overheads, and Tor Project developers have already
We next examine the performance of WF attacks against Tor traf-
                                                                                 shown an interest in deploying adaptive padding as a possible de-
fic with defenses in the closed-world scenario. It is important to
                                                                                 fense [29, 30]. We thus select WTF-PAD and Walkie-Talkie for our
note that the attacker needs to train the classifiers with defended
                                                                                 open-world evaluation.
datasets to perform this attack. As mentioned in Section 3, several
WF defenses have been proposed that they can reduce the accuracy
of state-of-the-art WF attacks to less than 50%. Notably, WTF-PAD                5.7       Open-world Evaluation
and Walkie-Talkie offer both effective protection and reasonable                 We now evaluate the performance of the attack in the more realistic
overheads, such that they are realistic for adoption in Tor. With                open-world setting. As mentioned in Section 2, in the open-world
our larger dataset, we conduct an evaluation on SDAE, DF, AWF                    scenario, the adversary not only classifies traffic traces based on a
and prior attacks against these defenses, as well as BuFLO and                   limited set of monitored sites, but he must also distinguish whether
Tamaraw.                                                                         the trace comes from a monitored site or an unmonitored one.
   Table 3 shows the overheads of each defense and the accuracy                     In our evaluation, we assess the performance of classifiers in
of the attacks against defended datasets. BuFLO and Tamaraw,                     the open-world scenario on each model by showing true positive
the two high-overhead defenses, hold up well with less than 17%                  rate (TPR) and false positive rate (FPR), but also with precision and
accuracy. The attacks also manage at most 49.70% accuracy against                recall curves, recommended in the WF literature [20, 27] as more
Walkie-Talkie due to symmetric collisions. A surprising result is                appropriate metrics for the open-world evaluation than TPR and
that DF achieves over 90% accuracy against WTF-PAD. Our tests                    FPR. The size of the monitored and unmonitored sets are heavily
of WTF-PAD showed 64% overhead, which means that there was                       unbalanced, so using only TPR and FPR can lead to incorrect inter-
more padding on average than in the Juarez et al.’s study [20], and              pretation due to the base-rate fallacy. We also provide ROC curves
yet the attack was successful. More generally, it seems that the                 in Appendix C.
larger amount of traces per site compared to the original WTF-
PAD evaluation has played a role in the higher accuracy attained                 Standard Model. In previous studies on WF in the open-world set-
by the attack. For example, k-FP achieved nearly 69% accuracy in                 ting [14, 27, 38], it has been assumed that if the attacker included
our experiment, whereas Hayes and Danezis tested k-FP against                    unmonitored traces when training the classifier, it could help the
their own implementation of adaptive padding and obtained 30%                    classifier better distinguish between monitored and unmonitored
accuracy [14].                                                                   traces. This assumption is also common in machine learning, and
   DF significantly outperforms AWF on the dataset protected by                  we thus call it the Standard model. Fundamentally, the process of
WTF-PAD, with a much larger gap in performance than observed                     training and creating datasets used during open-world evaluation
on the undefended dataset. We believe that the deeper network                    is the same as in the closed-world scenario, except that we addi-
is able to better extract useful features in the WTF-PAD data that               tionally train on unmonitored websites traces as another class. To
the AWF model is unable to find, leading to this result. The model               investigate the impact of more training data on the performance
architecture in DF plays a key role in its flexibility to generalize to          of the classifiers in the open-world scenario, we train the classifier
defended traffic.                                                                with different portions of the unmonitored dataset.
   We note that the overheads for BuFLO and Tamaraw are higher                      In our open-world evaluation, we use the prediction probability
than reported in prior work at 246% and 328% bandwidth overheads,                to classify the input traces. In particular, if the input trace is a mon-
respectively. Furthermore, we found that the larger the dataset, the             itored website trace and the maximum output probability belongs
greater the packet timing variance is, which is fundamental to                   to any monitored site and is greater than a threshold, we consider
determine the padding rate. Also, Tamaraw has higher overheads                   this as a true positive. We used different thresholds for different WF
                                                                            9
                      1.0                                                                                                             kNN        CUMUL
                                                                                                 0.35                                 kFP        DF
                                                                                                 0.30                                 AWF        SDAE
                      0.8




                                                                          False positive rate
 True positive rate




                                                                                                 0.25
                      0.6
                                                                                                 0.20

                      0.4                                                                        0.15
                                  kNN            CUMUL
                                  kFP            DF                                              0.10
                      0.2         AWF            SDAE
                                                                                                 0.05
                      0.0                                                                        0.00
                            0   5000        10000        15000   20000                                  0       5000         10000       15000       20000
                                              Size                                                                             Size
                                       (a) TPR                                                                         (b) FPR

            Figure 6: Open World: The impact of the amount of unmonitored training data on TPR and FPR (Non-defended dataset).


attacks. We selected the thresholds for each WF attack such that                                   Our results show that as we increase the size of the unmonitored
they have high TPR and low FPR. Figure 9 in Appendix C shows                                    class in the training, the FPR drops and it reaches its lowest amount
examples of ROC curves for WF attacks against Non-defended,                                     at size 20,000. In the next experiment, we fix the number of training
WTF-PAD, and W-T datasets. Following the experimental proce-                                    samples for the unmonitored class to 20,000 and we evaluate the
dures of Rimmer et al. [31] and Panchenko et al. [27], we focus                                 diagnostic ability of WF attacks as the discrimination threshold is
on the binary results of whether the input trace is classified as                               varied. We next perform the experiment on our non-defended, WTF-
monitored (predicted to be in any of the monitored classes) or un-                              PAD and Walkie-Talkie (W-T) datasets. As mentioned in Section 4,
monitored. Note that if the trace is determined to be monitored, the                            for W-T, we cannot use the same dataset to W-T traces as it required
attacker can then use the multi-class classification to predict which                           to be directly captured from half-duplex connections from Tor
website the user has actually visited.                                                          browser. Our training set for the W-T evaluation contains 91,000
   k-NN and k-FP attacks use the k-nearest neighbors algorithm in                               monitored traces (910 instances for each of 100 monitored sites) and
their predictions and do not output the probability of predictions.                             we varied the number of unmonitored sites from 900 to 20,000 sites
For these attacks, we consider the prediction probability of a site as                          (one instance for each). Our testing set includes 9,000 traces (90
the fraction of the nearest neighbors belonging to that site among                              instances for each of 100 monitored sites) and 20,000 unmonitored
the k nearest neighbors. We explored the performance of these                                   traces (one instance for 20,000 unmonitored sites). In the following
attacks as the value of k varies from 2 to 10. We found that above                              open-world experiments, we mainly focus on the precision and
k = 5, the TPR and FPR do not change significantly. For our open-                               recall to avoid the base-rate fallacy as mentioned above.
world evaluation, we used k = 6 in both k-NN and k-FP.                                             Figure 7 shows the precision-recall curves for WF attacks in our
                                                                                                non-defended, WTF-PAD and W-T datasets. Precision-recall curves
   5.7.1 Results. We first evaluate efficacy of our WF attack in the                            are used to represent the performance of the classifier as an alter-
Standard model as amounts of unmonitored training data varies                                   native to ROC curves in imbalanced datasets. Imbalanced datasets
and compare it with other state-of-the-art WF attacks on the non-                               have an impact on precision, an important metric to measure per-
defended traces. Our training set in this experiment contains 85,500                            formance, however, ROC curves do not take precision into account.
monitored traces (900 instances for each of 95 monitored sites) and                             This choice is specially relevant in the open-world evaluation, as the
we varied the number of unmonitored sites from 900 to 20,000 sites                              size of the monitored set is typically orders of magnitude smaller
(one instance for each). Our testing set includes 9500 monitored                                than the unmonitored set and as such it should be represented in
traces (100 instances for 95 monitored sites) and 20,000 unmonitored                            our testing set, thus leading to an imbalance [20].
traces (one instance for 20,000 unmonitored sites). Note that the                                  As we see in the figure, the DF attack outperforms the other
20,000 unmonitored sites in the testing are different from those in                             state-of-the-art WF attacks in all three cases. In the non-defended
the training.                                                                                   dataset, it is highly effective for any threshold. The CUMUL and
   As shown in Figures 6a and 6b, the TPR tends to slightly decrease                            AWF attacks in Figure 7a have high precision but a very wide range
with the reduction of FPR as the size of unmonitored training data                              of recall, which means the attacks miss many monitored visits.
increase for all the WF attacks. The results show that the DF model                             For traffic defended by WTF-PAD, Figure 7b shows a reduction
consistently performs best on both TPR and FPR, with 0.957 TPR                                  of both precision and recall for all WF attacks. The DF attacker
and 0.007 FPR for 20,000 unmonitored training sites. k-NN has the                               does the best. Tuned for high precision, it achieves precision of 0.96
lowest TPR and k-FP has the highest FPR. The DF, CUMUL and                                      and recall of 0.68. Tuned for high recall, it reaches 0.67 precision
AWF have the same FPR trend as the training size increases, but DF                              and 0.96 recall. All the other WF attacks get close to the baseline
has higher TPR than CUMUL and AWF over all the training sizes.
                                                                         10
             1                                                     1                                                  0.4

            0.8                                                   0.8
                                                                                                                     0.35
Precision




            0.6                                                   0.6

            0.4                                                   0.4
                                       kNN          CUMUL
                                                                                                                      0.3
                                                                                           kNN           CUMUL                                 kNN          CUMUL
                                       kFP          DF
            0.2                                                   0.2                      kFP           DF                                    kFP          DF
                                       AWF          SDAE                                   AWF           SDAE                                  AWF          SDAE
                                       Baseline                                            Baseline                                            Baseline
             0                                                     0                                                 0.25
                  0      0.2    0.4    0.6        0.8       1           0   0.2    0.4    0.6          0.8       1            0.2      0.4    0.6         0.8       1
                                  Recall                                             Recall                                              Recall
                      (a) Non-defended dataset                                (b) WTF-PAD dataset                                   (c) W-T dataset

                                                                Figure 7: Open World: Precision-Recall curves.


             (random guessing) as the threshold decreases. The result shows                  users strictly follow the procedure to create symmetric collisions
             that the otherwise robust WTF-PAD is significantly undermined                   which has 0.80 TPR and 0.76 FPR. Thus, the major goal of W-T to
             by the DF attack.                                                               create the confusion between sensitive websites and non-sensitive
                Figure 7c shows the precision-recall curves for the W-T dataset.             websites could be undermined in some scenarios.
             The attacks all perform quite poorly, with all except the DF attack
             close to the baseline. The DF attack does moderately better but still           6        DISCUSSION
             has a precision of less than 0.36 in all cases.
                                                                                             The results of our study show that deep learning, and the DF ap-
                                                                                             proach in particular, is a powerful tool for WF attacks against Tor.
             5.8       A Deeper Look at W-T                                                  Further, our results against defended traffic show that WTF-PAD is
             Top-N prediction for closed-world W-T Wang and Goldberg ex-                     potentially vulnerable against deep-learning-based WF, with high
             plain that any attack using the main features of the state-of-the-art           precision even in the open-world setting. Based on what we have
             attacks can get at most 50% accuracy against W-T [41]. In our                   observed during experimental evaluations, we now discuss several
             closed-world results, the DF attack nearly reached this theoretical             new directions in both improving the attacks and exploring designs
             maximum. We now examine prediction probability for DF against                   for more effective defenses.
             W-T. We consider top-N prediction, in which we look at not only                 Improving Open-World Classification. In our study, we observed
             the highest probability (Top-1 prediction), but also the top N prob-            that designing the CNN architecture and tuning hyperarameters are
             ability values. Surprisingly, we only need to look at the case of               specific to both the environment and input data. For example, the
             N = 2. Top-2 prediction accuracy reaches 98.44% accuracy. This                  gap in performance between DF and AWF was much larger for the
             likely means that DF is correctly selecting the real site and the               open-world setting than the closed world. Additional exploration of
             decoy site and, as expected, having to guess randomly between                   models in the open-world scenario, such as the depth and number
             them. We discuss the importance of this result in Section 6.                    of convolutional layers, different filter sizes, or different dropout pa-
             Asymmetric Collision (Closed-World) W-T requires that the client                rameters, may yield improved results beyond what we have found
             create symmetric collisions between pairs of websites (site A is                so far. More training data may also help the classifier better distin-
             molded with site B and vice versa). Since this requires storing all             guish between monitored and unmonitored pages. Our simple data
             the pairs, a simpler implementation would ignore this requirement               format might be extended to include, for example, statistical timing
             and have the client random select the decoy site for each access,               information that is currently excluded.
             resulting in asymmetric collisions. In this setting, the DF attack                 Finally, we note that the attacker can perform a targeted attack
             is much more accurate at 87.2%, compared to 49.7% with symmet-                  on users in a semi-open-world setting, in which the targeted users
             ric collisions. This shows the importance of creating symmetric                 can be profiled as likely going to a subset of sites. For example, if the
             collisions in W-T.                                                              user is known to only read one or two languages, then many sites
                                                                                             in other languages can be eliminated from the set. Alternatively,
             Asymmetric Collision (Open-World) We next evaluate the scenario
                                                                                             a user’s profile can help the attacker identify some likely sites
             that 10% of the users do not follow the W-T guidelines, in that
                                                                                             for her interests, such that the classification of statistically similar
             they visit a non-sensitive site and choose a non-sensitive site as a
                                                                                             monitored sites may be dismissed as likely false positives.
             decoy instead of a sensitive one, and when they visit a sensitive site
             they choose a sensitive site as a decoy instead of a non-sensitive              Attack Costs. The time and effort needed to collect and train on
             one. In this scenario, TPR is increased to 0.85 TPR, and FPR is                 large data sets can have practical implications for weaker attack-
             significantly reduced to 0.23 TPR, compared to the case that all                ers. Collecting large data sets as used in our experiments requires
                                                                                      11
multiple PCs running for several days. Both Juarez et al. [19] and             Alternative Defenses. To improve effectiveness against DF without
Wang and Goldberg [40] show that after 10-14 days, the accuracy                requiring extensive interaction with the browser, defenses could
of WF attacks goes down significantly. A weak attacker might need              apply adversarial machine learning [9, 13] to generate the adversar-
to choose between limiting the scope of monitored sites, living                ial website traces to confuse the classifier. This is challenging to
with the results of using stale and inaccurate data, or using fewer            do compared to adversarial machine learning in image processing
training samples per site. We note that, even though deep learning             tasks, since the web trace is happening live, where the Tor client
works best with more data, DF performs well in the closed-world                does not know the full picture of the trace in advance. Further, Tor
setting even with smaller datasets. Additionally, we found that                is limited in how it can manipulate the trace—it can add dummy
while k-FP, AWF, and DF can be trained quickly on large datasets,              packets and delay packets but not delete packets or speed them up.
k-NN and CUMUL do not scale well to larger data. In particular,                Addressing these challenges would be interesting for future work.
due to hyperparameters grid search, CUMUL took us days to train.
Further exploring the trade-offs between scalability and accuracy              7    CONCLUSION
remain important areas for future research.
                                                                               In this study, we investigated the performance of WF using deep
WTF-PAD. As DF can break WTF-PAD with over 90% accuracy in                     learning techniques in both the closed-world scenario and the more
the closed-world setting, we now consider why the defense failed by            realistic open-world scenario. We proposed a WF attack called Deep
examining the adaptive padding algorithm at the heart of WTF-PAD.              Fingerprinting (DF) using a sophisticate design based on a CNN
Adaptive padding aims to detect large timing gaps between bursts               for extracting features and classification. Our closed-world results
and use padding to make these gaps less distinctive. While Juarez et           show that the DF attack outperforms other state-of-the-art WF
al. showed that this is effective against prior WF attacks [20], DF can        attacks, including better than 90% accuracy on traffic defended by
still detect patterns that remain after WTF-PAD is applied. When               WTF-PAD. We also performed open-world experiments, including
used in analyzing images, CNN can detect an object (e.g. a dog)                the first open-world evaluation of WF attacks using deep learning
anywhere in an image due to its use of convolutional layers with               against defended traffic. On undefended traffic, the DF attack attains
multiple filters. Similarly, DF can detect any small region or portion         a 0.99 precision and a 0.94 recall, while against WTF-PAD, it reaches
of distinguishing patterns, no matter where those patterns are                 a 0.96 precision and a 0.68 recall. Finally, we provided a discussion
located in the trace. Adaptive padding only randomly disrupts some             on our results along with suggestions for further investigation.
patterns in the trace, leaving other patterns relatively unperturbed.             Overall, our study reveals the need to improve WF defenses to be
Walkie-Talkie. Walkie-Talkie (W-T) has an advantage over WTF-                  more robust against attacks using deep learning, as attacks only get
PAD, as it focuses directly on features used in WF attacks, and it             better, and we have already identified several directions to improve
seeks explicitly to create collisions. Indeed, W-T performed much              the DF attack further.
better than WTF-PAD against DF, which would seem to make it a
strong candidate for Tor. We note, however, that there are several             ACKNOWLEDGMENTS
downsides to deploying W-T that require further investigation to               We thank the anonymous reviewers for their helpful feedback. A
overcome:                                                                      special acknowledgement to Vera Rimmer for providing feedback
                                                                               that helped improve the paper. We appreciate the interesting dis-
     • It requires the directory server to collect and distribute to           cussions with Vera Rimmer, Dr. Leon Reznik and Igor Khokhlov
        all clients a database of website patterns that can be used            that helped developing this paper.
        to set the padding patterns. The patterns need to be kept                 This material is based upon work supported by the National Sci-
        up to date to provide effective plausible deniability.                 ence Foundation under Grants No. CNS-1423163 and CNS-1722743.
     • Half-duplex communication adds to the latency of fetching               In addition, this work has been supported by the European Com-
        a site, 31% according to Wang and Goldberg [41], which is              mission through KU Leuven BOF OT/13/070 and H2020-DS-2014-
        a direct cost to end-user performance in a system that is              653497 PANORAMIX. Juarez is supported by a PhD fellowship of
        already slower than regular browsing.                                  the Fund for Scientific Research - Flanders (FWO).
     • According to Wang and Goldberg, the browser is expected
        to pair sensitive and non-sensitive pages and, ideally, pay            REFERENCES
        attention to issues such as language to select realistic cover          [1] 2017. Keras. https://keras.io/. (2017).
                                                                                [2] 2017. Users - Tor metrics. https://metrics.torproject.org/userstats-relay-country.
        pages. To be most effective, then, the browser has to have a                html. (2017).
        lot of context about the user and the nature of her activity,           [3] K. Abe and S. Goto. 2016. Fingerprinting attack on Tor anonymity using deep
                                                                                    learning. In in the Asia Pacific Advanced Network (APAN).
        which is hard to build into the system.                                 [4] Y. Bengio, P. Simard, and P. Frasconi. 1994. Learning long-term dependencies
     • Given that DF achieves very high Top-2 accuracy, the at-                     with gradient descent is difficult. IEEE Transactions on Neural Networks 5, 2 (Mar
        tacker can use auxiliary information such as language to                    1994), 157–166. https://doi.org/10.1109/72.279181
                                                                                [5] Sanjit Bhat, David Lu, Albert Kwon, and Srinivas Devadas. 2018. Var-CNN
        guess the real site. Further, if the system does not assign                 and DynaFlow: Improved Attacks and Defenses for Website Fingerprinting.
        a decoy site to a particular sensitive site or page (e.g. be-               "https://arxiv.org/pdf/1802.10215.pdf". (2018). (accessed: August, 2018).
                                                                                [6] Xiang Cai, Rishab Nithyanand, and Rob Johnson. 2014. CS-BuFLO: A congestion
        yond the homepage of the site), then that site is effectively               sensitive website fingerprinting defense. In Workshop on Privacy in the Electronic
        uncovered, because it will not be used as a decoy for any                   Society (WPES). ACM, 121–130.
        non-sensitive sites.                                                    [7] Xiang Cai, Rishab Nithyanand, Tao Wang, Rob Johnson, and Ian Goldberg. 2014.
                                                                                    A systematic approach to developing and evaluating website fingerprinting
                                                                          12
     defenses. In ACM Conference on Computer and Communications Security (CCS).                  [32] Roei Schuster, Vitaly Shmatikov, and Eran Tromer. 2017. Beauty and the Burst:
     ACM, 227–238.                                                                                    Remote identification of encrypted video streams. In USENIX Security Symposium.
 [8] Xiang Cai, Xin Cheng Zhang, Brijesh Joshi, and Rob Johnson. 2012. Touching                       USENIX Association, 1357–1374.
     from a distance: Website fingerprinting attacks and defenses. In ACM Conference             [33] V. Shmatikov and M. Wang. 2006. Timing analysis in low-latency mix networks:
     on Computer and Communications Security (CCS). ACM, 605–616.                                     Attacks and defenses. In European Symposium on Research in Computer Security
 [9] N. Carlini and D. Wagner. 2017. Towards evaluating the robustness of neural                      (ESORIC). Springer, 18–33.
     networks. In 2017 IEEE Symposium on Security and Privacy (SP). 39–57. https:                [34] Nitish Srivastava, Geoffrey Hinton, Alex Krizhevsky, Ilya Sutskever, and Ruslan
     //doi.org/10.1109/SP.2017.49                                                                     Salakhutdinov. 2014. Dropout: A simple way to prevent neural networks from
[10] Heyning Cheng and Ron Avnur. 1998. Traffic analysis of SSL encrypted                             overfitting. Journal of Machine Learning Research 15 (2014), 1929–1958. http:
     web browsing. Project paper, University of Berkeley (1998).              Available               //jmlr.org/papers/v15/srivastava14a.html
     at http://www.cs.berkeley.edu/~daw/teaching/cs261-f98/projects/final-reports/               [35] Q Sun, DR R Simon, and YM M Wang. 2002. Statistical identification of encrypted
     ronathan-heyning.ps.                                                                             web browsing traffic. In IEEE Symposium on Security and Privacy (S&P). IEEE,
[11] Djork-Arné Clevert, Thomas Unterthiner, and Sepp Hochreiter. 2015. Fast and                      19–30.
     accurate deep networks learning by exponential linear units (ELUs). In in the               [36] Christian Szegedy, Wei Liu, Yangqing Jia, Pierre Sermanet, Scott Reed, Dragomir
     International Conference on Computer Vision (ICCV15)).                                           Anguelov, Dumitru Erhan, Vincent Vanhoucke, and Andrew Rabinovich. 2015.
[12] Kevin P. Dyer, Scott E. Coull, Thomas Ristenpart, and Thomas Shrimpton. 2012.                    Going deeper with convolutions. (June 2015).
     Peek-a-Boo, I still see you: Why efficient traffic analysis countermeasures fail. In        [37] P. Vincent, H. Larochelle, I. Lajoie, Y. Bengio, and P. Manzagol. 2010. Stacked
     IEEE Symposium on Security and Privacy (S&P). IEEE, 332–346.                                     denoising autoencoders: Learning useful representations in a deep network with
[13] Ian Goodfellow, Jean Pouget-Abadie, Mehdi Mirza, Bing Xu, David Warde-                           a local denoising criterion. Journal of Machine Learning Research 11 (2010),
     Farley, Sherjil Ozair, Aaron Courville, and Yoshua Bengio. 2014. Genera-                         3371–3408.
     tive adversarial nets. In Advances in Neural Information Processing Systems                 [38] Tao Wang, Xiang Cai, Rishab Nithyanand, Rob Johnson, and Ian Goldberg. 2014.
     27, Z. Ghahramani, M. Welling, C. Cortes, N. D. Lawrence, and K. Q. Wein-                        Effective attacks and provable defenses for website fingerprinting. In USENIX
     berger (Eds.). Curran Associates, Inc., 2672–2680. http://papers.nips.cc/paper/                  Security Symposium. USENIX Association, 143–157.
     5423-generative-adversarial-nets.pdf                                                        [39] Tao Wang and Ian Goldberg. 2013. Improved website fingerprinting on Tor. In
[14] Jamie Hayes and George Danezis. 2016. k-fingerprinting: A robust scalable                        ACM Workshop on Privacy in the Electronic Society (WPES). ACM, 201–212.
     website fingerprinting technique. In USENIX Security Symposium. USENIX Asso-                [40] Tao Wang and Ian Goldberg. 2016. On realistically attacking Tor with website
     ciation, 1–17.                                                                                   fingerprinting. In Proceedings on Privacy Enhancing Technologies (PoPETs). De
[15] Kaiming He, Xiangyu Zhang, Shaoqing Ren, and Jian Sun. 2016. Deep residual                       Gruyter Open, 21–36.
     learning for image recognition. In Proceedings of the IEEE conference on computer           [41] Tao Wang and Ian Goldberg. 2017. Walkie-talkie: An efficient defense against
     vision and pattern recognition. 770–778.                                                         passive website fingerprinting attacks. In USENIX Security Symposium. USENIX
[16] Dominik Herrmann, Rolf Wendolsky, and Hannes Federrath. 2009. Website                            Association, 1375–1390.
     fingerprinting: attacking popular privacy enhancing technologies with the multi-            [42] Jason Yosinski, Jeff Clune, Yoshua Bengio, and Hod Lipson. 2014. How Transfer-
     nomial Naïve-Bayes classifier. In ACM Workshop on Cloud Computing Security.                      able Are Features in Deep Neural Networks?. In Proceedings of the 27th Interna-
     ACM, 31–42.                                                                                      tional Conference on Neural Information Processing Systems - Volume 2 (NIPS’14).
[17] Andrew Hintz. 2003. Fingerprinting websites using traffic analysis. In Privacy                   MIT Press, Cambridge, MA, USA, 3320–3328. http://dl.acm.org/citation.cfm?id=
     Enhancing Technologies (PETs). Springer, 171–178.                                                2969033.2969197
[18] Sergey Ioffe and Christian Szegedy. 2015. Batch normalization: Accelerating deep
     network training by reducing internal covariate shift. In International Conference
     on Machine Learning. 448–456.                                                               A     DEEP FINGERPRINTING (DF) MODEL’S
[19] Marc Juarez, Sadia Afroz, Gunes Acar, Claudia Diaz, and Rachel Greenstadt. 2014.
     A critical evaluation of website fingerprinting attacks. In ACM Conference on                     ARCHITECTURE FOR WF ATTACKS
     Computer and Communications Security (CCS). ACM, 263–274.                                   One of the compelling properties for CNN is the transferability of
[20] Marc Juarez, Mohsen Imani, Mike Perry, Claudia Diaz, and Matthew Wright.
     2016. Toward an efficient website fingerprinting defense. In European Symposium             the model. The transferability refers to the ability of the model to
     on Research in Computer Security (ESORICS). Springer, 27–46.                                be used as a base model for similar tasks. Instead of training an
[21] Simonyan Karen and Zisserman Andrew. 2015. Very deep convolutional networks
     for large-scale image recognition. (2015).
                                                                                                 entire CNN from scratch, the researcher can adapt the model to a
[22] Alex Krizhevsky, Ilya Sutskever, and Geoffrey E. Hinton. 2012. ImageNet clas-               similar task, specifically with a similar input format.
     sification with deep convolutional neural networks. In Advances in Neural                      In WF research, to the best of our knowledge, we are the first
     Information Processing Systems. Curran Associates, Inc., 1097–1105.
[23] Y. LeCun, Y. Bengio, and G. Hinton. 2015. Deep learning. Nature 4 (2015),                   who provide the full technical details, guidelines and suggestions
     436–444.                                                                                    on how to implement our CNN-based DF model to perform WF
[24] Y. Lecun, L. Bottou, Y. Bengio, and P. Haffner. 1998. Gradient-based learning               attacks. In this section we provide details for our DF architecture
     applied to document recognition. 86 (1998), 2278–2324. Issue 11.
[25] Dmytro Mishkin, Nikolay Sergievskiy, and Jiri Matas. 2016. Systematic evaluation            and its hyperparameters to create our model, and to allow other
     of CNN advances on the ImageNet. CoRR abs/1606.02228 (2016).                                researchers to apply it in their future work (see Figure 8):
[26] Se Eun Oh, Saikrishna Sunkam, and Nicholas Hopper. 2018. p-FP: Extraction,
     Classification, and Prediction of Website Fingerprints with Deep Learning. "https:          Input Data. The input data for our DF model is the vector of packets’
     //arxiv.org/abs/1711.03656.pdf". (2018). (accessed: August, 2018).                          directions with length 5,000 (1 x 5,000). We initially tried adjusting
[27] Andriy Panchenko, Fabian Lanze, Andreas Zinnen, Martin Henze, Jan Pen-
     nekamp, Klaus Wehrle, and Thomas Engel. 2016. Website fingerprinting at                     the input dimension to be a matrix of shape similar to the matrices
     Internet scale. In Network & Distributed System Security Symposium (NDSS). IEEE             typically fed into CNNs for image recognition tasks (e.g., 50 x 100
     Computer Society, 1–15.
[28] Andriy Panchenko, Lukas Niessen, Andreas Zinnen, and Thomas Engel. 2011.
                                                                                                 pixels). The accuracy for 2D input was reasonably good, but slightly
     Website fingerprinting in onion routing based anonymization networks. In ACM                lower than 1D input. The major difference is training time: 1D input
     Workshop on Privacy in the Electronic Society (WPES). ACM, 103–114.                         is significantly faster than 2D input, even though the total number
[29] Mike Perry. 2013.          A critique of website traffic fingerprinting at-
     tacks. Tor Project Blog. https://blog.torproject.org/blog/critique-website-traffic-         of data points is the same for both input dimensions. We presume
     fingerprinting-attacks. (2013). (accessed: December, 2015).                                 this difference results from tensor operations that have to deal with
[30] Mike Perry. 2015. Padding Negotiation. Tor Protocol Specification Proposal. https:          higher dimensions of data. We suggest that for the WF task, it is
     //gitweb.torproject.org/torspec.git/tree/proposals/254-padding-negotiation.txt.
     (2015). (accessed: October 1, 2017).                                                        more appropriate to use 1D input as it is faster for training and
[31] Vera Rimmer, Davy Preuveneers, Marc Juarez, Tom Van Goethem, and Wouter                     provides better classification performance
     Joosen. 2018. Automated Website Fingerprinting through Deep Learning. In
     Proceedings of the 25nd Network and Distributed System Security Symposium                   Convolutional Layers (Block 1). Figure 8 describes the architecture
     (NDSS 2018). Internet Society.                                                              of our DF model divided by blocks, where a block comprises a set
                                                                                                 of convolutional layers, a batch normalization layer, a max pooling
                                                                                            13
                            Input Data                              layer and a dropout layer. The first block in the DF is specially
                                                                    important due to its proximity to the input.
       Block 1                                                          As we mentioned in Section 5, since the nature of our input
           Convolutional 1D          32 Maps, Kernel: 1 x 8
                                                                    is different to inputs considered in image recognition, we had to
           Batch Normalization
                                                                    find an activation function that fits our input values. We chose the
           Activation Layer          ELU (alpha = 1.0)
                                                                    Exponential Linear Unit (ELU) because prior work has shown that
           Convolutional 1D          32 Maps, Kernel: 1 x 8
                                                                    it provides fast and accurate classification with negative inputs [11,
           Batch Normalization
                                                                    25]. The results obtained from hyperparameters tuning suggested
           Activation Layer          ELU (alpha = 1.0)
                                     Pool: 1 x 8
                                                                    that applying ELU in the first two convolutional layers followed
           Max Pooling
           Dropout                   Rate = 0.1
                                                                    by ReLU with the rest of convolutional layers provides the best
                                                                    accuracy compared to only using ReLU. This suggests that ELU
       Block 2                                                      plays an important role in extracting hidden features from the input
           Convolutional 1D          64 Maps, Kernel: 1 x 8         data.
           Batch Normalization
                                                                    Dropout Regularization. CNN-based models are specially vulnera-
           Activation Layer          ReLU
                                     64 Maps, Kernel: 1 x 8
                                                                    ble to overfitting, an issue that might be easily overlooked by the
           Convolutional 1D
           Batch Normalization
                                                                    developer. We applied a dropout technique to mitigate overfitting
           Activation Layer          ReLU                           in the design of our DF model. Our strategy to apply dropout was to
           Max Pooling               Pool: 1 x 8                    embed in between feature extraction (Blocks 1-4) and classification
           Dropout                   Rate = 0.1                     (Fully-connected layers) using different rates. In feature extraction,
                                                                    we deployed dropout right after the max pooling layer in each block
       Block 3                                                      with 0.1 dropout rate. In addition, we added a dropout layer after
           Convolutional 1D          128 Maps, Kernel: 1 x 8        each fully-connected layer with rate 0.7 and 0.5, respectively. As we
           Batch Normalization                                      observed from the hyperparameters tuning, the overfitting mostly
           Activation Layer          ReLU
                                                                    arises at the fully-connected layers, and it is less problematic at
           Convolutional 1D          128 Maps, Kernel: 1 x 8
                                                                    the convolutional layers. Thus, we adjusted different dropout rates
           Batch Normalization
                                                                    appropriately according to this observation.
           Activation Layer          ReLU
           Max Pooling               Pool: 1 x 8                    Batch Normalization. We studied the technique to accelerate model
           Dropout                   Rate = 0.1                     learning called Batch Normalization (BN) [18]. This technique pro-
                                                                    vides benefits to improve the classification performance in order to,
       Block 4                                                      for instance, learn faster while maintaining or even increasing ac-
           Convolutional 1D          256 Maps, Kernel: 1 x 8
                                                                    curacy. Moreover, it also partially serves as a regulation method as
           Batch Normalization
                                                                    well. Thus, we applied BN and dropout regularization together and
           Activation Layer          ReLU
                                                                    obtained a boost in both performance and generalization. However,
           Convolutional 1D          256 Maps, Kernel: 1 x 8
                                                                    adding BN layers requires additional training time. We observed
           Batch Normalization
                                                                    that it added around 100% training time for each epoch compared to
            Activation Layer         ReLU
                                     Pool: 1 x 8
                                                                    the model that did not apply BN. Yet, we believe it is worth applying
            Max Pooling
            Dropout                  Rate = 0.1
                                                                    BN, as the additional training time is compensated with a faster
                                                                    learning rate (it requires less number of epochs to reach the same
       Fully-Connected (FC)
       Layers                                                       level of accuracy) and can ultimately achieve higher testing accu-
                                                                    racy. In our model, we applied BN right after every convolutional
           FC Layer 1                512 hidden units
                                                                    and fully-connected layers.
           Batch Normalization
                                                                       In conclusion, the researcher can apply this model and our sug-
           Activation Layer          ReLU
                                                                    gestions to develop their own CNN-based model for WF. There
           Dropout                   Rate = 0.7
                                                                    are other details that we cannot describe here due to limit space
           FC Layer 2                512 hidden units
                                                                    including number of filters, kernel size, stride size and pool size.
           Batch Normalization
                                                                    However, we will ensure that our implementation details, along
           Activation Layer          ReLU
           Dropout                   Rate = 0.5
                                                                    with the source code and data used in this study, will be published
                                                                    on a website upon publication of this paper, so that researchers can
       Output Prediction                                            reproduce our results.
           FC Layer                  N hidden units
           Activation Layer          Softmax
                                                                    B    ATTACK PERFORMANCE METRICS
                                                                    In this section, we define and justify the metrics we have used to
Figure 8: Our design of DF model’s architecture used in WF          evaluate the success of the attacks. There are two scenarios under
attacks                                                             which WF attacks are evaluated: closed-world and open-world.

                                                               14
B.1    Closed-world Evaluation                                                  Where:
In the closed-world scenario, we assume that the user is limited                      • T P is the total number of test samples of monitored websites
to visiting a fixed set of websites, and the attacker knows this set                      that are correctly classified as monitored websites.
and can train his classifier on it. In this scenario, the success of the              • T N is the total number of test samples of unmonitored web-
attacker is simply measured as the ratio of the number of correctly                       sites that are correctly classified as unmonitored websites.
classified traces to the total number of traces, we call this ratio the               • F P is the total number of test samples of unmonitored web-
attack’s accuracy.                                                                        sites that are misclassified as monitored websites.
                                                                                      • F N is the total number of monitored websites that are mis-
                                    Pcor r ect                                            classified as unmonitored websites.
                        Accuracy =                               (1)
                                       N                                           In addition, the attacker can measure precision and recall to tune
   Pcor r ect is the total number of correct predictions. A correct             the system. If his primary goal is to reliably determine that a user
prediction is defined as the output of the classifier matching the              has visited a particular monitored website, one can try to decrease
label of the website to which the test trace belongs. N is the total            false positives at the cost of true positives and thus increase the
number of instances in the test set.                                            precision of the attack. On the other hand, if the attacker aims to
                                                                                cast a wide net and identify potential visitors to the monitored web
B.2    Open-world Evaluation                                                    sites, then recall is more important, and the adversary should tune
In the open-world scenario, the user may visit any of a large number            the system to increase true positives at the cost of additional false
of websites. Since the attacker cannot effectively train on so many             positives.
sites, he selects a relatively small set to train his classifier on (the
monitored set). For experimentation, we model the rest of the Web               C    OPEN-WORLD ROC CURVE
using a set of sites that the attacker does not try to identify with            We plot the ROC curve for all the WF attacks against non-defended,
WF (the unmonitored set). Note that the unmonitored set is more                 WTF-PAD and W-T datasets using the standard model in the open-
than two orders of magnitude larger than the monitored set in our               world scenario as shown in Figures 9a−9c. The ROC curve allows
experiments. As mentioned in Section 5.7, we measure Precision                  us to evaluate the classifier and strive for a trade-off between TPR
and Recall in this scenario.                                                    and FPR. For example, the best overall results for DF against non-
                                                                                defended traffic might be optimizing for high TPR, with 0.98 TPR
                                        TP                                      and 0.03 FPR, and optimizing for low FPR, with 0.94 TPR and 0.004
                        Precision =                                  (2)
                                      TP + FP                                   FPR.

                                      TP
                         Recall =                                    (3)
                                    TP + FN




                                                                           15
                      1                                               1                                           1

                     0.8                                             0.8                                         0.8
True positive rate




                     0.6                                             0.6                                         0.6

                     0.4                                             0.4                                         0.4

                                                 kNN        CUMUL                             kNN        CUMUL                           kNN         CUMUL
                     0.2                         kFP        DF       0.2                      kFP        DF      0.2                     kFP         DF
                                                 AWF        SDAE                              AWF        SDAE                            AWF         SDAE
                                                 Baseline                                     Baseline                                   Baseline
                      0                                               0                                           0
                           0          0.1         0.2        0.3           0     0.2         0.4          0.6          0   0.2       0.4       0.6          0.8
                                      False positive rate                        False positive rate                          False positive rate

                               (a) Non-defended dataset                        (b) WTF-PAD dataset                            (c) W-T dataset

                                                                    Figure 9: ROC curve in Open-world scenario




                                                                                         16
