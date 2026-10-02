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

234 tags, across 2036 documents that carry a digest.

| Tag | Documents | OWASP |
|---|---|---|
| `abuse-of-functionality` | 76 | A04:2021 |
| `active-directory` | 1 | — |
| `activex` | 13 | — |
| `ai-agent` | 89 | — |
| `algorithmic-complexity` | 36 | A04:2021 |
| `android` | 36 | — |
| `angular` | 3 | — |
| `argument-injection` | 3 | A03:2021 |
| `aspnet` | 54 | — |
| `attack-chain` | 239 | — |
| `auth-bypass` | 371 | A01:2021 |
| `autofill` | 4 | — |
| `aws` | 40 | — |
| `azure` | 14 | — |
| `backup` | 1 | — |
| `binary-planting` | 1 | — |
| `blind-xss` | 1 | A03:2021 |
| `blockchain` | 8 | — |
| `browser` | 2 | — |
| `browser-extension` | 90 | — |
| `browser-fingerprinting` | 28 | — |
| `browser-history` | 2 | — |
| `bug-bounty` | 168 | — |
| `c` | 1 | — |
| `cache` | 76 | — |
| `cache-deception` | 11 | — |
| `cache-poisoning` | 102 | — |
| `captcha-bypass` | 5 | A04:2021 |
| `case-study` | 318 | — |
| `cdn` | 50 | — |
| `charset` | 40 | A02:2021 |
| `ci-cd` | 32 | A08:2021 |
| `class-pollution` | 5 | A08:2021 |
| `clickjacking` | 59 | A04:2021 |
| `clipboard` | 4 | — |
| `cloudflare` | 12 | — |
| `code-injection` | 4 | — |
| `command-and-control` | 2 | — |
| `command-injection` | 69 | A03:2021 |
| `configuration` | 3 | — |
| `content-type` | 45 | A05:2021 |
| `cookie` | 156 | A07:2021 |
| `cors` | 31 | A01:2021 |
| `crypto` | 17 | A02:2021 |
| `csp` | 72 | A05:2021 |
| `csrf` | 159 | A01:2021 |
| `css` | 77 | — |
| `css-injection` | 36 | A03:2021 |
| `csti` | 5 | A03:2021 |
| `cve` | 257 | — |
| `data-breach` | 5 | — |
| `data-exfiltration` | 2 | — |
| `database` | 73 | — |
| `deanonymization` | 20 | — |
| `default-credentials` | 1 | — |
| `defence` | 62 | — |
| `dependency-confusion` | 1 | A06:2021 |
| `deserialization` | 94 | A08:2021 |
| `desync` | 39 | — |
| `detection` | 139 | A09:2021 |
| `differential-fuzzing` | 1 | — |
| `django` | 11 | — |
| `dns` | 95 | — |
| `dns-rebinding` | 36 | A10:2021 |
| `docker` | 6 | A05:2021 |
| `dom` | 150 | — |
| `dom-clobbering` | 15 | A08:2021 |
| `domain-takeover` | 2 | — |
| `dompurify` | 1 | — |
| `dos` | 121 | — |
| `dotnet` | 78 | — |
| `drupal` | 6 | — |
| `dynamic-analysis` | 92 | — |
| `egress` | 1 | — |
| `elasticsearch` | 3 | — |
| `electron` | 12 | — |
| `email` | 59 | — |
| `embedded-device` | 10 | — |
| `encoding` | 89 | — |
| `environment-variables` | 2 | — |
| `evasion` | 2 | — |
| `express` | 9 | — |
| `file-read` | 4 | — |
| `file-upload` | 96 | — |
| `file-write` | 13 | — |
| `filter-bypass` | 318 | A05:2021 |
| `flash` | 57 | — |
| `flask` | 6 | — |
| `formal-analysis` | 36 | — |
| `format-string` | 2 | — |
| `ftp` | 11 | — |
| `fuzzing` | 67 | — |
| `gadget-chain` | 109 | A08:2021 |
| `gcp` | 11 | — |
| `github` | 24 | — |
| `github-actions` | 20 | A08:2021 |
| `gitlab` | 9 | — |
| `go` | 16 | — |
| `graphql` | 10 | — |
| `hash-collision` | 5 | A02:2021 |
| `header-injection` | 78 | A03:2021 |
| `html-injection` | 2 | — |
| `html5` | 1 | — |
| `http` | 229 | — |
| `http2` | 33 | — |
| `http3` | 12 | — |
| `https` | 105 | A02:2021 |
| `identity` | 33 | A07:2021 |
| `idor` | 29 | A01:2021 |
| `iframe` | 140 | — |
| `info-leak` | 666 | — |
| `injection` | 141 | A03:2021 |
| `insecure-defaults` | 1 | — |
| `integer-underflow` | 2 | — |
| `ios` | 18 | — |
| `jailbreak` | 4 | — |
| `java` | 129 | — |
| `javascript` | 403 | — |
| `javascript-runtime` | 22 | — |
| `jenkins` | 2 | — |
| `joomla` | 6 | — |
| `jwt` | 23 | A07:2021 |
| `kubernetes` | 6 | A05:2021 |
| `laravel` | 2 | — |
| `large-scale-scan` | 135 | — |
| `lfi` | 36 | A01:2021, A03:2021 |
| `linux` | 1 | — |
| `llm` | 59 | — |
| `load-balancer` | 19 | — |
| `malware` | 1 | — |
| `mass-assignment` | 12 | A01:2021 |
| `mcp` | 5 | — |
| `measurement-study` | 252 | — |
| `memory-corruption` | 11 | — |
| `message-protocol` | 1 | — |
| `mime` | 43 | A05:2021 |
| `mitigation` | 184 | — |
| `mongodb` | 6 | — |
| `mssql` | 11 | — |
| `mutation-xss` | 12 | A03:2021 |
| `mysql` | 23 | — |
| `nextjs` | 12 | — |
| `nginx` | 5 | — |
| `nodejs` | 79 | — |
| `nosqli` | 10 | A03:2021 |
| `ntlm` | 2 | — |
| `oauth` | 83 | A07:2021 |
| `open-redirect` | 66 | A04:2021 |
| `openid` | 34 | A07:2021 |
| `parser-differential` | 214 | — |
| `passkeys` | 13 | A07:2021 |
| `password-manager` | 5 | — |
| `path-traversal` | 81 | A01:2021 |
| `pdf` | 31 | — |
| `perl` | 4 | — |
| `phishing` | 48 | A04:2021 |
| `php` | 130 | — |
| `postgres` | 11 | — |
| `postmessage` | 40 | — |
| `predictable-token` | 7 | A02:2021 |
| `prior-art-extension` | 59 | — |
| `privacy` | 1 | — |
| `privilege-escalation` | 123 | A01:2021 |
| `prompt-injection` | 57 | A03:2021 |
| `prototype-pollution` | 30 | A08:2021 |
| `proxy` | 87 | — |
| `python` | 41 | — |
| `race-condition` | 41 | A04:2021 |
| `rag` | 5 | — |
| `rails` | 17 | — |
| `rce` | 353 | — |
| `react` | 7 | — |
| `redis` | 5 | — |
| `redos` | 3 | — |
| `request-smuggling` | 57 | — |
| `response-splitting` | 19 | A03:2021 |
| `rest-api` | 54 | — |
| `reverse-proxy` | 63 | — |
| `ruby` | 38 | — |
| `rust` | 3 | — |
| `same-origin-policy` | 188 | A01:2021 |
| `saml` | 19 | A07:2021 |
| `sandbox-escape` | 91 | — |
| `sanitizer-bypass` | 92 | A05:2021 |
| `secret-scanning` | 1 | — |
| `service-worker` | 16 | — |
| `session-fixation` | 42 | A07:2021 |
| `sharepoint` | 1 | — |
| `side-channel` | 223 | — |
| `smb` | 1 | — |
| `smtp` | 19 | — |
| `smuggling` | 15 | — |
| `snmp` | 2 | — |
| `soap` | 14 | — |
| `sop-bypass` | 202 | A01:2021 |
| `spring` | 18 | — |
| `sqli` | 74 | A03:2021 |
| `sso` | 72 | A07:2021 |
| `ssrf` | 105 | A10:2021 |
| `ssti` | 25 | A03:2021 |
| `static-analysis` | 87 | — |
| `struts` | 4 | — |
| `subdomain-takeover` | 1 | — |
| `supply-chain` | 70 | A06:2021 |
| `survey` | 19 | — |
| `symfony` | 1 | — |
| `timing-attack` | 99 | — |
| `tls` | 115 | A02:2021 |
| `toctou` | 18 | A04:2021 |
| `tooling` | 358 | — |
| `trust-boundary` | 1 | — |
| `type-confusion` | 2 | — |
| `typosquatting` | 9 | A06:2021 |
| `ui-redress` | 77 | A04:2021 |
| `ui-redressing` | 1 | — |
| `unicode` | 41 | — |
| `uri-scheme` | 5 | — |
| `url-parsing` | 127 | — |
| `url-spoofing` | 12 | — |
| `user-enumeration` | 9 | A04:2021 |
| `vendor-advisory` | 59 | — |
| `vue` | 1 | — |
| `waf` | 17 | A05:2021 |
| `waf-bypass` | 78 | A05:2021 |
| `webassembly` | 4 | — |
| `webauthn` | 14 | A07:2021 |
| `webdav` | 2 | — |
| `webrtc` | 11 | — |
| `websocket` | 12 | — |
| `webview` | 1 | — |
| `wordpress` | 29 | — |
| `xsleak` | 77 | — |
| `xss` | 424 | A03:2021 |
| `xxe` | 34 | A03:2021 |

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

Review these before reusing them: `active-directory`, `backup`, `binary-planting`, `blind-xss`, `c`, `default-credentials`, `dependency-confusion`, `differential-fuzzing`, `dompurify`, `egress`, `html5`, `insecure-defaults`, `linux`, `malware`, `message-protocol`, `privacy`, `secret-scanning`, `sharepoint`, `smb`, `subdomain-takeover`, `symfony`, `trust-boundary`, `ui-redressing`, `vue`, `webview`
