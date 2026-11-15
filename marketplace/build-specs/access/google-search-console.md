# Give your agents access to Google Search Console

Your search agents (Stuart for search changes, Rustam for AI answer visibility, Callum for checking the numbers) read Search Console to see which searches bring shoppers to your store, which pages are close to page one, and whether Google has indexed a page. Facts were checked on 15 November 2026.

## What the agents do with it at each level

| Level | What the agents do |
|---|---|
| 1, read | Read clicks, impressions, click-through rate and position by page, query, device and country; read index status of single addresses with URL Inspection; read the generative AI report (AI Overview and AI Mode impressions only). This is all these processes need. |
| 2, draft | Nothing more in Search Console. Drafts (new titles, redirect lists) live in the job folder and in Shopify. |
| 3, publish | Not used. Submitting sitemaps, requesting indexing and changing settings stay with you. |

Give the agents read access only. There is no reason to give them more.

## What you need first

- Owner access to your Search Console property. Only owners see Settings > Users and permissions.
- A verified property for your store's domain (a Domain property covers every address and subdomain).
- For Way 2: a Google Cloud project where you can turn on the Search Console API.

## Way 1, in Claude: exports you share

Google has no official Search Console connector or MCP server. Third-party ones exist, but they are not Google's code, so the agents do not ask you to install one. In Claude, use exports:

1. Open Search Console and pick your property.
2. Go to Performance > Search results. Set the date range the agent asks for (for example the last 16 months, or the last 28 days and the 28 days before).
3. Click Export and choose Download CSV or Google Sheets.
4. Upload the files to the Claude project or conversation for the job. The agent names each file with its date range.
5. For index status, the agent lists the addresses and you paste each into the URL Inspection bar at the top of Search Console, then share the result.

This works on any plan and gives the agents no standing access.

## Way 2, for Claude Code and hosted agents: a read-only service account

The agents call Google's official Search Console API with the read-only scope `https://www.googleapis.com/auth/webmasters.readonly`.

1. In the Google Cloud console, pick or create a project, then open APIs and services and turn on the Google Search Console API.
2. Go to IAM and admin > Service accounts and create a service account for the agents. Give it no Cloud roles; it needs none for Search Console.
3. Create a key for it only if your host cannot use keyless sign-in (workload identity or impersonation). If you must create a key, download the JSON key once and put it straight into your host's secret store. Never put it in the project folder, a chat or an email.
4. In Search Console, go to Settings > Users and permissions > Add user. Enter the service account's email address.
5. Choose Restricted. A restricted user can view all reports and use URL Inspection in fetch-only mode, but cannot submit sitemaps, disavow links or manage users.
6. Give the agent the property name exactly as Search Console shows it (for example `sc-domain:example.com` for a Domain property).

Limits to know (Google, checked 15 November 2026):

- Search analytics queries: 1,200 per minute per site and per user.
- URL Inspection: 2,000 per day and 600 per minute per site. It returns status only.

## Safety switches on Google's side

- The read-only scope cannot change anything, even if the account had more rights.
- A Restricted user cannot submit sitemaps, disavow links or add users.
- Only owners can add or remove users.

## Check it works

Ask the agent: "Give me total clicks and impressions for my property for the last 28 complete days, and the 5 pages with the most clicks."

A good answer names the exact dates (ending at least 2 to 3 days ago, because recent data is not final), gives totals that match the Performance report for the same dates, and lists 5 real addresses from your store with their clicks. It changes nothing.

## Take access away

1. In Search Console, go to Settings > Users and permissions.
2. Click the menu next to the service account and choose Remove access.
3. In the Google Cloud console, open the service account, go to Keys and delete any key. Delete the key from your host's secret store too. If you no longer need the account, disable or delete it.

## What stays manual, and why

- Request indexing: the API cannot ask Google to index a page. The agent lists the addresses; you click Request indexing in URL Inspection if you want to.
- Submitting sitemaps, removals and settings changes: the agents only read.
- Search Console's generative AI report shows AI Overview and AI Mode impressions only, with no queries or clicks, so the agents never claim more than that.

## Sources

- Search Console API usage limits, https://developers.google.com/webmaster-tools/limits (checked 15 November 2026)
- Search Console API authorization and scopes, https://developers.google.com/webmaster-tools/v1/how-tos/authorizing (checked 15 November 2026)
- Managing owners, users and permissions, Search Console Help, https://support.google.com/webmasters/answer/7687615 (checked 15 November 2026)
- Generative AI performance report, Search Console Help, https://support.google.com/webmasters/answer/16984139 (from the 15 November 2026 connector research; not re-read for this guide)
- No official Google Search Console MCP server found, web search on 15 November 2026 (third-party servers only)
