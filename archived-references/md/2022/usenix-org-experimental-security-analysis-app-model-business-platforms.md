---
type: Article
title: Experimental Security Analysis of the App Model in Business Collaboration Platforms
resource: "https://www.usenix.org/conference/usenixsecurity22/presentation/chen-yunang-experimental"
tags: [article, webseclist-reference, en, usenix-org]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:23:30+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.usenix.org/conference/usenixsecurity22/presentation/chen-yunang-experimental"
    title: Experimental Security Analysis of the App Model in Business Collaboration Platforms
    author: Yunang Chen, Yue Gao, Nick Ceccio, Rahul Chatterjee, Kassem Fawaz, Earlence Fernandes
  - id: capture
    resource: "https://web.archive.org/web/20221217092606/https://www.usenix.org/conference/usenixsecurity22/presentation/chen-yunang-experimental"
also_at:
  - "https://www.usenix.org/system/files/sec22-chen-yunang-experimental.pdf"
  - "https://www.usenix.org/system/files/sec22_slides_chen_yunang_experimental.pdf"
authors:
  - Yunang Chen
  - Yue Gao
  - Nick Ceccio
  - Rahul Chatterjee
  - Kassem Fawaz
  - Earlence Fernandes
canonical_url: ""
cited_by:
  - "2022.md:79"
commit: ""
content_sha256: f2e672778a0a2f96ec7eda08635034f1e9432399ce5f99cddc7798945f153d54
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.usenix.org/conference/usenixsecurity22/presentation/chen-yunang-experimental"
published: ""
publisher: usenix.org
publisher_english: ""
raw_sha256: d47ff3899b33c72c427749e9746d541e9420382d59a317c47f801980f9467abf
retrieved_from: "https://www.usenix.org/system/files/sec22-chen-yunang-experimental.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:23:30+00:00"
slug: usenix-org-experimental-security-analysis-app-model-business-platforms
snapshot: 20221217092606
title_english: ""
translation_file: ""
translation_of: ""
---

# Experimental Security Analysis of the App Model in Business Collaboration Platforms

**Experimental Security Analysis of the App Model in Business Collaboration Platforms** - Yunang Chen, Yue Gao, Nick Ceccio, Rahul Chatterjee, Kassem Fawaz, Earlence Fernandes, usenix.org.

- Published: date not stated
- Original: <https://www.usenix.org/conference/usenixsecurity22/presentation/chen-yunang-experimental>
- Also published at: <https://www.usenix.org/system/files/sec22-chen-yunang-experimental.pdf>
- Also published at: <https://www.usenix.org/system/files/sec22_slides_chen_yunang_experimental.pdf>
- Preserved from: https://www.usenix.org/system/files/sec22-chen-yunang-experimental.pdf (live) on 2026-08-19
- Capture timestamp: 20221217092606
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Experimental Security Analysis of the App Model
       in Business Collaboration Platforms
     Yunang Chen, Yue Gao, Nick Ceccio, Rahul Chatterjee, Kassem Fawaz,
          and Earlence Fernandes, University of Wisconsin–Madison
https://www.usenix.org/conference/usenixsecurity22/presentation/chen-yunang-experimental




         This paper is included in the Proceedings of the
                31st USENIX Security Symposium.
                      August 10–12, 2022 • Boston, MA, USA
                                   978-1-939133-31-1




                                          Open access to the Proceedings of the
                                           31st USENIX Security Symposium is
                                                 sponsored by USENIX.
                            Experimental Security Analysis of the App Model in
                                    Business Collaboration Platforms

      Yunang Chen∗ , Yue Gao∗ , Nick Ceccio , Rahul Chatterjee , Kassem Fawaz , Earlence Fernandes
                                   University of Wisconsin–Madison



                            Abstract                               serve as a hub for all their sensitive resources from third-
   Business Collaboration Platforms like Microsoft Teams           party systems. As such, it is vital to understand the security
and Slack enable teamwork by supporting text chatting and          and privacy properties of this emerging class of distributed
third-party resource integration. A user can access online file    multi-user collaboration platforms.
storage, make video calls, and manage a code repository, all          We contribute to understanding the security of BCPs by
from within the platform, thus making them a hub for sensi-        performing an experimental analysis of the third-party app
tive communication and resources. The key enabler for these        model. We focus on the app model because it allows BCPs
productivity features is a third-party application model. We       to access sensitive data from third-party systems. Although
contribute an experimental security analysis of this model         there is work on understanding the operational security issues
and the third-party apps. Performing this analysis is chal-        of BCPs (e.g., web security flaws [14, 15]), to our knowledge,
lenging because commercial platforms and their apps are            no work has examined the third-party app model. We focus
closed-source systems. Our analysis methodology is to sys-         our work on Slack and Microsoft Teams — two of the most
tematically investigate different types of interactions possible   widely-used BCPs with mature app ecosystems [10]. Further-
between apps and users. We discover that the access control        more, these two systems share design-level commonalities
model in these systems violates two fundamental security           and potentially with other BCPs. Thus, any security findings
principles: least privilege and complete mediation. These vio-     are potentially broadly applicable to BCP design.
lations enable a malicious app to exploit the confidentiality         Performing the security analysis of Slack and Microsoft
and integrity of user messages and third-party resources con-      Teams is challenging because these systems, including their
nected to the platform. We construct proof-of-concept attacks      apps, are closed-source. Specifically, apps themselves are
that can: (1) eavesdrop on user messages without having per-       remotely-hosted web services whose endpoints are only
mission to read those messages; (2) launch fake video calls;       known to the BCP. This precludes classical analysis tech-
(3) automatically merge code into repositories without user        niques such as source code and binary analysis or API end-
approval or involvement. Finally, we provide an analysis of        point testing. As an external party, we can only interact with
countermeasures that systems like Slack and Microsoft Teams        apps the way a human user would — through the BCP itself.
can adopt today.                                                   Therefore, we focus our analysis efforts on the interactions be-
                                                                   tween apps and users, such as sending messages and reacting
                                                                   to them. To conduct the analysis methodically, we first system-
1     Introduction                                                 atize an access control model that describes the approaches
                                                                   taken by Slack and Teams using a uniform vocabulary. We
Business Collaboration Platforms (BCPs) like Slack and Mi-
                                                                   then explore how an attacker can violate the access control
crosoft Teams are indispensable collaboration and productiv-
                                                                   model by experimentally studying each interaction method.
ity tools. Beyond multi-user chat features, BCPs enhance pro-
                                                                      We find that the BCP app model uses a two-level access
ductivity by allowing users to integrate third-party resources.
                                                                   control system consisting of the OAuth protocol and a run-
For example, users can make video calls with Zoom, store
                                                                   time policy enforcer. Abstractly, a BCP app requests OAuth
files on DropBox, chat with customers, and manage code
                                                                   tokens to interact with categories of resources. For example,
repositories, all from within the BCP. A vibrant third-party
                                                                   an app might request an OAuth token to read chat messages.
app ecosystem allows many such integrations. Thus, BCPs
                                                                   However, this token does not entirely dictate what specific
not only host private communications between users but also
                                                                   messages the app can read. Thus, the user has to specify
    * Equal Contribution.                                          the fine-grained access control policy at runtime. Once the



USENIX Association                                                                    31st USENIX Security Symposium         2011
 user installs an app and permits it to read chat messages, the       • We introduce three new attack classes that leverage this
 user can additionally specify that the app may read messages           fundamental shortcoming of the access control model: app-
 from specific channels (e.g., the “usenix-security-submission”         to-app delegation attacks, user-to-app interaction hijacking,
 channel). Whenever an app issues an API request to the BCP             and app-to-user confidentiality violations. We constructed
 server to read a chat message from a specific channel, the             proof-of-concept attacks for these classes to achieve ef-
 access control system first verifies the OAuth token and then          fects such as sending arbitrary emails on behalf of victims,
 executes a runtime policy check to verify that the app is au-          merging code requests, launching fake video calls with
 thorized to read from that specific channel.                           loose security settings, and stealing private messages with-
    By examining each interaction method between BCP apps               out having the appropriate permission. In certain cases,
 and users, we establish that this two-level access control sys-        we also demonstrate how an attacker can maintain their
 tem does not adequately confine third-party application be-            presence even after app uninstallation.
 havior. Concretely, we have discovered that the BCP access           • We build tools to scrape app manifest data to estimate
 control system violates two standard security principles: (1)          the potential for such attacks to occur. Of the 2,460 Slack
 least privilege and (2) complete mediation [41]. This allows           apps we analyze, we find that 1,493 (61%) are potentially
 malicious apps to escalate their privilege and violate the con-        vulnerable to delegation attacks, and 563 (23%) request
 fidentiality and integrity of private chat messages and third-         the necessary permissions to carry out these attacks. Of the
 party resources connected to BCPs. To demonstrate the con-             1,304 Microsoft Teams apps we analyze, we find that 427
 crete harms posed to end-users, we introduce three attack              (33%) are vulnerable to delegation attacks. We also find
 classes for BCPs along with attack prototypes:                         that 1,266 (51%) Slack apps use slash commands; these
(1) App-to-App Delegation Attacks (Section 4): BCPs sup-                apps are potentially vulnerable to both the user-to-app
 port apps that can interact with each other for productivity           attacks and capable of performing user-to-app attacks.
 reasons, independently of human involvement. To support
                                                                         Finally, we propose a set of countermeasures that BCPs
 such meaningful interactions, the BCP access control model
                                                                      like Microsoft Teams and Slack can adopt today as a tempo-
 allows apps to act on behalf of a user. We show how malicious
                                                                      rary solution to mitigate the attacks (Section 7). For example,
 apps can exploit this to violate the confidentiality and integrity
                                                                      enforcing user confirmation before every app-to-app interac-
 of resources that victim apps manage. Our proof-of-concept
                                                                      tion and command name collision can fix most issues, but this
 attacks include sending arbitrary emails on a victim’s behalf,
                                                                      is undoubtedly a user-hostile solution. As a result, solutions
 merging code pull requests, and retweeting any links using
                                                                      with acceptable security and usability trade-offs necessitate
 the victim’s account.
                                                                      rethinking the app and access control model in multi-user
(2) User-to-App Interaction Hijacking (Section 5): BCP
                                                                      communication platforms.
 apps can customize how users interact with them and with
workspace features. For example, an app can introduce new             Ethics and Disclosure. We conducted all experiments inside
‘slash commands’ into a workspace or manipulate how URLs              private workspaces with the authors as the only members. We
 get unfurled. For example, one can start a Zoom video call by        did not exercise cross-workspace features; thus, our investiga-
 entering /zoom on the Slack UI. We show how a second mali-           tions did not influence other workspaces. We did not distribute
 cious app can interfere when a user attempts to interact with a      or submit our test malicious apps to any BCP app directory,
 benign app, a problem similar to DNS domain squatting and            so our attack did not affect BCP users other than the authors’
voice assistant skill squatting [36, 54].                             testing accounts. We ethically disclosed all attacks we found
(3) App-to-User Confidentiality Violations (Section 6): BCP           to Slack and Microsoft, both of which have confirmed their
 apps interact with users by participating in any approved chan-      existence. Due to their view of the workspace as a trusted
 nels or conversations, where a human user explicitly ‘adds’          environment, the assumptions that social engineering is a pre-
 the app as a member. BCPs implement runtime policy checks            requisite for the attacks, and that the workspace administrator
 to enforce security policies in these situations. We show how        will correctly manage app installations, these attacks do not
 a malicious app can exploit gaps between OAuth and these             meet their definitions of a security vulnerability.
 runtime mechanisms to leak private messages it does not have
 permission to view.
                                                                      2    Business Collaboration Platforms
 Contributions.
• We contribute an experimental security analysis of the app          BCPs provide chatrooms that facilitate online collaboration
  model in two widely-used BCPs — Microsoft Teams and                 among a group of people, who usually belong to the same
  Slack. To guide the analysis, we derive a common access             workspace, such as a project team or a research group. In
  control model for these two BCPs and then experimentally            BCPs, one can create a virtual workspace to host all conversa-
  examine each interaction method between apps and users.             tions for a group. It supports discussions among the users who
  We find that the access control model violates the principle        joined the workspace through various conversation channels.
  of least privilege and complete mediation.                          Users can open a new channel which can be public — any



2012    31st USENIX Security Symposium                                                                         USENIX Association
                                                                                      Event Notification
                                                                                 type    : message
                                                                                 text    : Welcome!
            send message                                                         channel: CHANNEL_ID
              Welcome!
                                                                                 user    : USER_ID
                                                                                 ts      : TIMESTAMP
                Interact                              API Calls

                                                      Responses                         BCP API Call
                                                                                 method : chat.postMessage
                                                                                 text   : Hello, world!
 BCP User                       BCP Clients                        BCP Server    channel: CHANNEL_ID                     Cloud Backends of BCP Apps
                                                                                 token : xxxx-xxxxxxx-xxxx


Figure 1: Overview of BCP’s ecosystem: A BCP user interacts with their BCP clients to communicate with the BCP server. BCP
apps, which are maintained as separate web services by different third-party developers, communicate with BCP server via API
calls and event notifications. A user has to install and authorize an app before accessing its functionalities.

user can join — or private — only those who are invited can                      the app’s bot user directly, invite it to a channel, or share files
join. Users can also send direct messages to any other user or                   with it. Due to these convenient features, this role has become
group of users in the workspace. To use a BCP, a human user                      the app’s primary communication interface with its users.
interacts with their BCP client on their computer or mobile
                                                                                 User delegate. If permitted, the app may also perform ac-
device, which then communicates with the backend servers
                                                                                 tions on behalf of users. This role is particularly beneficial
of the BCP through various APIs. The backend server then re-
                                                                                 for enhancing productivity. For example, when users visit
sponds to the client, updating what the user sees. We illustrate
                                                                                 Dropbox’s web page and wish to share files with others in
this communications framework in Figure 1.
                                                                                 their Slack workspace, they must divert their attention back
   In this paper, we focus on Microsoft Teams and Slack,
                                                                                 and forth between Dropbox and Slack. In contrast, with the
due to their popularity and mature third-party app ecosystem.
                                                                                 delegation ability, Dropbox enables the user to click a button
A recent survey of 900 businesses [10] has shown that they
                                                                                 without leaving the webpage and let Dropbox’s Slack app [4]
are the two most popular BCPs1 and are the only ones that
                                                                                 share files on their behalf. As a result, the shared files appear
provide a list of officially supported third-party apps.
                                                                                 to have been sent directly from the user.

2.1     BCP App
                                                                                 2.2    Life Cycle of BCP Apps
Beyond basic chatting features, modern BCPs usually of-
fer many third-party integrations, commonly known as apps,                       Microsoft Teams and Slack allow any BCP user to create and
which are cloud services providing additional productivity-                      distribute BCP apps without requirements, such as applying
enhancing functionalities in the workspace, often connecting                     for a developer account. BCP apps generally go through the
user’s data from other services (such as email or online stor-                   following stages in their life cycle: registration, publication,
age) to the workspace. These BCP apps exist on cloud servers                     installation, per-user authorization, in-use, and removal.
not maintained by the BCP. These app backends communi-
cate with the BCP servers by subscribing to event notification                   Registration. To enable the various functionalities in Sec-
APIs and reacting when information about a new event is                          tion 2.1, an app needs to query different web APIs or subscribe
received, as depicted in Figure 1. Generally, a BCP app can                      to different event notification APIs on the BCP’s backend
simultaneously act in three roles: workspace feature provider,                   server, which in turn usually require different permissions.
interactive bot, and user delegate.                                              The app developer must register the app in the correspond-
                                                                                 ing BCP’s developer portal by submitting a manifest, which
Workspace feature provider. The app may enhance a                                specifies the app’s backend URL, required permissions, and
workspace’s existing features. For example, an app made                          subscribed events. We note that, in both Microsoft Teams and
by Twitter can customize the default link unfurling feature                      Slack, the developer does not need to submit any of the app’s
to preview tweets linked in messages automatically. The app                      codebase, as all their apps are hosted purely inside the de-
may also provide user-invokable actions through slash com-                       veloper’s server. No client-side code is accessible by Slack,
mands. As another example, Google’s Slack app [5] shows a                        Microsoft, or the end-users.
user’s recent schedule when the user types /gcal.
                                                                                 Publication. After the app has been successfully registered,
Interactive bot. The app can present itself in the workplace                     the developer can choose to either distribute the app’s public
as a bot user and interact with other users the same way as                      installation URL through its own advertising channels or
a typical human user. The user can, for example, chat with                       submit the app to the official app directory [11, 13]. For the
   1 The original survey listed Skype for Business as the top spot, but it has   second option, the app must follow submission guidelines and
since been discontinued and replaced by Microsoft Teams.                         go through the platform’s vetting procedure, which primarily



USENIX Association                                                                                   31st USENIX Security Symposium           2013
involves checking if the app’s requested permissions match its                                                           Private Channels
                                                                                                    Private Channel #1
claimed functionality (e.g., through a provided test account).                                                                                    Name
                                                                                                                    Messages
However, as BCP apps are closed-source and their codes are                                               m11                                      group1
                                                                                                               Text       Author
not submitted for examination, it is difficult to enforce these                                                 …         App 1
                                                                                                                                               Members
guidelines strictly.                                                                                     m12
                                                                                                               Text       Author                  App 1
                                                                                                                …         User 1
                                                                                                                                                  User 1
Installation.     In Microsoft Teams and Slack, any user2 can
                                                                                                    Private Channel #2
install an app to the workspace. During installation, a permis-                                                                                   Name
                                                                                                                    Messages
sion request page will be presented to the user, detailing what                                          m21
                                                                                                               Text       Author
                                                                                                                                                  group2
the app can do, as illustrated in Appendix C. The user then                                                     …         User 1
                                                                                                                                               Members
either accepts all permissions or rejects all permissions. This                                          m22
                                                                                                               Text       Author                  User 1
installation is relatively invisible to other users; they are not                                               …         User 2
                                                                                                                                                  User 2
notified when a new app is installed, and the list of installed
apps is often hidden in secondary menus in the UI.                                groups:history                                     chat:write              groups:read

                                                                                  Bot Token Scope                                  User Token Scope        User Token Scope
Per-User Authorization. If an app wants to act as the dele-                                                                           (for User 1)            (for User 2)
gate of some users in the workspace, it may initiate a separate
permission request to each user, usually by sending the re-                   Figure 2: An example of Slack permission system. We show
quest link via the app’s bot user. Once the user authorizes it,               three example scopes that App 1 may acquire. The arrow
the app gains permission to act on behalf of that user.                       lines indicate that a token can be used to query all resource
                                                                              instances of the types allowed by the token’s scope. However,
In-use and Removal. After the app is installed and autho-                     Slack performs additional runtime policy checks (indicated
rized, it may additionally ask for integration with the user’s                by the red crosses) to determine which of these instances can
account on third-party services. For example, Google’s Slack                  actually be accessed.
app requests the user to authorize access to their Google ac-
count. BCPs do not manage the communications between                          3       Analysis of App Permission Model in BCP
BCP apps and third-party services. If the app developer up-
dates an app to request a different set of permissions, the user              We study the permission systems in Microsoft Teams and
has to reinstall the app and go through the permission prompts                Slack to identify their similarities and differences to under-
as before. Finally, when a user uninstalls an app, it is deau-                stand the potential security design issues and systematically
thorized by the BCP. However, there is no guarantee that the                  perform experimental security analysis. We focus on these
app properly disconnects itself from third-party services.                    two BCPs since they are the top two most popular ones [10]
                                                                              and have mature app ecosystems. We also introduce a practi-
                                                                              cal threat model and the methodology we will use to analyze
                                                                              the third-party apps in these two BCPs.
2.3     Security and Privacy Concerns
                                                                              3.1         App Permission System
The widespread usage of BCPs in remote work environments
implies that a lot of sensitive information passes through it.                At a high level, Microsoft Teams and Slack have designed
With the potential ability to access such information, BCP                    their access control model based on a similar permission-
apps lead to security and privacy concerns. Moreover, some                    based system. This permission system controls whether or
of the design choices that we described earlier exacerbate                    not an app has access to various resources in a workspace. An
such concerns: (1) all-or-nothing permissions that disallow                   app must first declare a set of permission scopes it requires,
selective toggling of permissions; (2) imperceptible installa-                with each scope representing the permission to read or write
tion that reduces the chances for users to notice what kinds of               a type of resource. However, such scopes are statically de-
apps are installed and also prevents any workspace-wide con-                  fined by the BCPs and thus do not allow more dynamic and
sent mechanisms; (3) pure server-side implementation that                     fine-grained access control over the specific instances under a
prevents BCPs or other entities from inspecting the app’s be-                 single type of resource. To solve this problem, the BCP per-
havior through traditional tools like static or dynamic analysis.             mission system includes runtime policies that are usually
This also allows the app to change its behavior at will.                      user-configurable. For example, to read a message in a private
                                                                              channel, a Slack app not only needs the groups:history
    2 Although Microsoft Teams and Slack provide a setting for the adminis-
                                                                              scope but also has to be added to the channel’s member list
trators of a workspace to limit which users are allowed to install apps and
                                                                              by some user, as shown in Fig. 2. We now examine this two-
which apps can be installed, the default for both BCPs is that any user can   level permission system in detail and show that it has security
install any apps from any source.                                             design issues that can violate the least privilege principle and



2014     31st USENIX Security Symposium                                                                                                         USENIX Association
cause privilege escalation.                                              messages and direct messages as two separate types of re-
                                                                         sources; however, it only imposes a policy on the former
Level 1: static permission scopes. An app needs to acquire
                                                                         by checking whether the app is invited to the channel, but
several different permission scopes to perform all of its func-
                                                                         provides no mechanism to limit which user the app can
tionality. Each scope represents the permission to read or write
                                                                         send direct messages to. The incompleteness of runtime
a type of resource in a workspace, such as channel messages
                                                                         policies leads to coarse-grained access control, violating
or shared files.
                                                                         the principle of least privilege.
   To install the app, the user must accept all of its requested
permissions; neither BCPs provide options to selectively tog-        2. The ownership or provenance of some resources is not
gle them. Slack’s permission scopes are implemented as stan-            properly tracked or enforced. This frequently happens
dard OAuth permission scopes. Slack provides two types of               when a user delegates an app to create resources. For
scopes for its apps: bot token scope, which allows an app to            example, Microsoft Teams does not differentiate be-
provide workspace features or act as a bot user, and user token         tween messages sent by a real user and a delegated app.
scope, which allows an app to perform actions on behalf of              In addition, due to the multi-user multi-app nature of
an authorized user. For example, the chat:write bot token               BCP workspace, the ownership of a resource can some-
scope permits the app to send messages with its bot user as the         times be hard to define correctly. When the ownership or
author, while the chat:write user token scope allows send-              provenance is absent, or the system assumes the wrong
ing messages as the user. Microsoft Teams follows a similar             one, the principle of complete mediation can be violated
design: a set of core app capabilities that must be declared in         and potentially lead to privilege escalation.
an app’s manifest is the equivalent of Slack’s bot token scope,
while Microsoft Graph API’s OAuth permission scopes are            Although it is possible to build a BCP permission system to
equivalent to Slack’s user token scope. The difference is that     fix the above problems by allowing the user to specify the
only the first type of scope is shown during the app instal-       security policy for every instance of resources and tracking
lation; the second type can only be acquired by initiating a       every resource’s provenance, we will see in Sections 4 to 5
separate permission request to the user after installation.        that such an ideal system is hard to design and often requires
   These scopes are static, in the sense that they are prede-      sacrificing usability.
fined based on how BCPs categorize the workspace resources,
and therefore might not align with the user’s desired security     3.2    Threat Model
policies, which can vary by workspaces and evolve. To com-
pensate for the static nature of scopes, both BCPs impose a        Based on our analysis of the permission model above, we
second level of permission checking.                               derive a threat model for BCP apps. We assume that the at-
                                                                   tacker has targeted a BCP workspace containing a number of
Level 2: runtime policy checks. Microsoft Teams and Slack          users and already-installed apps. The attacker has also tricked
implement runtime policies to determine which instances in a       one of the users (referred to as the victim) into installing the
resource type an app can access based on various conditions.       attacker-controlled malicious app, i.e., the victim has granted
Users can usually control these conditions to express their        all the permission scopes requested by the malicious app. We
desired security policies. For example, users can have more        believe this is a reasonable assumption, because (1) the ma-
fine-grained control of which messages in private channels an      licious app can easily mimic a legitimate app by copying its
app (that has the prerequisite permission scope) can view: in      publicly available manifest, making the two indistinguishable
Slack, they can invite the app to a specific channel, indicating   for the victim during installation, and (2) by default, any user
that the app can view all messages inside this channel; in         in the workspace is allowed to install any app from any source.
Microsoft Teams, they can @-mention the app in the messages        In our threat model, the attacker can be either an outsider or
that they wish the app to read. In this way, runtime monitors      a curious user inside the workspace who wants to gain the
grant users some flexibility to dynamically adjust the set of      information they cannot access. For example, an admin can
resources of an app can access.                                    recommend everyone in the organization to install a malicious
Security design issues. Despite the two-level checking, we         app (disguised as an innocent management app), hoping to
uncover two design issues in the BCP permission system that        steal chat logs from private channels they are not invited.
violate basic security principles.                                    In addition, we assume that the BCP’s clients and its back-
                                                                   end server are secure and do not collude with the attacker —
  1. The runtime policies are ad-hoc and incomplete. As a          attacking such infrastructure is an orthogonal research direc-
     result, not all user security policies can be correctly ex-   tion. Therefore, the capacity of the malicious app is limited
     pressed. We find that not only do they differ in each         to the functionality defined by the BCP’s API. We also as-
     BCP, but even in the same BCP there are often incon-          sume that the other apps installed in the workspace are be-
     sistencies between the runtime policies of similar types      nign and secure, which means they follow the security guide-
     of resources. For example, Slack treats public channel        lines [12, 16] and do not contain any implementation-level



USENIX Association                                                                    31st USENIX Security Symposium         2015
  Attack                    Slack   Teams   Prerequisites                                      Attack Effect Surface

                                            Permission to perform actions (primarily read &    Invoke actions in victim’s other apps to manipulate data
  Delegation                 X       X
                                            write direct messages) on victim’s behalf.         in victim’s connected third-party accounts.
                                                                                               Incur delegation attack after the app is removed.
                                            App has acquired the above permission before
  – post app removal         *       X                                                         *In Slack, this can only be achieved via pre-scheduled
                                            removal.
                                                                                               messages.

  Interaction hijacking
                                                                                               Hijack any slash command in the workspace stealthily,
  – slash command            X              Permission to add slash commands.
                                                                                               affecting everyone using the command.
                                                                                               Replace any other app’s unfurled content stealthily, af-
  – link unfurl                      X      Permission to provide customized unfurling.
                                                                                               fecting the links sent by victim.

  Message extraction
                                            Permission to read & write direct messages on      Read messages in any private channel where victim is a
  – via link unfurl          X
                                            victim’s behalf.                                   member of.
                                            Permission to pin, star, or react to messages on   Read victim’s direct messages and messages in any pri-
  – via pin/star/reaction    X
                                            victim’s behalf.                                   vate channel where victim is a member of.


Figure 3: Summary of proof-of-concept attacks and their requirements and threats. Per our threat model, the victim is a user who
has authorized all the app’s requested permissions.

flaws such as exposing their tokens directly.                                not to prove that some specific apps are malicious; we only
                                                                             examine the capabilities granted by various permission scopes
                                                                             and how they can be abused to perform malicious actions.
3.3     Security Analysis Methodology                                        This strategy allows for a sound analysis despite apps being
We perform experimental security analysis on Microsoft                       closed-source, as the apps we find indeed have prerequisite
Teams and Slack to study how a malicious app (defined by                     permissions to potentially launch attacks.
our threat model) can exploit the two security design issues
in these two BCPs’ permission systems. Specifically, for each
potential exploit, we evaluate its practicality and prevalence.
                                                                             4     App-to-App Delegation Attacks
   To explore potential exploits, we examine every type of                   One of the core functionalities provided by BCP apps is to
interaction the malicious app can have with other entities in                chat with users through their bot users interactively. However,
the workspace and check whether such interaction involves                    a BCP app can also send and receive messages on the user’s
resources that have incomplete runtime policy or suffer from                 behalf and, therefore, chat with other app bot users. In this
improper ownership tracking. If so, we explore attacks caus-                 section, we present the delegation attack, where one malicious
ing security-critical consequences. For each attack, we an-                  app abuses such app-app interactions and causes security-
alyze how it stems from the security design issues in the                    critical consequences (Sections 4.1 to 4.2). We then show
permission system, how it violates the security principles, and              that the source of this vulnerability roots in the fundamental
how it jeopardizes the workspace’s integrity or confidentiality              design issues of current BCP permission systems (Section 4.3)
guarantees expected by the user. We detail our findings in                   — a violation of least privilege.
Sections 4 to 6, and summarize the prerequisites and effect
surface for each attack in Fig. 3.
   For practicality, we build proof-of-concept malicious apps                4.1      App-to-App Interactions
and, if applicable, target the attack on selected apps. Since
                                                                             Both Microsoft Teams and Slack allow their apps to present
most apps require a valid third-party account to function prop-
                                                                             themselves in a workspace as bot users so that human users
erly, running large-scale analysis is infeasible. Thus, we only
                                                                             can send direct messages to these bot users to instruct them
select a few targeted apps that connect to sensitive resources
                                                                             to perform certain tasks. This functionality is commonly used
and test them manually. We only install one targeted app at a
                                                                             to let users manage their data in other online services, such as
time in our test workspace to avoid undesired interference.
                                                                             emails and file storage, without leaving the BCP.
   For prevalence, we analyze the app’s potential ability to
                                                                                At the same time, these two BCPs also allow apps to per-
launch attacks. We collect the requested permissions of all
                                                                             form certain actions in the workspace on behalf of the user.
published apps from the two BCPs’ official app category3 , and
count how many apps have sufficient permissions or resources                     3 We collected 2,460 apps from the Slack [11] on April 7, 2021 and 1,304

to launch each attack. It is important to note that our goal is              apps from Microsoft Teams [13] on November 17, 2021.




2016     31st USENIX Security Symposium                                                                                        USENIX Association
If an app sends a message in this way, this message will ap-        allow an app to send slash commands or click buttons in a
pear as if the user sent it. Such delegation can be useful to       UI. Slack in particular also tracks which messages are sent
enhance productivity. For example, Dropbox’s BCP app [4]            by a real user through the Slack client and which are sent by
utilizes it to share files in channels on behalf of the user.       a delegated app, so that the app receiving the messages can
In Slack, this can be achieved if the app has acquired the          choose whether to respond or not. However, both of these
chat:write user token scope in its OAuth permission re-             mechanisms require the receiving app’s developer to decide
quest with the user; in Microsoft Teams, although none of its       which actions can be triggered by other apps, but the current
standard app capabilities grants permissions to delegate, one       design of BCP permission system does not provide any ways
can still employ the advanced Microsoft Graph API and ask           for it to learn whether the delegated messages align with
for the Chat.ReadWrite scope.                                       the user’s actual intent, making it impossible to arrive at the
   By combining the above two functionalities, we can enable        correct decision. As we will discuss in Section 7, a principled
app-to-app interactions in BCPs: one app that has the dele-         fix would trade-off functionality or usability.
gated permission to send user’s messages can interact with
another app’s bot user. Such interaction can be beneficial; for
example, Dokkio’s Slack app [3] can organize files sent by
                                                                    4.2    Delegation Attack
Dropbox’s app into a coherent page for the workspace and            We now focus on the delegation attack targeting both Mi-
tag them as shared by different users. Slack regards app-app        crosoft Teams apps and Slack apps. We have built a tool that
interaction as an important feature with growing demand [30].       crawls the information of a targeted app from the two BCPs’
However, allowing one app to communicate with other app’s           official app directories and analyzes which trigger events the
bot users has severe security implications. When the former         app is subscribing to. In the case of Microsoft Teams, we
app turns malicious, it can potentially invoke actions from         can also extract all message keywords that trigger the tar-
the latter app, and such actions might affect data in the user’s    geted app’s actions. We set up a workspace as defined per
connected third-party account. We refer to attacks exploiting       our threat model. The attacker app has acquired the appro-
this vulnerability as delegation attacks.                           priate delegated permission from a victim user who has also
   We note app-app interactions can happen in other ways.           installed the targeted apps with connection to third-party ser-
Although receiving a message from the user is the most intu-        vices. The attacker app produces the trigger events, and we
itive trigger event to indicate when the app should perform its     observe whether the targeted app will be tricked into perform-
actions, an app may subscribe to other triggers as well, like       ing the actions (see Appendix D.1 for more implementation
when a file is shared (see Appendix A) or an emoji reaction is      details). Since most apps require a valid third-party account
added. As such, apps with delegated permissions to produce          to function properly, performing large-scale automated anal-
these triggers can also launch potential delegation attacks.        ysis is infeasible. Thus, in this section, we select a few apps
                                                                    connecting to sensitive third-party resources and manually
Post-removal interactions. Even after an app’s removal
                                                                    target them, demonstrating that delegation attacks can indeed
from the workspace, it can have residual effects that cause
                                                                    trigger security-critical or privacy-violating actions.
delegation attacks. Slack provides its apps the ability to sched-
ule a message to be sent at a future time (using the same            1 Send emails on victim’s behalf. MailClark’s Slack app
chat:write user token scope). We find that if the app is            [7] allows sending emails directly from Slack to include non-
removed before the message’s scheduled time, its message            Slack users in a Slack conversation. MailClark provides a
will still be sent, potentially invoking actions from other apps.   unique email address for a list of non-Slack guests in a channel
In Microsoft Teams, although there is no scheduling feature,        configured by the user. The email account and the recipients
this issue is more severe due to its two separate permission        are only accessible to MailClark and the user. The attacker
schemes. Upon uninstallation, only the app’s standard ca-           app induces MailClark to send any emails of the attacker’s
pabilities declared in the manifest will be removed, while          choice to recipients configured by the user. Specifically, the
its delegation permissions acquired through the Graph API           malicious app launches this attack by sending messages to
remain entirely intact. Therefore, a user cannot, by simply         the channel as the user. During this procedure, MailClark will
removing a Teams app from the workspace, prevent the app            automatically send the attacker’s message as an email to all
from continuing to send messages on the user’s behalf and           recipients and indicate the author as the user.
interact with other apps, allowing the channel for delegation
                                                                     2 Chat with victim’s website visitors. Chatlio [2] is a ser-
attacks to remain open.
                                                                    vice that lets developers add live chat functionality to their
Current defenses. We note that Microsoft Teams and Slack            websites. It also provides an accompanying Slack app that
do have workarounds that can prevent app-to-app interactions.       automatically forwards any messages of the website visitors
They allow apps to interact with users through alternative          to a Slack channel and vice versa. Therefore, website owners
ways, such as slash commands and interactive UI windows.            can chat with any visitors in real-time through Slack. Unfor-
This prevents other apps from interfering since neither BCPs        tunately, this convenient feature makes Chatlio’s app a victim



USENIX Association                                                                     31st USENIX Security Symposium         2017
of delegation attacks. Our attacker app can post messages di-       4.3    Analysis of Root Cause and
rectly into the channels used by Chatlio to chat with website              Potentially Prevalence
visitors and thus launch further phishing attacks or harvest
sensitive user info, as it now appears like a trustworthy entity    The delegation attack is possible because both BCPs’ permis-
to the visitors.                                                    sion systems violate the principle of least privilege. Currently,
                                                                    the permission to send delegated messages is governed by
 3 Merge pull requests in victim’s code repository. Bit-
                                                                    Slack’s chat:write or Microsoft Teams’s Chat:ReadWrite
Bucket’s Microsoft Teams app [1] will merge a given pull            scope; however, these two scopes allow the app to send mes-
request if it receives a message starting with the keyword          sages to any place that the user has access to, be it a public
merge. It will then ask for confirmation, at which point the        channel, direct message with other users, or direct message
attacker app can reply with the text yes to approve the merge.      with other app’s bot user. In addition, neither BCPs provide
The attacker app may additionally use the list keyword to           additional runtime policies that allows the user to limit the
ask BitBucket’s app to display all pull requests in the vic-        destinations. Therefore, even if the user wants to install a
tim user’s connected repos or the find keyword to locate a          simple app that only sends delegated messages to a small
specific pull request. If the repo is public, the attacker can      subset of other users for sharing or notification purposes, it
even submit and merge its own pull request, leading to code         must grant this app such overprivileged scopes that inevitable
poisoning or backdoor injection.                                    comes with the ability to launch delegation attacks.
                                                                    App’s residual permissions after removal. The reason why
4   Execute victim’s automation flows. Microsoft Power              a removed app can still keep some residual permission differs
Automate has a Teams app [17] that, upon receiving the mes-         in two BCPs. Slack’s permission system violates the princi-
sage Run flow [id], will execute the specified automation           ple of complete mediation by failing to check that the proper
flow in the user’s account. These flows can perform various         provenance of the scheduled message, which is the removed
actions in a wide range of services connected to Power Au-          app, should have no permissions at the time when the message
tomate. The app also accepts messages like List flows and           is sent. Whereas in Microsoft Teams, it is the result of two
Describe flow [id] that can be utilized by the attacker to          separate permission systems: only the app’s core capabilities
learn more about the user’s flows and conduct more targeted         are associated with Teams, while the Graph API’s permissions
attacks.                                                            are tied to the user’s Microsoft Account (outside the permis-
                                                                    sion system of Teams). Therefore, when the app is uninstalled
 5 Retweet on victim’s behalf. Ziri [8] is a Slack app that
                                                                    in Teams, only the former is revoked while the latter is not
helps users interact with tweets in a non-disruptive way. It con-   affected. We note this issue is not Teams-specific, but also
nects to the user’s Twitter account and requests permission to      exists in other systems when permissions are managed by
retweet. After that, whenever a Twitter link is shared in Slack,    different trust domains [53].
and the user adds a Twitter emoji reaction to that message,         Potential Prevalence. We report the number of apps capa-
Ziri will automatically retweet the shared Twitter on the user’s    ble of executing the delegation attack and that are vulnerable
behalf. The attacker app can thus send a message containing a       to the attack. For Microsoft Teams, we find vulnerable apps
link to a chosen tweet (that includes harmful information) and      by counting apps that use bot commands capability, as these
add an emoji to the message on behalf of the user. After that,      apps will accept text input from the user (or a delegated app)
Ziri will successfully detect the tweet link and retweet it using   to perform various actions. We observe that 427 (33%) of
the victim user’s account. Such uncontrolled tweets can have        Teams apps use bot commands, implying that they are vul-
detrimental effects, especially when the connected account is       nerable to a delegation attack. However, Teams apps do not
high profile, such as the organization’s official twitter.          list whether they will request any delegated permission since
                                                                    it is acquired through a separate system. For Slack, we find
Summary. The first four attacks rely on message events              563 Slack apps (23%) request at least one ‘write’ user scope,
to trigger the actions in the targeted app, while the last one      allowing them to interact with other apps adversarially, while
relies on a reaction event. We note that once the attacker          1,493 Slack apps (61%) request at least one ‘read’ scope, im-
and targeted apps are installed and properly authorized, the        plying that they are subscribing to events in the workspace
attacks do not require additional user inputs and can happen        and thus can be potentially affected by the attack. We note
anytime, even when the user is not logged into its BCP client.      that the measurements for Slack’s vulnerable apps are the
In addition, the attacker app can delete the traces of trigger      worst-case estimation. Since these apps are third-party web
events once the attack is finished, making it even sneakier         services with hidden endpoints, it is impossible to learn the
(since in both BCPs, the permission to send messages or add         app’s behavior directly. Furthermore, most apps only perform
emoji reactions also grants for free the permission to delete       actions after a third-party account is connected, preventing us
them).                                                              from fully automating the evaluation of apps on a large scale.



2018    31st USENIX Security Symposium                                                                        USENIX Association
Thus we may miscount apps that (1) have already employed a
countermeasure by blindly rejecting delegated messages, (2)
subscribe the certain events but never trigger their security-
critical actions based on these events.


5     User-to-App Interaction Hijacking
BCPs provide various features that serve as entry points for
users to interact with apps. Examples of these features in-                                       (a) The official Zoom app.
cludes ‘@’-mention, slash command, and link unfurling (see
Section 2.1). In this section, we discuss how a malicious
app exploits such interactions between the user and other
apps in the workspace. Specifically, we find two different
ways that this can happen: the malicious app can hijack other
app’s registered slash commands (Section 5.1), and replace
another app’s unfurled link content (Section 5.2). In particu-
lar, we note that both Microsoft Teams and Slack allow apps
to customize their appearance (e.g., name, icon, and descrip-
                                                                                                (b) The spoofed Zoom meeting.
tion) without restriction. A malicious app can thus completely                  Figure 4: Zoom meetings created by official and spoofed
mimic the appearance of another app4 to exploit the above in-                   /zoom commands in Slack. The spoofed Zoom meeting is
teractions more stealthily. Finally, we analyze the root cause                  secretly created by the attacker but publicly shown as started
and potential prevalence of these attacks.                                      by the victim. The word “Fake” is added clear demonstration,
                                                                                it can be removed in practical attacks.
5.1     Slash Command Hijacking
                                                                                invoked in a private channel, only users in this private chan-
In Slack’s user-to-app interactions, all apps’ slash commands                   nel will receive this private call. We create a malicious app
share a single namespace, creating the potential for name col-                  that masquerades as the official Zoom app. At the time of
lisions. A malicious app can hijack another app’s commands,                     installation, our malicious app requests the commands scope
responding to any user that tries to launch the hijacked com-                   to implement a benign command called /foo. Once installed,
mand in the victim app’s stead. Two specific design flaws                       we rename this command as /zoom to hijack the previous
enable this attack. First, Slack only invokes the most recently                 official /zoom command. After that, the malicious app will
installed app when multiple apps in a workspace have regis-                     use the attacker’s Zoom account to start meetings every time
tered the same command. Second, both creating and renaming                      a user invokes the /zoom command, as shown in Figure 4b.
commands are silent and do not trigger a notification or per-                   We provide more implementation details in Appendix D.1.
mission prompt in Slack. As a result, one can hijack a targeted                 Attackers can also treat this vulnerability as a novel entry
command in two ways: (1) create a new command with the                          point for phishing attacks, as discussed in Appendix B.
same name as the targeted one; (2) rename an existing com-                         Since Microsoft Teams does not allow apps to register their
mand to the targeted one. In other words, the commands scope                    own commands, it does not suffer from this vulnerability.
becomes over-privileged as it implicitly allows an app to take
over any command within a workspace (by exploiting the
name collision). However, Slack does not recognize this de-                     5.2    Link Unfurling Hijacking
sign issue as a security-critical problem5 ; we find no runtime
policy checks of an app’s permission to create or rename                        Microsoft Teams allows an app to provide customized link un-
commands with a specific name.                                                  furling for an authorized user. The app can register a domain
   We demonstrate the command hijacking attack on Zoom’s                        in its manifest. Whenever the user posts a URL under this
Slack app [9]. From Zoom’s app, users can invoke the com-                       domain, the app can append a rich message card containing
mand /zoom to start private Zoom meetings and display a                         texts, images, or even interactive buttons. For example, Lu-
Zoom call in Slack, as shown in Figure 4a. If the command is                    cidchart’s Teams app [6] unfurls a document sharing URL to
                                                                                preview the document as well as a button to accept the sharing
   4 This may not be the case for apps published in the BCP official catalog,   invitation. Such unfurled content can be hijacked similarly to
as per their security guidelines. Although a Slack app can still requests       Slack’s slash command: a malicious app can register the same
chat:write.customize to send messages with customized appearance.
   5 Slack acknowledged this problem in its document, but only suggests         domain as the victim app and, if the malicious app is installed
developers to “avoid terms that are ... likely to be duplicated,” and not to    after the victim app, its unfurled content will be displayed
make the command “too complicated for users to easily remember.”                instead of the victim app’s one. Moreover, the malicious app



USENIX Association                                                                                31st USENIX Security Symposium         2019
can masquerade as the victim app to further deceive the user,                                                     Direct Messages
                                                                                           Personal Channel
as its name and icon will also be part of the unfurled content.                                               Messages                      Members
                                                                                               m1                                               User 1
   While Slack also allows multiple apps to register the same                                          Text         Unfurled Content
domain, it chooses to display all app’s unfurled contents in                                        https://...               m2

parallel, avoiding the issue of link unfurling hijacking.
                                                                        im:history

                                                                    User Token of User 1                          Private Channels
                                                                                                         Private Channel #1
5.3    Analysis of Root Cause and                                                                             Messages             Members
       Potential Prevalence                                                                                        m2
                                                                                                                                       User 1
                                                                                                                                         …

The command and unfurling hijacking attacks work by vio-
lating least privilege and complete mediation, which results          Figure 5: Privilege escalation exploiting link unfurling.
from an overprivileged scope and the improper tracking of
resource ownership. First, the corresponding scope that al-        6.1       Message Extraction Attack via
lows an app to use slash commands or unfurl a domain should                  Link Unfurls
not spontaneously grant the ability to modify the app’s cur-
rently registered command names or domains; an app that            BCPs have a built-in link unfurling feature that previews the
performs such operation should need to be re-installed. Sec-       website content for any URLs contained in a chat message.
ond, whenever an app registers a command or a domain, it           We first describe how link unfurling works with message
should gain ownership of this command or domain, however,          URLs and then show an attack where a malicious app without
given the namespace collision, both BCPs fail to enforce such      Slack’s groups:history, the permission scope that controls
ownership, which thus can be easily taken over by another          the read access to messages in private channel, abuses this
newly-installed app.                                               feature to effectively monitor all chats in any private channel
                                                                   joined by an authorized user.
Potential Prevalence. In Slack, this slash command attack
only exploits the commands scope, which is requested by
1,266 apps (51.5%). These apps can immediately overwrite           6.1.1      Unfurling of Message URLs
each other’s commands to hijack their standard workflows.          Slack provides a public URL to every message in a workspace.
Recall, once installed, these apps can change their slash com-     This URL, if accessed, will only show the message if the login
mands at any time, without requiring re-installation or notify-    credential of a user who has access to the message is provided.
ing the users (or admins) of the workspace. We also find           We find that when the user sends a message m1 in their own
that many apps in the Slack App Directory already have             personal channel (i.e., where users can message themselves)
conflicting commands: 270 apps register commands used              and m1 contains a URL that links to m2 , where m2 can be any
by other apps. This implies the wide reuse of conflicting          message in any of the channels that the user is a member of,
commands, and thus Slack is likely to preserve this design         Slack will automatically unfurl m2 , adding its text content (up
choice. In Microsoft Teams, the link unfurl attack relies on       to 8001 characters) and author as an additional attribute to the
the messageHandlers capability, which is requested by 77           original message m1 .
apps (5.9%). We find that 13 of them register a domain that is         While this is a reasonable and useful functionality because
also registered by other apps.                                     the user’s personal channel is intended for drafting messages
                                                                   and keeping links and files handy (as described by Slack),
                                                                   it leads to unwarranted access, as illustrated in Fig. 5. Slack
6     App-to-User Confidentiality Violations                       allows an app with im:history user token scope to read the
                                                                   user’s personal channel. This grants the app the ability to
We analyze the different ways in which BCP apps interact           read m1 with all its attachments. In this case, the attachments
with user messages. Our main discovery is that an attacker         include the unfurled content, which is m2 , a message from
can leak messages from private channels without having per-        a private channel. Therefore, the app is implicitly permitted
mission to read from those channels. Concretely, we can ex-        to read m2 , which is protected under the groups:history
ploit two features in Slack: (1) Link unfurling of message          scope, and the app with only im:history does not have
URLs (Section 6.1); (2) Pinning, starring, or emoji-reacting       access to originally.
to messages (Section 6.2). We additionally find that the root
cause behind this privilege escalation is incomplete media-
                                                                   6.1.2      Attack Workflow
tion coupled with a lack of ownership tracking of resources
(Section 6.3). We note that in Microsoft Teams these features      Now, we present a powerful attack based on the issue identi-
are either absent or inaccessible to apps, so it does not suffer   fied above. Through this attack, a malicious app can achieve
from this vulnerability.                                           privilege escalation — it gains the ability to monitor all chat



2020    31st USENIX Security Symposium                                                                                         USENIX Association
messages in any private channel where the victim user is a         reactions:write user token scope respectively. However,
member of, effectively gaining the permissions provided by         the read counterpart of these scopes (pins:, stars:, or
the groups:history user token scope but without explicitly         reactions:read) does more than permit the app to view
requesting it.                                                     the IDs of the pinned, starred, and reacted messages; they also
   The key insight enabling this attack is that if the attacker    allow the app to view the contents of these messages. There-
can learn the message URL of a private channel message, it         fore, after a valid channel ID and message ID is obtained, the
can then instruct the malicious app to post a generated URL        app with both read and write scopes can either pin, star, or
to the victim user’s personal channel (using the chat:write        react to the message, effectively allowing itself to read the
scope as we described in Section 4), actively leaking messages     given message. As we have seen in the prior attack, an app
from that private channel. We additionally find that Slack’s       without permission to read a user’s private channel message
message URL always follows the format:                             is still able to acquire the channel ID and message IDs of
      “https://[workspace].slack.com/archives/                     that channel’s messages. Hence, a malicious app can repeat-
          [channel-ID]/p[message-ID]”                              edly pin, star, or react to these messages and read through all
                                                                   messages in the channel. We note that the app can also undo
Therefore, the attacker’s job becomes learning valid combina-      these operations using the corresponding write scope again to
tions of channel ID and message ID.                                prevent the user from spotting any suspicious activity. With
   We have discovered several ways to obtain such combi-           this attack, the malicious app can read all the messages that
nations without resorting to groups:history and detailed           the user has access to, using only these seemingly harmless
them in Appendix D.3. Here we describe one method that             operations.
utilizes groups:read. This user token scope provides the
read access to the metadata of the user’s private channels,
including the channel ID and the ID of the latest message in       6.3    Analysis of Root Cause and
the channel. By constantly querying a channel’s metadata, the             Potential Prevalence
attacker can pull every message from any private channel the
                                                                   In both message extraction attacks, the malicious app obtains
victim user has joined. We note that even if multiple messages
                                                                   the ability to read any messages that the user has access to,
occur between two queries, the attacker can still guess their
                                                                   with only some irrelevant permission scopes. We consider
IDs since Slack’s message ID is a counter that increments for
                                                                   this behavior as a violation of the user’s privacy expectations.
consecutive messages (see Appendix D.3 for details).
                                                                   When a user grants the im:history scope to an app, there is
Extracting other types of messages and files. This attack          no description in the authorization prompt that suggests the
also works for other types of messages. An app’s bot user          app can read private channels6 . In addition, it puts the privacy
can use this to view any public channel messages without           of other users in these channels at risk — the messages they
the corresponding bot token scope or invitation to join that       posted may suddenly become accessible to an app that they
channel. Additionally, it can even be applied to read files        never authorized. Even worse, they have no way of knowing
shared with the user. Unlike message URL, there is no easy         the leakage, since all it takes is for one user to install the
way to obtain a valid file URL through alternative approaches;     app, an action that is hardly perceptible to them (Section 2.2),
yet, whenever a file is uploaded in a chat message, the file’s     while the app itself is never a member of the channel.
public URL will also be included in that message. The attacker        An adversarial admin can use these attacks to monitor
can then instruct Slack to unfurl the public URL to obtain a       chats in private channels they are not invited to by forcing
direct-downloadable link. Therefore, the attacker can access       everyone to install their malicious app that disguises itself as
files by reading all the messages in the user’s joined channels.   an innocent management app.
                                                                      Such privacy violation in the first attack is a failure of not
6.2    Message Extraction Attack via                               enforcing complete mediation, which results from the im-
                                                                   proper tracking of resource provenance in Slack. Take Fig. 5
       Pins, Stars, or Reactions                                   for example: when Slack finds a link to m2 in m1 , it blindly ap-
We demonstrate another message extraction attack exploiting        pends the content of m2 as m1 ’s attachments, without tracking
the incompleteness of resource ownership tracking in Slack.        where m2 originates from. As such, any entity that can read
This time we leverage the productivity feature of pinning and      m1 can also read m2 , whereas these two messages have differ-
starring messages (that add them to a user’s saved message         ent provenances and should be checked against two separate
list) and the convenience feature of adding emoji reactions        permissions. The second attack can also be mitigated if Slack
to messages. The attack builds upon the same message ID            tracks and checks who performed the operation. While Slack
guessing technique from the prior attack.                          needs to allow apps to read the content of pinned, starred, or
   To pin, star, or react to a message, the app needs to present      6 Accessing private channel messages with only im:history will cause
the message ID and the ID of the message’s channel to              Slack API to return an missing_scope error and a message saying that
the corresponding Slack API, with the pins:, stars:, or            groups:history is needed.




USENIX Association                                                                      31st USENIX Security Symposium              2021
emoji-reacted messages for functionality purposes, this rule        user. Then, whenever an app requests to read a message, Slack
should not apply if the app trying to read the message is the       should enforce an additional dynamic condition check to ex-
one who performed the operation (since it does not make             amine whether the provided token has the correct privilege
sense for an app to pin a message it does not already know).        to access the origin of the unfurled content. If not, only the
                                                                    message should be returned to the app, but not the appended
Potential Prevalence. Out of all 1,640 apps (66.7%) that
                                                                    unfurled content.
do not request explicit scopes to read private channels (i.e.,
                                                                       For the attack via pins, stars, or reactions, we present two
groups:history), we only counted 11 apps with the neces-
                                                                    options. The first is that when an app wants to read the pinned
sary permissions to extract messages via pins, stars, reactions,
                                                                    or starred messages, Slack should send the message content
or link unfurls.
                                                                    only if the app has the privilege to read the original message;
                                                                    otherwise, only the message ID is returned. However, this
7     Potential Countermeasures                                     may inversely encourage malicious apps to request more priv-
                                                                    ileges to maintain their original functionality. The second is
We discuss countermeasures for the attacks we previously dis-       for the BCP to consider the entity that issued the pin, star, or
cussed. We note that these countermeasures are point fixes for      react operation. For example, an app can only read the content
the BCP permission model as it currently exists. The attack         of a pinned/starred/reacted message if the pinning/starring/re-
classes we’ve identified exist because the BCP permission           acting is done by a human user or a different app; if it is done
model violates classic security principles. As such, even with      by the requesting app itself, then the BCP only returns the
these countermeasures, we cannot guarantee that all future is-      message ID. The tracking should occur even when a user has
sues will be prevented. We characterize each countermeasure         delegated control of their account to an app. When an app
from three perspectives: which design issues it attempts to         performs actions on behalf of a user, those actions should still
solve, how much it helps mitigate the attacks, and what the         be tracked as having been taken by an app. This should not
cost or trade-off is.                                               hurt any benign app’s functionality because if a message is
                                                                    pinned, starred, or reacted on by a benign app, it is reasonable
                                                                    to assume that the app should already know the message’s
7.1    Finer-grained Scopes                                         content.
The BCPs we examined define several coarse-grained scopes              However, this countermeasure does not apply to situations
that manage multiple resources of different types. For exam-        where it is difficult for an app or Slack to determine whether
ple, Slack’s chat:write user scope allows an app to send            an action is malicious or user-intended. In Section 4.1, we
messages to any target with the identity of the authorizing user.   demonstrated various legitimate scenarios in which users in-
The Microsoft Teams Graph API Chat.ReadWrite scope                  deed want apps to perform actions on their behalf.
grants a Microsoft Teams app similar permissions. Therefore,
even if the app’s functionality only requires sending messages      7.3    Indicate Identity of Action Issuer
to human users, it needs to acquire one of these broad scopes,
which inevitably comes with the permission to send messages         To counter delegation attacks, the victim app should be able
to apps and thus the ability to perform impersonation attacks       to determine if a received event comes from a human or an
on other apps. These scopes are coarse-grained as they allow        impersonated user and thus choose whether to respond or not.
an app to send messages to separate targets (app and non-           Thus, BCPs should indicate the identity of the action issuer
app). BCPs can break down these scopes into two separate            (i.e., whether a real or delegated user performed the action)
scopes: one that allows sending messages to non-app targets,        and therefore allow for identity checks on the victim app’s
and another that allows messages to app targets. However, this      side. Slack has provided this information for a few actions,
countermeasure cannot handle the attacks exploiting scopes          such as posting messages but ignored it for other actions such
that do not have finer-grained concepts (such as command            as reacting to a message, which might also lead to exploits.
hijacking).                                                         However, as mentioned earlier, in some cases, even if the app
                                                                    knows the action is coming from another app, it is hard to tell
                                                                    whether the intent of the action is malicious or not.
7.2    Stricter Runtime Policy Checks
Stricter runtime checks can help address the message extrac-        7.4    Explicit User Confirmation
tion attacks found in Slack. Specifically, Slack first needs to
fix its coarse-grained modeling of the message resources by         The final countermeasure is to request confirmation from
decoupling the unfurled content from the message and treat-         users. From the perspective of victim users, all attacks stem
ing it as a separate type of resource. Slack also needs to track    from the fact that either victim apps or the BCPs automati-
the origin of the unfurled content, for example, whether it         cally reacted to malicious events (in an unwanted way). There-
is a message from another channel or a file shared with the         fore, before accessing sensitive data, both the apps and the



2022    31st USENIX Security Symposium                                                                       USENIX Association
BCP should prompt the user for confirmation. For example,             apps called skills. Similar to BCP apps, Alexa skills often ap-
they can create a consent popup UI that involves clicking a           pear in the form of chatbots; however the primary way of inter-
button. Based on the current design of Microsoft Teams and            acting with Alexa skills is through voice commands. Studies
Slack, only human users can perform such actions, making              have shown that Alexa skills can be easily squatted to enable
it hard to forge UI actions. This will prevent both delegation        phishing attacks [36, 54], similar to how Slack’s commands
and message extraction attacks.                                       can be hijacked. However, skill squatting relies on the inher-
   To resolve namespace collision attacks, BCPs should ac-            ent ambiguity of voices, whereas we exploit the namespace
tively check for namespace collisions when apps are being             collisions of commands. In an orthogonal direction, many
installed. For example, Slack should detect when an app               works try to measure the privacy practices of current Alexa
attempts to register a command with the same name as a                skills and find that many skills do not honor their privacy
command already registered in the workspace, and Microsoft            policy and request overprivileged access [18, 32, 37, 45].
Teams should detect when an app has the same name as an-
other app already installed in the workspace. We outline three        Android. Many studies have analyzed the security and pri-
solutions that BCPs may adopt. First, they can refuse to install      vacy of Android apps. The closest related attacks to this work
the new app whose command would conflict with an existing             are the confused deputy and collusion attacks [20, 26, 38, 39,
one. However, this robs BCPs of functionality and unfairly            42]. Just as in BCPs, the app-to-app communications in An-
penalizes apps installed later. Second, they can permit instal-       droid can be used with malicious intent; however, they usually
lation but require the user to make a selection whenever a            aim to achieve privilege escalation to access more user data
namespace collision arises during use, but this requires the          instead of attacking users’ accounts in other services. In ad-
user to pay attention at all times. Third, after detecting a colli-   dition, the problem of coarse-grained permission scopes is
sion, they can provide an alias mechanism where users can             also found in Android, granting apps powerful capabilities
change the conflicting names. In conclusion, runtime user             that can be used to exploit various vulnerabilities [34]. Mean-
confirmation can mitigate namespace collision attacks, but at         while, defenses proposed for Android apps usually require
the expense of productivity and user convenience.                     static or dynamic analysis [27, 29, 31, 51, 52], making them
                                                                      incompatible with BCP apps, which have no client-side codes.

8    Related Work                                                     Other OAuth-based systems. Studies have shown that over-
                                                                      privileged attacks are a common issue in OAuth-based sys-
To the best of our knowledge, this is the first paper to ana-         tems [21, 22, 28, 33, 35]. In addition, despite its wide adoption,
lyze the security and privacy of third-party apps in business         OAuth is usually poorly designed and implemented by de-
communication platforms. However, considerable work has               velopers [24, 46, 50]. BCPs use coarse-grained scopes for
been done in other types of app platforms that share varying          certain operations and couple them with separate runtime
degrees of similarities with BCPs.                                    policy checks that we have shown to be incomplete.
Social networks. Facebook and other social network plat-
forms allow third-party applications that offer users additional
functionality and services but generally at the cost of user pri-
vacy [23, 40]. These apps are similar to BCP apps in terms            9   Limitations
of pure server-side implementations and all-or-nothing per-
mission, but they are installed in a single-user home space,
                                                                      For ethical reasons, we did not publish our attack apps to the
whereas BCP apps are in a multi-user workspace. Symeoni-
                                                                      Slack app directory or Microsoft Teams app store, and thus
dis et al. show Facebook apps lead to collateral informa-
                                                                      cannot comment on their vetting processes. However, we did
tion collection [47], where they can collect not only data
                                                                      analyze their security guidelines [12, 16] for publishing apps
of the users who install them but also of their friends. This
                                                                      and found no obvious restrictions that would fundamentally
is akin to our findings of BCP apps; however, BCP apps
                                                                      prevent the attacks described in this paper. These attacks rely
can also actively affect other users’ actions, such as through
                                                                      on abusing permissions acquired for benign purposes, caus-
interaction hijacking. On the other hand, several studies pro-
                                                                      ing the information-limited vetting to be ineffective. BCPs
pose different access control schemes for apps in social net-
                                                                      do, however, prohibit two apps from sharing the same name,
works [19, 25, 43, 44, 48, 49]. While these solutions aim to
                                                                      making it harder for a published app to mimic the appear-
solve the problem of coarse-grained permissions, they usually
                                                                      ance of another app; but as we noted in Section 5, a Slack
require the social network provider to host some part of the
                                                                      app can circumvent this restriction by requesting the chat:
application codes, which does not suit the current communi-
                                                                      write.customize permission scope, which allows the app
cation framework of BCP apps.
                                                                      the send messages using customized name and icon, avoiding
Voice assistants. Amazon Alexa, a voice assistant often built         the need to modify the app’s own name and icon declared in
into smart home devices, allows users to install third-party          the manifest.



USENIX Association                                                                       31st USENIX Security Symposium           2023
10     Conclusions                                                 [13] Business Apps - Microsoft AppSource. https://apps
                                                                        ource.microsoft.com/en-us/marketplace/apps,
We performed an experimental security analysis of the app               2021.
model of two popular BCPs: Slack and Microsoft Teams.
Our methodology was to study each BCP-facilitated interac-         [14] Slack quickly removes message invites in its new DM
tion method between apps and users. We found that these                 feature over harassment concerns . https://www.th
BCPs violate two standard security principles: least access             everge.com/2021/3/24/22348743/slack-connec
and complete mediation. We created proof-of-concept attacks             t-dm-abuse-harassment-disable-message-invi
that exploit these violations to (1) impersonate users and trick        te-response, 2021.
victim apps into performing unwanted actions; (2) hijack           [15] That Slack email you just got asking to reset your pass-
commands; (3) steal messages from private channels without              word is legit, not a scam. https://www.androidpol
appropriate permissions. Our discussion of countermeasures              ice.com/2021/02/05/that-slack-email-you-ju
indicates that while point fixes for these attacks can be de-           st-got-asking-to-reset-your-password-is-le
ployed at the cost of BCP usability, preventing further issues          git-not-a-scam/, 2021.
requires redesigning the BCP app access control model.
                                                                   [16] Microsoft Teams store validation guidelines. https:
Acknowledgement. We thank our shepherd Bruno Crispo,                    //docs.microsoft.com/en-us/microsoftteams/
all anonymous reviewers and Andrei Sabelfeld for their in-              platform/concepts/deploy-and-publish/appso
sightful feedback. This work was partially supported by                 urce/prepare/teams-store-validation-guidel
the University of Wisconsin–Madison Office of the Vice                  ines, 2022.
Chancellor for Research and Graduate Education with fund-
ing from the Wisconsin Alumni Research Foundation, the             [17] Teams + Power Automate. https://powerautomate.
DARPA GARD program under agreement number 885000,                       microsoft.com/en-US/connectors/details/sha
and NSF through awards: CNS-1838733, CNS-1942014,                       red_teams/microsoft-teams/, 2022.
CNS-2003129, and CNS-2144376.                                      [18] Abdulaziz Alhadlaq, Jun Tang, Marwan Almaymoni,
                                                                        and Aleksandra Korolova. Privacy in the amazon alexa
References                                                              skills ecosystem. Star, 217(11), 2017.
                                                                   [19] Pauline Anthonysamy, Awais Rashid, James Walkerdine,
 [1] Bitbucket. https://appsource.microsoft.com/en
                                                                        Phil Greenwood, and Georgios Larkou. Collaborative
    -us/product/office/WA200002405.
                                                                        privacy management for third-party applications in on-
 [2] Chatlio. https://slack.com/apps/A03BS4Q25.                         line social networks. In Proceedings of the 1st Workshop
                                                                        on Privacy and Security in Online Social Media, pages
 [3] Dokkio. https://slack.com/apps/AJ4H0RRBJ.                          1–4, 2012.
 [4] Dropbox. https://slack.com/apps/AES7B2V7D.                    [20] Sven Bugiel, Lucas Davi, Alexandra Dmitrienko,
 [5] Google calendar. https://slack.com/apps/ADZ49                      Thomas Fischer, Ahmad-Reza Sadeghi, and Bhargava
     4LHY.                                                              Shastry. Towards taming privilege-escalation attacks on
                                                                        android. In NDSS, volume 17, page 19. Citeseer, 2012.
 [6] Lucidcharts. https://appsource.microsoft.com/
                                                                   [21] Z Berkay Celik, Leonardo Babun, Amit Kumar Sikder,
     en-us/product/office/WA104381935.
                                                                        Hidayet Aksu, Gang Tan, Patrick McDaniel, and A Sel-
 [7] Mailclark. https://slack.com/apps/A0JUW1X96.                       cuk Uluagac. Sensitive information tracking in com-
                                                                        modity iot. In 27th {USENIX} Security Symposium
 [8] Ziri. https://slack.com/apps/A8256N5BK.                            ({USENIX} Security 18), pages 1687–1704, 2018.
 [9] Zoom. https://slack.com/apps/A5GE9BMQC.                       [22] Z Berkay Celik, Patrick McDaniel, and Gang Tan.
[10] Business Chat Apps in 2018: Top Players and Adoption               Soteria: Automated iot safety and security analysis.
     Plans. https://community.spiceworks.com/blo                        In 2018 {USENIX} Annual Technical Conference
     g/3157-business-chat-apps-in-2018-top-play                         ({USENIX}{ATC} 18), pages 147–158, 2018.
     ers-and-adoption-plans, 2018.                                 [23] Abdelberi Chaabane, Yuan Ding, Ratan Dey, Mo-
[11] Add Apps to Slack | Apps and Integrations | Slack App              hamed Ali Kaafar, and Keith W Ross. A closer look
     Directory. https://slack.com/apps, 2021.                           at third-party osn applications: Are they leaking your
                                                                        personal information? In International conference on
[12] Best practices for security | Slack. https://api.slac              passive and active network measurement, pages 235–
     k.com/authentication/best-practices, 2021.                         246. Springer, 2014.



2024    31st USENIX Security Symposium                                                                    USENIX Association
[24] Eric Y Chen, Yutong Pei, Shuo Chen, Yuan Tian, Robert           and Todd Millstein. Dr. android and mr. hide: fine-
     Kotcher, and Patrick Tague. Oauth demystified for mo-           grained permissions in android applications. In Pro-
     bile application developers. In Proceedings of the 2014         ceedings of the second ACM workshop on Security and
     ACM SIGSAC conference on computer and communica-                privacy in smartphones and mobile devices, pages 3–14,
     tions security, pages 892–903, 2014.                            2012.

[25] Yuan Cheng, Jaehong Park, and Ravi Sandhu. Preserv-        [35] Yizhen Jia, Yinhao Xiao, Jiguo Yu, Xiuzhen Cheng,
     ing user privacy from third-party applications in online        Zhenkai Liang, and Zhiguo Wan. A novel graph-based
     social networks. In Proceedings of the 22nd Interna-            mechanism for identifying traffic vulnerabilities in smart
     tional Conference on World Wide Web, pages 723–728,             home iot. In IEEE INFOCOM 2018-IEEE Conference
     2013.                                                           on Computer Communications, pages 1493–1501. IEEE,
                                                                     2018.
[26] Lucas Davi, Alexandra Dmitrienko, Ahmad-Reza
     Sadeghi, and Marcel Winandy. Privilege escalation at-      [36] Deepak Kumar, Riccardo Paccagnella, Paul Murley, Eric
     tacks on android. In international conference on Infor-         Hennenfent, Joshua Mason, Adam Bates, and Michael
     mation security, pages 346–360. Springer, 2010.                 Bailey. Skill squatting attacks on amazon alexa. In 27th
                                                                     {USENIX} Security Symposium ({USENIX} Security
[27] William Enck, Peter Gilbert, Seungyeop Han, Vasant
                                                                     18), pages 33–47, 2018.
     Tendulkar, Byung-Gon Chun, Landon P Cox, Jaeyeon
     Jung, Patrick McDaniel, and Anmol N Sheth. Taint-          [37] Christopher Lentzsch, Sheel Jayesh Shah, Benjamin
     droid: an information-flow tracking system for realtime         Andow, Martin Degeling, Anupam Das, and William
     privacy monitoring on smartphones. ACM Transactions             Enck. Hey alexa, is this skill safe?: Taking a closer look
     on Computer Systems (TOCS), 32(2):1–29, 2014.                   at the alexa skill ecosystem. In 28th Annual Network and
                                                                     Distributed System Security Symposium (NDSS 2021).
[28] Earlence Fernandes, Jaeyeon Jung, and Atul Prakash.
                                                                     The Internet Society, 2021.
     Security analysis of emerging smart home applications.
     In 2016 IEEE symposium on security and privacy (SP),       [38] Haoran Lu, Luyi Xing, Yue Xiao, Yifan Zhang, Xiaojing
     pages 636–654. IEEE, 2016.                                      Liao, XiaoFeng Wang, and Xueqiang Wang. Demysti-
[29] Yanick Fratantonio, Antonio Bianchi, William Robert-            fying resource management risks in emerging mobile
     son, Engin Kirda, Christopher Kruegel, and Giovanni             app-in-app ecosystems. In Proceedings of the 2020
     Vigna. Triggerscope: Towards detecting logic bombs              ACM SIGSAC Conference on Computer and Communi-
     in android applications. In 2016 IEEE symposium on              cations Security, pages 569–585, 2020.
     security and privacy (SP), pages 377–396. IEEE, 2016.      [39] Claudio Marforio, Aurélien Francillon, and Srdjan Cap-
[30] Don Goodman-Wilson. Bot-to-bot communication mod-               kun. Application collusion attack on the permission-
     els for slack, Sep 2016.                                        based security model and its implications for modern
                                                                     smartphone systems. Technical report, ETH Zurich,
[31] Michael I Gordon, Deokhwan Kim, Jeff H Perkins,                 2011.
     Limei Gilham, Nguyen Nguyen, and Martin C Rinard.
     Information flow analysis of android applications in       [40] Nicky Robinson and Joseph Bonneau. Cognitive discon-
     droidsafe. In NDSS, volume 15, page 110, 2015.                  nect: understanding facebook connect login permissions.
                                                                     In Proceedings of the second ACM conference on Online
[32] Zhixiu Guo, Zijin Lin, Pan Li, and Kai Chen. Skill-             social networks, pages 247–258, 2014.
     explorer: Understanding the behavior of skills in
     large scale. In 29th {USENIX} Security Symposium           [41] Jerome H Saltzer and Michael D Schroeder. The protec-
     ({USENIX} Security 20), pages 2649–2666, 2020.                  tion of information in computer systems. Proceedings
                                                                     of the IEEE, 63(9):1278–1308, 1975.
[33] Grant Ho, Derek Leung, Pratyush Mishra, Ashkan Hos-
     seini, Dawn Song, and David Wagner. Smart locks:           [42] Roman Schlegel, Kehuan Zhang, Xiao-yong Zhou,
     Lessons for securing commodity internet of things de-           Mehool Intwala, Apu Kapadia, and XiaoFeng Wang.
     vices. In Proceedings of the 11th ACM on Asia confer-           Soundcomber: A stealthy and context-aware sound tro-
     ence on computer and communications security, pages             jan for smartphones. In NDSS, volume 11, pages 17–33,
     461–472, 2016.                                                  2011.

[34] Jinseong Jeon, Kristopher K Micinski, Jeffrey A            [43] Mohamed Shehab, Anna Cinzia Squicciarini, and Gail-
     Vaughan, Ari Fogel, Nikhilesh Reddy, Jeffrey S Foster,          Joon Ahn. Beyond user-to-user access control for online



USENIX Association                                                                31st USENIX Security Symposium         2025
       social networks. In International Conference on Infor-      [54] Nan Zhang, Xianghang Mi, Xuan Feng, XiaoFeng Wang,
       mation and Communications Security, pages 174–189.               Yuan Tian, and Feng Qian. Dangerous skills: Un-
       Springer, 2008.                                                  derstanding and mitigating security risks of voice-
                                                                        controlled third-party functions on virtual personal as-
[44] Kapil Singh, Sumeer Bhola, and Wenke Lee. xbook:                   sistant systems. In 2019 IEEE Symposium on Security
     Redesigning privacy control in social networking plat-             and Privacy (SP), pages 1381–1396. IEEE, 2019.
     forms. In USENIX Security Symposium, pages 249–266,
     2009.
                                                                   A    Exploiting File-based Interactions
[45] Dan Su, Jiqiang Liu, Sencun Zhu, Xiaoyang Wang, and
     Wei Wang. " are you home alone?"" yes" disclosing             Dokkio [3] is a cloud service that provides a single place
     security and privacy vulnerabilities in alexa skills. arXiv   to manage a user or team’s files stored in different cloud
     preprint arXiv:2010.10788, 2020.                              storage services, including DropBox, Google Drive, Gmail,
                                                                   and Slack. To manage files in Slack, it connects to the user’s
[46] San-Tsai Sun and Konstantin Beznosov. The devil is
                                                                   Slack account and request permission to read files uploaded in
     in the (implementation) details: an empirical analysis
                                                                   the workspace. Once the user shares a file in Slack, Dokkio’s
     of oauth sso systems. In Proceedings of the 2012 ACM
                                                                   Slack app will automatically collect this file and provides
     conference on Computer and communications security,
                                                                   numerous add-on services such as content organizing and
     pages 378–390, 2012.
                                                                   cognitive services. In this case, the user’s Dokkio account is a
[47] Iraklis Symeonidis, Gergely Biczók, Fatemeh Shirazi,          resource that only Dokkio and the user can access. Similar to
     Cristina Pérez-Solà, Jessica Schroers, and Bart Preneel.      the attacks discussed above, once an app can share files on the
     Collateral damage of facebook third-party applications:       user’s behalf, it implicitly gains access to Dokkio’s backend
     a comprehensive study. Computers & Security, 77:179–          resources.
     208, 2018.                                                       In this attack, we show that the attacker, though not autho-
                                                                   rized to access the user’s Dokkio account, can add any files
[48] Sarath Tomy and Eric Pardede. Controlling privacy             to the user’s file management portal in Dokkio. We design a
     disclosure of third party applications in online social       malicious app that requests the files:write user scope and
     networks. International Journal of Web Information            launch the attack by uploading arbitrary files to Slack on the
     Systems, 2016.                                                user’s behalf. After that, Dokkio will automatically collect
[49] Bimal Viswanath, Emre Kiciman, and Stefan Saroiu.             the shared files and add them to the user’s Dokkio account.
     Keeping information safe from social networking apps.
     In Proceedings of the 2012 ACM workshop on Workshop           B    Phishing Attacks based on Command Hi-
     on online social networks, pages 49–54, 2012.
                                                                        jacking
[50] Hui Wang, Yuanyuan Zhang, Juanru Li, Hui Liu, Wenbo
     Yang, Bodong Li, and Dawu Gu. Vulnerability assess-           Attackers can treat the design issue of command namespace
     ment of oauth implementations in android applications.        collisions as a novel entry point for phishing attacks. For
     In Proceedings of the 31st annual computer security           example, the malicious app can request the user to authorize
     applications conference, pages 61–70, 2015.                   third-party services. In Figure 6, we demonstrate a phishing
                                                                   attack by hijacking the /gcal command from the Google
[51] Fengguo Wei, Sankardas Roy, and Xinming Ou. Aman-             Calendar app.
     droid: A precise and general inter-component data flow
     analysis framework for security vetting of android apps.
     In Proceedings of the 2014 ACM SIGSAC conference
     on computer and communications security, pages 1329–
     1341, 2014.
[52] Michelle Y Wong and David Lie. Intellidroid: A tar-
     geted input generator for the dynamic analysis of an-
     droid malware. In NDSS, volume 16, pages 21–24, 2016.
                                                                   Figure 6: Demonstration of phishing attacks using the Com-
[53] Bin Yuan, Yan Jia, Luyi Xing, Dongfang Zhao, Xi-
                                                                   mand Hijacking attack in Slack. The two messages are sent
     aoFeng Wang, and Yuqing Zhang. Shattered chain of
                                                                   to the user after invoking the official and hijacked /gcal
     trust: Understanding security risks in cross-cloud iot ac-
                                                                   command, respectively. The attacker can start a valid OAuth
     cess delegation. In 29th {USENIX} Security Symposium
                                                                   authorization process to acquire access to the user’s account.
     ({USENIX} Security 20), pages 1183–1200, 2020.



2026     31st USENIX Security Symposium                                                                     USENIX Association
C     BCP App Installation Page
Figures 8 and 9 show the installation of BCP apps (e.g., Slack)
requesting bot scopes and user scopes. Note that in Figure 9,
the app is able to perform actions on behalf of the user, such
as sending messages and direct messages.

      User Action                                Counter Increment
      User Posting a message with text                 200
      App Posting a message with text                  100
      Posting a message with only file                 100
      Saving a draft (happens automatically 10         100
      seconds after the user stops typing)

Figure 7: Slack Message Counter Increment. For each consec-
utive message, the counter value is increased by 100x, where
x starts at 0 and gradually increases based on actions of the
users in the channel.




                                                                           Figure 9: Installing Slack apps with user scopes.

                                                                     malicious app gets notified and starts the attack by interacting
                                                                     with other targeted apps in the workspace.
                                                                        The first four malicious apps request permission to send
                                                                     messages on behalf of the user. They launch the attack by
                                                                     sending specific messages that the targeted apps were de-
        Figure 8: Installing Slack apps with bot scopes.             signed to read and process. The last malicious app requests
                                                                     permission to react to messages on behalf of the user. It
                                                                     launches the attack by reacting with an emoji that the tar-
D     Implementation Details of Attacker Apps                        geted app is designed to notice and retweet.
In this section, we provide more implementation details of
our attacker apps demonstrated in Sections 4 to 6. All apps          D.2    User-to-App Interaction Hijacking
are implemented by following the official guideline and APIs.
                                                                     In Section 5, we demonstrate the command hijacking attack
D.1      App-to-App Delegation Attacks                               on Zoom, which requires implementing a malicious app that
                                                                     mimics the appearance and behavior of the official Zoom app.
In Section 4.2, we demonstrate five delegation attacks. For          To this end, we register an app with slash command permis-
each attack, the attacker registers a malicious app that pro-        sion but deliberately implement the command responses with
vides benign functionality and requests a legitimate set of          Zoom APIs (of the attacker’s controlled Zoom account) to
permissions (detailed below). After that, the attacker either in-    mimic the official Zoom app. As BCPs permit installing apps
stalls the malicious app to their workspace (where the attacker      from just a public URL, we do not have to publish the apps
is a curious user) or tricks a user into installing apps in the      on official app stores. This approach avoids any accidental
user’s workspace. Once installed and granted permission, the         distribution of malicious apps to other BCP users.



USENIX Association                                                                      31st USENIX Security Symposium         2027
   Furthermore, this attack can be extended to hijack any other    message to the channel, which will cause the Slack API to
apps, as long as the attacker can re-implement the proper          return the ID of the newly posted message.
functionalities of the targeted app. The appearance of an app
                                                                   Attack workflow.
is publicly available in the official app directory.
                                                                   1) The attacker obtains a valid combination of channel ID
                                                                       and message ID using the techniques described above. We
D.3    App-to-User Confidentiality Violations                          refer to the message ID as (t0 , c0 ). If it obtains the message
We provide more details of how the attacker can obtain the             ID via posting new messages, then it immediately deletes
channel and message IDs described in Section 6.1.                      the message to hide its trace, which is also permitted by
                                                                       the chat:write scope.
Obtaining channel ID. Each channel ID is a random string.          2) After a short time τ, the attacker obtains another valid
The direct way to learn the ID of a private channel is by re-          message ID (t0 + τ, c1 ).
questing a less alarming scope, groups:read, which provides        3) The attacker guesses all possible message IDs, which is
the read access to a private channel’s metadata. Alternatively,        the cartesian product of (t0 ,t0 + 1, ...,t0 + τ) and (c0 +
if the attacker knows the name of the channel (through side            100, c0 + 200, ..., c1 − 100).
channels or guessing; per our threat model the attacker can be     4) The attacker uses the guessed IDs to generate the message
a curious workspace member who has some prior knowledge),              URL and posts it to the user’s personal channel. The URLs
it can use the chat:write scope to write a new message.                of the valid IDs will get unfurled.
It can just provide the channel name to the corresponding
chat.postMessage API, which will accept this request and              By repeating this attack over and over again for different
return the channel ID as part of the response.                     message IDs, the attacker can eventually pull every message
                                                                   from any private channel that the victim user has joined, ef-
Obtaining message ID. The direct way to learn the message          fectively granting the malicious app the power of the groups
ID requires groups:history, which also grants the ability          :history scope even though this scope is never explicitly
to directly read messages, avoiding the need for any attack        requested. We note that the attacker should adjust the time
because an app can simply misuse that permission to leak           interval τ dynamically based on the messaging frequency to
messages. However, unlike channel ID which is completely           aim for c1 − c0 ≤ 500, so that it can post all possible IDs in
randomized, the format of a message ID follows a simple,           step 3 under Slack’s rate limit (which allows unfurling of up
intuitive pattern, consisting of only the current timestamp and    to 5 URLs per second).
a counter value. An example message ID is shown below:

                    1616604187
                    |   {z   } 0000600
                               | {z }
                     Timestamp    Counter

The first 10 digits represent the UNIX epoch timestamp of the
message in seconds, and the last 7 digits is a counter that gets
increased for each consecutive message and resets to 0 after
approximately 5 days of inactivity. We conducted a series of
controlled experiments and empirically found that the counter
increments according to the following rules:
1) The increment between two consecutive messages is al-
    ways a multiple of 100. Although this increment is usu-
     ally 200, it may change based on the user actions listed in
     Fig. 7.
2) The counters are independent across different channels,
     as well as user actions in different channels.
Due to the first rule, the attacker cannot predict the exact
message ID given the previous ID, as Slack does not provide
a way to learn how many drafts are saved internally. However,
if the attacker is given two valid IDs separated by a small
time interval, then it is straightforward to guess the valid IDs
in between. We describe two ways of learning a valid ID.
The first way is, again, to rely on the groups:read scope,
since the metadata of the channel includes the ID of the latest
message in the channel. The second way is to write a new



2028    31st USENIX Security Symposium                                                                         USENIX Association
