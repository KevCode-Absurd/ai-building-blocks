---
name: ad-and-store-data-connections
description: "Connects a store's Meta Ads, Google Ads, Shopify and GA4 data so AI tools can read it safely: read-only access by default, secrets created and kept by the owner outside code and chat, and a small results table that stores each day's numbers with the attribution setting they were pulled under. Offers a no-code path through official connectors and scheduled exports for owners who cannot run developer set-ups, and a developer path through the platforms' APIs. Includes checks that the connected numbers match the store's own sales, and a fix list for the common connection errors. Use before any AI ad or reporting job, when a connection breaks, or when staff change."
---

# Connect ad accounts and store data for AI work

**You get:** read-only connections to Meta Ads, Google Ads, Shopify and GA4, with an access log, a daily results table holding a first week of data, a check table and a fix list, ready for AI audits and reports.

Read access to Meta, Google Ads, Shopify and GA4, a results table the next jobs can trust, and a fix list for when a connection breaks. Read-only unless the client asks for more in writing.

## When to use

- Before an AI agent or analyst runs any ad audit, daily check or report.
- A connection broke (expired token, lost permission) and reports stopped.
- A staff member or agency with access is leaving, so access moves and secrets rotate.
- The store wants one table of daily ad and order numbers instead of screenshots.

## Not for

- Fixing the Meta pixel and Conversions API: use `store-meta-capi`.
- Deciding which attribution setting to trust: use `store-meta-attribution`.
- Running the daily checks once data flows: use `ad-ops-schedule-runner` and `daily-ad-account-review`.
- Gross profit per purchase and break-even lines: use `store-meta-math`; this skill only stores its inputs.

## What you need

Required:

1. **Owners present**: the person who is admin of the Meta business portfolio, the Google Ads account (and manager account if one exists), Shopify, and GA4. They create every login, key and token themselves.
2. **Account ids**: Meta ad account id(s), Google Ads customer id(s), the Shopify store domain, the GA4 property id.
3. **A results store**: a Google Sheet for the no-code path, or a database for the developer path (a SQLite file, or a free tier of Postgres or BigQuery).
4. **The time zone and currency** of each ad account and of the store.

Optional: a Google Cloud project (developer path), the store's secret manager.

The agent never asks for, receives or repeats a password, API key, token or one-time code. If one is pasted, the agent does not use it and tells the owner to change it.

## Before you start: the gates

1. **Gross profit per purchase.** Not needed to connect, but the results store must have a cost table (landed cost per SKU, fulfilment, fees, return rate) so later jobs can compute it. Pass when the table exists, even if empty.
2. **Cash.** Every step here works on free tiers. Paid connectors are optional; say so before any is suggested.
3. **Capacity.** Name who keeps the connection running. With nobody to fix code, choose the no-code path.
4. **Tracking trust.** Connections copy numbers; they do not make them true. Step 7 checks the main conversion before anyone uses the data.

## Steps

### 1. Choose the path

- **No-code (default for most owners):** official connectors or MCP servers in the AI tool, plus scheduled exports into a Google Sheet.
- **Developer:** the platforms' APIs, run on a schedule, writing to a database.

Pick no-code unless someone can maintain code and data is needed more than daily.

### 2. Set least-privilege access

- **Meta:** in Business settings, give the person or system user view-performance access to the ad account only; analysis needs nothing more.
- **Google Ads:** add the user with the Read only access level. The Google Ads API has no read-only scope, so the access level on the account is what keeps it read-only.
- **Shopify:** a custom app with read scopes only (for example `read_orders`, `read_products`, `read_reports` where available), created and installed by the owner; or the official connector.
- **GA4:** Viewer role on the property.

Record each grant in an access log: platform, who or what, level, date, granted by, review date.

### 3. Keep secrets out of code and chat

- Secrets live in environment variables, the operating system's keychain or a cloud secret manager; never in code, the results sheet, chat or email.
- Add the secrets file to `.gitignore` before the first commit.
- One set of secrets per store; never reuse one client's token for another.
- Rotate on any staff or agency exit, and at least yearly (practitioner default).

### 4. No-code path

- Connect the AI tool's official Meta Ads, Google Ads, Shopify and GA4 connectors where they exist; each opens the platform's own sign-in for the owner.
- Schedule exports where no connector exists: Meta Ads Manager's scheduled reports by email, Google Ads scheduled reports to email or Google Sheets, Shopify report exports. Save each into the results sheet's raw tab with the date received.
- Google's free Looker Studio connectors read Google Ads and GA4 directly into a dashboard if the team wants one.

### 5. Developer path

- **Meta Marketing API:** add the Marketing API product to an app owned by the store's business portfolio. Use a system user token, created by the owner, for anything scheduled; tokens made in the Graph API Explorer last about an hour, and exchanged long-lived user tokens about 60 days. Request `ads_read` only; `ads_management` (write) only after a written client yes. Check scopes and expiry in Meta's access token debugger. The Ad Library API needs its own personal token and identity verification. Pull insights by day at campaign, ad set and ad level, with the attribution setting stated.
- **Google Ads API:** enable the API in a Google Cloud project; create an OAuth client of the desktop type and use a local loopback redirect (the old copy-paste code flow is retired). Get the developer token from the manager account's API Center; test access works only on test accounts, so apply for Basic access before reading a live account. Set the consent screen to production (or internal), or refresh tokens expire after 7 days. Send the manager id as the login customer id and run metric queries against the client account, never the manager. Spend arrives in micros: divide by 1,000,000.
- **Shopify Admin API (GraphQL):** read orders with created date, totals, discounts, shipping, refunds, line items and customer order count.
- **GA4 Data API:** a service account added as Viewer, pulling sessions and purchases by day, landing page and channel.
- **Start-up check:** the job refuses to run if any credential in a set is missing (all or none), then makes one live test call (for example the top 5 campaigns by spend over the last 7 days) before the first scheduled run. Code that compiles has not proven the API accepts it; only a live call does.

### 6. Build the results tables

| Table | Columns |
|---|---|
| `ad_daily` | date, platform, account_id, campaign_id, campaign_name, adset_or_adgroup, spend, impressions, clicks, platform_purchases, platform_value, attribution_setting, currency, time_zone, pulled_at |
| `store_daily` | date, orders, new_customer_orders, net_sales, shipping_charged, refunds, discounts, pulled_at |
| `costs` | sku, landed_cost, fulfilment_per_order, payment_fee_pct, return_rate, updated_at, source |
| `sync_log` | run_at, source, rows, status, error |

Rules:

- Store the attribution setting with every ad row. Meta reports differ widely by setting; 7-day click (or 7-day click plus 1-day engaged view) is the default to pull [MEA-0042] [ADC-0027].
- Re-pull the last 7 days every run. Google credits conversions to the click date, so recent days fill in later [MEA-0051]; Meta restates within its window too.
- Store net sales plus shipping charged as cash collected, not total sales (which includes tax) [MEA-0010].
- Convert to one currency and one time zone in a view, never by overwriting raw rows.
- Meta returns purchases inside an actions list; read the item whose action type is purchase, not the first value.
- Change the schema only through numbered migration files; never edit one that has already run. Add indexes for how the tables are read (date, account).
- Every row carries a store id, and each job can read only its own store's rows. Give jobs a restricted database role, never an admin key that skips access rules.
- Log each run's AI and tool cost in `sync_log`.

### 7. Check the data before anyone uses it

- **Store:** order count and net sales in `store_daily` match Shopify Analytics for the same 7 days within 1%.
- **Google Ads:** one primary purchase conversion action. GA4-imported purchases as primary undercount by about 20% against the Shopify or tag source, and two primaries double count [MEA-0017]. GA4 as primary is a common leak [GAD-0042].
- **GA4:** conversion rate filtered to purchase, not "any key event" [MEA-0002]; data retention set to 14 months [MEA-0003]. Shopify sessions run higher than GA4 because they include bots [MEA-0012].
- **Meta:** platform purchases against store orders for the same days; hand gaps to `store-meta-attribution`.

Mark each check pass or fail in the sync log. Do not hand data to other jobs while the store check fails.

### 8. Fix list for common errors

| Platform | Error | Usual cause | Fix |
|---|---|---|---|
| Meta | 190, invalid or expired token | Token expired, password change, user removed | Owner creates a new system user token |
| Meta | 200 or 10, permission | System user not assigned to the ad account, or app lacks `ads_read` | Owner assigns the asset and permission |
| Meta | 17 or 80004, rate limit | Too many calls | Back off, request fewer fields, use async reports |
| Meta | 100, invalid parameter | Field changed in a new version, or an object-only field (such as delivery status) sent to insights | Check the changelog; read status on the campaign, not insights |
| Meta | Empty results | Future dates, wrong country filter, account id stored with its prefix | Fix the date range or filter; store the numeric id only |
| Meta | Account disabled | Policy restriction | Owner checks Account Quality and requests review |
| Google Ads | DEVELOPER_TOKEN_NOT_APPROVED | Token has test access only | Apply for Basic access, or use a test account |
| Google Ads | USER_PERMISSION_DENIED | Missing login customer id, or no access | Send the manager id as login customer id; owner grants access |
| Google Ads | invalid_grant | Refresh token expired or revoked; consent screen in testing | Set consent screen to production; owner signs in again |
| Google Ads | RESOURCE_EXHAUSTED | Quota or rate limit | Back off and batch queries |
| Google Ads | Manager account error | Metrics query sent to the manager | Query the client id |
| Shopify | 401 or 403 | App uninstalled, token revoked, missing scope | Owner reinstalls or adds the read scope |
| Shopify | 429 | Throttled | Respect the cost limits and retry with backoff |
| GA4 | 403 | Service account not on the property | Owner adds it as Viewer |

On any error, write it to the sync log, stop that source, and tell the owner in plain words what they need to do. Never retry with a different account or wider permission without a yes.

### 9. Hand over

Give the owner the access log, where secrets live (not the secrets), the results tables, the check results, the fix list, and a review date for access.

## Checks before you hand it over

- Every grant is read-only unless the client asked otherwise in writing, and is logged.
- No secret appears in code, chat, email, the tables or this handover.
- A live test call passed; store numbers match Shopify Analytics within 1% for the test week.
- Google Ads has exactly one primary purchase conversion.
- Every ad row carries its attribution setting, currency, time zone and store id; the last 7 days are re-pulled each run.
- A named person maintains the connection.

## Output

1. **One-screen summary:** what is connected, at what access level, the check results, and anything the owner must still do.
2. **Access log:** Platform, Principal, Level, Granted by, Date, Review date.
3. **Results tables** as set out in step 6, with a first week of data.
4. **Check table:** Check, Result, Pass or fail, Date.
5. **Fix list** for errors, as in step 8, kept with the tables.

## Common mistakes

- **Admin access for a reporting job.** Step 2 grants read-only.
- **Tokens pasted into chat or code.** Step 3 keeps them with the owner.
- **Testing-mode OAuth.** Tokens die after 7 days; step 5 moves the consent screen to production.
- **Numbers without their attribution setting.** Step 6 stores it on every row [MEA-0042].
- **Reading yesterday as final.** Step 6 re-pulls 7 days [MEA-0051].
- **Two primary conversions in Google Ads.** Step 7 checks for one [MEA-0017].

## Sources

- ADC-0027: default Meta setting of 7-day click plus 1-day engaged view.
- GAD-0042: GA4 as primary conversion is a common leak.
- MEA-0002, MEA-0003: GA4 purchase filter and 14-month retention.
- MEA-0010: cash collected is net sales plus shipping.
- MEA-0012: Shopify sessions include bots.
- MEA-0017: one primary purchase conversion in Google Ads.
- MEA-0042: report Meta on 7-day click.
- MEA-0051: Google credits the click date; recent days fill in.

What makes this skill ours: access is read-only by default, with Google Ads kept read-only through the account's access level because its API has no read-only scope; secrets stay with the owner; every stored number carries its attribution setting and is re-pulled for a week; and the data is checked against the store's own sales before any job may use it.
