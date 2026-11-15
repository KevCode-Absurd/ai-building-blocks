# Give your agents access to Google Analytics

Your store agents read Google Analytics 4 (GA4) to see how shoppers who land on a page behave: sessions, bounce, add to cart and purchases, by page, device and traffic source. Callum, Gretchen, Annabel, Arjun, Stuart and Rustam all read it. They use Google's official Analytics MCP server, which is read-only. Facts were checked on 15 November 2026.

## What the agents do with it at each level

| Level | What the agents do |
|---|---|
| 1, read | List your accounts and properties, read property settings and custom dimensions, run standard, funnel and realtime reports. Used for baselines, day 7 and day 28 readouts, A/B test checks and event checks after a launch. |
| 2, draft | Nothing more in GA4. Reports and drafts live in the job folder. |
| 3, publish | Not possible through this server. Google says it cannot create, change or delete your Analytics settings. |

Read access is all these processes need.

## What you need first

- A GA4 property for your store, with purchase and add-to-cart events coming in (for example through Shopify's Google and YouTube app; the agents check this first).
- Administrator access on the GA4 account or property, so you can add a user.
- A Google Cloud project where you can turn on two APIs.
- The server runs on a computer, not on claude.ai in a browser. Use the Claude desktop app, Claude Code, or a hosted agent. You need Python's `pipx` (or `uvx`) installed.

## Way 1, in Claude (desktop app or Claude Code)

1. Turn on the APIs in your Google Cloud project:
   `gcloud services enable analyticsadmin.googleapis.com analyticsdata.googleapis.com --project=YOUR_PROJECT_ID`
2. Sign in with read-only scopes:
   `gcloud auth application-default login --scopes="https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/cloud-platform"`
   This saves a credentials file on your computer. Note its full path.
3. Add the server.
   - Claude Code:
     `claude mcp add analytics-mcp --scope user -e GOOGLE_APPLICATION_CREDENTIALS="FULL_PATH_TO_CREDENTIALS_JSON" -e GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID" -- pipx run analytics-mcp`
   - Claude desktop app: add an `analytics-mcp` entry to `claude_desktop_config.json` with command `pipx`, args `run analytics-mcp`, and the same two environment values. Use full paths; many apps do not expand `~`.
4. Restart Claude. The tools should appear: `get_account_summaries`, `get_property_details`, `get_custom_dimensions_and_metrics`, `run_report`, `run_realtime_report`, `list_google_ads_links`, and on newer versions `run_funnel_report`, `run_conversions_report` and `list_property_annotations`. Check the exact names in your tool list.
5. All of these only read, so they can be set to Always allow.

The Google account you sign in with needs at least the Viewer role on the property.

## Way 2, for hosted agents: a service account

1. In the Google Cloud console, turn on the Google Analytics Admin API and Google Analytics Data API for the project (same as step 1 above).
2. Go to IAM and admin > Service accounts and create one for the agents. Give it no Cloud roles.
3. Prefer keyless sign-in (impersonation with `--impersonate-service-account=SERVICE_ACCOUNT_EMAIL`, or your host's workload identity). If you must create a JSON key, put it straight into your host's secret store, which hands the agent its path at run time. Never commit it, paste it in a chat or email it.
4. In GA4, go to Admin, and under Property click Access management. Click +, then Add users. Enter the service account's email, choose Viewer, and click Add.
5. Set `GOOGLE_APPLICATION_CREDENTIALS` and `GOOGLE_CLOUD_PROJECT` as secrets in the host, and start the server with `pipx run analytics-mcp`.

## Safety switches on Google's side

- The server only reads. It has no tool that writes.
- The `analytics.readonly` scope cannot change anything.
- The Viewer role cannot edit the property, users or settings.

## Check it works

Ask the agent: "List my GA4 properties, then give me sessions and purchases for my store property for the last 7 complete days."

A good answer names your property and its id, gives the exact dates, and shows sessions and purchase events that match the GA4 Reports screen for the same dates. It notes that the last 1 to 2 days may still change, because GA4 daily data can take 24 to 48 hours to settle.

## Take access away

1. In GA4, go to Admin > Access management (under Property, or under Account if access was given there).
2. Search for the email, tick the box next to it, and click Remove. Removing a user fully may need the Administrator role at account level.
3. For a service account, also delete its keys in the Google Cloud console (Service accounts > the account > Keys), and remove the key from your host's secret store.
4. On your own computer, remove the server from Claude (`claude mcp remove analytics-mcp`, or delete its entry from `claude_desktop_config.json`), and revoke the saved login with `gcloud auth application-default revoke`.

## What stays manual, and why

- Any change to GA4 itself (events, key events, consent settings, links, users): the server cannot write, and changes to tracking or consent always need your fresh yes and are made by you or your tracking specialist.
- claude.ai in a browser cannot run this server, because it runs locally. Use the desktop app, Claude Code or a hosted agent.

## Sources

- Google Analytics MCP server, Google for Developers, https://developers.google.com/analytics/devguides/MCP (checked 15 November 2026)
- Add, edit and delete users, Google Analytics Help, https://support.google.com/analytics/answer/9305788 (checked 15 November 2026)
- GA4 data freshness, Google Analytics Help, https://support.google.com/analytics/answer/11198161 (from the 15 November 2026 connector research; not re-read for this guide)
