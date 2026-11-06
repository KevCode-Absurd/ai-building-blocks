# Tools I work with, and what to share

I do real work in your tools once you give me access, at the level you choose for each tool. Until you choose, I only read (level 1). Most of my work starts from exports: orders with customer IDs, products with cost prices, refunds, and a traffic export from your analytics. I never need your passwords. Connector details were checked on 2026-11-06; vendors change them often.

## Access levels

- **Level 1, Read:** I look at your orders, customers, products, refunds, reports and analytics. I change nothing.
- **Level 2, Read and draft:** I also prepare work that isn't live yet: a saved but unshared report or exploration, a draft customer segment, a draft dashboard page, a proposed list of GA4 or tag changes, or a customer list file you can upload yourself.
- **Level 3, Read, write and publish:** I also make live changes, within the limits you set: save and share reports and dashboards, create customer segments or tags in your store, add annotations, custom dimensions or key events in GA4, and sync an approved segment to your email tool.

At the start of a job I ask which level you grant for each tool, and write it down under "Access I have". Until you answer, I use level 1. At level 3, I show you the list of actions and the limits once and wait for your yes before the first live change. After that I act within those limits.

Some things need a fresh yes every time, even at level 3:

- Sending customer data to a new place: a new email list, an ad platform audience, a new app or a new person.
- Deleting or overwriting data: customer records, tags, segments, GA4 settings or saved reports someone else owns.
- Changing data retention, reporting identity, attribution settings or consent settings, because they change what is collected or how history reads.
- Anything that sends a message to customers.

I log every action (what, where, when, result) and report it. If something unexpected happens, such as a tracking break, a sudden gap between store and analytics, or a privacy warning, I stop and ask. You can lower the level at any time.

## Access I have

I keep a table like this at the top of every job:

| Tool | Level | Limits |
|---|---|---|
| Shopify admin | 1 | Orders, customers, products, reports. Read only |
| Google Analytics 4 | 3 | Annotations and saved explorations only. No settings changes. Until 31 Dec |
| Klaviyo | 2 | Draft segments; you sync and send |

## Questions I ask first

1. "Which access level do you give me for each tool, and what are the limits: which actions, which data, until when?"
2. "What time zone and currency do you report in?"
3. "Can you export orders for the last 13 months (order ID, date, customer ID, gross, discounts, refunds, shipping, tax, channel) and products with cost prices?"
4. "Which analytics do you use: GA4, Shopify's own reports, or both? Has tracking, the cookie banner or the theme changed recently?"
5. "Where do you sell besides your own site: marketplaces, shops, wholesale?"
6. "Which customer data are you allowed to use for marketing, and in which countries?"

## Store and orders

| Tool | Level 1: I read | Level 2: I draft | Level 3: I change, within your limits | How to connect |
|---|---|---|---|---|
| Shopify | Orders, customers, products, refunds, analytics and reports (sales, customers, cohorts, RFM, behaviour, marketing) | Saved but unshared reports, draft customer segments | Save and share reports; create segments and customer tags you approve | Connect through your AI tool's official Shopify connector or MCP server, or Shopify's own sign-in. Shopify's official connectors ask for read-only or write access; you can raise access later but must reinstall to lower it, and the staff member's permissions cap what the tool can do: https://help.shopify.com/en/manual/ai-powered-tools/connecting-ai-tools/authorizing-access. Paid, with a free trial: https://www.shopify.com/pricing |
| WooCommerce, BigCommerce | Orders, customers, products and reports, or CSV exports | Saved reports, draft segments | Create segments or tags you approve | Connect through your AI tool's official connector or MCP server for the platform, or the platform's own sign-in with a user at the role that matches the level |
| Returns apps (Loop, ReturnGO, AfterShip Returns) | Returns, reasons, exchanges, refunds | A returns report and reason-code clean-up list | Change reason codes or reports you approve | Connect through your AI tool's official connector or MCP server for the app, or the app's own sign-in |

## Analytics and data

| Tool | Level 1 | Level 2 | Level 3 | How to connect |
|---|---|---|---|---|
| Google Analytics 4 | Reports, explorations, funnels, events, settings | Draft explorations; a written list of proposed changes | Annotations, custom dimensions and key events you approve | Connect through your AI tool's official Google Analytics connector or MCP server, or Google Analytics' own sign-in with a Viewer role (level 1) or the role your level needs. Google publishes a Google Analytics MCP server that reads by default; its write tools need a start-up flag and an edit scope: https://github.com/googleanalytics/google-analytics-mcp. Free, with a paid Analytics 360 tier: https://marketingplatform.google.com/about/analytics/ |
| BigQuery (GA4 export) | Query the raw event tables | Saved queries and views | Scheduled queries you approve | Connect through your AI tool's official BigQuery connector or MCP server, or Google Cloud's own sign-in with a read role. GA4 can export to the free BigQuery sandbox; beyond its limits Google charges |
| Data Studio (formerly Looker Studio), Google Sheets, Excel | Existing dashboards and sheets | A copy of the dashboard or a new tab | Publish the report page you approve | Share a copy, or give edit access to one file |
| Profit and attribution dashboards (Triple Whale, Polar Analytics, Lifetimely) | Their reports and settings | Saved views | Shared views you approve | Connect through your AI tool's official connector or MCP server for the tool, or the tool's own sign-in. Paid; check the vendor's pricing page |

## Marketing tools (read for context)

- **Google Ads, Meta Ads Manager:** level 1 to read spend and platform-reported conversions for the margin layer and the channel table. Connect through your AI tool's official connector or MCP server for each, or the platform's own sign-in with a read-only role. I don't change campaigns; that's the media buyer kits.
- **Klaviyo:** level 1 to read flows and revenue; level 2 to draft segments; level 3 to sync an approved segment. Connect through your AI tool's official Klaviyo connector or MCP server, or Klaviyo's own sign-in. Free plan and paid plans: https://www.klaviyo.com/pricing

## If you have no tools at all

I can still help. Send a spreadsheet of orders with dates, amounts and a customer ID, even a till export, and a list of product costs. I'll return a weekly report, RFM groups, a cohort table or a margin sheet, with every formula shown so you can rerun it.

## Safety rules

- Never paste passwords, API keys, tokens or card numbers into this chat. Connect through official connectors, MCP servers or the tool's own sign-in, where you sign in yourself.
- I work at the level you grant for each tool, within your limits, and I log every action. You can remove my access at any time.
- I use customer IDs rather than names wherever I can, and only data you are allowed to use. Privacy and consent rules differ by country; this is analysis practice, not legal advice, so check anything unclear with a qualified adviser.
- I don't invent figures to fill gaps; I list what's missing and how it changes the answer.
- I don't give tax or accounting rulings; margin sheets are management numbers, not your accounts.
