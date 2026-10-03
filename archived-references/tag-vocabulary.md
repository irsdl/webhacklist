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

297 tags, across 2281 documents that carry a digest.

| Tag | Documents | OWASP |
|---|---|---|
| `abuse-of-functionality` | 83 | A04:2021 |
| `account-takeover` | 9 | — |
| `active-directory` | 1 | — |
| `activex` | 13 | — |
| `ai` | 10 | — |
| `ai-agent` | 106 | — |
| `ai-assisted-research` | 3 | — |
| `algorithmic-complexity` | 37 | A04:2021 |
| `android` | 36 | — |
| `angular` | 3 | — |
| `apache` | 3 | — |
| `api-key` | 1 | — |
| `argument-injection` | 5 | A03:2021 |
| `aspnet` | 57 | — |
| `attack-chain` | 306 | — |
| `auth-bypass` | 408 | A01:2021 |
| `autofill` | 5 | — |
| `aws` | 45 | — |
| `azure` | 19 | — |
| `backup` | 1 | — |
| `bash` | 2 | — |
| `binary-planting` | 3 | — |
| `blind-xss` | 1 | A03:2021 |
| `blockchain` | 8 | — |
| `browser` | 37 | — |
| `browser-automation` | 3 | — |
| `browser-extension` | 98 | — |
| `browser-fingerprinting` | 36 | — |
| `browser-history` | 3 | — |
| `bug-bounty` | 170 | — |
| `c` | 1 | — |
| `cache` | 78 | — |
| `cache-deception` | 11 | — |
| `cache-poisoning` | 111 | — |
| `captcha-bypass` | 5 | A04:2021 |
| `case-study` | 326 | — |
| `cdn` | 61 | — |
| `charset` | 41 | A02:2021 |
| `ci-cd` | 41 | A08:2021 |
| `cicd` | 2 | — |
| `class-pollution` | 5 | A08:2021 |
| `clickjacking` | 60 | A04:2021 |
| `clipboard` | 4 | — |
| `cloud` | 11 | — |
| `cloudflare` | 18 | — |
| `code-audit` | 1 | — |
| `code-coverage` | 1 | — |
| `code-injection` | 12 | — |
| `command-and-control` | 2 | — |
| `command-injection` | 84 | A03:2021 |
| `configuration` | 9 | — |
| `content-type` | 46 | A05:2021 |
| `cookie` | 159 | A07:2021 |
| `corb` | 1 | — |
| `cors` | 32 | A01:2021 |
| `credential-exposure` | 5 | — |
| `credential-theft` | 17 | — |
| `cross-tenant` | 5 | — |
| `crypto` | 23 | A02:2021 |
| `csp` | 77 | A05:2021 |
| `csrf` | 170 | A01:2021 |
| `css` | 78 | — |
| `css-injection` | 39 | A03:2021 |
| `csti` | 6 | A03:2021 |
| `cve` | 268 | — |
| `data-breach` | 5 | — |
| `data-exfiltration` | 11 | — |
| `database` | 79 | — |
| `deanonymization` | 29 | — |
| `deep-link` | 2 | — |
| `default-credentials` | 3 | — |
| `defence` | 65 | — |
| `dependency-confusion` | 2 | A06:2021 |
| `deserialization` | 107 | A08:2021 |
| `desktop-app` | 14 | — |
| `desync` | 44 | — |
| `detection` | 144 | A09:2021 |
| `differential-fuzzing` | 1 | — |
| `django` | 11 | — |
| `dns` | 100 | — |
| `dns-rebinding` | 39 | A10:2021 |
| `docker` | 9 | A05:2021 |
| `dom` | 150 | — |
| `dom-clobbering` | 16 | A08:2021 |
| `domain-takeover` | 6 | — |
| `dompurify` | 2 | — |
| `dos` | 129 | — |
| `dotnet` | 81 | — |
| `drupal` | 7 | — |
| `dynamic-analysis` | 98 | — |
| `egress` | 2 | — |
| `elasticsearch` | 3 | — |
| `electron` | 18 | — |
| `email` | 63 | — |
| `embedded-device` | 12 | — |
| `encoding` | 94 | — |
| `entra` | 4 | — |
| `environment-variables` | 3 | — |
| `evaluation` | 1 | — |
| `evasion` | 5 | — |
| `express` | 9 | — |
| `file-read` | 14 | — |
| `file-upload` | 102 | — |
| `file-write` | 26 | — |
| `filter-bypass` | 326 | A05:2021 |
| `firefox` | 5 | — |
| `flash` | 57 | — |
| `flask` | 6 | — |
| `formal-analysis` | 36 | — |
| `format-string` | 2 | — |
| `ftp` | 11 | — |
| `fullscreen` | 1 | — |
| `fuzzing` | 70 | — |
| `gadget-chain` | 115 | A08:2021 |
| `gcp` | 14 | — |
| `ghostscript` | 1 | — |
| `git` | 1 | — |
| `github` | 31 | — |
| `github-actions` | 22 | A08:2021 |
| `gitlab` | 10 | — |
| `go` | 18 | — |
| `graph` | 2 | — |
| `graphql` | 15 | — |
| `hash-collision` | 7 | A02:2021 |
| `header-injection` | 79 | A03:2021 |
| `homograph` | 2 | — |
| `html-injection` | 5 | — |
| `html5` | 2 | — |
| `http` | 253 | — |
| `http2` | 34 | — |
| `http3` | 13 | — |
| `https` | 108 | A02:2021 |
| `iam` | 2 | — |
| `identity` | 39 | A07:2021 |
| `idor` | 30 | A01:2021 |
| `iframe` | 144 | — |
| `imagemagick` | 1 | — |
| `info-leak` | 691 | — |
| `injection` | 145 | A03:2021 |
| `insecure-default` | 2 | — |
| `insecure-defaults` | 1 | — |
| `integer-underflow` | 3 | — |
| `ios` | 19 | — |
| `jailbreak` | 4 | — |
| `java` | 135 | — |
| `javascript` | 428 | — |
| `javascript-bridge` | 3 | — |
| `javascript-runtime` | 22 | — |
| `jenkins` | 3 | — |
| `jit` | 1 | — |
| `joomla` | 6 | — |
| `jwt` | 25 | A07:2021 |
| `keyboard-lock` | 1 | — |
| `kubernetes` | 8 | A05:2021 |
| `laravel` | 2 | — |
| `large-scale-scan` | 137 | — |
| `lfi` | 39 | A01:2021, A03:2021 |
| `libfuzzer` | 2 | — |
| `linux` | 2 | — |
| `llm` | 66 | — |
| `llvm` | 2 | — |
| `load-balancer` | 19 | — |
| `localhost` | 15 | — |
| `malware` | 2 | — |
| `mass-assignment` | 12 | A01:2021 |
| `mcp` | 9 | — |
| `measurement-study` | 267 | — |
| `memory-corruption` | 18 | — |
| `message-protocol` | 3 | — |
| `methodology` | 7 | — |
| `mime` | 43 | A05:2021 |
| `mitigation` | 192 | — |
| `mobile-web` | 2 | — |
| `mongodb` | 6 | — |
| `mssql` | 11 | — |
| `mutation-xss` | 12 | A03:2021 |
| `mysql` | 24 | — |
| `nextjs` | 15 | — |
| `nginx` | 6 | — |
| `nodejs` | 89 | — |
| `nosqli` | 10 | A03:2021 |
| `ntlm` | 5 | — |
| `oauth` | 94 | A07:2021 |
| `object-injection` | 4 | — |
| `open-redirect` | 71 | A04:2021 |
| `openid` | 35 | A07:2021 |
| `origin-validation` | 15 | — |
| `parser-differential` | 241 | — |
| `passkeys` | 13 | A07:2021 |
| `password-manager` | 5 | — |
| `patch-bypass` | 4 | — |
| `patch-diffing` | 1 | — |
| `path-traversal` | 93 | A01:2021 |
| `pdf` | 35 | — |
| `perl` | 4 | — |
| `phishing` | 56 | A04:2021 |
| `php` | 145 | — |
| `policy-bypass` | 1 | — |
| `postgres` | 11 | — |
| `postmessage` | 44 | — |
| `postscript` | 1 | — |
| `predictable-token` | 8 | A02:2021 |
| `prior-art-extension` | 60 | — |
| `privacy` | 16 | — |
| `privilege-escalation` | 139 | A01:2021 |
| `prng` | 1 | — |
| `prompt-injection` | 72 | A03:2021 |
| `prototype-pollution` | 35 | A08:2021 |
| `proxy` | 95 | — |
| `python` | 48 | — |
| `race-condition` | 43 | A04:2021 |
| `rag` | 5 | — |
| `rails` | 18 | — |
| `rbac` | 1 | — |
| `rce` | 428 | — |
| `react` | 7 | — |
| `redirect` | 6 | — |
| `redis` | 6 | — |
| `redos` | 3 | — |
| `regex` | 1 | — |
| `relay-attack` | 2 | — |
| `request-smuggling` | 62 | — |
| `response-splitting` | 20 | A03:2021 |
| `rest-api` | 57 | — |
| `reverse-engineering` | 3 | — |
| `reverse-proxy` | 68 | — |
| `ruby` | 42 | — |
| `rust` | 4 | — |
| `same-origin-policy` | 198 | A01:2021 |
| `saml` | 22 | A07:2021 |
| `sandbox-escape` | 101 | — |
| `sanitizer-bypass` | 99 | A05:2021 |
| `scanner` | 6 | — |
| `scanner-bypass` | 2 | — |
| `secret-scanning` | 1 | — |
| `service-worker` | 17 | — |
| `session` | 2 | — |
| `session-cookie` | 8 | — |
| `session-fixation` | 43 | A07:2021 |
| `sharepoint` | 1 | — |
| `side-channel` | 236 | — |
| `smb` | 2 | — |
| `smtp` | 20 | — |
| `smuggling` | 15 | — |
| `snmp` | 2 | — |
| `soap` | 14 | — |
| `sop-bypass` | 205 | A01:2021 |
| `spring` | 18 | — |
| `sqli` | 79 | A03:2021 |
| `sso` | 76 | A07:2021 |
| `ssrf` | 120 | A10:2021 |
| `ssti` | 27 | A03:2021 |
| `static-analysis` | 88 | — |
| `steganography` | 2 | — |
| `struts` | 4 | — |
| `subdomain-takeover` | 3 | — |
| `supabase` | 2 | — |
| `supply-chain` | 86 | A06:2021 |
| `survey` | 19 | — |
| `symfony` | 1 | — |
| `test-runner` | 1 | — |
| `timing-attack` | 103 | — |
| `tls` | 120 | A02:2021 |
| `toctou` | 18 | A04:2021 |
| `token-theft` | 4 | — |
| `tool-use` | 3 | — |
| `tooling` | 386 | — |
| `trust-boundary` | 12 | — |
| `type-confusion` | 4 | — |
| `typosquatting` | 9 | A06:2021 |
| `ui-redress` | 80 | A04:2021 |
| `ui-redressing` | 2 | — |
| `unicode` | 45 | — |
| `uri-scheme` | 12 | — |
| `url-parsing` | 136 | — |
| `url-spoofing` | 12 | — |
| `use-after-free` | 2 | — |
| `user-enumeration` | 10 | A04:2021 |
| `vendor-advisory` | 60 | — |
| `viewstate` | 1 | — |
| `vue` | 2 | — |
| `vulnerability-research` | 2 | — |
| `waf` | 17 | A05:2021 |
| `waf-bypass` | 82 | A05:2021 |
| `webassembly` | 6 | — |
| `webauthn` | 14 | A07:2021 |
| `webdav` | 2 | — |
| `webgl` | 2 | — |
| `webrtc` | 13 | — |
| `websocket` | 20 | — |
| `webview` | 4 | — |
| `wordpress` | 34 | — |
| `xml` | 10 | — |
| `xsleak` | 81 | — |
| `xss` | 448 | A03:2021 |
| `xxe` | 43 | A03:2021 |
| `yaml` | 3 | — |

### Never published

These spellings fold into another tag before anything is written:

| Written | Published as |
|---|---|
| `code-execution` | `rce` |
| `fingerprinting` | `browser-fingerprinting` |
| `malicious-server` | `` |
| `novel-technique` | `` |
| `server` | `` |
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

Review these before reusing them: `active-directory`, `api-key`, `backup`, `blind-xss`, `c`, `code-audit`, `code-coverage`, `corb`, `differential-fuzzing`, `evaluation`, `fullscreen`, `ghostscript`, `git`, `imagemagick`, `insecure-defaults`, `jit`, `keyboard-lock`, `patch-diffing`, `policy-bypass`, `postscript`, `prng`, `rbac`, `regex`, `secret-scanning`, `sharepoint`, `symfony`, `test-runner`, `viewstate`
