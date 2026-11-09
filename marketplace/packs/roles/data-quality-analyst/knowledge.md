# Data quality and governance analyst: role knowledge

Checked 6 November 2026. Facts that change carry their own date and a source number from `sources.json`. I write the checks that catch bad data, the data dictionary that says what each column means, the plan for finding and merging duplicates, the field map for moving to a new system, and made-up test data. I work from samples and exports you share, or inside your tools at the access level you grant (see `access.md`). Until you choose, I only read. Even at level 3, every merge, deletion and bulk update needs a backup first and a fresh yes from you, every time.

## 1. What this role is for

**Who hires me.** Small and mid-sized firms whose reports keep surprising them: a shop whose CRM holds three records for one customer, a charity whose five sites use "active member" five ways, a firm switching CRM, till or accounting package, a developer who needs safe data to test an import. The person asking is usually an owner, an operations manager, a lone analyst or a developer.

**Four kinds of work.**
- **Rules and checks:** profile the data, write rules in plain words, turn each into a sheet formula, a SQL query, a dbt test or a database constraint, and say who fixes failures.
- **Definitions:** the data dictionary (every column's meaning, type, allowed values, owner), the business glossary and notes on where each report's numbers come from.
- **Moves and merges:** finding duplicates, deciding which record wins, field maps from an old system to a new one, test imports with record counts, cut-over and rollback.
- **Made-up test data:** files built to your columns and rules, with labelled bad rows, so imports and checks can be tested without real people's details.

**Who does the neighbouring jobs.** The data analyst answers business questions from the data and owns general clean-up (see the `data-profiling-and-clean-up` skill in the data analyst kit). The BI analyst defines metrics and builds dashboards (`metric-definition-sheet` in the BI analyst kit). The database engineer puts rules into constraints and runs schema migrations (database engineer kit). The spreadsheet specialist builds the workbook itself. I make sure the data is fit for its use and that everyone knows what it means.

**What good work looks like.**
- Every important column has a plain meaning, an owner and its allowed values written down.
- Every rule has an exact check, a pass condition, a severity, an owner and a fix step.
- Problems are counted and set aside with reasons, never hidden by deleting rows.
- Fixes happen at the source, so the same error stops coming back.
- Nothing is merged, deleted or bulk-updated without a backup and a yes.
- Test data contains no real person, card or ID number.

**How the work is judged.**
- The monthly report needs fewer manual fixes, and failures are caught before it goes out.
- Duplicate and blank rates fall over time on the fields that matter.
- After a move, record counts and key totals match at every stage.
- New staff use the dictionary instead of asking around.
- Correction requests from customers are handled fully, in every system that holds the data.

## 2. The canon

**Reading list (credited by author and title; no claims drawn from them here).** DAMA International, *DAMA-DMBOK: Data Management Body of Knowledge*; Danette McGilvray, *Executing Data Quality Projects*; Thomas C. Redman, *Getting in Front on Data*; Richard Y. Wang and Diane M. Strong, "Beyond Accuracy: What Data Quality Means to Data Consumers" (1996); Ivan Fellegi and Alan Sunter, "A Theory for Record Linkage" (1969).

**UK Government Data Quality Framework (Government Data Quality Hub, December 2020).** The clearest free statement of the field. It uses six dimensions from DAMA UK and says the list is not prescriptive: completeness (are the records and values present), uniqueness (is each thing recorded once), consistency (do values agree within and across datasets), timeliness (is the data current enough for its use), validity (is it in the expected format and range) and accuracy (does it match reality). Its five principles: commit to data quality, know your users and their needs, assess quality throughout the lifecycle, communicate quality clearly, and anticipate changes that affect quality. It treats quality as "fit for purpose": the level needed depends on the use, and perfect quality is not always achievable. It asks for root cause analysis so fixes happen at the source rather than as temporary patches [1].

**"A test is a query that returns the failing rows" (dbt Labs).** dbt defines a data test as a select query that returns the rows that break a rule; zero rows means it passes [7]. I use this pattern everywhere, not only in dbt: a sheet filter, a SQL query, a Great Expectations Expectation or a Soda check all answer the same question, "show me the rows that fail", which makes failures countable and fixable.

**Record linkage (Fellegi and Sunter, put into practice by Splink).** Matching records with no shared ID by weighing how much each field agreement or disagreement says about a match. The UK Ministry of Justice's open-source Splink package uses the Fellegi-Sunter model, and its named users include the Office for National Statistics, NHS England and the Australian Bureau of Statistics [16].

**Clustering for messy values (OpenRefine).** OpenRefine's documentation explains two families: key collision (normalise each value to a key and group equal keys) and nearest neighbour (group values within an edit distance). Its default fingerprint method is the least likely to give false matches; looser methods find more but wrongly group more [15].

**Data contracts (Bitol's Open Data Contract Standard).** A contract is a written, machine-readable agreement between whoever produces a dataset and whoever uses it: schema, quality rules, service levels, owners. ODCS is at v3.2.0 under Apache 2.0, and its citation names the LF AI & Data Foundation [14].

**Two real cases.**
- **Public Health England, October 2020.** A fault in the automated load of positive test results left 15,841 cases out of the daily figures between 25 September and 2 October 2020, because some files were larger than the maximum size the load process could handle. The fix was to split large files before loading and to review the whole process [25]. My lesson: count rows in and rows out at every step of a load, and alert when they differ.
- **Citigroup, July 2024.** The Federal Reserve fined Citigroup $60.6 million for insufficient progress in fixing its data quality management problems under a 2020 enforcement action, with Fed and OCC penalties together about $135.6 million [26]. My lesson: regulators treat data quality as a control, and a plan on paper is not progress.

## 3. How the work is done now

### Profile before writing rules

- **What to profile.** Per table: row count, what one row means, whether the key is unique. Per column: type, blanks, distinct values, minimum and maximum, formats, the commonest values and the strange ones. Across tables: rows that point to nothing.
- **Power Query (Excel and Power BI, as of 6 November 2026).** Column quality shows valid, error and empty shares; column distribution shows distinct and unique counts; column profile shows statistics and a value chart. By default it profiles only the first 1,000 rows; switch the status bar to "Column profiling based on entire data set" before trusting the figures [17].
- **Accuracy needs a reference.** Validity can be checked by rules; accuracy can only be checked against reality: a source system, a document, a sample confirmed by a person. I say which rules test validity and which test accuracy, and never call valid data accurate.

### Rules in five groups

I sort rules into five groups, matching the framework's dimensions [1]: **complete** (required fields filled), **valid** (formats, ranges, allowed values), **unique** (no duplicates on the key), **consistent** (dates in order, totals that agree, the same value in two systems) and **linked** (every reference has a match). Timeliness gets its own freshness check. Each rule carries a severity: stop the report, fix this week, or note only. dbt expresses the same idea with `severity: warn` or `error` and thresholds such as `warn_if` and `error_if` [7].

### Where checks live (tools as of 6 November 2026)

- **Spreadsheets.** COUNTIFS for duplicates and blanks, conditional formatting to highlight duplicates, and validation lists to stop bad input. Excel's Remove Duplicates deletes rows permanently, keeps the first occurrence and compares what is displayed, so the same date in two formats counts as two values; Microsoft advises copying the data or filtering for unique values first [18]. In Google Sheets, a dropdown rejects entries not on the list by default, unless set to "Show a warning" [19].
- **SQL.** One query per rule returning the breaking rows, in the client's database flavour. Constraints that must never break belong in the database (see the database engineer kit).
- **dbt.** Four built-in generic tests: `unique`, `not_null`, `accepted_values` and `relationships`; singular tests are SQL files. The YAML key is `data_tests:` (`tests:` still works as an alias). The `arguments:` property arrived in v1.10.5 and is required in v2; the docs list v2, v1 and 1.11 to 1.13. `store_failures` saves failing rows to a `dbt_test__audit` schema by default [7]. Unit tests (from v1.8) check transformation logic on small fixed inputs before a model is built, and dbt recommends running them in development or CI [8]. `dbt build` does not check source freshness; add `dbt source freshness` as a step, and run it at least twice as often as your tightest freshness promise [10].
- **dbt model contracts.** A contract fixes column names and types and fails the build if the SQL does not match. Constraints are only enforced where the platform enforces them: `not_null` widely, `primary_key`, `unique` and `foreign_key` usually not in cloud warehouses, while Postgres enforces all it supports. dbt advises adopting contracts once a model's structure has settled [9].
- **Great Expectations.** An Expectation is a verifiable assertion about data, grouped into suites and run by Checkpoints, with over 50 built in. The current release is GX Core 1.24.1; older 0.18 pages are marked as no longer maintained [11].
- **Soda.** Soda's documentation centres on data contracts, reconciliation checks such as comparing row counts between a warehouse table and its source, and an AI root-cause agent [12].
- **ODCS rules.** Types `text`, `library`, `sql` and `custom`; library metrics `nullValues`, `missingValues`, `invalidValues`, `duplicateValues` and `rowCount`; operators such as `mustBe` and `mustBeBetween`; dimensions including accuracy, completeness, consistency, timeliness and uniqueness [13].

### Duplicates and merges

- **Match keys, from strict to loose.** An exact shared ID; an exact email or domain; a normalised key (trim, lower case, punctuation removed, tokens sorted); fuzzy distance; probabilistic scoring.
- **OpenRefine's fingerprint** trims, lower-cases, removes punctuation, converts accented letters to plain ones, splits into words, sorts and removes repeats, so "Cruise, Tom" and "Tom Cruise" match. Small n-grams find more matches with many false positives; PPM is a last resort; nearest-neighbour blocking defaults to 6 characters. Fingerprinting can wrongly merge values where accents carry meaning, and clustering only compares spelling, not meaning [15].
- **Probabilistic linkage.** Splink scores pairs with Fellegi-Sunter weights and runs on DuckDB, Spark or PostgreSQL; the project says it links a million records on a laptop in about a minute [16].
- **Survivorship.** Before any merge, write field by field which record wins: newest non-blank, most trusted source, or a named system of record.
- **HubSpot (as of 6 November 2026).** Contacts are deduplicated by email and companies by primary domain, but companies created through the API are not deduplicated by domain. Imports with a Record ID update existing records; rows without one create new records [20]. On merge, the primary record's values are kept and blanks filled from the secondary; merges fail once the two records' combined merge count reaches 250; HubSpot states "It's not possible to unmerge records." [21]. The duplicate manager needs a Professional or Enterprise tier and shows up to 10,000 pairs; bulk merges and custom rules need Data Hub Professional (30,000 pairs) or Enterprise (100,000). Rejected pairs can be restored within 14 days, merges cannot [22].

### Dictionaries, glossaries and contracts

- **Dictionary.** For each table: what one row is, the key, the row count. For each column: plain meaning, type, allowed values or range, an example from the samples, whether blanks are allowed, the owner, and notes. Code lists become small lookup tables. Guesses are marked "to confirm".
- **Glossary.** Business terms in plain words with what each includes and leaves out, so two sites stop counting "active" differently.
- **Contract.** The dictionary, the rules, the owner and the freshness promise in a machine-readable file, for data other teams depend on. Use ODCS for the shared agreement and dbt contracts for the build side [9][13].

### The issue log and root causes

Every failure that matters gets a line: date found, dataset, rule, rows affected, severity, owner, root cause, fix at the source, status, date closed. Root cause comes before clean-up, because a fix applied downstream has to be repeated forever [1]. The PHE case is the pattern to watch: a silent limit in a load process [25].

### Moving data between systems

Field map (old field, new field, format change, default for blanks, fields with no home), transform rules with before-and-after examples, a test import of the messiest records, counts at every stage, a freeze, the final export, the import, checks and a written way back. In HubSpot, include Record IDs in update imports or the import creates duplicates [20].

### Made-up test data

- Emails use the reserved `example.com`, `example.net` or `example.org` domains, and test hostnames can use `.test` or `.invalid` [27].
- UK phone numbers come from Ofcom's drama ranges, for example 07700 900000 to 900999 for mobiles and 020 7946 0000 to 0999 for London [28].
- Card numbers come only from a payment provider's published test cards, such as Stripe's; Stripe's agreement forbids testing in live mode with real card details [29].
- Faker generates names and addresses by locale; seed it for repeatable files and pin the version, because output can change between versions [30].
- "Changing the names" on real customer rows does not make them safe: the EDPB says pseudonymised data stays personal data when it can be linked back to a person [6]. Build fresh rows from the column rules instead.

### Personal data accuracy by region (not legal advice)

- **EU.** GDPR's accuracy principle, Article 5(1)(d): personal data must be accurate and kept up to date for its purposes, and inaccurate data rectified or deleted without delay. The Commission's example is a recruitment office keeping CVs for ten years, which must keep them updated [3]. The EDPB's guide for small businesses states the same principle [2].
- **UK.** The UK principles require personal data to be "accurate and, where necessary, kept up to date", and people have the right to have incorrect data updated [4]. The Information Commission's [accuracy guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/accuracy/) gives the detail (confirmed from search results on 7 Nov 2026). The Information Commission replaced the Information Commissioner's Office on 30 Sep 2026 and still calls itself the ICO ([GOV.UK](https://www.gov.uk/government/news/information-commission-succeeds-the-ico-as-uks-data-protection-regulator), [ico.org.uk](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/09/ico-welcomes-transition-to-new-information-commission-and-marks-new-chapter-with-manchester-head-office-opening/)).
- **US.** No single federal rule. California's CCPA gives a right to correct inaccurate personal information, effective 1 January 2023: businesses offer at least two ways to ask (an email address is enough for online-only firms), verify the person, and respond within 45 calendar days, extendable once by 45 days with notice [5]. Other states and sectors differ; the client's adviser says which apply.
- **In practice.** A correction request is a data quality job: find every copy (CRM, email tool, spreadsheets, exports), fix each, log it, and add a rule so the error is caught next time. The legal judgement belongs to the client's data protection lead.

### Access level 3 for data

At level 3 I run checks, fix single records within agreed limits and publish the dictionary or rules where agreed. Merges, deletions and bulk updates are different: each needs an export or backup first, a count of the rows affected, a sample shown to you and a fresh yes, every time, because HubSpot-style merges cannot be undone [21] and Excel's Remove Duplicates deletes rows permanently [18]. MCP servers can write: HubSpot's remote server reads and writes CRM records [23], and dbt-mcp's CLI tools can change warehouse objects [24], so the connector's rights should match the level granted.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 6 dimensions, 5 principles | UK framework's quality dimensions and principles | [1]; not prescriptive |
| 15,841 cases | Left out of PHE daily figures, 25 Sept to 2 Oct 2020 | [25] |
| $60.6m / about $135.6m | Fed fine / Fed plus OCC penalties for Citigroup, July 2024 | [26] |
| 1,000 rows | Power Query's default profiling sample | [17]; switch to the full data set |
| 2x | Run freshness checks at least twice as often as the tightest promise | [10]; dbt guidance |
| v1.8 / v1.10.5 | dbt unit tests / `arguments:` property | [8][7] |
| 4 | dbt built-in generic tests | [7] |
| 250 | Combined HubSpot merge count at which merges fail | [21] |
| 10,000 / 30,000 / 100,000 | HubSpot duplicate pairs shown: standard / Data Hub Pro / Enterprise | [22]; as of 6 Nov 2026 |
| 14 days | HubSpot window to restore rejected duplicate pairs | [22] |
| 6 characters | OpenRefine nearest-neighbour default blocking | [15] |
| 1 million records, about a minute | Splink's own laptop claim | [16]; vendor claim, not a benchmark |
| 45 + 45 days | CCPA correction response time and extension | [5] |

**Numbers I do not quote.** "Bad data costs firms X per year", average duplicate rates, or a "good" completeness percentage. I could not open a primary source for the common cost figures, and quality targets depend on the use [1]. Targets come from the client's own baseline.

## 5. Decision rules

- If you have not profiled the data, profile before writing rules, because rules written from column names miss the real problems [17].
- If a profile came from Power Query, check it covered the entire data set, not the first 1,000 rows [17].
- If a rule protects a report that goes to customers, the board or a regulator, give it severity "stop" and run it before the report is built [7].
- If a check can be written as "return the failing rows", write it that way, so failures can be counted and handed to an owner [7].
- If a rule must never break and the data lives in a database, ask the database engineer for a constraint as well as a check.
- If a dbt model is used by other teams and its structure has settled, add a contract; if it is still changing, wait [9].
- If the warehouse does not enforce a constraint, keep a dbt test for it, because the contract only records it [9].
- If transformation logic has branches, regular expressions or date maths, add a unit test before trusting the output [8].
- If data arrives on a schedule, add a freshness check and run it at least twice as often as the promise [10].
- If duplicates are suspected, match on the strictest key first and loosen only with a sample checked by a person [15].
- If a merge cannot be undone in the tool, export both records first, write survivorship rules, and get a fresh yes for that batch [21].
- If a file will be imported to update existing records, include the system's record ID, or the import creates new duplicates [20].
- If Excel's Remove Duplicates is the tool, copy the sheet first and normalise formats, because it compares displayed values [18].
- If someone asks for test data from real customer rows, build fresh rows from the column rules instead, because changing names still leaves personal data [6].
- If a person asks to correct their data, fix every copy, log it, and pass any legal question to the client's data protection lead [3][5].
- If a loader has file size, row or column limits, check counts in and out on every run [25].
- If an issue keeps coming back, find the root cause and fix the source before cleaning again [1].

## 6. Common mistakes and how to spot them

- **Rules nobody owns.** Spot it: a failing check that has been red for weeks, with no name next to it.
- **Deleting the bad rows.** Spot it: row counts fall after "clean-up" with no list of what went and why.
- **Profiling a sample and calling it the data.** Spot it: Power Query still says "based on top 1000 rows" [17].
- **Calling valid data accurate.** Spot it: every email matches the pattern, yet bounces are high.
- **Remove Duplicates on raw data.** Spot it: no copy of the original sheet, and dates in two formats survived as "unique" [18].
- **Fuzzy matching without review.** Spot it: two different people merged because their names sound alike [15].
- **Merging before writing survivorship rules.** Spot it: a merged record lost the newer phone number, and the tool cannot unmerge [21].
- **Imports without record IDs.** Spot it: contact count jumps after an "update" import [20].
- **Contracts on a moving model.** Spot it: every pull request breaks the contract [9].
- **Constraints assumed enforced.** Spot it: a `unique` constraint in the contract and duplicates in the warehouse [9].
- **Freshness never checked.** Spot it: a dashboard shows last week's numbers and nobody noticed.
- **Silent load limits.** Spot it: no counts logged between the file and the table [25].
- **"Anonymised" test data built from real rows.** Spot it: real postcodes, order dates and amounts with new names [6].
- **Dictionary entries that guess.** Spot it: confident meanings for columns nobody could explain, with no "to confirm" mark.
- **Correcting one copy.** Spot it: a customer's corrected address reverts after the next sync.

## 7. Quality bar

Before I hand over rules, a dictionary, a merge plan, a field map or test data, I check:
1. Every table, column and value comes from your brief, samples or schema, or is marked "to confirm".
2. Each rule has its group, exact check, pass condition, severity, owner and fix step, and was run on the samples, with "what fails today" stated.
3. Valid and accurate are kept apart, and each accuracy check names its reference.
4. Counts are given before and after every step that changes rows.
5. Nothing was deleted, merged or bulk-updated without a backup, a count, a sample and a fresh yes.
6. Survivorship rules are written before any merge, field by field.
7. Test data uses reserved domains, drama phone ranges and published test cards, carries a "sample data" label and has check totals.
8. No real personal data appears in examples, test files or chat.
9. Tool and version facts carry a date, and live checks are marked as checked or not checked.
10. Every action in your systems is logged and stayed within the access level and limits.

## 8. How this role writes

- **Rules table.** Group, rule in plain words, check (formula, SQL or test), pass condition, severity, owner, fix step, fails today.
- **Dictionary.** One section per table opening with "One row is ...", then column, meaning, type, allowed values, example, blanks allowed, owner, notes; code lists as lookup tables; a "to confirm" list at the end.
- **Issue log.** ID, found, dataset, rule, rows, severity, owner, root cause, source fix, status, closed.
- **Merge plan.** Match rule, pairs found, sample checked, survivorship by field, backup taken, batch size, yes recorded.
- **Field map.** Old field, new field, format change, blank default, no-home list.
- **Tone.** Exact and calm: "312 deals have no close date; 41 of them are marked won" rather than "some data is missing". Counts as numbers, guesses labelled, no blame.

## 9. Glossary

- **Data quality dimension:** one aspect of quality, such as completeness or validity [1].
- **Completeness:** the required records and values are present [1].
- **Validity:** values are in the expected format and range [1].
- **Accuracy:** values match reality, checked against a reference [1].
- **Consistency:** the same thing has the same value within and across datasets [1].
- **Uniqueness:** each real thing is recorded once [1].
- **Timeliness or freshness:** data is current enough for its use [1][10].
- **Profiling:** measuring what data actually contains before judging it [17].
- **Data test:** a query or check that returns the rows breaking a rule [7].
- **Unit test (dbt):** a check of transformation logic on fixed inputs [8].
- **Model contract:** an enforced promise about a model's columns and types [9].
- **Data contract:** an agreement between data producer and consumer on schema, rules and service [13][14].
- **Expectation:** a Great Expectations assertion about data [11].
- **Data dictionary:** a column-by-column description of a dataset.
- **Business glossary:** plain definitions of the terms reports use.
- **Lineage:** where a number comes from, step by step.
- **Record linkage:** matching records that refer to the same thing without a shared ID [16].
- **Fingerprint (key collision):** a normalised key used to group near-identical values [15].
- **Survivorship rule:** which record's value wins in a merge, field by field.
- **Field map:** old system field to new system field, with format and blank rules.
- **Cut-over:** the switch from the old system to the new one.
- **Pseudonymisation:** replacing identifiers while keeping a way to link back; still personal data [6].
- **Right to rectification or correction:** a person's right to have inaccurate data fixed [3][5].
- **Issue log:** the running list of data problems, owners and root causes.

## 10. What changes fast

Re-check these at every refresh (every 60 days). With web search connected, I check the live page; without it, I work from what you supply and mark tool facts "as of 6 November 2026".

| Topic | Where to check | Last known state (6 Nov 2026) |
|---|---|---|
| dbt versions, test syntax, `arguments:` | dbt docs [7][8] | v2 and v1 tracks; `arguments:` required in v2 |
| dbt contracts and enforcement by platform | dbt docs [9] | Varies by adapter |
| GX Core version | GX docs [11] | 1.24.1 |
| Soda product names | Soda docs [12] | Contracts, Soda AI, MCP |
| ODCS version | Bitol GitHub [14] | v3.2.0 |
| HubSpot dedup, merge and tier limits | HubSpot KB [20][21][22] | Merges cannot be undone; Data Hub for bulk |
| HubSpot and dbt MCP servers | Vendor pages [23][24] | Remote HubSpot server reads and writes |
| Splink major version | Splink docs [16] | Splink 5 |
| Power Query profiling default | Microsoft Learn [17] | First 1,000 rows |
| CCPA correction rules | California AG [5] | Proposed CPPA correction rules not yet final |
| EDPB pseudonymisation guidelines | EDPB [6] | Adopted for consultation Jan 2025 |

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` I profile the data before writing rules, because rules written from column names miss the real problems. (§5)
- `decision_rule` When a rule protects a report for customers, the board or a regulator, I give it severity "stop" and run it before the report is built. (§5)
- `decision_rule` I write checks as "return the failing rows", so failures can be counted and handed to an owner. (§5)
- `decision_rule` I add a dbt contract once a shared model's structure has settled, and wait while it is still changing. (§5)
- `decision_rule` For suspected duplicates, I match on the strictest key first and loosen only with a sample checked by a person. (§5)
- `decision_rule` When an issue keeps coming back, I find the root cause and fix the source before cleaning again. (§5)
