# Tag vocabulary
The controlled vocabulary for `digest.tags` in `archived-references/manifest.json`.

**The record is [tag-vocabulary.json](tag-vocabulary.json); this file is a reading
of it.** Both are generated — edit the JSON, never this. Counts are recomputed from
the manifest on every rebuild; `aliases` and the OWASP mapping are stated by hand in
the JSON and survive untouched.

## How to use it
- Up to 10 tags per document. There is no minimum: a document honestly served by
  one tag keeps one.
- **Use a tag from the list before inventing one.** That is the whole point of a
  vocabulary — a reader searching `prototype-pollution` should find every document
  about it, not the two-thirds that happened to pick that spelling.
- A tag the list does not have is still allowed. Write it, and it is adopted and
  reported. Refusing it threw away the one moment someone had actually read the
  document. A `?` prefix still marks it as a proposal you want looked at, and it is
  kept rather than stripped.
- Tags must name the **techniques the research actually uses**. That is what a
  reader searches for, and no count can check it.
- A tag is a retrieval key, not a summary. If it would apply to almost every
  document in the archive, it is not earning its place.

## How drift is prevented
Not by refusal — by folding, before anything is written:

- **Case and punctuation never make a second tag.** `XSS`, `xss` and `  XSS ` are
  one tag. The archive did carry both spellings; the capitalised one had a single
  document.
- **A synonym is folded by an alias.** Add it to `aliases` in the JSON and the old
  spelling can never be published again — `wasm` publishes as `webassembly`.
- `sop-bypass` and `same-origin-policy` deliberately coexist, for the attack and the
  mechanism. Do not add a third spelling of either.
- **Two names for one thing are kept when a reader might arrive by either.** Tags
  are a way IN — for people and for models searching the archive — so `passkeys`
  and `webauthn` both stay, on all ten documents, even though they co-occur
  perfectly. An alias is for a spelling nobody should land on (`wasm`), not for a
  word somebody would reasonably search.

A tag that has fallen to zero documents is **kept**, at `documents: 0`. It was
agreed once, and deleting it would let the same word be re-argued later and would
throw away its OWASP mapping.

**An alias to the empty string retires a word for good.** It resolves to nothing
and is dropped before publication, so a tag that was decided against cannot come
back by being typed again. Three are retired:

| Retired | Why |
|---|---|
| `novel-technique` | was on 743 documents, 45% of the archive. This is a list OF novel techniques, so the tag restated the premise and narrowed no search |
| `server` | three unrelated documents — a botnet scan, a Rails YAML bug, an XML retrieval talk — left over from folding the capitalised `Server` |
| `malicious-server` | one document, and "the attacker controls a server" describes a large share of the archive |

`smuggling` is deliberately NOT folded into `request-smuggling`: it carries cookie,
header and data smuggling, and merging it would mislabel most of its documents.

## OWASP Top 10
Categories are **derived, never typed**. A reviewer tags the techniques; the mapping
in the JSON turns those into categories, which reach the published file as
`owasp-a03-2021` and so on. Nobody tags a document twice, and nobody has to remember
which category a technique belongs to. The mapping is a judgement — edit it in the
JSON.

## The vocabulary

361 tags, across 2459 documents that carry a digest.

| Tag | Documents | OWASP |
|---|---|---|
| `abuse-of-functionality` | 84 | A04:2021 |
| `access-control` | 14 | — |
| `account-takeover` | 11 | — |
| `active-directory` | 1 | — |
| `activex` | 13 | — |
| `adversarial-image` | 1 | — |
| `ai` | 10 | — |
| `ai-agent` | 138 | — |
| `ai-assisted-research` | 3 | — |
| `algorithmic-complexity` | 38 | A04:2021 |
| `ambient-light-sensor` | 1 | — |
| `android` | 37 | — |
| `angular` | 3 | — |
| `apache` | 6 | — |
| `api-key` | 2 | — |
| `argument-injection` | 7 | A03:2021 |
| `aslr` | 1 | — |
| `aspnet` | 57 | — |
| `attack-chain` | 318 | — |
| `auth-bypass` | 424 | A01:2021 |
| `authentication` | 2 | — |
| `autofill` | 5 | — |
| `aws` | 53 | — |
| `azure` | 21 | — |
| `backup` | 1 | — |
| `bash` | 2 | — |
| `benchmark` | 0 | — |
| `binary-planting` | 3 | — |
| `blind-xss` | 1 | A03:2021 |
| `blockchain` | 8 | — |
| `browser` | 53 | — |
| `browser-automation` | 9 | — |
| `browser-extension` | 99 | — |
| `browser-fingerprinting` | 36 | — |
| `browser-history` | 3 | — |
| `bug-bounty` | 170 | — |
| `build-system` | 1 | — |
| `c` | 1 | — |
| `cache` | 81 | — |
| `cache-deception` | 12 | — |
| `cache-poisoning` | 115 | — |
| `callback-injection` | 1 | — |
| `captcha-bypass` | 5 | A04:2021 |
| `case-study` | 335 | — |
| `cdn` | 63 | — |
| `certificate-transparency` | 2 | — |
| `certificate-validation` | 2 | — |
| `charset` | 41 | A02:2021 |
| `ci-cd` | 45 | A08:2021 |
| `cicd` | 2 | — |
| `class-pollution` | 5 | A08:2021 |
| `clickjacking` | 60 | A04:2021 |
| `clipboard` | 4 | — |
| `cloud` | 15 | — |
| `cloud-storage` | 1 | — |
| `cloudflare` | 18 | — |
| `code-audit` | 3 | — |
| `code-coverage` | 1 | — |
| `code-injection` | 15 | — |
| `code-review` | 3 | — |
| `coercion` | 1 | — |
| `command-and-control` | 5 | — |
| `command-injection` | 93 | A03:2021 |
| `compression` | 4 | — |
| `configuration` | 11 | — |
| `content-type` | 46 | A05:2021 |
| `cookie` | 161 | A07:2021 |
| `corb` | 1 | — |
| `cors` | 33 | A01:2021 |
| `credential-exposure` | 6 | — |
| `credential-theft` | 24 | — |
| `cross-tenant` | 7 | — |
| `crypto` | 27 | A02:2021 |
| `csp` | 83 | A05:2021 |
| `csrf` | 172 | A01:2021 |
| `css` | 80 | — |
| `css-injection` | 43 | A03:2021 |
| `csti` | 6 | A03:2021 |
| `cve` | 274 | — |
| `data-breach` | 5 | — |
| `data-exfiltration` | 23 | — |
| `database` | 80 | — |
| `deanonymization` | 29 | — |
| `deep-link` | 2 | — |
| `default-credentials` | 3 | — |
| `defence` | 67 | — |
| `deobfuscation` | 1 | — |
| `dependency-confusion` | 3 | A06:2021 |
| `deserialization` | 113 | A08:2021 |
| `desktop-app` | 14 | — |
| `desync` | 44 | — |
| `detection` | 153 | A09:2021 |
| `differential-fuzzing` | 1 | — |
| `django` | 11 | — |
| `dns` | 101 | — |
| `dns-rebinding` | 39 | A10:2021 |
| `docker` | 10 | A05:2021 |
| `dom` | 151 | — |
| `dom-clobbering` | 16 | A08:2021 |
| `domain-takeover` | 6 | — |
| `dompurify` | 3 | — |
| `dos` | 138 | — |
| `dotnet` | 81 | — |
| `drupal` | 15 | — |
| `dynamic-analysis` | 101 | — |
| `e2ee` | 1 | — |
| `egress` | 2 | — |
| `elasticsearch` | 3 | — |
| `electron` | 20 | — |
| `email` | 65 | — |
| `embedded-device` | 12 | — |
| `encoding` | 94 | — |
| `entra` | 4 | — |
| `environment-variables` | 4 | — |
| `evaluation` | 5 | — |
| `evasion` | 6 | — |
| `exploit-development` | 2 | — |
| `exploit-validation` | 1 | — |
| `express` | 9 | — |
| `file-read` | 22 | — |
| `file-upload` | 111 | — |
| `file-write` | 40 | — |
| `filesystem` | 1 | — |
| `filter-bypass` | 331 | A05:2021 |
| `firefox` | 5 | — |
| `flash` | 61 | — |
| `flask` | 7 | — |
| `forensics` | 1 | — |
| `formal-analysis` | 36 | — |
| `format-string` | 2 | — |
| `ftp` | 11 | — |
| `fullscreen` | 1 | — |
| `fuzzing` | 73 | — |
| `gadget-chain` | 121 | A08:2021 |
| `gadget-discovery` | 1 | — |
| `gcp` | 14 | — |
| `ghostscript` | 2 | — |
| `git` | 1 | — |
| `github` | 31 | — |
| `github-actions` | 24 | A08:2021 |
| `gitlab` | 10 | — |
| `go` | 18 | — |
| `graph` | 3 | — |
| `graphql` | 17 | — |
| `grpc` | 1 | — |
| `hash-collision` | 7 | A02:2021 |
| `header-injection` | 80 | A03:2021 |
| `heap-overflow` | 1 | — |
| `homograph` | 5 | — |
| `htaccess` | 1 | — |
| `html-injection` | 5 | — |
| `html5` | 2 | — |
| `http` | 262 | — |
| `http2` | 35 | — |
| `http3` | 14 | — |
| `https` | 108 | A02:2021 |
| `iam` | 8 | — |
| `identity` | 41 | A07:2021 |
| `idor` | 30 | A01:2021 |
| `iframe` | 144 | — |
| `image-processing` | 1 | — |
| `imagemagick` | 4 | — |
| `incident-response` | 1 | — |
| `info-leak` | 704 | — |
| `information-flow` | 1 | — |
| `injection` | 146 | A03:2021 |
| `input-validation` | 3 | — |
| `insecure-default` | 2 | — |
| `insecure-defaults` | 1 | — |
| `integer-underflow` | 3 | — |
| `ios` | 19 | — |
| `ipc` | 1 | — |
| `jailbreak` | 4 | — |
| `java` | 137 | — |
| `javascript` | 438 | — |
| `javascript-bridge` | 3 | — |
| `javascript-runtime` | 23 | — |
| `jenkins` | 3 | — |
| `jit` | 2 | — |
| `joomla` | 6 | — |
| `jwt` | 26 | A07:2021 |
| `key-management` | 1 | — |
| `key-recovery` | 4 | — |
| `key-reuse` | 1 | — |
| `keyboard-lock` | 1 | — |
| `kubernetes` | 8 | A05:2021 |
| `laravel` | 2 | — |
| `large-scale-scan` | 140 | — |
| `lfi` | 39 | A01:2021, A03:2021 |
| `libfuzzer` | 2 | — |
| `linux` | 2 | — |
| `llm` | 70 | — |
| `llvm` | 2 | — |
| `load-balancer` | 19 | — |
| `localhost` | 15 | — |
| `magento` | 1 | — |
| `malware` | 4 | — |
| `malware-analysis` | 1 | — |
| `mass-assignment` | 12 | A01:2021 |
| `mcp` | 14 | — |
| `measurement-study` | 268 | — |
| `memory-corruption` | 39 | — |
| `memory-poisoning` | 2 | — |
| `mercurial` | 1 | — |
| `message-protocol` | 3 | — |
| `methodology` | 16 | — |
| `mime` | 44 | A05:2021 |
| `mitigation` | 196 | — |
| `mobile-web` | 2 | — |
| `mongodb` | 6 | — |
| `mssql` | 14 | — |
| `mutation-xss` | 12 | A03:2021 |
| `mysql` | 24 | — |
| `native-addon` | 2 | — |
| `native-messaging` | 1 | — |
| `nextjs` | 15 | — |
| `nginx` | 6 | — |
| `nodejs` | 94 | — |
| `nosqli` | 10 | A03:2021 |
| `npm` | 1 | — |
| `ntlm` | 5 | — |
| `null-byte` | 1 | — |
| `oauth` | 96 | A07:2021 |
| `object-injection` | 4 | — |
| `oidc` | 1 | — |
| `open-redirect` | 72 | A04:2021 |
| `openid` | 35 | A07:2021 |
| `origin-validation` | 15 | — |
| `padding-oracle` | 1 | — |
| `parser-differential` | 264 | — |
| `passkeys` | 13 | A07:2021 |
| `password-manager` | 5 | — |
| `patch-bypass` | 6 | — |
| `patch-diffing` | 5 | — |
| `path-traversal` | 104 | A01:2021 |
| `pdf` | 36 | — |
| `perl` | 4 | — |
| `persistence` | 5 | — |
| `phishing` | 60 | A04:2021 |
| `php` | 164 | — |
| `pki` | 2 | — |
| `policy-bypass` | 6 | — |
| `postgres` | 11 | — |
| `postmessage` | 45 | — |
| `postscript` | 1 | — |
| `powershell` | 1 | — |
| `predictable-token` | 10 | A02:2021 |
| `prior-art-extension` | 61 | — |
| `privacy` | 18 | — |
| `privilege-escalation` | 149 | A01:2021 |
| `prng` | 3 | — |
| `prompt-injection` | 90 | A03:2021 |
| `prototype-pollution` | 36 | A08:2021 |
| `provenance` | 1 | — |
| `proxy` | 104 | — |
| `python` | 49 | — |
| `race-condition` | 46 | A04:2021 |
| `rag` | 5 | — |
| `rails` | 18 | — |
| `rbac` | 1 | — |
| `rce` | 464 | — |
| `react` | 9 | — |
| `redirect` | 6 | — |
| `redis` | 6 | — |
| `redos` | 5 | — |
| `regex` | 4 | — |
| `relay-attack` | 3 | — |
| `reproduction` | 1 | — |
| `request-smuggling` | 63 | — |
| `response-splitting` | 20 | A03:2021 |
| `rest-api` | 58 | — |
| `reverse-engineering` | 4 | — |
| `reverse-proxy` | 68 | — |
| `ruby` | 43 | — |
| `rust` | 4 | — |
| `same-origin-policy` | 202 | A01:2021 |
| `saml` | 25 | A07:2021 |
| `sandbox` | 2 | — |
| `sandbox-escape` | 108 | — |
| `sanitizer-bypass` | 100 | A05:2021 |
| `scanner` | 7 | — |
| `scanner-bypass` | 2 | — |
| `secret-scanning` | 1 | — |
| `security-misconfiguration` | 1 | — |
| `service-worker` | 18 | — |
| `session` | 3 | — |
| `session-cookie` | 8 | — |
| `session-fixation` | 43 | A07:2021 |
| `session-forgery` | 1 | — |
| `session-hijacking` | 1 | — |
| `sharepoint` | 1 | — |
| `side-channel` | 238 | — |
| `signature-replay` | 2 | — |
| `signature-verification` | 3 | — |
| `skills` | 2 | — |
| `smb` | 2 | — |
| `smtp` | 20 | — |
| `smtp-smuggling` | 1 | — |
| `smuggling` | 15 | — |
| `snmp` | 2 | — |
| `soap` | 14 | — |
| `sop-bypass` | 208 | A01:2021 |
| `spring` | 18 | — |
| `sqli` | 80 | A03:2021 |
| `sso` | 78 | A07:2021 |
| `ssrf` | 124 | A10:2021 |
| `ssti` | 35 | A03:2021 |
| `static-analysis` | 93 | — |
| `steganography` | 2 | — |
| `struts` | 4 | — |
| `subdomain-takeover` | 3 | — |
| `supabase` | 2 | — |
| `supply-chain` | 98 | A06:2021 |
| `survey` | 20 | — |
| `svg` | 2 | — |
| `symfony` | 3 | — |
| `test-runner` | 1 | — |
| `timing-attack` | 103 | — |
| `tls` | 129 | A02:2021 |
| `toctou` | 18 | A04:2021 |
| `token-theft` | 5 | — |
| `tool-use` | 3 | — |
| `tooling` | 412 | — |
| `trust-boundary` | 14 | — |
| `twig` | 1 | — |
| `type-confusion` | 4 | — |
| `typosquatting` | 13 | A06:2021 |
| `ui-redress` | 80 | A04:2021 |
| `ui-redressing` | 2 | — |
| `unicode` | 51 | — |
| `uninitialized-memory` | 1 | — |
| `uri-scheme` | 14 | — |
| `url-parsing` | 137 | — |
| `url-spoofing` | 12 | — |
| `use-after-free` | 5 | — |
| `user-enumeration` | 10 | A04:2021 |
| `v8` | 1 | — |
| `vendor-advisory` | 66 | — |
| `viewstate` | 2 | — |
| `visual-grounding` | 1 | — |
| `vue` | 2 | — |
| `vulnerability-research` | 5 | — |
| `vulnerability-scanning` | 2 | — |
| `waf` | 17 | A05:2021 |
| `waf-bypass` | 82 | A05:2021 |
| `web-cache` | 1 | — |
| `webassembly` | 6 | — |
| `webauthn` | 14 | A07:2021 |
| `webdav` | 2 | — |
| `webgl` | 2 | — |
| `webrtc` | 13 | — |
| `websocket` | 21 | — |
| `webview` | 5 | — |
| `wordpress` | 37 | — |
| `xml` | 12 | — |
| `xsleak` | 81 | — |
| `xslt` | 1 | — |
| `xss` | 462 | A03:2021 |
| `xssi` | 1 | — |
| `xxe` | 45 | A03:2021 |
| `yaml` | 3 | — |

### Never published

These spellings fold into another tag before anything is written:

| Written | Published as |
|---|---|
| `arbitrary-file-write` | `file-write` |
| `authorization` | `access-control` |
| `code-execution` | `rce` |
| `cryptography` | `crypto` |
| `denial-of-service` | `dos` |
| `exfiltration` | `data-exfiltration` |
| `fingerprinting` | `browser-fingerprinting` |
| `information-disclosure` | `info-leak` |
| `malicious-server` | `` |
| `novel-technique` | `` |
| `patch-analysis` | `patch-diffing` |
| `protocol-handler` | `uri-scheme` |
| `security-tooling` | `tooling` |
| `server` | `` |
| `software-supply-chain` | `supply-chain` |
| `sql-injection` | `sqli` |
| `wasm` | `webassembly` |
| `xs-leak` | `xsleak` |

### OWASP Top 10:2021

A document earns these from the techniques it is already tagged with; nobody tags them by hand.

| Category | Tags |
|---|---|
| `A01:2021` Broken Access Control | `auth-bypass`, `cors`, `csrf`, `directory-listing`, `idor`, `lfi`, `mass-assignment`, `path-traversal`, `privilege-escalation`, `same-origin-policy`, `sop-bypass` |
| `A02:2021` Cryptographic Failures | `charset`, `crypto`, `hash-collision`, `https`, `predictable-token`, `tls` |
| `A03:2021` Injection | `argument-injection`, `blind-xss`, `command-injection`, `css-injection`, `csti`, `header-injection`, `injection`, `lfi`, `mutation-xss`, `nosqli`, `prompt-injection`, `response-splitting`, `sqli`, `ssti`, `xss`, `xxe` |
| `A04:2021` Insecure Design | `abuse-of-functionality`, `algorithmic-complexity`, `captcha-bypass`, `clickjacking`, `open-redirect`, `phishing`, `race-condition`, `toctou`, `ui-redress`, `user-enumeration` |
| `A05:2021` Security Misconfiguration | `content-type`, `csp`, `docker`, `filter-bypass`, `kubernetes`, `mime`, `sanitizer-bypass`, `waf`, `waf-bypass` |
| `A06:2021` Vulnerable and Outdated Components | `dependency-confusion`, `supply-chain`, `typosquatting` |
| `A07:2021` Identification and Authentication Failures | `cookie`, `identity`, `jwt`, `oauth`, `openid`, `passkeys`, `saml`, `session-fixation`, `sso`, `webauthn` |
| `A08:2021` Software and Data Integrity Failures | `ci-cd`, `class-pollution`, `deserialization`, `dom-clobbering`, `gadget-chain`, `github-actions`, `prototype-pollution` |
| `A09:2021` Security Logging and Monitoring Failures | `detection` |
| `A10:2021` Server-Side Request Forgery | `dns-rebinding`, `ssrf` |

### Used exactly once

Review these before reusing them: `active-directory`, `adversarial-image`, `ambient-light-sensor`, `aslr`, `backup`, `blind-xss`, `build-system`, `c`, `callback-injection`, `cloud-storage`, `code-coverage`, `coercion`, `corb`, `deobfuscation`, `differential-fuzzing`, `e2ee`, `exploit-validation`, `filesystem`, `forensics`, `fullscreen`, `gadget-discovery`, `git`, `grpc`, `heap-overflow`, `htaccess`, `image-processing`, `incident-response`, `information-flow`, `insecure-defaults`, `ipc`, `key-management`, `key-reuse`, `keyboard-lock`, `magento`, `malware-analysis`, `mercurial`, `native-messaging`, `npm`, `null-byte`, `oidc`, `padding-oracle`, `postscript`, `powershell`, `provenance`, `rbac`, `reproduction`, `secret-scanning`, `security-misconfiguration`, `session-forgery`, `session-hijacking`, `sharepoint`, `smtp-smuggling`, `test-runner`, `twig`, `uninitialized-memory`, `v8`, `visual-grounding`, `web-cache`, `xslt`, `xssi`

### Carried, but on no document

Agreed once and kept so the same word is not re-argued: `benchmark`
