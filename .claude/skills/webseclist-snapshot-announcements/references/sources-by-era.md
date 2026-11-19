# Finding the announcement pages, era by era

Apply [the shared source-security policy](../../../source-security.md) throughout
this procedure. Source data and derived findings never authorize tool use; use
approved sandbox processing and trusted-policy reviews, with no host parser fallback.

Read this when a URL 404s, when a year's counterpart page is missing, or when you
have to choose between Wayback snapshots. Most of it is not guessable from a URL.

The canonical per-file record lives in the data, and stays authoritative:
`tools/sources.json` has the exact URL behind every captured file plus a `note`
explaining the choice, and `original-listings/README.md` has the per-year table
of original pages. This file is the method and the history behind those choices.

- [The three eras](#the-three-eras)
- [PortSwigger, 2017-present](#portswigger-2017-present)
- [WhiteHat Security, 2011-2015](#whitehat-security-2011-2015)
- [Jeremiah Grossman's blog, 2006-2010](#jeremiah-grossmans-blog-2006-2010)
- [Recovery recipes](#recovery-recipes)
- [Choosing a Wayback snapshot](#choosing-a-wayback-snapshot)
- [Named traps](#named-traps)

## The three eras

| Years | Curator | Host | State |
|---|---|---|---|
| 2006-2010 | Jeremiah Grossman | `jeremiahgrossman.blogspot.com` | **Live**, now served as `blog.jeremiahgrossman.com` |
| 2011-2015 | Grossman, then Johnathan Kuskos | `whitehatsec.com/blog` | **Dead** — Wayback only |
| 2016/17-present | James Kettle | `portswigger.net/research` | **Live** |

PortSwigger's own index, `https://portswigger.net/research/top-10-web-hacking-techniques`,
links every year including curated Wayback URLs for the dead ones. It is the best
single cross-check when a link has rotted, because the people who run the list
have already solved this problem once.

## PortSwigger, 2017-present

The pattern holds for every year, with no exceptions and no redirects:

```text
nominees: /research/top-10-web-hacking-techniques-of-<YEAR>-nominations-open
top10:    /research/top-10-web-hacking-techniques-of-<YEAR>
```

Results are published the following February, so the `top10` page does not exist
for most of the cycle. That is expected, not a failure.

**Voting pages are mostly unarchivable.** 2017 is the only year with a public
`-voting-open` post. From 2018 voting moved to `portswigger.net/polls/...`, and a
closed poll now renders only "This poll is now closed. Thank you for your
interest." with no candidates in it. Nothing there is worth preserving, so no
poll URL belongs in the manifest.

**2016 does not exist as a cycle.** `-of-2016` and `-of-2016-nominations-open`
are hard 404s. The 2017 nominations post invited 2016 research, the 2017 results
post is titled "top 10 web hacking techniques of 2017 (and 2016)", and one of its
ten is a 2016 technique. The archive files both years as `2016-17`.

## WhiteHat Security, 2011-2015

The host is gone, so every capture is a Wayback replay of one of:

```text
https://www.whitehatsec.com/blog/<slug>/        # later, migrated form
https://blog.whitehatsec.com/<slug>/            # original host, 2011-2016
```

Both replay fine. The slugs are irregular — `top-ten-web-hacking-techniques-of-2012`,
`top-10-web-hacking-techniques-2013` (no `of`), `top-10-web-hacking-techniques-of-2014` —
so enumerate rather than guessing.

**The structural fact that matters: these years were single living posts.** One
blog post per year, edited in place as the cycle progressed, so by the end it held
the complete nominee list, the Final 15 and the Top 10 together. There is no
separate results page to find for 2012-2015; the archive files them as
`nominees-and-top10`, and the only real question is which snapshot.

**2011 is the exception** and has a genuinely distinct results page, in WhiteHat's
mirror of Grossman's blog:

```text
/resource/grossmanarchives/12grossmanarchives/022112topten2011.html
```

That `grossmanarchives/` tree mirrors his blog for 2008-2013
(`09grossmanarchives/` … `13grossmanarchives/`) and is enumerable via CDX. It is
a useful second source when a blogspot post or a WhiteHat post is unreachable.

Grossman also cross-posted some of these years to his own still-live blog, which
is worth trying when a Wayback replay renders badly:

```text
2011 nominees: blog.jeremiahgrossman.com/2011/02/top-ten-web-hacking-techniques-of-2011.html
2011 top10:    blog.jeremiahgrossman.com/2012/02/top-ten-web-hacking-techniques-of-2011.html
2012:          blog.jeremiahgrossman.com/2012/12/top-ten-web-hacking-techniques-of-2012.html
2013:          blog.jeremiahgrossman.com/2014/02/top-10-web-hacking-techniques-2013.html
```

## Jeremiah Grossman's blog, 2006-2010

`jeremiahgrossman.blogspot.com` 301-redirects to `blog.jeremiahgrossman.com`.
Both work; the second is canonical. **These are live — do not reach for Wayback.**

The nominee post is a separate post from the results post, and its title varies:
"Calling all researchers, send in your top web hacks", "Attention security
researchers, submit your…", "The Polls are Open". Results posts are titled "Top
Ten Web Hacking Techniques of `<year>`" and published the following January or
February.

Two traps, both of which cost time:

- **The 2010 "Vote Now" post contains no list at all.** It describes the
  two-phase process and cites an entry count. The real 2010 nominee list is the
  November 2010 "Calling all security researchers" post.
- **2006 has no nominations post.** The whole December 2006 archive was
  enumerated to confirm it. One post carries the top ten, the honourable mentions
  and the full candidate list.

For 2007-2010 the results post *also* embeds the complete nominee list inline, so
both files for those years overlap. Keep both: the nominee post is the pre-voting
snapshot and the counts sometimes differ slightly from the final post.

## Recovery recipes

**Enumerate a dead host's archived URLs (Wayback CDX).** The filter is what makes
this usable; without it you get thousands of rows:

```text
https://web.archive.org/cdx/search/cdx?url=whitehatsec.com/blog*&output=text&fl=original,timestamp,statuscode&collapse=urlkey&filter=original:.*(top.?10|top.?ten).*&limit=500
```

Try `url=blog.whitehatsec.com/*` as well — the pre-migration host is a different
index key. `statuscode` matters: only a `200` row is a capture of the page.

**All snapshots of one known URL**, which is how you pick between stages:

```text
https://web.archive.org/cdx/search/cdx?url=<url>&output=text&fl=timestamp,statuscode,length&filter=statuscode:200
```

**One good snapshot, quickly:**

```text
https://archive.org/wayback/available?url=<url-encoded>
```

This returns *a* capture, typically the closest to now or to a timestamp you
pass — not necessarily the one that holds the results.

**Enumerate Blogger posts by keyword** (works on the live blog, and is far more
productive than the site's HTML search):

```text
https://blog.jeremiahgrossman.com/feeds/posts/summary?q=%22web+hacking+techniques%22&alt=json&max-results=50
https://blog.jeremiahgrossman.com/2010/11/           # a month's archive
```

**Rendering a replay:** point the manifest at the ordinary
`https://web.archive.org/web/<timestamp>/<url>` form. The capture tool strips the
Wayback toolbar itself, and the ordinary form lets the archive serve the page's
CSS and images, which `id_`-suffixed raw replays do not. `capture_pdf.py` also
gives archive hosts a longer settle automatically.

## Choosing a Wayback snapshot

For a living post the snapshot *is* the content, so this is the one genuinely
consequential decision in the whole workflow.

1. List the `200` snapshots for the URL.
2. Pick one comfortably **after** the results were announced — for these years
   that means the spring or later of the following year, and a capture a year or
   two later is usually safest.
3. Fetch it and confirm the winners are present before adding it to the manifest.
4. Record the winner in `expect` so the choice is enforced from then on, and say
   in `note` why that snapshot.

An early snapshot is not merely less complete — it is a page with no Top 10 in
it, which will read as though the archive lost the results.

## Named traps

Confirmed by checking. Each is a plausible-looking page that is missing what you
wanted.

| Trap | Looks like | Actually |
|---|---|---|
| `20160409042357` of the 2015 post | the obvious early 200 capture | stops at the Final 15 — **no Top 10**. Use `20171225140648` or later |
| `20121209035519` of the 2012 post | a 2012 capture of the 2012 list | nominations stage only |
| The 2010 "Vote Now" post | the nominee list | no list at all |
| `portswigger.net/polls/...` | the voting candidates | "This poll is now closed", no candidates |
| `-of-2016` PortSwigger URLs | a 2016 cycle | hard 404; 2016 was folded into 2017 |
