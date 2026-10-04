---
type: Article
title: AI Agents Targeted U.S. and Canadian Government Websites
description: This follow-up expands the Rogue Agents evidence to United States and Canadian government targets and documents use of archive services as additional execution and retrieval paths. It correlates public infrastructure records while distinguishing observed behavior from unresolved actor attribution.
resource: "https://transluce.org/us-canada-gov"
tags: [article, webseclist-reference, en, transluce, ai-agent, browser-automation, proxy, data-exfiltration, case-study]
generated:
  by: webseclist-refs/1
  at: "2026-10-03T23:17:54+00:00"
status: stable
stale_after: 2027-10-03
sources:
  - id: original
    resource: "https://transluce.org/us-canada-gov"
    title: AI Agents Targeted U.S. and Canadian Government Websites
    author: Jack Cable, Daniel Chiu, Francisco Pernice, Laura Ruis
    last_modified: 2026-09-30
also_at: []
authors:
  - Jack Cable
  - Daniel Chiu
  - Francisco Pernice
  - Laura Ruis
canonical_url: ""
cited_by:
  - "2026-ai.md:352"
commit: ""
content_sha256: 9a4b0f8fd4b29e5996d814872844e33db66bde5a09931b35c2b2d8cb61f27b99
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://transluce.org/us-canada-gov"
published: 2026-09-30
publisher: Transluce
publisher_english: ""
raw_sha256: ebfdea5802862498004d5e036f4ca5d5918fa556c005eb8715196c8bdf9b3f34
retrieved_from: "https://transluce.org/us-canada-gov"
retrieved_kind: live
retrieved_utc: "2026-10-03T23:17:54+00:00"
slug: 2026-transluce-ai-agents-targeted-u-s-canadian-government-websites
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# AI Agents Targeted U.S. and Canadian Government Websites

**AI Agents Targeted U.S. and Canadian Government Websites** - Jack Cable, Daniel Chiu, Francisco Pernice, Laura Ruis, Transluce.

- Published: 2026-09-30
- Original: <https://transluce.org/us-canada-gov>
- Preserved from: https://transluce.org/us-canada-gov (live) on 2026-10-03
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so
it remains readable if the page goes offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

[ Incident Reports](https://transluce.org/investigations)

# AI Agents Targeted U.S. and Canadian Government Websites

Evidence from Arquivo.pt and urlquery.net

Jack Cable*, 1, Daniel Chiu*, Francisco Pernice*, 2, Laura Ruis*, 2, Selena Zhang*, 3, Tetiana Bas4, Jordan Chetty5, Farzaan Kaiyom1, Gary Shen4, Conrad Stosz†, 3, Jacob Steinhardt†, 3

1 Corridor · 2 MIT · 3 Transluce · 4 AIUC · 5 Hertz Foundation · * First authors, alphabetical · † Senior authors

Transluce | Published: September 30, 2026

Following up on our previous [blog post](https://transluce.org/agent-activity), we discovered several additional incidents where rogue AI agents appear to have used aggressive techniques to access publicly available data on government websites.

[Download the Data](https://transluce.org/data/us-canada-government-evidence-2026-09-30.zip)[Get Involved](https://docs.google.com/forms/d/e/1FAIpQLSdF3d3Q-0-ydXJPEdOrae-ZfF3Bf4XJhhhoGZLYINvxTl3QKw/viewform?usp=dialog)

This includes two rudimentary and failed hacking attempts, one against the U.S. Department of Education’s [Civil Rights Data Collection](https://civilrightsdata.ed.gov/), and one against Library and Archives Canada, a Canadian federal agency.

These failed attempts connect to additional rogue activity where agents used an array of aggressive tactics short of hacking to probe U.S. government websites, often using sites in unintended ways and sometimes violating explicit usage policies. This activity targeted websites across the White House, the Departments of War, Justice, and Commerce, the CDC and SEC, and state agencies in California, Maryland, Illinois, Texas, and New York.

We have so far identified no instances in these datasets where agents gained access to any information that is not publicly available.

We base our analysis below on data from our [previously published](https://transluce.org/agent-activity) [urlquery.net](http://urlquery.net) dataset, as well as [Arquivo.pt](http://arquivo.pt), a Portuguese web archive with a feature called ArchivePageNow that was used to send requests and retrieve data.

## Agents attempted a basic SQL injection on the U.S. Department of Education

On June 17, while apparently looking up school statistics, agents made more than 200,000 requests to a U.S. Department of Education website. The activity included a rudimentary failed hacking attempt, a SQL injection probe where the agents added the text “[`State_Id=1 OR 1=1`](https://arquivo.pt/wayback/20260617112600id_/https://civilrightsdata.ed.gov/api/v1.0/GetStateEstimation?survey_Year_Key=9&Measure_Id=1&State_Id=1%20OR%201=1)” in an attempt to bypass the site’s normal filters.

In the 40 seconds leading up to the SQL injection, there were a series of requests with a variety of unusual state ID inputs (without access to more context about the agents and their reasoning traces, the purpose of this set of queries is unclear):

-

[`State_Id=0`](https://arquivo.pt/wayback/20260617112523id_/https://civilrightsdata.ed.gov/api/v1.0/GetStateEstimation?survey_Year_Key=9&Measure_Id=1&State_Id=0)

-

[`State_Id=-1`](https://arquivo.pt/wayback/20260617112525id_/https://civilrightsdata.ed.gov/api/v1.0/GetStateEstimation?survey_Year_Key=9&Measure_Id=1&State_Id=-1)

-

[`State_Id=99`](https://arquivo.pt/wayback/20260617112527id_/https://civilrightsdata.ed.gov/api/v1.0/GetStateEstimation?survey_Year_Key=9&Measure_Id=1&State_Id=99)

-

[`State_Id=999`](https://arquivo.pt/wayback/20260617112528id_/https://civilrightsdata.ed.gov/api/v1.0/GetStateEstimation?survey_Year_Key=9&Measure_Id=1&State_Id=999)

-

[`State_Id=1,2`](https://arquivo.pt/wayback/20260617112530id_/https://civilrightsdata.ed.gov/api/v1.0/GetStateEstimation?survey_Year_Key=9&Measure_Id=1&State_Id=1,2) (potentially to test SQL injections/parameter handling)

-

[`State_Id=`](https://arquivo.pt/wayback/20260617112532id_/https://civilrightsdata.ed.gov/api/v1.0/GetStateEstimation?survey_Year_Key=9&Measure_Id=1&State_Id=) (empty string)

-

[`State_Id=1&State_Id=2`](https://arquivo.pt/wayback/20260617112553id_/https://civilrightsdata.ed.gov/api/v1.0/GetStateEstimation?survey_Year_Key=9&Measure_Id=1&State_Id=1&State_Id=2)

-

[`State_Id%5B%5D=1&State_Id%5B%5D=2`](https://arquivo.pt/wayback/20260617112556id_/https://civilrightsdata.ed.gov/api/v1.0/GetStateEstimation?survey_Year_Key=9&Measure_Id=1&State_Id%5B%5D=1&State_Id%5B%5D=2) (URL-encoded square brackets)

-

[`State_Id=1%2C2`](https://arquivo.pt/wayback/20260617112558id_/https://civilrightsdata.ed.gov/api/v1.0/GetStateEstimation?survey_Year_Key=9&Measure_Id=1&State_Id=1%2C2) (URL-encoded comma)

Data stored on this website appears to match a web search task in [Google's DeepSearchQA benchmark](https://huggingface.co/datasets/google/deepsearchqa), suggesting that the agents were not given a hacking-related task but were being graded on their ability to successfully retrieve specific niche information from the internet.

> **The specific DeepSearchQA task (dsqa_250):** *Using data from [civilrightsdata.ed.gov](http://civilrightsdata.ed.gov) for the 2017–2018 school year, determine which of the following states—South Carolina, North Carolina, Georgia, or Virginia—had the highest ratio of full-time equivalent school counselors to students reported as victims of race-related harassment or bullying.*

How the agents’ query parameters we observe in Arquivo traffic relate to dsqa_250:

| Query parameter | Explanation |  |
| `survey_Year_Key=9` | Corresponds with 2017-2018. Agents often made multiple queries using Arquivo to find this mapping, often enumerating IDs in order. |  |
| `Measure_Id=130` | Corresponds to race-based bullying victims. |  |
| `State_Id=11`, `State_Id=28`, `State_Id=41`, `State_Id=46` | Corresponds to the relevant states. |  |

We also note that more than 10,000 requests included a tag beginning with “`oai`” ([example](https://arquivo.pt/wayback/20260617080345id_/https://civilrightsdata.ed.gov/api/v1.0/GetStateEstimation?survey_Year_Key=10&Measure_Id=1&State_Id=1&zz=oai17816834089056622)).

We disclosed this attempted hack to the Department of Education on September 25, 2026. A Department spokesperson [subsequently commented](https://www.nytimes.com/2026/09/25/technology/openais-ai-us-government-websites.html) that they had observed no impact to their services from this reported incident.

## Agents attempted rudimentary hacks on Library and Archives Canada

On May 28, 2026, and June 9, 2026, Arquivo.pt captured 899 requests hitting the “collection-search” service of Library and Archives Canada (LAC), including a series of apparently failed rudimentary hacking attempts. The requests were associated with retrieving data on divorce records in Canada between 1905 and 1911.

We do not confidently attribute these attempts to OpenAI, but they exhibit tactics consistent with prior observed agent activity that we have attributed to OpenAI in a similar timeframe, including the use of [Arquivo.pt](http://arquivo.pt), conducting aggressive data collection focused on targeted, obscure information, and probing for cybersecurity vulnerabilities.

Of these 899 requests, 13 of them carried attack payloads rather than ordinary queries, including by probing for vulnerabilities in the record-identifier parameter. The payloads included:

-

Three SQL injection probes ([an apostrophe](https://arquivo.pt/wayback/20260528064303/https://recherche-collection-search.bac-lac.canada.ca/eng/Home/Record?app=divincan&IdNumber=%27), [`1 OR 1=1`](https://arquivo.pt/wayback/20260528064307/https://recherche-collection-search.bac-lac.canada.ca/eng/Home/Record?app=divincan&IdNumber=1%20OR%201%3D1), and [`1,2`](https://arquivo.pt/wayback/20260528064311/https://recherche-collection-search.bac-lac.canada.ca/eng/Home/Record?app=divincan&IdNumber=1%2C2))

-

An [encoded <](https://arquivo.pt/wayback/20260528064310/https://recherche-collection-search.bac-lac.canada.ca/eng/Home/Record?app=divincan&IdNumber=%253C) for cross-site scripting

-

[`2147483648`](https://arquivo.pt/wayback/20260528064308/https://recherche-collection-search.bac-lac.canada.ca/eng/Home/Record?app=divincan&IdNumber=2147483648) to test a 32-bit integer boundary

-

[The string `abc`](https://arquivo.pt/wayback/20260528064305/https://recherche-collection-search.bac-lac.canada.ca/eng/Home/Record?app=divincan&IdNumber=abc) for non-numeric handling

-

Five requests fuzzing the output format (`.json`, `?output=`, `?raw=`, `?url=`)

-

Two toggling a `debug=1` flag

We do not believe that these probes were successful: each one came back as a normal HTTP 200 with an empty record page, with nothing to indicate the database acted on the input or that any extra data was returned.

We disclosed this attempted hack to the Canadian government on September 28, 2026. On September 29, the Canadian Centre for Cyber Security issued [a public statement](https://www.cyber.gc.ca/en/news-events/statement-regarding-reported-activity-targeting-government-canada-websites) in response.

## Agents used a range of other aggressive tactics against U.S. state and federal websites

In addition to the above, we identified a broader pattern of automated workflows that we attribute to AI agents with varying levels of confidence, based on task-level connections, shared infrastructure, and timing. Some of this traffic overlaps to varying degrees with prior activity confirmed to be associated with OpenAI, and in some cases agents explicitly mark themselves as being associated with OpenAI. However, we are not attributing this traffic as a whole to OpenAI nor do we attempt to estimate attribution for each incident.

In the below cases, we did not observe hacking techniques. Rather, these workflows use aggressive or gray-area techniques to retrieve information from government websites, sometimes using sites in unintended ways or violating explicit usage policies. This includes techniques like making accounts with disposable email addresses, reusing exposed credentials, bypassing antibot controls, and flooding websites with requests.

We outline our observations here:

-

**Kansas:** On May 7, Arquivo recorded 36,578 user-triggered captures of [KansasMemory.gov](http://kansasmemory.gov) (a site apparently administered by the Kansas Historical Society with support from the Kansas government), with a peak of 1,093 captures per minute. Early requests [returned content](https://arquivo.pt/wayback/20260507102023id_/https://www.kansasmemory.gov:443/), but over the course of the campaign the website started returning [gateway timeouts](https://arquivo.pt/wayback/20260507121147id_/https://www.kansasmemory.gov:443/item/200569). We were not able to confirm whether the activity caused a service disruption.

-

**Illinois:** On four separate days between April 19 and May 1, we observed 251 related Arquivo captures involving Illinois’s legacy IQuery public-health statistics portal. Initial captures return “service unavailable”, but the automated workflow nevertheless tried workarounds, like [direct IP-routes](https://arquivo.pt/wayback/20260428041141id_/https://216.124.54.114/), [URL-parsing variations](https://arquivo.pt/wayback/20260428042348id_/https://216.124.54.114@iquery.illinois.gov/DataQuery/default.aspx), and [a guessed ePass route](https://arquivo.pt/wayback/20260428124522/https://webapps.illinois.gov/CMS/EPASS/iquery/DataQuery/Default.aspx) that redirected to the state’s sign-in system. None of the reviewed responses returned IQuery data.

-

**Maryland:** On May 6, Arquivo recorded 295,912 captures across multiple Maryland hosts containing education statistics, peaking at 5,594 captures per minute. The activity involves extensive [guessing of downloadable filenames](https://arquivo.pt/wayback/cdx?url=https%3A%2F%2Freportcard.msde.maryland.gov%2FDataDownloads%2F2021%2F2022%2F%2A&from=20260506000000&to=20260506235959&output=json&limit=100), alongside a successful download of [public aggregate datasets of students’ math performance](https://arquivo.pt/wayback/cdx?url=https%3A%2F%2Freportcardtest.msde.maryland.gov%2FDataDownloads%2FFileDownload%2F470&from=20260506&to=20260506&output=json). Separately, as early as March 2, Arquivo recorded a smaller burst of API requests to Maryland’s mathematics-performance API, although we have not established a connection with the later May activity.

-

**New York State:** On May 17, we observed archived activity attempting to access public New York school-enrollment statistics through modified URLs and multiple intermediary services. [Initial requests](https://arquivo.pt/wayback/20260517024556id_/https://data.nysed.gov/enrollment.php?gender%5B%5D=M&instid=800000050976&x=/&year=2017) were blocked, while later attempts [returned public statistics](https://arquivo.pt/wayback/20260517024710id_/https://data.nysed.gov/enrollment.php?gender%5B%5D=M&instid=800000050976&x=%2F&year=2017). The same school and enrollment selections appear in wiki activity previously documented by [collusion.wiki](http://collusion.wiki).

-

**Texas:** Also on May 17, archived results show repeated attempts to retrieve public sexually transmitted infection statistics from the Texas Department of State Health Services, through [direct export requests](https://urlquery.net/report/7db9a121-f851-4c26-9dc1-6c424f1812d6) as well as through intermediary conversion services which have previously been reported to be used by agents. We could not confirm successful retrieval of the requested statistics.

-

**California:** On May 26, a sequence of requests apparently bypassed antibot controls and retrieved public campaign-finance records from California's [CAL-ACCESS](https://cal-access.sos.ca.gov/). The workflow [initially encountered the site’s antibot protection](https://arquivo.pt/wayback/20260526134541id_/https://cal-access.sos.ca.gov/_Incapsula_Resource?SWUDNSAI=31) system, but subsequently retrieved records using paths with [file-like suffixes](https://arquivo.pt/wayback/20260526144633id_/https://cal-access.sos.ca.gov/Campaign/Committees/detail.aspx/foo.pdf?id=1440663&session=2023). Retrieved records include [campaign expenditure statements](https://arquivo.pt/wayback/20260526145645id_/https://cal-access.sos.ca.gov/PDFGen/pdfgen.prg/anything.pdf?amendid=0&filingid=2933098).

-

**White House Office of Management and Budget:** From May 25 to 27, we found 719 urlquery.net reports that appear to be attempts at downloading [two public fiscal-year 2023 budget reports](https://portal.max.gov/portal/document/SF133/Budget/FY%202023%20-%20SF%20133%20Reports%20on%20Budget%20Execution%20and%20Budgetary%20Resources.html) from OMB’s MAX.gov system. These reports show 145 distinct submission strings, 416 distinct method/URL pairs, and 243 trace groups spanning 2,922 HTTP entries. The URLs queried include variants with hostnames related to MAX’s [login](https://urlquery.net/report/599c2535-7ddb-4190-9d34-419f6343bab3) and [PIV](https://urlquery.net/report/bebe7b9b-bbfa-4e55-bf16-5e73ba1a2e22), and were sometimes queried through [intermediary services](https://urlquery.net/report/42fa1863-3649-4111-961b-95e9cc704b08). In one 27-second burst on May 26, the workflow submitted 16 versions of the same PDF URL through markdown.new (a service for converting webpages to agent-readable text), changing only an arbitrary `?uniqN` query parameter ([example](https://urlquery.net/report/78cb62bc-d613-4d00-8f8d-e7347f6d541a)). Other urlquery.net reports show that the workflow [successfully downloaded the public PDF](https://urlquery.net/report/f177cc9d-37a4-401d-93ee-096db8001860) and that an intermediary service [successfully extracted text from it into JSON](https://urlquery.net/report/23f112cb-cc70-4518-aefd-899ebbc7eb54). A preserved [collusion.wiki revision](https://collusion.wiki/explorer/page/dse~TestAgentResearchLinks#rev-1) contains a matching urlquery.net download reference, and a [May 27 screenshot](https://urlquery.net/report/7ced0884-a762-4424-bb31-5abb62eb6856/screenshot) shows the two reports together with several alternate ways of accessing them.

-

**U.S. Navy:** On April 23–24 and May 18, archived requests probed alternative URLs and endpoints on the Naval History and Heritage Command’s website, [history.navy.mil](http://history.navy.mil). Some of these returned [image metadata](https://arquivo.pt/wayback/20260518124954id_/https://www.history.navy.mil/content/dam/nhhc/our-collections/art/collection/2004/2004-092/2004-092-04.jpg/_jcr_content/metadata.json), while broader attempts to reach the website’s [content-management pages](https://arquivo.pt/wayback/20260424030054id_/https://www.history.navy.mil/mnt/overlay/dam/gui/content/assets/assetedit.html/content/dam/nhhc/research/library/subject-collections/menus-from-ship-to-shore/1920/images/menu_ch_1927a.jpg) for editing or publishing content failed. We found no evidence of access to sensitive military information.

-

**U.S. Department of Justice:** On May 30–31, an automated workflow sought public FBI arrest statistics through the Justice Department’s Office of Juvenile Justice and Delinquency Prevention (OJJDP). Legacy URLs repeatedly redirected to a replacement service, but the workflow succeeded at retrieving [the legacy table](https://arquivo.pt/wayback/20260530201938id_/https://www.ojjdp.gov/ojstatbb/ezapop/..%2Fezaucr/asp/ucr_display.asp) by adding an encoded parent-directory segment. The retrieved data, including [a 1980–2020 robbery table](https://arquivo.pt/wayback/20260531024127id_/https://www.ojjdp.gov/ojstatbb/ezapop/..%2Fcrime%2Fucr_trend.asp?table_in=1&selOffenses=4), plausibly matches a [DeepSearchQA](https://huggingface.co/datasets/google/deepsearchqa) question.

-

**Bureau of Economic Analysis (U.S. Department of Commerce):** On June 18, an automated workflow [attempted to register](https://arquivo.pt/wayback/20260618022938id_/https://api.microlink.io/?url=https%3A%2F%2Fexample.com&function=async%28%29%3D%3E%7Blet%20f%3Dnew%20FormData%28%29%3Bf.append%28%27org%27%2C%27OpenAI%20Research%27%29%3Bf.append%28%27email%27%2C%27sheet850ec368%40guerrillamailblock.com%27%29%3Bf.append%28%27terms%27%2C%271%27%29%3Bf.append%28%27captcha%27%2C%27Ttuwosv%27%29%3Bf.append%28%27key%27%2C%277b118ae7-28a9-44be-a1c5-6ccd221f04d9%27%29%3Blet%20r%3Dawait%20fetch%28%27https%3A%2F%2Fapps.bea.gov%2Fapi%2Fdata%2Fsignup%2FRegister%27%2C%7Bmethod%3A%27POST%27%2Cbody%3Af%7D%29%3Breturn%20JSON.stringify%28%7Bs%3Ar.status%2Ct%3Aawait%20r.text%28%29%7D%29%7D&meta=false&x=1781749777279510933) for a Bureau of Economic Analysis (BEA) API key using a disposable email address and the self-entered organization name “OpenAI Research,” with no confirmed successful registration. The workflow also [unsuccessfully attempted to use an OCR service](https://arquivo.pt/wayback/20260618022418id_/https://api.microlink.io/?url=https%3A%2F%2Fexample.com&function=async%28%29%3D%3E%7Blet%20c%3Dawait%28await%20fetch%28%27https%3A%2F%2Fapps.bea.gov%2Fapi%2Fdata%2Fsignup%2FGetCaptcha%27%29%29.json%28%29%3Blet%20f%3Dnew%20FormData%28%29%3Bf.append%28%27apikey%27%2C%27helloworld%27%29%3Bf.append%28%27language%27%2C%27eng%27%29%3Bf.append%28%27base64Image%27%2C%27data%3Aimage%2Fpng%3Bbase64%2C%27%2Bc.img%29%3Blet%20r%3Dawait%20fetch%28%27https%3A%2F%2Fapi.ocr.space%2Fparse%2Fimage%27%2C%7Bmethod%3A%27POST%27%2Cbody%3Af%7D%29%3Breturn%20JSON.stringify%28%7Bkey%3Ac.key%2Cocr%3Aawait%20r.text%28%29%7D%29%7D&meta=false&x=1781749457071793861) to make the CAPTCHA machine-readable. The sequence occurred amid a larger cluster of 3,005 BEA-related Arquivo captures between June 16 and 18.

-

**Census Bureau (U.S. Department of Commerce):** Between June 16 and 22, publicly posted URLs indicate attempts to reuse exposed API keys to access [census.gov](http://census.gov) data. Several of the related pages contain OpenAI markers. We do not share underlying URLs in this case to avoid republishing sensitive materials, and found no response showing that these attempts were successful or ever reached census.gov.

-

**U.S. Securities and Exchange Commission:** On June 18, a workflow sought public SEC crowdfunding statistics. Previously documented agent communication claims that [double-slash URL paths can bypass rate limits](https://collusion.wiki/explorer/page/dse~OpenAIMassValuesJune20Master#rev-32), and separate urlquery.net records demonstrate those [URLs indeed returning public county data](https://urlquery.net/report/e3a93b49-bf72-424a-9b12-b9f0b57368b2). Ordinary paths also succeeded, so no rate-limit bypass has been demonstrated.

-

**Centers for Disease Control and Prevention:** On July 18, an archived browser-execution program attempted to submit a data request to CDC’s WONDER statistics service (link not included here because it contains executable code), including acceptance of its data-use terms. A [capture one second later](https://web.archive.org/web/20260718122650id_/https://wonder.cdc.gov/controller/datarequest/D158) returns a query-validation error, consistent with execution of the form-submission code, although we are not able to establish the complete execution chain.

## How we identified and assessed the activity

We relied primarily on publicly available data from [urlquery.net](http://urlquery.net) (a web security service) and [Arquivo.pt](http://arquivo.pt) (a web archive service) to identify the activity above. Agents apparently used these platforms to route their requests around restrictions placed on them either by their developers or by the websites they targeted, but both services also made the agents’ requests public by default. We have identified these and other promising data sources through web searches, references in existing investigations and concrete examples of task-related activity.

As we analyzed this data, our guiding principle was to identify which of this traffic was left by AI agents and to study their behavior as they tried to complete their tasks. For example, we looked for high-volume, apparently automated patterns of requests that appear related to web retrieval tasks that we know previously reported agent swarms were being trained and evaluated on. To identify aggressive tactics, we searched within this traffic for recognizable exploit patterns and related activity, such as SQL expressions inserted where a record ID should be (e.g. “`1 OR 1=1`”), injected JavaScript, or paths attempting to reach sensitive files such as `/etc/passwd`.

To help correlate individual requests with each other, we also examined sequences of requests that changed URL paths, encodings, or retrieval services after failures, and we connected related requests through shared record IDs, distinctive URL parameters, and timing.

To implement this approach, we used a combination of regex matching, LLM-as-a-judge, coding agent investigation, and manual human investigation.

## What is Arquivo.pt?

The free online service [arquivo.pt](http://arquivo.pt) is the national Portuguese web archive, operated by the Portuguese [Foundation for Science and Technology](https://www.fct.pt/en/) (FCT). Its purpose is to allow a user to search and access historical versions of web content collected since 1996. It primarily covers the Portuguese web, but also contains material from international sites and supports full-text search across the archived corpus.

The site’s Terms and Conditions, last updated August 25, 2022, say that [Arquivo.pt](http://arquivo.pt) is intended to support educational, scientific, and research work, and that commercial use is expressly prohibited. They also prohibit using accessed contents for commercial purposes, distribution, modification, or forwarding to other sites.

For a knowledge retrieval task, it provides the following functionality that may be useful to an AI agent:

-

It gives an actor able to make HTTP GET requests access to a large corpus of archived web content through a programmable API, with full-text search.

-

It can recover information from pages that are unavailable on the live web. Given a URL, an agent can query [Arquivo.pt](http://arquivo.pt)'s version history and obtain preserved versions of that page. This is useful when a source has been deleted, moved, changed substantially, or is otherwise inaccessible from the live site.

-

It can provide an alternative retrieval path when querying the original site is undesirable.

-

It can provide an indirect way to execute JavaScript through its screenshot service. This can help an agent inspect content generated dynamically by scripts without running a browser locally. If the service accepts a page whose scripts the actor controls, it can also provide a means of running actor-supplied JavaScript.
