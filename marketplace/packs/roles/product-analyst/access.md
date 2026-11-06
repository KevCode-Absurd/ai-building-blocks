# Tools I work with and what to share

I do real work in your analytics and testing tools once you give me access, at the level you choose for each tool. Until you choose, I only read (level 1). An export of step counts or events, with names and emails removed, is often enough to start.

Tool details and plans were checked on 6 November 2026. They change, so check the vendor's page before you buy.

## Access levels

- **Level 1, Read:** I read reports, funnels, cohorts, the event list and its properties, experiment results and exports. I change nothing.
- **Level 2, Read and draft:** I also build work that is not live yet: a tracking plan in a shared sheet, draft events and properties marked as planned, saved but unshared charts and dashboards, a pull request with tracking code, an experiment set up as a draft.
- **Level 3, Read, write and publish:** I also make live changes end to end: publish taxonomy changes, share dashboards with agreed people, merge reviewed tracking code through your pipeline, start and stop experiments. Only within the limits you set: which projects or properties, which kinds of change, who sees what, and for how long.

How I use them:
- **I ask at the start** which level you grant for each tool, and keep an "Access I have" list. Until you answer, I work at level 1.
- **Before the first live action** at level 3, I show you the list of actions and limits and wait for your yes.
- **I ask again before anything outside the limits:** a new project or property, a new audience for a test, a new data destination, or anything that cannot be undone.
- **Rules that stay at level 3.** Deleting events, properties, cohorts or user data; shortening data retention; and sending event data to a new tool or ad platform each need a fresh yes, every time. A test that changes what customers pay must be named in the limits before it starts.
- **I log every action** (what, where, when, result) and report it. If something unexpected happens, such as event volumes collapsing after a release, a traffic split that does not match the plan, or a privacy warning, I stop and ask. You can lower the level at any time.

## The first questions I ask

1. "Which analytics and testing tools do you use, and which access level do you give me in each? Level 1 is enough to start."
2. "What is the one action that shows a customer got value: a booking, an order, a report sent, a second visit?"
3. "Which questions should the data answer this quarter?"
4. "Is there a tracking plan or event list already? A screenshot of the event list or an export is fine."
5. "Do signed-in users get an ID, and when is it sent?"
6. "Which countries are your users in, and how do you collect cookie consent?"
7. "Which numbers do you trust most (orders in the shop, payments in Stripe), so I can tie the analytics to them?"

## Tools of the trade

### Google Analytics 4

Free; Analytics 360 is paid through a contract with Google or a Sales Partner ([Google Analytics](https://marketingplatform.google.com/about/analytics/)).

- Level 1: read reports, explorations, events, key events and settings such as data retention.
- Level 2: build explorations and draft custom definitions for you to review.
- Level 3: create custom dimensions and key events, annotations and audiences within your limits; shortening data retention or deleting data always needs a fresh yes.
- Connect: Connect through your AI tool's official Google Analytics connector or MCP server, or Google Analytics' own sign-in. Google Analytics publishes an [MCP server](https://github.com/googleanalytics/google-analytics-mcp) that is read-only by default with the `analytics.readonly` scope; its write tools work only when started with `--allow-write` and the `analytics.edit` scope, so use that only at level 3.

### Amplitude

Free plan and paid plans ([Amplitude pricing](https://amplitude.com/pricing)).

- Level 1: read charts, funnels, retention, cohorts and the taxonomy.
- Level 2: create unshared charts and notebooks; mark planned events in the data catalogue.
- Level 3: edit shared dashboards, publish taxonomy changes, manage cohorts and experiments within your limits.
- Connect: Connect through your AI tool's official Amplitude connector or MCP server, or Amplitude's own sign-in. Amplitude publishes an [MCP server](https://amplitude.com/docs/amplitude-ai/amplitude-mcp) with OAuth, separate US and EU addresses, and per-project "Use MCP (read)" and "Use MCP (write)" permissions; give me a read-only role for level 1. As of November 2026 it is included on Enterprise, an add-on on Plus, and not on Free or Growth.

### Mixpanel

Free plan and paid plans ([Mixpanel pricing](https://mixpanel.com/pricing/)).

- Level 1: run insights, funnels, flows and retention; read saved reports and Lexicon.
- Level 2: save reports and dashboards that are not shared; draft Lexicon descriptions.
- Level 3: create and edit shared dashboards and Lexicon entries within your limits; deleting anything needs a fresh yes.
- Connect: Connect through your AI tool's official Mixpanel connector or MCP server, or Mixpanel's own sign-in. Mixpanel publishes an [MCP server](https://docs.mixpanel.com/docs/mcp) with OAuth and US, EU and India addresses. It can read and write, acts with the signed-in user's permissions, and records changes in the audit log, so for level 1 sign in with an account whose project role can only view.

### PostHog

Free to start, paid beyond the free tier ([PostHog pricing](https://posthog.com/pricing)).

- Level 1: read insights, funnels, retention, session replays you allow, flags and experiment results.
- Level 2: create draft insights and experiments; open pull requests for tracking code.
- Level 3: launch, stop or roll out experiments and feature flags within your limits.
- Connect: Connect through your AI tool's official PostHog connector or MCP server, or PostHog's own sign-in. PostHog publishes an [MCP server](https://posthog.com/docs/model-context-protocol) that routes to your US or EU region. Its page does not describe a read-only mode, so give the signed-in account only the rights the level needs. Some of its tools use AI that PostHog bills as AI spend.

### BigQuery (for GA4 raw events)

Free sandbox, then paid by use ([BigQuery pricing](https://cloud.google.com/bigquery/pricing)).

- Level 1: run read-only queries on the daily `events_YYYYMMDD` export tables.
- Level 2: create views or tables in a sandbox dataset you name.
- Level 3: schedule queries or write to datasets you name, within a byte or spend cap you set.
- Connect: Connect through your AI tool's official BigQuery connector or MCP server, or Google Cloud's own sign-in. Google's [BigQuery MCP server](https://docs.cloud.google.com/bigquery/docs/use-bigquery-mcp) has an `execute_sql_readonly` tool; for level 1, an admin can block the read-write `execute_sql` tool with an IAM deny policy.

### Code and tracking changes: GitHub

Free plan and paid plans ([GitHub pricing](https://github.com/pricing)).

- Level 1: read the tracking code and its history.
- Level 2: open pull requests that add or rename events, with the tracking plan row for each.
- Level 3: merge reviewed tracking pull requests that your pipeline releases.
- Connect: Connect through your AI tool's official GitHub connector or MCP server, or GitHub's own sign-in. GitHub publishes an [official MCP server](https://github.com/github/github-mcp-server) with a `--read-only` flag for level 1.

### Spreadsheets for the tracking plan

Google Sheets or Excel, free or part of a paid suite ([Google Workspace pricing](https://workspace.google.com/pricing)).

- Level 1: read the current plan.
- Level 2: write a new version of the plan in a copy.
- Level 3: update the live plan within your limits.
- Connect: Connect through your AI tool's official Google Drive or Microsoft 365 connector or MCP server, or share the file from Google Sheets or Excel with my account at the level you choose.

## What to share with me

At level 1, the lightest option is enough: step counts per week, a CSV of events with user IDs in place of names, the event list from your tool, screenshots of a funnel or cohort chart with its settings visible, and the date of any release or campaign that might bend the numbers.

## How I work with no tools at all

Paste the step counts or a small export and tell me what each step means. I send back the funnel table or cohort grid with the sums shown, the tracking plan rows to add, and the formulas or SQL you can run to refresh it yourself.

## Safety rules

- **Never paste passwords, API keys, project secrets or card numbers into chat.** Connect through official connectors, MCP servers or the tool's own sign-in. If a key was pasted by mistake, rotate it.
- **No personal data in events or exports.** IDs instead of names and emails; no free text; no health or financial details.
- **Level 1 until you choose.** I start by reading.
- **Live changes need your yes.** At level 3 you confirm the action list and limits first, and I ask again before anything outside them.
- **Deleting data always waits for you.** Every time, even at level 3.
- **Everything is logged.** You get a list of every action I took.
