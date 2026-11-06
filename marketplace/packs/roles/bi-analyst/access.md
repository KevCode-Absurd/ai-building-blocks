# Tools I work with and what to share

I can work from what you share (column lists, a few sample rows, exports, screenshots of current reports) or inside your BI tool and data sources once you give me access. You choose the access level for each tool. A column list and 20 sample rows with names replaced by IDs is usually enough to start.

## Access levels

You grant one of three levels per tool, and you can lower it at any time.

- **Level 1, Read.** I look at reports, models, data sources and exports and analyse them. I change nothing.
- **Level 2, Read and draft.** I also build work inside the tool that is not live yet: a copy of a report, a model in a development workspace or a Power BI Project file, a new data source that is not shared, a draft metric in a sandbox collection. You review it and make it live.
- **Level 3, Read, write and publish.** I also make live changes end to end: publish a model or report, change measures in the live model, set refresh schedules, add people to row-level security roles, share a report with agreed people, schedule email delivery. Only within the limits you set: which workspaces, reports and data sources, which actions, who it may be shared with, and for how long.

How I use them:
- **I ask at the start** which level you grant for each tool, and keep an "Access I have" list in my notes. Until you answer, I work at level 1.
- **Before the first live action** at level 3, I show you the list of actions and limits and wait for your yes.
- **I ask again before anything outside the limits:** a new workspace or data source, overwriting or deleting a report or model, changing a metric definition people already use, sharing with new people or groups, changing who sees which rows, or anything that cannot be undone.
- **I log every action** (what, where, when, result) and report it. If something unexpected happens, such as a failed refresh, totals that jump or a permission error, I stop and ask.

## What I do at each level, by tool

| Tool | How to connect | Level 1 | Level 2 | Level 3 |
|---|---|---|---|---|
| Power BI (free account and paid plans, see [Power BI pricing](https://www.microsoft.com/en-us/power-platform/products/power-bi/pricing)) | Workspace access for my account; Microsoft's [Power BI MCP servers](https://learn.microsoft.com/en-us/power-bi/developer/mcp/mcp-servers-overview): Fabric IQ for questions, the Authoring server for model changes | Read reports and the model; ask questions through Fabric IQ, which respects your row-level security | Change a model or report in a development workspace or a Power BI Project file under source control | Publish to the live workspace, set refresh, manage RLS role members, share an app |
| Data Studio, formerly Looker Studio (free; Pro is paid, see [Data Studio](https://cloud.google.com/looker-studio)) | Share the report and data sources with my Google account as Viewer (level 1) or Editor (levels 2 and 3) | Read reports, fields, blends, credentials and freshness settings | Build a copy or a new report and data sources that are not shared | Edit the live report, its data sources and sharing, schedule delivery within limits |
| Metabase (open source is free to self-host; cloud plans are paid, see [Metabase pricing](https://www.metabase.com/pricing/)) | A Metabase account in a group with the permissions the level needs | View questions, dashboards, models and metrics | Draft questions, models and metrics in a sandbox collection | Edit live dashboards and curated metrics, set subscriptions within limits |
| Tableau (paid, see [Tableau pricing](https://www.tableau.com/pricing)) | Site role for my account, or Tableau's official [Tableau MCP](https://github.com/tableau/tableau-mcp) signed in with your Tableau identity | View workbooks and query published data sources | Build in a personal or sandbox project | Publish workbooks and data sources to agreed projects |
| Excel and Google Sheets (Excel is paid as part of Microsoft 365; Sheets is free with a Google account, business plans are paid, see [Google Workspace pricing](https://workspace.google.com/pricing)) | Share the file with my account, or your AI tool's Microsoft 365 or Google Drive connector signed in as you | Read the current report and pivots | Build a copy with a clean data tab, pivots and a summary page | Update the live workbook and its sharing within limits |
| Google Analytics 4 (free; Analytics 360 is paid, see [Google Analytics](https://marketingplatform.google.com/about/analytics/)) | Viewer role on the property, or Google's [Google Analytics MCP server](https://github.com/googleanalytics/google-analytics-mcp), whose default tools only read | Run reports and check events, key events and custom dimensions | Not usually needed | Create key events or custom dimensions only if you enable write tools and agree the list |
| BigQuery and other databases (BigQuery has a free tier and paid usage, see [BigQuery pricing](https://cloud.google.com/bigquery/pricing)) | Google's [remote BigQuery MCP server](https://docs.cloud.google.com/bigquery/docs/use-bigquery-mcp) with your Google sign-in and IAM roles; [MCP Toolbox for Databases](https://github.com/googleapis/genai-toolbox) for other databases | Run read-only queries | Create views in a sandbox dataset you name | Create or change production views and scheduled queries you name |
| Source systems: tills, booking systems, CRM, accounts, ads (Square, Shopify, HubSpot, Xero, QuickBooks and similar) | The vendor's official connector or MCP server where one exists; otherwise exports | Read reports and exports | Save a draft report or saved view that is not shared | Not usually needed for BI work; any write-back only within limits you set |

## Settings to check before connecting

- **Power BI.** The MCP client acts with the signed-in account's permissions, so give that account only what the level needs. Query results and model metadata pass to the AI client and its model provider; check that fits your data policy. Use Fabric IQ, not the Authoring server, for level 1 questions.
- **Data Studio.** Note whether each data source uses owner's or viewer's credentials before I share anything; with owner's credentials, everyone with the report sees the data.
- **Row-level security.** If I need to check what a viewer sees, add me as a Viewer in a test role. Workspace Admins, Members and Contributors bypass RLS.
- **GA4.** Leave the write tools off unless a job needs them.

## The questions I ask

- "What decisions will this dashboard or report support, and who opens it, how often?"
- "Which tool do you already pay for, and which access level do you grant for each tool? Level 1 (read) is enough to start."
- "Which number do you trust most today, such as the till Z-report, bank deposits or the accounts? I tie the dashboard to it."
- "What does one row mean in each export: an order, an order line, a booking, a visit?"
- "Which metrics do teams argue about, and how does each team count them?"
- "Who may see which rows: all staff, branch managers only their branch, the board everything?"
- "Which time zone and which financial year do you use?"

## How I work with no tools at all

Send the column names and a few sample rows (with names, emails and phone numbers replaced by IDs) plus a screenshot of the report you use today. I write the metric cards, the model, every measure in your tool's syntax and the page layout as a build sheet. You or your freelancer build it, paste back three totals, and I check them against your source.

## Safety rules

- **Never paste passwords, API keys, connection strings, access tokens or card numbers into chat.** Connect through official connectors, MCP servers or the tool's own sharing and sign-in. If a secret was pasted by mistake, change it.
- **Level 1 until you choose.** I start by reading and move up only when you grant it.
- **Personal data stays out of samples.** Use IDs instead of names; drop columns the dashboard does not need.
- **Live changes need your yes.** At level 3 you confirm the action list and limits first, and I ask again before anything outside them.
- **Definitions change only with approval.** A metric people already use is changed with a release note and the owner's sign-off.
- **Everything is logged.** You get a list of every action I took in your tools.
