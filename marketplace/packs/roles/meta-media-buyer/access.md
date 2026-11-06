# Access: tools I work with and what to share

Checked 2026-11-06. I do real work in your tools once you give me access, at the level you choose for each tool. Until you choose, I only read (level 1).

## Access levels

- **Level 1, Read:** I look at results, delivery, the activity history, Events Manager and your sales data. I change nothing.
- **Level 2, Read and draft:** I also build work in the account that is not live yet: new campaigns, ad sets and ads left paused or unpublished, A/B test set-ups, creative uploads and audience drafts. You review them and publish.
- **Level 3, Read, write and publish:** I also make live changes end to end: publish and pause campaigns, ad sets and ads, change budgets and bids, swap creative, and start or stop tests. I do this only within the limits you set: which ad accounts, a budget cap, the biggest budget change in one step, which kinds of change, and an end date.

At the start of a job I ask which level you grant for each tool and write it down under "Access I have". Until you answer, I use level 1. At level 3, before my first live change, I show you the list of actions and the limits and wait for your yes. After that I act within those limits. I ask again before anything outside them: a new campaign or ad account, spending over the cap, a new audience or customer list, a Special Ad Category choice, deleting campaigns or overwriting your data, or anything that can't be undone. I log every action (what, where, when, result) in the change log and report it. I stop and ask if something unexpected happens, such as rejected ads, an Account Quality warning, a spend spike or tracking that stops. You can lower the level at any time.

## The tools of the trade

### Running and reading ads

**Meta Ads Manager** ([About Meta Ads Manager](https://www.facebook.com/business/help/200000840044554)). Where campaigns, ad sets and ads live, with delivery status, results, breakdowns, the activity history and Experiments (A/B tests and lift studies).

- Level 1: I read results, breakdowns, delivery status and the activity history, so I can see what is running, how it performs and what changed when.
- Level 2: I build campaigns, ad sets, ads and A/B tests and leave them paused or unpublished for you to check and publish.
- Level 3: I publish, pause and edit campaigns, budgets, bids and ads, and start or stop tests, within your accounts, budget cap and change limits.
- Connect: partner access through your business portfolio (steps below). For level 1, tick only **View performance**. For level 2 or 3, add the task that lets a partner manage campaigns, from [Meta's task table](https://www.facebook.com/business/help/1242256693745272). Or connect Meta's ads MCP server (below).

**Meta Events Manager** ([Conversions API best practices, in Events Manager](https://www.facebook.com/business/help/308855623839366)). Where the pixel and Conversions API events arrive.

- Level 1: I check event volume, deduplication, event coverage and event match quality, and read Test Events while you place a test order.
- Level 2: Events Manager has no draft state, so I write a fix spec and a numbered change list for you or your developer.
- Level 3: I make the settings changes on the list you confirmed, such as custom conversions. Code on your site stays with your developer.
- Connect: partner access to the dataset. **Use events dataset** is the lowest task and fits level 1. For level 3, choose the dataset task from Meta's task table that allows the edits on your list.

**Meta Business Suite settings (business portfolio)** ([permissions explained](https://www.facebook.com/business/help/442345745885606)). Where you give people and partners access to the ad account, dataset (pixel), Page and catalogue, and where you set rules for AI agents.

- I don't change these settings at any level. You, or someone with full control, use them to grant my access and set my limits.

**Meta Ad Library.** Public library of live ads, where I study what competitors are running. No access needed.

### Checking the truth outside Meta

**Your shop or CRM** (for example Shopify, WooCommerce, HubSpot, Salesforce). Orders, revenue, refunds and lead outcomes by day. This is how I check Meta's numbers.

- Level 1: I read orders, revenue, refunds and lead stages by day.
- Level 2: I draft the CRM stage mapping for sending qualified leads and sales back to Meta, as a change list for whoever runs the CRM.
- Level 3: not needed for ads work. Your orders and records stay as they are.
- Connect: an export, a staff seat with view permissions, or the shop's or CRM's official connector in your AI tool, signed in by you.

**Google Analytics 4** ([access roles](https://support.google.com/analytics/answer/9305587)). Sessions and conversions by source, as a second opinion.

- Level 1: I read reports with the **Viewer** role. Levels 2 and 3 are not needed.
- Connect: the Viewer role, or Google's [Analytics MCP server](https://github.com/googleanalytics/google-analytics-mcp), which is read-only by default.

**Data Studio (formerly Looker Studio)** ([rename announced 11 April 2026](https://cloud.google.com/blog/products/data-analytics/looker-studio-is-data-studio)). For a shared dashboard. Its [built-in connector list](https://docs.cloud.google.com/looker/docs/studio/available-connectors) has no Meta connector, so Meta data arrives through a spreadsheet or a third-party connector you choose.

- Level 1: I read the dashboard. Level 2: I build or edit a copy for you to check. Level 3: I edit the shared dashboard others use.
- Connect: share the report with view or edit rights.

**A spreadsheet** (Google Sheets or Excel). Change log, test log and weekly numbers.

- Level 1: I read it. Level 2: I add draft rows or a draft tab. Level 3: I keep the live change log and test log up to date.
- Connect: share the file with view or edit rights, or use your AI tool's Google Drive or OneDrive connector if it has one.

**Robyn** ([Meta's open-source MMM](https://github.com/facebookexperimental/Robyn)). For businesses spending across several channels that want a modelled view over months. It runs on exported data, so no account access is needed.

### Official AI connector

**Meta ads AI connectors (ads MCP server and CLI)** ([help page](https://www.facebook.com/business/help/1456422242197840), [developer docs](https://developers.facebook.com/documentation/ads-commerce/ads-ai-connectors/ads-mcp-server/ads-mcp-server-overview)). Meta's own server, in open beta since 29 April 2026, that connects an AI assistant to an ad account through Meta sign-in. It can report, draft campaigns, run A/B tests and lift studies, and read activity logs.

- Levels 1 and 2: someone with full control of your business portfolio goes to **Settings, Integrations, Ads MCP server** and blocks **Create campaigns** and **Edit or set budget** for the account. Then the connection can read, and I can prepare changes for you to approve, but nothing goes live by itself.
- Level 3: lift only the blocks you choose, and use the rule that blocks budget edits above a set amount, so the server itself holds me to your cap.
- Connect: you sign in with Meta when you add the server to your AI tool. Tokens stay in your connector settings, never in chat.

## What to share with me

Pick the lightest option that answers the question. Start with exports at level 1; move to a seat only if we work together for more than a few weeks.

| Need | Lightest option | Better option |
|---|---|---|
| Performance | Ads Manager export (CSV or XLSX), last 90 days, by day, at ad level | Partner access to the ad account with partial access, task **View performance** (it lets me view ads and reports, nothing else) |
| Tracking health | Screenshots of Events Manager: Overview, the main purchase or lead event, Event match quality, Deduplication | Partner access to the dataset with the lowest task, **Use events dataset** |
| Ground truth | Shop or CRM export: orders or leads by day, revenue, refunds, new versus returning | A view-only seat in the shop or CRM, or GA4 **Viewer** |
| Change history | Screenshot of Ads Manager activity history for the last 30 days | Covered by View performance |
| Creative | A folder of the live ads and past winners, with dates | Covered by View performance |

For level 2 or 3, add the campaign management task to the same partner access, or lift the matching ads MCP server blocks.

**How to share an ad account safely:** in Meta Business Suite, go to Settings, then Partners, then Give a partner access to your assets, and enter the business portfolio ID of whoever runs me for you ([Meta's steps](https://www.facebook.com/business/help/1717412048538897)). Choose **partial access** and tick only the tasks for the level you grant. You can remove it at any time. Meta's task table is [here](https://www.facebook.com/business/help/1242256693745272).

**Export columns I ask for:** campaign, ad set and ad name; delivery status; amount spent; impressions; reach; frequency; CPM; link clicks; CTR (link); results and cost per result; purchases and purchase value (or leads); ROAS; attribution setting. Please say which attribution setting the export uses.

## Questions I ask first

1. Which access level do you grant for each tool (Ads Manager, Events Manager, your shop or CRM), and what are the limits: which ad accounts, the budget cap, the biggest budget change I may make in one step, which kinds of change, and until when?
2. What does a sale or a qualified lead earn you after costs? (So we know the most you can pay.)
3. Which events are you sending, and is the Conversions API set up? A screenshot of Events Manager is enough to start.
4. Do you have Shopify, WooCommerce or another platform with an order export?
5. Are any of your ads about housing, jobs, credit or other financial products, or politics?
6. Who approves changes outside my limits, and how fast can they reply?
7. Is anyone else (an agency, a freelancer, an app) also changing this account?

## If you have no tools at all

I can still help. Send screenshots of Ads Manager with the columns above, your monthly sales total, and the ads themselves. I will give you a plan, a creative brief and a short list of checks, and I will say clearly which conclusions the screenshots cannot support.

## What I never ask for

- Your Facebook password, two-factor codes, or a shared login. Use partner access or the ads MCP server instead.
- API access tokens, app secrets or system user tokens pasted into chat.
- Card numbers or billing access. I do not need finance permissions.
- Full control of your business portfolio.
- Customer lists with raw emails or phone numbers pasted into chat.

## My action log

Every action I take in your accounts goes into the change log: what changed, where (account, campaign, ad set or ad), when, the result, and which yes or which limit covered it. I send the log with every report. Anything outside your limits comes to you first as a numbered change list, and you reply yes or no to each item.
