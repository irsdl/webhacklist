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

201 tags, across 1693 documents that carry a digest.

| Tag | Documents | OWASP |
|---|---|---|
| `abuse-of-functionality` | 69 | A04:2021 |
| `active-directory` | 1 | — |
| `activex` | 13 | — |
| `ai-agent` | 44 | — |
| `algorithmic-complexity` | 32 | A04:2021 |
| `android` | 33 | — |
| `angular` | 3 | — |
| `argument-injection` | 2 | A03:2021 |
| `aspnet` | 46 | — |
| `attack-chain` | 182 | — |
| `auth-bypass` | 303 | A01:2021 |
| `autofill` | 1 | — |
| `aws` | 30 | — |
| `azure` | 11 | — |
| `blind-xss` | 1 | A03:2021 |
| `blockchain` | 8 | — |
| `browser-extension` | 76 | — |
| `browser-fingerprinting` | 23 | — |
| `bug-bounty` | 165 | — |
| `cache` | 73 | — |
| `cache-deception` | 10 | — |
| `cache-poisoning` | 89 | — |
| `captcha-bypass` | 2 | A04:2021 |
| `case-study` | 271 | — |
| `cdn` | 46 | — |
| `charset` | 37 | A02:2021 |
| `ci-cd` | 27 | A08:2021 |
| `class-pollution` | 5 | A08:2021 |
| `clickjacking` | 58 | A04:2021 |
| `clipboard` | 1 | — |
| `cloudflare` | 11 | — |
| `command-injection` | 54 | A03:2021 |
| `content-type` | 39 | A05:2021 |
| `cookie` | 149 | A07:2021 |
| `cors` | 29 | A01:2021 |
| `crypto` | 6 | A02:2021 |
| `csp` | 58 | A05:2021 |
| `csrf` | 141 | A01:2021 |
| `css` | 72 | — |
| `css-injection` | 28 | A03:2021 |
| `csti` | 4 | A03:2021 |
| `cve` | 252 | — |
| `data-breach` | 5 | — |
| `database` | 61 | — |
| `deanonymization` | 19 | — |
| `defence` | 59 | — |
| `dependency-confusion` | 1 | A06:2021 |
| `deserialization` | 78 | A08:2021 |
| `desync` | 36 | — |
| `detection` | 126 | A09:2021 |
| `django` | 11 | — |
| `dns` | 89 | — |
| `dns-rebinding` | 30 | A10:2021 |
| `docker` | 4 | A05:2021 |
| `dom` | 135 | — |
| `dom-clobbering` | 14 | A08:2021 |
| `domain-takeover` | 2 | — |
| `dos` | 106 | — |
| `dotnet` | 67 | — |
| `drupal` | 4 | — |
| `dynamic-analysis` | 75 | — |
| `elasticsearch` | 3 | — |
| `electron` | 10 | — |
| `email` | 51 | — |
| `embedded-device` | 6 | — |
| `encoding` | 78 | — |
| `express` | 8 | — |
| `file-upload` | 87 | — |
| `file-write` | 1 | — |
| `filter-bypass` | 303 | A05:2021 |
| `flash` | 56 | — |
| `flask` | 5 | — |
| `formal-analysis` | 32 | — |
| `ftp` | 10 | — |
| `fuzzing` | 56 | — |
| `gadget-chain` | 94 | A08:2021 |
| `gcp` | 11 | — |
| `github` | 23 | — |
| `github-actions` | 18 | A08:2021 |
| `gitlab` | 7 | — |
| `go` | 14 | — |
| `graphql` | 4 | — |
| `hash-collision` | 5 | A02:2021 |
| `header-injection` | 67 | A03:2021 |
| `html5` | 1 | — |
| `http` | 209 | — |
| `http2` | 26 | — |
| `http3` | 5 | — |
| `https` | 103 | A02:2021 |
| `identity` | 6 | A07:2021 |
| `idor` | 27 | A01:2021 |
| `iframe` | 136 | — |
| `info-leak` | 602 | — |
| `injection` | 125 | A03:2021 |
| `ios` | 16 | — |
| `jailbreak` | 4 | — |
| `java` | 122 | — |
| `javascript` | 372 | — |
| `javascript-runtime` | 20 | — |
| `jenkins` | 2 | — |
| `joomla` | 6 | — |
| `jwt` | 22 | A07:2021 |
| `kubernetes` | 4 | A05:2021 |
| `laravel` | 2 | — |
| `large-scale-scan` | 134 | — |
| `lfi` | 31 | A01:2021, A03:2021 |
| `llm` | 48 | — |
| `load-balancer` | 16 | — |
| `mass-assignment` | 11 | A01:2021 |
| `measurement-study` | 230 | — |
| `memory-corruption` | 4 | — |
| `mime` | 42 | A05:2021 |
| `mitigation` | 172 | — |
| `mongodb` | 6 | — |
| `mssql` | 11 | — |
| `mutation-xss` | 12 | A03:2021 |
| `mysql` | 23 | — |
| `nextjs` | 11 | — |
| `nodejs` | 69 | — |
| `nosqli` | 3 | A03:2021 |
| `ntlm` | 2 | — |
| `oauth` | 62 | A07:2021 |
| `open-redirect` | 62 | A04:2021 |
| `openid` | 31 | A07:2021 |
| `parser-differential` | 167 | — |
| `passkeys` | 10 | A07:2021 |
| `password-manager` | 1 | — |
| `path-traversal` | 67 | A01:2021 |
| `pdf` | 23 | — |
| `perl` | 4 | — |
| `phishing` | 39 | A04:2021 |
| `php` | 121 | — |
| `postgres` | 8 | — |
| `postmessage` | 34 | — |
| `predictable-token` | 5 | A02:2021 |
| `prior-art-extension` | 58 | — |
| `privilege-escalation` | 105 | A01:2021 |
| `prompt-injection` | 36 | A03:2021 |
| `prototype-pollution` | 21 | A08:2021 |
| `proxy` | 82 | — |
| `python` | 36 | — |
| `race-condition` | 30 | A04:2021 |
| `rag` | 5 | — |
| `rails` | 17 | — |
| `rce` | 274 | — |
| `react` | 6 | — |
| `redis` | 3 | — |
| `redos` | 3 | — |
| `request-smuggling` | 50 | — |
| `response-splitting` | 18 | A03:2021 |
| `rest-api` | 50 | — |
| `reverse-proxy` | 55 | — |
| `ruby` | 35 | — |
| `rust` | 3 | — |
| `same-origin-policy` | 177 | A01:2021 |
| `saml` | 18 | A07:2021 |
| `sandbox-escape` | 71 | — |
| `sanitizer-bypass` | 85 | A05:2021 |
| `service-worker` | 10 | — |
| `session-fixation` | 35 | A07:2021 |
| `side-channel` | 206 | — |
| `smb` | 1 | — |
| `smtp` | 18 | — |
| `smuggling` | 14 | — |
| `snmp` | 2 | — |
| `soap` | 13 | — |
| `sop-bypass` | 193 | A01:2021 |
| `spring` | 14 | — |
| `sqli` | 65 | A03:2021 |
| `sso` | 63 | A07:2021 |
| `ssrf` | 96 | A10:2021 |
| `ssti` | 20 | A03:2021 |
| `static-analysis` | 72 | — |
| `struts` | 4 | — |
| `subdomain-takeover` | 1 | — |
| `supply-chain` | 56 | A06:2021 |
| `survey` | 18 | — |
| `symfony` | 1 | — |
| `timing-attack` | 89 | — |
| `tls` | 109 | A02:2021 |
| `toctou` | 16 | A04:2021 |
| `tooling` | 300 | — |
| `type-confusion` | 1 | — |
| `typosquatting` | 9 | A06:2021 |
| `ui-redress` | 72 | A04:2021 |
| `unicode` | 36 | — |
| `url-parsing` | 119 | — |
| `url-spoofing` | 12 | — |
| `user-enumeration` | 8 | A04:2021 |
| `vendor-advisory` | 55 | — |
| `vue` | 1 | — |
| `waf` | 15 | A05:2021 |
| `waf-bypass` | 70 | A05:2021 |
| `webassembly` | 3 | — |
| `webauthn` | 11 | A07:2021 |
| `webrtc` | 11 | — |
| `websocket` | 8 | — |
| `wordpress` | 21 | — |
| `xsleak` | 73 | — |
| `xss` | 383 | A03:2021 |
| `xxe` | 32 | A03:2021 |

### Never published

These spellings fold into another tag before anything is written:

| Written | Published as |
|---|---|
| `malicious-server` | `` |
| `novel-technique` | `` |
| `server` | `` |
| `wasm` | `webassembly` |

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

Review these before reusing them: `active-directory`, `autofill`, `blind-xss`, `clipboard`, `dependency-confusion`, `file-write`, `html5`, `password-manager`, `smb`, `subdomain-takeover`, `symfony`, `type-confusion`, `vue`
