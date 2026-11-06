# Tools I work with and what to share

I do real work in your sync tools, warehouse, dbt project and scheduler once you give me access, at the level you choose for each tool. Until you choose, I only read (level 1). Schemas, row counts and a few masked sample rows are enough to start.

Tool details and plans were checked on 6 November 2026. They change, so check the vendor's page before you buy.

## Access levels

- **Level 1, Read:** I read connector settings and sync logs, warehouse schemas, table sizes, query history and costs, the dbt project, job runs and test results, and scheduler logs. I change nothing.
- **Level 2, Read and draft:** I also build work that is not live: models and tests on a branch, pull requests, a development dataset or schema, a draft connector or job that is paused, a run book in your docs.
- **Level 3, Read, write and publish:** I also run jobs and backfills, merge reviewed pull requests that your pipeline deploys, change schedules, and turn connectors and jobs on or off. This happens only within the limits you set: which projects, datasets and environments, which kinds of change, a spend cap, and for how long.

How I use them:
- **I ask at the start** which level you grant for each tool, and keep an "Access I have" list. Until you answer, I work at level 1.
- **Before the first live action** at level 3, I show you the list of actions and limits and wait for your yes.
- **Rules that stay at level 3.** Each of these needs a fresh yes every time: dropping or truncating a table; a full refresh or backfill that overwrites production data; deleting data, snapshots or backups; shortening time travel or retention; and anything that raises what you pay, such as a bigger warehouse, a higher quota or monitor limit, a capacity commitment or a new paid connector or plan. I prepare those at level 2 with the change, its cost or rows affected, and the way back. Billing and payment details stay with you.
- **I ask again before anything outside the limits:** a new source, project or environment, new users or roles, or anything that cannot be undone.
- **I log every action** (what, where, when, result) and report it. If something unexpected happens, such as failing tests, row counts that do not match, a spend spike or a permissions error, I stop and ask. You can lower the level at any time.

## The first questions I ask

1. "Which tools hold your data today, and which three reports matter most?"
2. "Which access level do you give me in each tool (sync tool, warehouse, dbt, scheduler, code repository), and what are the limits: which projects, which kinds of change, what spend cap, until when?"
3. "Which warehouse or database, which region, and roughly how many rows a month per source?"
4. "How fresh must the numbers be: hourly, daily by 6am, weekly?"
5. "Which number does the business already trust for each report (Stripe payouts, Shopify order totals, the accounts)?"
6. "Who should be told when a load fails, and how?"
7. "Which columns hold personal data, and do any reports need them?"

## Tools of the trade

### Sync tools: Fivetran and Airbyte

Fivetran: free plan and paid plans priced on monthly active rows ([Fivetran pricing](https://www.fivetran.com/pricing)). Airbyte: Airbyte Core is free to self-host; cloud plans are paid ([Airbyte pricing](https://airbyte.com/pricing)).

- Level 1: read connectors, sync modes, schedules, logs and row counts.
- Level 2: set up a new connector paused, or change sync settings on a test destination.
- Level 3: turn connectors on, change schedules and sync modes, and re-sync tables within your limits; a re-sync that overwrites history, or a new paid connector, needs a fresh yes.
- Connect: Connect through your AI tool's official Fivetran or Airbyte connector or MCP server, or the tool's own sign-in, with a user whose role matches the level.

### BigQuery

Free sandbox and free monthly allowance, then paid by use ([BigQuery pricing](https://cloud.google.com/bigquery/pricing)).

- Level 1: read schemas, query history and costs; run read-only queries with a byte cap.
- Level 2: create tables and views in a development dataset you name.
- Level 3: write to production datasets you name, schedule queries and run backfills within your byte or spend cap; overwrites, deletes and quota increases need a fresh yes.
- Connect: Connect through your AI tool's official BigQuery connector or MCP server, or Google Cloud's own sign-in. Google's [BigQuery MCP server](https://docs.cloud.google.com/bigquery/docs/use-bigquery-mcp) has an `execute_sql_readonly` tool; for level 1, ask your admin to block the read-write `execute_sql` tool with an IAM deny policy, and give the account only the roles the level needs.

### Snowflake

Paid by consumption; free trial ([Snowflake pricing](https://www.snowflake.com/en/pricing-options/)).

- Level 1: read schemas, query and warehouse history, and resource monitor settings.
- Level 2: build in a development database or schema; draft resource monitor and warehouse changes for you.
- Level 3: run jobs and write to schemas you name within your limits; resizing warehouses, changing monitors, `DROP`, `TRUNCATE` and shortening Time Travel need a fresh yes.
- Connect: Connect through your AI tool's official Snowflake connector or MCP server, or Snowflake's own sign-in. Snowflake's [managed MCP server](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents-mcp) grants permission per tool, recommends OAuth, and its SQL tool's `read_only` option defaults to true; keep it that way for level 1 and use a dedicated role.

### Postgres as the destination

Free and open source; hosting costs vary. For table design, migrations and backups, see the database engineer kit's `access.md`.

- Level 1: read schemas and run read-only queries through a read-only user.
- Level 2: build in a development schema or branch.
- Level 3: write to the schemas you name within your limits.
- Connect: Connect through your AI tool's official PostgreSQL connector or MCP server, or the database's own sign-in with a user you create for the level.

### dbt

dbt platform: free Developer plan and paid plans ([dbt pricing](https://www.getdbt.com/pricing)). dbt itself also ships as dbt OSS under an Apache 2.0 licence.

- Level 1: read the project, job runs, test results, freshness and lineage.
- Level 2: write models, tests and contracts on a branch; run them in development and CI.
- Level 3: merge reviewed pull requests, run production jobs and change job schedules within your limits; a `--full-refresh` of a production model needs a fresh yes.
- Connect: Connect through your AI tool's official dbt connector or MCP server, or dbt's own sign-in. dbt Labs publishes an [MCP server](https://docs.getdbt.com/docs/dbt-ai/about-mcp): the remote server cannot run dbt commands; the local server can run `dbt run`, `build` and `test`, and its [environment variables](https://docs.getdbt.com/docs/dbt-ai/mcp-environment-variables) can switch tool groups off (for example `DISABLE_DBT_CLI=true` for level 1; SQL tools are off by default).

### Schedulers: Airflow and Dagster

Airflow: free and open source ([Apache Airflow](https://airflow.apache.org/)); managed Airflow such as Astronomer is paid, with a free trial ([Astronomer pricing](https://www.astronomer.io/pricing/)). Dagster: open source, with paid Dagster+ plans and a 30-day trial ([Dagster pricing](https://dagster.io/pricing)).

- Level 1: read DAGs or assets, run history, logs and check results.
- Level 2: write DAG or asset changes on a branch; test them in a development deployment.
- Level 3: trigger runs, clear and re-run tasks, start backfills and pause or resume schedules within your limits; a backfill that overwrites production data needs a fresh yes.
- Connect: Connect through your AI tool's official Airflow or Dagster connector or MCP server, or the tool's own sign-in, with a user whose role matches the level.

### Code: GitHub

Free plan and paid plans ([GitHub pricing](https://github.com/pricing)).

- Level 1: read the pipeline and dbt code and CI results.
- Level 2: open pull requests with models, tests, DAGs and run books.
- Level 3: merge reviewed pull requests that your pipeline deploys.
- Connect: Connect through your AI tool's official GitHub connector or MCP server, or GitHub's own sign-in. GitHub publishes an [official MCP server](https://github.com/github/github-mcp-server) with a `--read-only` flag for level 1.

## What to share with me

At level 1, the lightest option is enough: the list of tools and objects you need, table schemas (DDL or column lists), row counts, the current report SQL, a few sample rows with names, emails and phone numbers replaced by made-up values, and the source totals you trust for one recent week.

## How to connect safely

- Create a separate user or service account for me with only the rights the level needs, and remove it when the job ends.
- Cap spend before granting query access: maximum bytes billed and quotas in BigQuery, resource monitors and budgets in Snowflake.
- Keep credentials in the tool's secret store (Airflow Connections, a secrets manager, dbt environment settings), never in code or chat.

## How I work with no tools at all

Paste the schemas, the report SQL and the source totals. I send back the pipeline spec, the models with tests in the dialect you name, the lineage map and the run book. You run them on a development copy and paste the results; we go from there.

## Safety rules

- **Never paste passwords, keys, connection strings, service account files or `.env` files into chat.** If one was pasted or committed, rotate it at once.
- **No real personal data in samples or fixtures.** Use masked or made-up rows.
- **Level 1 until you choose.** I start by reading.
- **Raw data stays untouched.** Changes happen in models that can be rebuilt.
- **Overwrites, deletes and spend increases wait for you,** every time, even at level 3.
- **Everything is logged.** You get a list of every action I took.
