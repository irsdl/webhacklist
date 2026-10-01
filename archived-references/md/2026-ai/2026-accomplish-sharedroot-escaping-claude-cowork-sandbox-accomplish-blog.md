---
type: Article
title: "SharedRoot: Escaping the Claude Cowork sandbox — Accomplish Blog"
description: A Claude Cowork session combines unprivileged user namespaces, netlink module autoloading and a public kernel page-cache write with an unhardened root broker. Guest root can then reach the Mac host filesystem because the entire host root is mounted read-write inside the VM.
resource: "https://www.accomplish.ai/blog/sharedroot-escaping-claude-cowork-sandbox/"
tags: [article, webseclist-reference, en, accomplish, ai-agent, sandbox-escape, privilege-escalation, rce, attack-chain, owasp-a01-2021]
generated:
  by: webseclist-refs/1
  at: "2026-10-01T14:02:18+00:00"
status: stable
stale_after: 2027-10-01
sources:
  - id: original
    resource: "https://www.accomplish.ai/blog/sharedroot-escaping-claude-cowork-sandbox/"
    title: "SharedRoot: Escaping the Claude Cowork sandbox — Accomplish Blog"
    author: Oren Yomtov
    last_modified: 2026-07-23
also_at: []
authors:
  - Oren Yomtov
canonical_url: ""
cited_by:
  - "2026-ai.md:133"
commit: ""
content_sha256: ae7a66ffef63119e74b8b0bf4a5f408d876af7c875cfe4dce0274e4c56fd5901
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.accomplish.ai/blog/sharedroot-escaping-claude-cowork-sandbox/"
published: 2026-07-23
publisher: Accomplish
publisher_english: ""
raw_sha256: c98857fb53d0839a1a015361bec22e70c61731f42ee4b762f1090699b46f0f01
retrieved_from: "https://www.accomplish.ai/blog/sharedroot-escaping-claude-cowork-sandbox/"
retrieved_kind: live
retrieved_utc: "2026-10-01T14:02:18+00:00"
slug: 2026-accomplish-sharedroot-escaping-claude-cowork-sandbox-accomplish-blog
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# SharedRoot: Escaping the Claude Cowork sandbox — Accomplish Blog

**SharedRoot: Escaping the Claude Cowork sandbox — Accomplish Blog** - Oren Yomtov, Accomplish.

- Published: 2026-07-23
- Original: <https://www.accomplish.ai/blog/sharedroot-escaping-claude-cowork-sandbox/>
- Preserved from: https://www.accomplish.ai/blog/sharedroot-escaping-claude-cowork-sandbox/ (live) on 2026-10-01
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so
it remains readable if the page goes offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

We connected a folder to a fresh Claude Cowork session, sent one short message, and watched the agent escape the sandbox. From inside the VM it reached the host Mac and read and wrote files all over it, far outside the folder we’d connected, with no permission prompt anywhere. SSH keys, cloud credentials, anything the user’s account can touch.

That’s not supposed to be possible. Cowork runs the agent inside a Linux VM as an unprivileged user, and the promise is that whatever it does stays inside that VM and the folders you hand it. That boundary is the product. Untrusted input isn’t an edge case for an agent, it’s the main case. You want it reading the repo you didn’t write and the PDF someone emailed you. So the boundary is the only thing standing between “the model did something silly” and “the model had my cloud credentials.”

Cowork’s design here is careful. A real VM, an unprivileged session user, a seccomp filter, a brokered mount layer. Most of it holds. What follows is one path through it. Watch how many separate things had to line up for it to exist at all.

The vulnerability has been reported to Anthropic and was closed as “Informative”. Cowork now uses cloud execution by default, and this local escape path does not appear to apply there.

## The Chain

### How the escape worked

The relevant pieces are simple enough. The app is a normal macOS desktop app, running under your user account. The actual agent work happens elsewhere, in a Linux VM spun up through Apple’s Virtualization framework. Inside that VM each session gets its own throwaway unprivileged user, wrapped in a seccomp filter, and the folders you connect are brokered in as mounts by a root daemon called `coworkd`. Unprivileged user, restricted syscalls, only your folders in view.

One detail matters more than the rest: the host filesystem gets shared into that VM read-write. The entire host `/`, mounted so that only guest-root inside the VM can see it, at `/mnt/.virtiofs-root`. That mount is where the escape happens: the entire host, writable, one privilege boundary away from the sandbox. We named the chain that reaches it SharedRoot.

 ![Diagram: the macOS host filesystem, including SSH keys and cloud credentials, mounted read-write into the Linux VM at /mnt/.virtiofs-root, visible only to the VM's root user.](https://www.accomplish.ai/images/sharedroot-fig1.svg)

***Fig 1. The entire host filesystem, mounted into the VM and writable.** Only the VM's root user can see it, and reaching it is the last move in the escape. This mount is what SharedRoot turns on.*

Now, the chain itself.

**Start.** The agent is running as the unprivileged session user. No bug got us here, this is just Cowork doing its job on the content we gave it.

**Get capabilities.** The session user calls `unshare` to create a new user namespace. Inside that namespace it is root, holding the full set of Linux capabilities, `CAP_NET_ADMIN` among them. The guest allows unprivileged user namespaces, so there is no exploit in this step at all. It’s a kernel feature that could have been turned off, but left on.

**Reach the vulnerable code.** With `CAP_NET_ADMIN` in hand it configures a traffic-control (tc) action that uses the kernel module `act_pedit`. Setting that up runs over a netlink socket, which the permissive seccomp filter allows, and merely referencing the module makes the kernel autoload it. A networking module the sandbox never needed is now loaded and reachable.

**Get a write primitive.** On this guest kernel `act_pedit` is vulnerable to CVE-2026-46331, “pedit COW,” a public Ubuntu bug from June. It lets you poison the page cache of a file you’re only allowed to read. So the session user picks a root-owned helper binary it can read but not write, and poisons the cached copy. The on-disk bytes never change, which is part of why it’s quiet.

**Turn the primitive into guest-root.** This is where it stops being a kernel bug. `coworkd` runs as root, unhardened, over a view of the same filesystem, the same inodes. In the course of normal work it re-execs that helper, and it runs the poisoned copy. Because the process doing the exec is already root, NoNewPrivs, the thing that normally stops you gaining privilege across an exec, has nothing to bite on. The session user is now root inside the guest.

**Leave the VM.** Guest-root can see `/mnt/.virtiofs-root`, the whole host `/`, shared in read-write. From there it reads and writes the host Mac’s filesystem directly, as the logged-in desktop user.

We ran the full chain end-to-end on our own machine, and it worked.

***The chain, end to end.** A prompt runs in Cowork's connected folder; seconds later a file written from inside the sandbox lands in the host user's home directory, outside anything the session was granted.*

## The Reframe

### It didn’t have to be this way

There’s a CVE in that chain, but it carries less weight than it first appears.

`act_pedit` is one bug in a category. The Linux net/sched subsystem throws off this exact shape of privilege escalation on a regular cadence: an autoloadable module, a config path an unprivileged user can reach, a memory bug at the end of it. Patch this one and you’ve fixed this one. The chain re-arms on the next one, with everything above the kernel untouched.

And the next one is always coming. AI-assisted vulnerability research industrialized over the last year. An OpenAI model found a genuine remote zero-day in the kernel’s SMB server just by reading the code; Google’s Big Sleep and the systems that followed it have logged dozens of finds across major projects. By one analysis, mainline-kernel privilege-escalation advisories ran around 2.3× the prior year, with early 2026 looking like the new baseline rather than a spike. And the gap between a fix landing and a working public exploit has collapsed to hours. Put those together and your guest kernel is essentially never caught up: at any given moment there’s likely a privilege-escalation bug it’s still exposed to, sometimes fixed upstream but not yet in your image, sometimes not yet fixed anywhere, with a working exploit out within hours. This isn’t a patch-faster problem. You’re structurally one bug behind, all the time.

The containment was never really the kernel’s job. It lives in four choices above it, and each one, on its own, breaks the chain we just walked. Better still, unlike patching the bug, each breaks a whole category, so the next net/sched or io_uring 1-day is off the table too.

- **Don’t hand out unprivileged user namespaces.** Set `apparmor_restrict_unprivileged_userns=1` (or `kernel.unprivileged_userns_clone=0`) and the first step fails. The session user never gets into a namespace where it’s root, never gets `CAP_NET_ADMIN`, has nothing to configure tc with. The chain dies before it starts. This one sysctl is doing a lot.
- **Make the seccomp filter say no.** The sandbox’s filter is a default-allow denylist: it blocks a couple of specific things and waves the rest through, including the unshare/clone calls and the netlink socket the chain needs. Flip the posture. Block `unshare`, `setns`, and `clone3`, reject namespace-creating flags on `clone`, and turn `socket()` into an address-family allowlist that refuses `AF_NETLINK`. Either change closes the road to `act_pedit`.
- **Kill the privilege-escalation path.** `act_pedit` gets pulled in on demand because nothing says otherwise. Don’t ship modules the guest doesn’t need; for those that remain, use `install ... /bin/false` so the autoload fails. That includes `act_pedit` and every unused net/sched module. This is the one that generalizes hardest: it kills all autoload bugs in unused modules rather than just this CVE. And it isn’t exotic. Cowork already does exactly this, `install ... /bin/false`, for a different module, to shut a prior CVE. The pattern’s already in the image. It just wasn’t applied here. Also, take away the target: keep any helper `coworkd` may execute out of the session user’s filesystem view, so it can’t re-exec a binary the session user can poison.
- **And most importantly, don’t share the whole host into the VM.** The share here isn’t a scoped, read-only window; it’s the entire host `/`, mounted read-write. Scope it to the folders that were actually connected. Then even a full guest-root has nowhere else to land: it can reach only those folders. Given everything above about the pace of kernel bugs, this is the choice that carries the most weight. It’s what decides whether root-in-the-VM is a contained event or a host compromise.

 ![Diagram: the six-step escape chain down the left, with four green locks on the right — turn user namespaces off, block unshare and AF_NETLINK in seccomp, stop the act_pedit autoload, and scope or read-only the host mount — each closing the chain at a different point.](https://www.accomplish.ai/images/sharedroot-fig2.svg)

***Fig 2. Four independent locks.** The numbered path is the escape, turning red once it goes wrong. Each green lock closes it at a different point; any one is enough, and each takes a whole category with it, not just this CVE.*

We reported the chain to Anthropic. They closed the report as “Informative”: the CVE fell inside their program’s window for bugs published in the last 30 days, and they read the hardening items as defense-in-depth rather than standalone vulnerabilities. That’s a reasonable call for a bounty program. But a program’s scope and your exposure on your own laptop are different questions. From where the user sits, “we pick up kernel fixes as upstream ships them” means the strength of the box is tied to a patch race you don’t run and can’t win.

## The Design

### Which is why we built Accomplish the way we did

 ![Diagram comparing blast radius side by side: in Claude Cowork, guest-root reads and writes the host filesystem through the shared mount; in Accomplish, the host filesystem is not mounted into the VM, so guest-root is contained with no host to reach.](https://www.accomplish.ai/images/sharedroot-fig3.svg)

***Fig 3. Same guest-root. Different blast radius.** The escape's last two steps need the host filesystem to be there inside the VM. Take it away and root-in-the-VM has nowhere to go.*

We build a way for teams to run Claude and other agents on their endpoints, and designing it we kept landing on the lesson above. The isolation can’t lean on the guest kernel being clean, because the guest kernel is never guaranteed clean. Something in net/sched, or io_uring, or somewhere nobody’s looking yet, is always one N-day away.

So we treat the whole guest VM as untrusted, root included. The parts that enforce the boundary run on the host, outside the VM, so the containment doesn’t rest on the agent staying unprivileged inside it. We still make reaching root hard, we just don’t rely on it.

[![](https://www.accomplish.ai/images/blog/related-cloudflare.webp) Security ### Escaping the Cloudflare sandbox Sep 24, 20261 min read](https://www.accomplish.ai/blog/escaping-the-cloudflare-sandbox/)[![](https://www.accomplish.ai/images/blog/related-docker.webp) Security ### Guest to host: escaping Docker's hypervisor Sep 19, 20265 min read](https://www.accomplish.ai/blog/escaping-dockers-hypervisor/)[

![](https://www.accomplish.ai/images/blog/related-codex.webp)

Security

### Escaping the OpenAI Codex sandbox, twice

Sep 15, 20265 min read
