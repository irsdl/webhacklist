---
type: Article
title: "Take This Personally: Pollution Attacks on Personalized Services"
description: "Xing and colleagues show the personalization engines behind YouTube, Amazon and Google search can be steered by outsiders. Third-party requests inject entries into a victim's profile without their knowledge, perturbing the recommendation algorithms so an attacker-chosen video, product or low-ranked site gains visibility. Demonstrated against all three services."
resource: "https://www.usenix.org/conference/usenixsecurity13/technical-sessions/paper/xing"
tags: [article, webseclist-reference, en, usenix-org, csrf, measurement-study, case-study, owasp-a01-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-17T10:06:05+00:00"
status: stable
stale_after: 2027-08-17
sources:
  - id: original
    resource: "https://www.usenix.org/conference/usenixsecurity13/technical-sessions/paper/xing"
    title: "Take This Personally: Pollution Attacks on Personalized Services"
    author: Xinyu Xing, Wei Meng, Dan Doozan, Alex C. Snoeren, Nick Feamster, Wenke Lee
also_at:
  - "https://www.usenix.org/system/files/conference/usenixsecurity13/sec13-paper_xing.pdf"
authors:
  - Xinyu Xing
  - Wei Meng
  - Dan Doozan
  - Alex C. Snoeren
  - Nick Feamster
  - Wenke Lee
canonical_url: ""
cited_by:
  - "2013.md:58"
commit: ""
content_sha256: 0f2f075c2d84ce60af6e82224237b114d190ae171e0def0778c445c2844a8270
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.usenix.org/conference/usenixsecurity13/technical-sessions/paper/xing"
published: ""
publisher: usenix.org
publisher_english: ""
raw_sha256: ae9639c339d09bde40cdc666211a2f7dea44a655701fe1324e0364f8876e219a
retrieved_from: "https://www.usenix.org/system/files/conference/usenixsecurity13/sec13-paper_xing.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-17T10:06:05+00:00"
slug: usenix-org-take-this-personally-pollution-attacks-personalized-services
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Take This Personally: Pollution Attacks on Personalized Services

**Take This Personally: Pollution Attacks on Personalized Services** - Xinyu Xing, Wei Meng, Dan Doozan, Alex C. Snoeren, Nick Feamster, Wenke Lee, usenix.org.

- Published: date not stated
- Original: <https://www.usenix.org/conference/usenixsecurity13/technical-sessions/paper/xing>
- Also published at: <https://www.usenix.org/system/files/conference/usenixsecurity13/sec13-paper_xing.pdf>
- Preserved from: https://www.usenix.org/system/files/conference/usenixsecurity13/sec13-paper_xing.pdf (live) on 2026-08-17
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Take This Personally: Pollution Attacks
       on Personalized Services
Xinyu Xing, Wei Meng, and Dan Doozan, Georgia Institute of Technology;
          Alex C. Snoeren, University of California, San Diego;
     Nick Feamster and Wenke Lee, Georgia Institute of Technology




     This paper is included in the Proceedings of the
           22nd USENIX Security Symposium.
             August 14–16, 2013 • Washington, D.C., USA
                         ISBN 978-1-931971-03-4




                                   Open access to the Proceedings of the
                                    22nd USENIX Security Symposium
                                         is sponsored by USENIX
         Take This Personally: Pollution Attacks on Personalized Services

     Xinyu Xing, Wei Meng, Dan Doozan, Alex C. Snoeren† , Nick Feamster, and Wenke Lee
                     Georgia Institute of Technology and † UC San Diego




                       Abstract                                  sale, malicious content, or affiliate marketing schemes.
                                                                 Search engine optimization (SEO), which seeks to im-
   Modern Web services routinely personalize content
                                                                 pact the placement of individual Web pages in the results
to appeal to the specific interests, viewpoints, and con-
                                                                 provided by search engines, is perhaps the most widely
texts of individual users. Ideally, personalization allows
                                                                 understood example of this practice.
sites to highlight information uniquely relevant to each
                                                                    Modern Web services are increasingly relying upon
of their users, thereby increasing user satisfaction—and,
                                                                 personalization to improve the quality of their customers’
eventually, the service’s bottom line. Unfortunately, as
                                                                 experience. For example, popular websites tailor their
we demonstrate in this paper, the personalization mech-
                                                                 front pages based on a user’s previous browsing history
anisms currently employed by popular services have not
                                                                 at the site; video-sharing websites such as YouTube rec-
been hardened against attack. We show that third parties
                                                                 ommend related videos based upon a user’s watch his-
can manipulate them to increase the visibility of arbi-
                                                                 tory; shopping portals like Amazon make suggestions
trary content—whether it be a new YouTube video, an
                                                                 based on a user’s previous purchases; and search engines
unpopular product on Amazon, or a low-ranking website
                                                                 such as Google return customized results based upon a
in Google search returns. In particular, we demonstrate
                                                                 wide variety of user-specific factors. As the Web be-
that attackers can inject information into users’ profiles
                                                                 comes increasingly personal, the effectiveness of broad-
on these services, thereby perturbing the results of the
                                                                 brush techniques like SEO will wane. In its place will
services’ personalization algorithms. While the details of
                                                                 rise a new class of schemes and outright attacks that ex-
our exploits are tailored to each service, the general ap-
                                                                 ploit the mechanisms and algorithms underlying this per-
proach is likely to apply quite broadly. By demonstrating
                                                                 sonalization. In other words, personalization represents
the attack against three popular Web services, we high-
                                                                 a new attack surface for all those seeking to steer user
light a new class of vulnerability that allows an attacker
                                                                 eyeballs, regardless of their intents.
to affect a user’s experience with a service, unbeknownst
to the user or the service provider.                                In this paper, we demonstrate that contemporary per-
                                                                 sonalization mechanisms are vulnerable to exploit. In
                                                                 particular, we show that YouTube, Amazon, and Google
1   Introduction                                                 are all vulnerable to the same class of cross-site scripting
                                                                 attack, which we call a pollution attack, that allows third
The economics of the Web ecosystem are all about clicks          parties to alter the customized content the services return
and eyeballs. The business model of many Web services            to users who have visited a page containing the exploit.
depends on advertisement: they charge for prime screen           Although the attack is quite effective, we do not claim
real estate, and focus a great deal of effort on develop-        that it is the most powerful, broadly applicable, or hard
ing mechanisms that make sure that the information dis-          to defeat. Rather, we present it as a first example of a
played most prominently is likely to create revenue for          class of attacks that we believe will soon—if they are not
the service, either through a direct ad purchase, com-           already—be launched against the relatively unprotected
mission, or at the very least improving the user’s ex-           underbelly of personalization services.
perience. Not surprisingly, malfeasants and upstanding              Our attack exploits the fact that a service employing
business operators alike have long sought to reverse engi-       personalization incorporates a user’s past history (includ-
neer and exploit these mechanisms to cheaply and effec-          ing, for example, browsing, searching and purchasing ac-
tively place their own content—whether it be items for           tivities) to customize the content that it presents to the


                                                             1
USENIX Association                                                                  22nd USENIX Security Symposium 671
user. Importantly, many services with personalized con-                 • Our attack and its effectiveness illustrates the im-
tent log their users’ Web activities whenever they are                    portance of securing personalization mechanisms in
logged in regardless of the site they are currently visiting;             general. We discuss a number of implications of our
other services track user activities on the site even if the              study and ways for websites to mitigate similar vul-
user is logged out (e.g., through a session cookie). We                   nerabilities in the future.
use both mechanisms to pollute users’ service profiles,
thereby impacting the customized content returned to the            The rest of the paper is organized as follows. Section 2
users in predictable ways. Given the increasing portfolio           provides a general overview of pollution attacks on per-
of services provided by major players like Google and               sonalized services. Sections 3, 4, and 5 introduce specific
Amazon, it seems reasonable to expect that a large frac-            attacks that can be launched against YouTube, Google,
tion of users will either be directly using the service or at       and Amazon, respectively, and report on our success. We
least logged in while browsing elsewhere on the Web.                survey related work in Section 6 and discuss limitations
   We show that pollution attacks can be extremely effec-           of our work and possible defenses in Section 7 before
tive on three popular platforms: YouTube, Google, and               concluding in Section 8.
Amazon. A distinguishing feature of our attack is that
it does not exploit any vulnerability in the user’s Web             2     Overview and Attack Model
browser. Rather, it leverages these services’ own person-
alization mechanisms to alter user’s experiences. While             In this section, we present a brief overview of personal-
our implementation employs cross-site request forgery               ization as it is used by popular Web services. We then
(XSRF) [13], other mechanisms are possible as well.                 present a model of pollution attacks, which we apply
   The ability to trivially launch such an attack is es-            to three different scenarios later in the paper: YouTube,
pecially worrisome because it indicates the current ap-             Amazon, and Google.
proach to Web security is ill-equipped to address the
vulnerabilities likely to exist in personalization mecha-
nisms. In particular, today’s Web browsers prevent ex-              2.1     Personalization
ploits like cross-site scripting and request forging by en-         Online services are increasingly using personalization to
forcing boundaries between domains though “same ori-                deliver information to users that is tailored to their inter-
gin” policies. The limitations of these approaches are              ests and preferences. Personalization potentially creates
well known, but our attack represents a class of exploits           a situation where both the service provider and the user
that cannot be stopped by client-side enforcement: in an            benefit: the user sees content that more closely matches
attempt to increase the footprint of its personalization en-        preferences, and the service provider presents products
gine (e.g., Google recording search queries that a user             that the user is more likely to purchase (or links that the
enters on a third-party page), a service with personalized          user is more likely to click on), thus potentially resulting
services is providing the cross-site vector itself. Hence,          in higher revenues for the service provider.
only the service can defend itself from such attacks on its            The main instrument that a service provider can use to
personalization. Moreover, enforcing isolation between              affect the content that a user sees is modifying the choice
independent Web sessions seems antithetical to the goal             set, the set of results that a user sees on a particular screen
of personalization, which seeks to increase the amount of           in response to a particular query. The size of a choice
information upon which to base customization attempts.              set differs for different services. For example, YouTube
   This paper makes the following contributions:                    shows the user anywhere from 12–40 videos; Amazon
                                                                    may show the user up to five sets of recommended prod-
  • We describe pollution attacks against three                     ucts; Google’s initial search results page shows the top
    platforms—YouTube, Google, and Amazon—that                      ten results. Figure 1 shows several examples of choice
    allow a third party to alter the personalized content           sets on different sites.
    these services present to users who previously                     When a user issues a query, a service’s personaliza-
    visited a Web page containing the exploit.                      tion algorithm affects the user’s choice set for that query.
  • We study the effectiveness of our attack on each of             The choice set that a personalization algorithm produces
    these platforms and demonstrate that it (1) can in-             depends on a user query, as well as a number of auxil-
    crease the visibility of almost any YouTube chan-               iary factors, including the universe of all possible con-
    nel; (2) dramatically increase the ranking of most              tent and the user’s browsing history. Previous work has
    websites in the short term, and even have lasting im-           claimed that many factors, ranging from geography to
    pacts on the personalized rankings of a smaller set             time of day, may affect the choice set that a user sees.
    of sites, and (3) cause Amazon to recommend rea-                For the purposes of the attacks in this paper, we focus on
    sonably popular products of the attacker’s choosing.            how changes to a user’s history can affect the choice set,


                                                                2
672 22nd USENIX Security Symposium                                                                           USENIX Association
         (a) Customized YouTube.                   (b) Customized Amazon.                       (c) Customized Google.

      Figure 1: websites with personalized services (personalized services tailor the data in the red rectangles).


                                                                          the user’s choice set. Depending on the service, the
                                                                          seed may be queries, clicks, purchases, or any other
                                                                          activity that might go into the user’s history. A good
                                                                          seed can affect the user’s choice set with a minimal
                                                                          number of “false clicks”, as we describe next.
                                                                       3. Inject the seed with a vector of false clicks. To pol-
                                                                          lute a user’s history, in most cases we require that
                                                                          the user be signed in to the site. (For some services,
                                                                          pollution can take place even when the user is not
Figure 2: Overview of how history pollution can ulti-                     signed in.) Then, the attacker can use a mechanism
mately affect the user’s choice set.                                      to make it appear as though the user is taking action
                                                                          on the Web site for a particular service (e.g., click-
                                                                          ing on links) using a particular attack vector.
holding other factors fixed. In particular, we study how
an attacker can pollute the user’s history by generating           In the following sections, we explore how an attacker can
false clicks through cross-site request forgery (XSRF).            apply this same procedure to attack the personalization
We describe these attacks in the next section.                     algorithms of three different services: YouTube, Ama-
                                                                   zon, and Google search.

2.2    Pollution Attacks
                                                                   3     Pollution Attacks on YouTube
The objective of a pollution attack is to affect a user’s
choice set, given a particular input. In some cases, a             In this section, we demonstrate our attack on YouTube1 .
user’s choice set appears before the user enters any in-           Following the attack steps we described in Section 2,
put (e.g., upon an initial visit to the page). In this case,       we first model how YouTube uses the watch history of a
the attacker’s goal may be to affect a default choice set.         YouTube user account to recommend videos by review-
Figure 2 shows an overview of the attacker’s goal: the             ing the literature [5]. Second, we discuss how to prepare
attacker aims to affect the resulting choice set by alter-         seed data (i.e., seed videos) to promote target data (i.e.,
ing the user’s history with false clicks, using cross-site         target videos belonging to a specific channel). Third, we
request forgery as the attack vector. This attack requires         introduce how to inject the seed videos to a YouTube user
three steps:                                                       account. Finally, we design experiments and quantify the
                                                                   effectiveness of our attack.
 1. Model the service’s personalization algorithm. We
    assume that the attacker has some ability to model
    the personalization algorithm that the site uses to af-
                                                                   3.1      YouTube Personalization
    fect the user’s choice set. In particular, the attacker        YouTube constructs a personalized list of recommended
    must have some idea of how the user’s past history             videos based upon the videos a user has previously
    affects the user’s choice set. This information is of-         viewed [5]. YouTube attempts to identify the subset of
    ten available in published white papers, but in some           previously viewed videos that the user enjoyed by con-
    cases it may require experimentation.                          sidering only those videos that the user watched for a
 2. Create a “seed” to pollute the user’s history. Given           long period of time. Typically, YouTube recommends
    some knowledge of the personalization algorithm                videos that other users with similar viewing histories
    and a goal for how to affect the choice set, the at-              1 A demo video is available at http://www.youtube.com/

    tacker must design the seed that is used to affect             watch?v=8hij52ws98A.


                                                               3

USENIX Association                                                                     22nd USENIX Security Symposium 673
have also enjoyed. YouTube tracks the co-visitation re-           attacker can convince YouTube that the user watched, but
lationship between pairs of videos, which reflects how            did not enjoy, these unwanted videos, so their inclusion
likely a user who watched a substantial portion of video          in ΩS will not lead to additional recommendations.
X will also watch and enjoy video Y . In general, there
may be more videos with co-visitation relationships than
there is display area, so YouTube prioritizes videos with         Fabricating Relationships. For some videos, it may
high rankings. YouTube will not recommend a video the             be difficult to identify a seed set ΩS that recommends all
user has already watched.                                         of the elements of ΩT due to lack of co-visitation rela-
   YouTube displays recommended videos in the sugges-             tionships for some of the target elements. Instead, attack-
tion list placed alongside with a playing video (e.g., Fig-       ers who upload their own content to use as the seed set
ure 5) and in the main portion of the screen at the end of        can create co-visitation relationships between this con-
a video (Figure 1(a)). A suggestion list appearing next to        tent and the target set. In particular, an attacker uploads
a video typically contains 20–40 suggested videos, two            a set of videos, Ω0 , and establishes co-visitation relation-
of which are recommended based upon personalization.              ships between Ω0 and ΩT through crowd-sourcing (e.g.,
At the end of a video, YouTube shows an more concise              Mechanical Turk or a botnet): YouTube visitors need
version of the suggestion list that contains only twelve of       only watch a video in Ω0 followed by a video in ΩT .
the videos from the full list; these videos may or may not        After a sufficient number of viewing pairs, the attacker
contain personal recommendations.                                 can use videos in Ω0 as the seed set. As we will show in
                                                                  Section 3.4.1, a relatively small number of viewing pairs
3.2    Preparing Seed Videos                                      suffices.

YouTube organizes videos into channels, where each
channel corresponds to the set of uploads from a particu-         3.3    Injecting Seed Videos
lar user. In our attack, we seek to promote a set of target
videos, ΩT , all belonging to the same YouTube channel,           To launch the attack and inject seed videos into a
C. To do so, we will use an additional set of seed videos,        victim’s YouTube watch history, an attacker can harness
ΩS , that have a co-visitation relationship with the target       XSRF to forge the following two HTTP requests for each
videos. By polluting a user’s watch history with videos in        video in the seed set: (1) http://www.youtube.com/
ΩS , we can cause YouTube to recommend videos in ΩT .             user_watch?plid=<value>&video_id=<value>,
There are two ways to obtain ΩS : we can identify videos          and (2) http://www.youtube.com/set_awesome?
with pre-existing co-visitation relationships to the target       plid=<value>&video_id=<value>, where plid
videos, or we can create the relationships ourselves.             and video id correspond to the values found in the
                                                                  source code of the seed video’s YouTube page. The
Existing Relationships. In the simplest version of the            first HTTP request spoofs a request from the victim to
attack, the attacker identifies existing videos to use as         start watching the seed video, and the second convinces
the seed set. For example, given a target video set               YouTube that the victim watched the video for a long
ΩT belonging to channel C, the attacker could con-                period of time. Both HTTP requests are required for
sider all of the other videos in the channel, C − ΩT ,            videos in ΩS to trigger the recommendation of videos in
as candidate seeds. For every candidate video, the at-            ΩT , but only the first HTTP request is needed to prevent
tacker checks which videos YouTube recommends when                the recommendation of unwanted videos.
a fresh YouTube account (i.e., a YouTube account with
no history) watches it. YouTube allows its users to view
their recommended videos at http://www.youtube.                   3.4    Experimental Design
com/feed/recommended. If the candidate video trig-
gers YouTube to recommend a video in ΩT , then the at-            We evaluated the effectiveness of our attack both in con-
tacker adds the injected video to seed video set ΩS .             trolled environments and against real YouTube users. We
   In general, this process allows the attacker to identify       first validated the the attack in the simplest scenario,
seed videos for every target video in ΩT . The attacker           where the attack promoted existing YouTube channels
cannot yet launch the attack, though, because a YouTube           through existing co-visitation relationships. We then
video in ΩS may trigger YouTube to also recommend                 considered the scenario where an attack seemed to up-
videos not in ΩT . To address this issue, the attacker can        load and promote content from a channel that the attacker
simply add these unwanted videos to the seed video set            created. Finally, we conducted a small-scale experiment
ΩS because YouTube does not recommend videos that                 to demonstrate the effectiveness of the attack against a
the user has already watched. As we will show later, the          volunteer set of real YouTube users.


                                                              4
674 22nd USENIX Security Symposium                                                                        USENIX Association
3.4.1   New Accounts




                                                                                      0.3
We first promoted existing YouTube channels by launch-




                                                                     Promotion rate
ing our attack against victims with fresh YouTube user




                                                                                      0.2
accounts. This experiment confirms the effectiveness of
our approach in the absence of other, potentially counter-




                                                                                      0.1
vailing influences, such as recommendations based on a
user’s existing history.




                                                                                      0.0
   We began by selecting 100 existing YouTube channels                                      1   3   5   7   9 11    14   17   20   23
at random from the list of the top 2,000 most-subscribed                                                    Target video ID
channels published by VidStatsX [19]. For each of the
selected YouTube channels, we randomly selected 25                  Figure 3: The promotion rate for each of the 25 target
videos from the channel as the target video set, used the           videos in channel lady16makeup. Two videos were rec-
method described in the previous section to identify a              ommended in each of the 114 trials.
seed video set, and injected the seed videos to a fresh
YouTube account.
                                                                    hood for being recommended as a result of a co-visitation
   We then considered promoting new content by creat-
                                                                    relationship with another video.
ing our own YouTube channel and similarly attacking
                                                                       Similar to the experiments with new accounts, we ran-
fresh YouTube accounts. Our YouTube channel contains
                                                                    domly selected 15 target videos from channel Onlyy-
two 3-minute videos. We selected one of the videos as
                                                                    ouHappycamp, identified a seed set, and injected the
a one-element target video set and used the other as the
                                                                    seed videos into the volunteers’ YouTube accounts. Af-
seed set. We created a co-visitation relationship by em-
                                                                    ter pollution, the volunteers were asked to use their ac-
bedding both videos on a web page and recruiting volun-
                                                                    counts to watch three videos of their choice and report
teers to watch both videos sequentially. We obtained 65
                                                                    the suggestion list displaying alongside each of their
and 68 views for our seed and target video respectively.
                                                                    three videos.

3.4.2   Existing Accounts
                                                                    3.5                Evaluation
We studied the effectiveness of our pollution attack using
real YouTube user accounts. We recruited 22 volunteers              We evaluated the effectiveness of our pollution attacks
with extensive pre-existing YouTube watch histories. To             by logging in as the victim user and viewing 114 repre-
limit the inconvenience to our volunteers, we limited our           sentative videos3 . We measured the effectiveness of our
study to attempting to promote one moderately popular               attack in terms of promotion rate: the fraction of the 114
YouTube channel based upon existing co-visitation rela-             viewings when at least one of the target videos was con-
tionships. We selected a moderately popular account be-             tained within the video suggestion list. Recall that the
cause a popular channel may be recommended anyway                   list contains at most two personalized recommendations
(regardless of out attack); conversely, an entirely new             (see Section 3.1); we deem the attack successful if one
channel requires a certain amount of effort to establish            or both of these videos are videos that were promoted as
the co-visitation relationships as described above and we           a result of a pollution attack.
have limited volunteer resources.
   Based on these parameters, we arbitrarily selected the           3.5.1              New Accounts
channel OnlyyouHappycamp. We believe this selection
is a reasonable candidate to be promoted using our attack           Pollution attacks successfully promoted target videos
for several reasons. First, compared to popular chan-               from each of the 100 selected existing channels: Each
nels, most videos in OnlyyouHappycamp have low view                 time we injected seed videos for a particular channel, we
counts (about 2,000 view counts per video on average)               observed the target videos in the suggestion list for each
and the number of subscribers to the channel is a simi-             of the 114 videos. Since these are fresh accounts, there
larly modest 3,552. Both of these are easily achievable             is no other history, so our targeted videos always occupy
by an attacker at fairly low cost2 . Second, most videos in         both of the personalized recommendation slots.
OnlyyouHappycamp are 22 minutes long, which makes                      In addition, we observed the particular target videos
them suitable for promotion. As we will explain in Sec-             shown in the suggestion video list varied, even when
tion 3.5.1, the length of a target video affects its likeli-
                                                                       3 We attempted to view 150 videos random from a trace of YouTube
  2 According    to the prices in underground markets such as       usage at our institution over the course of several months. Unfortu-
freelancer.com and fiverr.com, 40,000 view counts and 10,000        nately, 36 of the videos were no longer available at the time of our
subscribers cost $15 and $30 US dollars, respectively.              experiment.


                                                                5
USENIX Association                                                                                  22nd USENIX Security Symposium 675
     0.6




                                                           0.6
     0.5




                                                           0.5
Promotion rate
0.2 0.3 0.4




                                                      Promotion rate
                                                      0.2 0.3 0.4
     0.1




                                                           0.1
     0.0




                                                           0.0
                  1   2   3 4 5 6 7           8   9                     1 2 3 4 5 6 7 8 9        11
                          Target video rank                                  Target video rank


                 (a) Higher ranked video                               (b) Lower ranked video

Figure 4: Distribution of the suggestion slots occupied                                                   Figure 5: Suggestion lists before (left) and after (right)
by each of the two successfully promoted target videos.                                                   a pollution attack against a fresh YouTube user account.
                                                                                                          The video highlighted in red is our uploaded video.

we were viewing the same video using the same victim




                                                                                                                           1.0
YouTube account. In other words, every target video has
a chance to be promoted and shown on the suggestion
video list no matter which video a victim plays. Fig-




                                                                                                                           0.8
ure 3 shows the frequency with which each of the 25 tar-
get videos for a representative channel, lady16makeup.
                                                                                                          Promotion rate
In an attempt to explain this variation, we computed (1)
                                                                                                                           0.6
the Pearson correlation between the showing frequencies
and the lengths of the target videos for each channel (ρt );
(2) the Pearson correlation between the showing frequen-
                                                                                                                           0.4




cies and the view counts of these target videos for each
channel (ρcnt ). We found the average Pearson correla-
tion values are medium (ρt = 0.54) and moderate (ρcnt =
                                                                                                                           0.2




0.23), respectively. This suggests that both the length and
view count of a target video influence its recommenda-                                                                             200     500     1000   2000      5000   10000

tion frequency, but the length of a target video is a more                                                                                       Watch history
significant factor.                                                                                       Figure 6: Promotion success rates for 10 real YouTube
   Since screen real estate is precious, and users typically                                              user accounts with varying watch history lengths.
focus on the first few items of a list, we report on the po-
sition within the suggested video lists that our targeted
videos occupied when they were promoted. We observed                                                      small that we did not lead YouTube to conclude that our
that the two target videos were usually placed back-to-                                                   content was, in fact, universally popular. Figure 5 shows
back on the suggestion list. Figure 4 shows that YouTube                                                  a sample screenshot comparing the suggestion lists from
usually placed our target videos among the top few spots                                                  a victim account and another, non-exploited fresh ac-
of a victim’s suggestion list: in our tests with new ac-                                                  count. Finally, we found that one of our target videos
counts, the target videos were always recommended and                                                     occupied the top suggestion slot while viewing 80 out of
placed on the top 12, which meant they also appeared                                                      the 114 test videos.
at the end of viewed videos. This finding is particu-
larly significant because it implies that our target videos                                               3.5.2                  Existing Accounts
are shown even if a victim finishes watching a YouTube
video on a third-party website (which typically embeds                                                    Our attacks were somewhat less successful on real
only the view-screen portion of the YouTube page, and                                                     YouTube accounts. We found that 14 out of the 22 volun-
not the full suggestion list).                                                                            teer YouTube users reported that at least one of our tar-
   Our attacks were similarly completely successful in                                                    get videos from channel OnlyyouHappycamp appeared
promoting newly uploaded content. As a control, we                                                        in the suggestion list during each of their three video
also signed in as non-polluted fresh YouTube accounts                                                     viewings, a 64% promotion rate.
and, unsurprisingly, did not find any of our new con-                                                        To understand why we were able to exploit some ac-
tent among the videos in the suggestion list. In other                                                    counts and not others, we asked our volunteers to share
words, the videos were recommended exclusively be-                                                        their YouTube watch histories. Ten of our volunteers
cause of our attacks; our experiments were sufficiently                                                   shared their histories with us and allowed us to sign in to

                                                                                                      6

676 22nd USENIX Security Symposium                                                                                                                               USENIX Association
their YouTube accounts to conduct a further study. The              are not public, but many previous studies have explored
number of videos in the watch histories of the ten vol-             aspects of personalized search [2,4,6,7,9,10,14–18]. We
unteers ranged from a few hundred to tens of thousands.             describe two classes of personalization algorithms: con-
Figure 6 shows the relationship between the number of               textual personalization and persistent personalization.
watched videos in a watch history and the number of                 According to recent reports [11,12], many search engines
times that at least one of our target videos is displayed           including Google, Bing, and Yahoo! apply both types of
along with a playing video. While there appears to be an            personalization.
intuitive decreasing trend (i.e., the longer the history an            Contextual personalization constructs a short-term
account has the more resistant it is to pollution), there are       user profile based on recent searches and clicks-
obvious outliers. For example, one account with almost              through [4, 16]. When a user searches for “inexpen-
3,500 previous viewings in its history succumbed to our             sive furniture” followed by “maternity clothes,” Google’s
attacks almost 80% of the time.                                     contextual personalization algorithm typically promotes
   Consistent with the Pearson coefficients reported ear-           search results that relate to “inexpensive maternity
lier, we found that the success of our attacks depends on           clothes” for the next few searches (we provide an anal-
the rankings and lengths of the videos that are otherwise           ysis of precisely how long this effect lasts in Ap-
suggested based upon a user’s history. In particular, we            pendix A.2). In contrast, persistent personalization uses
observed that the majority of the videos recommended                the entire search history—as opposed to only recent
to users for whom our attacks have low promotion rates              searches—to develop a user profile [9, 15]. Personaliza-
have longer lengths and more view counts than our tar-              tion that occurs over the longer term may not affect a
get videos, while the videos that YouTube recommends                user’s search results as dramatically, but can have longer-
based on the watch history of the user with 3,500 previ-            lasting effects for the results that a user sees. For exam-
ous viewings have shorter lengths than our target videos            ple, searching for “Egypt” using different accounts may
(though they generally have higher view counts than our             result in two distinct result sets: one about tourism in
targets).                                                           Egypt and one related to the Arab Spring.
   Although we believe our attack demonstrates that
YouTube’s personalization mechanism is subject to ex-               4.2    Identifying Search Terms
ploit, the persistence of the attack effects is unclear. In
our experiments, volunteers watched arbitrary YouTube               Given the differing underlying algorithms that govern
videos right after being attacked, but we believe our pol-          contextual and persistent personalization, an attacker
lution attacks on YouTube are likely to last for some               needs to select different sets of seed search terms depend-
time. Although YouTube does not explicitly disclose                 ing on the type of attack she hopes to launch.
how time factors into their recommendation system (if
at all) [5], analysis of volunteers’ watch histories indi-          Contextual Personalization. For the contextual per-
cates that a YouTube video that was watched as long as              sonalization attack, the keywords injected into a user’s
two weeks prior is still used for generating recommended            search history should be both relevant to the promot-
videos.                                                             ing keyword and unique to the website being promoted.
                                                                    In particular, the keywords should be independent from
4     Google Personalized Search                                    other websites that have similar ranking in the search re-
                                                                    sults, to ensure that only the target website is promoted.
In this section, we show how history pollution attacks              Presumably, an attacker promoting a specific website is
can be launched against Google’s search engine4 . The               familiar with the website and knows what keywords best
goal of our attack is to promote a target webpage’s rank            meet these criteria, but good candidate keywords are also
in the personalized results that Google returns for an ar-          available in a website’s meta keyword tag. While Google
bitrary search term by injecting seed search terms into a           no longer incorporates meta tags into their ranking func-
victim’s search history.                                            tion [3], the keywords listed in the meta keyword tag still
                                                                    provide a good summary of the page’s content.
4.1    Search Personalization
                                                                    Persistent Personalization. Launching a persistent
Search personalization customizes search results using              personalization attack requires a different method of ob-
information about users, including their previous query             taining keywords to inject. In this case, the size of the
terms, click-through data and previously visited web-               keyword set should be larger than that used for a contex-
sites. The details of Google’s personalization algorithms           tual attack in order to have a greater effect on the user’s
   4 A demo video is available at http://www.youtube.com/           search history. Recall that contextual attacks only affect
watch?v=73E5CLFYeu8.                                                a user’s current session, while persistent attacks pollute


                                                                7
USENIX Association                                                                    22nd USENIX Security Symposium 677
a user’s search history in order to have a lasting effect on       represents a conservative lower bound on the effective-
the user’s search results. An attacker can determine suit-         ness of the attack, as any individual website owner could
able keywords using the Google AdWords tool, which                 engineer the content of their site to tailor it for promotion
takes as an input a search term and URL and produces a             through search history pollution.
list of about one hundred related keywords. Ideally, an
attacker could pollute a user’s search history with each
                                                                   4.4.1   Contextual Pollution
of these terms, but a more efficient attack should be ef-
fective with a much smaller set of keywords. We deter-             We started by scraping 5,671 shopping-related keywords
mined that an attacker can safely inject roughly 50 key-           from made-in-china.com to use as search terms. We
words a minute using cross-site request forgery; more              then entered each of these terms into Google one-by-one
rapid search queries are flagged by Google as a screen-            to obtain the top 30 (un-personalized) search results for
scraping attack. For this study, we assume an attacker             each. Since some of our search terms are related, not all
can inject at most 25 keywords into a user’s profile, but          of these URLs are unique. Additionally, we cannot hope
the number of keywords can increase if the user stays on           to improve the URLs that are already top-ranked for each
a webpage for more than 30 seconds. Not all keyword                of the search terms. We obtained 151,363 URLs whose
lists that AdWords returns actually promote the target             ranking we could hope to improve.
website. The effectiveness of this attack likely depends              Because we cannot manually inspect each of these
on several factors, including the user’s current search his-       websites to determine appropriate seed search terms, we
tory. In Section 4.5, we evaluate the effectiveness of this        instead focused a subset that include the meta keyword
attack under different conditions.                                 tag. For the approximately 90,000 such sites, we ex-
                                                                   tracted the meta keywords or phrases from the website.
4.3    Injecting Search Terms                                      Many of these keywords are generic and will appear in
                                                                   a wide variety of websites. To launch the attack, we re-
As with the pollution attacks on YouTube, the attack on            quire keywords that are unique to the website we wish to
Google’s personalized search also uses XSRF to inject              promote (at least relative to the other URLs returned in
the seeds. For example, an attacker can forge a Google             response to the same query), so we ignored any keywords
search by embedding https://www.google.com/                        that were associated with multiple URLs in the same set
search?hl=en&site=&q=usenix+security+2013                          of search results.
into an invisible iframe. A Web browser will issue                    This procedure ultimately yielded 2,136 target URLs
an embedded HTTP request, even if Google search                    spanning 1,739 different search terms, for which we had
response has an enabled X-Frame-Option header.                     a set of 1–3 seed keywords to try to launch a contextual
Injecting search terms into a Google user’s account                pollution attack. The average search term has 1.23 results
affects the search results of the user’s subsequent                whose ranking we tried to improve. Figure 11 in the Ap-
searches. The number and set of search terms to inject             pendix shows the distribution of the original rankings for
differs depending on whether an attacker can execute a             each of these target websites; the distribution is skewed
contextual or persistent personalization attack.                   toward highly ranked sites, perhaps because these sites
                                                                   take care in selecting their meta tag keywords.
4.4    Experimental Design
                                                                   4.4.2   Persistent Pollution
To cleanly study the effects of our proposed attacks on
contextual and persistent search personalization, we con-          Once again, we begin by selecting 551 shopping-related
ducted most of our experiments using Google accounts               search terms and perform Google searches with each of
with no search history. To validate whether our results            the search terms to retrieve the top 30 search results. As
apply to real users, we also conducted a limited number            opposed to the contextual attack, where we search for
of tests using accounts that we constructed to mimic the           keywords that differentiate the results from one another,
personae of real users.                                            we aim to determine search terms that will be associated
   To quantify the effectiveness of our attack in general,         with the website and search-term pair for the long term.
we must select an unbiased set of target web pages whose              As described in Section 4.2, we use a tool provided by
rankings we wish to improve. We built two test corpora,            Google AdWords to obtain a set of keywords that Google
one for attacks on contextual personalization, and one for         associates with the given URL and search term. Con-
attacks on persistent personalization. We attempted to             structing related keyword lists for each of the 29 search
promote existing web sites using only their current con-           returns (again excluding the top hit, which we cannot
tent and link structure; we did not perform any SEO on             hope to improve) and 551 search terms yields 15,979 dis-
websites before conducting the attacks. We believe this            tinct URLs with associated lists of keywords.


                                                               8
678 22nd USENIX Security Symposium                                                                         USENIX Association
   For each URL, we select 25 random keywords from                  ceeded 4.3% of the time, and moving a tenth-ranked
the AdWords list for 25 distinct trials. If a trial improved        URL to a higher-ranked position succeeded 22.7% of the
a URL’s ranking, we then test the persistence of the at-            time. These results make sense, because second-ranked
tack by performing 20 subsequent queries, each with                 sites can only move into the top-ranked position, whereas
a randomly chosen set of Google trending keywords.                  sites that are ranked tenth can move into any one of nine
These subsequent queries help us verify that the URL                higher spots.
promotion is not just contextual, but does not vanish
                                                                       To illustrate this effect and illuminate how far each
when a user searches other content. If after all 25 trials
                                                                    webpage was promoted, Figure 7 shows the PDF of an
we find no keyword sets that promote the URL’s ranking
                                                                    improved webpage’s rank after contextual history pol-
and keep it there for 20 subsequent searchers, we deem
                                                                    lution, based upon its position in the non-personalized
this URL attempt a failure. If multiple keyword sets suc-
                                                                    search results. We observed that contextual pollution was
ceed, we select the most effective (i.e., the set of 25 key-
                                                                    able to promote most webpages by one or two spots, but
words that induces the largest ranking improvement) trial
                                                                    some low-ranking webpages were also promoted to very
to include in the test set.
                                                                    high ranks. Similarly, Figure 8 shows the distributions
                                                                    for each result ranking for those websites whose rankings
4.5     Evaluation                                                  were improved by a persistent history pollution attack.
                                                                    Here, the distributions appear roughly similar (although
In this section, we quantify the effectiveness of search            the absolute probability of success is much lower), but
history pollution with attacks that aimed to promote the            it is difficult to draw any strong conclusions due to the
target websites identified in the previous section. To              small number of promoted sites of each rank for either
scope our measurements, we consider the effectiveness               class of attack.
of the attacks only for the set of search terms that we
identify; it is quite possible, of course, that our pollution
attacks also affect the rankings of the targeted URLs for
other search terms.
   When measuring the effectiveness of our attack, we               4.5.2   The Next Tier
use two different criteria, depending upon a website’s
original position in the search results. In the case of
URLs that are already in the first ten search results but           The remaining 1,290 test websites for the contextual at-
not ranked first, we consider the pollution attack success-         tack were initially on the second or third page of search
ful if it increases the ranking of a URL at all. For URLs           results. By polluting a user’s search history with the
subsequent pages, we consider the attack successful only            unique meta tag keywords associated with each site, we
if the attack moves the URL to the first page of search             promoted 358 of them (28%) to the front page. Fig-
results, since improved ranking on any page that is not             ure 7(j) shows that these websites were more likely to
the first page is unlikely to have any utility.                     appear at the top of the results than those pages that were
                                                                    initially at the bottom of the first page. We suspect this
                                                                    phenomenon results from the choice of keywords used
4.5.1   Top-Ranked Sites                                            in pollution: because their original rankings were low,
                                                                    the pollution attack requires a distinguishing keyword to
For the 2,136-page contextual attack test corpus, of the
                                                                    move one of the webpages to the front page at all. If
846 pages that appeared on the front page prior to our
                                                                    such a keyword can move a search result to the first page,
attack, we improved the ranking of 371 (44%). The per-
                                                                    it might also be a good enough keyword to promote the
sistent attack was markedly less effective, with only 851
                                                                    page to a high rank on the first page, as well.
(17%) of the 4,959 test cases that originally appeared
on the first page of the search results had ranking im-                The results from the persistent test set are markedly
provements surviving the persistence test (i.e., they re-           different. Figure 8(j) shows that sites starting on the sec-
mained promoted after 20 random subsequent queries).                ond or third page are unlikely to end up at the very top
In both cases, however, the probability of success de-              of the result list due to a persistent history attack: Only
pends greatly on the original ranking of the targeted               80 (less than 1%) of the 11,020 attacks that attempted
URL. For example, promoting a second-ranked URL                     to promote a website appearing on the 2nd or 3rd page
to the top-ranked position for contextual personalization           of results was successful in moving it to the front page
succeeded 1.1% of the time, whereas promoting a tenth-              (and keeping it there). This results shows that persis-
ranked URL by at least one position succeeded 62.8%                 tent search history attacks are generally best launched for
of the time. Similarly, for attacks on persistent person-           sites that are already highly ranked, as opposed to con-
alization, moving a second-ranked URL to the top suc-               textual attacks, which can help even lower-ranked sites.

                                                                9
USENIX Association                                                                     22nd USENIX Security Symposium 679
                                                                                               Promotion rate
 Promotion rate




                                                                                                                                               Promotion rate
                                                Promotion rate




                                                                                                                                                                                              Promotion rate
                  0.6




                                                                 0.6




                                                                                                                0.6




                                                                                                                                                                0.6




                                                                                                                                                                                                               0.6
                  0.4




                                                                 0.4




                                                                                                                0.4




                                                                                                                                                                0.4




                                                                                                                                                                                                               0.4
                  0.2




                                                                 0.2




                                                                                                                0.2




                                                                                                                                                                0.2




                                                                                                                                                                                                               0.2
                  0.0




                                                                 0.0




                                                                                                                0.0




                                                                                                                                                                0.0




                                                                                                                                                                                                               0.0
                        1     3    5   7   9                           1     3    5   7   9                           1     3    5   7   9                            1     3    5   7   9                           1     3    5   7   9

                            Personalized rank                              Personalized rank                              Personalized rank                               Personalized rank                              Personalized rank

(a) Non-personalized rank (b) Non-personalized rank (c) Non-personalized rank (d) Non-personalized rank (e) Non-personalized rank
=2                        =3                        =4                        =5                        =6




                                                                                               Promotion rate




                                                                                                                                                                                              Promotion rate
                                                Promotion rate




                                                                                                                                               Promotion rate
 Promotion rate
                  0.6




                                                                 0.6




                                                                                                                0.6




                                                                                                                                                                0.6




                                                                                                                                                                                                               0.6
                  0.4




                                                                 0.4




                                                                                                                0.4




                                                                                                                                                                0.4




                                                                                                                                                                                                               0.4
                  0.2




                                                                 0.2




                                                                                                                0.2




                                                                                                                                                                0.2




                                                                                                                                                                                                               0.2
                  0.0




                                                                 0.0




                                                                                                                0.0




                                                                                                                                                                0.0




                                                                                                                                                                                                               0.0
                        1     3    5   7   9                           1     3    5   7   9                           1     3    5   7   9                            1     3    5   7   9                           1     3    5   7   9

                            Personalized rank                              Personalized rank                              Personalized rank                               Personalized rank                              Personalized rank

(f) Non-personalized rank (g) Non-personalized rank (h) Non-personalized rank (i) Non-personalized rank = (j) Non-personalized rank
=7                        =8                        =9                        10                          > 10

      Figure 7: Promotion rates of promoted Google search rankings for successful contextual history pollution attacks.



4.5.3                   Real Users                                                                                                   previous purchase, browsing and searching behavior of
                                                                                                                                     the user. Amazon product recommendations consider
We also evaluate the effectiveness of pollution attacks                                                                              each of these three activities individually and explicitly
on ten volunteers’ accounts with extensive pre-existing                                                                              labels its recommendations according to the aspect of the
search histories. We find that, on average, 97.1% of our                                                                             user’s history it used to generate them. We focused on the
729 previously successful contextual attacks remain suc-                                                                             personalized recommendations Amazon generates based
cessful, while only 77.78% of the persistent pollution at-                                                                           on the browsing and searching activities of a customer
tacks that work on fresh accounts achieve similar suc-                                                                               because manipulating the previous purchase history of a
cess. We believe that users’ search histories sometimes                                                                              customer may have unintended consequences.
interfere with the attacks, and that user history inter-
feres more with the attacks on persistent personalization.
Contextualized attacks rely only on a small set of re-                                                                               5.1      Amazon Recommendations
cent search terms to alter the personalized search results,
which is unlikely to be affected by a user’s search history.                                                                         Amazon displays five recommendation lists on a cus-
In contrast, pollution attacks against persistent personal-                                                                          tomer’s homepage that are ostensibly computed based on
ization rely on more of a user’s search history. If relevant                                                                         the customer’s searching and browsing history. Four of
keywords are already present in a user’s search history,                                                                             these lists are derived from the products that the customer
keyword pollution may be less effective. In any event,                                                                               has recently viewed (view-based recommendation); the
both attacks are relatively robust, even when launched                                                                               fifth is based on the latest search term the customer en-
against users with long search histories.                                                                                            tered (search-based recommendation). For each of the
                                                                                                                                     view-based recommendation lists, Amazon uses relation-
                                                                                                                                     ships between products that are purchased together to
5                  Pollution Attacks on Amazon                                                                                       compute the corresponding recommended products; this
                                                                                                                                     concept is similar to the co-visitation relationship that
Of the three services, Amazon’s personalization is per-                                                                              YouTube uses to promote videos. For the recommenda-
haps the most evident to the end user. On one hand, this                                                                             tion list that is computed based on the latest search term
makes pollution-based attacks less insidious, as they will                                                                           of a customer, the recommended products are the top-
be visible to the observant user. On the other, of the three                                                                         ranked results for the latest search term.
services, Amazon has the most direct monetization path,                                                                                 In contrast to the types of personalization used for
since users may directly purchase the goods from Ama-                                                                                YouTube and Google Search, Amazon’s personalization
zon. Therefore, exploitation of Amazon’s personaliza-                                                                                is based on history that maintained by the user’s web
tion may be profitable to an enterprising attacker.                                                                                  browser, not by the service. Because customers fre-
   Amazon tailors a customer’s homepage based on the                                                                                 quently brows Amazon without being signed in, both the

                                                                                                                                10
680 22nd USENIX Security Symposium                                                                                                                                                                                   USENIX Association
                  0.30




                                                                  0.30




                                                                                                                  0.30




                                                                                                                                                                   0.30




                                                                                                                                                                                                                   0.30
                                                                                                 Promotion rate
 Promotion rate




                                                                                                                                                  Promotion rate




                                                                                                                                                                                                  Promotion rate
                                                 Promotion rate
                  0.20




                                                                  0.20




                                                                                                                  0.20




                                                                                                                                                                   0.20




                                                                                                                                                                                                                   0.20
                  0.10




                                                                  0.10




                                                                                                                  0.10




                                                                                                                                                                   0.10




                                                                                                                                                                                                                   0.10
                  0.00




                                                                  0.00




                                                                                                                  0.00




                                                                                                                                                                   0.00




                                                                                                                                                                                                                   0.00
                         1     3    5   7   9                            1     3    5   7   9                            1     3    5   7   9                             1     3    5   7   9                            1     3    5   7   9

                             Personalized rank                               Personalized rank                               Personalized rank                                Personalized rank                               Personalized rank

(a) Non-personalized rank (b) Non-personalized rank (c) Non-personalized rank (d) Non-personalized rank (e) Non-personalized rank
=2                        =3                        =4                        =5                        =6
                  0.30




                                                                  0.30




                                                                                                                  0.30




                                                                                                                                                                   0.30




                                                                                                                                                                                                                   0.30
                                                                                                                                                                                                  Promotion rate
 Promotion rate




                                                                                                                                                  Promotion rate
                                                 Promotion rate




                                                                                                 Promotion rate
                  0.20




                                                                  0.20




                                                                                                                  0.20




                                                                                                                                                                   0.20




                                                                                                                                                                                                                   0.20
                  0.10




                                                                  0.10




                                                                                                                  0.10




                                                                                                                                                                   0.10




                                                                                                                                                                                                                   0.10
                  0.00




                                                                  0.00




                                                                                                                  0.00




                                                                                                                                                                   0.00




                                                                                                                                                                                                                   0.00
                         1     3    5   7   9                            1     3    5   7   9                            1     3    5   7   9                             1     3    5   7   9                            1     3    5   7   9

                             Personalized rank                               Personalized rank                               Personalized rank                                Personalized rank                               Personalized rank

(f) Non-personalized rank (g) Non-personalized rank (h) Non-personalized rank (i) Non-personalized rank = (j) Non-personalized rank
=7                        =8                        =9                        10                          > 10

         Figure 8: Promotion rates of promoted Google search rankings for successful persistent history pollution attacks.


latest viewed products and search term of the customer                                                                                  Extractor”, an attacker can use XSRF to inject the search
are stored in session cookies on the user’s browser rather                                                                              term “Breville BJE200XL” to replace an Amazon cus-
than in profiles on Amazon servers.                                                                                                     tomer’s latest search term.

5.2                      Identifying Seed Products and Terms                                                                            5.3      Injecting Views and Searches
Because Amazon computes the view and search-based                                                                                       As with the attacks on the previous two services, the at-
recommendation lists separately, the seed data required                                                                                 tacker embeds the Amazon URLs of the desired seed
exploit each list must also be different.                                                                                               items or search queries into a website that the victim’s
                                                                                                                                        browser is induced to visit with XSRF. For example, if
Visit-Based Pollution. To promote a targeted product                                                                                    one seed search terms is “Coffee Maker”, the seed URL
in a view-based recommendation list, an attacker must                                                                                   would be something like http://www.amazon.com/s/
identify a seed product as follows. Given a targeted prod-                                                                              ?field-keywords=Coffee+Maker. Similarly, an at-
uct that an attacker wishes to promote, the attacker visits                                                                             tacker could embed the URL of a seed product into an
the Amazon page of the product and retrieves the related                                                                                invisible img tag as the src of the image. When a victim
products that are shown on Amazon page of the targeted                                                                                  visits the attacker’s website, Amazon receives the request
product. To test the suitability of these related products,                                                                             for that particular query or item and customizes the vic-
the attacker can visit the Amazon page of that product                                                                                  tim’s Amazon website based on that search.
and subsequently check the Amazon home page. If the
targeted product appears in a recommendation list, the
URL of the candidate related product can serve as a seed
                                                                                                                                        5.4      Experiment Design
to promote the targeted product.                                                                                                        To evaluate the effectiveness of the pollution attack
                                                                                                                                        against, we conducted two experiments. The first exper-
Search-Based Pollution. To promote a targeted prod-                                                                                     iment measured the effectiveness of our attack when tar-
uct in a search-based recommendation list, it suffices to                                                                               geted toward popular items across different categories of
identify an appropriate search term. If automation is de-                                                                               Amazon products. The second quantified the effective-
sired, an attacker could use a natural language toolkit to                                                                              ness of our attack on randomly selected, mostly unpopu-
automatically extract a candidate keyword set from the                                                                                  lar Amazon products.
targeted product’s name. Any combination of these key-
words that successfully isolates the targeted product can                                                                               5.4.1    Popular Products
be used as the seed search term for promoting the tar-
geted product. For example, to promote product “Bre-                                                                                    Amazon categorizes sellers’ products into 32 root cat-
ville BJE200XL Compact Juice Fountain 700-Watt Juice                                                                                    egories. To select products from each category, we


                                                                                                                                   11
USENIX Association                                                                                                                                                               22nd USENIX Security Symposium 681
                                                                                 View based           Search based
         1.0
                                         Promotion rate
         0.8
         0.6
         0.4
         0.2
         0.0




                   .C ov oo s
                    Pe ts.S me g




             Sp era tch ry
                               an y

                .C pr D ty

                         t.S ew nt




                 Vi t .C g
          Ar e.I che Be ces




                                 p g




                rs El cie es
                                d d




                   am W we s




                           S ms



                       so lo ies




                         c ftw s



                        ar ie ks
                               .S V
                   er C sor cs




             ne ic.A am e
                      ts S ho s
                 ffi m tc s
                         .P .Fo n




                           ag or e
             G M zines



                                      re
            d T O h to
    om ust oys utd oes


                          ce tro ific



                 M deo mo are

                 s. S lb es
                                       n




        H K pli Babs




                               e lie




         pu rial. .Gaoor
                        f e n




                       Aunal hin
                              up in
                             ro o




                     Ac o um
                              .P e
              O ur .Ki ent




                               a ie
                       Ap uct




                       s G tiv
                      ce et he




                       M ess ar
               .G m um e




                           ds s.T
             ts m n. au




                              a l




                                   to
                              s ni
                     ra ov ini
            ry o str ard




                     Ac ec nt


                                 t




                               B
         ce Hl.In .G




                             J




                            o
                            .
                    o e
                         n




                         .
   G sica aw




                     u
                  or
          om it




                    .
          u .L




                ift
               .P
                C
       M atio




             te

           lth




         ho
         In



        ea
         P




     l.P
      ro




      H




   el
  C




 C
                                 Figure 9: Promotion rates across Amazon categories.


scraped the top 100 best-selling products in each cate-           attacks produced similar promotion rates across all cate-
gory in January 2013 and launched a separate attack tar-          gories, about 78% on average. Two categories had sig-
geting each of these 3,200 items.                                 nificantly lower propotion rates: Gift-Cards-Store and
                                                                  Movies-TV (achieving 5% and 25%, respectively).
                                                                      To understand why these categories yielded lower pro-
5.4.2   Random Products
                                                                  motion rates, we analyzed the top 100 best selling prod-
To evaluate the effectiveness of the polution attack for          ucts for each category. For Gift-Cards-Store, we found
promoting arbitrary products, we also selected prod-              that there were two factors that distinguish gift cards
ucts randomly. We downloaded a list of Amazon Stan-               from other product types. First, the gift cards all had
dard Identification Number (ASIN) [1] that includes               similar names; therefore, using the keywords derived
75,115,473 ASIN records. Because each ASIN repre-                 from the product name resulted in only a small number
sents a Amazon product, we randomly sampled ASINs                 of specific gift cards being recommended. Second, we
from the list and constructed a set of 3,000 products cur-        found that searching any combination of keywords ex-
rently available for sale. For every randomly selected            tracted from the product names always caused a promo-
product in the list, we recorded the sale ranking of that         tion of Amazon’s own gift cards, which may imply that
product in its corresponding category.                            it is more difficult to promote product types that Amazon
                                                                  competes with directly.
                                                                      Further investigation into the Movies-TV category re-
5.5     Evaluation                                                vealed that Amazon recommends TV episodes differ-
                                                                  ently. In our attempts to promote specific TV episodes,
Because Amazon computes search and visit-based rec-
                                                                  we found that Amazon recommends instead the first or
ommendations based entirely upon the most recent his-
                                                                  latest episode of the corresponding TV series or the en-
tory, we can evaluate the effectiveness of the pollution
                                                                  tire series. Because we declared a promotion success-
attack without using Amazon accounts from real users.
                                                                  ful only if the exact ASIN appears in the recommenda-
Thus, we measured the effectiveness of our attack by
                                                                  tion lists, these alternate recommendations are consid-
studying the success rate of promoting our targeted prod-
                                                                  ered failures. These cases can also be considered suc-
ucts for fresh Amazon accounts.
                                                                  cessful because the attack caused the promotion of very
                                                                  similar products. Therefore, we believe that for all cat-
5.5.1   Promoting Products in Different Categories                egories except for Gift-Cards-Store, an attacker has a
                                                                  significant chance of successfully promoting best-selling
To evaluate the effectiveness of the pollution attack for         products.
each targeted product, we checked whether the ASIN of
the targeted product matches the ASIN of an item in the
                                                                  5.5.2   Promoting Randomly Selected Products
recommendation lists on the user’s customized Amazon
homepage.                                                         We launched pollution attacks on 3,000 randomly se-
   Figure 9 illustrates the promotion rate of target prod-        lected products. We calculated the Cumulative Success
ucts in each category. The view-based and search-based            Rate of products with respect to their rankings. The Cu-


                                                             12
682 22nd USENIX Security Symposium                                                                     USENIX Association
                                                                   a complex network infrastructure, which may consist
                                                                   of hundreds of search-indexed websites (preferably with
                                                                   non-trivial reputations at established search engines) to
                                                                   coordinate and form a link farm [20]. These infrastruc-
                                                                   tures not only require a considerable amount of money
                                                                   to build and maintain, but also take time to mature and
                                                                   reach their full effectiveness [8]. By contrast, launching
                                                                   a search history pollution attack is significantly easier.
                                                                      We showed in Section 4 that a user’s personalized
                                                                   search results can be manipulated simply by issuing
                                                                   crafted search queries to Google. Without requiring any
                                                                   external support, the entire process happens instantly
Figure 10: Cumulative promotion rates across varying               while the user is visiting the offending Web page. Al-
product ranks for different Amazon pollution attacks.              though our attack targets individual search users (i.e., the
                                                                   polluted result is only visible to individual victims), it by
mulative Success Rate for a given range of product rank-           no means limits the scale of the victim population, espe-
ings is defined as the ratio of the number of successfully         cially if an exploit is placed on a high-profile, frequently
promoted products to the number of target products in              visited website.
that range.
   Figure 10 shows the cumulative promotion rate for dif-
ferent product rankings for the two different types of pol-        7   Discussion
lution attacks. As the target product decreases in popu-
larity (i.e., has a higher ranking position within its cat-        Our current study has several limitations. Most notably,
egory) pollution attacks become less effective, but this           the scale of our experiments is modest, but because we
phenomenon reflects a limitation of Amazon recommen-               typically randomly select the target items, we believe that
dation algorithms, not our attack. Products with low               the results of our experiments are representative, and that
rankings might not be purchased as often; as a result,             they illustrate the substantial potential impacts of pollu-
they may have few and weak co-visit and co-purchase re-            tion attacks. Similarly, our specific pollution attacks are
lationships with other products. Our preliminary inves-            fragile, as each service can take relatively simple steps to
tigation finds that products which rank 2,000 or higher            defend againt them.
within their category have at least a 50% chance of be-
                                                                      A possible defense against pollution attacks arises
ing promoted by a visit-based pollution attack, and prod-
                                                                   from the fact that cross-site request forgery can be
ucts with rankings 10,000 and higher have at least a 30%
                                                                   stopped if requests to a website must carry tokens issued
chance to be promoted using search-based attacks.
                                                                   by the site. Enforcing this constraint, however, also pre-
                                                                   vents information and behaviors at third-party sites from
6   Related Work                                                   being harvested for personalization and hampers the cur-
                                                                   rent trend of increasing the scope of data collection by
To the best of our knowledge, the line of work most                websites for improved personalization. One short-term
closely related to ours is black-hat search engine op-             effect from this study may be that (some) websites will
timization (bSEO). Although sharing a common goal                  begin to consider the tradeoffs between the security and
as search history pollution—illicitly promoting website            benefits of personalization.
rankings in search results—bSEO follows a completely                  YouTube in particular uses two separate HTTP re-
different approach, exploiting a search engine’s reliance          quests to track a YouTube’s user viewing activity that
on crawled Web content. Blackhat SEO engineers the                 are independent from the act of streaming of the video.
content of and links to Web pages to obtain a favorable            One straightforward defense against pollution attacks is
ranking for search terms of interest [8]. Thus, techniques         to monitor the time between the arrivals of the two HTTP
that address bSEO are unlikely to be effective against             requests. If YouTube finds the interval is substantially
pollution attacks. On the other hand, because bSEO                 less than the length of the video, it could ignore the sig-
targets the general indexing and ranking process inside            nal. An attacker can still always inject a short video or
search engines, any successfully promoted website will             control the timing of the HTTP requests in an effort to
be visible to all search engine users, potentially signifi-        bypass such a defense mechanism. We did notice that
cantly boosting the volume of incoming traffic. Yet, ef-           an injected short video can be used to promote multi-
fective bSEO campaigns typically involve support from              ple longer videos; for example, watching a single two-

                                                              13
USENIX Association                                                                    22nd USENIX Security Symposium 683
second video5 causes YouTube to recommend several                           International ACM SIGIR Conference on Research and
long videos.                                                                Development in Information Retrieval (2011).
                                                                        [3] C UTTS , M. Does Google use the “keywords” meta tag?
                                                                            http://www.youtube.com/watch?v=jK7IPbnmvVU.
8    Conclusion
                                                                        [4] DAOUD ,     M.,    TAMINE -L ECHANI ,     L.,    AND
                                                                            B OUGHANEM , M.        A session based personalized
In this paper, we present a new attack on personalized
                                                                            search using an ontological user profile. In Proceed-
services that exploits the fact that personalized services                  ings of The 24th Annual ACM Symposium on Applied
use a user’s past history to customize content that they                    Computing (2009).
present to the user. Our attack pollutes a user’s history
                                                                        [5] DAVIDSON , J., L IEBALD , B., L IU , J., NANDY, P.,
by using cross-site request forgery to stealthily inject and
                                                                            VAN V LEET, T., G ARGI , U., G UPTA , S., H E , Y., L AM -
execute a set of targeted browsing activities in the user’s                 BERT, M., L IVINGSTON , B., AND S AMPATH , D. The
browser, so that when the user subsequently accesses the                    YouTube video recommendation system. In Proceedings
associated service specific content is promoted. We illus-                  of the 4th ACM Conference on Recommender Systems
trate how an attacker can pollute a user’s history to pro-                  (2010).
mote certain content across three platforms. While our                  [6] D OU , Z., S ONG , R., AND W EN , J.-R. A large-scale
attack is simple, its impact can be significant if enough                   evaluation and analysis of personalized search strategies.
users’ histories are compromised.                                           In Proceedings of the 16th ACM International Conference
   As personalization algorithms and mechanisms in-                         on the World Wide Web (2007).
creasingly control our interactions with the Internet, it is            [7] L IU , F., Y U , C., AND M ENG , W. Personalized web
inevitable that they will become the targets of financially                 search by mapping user queries to categories. In Pro-
motivated attacks. While we demonstrate pollution at-                       ceedings of the 11th ACM International Conference on
tacks on only YouTube, Google, and Amazon, we believe                       Information and Knowledge Management (2002).
that our methods are general and can be widely applied to               [8] L U , L., P ERDISCI , R., AND L EE , W. Surf: detecting
services that leverage personalization technologies, such                   and measuring search poisoning. In Proceedings of the
as Facebook, Twitter, Netflix, Pandora, etc. The attacks                    18th ACM Conference on Computer and communications
we present here are just the first few examples of poten-                   security (2011).
tially many possible attacks on personalization. With in-               [9] M ATTHIJS , N., AND R ADLINSKI , F. Personalizing Web
creasingly complex algorithms and data collection mech-                     search using long term browsing history. In The Fourth
anisms aiming for ever higher financial stakes, there are                   ACM International Conference on Web Search and Data
bound to be vulnerabilities that will be exploited by moti-                 Mining (2011).
vated attackers. The age of innocence for personalization              [10] Q IU , F., AND C HO , J. Automatic identication of user
is over; we must now face the challenge of securing it.                     interest for personalized search. In Proceedings of the
                                                                            15th ACM International Conference on the World Wide
                                                                            Web (2006).
Acknowledgments                                                        [11] S EARCH E NGINE L AND. Bing results get localized
                                                                            & personalized. http://searchengineland.com/
This research was supported in part by the National                         bing-results-get-localized-personalized-
Science Foundation under grants CNS-1255453, CNS-                           64284.
1255314, CNS-1111723, and CNS-0831300, and the Of-                     [12] S EARCH E NGINE L AND. Google now personalizes
fice of Naval Research under grant no. N000140911042.                       everyones search results. http://searchengineland.
Any opinions, findings, and conclusions or recommenda-                      com/google-now-personalizes-everyones-
tions expressed in this material are those of the authors                   search-results-31195.
and do not necessarily reflect the views of the National               [13] S HIFLETT, C.       Cross-site request forgeries.
Science Foundation or the Office of Naval Research.                         http://shiflett.org/articles/cross-site-
                                                                            request-forgeries, 2004.
References                                                             [14] S IEG , A., M OBASHER , B., AND B URKE , R. Web search
                                                                            personalization with ontological user profiles. In Pro-
 [1] Amazon.com product identifiers.       http://archive.                  ceedings of the 16th ACM Conference on Conference on
     org/details/asin_listing.                                              Information and Knowledge Management (2007).
 [2] B ENNETT, P. N., R ADLINSKI , F., W HITE , R. W., AND             [15] S ONTAG , D., C OLLINS -T HOMPSON , K., B ENNETT,
     Y ILMAZ , E. Inferring and using location metadata to per-             P. N., W HITE , R. W., D UMAIS , S., AND B ILLERBECK ,
     sonalize web search. In Proceedings of the 34th Annual                 B. Probabilistic models for personalizing Web search. In
                                                                            Proceedings of the 5th ACM International Conference on
    5 http://www.youtube.com/watch?v=UPXK3AeRvKE                            Web Search and Data Mining (2012).


                                                                  14
684 22nd USENIX Security Symposium                                                                              USENIX Association
[16] S RIRAM , S., S HEN , X., AND Z HAI , C. A session-based




                                                                        Number of webpages
                                                                                             120
     search engine. In Proceedings of the 27th Annual Inter-
     national ACM SIGIR Conference on Research and Devel-




                                                                                             80
     opment in Information Retrieval (2004).
[17] TAN , C., G ABRILOVICH , E., AND PANG , B. To each




                                                                                             40
     his own: personalized content selection based on text
     comprehensibility. In Proceedings of the 5th ACM In-




                                                                                             0
     ternational Conference on Web Search and Data Mining
                                                                                                   2 4 6 8   11   14   17   20   23   26   29
     (2012).
[18] T EEVAN , J., D UMAIS , S. T., AND H ORVITZ , E. Person-                                           Non−personalized rank
     alizing search via automated analysis of interests and ac-
                                                                       Figure 11: Google’s original rank distribution for the
     tivities. In Proceedings of the 28th Annual International
     ACM SIGIR Conference on Research and Development in
                                                                       2,136 webpages whose ranking we attempt to improve
     Information Retrieval (2005).                                     with contextual search history pollution.
[19] V ID S TATS X. Youtube channel, subscriber, & video
     statistics. http://vidstatsx.com/.                                the original search term “watch”. The keywords injected
[20] W U , B., AND DAVISON , B. D. Identifying link farm               by the pollution attack differ, however, and are “China”
     spam pages. In Proceedings of the Special Interest Tracks         and “China wholesale” respectively. For the persistent
     and Posters of the 14th ACM International Conference on           attacks, we were successful in promoting at least one re-
     the World Wide Web (2005).                                        turned website for 247 out of the 551 search terms.
                                                                          Figure 12 shows the competition level distribution for
                                                                       both types of attacks. Figures 12(a) and 12(b) corre-
A     Appendix                                                         spond to the 1,740 search terms associated with our en-
                                                                       tire contextual test corpus and the 606 search terms for
Here we provide more details regarding the actual exploit
                                                                       which there was a website we could promote. Like-
and test corpora for the search personalization attack.
                                                                       wise, Figures 12(c) and 12(d) plot the competitiveness
                                                                       of the search terms for the 551 tested and the 247 suc-
A.1     Search Term Variance                                           cessful persistent pollution attacks. Although the distri-
                                                                       butions are different between test corpora, in both cases,
As with the various product categories on Amazon, it is
                                                                       the distributions suggest there is no obvious correlation
reasonable to expect that the effectiveness of search his-
                                                                       between search term competition or value and the like-
tory pollution depends on the value of the search term
                                                                       lihood of being able to launch a search history pollution
being polluted. In other words, just as Amazon tightly
                                                                       attack.
controls the gift cards it recommends, it might be the case
that a website cannot be promoted in Google’s search re-
sults as easily for a highly competitive search term, such             A.2                    Robustness
as “laptop”, as it can for relatively uncontested search
terms. To obtain an estimate of the value of differ-                   Because a contextual history pollution attack uses only
ent search terms, we again turned to Google’s AdWords                  a few recent search history entries to promote a website,
Keyword Tool. The tool provides a function that asso-                  the lifetime of this attack is limited to the period when
ciates a given search term with a level of competition.                Google’s personalization algorithm considers this con-
The competition level is a measure of how expensive                    textual information. We empirically determine Google’s
it would be for URL to consistently pay enough to be                   timeout threshold by injecting sets of contextual key-
ranked at the top of the list of advertisers for a particular          words into a Google search profile and then pausing
search term. Competition level is expressed as a value                 Google’s history collection. We then search alternatively
from 0 to 1, with 0 having no competition and 1 having                 for two distinct search terms—one that we know is af-
fierce competition.                                                    fected by the injected keywords, and another we know is
   Recall that out of the 2,136 webpages that we at-                   not. We continue to search for these two terms, recording
tempted to promote using a contextual pollution attack,                and time stamping all the search returns.
729 were successful. It is important to note that some                    Our analysis of many such tests with different sets
of the promoted results were for the same initial search               of search terms indicates that Google appears to en-
terms. Therefore, the number of search terms asso-                     force a ten-minute threshold on context-based personal-
ciated with the webpages are 1,740 and 606, respec-                    ized search, which thereby limits the scope of the con-
tively. As an example, we attempted to promote both                    textual pollution attack. Similarly, there are limits on
made-in-china.com and DHgate.com with respect to                       how many different searches can be conducted before the

                                                                  15
USENIX Association                                                                                     22nd USENIX Security Symposium 685
                                                                           120




                                                                                                                                   300
             100 200 300




                                                                                                                                                                                         120
                                                                                                                                   200
 Frequency




                                                               Frequency




                                                                                                                      Frequency




                                                                                                                                                                             Frequency
                                                                           80




                                                                                                                                                                                         80
                                                                                                                                   100
                                                                           40




                                                                                                                                                                                         40
             0




                                                                           0




                                                                                                                                   0




                                                                                                                                                                                         0
                           0.0   0.2   0.4   0.6   0.8   1.0                     0.0   0.2   0.4   0.6   0.8   1.0                       0.0   0.2   0.4   0.6   0.8   1.0                     0.2   0.4   0.6    0.8    1.0

                                  Competition level                                     Competition level                                       Competition level                                    Competition level


         (a) Entire corpus, contextual                         (b) Successful attacks, contextual                                 (c) Entire corpus, persistent               (d) Successful attacks, persistent

                                                                     Figure 12: Distribution of search-term competition levels.


injected context is no longer used to personalize subse-                                                                     long, we identified a set of 100 webpages and search
quent queries. Our initial testing indicates that person-                                                                    terms on which we launch a successful persistent pol-
alization falls off after the fourth search. Hence, we                                                                       lution attack. We then inject additional randomly se-
conclude that the pollution attack can last for at most                                                                      lected trending keywords one-by-one and continually
four subsequent queries or ten minutes, whichever comes                                                                      check whether the promotion remains. 72% of the web-
first.                                                                                                                       sites remain promoted after 60 additional keywords, indi-
   Our testing of persistent attacks shows that if a web-                                                                    cating that, when successful, persistent pollution attacks
page remains promoted after several search terms, it will                                                                    are likely to remain effective for quite some time.
remain promoted for a long time. To determine how




                                                                                                                     16


686 22nd USENIX Security Symposium                                                                                                                                                                   USENIX Association
