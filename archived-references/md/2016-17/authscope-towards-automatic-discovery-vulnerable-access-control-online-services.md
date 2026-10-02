---
type: Whitepaper
title: "AUTHSCOPE: Towards Automatic Discovery of Vulnerable Access Control in Online Services"
description: "AUTHSCOPE drives mobile apps automatically, learns which fields of their authenticated API requests carry identity, then substitutes another user's identifiers or tokens and compares the responses to spot servers that hand back data belonging to someone else. It surfaces broken access control across online services at scale without server source code."
resource: "https://acmccs.github.io/papers/p799-zuoA.pdf"
tags: [whitepaper, webseclist-reference, idor, auth-bypass, rest-api, android, dynamic-analysis, tooling, info-leak, large-scale-scan, owasp-a01-2021]
generated:
  by: webseclist-refs/1
  at: "2026-08-12T16:01:25+00:00"
status: stable
stale_after: 2027-08-12
sources:
  - id: original
    resource: "https://acmccs.github.io/papers/p799-zuoA.pdf"
    title: "AUTHSCOPE: Towards Automatic Discovery of Vulnerable Access Control in Online Services"
also_at: []
authors: []
canonical_url: ""
cited_by:
  - "2016-17.md:94"
commit: ""
content_sha256: 4aa98075f242942354aba3ec96d621167dbc4287cbea80665a50534d3fa86413
depth: full
depth_reason: default
kind: whitepaper
language: ""
licence: unknown
original_url: "https://acmccs.github.io/papers/p799-zuoA.pdf"
published: ""
publisher: ""
publisher_english: ""
raw_sha256: a5304e8816551432a54dbfe6ef0c2eeab6425d09de512996280c26ad37e656aa
retrieved_from: "https://acmccs.github.io/papers/p799-zuoA.pdf"
retrieved_kind: stored
retrieved_utc: "2026-08-12T16:01:25+00:00"
slug: authscope-towards-automatic-discovery-vulnerable-access-control-online-services
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# AUTHSCOPE: Towards Automatic Discovery of Vulnerable Access Control in Online Services

**AUTHSCOPE: Towards Automatic Discovery of Vulnerable Access Control in Online Services** - Author not stated, Publisher not stated.

- Published: date not stated
- Original: <https://acmccs.github.io/papers/p799-zuoA.pdf>
- Preserved from: https://acmccs.github.io/papers/p799-zuoA.pdf (stored) on 2026-08-12
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

# AUTHSCOPE: Towards Automatic Discovery of Vulnerable Access Control in Online Services

--- page 1 ---

4
;
838
 
597
 
306

 
 
!

--- page 2 ---

Session 
D2: 
Vulnerable 
Mobile 
Apps

--- page 3 ---

CCS’17, 
October 
30-November 
3, 
2017, 
Dallas, 
TX, 
USA

--- page 4 ---

4
;
838

 
 
 
 
597
 
 
306

 
61
 
 
 
 
 
 
61
 
 

 
 
 
 
 
 

 
 
 
 
 
 

 
 
4
;
838
 
597

 
 
306
 
 
 
 
 
 
 
 

 
 
1
2
3
4
	






--- page 5 ---

¶ 
 
 
 
 
 

· 
 
 

¸ 
 
 
 

¹ 
 
 
 
 
 
 
 
 
 

 
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

 
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

 
 

 

 
 
 
W

 

 
W
 
 
 
 
 

 
W
 
 
 
 

 
 
 
 

 
 
 
W
 
 

 
21690
 
 
21691
 
 
 
21690

21691
 
 
 

 
W
 
 

 
 
 

21690
 
21691
 
 

 
 
W

--- page 6 ---

GET /api/v1//users/21691/
notifications?in_app_token=
fb153b7d8c0a
0c6ac841d7bfbd9446de627c642858 
HTTP/1.1
Host: api.*****.com
Connection: closeHTTP/1.1 200 OK
Cache-
Control: max-
age=0, private, must-
revalidate
Content-
Type: application/json
ETag: W/"6ee365b32e7f3e145d5c74778ea243cd"
Server: nginx/1.6.2
X-
Request-
Id: 4970cafb-
9438-
4a70-
96e0-
ca2f789f0d5d
X-
Runtime: 0.022889
Content-
Length: 192
Connection: Close
[{"id":
433227,"sender":null,"dog":null,"notification_type":15,"n
otification_text":"Welcome to *****.","object_id":
21691,"is_seen
":true,"is_read":
false,"created_at":"2017-
01-
28T23:56:40.533Z"}]
(a
) AliceÕs first request and response message after login
(b) BobÕs first request and response message after loginGET /api/v1//users/21690/
notifications?in_app_token=
e67315b35aa3
8d4ac8cac3cd9c7f88ae7f576d373f
HTTP/1.1
Host: api.*****.com
Connection: closeHTTP/1.1 200 OK
Cache-
Control: max-
age=0, private, must-
revalidate
Content-
Type: application/json
ETag: W/"5319d96924bb6d0a761b5f13b248919c"
Server: nginx/1.6.2
X-
Request-
Id: 5775d45e-
cc3b-
4665-
8bc6-
c2c7a2c9180d
X-
Runtime: 0.027840
Content-
Length: 191
Connection: Close
[{"id":
433222,"sender":null,"dog":null,"notification_type":15,"n
otification_text":"Welcome to *****.","object_id":
21690,"is_seen
":true,"is_read":
true,"created_at":"2017-
01-
28T23:54:59.831Z"}]
 

 
 GET /api/v1//users/21691/
notifications?in_app_token=
e67315b35aa3
8d4ac8cac3cd9c7f88ae7f576d373f
HTTP/1.1
Host: api.*****.com
Connection: closeHTTP/1.1 200 OK
Cache-
Control: max-
age=0, private, must-
revalidate
Content-
Type: application/json
ETag: W/"6ee365b32e7f3e145d5c74778ea243cd"
Server: nginx/1.6.2
X-
Request-
Id: 4970cafb-
9438-
4a70-
96e0-
ca2f789f0d5d
X-
Runtime: 0.022889
Content-
Length: 192
Connection: Close
[{"id":
433227,"sender":null,"dog":null,"notification_type":15,"n
otification_text":"Welcome to 
*****.","object_id":21691,"is_seen
":true,"is_read":
false,"created_at":"2017-
01-
28T23:56:40.533Z"}]
 

 
 
 
 
 
 
 
 
 

 
 
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

 
 
 
 
 

 

 
 
 
21690

21691

--- page 7 ---

Field Recognition 
a
nd Substitution
Response Message 
L
abeling
Alice’s Request
1
Alice’s Request
2
Bob’s Request
Alice’s Request
1
Alice’s Request
2
Bob’s Request
A
lice’s Response
1
Alice’s Response
2
Bob’s Response
Field-Substituted Alice’s Request Messages (for Bob)
Server Response Messages for the Field-Substituted Request
1
2
3
1
2
3
4
5
6
7
8
Post-Authentication
M
essage Generation
Smartphone
M
an-in-the-Middle Proxy
Cloud
 

 
 
 
 
 
 

 
 

 

 
 

 
 
 
 

 
 
 
 
21690

21691
 
 
 
 
 
 
 
 

 
 
 
 

 
 

 
 
 

 
 
 
 
 
 

 
 

 
W

--- page 8 ---

<
N
;
C
;
T
;
I
;
A
;
H
>
 

 

N
 
N
 
 

C
 
C
 

 

T
 
T
 
 
 

 

 

I
 
I
 
 

 
 
 

 

A
 
A
 

H
 
H

--- page 9 ---

<
N
;
C
;
T
;
I
;
A
;
H
>

 

 
 

 
 
 
<
T
;
H
;
L
>

L
 
 

T

H
 
 
<
T
;
H
;
L
>
 
 
 

 
H
 
 

 
L

 

 
 

 

 
 
 
 
N
;
C
;
A
 
H
 
 
 

 
 
<
N
;
C
;
T
;
I
;
A
;
H
>
 

 
 
 

 
 
 
 

 

 
 

 

 

 
 
 

 
 
 

 
 

 
 
 
 

 
 
 
 
 

 
 

 
 
 
 

 

 

 

 
 
 
 

 
 
 
 
 
 
 
 

 
 
 
 

 
 
 
 
 
 
 
 
 
 
 

 

 
 
 
 
 
 

 
 
 
 
 

 

 
 

 
 
 
 
 
 
 
 
 
 

 
 
 
 

<
name
;
v
alue
>

 
 
 
 
 
 
 
 
 
 
 
<
name
;
v
alue
>

--- page 10 ---

<
name
;
v
alue
>
 
 

 
 
 
 
 
 

 
 
 
 
<
name
;
v
alue
>
 
 
 
 
 
 
 
 

 

 
 
 
 
 

 
 
 
 

 
 
 
1
 
 
2
 
 

 
 
 

 

 
 
 

 
 
 
 
1
 
 
 
 
 
 
 
 

 

 
 

 
 

 
 
 
 
 
1
 
 
2
 
 
 
 
 
 
 
 
 
ED

+1

 

 
 
 
 

 
 
 
 
 
 

 
 
ED
 
 
 
ED
 
 
 
 
E D
 
 
ED
 

 
 
+1 
 
 
 
 
 

ED
 
+1

 
 
 
 
 
 
 
 
 
ED

+1 
 
 
ED
 
 
 
 
 

 
ED
 
 
ED
 
+1 
 
ED
 
 
+1

--- page 11 ---

5
;
000
 
300
 
 

 
 
 
 
 
 

 
 
 
 
200
;
000
 
 
 
 
33
;
950
 
 
 
 
 
 

 
 
 
 

 
 
 
 
 
 
 

4
;
838

--- page 12 ---

0
50
100
150 


 
4
;
8 38

 
562
:
4

 
3
;
2 20
;
886

 
178
;
5 39

 
59
:
2

 

 
169
:
9

 

 
15
;
3 67

 

 
503
;
4 41

 

 
20
;
7 04

 

 
1
;
1 81
;
442

 
57
;
7 36

 
2
;
9 76

 
2
;
3 79

 
597
 

 
 
 
 
 
 
 

 

 
 
 
562
:
4
 
 
4
;
838
 
597

 
 
306
 

 
 
3
;
2
20
;
886
 
 
178
;
539
 
 
59
:
2
 
 
196
:
9
 

15
;
367
 
503
;
441
 
 
20
;
704
 
1
;
181
;
442

 
57
;
736
 
2
;
976

 
 
2
;
379

 
597

 
 
306

--- page 13 ---

I
 
 
 
 

 
 
 
 
 
 
 

 
 
 
 00 {
01 ...
02 "response":{
03 "user":{
04 "idnum":false,
05 "
name":"Bob",
06 "
lastname":"Ccs",
07 "
birthday":"1990-
04-
26",
08 "
gender":"M
",
09 "
email":"bob4testapp@gmail.com",
10 "type":"EMAIL",
11 "firstlogin":"1",
12 "country":{
13 "id":"10",
14 "name":"United States",
15 ...
16 },
17 "post_on_activities":"disabled",
18 "
bananas_count":0
,
19 "
id":"673491",
20 "
fbid_number":"106611716575863",
21 "
current_latitude":Ó30
.9863214",
22 "
current_longitude":Ó-
8
6.7501116",
23 "
bananas_history":"https:\ /\/
profile.*******.com\
/bananas\
/store\
/673491\
/?accesstoken=debda35ccd92f4b8e2e06f0bff3b6e49279
a557d&latitude=30
.9863214&longitude=-86
.7501116&lang=
",
24 ...
25 }
26 }
27 }
 

I

 
 
61
 
 
 
 
 
 
 
 
I

 
K
 
 

 
 
 
 
 
I
 
 
I
 
100
;
000

500
;
000
 
 
 
 
673436
 
673491

 
 
 

 
 
 
 
 
 
 
 
 
500
;
000
 
 
500
;
000

--- page 14 ---

00 {
01 
 "pk_i_id": "163126",
02 
 "
dt_reg_date": "2017-
04
-
30 
23:21:59
",
03 
 "dt_mod_date": "2017-
04
-
30 
23:36:58
",
04 
 "
s_name": "Bob Ccs",
05 
 "s_username": "163126",
06 
 "
s_password": "7c4a8d09ca3762af61e59520943dc26494f8941b
",
07 
 "s_secret": "6stgMaAb",
08 
 "
s_email": 
"
bob4testapp@gmail.com",
09 
 "s_website": "bob.ccs\
/i
ndex.html",
10 "
s_phone_mobile
": "4695855213",
11 
 "s_pass_ip": null,
12 
 "fk_c_country_code": null,
13 
 "
s_country": "Tanzania",
14 
 "s_address": "15246 Sni Rd. APT 252 Tanzania",
15 
 "
fk_i_region_id
": "17",
16 
 "s_region": "Mara",
17 
 "
d_coord_lat": 
null,
18 
 "d_coord_long": 
null,
19 
 "
b_company": "0",
20 
 "i_items": "1",
21 
 "
i_comments": "0",
22 
 "dt_access_date
": "2017-
04-
30 
23:46:05",
23 
 "
s_access_ip": "",
24 
 "b_prefer_phone
": "1",
25 
 "
s_dialing_code
": "+255",
26 
 "fk_i_category_id": "22",
27 
 "
s_facebook_page": "http:\
/\
/",
28 ...
29 }
 
K

 
 
 
 
K
 
 

500
;
000

1
;
000
;
000
 
 
 
 
 
 
 
 
 
 

 
 
 
 
 
 

 
 
 
 

 
 
K
 
 
 
 
 
K
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
25
;
000

--- page 15 ---

4
;
838
 
597
 
306

--- page 16 ---

_frmn`9Z^#'p0Y'Nj<RmIO
[$;[XG6J2S!_bj[CCnA[$B_bL9=n,NFQRY66j.IV3R0kQ,ki&<DtXVH2Q1KOk61
aSOp]mBq*f6mDS.gS?g>k0W*+nYdGLjkU!Sn.uWea-c3nhl/6$6jOJq*U-8;00Ze0
a*MI':=eoMM"AKms3o,3"O!4TDcUo*XFUefF"4_HKTb
