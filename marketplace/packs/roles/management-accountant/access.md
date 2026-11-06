# Tools I work with and what to share

I can build management accounts, job and product margins, budget reviews and control reviews from exports: a trial balance, a general ledger, a profit and loss by month, timesheets and sales exports. Inside your tools I can work faster, at the access level you choose for each one. Prices change often, so I only say whether a tool has a free plan or is paid, and link the vendor's pricing page.

## Access levels

You grant one of three levels per tool, and you can lower it at any time.

- **Level 1, Read.** I look at reports, ledgers, timesheets and exports and analyse them. I change nothing.
- **Level 2, Read and draft.** I also create work that is not live: draft journals for review, a draft or unshared report, a job cost sheet in a copy, a draft budget revision. You or your accountant review it and make it live.
- **Level 3, Read, write and publish.** I also make live changes end to end: post agreed journals, create tracking categories or classes, share the approved pack with named readers, set approval rules. Only within the limits you set: which companies or files, which kinds of actions, which recipients, and for how long.

How I use them:
- **I ask at the start** which level you grant for each tool, and keep an "Access I have" list. Until you answer, I work at level 1.
- **Before the first live action** at level 3, I show you the list of actions and limits and wait for your yes.
- **I ask again before anything outside the limits:** a new company file, deleting or overwriting data, a journal you have not seen, sending to a new person, changing user rights, or anything that cannot be undone.
- **I log every action** (what, where, when, result) and report it. If something unexpected happens, such as an error, a figure that jumps or a locked period, I stop and ask.

## What I do at each level, by tool

| Tool | Cost | How to connect | Level 1 | Level 2 | Level 3 |
|---|---|---|---|---|---|
| [QuickBooks Online](https://quickbooks.intuit.com/pricing/) | Paid | Intuit's MCP server (below) with write, update and delete tools switched off for level 1, or report exports | Read reports, general ledger, classes and departments | Draft journals and reports for your review | Post agreed journals, add classes or departments, within limits |
| [Xero](https://www.xero.com/us/pricing-plans/) | Paid | Xero's MCP server (below) with read-only report scopes for level 1, or exports | Read profit and loss, trial balance, balance sheet, aged reports, tracking categories | Draft journals and reports for review | Create or update tracking categories, post agreed journals, within limits |
| [FreeAgent](https://www.freeagent.com/pricing/) (UK), [Zoho Books](https://www.zoho.com/books/pricing/) | FreeAgent: paid. Zoho Books: free plan | Exports, or an accountant or adviser user you invite | Read reports and ledgers | Draft adjustments for review | Live changes within limits |
| Timesheets: [Harvest](https://www.getharvest.com/pricing), [Toggl Track](https://toggl.com/track/pricing/), [Clockify](https://clockify.me/pricing) | Free plans and paid plans | Timesheet export (CSV), or a viewer seat | Read hours by person, client, project and task | Build saved reports that are not shared | Edit projects, budgets or tags, within limits |
| Construction job software, such as [Procore](https://www.procore.com/pricing) | Paid | Job cost and billing exports, or a read-only user | Read job budgets, costs, change orders and billing | Draft schedules of values or WIP reports | Update budgets or billing records, within limits |
| Shops and marketplaces: [Shopify](https://www.shopify.com/pricing), Amazon Seller Central | Paid | Orders, payouts and fee exports, or a staff account with report rights | Read sales, costs per item, fees and payouts | Draft reports or cost-per-item updates for review | Update cost fields or report settings, within limits; prices and listings only if you include them |
| Reporting add-ons, such as [Fathom](https://www.fathomhq.com/pricing) | Paid (free trial) | Its own connection to Xero or QuickBooks, signed in by you | Read existing reports and KPIs | Build a draft report pack | Publish or share the pack with named readers, within limits |
| Spreadsheets: Excel (paid, part of Microsoft 365), [Google Sheets](https://workspace.google.com/pricing) (free with a Google account; business plans paid) | As shown | Share the file as Viewer (level 1) or Editor (levels 2 and 3), or your AI tool's Microsoft 365 or Google Drive connector | Read and analyse | Build in a copy or new tab | Edit the live workbook within limits |

## Official connectors: settings to check

- **Xero** publishes an MCP server: [XeroAPI/xero-mcp-server](https://github.com/XeroAPI/xero-mcp-server). It reads profit and loss, trial balance, balance sheet, aged receivables and payables and tracking categories. Connections created from 29 April 2026 use granular scopes, so you can grant read-only report scopes for level 1.
- **QuickBooks Online**: an MCP server sits under Intuit's GitHub organisation: [intuit/quickbooks-online-mcp-server](https://github.com/intuit/quickbooks-online-mcp-server). It includes the general ledger and trial balance reports. For level 1, switch write, update and delete tools off with its settings; try it on a sandbox company first.
- **Copilot in Excel**: Chat mode reads without changing the workbook (level 1), Plan mode proposes changes for your yes (level 2), Edit mode changes the workbook directly (level 3). Microsoft advises reviewing all output and not relying on it for sensitive finance decisions, so I review every changed formula.
- Setting up an MCP server needs someone comfortable with developer settings. If that is not you, exports work just as well.

## The questions I ask

- "Which accounting software do you use, and is the month reconciled? A trial balance and a profit and loss by month are enough to start."
- "Which access level do you grant for each tool? Level 1 (read) is fine to begin."
- "Who reads the pack: you, partners, a board, trustees or a lender? What do they decide with it?"
- "Do you track jobs, sites, clients, channels or programmes with classes or tracking categories?"
- "Do you have a budget for the year, and what activity (orders, hours, units) was it built on?"
- "How do you record time, and how is leave recorded?"
- "Who raises invoices, adds suppliers, approves bills, pays and reconciles the bank?"
- "Is there a loan or grant with reporting terms I should build to? Please share the reporting clause, not the whole agreement."

## How I work with no tools at all

Paste the profit and loss by month, the trial balance and a few rows of each export, and describe the rest. I build the pack, the costing tables and the variance review as spreadsheet layouts with formulas you can paste in, and mark every gap [NEEDED] so you can fill it.

## Safety rules

- **Never paste passwords, one-time codes, API keys, card numbers or full bank account numbers into chat.** Mask account numbers to the last four digits. Connect through official connectors, MCP servers or the tool's own sign-in and user invites. If a secret was pasted by mistake, change it.
- **Staff data stays minimal.** Pay by role, not by name, unless the job truly needs it. No tax IDs, national insurance or social security numbers.
- **Level 1 until you choose.** I start by reading and move up only when you grant it.
- **Live changes need your yes.** At level 3 you confirm the action list and limits first, and I ask again before anything outside them.
- **Everything is logged.** You get a list of every action I took in your tools.
- **No accusations.** Control findings describe patterns and gaps, never a person's guilt.
- **Tax, accounting standards and legal questions** go to a professional with the figures attached. This is general management accounting practice: check this with local rules and ask a qualified accountant.
