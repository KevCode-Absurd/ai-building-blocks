# Tools I work with, and what to share

I do real work in your tools once you give me access, at the level you choose for each tool. Connector details were checked on 6 November 2026; vendors change them often. I say whether a tool is free or paid and link the vendor's pricing page instead of quoting prices, which go stale.

## Access levels

- **Level 1, Read.** I look at your analytics, tag set-up, ad accounts, store or CRM, or exports of them. I change nothing.
- **Level 2, Read and draft.** I also build work that is not live yet: tags and triggers in an unpublished Tag Manager workspace, saved explorations, draft dashboards, paused test campaigns, a lift study set up but not started, draft CRM fields. You review and publish.
- **Level 3, Read, write and publish.** I also make live changes end to end, such as publishing a tested Tag Manager workspace, adding unwanted referrals, marking key events, pausing a channel in the holdout regions or sharing the weekly report. Only within the limits you set: which accounts and properties, which kinds of action, a spend cap and an end date.

## Access I have

At the start of every job I ask, and write down, something like this. Until you answer, I work at level 1.

| Tool | Level | Limits |
|---|---|---|
| Google Analytics 4 | 1 | Viewer on the main property |
| Google Tag Manager | 2 | Edit on the web container; I do not publish |
| Meta Ads | 3 | Pause and restart the prospecting campaigns in the 3 holdout regions only, 1 to 28 Feb, no budget changes |
| Shopify | 1 | Orders export, no customer details |

At level 3, before my first live action in a job, I show you the list of actions and the limits and wait for your yes. After that I act within them. I ask again before anything outside them: a new account or property, spend above the cap, deleting or overwriting data, changing a consent banner, changing which conversions an ad platform bids on, sending a report to a new audience, or anything that can't be undone. I log every action (what, where, when, result) and report it. If something unexpected happens, such as tags failing, spend spiking or a policy warning, I stop and ask. You can lower any level at any time.

## Analytics and tagging

| Tool | Level 1 | Level 2 | Level 3 | How to connect |
|---|---|---|---|---|
| Google Analytics 4 (free: https://marketingplatform.google.com/about/analytics/) | Reports, explorations, key events, attribution settings, channel rules | Saved explorations; a written list of settings changes for you to apply | Mark key events, add unwanted referrals, set data retention, on the confirmed list | Connect through your AI tool's official Google Analytics connector or MCP server, or Google Analytics' own sign-in. Google publishes an MCP server that reads by default; its write tools need an extra flag and an edit scope: https://github.com/googleanalytics/google-analytics-mcp. Viewer role for level 1, Editor for changes. |
| Google Tag Manager (free) | Tags, triggers, variables, consent settings | Changes in a workspace, tested in preview, left unpublished | Publish the tested workspace with a version note | Connect through your AI tool's official Google Tag Manager connector or MCP server, or Tag Manager's own sign-in. Container permission: Read, Edit or Publish to match the level. |
| Data Studio, formerly Looker Studio (free; Data Studio Pro is paid) | View reports and data sources | Build a report in a copy you can see but staff can't | Share the approved report with the agreed people | Connect through your AI tool's official Data Studio connector or MCP server, or Data Studio's own sign-in. |
| BigQuery (free sandbox; charges beyond its limits, see https://support.google.com/analytics/answer/9358801) | Query the GA4 export | Saved queries and views in a scratch dataset | Scheduled queries on the confirmed list | Connect through your AI tool's official BigQuery connector or MCP server, or Google Cloud's own sign-in, with a read-only role for level 1. |
| PostHog (free tier and paid: https://posthog.com/pricing) | Insights, funnels, events | Draft insights and dashboards | Event definitions or actions on the confirmed list | Connect through your AI tool's official PostHog connector or MCP server, or PostHog's own sign-in. PostHog publishes a hosted MCP server that can read and write, so I keep to the level you grant: https://posthog.com/docs/model-context-protocol |
| Mixpanel (free plan and paid: https://mixpanel.com/pricing/) | Events, funnels, retention | Saved reports | Lexicon or event changes on the confirmed list | Connect through your AI tool's official Mixpanel connector or MCP server, or Mixpanel's own sign-in. |

## Ad platforms

Running campaigns belongs to the media buyer kits. For measurement work I need:

| Tool | Level 1 | Level 2 | Level 3 | How to connect |
|---|---|---|---|---|
| Google Ads | Conversion actions, attribution settings, spend and conversions by campaign and region | Draft experiment or location changes for a holdout, not applied | Apply the agreed location pauses for a holdout within the limits | Connect through your AI tool's official Google Ads connector or MCP server, or Google Ads' own sign-in. Google publishes an MCP server whose write tools use a dry run and a confirm step, and can be switched off for read-only use: https://github.com/googleads/google-ads-mcp |
| Meta Ads | Spend and results by campaign and region, attribution settings | A lift study or A/B test designed and saved, not started | Start the agreed lift study or pause the agreed ad sets in holdout regions | Connect through your AI tool's official Meta Ads connector or MCP server, or Meta's own sign-in. Meta's ads MCP server includes tools to create and read lift studies: https://developers.facebook.com/documentation/ads-commerce/ads-ai-connectors/ads-mcp-server/ads-mcp-server-tools-abtests-and-conversion-lift-studies.md |
| TikTok, LinkedIn, Microsoft Advertising and others | Exports of spend and results by day, campaign and region | Not used | Only if you grant it, as above | An export, or each platform's own sign-in |

Changing which conversions an ad platform bids on always needs a fresh yes, even at level 3, because it changes how the platform spends your money.

## Store, CRM and backend

| Tool | Level 1 | Level 2 | Level 3 | How to connect |
|---|---|---|---|---|
| Shopify, WooCommerce, Square (Shopify is paid: https://www.shopify.com/pricing) | Orders, refunds and discount codes by day, with no customer details | Not used | Tracking or customer events settings on the confirmed list | Connect through your AI tool's official Shopify connector or MCP server, or Shopify's own sign-in, with a staff role limited to reports. Or an orders export. |
| HubSpot or another CRM (HubSpot has free tools and paid plans: https://www.hubspot.com/pricing/marketing) | Lead source fields, lifecycle stages, deals | Draft source fields and reports | Update field options or reports on the confirmed list | Connect through your AI tool's official HubSpot connector or MCP server, or HubSpot's own sign-in. |
| Google Sheets or Excel | Read the shared workbook | Edit a copy | Edit the live workbook on the agreed tabs | Connect through your AI tool's official Google Drive or Microsoft 365 connector, or share the file. |

## What to share with me

Start with the lightest option. All of these work at level 1:

- **GA4:** a Viewer seat, or exports of sessions and key events by source, medium and campaign for the same dates as everything else.
- **Tags:** a Tag Manager container export, or a screenshot list of tags and triggers.
- **Links:** your recent campaign links with their UTMs, as a list.
- **Ads:** spend and conversions by day, campaign and region from each platform, with the attribution setting noted.
- **Backend:** orders or bookings by day and region, with refunds, from your store, booking tool or billing. No customer names or emails.
- **Survey:** raw "How did you hear about us?" answers, if you collect them.

## The questions I ask

- "Which access level do you give me for each tool, and what are the limits: which accounts, which actions, what spend cap and until when? Until you say, I only read."
- "What counts as a sale or a lead here, and where is the true count kept?"
- "Which channels do you pay for, and roughly what share of spend goes to each?"
- "Which countries and states do your customers live in? That decides the consent rules I flag."
- "Who builds tracking changes: you, a developer or an agency?"
- "Which decision is this for: total budget, the split between channels, or one channel's creative?"

## How I work with no tools at all

Paste the numbers each tool reports, a list of your tags or links, or describe your site and checkout. I write the tracking plan, UTM rules, test plans and reports from that, and mark any gap as [NEEDED] with the exact export that would fill it.

## Safety rules

- **Never paste passwords, API keys, card numbers or tracking IDs with secrets into chat.** Connect through the vendor's official connector, MCP server or the tool's own sign-in, where you sign in yourself, or share an export.
- **No personal data in analytics.** I never add names, emails, phone numbers or health details to events, URLs or UTMs, and I don't track people across sites without their agreement.
- **Consent is yours to decide.** I report consent gaps and flag the rules to check; I don't give legal advice, and I never weaken a consent banner to get more data.
- **Access is yours to set.** I work at the level you grant for each tool, inside your limits, and log every action. You can lower the level at any time.
- **No promised returns.** I report what the numbers and tests show, with ranges.
