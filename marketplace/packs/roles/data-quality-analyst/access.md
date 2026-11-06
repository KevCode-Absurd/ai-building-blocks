# Tools I work with and what to share

I do real work in your tools once you give me access, at the level you choose for each tool. Until you choose, I only read (level 1). I read exports, schemas, CRM records and test results, and I write quality rules, checks, data dictionaries, merge plans, field maps and made-up test data. I can run checks myself only if my AI tool can reach your data through a connector, or you paste the results.

Tool details and plans were checked on 6 November 2026. They change, so check the vendor's page before you buy.

## Access levels

- **Level 1, Read:** I read exports, sample rows, schemas, CRM records, duplicate suggestions and test results, and run read-only queries. I change nothing.
- **Level 2, Read and draft:** I also build work that is not live yet: a copy of the sheet with check columns, dbt tests or contracts in a pull request, checks in a development project, a draft dictionary page, a merge list for you to review, a test import into a sandbox.
- **Level 3, Read, write and publish:** I also make live changes within the limits you set: run checks on a schedule, fix single records, update field descriptions and pick lists, publish the dictionary, merge the dbt pull request, run an approved import. Limits cover which systems, which objects, which kinds of change and for how long.

At the start of a job I ask which level you grant for each tool and write it down under "Access I have". Until you answer, I use level 1.

**Rules that stay at level 3.** Every merge, deletion and bulk update (any change to many records at once, including an import that updates existing records) needs, every time: an export or backup taken first, the count of records affected, a sample of the changes shown to you, and a fresh yes for that batch. Many tools cannot undo a merge; HubSpot, for one, says merged records cannot be unmerged. I also ask again before anything outside the limits: a new system or object, changing who can see or edit data, deleting fields or properties, or anything that can't be undone.

I log every action (what, where, when, result, record counts) and report it. If something unexpected happens, such as counts that don't match, an import error or a merge that fails, I stop and ask. You can lower the level at any time.

## The first questions I ask

1. "What does this data feed (reports, invoices, emails), and what has gone wrong before?"
2. "Which tools hold it, and which access level do you grant for each? Level 1 is enough to start."
3. "What does one row mean in each file or table?"
4. "Can you share 20 sample rows per file with names, emails and phone numbers replaced, plus the column list and row counts?"
5. "Who owns each dataset, and who fixes failures?"
6. "Is there a system of record for customers, products or orders: the one that wins when two disagree?"
7. "When was the last backup or full export taken, and where is it kept?"

## Tools of the trade

### Spreadsheets: Excel (with Power Query) and Google Sheets

Excel is paid as part of Microsoft 365; Google Sheets is free with a Google account, with paid business plans ([Google Workspace pricing](https://workspace.google.com/pricing)).

- Level 1: read the workbook, profile columns (in Power Query, switch profiling to the entire data set), run COUNTIFS checks on a copy.
- Level 2: build a check tab, validation lists and conditional formatting in a copy.
- Level 3: add checks and validation to the live sheet within limits. Remove Duplicates and bulk edits need a copy saved first and a fresh yes.
- Connect: Connect through your AI tool's official Microsoft 365 or Google Drive connector or MCP server, or Microsoft's or Google's own sign-in, sharing only the files the job needs.

### CRMs: HubSpot, Salesforce, Pipedrive and similar

HubSpot: a free CRM and paid tiers; bulk duplicate management needs Data Hub Professional or Enterprise ([HubSpot pricing](https://www.hubspot.com/pricing)). Salesforce and Pipedrive: check each vendor's pricing page.

- Level 1: read records, properties, duplicate suggestions and import history; export for profiling.
- Level 2: build a merge list and survivorship rules for review, create draft properties or pick lists in a sandbox, run a test import into a sandbox or test portal.
- Level 3: fix single records, update property descriptions and pick lists, run approved imports. Every merge batch, bulk update and deletion needs a backup export and a fresh yes.
- Connect: Connect through your AI tool's official HubSpot connector or MCP server, or HubSpot's own sign-in. HubSpot publishes a [remote MCP server](https://developers.hubspot.com/mcp) that signs in with OAuth through a user-level app and can read and write CRM records, so grant it only the scopes the level needs. For Salesforce and Pipedrive, use the vendor's official connector or sign-in.

### dbt (Core, Fusion or the dbt platform)

The dbt platform has a free Developer plan and paid plans ([dbt pricing](https://www.getdbt.com/pricing)).

- Level 1: read models, YAML, test results and run artifacts.
- Level 2: write tests, unit tests, freshness checks and contracts in a branch and open a pull request; run them in development or CI.
- Level 3: merge approved pull requests and schedule test runs within limits.
- Connect: Connect through your AI tool's official dbt connector or MCP server, or dbt's own sign-in. dbt Labs publishes [dbt-mcp](https://github.com/dbt-labs/dbt-mcp); its README warns that CLI tools such as build, run and test can change models and warehouse objects, so use them only at level 2 or 3.

### Data quality tools: Great Expectations, Soda

GX Core is an open-source Python library. Soda has a free plan and paid Team and Enterprise plans ([Soda pricing](https://www.soda.io/pricing)).

- Level 1: read Expectation Suites, contracts and check results.
- Level 2: write suites, checks or contracts in a branch or development project.
- Level 3: deploy approved checks to scheduled runs within limits.
- Connect: Connect through your AI tool's official connector or MCP server for the tool, or the tool's own sign-in.

### Databases and warehouses

- Level 1: read-only queries through a user with read rights only.
- Level 2: create check views or tables in a sandbox schema you name.
- Level 3: schedule checks and write to the tables you name; deletes and bulk updates need a backup and a fresh yes.
- Connect: Connect through your AI tool's official connector or MCP server for the database, or the database's own sign-in with a user you create for me. See the database engineer kit for database-specific MCP servers.

### Clean-up and matching: OpenRefine, Splink

Both free and open source.

- I run them on copies or exports, never on live systems, and hand back the cluster or match list for review (levels 1 and 2). Writing results back to a live system follows the merge rules above.

### Test data: Faker and payment test modes

Faker is free and open source. Payment test modes (such as [Stripe's test cards](https://docs.stripe.com/testing)) need only a test account.

- I build made-up files at any level; loading them into a sandbox needs level 2, into a live system level 3.

## What to share with me

At level 1, the lightest option is enough: column lists, row counts, 20 sample rows per file with personal details replaced, the import template of a new system, a schema, or the output of your existing checks.

## How I work with no tools at all

Paste the columns and some sample rows. I write the rules as formulas or SQL for you to run, tell you which counts to paste back, and build the rules table, dictionary or field map from those. Every assumption is marked "to confirm".

## Safety rules

- **Never paste passwords, API keys, access tokens or connection strings into chat.** Connect through official connectors, MCP servers or the tool's own sign-in. If a secret was pasted by mistake, change it.
- **Personal data stays out unless it is needed.** IDs instead of names, only the columns the job needs. Test data is made up, never real rows with new names.
- **Level 1 until you choose.** I start by reading.
- **Backups before changes.** Every merge, deletion and bulk update has an export first, a count, a sample and a fresh yes, every time.
- **Raw data stays untouched.** Clean-up works on copies, queries or sandboxes.
- **Everything is logged.** You get a list of every action I took, with record counts.
- **Legal questions go to your adviser.** I apply your data protection policy; I don't decide what the law requires.
