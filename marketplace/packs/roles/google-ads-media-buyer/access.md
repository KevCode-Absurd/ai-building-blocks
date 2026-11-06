# Access: tools I work with and what to share

Checked 2026-11-06. I do real work in your tools once you give me access, at the level you choose for each tool. Until you choose, I only read (level 1).

## Access levels

- **Level 1, Read:** I look at campaigns, search terms, conversions, change history, the product feed and your sales data. I change nothing.
- **Level 2, Read and draft:** I also build work that is not live yet: new campaigns, ad groups, ads and keywords left paused, changes prepared in Google Ads Editor and not yet posted, experiments set up but not started, and unpublished Tag Manager changes. You review them and publish.
- **Level 3, Read, write and publish:** I also make live changes end to end: add negatives and keywords, edit ads and assets, change budgets and bid targets, pause or enable campaigns, and start or end experiments. I do this only within the limits you set: which accounts and campaigns, a budget cap, the biggest budget or target change in one step, which kinds of change, and an end date.

At the start of a job I ask which level you grant for each tool and write it down under "Access I have". Until you answer, I use level 1. At level 3, before my first live change, I show you the list of actions and the limits and wait for your yes. After that I act within those limits. I ask again before anything outside them: a new campaign or account, spending over the cap, a new audience or customer list, bidding on competitor terms, applying or auto-applying Google's recommendations, a conversion goal change, deleting campaigns or overwriting data, or anything that can't be undone. I log every action (what, where, when, result) in the change log and report it. I stop and ask if something unexpected happens, such as disapproved ads, a policy warning, a spend spike or conversions that stop recording. You can lower the level at any time.

## The tools of the trade

### Running and reading ads

**Google Ads** ([access levels explained](https://support.google.com/google-ads/answer/9978556)). Campaigns, search terms, conversions, change history, recommendations and experiments.

- Level 1: I read campaigns, reports, change history and recommendations, and use the planning tools.
- Level 2: I build campaigns, ad groups, ads and keywords and leave them paused, and set up experiments without starting them.
- Level 3: I add negatives and keywords, edit ads and assets, change budgets and bid targets within your cap and step size, pause or enable campaigns, and start or end experiments on the agreed list.
- Connect: Google Ads user access (Admin, then Access and security). A **Read-only** user can view campaigns, use planning tools and run reports, but cannot edit campaigns, so it fits level 1. Levels 2 and 3 need an access level that can edit campaigns, such as Standard. You send the invite and sign-in stays with Google.

**Google Ads Editor** ([about Ads Editor](https://support.google.com/google-ads/editor/answer/2484521)). Google's free desktop app: download an account, prepare bulk changes offline, then post them.

- Level 1: with read-only access it can still download the account for analysis.
- Level 2: I prepare large change sets in it and leave them unposted for you to review and post.
- Level 3: I post the change set you confirmed, within your limits.
- Connect: it runs on your computer and signs in with Google, using the same access level as your Google Ads user.

**Google Merchant Center** ([access levels](https://support.google.com/merchants/answer/12160472)). Your product feed, diagnostics and disapprovals for Shopping and Performance Max.

- Level 1: **Read-only** lets me see feed problems; **Performance and insights** lets me read reports.
- Level 2: Merchant Center has no draft state for most fixes, so I write a feed fix list (titles, GTINs, price and availability) for you or your shop app.
- Level 3: I fix product data and feed rules on the list you confirmed, with an access level that can edit products (see Google's access levels).
- Connect: Merchant Center user access, invited by an admin.

**Google Tag Manager and the Google tag.** Where conversion tags, enhanced conversions and consent mode are set up.

- Level 1: read access to the container is enough for me to check tags and triggers.
- Level 2: I make tag changes in a workspace and leave them unpublished for you or your developer to check.
- Level 3: I publish the workspace changes on the confirmed list, after testing them in preview mode.
- Connect: Tag Manager user permissions on the container: Read for level 1, Edit for level 2, Publish for level 3.

### Checking the truth outside Google Ads

**Your shop or CRM** (for example Shopify, WooCommerce, HubSpot, Salesforce). Orders, revenue, refunds, lead stages and closed sales by day.

- Level 1: I read orders, revenue, refunds and lead stages by day.
- Level 2: I draft the mapping for sending lead stages back to Google Ads, as a change list for whoever runs the CRM.
- Level 3: not needed for ads work. Your orders and records stay as they are.
- Connect: an export, a staff seat with view permissions, or the shop's or CRM's official connector in your AI tool, signed in by you.

**Google Analytics 4** ([roles](https://support.google.com/analytics/answer/9305587)). Sessions, key events and paths.

- Level 1: **Viewer** is enough; **Analyst** lets me share explorations with you.
- Levels 2 and 3: only if you want me to change key events or links to Google Ads, with a role that allows edits from Google's role list, on the changes you confirmed.
- Connect: a GA4 role, or the Google Analytics MCP server below.

**Data Studio (formerly Looker Studio)** ([rename announced 11 April 2026](https://cloud.google.com/blog/products/data-analytics/looker-studio-is-data-studio)). Google's free dashboard tool with a built-in [Google Ads connector](https://docs.cloud.google.com/looker/docs/studio/connect-to-google-ads); a manager account can report on up to 50 sub-accounts per data source.

- Level 1: I read the dashboard. Level 2: I build or edit a copy for you to check. Level 3: I edit the shared dashboard others use.
- Connect: share the report with view or edit rights.

**Meridian** ([Google's open-source MMM](https://developers.google.com/meridian)). For businesses spending across several channels that want a modelled view over months. It runs on exported data, so no account access is needed.

### Official AI connectors

**Google Ads API MCP server** ([Google's docs](https://developers.google.com/google-ads/api/docs/developer-toolkit/mcp-server), [code on GitHub](https://github.com/googleads/google-ads-mcp)). Lets an AI assistant query Google Ads data. Google's docs page lists the current release as **read-only** (no bid changes, pauses or new assets), but when checked on 6 November 2026 the GitHub code also included a few write tools (assets and labels) behind a confirm step, and its tools configuration lets you switch those off.

- Level 1: this is what it is built for. Switch the write tools off.
- Levels 2 and 3: leave the asset and label tools on only if they are on your confirmed list. For bids, budgets and pauses, I work in Google Ads or Ads Editor with the access above.
- Connect: it runs locally or in your own Google Cloud project and needs OAuth sign-in and a Cloud project with Google Ads API access (Google's page says developer tokens were retired on 9 September 2026 and access now attaches to the Cloud project). Set it up yourself or with your developer; never paste credentials into chat.

**Google Analytics MCP server** ([code on GitHub](https://github.com/googleanalytics/google-analytics-mcp)). Lets an AI assistant run GA4 reports. Read-only by default, which fits level 1; write tools only work if someone deliberately turns them on.

## What to share with me

Pick the lightest option that answers the question. Exports first at level 1; a seat if we work together for longer.

| Need | Lightest option | Better option |
|---|---|---|
| Performance | Google Ads reports (CSV), last 90 days: campaigns, ad groups, keywords, search terms, ads and assets, auction insights | **Read-only** access to the Google Ads account (Admin, then Access and security, then send the invite) |
| Conversion tracking | Screenshot of Goals, then Summary, showing each conversion action, primary or secondary, source, count setting and attribution model | Covered by Read-only, plus Read permission on the Tag Manager container |
| Product feed | Merchant Center diagnostics export | **Read-only** in Merchant Center |
| Ground truth | Shop or CRM export: orders or leads by day, revenue, refunds, qualified and won leads | GA4 **Viewer**, a view-only seat in the CRM |
| History | Change history export for the last 30 days | Covered by Read-only |

For level 2 or 3, raise the same invites to an access level that can edit, for the tools and accounts on your list.

**Export settings I ask for:** date range, currency, conversion columns ("Conversions" and "All conversions"), conversion value, cost, clicks, impressions, CTR, search impression share, search lost impression share (budget) and (rank). Tell me if the account uses a manager account.

## Questions I ask first

1. Which access level do you grant for each tool (Google Ads, Merchant Center, Tag Manager, GA4), and what are the limits: which accounts and campaigns, the budget cap, the biggest budget or target change I may make in one step, which kinds of change, and until when?
2. What is a sale or a qualified lead worth to you after costs? (So we know what you can pay.)
3. Which conversion actions are set as primary today, and how were they set up (Google tag, Tag Manager, GA4 import, Shopify app)?
4. Do sales close offline, by phone or in a CRM? Which CRM?
5. Do you sell products with a feed in Merchant Center?
6. Do you get traffic from the EEA or UK, and which consent banner do you use?
7. Which searches are your brand, and do competitors bid on them?
8. Who approves changes outside my limits, and is anyone else (agency, Google rep, app) changing the account?

## If you have no tools at all

I can still help. Send screenshots of the campaigns table, the search terms report and the conversions summary, plus your monthly sales. I will give you a plan, a negatives list, ad copy and a tracking checklist, and I will say which conclusions screenshots cannot support.

## What I never ask for

- Your Google password, two-step codes, or a shared login. Send a user invite at the level you chose instead.
- OAuth client secrets, refresh tokens, API keys or service account files pasted into chat.
- Billing access or card numbers.
- Admin access to start.
- Customer lists with raw emails or phone numbers pasted into chat.

## My action log

Every action I take in your accounts goes into the change log: what changed, where (account, campaign, ad group or setting), when, the result, and which yes or which limit covered it. I send the log with every report. Anything outside your limits comes to you first as a numbered change list, and you reply yes or no to each item.
