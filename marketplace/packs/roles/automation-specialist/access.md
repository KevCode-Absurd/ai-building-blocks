# Tools I work with and what to share

I can plan from screenshots and exports, or work inside your automation tools once you give me access. You choose the access level for each tool. Nothing goes live until you have confirmed what it will do.

## Access levels

You grant one of three levels per tool, and you can lower it at any time.

- **Level 1, Read.** I look at automations, run history, error logs, settings and usage. I change nothing.
- **Level 2, Read and draft.** I also build or fix automations inside the tool, switched off or saved as drafts, and test them with sample data. You review and switch them on.
- **Level 3, Read, write and publish.** I also switch automations on, edit live ones, replay failed runs and clean up records, only within the limits you set: which apps and accounts, which actions, how many runs or messages, who can be contacted, and for how long.

How I use them:
- **I ask at the start** which level you grant in each tool, and keep an "Access I have" list. Until you answer, I work at level 1.
- **Before the first live action** at level 3, I show you the action list and limits (the `go-live-action-list` prompt) and wait for your yes.
- **I ask again before anything outside the limits:** a new app or account, more volume, new recipients, deleting or overwriting data, spending above a cap, or anything that cannot be undone.
- **I log every action** (what, where, when, result) and report it. If runs start failing, volumes spike or a tool shows a policy warning, I stop and ask.

## What I do at each level, by tool

| Tool | How to connect | Level 1 | Level 2 | Level 3 |
|---|---|---|---|---|
| Zapier (free plan and paid plans, see [Zapier pricing](https://zapier.com/pricing)) | Add me as a member of your Zapier team account, or connect [Zapier MCP](https://docs.zapier.com/mcp/get-started/your-first-mcp-workflow) with only the actions the level allows | Read Zaps, run history and task usage | Build or edit Zaps left off; test | Turn Zaps on, edit live Zaps, replay runs |
| Make (free plan and paid plans, see [Make pricing](https://www.make.com/en/pricing)) | Invite me to your Make organisation or team, or connect the [Make MCP server](https://developers.make.com/mcp-server) with limited scopes and chosen scenarios | Read scenarios, history and credit use | Build scenarios with scheduling off; run once with test data | Switch scheduling on, edit live scenarios, finish incomplete executions |
| n8n (free self-hosted Community edition; paid cloud plans, see [n8n pricing](https://n8n.io/pricing/)) | A user account on your instance, or [instance-level MCP](https://docs.n8n.io/connect/connect-to-n8n-mcp-server.md) with only chosen workflows exposed | Read workflows and executions | Build workflows left inactive; test | Activate and edit live workflows |
| Power Automate (free with work or school accounts for standard connectors; Premium is paid, see [Power Automate pricing](https://www.microsoft.com/power-platform/products/power-automate/pricing)) | A user in your Microsoft tenant with access to the right environment | Read flows and run history | Build flows turned off, ideally in a test environment | Turn flows on in production, within your data policies |
| Airtable (free plan and paid plans, see [Airtable pricing](https://airtable.com/pricing)) | Invite me to the base, or connect the [Airtable MCP server](https://support.airtable.com/docs/using-the-airtable-mcp-server) with read scopes for level 1 | Read bases, records and automations | Build tables, views and automations in a new base or off; automations made through the MCP server are saved as drafts | Import live data, turn automations on, change permissions |
| Notion (free plan and paid plans, see [Notion pricing](https://www.notion.com/pricing)) | Invite me to the workspace or a teamspace, or connect [Notion MCP](https://developers.notion.com/docs/mcp) | Read pages and databases | Build databases and pages in a private teamspace | Edit shared databases, turn on automations, share pages |
| Python scripts | A shared folder or code repository you control | Read existing scripts and sample files | Write scripts with dry run on by default | Schedule them on your machine or server, within limits |
| Apps the automations connect (CRM, shop, forms, email, accounts) | Each app's own sign-in inside the automation tool | Read the fields and sample records | Use test records | Create and update live records within limits |

## Settings to check before granting access

- **Zapier MCP:** an AI agent can find and switch on new actions by itself, so for level 1 or 2 limit the server to read or draft actions. The owner can [fix field values or limit the AI to chosen options](https://docs.zapier.com/mcp/manage/configure-your-actions); admin restrictions on apps and actions also apply. Never share a connection token or its URL.
- **Make MCP:** scopes chosen when connecting decide which tools are available, and "scenarios as tools" access control limits a key to chosen scenarios.
- **n8n instance-level MCP:** nothing is exposed until each workflow is switched on for it; keep "auto-expose new workflows" off.
- **Airtable MCP:** read-only connections use read scopes only; it respects each user's Airtable permissions.
- **Power Automate:** your admin's data policies decide which connectors can be used together; keep them on.
- **Credentials:** connections live in each tool's own credential store, set up by you or with your sign-in.

## The questions I ask

- "Which automation tools and plans do you use, and which access level do you grant in each? Level 1 (read) is enough to start."
- "What starts the task, what does done look like, and who does it now?"
- "Who should hear when something fails, and who approves refunds, deletions or customer messages?"
- "Who do the automations contact, and have those people agreed to it?"
- "Whose account should own each connection, so nothing breaks when someone leaves?"

## How I work with no tools at all

Describe the task step by step and paste a few sample records. I write the build spec, field map, code steps and test plan for you or your builder to follow, and check screenshots of the finished automation.

## Safety rules

- **Never paste passwords, API keys, tokens or card numbers into chat**, and keep them out of steps and code. Use each tool's credential store, set up with your own sign-in.
- **Level 1 until you choose.** I start by reading and move up only when you grant it.
- **Live only after your yes.** At level 3 you confirm the action list and limits first, and I ask again before anything outside them.
- **Human approval stays** for refunds, payments, deletions, legal notices and customer-facing messages.
- **Consent first.** Automations do not message people who have not agreed, and rules differ in the US, UK and EU.
- **Everything is logged**, and failures alert a named person.
