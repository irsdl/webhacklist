---
type: Article
title: "Zero Knowledge (About) Encryption: A Comparative Security Analysis of Three Cloud-based Password Managers"
description: "\"Zero knowledge encryption\" is a vendor term with no technical meaning, conveying that a server holding an encrypted vault learns nothing about it even when fully malicious. Comparing that claim against Bitwarden, LastPass, Dashlane and 1Password - together over 60 million users - shows where a malicious server can still observe or influence vault contents."
resource: "https://eprint.iacr.org/2026/058"
tags: [article, webseclist-reference, en, iacr-cryptology-eprint-archive, password-manager, crypto, identity, data-breach, case-study, owasp-a02-2021, owasp-a07-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T13:15:29+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://eprint.iacr.org/2026/058"
    title: "Zero Knowledge (About) Encryption: A Comparative Security Analysis of Three Cloud-based Password Managers"
    author: Matteo Scarlata, Giovanni Torrisi, Matilda Backendal, Kenneth G. Paterson
    last_modified: 2026-01-14
also_at:
  - "https://eprint.iacr.org/2026/058.pdf"
authors:
  - Matteo Scarlata
  - Giovanni Torrisi
  - Matilda Backendal
  - Kenneth G. Paterson
canonical_url: ""
cited_by:
  - "2026-ai.md:168"
commit: ""
content_sha256: 795cb7f821497bf0514a494b0f97596225a48be64be6b57342dec14de8076f8b
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://eprint.iacr.org/2026/058"
published: 2026-01-14
publisher: IACR Cryptology ePrint Archive
publisher_english: ""
raw_sha256: 139960a884fb19115bd8066f079bb1e80a5527fdd7f8037eec0c79a52dfe34f6
retrieved_from: "https://eprint.iacr.org/2026/058.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T13:15:29+00:00"
slug: 2026-iacr-cryptology-eprint-archive-zero-knowledge-about-encryption-managers
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Zero Knowledge (About) Encryption: A Comparative Security Analysis of Three Cloud-based Password Managers

**Zero Knowledge (About) Encryption: A Comparative Security Analysis of Three Cloud-based Password Managers** - Matteo Scarlata, Giovanni Torrisi, Matilda Backendal, Kenneth G. Paterson, IACR Cryptology ePrint Archive.

- Published: 2026-01-14
- Original: <https://eprint.iacr.org/2026/058>
- Also published at: <https://eprint.iacr.org/2026/058.pdf>
- Preserved from: https://eprint.iacr.org/2026/058.pdf (live) on 2026-08-19
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Zero Knowledge (About) Encryption:
       A Comparative Security Analysis of Four Cloud-based Password Managers

    Matteo Scarlata              1 , Giovanni Torrisi             2 † , Matilda Backendal             2 † , and Kenneth G. Paterson           1

                                  1 Department of Computer Science, ETH Zurich, Switzerland
                      2 Faculty of Informatics, Università della Svizzera italiana (USI), Switzerland




                               Abstract                                             hundreds [65]. Password managers help to tame the problem
Zero Knowledge Encryption is a term widely used by vendors                          by providing a tool to securely store passwords, reducing the
of cloud-based password managers. Although it has no strict                         challenge of remembering many passwords to remembering
technical meaning, the term conveys the idea that the server,                       just the one “master password” for the password manager.
who stores encrypted password vaults on behalf of users, is                         Cloud-based password managers outsource the storage to a
unable to learn anything about the contents of those vaults.                        remote server under the control of a service provider. At an
The security claims made by vendors imply that this should                          abstract level, a user’s passwords are collected in a single
hold even if the server is fully malicious. This threat model                       object which is then encrypted by the user’s client under a
is justified in practice by the high sensitivity of vault data,                     cryptographic key derived from the user’s master password,
which makes password manager servers an attractive target                           creating an encrypted vault. The client then uploads the
for breaches (as evidenced by a history of attacks).                                encrypted vault to the server. When a user wishes to access
                                                                                    a password for a particular service, their client authenticates
   We examine the extent to which security against a fully
                                                                                    to the service, retrieves the encrypted vault, and decrypts it
malicious server holds true for four leading vendors who
                                                                                    locally with a user-provided copy of the master password.
make the Zero Knowledge Encryption claim: Bitwarden,
LastPass, Dashlane and 1Password. Collectively, they have                              Importantly in solutions of this type, the service provider
more than 60 million users and 28% market share. We present                         does not see the vault plaintext and therefore does not im-
12 distinct attacks against Bitwarden, 7 against LastPass, 6                        mediately learn the user’s passwords or other sensitive data.
against Dashlane and 6 against 1Password. The attacks range                         This is akin to the situation with end-to-end encrypted (E2EE)
in severity, from integrity violations of targeted user vaults                      cloud storage, and while the terms E2EE or client-side en-
to the complete compromise of all the vaults associated with                        cryption are sometimes used by vendors in this space, the
an organisation. The majority of the attacks allow recovery                         most commonly used term is Zero Knowledge Encryption.
of passwords. We have disclosed our findings to the vendors                         The term Zero Knowledge of course has a specific technical
and remediation is underway.                                                        meaning in the context of interactive protocols, but here the
   Our attacks showcase the importance of considering the                           term is being used with a different meaning, as we shall see.
malicious server threat model for cloud-based password man-                            The cloud-based approach has multiple advantages: users
agers. Despite vendors’ attempts to achieve security in this                        can access their encrypted vaults from multiple devices; vaults
setting, we uncover several common design anti-patterns and                         can store other sensitive information beyond passwords (e.g.
cryptographic misconceptions that resulted in vulnerabilities.                      credit card data, personal documents); and the service can be
We discuss possible mitigations and also reflect more broadly                       extended to allow sharing of sensitive data within a family,
on what can be learned from our analysis by developers of                           group or organisation. The “access from anywhere” feature
end-to-end encrypted systems.                                                       creates work for vendors, who have to support access from
                                                                                    web browsers as well as stand-alone applications running on
                                                                                    different OSes. Many vendors have offerings which allow the
1     Introduction                                                                  cloud storage element to be self-hosted by an organisation
                                                                                    instead of by the vendor.
Despite the rise of alternative authentication methods, users                          Four prominent providers in this space are Bitwarden, Dash-
today still have to deal with passwords, often numbering in the                     lane, LastPass and 1Password. At the time of writing, Bit-
    † Part of this work was done while Giovanni Torrisi and Matilda Backendal       warden claims to have 10 million users, Dashlane 19 million
were at ETH Zurich.                                                                 users and 24,000 business customers, and LastPass 33 million


                                                                                1
users and 100,000 business customers [22, 31, 60]. A 2024                               3. Secure sharing and account recovery. If these features
report [75] based on a survey of 1000 US consumers gives                                   are enabled, then only the set of other users with whom a
further insight into the popularity and market share of pass-                              given user intends to share some or all of their vault data
word managers. The built-in password managers of Google                                    (or grant an account recovery capability) should be able
and Apple now represent 55% of the market, up from a com-                                  to access that data (respectively, recover the account).
bined share of only 15% in 2021. Bitwarden and LastPass                                  Several subsidiary security properties are needed to achieve
are the next two largest, according to the study, with 11% and                        these goals. For example, it should be hard for a malicious
10% market share, respectively. Dashlane now has only 2%                              server to weaken the cryptography used by clients (e.g., re-
market share, down from 7% in 2021 when it was amongst                                ducing the iteration count used in password hashing).
the market leaders.1 The same report places 1Password as the                             More advanced goals can also be envisaged, e.g. vault indis-
fifth most popular password manager (after Google, Apple,                             tinguishability, oblivious client operations, device privacy, etc.
LastPass, and Bitwarden) at 5% market share; the company                              Such goals are far from being achieved by today’s password
reports 180,000 business customers and “millions” of users,                           managers and thus out of scope for our analysis; however,
including one million developers [1]. There is a long tail of                         see [13] for a recent study of possible security properties.
smaller players in the market.
                                                                                      Our Results. In Section 4, we give a detailed analysis of
Threat Model. We conduct our analysis of cloud-based                                  Bitwarden, Dashlane, LastPass and 1Password, presenting
password managers in a threat model in which the servers                              a cornucopia of practical attacks. In the artefacts that ac-
storing users’ vaults are assumed to be fully malicious, mean-                        company this paper, described in Section B, we give Proof of
ing that they can arbitrarily deviate from expected behaviour                         Concept (PoC) implementations of all of these attacks, demon-
when interacting with clients. This is a stronger model than                          strating their feasibility. The attacks allow us to downgrade
considered in prior work. We present three arguments to                               security guarantees, violate security expectations, and even
justify this in Section 2, summarised here. First, vendors’                           fully compromise users’ accounts. Table 1 lists the attacks
explanations of Zero Knowledge Encryption and E2EE ter-                               and their impacts.
minology imply that security is maintained in this setting.                              Worryingly, the majority of the attacks allow recovery of
Second, given the large amount of sensitive data that they                            passwords – the very thing that the password managers are
store, the service providers are likely targets for sophisticated                     meant to protect.
attackers capable of penetrating the servers and then mount-                             We group the attacks into four categories: attacks exploit-
ing active attacks (indeed, some vendors have been repeatedly                         ing the key escrow features used for account recovery and
breached [48, 56, 78]). Third, in closely related areas such                          SSO login, attacks based on lack of integrity of the vault as
as cloud storage and messaging, security against a malicious                          a whole, attacks enabled by the sharing features, and, finally,
server is by now de rigueur.                                                          attacks exploiting backwards compatibility features.
                                                                                         These attacks reveal common design anti-patterns and cryp-
Security Expectations. Given this threat model, what secu-
                                                                                      tographic misconceptions. Lack of authentication of public
rity should users reasonably expect of password managers?
                                                                                      keys is widespread. When combined with key escrow and
Based on prior work and our examination of vendors’ security
                                                                                      sharing features, this results in the adversary being able to
claims, we argue that the appropriate guarantees are:
                                                                                      fully compromise vaults. Another recurring failure mode
  1. Confidentiality of all data in a user’s vault. This in-                          is (wrongly) assuming origin-authentication of public key
     cludes the items – that is, credentials (usernames and                           ciphertexts, leading to key substitution attacks against Bitwar-
     passwords), but also credit card information and notes.                          den in the style of [7, 50]. LastPass stands out for lacking
     Most metadata is not kept confidential in the systems we                         any form of ciphertext integrity, using AES-CBC as its main
     studied, but achieving this is also desirable.                                   encryption mode. Thanks to legacy code and backwards
                                                                                      compatibility exploits, we can downgrade Bitwarden and
  2. Integrity of vault data (and metadata). This should apply                        Dashlane to similarly hazardous states. We also show that
     at the level of individual items, but also at the level of                       integrity is only achieved for single fields in individual items,
     the data collection as a whole. It should be infeasible                          instead of at the vault level. This enables cut and paste attacks
     for an adversary to modify existing data or inject new                           within items and across the vault. Such attacks can often
     data, undetectably delete or modify any data, or change                          be chained to compromise the confidentiality of the vault as
     the semantics of any data in a vault, e.g., by altering                          well. These attacks work even when proper authenticated
     metadata. In particular, the integrity of any user-specific                      encryption is used. They are possible because of insufficient
     settings should be maintained.                                                   key separation in vaults with complex structures and/or a lack
                                                                                      of cryptographic binding between data and metadata.
   1 The apparent inconsistency between number of users and market share

arises due to different sources: vendors’ self-reported claims vs market study.       Target Selection. We selected the four providers as tar-
Dashlane disputes the accuracy of this source due to the small sample size.           gets based on their historical and current market share, the


                                                                                  2
         Class             Ref Name                      Cause                    Impact                         Interaction   Mitigations
                         BW01 Malicious Auto-Enrolment   Lack of Key Auth,        Full vault compromise †        1 join        PKA, SC
                                                         Key Substitution
         Escrow          BW02 Malicious Key Rotation     Key Substitution         Full vault compromise †        1 rotation       SC
          Key

                         BW03 Malicious KC Conversion    Lack of Key Auth,        Full vault compromise †        1 dialog       PKA, SC
                                                         Key Substitution
                          LP01 Malicious Password Reset Lack of Key Auth          Full vault compromise †        1 login        PKA, SC
                          1P01 Malicious Recovery Group Lack of Key Auth          Full new vault compromise ‡    1 open         PKA, SC
                         BW04 Unprotected Item Metadata Lack of Auth Enc          Read and modify metadata       -              AE, AD
                         BW05 Item Field Swapping        Lack of Key Sep          Field and item swapping        -                 KS
                         BW06 Icon URL Item Decryption Lack of Key Sep            Loss of confidentiality †      1 open            KS
                         BW07 Remove KDF Iterations      Lack of Auth Enc         No brute-force protection      1 login          KDF
                          LP02 Item Field Swapping       Lack of Auth Enc         Field and item swapping        -               KS, AE
         Integrity




                          LP03 Icon URL Item Decryption Lack of Key Sep           Loss of confidentiality †      1 open          KS, AE
           Vault




                          LP04 Remove KDF Iterations     Lack of Auth Enc         No brute-force protection      1 login          KDF
                          LP05 Malleable Vault           Lack of Auth Enc         Loss of vault integrity        -                 AE
                          LP06 Unprotected Item Metadata Lack of Auth Enc         Read and modify metadata       -              AD, AE
                         DL01 Transaction Replay         Lack of Vault Tag        Loss of vault integrity        -              KS, AD
                          1P02 Item Dropping/Duplication Lack of Vault Tag        Loss of vault integrity        -                AD
                          1P03 Vault Injection           Lack of Ctxt Auth        Loss of vault integrity        -                 SC
                          1P04 Remove KDF Iterations     Lack of Auth Enc         Less brute-force protection    1 login          KDF
                         BW08 Organisation Injection     Lack of Ctxt Auth        Add users to arbitrary orgs    1 sync            SC
                         BW09 Organisation Overwrite     Lack of Ctxt Auth        Organisation compromise †      1 join            SC
            Sharing




                          LP07 Sharing Key Overwrite     Lack of Key Auth         Shared vault compromise †      1 join           PKA
                         DL02 Sharing Key Overwrite      Lack of Key Auth         Shared vault compromise †      1 join           PKA
                          1P05 Sharing Key Overwrite     Lack of Key Auth         Shared vault compromise †      1 join           PKA
                          1P06 Vault Substitution Attack Lack Ctxt Auth           Vault compromise ‡             1 open            SC
                         BW10 Disable Per-Item Keys      Lack of Auth Enc         Downgrade key hierarchy        -              KS, AD
                         BW11 User Key Overwriting       CBC Support              Loss of confidentiality †      2 logins          AE
         Compatibility
          Backwards




                         BW12 Downgrade to Legacy        CBC Support              Full vault compromise †        2 logins          AE
                         DL03 Item Injection             CBC Support              Loss of vault integrity        104 syncs         AE
                         DL04 Remove KDF Iterations      CBC Support              No brute-force protection      104 syncs         AE
                         DL05 CBC-Only Downgrade         CBC Support              Loss of confidentiality ‡      105 syncs         AE
                         DL06 Lucky 64                   CBC Support              No brute-force protection      104 syncs         AE

Table 1: Summary of attacks. The attacks are grouped in four categories, depending on the password manager feature they exploit.
The attack ref(erence) also indicates the product: BW for Bitwarden, LP for LastPass, DL for Dashlane and 1P for 1Password. We
highlight the main causes for the attack, its high-level impact († denotes recovery of encrypted items in user vaults, ‡ recovery of
encrypted items created after the attack took place) and the client interaction required: periodic or user-triggered synchronisation
(sync); the user logging in (login), opening the vault (open), joining an organisation (join), sharing a vault (share) or clicking on
a misleading dialog (dialog). Finally, we report the mitigations from Section 5.


availability of unobfuscated client source code (available for                   have shared these mitigations as part of a detailed, vendor-
Bitwarden and, partially, for Dashlane and LastPass), the rich-                  specific disclosure document with Bitwarden, LastPass, Dash-
ness of the offered feature set, and the diversity of approaches.                lane and 1Password. In each case we have followed an
Our analysis of 1Password is not as thorough as for the other                    industry-standard coordinated vulnerability disclosure ap-
three, due to the lack of source code. As noted above, Ap-                       proach, giving vendors at least 90 days to deploy countermea-
ple and Google now dominate the password manager market.                         sures. For more details, see our ethics analysis in Section A.
However, the unavailability of source code precludes easy
analysis of these systems. Additionally, E2EE is an opt-in                       Broader Impact and Contributions. The immediate im-
feature for Google’s password manager, so users do not enjoy                     pact of our work is to help the affected vendors patch their
security against malicious servers by default. Finally, while                    vulnerabilities, thereby providing stronger security for very
numerous other cloud-based password managers could also                          sensitive data of millions of users. But the impact of our
have been studied, our deep examination of the four selected                     findings also goes beyond the specific products they affect
products – representing over 60 million users and 28% of the                     to illustrate some of the frontiers in the space of end-to-end
market – was already sufficient to surface severe design flaws                   encrypted applications. The importance of the integrity of
and common misunderstandings.                                                    vaults is a new finding, but parallels can be drawn with similar,
                                                                                 recent notions of integrity for cloud storage [15]. Building
Mitigations and Disclosure. We describe potential mitiga-                        systems that support key escrow without opening up attack
tions for each attack in Section 5. We also discuss general                      avenues for malicious actors is considered a hard problem,
strategies to avoid the common pitfalls we discovered. We                        one that has arisen repeatedly in the arena of lawful access


                                                                             3
and the Crypto Wars [5]. The problem of reliably authenticat-          and secrecy in their attack model, indicating developers’ lack
ing public keys that (as we show) plagues password managers            of understanding of the need to provide appropriate cryp-
also comes up in the messaging space, where it is being tack-          tographic protection. In contrast to our work, [47] did not
led by the introduction of Auditable Key Directories, cf. [61].        explore the practical consequences of their findings. Passive
Section 6 considers these and other issues at greater length.          (rather than active) attacks on password manager applications
   Beyond categorizing the common pitfalls of E2EE cloud-              running on iOS and Blackberry were presented by Belenko
based password managers and drawing parallels to where                 and Sklyarov in [17]; this work highlighted the use of weak
these arise in other E2EE systems, a main contribution of              PIN protections or lack of suitably strong password-based
our work is to firmly establish the need for formal study of           key derivation functions. LastPass was one of the targeted
these products and their security. The number of severe vul-           products; in 2012 when [17] was published, it used only one
nerabilities we uncover among a diverse set of vendors shows           iteration of SHA-256 to derive the vault master key from the
that getting end-to-end encryption right in this setting is not        user password. This has improved since. Zhao et al. [81] also
easy. Building on initial notions for password manager secu-           considered the security of LastPass, but focussed mostly on
rity in [47], we propose as future work to formally define the         the complexity of brute-force attacks on its password hashing
goals of E2EE against a malicious server, akin to what was             mechanism; this paper also observed that a passive server ad-
recently done for cloud storage [15]. Analysing cloud-based            versary could observe sensitive data in the RoboForm product
password managers in this threat model is a novel aspect               because of lack of client-side encryption, a valid attack in their
of our work, and we have seen from our interactions with               insider attack model which allowed for server-side monitoring
vendors that our attacks provide a strong motivation to work           and data theft (but not an actively malicious server).
towards achieving theoretically well-founded guarantees in                In 2020, Oesch and Ruoti [66] revisited some of this early
this setting, promoting the benefits of formal analysis and            work to consider the full password manager lifecycle for seven
provable security in practice.                                         different standalone managers (including the four that we
                                                                       study) and five browser-provided managers. Their consid-
Related Work. There was substantial prior analysis of pass-            eration of password storage documented vault encryption
word managers shortly after they first appeared on the mar-            mechanisms and briefly studied metadata privacy. Their main
ket [17,45,47,62,76,77,81]. However, none of this work con-            takeaway is that password managers have improved their se-
sidered the malicious server threat model as we do. In 2020,           curity compared to how they performed in earlier studies,
Carr and Shahandashti [26] and Oesch and Ruoti [66] revis-             though still with significant weaknesses in the areas of un-
ited this early work concluding that password managers have            encrypted metadata, insecure defaults, and vulnerability to
improved their security. More recently, Fábrega et al. [43]            clickjacking attacks. A similar study was carried out by Carr
developed injection attacks, their threat model assuming a             and Shahandashti in [26], focussed on phishing, clipboard
malicious client in combination with a passive server (or a            and PIN brute-forcing vulnerabilities. A further five years
network adversary); Duan et al. [40] studied 43 password               later, our work challenges the findings of [26, 66] in the mali-
managers and their vulnerability to offline guessing attacks.          cious server threat model that we have justified to be appro-
   Expanding on the above, early analysis started more than a          priate for cloud-based password managers. Fábrega et al. [43]
decade ago. Li et al. [62] examined five browser-based pass-           considered injection attacks against ten different password
word managers (LastPass and four others that are no longer             managers, wherein an adversary (only) controls their own
extant), uncovering vulnerabilities in four categories: book-          application client, which they use to “inject” chosen payloads
marklet issues, classic web issues, authorization issues, and          to a victim’s client via, for example, sharing credentials with
UI issues. The threat model used in [62] is that of a “web             them. The adversary is also able to observe the protected
attacker”. In the same timeframe, Stock and Johns [77] stud-           vaults in some form. The threat model in [43] is different
ied the impact of XSS-based attacks on password managers.              to ours – roughly speaking it considers a malicious client in
In contrast to [62, 77], our vulnerabilities are of markedly           combination with a passive server (or a network adversary)
different type, stemming more from cryptographic issues, and           whereas we consider a malicious server. Finally, Duan et
in some cases are more devastating. Meanwhile, Silver et               al. [40] provided a categorisation and formal models in the
al. [76] examined the dangers of autofill while Fahl et al. [45]       UC framework, and studied offline guessing attacks against
studied the impact of malicious Android apps on password               43 password managers.
managers. Gasti and Rasmussen [47] provided a theoretical                 Parallel to our work, Avoine et al. [13] study password
treatment of a range of password manager database formats,             managers in a threat model where the server remains “covert”
focussed on a local storage model and assuming the adversary           in any attack it mounts. This preprint classifies cloud-based
has either read-only or read-write access to the encrypted             password managers into three types and sketches attacks by
database. Such capabilities are available to our malicious             type. The attacks violate vault integrity, as well as several
server adversary for the user vaults that it stores. Gasti and         weaker properties not currently targeted by vendors. The
Rasmussen [47] found only one format offering both integrity           attacks’ impacts are not fully explored, and there are no PoCs.


                                                                   4
Some of them rely on weak passwords and/or low PBKDF                       the security guarantees provided by end-to-end encryption in
iteration counts.                                                          these settings. (We note that some vendors of E2EE cloud
   A raft of work has studied password managers from human                 storage also use “Zero Knowledge Encryption” to refer to
and usability perspectives [27, 29, 44, 51, 55, 63, 64, 67, 68, 70].       E2EE. Thus, also in this setting, this term is taken to mean
In addition, studies on general password usability, password               data confidentiality and integrity in the face of a malicious or
policies, technical measures for improving password security,              compromised server.) For example, recent analyses of cloud
and password breaches abound.                                              storage systems [7, 8, 16, 49, 50] have forced vendors in this
   Close in spirit to our work is a recent line of work analysing          space to upgrade their approach to provide security against
the security of E2EE cloud storage providers in the malicious              a malicious server, while major messaging systems like Sig-
server setting [7,8,16,49,50]. Many vendors in this space also             nal, WhatsApp and iMessage have long featured E2EE in the
use the term Zero Knowledge Encryption in a similar way                    standard sense (Telegram remains a notable and regrettable
to vendors of password managers. Our findings are broadly                  exception in this area, with E2EE only being optionally avail-
analogous to the ones of these papers, though significantly                able on a per conversation basis rather than as a default, and
different in the technical details of attacks. We compare our              not available at all for groups). We think it is reasonable to
work with this line of work in more detail in Section 6.                   expect these terms (zero knowledge and E2E encryption) to
                                                                           have the same meaning in the context of password managers.

2    Threat Model                                                          Passwords have High Value. Passwords are among the
                                                                           most sensitive kind of user data, as they often grant access to
As we laid out in our discussion of related work, there has                accounts and services which may in turn reveal more data, or
been a significant amount of security analysis of password                 allow an attacker to impersonate the victim. Since password
managers over the last decade (and more). At the same time,                manager servers host high concentrations of passwords from
the landscape of password managers has changed, with cloud-                thousands of users, they thus provide an attractive target for
based solutions becoming significantly more common. This                   hackers. Attacks on the provider server infrastructure can
makes it timely to revisit the question: what is the appropriate           be prevented by carefully designed operational security mea-
threat model in this setting?                                              sures, but it is well within the bounds of reason to assume
   Before going further, we note that there is a trivial attack            that these services are targeted by sophisticated nation-state-
against end-to-end encrypted applications that we wish to take             level adversaries, for example via software supply-chain at-
out of consideration from the outset. Namely, a user can be                tacks [28] or spear-phishing. Moreover, some of the service
supplied with a malicious client which, for example, simply                providers have a history of being breached – for example
returns the user’s master password to the server in the clear.             LastPass suffered breaches in 2015 and 2022, and another
Such an attack would be detectable through code audits and –               serious security incident in 2021. In the 2022 breach, the at-
though possible via an obfuscated functionality – would be                 tacker gained access to the development environment, source
very risky for a vendor to conduct. This is especially true                code, and technical information, used that information to
for signed software releases (e.g., desktop and mobile clients,            compromise the computer of a senior DevOps engineer, then
browser extensions), as the existence of a signed malicious                gained access to an encrypted corporate vault, and finally
client would constitute proof of vendor misconduct.                        to the keys of the Amazon S3 “buckets” of the backups to
   Setting this trivial attack aside, we argue here that it is             customer files [48, 78]. In a self-hosted deployment involving
appropriate to consider a threat model in which the server                 a less technically advanced customer, it seems highly likely
is considered fully malicious, meaning that it can deviate                 that the server hosting user vaults could not resist such a de-
arbitrarily from its expected behaviour. Such deviations are               termined attack. While none of the breaches we are aware
hard to detect, especially when targeted at selected users. We             of involved reprogramming the server to make it undertake
argue that this threat model is motivated by the advertised                malicious actions, this goes just one step beyond attacks on
security guarantees by the vendors, the sensitivity of vault               password manager service providers that have been docu-
data, and the fact that malicious-server security is by now                mented. Active attacks more broadly have been documented
the norm for outsourced data in other, related settings. We                in the wild [53, 73].
expand on each of these below, and end by briefly discussing
                                                                           Vendors’ Statements. Additionally, we provide example
the role of client interaction in this threat model.
                                                                           statements made by the providers which we believe justify
Other E2EE Domains. Security in the face of a malicious                    this threat model here (taken from their web sites and white
server is by now the de facto standard in related settings                 papers where they explain their “Zero Knowledge Encryption”
such as messaging systems and cloud storage, where sensitive               claims).
user data (in the form of private messages or files) is also                   “Zero knowledge encryption: Bitwarden team members
relayed or stored by service providers. In particular, the ma-                  cannot see your passwords. Your data remains end-to-
licious server threat model is the accepted interpretation of                   end encrypted with your individual email and master


                                                                       5
     password. [...] Since it’s fully encrypted before it ever          3     The Password Managers
     leaves your device, only you have access to your data.
     Not even the team at Bitwarden can read your data (even            3.1     Bitwarden
     if we wanted to).” [24]
                                                                        The key hierarchy of a Bitwarden user, illustrated in Figure 1,
                                                                        is rooted in the user’s master password and email. These are
    “Dashlane Password Manager is designed using zero-                  used respectively as key and salt of a KDF, which can either
     knowledge architecture, with the data encrypted locally            be PBKDF2 or Argon2id, in order to generate a 32-byte-long
     on the user’s device. Only the user can access the data            master key (km ). The master key is used for authentication by
     by using a password or another form of authentication.             sending the result (hm ) of a single iteration of PBKDF2 on
     Since Dashlane doesn’t have access to the user’s vault
                                                                        the master key with the user’s password as salt to the server,
     and doesn’t store the user’s Master Password, malicious
     actors can’t steal the information, even if Dashlane’s
                                                                        which compares it to the value of hm stored at registration.
     servers are compromised.” [35]                                     The master key is additionally used to derive two 32-byte keys
                                                                        via HKDF-Expand with two different input labels: "enc" and
                                                                                                          enc    mac
                                                                        "mac". The resulting keys (kem        , kem  ) are concatenated to
    “With a zero-knowledge approach, you can rest easy know-            form the 64-byte extended master key (kem ).
     ing that no one else but you, not even your password man-             After deriving the extended master key, a 64-byte user key
     ager vendor, has the keys to the kingdom. [...] For exam-          (ku ) is sampled uniformly at random. Similarly to kem , this
     ple, zero-knowledge means that no one has access to your           key can be interpreted as consisting of an encryption (kuenc )
     master password for LastPass or the data stored in your            and a MAC key (kumac ), each 32-bytes. The role of the user
     LastPass vault, except you (not even LastPass).” [37]
                                                                        key is crucial: it protects all the data inside the user’s vault,
                                                                        either by directly encrypting vault items, or indirectly (if so-
    “Zero-knowledge encryption means that no one but you –              called “per-item keys” are enabled, as explained below). Once
     not even the company that’s storing the data – can access          the user key is generated, it is encrypted under kem and stored
     and decrypt your data. This protects your information              on the server to be served at the next login.
     even if the server where it’s held is ever breached.” [4]             Additionally, the client generates an RSA key pair (with a
                                                                        2048-bit modulus) consisting of a public key pk and a private
                                                                        key sk. This key pair is used in the context of Bitwarden’s
   While none of the vendors quoted here explicitly describe            organisation as described below. Finally, the private key is
the threat model under which they expect their product to               also encrypted under the user key and sent to the server.
remain secure in terms of attacker capabilities, we argue that             Bitwarden allows users and businesses to self-host the
– based on statements like the ones above – their customers             server, in order to have complete control of their data. For
could reasonably deduce that their vault data remains pro-              users of self-hosted Bitwarden instances, the adversary in our
tected even against a malicious server. Moreover, none of the           threat model will thus be the self-hosted server.
vendors objected to our adoption of this threat model during            Key and item encryption. Bitwarden uses AES-CBC-
the disclosure process.2                                                HMAC for authenticated encryption of keys and vault items,
                                                                        using the “enc” and “mac” parts of the key for encryption
                                                                        and MACing, respectively. For backwards compatibility, the
Client Interaction. While our threat model concerns a ma-               HMAC is omitted if the “mac” key part is missing. That is,
licious server, some of our attacks rely on interaction with            if the client attempts to encrypt using a key which is only 32
the (honest) client victim. We treat the amount of client inter-        bytes, the client falls back to using AES-CBC.
action needed for an attack to succeed as a resource, and for               In vault items, each item data field is encrypted individu-
each attack, we list the expected client interactions required.         ally. Item fields used to be encrypted directly with the user
   The majority of our attacks require simple interactions              key ku , but from version 2024.2.0 new items are encrypted
which users or their clients perform routinely as part of their         with individually sampled per-item keys, which are in turn en-
usage of the product, such as logging in to their account, open-        crypted by the user key. Old items remain encrypted directly
ing the vault and viewing the items, or performing periodic             under ku .
synchronization of data. We also present attacks that require           Organisations. Credential sharing is implemented in Bit-
more complex user actions, such as key rotations, joining an            warden through organisations. When a user creates an or-
organisation, sharing credentials, or even clicking on a mis-
                                                                           2 LastPass have communicated that they don’t adopt a generic malicious
leading dialog. Although assessing the probability of these
                                                                        server threat model, but apply compensating controls to mitigate server risks.
actions is challenging, we believe that, within a vast user base,       1Password explicitly notes that they don’t verify public keys, and confirmed
many users will likely perform them. Table 1 summarises the             that they view the server as trusted when it comes to providing authentic
interaction requirements for each attack.                               public keys or authentic public encryption ciphertexts.


                                                                    6
       RSA-OAEP
       AES-CBC-HMAC
                                           (pw, email)                                 (pw, email)                              pw
       AES-CBC
       KDF                                      km         hm                               ku              hu                 kcbc
                                                                                                                                      SHA-512
                                     enc    mac
                             kem := kem  ∥ kem                                                                               kcbc-hmac
                                                                                                 csk := sk , pk
                        cu := ku := kuenc ∥ kumac                           Items
                                                                                                                            Transaction
                                                                                             cshr := kshr
                                                                                    Team
                     kui       csk := sk , pk                                                                                 or         sk     , pk
                                                                                  shared         Shared
          Item or item key                                                         folder         items
                                                                                                                  Group /
                                              enc
                             corg := korg := korg    mac
                                                  ∥ korg                                                           shared   cshr := kshr
         Organisation                                                                                               items
                           cskOrg := skorg , pkorg


                               Bitwarden                                                LastPass                            Dashlane

                         Figure 1: Key hierarchies for Bitwarden (left), LastPass (centre) and Dashlane (right).


ganisation, their client samples a new 64-byte organisation                 no integrity protection). Each user also has an RSA key pair
symmetric key korg , and encrypts this key under the user’s                 (sk, pk); the secret key is encrypted under ku using AES-
                         user
public key, yielding corg     . Additionally, the client also gen-          CBC and stored at the server.
erates an organisation RSA key pair (pk org , sk org ) (used for
account recovery purposes), and encrypts the private key us-                Sharing. Sharing among LastPass users is implemented
ing korg to create cskOrg (see Figure 1). It then sends corg  user
                                                                    ,       through shared folders. When a user first shares an item,
pk org , and the encrypted cskOrg to the server. Items in an                their client samples a 32-byte shared folder key kshr . This is
organisation are individually encrypted using the organisation              subsequently used to encrypt the items in the shared folder
symmetric key.                                                              using AES-CBC. The folder key is itself encrypted using
   The creator of an organisation can add new members by                    RSA-OAEP under the public key of every user with whom
encrypting the organisation symmetric key for the public key                the folder is shared.
of the invitee. For each user user ′ , the resulting ciphertext
 user ′
corg    is sent to the server for storage, and served to user ′             3.3     Dashlane
                                                              user ′
when syncing. The client of user ′ can then decrypt corg
using their private key to obtain korg . A client determines that           Dashlane’s vault is maintained in the form of a transactional
the user is a member of an organisation if it can obtain korg .             database. Each transaction can create, modify, or delete an
   Further organisation data, such as the organisation name                 item in the database: the transaction type and timestamp are
and policies regarding account recovery, for example, are                   unencrypted metadata fields, while the transaction content,
stored unencrypted on the server and sent to the client when-               consisting of compressed XML data with information about
ever a sync operation is performed.                                         items or user settings, is encrypted.

                                                                            Key and item encryption. Content is encrypted using a
3.2    LastPass                                                             key derived from the user’s master password. The exact de-
As in Bitwarden, the key hierarchy in LastPass (illustrated in              tails for these operations are specified in the first bytes of
Figure 1) begins with the user’s password, which is used to                 the content by a payload string: this defines the password-
derive a 32-byte user key ku using PBKDF2 with the user’s                   based key derivation function (either PBKDF2, Argon2d, or
email address as salt. The default KDF iteration count is                   noderivation), its parameters (e.g., salt length, hash method,
600,000. To authenticate, the client sends hu , the result of one           and iterations for PBKDF2), the cipher (by default AES-256),
more iteration of PBKDF2 over ku with the password as salt,                 and the cipher mode (by default CBC with HMAC). First, an
to the server; the server checks if the received hu matches the             intermediate 32-byte key kcbc is derived from the password.
value received at registration.                                             If the cipher mode is CBC with HMAC, then an additional
                                                                            SHA-512 is used to derive the 64-byte kcbc -hmac . When the
Key and item encryption. The user key is used to directly                   user modifies their vault (e.g., by adding an item), a new trans-
encrypt the items in the user’s vault using AES-CBC (with                   action is created and sent to the server. See the illustration in


                                                                        7
                                 (pw, email,                                        QR code.3
                                 account id)            secret key
                                                                                       1Password therefore starts with a security advantage com-
                        salt ′                   salt
                                                                                    pared to its competitors (at the cost of some loss of usability)4 :
                      ′
                     kAUK                      kAUK
                                                                                    thanks to the involvement of the secret key, brute-force attacks
                     (SRP)
                                                                     Recovery       should be out of reach.
                                                                      group
                                                                                    Key and item encryption. The key derivation process is
                                 Key Set       skn , pkn               pkR
      RSA-OAEP                                                                      documented in the 1Password whitepaper [2]: at a high level,
      AES-GCM
                                                                                    PBKDF2 (a default of 650,000 iterations in the version we
      KDF
                                                                                    analysed) derives a key from the master password, which is
                                                        kv
                                                                                    then combined by XOR with a pseudorandom stream derived
                        Private /                                                   from the secret key via HKDF-SHA-256. The resulting key is
                         Shared
                           Vault                                                    the AUK (Account Unlock Key), denoted kAUK . The kAUK
                                         Item         Item      Item                encrypts (AES-GCM) the symmetric key of the user’s keyset
                                                                                    – a bundle containing that symmetric key together with an
                                                                                    RSA encryption key pair (and a signing key pair) – and that
                                                 1Password                          symmetric key in turn protects the keyset’s RSA private key.
Figure 2: Key hierarchy for 1Password. Some levels of key                           The keyset’s public key is used to encrypt each vault key kv
wrapping have been omitted for simplicity. For instance,                            (RSA-OAEP); the vault key encrypts individual items (AES-
kAUK encrypts the symmetric key in the key set, which in                            GCM). Figure 2 depicts this hierarchy.
turn encrypts the secret key—here we show the kAUK as                               Sharing and Recovery. 1Password users can share vaults:
directly encrypting sk n .                                                          the client fetches the public part of the recipient’s keyset
                                                                                    and encrypts the vault key under it. 1Password additionally
                                                                                    supports recovery via a recovery group – a special keyset
Figure 1.                                                                           created at account initialization.5 Clients encrypt vault keys
                                                                                    (and the user’s own keyset) under the recovery group’s public
Sharing. Each user also has a 2048-bit modulus RSA key                              key.
pair (sk, pk); the secret key is stored encrypted (as a trans-
action) on the server, together with the public key. The RSA                        Client-to-Server Protocol. Like the other password man-
keys are used for sharing: when a user shares an item with                          agers we study, 1Password protects all client-to-server com-
another user (either directly or in a group), a symmetric en-                       munication with TLS. As an additional security layer, 1Pass-
cryption key kshr is sampled and encrypted for the recipient(s)                     word uses a custom secure channel protocol based on the
public keys (which the sharer retrieves from the server).                           SRP-6a PAKE [52] as a key exchange, and JWT messages
N OTE. The only fully-available open-source Dashlane client                         with AES-GCM encryption as a record protocol. The client’s
                                                                                    SRP secret kAUK′    is derived from the master password and
is the CLI client, which does not support encryption nor the
credential sharing feature, so the description we provide here                      secret key via the same two-secret KDF as the AUK, but with
is based in part on reverse engineering and may be incomplete.                      a different (server-supplied) salt. This means that the proto-
We focus on the parts of the system relevant to our attacks,                        col can only be terminated at the 1Password server, which
                                                                                             ′
for which the functionality we describe here is verified by the                     stores gkAUK , the secret verifier, rather than at any earlier TLS
PoCs.                                                                               termination point, such as load balancers.
                                                                                       3 1Password actually implements a variety of ways of transferring the

                                                                                    secret key. The enrolled device can show a “setup” QR code, which contains
3.4    1Password                                                                    the secret key and other account information, for the new device to scan.
                                                                                    Alternatively, the new device can show a QR code, that the enrolled device
                                                                                    scans; the QR contains a cryptographic key, used to instantiate a secure chan-
Similar to the other password managers we study, one root                           nel between the two devices (“Mycelium”); the secret key is then transferred
of security in 1Password is the user’s master password—but                          using this channel. Another flow, available for SSO users, consists of the
unlike the other three products, 1Password also includes a                          enrolled device showing a short enrollment code, which can be typed on the
                                                                                    other device; this code is used for a password-authenticated key exchange
high-entropy cryptographic key in the key derivation, the                           (CPace), once again instantiating a device-to-device secure channel, used to
so-called secret key. This means that users cannot access                           transfer key material [3].
their vaults using just their master password: they also need                          4 We found that actually, from our empirical experience, this system was

access to the secret key. To enable multi-device support, this                      quite easy to use: properly engineered clients remove much of the friction of
                                                                                    having to manage cryptographic key material.
key needs to be transferred between devices prior to user                              5 For Individual accounts, the group is generated client-side at account
authorization: this can be done manually by the user, or                            setup; for Family/Team it’s an account-level group whose private key is
automatically, using a previously enrolled device to scan a                         delegated to admins/owners.


                                                                                8
4     Attacks                                                            otherwise specified, all of the attacks affect all the clients
                                                                         mentioned in the table.6
We now present our attacks on Bitwarden, LastPass, Dashlane
and 1Password, grouped into four categories based on cause,                                          Source           Version           Features
as follows:                                                               Bitwarden
                                                                             Web Client                  [23]      v2024.10.2
    1. In E2EE password managers, forgetting the master pass-                CLI Client                  [23]      v2024.10.0
       word means that a user irrecoverably loses access to their            Server                      [23]      v2024.10.2                -
       vault. Thus, many password managers implement some                 LastPass
       form of account recovery mechanism through key es-                    Web Client                              Unknown
       crow, such that an administrator can help users recover               Browser Ext.                            4.140.0
       their vault contents. In Section 4.1, we show attacks                 CLI Client                 [58]         v.1.6.1
       against vault confidentiality in Bitwarden, LastPass and
                                                                          Dashlane
       1Password resulting from vulnerabilities in their key es-
                                                                             Web Client                             Unknown
       crow designs. We also discuss a weakness in Dashlane’s
                                                                             Browser Ext.                [33]       6.2513.1
       design.
                                                                             CLI Client                  [34]      v6.2447.2
                                                                             Android Client              [32]     018f827f2a01
    2. None of the password managers we analyse treat the
                                                                          1Password
       password vault as a monolithic object. Rather, all data
                                                                             Web Client                                2285
       items (as well as sensitive user settings) are encrypted as
                                                                             Browser Ext.                            8.11.4.27
       separate objects, and often combined with unencrypted
       or unauthenticated metadata. In Section 4.2, we show              Table 2: Summary of the software distributions of the pass-
       how such an item-level vault encryption design is often           word managers we study, detailing source code availability
       in tension with the vault integrity security goal. We find        ranging from fully open source ( ), open source releases omit-
       attacks against all of Bitwarden, LastPass, Dashlane and          ting fundamental cryptographic libraries ( ), to closed source
       1Password. Notably, many of these integrity violations            ( ); the software version; and whether the client supports the
       also lead to concrete attacks impacting confidentiality.          full core feature set of the password manager ( ) or just a
                                                                         small subset of operations ( ).
    3. Many password managers implement sharing features
       (targeting for example families and businesses) which
       allow multiple people to access common shared creden-
       tials. In Section 4.3, we show attacks against the sharing        Analysis Method. Our approach to analysing password
       features of all four of our targets. These impact both            managers follows the “attack” branch of the “Cryptography
       vault integrity and confidentiality.                              in the Wild” methodology that is described in detail in [9].
                                                                         We explain here how we deployed this methodology in the
    4. All four password managers that we analyse have un-               specific context of password managers.
       dergone cryptographic evolution over time. They all                  Our process began with reviewing white papers and client
       maintain some form of backwards compatibility to                  code (and server code, when available). We initially focused
       support older client versions—for instance, maintaining           on Bitwarden, where the availability of source code eased
       support for older encryption schemes, or for different sets       our analysis and enabled us to more easily build our mental
       of KDF parameters. In Section 4.4, we show that such              model of architecture, protocols, and system features (cf. ob-
       “legacy code” creates cryptographic hazards. Specifi-             ject selection in [9]). From the outset, our goal was to carry
       cally, a malicious server can trigger legacy code paths           out an analysis in the face of a malicious or compromised
       to be executed in clients, resulting in downgrade attacks         server: based on the functionality of the target systems, we
       in Bitwarden and Dashlane. This holds even if a user              refined this to a concrete adversarial model. We developed
       intends to use the latest version of the clients. Through         pseudo-code models for the main cryptographic actions of
       such attacks, an adversary can for example downgrade              each feature of interest (ingestion). We then analysed these
       clients to use unauthenticated encryption, opening up av-         models to find attacks. Here we relied on our own experi-
       enues for further attacks that violate both vault integrity       ence in finding cryptographic vulnerabilities in systems, along
       and confidentiality.                                              with a list of potential attack vectors gained from the by-now-
                                                                         extensive literature on cryptographic attacks. For password
  Table 1 gives a complete summary of our attacks. Through-                 6 Due to the considerable engineering effort required for testing all the
out this section, we refer to “the adversary” as an entity that          clients, we limit our PoC testing to Bitwarden’s web client and the browser
has full control of the server. Table 2 summarises the analysed          extensions for LastPass and Dashlane. For most of the attacks, it is evident
software versions and the availability of source code. Unless            that they are design issues, independent of specific client implementations.


                                                                     9
managers, we drew particular inspiration from recent litera-                          recovery can either be a manual step requiring user interaction
ture on E2EE cloud storage providers in the malicious server                          (so-called self-enrolment), or happen automatically when the
setting [7,8,16,49,50] as well as common attack vectors such                          user joins the organisation (auto-enrolment). When a user en-
as padding oracle attacks [80], key overwriting in various                            rols (by either method) in account recovery, the client fetches
forms, cf. [25], and exploitation of backwards compatibil-                            the organisation public key pk org from the server, encrypts
ity features, cf. [54]. Finally, we built PoC implementations                         the user key ku under pk org , and sends the resulting account
for the attacks, implementing malicious server functionality                          recovery ciphertext crec to the server. To reset the master pass-
where needed, and testing against the relevant client. This                           word of an enrolled user, an admin of the organisation can
step is vital for ensuring that attacks developed “on paper”                          fetch the encrypted ku from the server, decrypt it using the
actually work in practice.                                                            organisation’s private key sk org , choose a new master pass-
   Following our initial study of Bitwarden, we iterated the                          word (and consequently derive a new master key), and finally
same process to determine whether our findings were applica-                          re-encrypt ku under the new master key. We describe two
ble to other products. For Dashlane and LastPass, we carried                          key recovery attacks caused by the account recovery feature,
out some reverse engineering of minified client Javascript                            BW01 and BW02, below.
and of the Android applications. Having already studied Bit-
warden helped us in developing our understanding of how                               BW01: Malicious Auto-Enrolment. Recall that when a
these products operate. After finding more attacks on both of                         Bitwarden user joins an organisation, the client fetches the
them, we extended our scope to 1Password, which required                              organisation’s data, such as name, key material, and organi-
some additional reverse engineering effort. We confirmed                              sational policies, from the server. This data is not integrity
that our attacks were applicable to the newly selected targets.                       protected. As a consequence, an adversary controlling the
Additionally, we manually classified the different attacks and                        server can compromise users as soon as they accept an invita-
grouped them into four categories, providing a starting point                         tion to join any organisation, as follows.
for follow-up work analysing further password manager prod-                              When a user accepts an invitation, the client asks the server
ucts. This extends the methodology from [9].                                          for the account recovery policy and the public-key of the or-
   Note that absent formal analyses, the set of attacks we                            ganisation. The adversary replaces the organisation’s real
found must be considered incomplete. Indeed, in some cases,                           data, setting auto-enrolment to true in the policy, and replac-
we stopped looking for attacks after accumulating sufficiently                        ing the public key pk org with a malicious pk adv org for which
                                                                                                                      adv
many severe enough vulnerabilities to demonstrate that the                            they know the secret key sk org . Since account recovery is
given target was vulnerable in our threat model. Future work                          enabled, the client encrypts the user key ku under the or-
may involve employing formal tools to uncover other vulner-                           ganisation public key pk adv
                                                                                                                org , and sends the resulting account
abilities, or conclusively demonstrate the lack thereof.                              recovery ciphertext crec to the server. The adversary decrypts
                                                                                      crec with sk adv
                                                                                                   org and recovers ku .
4.1     Key Escrow Attacks                                                            I MPACT. With possession of the user key, the adversary is
                                                                                      able to read and modify all vault data of the targeted user.
These attacks all concern various forms of key escrow func-
                                                                                      R EQUIREMENTS. The user joins any organisation. Note that
tionalities provided by the password managers to enable ac-
                                                                                      the adversary does not have to control the organisation; it
count recovery in the case of master password loss. Suc-
                                                                                      can be an honest invitation from a trusted enterprise or family
cessful attacks on these recovery mechanisms have severe
                                                                                      member, for example.
consequences. In most cases, the adversary can recover the
full vault of the user, therefore compromising all of the data                        N OTE. The account recovery feature can also be used by an
that it contains. Some recovery mechanisms are less powerful                          attacker to amplify the reach of a compromise from one user
than others, and rely on storing recovery data on the user’s                          to whole organisations, as follows. An organisation’s private
devices. In these cases, our attacks are also less impactful.                         key sk org is known to all the members of the organisation. It
                                                                                      follows that once the adversary has compromised one user,
                                                                                      they learn the private key sk org of all the organisations that
4.1.1    Bitwarden
                                                                                      user is a member of. If any of these organisations enabled
Bitwarden supports two flavours of key escrow: organisation                           account recovery, the adversary then also compromises the
account recovery and “Key Connector”.                                                 user keys of all members of these organisations through their
                                                                                      account recovery ciphertexts. This process can be repeated,
Organisation Account Recovery. Organisation account re-                               infecting all organisations that have key recovery enabled and
covery allows the admins of organisations to reset the master                         have overlapping members.
password of all members who enrol in recovery.7 Enrolling in
   7 While the recovery feature is restricted to “enterprise” organisations           BW02: Malicious Key Rotation. Bitwarden allows its
(with a paid subscription), all Bitwarden clients include this feature’s code,        users to change their master password, and optionally rotate
and our attacks succeed independently of user subscription status.                    their keys. If a user decides to rotate their keys, the client


                                                                                 10
samples a new user key ku′ and encrypts it under the new                             not sufficient to remove the need for dedicated Bitwarden cre-
extended master key kem  ′ (cf. Figure 1).                                           dentials. Indeed, recall that the master key km , derived from
   If a user is enrolled in account recovery when they rotate                        the master password and email address as shown in Figure 1,
their keys, the client will also have to regenerate their account                    is not just used to authenticate to the server, but also to protect
recovery ciphertext. To do so, it encrypts the new user key ku′                      the user key, which in turn is used for client-side encryption
under the organisation public key pk org , and sends the new                         of vault items. Thus, in order to allow users of Bitwarden
account recovery ciphertext crec ′ to the server.                                    organisations with SSO to entirely remove their Bitwarden
   The key point here is that pk org is not retrieved from the                       password, the user key must also be recoverable without the
user’s vault; rather, the client performs a sync operation with                      password. This is the purpose of the Key Connector (KC)
the server to obtain it. Crucially, the organisation data pro-                       application. KC is a self-hosted application which allows
vided by this sync operation is not authenticated in any way                         Bitwarden organisations using SSO to store users’ user keys
(see Attack BW01). This thus provides the adversary with                             (ku in Figure 1) such that they do not need a Bitwarden master
another opportunity to obtain a victim’s user key, by supply-                        password or master key. When an organisation starts using
ing a new public key pk adv                               adv
                            org for which they know sk org and                       KC, its users are redirected to a “remove master password”
setting the account recovery enrolment to true. The client will                      page. Each user is then prompted to confirm the change; the
then send an account recovery ciphertext crec  ′ containing the                      client subsequently sends the user’s master key km to the KC
new user key, which the adversary can decrypt to obtain ku′ .                        service (henceforth referred to as the “connector”), which
   Note that this attack works whether or not the user is a                          uses km to decrypt ku and stores it. We refer to this procedure
member of an organisation at the time of key rotation: the ad-                       as conversion. In attack BW03, we show that a malicious
versary can either use Attack BW08 or BW09 to, respectively,                         Bitwarden server can trick any client (regardless of whether
add the user to a newly created organisation or overwrite an                         the user is a member of any organisation) into starting a con-
existing organisation’s keys.                                                        version flow which, if completed, reveals the user’s master to
   Concretely, the forged organisation returned to the client                        the adversary.
will look like the following (where k is a symmetric key for
AES-CBC-HMAC):                                                                       BW03: Malicious KC Conversion. The attack works as
                                                                                     follows. The adversary tricks the client into believing that
        org ′= {
          UserId = user.Id, // victim’s user ID                                      the user is part of an organisation which is enabling KC (as
          UseResetPassword = true,                                                   described below), and supplies the client with a (hidden) ma-
          Key = RSA.Enc(pk, k),                                                      licious connector URL. The client will then display the “re-
               ,→ // k under the victim’s public key                                 move master password” page to the user (see Figure 3 for an
          PublicKey = pk adv
                         org ,
                                                                                     example), the content of which is also partially controlled by
          PrivateKey = AES-CBC-HMAC.Enc(k, sk adv                                    the adversary. If the user clicks the “remove master password”
                                               org ),
          [...]                                                                      button, the client sends the master key km to the adversarially
        };                                                                           controlled URL in plaintext.
                                                                                        We now explain how the adversary can force the client into
I MPACT. With possession of the user key, the adversary is                           taking the user to this conversion page. Each time a Bitwarden
able to read and modify all vault data of the target user.                           client performs a sync operation with the server, it checks if
R EQUIREMENTS. The user rotates their encryption keys.                               the user is logged in via SSO and a member of an organisation
Key Connector. The second flavour of key escrow in Bit-                              which has enabled KC. If so, the client determines that the
warden is the so-called “Key Connector” feature, offered to                          user needs to perform a conversion. The attack leverages that
enterprise organisations that run self-hosted Bitwarden servers                      all of these attributes can be forged by the adversary.
as part of the support for single sign-on (SSO).8 When an or-                           As we saw in Attack BW02, the organisation data retrieved
ganisation starts using SSO, it delegates the authentication                         in sync operations is not integrity protected. This includes the
of users to an external identity provider (e.g., Google or Mi-                       organisation symmetric key, flags determining whether KC is
crosoft). The purpose of using SSO is to allow users to access                       enabled, and the connector URL. This lack of integrity allows
multiple different applications with a single set of creden-                         the adversary to make the user a member of a newly created
                                                                                     fictive organisation by sampling a symmetric key korg    ′   and
tials. That is, it removes the need for a dedicated account
                                                                                     other organisation data and supplying the client with korg ′  en-
(username and password) for every service. However, in the
case of end-to-end encrypted applications like Bitwarden, out-                       crypted under the user’s public RSA key (as in Attack BW08).
sourcing the authentication to an external identity provider is                      The adversary can also set the connector URL (to which the
                                                                                     master key will be sent upon conversion) to an arbitrary URL
    8 Just like for the account recovery feature, Key Connector is restricted
                                                                                     of its choice.
to “enterprise” organisations (with a paid Bitwarden subscription), but since
all Bitwarden clients contain the code implementing this feature, our attacks           Furthermore, clients infer whether SSO is enabled by look-
affect all users, regardless of subscription status.                                 ing at some attributes set by the server at login time. Specif-


                                                                                11
                                                                                    enterprise products “business” and “teams”.10 Within a team,
                                                                                    privileged user accounts called super admins have the ability
                                                                                    to reset the master password of users in the team. To this
                                                                                    end, each admin account is associated with an RSA key pair
                                                                                    (sk adm , pk adm ). After a super admin chooses to reset a user’s
                                                                                    password, the client of the selected user will – upon the next
                                                                                    login in the LastPass browser extension – retrieve the list of
                                                                                    admins and their public keys from the server, encrypt its user
                                                                                    key ku under each admin’s public key pk iadm , and send the
                                                                                    resulting ciphertexts back to the server.11
                                                                                    LP01: Malicious Password Reset. Master password reset
                                                                                    relies on admin public keys pk iadm being retrieved from the
                                                                                    server. The LastPass client does not authenticate these keys
                                                                                    in any way. It follows that an adversary can trivially inject
                                                                                    their own pk adv                          adv
                                                                                                 adm , for which they know sk adm . They can then
                                                                                    recover ku from the ciphertext sent by the client.
Figure 3: Key Connector conversion page with malicious                                 Concretely, the adversary extends the login response with
message injected by the adversary.                                                  an additional super admin, so that it looks as follows:
                                                                                      <?xml version="1.0" encoding="UTF-8"?><response>
                                                                                          ...
ically, the client believes itself to be logged in using SSO
                                                                                          sauidN="id adv " // injected super admin
if it can find an authentication methods reference with the
                                                                                          sakeyN="hex(pk adv
                                                                                                           adm )"
value “external” inside the JSON WEB Token (JWT) access
                                                                                          ...
token which it receives from the server when logging in. It                           </response>
is trivial for the adversary to forge this JWT, thus making all
Bitwarden users vulnerable to this attack.9                                         where N is an arbitrary integer, hex(·) converts a public key to
I MPACT. The user’s master key is sent to an adversarially                          its hexadecimal representation, and id adv can be an arbitrary
controlled connector URL. With possession of the user’s                             integer value, as the client does not validate the “super-admin
master key, the adversary is able to read and modify all vault                      ID”.
data of the target user.                                                               In theory, only users in teams where password reset is
                                                                                    enabled and who are selected for reset should be affected by
R EQUIREMENTS. This attack requires an element of social
                                                                                    this vulnerability. In practice, however, LastPass clients query
engineering, since the user always needs to confirm the con-
                                                                                    the server at each login and fetch a list of admin keys. They
version. This can be achieved in several ways. First of all, the
                                                                                    then send the account recovery ciphertexts independently of
conversion page does not contain any warning about what the
                                                                                    enrolment status.
process entails, and does not show the URL of the Key Con-
                                                                                    I MPACT. With possession of the user key, the adversary is
nector being used. Furthermore, the adversary can control the
                                                                                    able to read and modify all vault data of the target user.
text shown in the conversion page by injecting arbitrary data
in the “organisation name” field: Figure 3 shows an example                         R EQUIREMENTS. The user logs in to LastPass in the browser
of how the conversion page could look during an attack.                             extension client.12
Additionally, the adversary can disable the “Leave organi-
sation” button in Figure 3, leaving the user no choice but                          4.1.3    Dashlane
to click on “Remove master password" in order to access                             Dashlane offers a limited form of key escrow for users who
their vault, as the client will persist the prompt until the user                   are part of an organisation with admin-assisted key recovery.
accepts the conversion.                                                             Namely, Dashlane clients encrypt some key material, includ-
                                                                                    ing the vault key ku , using a recovery key kr . The resulting
4.1.2    LastPass                                                                   ciphertext is never uploaded to the server: it is stored locally
                                                                                    on the device, e.g. in the browser.
LastPass also provides two forms of key escrow: account                               10 This feature is only available in the paid versions of LastPass [57], but,
recovery and admin password reset. We focus here on the                             as with Bitwarden, the code implementing this feature is present in the client
second. The master password reset is a feature for LastPass’                        independent of their subscription status.
                                                                                      11 This process is described as a “Key Exchange” by LastPass [59]. This
   9 With the exception of users who are members of self-hosted Bitwarden           does not correspond to the conventional meaning of the term.
organisations and have already performed KC conversion in the past; these             12 Only the browser extension client supports the “key exchange” proce-

users no longer have master keys, and are thus not vulnerable to the attack.        dure used for password reset, thus the attack works only against this client.


                                                                               12
       Client (device)                                     Dashlane server                           Org. admin
       Escrow setup
                                                                                                                                   4.1.4    1Password
         kr ←$ {0, 1}n                                                                                                             Recall that, in 1Password, clients encrypt vault keys under
          local data:
    cℓ ← Enc(kr , ku , . . . )
                                                                                                                                   the recovery group’s public key. This is done by default and
                                                                                                                                   unconditionally—independently of whether account recovery
  c ← Enc(pk a , Enc(ks , kr ))
                                                                                                                                   is actually enabled, and without authenticating that public
                                      store escrow c
           0
                                                                                                                                   key.
Recovery (password forgotten)
                                     recovery request                                                                                 When a fresh user account is created, the client creates a
           1
                                                                         notify admin, forward c                                   fresh user vault, and samples a fresh key pair for the recovery
                                                              2

                                                                                                   upon approval:                  group. The vault key is then immediately encrypted for this
                                                                                             c′ ← Enc(pk u , Dec(sk a , c))
                                                                                                                                   recovery group. This means that even a malicious server
                                                                              approval, c′
                                                                                                                3                  cannot tamper with the public key of the recovery group used
                                        deliver c′
                                                                     4                                                             to encrypt this default vault.
                                   request server key ks
           5
                                            ks
                                                                     6
                                                                                                                                   1P01: Malicious Recovery Group. At any later point in
 kr ← Dec(ks , Dec(sk u , c′ ))
                                                                                                                                   time, users can create additional vaults. The vault keys corre-
   (ku , . . . ) ← Dec(kr , cℓ )                                                                                                   sponding to these vaults are also encrypted under the recovery
                                                                                                                                   group’s public key—but this time, the recovery group public
Figure 4: Dashlane’s admin-assisted key escrow and recovery                                                                        key pk R is fetched from the server. This public key is not
flow. During setup, the client stores the local data encrypted                                                                     authenticated. It follows that it is trivial for a malicious server
under the recovery key kr (which never leaves the device), and                                                                     to substitute pk R with a key pk ′R for which they know sk ′R ,
uploads the escrowed recovery key c (step 0), wrapped first                                                                        and thus recover the encrypted vault key for the new vault.
under a server-provided symmetric key ks and then under the                                                                           The possibility of an attack like the one we describe is
admin public key pk a . To recover (1), the server forwards c to                                                                   acknowledged in the 1Password white paper, even though an
                                                                                                                                   attack is not described in full:
the admin (2); the admin peels off the RSA-OAEP layer and
re-encrypts to the user (3, 4), after which the client retrieves                                                                         . . . the potential [MitM] attack applies to any situation
ks from the server (5, 6) and unwraps kr .                                                                                               in which secrets are encrypted to another’s public key.
                                                                                                                                         Thus, this applies during the final stages of recovery or
                                                                                                                                         when a vault is added to any group as well as when a
                                                                                                                                         vault is shared with an individual. This threat is probably
   Dashlane’s key escrow only concerns this recovery key: the                                                                            most significant with respect to the automatic addition of
                                                                                                                                         vaults to the Recovery Group as described in “Restoring
client encrypts kr with a server-provided symmetric key, and
                                                                                                                                         a user’s access to a vault.” [2, Appx. C]
then encrypts the resulting ciphertext under the public keys of
the admins in the organisation. If a user forgets their password,                                                                  I MPACT. The adversary can read and modify all contents of
but they still have a device with the encrypted local data, they                                                                   new vaults.
can initiate a recovery request. The admin will be notified of                                                                     R EQUIREMENTS. The user creates a new vault.
the request, and if they approve it, they will decrypt their layer
of encryption on kr , and send the intermediate ciphertext back
to the user encrypted under the user’s public key. The client
                                                                                                                                   4.2     Vault Integrity
can then decrypt this message, request the symmetric key                                                                           As we have mentioned, even though the user interacts with the
from the server again, and decrypt the intermediate ciphertext                                                                     abstraction of a “secure vault”, the individual items and the
to obtain the recovery key kr . Finally, kr can be used to                                                                         user settings that comprise a vault are managed and (typically)
decrypt the local data. This process is illustrated in Figure 4.                                                                   encrypted independently. Hence, vaults are not monolithic
                                                                                                                                   cryptographic objects.
                                                                                                                                      If the vault were monolithic, vault integrity would be easy
Note: Recovery Key Compromise. Dashlane’s admin-                                                                                   to achieve by using authenticated encryption (AE). However,
assisted recovery flow suffers from a similar problem to the                                                                       every minor change would necessitate re-encrypting the en-
escrow protocols of Bitwarden and LastPass– namely, an ad-                                                                         tire vault, making its maintenance and synchronisation with
versary can hijack the admin public keys, since they are not                                                                       the server costly. Thus, a common solution is instead to en-
authenticated in any way. Consequently, the adversary re-                                                                          crypt each item separately with AE under a single key. But
covers kr . However, in Dashlane’s design, recovery requires                                                                       this does not necessarily result in integrity guarantees for the
access to the local data in the client. This data is never up-                                                                     whole vault. For example, items could be swapped around or
loaded to the server, or transferred to an admin: an adversary                                                                     removed entirely without the client being able to detect it.
cannot use kr to further compromise users, making this attack                                                                         The attacks that follow all exploit the lack of vault integrity
vector ineffective.                                                                                                                for the vendors we study. Not only can the adversary swap


                                                                                                                              13
and delete items, they can also change metadata, settings, or                           fetching the item, the client will then decrypt the ciphertext,
the organisations to which a user belongs.                                              confusing it for a URL. If the plaintext satisfies some condi-
                                                                                        tions (i.e. containing a ‘.’ and no ‘!’), it will be leaked to the
4.2.1    Bitwarden                                                                      adversary.
                                                                                           A URL checksum feature was deployed in July 2024, mak-
In Bitwarden, items and user settings are not uniformly pro-                            ing the clients store a hash of the URL in another encrypted
tected. Rather, vault items are encrypted individually, and                             item field, therefore providing a rudimentary integrity check
many settings are not encrypted at all. This also holds true                            and preventing this attack. Note that old items are never up-
for items in organisations and organisation-wide settings.                              dated to add such a checksum: this feature only protects items
   Each item is an object with various fields, such as item                             created after its introduction. Furthermore, URL checksums
name, password, username, and URLs. All of these fields                                 are only checked if a per-item key is present for the item.
are individually encrypted using AES-CBC-HMAC. Up until                                 As we will see, an adversary can prevent per-item keys from
version 2024.2.0 of Bitwarden, the fields of all items were                             being enabled with Attack BW10.
encrypted directly with the user key ku . As of v.2024.2.0,                             I MPACT. The adversary can recover selected target ciphertexts
“per-item keys” are used instead: a fresh key kui is sampled and                        in the item, such as the username or the password.
used for each new vault item. The item key is itself encrypted                          R EQUIREMENTS. The user opens a vault containing items
with the user key ku , and added as a field to the item. Note                           that do not use per-item keys (i.e., items created before July
that old items were not migrated to this new format.                                    2024, or after Attack BW10 is run). The target plaintext must
   The client retrieves vault items from the server via a sync                          satisfy some additional conditions, as follows:
request; the server will return the item encoded in a JSON
object, with the (unencrypted) field names as keys, and the                               1. (It does not contain the string “://” and contains the
respective ciphertexts as values.                                                            character ‘.’) or (it starts with the string “http” and
                                                                                             it contains the character ‘.’ and it does not start with
BW04: Unprotected Item Metadata. A surprising number                                         either of the following strings “data:”, “about:” and
of item metadata fields are neither encrypted nor integrity                                  “file:”).
protected. These include the type of items (e.g. login, card,
secure note, etc.), their creation date and whether they require                          2. It does not contain the character ‘!’.
a password reprompt.
   An adversary can arbitrarily read and modify these fields.                           Lastly, the sensitive data inserted will be passed to the
This can leak information about the content of the vault. This                          getHostname function of the tldts library. As a conse-
attack has no requirements.                                                             quence, some parts of sensitive data might be removed from
                                                                                        the final endpoint query.
BW05: Item Field Swapping. Nothing binds a ciphertext
to a particular item field. Hence, an adversary can swap                                BW07: Remove KDF Iterations. Client authentication to
around ciphertexts from different fields within an item.                                Bitwarden is performed by checking if a hash of the master
   For all items created before the per-item keys feature was                           key hm , derived from the master password input by the user at
introduced, an adversary can even swap ciphertexts around                               login time, matches a hash stored on Bitwarden’s servers. In
among different items, as well as create new items by merging                           order to protect the master password from brute-force attacks,
fields from other items.                                                                computation-intensive Password-Based Key Derivation Func-
   This attack has no requirements, and represents a clear                              tions (PBKDFs) are used to compute this hash. The derivation
violation of vault integrity. It also functions as a building                           speed is determined by the parameters of the PBKDF.
block for other attacks.                                                                   For instance, when PBKDF2 is used with the default
                                                                                        600,000 iterations, the hash is obtained as follows:
BW06: Icon URL Item Decryption. Items can include a
URL field, which is used to autofill the credentials and display                               km ← PBKDF2(pw, salt = email, i = 600000)
an icon on the client. The client decrypts the URL and fetches                                 hm ← PBKDF2(km , salt = pw, i = 1) .
the icon from the server, including in its request the domain
and top-level domain of the URL. For instance, if the URL is                               The KDF settings are stored unauthenticated and unen-
“https://host.tld/path”, the client request includes “host.tld”.                        crypted on the server. When a target user logs in, the adver-
   This means that the adversary can learn (part of) the con-                           sary can choose an arbitrary PBKDF configuration, including
tents of URL fields. Using Attack BW05, an adversary can                                one with a minimal iteration count. The user will then send a
place the ciphertext of sensitive item fields, such as a user-                          master key hash that is efficient to compute during authenti-
name or a password, in the encrypted URL field.13 After                                 cation. In our example, this means that the adversary can set
  13 Note also that in the item JSON representation, the values (e.g., the user-        The adversary can therefore tell, without any decryption, which ciphertext
name or the password) are encrypted, while the field names are in plaintext.            corresponds to which field (e.g., the password).


                                                                                   14
the first iteration count to 1,14 thereby reducing the number                 LP05: Malleable Vault. All field items are encrypted sepa-
of PBKDF2 iterations from 600,001 to 2 and achieving a                        rately under a single user key using AES-256-CBC (without
300,000x speed-up in a brute-force attack.                                    integrity protection). An adversary can manipulate the content
I MPACT. The adversary can reduce the cost of a brute-force                   of the encrypted fields using standard CBC-mode bit-flipping
attack on a target user’s master password; successfully recov-                techniques. This attack has no requirements.
ering the password enables full control of the user’s account.                LP06: Unprotected Item Metadata. As in Bitwarden,
R EQUIREMENTS. The user logs in.                                              many item metadata fields are unencrypted and not integrity
                                                                              protected: this includes creation timestamp, modification
                                                                              timestamp, and master password reprompt fields. An adver-
4.2.2   LastPass
                                                                              sary can change the metadata for an item, including whether
Similarly to Bitwarden, vault items in LastPass are composed                  or not to reprompt the user for their master password, the item
of various fields such as item name, username, URL, and                       creation and modification timestamp, its folder, and whether
password, and all of these fields are individually encrypted                  the item is in the favourites. They can also enumerate the
under the same user key ku . Similar attacks therefore apply.                 vault items and their type, such as login credentials, credit
                                                                              card, secure note etc., and observe the victim’s activity by
LP02: Item Field Swapping. There is no associated data                        looking at the item creation and modification time. This attack
binding each ciphertext to its field. Hence, an adversary can                 has no requirements.
swap around ciphertexts from different fields within an item,
as well as between different items, and create new items by                   4.2.3   Dashlane
merging fields from other items.
                                                                              Recall that items in Dashlane are treated as transactions and
LP03: Icon URL Item Decryption. LastPass login items                          encrypted with a key derived from the master key based on
can include a URL. This is used to autofill the credentials and               transaction parameters. For all transactions sharing the same
display an icon on the client. In order to fetch these icons, the             parameters (in particular, KDF and cipher mode; the salt is
client makes a query to LastPass’s icon server, including in                  constant for all transactions) the same derived key is used.
the request the URL that was stored inside the item. Just like
in Bitwarden, an adversary can use the item-field swapping                    DL01: Transaction Replay. Since the transaction key does
attack (Attack LP02) and place the ciphertext of sensitive                    not depend uniquely on the transaction, the server can dupli-
item fields, such as the username or the password, in the URL                 cate, reorder or drop transactions without the client noticing.
field. The plaintext will be leaked to the adversary via the                     This attack trivially violates vault integrity. It also serves
query to the icon server. Note that, unlike Bitwarden, there                  as a building block for other attacks, see Section 4.4.2.
are no conditions on the plaintext formatting.
                                                                              4.2.4   1Password
I MPACT. The adversary can recover (parts of) selected target
ciphertexts in the item, such as the username or the password.                Vaults in 1Password are encrypted at a per-item granularity:
R EQUIREMENTS. The client opens the modified vault.                           each item is encrypted as a AES-GCM blob, with the meta-
                                                                              data (“item overview”) encrypted as a separate AES-GCM
LP04: Remove KDF Iterations. Client authentication to                         blob. This reduces the amount of metadata leakage and in-
LastPass is performed by checking if a hash of the user key –                 tegrity issues, compared to Bitwarden and LastPass; similarly
derived from the master password input by the user at login                   to Dashlane, all items in a vault are encrypted with the same
time – matches a hash stored on LastPass’s servers. Just like                 symmetric vault key kv , and the only plaintext metadata is
in Bitwarden, 2 invocations of PBKDFs are used to derive this                 the item creation and last modification time. Account meta-
hash, with a default of 600, 000 + 1 iterations for PBKDF2.                   data such as the KDF parameters are stored unencrypted and
   Similarly to Bitwarden, the KDF parameters are unen-                       unauthenticated.
crypted and unauthenticated, enabling an adversary to choose
them arbitrarily. The PBKDF2 iteration count can then be                      1P02: Item Dropping/Duplication. Just like for Dashlane,
lowered down to 3 (a client-enforced minimum of 2 for the                     vault items can be duplicated or dropped by the server. This
inner invocation, while the outer is fixed to 1). The adversary               attack trivially violates vault integrity, but does not have a
thus achieves a speed-up of 200,000x in a brute-force attack.                 severe practical impact.
I MPACT. The adversary can reduce the cost of a brute-force                   1P03: Vault Injection. Due to the lack of ciphertext authen-
attack on a target user’s master password; successfully recov-                tication, it is easy for an adversary to inject an entirely new
ering the password enables full control of the user’s account.                vault, containing adversary-controlled items, into a 1Password
R EQUIREMENTS. The user logs in.                                              user’s account. The attack proceeds exactly as Attack 1P06,
                                                                              which we will see in Section 4.3.4, but creating a new vault
 14 The minimum, values of zero or less result in the client crashing.        instead of targeting an existing one.


                                                                         15
1P04: Remove KDF Iterations. The KDF parameters that                                          ′ ), // org key under victim’s pk
                                                                               Key = Enc(pk, korg
control the computational cost of deriving the AUK (kAUK )                     PublicKey = pk ′org ,
from the master password and secret key are provided by the                    PrivateKey = Enc(korg ′ , sk ′ ),
                                                                                                            org
server and trusted without client-side verification. A mali-                       ,→ // org priv. key under the org key
cious server can reduce the iteration count from the default                 },
650,000 iterations to a minimal value of 10,000 iterations.                  collections = {
I MPACT. Although this attack weakens the brute-force protec-                  newColl = { Name =
                                                                                   ,→ AES-CBC-HMAC.Enc(korg      ′ , name) } },
tion provided by slow hashing, the secret key still contributes
                                                                             [...]
enough entropy to make a brute-force attack infeasible.
                                                                           };
                                                                         I MPACT. The adversary can add users to arbitrary organisa-
4.3     Sharing                                                          tions, thus violating vault integrity by adding organisation
These attacks target the sharing of items. All of the password           items to the user’s vault. This can be used in framing attacks,
managers we study implement some kind of sharing, and they               for example, by planting incriminating material. Furthermore,
fall victim to attacks due to a lack of key authentication. They         it enables several other attacks (e.g., BW03 and BW09).
all also lack any mechanism for end users to manually authen-            R EQUIREMENTS. The client performs a sync operation. This
ticate keys out-of-band (e.g. by comparing key fingerprints)             is done automatically by the client at startup, when the vault
when sharing, leaving their users completely exposed to this             page is loaded, in response to some user actions, and upon
class of attacks.                                                        server-generated events.
   The attacks in this category range in severity: while the
                                                                         BW09: Organisation Overwrite. Immediately after an
vulnerabilities in LastPass and Dashlane only affect the items
                                                                         organisation is created, the client of the creator performs a
being shared, the ones in Bitwarden and 1Password have
                                                                         sync to fetch the latest data from the server. As part of this,
further-reaching consequences.
                                                                         the keys of the newly created organisation are fetched. After
                                                                         the sync is completed, the creator of the organisation is able
4.3.1   Bitwarden                                                        to decrypt the organisation symmetric key using their private
                                                                         RSA key and use it to decrypt all organisation data.
Recall that in Bitwarden, users can share items with other
                                                                            By applying the same method as in Attack BW08 above,
users in organisations; each organisation has a symmetric key
                                                                         the adversary can overwrite the newly created organisation:
korg , which is stored on the server encrypted under the public
                                                                         they can swap the encrypted symmetric key corg and the or-
RSA key of each member of the organisation.
                                                                         ganisation data with values they control. Upon sync, the client
BW08: Organisation Injection. There is no cryptographic                  has no way of distinguishing such a malicious key from the
binding between a user’s vault (or even the vault abstraction)           legitimate organisation key.
and the organisations a user is part of. Users learn the list of            In contrast to Attack BW08 (which creates a new organisa-
the organisations they are part of when their client performs            tion), this attack is entirely undetectable. Note that it is also
a sync to fetch the latest data from the server. Furthermore,            possible for an adversary to overwrite an organisation after it
copies of the encrypted organisation symmetric key are not               is created, but in doing so they would delete any pre-existing
authenticated in any way: anyone can encrypt a chosen sym-               organisation items.
metric key under the public key of any user.                             I MPACT. The adversary can read and modify all the items in
   It follows that adding a user to an organisation only requires        the newly created organisation.
access to their public key, which is known by the server. Thus,          R EQUIREMENTS. The user creates an organisation.
an adversary can create a new organisation and trivially add
users to it: they just need to encrypt the organisation symmet-          4.3.2   LastPass
ric key korg under the target user’s public key. The client will
silently accept the new organisation at the next sync. As a              Recall that LastPass implements item sharing by means of
corollary, the adversary can also add arbitrary users to any             shared folders. Items in a shared folder are encrypted with
organisation whose symmetric key they know.                              the symmetric shared folder key, which is in turn encrypted
   Concretely, the adversary samples a fresh organisation sym-           under the public key(s) of the recipient(s) of the folder.
metric key korg′ and organisation RSA key pair (pk ′ , sk ′ ),
                                                      org    org         LP07: Sharing Key Overwrite. During an item-sharing
and forges a sync response that injects a new organisation,              operation initiated by a user, the server, acting as an adver-
together with its default collection (the grouping Bitwarden             sary, sends an adversary-controlled recipient RSA public key
uses for an organisation’s shared items):                                instead of the intended recipient key.
  syncRes ′ = {                                                          I MPACT. The adversary can read and modify all the items in
    newOrg = {                                                           a shared folder.


                                                                    16
R EQUIREMENTS. The user shares an item with any recipient.                   Recall from Figure 2 that 1Password uses RSA-OAEP to
                                                                          encrypt the vault key with the user’s keyset. While this pro-
4.3.3   Dashlane                                                          tects the confidentiality of vault keys, it does not authenticate
                                                                          them, creating an opportunity for a ciphertext substitution
Like LastPass, Dashlane implements item sharing using pub-                attack. In particular, anybody can encrypt to the public key
lic key encryption. The problem of unauthenticated public                 of a given keyset, since the public part is not protected.
keys described in Attack LP07 also affects Dashlane.                         For instance, a malicious server can execute the following
    When a client shares an item with a user or in a group, a             attack at the time of vault creation:
fresh symmetric sharing key (kshr ) is sampled. This key is
either used to directly encrypt the shared item (in the case                1. The user initiates vault creation, generating a keyset
of user-to-user sharing), or to encrypt group keys which in                    (sk, pk) and a vault key kv , and saves the encrypted vault
turn protect shared items (for group sharing). Regardless of                   key c = RSA-OAEP.Enc(pk, kv ). The user logs out.
setting, the sharing client retrieves the RSA public keys of                2. The server samples a fresh vault key kv′ , and encrypts
the recipient(s) from the server and, without verifying their                  kv′ under the public RSA key in the keyset: c′ =
authenticity, encrypts kshr under each recipient’s public key,                 RSA-OAEP.Enc(pk, kv′ ).
            user
yielding cshr    for each recipient user. The client sends each             3. The user logs in again, and is offered c′ instead of c by
  user
cshr   to the server for storage.                                              the server. The user decrypts c′ with their private key
                                                                               and uses kv′ to encrypt all new vault items. Since the
DL02: Sharing Key Overwrite. When the sharing client                           server knows kv′ , it can recover all newly encrypted items
requests a recipient public key, a malicious server can over-                  as well as inject new items into the vault.
write it with an RSA key pk adv it controls, causing kshr to
be encrypted under the malicious public key. The resulting                   The root cause of this attack is the lack of cryptographic
            adv
ciphertext cshr is then sent to the adversary, allowing them to           binding between the vault key kv and the user’s key encryption
decrypt it with sk adv and recover kshr . This in turn gives the          key derived from the password. More specifically, there is
adversary access to the shared item(s) protected by kshr .                no mechanism allowing the client to verify that a vault was
I MPACT. The adversary can read and modify all shared items.              genuinely created by the user themselves rather than injected
                                                                          by the server. Unlike Attacks 1P01 and 1P05, this attack is
R EQUIREMENTS. The user shares an item with any recipient.
                                                                          not mentioned in the 1Password white paper [2].
                                                                          I MPACT. Complete compromise of vault confidentiality and
4.3.4   1Password                                                         integrity. The adversary can read and decrypt all vault con-
1Password supports sharing vaults. This is implemented by                 tents encrypted after the attack, including passwords, credit
encrypting a vault key under the public key of the user with              card information, secure notes, and other sensitive data stored
whom the vault is shared.                                                 in the vault. Similarly, they can inject new items into the vault
                                                                          after the attack.
1P05: Sharing Key Overwrite. Much like the other prod-                    R EQUIREMENTS. The client fetches key material from the
ucts we analyse, 1Password lacks authentication of public                 server, for example due to the user logging in on a new device.
keys. This trivially enables sharing attacks similar to BW09,             If executed on a non-empty vault, the attack results in the
LP07 and DL02, something that the 1Password white pa-                     client losing access to all items already in their vault, while
per [2, Appx. C] openly acknowledges:                                     leaking any new items added to the vault after the attack took
     At present, there’s no robust method for a user to verify            place. If the attack is executed at the time of vault creation,
     the public key they’re encrypting data to belongs to their           the attack is effectively undetectable by the client, since it
     intended recipient. As a consequence, it would be pos-               cannot distinguish between a ciphertext it created and the
     sible for a malicious or compromised 1Password server                ciphertext created by the server during the attack.
     to provide dishonest public keys to the user and run a
     successful attack.
                                                                          4.4    Backwards Compatibility
  We list this known attack here for completeness. Unlike the
other vendors we study, 1Password explicitly acknowledges                 The KDF downgrade attacks for Bitwarden, LastPass and
some of the attacks stemming from public key authentication.              1Password (BW07, LP04, 1P04, which we classified in this
Nonetheless, these attacks violate security expectations in a             work as vault integrity attacks) all also arguably represent
malicious server threat model.                                            backwards compatibility issues. Password managers select
                                                                          more computationally intensive KDF parameters over time,
1P06: Vault Substitution Attack. 1Password not only                       but want clients of users who have not migrated to the new
lacks authentication of public keys, but also of public-key               parameter sets to still be able to access their vault.
ciphertexts. This affects not only the security of the credential-          This section focuses on some more involved backwards
sharing feature, but also the confidentiality of the entire vault.        compatibility features of Bitwarden and Dashlane. Both pass-


                                                                     17
word managers have evolved the cryptographic primitives                   plain AES-CBC). The encryption type is prepended to the
they support over the years, shifting from AES in CBC mode                ciphertext and is not integrity-protected.
for encryption and PBKDF2 for key derivation to AE schemes                   Furthermore, older versions of Bitwarden did not use the
such as AES-CBC-HMAC and memory hard PBKDFs like                          current key hierarchy. To support the old hierarchy, a modern
Argon2d. Both also show changes in the key derivation trees,              client will generate a new RSA key pair for the user (pk ′ , sk ′ )
with Bitwarden migrating to better key separation with the                if one was not provided by the server, and use km to encrypt
introduction of per-item keys.                                            sk ′ if no user key ciphertext cu was provided by the server.
   The current client versions only use modern cryptography               Both of these features can be seen as backwards compatibility
by default, but they still offer “legacy” support. The attacks de-        measures, allowing a modern client to support old user vaults
scribed below enable the adversary to downgrade, sometimes                and to migrate the user vault to the current feature set.
permanently, the primitives used by the clients, reducing the                We exploit these features to build the attack gadget BWb1,
security of the affected password managers to the security of             resulting in the attacks BW11 and BW12 below.
the weakest supported cryptographic algorithm.
                                                                          BWb1: Known Plaintext Oracle Gadget. An adversary
4.4.1   Bitwarden                                                         can leverage the generation of RSA key pairs and the support
                                                                          for encryption using the master key km to obtain AES-CBC
Bitwarden offers several backwards compatibility features,                encryptions of known plaintexts under an (unknown) km .
which can all be exploited by a malicious server.                            At login time, the adversary responds to the login request
Per-Item Keys. Recall from Section 4.2.1 that Bitwarden                   with a null cu and a null private RSA key ciphertext csk . The
version 2024.2.0 enables “per-item keys”. When creating a                 absence of csk will force the user to generate a new RSA key
new item, per-item keys are only used if the client enables this          pair. However, since cu was also set to null, the client will use
feature, and if the server version is recent enough to support            km to encrypt the new secret key using AES-CBC, yielding
                                                                           ′ , and will then send pk ′ , c ′ to the server.
                                                                          csk
per-item keys. In order to determine this, the client fetches                                             sk
the server version at login time by sending a request to the                 Notably, sk ′ also contains an encoding of pk ′ . Thus, by
                                                                          observing the encrypted csk  ′ and pk ′ , the adversary learns a
config endpoint of the server. This result in the attack BW10
below.                                                                    5-block-long plaintext-ciphertext pair.

BW10: Disable Per-Item Keys. An adversary can perform                     BW11: User Key Overwriting. The adversary can forge a
a downgrade attack by sending a lower server version such                 ciphertext cuadv , such that the client will decrypt it to a user key
that the client does not enable per-item keys. This is trivial,           ku = kuenc ∥ kumac for which the adversary knows kuenc . Recall
because the server configuration is not authenticated by the              that kuenc and kumac are 32 bytes each, spanning two blocks of
client. As a consequence, all new items will be encrypted                 CBC plaintext.
with the same key (the user key).                                            The adversary constructs cuadv by using the 5-block
I MPACT. This attack disables a critical security feature, down-          plaintext-ciphertext pair from BWb1. Via bit-flipping, the
grading Bitwarden’s key hierarchy and exposing unprotected                adversary sets the last block of ciphertext to a block P5 of
vault items to numerous other attacks. Recall that Bitwarden              padding, obtaining a garbled block P4 , and known blocks P1 ,
does not implement a migration path for legacy items, thus                P2 , P3 . Finally, the adversary marks this ciphertext as type 0.
indefinitely exposing affected items even after the attack is                Upon receiving cuadv , the client will accept it as a valid
concluded.                                                                user key encryption: the ciphertext is encrypted under the
R EQUIREMENTS. None.                                                      master key km , the type is 0 so CBC decryption is used, and
                                                                          unpadding succeeds. The client then parses ku = kuenc ∥ kumac .
                                                                          Since kuenc consists of blocks P1 and P2 , the adversary knows
Legacy encryption. The latest Bitwarden clients use au-
                                                                          kuenc fully, while kumac is unknown to the adversary because
thenticated encryption (AE) for all symmetric encryption
                                                                          of the garbled block P4 .
operations by default, thereby ensuring both confidentiality
and integrity of the encrypted data. The AE scheme used                   I MPACT. The adversary learns kuenc , used to encrypt all the
is AES-CBC with HMAC, combined via the encrypt-then-                      vault items. Therefore, the confidentiality of all items en-
MAC paradigm. In particular, this encryption scheme is used               crypted after the attack is mounted is forfeit. Integrity is
to decrypt the user key received from the server at login time            preserved, as the adversary does not learn kumac .
and to encrypt and decrypt the items inside the vault.                    R EQUIREMENTS. The user logs in. Due to the attack, this
   However, older versions of Bitwarden used AES-                         initial login attempt fails, and the user is redirected to a migra-
CBC (without HMAC), which does not offer any integrity                    tion page. Regardless of the action taken by the user after the
protection. To accommodate both formats, each ciphertext                  migration page is displayed, the attack completes successfully
has an encryption type attribute (type 2 for AE, type 0 for               during a subsequent login attempt.


                                                                     18
BW12: Downgrade to Legacy. The adversary can forge a                     First, due to the error handling code in the client, the transac-
ciphertext cuadv , such that the client decrypts it to a user key        tion type must be Setting. Second, the transaction must use
ku = kuenc ∥ kumac , where kumac is empty.                               the Flexible payload format with CBC-only set as the cipher
   This can be achieved by following the same steps as in                mode. Note that Dashlane clients use a separate key kcbc for
Attack BW11, but using only three blocks of ciphertext: in               CBC-only transactions: this means that the padding oracle
this case, P3 is set to a block of padding, and P2 is garbled. As        attack cannot be used to decrypt any modern CBC-HMAC
previously discussed, the client will accept this cuadv as valid.        transactions, since they use key kcbc -hmac instead. Nonethe-
The ciphertext being too short triggers another backwards                less, it can be used as a building block for other attacks.
compatibility feature: the client parses ku = kuenc without              R EQUIREMENTS. This attack requires 256 oracle queries
the “mac” key part, causing all subsequent encryptions to be             per byte of plaintext recovered. The client fetches new trans-
performed using CBC-only mode. Note that if per-item keys                actions (sync) every 5 minutes, meaning that adversary can
are enabled, item encryption still uses AES-CBC with HMAC.               decrypt one full block in 14 days. Note that this attack can
But the adversary can easily downgrade the client to not use             be significantly sped up by more frequent syncs: this can be
per-item keys, see BW10.                                                 achieved for instance in the presence of multiple clients.
I MPACT. The attack downgrades encryption to CBC-only
                                                                         DLb2: Encryption Oracle. While modern Dashlane
mode, trivially compromising the integrity of all items en-
                                                                         clients do not themselves produce transactions vulnerable
crypted after the attack is executed. In turn, this enables a
                                                                         to the padding oracle attack described above, the adversary
padding oracle attack [80], leading to a complete compromise
                                                                         can now use the encryption oracle technique of Rizzo and
of vault confidentiality. We did not develop a PoC for this last
                                                                         Duong [41, §3] to create a ciphertext that decrypts to a plain-
aspect of the attack, but the developers of Bitwarden acknowl-
                                                                         text of their choosing under the key kcbc .
edged its feasibility. We also note that the adversary knows
P1 , and therefore learns half of the encryption key kuenc .             R EQUIREMENTS. This gadget requires running Attack DLb1
                                                                         once per block of plaintext encrypted.
R EQUIREMENTS. The same as BW11.
                                                                         DL03: Item Injection. Using DLb2, an adversary can en-
                                                                         crypt arbitrary plaintext under the key kcbc .
4.4.2   Dashlane
                                                                            An adversary can then forge arbitrary transactions with
Recall from Section 3.3 that every transaction has a pay-                Flexible payload, and CBC-only cipher mode. Since the type
load, which defines the key derivation function, cipher, and             is a plaintext field of the transaction and does not influence
mode to use to decrypt the transaction content. Two payload              key derivation, the adversary can pick an arbitrary transaction
formats are relevant for our attacks: KWC3, using PBKDF2-                type. The client will accept this transaction as authentic, and
SHA-1 and AES-256-CBC; and Flexible, with a format string                correctly derive key kcbc to decrypt it.
which is parsed to select the KDF (PBKDF2-SHA-256 or                     I MPACT. The adversary can forge arbitrary transactions. This
SHA-1, Argon2i, or the default Argon2d), its parameters, the             means that the adversary can now plant arbitrary credentials
cipher (only AES-256), and the cipher mode (the default CBC-             and notes into the vault, thus violating vault integrity, and
HMAC and GCM being the only documented modes).                           change arbitrary settings, enabling further attacks.
   Modern Dashlane clients default to Flexible mode; upon                R EQUIREMENTS. Execution of DLb2. Recall that each block
detecting a KWC3 payload they automatically migrate the                  of transaction content needs 14 days to be encrypted.
transaction to Flexible. Support for the legacy format varies
across clients: we verified that the web extension supports it,          DL04: Remove KDF Iterations. User settings in Dashlane
while the CLI client does not. All of the following attacks only         control many client behaviours. Among these, they define
affect clients that support the legacy format. We produced               what KDF to use for all new transaction payloads, and the
PoCs against the web extension client.                                   respective parameters.
                                                                            Using Attack DL01, the adversary can remove any existing
DLb1: CBC Padding Oracle. Unexpectedly, CBC-only en-                     transaction of type Setting. This moves the user settings to
cryption is still accepted as an encryption mode in the Flexible         a known clean state. Then the adversary uses Attack DL03
payload format of Dashlane and does not trigger a migration.             to forge a new transaction of type Setting. When the user
Upon receiving a malformed transaction content ciphertext,               creates a new item, the client will derive a key from the
the client will emit distinguishable error messages, depend-             master password with the adversary-chosen KDF parameters.
ing on whether the padding removal fails or if the padding                  For instance, the adversary can change the number of
removal succeeds but parsing of the transaction content fails            PBKDF2 iterations from the default of 200,000 iterations
at the application level. This means that an adversary can               to 1, achieving a 200,000x speed-up in a brute-force attack.
mount a padding oracle attack [80] using transactions with               I MPACT. The adversary reduces the cost of a brute-force
the modern payload format and CBC-only encryption.                       attack on a target user’s master password; success enables full
   For the attack to work, two conditions must be satisfied.             control of the target user account.


                                                                    19
R EQUIREMENTS. Execution of DL01 and DL03.                                 In general, these techniques can be used to design the core
                                                                        of a secure E2EE password manager: in Section 5.2 we briefly
DL05: CBC-Only Downgrade. The setting transaction                       sketch such a high-level design.
also controls which cipher and mode of operation the client
uses for future transactions. Similarly to Attack DL04, the
adversary can forge settings instructing the client to use CBC-         5.1    Immediate Remediations
only encryption. When the user creates new items, the client            In our ongoing discussions with the vendors, the introduction
will then always use CBC-only mode. The resulting transac-              of breaking changes emerges as the major obstacle to deploy-
tion will be vulnerable to the padding oracle attack in DLb1.           ing our countermeasures. As we argue in Section 6, breaking
I MPACT. The adversary can decrypt all the transactions pro-            changes are necessary, and even inevitable. To this aim, we
duced after the attack is completed.                                    propose the use of specialized password manager clients, with
R EQUIREMENTS. Execution of Attacks DL01 and DL03,                      no functionality besides implementing a forced migration to
plus one execution of DLb1 for each decrypted transaction.              the new vault format. This would prevent any user from losing
                                                                        access to their data, while preserving security for the entire
Attack timing. In our PoCs, we successfully forge a mini-               user base. Below, we detail the changes we suggest.
mal transaction of type Setting which is only 9 blocks long,
enabling us to test Attack DL04 and DL05. We artificially               Only use AE (AE). Disabling legacy support for encryp-
sped up the execution for testing, but we estimate this would           tion schemes that provide no integrity immediately remediates
take more than 126 days at the normal attack speed. This is a           most of our Backwards Compatibility attacks on Bitwarden
long time, but it is reasonable for a targeted attack.                  (BWb1, BW11, BW12) and Dashlane (DLb1, DLb2, DL03,
                                                                        DL05, DL06), since they exploit the support of AES-CBC.
DL06: Lucky 64. Another Flexible payload setting allows                 Encrypting item metadata with AE would remediate BW04
for the client to completely skip key derivation (noderivation),        (Unprotected Item Metadata). LastPass would need to intro-
and use the master password directly, if and only if the master         duce AE from scratch. This would remediate many of its
password is exactly 64 bytes long. We presume that the in-              Vault Encryption issues (LP05, LP06), and, together with
tended use of the noderivation mode is for the setting where            the KS mitigation (see below), also attacks LP02 (Item Field
the user authenticates via SSO, and the master password con-            Swapping) and LP03 (Icon URL Item Decryption).
tains a 64-byte cryptographic key.                                         Additionally using authenticated data (AD) to protect meta-
   In the rare instance of a user actually having picked a mas-         data fields in the items and user settings in the vault would mit-
ter password that is 64 bytes long, the adversary can use               igate the Vault Integrity issues in Bitwarden (BW05, BW04,
Attack DL04 to pick noderivation as a PBKDF and AES-                    BW06), LastPass (LP02, LP03, LP06), and Dashlane (DL01).
CBC-HMAC as a cipher mode of operation. Then the master                 Proper key separation (KS). Most vault integrity issues
password will be split in two: the first 32 bytes will be used          can be mitigated by using proper key separation: each key
as the AES-256 key, and the next 32 bytes will be used as the           should be used only to encrypt a single field of a single vault
HMAC key.                                                               item, with all keys being created from the master key using
I MPACT. The adversary can reduce the cost of a brute-force             a suitable key derivation function and per-item and per-field
attack on a target user’s master password, via separate brute-          context strings. Recall that, in contrast to encrypting the
force attacks on the two 32-byte halves of the user’s master            whole vault as a monolith, this approach allows efficient syn-
password. For instance, a 64-byte password composed of 10               chronisation of changes: each item can be encrypted and
words has an estimated entropy of 120 bits, but would require           synchronised independently, while still protecting the overall
on average 260 guesses to recover after the attack, compared            integrity.
to 2119 otherwise: a speed-up of a factor 259 .                            In Bitwarden, item keys provide a good starting point. Ex-
R EQUIREMENTS. Execution of Attack DL04, plus the user se-              tending this approach to the field level would both make URL
lects a (memorable, low entropy) master password of exactly             checksums redundant, and remediate BW05 (Item Field Swap-
64 bytes.                                                               ping) and BW06 (Icon URL Item Decryption). Item keys
                                                                        should also be made mandatory, mitigating BW10 (Disable
                                                                        Per-Item Keys). Together with the AE mitigation, KS would
5   Mitigations                                                         also prevent issues like BWb1 (Known Plaintext Oracle Gad-
                                                                        get) from arising. LastPass currently lacks any form of key
Our attacks can all be mitigated using a combination of au-             separation within the vault. Introducing it along with an AE
thenticated encryption (AE), key separation (KS), plaintext             scheme would mitigate LP02 and LP03. In Dashlane, each
authentication (AD), public key authentication (PKA), and               transaction could be encrypted with a different key, derived ac-
ciphertext authentication (SC). We detail how in Section 5.1;           cording to a unique transaction identifier, to partially resolve
Table 1 additionally maps attacks to mitigations.                       DL01.


                                                                   20
Authenticate all plaintext (AD). All settings and metadata               impossible to resolve. For instance, unlike vault data (which
that cannot be encrypted should at least be authenticated (i.e.,         requires client-side re-encryption), the server could unilater-
integrity protected). This can be achieved by using Authen-              ally upgrade the authentication material, allowing clients to
ticated Encryption with Associated Data (AEAD), as an ex-                only support the latest parameter set for authentication while
tension of AE. This would mitigate the metadata malleability             still accepting older sets for vault decryption. However, such
issues (BW04, LP06).                                                     schemes are non-standard and would require further analysis.
   Of course, authenticated encryption of individual items
                                                                         Public key authentication (PKA). Introducing proper au-
does not grant integrity to the full vault. As we saw, attacks
                                                                         thentication of public keys is non-trivial: a stop-gap mitiga-
like DL01 and 1P02 allow an attacker to duplicate or drop
                                                                         tion would be storing known public keys in the vault after
items at will within a vault. In order to resolve these attacks,
                                                                         an (optional) out-of-band verification. This would allow the
the full vault state should be authenticated: a MAC would
                                                                         users to detect public key changes, preventing active attacks.
ensure that the vault structure cannot be changed without pos-
                                                                         Even when no out-of-band verification is performed, this
session of the right key. This would only offer protection up
                                                                         would still prevent some attack scenarios: the attacker can
to rollback attacks: the adversary can always present an old
                                                                         then only substitute public keys on their first use.
version of the vault as the current one, unless the vault key
changes because of updates to the KDF parameters or to the                  An alternative is to introduce a PKI where a Certificate
master password. Nevertheless, vault integrity up to rollbacks           Authority (CA) signs all public keys. This CA should not be
would be a significant improvement over the current integrity            under the control of the same entity that controls the password
guarantees. As far as we are aware, such rollback attacks can-           manager’s server, so that it can truly act as a trusted third party.
not be prevented without either assuming that clients maintain           This is particularly relevant in a business setting, given that
some state, or adding some additional trust assumptions (e.g.            many companies that use password managers may already
relying on a decentralized ledger).                                      operate their own CA infrastructure.
                                                                            These measures would remediate most of the Sharing is-
   Similarly, including the last known server version in the
                                                                         sues (LP07, DL02, 1P05). They would also allow the user
authenticated vault state mitigates BW10 (Disable Per-Item
                                                                         to authenticate the public keys of admins and organisations
Keys). An attacker can still replay an old version of the vault
                                                                         used for Key Escrow. Additionally, assuming that a correctly
(with the corresponding server version), but all newly created
                                                                         signed list of admins is published, this would remediate sev-
items are protected.
                                                                         eral Key Escrow issues (BW01, BW03, LP01).
Protect KDF Parameters (KDF). Authenticating security-                   Ciphertext authentication (SC). In Bitwarden, the only
critical user settings like PBKDF parameters (such as the                cryptographic check of organisation membership is through
iteration count, which enables attacks BW07, LP04, 1P04) is              the decryption of organisation data, encrypted by the user
highly nontrivial. Our suggestion is to err on the side of se-           under their own public key. Similarly, in 1Password, vault
curity, break backwards compatibility for very old parameter             keys are encrypted by the user under their own public key.
sets, and only allow secure parameter choices in the clients.            However, as we have noted, anyone can produce such cipher-
A special standalone version of the client application, with no          texts. This results in BW02 (Malicious Key Rotation), BW08
functionality other than migrating to more modern parame-                (Organisation Injection), BW03 (Malicious KC Conversion),
ter sets, can be provided for users that missed the parameter            and 1P06 (Vault Substitution Attack).
upgrades.                                                                   While it is true that authenticating public keys of other users
   As an alternative mitigation, we may try to authenticate the          is non-trivial, it is easy for a user to verify whether a public key
KDF parameters themselves. The client would, for instance,               ciphertext has been produced by themselves: these attacks can
use the server-provided KDF parameters to derive the authen-             be prevented by switching to signcryption [82]. By signing
tication key, use it to verify the integrity of the parameters           plaintexts before encryption, clients can verify that the user
themselves, and – in case of a mismatch – abort before any               themself is the sender. An alternative would be to forgo public-
further communication with the server. On the one hand, this             key encryption entirely in favour of symmetric (authenticated)
thwarts our immediate attacks: an adversary tampering with               encryption. This is possible since the user is both the sender
the KDF parameters would need to predict the authentication              and the recipient of the affected data. An added benefit of
key for the client to accept the modified parameters. On the             this approach is efficiency gains from removing unnecessary
other hand, as pointed out in [74, §3.2], the security in this           public-key cryptography. However, it might require a larger
setting is circular and relies on non-standard properties of             re-design compared to simply adding signatures.15
MACs. Furthermore, while this solves KDF downgrades in
                                                                           15 1Password argues that the signcryption solution would be hard for them
isolation, it introduces a complication for user authentication:
                                                                         to implement, because “access to vaults must remain valid across key rotation,
the server should not reveal the authenticated KDF parameters            recovery workflows, and membership transitions”, and that they are investing
to unauthenticated users, yet user authentication itself requires        in a solution that also authenticates other user’s public keys. We argue that
knowing the KDF parameters. This circular dependency is not              non-shared vaults, which are the default for some fraction of the user-base,


                                                                    21
   A combination of signcryption and PKA is needed when                          with first releases in 2012 and 2016 respectively, but they
receiving public key ciphertext encrypted by other users, such                   were entering a market with quite low cryptographic stan-
as organisation invites in Bitwarden, or the list of admins                      dards. The early releases of both show a taste for early-2000s
for a team in LastPass. This would be needed to remediate                        cryptography, with lack of integrity protection for encryption
BW01 (Malicious Auto-Enrolment), BW09 (Organisation                              and unprincipled designs being prevalent.
Overwrite) and LP01 (Malicious Password Reset).                                     Motivated by backwards compatibility, residues of this
                                                                                 legacy cryptography have remained across codebase changes
                                                                                 and redesigns. In our communication with vendors, they
5.2     Future Designs and Limitations                                           expressed deep concern about leaving users with impossible-
The mitigations we propose can serve as a roadmap for a                          to-decrypt vaults because of cryptographic changes. This
provably secure password manager design, with minimal per-                       motivated the extreme lengths to which some of them go in
formance overhead compared to existing designs, as follows.                      order to support old formats. In the meantime, the security
Starting from a PBKDF-derived key computed from the user’s                       community had learned, through the long saga of attacks on
master password, standardized and efficient key derivation                       SSL and TLS [6,10,11,18–21,46,79], to put aside backwards
functions are used to derive separate symmetric keys for all                     compatibility and orient itself towards cryptographic alacrity:
vault items, thus providing proper key separation. With these                    introducing sharp, but clean, breaking changes to keep the
keys, vault data is encrypted using a modern AEAD scheme.                        ghosts of past cryptographic attacks at bay.
Using symmetric cryptography with built-in authentication                        Deceptively simple. Unlike secure channel protocols and
both provides ciphertext integrity and has low performance                       end-to-end encrypted messaging, password managers have
cost compared to using bespoke mechanisms for achieving                          arguably escaped deep academic scrutiny before now.16 Per-
vault integrity. All user data is both encrypted and authen-                     haps this is because the problem they address looks, on the
ticated, with only unavoidable metadata, such as PBKDF                           surface, like a simple matter of key derivation and then en-
parameters, left as authenticated-only additional data. Wher-                    cryption, without any interesting problems to solve. After
ever public-key cryptography is necessary (e.g., for sharing),                   a closer look, we have seen that password managers are far
measures such as certificates are taken to authenticate public                   from simple: they have evolved to include complicated proto-
keys, and signatures are used to authenticate ciphertexts.                       cols for key synchronisation, recovery and rotation, sharing
Caveat. We have presented mitigations for all the attacks                        of encrypted elements, and migration between different cryp-
we found, but there may be other cryptographic attacks yet to                    tographic primitives. The complexity they have reached is
be discovered for which our mitigations would be ineffective.                    comparable to that of modern E2EE cloud storage systems.
Formally defining the security goal of a password manager in                        Even though password managers have evolved, with cryp-
the face of a malicious server is a necessary first step toward                  tographic best practices trickling in over time (e.g. AEAD
provable security. The same applies to our high-level sketch                     and memory-hard PBKDFs being eventually integrated in
of a secure design: only a security analysis backed by for-                      Dashlane and Bitwarden), there was never a gold standard
mal models and proofs can properly inform a more detailed                        to match (like TLS or Signal), or even precise security no-
construction; such analysis is beyond the scope of this paper.                   tions to aim for. This is similar to the situation for E2EE
                                                                                 cloud storage, where a recent rash of research [7, 8, 16, 49, 50]
                                                                                 has exposed the frailties of deployed systems, and formal
6     Discussion                                                                 foundations closely linked to practice are only now emerging.
                                                                                 Indeed, the two applications are close enough that the recent
Password managers deal with critically sensitive data – yet,                     foundational work of [15] could provide a good starting point
we have exposed severe attacks against four important vendors                    for password managers too.
in this space. This section explores the manifold reasons for
those attacks, discusses broader impacts of our findings, and                    Integrity in motion. To draw another parallel with cloud
provides directions for future work.                                             storage, password managers also face the challenge of effi-
                                                                                 ciently synchronizing encrypted data. The naïve approach of
A burdensome legacy. Password managers were early en-                            storing all user files in a single AE-protected blob is clearly un-
trants in the world of end-to-end encrypted applications: they                   viable for large amounts of data. Modern password managers,
predate all modern end-to-end encrypted messaging appli-                         supporting large numbers of items, consequently structure
cations, with the initial release of LastPass dating back to                     their vaults to enable individual item synchronisation.
2008. Encryption of vaults has always been a focus of these                         As we suggest in Section 5, the apparent tension between
products, but cryptographic best practices have changed a lot                    integrity and incremental updates can be solved by clean key
in the last years. Dashlane and Bitwarden are more recent,                       separation. Preventing deletion remains an open problem;
would still benefit from signcryption, and a careful implementation would          16 They are frequently subjected to code audits and security reviews, but

carry over through rotation and recovery flows.                                  not to cryptographic reviews.


                                                                            22
Merkle tree techniques can prevent selective deletion attacks             guarantees for password managers.
by authenticating the vault structure, but complete roll-back
of vaults cannot be ruled out without outsourcing versioning
information to a trusted third party or local cryptographic state.        7   Conclusions
The latter approach is problematic for password managers,
since users expect access to their vault upon presenting only             We have argued that the malicious server threat model is the
their master password, even on a stateless client.                        correct one for cloud-based password managers: security in
                                                                          this setting is both claimed in vendor advertisements and rep-
Share with care. Many of the vulnerabilities we identify                  resents the gold standard for modern end-to-end encrypted
rely, in one form or another, on substituting public keys with            systems. We then showed that four popular password man-
adversary-controlled ones. Such attacks have been known                   agers with more than 60 million users in total are badly broken
since the dawn of public key cryptography [39, §III].                     in this threat model. The vulnerabilities that we describe are
   When it comes to verifying public keys of other users,                 numerous but mostly not deep in a technical sense. Yet they
administrators or organisations, password managers run into               were apparently not found before, despite more than a decade
a very well-known problem: there is no way around the need                of academic research on password managers and the exis-
to provide some form of verification of public keys. In short,            tence of multiple audits of the four products we studied. This
PKI (of some form) cannot be avoided.                                     motivates further work, both in theory and in practice.
   In our mitigations, we propose relying on PKIs or on Trust-               Beyond showcasing the relevance of the malicious server
On-First-Use (TOFU) systems. Secure messaging applica-                    threat model in practice, our attacks show that these systems
tions are currently exploring the use of Verified Key Directo-            would benefit from theoretically well-founded designs. Ven-
ries (VKDs) to overcome this problem. While VKDs would                    dors need to update their products to use modern crypto-
not prevent a malicious server from associating the wrong                 graphic primitives and best practices – but to ensure solid
public key with a user, they make this kind of tampering evi-             foundations, novel definitions to capture security in this set-
dent, so that users are alerted when their providers misbehave.           ting are also needed. Furthermore, the common issues with
   Authenticating public keys is only half the battle. It seems           features such as key escrow, item-level vault encryption, pass-
to be a common misunderstanding both here and for E2EE                    word sharing, and backward compatibility represent interest-
cloud storage [7, 50] that public key encryption (PKE) some-              ing questions for the academic community on how to achieve
how produces authenticated ciphertexts. In fact, no PKE                   security while still providing these functionalities.
scheme can offer data origin authentication (because, by def-                Working together with vendors to fix the vulnerabilities,
inition, any party can encrypt). This is why we suggest the               our research has contributed to improved security in practice
usage of primitives like signcryption [82] to correctly bind              for millions of affected users. It has also increased the vendor-
ciphertexts to their senders.                                             driven interest in formal guarantees of security. We hope that
                                                                          this work serves to help raise the relevant industry sector’s
Securing a “backdoor”. Password managers attempt to
                                                                          knowledge about encryption further above zero. At the same
implement mechanisms for recovery of the vault content in
                                                                          time, we hope our work spurs the academic community to
the case the user forgets their master password. There is a
                                                                          further research in this area – as well as to consider what
clear tension here between security and usability: not hav-
                                                                          more it can do to convert its research artefacts into meaningful
ing any recovery mechanism provides for the best possible
                                                                          impacts on industrial practice.
security, but might be untenable for large populations of non-
technical users. Admin-assisted recovery can be implemented
safely, but success hinges on the key authentication problem              References
discussed above being solved first. Again, we can look at
the secure messaging space for state-of-the-art solutions to               [1] 1Password. 1Password Surpasses $400M ARR and
this problem: messengers like Signal and WhatsApp [30, 36]                     Expands Executive Team to Advance the Next Era in
are converging to the usage of hardware security modules                       Identity Security. https://1password.com/press/
(HSMs) in the cloud for protecting account recovery and                        2025/nov/1password-strengthens-leadership-
backups. Similarly, Apple’s Advanced Data Protection uses                      amid-growth-milestone. Accessed: 2026-01-09.
HSMs to allow users to recover their key material from just
their PIN [12].                                                            [2] 1Password.    1Password Whitepaper.    https:
   Implementing part of the Key Escrow functionality on an                     //1passwordstatic.com/files/security/
HSM can offer at least some form of guarantee that the server                  1password-white-paper.pdf. Accessed: 2025-03-
is behaving honestly. Hybrid solutions could include using the                 25.
HSMs to distribute the keys of the admin, without having to
rely on other forms of PKI or out-of-band verification. This is            [3] 1Password. Linking other devices. 1Password Security
an interesting future direction in the context of formal security              Design White Paper, https://agilebits.github.


                                                                     23
     io/security-design/passkeySSO.html#linking-                        icloud-sec973254c5f/web, September 2024.              Ac-
     other-devices. Accessed: 2026-06-05.                               cessed: 2025-08-25.

 [4] 1Password.         Zero-Knowledge Encryption.                 [13] Gildas Avoine, Xavier Carpent, and Diane Leblanc-
     https://1password.com/features/zero-                               Albarel. In the vault, but not safe: Exploring the threat
     knowledge-encryption. Accessed: 2026-06-05.                        of covert password manager providers. Cryptology
                                                                        ePrint Archive, Report 2025/1278, 2025.
 [5] Harold Abelson, Ross J. Anderson, Steven M. Bellovin,
     Josh Benaloh, Matt Blaze, Whitfield Diffie, John              [14] Kasey Babcock.    Security Through Transparency:
     Gilmore, Matthew Green, Susan Landau, Peter G. Neu-                ETH Zurich Audits Bitwarden Cryptography.
     mann, Ronald L. Rivest, Jeffrey I. Schiller, Bruce                 https://bitwarden.com/blog/security-through-
     Schneier, Michael A. Specter, and Daniel J. Weitzner.              transparency-eth-zurich-audits-bitwarden-
     Keys under doormats. Commun. ACM, 58(10):24–26,                    cryptography/, 2026. Accessed: 2026-07-08.
     2015.
                                                                   [15] Matilda Backendal, Hannah Davis, Felix Günther, Miro
 [6] David Adrian, Karthikeyan Bhargavan, Zakir Du-                     Haller, and Kenneth G. Paterson. A formal treatment of
     rumeric, Pierrick Gaudry, Matthew Green, J. Alex Hal-              end-to-end encrypted cloud storage. In Leonid Reyzin
     derman, Nadia Heninger, Drew Springall, Emmanuel                   and Douglas Stebila, editors, CRYPTO 2024, Part II,
     Thomé, Luke Valenta, Benjamin VanderSloot, Eric Wus-               volume 14921 of LNCS, pages 40–74. Springer, Cham,
     trow, Santiago Zanella-Béguelin, and Paul Zimmermann.              August 2024.
     Imperfect forward secrecy: How Diffie-Hellman fails in
     practice. In Indrajit Ray, Ninghui Li, and Christopher        [16] Matilda Backendal, Miro Haller, and Kenneth G. Pa-
     Kruegel, editors, ACM CCS 2015, pages 5–17. ACM                    terson. MEGA: Malleable encryption goes awry. In
     Press, October 2015.                                               2023 IEEE Symposium on Security and Privacy, pages
                                                                        146–163. IEEE Computer Society Press, May 2023.
 [7] Martin R. Albrecht, Matilda Backendal, Daniele Cop-
     pola, and Kenneth G. Paterson. Share with care: Break-        [17] A. Belenko and D Sklyarov. “Secure password man-
     ing E2EE in Nextcloud. In 2024 IEEE European Sym-                  agers” and “military-grade encryption” on smartphones:
     posium on Security and Privacy, pages 828–840. IEEE                Oh, really? Technical report, Elcomsoft Co. Ltd., 2012.
     Computer Society Press, July 2024.
                                                                   [18] Benjamin Beurdouche, Karthikeyan Bhargavan, An-
 [8] Martin R. Albrecht, Miro Haller, Lenka Mareková,                   toine Delignat-Lavaud, Cédric Fournet, Markulf
     and Kenneth G. Paterson. Caveat implementor! Key                   Kohlweiss, Alfredo Pironti, Pierre-Yves Strub, and
     recovery attacks on MEGA. In Carmit Hazay and Mar-                 Jean Karim Zinzindohoue. A messy state of the union:
     tijn Stam, editors, EUROCRYPT 2023, Part V, volume                 Taming the composite state machines of TLS. In 2015
     14008 of LNCS, pages 190–218. Springer, Cham, April                IEEE Symposium on Security and Privacy, pages 535–
     2023.                                                              552. IEEE Computer Society Press, May 2015.
 [9] Martin R. Albrecht and Kenneth G. Paterson. Analyz-
                                                                   [19] Karthikeyan Bhargavan, Antoine Delignat-Lavaud, Cé-
     ing cryptography in the wild: A retrospective. IEEE
                                                                        dric Fournet, Alfredo Pironti, and Pierre-Yves Strub.
     Secur. Priv., 22(6):12–18, 2024.
                                                                        Triple handshakes and cookie cutters: Breaking and fix-
[10] Nadhem J. AlFardan, Daniel J. Bernstein, Kenneth G.                ing authentication over TLS. In 2014 IEEE Symposium
     Paterson, Bertram Poettering, and Jacob C. N. Schuldt.             on Security and Privacy, pages 98–113. IEEE Computer
     On the security of RC4 in TLS. In Samuel T. King, edi-             Society Press, May 2014.
     tor, USENIX Security 2013, pages 305–320. USENIX
     Association, August 2013.                                     [20] Karthikeyan Bhargavan and Gaëtan Leurent. On the
                                                                        practical (in-)security of 64-bit block ciphers: Collision
[11] Nadhem J. AlFardan and Kenneth G. Paterson. Lucky                  attacks on HTTP over TLS and OpenVPN. In Edgar R.
     thirteen: Breaking the TLS and DTLS record proto-                  Weippl, Stefan Katzenbeisser, Christopher Kruegel, An-
     cols. In 2013 IEEE Symposium on Security and Privacy,              drew C. Myers, and Shai Halevi, editors, ACM CCS
     pages 526–540. IEEE Computer Society Press, May                    2016, pages 456–467. ACM Press, October 2016.
     2013.
                                                                   [21] Karthikeyan Bhargavan and Gaëtan Leurent. Transcript
[12] Apple Support.    Advanced Data Protection for                     collision attacks: Breaking authentication in TLS, IKE
     iCloud.     https://support.apple.com/guide/                       and SSH. In NDSS 2016. The Internet Society, February
     security/advanced-data-protection-for-                             2016.


                                                              24
[22] Bitwarden.   Bitwarden: About Us.     https://                   [31] Dashlane. 2023 Report - Password Health Scores
     bitwarden.com/about/. Accessed: 2025-08-26.                           Around the World. https://www.dashlane.com/up-
                                                                           loads/2023/10/2023-Global-Password-Health-
[23] Bitwarden. Bitwarden Clients Source Code. https:                      Score-Report-1.pdf. Accessed: 2025-08-26.
     //github.com/bitwarden/clients. Accessed: 2025-
     03-25.                                                           [32] Dashlane. Dashlane Android Client Source Code.
                                                                           https://github.com/Dashlane/android-apps. Ac-
[24] Bitwarden.     How End-to-End Encryption Paves                        cessed: 2025-03-25.
     the Way for Zero Knowledge - White Paper.
                                                                      [33] Dashlane. Dashlane Browser Extension Client Source
     https://bitwarden.com/pdf/resources-zero-
                                                                           Code. https://github.com/Dashlane/dashlane-
     knowledge-encryption-white-paper.pdf, 2025.
                                                                           web-extension. Accessed: 2025-03-25.
     Accessed: 2025-03-25.
                                                                      [34] Dashlane. Dashlane CLI Client Source Code. https:
[25] Lara Bruseghini, Daniel Huigens, and Kenneth G. Pa-                   //github.com/Dashlane/dashlane-cli. Accessed:
     terson. Victory by KO: Attacking OpenPGP using key                    2025-03-25.
     overwriting. In Heng Yin, Angelos Stavrou, Cas Cre-
     mers, and Elaine Shi, editors, ACM CCS 2022, pages               [35] Dashlane.     Dashlane’s Security Principles & Ar-
     411–423. ACM Press, November 2022.                                    chitecture. https://www.dashlane.com/download/
                                                                           whitepaper-en.pdf. Accessed: 2025-03-25.
[26] Michael Carr and Siamak F. Shahandashti. Revis-
     iting security vulnerabilities in commercial password            [36] Gareth T. Davies, Sebastian H. Faller, Kai Gellert,
     managers. In Marko Hölbl, Kai Rannenberg, and Tat-                    Tobias Handirk, Julia Hesse, Máté Horváth, and Tibor
     jana Welzer, editors, ICT Systems Security and Privacy                Jager. Security analysis of the WhatsApp end-to-end
     Protection - 35th IFIP TC 11 International Conference,                encrypted backup protocol. In Helena Handschuh and
     SEC 2020, Maribor, Slovenia, September 21-23, 2020,                   Anna Lysyanskaya, editors, CRYPTO 2023, Part IV, vol-
     Proceedings, volume 580 of IFIP Advances in Informa-                  ume 14084 of LNCS, pages 330–361. Springer, Cham,
     tion and Communication Technology, pages 265–279.                     August 2023.
     Springer, 2020.                                                  [37] Rose de Fremery. How Zero Knowledge Keeps Pass-
                                                                           words Safe. LastPass Blog, 2023.
[27] Sunil Chaudhary, Tiina Schafeitel-Tähtinen, Marko He-
     lenius, and Eleni Berki. Usability, security and trust in        [38] Jacob DePriest and Andrew Hall. Zero knowledge
     password managers: A quest for user-centric properties                vs. a malicious server: A look at ETH Zurich’s re-
     and features. Comput. Sci. Rev., 33:69–90, 2019.                      search. https://1password.com/blog/eth-zurich-
                                                                           zero-knowledge-malicious-server-review, 2026.
[28] Stephen Checkoway, Jacob Maskiewicz, Christina Gar-                   Accessed: 2026-07-08.
     man, Joshua Fried, Shaanan Cohney, Matthew Green,
     Nadia Heninger, Ralf-Philipp Weinmann, Eric Rescorla,            [39] Whitfield Diffie and Martin E. Hellman. New directions
     and Hovav Shacham. A systematic analysis of the ju-                   in cryptography. IEEE Transactions on Information
     niper dual EC incident. In Edgar R. Weippl, Stefan                    Theory, 22(6):644–654, 1976.
     Katzenbeisser, Christopher Kruegel, Andrew C. My-
                                                                      [40] Yihe Duan, Ding Wang, and Yanduo Fu. Security
     ers, and Shai Halevi, editors, ACM CCS 2016, pages
                                                                           analysis of master-password-protected password man-
     468–479. ACM Press, October 2016.
                                                                           agement protocols. In Marina Blanton, William Enck,
                                                                           and Cristina Nita-Rotaru, editors, 2025 IEEE Sympo-
[29] Sonia Chiasson, P. C. van Oorschot, and Robert Biddle.
                                                                           sium on Security and Privacy, pages 701–719. IEEE
     A usability study and critique of two password managers.
                                                                           Computer Society Press, May 2025.
     In Proceedings of the 15th Conference on USENIX Se-
     curity Symposium - Volume 15, USENIX-SS’06, USA,                 [41] Thai Duong and Juliano Rizzo. Cryptography in the
     2006. USENIX Association.                                             web: The case of cryptographic design flaws in asp.net.
                                                                           In 2011 IEEE Symposium on Security and Privacy,
[30] Graeme Connell, Vivian Fang, Rolfe Schmidt, Emma                      pages 481–489. IEEE Computer Society Press, May
     Dauterman, and Raluca Ada Popa. Secret key recovery                   2011.
     in a Global-Scale End-to-End encryption system. In
     18th USENIX Symposium on Operating Systems Design                [42] ENISA. Coordinated vulnerability disclosure policies
     and Implementation (OSDI 24), pages 703–719, Santa                    in the EU. Technical report, European Union Agency
     Clara, CA, July 2024. USENIX Association.                             for Cybersecurity (ENISA), April 2022.


                                                                 25
[43] Andrés Fábrega, Armin Namavari, Rachit Agarwal, Ben            [52] IEEE. IEEE Standard Specification for Password-
     Nassi, and Thomas Ristenpart. Exploiting leakage in                 Based Public-Key Cryptographic Techniques. Techni-
     password managers via injection attacks. In Davide                  cal Report IEEE Std 1363.2-2008, IEEE, January 2009.
     Balzarotti and Wenyuan Xu, editors, USENIX Security                 DLAPKAS-SRP6.
     2024. USENIX Association, August 2024.
                                                                    [53] Microsoft Threat Intelligence.  Frozen in transit:
[44] Michael Fagan, Yusuf Albayram, Mohammad                             Secret blizzard’s aitm campaign against diplomats.
     Maifi Hasan Khan, and Ross Buck. An investigation                   https://www.microsoft.com/en-us/security/
     into users’ considerations towards using password                   blog/2025/07/31/frozen-in-transit-secret-
     managers. Hum. centric Comput. Inf. Sci., 7:12, 2017.               blizzards-aitm-campaign-against-diplomats/,
                                                                         2025.
[45] Sascha Fahl, Marian Harbach, Marten Oltrogge,                  [54] Tibor Jager, Kenneth G. Paterson, and Juraj So-
     Thomas Muders, and Matthew Smith. Hey, you, get off                 morovsky. One bad apple: Backwards compatibility
     of my clipboard - on how usability trumps security in               attacks on state-of-the-art cryptography. In NDSS 2013.
     android password managers. In Ahmad-Reza Sadeghi,                   The Internet Society, February 2013.
     editor, FC 2013, volume 7859 of LNCS, pages 144–161.
     Springer, Berlin, Heidelberg, April 2013.                      [55] Ambarish Karole, Nitesh Saxena, and Nicolas Christin.
                                                                         A comparative usability evaluation of traditional pass-
[46] Christina Garman, Kenneth G. Paterson, and Thyla                    word managers. In Kyung Hyune Rhee and DaeHun
     van der Merwe. Attacks only get better: Password re-                Nyang, editors, Information Security and Cryptology
     covery attacks against RC4 in TLS. In Jaeyeon Jung and              - ICISC 2010 - 13th International Conference, Seoul,
     Thorsten Holz, editors, USENIX Security 2015, pages                 Korea, December 1-3, 2010, Revised Selected Papers,
     113–128. USENIX Association, August 2015.                           volume 6829 of Lecture Notes in Computer Science,
                                                                         pages 233–251. Springer, 2010.
[47] Paolo Gasti and Kasper Bonne Rasmussen. On the                 [56] Brian Krebs. Password manager LastPass warns of
     security of password manager database formats. In                   breach. Krebs on Security, June 2015. Accessed:
     Sara Foresti, Moti Yung, and Fabio Martinelli, editors,             2025-08-25.
     ESORICS 2012, volume 7459 of LNCS, pages 770–787.
     Springer, Berlin, Heidelberg, September 2012.                  [57] LastPass. LastPass Business. https://www.lastpass.
                                                                         com/products/team-password-manager. Accessed:
[48] Jessica Gentles, Mason Fields, and Garrett Goodman                  2025-03-25.
     annd Suman Bhunia. Breaking the Vault: A Case Study
     of the 2022 LastPass Data Breach. http://www.arxiv.            [58] LastPass. LastPass CLI Client Source Code. https:
     org/pdf/2502.04287. Accessed: 2025-03-25.                           //github.com/lastpass/lastpass-cli. Accessed:
                                                                         2025-03-25.
[49] Nadia Heninger and Keegan Ryan. The hidden number              [59] LastPass.     LastPass Whitepaper.     https:
     problem with small unknown multipliers: Cryptanalyz-                //support.lastpass.com/s/document-item?
     ing MEGA in six queries and other applications. In                  language=en_US&bundleId=lastpass&topicId=
     Alexandra Boldyreva and Vladimir Kolesnikov, editors,               LastPass/lastpass_technical_whitepaper.
     PKC 2023, Part I, volume 13940 of LNCS, pages 147–                  html&_LANG=enus. Accessed: 2025-03-25.
     176. Springer, Cham, May 2023.
                                                                    [60] LastPass. Knowledge workers have a false sense of
[50] Jonas Hofmann and Kien Tuong Truong. End-to-end en-                 password security. https://www.lastpass.com/-
     crypted cloud storage in the wild: A broken ecosystem.              /media/7e2b8b715dc44d23ae21c5cf94dc4876.pdf,
     In Bo Luo, Xiaojing Liao, Jun Xu, Engin Kirda, and                  2025. LastPass Business Report; Accessed: August 25,
     David Lie, editors, ACM CCS 2024, pages 3988–4001.                  2025.
     ACM Press, October 2024.                                       [61] Sean Lawlor and Kevin Lewi.      Deploying key
                                                                         transparency at WhatsApp. https://engineering.
[51] Nicolas Huaman, Sabrina Amft, Marten Oltrogge,                      fb.com/2023/04/13/security/whatsapp-key-
     Yasemin Acar, and Sascha Fahl. They would do better                 transparency/, 2023.
     if they worked together: The case of interaction prob-
     lems between password managers and websites. In                [62] Zhiwei Li, Warren He, Devdatta Akhawe, and Dawn
     2021 IEEE Symposium on Security and Privacy, pages                  Song. The emperor’s new password manager: Security
     1367–1381. IEEE Computer Society Press, May 2021.                   analysis of web-based password managers. In Kevin


                                                               26
     Fu and Jaeyeon Jung, editors, USENIX Security 2014,             [70] Hirak Ray, Flynn Wolf, Ravi Kuber, and Adam J. Aviv.
     pages 465–479. USENIX Association, August 2014.                      Why older adults (don’t) use password managers. In
                                                                          Michael Bailey and Rachel Greenstadt, editors, USENIX
[63] Peter Mayer, Collins W. Munyendo, Michelle L.                        Security 2021, pages 73–90. USENIX Association, Au-
     Mazurek, and Adam J. Aviv. Why users (don’t) use                     gust 2021.
     password managers at a large educational institution. In
     Kevin R. B. Butler and Kurt Thomas, editors, USENIX             [71] Real World Cryptography Symposium. RWC 2026
     Security 2022, pages 1849–1866. USENIX Association,                  Accepted Talks.     https://rwc.iacr.org/2026/
     August 2022.                                                         acceptedtalks.php, 2026. Accessed: 2026-07-08.

[64] Daniel McCarney, David Barrera, Jeremy Clark, Sonia             [72] Frederic Rivain. Testing Zero Knowledge Against a Ma-
     Chiasson, and Paul C. van Oorschot. Tapas: design,                   licious Server. https://www.dashlane.com/blog/
     implementation, and usability evaluation of a password               zero-knowledge-malicious-server, 2026.            Ac-
     manager. In Proceedings of the 28th Annual Computer                  cessed: 2026-07-08.
     Security Applications Conference, ACSAC ’12, page
     89–98, New York, NY, USA, 2012. Association for                 [73] Glenn Greenwald Ryan Gallagher. How the NSA
     Computing Machinery.                                                 plans to infect ‘millions’ of computers with malware.
                                                                          https://theintercept.com/2014/03/12/nsa-
[65] NordPass.         People have around 170 pass-                       plans-infect-millions-computers-malware/,
     words on average, study shows.           https:                      2014.
     //www.globenewswire.com/news-release/2024/
     05/21/2885556/0/en/People-have-around-170-                      [74] Matteo Scarlata, Matilda Backendal, and Miro Haller.
     passwords-on-average-study-shows.html, May                           MFKDF: Multiple factors knocked down flat. In Davide
     2024. Press Release, Commissioned by NordPass,                       Balzarotti and Wenyuan Xu, editors, USENIX Security
     Conducted by Cint. Accessed: 2025-08-25.                             2024. USENIX Association, August 2024.

[66] Sean Oesch and Scott Ruoti. That was then, this is now:         [75] Security.org Team.       Password Manager Annual
     A security evaluation of password generation, storage,               Report.        https://www.security.org/digital-
     and autofill in browser-based password managers. In                  safety/password-manager-annual-report/, 2024.
     Srdjan Capkun and Franziska Roesner, editors, USENIX                 Also titled: Password Manager Industry Report and Mar-
     Security 2020, pages 2165–2182. USENIX Association,                  ket Outlook (2023-2024). Accessed: 2024-11-14.
     August 2020.                                                    [76] David Silver, Suman Jana, Dan Boneh, Eric Yawei
[67] Sean Oesch, Scott Ruoti, James Simmons, and Anuj                     Chen, and Collin Jackson. Password managers: At-
     Gautam. “It Basically Started Using Me:" An Observa-                 tacks and defenses. In Kevin Fu and Jaeyeon Jung, edi-
     tional Study of Password Manager Usage. In Simone                    tors, USENIX Security 2014, pages 449–464. USENIX
     D. J. Barbosa, Cliff Lampe, Caroline Appert, David A.                Association, August 2014.
     Shamma, Steven Mark Drucker, Julie R. Williamson,               [77] Ben Stock and Martin Johns. Protecting users against
     and Koji Yatani, editors, CHI ’22: CHI Conference on                 XSS-based password manager abuse. In Shiho Moriai,
     Human Factors in Computing Systems, New Orleans,                     Trent Jaeger, and Kouichi Sakurai, editors, ASIACCS 14,
     LA, USA, 29 April 2022 - 5 May 2022, pages 33:1–33:23.               pages 183–194. ACM Press, June 2014.
     ACM, 2022.
                                                                     [78] Karim Toubba. Security incident update and recom-
[68] Sarah Pearman, Shikun Aerin Zhang, Lujo Bauer, Nico-                 mended actions, 2023.
     las Christin, and Lorrie Faith Cranor. Why people
     (don’t) use password managers effectively. In Fifteenth         [79] Mathy Vanhoef and Frank Piessens. All your biases
     Symposium on Usable Privacy and Security (SOUPS                      belong to us: Breaking RC4 in WPA-TKIP and TLS.
     2019), pages 319–338, Santa Clara, CA, August 2019.                  In Jaeyeon Jung and Thorsten Holz, editors, USENIX
     USENIX Association.                                                  Security 2015, pages 97–112. USENIX Association,
                                                                          August 2015.
[69] Jason Rasmussen.   Details on Hardening in Re-
     sponse to ETH Zurich Reported Security Issues.                  [80] Serge Vaudenay. Security flaws induced by CBC
     https://blog.lastpass.com/posts/details-                             padding - applications to SSL, IPSEC, WTLS... In
     on-hardening-in-response-to-eth-zurich-                              Lars R. Knudsen, editor, EUROCRYPT 2002, volume
     reported-security-issues, 2026.      Accessed:                       2332 of LNCS, pages 534–546. Springer, Berlin, Hei-
     2026-07-08.                                                          delberg, April / May 2002.


                                                                27
[81] Rui Zhao, Chuan Yue, and Kun Sun.         A secu-                     We disclosed to Bitwarden on 27.01.2025, to LastPass on
     rity analysis of two commercial browser and cloud                  04.06.2025, to Dashlane on 29.08.2025 and to 1Password on
     based password managers. In International Confer-                  21.11.2025. We had a video-conference and numerous email
     ence on Social Computing, SocialCom 2013, Social-                  exchanges with Bitwarden. At the time of writing, they are
     Com/PASSAT/BigData/EconCom/BioMedCom 2013,                         well advanced in deploying mitigations for our attacks: BW01,
     Washington, DC, USA, 8-14 September, 2013, pages                   BW03, BW11, BW12 were addressed, the minimum KDF
     448–453. IEEE Computer Society, 2013.                              iteration count for BW07 is now 5000, and their roadmap in-
                                                                        cludes completely removing CBC-only encryption, enforcing
[82] Yuliang Zheng.        Digital signcryption or how to               per-item keys and changing the vault format for integrity. On
     achieve cost(signature & encryption) ≪ cost(signature)             22.12.25 they shared with us a draft for a signed organisation
     + cost(encryption). In Burton S. Kaliski, Jr., editor,             membership scheme, which would resolve BW08 and BW09.
     CRYPTO’97, volume 1294 of LNCS, pages 165–179.                     In the case of LastPass, our initial contact via the official
     Springer, Berlin, Heidelberg, August 1997.                         email channel on 04.06.2025 did not receive a response. One
                                                                        of us reached out to the CTO over social media, after which
                                                                        our original email was found in the organisation’s spam filter
A    Ethical Considerations                                             on 26.06.2025. We mutually agreed with LastPass to reset
                                                                        the 90-day clock. They provided us with regular updates and
Our work concerns the security analysis of four products                we also met for a video-conference to clarify our findings and
claimed to have tens of millions of users in a threat model             discuss their mitigation plans. They accepted our request to
that we have argued as being worthy of serious consideration.           work with them directly rather than with their preferred bug
Our analysis has shown these products to be badly broken                bounty program because the latter would impose publication
in our chosen model. This situation certainly calls for a de-           restrictions that were not acceptable to us; on 7.10.25 they
tailed statement concerning possible harms arising from our             awarded us two bug bounty payments. At the time of writ-
research, how these are mitigated in our approach, and the              ing, LP03 has been addressed. Our initial email to Dashlane
extent to which they are balanced by other outcomes. We                 was also lost, but our second attempt at contacting them on
formulate this in terms of a stakeholder-based analysis. We             05.09.2025 was successful. Since then, we worked with their
take a consequentialist viewpoint to conduct our analysis.              engineers to replicate our attacks, and had several discussions
   The main stakeholders related to our work, as we see them,           over email as well as one video-conferencing call. At the time
are: us, the researchers; the vendors of the affected products          of writing, DL03, DL04, DL05 and DL06 have been miti-
(Bitwarden, Dashlane, LastPass, 1Password); vendors of re-              gated by disallowing CBC-only mode in Flexible payloads;
lated products; customers using the affected products (both             no remediation is planned for DL01 and DL02. 1Password
individuals and organisations); society at large.                       did not request an embargo period, and commented that our
   We eschew further discussion of ourselves as stakeholders,           attacks 1P04, 1P06 arise from already known architectural
since we cannot readily set aside our own feelings on the               limitations. They remain unfixed. Our other attacks on 1Pass-
matter to provide a rational analysis of how we might be                word were discovered after this first disclosure period, but
affected by the publication (or otherwise) of our work.                 since they are similar in spirit to our original attacks, we
   Concerning the vendors of the affected products: they may            elected not to start a second disclosure phase. All of the ven-
suffer reputation and thence commercial damage as a result              dors have publicly acknowledged our analysis and published
of our work being published. For example, it has been re-               responses [14, 38, 69, 72].
ported that LastPass has lost many customers due to repeated               Upon agreement with all involved vendors, we shared a
breaches [48, 75]. This potential damage is mitigated in our            preprint of our research paper with them in a joint thread,
approach by providing the affected vendors with a 90-day dis-           allowing them to also discuss the findings and take-aways
closure window during which we did not talk in public about             among themselves. We also coordinated with them on holding
the research. During this window, we supported the vendors,             back on public statements concerning the vulnerabilities until
initially with very detailed descriptions of the security issues        the mutually agreed date of 16.02.2026, significantly later
we have found, then repeatedly offering support to address the          than the end of any of the 90-day disclosure periods.
issues (video-conferences, review of patches). We believed                 Concerning vendors of related products: there is a clear
that 90 days should be sufficient time to address the identified        risk that the issues we have found in the four vendors we have
issues, but we always remained open to extending this time              studied may extend to other vendors, either mutatis mutandis
period upon request, and actually did so for one vendor. We             or with more substantial yet simple changes. In mitigation to
consider this approach to be relatively standard for the field          the possible harms, we are aware that there is an informal in-
of software vulnerability disclosure, except perhaps for the            dustry forum where our work was already discussed as a result
level of our engagement in the triage process. For example, it          of the disclosure to Bitwarden. While this formally broke any
is endorsed by ENISA, an EU body [42].                                  agreement concerning coordinated disclosure (and arguably


                                                                   28
relieved us of the burden to maintain confidentiality), we also          decision to proceed with the research and to publish it.
found it understandable and saw it as having a positive effect
in alerting other vendors to the possibility of problems in their
                                                                         B    Open Science
products. Vendors who have a mature security mindset could
already start to analyse their own systems. We publicised our            Our artefacts consist of proof-of-concept code for all the at-
work widely after the end of the disclosure periods, includ-             tacks in this paper, with the exceptions noted. While some
ing by sharing it (by request from Dashlane) with a group of             of the attacks are in the process of being mitigated, others
CTOs of other password managers on the market, preparing                 remain exploitable due to the need for longer-term mitiga-
conference presentations for USENIX Security and the Real                tions (e.g. public key authentication). Due to the sensitiv-
World Cryptography Symposium [71], publishing a website                  ity of the PoCs, we came to the decision that we should
(webro.ke/passwordmanagers).                                             also not make these PoCs generally available before all
   We turn now to customers of this collection of vendors.               of the agreed embargo periods were complete. However,
Here, it is useful to differentiate between two deployment               we made all the artefacts available to our reviewers in the
models for the password managers. Among the products we                  USENIX Security ’26 artefact evaluation committee. At
study, LastPass, Dashlane and 1Password only offer cloud-                the time of writing, all the 90-day disclosure periods have
based services on their own, centralized servers. Bitwarden,             ended, and we are past the common public disclosure date
on the other hand, is offered both as a cloud-based solution             on 16.02.2026. PoCs for mitigated attacks are being made
and as a self-hosted, on-premises application. In the first              available on an ongoing basis, at the following location:
case, although we consider the malicious threat model to be              https://doi.org/10.5281/zenodo.17977565.
realistic, we also consider that the majority of users would
not be targeted by attacks of the type we have presented be-
cause of the stringent conditions needed to mount them. The
dense concentration of sensitive data, however, makes the
centralized servers a high-value target for attackers. Higher
risk individuals and organisations could also be at substantial
risk of harm. In the case of a self-hosted Bitwarden instance,
the applicability of the attacks varies greatly depending on
who hosts the application, and how much trust is placed in
the host. These deployments are decentralized: the threat
modelling should consider the trust in the administrators, the
active maintenance of the hosting software stack, and the
physical security of the servers themselves. A compromise
in any of these areas makes our attacks realistic to carry out,
and hard to detect at scale. Unfortunately, we cannot ex-
clude the possibility that our attacks were already known
to advanced threat actors – after all, we have learned from
the Snowden revelations that national security agencies are
routinely tasked with penetrating systems like the ones we
analyse and are willing to conduct active attacks on targets.
The best mitigation for these parties is to trust that vendors
will rapidly and effectively patch their systems, and here we
have made real effort to engage with the affected vendors to
assist them in this process.
   Finally, we see society at large as benefitting from our
work, in that our work should help to raise the security bar
for password managers, pushing their vendors to either im-
prove security or make clearer statements about what security
their systems actually provide, so that customers can judge
(perhaps with the help of expert guides) whether the products
meet their requirements or not. In the longer term, we see
our work as contributing to reducing the possible harms from
using password managers by making them more secure.
   Given the overall balance of benefits versus harms, and
the extensive mitigations to limit those harms, we took the


                                                                    29
