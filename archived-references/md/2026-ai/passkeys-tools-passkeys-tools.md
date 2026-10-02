---
type: Article
title: Passkeys.Tools
description: This is the landing page for Passkeys.Tools, a WebAuthn testing toolkit rather than a research paper. It documents three modes - offline decoding and re-encoding of attestations and assertions, a browser extension that intercepts navigator.credentials calls before they reach the relying party, and a shared backend letting two profiles exchange challenges and credentials - aimed at testing relying-party challenge binding, signature verification and origin validation.
resource: "https://passkeys.tools"
tags: [article, webseclist-reference, en, ruhr-university-bochum-rub-nds, passkeys, webauthn, tooling, browser-extension, owasp-a07-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-14T14:01:16+00:00"
status: stable
stale_after: 2027-08-14
sources:
  - id: original
    resource: "https://passkeys.tools"
    title: Passkeys.Tools
    author: Louis Jannett, Andreas Mayer, Maximilian Westers, Vladislav Mladenov, Christian Mainka, Jörg Schwenk
also_at: []
authors:
  - Louis Jannett
  - Andreas Mayer
  - Maximilian Westers
  - Vladislav Mladenov
  - Christian Mainka
  - Jörg Schwenk
canonical_url: ""
cited_by:
  - "2026-ai.md:170"
commit: ""
content_sha256: 04cfe5e59a580ee39c444ad89b3cdf0a4eaf20bd1c340cb5d63a2980839acdd8
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://passkeys.tools"
published: ""
publisher: Ruhr University Bochum (RUB-NDS)
publisher_english: ""
raw_sha256: e9be3643cf2e5351944719445c8eccb87bc54a4f4996c88920dad21316514184
retrieved_from: "https://passkeys.tools"
retrieved_kind: stored
retrieved_utc: "2026-08-14T14:01:16+00:00"
slug: passkeys-tools-passkeys-tools
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Passkeys.Tools

**Passkeys.Tools** - Louis Jannett, Andreas Mayer, Maximilian Westers, Vladislav Mladenov, Christian Mainka, Jörg Schwenk, Ruhr University Bochum (RUB-NDS).

- Published: date not stated
- Original: <https://passkeys.tools>
- Preserved from: https://passkeys.tools (stored) on 2026-08-14
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Passkeys.Tools

 ![](https://passkeys.tools/logo.svg)

# Passkeys.Tools

## Encode, Decode, Intercept, Modify, and Exploit WebAuthn Operations

Passkeys.Tools is a comprehensive security testing and development toolkit for WebAuthn (passkey) implementations. It provides full emulation of both the client (browser) and authenticator layers, allowing security researchers, penetration testers, and developers to analyze relying party implementations for vulnerabilities and compliance issues.

**Key Capabilities:** Decode and inspect WebAuthn attestations and assertions • Craft credentials with any algorithm • Intercept and modify WebAuthn API calls • Test challenge binding, signature verification, and origin validation • Simulate cross-session attacks between multiple browser profiles • Verify compliance with the [WebAuthn specification](https://www.w3.org/TR/webauthn-3/).

###### **Standalone Mode

Offline analysis and manual crafting of WebAuthn data

A passive toolkit for decoding, modifying, and encoding WebAuthn attestations and assertions—think [jwt.io](https://www.jwt.io) but for passkeys. All data (keys, users, history) is stored locally in your browser's localStorage.

**Use when:** You have captured WebAuthn data (e.g., from network logs) and need to analyze or modify it offline.

**Example:** Decode an attestation object to inspect the credential public key, modify the signature counter, then re-encode it for replay testing.

---

###### **Interceptor Mode

Live interception and modification of WebAuthn API calls

Builds on Standalone Mode by adding real-time interception via the [browser extension](https://chromewebstore.google.com/detail/passkeystools-interceptor/jeocfgcignclemjmlnmmhlcnalfioflg). The extension hooks into the WebAuthn API to capture and modify all `navigator.credentials.create()` and `get()` calls before they reach the relying party—similar to [Burp Suite](https://portswigger.net/burp) but specialized for WebAuthn. Data remains in localStorage. Use passthrough to forward the request to your browser's or device's native authenticator (Touch ID, Windows Hello, etc.). The response is captured and displayed for inspection or modification before sending back to the relying party.

**Use when:** You need to test a relying party's server-side validation by modifying live WebAuthn responses.

**Example:** Intercept a registration, replace the challenge with random bytes, and verify if the server properly validates challenge binding. Or flip a bit in the signature to test signature verification.

---

###### **Cross-Browser Mode

Multi-browser testing with shared remote storage

Extends Interceptor Mode with a remote storage backend, enabling two browser profiles (e.g., victim and attacker) to share keys, users, and history in real-time. This is essential for testing cross-session attacks where data must flow between separate browser instances. Optional end-to-end encryption protects your data on the server.

**Use when:** You need to simulate attacks involving multiple parties, such as session binding or credential reuse across different sessions.

**Example:** In browser A (victim), start a passkey registration and dismiss it. In browser B (attacker), intercept a registration and swap in the victim's challenge. If the server accepts this, it indicates a session binding vulnerability.

###### **Create

Trigger `navigator.credentials.create()` API calls with custom PublicKeyCredentialCreationOptions. Test how the browser and authenticator handle different registration parameters, algorithms, and attestation preferences.

###### **Get

Trigger `navigator.credentials.get()` API calls with custom PublicKeyCredentialRequestOptions. Test authentication flows with specific credential IDs, user verification requirements, and mediation settings.

###### **Attestation

Decode, inspect, modify, and re-encode attestation objects and clientDataJSON. Supports `none` and `packed` attestation formats. Manipulate flags, AAGUID, credential IDs, public keys, and extensions.

###### **Assertion

Decode, modify, and encode assertion authenticatorData, clientDataJSON, and signatures. Sign assertions using stored private keys or verify existing signatures against stored public keys.

###### **Keys

Manage cryptographic keys with full import/export support. Generate key pairs for all WebAuthn algorithms (ES256, ES384, ES512, RS256, PS256, EdDSA, etc.). Associate credential IDs with keys for realistic credential emulation.

###### **Users

Store and manage user account data including RP IDs, usernames, display names, and user handles. Users are automatically captured during registration interceptions for easy reuse in authentication tests.

###### **History

Complete audit log of all intercepted operations. Search, filter, and export entries. Copy values between sessions to perform cross-operation attacks like challenge swapping or credential reuse.

###### **Converters

Encoding utilities for Base64, Base64URL, and Hex conversions. Convert keys between JWK, COSE, PEM, and DER formats for compatibility with different tools and libraries.

###### **Interceptor

Central hub for live WebAuthn interception (requires [browser extension](https://chromewebstore.google.com/detail/passkeystools-interceptor/jeocfgcignclemjmlnmmhlcnalfioflg)). View request details, select credentials and keys, apply one-click security tests (challenge manipulation, signature tampering, flag modifications), and craft custom responses. Use passthrough to forward requests to your native authenticator and capture real responses for inspection or modification.

Follow these step-by-step instructions to set up your preferred usage mode:

###### **Standalone Mode Setup

No setup required! Simply open Passkeys.Tools in your browser and start using the Attestation, Assertion, Keys, and Converters tabs. All data is automatically stored in your browser's localStorage and persists across sessions.

---

###### **Interceptor Mode Setup

To intercept live WebAuthn operations, you need to install and configure the browser extension:

-  **Install the extension:** Install the extension from the [Chrome Web Store](https://chromewebstore.google.com/detail/passkeystools-interceptor/jeocfgcignclemjmlnmmhlcnalfioflg).
-  **Configure the extension:** Click the extension icon in your browser toolbar to open the popup. Configure these settings:

- **Frontend URL:** The URL of your Passkeys.Tools instance (default: `https://passkeys.tools`). Change this if you're self-hosting.
- **Operation Mode:** Select *Default*. Each website gets its own credential scoped to that website (normal behavior).
- **Popup Display Mode:** Choose *Detached Window* (opens in a separate 1200x800 window) or *Inline Popup* (opens as an overlay).

-  **Storage:** Data is stored in your browser's localStorage by default. No additional configuration needed.
-  **Start intercepting:** Visit any website that uses WebAuthn passkeys. When a registration or authentication is triggered, Passkeys.Tools will open automatically, allowing you to inspect and modify the request before responding.

---

###### **Cross-Browser Mode Setup

To share data between multiple browser profiles or browsers, you need to configure the extension for profile mode and enable remote storage:

-  **Install the extension** from the [Chrome Web Store](https://chromewebstore.google.com/detail/passkeystools-interceptor/jeocfgcignclemjmlnmmhlcnalfioflg) in all Chrome profiles you want to use.
-  **Configure Operation Mode:** In the extension popup, select *Profile 1* in one browser (e.g., attacker) and *Profile 2* in another (e.g., victim). All websites will share the same credential scoped to the selected profile, enabling cross-browser credential swapping tests.
-  **Enable Remote Storage:** Navigate to the Settings tab and select *Remote Storage* mode.
-  **Set the Server URL:** Enter the URL of your storage backend:

- *Hosted backend:* Use our provided backend at `https://db.passkeys.tools` (no setup required).
- *Self-hosted:* Run your own backend server and enter its URL.

-  **Configure a Secret:** Enter a unique secret string. This secret:

- Acts as your "account identifier" on the backend—all browsers using the same secret share the same data.
- Must be identical across all browsers/profiles you want to sync.
- Should be kept private; anyone with your secret can access your stored data.
- **Important:** If you lose your secret while using E2E encryption, your encrypted data cannot be recovered. Store your secret securely.

-  **Enable End-to-End Encryption (recommended):** When enabled, all data is encrypted in your browser before being sent to the server. The server only stores encrypted blobs and cannot read your keys, users, or history. The encryption key is derived from your secret and never leaves your browser.
-  **Apply settings in all browsers:** Use the exact same Server URL, Secret, and E2E Encryption setting in every browser profile that should share data.
-  **Verify sync:** Create a test key in one browser, then check the Keys tab in another browser—it should appear automatically.
