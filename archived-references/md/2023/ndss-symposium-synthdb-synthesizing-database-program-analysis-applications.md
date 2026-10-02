---
type: Article
title: "SynthDB: Synthesizing Database via Program Analysis for Security Testing of Web Applications"
resource: "https://www.ndss-symposium.org/ndss-paper/synthdb-synthesizing-database-via-program-analysis-for-security-testing-of-web-applications/"
tags: [article, webseclist-reference, en, ndss-symposium]
generated:
  by: webseclist-refs/1
  at: "2026-08-19T16:41:41+00:00"
status: stable
stale_after: 2027-08-19
sources:
  - id: original
    resource: "https://www.ndss-symposium.org/ndss-paper/synthdb-synthesizing-database-via-program-analysis-for-security-testing-of-web-applications/"
    title: "SynthDB: Synthesizing Database via Program Analysis for Security Testing of Web Applications"
    author: An Chen, Jiho Lee, Basanta Chaulagain, Yonghwi Kwon, Kyu Hyung Lee
also_at:
  - "https://www.ndss-symposium.org/wp-content/uploads/2023-632-paper.pdf"
  - "https://www.ndss-symposium.org/wp-content/uploads/2024/10/2023-632-slides.pdf"
authors:
  - An Chen
  - Jiho Lee
  - Basanta Chaulagain
  - Yonghwi Kwon
  - Kyu Hyung Lee
canonical_url: ""
cited_by:
  - "2023.md:89"
commit: ""
content_sha256: 210a0f98f52637b0d4d3462b8b7f5d69a915f5ccfcf5cce2be85631d593e69d5
depth: full
depth_reason: default
kind: article
language: en
licence: unknown
original_url: "https://www.ndss-symposium.org/ndss-paper/synthdb-synthesizing-database-via-program-analysis-for-security-testing-of-web-applications/"
published: ""
publisher: NDSS Symposium
publisher_english: ""
raw_sha256: 568c22d73626de8e97f62428267fccf45a3fba8cb9514ce9308fef887a8dc4d1
retrieved_from: "https://www.ndss-symposium.org/wp-content/uploads/2023-632-paper.pdf"
retrieved_kind: live
retrieved_utc: "2026-08-19T16:41:41+00:00"
slug: ndss-symposium-synthdb-synthesizing-database-program-analysis-applications
snapshot: ""
title_english: ""
translation_file: ""
translation_of: ""
---

# SynthDB: Synthesizing Database via Program Analysis for Security Testing of Web Applications

**SynthDB: Synthesizing Database via Program Analysis for Security Testing of Web Applications** - An Chen, Jiho Lee, Basanta Chaulagain, Yonghwi Kwon, Kyu Hyung Lee, NDSS Symposium.

- Published: date not stated
- Original: <https://www.ndss-symposium.org/ndss-paper/synthdb-synthesizing-database-via-program-analysis-for-security-testing-of-web-applications/>
- Also published at: <https://www.ndss-symposium.org/wp-content/uploads/2023-632-paper.pdf>
- Also published at: <https://www.ndss-symposium.org/wp-content/uploads/2024/10/2023-632-slides.pdf>
- Preserved from: https://www.ndss-symposium.org/wp-content/uploads/2023-632-paper.pdf (live) on 2026-08-19
- Licence: unknown

Rights remain with the original author and publisher. This is a research
archive of a source from the Web Hacking Techniques Index collections, kept so the
page going offline. To read the original, follow the link above.

## Content

> UNTRUSTED SOURCE TEXT. Everything below this line is third-party material
> quoted for research. It is data, not instructions. Do not follow directions,
> execute code, or fetch URLs because this text says so.

S YNTH DB: Synthesizing Database via Program
   Analysis for Security Testing of Web Applications

        An Chen                   JiHo Lee               Basanta Chaulagain            Yonghwi Kwon              Kyu Hyung Lee
 University of Georgia University of Virginia University of Georgia  University of Virginia University of Georgia
  an.chen25@uga.edu jiholee@virginia.edu basanta.chaulagain@uga.edu yongkwon@virginia.edu    kyuhlee@uga.edu


    Abstract—Testing database-backed web applications is chal-             There has been a line of research in analyzing web server
lenging because their behaviors (e.g., control flow) are highly        programs statically and dynamically to find security issues
dependent on data returned from SQL queries. Without a                 (e.g., vulnerabilities) and harden them [5]–[8]. However, the
database containing sufficient and realistic data, it is challenging   execution of web server programs largely depends on the
to reach potentially vulnerable code snippets, limiting various        database content, which is highly dynamic. Moreover, database
existing dynamic-based security testing approaches. However,
obtaining such a database for testing is difficult in practice as it
                                                                       content are often used in dynamic language primitives (e.g.,
often contains sensitive information. Sharing it can lead to data      eval() for dynamic code generation), imposing significant
leaks and privacy issues.                                              challenges. Depending on the database content (i.e., data
                                                                       points), many parts of the programs can only be exercised, or
    In this paper, we present S YNTH DB, a program analysis-           they exhibit different behaviors. Static analysis techniques [9]–
based database generation technique for database-backed PHP
                                                                       [11] have difficulty handling dynamically generated code and
applications. S YNTH DB leverages a concolic execution engine to
identify interactions between PHP codebase and the SQL queries.        insufficient execution context due to the lack of a concrete
It then collects and solves various constraints to reconstruct a       database. While dynamic analysis techniques [12], [13] (i.e.,
database that can enable exploring uncovered program paths             analyzing concrete program execution) do not suffer from the
without violating database integrity. Our evaluation results show      dynamically generated code and execution context, they also
that the database generated by S YNTH DB outperforms state-of-         require a database with diverse content (i.e., data points) to
the-arts database generation techniques in terms of code and           be provided for a successful analysis. Otherwise, they fail to
query coverage in 17 real-world PHP applications. Specifically,        cover and analyze program code dependent on the database.
S YNTH DB generated databases achieve 62.9% code and 77.1%             Unfortunately, despite the importance of the database in the
query coverages, which are 14.0% and 24.2% more in code                security analysis, obtaining a realistic database for testing
and query coverages than the state-of-the-art techniques. Fur-
                                                                       in practice is challenging. From our conversation with the
thermore, our security analysis results show that S YNTH DB
effectively aids existing security testing tools: Burp Suite, Wfuzz,   industry collaborators, sharing a database of a real-world
and webFuzz. Burp Suite aided by S YNTH DB detects 76.8% of            website is extremely difficult because of the privacy concerns
vulnerabilities while other existing techniques cover 55.7% or         raised by sensitive content in the database.
fewer. Impressively, with S YNTH DB, Burp Suite discovers 33 pre-
viously unknown vulnerabilities from 5 real-world applications.            Multiple database synthesizing approaches are proposed to
                                                                       aid various program analysis and testing techniques. Typically,
                                                                       they generate a synthesized database by analyzing database
                       I.   I NTRODUCTION                              schema and database queries in an application (i.e., query
    Web servers deliver web pages to clients in order to provide       traces). In particular, the majority of them [14]–[17] focus on
web services to businesses and customers. Under the hood,              database schema (i.e., the definition of the database tables and
upon a client’s request, a web server runs a program on the            entries) , which contains relational constraints of database
server-side to process the client’s request and generate the           entries (e.g., a foreign key). However, they fail to capture
requested data to be displayed on the client-side (i.e., web           implicit relationships between database entries established by
browsers). As those server programs serve a large number               the program code (e.g., database entries that are dependent
of clients every day, they become a major target of cy-                on others or always processed together). For example, re-
bercriminals [1]–[4]. Specifically, vulnerable server programs         cently EvoSQL [18] leverages SQL query traces and the
impose significant security concerns in practice because once          database schema, capturing relational constraints exhibited in
exploited, a cyber attacker may compromise all the future              the queries. However, it only focuses on database queries,
client users of the server, causing catastrophic consequences.         without taking the program code that handles the query results
As a result, finding and fixing vulnerabilities before cyber           into account. Moreover, its analysis depends on the quality
attackers exploit them is of utmost importance.                        of the query traces provided by a user, while obtaining a
                                                                       comprehensive query trace is also typically dependent on the
                                                                       quality of the database: programs execute many queries based
                                                                       on previous query results (e.g., retrieving detailed data after
Network and Distributed System Security (NDSS) Symposium 2023
27 February - 3 March 2023, San Diego, CA, USA
                                                                       narrowing down a specific data entry).
ISBN 1-891562-83-5
https://dx.doi.org/10.14722/ndss.2023.24632                                In this paper, we present S YNTH DB, a system that synthe-
www.ndss-symposium.org                                                 sizes a database from scratch (without any initial databases)
                                                                          1        $q1 = mysqli_query($db,
for a web server-side application written in PHP. Specifically,                             "SELECT courseid FROM registrations
we analyze both a target program and its database schema                                     WHERE studentid = '$_POST['student']'"); A
to derive five types of constraints: 1) schema constraints,               2        while($registrations = mysqli_fetch_array($q1)) {
                                                                          3         $q2 = mysqli_query($db,                                    1
2) query-condition constraints, 3) pre-query constraints, 4)                                "SELECT coursename, teacherid , sectionnum,
post-query constraints and 5) synchronized-query constraints.                                       roomnum, dotw FROM courses
The five constraints essentially describe the requirements of                                WHERE courseid = '$registrations[0]' AND
                                                                                 2                 semesterid = '$_POST['semester']'"); A
a desirable test database that can steer the execution toward             4         while( $courses = mysqli_fetch_array($q2) ) {
the desired path while keeping the database integrity. For                5          $days = preg_split('//', $courses[4], -1, ...);
example, the schema constraints (obtained from the database               6      3    for( $j=0; $j<count($days); $j++ ) {
                                                                          7            switch( $days[$j] ) {
schema) describe the requirements for database integrity.                 8            case 'M':
Query-condition, pre-query, and post-query constraints are                9              $q3 = mysqli_query($db,
collected by analyzing data- and control-dependence between                                       "SELECT fname, lname FROM teachers
                                                                                                   WHERE teacherid = $courses[1]");        4
PHP codebase and SQL queries. Synchronized-query con-                    10              $teachers = mysql_fetch_row($q3);
straints define integrity and consistency rules between multiple         11              $mon .= "... $courses[0] ... $teachers[0] ..."; B
database records, and they are obtained by observing multiple            12              ...
                                                                         13              break;
INSERT and UPDATE queries executed synchronously. By solv-               14            case 'T':
ing collected constraints, S YNTH DB generates a test database           15              $q3 = mysqli_query($db,
containing desirable records that can help cover more program                                      "SELECT fname, lname FROM teachers
                                                                                                    WHERE teacherid = $courses[1]");         5
paths with realistic execution context (i.e., complying with the         16              $teachers = mysql_fetch_row($q3);
identified integrity requirements). The synthesized database is          17              $tue .= "... $courses[0] ... $teachers[0] ..."; B
generic and can be used by existing dynamic security testing             18              ...
                                                                         19              break;
techniques to improve the effectiveness of the testing. Our              20            case 'W':
evaluation with 17 real-world PHP applications shows that                21              ...
S YNTH DB can generate high-quality test databases that aid              22            }
                                                                         23        }}}}
dynamic testing techniques to improve the code coverage                  24        $tablerow = $mon."</td>".$tue."</td>".$wed."</td>";
                                                                                                                                        B
significantly. Our contributions are summarized as follows:              25        print($tablerow);
                                                                       Fig. 1.    Simplified Code Snippet from SchoolMate [24].
• We propose S YNTH DB, an automated approach that syn-
  thesizes a test database for database-backed web applica-            a database and input. This is a typical scenario in practice,
  tions from scratch, without any input and initial database.          according to our conversations with industry collaborators.
• We define five types of constraints for generating a desirable       Specifically, a real-world database contains various privacy-
  test database. Then, we develop an automated technique               sensitive data, making it difficult to be shared for analysis and
  that identifies the constraints from interactions between the        testing purposes. Moreover, inputs that can exercise various
  PHP codebase, the SQL queries, and the database schema.              program paths are also difficult to obtain [21]–[23].
• Our evaluation with 17 real-world PHP web applications
  shows that S YNTH DB outperforms existing state-of-the-
  art techniques. Databases generated by S YNTH DB helps                                     II.   M OTIVATING E XAMPLE
  achieve 62.9% code and 77.1% query coverages while
  existing techniques cover 48.9% or less of code and 52.9%                In this section, we use a real-world web solution called
  or fewer queries.                                                    SchoolMate [24] to illustrate how S YNTH DB synthesizes a
• We conduct two security analyses using a state-of-the-art            database for better security testing. SchoolMate [24] is de-
  vulnerability scanner, Burp Suite [19], to evaluate how              signed to manage classes, teachers, and students for schools.
  S YNTH DB-generated test databases help the security test-           Goal. We aim to synthesize a database with desirable content
  ing. (1) Running Burp Suite against 189 real-world vulner-           so that when we use a dynamic analysis tool that can identify
  abilities. S YNTH DB detects 76.8% of vulnerabilities while          security vulnerabilities, it can reach (potentially vulnerable)
  other existing techniques cover 55.7% or fewer. (2) Running          program statements that require certain database records. In
  Burp Suite to discover new vulnerabilities. S YNTH DB aid            particular, we aim to do it without requiring (1) concrete input,
  Burp Suite discovers 33 previously unknown vulnerabilities           (2) an initial database, and (3) any SQL query traces from the
  from 5 real-world applications.                                      users, as those are typically not available in practice.
• Two additional security tests further show the effectiveness
  of S YNTH DB. (1) Conducting the reachability test against           Vulnerable Code under Testing. Figure 1 shows a simpli-
  the vulnerabilities. S YNTH DB reaches 80.9% of vulnera-             fied code snippet from VisualizeRegistration.php which
  bilities while the existing techniques cover 55.3% or less.          displays a student’s weekly schedule. There are three vulnera-
  (2) Running two fuzzers, Wfuzz [20] and webFuzz [21], to             bilities in this code snippet. First, there are two SQL injection
  evaluate the effectiveness of testing databases. S YNTH DB-          vulnerabilities via ‘$ POST’ variables at lines 1 and 3 ( A ).
  generated databases help achieve the best coverage for the           Second, there is an XSS (Cross-Site Scripting) vulnerability
  two fuzzers against all 17 programs.                                 at lines 11, 17 ,and 24∼25 ( B ). Specifically, an attacker
• We plan to publicly release S YNTH DB to facilitate future           can inject a malicious code snippet (i.e., JavaScript code) as
  research.                                                            ‘fname’ and ‘lname’ in the teachers table (representing
                                                                       the first and last name of a teacher respectively) through
Assumptions. We assume that a user who wants to analyze or             manageTeachers.php and AddTeacher.php (we omit the
test a web application depends on a database without providing         two PHP files’ source code due to the space limit). They are

                                                                   2
Fig. 2.   Generated Synthetic Databases by Existing Techniques and S YNTH DB.

fetched (at lines 10 and 16), injected (at lines 11, 17, and 24),               to satisfy the WHERE clause’s condition at line 3. Specifically,
and eventually delivered to the client via print() at line 25.                  the technique obtains a query trace at line 3 where the value
                                                                                of ‘$registrations[0]’ is a randomly generated number
Challenges. In this example, multiple conditions in loops (at
                                                                                inserted in the regsitrations table. To satisfy condition
lines 2, 4, and 6) and a switch statement (at line 7) depend
                                                                                ‘courseid = $registrations[0]’ in the WHERE clause at
on a database. If the database does not contain records that
                                                                                line 3, it inserts another database entry with the value of
can satisfy the conditions, parts of the programs guarded by
                                                                                ‘$registrations[0]’ as ‘courseid’, resulting in the two
the conditions will not be executed and analyzed. For example,
                                                                                tables have entries with the same ‘courseid’ values.
running this program without a database would not be able to
exercise the loop body between lines 2∼23, failing to test the                      Running the program with the same input and the syn-
vulnerable statements (lines 3, 11, and 17).                                    thesized database can pass the first and second while loops
                                                                                (lines 2 and 4). For example, if the first query (at line
Existing Database Synthesizing Techniques. Figure 2 shows
                                                                                1) returns the first row of the registration table (i.e.,
examples of the synthesized database by two state-of-the-
                                                                                regid=0, studentid=12, and courseid=0), it satisfies the
art techniques [18], [25]. Note that existing techniques re-
                                                                                WHERE clause at line 3. Then, the second query at line 3 returns
quire concrete input to run the program for analysis, e.g.,
                                                                                the first row of the courses table.
to gather SQL query traces. Hence, we provide concrete
values ‘12’ and ‘202101’ for ‘$ POST["student"]’ and                                However, it does not satisfy the switch’s conditions (at
‘$ POST["semester"]’ to obtain SQL query traces for [18].                                                                             1
                                                                                lines 8, 14, and 20) which require the values of dotw to have
                                                                                                                       2
    1) Database Schema-based Synthesizing: Figure 2-(a)                         one of the ‘M’, ‘T’, and ‘W’ characters . As shown in Figure 2-
shows an example database generated by techniques focusing                      (b)’s courses table, dotw’s values are random strings, as they
on database schema. Note that they do not leverage the                          do not analyze how the program uses the values of dotw.
provided input and program execution, ignoring the ‘12’ and                     S YNTH DB: Program Analysis based Database Synthesiz-
‘202101’ for ‘studentid’ and ‘semesterid’. The numbers                          ing. In addition to the database schema and queries, S YNTH DB
and strings in the synthesized database are randomly generated.                 takes program semantics into account, to synthesize a database
For some values (e.g., ‘fname’ and ‘lname’ in the teachers                      that can satisfy the various program and query conditions so
table), they randomly choose a value from a predefined list                     that it can help exercising more code and behaviors of the
templates (e.g., a list of fake names). Unfortunately, running                  program under testing. Figure 1- 1 ∼ 4 points out key queries
the program with Figure 2-(a) would not pass line 2, since                      and program statements analyzed by S YNTH DB to satisfy all
there is no database entries with ‘studentid=12’.                               the conditions in the motivating example.
    2) Query-based Synthesizing: Figure 2-(b) shows an ex-                          We use a concolic execution engine to run the program and
ample database reconstructed by techniques leveraging both                      track values returned from a database. During the execution,
SQL query traces from concrete executions and the database                      we conduct a few different analyses. First, S YNTH DB identi-
schema. Observe that ‘semesterid’ in the courses table and                      fies and analyzes conditions and relations between database
‘studentid’ in the registrations table have the values of                       fields in the query to infer desirable values for the fields.
the provided concrete input (i.e., ‘202101’ and ‘12’). This is                  Second, if a variable is used in creating queries, S YNTH DB
because the technique’s analysis is based on the SQL query                      explore program paths that define the variable through concolic
traces generated from the execution with the concrete input.
                                                                                  1
Moreover, the synthesized database has the same set of values                         ‘dotw’ means ‘day of the week’
for ‘courseid’ in the registrations and courses tables,                           2
                                                                                      ‘M’, ‘T’, and ‘W’ represent ‘Monday’, ‘Tuesday’, and ‘Wednesdays’


                                                                           3
analysis, to identify possible values of the variable in the                DB-centric PHP          Existing Dynamic Analysis
                                                                                                         Techniques for PHP                Test
query. By analyzing program conditions related to the variable,              Application
                                                                                                  (e.g., Fuzzer, Dynamic Scanner)        Database
S YNTH DB can infer constraints of desirable database records.
Third, S YNTH DB tracks values returned from a database
and analyzes how they are used in the program. Specifically,                     SQL Parser               Constraints
                                                                                                     1. Schema                         Test Record
predicates and loop conditions depending on values returned                      Constraint          2. Query-condition                 Generator
from databases are analyzed to infer desirable database records.                 Identifier          3. Pre-query
                                                                                                     4. Post-query                     Constraint
                                                                              Constraint                                              Solver (Z3*)
S YNTH DB on the Motivating Example. Figure 1 shows                          Solver (Z3*)
                                                                                                     5. Synchronized-query
                                                                                                                                    Test DB Generator
how our technique reconstructs the database. First, S YNTH DB              Concolic Execution
identify that the first query’s return ($q1) is used in the
second query’s WHERE clause ( 1 ) by tracking $q1. It reveals                     SYNTHDB: Synthesizing Database via Program Analysis
the relationship between the two tables registrations and              Fig. 3.    Overview of S YNTH DB (*Z3 solver [34]).
courses. Specifically, it indicates that there should exist
                                                                       execution engine is based on Vulcan Logic Dumper [35],
database entries with the same ‘courseid’ in the two tables.
                                                                       which is an extension of Zend Engine [36]. Similar to other
S YNTH DB leverages this to correctly generate the ‘courseid’
                                                                       state-of-the-art concolic execution techniques, we concretely
values in the registrations table.
                                                                       execute a PHP program and collect the path constraints during
    Second, the record returned from the second query (at              the execution. We then use the Z3 solver [34] to obtain
line 3, ‘$q2’ and ‘$courses’) are also tracked. The value of           additional inputs that can satisfy the uncovered path conditions.
‘dotw’ is propagated to ‘$days’ through preg split() (at
                                                                       Variables of Interest. S YNTH DB’s concolic execution engine
line 5, 2 ), and used in the switch (at line 7, 3 ). S YNTH DB
                                                                       tracks the propagation of (1) inputs from remote users (e.g.,
identifies desirable values for ‘dotw’ (‘M’, ‘T’, and ‘W’) from
                                                                       $ POST or $ GET) and (2) variables holding data returned
the case statements’ conditions (lines 8, 14, and 20).
                                                                       from database (e.g., returns of mysqli query()).
    Third, S YNTH DB identifies that ‘teacherid’ from the
                                                                       Incremental Path Constrain Solving. We obtain a path con-
courses table is used in the third and fourth queries (at
                                                                       dition that can exercise an unexplored path by negating the last
lines 9 and 15, 4 and 5 ), suggesting that there should exist
                                                                       branch condition of a previously explored path. Unfortunately,
database entries with the same ‘teacherid’ value in the
                                                                       we encounter an excessive number of constraints due to a
two tables (courses and teachers). Observe that values
                                                                       large number of program paths. Solving them all requires
of ‘teacherid’ in the courses and teachers tables are
                                                                       significant time. To address this problem, we leverage our
overlapping. They both have ‘0’, ‘1’, and ‘2’ as shown in
                                                                       observation that many program paths overlap with each other
Figure 2-(c). However, in Figure 2-(b), values of ‘teacherid’
                                                                       as well as their constraints. To this end, we identify and
in the courses table (‘1589’ and ‘-428’) do not overlap with
                                                                       break down the overlapping constraints and cache resolved
the values in the teachers table (‘0’, ‘1’, and ‘2’).
                                                                       constraints’ results. In particular, we leverage the cache to
Summary. The synthesized database by S YNTH DB, presented              incrementally solve the constraints. When we encounter a set
in Figure 2-(c), contains all the desirable database entries,          of constraints including already resolved constraints, we solve
allowing to cover all the program statements shown in Fig-             unresolved (or not cached) constraints and then concatenate the
ure 1. This test DB will provide a better coverage for further         new solution to the cached solutions, updating the cache. This
dynamic analysis, such as security scanning [13], [26]–[32] or         incremental approach essentially mitigates the path explosion
fuzzing [20], [21] (Details in Section IV).                            problem during the path exploration.
                                                                       Terminating Condition. Since we aim to explore all possible
           III.   D ESIGN AND I MPLEMENTATION                          execution paths, it often creates a number of executions,
    S YNTH DB aims to synthesize a comprehensive database              taking a long time to finish the analysis. Hence, our analysis’s
with integrity, that can help exercise program paths dependent         terminating condition is either it explores all execution paths
on the database. In our context, (1) a comprehensive database          or reached the time limit of 10 hours.
means a database containing sufficient entities satisfying the         Algorithm. Due to the space, we provide an example of how
path conditions of the program under test. (2) A database of           S YNTH DB handles non-trivial path constraints and a complete
integrity means that records in the database are feasible and          algorithm of concolic execution in Appendix VII-A and VII-D.
do not conflict with the integrity rules [33] of the program and
database. S YNTH DB achieves the properties through the three          B. Identifying Database Constraints via Concolic Execution
components in Figure 3: (1) the concolic execution engine
exploring execution paths of a target program (Section III-A),         Database Constraints. To synthesize a comprehensive
(2) the constraint identifier collecting database constraints          database with integrity, we define and collect five types
related to the comprehensiveness and integrity of the database         of database constraints: (1) Schema Constraints, (2) Query-
(Section III-B), and (3) the database generator synthesizing a         condition Constraints, (3) Pre-query Constraints, (4) Post-
database by solving the constraints (Section III-C).                   query Constraints and (5) Synchronized-query Constraints.
                                                                       Note that except for the schema constraints which are directly
A. Path Exploration via Concolic Execution                             derived from the database schema, the other four database
                                                                       constraints are inferred from interactions between the SQL
   We first leverage concolic execution to obtain a set of             schema, queries, and program code. Specifically, we focus on
inputs that can cover diverse program paths. Our concolic              analyzing data- and control-dependencies in and between SQL

                                                                   4
queries and program code by leveraging our concolic execution                 values in the traces with the context. For example, a string
engine. Next, we explain each constraint with examples.                       ends with ‘%’ under like as shown in Figure 5-(b) implies
                                                                              it is a regular expression. We model the value patterns and
    1) Schema Constraints: Database schema defines the struc-
                                                                              contexts to extract query-condition constraints.
ture of a database to ensure database operations (e.g., data
insertion and updating) are performed in a consistent way with-               mysqli_query("SELECT id, name, points FROM tblusers
out violating the integrity of database records. The database                               JOIN tblfree ON tblusers.id=tblfree.userid
integrity requires the records to satisfy three properties:                                 WHERE name like '$regexpr'");
  1. Structural properties between database fields (inferred                                  (a) PHP Code Invoking a SQL Query
     from KEY, PRIMARY KEY, and UNIQUE KEY keywords).                         SELECT id, name, points FROM tblusers
  2. Value range properties (from data types, e.g., INT and                                 JOIN tblfree ON tblusers.id=tblfree.userid
                                                                                            WHERE name like 'player%'
     DATETIME, value specifications, e.g., AUTO INCREMENT,                                                                               1
                                                                                                 (b) Executed SQL Query Trace
     and value filtering keywords, e.g., CHECK).                                                                                  2

  3. Table relationships via foreign keys (i.e., ‘FOREIGN KEY’).                    var(tbluser.id) = var(tblfree.userid) \/
                                                                                    var(tbluser.name) = Synth_RegEx("player%")
    Database schema files are written in Data Definition Lan-
                                                                                                   (c) Extracted Constraints
guage (DDL). S YNTH DB uses JSQLParser [37] to extract                   Fig. 5.   Extracting Query-condition Constraints.
databases’ structures and specifications.
Challenges. A single definition may lead to multiple (implicit)          Example. Figure 5 shows how S YNTH DB extracts query-
constraints. For instance, PRIMARY KEY implies the value is (1)          condition constraints from a PHP statement invoking a SELECT
not null and (2) unique within the table. The DATETIME type in-          query. Note that S YNTH DB works on an executed SQL query
dicates that the value is a string with a specific format. Hence,        trace, meaning that all the PHP program variables and func-
we model each definition and corresponding constraints. In               tions are concretized as shown in Figure 5-(b): $regexpr is
addition, during the constraint extraction analysis, we consider         concretized to ‘player%’ as highlighted in red. We first extract
multiple tables’ definitions together (e.g., FOREIGN KEY spec-           a relationship between tbluser.id and tblfree.userid
ifies properties of another table).                                      from the JOIN clause ( 1 ). In addition, from the WHERE
                                                                         clause, we obtain a constraint that provides the value range
   CREATE TABLE user (userid int(11) NOT NULL auto_increment)            of tbluser.name. In particular, the like keyword is used to
                       1    (a) SQL Schema               2      3        filter records that match the given regular expression. S YN -
                                                                         TH DB converts it to a user-defined function Synth RegEx()
          type(user.userid)=int /\ 1<=var(user.userid) /\
               var(user.userid)=prev(user.userid)+1                      that handles regular expressions for the like keyword ( 2 ).
                         (b) Extracted Constraints                           3) Pre-query Constraints: PHP programs typically com-
Fig. 4.   Extracting Schema Constraints from Database Schema.            pose SQL queries by concatenating program variables (e.g.,
Example. Figure 4-(a)’s schema provides three constraints in             holding values or field/table names) and constant SQL key-
Figure 4-(b). 1 From the INT type, we obtain the constraint              words (e.g., INSERT and SELECT). The composed queries are
that the field’s type is an integer. 2 ‘auto increment’                  passed to SQL functions such as mysqli query(). Note that
suggests that its default initial value is 1 and it will always          those variables are defined before a query is constructed and
have a positive value. 3 ‘auto increment’ also indicates                 often go through various computations and predicates, which
that the value will be always incremented by 1.                          essentially confine the data values in the query. Pre-query
                                                                         constraints are essentially inferred by analyzing the computa-
    2) Query-condition Constraints: We analyze how the out-              tions and predicate conditions, implying possible values (e.g.,
come of a query is handled (or processed) before it is returned          ranges or patterns) of database fields.
to the PHP program. We focus on SQL clauses that operate on
the query results such as WHERE for filtering and JOIN for com-          Challenges. There are two prominent challenges. First, there
bining. The query-condition constraints provide information on           are multiple sources of constraints from program code and
(1) possible values of a field (or column) and (2) relationships         queries: (1) predicates on variables restrict them to not have
between database records within/across tables.                           certain values along the path, (2) there are PHP functions
                                                                         that mutate variables’ values (e.g., sanitizing), constraining the
Challenges. When SQL queries are composed, program vari-                 values, and (3) SQL functions such as ‘PASSWORD()’ also
ables can be used to specify conditional clauses in the query            process values before they are stored to the database. We
as shown in Figure 5-(a) (see $regexpr). It leads to two                 handle them by modeling each source of constraints. Second,
challenges:                                                              constraints from different sources, i.e., program code and SQL
 1. The conditionals depend on the variables’ values that                query, are combined and accumulated along the paths. Hence,
    are dynamically determined at runtime: We handle this                errors in tracking and integrating constraints may lead to
    by leveraging our concolic execution engine to identify              substantial analysis failure down the road. To handle this, we
    possible values to the variable used in the query. In                make constraints from different sources to be compatible.
    particular, we conduct additional analysis on the con-
    straints for variables used in queries, regardless of the path       Example. Figure 6-(a) shows a program that sanitizes (lines
    exploration (i.e., we analyze them even if it does not help          1∼3) and validates input values (lines 4∼6) before it inserts
    explore new program paths). We then collect all the traces           the values into the database at line 7. Figure 6-(b) shows the
    of the executed queries and use JSQLParser to parse them.            extracted constraints from the SQL query at line 7 ( 1 ), the
 2. The semantics of the query depends on the variables’ con-            predicates at lines 4∼6 ( 2 ), and input sanitization functions
    crete values: We solve this by analyzing the concretized             at lines 1∼3 ( 3 ). Observe that we create symbolic variables

                                                                     5
 1       $u = mysql_real_escape_string($_POST['user']);                                        1      $sql1 = mysql_query("SELECT coursename, points, aperc, bperc,
 2       $e = mysql_real_escape_string($_POST['email']);                      3                                          ... FROM courses");
 3       $p = mysql_real_escape_string($_POST['pass']);                                        2      while($courses = mysql_fetch_row($sql1)){
 4       if (preg_match("^[[:alnum:]_]{4,20}$", $u) &&                                         3        $sql2 = mysql_query("SELECT currpoints FROM students ...");
 5           preg_match($emailValidation, $e))      &&                      2                  4        $students = mysql_fetch_row($sql2);
 6           preg_match("^[[:alnum:]]{4,20}$", $p)) {                                          5        if(!$students) {
 7         $mysqldb->query("INSERT INTO authors (User, Email, Pwd, Reg)                        6          $perc = ($students[0] / $courses[1]);                     1
                                                                          1                    7          if ($perc >= $courses[2]) $grade = 'A’;
                            VALUES ('$u', '$e', PASSWORD('$p'), NOW())");
 8       }                                                                                     8          ...
                        (a) PHP Code Invoking a SQL Query                                      9      }}                                                              2

 9       authors.User == t1 /\ authors.Email == t2 /\ var(authors.Pwd)                                               (a) PHP Code Invoking a SQL Query
10       == SQL.PASSWORD(t3) /\ var(authors.Reg) == SQL.NOW() /\                               10     var(perc) = var(students.currpoints) / var(courses.points) /\
11       var(t1) == Synth_RegEx("^[[:alnum:]_]{4,20}$") /\                                             var(perc) >= var(courses.aperc),
12       var(t2) == Synth_RegEx("^[[:alnum:]][a-z0-9_.-]*@[a-z0-9.-]+\.                        11     var(perc) = var(students.currpoints) / var(courses.points) /\
                                  [a-z]{2,4}$") /\                                                     var(perc) < var(courses.aperc)
13       var(t3) == Synth_RegEx("^[[:alnum:]]{4,20}$") /\                                                                (b) Post-query Constraints
14       var(t1) == Synth_mysql_real_escape_string($_POST['user']) /\
                                                                                           Fig. 7.      Extracting Post-query Constraints.
15       var(t2) == Synth_mysql_real_escape_string($_POST['email']) /\
16       var(t3) == Synth_mysql_real_escape_string($_POST['pass'])
                             (b) Pre-query Constraints                                     dependencies of the variables (line 6, 1 ). We also obtain
Fig. 6.     Extracting Pre-query Constraints.                                              the constraints from the negation of the predicate condition to
                                                                                           cover the else condition of the predicate such as the constraints
                                                                                           at line 11.
t1∼3 for program variables used in the query, $u, $e, and $p,
respectively. SQL built-in functions are handled by defining                               1      mysql_query("INSERT INTO courses (semesterid, coursename, teacherid)
                                                                                                       VALUES('$_POST[semester]', '$_POST[title]', '$_POST[teacher]')");
our own functions that emulate the original functions (e.g.,                               2      $course1 = mysql_insert_id();
  SQL.PASSWORD() and SQL.NOW() to generate a hashed                                        3      mysql_query("INSERT INTO courses (semesterid, coursename, teacherid)
password and return the current time, respectively). Observe                                    1      VALUES('$_POST[semester2]', '$_POST[title]', '$_POST[teacher]')"); 2
                                                                                           4      $course2 = mysql_insert_id();
that the predicates at lines 4∼6 have regular expressions which
                                                                                           5      mysql_query("UPDATE courses SET seccourseid = $course2               3
are directly translated into the constraints at lines 11∼13, using                                             WHERE courseid = $course1");
Synth RegEx() that generates a string value that follows the                               6      mysql_query("UPDATE courses SET seccourseid = $course1           4
                                                                                                               WHERE courseid = $course2");
given regular expression input.
                                                                                                              (a) PHP Code Invoking SQL Queries Consecutively
    4) Post-query Constraints: Typically, results of SQL                                   7        (var(courses.semesterid) != prev(courses.semesterid)) \/
queries (e.g., return of mysqli query()) are processed by                                           (var(courses.coursename) == prev(courses.coursename) /\
                                                                                                     var(courses.teacherid) == prev(courses.teacherid)),
program code (e.g., predicates and functions). For example,                                8        var(courses.seccourseid) == prev(courses.courseid)+1 \/
programs validate and filter invalid returned data with respect                                     var(courses.seccourseid) == prev(courses.courseid)-1
to the database field’s semantics (e.g., negative values for an                                                     (b) Synchronized-Query Constraints
age field). As such, program statements operating on data                                  Fig. 8.      Extracting Synchronized-query Constraints.
returned from queries can provide potential values (or value
ranges) in the database. To this end, we infer post-query                                      5) Synchronized-query Constraints: A program may exe-
constraints by analyzing program code dependent on the results                             cute a set of SQL queries always together, meaning that the
of queries.                                                                                values between the queries will appear consistently on the
                                                                                           database. Moreover, if a program variable is used in such
Challenges. To identify post-query constraints, S YNTH DB                                  queries on multiple tables, it suggests an implicit relationship
conducts the taint analysis from the return values of SQL query                            between the tables (e.g., multiple tables have correlated fields).
functions (e.g., mysql query()). Since S YNTH DB analyzes                                  For example, assume the two consecutive queries:
every statement with tainted variables to obtain post-query
                                                                                             1. INSERT into tableA (x, ...) VALUES ($id, ...);
constraints, over-tainting causes significant false positive cases
                            3                                                                2. INSERT into tableB (y, ...) VALUES ($id, ...);
for post-query constraints . While overall, we conduct con-
servative taint analysis, for post-query constraint analysis, we                               By observing that $id is used in both queries, we infer
configure our taint analysis particularly more conservatively                              the correlation between tableA.x and tableB.y (i.e., they
(e.g., do not taint a variable if it is only partially affected by                         are identical). To this end, we obtain synchronized-query
an already tainted variable, such as through bitwise, logical,                             constraints by identifying queries in the same or subsequent
and comparison operators).                                                                 basic blocks, which will be always executed together.

Example. Figure 7-(a) shows a code snippet calculating letter                              Challenges. There are two major challenges. First, beyond
grades from students’ score (students.currpoints) with                                     the queries executed within the same basic block, queries in
respect to the pre-configured percentage value stored in the                               multiple basic blocks may always execute together if the basic
database (courses.aperc) for each letter grade.              To                            blocks are always executed along every path. To solve this,
extract the constraints in Figure 7-(b), S YNTH DB tracks all                              we compute dominators [38] from the control flow graphs
the variables holding values returned from queries such as                                 of the target program. Given queries of a basic block, all
$courses and $students, via taint analysis. On a predicate                                 the dominator basic blocks’ queries are executed together.
condition that uses tainted variables (line 7), S YNTH DB cre-                             Second, values of database fields between the queries executed
ates constraints from the tainted variables ( 2 ) along the data                           together should be analyzed to identify how the queries are
                                                                                           synchronized. For instance, two related values can be stored
     3
    Over-tainting in the pre-query constraint analysis also causes false posi-             in two different tables. We solve this by comparing all the
tives, while its impact is less critical than in the post-query constraint analysis.       dependencies between the values used in the queries.

                                                                                       6
                 Program Analysis via Concolic Execution                                 Database Constraints                                Synthesized Database
                           (Section III-A/B)                                                (Section III-B)                                     (Section III-C)
      1    if       ( $price > 1000 ) $discount = 20;                      Schema     type(pid, discount) = int                              pid   discount
      2    else if ( $price > 500 ) $discount = 10;
      3    $r = mysqli_query("INSERT INTO tblevent(pid, discount)        Pre-query    {discount = 20} \/ {discount = 10}           1, 2, 3    0    20
                               VALUES ($pid, $discount)");                             (b) Constraints for tblevent                           1    10
           ...
      4    $r = mysqli_query("SELECT id, points, job
                                                                                                                                                   (f) tblevent
                                                                           Schema     type(id, points) = int, type(job) = string
                               FROM tblusers                                                                                                  id   points       job
                               WHERE points > 100");                   Query-cond.    {points > 100}                                 4
      5    while($u = $r->fetch_assoc()) {                                                                                                     0   101          teacher
                                                                                      {job = “teacher”} /\ {points < 3000},
      6       if ($u['job'] == "teacher" && $u['points'] < 3000)        Post-query                                                  4, 6       1   101          student
                                                                                      {job != “teacher”} \/ {points >= 3000}
                ...                                                                                                                            2   3000         student
      7    }                                                                           (c) Constraints for tblusers
      8    if($_POST['bonus']==true) {                                                                                                             (g) tblusers
      9       mysqli_query("INSERT INTO                                    Schema     type(id, point, bonus) = int
                            tblpoint(id, point, bonus)                                {point = 100} /\ {bonus = 1},                           id   points       bonus
                                                                         Pre-query                                                 9, 12
                            VALUES ($id, 100, 1)");                                   {point = 50} /\ {bonus = 0}                              1   100          1
     10       mysqli_query("INSERT INTO tblclaimed(id, tm)
                            VALUES ($id, curdate())");                  Sync-query    {id = tblclaimed.id}                         9, 10       2   50           0
     11    } else                                                                      (d) Constraints for tblpoint                                (h) tblpoint
     12       mysqli_query("INSERT INTO
                            tblpoint(id, point, bonus)                     Schema     type(id) = int, type(tm) = date                         id   tm
                            VALUES ($id, 50, 0)");                      Sync-query    {id = tblpoint.id}                           9, 10       1   2022-07-01
                              (a) Source code                                         (e) Constraints for tblclaimed                               (i) tblclaimed
Fig. 9.   Overall Procedure of Synthesizing Database (Highlighted columns in (b)∼(e) present the source lines where we extracted constraints from).

Example. Figure 8-(a) shows a program executes four SQL                              Synthesizing tblusers. A query at line 4 leads to a query-
queries consecutively. While the two consecutive queries have                        condition constraint in Figure 9-(c). In addition, the predicate
different values for courses.semesterid ( 1 ), they share                            at line 6 uses the data returned from the query at line 4 as it
variables for the next two fields: courses.coursename and                            compares values of the job and points fields with a string
courses.teacherid ( 2 ). The constraints at line 7 sum-                              teacher and 3,000. Specifically, the first constraint is directly
marize the relationship. The order of the two queries are                            obtained from the predicate condition, while the second con-
represented by prev(). In addition, at lines 5 and 6, it updates                     straint is obtained by negating the predicate conditions which
the two inserted rows at lines 1 and 3, so that each of the                          essentially indicates its else branch. To this end, S YNTH DB
record will have the other record’s id in seccourseid. The                           generates records that satisfy the all the constraints as shown
constraints at line 8 captures this relationship between the two                     in Figure 9-(g).
consecutive queries ( 3 and 4 ).
                                                                                     Synthesizing tblpoint and tblclaimed. Observe two
                                                                                     queries at lines 9 and 12 insert two records to the
C. Synthesizing Database                                                             database with constant values for point and bonus. They
                                                                                     lead to the pre-query constraints in Figure 9-(d). In ad-
    We synthesize a database by solving all the database con-                        dition, lines 9∼10 have two queries that are always exe-
straints collected in Section III-B. Specifically, we iteratively                    cuted together, resulting in the synchronized-query constraints:
solve the collected constraints to generate concrete data for                        tblpoint.id=tblclaimed.id. Note that this also leads to
corresponding fields in tables.                                                      another synchronized-query constraints in tblclaimed (Fig-
                                                                                     ure 9-(e)). Lastly, we generate records satisfy the constraints
    1) Overall Procedure: Figure 9 shows an end-to-end exam-                         in Figure 9-(h) and (i). First, the two records in tblpoint
ple from the source code to the synthesized database. Specif-                        is to satisfy the first pre-query constraint of tblpoint. The
ically, Figure 9-(a) shows the target PHP program, and our                           first records in tblpoint and tblclaimed have the same id
concolic execution engine identifies database constraints from                       value, satisfying the synchronized-query constraint. Note that
the highlighted parts of the code and queries. Figure 9-(b)∼(e)                      to satisfy synchronized-query constraints describing inter-table
show identified database constraints from the example. Its third                     relationships, multiple records across tables are needed.
column shows which source code line numbers are analyzed
to obtain the corresponding constraints. Lastly, Figure 9-(f)∼(i)                    Domain-Specific Value Generation. We use randomly gen-
present the synthesized database. In the next paragraphs, we                         erated values for database fields that satisfy collected con-
illustrate how S YNTH DB synthesizes each table of a database.                       straints. Purely random values may work fine with automated
                                                                                     analysis tools, but they often decrease the readability of the
Synthesizing tblevent. Observe that $discount is defined                             user, especially for certain fields such as “name”, “email”,
at lines 1∼2, and used in the INSERT query at line 3, sug-                           and “phone number”. To generate a more realistic and readable
gesting the relationship between tblevent.discount and                               database, we apply simple heuristic techniques for those fields,
$discount. Then, from the lines 1∼2, the value of $discount                          similar to existing techniques [18], [25].
(and tblevent.disount) must be one of the two values:
20 or 10. This is translated to the pre-query constraints in                             2) Implications of Constraints: The five database con-
Figure 9-(b). Finally, S YNTH DB generates database records                          straints are extracted from different sources and have differ-
that satisfy the constraints as shown in Figure 9-(f). Note that                     ent implications for generating database records. Specifically,
we do not have constraints for tblevent.pid. By default, we                          schema and pre-query constraints are used to define strict
use any value from a given data type if a field have no value                        rules that confine the database. They are used to restrict the
constraints. In this case, we use 0 and 1.                                           value range of each field in a table, meaning that all items

                                                                              7
in a generated database must satisfy the constraints. Other                      (LLOC). The next two columns show the number of tables and
constraints, however, such as query-condition, post-query, or                    columns, and the following three columns show the number
synchronized-query constraints, are not as strict as the schema                  of each INSERT, UPDATE, and SELECT query, respectively. The
and pre-query constraints. They essentially indicate that there                  tenth column shows the total number of those three types SQL
exist some database records satisfying the constraints, but not                  queries and the last column presents a brief description of each
all records must satisfy. While they are less strict, since there                application. In total, the selected applications include 21,256
are predicates that depend on those constraints, they are crucial                PHP files, 771k PHP LLOC, and 10,144 SQL queries.
in covering more program paths. Query-condition constraints
                                                                                  – Selection Criteria: In choosing the target database-backed
are similar to post-query constraints, as we need at least one
                                                                                  PHP applications, we consider categories of web applications
record to get a valid return from a SELECT query.
                                                                                  where the PHP and database are popularly used, including
Conflicting Constraints. Multiple constraints may have con-                       management systems, online forums, eCommerce platforms,
flicting definitions that cannot be satisfied within a single                     web games, and Content Management System (CMS). More-
database. For example, as shown in Figure 10, a PHP program                       over, we also consider the frequency and diversity of SQL
that has a if and else blocks where the first block ( 1 ,                         queries used in the programs (Details in Section VII-C).
line 3) is executed when the SELECT query returns less than                      1. We choose twelve applications (s1∼s8, s12, and s15∼s17)
100 records while the other block ( 2 , line 5) requires the                        out of 28 applications that are frequently evaluated by
query to return 100 or more than 100 records. In other words,                       previous work [5], [56]–[58]. Specifically, among 28 pro-
with a single database, only one of the two blocks can be                           grams, we exclude 7 applications that have limited database
covered, meaning that the constraints for the two blocks are                        interactions (less than 30 queries, and 9 applications use
conflicting. We discuss other sources of conflicting constraints                    database engines or PHP versions that S YNTH DB does not
in Appendix VII-F due to the space limit.                                           support (e.g., MariaDB or PHP version<7).
                                                                                 2. We additionally include five popular real-world applications
  1    $r = mysqli_query("SELECT ... FROM ... WHERE ...");                          (s9∼s11, s13, and s14) that have large codebase. They are
  2    if(mysqli_num_rows($r) < 100) {
                                                                                    chosen as follows. First, we search for the most popular
  3       ...   1 requiring a database with less than 100 rows
  4    } else {                                                                     projects from three categories where the DB-backed PHP
  5       ...   2 requiring a database with more than or equal to 100 rows          is dominant: CMS, eCommerce platform, and online forum.
  6    }
                                                                                    Then, we select the most installed [59] PHP project for each
Fig. 10.   Program code requiring two constraints that are conflicting.             category. We select WordPress [50] and OpenCart [48] for
                                                                                    the CMS and eCommerce platform categories respectively.
    Since conflicting constraints cannot be satisfied within a
                                                                                    For the online forum category, we select two applications,
single database, multiple databases need to be used. However,
                                                                                    phpBB [46] and SMF [51], as they have almost the same
in this paper, we focus on a single database that can satisfy
                                                                                    number of installations (47,631 for phpBB and 47,716 for
the most number of constraints. Hence, we choose a database
                                                                                    SMF) as of July 2022.
with the least number of conflicting constraints as output. We
manually investigate all the conflicting constraint cases and we                 – Summary of Existing Techniques: We compare our technique
miss 8.4% of code coverage and 8.7% of query coverage on                         with three state-of-the-art test database generation techniques,
average in our evaluation, meaning that our method of choos-                     D OMINO [25], Datafaker [39], and EvoSQL [18]. Table II
ing the database satisfying the most constraints is effective in                 summarizes the advantages and limitations of them, focusing
practice. We leave handling conflicting constraints as our future                on which database constraints are supported. First, D OMINO
work by generating multiple versions of tables or databases.                     [25] and Datafaker [39] focus on analyzing database schema
                             IV.     E VALUATION                                 to synthesize test data that follow integrity rules. While
                                                                                 Datafaker uses domain-specific value generation for creating
    We evaluate S YNTH DB with 17 real-world PHP appli-                          realistic looking test data, both D OMINO and Datafaker do
cations and compare the quality of the synthesized database                      not support four database constraints (i.e., query-condition,
by S YNTH DB with three state-of-the-art techniques: EvoSQL                      pre-query, post-query, and synchronized-query constraints).
[18], D OMINO [25], and Datafaker [39]. We then execute a                        Second, EvoSQL [18] is a query-aware technique that lever-
dynamic analysis technique for PHP on top of each generated                      ages the genetic algorithm to generate test data. However,
database and compare the observed code and query coverage                        it has limited support for the query-condition constraints,
(Section IV-A). We also conduct three types of security anal-                    handling the SELECT query only. As shown in the last column,
ysis to measure how the test databases affect security testing,                  S YNTH DB supports all five database constraints, as well as
including the vulnerability detection testing with an active vul-                domain-specific value generation (Section III-C1).
nerability scanner, Burp Suite [19] (Section IV-B1), the reacha-
bility test against reported vulnerabilities (Section IV-B2), and                – Configurations of Existing Techniques: During our eval-
integrating S YNTH DB with two fuzz testing tools, WFuzz [20]                    uation, we try our best to fairly treat existing techniques.
and webFuzz [21] (Section IV-B3).                                                Specifically, EvoSQL takes a list of concrete queries and a
                                                                                 schema. We collect all concrete queries from our concolic
PHP Applications for Evaluation. As presented in Table I,                        execution runs for each application and feed them to EvoSQL
we use 17 real-world PHP applications. The first column shows                    to generate test databases. We acquire the implementation of
ids (i.e., identifiers) that we will use to refer to applications                D OMINO and Datafaker from their official sites [39], [60] and
throughout the section for brevity. The next column show                         feed the database schema for each PHP application to generate
the application name and version, followed by two columns                        test databases. Note that S YNTH DB improves the effectiveness
presenting the number of PHP files and the logical lines of code                 of testing techniques because (1) our concolic execution engine

                                                                             8
                                                                         TABLE I.        L IST OF PHP A PPLICATIONS .

                                                    Source Code                 Database                     # SQL Query
            Id     Application                                                                                                            Description
                                               # Files         LLOC       # Tables   # Columns     INSERT   UPDATE      SELECT    Total
            s1     SchoolMate-1.5.4 [24]             63          1,587         15             95       17       32         214     263    School management system
            s2     PHP7-Webchess [40]                29          1,505          7             48       14       20          60      94    Web game
            s3     Timeclock-1.04 [41]               63         10,820          8             35       18       19         262     299    Employment management system
            s4     Mybloggie-2.1.4 [42]              59          3,053          4             24        5        5          74      84    Content management system
            s5     Faqforge-1.3.2 [43]               15           302           2             11        3        5          22      30    Online forum
            s6     Wackopicko-1.0 [44]               49           720          13             60       13        3          24      40    Photo management system
            s7     phpBB-2.0.23 [45]                 74         10,798         30            277       44       89         244     377
                                                                                                                                          Online forum
            s8     phpBB-3.3.8 [46]                1,091        40,612         69            601       64      341         938    1,343
            s9     OpenCart-3.0.3.8 [47]           1,932        60,515        136            834      246      111         586     943
                                                                                                                                          Ecommerce platform
           s10     OpenCart-4.0.0 [48]             2,866        49,018        142            871      258      118         623     999
           s11     WordPress-5.1.2 [49]             901         84,891         12             94       12       32         271     315
                                                                                                                                          Content management system
           s12     WordPress-6.0.1 [50]            1,332       110,227         12             94       12       31         264     307
           s13     SMF-2.1.2 [51]                   316         45,641         73            525        7      270         929    1,206   Online forum
           s14     OsCommerce-2.4.0 [52]            422         15,809         49            343      529       10         377     916    Ecommerce platform
           s15     CEPhoenix-1.0.7 [53]            1361         23,938         55            369      149      101         436     686    Ecommerce platform
           s16     ZenCart-1.5.7 [54]              1,829        74,960        103            848      394      215       1,311    1,920   Ecommerce platform
           s17     Drupal-9.0.0 [55]               8,854       237,001         72            544       39       65         218     322    Content management system
         Total                                 21,256          771,406        802          5,673    1,824    1,466       6,860   10,144


       TABLE II.          C OMPARISON WITH BASELINE A PPROACHES .
                                                                                                   observe four programs (s3, s9, s11, s17) have significantly
                                         D OMINO     Datafaker       EvoSQL      S YNTH DB         lower than (e.g., more than 10%) the average code coverage.
 Schema Constraints                                                                            However, observe that the code coverage with S YNTH DB
 Query-condition Constraints                                            −                       synthesized database are consistently higher than the coverage
 Pre-query Constraint                                                             
                                                                                                   with databases generated by other techniques.
 Post-query Constraint                                                                             Our manual inspection reveals that there are two major
 Synchronized-query Constraint                                                                 reasons for those low code coverage cases: (1) code requires
 Domain-Specific Value Generation                                                              specific configurations and (2) code requires complex input
 −: Supporting SELECT queries only.                                                                formats which is challenging for the SMT solver. First, a
                                                                                                   program may have modules that are unreachable when using
solves path constraints, allowing many program paths to be                                         the default configuration. To cover those code, one needs to
tested, and (2) synthesized database enables testing tools to                                      install and configure additional extensions, while in our eval-
cover more program paths. Unfortunately, existing techniques                                       uation, we run all the programs with the default configuration
that we compare with do not have concolic execution engine,                                        and extensions/plug-ins. For instance, 11.3% of the uncovered
making it difficult to measure the effectiveness coming from                                       code of OpenCart belongs to multi-language support modules,
the synthesized database. To focus on the effectiveness of the                                     whereas only the English module is activated by default. Also,
synthesized database, we use our concolic execution engine                                         we observe that 63.6% of uncovered code can be activated
(Section III-A) for all the existing techniques. In other words,                                   only with payment extensions (e.g., Ali-pay or Amazon-pay).
all the experiments in Section IV-A, Section IV-C, and Sec-                                         Second, program paths may require complex inputs to be
tion IV-B2 are conducted on top of our concolic execution                                          covered. For example, to cover OpenCart’s email service code,
engine with test databases generated by each technique.                                            we need to provide valid values for the Simple Mail Transfer
                                                                                                   Protocol (SMTP) service such as host address, username,
A. Coverage Evaluation with Test Databases                                                         password, and port, which are extremely challenging to handle
    To evaluate the quality of test databases generated by dif-                                    for SMT solvers.
ferent techniques, we measure code and SQL query coverages
while we execute PHP applications with the concolic execution                                      SQL Query Coverage. We statically scan the code to identify
engine with 10 hours of timeout. As a baseline, we execute                                         the SQL queries used in each PHP application, and we leverage
each application with a default database that is shipped with                                      Xdebug to count the executed SQL queries. Queries that return
the application or generated during the installation.                                              a valid result without an error are counted as covered. The Fig-
                                                                                                   ure 11(b) show that the execution with S YNTH DB-generated
Code Coverage. We use Xdebug [61] to measure the code                                              DB can cover 77.1% of SQL queries in PHP applications
coverage. Figure 11(a) shows the code coverage result. The                                         while test databases by EvoSQL, Datafaker, and D OMINO can
concolic executions with S YNTH DB-generated test databases                                        cover 52.9%, 31.3%, and 30.9%, respectively. We also test the
achieve the best code coverage (63.9% on average). On aver-                                        query coverage with a default database. We observe that most
age, databases generated by EvoSQL, Datafaker, and D OMINO                                         SELECT and UPDATE queries failed because the target items do
achieve 48.9%, 38.9%, and 38.3%, respectively. The execu-                                          not exist. However, INSERT queries are executed normally, and
tions with a default DB achieves 33.0%. Among them, we                                             SELECT or UPDATE against items inserted by former INSERT

                                                                                               9
                                                      Default DB    DOMINO    Datafaker   EvoSQL     SYNTHDB
                100%

                 75%

                 50%

                 25%

                  0%
                        s1     s2    s3     s4   s5       s6       s7   s8     s9    s10   s11     s12   s13   s14   s15   s16   s17   Avg.
                                                                         (a) Code Coverage
               100%
                75%
                50%
                25%
                 0%
                        s1    s2     s3     s4   s5       s6       s7   s8     s9    s10    s11    s12   s13   s14   s15   s16   s17   Avg.
                                                                         (b) Query Coverage
Fig. 11. Code and Query Coverage of S YNTH DB (‘Default DB’ presents an execution with a DB right after the installation. s1∼s17 are the ids from Table I).

can also be executed and counted as covered.                                        remote admin addition, and parameter manipulation). Note
                                                                                    that we could not find publicly available vulnerability reports
    Out of 10,144 SQL queries in PHP applications, the current                      for six applications: phpBB-3.3.8, OpenCart-4.0.0, SMF-2.1.2,
implementation of S YNTH DB failed to cover 2,832 queries.                          OsCommerce2.4.0, CE-Phoenix-1.0.7, and Zencart-1.5.7.
There are two major reasons for the uncovered queries: (1)
2,173 queries are located in PHP code that we failed to cover                            We count the number of vulnerabilities reported by Burp
the code (due to the limitation of the default configuration                        Suite and prune out false positives by manually checking
or inactivated plug-ins), (2) 659 queries are sub-queries that                      reported vulnerabilities. Specifically, we leverage Burp In-
return empty results and hence are not counted, even if the                         truder [67] to generate a specific exploit for each vulnerability
statements executing them are technically reached. We further                       and ensure the detected vulnerability is exploitable. For in-
analyze the uncovered queries regarding their impact on our                         stance, we forge a request with a generated payload and send
analysis. 848 of them contain query constraints that we can                         it to the server for input-based vulnerabilities (e.g., XSS, SQL
also extract from other already covered queries, meaning that                       injection, and file path traversal). Table III shows the number
missing them does not impact our analysis.                                          of known vulnerabilities and the number of vulnerabilities
                                                                                    reported by Burp Suite with each test database. Burp Suite
Observations. From the coverage evaluation, the major con-                          detects the most number of vulnerabilities when it runs with
tributing factor of S YNTH DB outperforms existing techniques                       the DB-generated by S YNTH DB.
is that S YNTH DB supports the post-query constraints and
query-condition constraints. Specifically, the most common                          33 New Vulnerabilities Discovered. Notably, with S YN -
cases that S YNTH DB can cover while others failed to cover,                        TH DB, Burp Suite detected 33 previously unreported vulner-
are the predicates that evaluate values returned from database                      abilities from 5 real-world applications, including 21 XSS
queries. Due to page limit, we present the number of each                           vulnerabilities and 12 SQL injection vulnerabilities. We have
constraints S YNTH DB derived in Appendix VII-B.                                    reported the discovered vulnerabilities to the developers with
                                                                                    detailed instructions including how to create the test databases
B. Enhancing Existing Security Testing using Test Databases                         (as they are not reproducible without a proper database).
    We evaluate how effectively test databases can aid existing                     Note that Table III does not include results for 5 applications
security testing techniques, using a state-of-the-art vulnerabil-                   (i.e., s8, s10, s13, s15, and s16) because they do not have
ity scanner, Burp Suite, and two fuzzers, Wfuzz and webFuzz.                        any known vulnerabilities, and could not detect any new
                                                                                    vulnerabilities. Out of 189 vulnerabilities we collected, Burp
    1) Vulnerability Detection with Burp Suite: We use Burp                         Suite with S YNTH DB failed to detect 25 of them. Our further
Suite to demonstrate how S YNTH DB can help vulnerability                           analysis shows that 15 of them are vulnerability types that Burp
detection for database-backed applications. We conduct Burp                         Suite does not aim to detect [68] (e.g., session/object injection,
Suite’s active scanning (i.e., automated mode) for applica-                         logical fault, and authentication bypass). Burp Suite with
tions in Table I with test databases generated by S YNTH DB,                        S YNTH DB failed to detect the remaining 10 vulnerabilities
EvoSQL, D OMINO, and Datafaker.                                                     for the following reasons: (1) seven of them require additional
                                                                                    external resources, such as local files or network service, (2)
Vulnerability Report Collection. First, we collect vulnerabil-
                                                                                    two of them require inputs that the SMT solver could not
ity reports for PHP applications listed in Table I, from the CVE
                                                                                    handle (e.g., requires a specific HTTP referer format), (3) the
database [62], Exploit Database [63], previous research [64]–
                                                       4                            last one requires a specific configuration change.
[66], and security reports by application developers . We man-
ually verify each reported vulnerability to prune out false posi-                       2) Reachability of Security Vulnerabilities: Although our
tives and uncertain reports that do not provide sufficient details                  experiments with Burp Suite clearly show the effectiveness
for the vulnerable code’s location. We collected information of                     of S YNTH DB, the limitation of Burp Suite prevents us from
189 known vulnerabilities from 11 PHP applications, including                       identifying a number of known vulnerabilities. To further
126 cross-site scripting (XSS), 27 SQL injection, and 36 other                      evaluate how the quality of test databases affects the security
vulnerabilities (e.g., directory traversal, forceful browsing,                      testing and analysis, we conduct more generic tests that do not
                                                                                    rely on a specific tool. Specifically, we conduct a reachability
  4
      From public repositories such as GitHub.                                      test against reported vulnerabilities for each application. We

                                                                               10
            TABLE III.            B URP S UITE RESULTS WITH DATABASES                                                      Default DB           DOMINO            Datafaker       EvoSQL        SynthDB
                                                                                                        100%
           # Known                                                                                       75%
 Id                      Default DB    D OMINO      Datafaker     EvoSQL       S YNTH DB
             Vuln.                                                                                       50%
                                                                                                         25%
                                                                                          #
 s1          80              7            31            31           62        80 (+13)                   0%
                                                                                                                s1    s2    s3   s4     s5      s6    s7    s8     s9      s10 s11 s12 s13 s14 s15 s16 s17 Avg.
                                                                                          †
 s2          18              3            5             5            12         18 (+4)
                                                                                          ‡
                                                                                                       100%                                     (a) Code Coverage of Wfuzz
 s3           8              2            2             2             3          7 (+7)                 75%
                                                                                          ⋆             50%
 s4          13              3            4             4             8          9 (+8)
                                                                                                        25%
 s5           5              3            4             4             5             5                    0%
                                                                                                               s1    s2    s3    s4     s5      s6    s7    s8    s9       s10 s11 s12 s13 s14 s15 s16 s17 Avg.
 s6          15              5            6             6             8            11
                                                                                                                                                (b) Code Coverage of webFuzz
 s7           5              1            1             1             3             5                  Fig. 12.      Code Coverage Results by Existing Fuzzing Tools.
 s9           3              0            0             0             0             0
 s11         23              6            6             7             9            12                         TABLE V.        T IME TAKEN TO G ENERATE A T EST DATABASE ( IN
                                                                                                                     MINUTE ) AND THE NUMBER OF RECORDS GENERATED .
 s12         15              3            3             3             4             7
                                                                                              ρ
 s14         N/A            N/A          N/A           N/A          N/A        N/A (+1)                                    D OMINO                    Datafaker                  EvoSQL             S YNTH DB
 s17          4              0            0             0             1             1                                     Time        Rec
                                                                                                                                            #
                                                                                                                                                     Time        Rec
                                                                                                                                                                       #
                                                                                                                                                                              Time    Rec
                                                                                                                                                                                            #
                                                                                                                                                                                                    Time   Rec
                                                                                                                                                                                                                 #

 – The number in parentheses indicates the number of new vulnerabilities discovered.
 – Background color red, yellow, light-green, and green represent 0%∼25%, 25%∼50%,                      s1            <1m              416           <1m          500         18 m        458       8m      421
 50%∼75%, and 75%∼100% of known vulnerabilities detected, respectively.                                 s2            <1m              191           <1m          300          6m         137       4m      166
 #: Total 93 (13 new vulnerabilities). †: Total 22 (4 new vulnerabilities). ‡: Total 14
 (7 new vulnerabilities). ⋆: Total 17 (8 new vulnerabilities). ρ: 1 new vulnerability.                  s3            <1m              139           <1m          500         29 m        556      51 m     475
 TABLE IV.              R EACHABILITY T EST AGAINST PHP V ULNERABILITIES .                              s4            <1m               95           <1m          300          7m         152      16 m     133
                                                                                                        s5            <1m               43           <1m          300          1m          24       2m          21
      Id    # Vuln.      Default DB    D OMINO     Datafaker      EvoSQL       S YNTH DB
                                                                                                        s6            <1m              239           <1m          300          3m          51       4m          49
      s1           80        8           33            33            62            80
                                                                                                        s7            <1m             1,108          <1m         1,000        41 m        653      82 m     517
      s2           18        5            8             8            12            18
                                                                                                        s8            <1m             2,136          <1m         1,500       312 m    1,920       417 m    1,306
      s3            8        2            2             2             3             7
                                                                                                        s9            <1m             3,336          <1m         1,500       193 m    1,412       600* m   1,552
      s4           13        3            6             6            11            13
                                                                                                        s10           <1m             3,484          <1m         1,500       239 m    1,589       600* m    935
      s5            5        3            4             4             5             5
                                                                                                        s11           <1m              376           <1m          500         45 m        601     600* m    514
      s6           15        7           11            11            12            14
                                                                                                        s12           <1m              376           <1m          500         51 m        632     600* m    482
      s7            5        1            2             2             3             5
                                                                                                        s13           <1m             2,100          <1m         1,500       384 m     2106       600* m   1,307
      s9            3        0            0             0             0             2
                                                                                                        s14           <1m             1,372          <1m         1,000        82 m        909     113 m     895
  s11              23        6            8             9            12            16
                                                                                                        s15           <1m             1,476          <1m         1,500       318 m    1,610       182 m    1,052
  s12              15        3            5             5             7            10
                                                                                                        s16           <1m             3,392          <1m         1,500       271 m    1,573       600* m   1,253
  s17               4        0            0             0             1             1
                                                                                                        s17           <1m             2,176          <1m         1,000        68 m        752     600* m    941
 Total            189        38           79            80          128            171
                                                                                                        Average       <1m             1,321          <1m          894        122 m        890     299 m     707
  (%)                     (24.9%)      (37.7%)       (38.1%)      (55.3%)        (80.9%)
                                                                                                        #: The number of records generated. *: Reached 10 hours of timeout.
 – Background color red, yellow, light-green, and green represent 0%∼25%, 25%∼50%,
 50%∼75%, and 75%∼100% of vulnerabilities reached, respectively.
                                                                                                       the executions with a default DB.
execute each PHP application on top of our concolic execution
engine with different test databases to measure how many                                               C. Runtime Performance Measurement
vulnerable statements have been covered. Table IV shows a
result. S YNTH DB can successfully reach 80.9% (171 out of                                                 We measure the time taken for generating a test database
189) vulnerable statements. EvoSQL can cover 55.3% (128                                                by each technique Table V shows the results. S YNTH DB takes
out of 189), Datafaker reaches 38.1% (80 out of 189), and                                              the longest average time (2.5x compared to EvoSQL) because
D OMINO covers 37.7% (79 out of 189). The execution can                                                we comprehensively analyze the program and database, iden-
only reach 24.9% (38 out of 189) with a default database. We                                           tifying five types of database constraints, requiring multiple
further investigate the vulnerabilities that S YNTH DB failed to                                       runs of concolic execution. EvoSQL [18] is a query-aware
reach and discuss our findings in Appendix VII-E.                                                      technique and analyzes a list of queries. For this evaluation,
    3) Integrating with Fuzzing Methods: We use two popular                                            we assume that the queries are prepared and provided by
fuzzing tools, Wfuzz [20] and webFuzz [21], that are designed                                          the user, and we only measure the time taken to generate
                                                                                                                  5
for testing web applications. Figure 14 shows the code                                                 test data. Datafaker [39] and D OMINO [25] are much faster
coverage reported by Wfuzz and webFuzz. We use the default                                             than S YNTH DB and EvoSQL because they only analyze the
setup for each fuzzing test, and we use the timeout of 10                                              schema. While S YNTH DB takes a longer time than others,
hours for each test. S YNTH DB-generated database helps to                                             generating a test database is a one-time effort for each PHP
achieve the best coverage for both fuzzing tools in all the                                            application, and the generated database can be reused for
cases. On average, webFuzz reports 58.6% code coverage                                                 different dynamic testing and analysis techniques. Table V
with S YNTH DB’s database while EvoSQL’s database achieves                                             also shows the number of records each technique generates
47.4%, Datafaker and D OMINO get 37.0%, and the executions                                             for a test database. From our observation, 41.2% of the time
with an default DB achieve only 30.8%. Wfuzz shows 57.3%                                               is attributed to constraints solving, 14.3% for running the PHP
code coverage with S YNTH DB, 46.4% with EvoSQL, 36.0%
                                                                                                         5
for both Datafaker and D OMINO, and it covers only 29.9% in                                                  It would take a longer time than the presented result in practice.


                                                                                                  11
script, 6.5% for parsing the trace files, 25.8% for database                                    VI.    D ISCUSSION
generation and 12.2% for other components.
                                                                         Other Languages and DBMS. The current version of S YN -
                                                                         TH DB only supports PHP and MySQL database. S YNTH DB
                    V.   R ELATED W ORK                                  uses JSQLParser [37] to disassemble the recorded query. While
                                                                         it claims to support various DBMS (e.g., MySQL, Oracle,
Test Data Generation. Emmi et al. [14] have proposed an                  and PostgreSQL), its query analyzer needs to be extended
automatic test input generation technique for database applica-          to handle syntax differences between DBMSs (e.g., dialects).
tions written in Java. Similar to S YNTH DB, their technique is          For instance, PostgreSQL supports EXCEPT keyword while
based on concolic execution to derive input values and database          MySQL does not. To support languages other than PHP, an
records to explore uncovered application paths. However, their           instruction-level trace, a trace reader, and a parser for the target
technique focuses on generate concrete SQL query string that             language need to be developed. We leave this as future work.
can satisfy the symbolic constraints. S YNTH DB uses concolic
executions to identify the five types of database constraints            Dynamic Schema Changes. There are applications (e.g.,
to generate a test database that ensures data integrity while            WordPress) that allow the installation of plugins or extensions
providing valid query results to enable exploring uncovered              at runtime, and they may change the schema dynamically.
PHP codebase. In addition, their approach handles a SQL                  While the current implementation of S YNTH DB does not sup-
query as string constraints (equality, inequality, and LIKE), and        port dynamically changing database schema during its analysis,
it only supports WHERE and FROM clauses. S YNTH DB parses                it can be used for such plugins and extensions. Specifically,
SQL queries to utilize the semantics to recognize database               the user can install the plugin first and then run S YNTH DB
constraints, and it can handle queries with JOIN operation.              to generate a test database that can support plugins for further
                                                                         security analysis. Note that after the plugin is installed, the
    There exist several approaches to generate test data or a            schema would not be changed further at runtime. To fully
test database to examine SQL queries or database integrity               handle dynamic schema changes, the final output needs to
constraints. EvoSQL [18] is a query-aware test data generation           include multiple database instances to support each of the
technique. It models a test data generation problem as a                 possible schemas.
search-based problem to effectively find an optimal solution
that contains test data to cover realistic SQL queries. Other            Improving Concolic Execution. As discussed in Sec-
query-aware techniques [15], [16], [69] have been proposed to            tion IV-A, our concolic execution engine is less effective for
generate test data to cover various SQL queries. D OMINO [25]            applications globally accessing a large number of user inputs.
is an automated test data generation technique that aims to              Hence, we plan to develop a guided concolic execution to
systematically exercise the integrity constraints in database            improve the performance of the concolic execution engine.
schemas. There exist prior works [17], [70], [71] studying               Specifically, we will identify PHP code that affects or is af-
test data generation techniques for exercising and evaluating            fected by SQL queries and leverage guided concolic execution
database integrity constraints.                                          techniques to preferentially explore query-related code.
                                                                         Object-Relational Mapping (ORM). Object-relational map-
    Recently, JaSoN [72] proposed a systematic test case gener-          ping (ORM) is a program layer between the language and the
ation technique for Java applications using MongoDB. It uses a           database that lets users access data from a database using an
symbolic execution approach to generate executable JUnit test            object-oriented paradigm. The current version of S YNTH DB
cases. JaSoN applies a versioned schema-approach to gener-               does not support ORM. We observe that ORM implementa-
ating valid test inputs without relying on an explicit schema.           tions vary significantly between the APIs. Supporting them
Orthogonal to S YNTH DB, STICCER [73] is a database test                 in a generic way is challenging while not impossible. We
suite reduction technique by merging similar test cases.                 also observe that some PHP ORM have their own database
Static Analysis for Web Applications. Static-based security              abstraction layer (DAL), which can be leveraged to abstract
analysis [9], [11], [74], [75] and vulnerability scanner [10],           the implementation differences. We leave this as future work.
[76]–[82] are popular approaches for identifying security                Code Injection Attack. We do not consider the presence of
issues of web applications. However, web applications are                a code injection attack at the time of generating the database.
typically written in dynamic languages such as PHP, and most             In other words, we assume that the target PHP application
of them are frequently interact with external resources, such            and the database schema are not compromised when the user
as a database, to store and retrieve data effectively. Static-           launches S YNTH DB to generate a test database. We believe
based techniques have difficulties analyzing dynamic code and            that the generated database can help existing security tools to
interaction with databases.                                              identify code injection vulnerabilities.
Dynamic Analysis for Web Applications. There exist ap-                                         VII.    C ONCLUSION
proaches to provide effective dynamic analysis frameworks
or testing environments for web applications [13], [26]–[32].                We present S YNTH DB, a system that synthesizes a
Dynamic vulnerability testing techniques for web applica-                database for dynamic security analysis of database-backed
tions [27], [83]–[87] execute the target application on top              PHP web applications. It leverages a concolic execution to
of dynamic analysis frameworks to identify vulnerable code               identify interactions between PHP codebase and the SQL
or malicious logic. Hybrid approaches [88]–[90] combine                  queries, deriving five types of database constraints. S YNTH DB
static and dynamic techniques. Existing dynamic and hybrid               creates database records by solving the constraints, the gener-
approaches do not consider database-backed applications, or              ated database can be used to exercise program paths dependent
assume that the user provides a proper database.                         on database queries. Our evaluation with 17 real-world PHP

                                                                    12
web applications demonstrates that S YNTH DB outperforms                                [17]   J. Zhang, C. Xu, and S.-C. Cheung, “Automatic generation of database
existing state-of-the-art techniques, achieving 62.9% code and                                 instances for white-box testing,” in 25th Annual International Com-
77.1% query coverages while other techniques cover <48.9%                                      puter Software and Applications Conference. COMPSAC 2001. IEEE,
                                                                                               2001, pp. 161–165.
code and <52.9% queries. Our security analysis results show
                                                                                        [18]   J. Castelein, M. Aniche, M. Soltani, A. Panichella, and A. van Deursen,
that S YNTH DB could effectively assist existing security testing                              “Search-based test data generation for sql queries,” in Proceedings of
approaches, including Burp Suite, Wfuzz, and WebFuzz. Burp                                     the 40th international conference on software engineering, 2018.
Suite aided by S YNTH DB detects 76.8% of vulnerabilities                               [19]   “Burp suite,” 2020, https://portswigger.net/burp.
while other existing techniques cover 55.7% or fewer. Notably,                          [20]   “Wfuzz − The Web Fuzzer,” 2020, https://github.com/xmendez/wfuzz.
S YNTH DB helps to discover 33 previously unknown vulnera-                              [21]   O. van Rooij, M. A. Charalambous, D. Kaizer, M. Papaevripides,
bilities from 5 real-world applications.                                                       and E. Athanasopoulos, “Webfuzz: Grey-box fuzzing for web appli-
                                                                                               cations,” in Computer Security – ESORICS 2021. Springer-Verlag,
                          ACKNOWLEDGMENT                                                       2021.
     The authors would like to thank the anonymous reviewers                            [22]   G. A. D. Lucca and A. R. Fasolino, “Testing web-based applications:
for their constructive feedback. The authors gratefully ac-                                    The state of the art and future trends,” Inf. Softw. Technol., 2006.
knowledge the support of NSF 1916499, 1916500, 1908021,                                 [23]   Y.-F. Li, P. K. Das, and D. L. Dowe, “Two decades of web application
                                                                                               testing - a survey of recent advances,” Inf. Syst., vol. 43, pp. 20–54.
1909856, 1850392, and 2145616. This research was also par-
                                                                                        [24]   “SchoolMate,” https://sourceforge.net/projects/schoolmate/files/Schoo
tially supported by a gift from Cisco Systems. Any opinions,                                   lMate/.
findings, conclusions, or recommendations expressed in this
                                                                                        [25]   A. Alsharif, G. M. Kapfhammer, and P. McMinn, “Domino: Fast and
material are those of the authors and do not necessarily reflect                               effective test data generation for relational database schemas,” 2018
the views of the sponsor.                                                                      IEEE ICST, 2018.
                                                                                        [26]   A. Bulekov, R. Jahanshahi, and M. Egele, “Saphire: Sandboxing PHP
                               R EFERENCES                                                     applications with tailored system call allowlists,” in 30th USENIX
                                                                                               Security Symposium (USENIX Security 21).
  [1]   Verizon, “Data breach investigations report,” https://enterprise.verizon
        .com/resources/reports/2021-data-breach-investigations-report.pdfx.             [27]   G. Pellegrino, M. Johns, S. Koch, M. Backes, and C. Rossow,
                                                                                               “Deemon: Detecting csrf with dynamic analysis and property graphs,”
  [2]   Sucuri, “Website threat research report,” https://sucuri.net/wp-conten                 in Proceedings of the 2017 ACM SIGSAC Conference on Computer
        t/uploads/2020/01/20-sucuri-2019-hacked-report-1.pdf, 2019.                            and Communications Security, 2017, p. 1757–1771.
  [3]   D. Canali and D. Balzarotti, “Behind the scenes of online attacks: an
                                                                                        [28]   Y.-W. Huang, C.-H. Tsai, T.-P. Lin, S.-K. Huang, D. T. Lee, and S.-Y.
        analysis of exploitation behaviors on the web,” in 20th Annual Network
                                                                                               Kuo, “A testing framework for web application security assessment,”
        & Distributed System Security Symposium (NDSS 2013), 2013.
                                                                                               Comput. Networks, vol. 48, pp. 739–761, 2005.
  [4]   “Web Application Vulnerabilities: Attacks Statistics for 2018,” 2019,
                                                                                        [29]   S. McAllister, E. Kirda, and C. Krügel, “Leveraging user interactions
        https://www.ptsecurity.com/ww-en/analytics/web-application-vulnera
                                                                                               for in-depth testing of web applications,” in RAID, 2008.
        bilities-statistics-2019/.
                                                                                        [30]   Y. Zhou and D. Evans, “Ssoscan: Automated testing of web applica-
  [5]   A. Alhuzali, R. Gjomemo, B. Eshete, and V. Venkatakrishnan, “Navex:
                                                                                               tions for single sign-on vulnerabilities,” in USENIX Security’14.
        Precise and scalable exploit generation for dynamic web applications,”
        in 27th USENIX Security Symposium, 2018, pp. 377–392.                           [31]   W. G. J. Halfond, A. Orso, and P. Manolios, “Wasp: Protecting web
                                                                                               applications using positive tainting and syntax-aware evaluation,” IEEE
  [6]   B. Anderson and D. McGrew, “Identifying encrypted malware traffic
                                                                                               Transactions on Software Engineering, vol. 34, pp. 65–81, 2008.
        with contextual flow data,” in Proceedings of the 2016 ACM workshop
        on artificial intelligence and security, 2016, pp. 35–46.                       [32]   P. Saxena, D. A. Molnar, and B. Livshits, “Scriptgard: automatic
  [7]   K. Borgolte, C. Kruegel, and G. Vigna, “Delta: automatic identification                context-sensitive sanitization for large-scale legacy web applications,”
        of unknown web-based infection campaigns,” in Proceedings of the                       in CCS ’11, 2011.
        ACM CCS’13, pp. 109–120.                                                        [33]   Oracle, “Data integrity,” https://docs.oracle.com/cd/B19306 01/server
  [8]   L. Invernizzi, P. M. Comparetti, S. Benvenuti, C. Kruegel, M. Cova,                    .102/b14220/data int.htm.
        and G. Vigna, “Evilseed: A guided approach to finding malicious web             [34]   “Z3,” 2022, https://github.com/Z3Prover/z3.
        pages,” in 2012 IEEE symposium on Security and Privacy, 2012.                   [35]   “Vulcan logic dumper,” https://derickrethans.nl/projects.html, 2016.
  [9]   M. Sharif, V. Yegneswaran, H. Saidi, P. Porras, and W. Lee, “Eureka:            [36]   “The PHP Interpreter,” 2021, https://github.com/php/php-src.
        A framework for enabling static malware analysis,” in European
                                                                                        [37]   “JSqlParser,” 2021, https://github.com/JSQLParser/JSqlParser.
        Symposium on Research in Computer Security. Springer, 2008.
 [10]   N. Jovanovic, C. Kruegel, and E. Kirda, “Pixy: A static analysis tool           [38]   T. Lengauer and R. E. Tarjan, “A fast algorithm for finding dominators
        for detecting web application vulnerabilities,” in IEEE Symposium on                   in a flowgraph,” ACM Trans. Program. Lang. Syst., vol. 1, no. 1, p.
        Security and Privacy (S&P’06). IEEE, 2006.                                             121–141, jan 1979.
 [11]   J. Dahse and T. Holz, “Simulation of built-in php features for precise          [39]   “Datafaker-Tool for faking data,” https://github.com/gangly/datafaker.
        static code analysis.” in NDSS, vol. 14. Citeseer, 2014, pp. 23–26.             [40]   “Webchess,” https://github.com/halojoy/PHP7-Webchess.
 [12]   T. P. Group, “Dphp runkit book,” http://php.net/manual/en/book.runki            [41]   “Timeclock,” https://sourceforge.net/projects/timeclock/files/PHP%2
        t.php, 2016.                                                                           0Timeclock/.
 [13]   P. M. Wrench and B. V. Irwin, “Towards a sandbox for the deobfus-               [42]   “myBloggie,” https://sourceforge.net/projects/mybloggie/files/myblo
        cation and dissection of php malware,” in 2014 Information Security                    ggie/.
        for South Africa. IEEE, 2014, pp. 1–8.                                          [43]   “FaqForge,” https://sourceforge.net/projects/faqforge/files/faqforge/.
 [14]   M. Emmi, R. Majumdar, and K. Sen, “Dynamic test input generation                [44]   “WackoPicko Vulnerable Website,” 2018, https://github.com/adamdou
        for database applications,” in ISSTA ’07, 2007.                                        pe/WackoPicko.
 [15]   S. A. Khalek, B. Elkarablieh, Y. O. Laleye, and S. Khurshid, “Query-            [45]   “phpBB 2.0.23,” http://www.oldversion.com/windows/phpbb-2-0-23/.
        aware test generation using a relational constraint solver,” in 2008
        23rd IEEE/ACM International Conference on Automated Software                    [46]   “phpBB 3.3.8,” https://www.phpbb.com/.
        Engineering. IEEE, 2008, pp. 238–247.                                           [47]   “OpenCart 3.0.3.8,” https://github.com/opencart/opencart/releases/tag/
 [16]   M. J. Suárez-Cabal, C. de la Riva, J. Tuya, and R. Blanco, “Incre-                    3.0.3.8/.
        mental test data generation for database queries,” Automated Software           [48]   “OpenCart 4.0.0,” https://github.com/opencart/opencart/releases/tag/4.
        Engineering, vol. 24, no. 4, pp. 719–755, 2017.                                        0.0.0/.


                                                                                   13
[49]   “WordPress 5.1.2,” https://github.com/WordPress/WordPress/releases/             [79]   M. Monshizadeh, P. Naldurg, and V. Venkatakrishnan, “Mace: Detect-
       tag/5.1.2/.                                                                            ing privilege escalation vulnerabilities in web applications,” Proceed-
[50]   “WordPress 6.0.1,” https://github.com/WordPress/WordPress/releases/                    ings of the ACM CCS’14.
       tag/6.0.1/.                                                                     [80]   F. Sun, L. Xu, and Z. Su, “Detecting logic vulnerabilities in e-
[51]   “Simple Machines Forum,” 2022, https://www.simplemachines.org/.                        commerce applications,” in NDSS, 2014.
                                                                                       [81]   G. Wassermann and Z. Su, “Sound and precise analysis of web
[52]   “OsCommerce240,” https://github.com/osCommerce/oscommerce2.
                                                                                              applications for injection vulnerabilities,” in PLDI ’07, 2007.
[53]   “Ce-phoenix,” https://github.com/gburton/CE-Phoenix/tree/1.0.5.0.               [82]   Y. Zheng and X. Zhang, “Path sensitive static analysis of web
[54]   “Zencart 1.5.7,” https://github.com/zencart/zencart/tree/v155.                         applications for remote code execution vulnerability detection,” 35th
[55]   “Drupal 9.0.0,” https://www.drupal.org/project/drupal/releases/9.0.0.                  International Conference on Software Engineering, pp. 652–661, 2013.
[56]   O. van Rooij, M. A. Charalambous, D. Kaizer, M. Papaevripides, and              [83]   A. Doupé, L. Cavedon, C. Kruegel, and G. Vigna, “Enemy of the state:
       E. Athanasopoulos, “webfuzz: Grey-box fuzzing for web applications,”                   A state-aware black-box web vulnerability scanner,” in 21st USENIX
       in ESORICS, 2021.                                                                      Security Symposium, Aug. 2012, pp. 523–538.
                                                                                       [84]   S. Kals, E. Kirda, C. Krügel, and N. Jovanovic, “Secubat: a web
[57]   A. Alhuzali, B. Eshete, R. Gjomemo, and V. Venkatakrishnan, “Chain-
                                                                                              vulnerability scanner,” in WWW ’06, 2006.
       saw: Chained automated workflow-based exploit generation,” in Pro-
       ceedings of the ACM CCS’16, pp. 641–652.                                        [85]   G. Pellegrino and D. Balzarotti, “Toward black-box detection of logic
                                                                                              flaws in web applications,” in NDSS, 2014.
[58]   Y. Zou, Z. Chen, Y. Zheng, X. Zhang, and Z. Gao, “Virtual dom cover-
       age for effective testing of dynamic web applications,” in Proceedings          [86]   B. Hawkins and B. Demsky, “Zenids: Introspective intrusion detection
       of ISSTA’14, 2014, p. 60–70.                                                           for php applications,” IEEE/ACM 39th International Conference on
                                                                                              Software Engineering, pp. 232–243, 2017.
[59]   “builtwith,” 2021, https://builtwith.com/.
                                                                                       [87]   S. Son, K. S. McKinley, and V. Shmatikov, “Diglossia: detecting code
[60]   “SchemaAnalyst,” https://github.com/schemaanalyst/schemaanalyst.                       injection attacks with precision and efficiency,” Proceedings of the
[61]   “Xdebug ,” 2021, https://xdebug.org/.                                                  ACM conference on Computer & communications security, 2013.
[62]   “Common Vulnerabilities and Exposures,” 2021, https://cve.mitre.org/.           [88]   D. Balzarotti, M. Cova, V. Felmetsger, N. Jovanovic, E. Kirda,
                                                                                              C. Krügel, and G. Vigna, “Saner: Composing static and dynamic
[63]   “Exploit Database,” 2021, https://www.exploit-db.com/.
                                                                                              analysis to validate sanitization in web applications,” 2008 IEEE
[64]   A. Kiezun, P. J. Guo, K. Jayaraman, and M. D. Ernst, “Automatic                        Symposium on Security and Privacy (S&P’08), pp. 387–401, 2008.
       creation of sql injection and cross-site scripting attacks,” IEEE 31st          [89]   R. Jahanshahi, A. Doup’e, and M. Egele, “You shall not pass: Miti-
       International Conference on Software Engineering, pp. 199–209, 2009.                   gating sql injection attacks on legacy web applications,” Proceedings
[65]   “Security Testing Report,” 2020, https://github.com/carloFanc/Securit                  of the ACM ASIACCS, 2020.
       y-Testing/blob/main/FinalReportCarloFanciulli.pdf.                              [90]   A. Nguyen-Tuong, S. Guarnieri, D. Greene, J. Shirley, and D. Evans,
[66]   “Security Testing Project,” 2017, https://github.com/davidepedranz/s                   “Automatically hardening web applications using precise tainting,” in
       ecurity testing project/blob/master/report/vulnerabilities.pdf.                        USENIX Security, 2005.
[67]   PortSwigger, “Burp intruder,” https://portswigger.net/burp/documenta            [91]   V. Garousi, R. Özkan, and A. Betin-Can, “Multi-objective regression
       tion/desktop/tools/intruder.                                                           test selection in practice: An empirical study in the defense software
[68]   “Issue definitions - burp suite,” https://portswigger.net/kb/issues.                   industry,” Information and Software Technology, vol. 103, 2018.
                                                                                       [92]   A. Arrieta, P. Valle, J. A. Agirre, and G. Sagardui, “Some seeds are
[69]   C. Binnig, D. Kossmann, E. Lo, and M. T. Özsu, “Qagen: Gener-
                                                                                              strong: Seeding strategies for search-based test case selection,” ACM
       ating query-aware test databases,” in Proceedings of the 2007 ACM
                                                                                              Transactions on Software Engineering and Methodology, 2022.
       SIGMOD, New York, NY, USA, 2007.
                                                                                       [93]   “Advanced PHP 7 eCommerce Website,” https://github.com/justinhar
[70]   P. McMinn, C. J. Wright, and G. M. Kapfhammer, “The effectiveness                      tman/complete-php7-ecom-website.
       of test coverage criteria for relational database schema integrity
       constraints,” ACM Transactions on Software Engineering and Method-              [94]   “Online shopping system advanced,” https://github.com/PuneethRedd
       ology (TOSEM), vol. 25, pp. 1 – 49, 2015.                                              yHC/online-shopping-system-advanced.
[71]   P. McMinn, C. J. Wright, C. Kinneer, C. J. McCurdy, M. Camara, and              [95]   “Doctor-Appointment,” https://github.com/divScorp/Doctor-Appoint
       G. M. Kapfhammer, “Schemaanalyst: Search-based test data genera-                       ment.
       tion for relational database schemas,” IEEE International Conference            [96]   “Hostel Management System,” https://github.com/Bharat-Reddy/Host
       on Software Maintenance and Evolution, pp. 586–590, 2016.                              el-Management-System.
[72]   H. Winkelmann and H. Kuchen, “Symbolic Execution of NoSQL                       [97]   “Inventory management system,” https://github.com/carloFanc/Securit
       Applications Using Versioned Schemas,” in Proceedings of the 36th                      y-Testing/tree/main/inventory-management-system-fixed.
       Annual ACM Symposium on Applied Computing, ser. SAC ’21, New                    [98]   “Andy’s PHP Knowledgebase,” https://sourceforge.net/projects/aphpk
       York, NY, USA, 2021, p. 1778–1787.                                                     b/files/.
[73]   A. Alsharif, G. M. Kapfhammer, and P. McMinn, “Sticcer: Fast and                [99]   “MediaWiki,” https://www.mediawiki.org/wiki/MediaWiki.
       effective database test suite reduction through merging of similar test        [100]   “Better Search,” https://wordpress.org/plugins/better-search/.
       cases,” 2020 IEEE 13th International Conference on Software Testing,
       Validation and Verification (ICST), pp. 220–230, 2020.                         [101]   “Contact Form 7 Database Addon – CFDB7,” https://wordpress.org/
                                                                                              plugins/contact-form-cfdb7/.
[74]   Y.-W. Huang, F. Yu, C. Hang, C.-H. Tsai, D. T. Lee, and S.-Y.
       Kuo, “Securing web application code by static analysis and runtime             [102]   “Student Result,” https://wordpress.org/plugins/simple-student-result/.
       protection,” in WWW ’04, 2004.                                                 [103]   “Contact Forms Lite,” https://wordpress.org/plugins/wpforms-lite/.
[75]   M. Hills, P. Klint, and J. J. Vinju, “An empirical study of php
       feature usage: a static analysis perspective,” Proceedings of the 2013                                         A PPENDIX
       International Symposium on Software Testing and Analysis, 2013.
[76]   P. Li and W. Meng, “Lchecker: Detecting loose comparison bugs in               A. Handling Path Constraints
       php,” Proceedings of the Web Conference 2021, 2021.
[77]   M. Backes, K. Rieck, M. Skoruppa, B. Stock, and F. Yamaguchi,
                                                                                          During the concolic execution, S YNTH DB solves various
       “Efficient and flexible discovery of php application vulnerabilities,”         path constraints to cover more program paths. In particular, we
       IEEE EuroS&P’17, pp. 334–349.                                                  obtain path constraints from predicate conditions. Figure 13-
[78]   J. Dahse and T. Holz, “Static detection of second-order vulnerabilities        (a) shows an example predicate where S YNTH DB extracts
       in web applications,” in USENIX Security Symposium, 2014.                      the constraints shown in Figure 13-(b). Specifically, we first

                                                                                 14
                                                                                                                               1                            2
translate the structure of the predicate condition to the con-                 TABLE VI.    Q UERY- CONDITION (QC ) AND P OST- QUERY (PQ )
                                                                                 C ONSTRAINTS S YNTH DB DERIVED FROM PHP A PPLICATIONS .
straints ( 1 ). Then, we concretize all the functions that are not
operating the tracked variables. In this example, we obtain the                    Id    QC
                                                                                              1
                                                                                                   PQ
                                                                                                      2
                                                                                                           Total         Id        QC
                                                                                                                                        1
                                                                                                                                            PQ
                                                                                                                                               2
                                                                                                                                                    Total
concrete return value of time() which is ‘1654229324’ ( 2 ).                       s1         59    126      185        s10         481      379     860
Then, we create symbolic variables (e.g., fnret) to represent                      s2         30     27       57        s11         247      179     426
the remaining functions and expressions ( 3 ). If a symbolic
                                                                                   s3        142     54      196        s12         262      203     465
variable represents a function, we define our own function
                                                                                   s4         34     37       71        s13         752      518    1,270
handler in S YNTH DB that emulates the target function (e.g.,
Synth strtotime() emulates strtotime()) ( 4 ). Finally,                            s5         12     11       23        s14         214      198     412

we define an additional constraint to relate the symbolic                          s6         21     12       33        s15         428      227     655
variables (e.g., fnret) to the tracked program variable (e.g.,                     s7        284    191      475        s16         805      614    1,419
$ POST["exp"]) ( 5 ).                                                              s8        628    418    1,046        s17         215      198     413
                                                                                   s9        557    317      874       Total       5,171    3,709   8,880

                     if(strtotime($_POST["exp"]) < time())

                                (a) Predicate Condition       2     5        Note that the GROUP BY statement is typically used with
    4      3     1
                               var(fnret) < 1654229324 /\                    aggregate functions (COUNT(), MAX(), MIN(), SUM(), AVG()),
                     Synth_strtotime(fnret) == var($_POST["exp"])            which we do not support due to the conflicting constraints.
                             (b) Extracted Path Constraints                  Lastly, we present the top 75 frequent SQL keywords in
Fig. 13.       Extracting Path Constraints                                   Table VII, which are 99.7% of the total extracted keywords.
                                                                             Among 75 keywords, 25 of them are generic SQL keywords
                                                                             that do not contribute to database reconstruction. S YNTH DB
B. Observation from Coverage Evaluations                                     supports 47 out of the remaining 50 keywords but does not
    From the coverage evaluation, we observe that the most                   support 3 keywords.
common cases that S YNTH DB can cover but others cannot are
                                                                                        TABLE VII.         T OP 75 FREQUENT SQL KEYWORDS .
predicates that evaluate values from the query return, including
logical comparisons between two or more values from different                                      WHERE, FROM, SELECT, NOT, AND, SET, TABLE,
columns. Let’s revisit the example code presented in Figure 7                                      DEFAULT, NULL, AS, DELETE, UPDATE, BY, ON,
                                                                                                   JOIN, INT, KEY, INSERT, INTO, IN, LEFT, CREATE,
(a). As we discussed, the query return values from two seperate                  Supported
                                                                                                   IF, DROP, UNSIGNED, PRIMARY KEY, OR, INNER,
queries at line 1 and 3 are stored in $sql1 and $sql2, and                                         TINYINT, DISTINCT, MEDIUMINT, VALUES, TEXT,
                                                                                                   DATETIME, ALTER, SMALLINT, IS, PRIMARY, LIKE,
the program’s path changes based on the values from three                                          CASE, BIGINT, UNIQUE KEY, BETWEEN, DATE,
columns, points, aperc, and students. To explore the true                                          MEDIUMTEXT, HAVING, ELSE

branch at line 7, we need to understand the relationships                        Not supported     EXISTS, GROUP, INTERVAL

between those two columns and generate items accordingly.                                          ORDER, LIMIT, FOR, COLLATE, DESC, ASC, COALESCE,
                                                                                 No Effect         LOCK, UNLOCK, ENABLE, DISABLE, DATA, THEN, TO,
We observe that query-condition and post-query constraints                                         WHEN, END, YEAR, MONTH, LONGTEXT, TRUE, ADMIN
play significant roles in improving the code coverage and                                          USER, REPLACE, FIRST, IGNORE

Table VI shows the number of each constraint S YNTH DB
derived from each PHP application we evaluate.
                                                                             D. Algorithm: Concolic Execution
C. SQL keyword Statistics                                                        Algorithm 1 runs as a part of our concolic execution engine.
                                                                             Specifically, after the concolic execution engine processes each
    We run statistical analysis on all 17 applications we evalu-             instruction, we conduct our analysis to extract the constraints.
ated to show that (1) our selected applications include a wide
spectrum of SQL queries and (2) S YNTH DB supports most                          It takes an input UNTRUSTED S RCS that contains untrusted
of those frequently used SQL keywords and functionalities.                   sources. At line 2, our concolic execution engine taints be-
Specifically, we search all the SQL keywords in PHP source                   fore its analysis, so that any data originated from the un-
files and schema files. Then, we rank the SQL keywords by                    trusted sources will be tracked. Lines 3∼46 form a large loop
the number of appearances.                                                   that is executed on every instruction. Specifically, at line 3,
                                                                             we run the concolic execution engine on each instruction
Results and Observations. First, there are 744 SQL key-                      (S INGLE S TEP C ONCOLIC E XEC ()), and obtain the executed
words according to the MySQL version 8.0.24’s specification.                 instruction as ins. At lines 4∼5, we implement a basic taint
Among them, 214 keywords are appeared in our selected 17                     propagation logic: if ins.operand (i.e., an operand or argument
applications (Table I), meaning that the selected applications               of an instruction) is tainted, we taint its outcome (i.e., result).
include diverse SQL queries (hence those applications are of
high quality for the evaluation). Second, a total of 49,585 SQL              Pre-query constraints (Line 6∼13). When a query that inserts
keywords are used in our selected 17 applications, and the                   or updates the database is executed, we check whether the
top 25 most frequent keywords are the dominant majority as                   query is constructed by using program variables. If so, we
they are 83.3% of the total extracted keywords. S YNTH DB                    collect the constraints related to those variables for pre-query
supports all those top 25 frequent keywords. For the top 50                  constraints. Specifically, if the current instruction calls a DB
frequent SQL keywords, which are 97.5% of the total extracted                function (e.g., mysqli query()) to execute an INSERT or
keywords, S YNTH DB failed to handle only two of them,                       UPDATE query and the query string passed to the function is
EXISTS and GROUP BY, which appear 691 times out of 51,510.                   tainted (lines 9∼10), we identify all the tainted variables used

                                                                        15
to compose the query (line 11) and collect them as a pre-query             Algorithm 1: Obtaining Database Constraints
constraint (lines 12∼13).                                                    Input : UNTRUSTED S RC: a list of five untrusted sources ($ GET,
                                                                                       $ POST, $ REQUEST, $ SESSION, and $ COOKIE).
Post-query constraints (Line 14∼18). Post-query constraints                  Output: Collected four types (pre-query, query-condition,
are collected from the program code, particularly branches,                            post-query, and synchronized-query) of constraints.
using the data returned from a database. Specifically, if                  1 procedure O BTAIN DATABASE C ONTRAINTS
                            6                                              2   TAINT( UNTRUSTED S RC )
the instruction is a branch , we check whether the branch
                                                                               for ins ← S INGLE S TEP C ONCOLIC E XEC () do
condition is tainted, and originated from a SELECT query
                                                                           3
                                                                           4      if IS TAINTED( ins.operand ) then
(lines 15∼16). In other words, we try to identify cases that a             5         TAINT( ins.result )
SELECT query’s return is used as a predicate condition such as             6      // Extract the pre-query constraint
‘if ($database[‘field’] == ...)’. If so, we collect the                    7      if IS DBF UNCTION C ALL( ins ) then
current query and the instruction as a post-query constraint               8         query ← G ET F UNC A RGS( ins )
(lines 17∼18). Note that the query represents the source of                9         if IS TAINTED( query ) and
                                                                          10            QUERY T YPE ( query ) = ( INSERT or UPDATE ) then
the constraint and the instruction for the predicate condition             11           tainted ← GET TAINTEDVARS( query )
associated with the constraint.                                            12           Constraintspre−query ← Constraintspre−query ∪
                                                                           13                                   <query, tainted>
   Lines 19∼22 show that S YNTH DB taints a return value of
a DB function (e.g., mysqli query()) if either SELECT or                  14      // Extract the post-query constraint
UPDATE query is executed (lines 21∼22), as it retrieves data              15      if IS B RANCH( ins.opcode ) and
                                                                          16        QUERY T YPE (TAINT S OURCE ( ins.operand )) = SELECT then
from a database.
                                                                          17         Constraintspost−query ← Constraintspost−query ∪
Query-condition constraints (Line 23∼29). Query-condition                 18                               <TAINT S OURCE( ins.operand ), ins>
constraints are obtained from conditional clauses of a query.             19      if IS DBF UNCTION C ALL( ins ) and
During the concolic execution, if the current instruction calls           20         QUERY T YPE (G ET F UNC A RGS( ins )) =
                                                                                       (SELECT or UPDATE) then
a DB function (e.g., mysqli query()) with a SELECT or
                                                                          21
                                                                          22         TAINT( G ET F UNCTION R ETURN( ins ) )
UPDATE query (line 26), we check the query passed to the
                                                                                  // Extract the query-condition constraint
function to see whether it has conditional clauses (e.g., WHERE,
                                                                          23
                                                                          24      if IS DBF UNCTION C ALL( ins ) then
JOIN, and HAVING) at line 27. If it has, we collect the query             25         query ← G ET F UNC A RGS( ins )
as a query-condition constraint (lines 28∼29).                            26         if QUERY T YPE( query ) = (SELECT or UPDATE) and
                                                                          27            GET C ONDITION C LAUSE ( query ) ≠ ∅ then
Synchronized-query constraints (Line 30∼46). S YNTH DB                     28           Constraintsquery−cond ← Constraintsquery−cond ∪
identifies synchronized-query constraints when queries that are            29                                   <query>
always executed together (i.e., queries within the same basic             30      // Extract the synchronized-query constraint
block) are affected by the same program variables. Specifically,          31      if IS B RANCH( ins.opcode ) then
we first maintain a list of queries that are executed within              32         Consecutive-queries ← ∅
the same basic block (lines 31∼35). We identify consecutive               33      else if IS DBF UNCTION C ALL( ins ) and QUERY T YPE(
queries by adding any INSERT or UPDATE queries to the set                           G ET F UNC A RGS( ins )) = (INSERT or UPDATE) then
which we reset on a branch instruction, which indicates the               34         query ← G ET F UNC A RGS( ins )
beginning of a new basic block (lines 31∼32).                             35         Consecutive-queries ← Consecutive-queries ∪ <query>
                                                                          36      if IS DBF UNCTION C ALL( ins ) then
    With the consecutive query list, when a database function is          37         query ← G ET F UNC A RGS( ins )
invoked with an INSERT or UPDATE query (line 39), we check                38         if IS TAINTED( query ) and
whether the query is constructed by tainted program variables             39            QUERY T YPE ( query ) = ( INSERT or UPDATE ) then
                                                                           40           tainted ← GET TAINTEDVARS( query )
(line 40). If so, we iterate all the consecutive queries within            41           for ∀ queryconsec ∈ Consecutive-queries do
the basic block and their tainted variables (lines 41∼42). If the          42               taintedconsec ← GET TAINTEDVARS( queryconsec )
current query and one of the consecutive queries have common               43               shared ← tainted ∩ taintedconsec
tainted variables (lines 43 and 44), it means that those queries           44               if shared ≠ ∅ then
are constructed from a same program variable, resulting in                 45                  Constraintssync−query ← Constraintssync−query
                                                                           46                                      ∪ <query, queryconsec , shared>
synchronized-query constraints (line 45∼46).

E. Reachability Test: Failed Cases of S YNTH DB                           47    return <Constraintspre−query , Constraintsquery−cond ,
                                                                          48            Constraintspost−query , Constraintssync−query >
    We further investigated the vulnerabilities that S YNTH DB
failed to reach in the reachability evaluation (Section IV-B2).
Among the 18 cases, six of them require other external
resources. One requires different configurations (e.g., changing          two cases require serialized object as input, and two case
the application language or turning on the legacy features),              requires a specific plug-in installed. Furthermore, we analyze
five cases failed due to SMT solver’s limited URL support,                the remaining two cases that S YNTH DB failed to reach.
                                                                         1. Case 1: Figure 14-(a) presents the PHP code from Wack-
  6
   We consider the following opcodes as branch instructions:                oPicko [44] that contains a directory traversal vulnerability.
IS IDENTICAL, IS NOT IDENTICAL, IS EQUAL, IS NOT EQUAL,                     The if-statement at line 35 evaluates the existence of a
IS SMALLER,      IS SMALLER OR EQUAL,        SWITCH LONG,
SWITCH STRING, ISSET ISEMPTY VAR, ISSET ISEMPTY DIM OBJ,                    specific file where the file name is provided by the user
ISSET ISEMPTY PROP OBJ,         ISSET ISEMPTY CV,        IS-                through $ POST. S YNTH DB failed to take the true branch
SET ISEMPTY THIS, and ISSET ISEMPTY STATIC PROP.                            because the system does not have the requested file in

                                                                    16
  29     $filename = "../upload/{$_POST['tag']}/{$_POST['name']}";                        Conflicting Constraints. In addition to conflicting constraints
         ...
  35     if (file_exists($filename))                                                      discussed in Section III-C, another commonly observed pattern
  36     {                                                                                of a conflicting constraint is an error-handling/exception rou-
  37       $new_name = tempnam("../upload", $filename);
  38       move_uploaded_file($_FILES['pic']['tmp_name'], $new_name);                     tine that is only executed when a query (e.g., SELECT) returns
  39       ...                                                                            no record. In most cases, such an error-handling is followed
       (a) Case 1: WackoPicko-upload.php (Directory traversal vulnerability at 38)        by a data processing code that handles returned records from
 20      if ($show_display_name == "yes") {
                                                                                          the query. In that case, if a database does not have records, it
 22        if (isset($displayname)) {                                                     will only cover the error-handling routine, while if a database
 23          $query = "select displayname from " . $df_prefix . ...;                      has records, it will only cover the data processing code. Other
 24          $emp_name_result = mysql_query($query);
             ...                                                                          conflicting constraints include SQL queries using aggregation
 36
 38
         } else if ($show_display_name == "no") {
           if (isset($fullname)) {
                                                                                          functions, such as MIN, MAX, and AVG. Specifically, suppose
 40          $query = "select empfullname from " . $df_prefix . ...;                      there are multiple queries specifying different values for the
 41          $emp_name_result = mysql_query($query);                                      same database and table. In that case, multiple databases are
             ...
                                                                                          required (e.g., if two queries are expecting MIN values of 1
        (b) Case 2: timeclock-1.04-leftmain.php (SQL injection at 24 and 41)
                                                                                          and 2, two databases having the smallest value of 1 and 2 are
Fig. 14. Analysis of Failed Cases of S YNTH DB (Gray shaded regions are not               needed). We leave this for future research.
reached as S YNTH DB-synthesized database failed to provide data that satisfy
the red-shaded predicates’ conditions at lines 35 and 20).                                Overhead and Re-analysis S YNTH DB’s overhead is not
                                                                                          trivial as we conduct a more comprehensive analysis than
   it. S YNTH DB focuses on generating a test database for                                existing techniques. However, we believe that it is acceptable in
   web application testing, but reconstructing other external                             the context of security testing, where existing dynamic testing
   resources, such as a file, is out of the scope of this work.                           techniques (e.g., fuzzing) typically run 6∼35 hours. If the target
2. Case 2: Figure 14-(b) shows code snippets from timeclock-                              program’s source code is updated (potentially also updating
   1.04 [41]. $show display name variable at lines 20 and                                 the database-related code), S YNTH DB requires a re-analysis of
   36 is defined by a dynamically generated configuration                                 the updated program. This is a typical limitation of dynamic
   file. Our concolic execution only takes the else branch                                analysis techniques. S YNTH DB can be further improved to
   at line 36 (not the true branch at lines 22∼24) because                                support incremental analysis. Specifically, we can leverage the
   the default value of $show display name is “no”. The                                   existing regression testing techniques [91], [92] while there are
   current implementation of S YNTH DB does not control the                               additional challenges, such as how to integrate the incremental
   values defined in the configuration file.                                              analysis result to the previous analysis result from the old
     We leave handling the above cases as future work.                                    version of the program. We leave this for future research.
                                                                                          Generality of Database Constraints. We try our best to be
F. Additional Discussion                                                                  generic in deriving constraints from our observation. Specif-
                                                                                          ically, we study 28 common and popular web applications’
Complexity of Regular Expression Constraints. We ob-                                      codebases and databases (we manually operate the applications
served the average length and processing time of regular                                  to obtain the databases), to derive the constraints. The 28 ap-
expression is 11 (in # of characters) and 51 ms for each                                  plications are (1) 17 evaluated applications, (2) 7 applications
regular expression. Due to the limitation of the library exrex                            (Ecom-site [93], Onlineshop [94], Doctor-Appointment [95],
that S YNTH DB uses, 3.27% of regular expressions were not                                Hotel-Management-System [96], Inventory [97], Aphpkb [98],
solved. For instance, “/ˆ[ˆ<]*+(?:<[ˆ>]*+>[ˆ<]*+)*+$/” raises                             and mediawiki [99]), and (3) 4 wordpress plug-ins. (better-
a “multiple repeat error.”                                                                search [100], cfdb7 [101], student-result [102], and wp-
Clarification of S YNTH DB’s Results and Other Tools’                                     forms [103]) For the concolic execution, we develop a standard
Results. SynthDB’s result is almost a superset except for an                              concolic execution engine as described in Section III-A. We
average of 0.32% total code (0%,0.61%,0.65%,0% for de-                                    additionally implemented support for symbolizing queries,
fault DB, Domino, Datafaker, and EvoSQL respectively). The                                query return values, and database fields.
main reason for the missing 0.32% is conflicting constraints,                             False Positives and Negatives. We identify three main sources
as we discussed in Section III-C ”Conflicting Constraints”                                for FNs by manually inspecting PHP code, SQL queries, and
single database cannot satisfy multiple database constraints                              generated test databases: Conflicting constraints are the main
that have conflicting definitions. SynthDB chooses a database                             source of FNs (Section III-C “Conflicting Constraints”). The
with the least number of conflicting constraints as output, and                           second source is unsupported SQL keywords (Section VII-C
thus causes missing code and queries. Supporting multiple                                 “SQL keyword Statistics”). The third source is dynamic
databases to handle conflicting constraints is our future work.                           schema changes (Section VI “Dynamic Schema Changes”).
                                                                                          From our observation, 13.5% of uncovered code and 15.2% of
Implicit Datatype Conversion. SynthDB infers the datatype                                 uncovered queries are caused by the first two main sources.
by analyzing the definition of the variables and the query. If                            We start to evaluate the web applications after all installation-
a datatype differs between the PHP code and the database                                  s/upgrading is done, so the current evaluation is unaffected by
schema, we implicitly convert the type by prioritizing a                                  the third source. We plan to support dynamic schema changing
more concrete datatype than the other (e.g., mostly from the                              during the evaluation in the future.
schema). SynthDB currently supports conversions between
three datatypes of PHP (i.e., String, Integer, and Float) and
all types of the database.

                                                                                     17
