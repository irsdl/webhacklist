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

297 tags, across 2189 documents that carry a digest.

| Tag | Documents | OWASP |
|---|---|---|
| `abuse-of-functionality` | 78 | A04:2021 |
| `account-takeover` | 8 | — |
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
| `argument-injection` | 4 | A03:2021 |
| `aspnet` | 55 | — |
| `attack-chain` | 289 | — |
| `auth-bypass` | 397 | A01:2021 |
| `autofill` | 5 | — |
| `aws` | 43 | — |
| `azure` | 19 | — |
| `backup` | 1 | — |
| `bash` | 1 | — |
| `binary-planting` | 2 | — |
| `blind-xss` | 1 | A03:2021 |
| `blockchain` | 8 | — |
| `browser` | 20 | — |
| `browser-automation` | 2 | — |
| `browser-extension` | 92 | — |
| `browser-fingerprinting` | 32 | — |
| `browser-history` | 2 | — |
| `bug-bounty` | 168 | — |
| `c` | 1 | — |
| `cache` | 77 | — |
| `cache-deception` | 11 | — |
| `cache-poisoning` | 107 | — |
| `captcha-bypass` | 5 | A04:2021 |
| `case-study` | 326 | — |
| `cdn` | 55 | — |
| `charset` | 41 | A02:2021 |
| `ci-cd` | 38 | A08:2021 |
| `cicd` | 2 | — |
| `class-pollution` | 5 | A08:2021 |
| `clickjacking` | 59 | A04:2021 |
| `clipboard` | 4 | — |
| `cloud` | 7 | — |
| `cloudflare` | 17 | — |
| `code-audit` | 1 | — |
| `code-coverage` | 1 | — |
| `code-injection` | 8 | — |
| `command-and-control` | 2 | — |
| `command-injection` | 80 | A03:2021 |
| `configuration` | 8 | — |
| `content-type` | 46 | A05:2021 |
| `cookie` | 159 | A07:2021 |
| `corb` | 1 | — |
| `cors` | 32 | A01:2021 |
| `credential-exposure` | 5 | — |
| `credential-theft` | 13 | — |
| `cross-tenant` | 5 | — |
| `crypto` | 20 | A02:2021 |
| `csp` | 74 | A05:2021 |
| `csrf` | 166 | A01:2021 |
| `css` | 77 | — |
| `css-injection` | 38 | A03:2021 |
| `csti` | 5 | A03:2021 |
| `cve` | 267 | — |
| `data-breach` | 5 | — |
| `data-exfiltration` | 7 | — |
| `database` | 77 | — |
| `deanonymization` | 23 | — |
| `deep-link` | 2 | — |
| `default-credentials` | 3 | — |
| `defence` | 62 | — |
| `dependency-confusion` | 1 | A06:2021 |
| `deserialization` | 104 | A08:2021 |
| `desktop-app` | 4 | — |
| `desync` | 41 | — |
| `detection` | 143 | A09:2021 |
| `differential-fuzzing` | 1 | — |
| `django` | 11 | — |
| `dns` | 96 | — |
| `dns-rebinding` | 36 | A10:2021 |
| `docker` | 8 | A05:2021 |
| `dom` | 150 | — |
| `dom-clobbering` | 15 | A08:2021 |
| `domain-takeover` | 3 | — |
| `dompurify` | 2 | — |
| `dos` | 125 | — |
| `dotnet` | 80 | — |
| `drupal` | 6 | — |
| `dynamic-analysis` | 96 | — |
| `egress` | 2 | — |
| `elasticsearch` | 3 | — |
| `electron` | 13 | — |
| `email` | 61 | — |
| `embedded-device` | 12 | — |
| `encoding` | 93 | — |
| `entra` | 4 | — |
| `environment-variables` | 2 | — |
| `evaluation` | 1 | — |
| `evasion` | 2 | — |
| `express` | 9 | — |
| `file-read` | 10 | — |
| `file-upload` | 99 | — |
| `file-write` | 22 | — |
| `filter-bypass` | 323 | A05:2021 |
| `firefox` | 4 | — |
| `flash` | 57 | — |
| `flask` | 6 | — |
| `formal-analysis` | 36 | — |
| `format-string` | 2 | — |
| `ftp` | 11 | — |
| `fullscreen` | 1 | — |
| `fuzzing` | 69 | — |
| `gadget-chain` | 112 | A08:2021 |
| `gcp` | 13 | — |
| `ghostscript` | 1 | — |
| `git` | 1 | — |
| `github` | 29 | — |
| `github-actions` | 22 | A08:2021 |
| `gitlab` | 10 | — |
| `go` | 18 | — |
| `graph` | 2 | — |
| `graphql` | 13 | — |
| `hash-collision` | 7 | A02:2021 |
| `header-injection` | 79 | A03:2021 |
| `homograph` | 2 | — |
| `html-injection` | 4 | — |
| `html5` | 2 | — |
| `http` | 242 | — |
| `http2` | 33 | — |
| `http3` | 13 | — |
| `https` | 105 | A02:2021 |
| `iam` | 2 | — |
| `identity` | 39 | A07:2021 |
| `idor` | 29 | A01:2021 |
| `iframe` | 142 | — |
| `imagemagick` | 1 | — |
| `info-leak` | 684 | — |
| `injection` | 145 | A03:2021 |
| `insecure-default` | 1 | — |
| `insecure-defaults` | 1 | — |
| `integer-underflow` | 2 | — |
| `ios` | 19 | — |
| `jailbreak` | 4 | — |
| `java` | 132 | — |
| `javascript` | 418 | — |
| `javascript-bridge` | 2 | — |
| `javascript-runtime` | 22 | — |
| `jenkins` | 2 | — |
| `jit` | 1 | — |
| `joomla` | 6 | — |
| `jwt` | 25 | A07:2021 |
| `keyboard-lock` | 1 | — |
| `kubernetes` | 8 | A05:2021 |
| `laravel` | 2 | — |
| `large-scale-scan` | 137 | — |
| `lfi` | 37 | A01:2021, A03:2021 |
| `libfuzzer` | 2 | — |
| `linux` | 1 | — |
| `llm` | 66 | — |
| `llvm` | 2 | — |
| `load-balancer` | 19 | — |
| `localhost` | 6 | — |
| `malware` | 1 | — |
| `mass-assignment` | 12 | A01:2021 |
| `mcp` | 9 | — |
| `measurement-study` | 260 | — |
| `memory-corruption` | 16 | — |
| `message-protocol` | 2 | — |
| `methodology` | 6 | — |
| `mime` | 43 | A05:2021 |
| `mitigation` | 188 | — |
| `mobile-web` | 2 | — |
| `mongodb` | 6 | — |
| `mssql` | 11 | — |
| `mutation-xss` | 12 | A03:2021 |
| `mysql` | 24 | — |
| `nextjs` | 15 | — |
| `nginx` | 5 | — |
| `nodejs` | 84 | — |
| `nosqli` | 10 | A03:2021 |
| `ntlm` | 4 | — |
| `oauth` | 93 | A07:2021 |
| `object-injection` | 2 | — |
| `open-redirect` | 69 | A04:2021 |
| `openid` | 34 | A07:2021 |
| `origin-validation` | 8 | — |
| `parser-differential` | 231 | — |
| `passkeys` | 13 | A07:2021 |
| `password-manager` | 5 | — |
| `patch-bypass` | 3 | — |
| `patch-diffing` | 1 | — |
| `path-traversal` | 89 | A01:2021 |
| `pdf` | 35 | — |
| `perl` | 4 | — |
| `phishing` | 52 | A04:2021 |
| `php` | 141 | — |
| `policy-bypass` | 1 | — |
| `postgres` | 11 | — |
| `postmessage` | 44 | — |
| `postscript` | 1 | — |
| `predictable-token` | 7 | A02:2021 |
| `prior-art-extension` | 59 | — |
| `privacy` | 6 | — |
| `privilege-escalation` | 136 | A01:2021 |
| `prng` | 1 | — |
| `prompt-injection` | 72 | A03:2021 |
| `prototype-pollution` | 31 | A08:2021 |
| `proxy` | 93 | — |
| `python` | 47 | — |
| `race-condition` | 42 | A04:2021 |
| `rag` | 5 | — |
| `rails` | 18 | — |
| `rbac` | 1 | — |
| `rce` | 402 | — |
| `react` | 7 | — |
| `redirect` | 4 | — |
| `redis` | 6 | — |
| `redos` | 3 | — |
| `regex` | 1 | — |
| `relay-attack` | 2 | — |
| `request-smuggling` | 59 | — |
| `response-splitting` | 19 | A03:2021 |
| `rest-api` | 56 | — |
| `reverse-engineering` | 3 | — |
| `reverse-proxy` | 65 | — |
| `ruby` | 41 | — |
| `rust` | 4 | — |
| `same-origin-policy` | 190 | A01:2021 |
| `saml` | 20 | A07:2021 |
| `sandbox-escape` | 95 | — |
| `sanitizer-bypass` | 97 | A05:2021 |
| `scanner` | 3 | — |
| `scanner-bypass` | 2 | — |
| `secret-scanning` | 1 | — |
| `service-worker` | 16 | — |
| `session` | 1 | — |
| `session-cookie` | 7 | — |
| `session-fixation` | 43 | A07:2021 |
| `sharepoint` | 1 | — |
| `side-channel` | 228 | — |
| `smb` | 1 | — |
| `smtp` | 20 | — |
| `smuggling` | 15 | — |
| `snmp` | 2 | — |
| `soap` | 14 | — |
| `sop-bypass` | 204 | A01:2021 |
| `spring` | 18 | — |
| `sqli` | 77 | A03:2021 |
| `sso` | 75 | A07:2021 |
| `ssrf` | 113 | A10:2021 |
| `ssti` | 26 | A03:2021 |
| `static-analysis` | 87 | — |
| `steganography` | 2 | — |
| `struts` | 4 | — |
| `subdomain-takeover` | 1 | — |
| `supabase` | 2 | — |
| `supply-chain` | 83 | A06:2021 |
| `survey` | 19 | — |
| `symfony` | 1 | — |
| `test-runner` | 1 | — |
| `timing-attack` | 101 | — |
| `tls` | 116 | A02:2021 |
| `toctou` | 18 | A04:2021 |
| `token-theft` | 4 | — |
| `tool-use` | 3 | — |
| `tooling` | 382 | — |
| `trust-boundary` | 10 | — |
| `type-confusion` | 4 | — |
| `typosquatting` | 9 | A06:2021 |
| `ui-redress` | 77 | A04:2021 |
| `ui-redressing` | 2 | — |
| `unicode` | 45 | — |
| `uri-scheme` | 10 | — |
| `url-parsing` | 133 | — |
| `url-spoofing` | 12 | — |
| `use-after-free` | 2 | — |
| `user-enumeration` | 10 | A04:2021 |
| `vendor-advisory` | 60 | — |
| `viewstate` | 1 | — |
| `vue` | 1 | — |
| `vulnerability-research` | 2 | — |
| `waf` | 17 | A05:2021 |
| `waf-bypass` | 80 | A05:2021 |
| `webassembly` | 6 | — |
| `webauthn` | 14 | A07:2021 |
| `webdav` | 2 | — |
| `webgl` | 2 | — |
| `webrtc` | 12 | — |
| `websocket` | 19 | — |
| `webview` | 3 | — |
| `wordpress` | 31 | — |
| `xml` | 5 | — |
| `xsleak` | 79 | — |
| `xss` | 439 | A03:2021 |
| `xxe` | 38 | A03:2021 |
| `yaml` | 2 | — |

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

Review these before reusing them: `active-directory`, `api-key`, `backup`, `bash`, `blind-xss`, `c`, `code-audit`, `code-coverage`, `corb`, `dependency-confusion`, `differential-fuzzing`, `evaluation`, `fullscreen`, `ghostscript`, `git`, `imagemagick`, `insecure-default`, `insecure-defaults`, `jit`, `keyboard-lock`, `linux`, `malware`, `patch-diffing`, `policy-bypass`, `postscript`, `prng`, `rbac`, `regex`, `secret-scanning`, `session`, `sharepoint`, `smb`, `subdomain-takeover`, `symfony`, `test-runner`, `viewstate`, `vue`
