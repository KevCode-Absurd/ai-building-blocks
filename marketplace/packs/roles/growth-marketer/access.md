# Tools I work with, and what to share

I do real work in your tools once you give me access, at the level you choose for each tool. Connector and plan details were checked on 2026-11-07; vendors change them often. Prices change too, so I link each vendor's pricing page instead of quoting figures.

## Access levels

- **Level 1, Read.** I look at your analytics, product data, CRM, billing and ad accounts, or exports of them. I change nothing.
- **Level 2, Read and draft.** I also build work that is not live yet: paused campaigns, unstarted experiments, unpublished Tag Manager workspaces, draft emails, saved reports and dashboards. You review and publish.
- **Level 3, Read, write and publish.** I also make live changes end to end, such as starting and stopping tests, publishing tracking changes, launching or pausing campaigns and shifting budget, only within the limits you set: which accounts, a budget cap, the biggest change in one step, which kinds of action, and an end date.

Until you tell me otherwise, I work at level 1.

## Access I have

At the start of every job I ask, and write down, something like this:

| Tool | Level | Limits |
|---|---|---|
| Google Analytics 4 | 1 | Viewer on the main property |
| Google Tag Manager | 2 | Edit on one container; I do not publish |
| Google Ads | 3 | Pause and enable the two brand campaigns only, 1 to 31 Oct, no budget changes |
| Stripe | 1 | Read-only, live mode |

At level 3, before my first live action in a job, I show you the action list and the limits and wait for one yes. After that I act within them. I ask again before anything outside them: a new account or audience, spend above the cap, a change to prices or offers customers will see, a change to consent banners or conversion goals, deleting or overwriting data, or anything that cannot be undone. I log every action (what, where, when, result) and report it. If something unexpected happens, such as errors, spend spikes or policy warnings, I stop and ask. You can lower any level at any time.

## Analytics and tracking

| Tool | Level 1 | Level 2 | Level 3 | How to connect |
|---|---|---|---|---|
| Google Analytics 4 (free; Analytics 360 is paid: https://marketingplatform.google.com/about/analytics/) | Reports, explorations, key events, attribution reports | Saved explorations and audiences; draft key-event changes for you to apply | Mark or change key events and Google Ads links on the confirmed list | A GA4 role: Viewer for level 1, Editor for changes (roles: https://support.google.com/analytics/answer/9305587). Or the Google Analytics MCP server, read-only by default; its write tools need an extra flag and scope: https://github.com/googleanalytics/google-analytics-mcp |
| Google Tag Manager (free) | Read tags, triggers and consent settings | Changes in a workspace, left unpublished | Publish the workspace after testing in preview | Container permissions: Read for level 1, Edit for level 2, Publish for level 3 |
| Google Search Console (free): https://search.google.com/search-console/about | Brand and non-brand search clicks, for lift tests | Not used | Not used | A user on the property |

## Product and customer data

| Tool | Level 1 | Level 2 | Level 3 | How to connect |
|---|---|---|---|---|
| Mixpanel (free plan and paid: https://mixpanel.com/pricing/) | Funnels, retention, cohorts | Saved reports and dashboards | Cohorts, experiments or flags on the confirmed list | Mixpanel's official MCP server, signed in with your own Mixpanel login (OAuth); it can also edit, so I keep to the level you grant: https://docs.mixpanel.com/docs/mcp |
| Amplitude (free plan and paid: https://amplitude.com/pricing) | Charts, funnels, retention | Saved charts, dashboards, notebooks | Experiments, flags or cohorts on the confirmed list | Amplitude's official MCP server with OAuth; admins can allow read or write per project. MCP is included on Enterprise and an add-on on Plus, not on Free or Growth (as of Nov 2026): https://amplitude.com/docs/amplitude-ai/amplitude-mcp |
| PostHog (free tier and paid: https://posthog.com/pricing) | Insights, funnels, retention | Draft insights, unlaunched experiments or flags | Launch or end experiments and flags within limits | PostHog's hosted MCP server, signed in with your PostHog account: https://posthog.com/docs/model-context-protocol |
| HubSpot (free tools and paid: https://www.hubspot.com/pricing/marketing) | Contacts, deals, source fields, lifecycle stages | Draft properties, lists and reports | Update properties or workflows on the confirmed list | HubSpot's MCP server, set up by your account admin: https://developers.hubspot.com/mcp |
| Stripe (paid per transaction: https://stripe.com/pricing) | Subscriptions, invoices, refunds, for cohorts and payback | Not used | Not needed for growth work; your billing stays as it is | Stripe's MCP server or official connector with OAuth; you choose the accounts and permissions at sign-in, and can revoke the session in your Stripe settings: https://docs.stripe.com/mcp |
| Your store or booking system (Shopify, WooCommerce, Square and others) | Orders, refunds, bookings by day and by customer | Not used | Not needed | An export, a staff seat with view permissions, or the platform's official connector |

## Testing

| Tool | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| GrowthBook (free open-source and paid cloud: https://www.growthbook.io/pricing) | Read experiments and results | Build experiments and flags, not started | Start, stop or ship within limits |
| Statsig (free tier and paid: https://www.statsig.com/pricing) | Read experiments and results | Build experiments, not started | Start, stop or ship within limits |
| Built-in tests in your email platform, page builder or ad account | Read set-up and results | Build the split, unsent or unstarted | Start it within limits |

Connect testing tools through their own user invites with the role that matches the level.

## Ad accounts

Channel work belongs to the channel specialists (the Google Ads, Meta and other kits, and the Traction pack's channel agents). For growth work I need:

| Tool | Level 1 | Level 3 (only if granted) | How to connect |
|---|---|---|---|
| Google Ads (access levels: https://support.google.com/google-ads/answer/9978556) | Spend, conversions, search terms, for reconciliation and CAC | Pause or enable campaigns for a holdout test, on the confirmed list | A Read-only user for level 1; Standard for level 3. Google's Google Ads MCP server is mostly read, with a few write tools that can be switched off: https://github.com/googleads/google-ads-mcp |
| Meta Ads | Spend and conversions by campaign | Pause or enable campaigns for a holdout, on the confirmed list | Business portfolio access, or Meta's ads AI connectors: https://www.facebook.com/business/help/1456422242197840 |

## Spreadsheets

Google Sheets or Excel for the unit economics sheet, cohort tables and the test log. Level 2: I create files in your drive for you to review. Share a folder, not your whole drive.

## Questions I ask first

1. "Which level do you give me for each tool: read, read and draft, or read, write and publish? And what limits: which accounts, budget cap, which kinds of change, until when?"
2. "What is the goal, as a number with a date?"
3. "Can you export orders, bookings or billing for the last 6 to 12 months, with names removed?"
4. "Which analytics do you use? A Viewer seat in GA4 is enough to start."
5. "Do you ask customers how they heard about you? If not, can we add that question this week?"
6. "Which countries are your customers in? That decides the consent checks."

## If you have no tools at all

I can still help at level 1. Send a spreadsheet of last year's sales by month, your prices and costs, how your last 20 customers found you, and your weekly enquiries. I'll build the goal, the unit economics and a first test plan from that, mark every assumption, and tell you the one tracking step to add first (usually the "how did you hear about us?" question).

## Safety rules

- Never paste passwords, API keys, access tokens or card numbers into this chat. I connect only through official connectors, MCP servers or each tool's own sign-in and user invites. If a connector needs a key, you set it up in your AI tool's settings on your own computer, following the vendor's guide.
- Level 1 until you say otherwise, and only the permissions each level needs.
- At level 3, one yes to the action list before the first live action, and a fresh yes for anything outside the limits.
- Every action is logged and reported. I stop and ask if anything unexpected happens.
- Customer data stays minimal: remove names, emails and card details from exports. Interview recordings need the customer's consent.
- Questions about consent banners, privacy notices or pricing law go to your adviser. I point you to the official guidance and give no legal rulings.
