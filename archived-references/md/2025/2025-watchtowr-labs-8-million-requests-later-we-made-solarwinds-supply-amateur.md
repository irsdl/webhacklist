---
type: Article
title: 8 Million Requests Later, We Made The SolarWinds Supply Chain Attack Look Amateur
description: About 150 abandoned Amazon S3 buckets, still referenced by software, documentation and deployment pipelines, were re-registered and logged over 8 million requests in two months from government, military and Fortune 500 networks. Whoever holds such a bucket can answer with malicious updates, deployment templates, VM images or unsigned binaries.
resource: "https://labs.watchtowr.com/8-million-requests-later-we-made-the-solarwinds-supply-chain-attack-look-amateur/"
tags: [article, webseclist-reference, en, watchtowr, supply-chain, aws, ci-cd, rce, large-scale-scan, measurement-study, tooling, owasp-a06-2021, owasp-a08-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-12T15:09:31+00:00"
status: stable
stale_after: 2027-08-12
sources:
  - id: original
    resource: "https://labs.watchtowr.com/8-million-requests-later-we-made-the-solarwinds-supply-chain-attack-look-amateur/"
    title: 8 Million Requests Later, We Made The SolarWinds Supply Chain Attack Look Amateur
    author: Benjamin Harris, Aliz Hammond, Pinaki Mondal
    last_modified: 2025-02-04
also_at: []
authors:
  - Benjamin Harris
  - Aliz Hammond
  - Pinaki Mondal
canonical_url: ""
cited_by:
  - "2025.md:98"
commit: ""
content_sha256: 6c945c43d5f9cc165fe6034ad41842b9dd72a44ac4e6772d37a0c8915a493e5d
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://labs.watchtowr.com/8-million-requests-later-we-made-the-solarwinds-supply-chain-attack-look-amateur/"
published: 2025-02-04
publisher: watchTowr
publisher_english: ""
raw_sha256: dded3eb11331be0601d9ad50f5be2e0f103e40c319da4ad17406899b7d9e00a9
retrieved_from: "https://labs.watchtowr.com/8-million-requests-later-we-made-the-solarwinds-supply-chain-attack-look-amateur/"
retrieved_kind: stored
retrieved_utc: "2026-08-12T15:09:31+00:00"
slug: 2025-watchtowr-labs-8-million-requests-later-we-made-solarwinds-supply-amateur
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# 8 Million Requests Later, We Made The SolarWinds Supply Chain Attack Look Amateur

**8 Million Requests Later, We Made The SolarWinds Supply Chain Attack Look Amateur** - Benjamin Harris, Aliz Hammond, Pinaki Mondal, watchTowr.

- Published: 2025-02-04
- Original: <https://labs.watchtowr.com/8-million-requests-later-we-made-the-solarwinds-supply-chain-attack-look-amateur/>
- Preserved from: https://labs.watchtowr.com/8-million-requests-later-we-made-the-solarwinds-supply-chain-attack-look-amateur/ (stored) on 2026-08-12
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Surprise surprise, we've done it again. We've demonstrated an ability to compromise significantly sensitive networks, including governments, militaries, space agencies, cyber security companies, supply chains, software development systems and environments, and more.

“Ugh, won’t they just stick to creating poor-quality memes?” we hear you moan. Maybe we should, maybe we shouldn’t - regardless, it’s too late at this stage and so we have to live with it.

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-7.png)

From those of you who enjoy our research, to the PSIRT and CERT teams who dread an email originating from `@watchTowr.com`, you are likely aware that we’ve historically delivered research that shone a spotlight on the security impact of abandoned infrastructure in various forms:

- [Obtaining the ability to issue valid TLS/SSL certificates for any .MOBI domain (via abandoned domains used for WHOIS servers)](https://labs.watchtowr.com/we-spent-20-to-achieve-rce-and-accidentally-became-the-admins-of-mobi/)
- [Hijacking backdoors in backdoors to compromise government networks (by registering domains for backdoors, within widely used backdoors)](https://labs.watchtowr.com/more-governments-backdoors-in-your-backdoors/)

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-40.png)

Apparently, though, this wasn’t enough to satisfy us that we’d demonstrated just how held-together-by-string the Internet is and at the same time point out the reality that we as an industry seem so excited to demonstrate skills that would allow us to defend civilization from a Neo-from-the-Matrix-tier attacker - while a metaphorical drooling-kid-with-a-fork-tier attacker, in reality, has the power to undermine the world.

Therefore, almost without choice - once again, we’re excited to share our research with everyone and be somewhat depressed by the results - misery loves company, and a problem shared is a problem halved (thank you).

Arguably armed still with a somewhat inhibited ability to perceive risk and seemingly no fear, in November 2024, we decided to prove out the scenario of a significant Internet-wide supply chain attack caused by abandoned infrastructure. This time however, we dropped our obsession with expired domains, and instead shifted our focus to Amazon’s S3 buckets.

It’s important to note that although we focused on Amazon’s S3 for this endeavour, this research challenge, approach and theme is cloud-provider agnostic and applicable to any managed storage solution. Amazon’s S3 just happened to be the first storage solution we thought of, and we're **certain** this same challenge would apply to any customer/organization usage of any storage solution provided by any cloud provider.

The TL;DR is that this time, we ended up discovering ~150 Amazon S3 buckets that had previously been used across commercial and open source software products, governments, and infrastructure deployment/update pipelines - and then abandoned.

Naturally, we registered them, just to see what would happen - “how many people are *really* trying to request software updates from S3 buckets that appear to have been abandoned months or even years ago?”, we naively thought to ourselves.

As always, what we didn’t anticipate was how this would turn out (you could argue that we regularly seem to underestimate what is about to happen).

Before you ask, for many reasons, after this research is published we’re resolutely vowing not to touch the subject of abandoned infrastructure again (publicly). We’ve beaten this proverbial horse to death in three different ways, and frankly we don’t want to completely lose faith in the Internet.

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-9.png)

As for the research itself, it panned out progressively, with S3 buckets registered as they were discovered. It went rather quickly from “Haha, we could put our logo on this website” to “Uhhh, `.mil`, we should probably speak to someone”.

$400+ USD later (we’ve included S3, CloudTrail, and CloudWatch - because we relentlessly queried the logs), we had some results worth talking about.

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-10.png)

*(You can clearly see when we discovered the ‘Run Query’ button in CloudWatch in December 2024, mashing it to the point that we almost spent $8 USD)*

When creating these S3 buckets, we enabled logging - allowing us to track:

- Who requested files from each S3 bucket (via the source IP address)
- What they requested (filename, path, and the name of the S3 bucket itself)

These S3 buckets received **more than 8 million HTTP requests over a 2 month period** for all sorts of things -

- Software updates,
- Pre-compiled (unsigned!) Windows, Linux and macOS binaries,
- Virtual machine images (?!),
- JavaScript files,
- CloudFormation templates,
- SSLVPN server configurations,
- and more.

Put extraordinarily simply - if we were villainously inclined, we could’ve responded to each of these requests with something malicious like:

- A nefarious software update,
- A CloudFormation template that gave us access to an AWS environment,
- Virtual Machine images backdoored with ‘remote access tooling’,
- Binaries that deployed ‘remote access tooling’ or scary ransomware, or such,
- etc

to give us access to the requesting system, or network that the requesting system was sat within.

These millions of incoming ‘give me this file’ requests came from the networks of organizations (based on DNS/WHOIS lookups) that some would define as ‘fairly important’:

- Government networks

- USA (inc NASA, numerous laboratories, state governments, etc)

- UK
- Poland
- Australia
- South Korea
- Turkey
- Taiwan
- Chile
- etc

- Military networks
- Fortune 500s
- Fortune 100s
- “Major payment card network”
- “Major industrial product company”
- Global and regional banks and financial services organizations
- Universities around the world
- Instant messenger software companies
- Cyber security technology companies (lol)
- Casinos
- etc

You get the idea.

> Note: We will **not** be drawing any relationship between a specific S3 bucket and ‘which networks we saw requests coming from’ to ensure that no project or software company is subsequently targeted.

Before we start sharing our findings, we want to mention a few things about the nature of supply chain attacks.

As a starting point, the cyber security industry is not new to the challenge posed by supply chain attacks. Over the last few years, we’ve seen real-world supply chain attacks play out, but seemingly only within the grasp of those that apparently most would call ‘nation-state’:

- [Jia Tan VS XZ/liblzma and OpenSSH](https://www.wired.com/story/jia-tan-xz-backdoor/?ref=labs.watchtowr.com)
- [SolarWinds Orion VS Cozy Bear](https://www.dni.gov/files/NCSC/documents/SafeguardingOurFuture/SolarWinds%20Orion%20Software%20Supply%20Chain%20Attack.pdf?ref=labs.watchtowr.com)
- Every living being VS NPM, roughly every other day

Are these solved yet? Who cares - while these are undoubtedly illegal, malicious incidents, these incidents do demonstrate the potential wide-scale impact of a supply-chain attack, while requiring effort and capability more sophisticated than our proverbial kid with a fork.

Clearly, we’re not as smart as the people who undoubtedly put hours/days/months/years into planning and executing the above incidents - we are hackers in our home offices/hotel rooms who resist Jira - but we did watch.

We want to take this opportunity to give our sincere thanks to the entities that engaged with us (while likely rolling their eyes in the background) when we realized what we’d stumbled into, including:

-  NCSC UK (who have helped with introductions and signposting to the correct teams to speak to),
- AWS (who took said ~150 S3 buckets off our hands to sinkhole),
- Major Unnamed SSLVPN Appliance Vendor #2 (who worked with us very quickly and directly to take relevant S3 buckets off our hands), and
- CISA (who very quickly remediated an example that affected `cisa.gov`)

AWS's agreement to sinkhole the identified S3 buckets means that the release of this research does not increase the risk posed to any party—the same issues discussed in this research could not be recreated against the same specific S3 buckets, thanks to the sinkholing performed by the AWS team.

We believe that in the wrong hands, the research we have performed could have led to supply chain attacks that out-scaled and out-impacted anything we as an industry have seen so far - **or put more clearly, we would've embarrassed Cozy Bear and made their SolarWinds adventures look amateurish and insignificant. **

While we suspect some would argue that 'watchTowr is already the wrong hands'.. actually, you're probably right.

As a final thought - as an industry, we spend a lot of time trying to solve issues like “securing the supply chain” in as many complex ways as possible and still completely fail to cover the easy things, like **‘make sure you don’t take candy from strangers’.**

If you made it this far, enjoy the research, and we'll be back again next week :^)

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/02/image-ff420f5a4acd5e61.png)

### Where Did This Idea Come From?

Anyway. Before we get too carried away, let’s rewind, and start way back at the beginning.

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/02/image-1.png)

Picture the scene. A researcher is sitting at their desk, looking at memes for inspiration, surrounded by mountains of empty energy drink cans and disassembled computer hardware.

Ten minutes later, they’re browsing a security vendor’s (let's call them "Antivirus and MDR Vendor #1") website looking for a report on a particular APT group, and voila - they find a link to the promised report in the lovely format of a PDF file.

To their dismay though, when they click the link to load the report from `https://s3.eu-west-1.amazonaws.com/nationalcert-content/files/apt-1337.pdf`, they’re met with not the report, but instead the following error message:

```xml
<Error>
	<Code>NoSuchBucket</Code>
	<Message>The specified bucket does not exist</Message>
	<BucketName>nationalcert-content</BucketName>
	<RequestId>[redacted]</RequestId>
	<HostId>[redacted]</HostId>
</Error>

```

Astute readers who are blessed with the ability to read will understand very quickly where this is going - the S3 bucket called `nationalcert-content` no longer exists (and so the poor researcher can’t read that PDF). This does constitute a "security issue", **but minor at most.**

Could we register the S3 bucket in question, and use it to serve a malicious PDF file a job advert to anyone that requested it (captive audiences, etc)? Yes, yes we could.

While this sounds mischievous and nefarious (we didn’t do this, in this anonymized example), the reality is that the severity of such an attack is roughly equivalent to hijacking a dead link. It’s not great for the owner of the website, but it’s not the end of the world or significant.

For those in the audience cursed with an inability to threat model - yes, as security “professionals” we can likely all think of scenarios in which this could theoretically be abused, especially when combined with the likely target audience of security researchers or threat intel analysts - but please calibrate yourself, this is not significant nor within the realms of a reasonable threat model.

We know - none of this stuff is new or exciting. Give us a few minutes. We’re really trying our best to build context before we drop the interesting stuff.

### What Is Amazon S3?

Per Amazon, Amazon S3 is:

> *.. an object storage service offering industry-leading scalability, data availability, security, and performance. Millions of customers of all sizes and industries store, manage, analyze, and protect any amount of data for virtually any use case, such as data lakes, cloud-native applications, and mobile apps. With cost-effective storage classes and easy-to-use management features, you can optimize costs, organize and analyze data, and configure fine-tuned access controls to meet specific business and compliance requirements.*

TL;DR: it is a dedicated file storage solution in the cloud. It has the benefit that it is both very cheap and very easy to use.

Amazon S3 is a good solution in its own right - it allows anyone with an Amazon account to host files and make them accessible to the entire Internet, without worries like ‘what if a hard drive fails’ or ‘do I have enough bandwidth’, or, “should I actually be sharing this with the world?”.

In order to keep things neat and tidy, S3 gives users this magical space and place called a ‘bucket’ - effectively, a file-sharing space that can contain folders and folders.

For example, we might decide to use Amazon S3 to host memes and register an S3 bucket called ‘watchTowrs-finest-memes’. This would result in the S3 URL (ignoring regions - not our job to teach this!) of `watchtowrs-finest-memes.s3.amazonaws.com` (this doesn't exist, hijack it you nerds).

We could then upload files to this bucket, and reference said files within this S3 bucket anywhere we felt the need to via a regular HTTPS URL (like `https://watchTowrs-finest-memes.s3.amazonaws.com/our-fav-meme.exe`). It goes without saying that we could store anything here - code, PDFs, images, binaries, etc - and share the link with all and sundry, reaping the benefits of Amazon’s large storage and wide Internet pipes.

### ‘World’s Easiest Bug Bounty Payout’

The problem, from a security standpoint, manifests when these S3 buckets are allowed to decay and subsequently abandoned, allowing bad actors to re-register them for themselves.

This is a known bug class, known as any names, including ‘S3 bucket takeover’ (we know this is not new - bear with us). Second-order Amazon S3 bucket takeovers via broken links are also not new, before you tell us this also.

These issues have been common for a long time. This is partly due to the prevalence of website hijacking and defacement opportunities, stemming from takeovers of abandoned S3 buckets that were previously used to host static websites.

Take this random screenshot that we found on the Internet for example:

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-12.png)

*This is a random image from Google Images*

Here, the hostname `blog.char49.com` is set to reference an S3 bucket (`blog.char49.com`) via DNS in order to host a static website.

However, in this example that is not real, the specified S3 bucket no longer exists. Speed running this explanation - if a nefarious actor registers the bucket, they could then host malicious content, which would then be served directly on the legitimate domain `blog.char49.com`.

It’s a simple attack, but extremely common. This is not exciting or new, and it is also not the supply chain attack we promised in the title - we promise we’re getting to that bit.

### You're Back In The Room

Well, let’s take a step back and look at things from a more generalized viewpoint.

While we’ve focused solely on instances where an S3 bucket is used as a backing store for a website’s static content, S3 is used for far more than just serving websites. A huge swath of the Internet’s resources are stored in S3, and the amount of infrastructure that uses it is considerable.

Looking at the vulnerability class with a wider eye, we can make a key observation - the mere fact that website-based S3 bucket takeovers are so prolific suggests to us that there’s some *inherent challenge* around S3 bucket ownership. It follows that this inherent challenge - be it technical, political, organizational, or otherwise - is unlikely to be restricted to just static website resources, such as favicons and PDFs.

We asked ourselves, ‘What other things use S3 buckets behind the scenes as a more general storage solution?’ We’re no DevOps gurus, but a few answers slid conveniently off the top of our collective heads and onto our whiteboard.

- Container applications (DevOps people love storing their containers in S3)
- CI/CD tooling infrastructure (Dockerfiles, Jenkinsfiles, built artefacts, etc)
- Source code repositories (yes, GitHub just isn’t enough for some people)
- Mobile applications
- Software documentation
- Deployment instructions

While we could continue our enumeration, we decided to focus mostly on these six areas (you’ll see as we progress that this didn’t go entirely to plan, as other resources popped into our field of vision).

Satisfied with our list, we extracted some of the existing capabilities that we hold in the watchTowr Platform into a standalone binary and modified it to focus on **Internet-wide assets** rather than just our client base.

The result? A curiously modified tool that we apparently decided to call **kidwithafork**.

After a quick ‘does it work’ smoke test, we then deployed our new tooling into a proper pipeline, and got to work.

### What Did We Target?

Now, as you recall, we promised something “supply-chain-esque” against an “Internet-wide” attack surface.

However, we decided it was going to be fairly pointless to set our newly mashed-together tool to work on the *entire* Internet, so we decided to give ourselves some further parameters to work within.

After a bit of deliberation (random ideas, and seeing what stuck), we decided to focus on the six selected asset types only when potentially previously owned by:

- Governments
- Fortune 500 companies
- Technology companies
- Cyber-security technology companies
- Major open-source projects

The logic behind our decision is simple: These organizations have a large enough user base that an issue would impact numerous people. There’s no real benefit in pointing out that a website with five users has a supply-chain problem—the owners simply don’t have the resources to deal with this kind of detail, and we just don’t care.

Our broader aim, however, remained simple - we wanted to demonstrate an **Internet-wide issue**, grounded in the “abandoned infrastructure” class of weakness, ideally with a supply chain angle (software updates, build pipelines - something like that).

> We’d like to take the opportunity now to make one thing very clear - **we have not targeted any organization in particular, despite the outcomes that we detail below. We will not entertain any conversation or speculation that we targeted any organization.** It is clear that, like expired and abandoned domain names, this issue is prolific and **not representative of any one organization’s approach to infrastructure or cyber security in isolation.**

> Any conclusion that you come to around any individual organization’s security posture as a result of this research would be incorrect, misguided, and likely due to your own bias.

Over the course of two months, our technology ingested a huge amount of data to identify references to abandoned S3 buckets and subsequently alerted us if any were found.

Once we saw S3 bucket names that looked interesting, we registered them and began logging any requests they received.

> Note: We were not 'sniping' S3 buckets as they were deleted, nor employing any 'advanced' technique to register these S3 buckets. We just.. typed the name into the input box, and used the power of 1 finger to click register.

Our intent was twofold;

- Firstly, to get an idea of just how many people were requesting data from these previously abandoned S3 buckets, and,
- Secondly, what kind of data/files was requested from these previously abandoned S3 buckets.

The below aims to showcase some of our more interesting results. As you can imagine, given that we saw over 8 million inbound requests, there’s a lot we have to leave out simply for brevity’s sake.

Since this is a long article, we’ve labelled each section with a ‘danger level’.

### Poisoned Javascript

*Danger level: North Koreans will use your web browser to mine crypto, it might catch fire*

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-17.png)

Being the uninspired primitives that we so keenly embody, our first thought was to see if we could identify any JavaScript files requested from any of the S3 buckets we registered—because we could theoretically return a BEEF Project implant (if it was 2003 and we'd just invented fire) or a crypto miner if we’re pretending it’s 2025.

We took a quick look at our log entries and had our first inkling that we’d stumbled onto something interesting.

Take, for example, this request for a JavaScript file, which came to one of our S3 buckets:

```python
requestParameters.Host: s3.amazonaws.com
requestParameters.bucketName: echochamberjs
requestParameters.key: dist/main.js

```

This is a request for a JavaScript file that is involved in the `echo-chamber-js` project (could you guess?).

A quick look at the project’s [GitHub page](https://github.com/tessalt/echo-chamber-js?ref=labs.watchtowr.com) shows the project’s `README` file, revealing that it directed users to install the project into their own websites simply via the magic of an overly engineered web-two-point-zero `<script src="">.`

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-18.png)

If you were some sort of pentester, scraping the barrel for findings, you’d now launch into some theory about now being in a position to leak cookies and impersonate users on these websites (and you wouldn’t be entirely incorrect).

For context, we saw 2000 or so requests for this JavaScript file alone (there were many more JavaScript files, with many more requests, but for the sake of everyone involved, we are not going to bother listing every single JavaScript file - this isn’t a $3000/day pentest report output).

We hope you get the point from this single example—loading JavaScript from abandoned S3 buckets— puts unimaginative hackers in a position to execute JavaScript in your web application, steal your cookies, and mine for crypto.

### CISA Secure-By-Wrong-Patches

*Danger level: CISA will tell you to install ‘security patches’ that send your hard drive contents to APTs (or watchTowr)*

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-19.png)

One hit that stood out, (and, if we’re honest, made us chuckle a little bit), was this hit our web crawler found on [CISA.gov in a 2012 ICS Advisory](https://www.cisa.gov/news-events/ics-advisories/icsa-12-025-02a?ref=labs.watchtowr.com):

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-20.png)

***Insert some sort of secure-by-design meme here***

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-50.png)

This S3 bucket was likely valid way back in 2012 when this advisory was first released, complete with a well-intentioned link to an *impossible-to-verify-the-integrity-of* patch executable. It has since been abandoned, but as you can see, it is referenced from a place of authority - [`cisa.gov`](http://cisa.gov/?ref=labs.watchtowr.com) itself.

Someone with just slightly less self-control than those of us here at watchTowr could easily register this (previously abandoned, now safely sinkholed) S3 bucket - providing *insert-your-favourite-ransomware-binary-here.exe* under the guise of `TERMIS_2.10_18-01-2012.exe`.

This is clearly well-intentioned by both the CISA and 7T teams, but regardless, it is an incredible example of how this challenge is ubiquitous and not limited to only the unenlightened—even security professionals inside governments trip up here.

As a conclusion, we let CISA know ahead of the publication of this research - and the reference to the S3 bucket has now been removed:

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-54.png)

But we’re only getting started. What could be worse than unsigned executables on an abandoned s3 bucket referenced by a `.gov` domain, you might ask?

Well, buckle up, you’re about to find out.

### Major AntiVirus Vendors Linux Server Agent

*Danger level: Sloppy, "not brilliant" and so much to read into - but perhaps not the end of the world*

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-21.png)

Other than straight-up vulnerability, we found this research quite revealing regarding the general hygiene of various security solution vendors.

For example, here’s a condition that doesn't immediately signal an 'this is the end of the world' exploitable weakness but does strongly signal that the S3 buckets in question, associated with a security solution, perhaps aren't being handled or decommissioned with the due care and attention that they should be.

We’ll admit that we project our enjoyment of the mayhem and irony of security companies struggling to practice what they preach, an enjoyment that led us to this particular exposure. We searched our logs for keywords like ‘security’ and for the names of a few security vendors that came to the front of our collective minds.

One of these searches revealed a huge amount of requests for the S3 bucket named `repo.****************`, presumably owned by the antivirus giant named `majorantivirusvendor#1`.

Our log entry looked similar to the following:

```python
requestParameters.Host: s3.amazonaws.com
requestParameters.bucketName:  repo.*****************
requestParameters.key: *****************/ubuntu16/dists/*****************/Release
userAgent: Debian APT-CURL/1.0 (1.2.32ubuntu0.2)

```

There’s a distinctive `user-agent` , paired with the tell-tale `/Release` file - this request, it seems, is a request sent by apt-get to a (former) APT repository, which we assume was maintained by `majorantivirusvendor#1` to update their Linux antivirus agent.

It seems likely that `majorantivirusvendor#1`, at some point in the past, distributed patches via the `apt` suite of tools, with their APT repository hosted in an S3 bucket - but subsequently, the S3 bucket has been abandoned, leaving existing deployments of their Linux antivirus agent to talk to uncontrolled infrastructure. Some web sleuthing reveals that they migrated to a new URL for software distribution.

While the naive reader may imagine that we can simply serve malicious content from this repo, this is not the case.

It should be noted that `apt` cryptographically signs packages (and package lists themselves) via `gpg`, terminated in a root-of-trust found on the install CD itself, and so we have not come across the huge 'we can compromise all of these Linux antivirus agent-running hosts' like it may initially appear.

While [security holes](https://nvd.nist.gov/vuln/detail/cve-2019-3462?ref=labs.watchtowr.com) in `apt` itself are not unheard of, it is safe to say that this is not an actionable vulnerability, so much as an indicator of poor security hygiene.

The same S3 bucket appeared to also serve have historically served data for the `yum` package management tool:

```python
requestParameters.Host: s3.amazonaws.com
requestParameters.bucketName: repo.*****************
requestParameters.key: *****************/rhel7/x86_64/repodata/repomd.xml
userAgent: [urlgrabber/3.10 yum/3.4.3]

```

`yum` is similarly sensible to `apt`, and uses strong cryptography to prevent an attacker from serving malicious updates in the case of a hijacked or compromised repository.

This is a great example of security-by-design coming into play, and ultimately, it is more of an indicator of poor security hygiene on the part of the (former) S3 bucket owner (before they abandoned it).

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-22.png)

It should be noted that the requests coming into this S3 bucket originated from **some incredibly sensitive organizations, presumably (we assume) because they use **`majorantivirusvendor#1`** branded antivirus.**

### Just Pipe It Into Bash

*Danger level: please don’t do this, we keep telling you not to do this, please don’t do this*

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-23.png)

The security community loves to warn people of the dangers of “just pipe from `curl` into `bash`" as an installation technique. While this blanket advice may or may not be misguided, there are certainly instances where it is valid, and one of them is ‘when the source comes from an abandoned S3 bucket’.

On this topic, we saw a whole bunch of requests to the S3 bucket [`airgap.svc.anaconda.com.s3.amazonaws.com`](http://airgap.svc.anaconda.com.s3.amazonaws.com/?ref=labs.watchtowr.com) for a file named `misc/ae5-conda-latest-Linux-x86_64.sh` - the installer for something related to the ‘Anaconda’ project.

Truth be told - we’ve had some difficulty ascertaining what Anaconda is or does, other than ‘full of buzzwords’. Something about AI.

After some quick searching, we also found the [documentation](https://airgap.svc.anaconda.com/misc/vscode-install.pdf?ref=labs.watchtowr.com) for some kind of VSCode addin, seemingly related to Anaconda itself, which directs the user to install software.

The documentation, however, seems to reference the same abandoned S3 bucket - instead of the domain `airgap.svc.anaconda.com`, the documentation referenced [`airgap.svc.anaconda.com.s3.amazonaws.com`](http://airgap.svc.anaconda.com.s3.amazonaws.com/?ref=labs.watchtowr.com) , which was (at the time) abandoned.

It’s not clear if the S3 bucket was once owned, and maintained, by the Anaconda team, or if this is simply a typo. What we do know, though, is that a ‘ripple effect’ caused the domain to propagate to various other [places](https://github.com/jerilkuriakose/Website-Prediction/blob/master/README.md?ref=labs.watchtowr.com) on the Internet, where it is listed as an authoritative location.

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-55.png)

> Perform a basic verification of installation by running the script

Absolute poetry.

### Major SSLVPN Appliance Vendors

*Danger level: We swear, we did not go looking for anything to do with SSLVPNs and once again we’re stuck talking about SSLVPNs!!!!!*

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-25.png)

Once again, we turned back to our dataset for more gems, and started to get a real sense of just how unruly this particular can of worms was.

We admit that, as pretend security researchers instead of Big Data experts, we were slightly daunted by the sheer size of our results - as we say, 8 million requests - and so we scratched our heads for a while trying to figure out how to separate the wheat from the chaff.

A list of requested files grouped by file extension seemed a good idea, so we figured out how to use Amazon’s query DSL and ran a suitable query.

### Major Unnamed SSLVPN Appliance Vendor #1 - `*****************`

Who can guess, from this request found in our logs, what might be going on here?

```python
requestParameters.Host:	s3-us-west-2.amazonaws.com
requestParameters.bucketName:	*****************
requestParameters.key: *****************.json

```

If you saw the name - `templates-for-well-known-NGFW-appliance` - and surmised this S3 bucket is related to `sslvpnvendor#1`, and providing deployment templates - you'd be right.

Indeed, we can even find a reference to this file on `sslvpnvendor#1`’s GitHub itself, in an archived project.

The file that references this S3 bucket represents an Ansible playbook, designed to rapidly provision a `sslvpnvendor#1` NGFW appliance.

This appliance is a ‘hardened network device’ designed to sit at the border of an organization and police traffic, protecting a soft-and-cushy internal network from all the potentially malicious traffic originating from the big bad Internet.

```python
    # Use a template from a URL
    - name: *****************
      cloudformation:
        stack_name: "*****************"
        state: present
        region: "{{ region }}"
        disable_rollback: true
        template_url: <https://s3-us-west-2.amazonaws.com/*****************>
      args:
        template_parameters:
          *****************: "{{ key_name }}"

```

Gather round security pros, we’ll be submitting this to ISC2 for your CISSP exam - is it a good idea to fetch your CloudFormation templates from untrusted locations, or abandoned infrastructure? No, stop it.

It certainly appears that `sslvpnvendor#1` once owned this S3 bucket and has subsequently decided that they do not need it, deleted it and abandoned it.

Unfortunately, though, there are evidently still systems and engineers out there that are looking to this bucket, trying to fetch the CloudFormation template it once held as we saw in our logs repeatedly.

As you may be able to imagine, an attacker who can serve this file is in an extremely privileged position since they can direct CloudFormation to carry out any task they define.

Exposure goes beyond just the built VM; as a CloudFormation template, it has more power than just the creation of instances. An attacker could, theoretically:

- Define new IAM roles
- Deploy any cloud object and grant external accounts access
- Remove entries from system logs
- Access other, unrelated, cloud storage
- Subscribe to costly cloud products
- Deploy cloud-based ransomware malware, which can lock the entire cloud environment

This is clearly a pretty damning theoretical attack, with real impact possible.

Much to our despair though, `sslvpnvendor#1` wasn’t the only VPN appliance vendor we spotted in our logs.

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-26.png)

### Major Unnamed SSLVPN Appliance Vendor #2

### Bucket 1 - `*****************`

Taking a look over our results, we spotted the file extension `.json`. This in itself is fairly benign, but we thought it deserved a second look.

Smacking us in the face was an S3 bucket suspiciously named `sslvpnvendor#2-******-******`.

We sat there for a while trying to work out who this name might be referencing but were rapidly distracted by the number of incoming requests for the file `*****************.template.json`.

Looking at `sslvpnvendor#2`'s `*****************` Github repository that referenced this S3 bucket, you'd spot a pair of ‘Launch stack’ buttons.

These buttons are not as innocent as they look. They refer to an S3 bucket that, as mentioned above, had been abandoned.

Clicking one of these buttons would’ve allowed you (so kindly) to deploy infrastructure based on the contents of the CloudFormation template that used to be hosted within the abandoned S3 bucket (but thankfully, nothing anymore, since watchTowr would never take advantage of your trusting click).

All of the previous attack scenarios apply here.

### Major Unnamed SSLVPN Appliance Vendor #2

### Bucket 2 -`*****************`

The next unusual entry in our result set was the extension `.template` , fetched from the S3 bucket named `*****************`.

What could that be, we thought? Some kind of website markup DSL template? We took a look at the incoming query that Amazon had logged to our bucket.

```python
requestParameters.Host:	s3-us-west-2.amazonaws.com
requestParameters.bucketName:	*****************
requestParameters.key: *****************.template

```

Er, wait, what? What on Earth have we stumbled on here?

Yet another request for a file called `*****************.template`in a path suspiciously suggesting it’s likely a CloudFormation template, in an S3 bucket called `sslvpnvendor#2-******-******` .

We can’t be 100% sure exactly what this file is being used for, but we have a strong suspicion that it is related to autoscaling inside AWS - a system for automatically provisioning and auto-scaling new cloud-based `sslvpnvendor#2` SSLVPN devices to meet unexpected demand.

If one navigates to `sslvpnvendor#2's` `*****************` Github repository, and takes a close look at yet another ‘Launch a demo’ link, you'll see a URL that references this very file to deploy a cloud-defined stack, and subsequently deploys a new SSLVPN appliance within your AWS account.

We can hazard a guess that, in addition to being used to spin up the demo appliance, the `*****************.template` is likely intended to define exactly what infrastructure is spun up to meet this demand.

If it were present in the bucket, it would describe the deployment of a `sslvpnvendor#2` SSLVPN, and all the associated gubbins - subnets, VPCs, security groups, all of that fancy cloud stuff. This is clearly not something you would want to do from a malicious source, for all the given reasons above.

Interestingly, while most requests were anonymous, some were associated with AWS accounts referencing @`sslvpnvendor#2`.com usernames - allowing us to tie certain attempted deployment activity to specific `sslvpnvendor#2` employees.

Again, put simply, we watched as `sslvpnvendor#2` employees attempted to spin up stacks of cloud-defined assets via CloudFormation templates expected to exist within an abandoned S3 bucket.

Imagine the possibilities if we were bad people.

It got worse though.

Coming into the S3 bucket `*****************` were significant amounts of requests that had a URI that ended as such: `*****************/baseconfig`.

As far as we can tell and aligned to our theory (backed up by evidence) was that these appear to be swathes of requests from freshly autoscaled `sslvpnvendor#2` SSLVPN appliances, looking to our S3 bucket to configure themselves. This functionality is known as 'autoscaling in AWS' or similar.

This theory was further reinforced via the naming conversion of the IAM role names associated with the incoming requests, once again indicating autoscaling infrastructure/tooling.

These configurations (which look like `*****************`) define everything from certs and keys, to routing information, and control of an SSLVPN appliance configuration is equivalent to superuser control of the SSLVPN appliance itself.

And there were *lots* of requests.

We asked `sslvpnvendor#2` if they themselves had any theories on how this happened, as after tearing through numerous branches of firmware we couldn’t find a reference to the S3 bucket that could blindly lead to this behaviour - but this question was never addressed (not that they owe us an explanation).

Bluntly though, once an attacker controls the configuration of an SSLVPN, they are able to:

- Silently connect to the victim’s network as if they were a legitimate user - taking advantage of access to internal resources (perhaps deploying ransomware malware),
- Attacking specific endpoints via MiTM attacks (don’t forget, such VPN appliances often store SSL keys in order to inspect HTTPS traffic, which can be abused to perform man-in-the-middle attacks on endpoints inside the network perimeter),
- Subvert comms and redirect them by providing our own DNS servers
- Secure the appliance
- etc

You get the idea.

### Major Unnamed SSLVPN Appliance Vendor #2

### Bucket 3 - `*****************`

The final `sslvpnvendor#2` abandoned S3 bucket we discovered was `*****************`, which seemingly once held the file `*****************.zip`. Over the course of our research, we saw this archive requested by various systems and/or users.

To work out why, we went sleuthing again. Rapidly we identified that within to-this-day published `sslvpnvendor#2` documentation PDFs (page 8, in a previously linked but now redacted PDF), instructions are provided for users to download an archive from the abandoned S3 bucket, unzip it (without checking integrity, naturally), and feed it to AWS in order to bring up cloud assets.

Obviously, this can be abused to provide malicious CloudFormation templates - the same attack scenarios described above apply.

## Breather Time

As we mentioned, things began to get worse and worse.

We want to again reiterate our comment from way above:

> We’d like to take the opportunity now to make one thing very clear - **we have not targeted any organization in particular, despite the outcomes that we detail below. We will not entertain any conversation or speculation that we targeted any organization.** It is clear that, like expired and abandoned domain names, this issue is prolific and **not representative of any one organization’s approach to infrastructure or cyber security in isolation.**

> Any conclusion that you come to around any individual organization’s security posture as a result of this research would be incorrect, misguided, and likely due to your own bias.

We’re getting closer to Internet-wide breakage, but we want to move on - we’re sick of anything to do with SSLVPN appliances.

### Virtual Machines With No Integrity

*Danger level: Come on, this is ridiculous*

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-32.png)

What’s more questionable than pulling a CloudFormation template from an untrusted location?

What about pulling *entire virtual machine images* out of abandoned S3 buckets?

Somewhat unbelievably, we found systems doing exactly this. Sorting our logs by user-agent, hoping to spot clusters of outliers, we spotted a good amount of requests sporting a user-agent indicating that the request was on behalf of the [Vagrant](https://www.vagrantup.com/?ref=labs.watchtowr.com) tool.

We thought this was unusual, not just because of how wild this entire situation was (and unusual is really on a sliding scale at this point), but especially so given Vagrant is typically used to automate the creation of virtual machines (or cloud images).

We took a closer look. Take a look at this gem:

```python
requestParameters.Host: s3.amazonaws.com
requestParameters.bucketName: bosh-lite-build-artifacts
requestParameters.key: bosh-lite-virtualbox-ubuntu-trusty-293.box
userAgent: Vagrant Cloud/1.0 (+https://app.vagrantup.com; Vagrant Cloud box verifier)

```

This is someone using [Vagrant](https://www.vagrantup.com/?ref=labs.watchtowr.com)'s hosted solution to build a virtual machine (or perhaps a cloud image).

In order to speed things up, and to avoid going through the whole process of installing the OS, they’ve (sensibly) specified that the ‘base’ of the new machine should be an image already containing a functioning Linux install.

However, they have (significantly less sensibly) requested that this base virtual machine image should be fetched from an abandoned S3 bucket, that could very well be under the control of a malicious entity (or watchTowr).

Basing the virtual machine on an untrusted image serves to destroy the entire chain of trust on which the resultant image relies. There’s almost no limit to what an attacker can do, but some quick ideas:

- Adding users to the system
- Including something that beacons back to us upon deployment, giving us full access
- Supplying subtly backdoored system daemons, such as SSH
- Loading our favourite version of Phalanx 2.6
- Waiting for the system to contain important data, and then deploying ransomware-style malware
- Mining for cryptocurrency
- Sniffing credentials of local users, and spraying them at other infrastructure
- Observing outgoing credentials, and replaying them to escalate access

While we have no idea what the resulting virtual machine was intended to be used for, and so we can’t really draw many conclusions about the consequences of this request - but given that watchTowr owned this bucket, we technically could’ve found out.

We saw a considerable number of these requests, for varying virtual machine templates, all directed at the `bosh-lite-build-artifacts` bucket. This appears to be some form of VM orchestration software, referenced in [many projects](https://github.com/search?q=bosh-lite-build-artifacts&type=code&ref=labs.watchtowr.com) online.

### A Twilight for Sparkle

*Danger level: not-so-bad until you read to the very end and then it makes you wonder why you bother trying to secure things at all*

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-33.png)

Beside the `Vagrant` tool, we saw some other unexpected user-agent strings, such as variations of `Sparkle`. This came in various forms, such as:

- [GitUp/1.3.5 Sparkle/1.24.0]
- [Houseparty/1.4.1 Sparkle/1.18.1]
- [hotkeyEVE/1.5.0 Sparkle/313]
- [MongoHub/3.1.5b1 Sparkle/1.19.1]

These requests were voluminous, and mostly requested one specific file - `appcast.xml`.

After musing over why we were seeing a lot of requests for this file, we discovered the ‘[Sparkle Project](https://sparkle-project.org/?ref=labs.watchtowr.com)’ (d’oh, the clue was in the user-agent all along!).

This is a framework library for macOS applications, effectively providing out-of-the-box auto-update functionality.

While we expected it to be very easy to evaluate how open this `Sparkle` client was to accepting malicious updates, this topic turned into something of a rabbit-hole for us as we attempted to discern the tangible danger posed by the files.

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-34.png)

As we say, the Sparkle Project is a tool for automatically distributing updates for macOS applications.

When it decides to check if an update is available, the library will fetch - you guessed it - the `appcast.xml` file, which is typically hosted on the vendor’s website (or, in our case, an orphaned S3 bucket).

This file contains important metadata about the distributed software, such as available versions, and the URL from which new versions can be fetched.

These `appcast.xml` files, in contrast to files used by `yum` and `apt`, are *not* signed by default. This means that we could theoretically serve a malicious `appcast.xml`, and thus a malicious update, to any of the macOS applications polling our S3 buckets for updates.

You’d think this would mean instant RCE, but in reality, the situation is somewhat more nuanced (excuse the somewhat long-winded explanation that follows - we want to make sure we neither downplay nor overhype the issue).

As macOS users will no doubt be aware, each application is cryptographically signed, allowing it to be traced to the developer that published it.

Sparkle, it seems, is smart enough that it will check this cryptographic signature, and ensure that provided update packages are signed by the same developer that signed the application requesting the update - i.e. it won’t install v2.0 of the target software over v1.0 unless both v1.0 and v2.0 are signed by the same developer.

This means that we cannot simply serve malicious updates without also compromising the publisher’s signing key.

However, the story doesn’t end there, as attested to by a somewhat active [debate](https://github.com/sparkle-project/Sparkle/issues/971?ref=labs.watchtowr.com) on the Sparkle bug tracker over the value of signing the `appcast.xml` file that transpired a few *years* ago.

A portion of posters believed it important to sign the `appcast.xml`, arguing that the lack of signature allows a particularly potent social engineering attack, while others felt it would impede legitimate usage of the software.

Ultimately, the decision seems to have been made not to sign the files.?

> Spoiler: This is stupid, just do it.

Let’s look closer at the ‘particularly potent social engineering attack’.

We’re a sceptical bunch here at watchTowr, and when we hear the words ‘social engineering’, we mentally prepare ourselves for an attack with a very low success rate that generates an unacceptable amount of noise.

However, as one GitHub commenter [explains](https://github.com/sparkle-project/Sparkle/issues/971?ref=labs.watchtowr.com#issuecomment-302215459), this attack is not only unusually potent, but has also been used in-the-wild to compromise developers in the past.

The attack hinges on the fact that, while the unsigned `appcast.xml` file cannot persuade Sparkle to install nefarious binaries, it *does* allow an attacker to show release notes to the user before they apply an update - specifically for a situation in which you want users to update, but can’t provide a package signed with a previously used signing key (like if you're an attacker trying to deliver malware).

[Here’s the perspective of the victim:](https://blog.panic.com/stolen-source-code/?ref=labs.watchtowr.com)

> HandBrake had been nagging me for some time to install an update. I finally decided, for whatever reason, to do the update. There was a note in HandBrake’s update dialog that the incremental update was not available, and that I’d have to download an entirely fresh copy from their server.** I didn’t think too much of this, as we’ve been in a similar situation with a broken Sparkle update channel once before (the worst).**

So, I managed to download within the three day window during which the infection was unknown, managed to hit the one download mirror that was compromised, managed to run it and breeze right through an in-retrospect-sketchy authentication dialog, without stopping to wonder why HandBrake would need admin privileges, or why it would suddenly need them when it hadn’t before. I also likely bypassed the Gatekeeper warning without even thinking about it, because I run a handful of apps that are still not signed by their developers. And that was that, my Mac was completely, entirely compromised in 3 seconds or less.

Clearly, while having the ability to serve malicious `appcast.xml` packages is not equivalent to code execution, it can be leveraged for a practical attack by a motivated attacker.

This places a considerable number of users who are requesting `appcast.xml` from our S3 bucket at significant risk.

When we say ‘considerable number’, we aren’t just hand-waving either - our S3 buckets logged thousands and thousands of unique IP addresses fetching `appcast.xml` manifests!

It is worrisome that the software's distribution channel is subverted so easily, and this is made even more severe when you consider not only the number of requesters but also the identity of the requesting users themselves.

Obviously, we can’t be sure who exactly is requesting these files, but some investigation is possible via the `whois` and plain old DNS.

Unfortunately, studying these records revealed things were *even worse* than first appeared - we saw hits from sources residing in government-owned IP ranges, and also those in *military* ranges - being a single step away from being able to compromise a host holding a `.mil` IP isn’t something you see every day.

Our 12-year-old selves would be frothing at the vhost we could’ve had in #phrack.

Regardless, this.. this is not good. We’re seeing a feasible, proven in-the-wild attack on high-value targets. The only consolation is that the `appcast.xml` file cannot deliver updates silently, due to Sparkle’s sensible certificate checking.

### No Signing Necessary

One application that uses Sparkle to update is the `houseparty` project, which caused many requests for the `appcast.xml` from our `houseparty-mac-builds` bucket.

When we found this, having done our research into Sparkle and `appcast.xml`, we were initially satisfied that we hadn’t stumbled upon a true no-click RCE - until we looked further in our logs. Lo and behold, we found:

```python
requestParameters.Host: houseparty-mac-builds.s3.amazonaws.com
requestParameters.bucketName: houseparty-mac-builds
requestParameters.key: Houseparty.dmg
useragent: [Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36]

```

It seems that, in addition to using Sparkle to locate updates in an arguably secure manner, the `houseparty` project also makes their application available for download directly from the bucket. There’s no need to compromise the updater process after all - attackers can just place a malicious binary and wait for the unsuspecting user to download it with their web browser (note the user-agent, which tells us this is a request from an end-user, rather than a request coming via the Sparkle library, which has its own user-agent).

One interesting thing about this case in particular is that the `houseparty` app is actually the front end to a [defunct social network](https://en.wikipedia.org/wiki/Houseparty_(app)?ref=labs.watchtowr.com), which has ceased operations and is no longer accessible. Despite this, we’re still seeing requests to download it, both for the unsigned `Houseparty.dmg` file, and from Sparkle itself to `appcast.xml` files.

This strongly implies that the software, somewhere, is still running, trying hard to beacon and find updates to download and run. It’s not an insignificant amount of machines either, as we saw requests coming from almost 3,000 different source IP addresses - all for an app that ceased to function in 2021.

### GitUp GitDown

This non-functional social network wasn’t the only application we saw, either - another popular entry was the macOS Git UI tool `GitUp` . This is clearly a popular tool, having some 11,000 ‘stars’ on the project’s [GitHub](https://github.com/git-up/GitUp?ref=labs.watchtowr.com) page, a statistic backed up by the number of requests we saw - we saw 10s of thousands of different source IP addresses request the `appcast.xml` holding update information for this package.

Again, the package not only fetches updates via the arguably-secure `appcast.xml`, but also provides an unsigned zip, stored in an orphaned bucket, which is fetched from an abandoned bucket, `gitup-builds.s3.amazonaws.com/stable/GitUp.zip`.

The icing on the cake is the [open issue](https://github.com/git-up/GitUp/issues/1022?ref=labs.watchtowr.com) requesting that hashes of built files are provided as part of the build process.

Just as further icing on the cake, we can see at some point that the macOS Homebrew Cask for GitUp was configured to download .zip archive from said abandoned S3 bucket, with an equally tasty `sha256: no_check`.

Because why bother checking package integrity?

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-37.png)

### Please, Make It End

*Danger level: entire build process subverted, RIP*

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-35.png)

If you’re familiar with the popular `gradle` suite for managing and downloading build-time dependencies during the compilation of a software project, you’ll know where this is going when we tell you that our logs contained a huge amount of requests for `.pom` files.

Since these files contain a list of build-time dependencies, among other things, it would be trivial to subvert a build process using a file provided by our trusty S3 bucket.

While we concede that it’s *theoretically* possible that these `.pom` files could be checked for a valid cryptographic signature - the software technically supports this - the chance is vanishingly small, on a par with the likelihood that there will be no RCE vulnerabilities announced in any hardened SSLVPN appliance for the duration of 2025 (for additional context, we write this knowing that several will be published before this is actually published).

There were a truly *huge (million+)* number of requests for these files in our logs, attempting to find files contained in S3 buckets such as `fabric-artifacts-private` (a misnomer if we ever saw one).

This bucket, in particular, seems to be a hot resource - many projects seem to use it to fetch Maven packages since it appears it was once the official source of the [`fabric.io`](http://fabric.io/?ref=labs.watchtowr.com) package, used as a crash-reporting tool for many packages.

However, time has taken its toll on `fabric.io`, and it first became deprecated, and then entirely replaced. Users were urged to move to the `firebase` project as a replacement, but somewhere along the way, it seems that the distribution S3 bucket - `fabric-artifacts-private` - was abandoned, and - well, you know the story from there.

Instant RCE on *hundreds* of sensitive build servers.

The most dangerous thing about this case in particular, however, is the amount of packages using it. Ignoring the hundreds of affected build servers, the significant element here is that each of these servers is building a software package, presumably to be distributed to unsuspecting end-users, or (worse) to be supplied to further developers for even more widespread distribution.

We are now - technically speaking - in a position where we are able to inject malicious code (be it ransomware, botnets, credential stealers, you name it) into *all* of these packages (which may be libraries or applications).

The implications cannot be understated.

Ultimately, though, we can only speculate on the intention of the build servers that requested these `.pom` files. Plus, we’re not particularly keen to obtain analytics or whatever the excuse was, by putting OASTIFY URLs into packages on popular package repositories to see if they get used (**ahem** **Snyk** **ahem**).

All we know for sure is that they’re building software.

### Please, Download Binaries From Us

As we alluded to at the start of the post, there’s a whole world of things we were forced to omit from the post, for brevity’s sake.

Nevertheless, we couldn’t resist sharing some of the things we found, so here’s a cassoulet of ‘honourable mentions’.

One thing truly did surprise us even more than we thought was possible. Once we’d discarded requests associated with user-agent strings such as those for `apt` and `yum`, which are invariably protected with strong cryptography, we were left with an alarming list of executable files being retrieved.

For example, take this request - it’s from our old friend ‘bosh’ again.

Bosh is a package for managing virtual machines, so it is clearly something that should be protected with care - there is, by necessity, a clear path from breaching the `Bosh` tool to breaching all the virtual infrastructure it manages.

```python
requestParameters.Host: s3.amazonaws.com
requestParameters.bucketName: bosh-gcscli
requestParameters.key: bosh-gcscli-0.0.6-windows-amd64.exe
userAgent: curl/8.4.0

```

This one looks looks pretty bad!

Why is someone downloading what appears to be a setup program from an abandoned bucket? And why are they doing so with `curl`, which doesn’t do any signature verification beyond TLS? Are they doing the signature validation manually themselves, via `gpg`?

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-39.png)

Well, we really hoped that they were checking this file for some kind of cryptographic signature.

These hopes were obliterated when we found a [script](https://github.com/cloudfoundry/stembuild/blob/a5bff712c26a89221e42bd6e068fe4f989f1cae9/Makefile?ref=labs.watchtowr.com) (perhaps one of many?) which requests this very file, in plain sight on GitHub.

Taking a quick look showed that users of this script, at least, do not verify anything at all.

```python
BOSH_GCS_URL = '<https://s3.amazonaws.com/bosh-gcscli/bosh-gcscli-0.0.6-windows-amd64.exe>'

..

assets/local/bosh-blobstore-gcs.exe:
	@echo "### Creating assets/local/bosh-blobstore-gcs.exe"
	curl -o assets/local/bosh-blobstore-gcs.exe -L $(BOSH_GCS_URL)

..

assets/local/agent.zip: assets/local/bosh-agent.exe assets/local/pipe.exe assets/local/service_wrapper.xml assets/local/service_wrapper.exe assets/local/bosh-blobstore-dav.exe assets/local/bosh-blobstore-gcs.exe assets/local/bosh-blobstore-s3.exe assets/local/job-service-wrapper.exe assets/local/tar.exe
	@echo "### Creating/Updating assets/local/agent.zip"
	mkdir -p assets/temp/deps
	$(CP) assets/local/service_wrapper.exe \\
		assets/local/service_wrapper.xml \\
		assets/local/bosh-agent.exe \\
		assets/temp
	$(CP) assets/local/bosh-blobstore-dav.exe \\
		assets/local/bosh-blobstore-gcs.exe \\
		assets/local/bosh-blobstore-s3.exe \\
		assets/local/job-service-wrapper.exe \\
		assets/local/pipe.exe \\
		assets/local/tar.exe \\
		assets/temp/deps
	cd assets/temp && zip -r ../local/agent.zip * && cd -
	rm -rf assets/temp
..

```

This is clearly Not Good—a binary is being fetched from a now abandoned S3 bucket and packaged directly into the built tooling, in the `agent.zip` package no less (which, we understand, is designed to run on *every single* VM that Bosh manages).

This is clearly a large supply chain compromise, leading not to a compromise of the build machine, but a compromise of all VMs managed by it.

Again, we can’t - in almost all cases - confirm exactly *who* is attempting to fetch the files on our S3 buckets, beyond identifying by IP address (which are usually dynamically allocated).

There are a couple of notable examples, however, and one was for a similar fetch, to the Linux version of the `bosh-init` package, a highly privileged tool used to manage virtual machines as part of Bosh.

```python
requestParameters.Host: s3.amazonaws.com
requestParameters.bucketName: bosh-init-artifacts
requestParameters.key: bosh-init-0.0.103-linux-amd64
UserAgent: [curl/7.64.0]

```

While this may appear to be boring - "it’s yet *another* system fetching an unsigned binary" - it gets a little more interesting when we identify through DNS PTR records that this binary was requested by several sensitive entities - including (what appear to be) **production card processing servers for a major global payment card processor. **

**There are some things money can’t buy; this includes common sense.**

We don’t want to get Watt’d here, so we’re going to leave this nameless. But, please - who cares about popping your shopping cart with MageCart tier attacks when you have (what appear to be) **card processing** servers downloading unsigned binaries from random places off the Internet.

Sigh.

### S3 Bucket Archaeology

We hope we’ve made our point - we’re seeing some high-profile organizations with big budgets and big security departments fetching (and, presumably, *trusting*) executable content from our shiny and antique S3 buckers.

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-36.png)

There is one important question we have not yet answered, though.

To really characterize just how dangerous this truly is, we need to have at least some idea of how much time has elapsed between these S3 buckets being abandoned and our adoption of them.

Did we just get lucky and time our research just after a whole bunch of organizations abandoned their S3 buckets?

> Spoiler: No.

This timebomb has been sitting unwatched for years, just waiting for someone to think, ‘Wait a minute, what if I registered that?’.

While the only organization that can answer this question with any real certainty is Amazon itself, we can get a rough indication of the scale of the time periods involved if we pay close attention to a few specific cases.

A good example stems from the following log entry:

```python
requestParameters.Host: s3.amazonaws.com
requestParameters.bucketName: mozilla-games
requestParameters.key: emscripten/releases/emsdk-1.5.6.1-full.exe

```

As you will no doubt be aware by now, it’s yet another request for an `.exe` file, and a prime target for an attacker to inject malware.

This time, the S3 bucket was previously owned by the the [emscripten project](https://github.com/emscripten-core/emscripten?ref=labs.watchtowr.com) - a very popular open-source WebAssembly compiler. While it is notable for this reason alone, we’re going to quietly disregard that factor, and instead focus on a different revelation that it can bring us.

As with previous cases we’ve seen, it seems that at some point in the past they stored their release binaries in this bucket - `mozilla-games` - and distributed them from there. At some point after this, the S3 bucket was abandoned - like all the other examples.

> This S3 bucket was even referenced in places like the Android toolchain source code:

> [https://android.googlesource.com/toolchain/rustc/+/809ee4ad5082233770316fd4303aafde8eaebcb9^1..809ee4ad5082233770316fd4303aafde8eaebcb9/](https://android.googlesource.com/toolchain/rustc/+/809ee4ad5082233770316fd4303aafde8eaebcb9%5E1..809ee4ad5082233770316fd4303aafde8eaebcb9/?ref=labs.watchtowr.com)

What’s interesting about this specific example, though, is that the S3 bucket is referenced directly from the documentation of the `emscripten` project itself, which is archived with full commit history on GitHub.

This means we are able to pinpoint the [exact commit](https://github.com/emscripten-core/emscripten/commit/3f51bacbd0fc7c9e7a16aa8438fdd3246979f1e8?ref=labs.watchtowr.com) in which this S3 bucket was removed from the documentation and ergo the point in time in which the process of decay began.

It’s important to note that this doesn’t definitively answer the question of exactly when the S3 bucket was abandoned. However, it gives us a good indication and enough to get a feel for the size of the ‘window of opportunity’ that attackers are afforded.

Worryingly, the commit to remove mention of this S3 bucket from the documentation was made in March 2015. **2015!**

It is very scary to think that the ‘window of exploitation’ for this issue is so large - it seems reasonable to assume that at any point in (we are educated-guessing) those nine years, attackers were given the opportunity to claim this abandoned S3 bucket and start serving malware, subsequently compromising hosts.

### Conclusion

![](https://storage.ghost.io/c/a0/dc/a0dcbbe4-0ae7-4d7e-90f7-ebbc3a0f5a84/content/images/2025/01/image-53.png)

*(but for infrastructure and S3 buckets)*

Our aim with this research is to demonstrate a challenge, raise awareness, and hopefully make the Internet a little more secure.

Please understand - we haven’t included everything that we saw. It would be repetitive, so we’ve tried to paint a clear picture that this gets pretty bad the more we look—and more results showing the same *bad* are not interesting.

The reality is that there is a "simple" root cause of all this strife. It’s not Amazon, S3, or even ‘the cloud’.

The root cause stems from a mindset that has grown as friction to acquiring Internet infrastructure - be it S3 buckets, domain names, IP addresses, or whatever - has lessened.

This mindset lulls us in and persuades us that Internet infrastructure is ‘easy come, easy go’.

In a world where registering a domain name costs a mere few dollars, and registering an Internet resource like an S3 bucket takes even less, it takes very little to inadvertently commit to maintaining a finite resource.

What we’re only just beginning to see, though, is that all these resources that were carelessly acquired are not only *assets,* as expected, but also bring with them their own [obligations](https://youtu.be/H7xw-oDjwXQ?ref=labs.watchtowr.com).

We showed this to great effect in our previous research, where we demonstrated the significant impact of an abandoned `whois` server - but what we truly want to impress upon our readership in this post is that this emerging phenomenon is not limited to major Internet Infrastructure—it affects each and every one of us as well.

Our final S3 bucket inclusion, that of the abandoned `mozilla-games` S3 bucket, is a great example of this.

This S3 bucket was removed from the emscripten documentation back in *2015* - that’s nine years ago, a veritable eternity in Internet years - yet we’re *still* seeing requests attempting to retrieve executables and more to this day.

The fact that an attacker could theoretically register a resource abandoned such a long time ago, and instantly serve malware to trusting hosts should alarm us all - and especially those who use the Internet in a non-paranoid way, not checking the integrity of every binary they download (i.e. 99.9999% of us).

Even the ~150 S3 buckets we acquired to carry out this research posed some hazards regarding their disposal.

Clearly, it would be reckless for watchTowr to release the S3 buckets back to the general pool after releasing a research piece disclosing their names. However, we can’t realistically take care of these S3 buckets *ad infinitum*.

Fortunately, AWS themselves agreed to ‘sinkhole’ the S3 buckets for us. We transferred ownership of almost all of the S3 buckets to AWS, who have ensured they are now unavailable for general use and removed from general circulation.

This has the net effect of removing all the risk associated with the S3 buckets we used for the research - no attacks can be carried out, leaving us free to discuss the issues in depth.

The exception to this arrangement was a few vendor-specific S3 buckets for which we had a pre-existing relationship through numerous PSIRT interactions historically - for example, `*****************` - where we had open communications and, therefore, were able to verifiably transfer the S3 buckets back to their correct and original owners.

Please also understand though that in other cases, transferring S3 buckets back to their original owner was not as simple as 'emailing 1 person in a 20,000-person organization' - we have to somehow determine that we are handing these S3 buckets to the correct person, correct department - and not a bad actor that may even exist in the same organization - or we feel that we would be partially responsible for the transfer of an S3 bucket to a malicious individual/party.

Like anyone who calls themselves a ‘hacker’, we love looking into the future, and divining new threats and dangers from the ether - like we have done in today’s post, and in our previous post concerning WHOIS infrastructure.

However, we’re starting to get just a little bit tired of warning the world of the dangers of abandoned infrastructure, so we want to assure our dear readership that our next research venture will be focused on some wholly unrelated topic.

(Unfortunately, our next most recent Internet-wide research is a minefield at the moment from a coordination perspective, and is likely some time away from public disclosure).
