---
name: pipeline-spec-from-tools
description: Writes a pipeline spec that moves a firm's tools (shop, payments, CRM, ads, bookings) into one warehouse or Postgres database - a source table with objects, join keys, sync tool, load method (full or incremental, cursor or change data capture), delete handling, lookback for late data, schedule and freshness promise, the raw-staging-mart layout, checks after each load, personal-data exclusions and spend caps for BigQuery or Snowflake. Writing the spec is level 1 or 2; switching connectors and schedules on is level 3, and new paid connectors or higher spend need a fresh yes. Use it for a first warehouse or when adding sources.
---

# Pipeline spec from your tools

## When to use

- "We use Shopify, Stripe, HubSpot and Google Ads. We want one place for weekly reports."
- A first warehouse, or adding a new source to an existing one.
- A pipeline built in a hurry that nobody can explain.

## What you need

1. The tools, and the three to five reports that matter most.
2. For each tool: the objects needed (orders, customers, payments, refunds, campaigns) and rough rows per month.
3. The destination (BigQuery, Snowflake or Postgres) and its region, or "help me choose".
4. How fresh the numbers must be, and when people read them.
5. The totals the business already trusts for each report.
6. Columns with personal data, and whether any report needs them.
7. Access: level 1 to read connectors and schemas; level 2 to set up paused connectors and a development dataset; level 3 to switch connectors and schedules on within your limits. New paid connectors and spend increases need a fresh yes.

## Steps

### 1. Start from the reports

For each report, list the numbers and the objects they need. Anything no report needs stays out of the first version.

### 2. Inventory the sources

One row per object: tool, object, primary key, the keys that join it to other objects (order ID, customer ID, email hash), how it changes (append-only, updated, deleted), and volume.

### 3. Choose the sync method

- A managed connector (Fivetran, Airbyte) where one exists; a scheduled script only where none does.
- Load method per object: full refresh for small lookup tables; incremental (cursor or change data capture) for large or growing ones. Airbyte names its modes full refresh overwrite or append, incremental append, and incremental append with deduplication on a primary key [28].
- Deletes: soft delete (rows flagged), live copy, or full history. Fivetran calls these soft delete, live and history modes, with live and history only on some connectors [27].
- Late data: how far back changes can arrive (refunds, chargebacks, ad conversions) and the lookback to reload each run.

### 4. Set the schedule from the freshness promise

Match the schedule to when people read the numbers, not to "real time". Weekly reports rarely need hourly syncs. Write the promise ("orders loaded by 06:00 UK time each day") and check freshness at least twice per promise period [5].

### 5. Lay out the layers

- **Raw:** one schema per source, untouched, with a load timestamp.
- **Staging:** one model per source table: rename, cast, convert units, filter soft-deleted rows; no joins [6].
- **Intermediate:** joins and logic, each with one purpose.
- **Marts:** the tables reports read, each with a stated grain.

### 6. Write the checks after each load

Rows in at the source versus rows landed, per object and day; freshness per source; key tests on staging; at least one total per mart tied to a trusted source report. A mismatch blocks the reports that depend on it [25][26].

### 7. Keep personal data out

List columns that hold names, emails, phone numbers, addresses or free text. Exclude them in the connector where possible, or drop or hash them in staging. Note any retention period to apply with table or partition expiry [17][29].

### 8. Cap spend

BigQuery: maximum bytes billed on jobs and a daily quota per project or user, plus a billing budget alert [15]. Snowflake: a resource monitor on each warehouse with a buffer below the real limit, a budget for serverless and AI features, and a low auto-suspend [19][21]. Write the caps into the spec as numbers the client sets.

### 9. Release plan

Level 2: connectors created paused, a development dataset, models on a branch. Level 3: after the client's yes on the action list and limits, switch on in order (sources, then staging, then marts), watch the first loads and log them.

## Checks

- Every object is needed by a named report.
- Each object has a key, a load method, delete handling, a lookback and a schedule.
- The freshness promise is written and checked at least twice per period.
- Raw is untouched; staging has no joins.
- Row-count, freshness, key and tie-out checks are listed.
- Personal columns are excluded or justified.
- Spend caps are in the spec; new paid connectors and higher caps are flagged for a fresh yes.
- No secrets anywhere in the spec.

## Output format

```
# Pipeline spec: [firm], version [n], [date]
Destination: [warehouse, region]   Freshness promise: [x]

| Tool | Object | Key | Joins on | Load method | Deletes | Lookback | Schedule | Rows/month |

## Layers (raw, staging, intermediate, marts with grain)
## Checks after each load
## Personal data excluded
## Spend caps
## Release steps and access level per step
## Needs a fresh yes
```

## Example of good output (short)

*Made-up business: Harbour & Hearth, an online homeware shop in Ireland.*

> Destination: BigQuery, EU multi-region. Freshness promise: orders and payments loaded by 06:00 Irish time daily.
>
> | Tool | Object | Key | Joins on | Load | Deletes | Lookback | Schedule |
> |---|---|---|---|---|---|---|---|
> | Shopify | orders | order_id | customer_id | incremental, cursor on updated_at | soft delete | 3 days | daily 04:30 |
> | Stripe | charges, refunds | charge_id | order_id in metadata | incremental | soft delete | 14 days (refunds arrive late) | daily 04:30 |
> | Google Ads | campaign stats by day | campaign_id + date | campaign_id | incremental | none | 7 days (conversions update) | daily 05:00 |
>
> Marts: `fct_orders` (one row per order), `fct_daily_marketing` (one row per campaign per day).
> Checks: Stripe charges per day vs landed rows; `fct_orders` revenue vs the Shopify sales report for last week.
> Excluded: customer names, emails, phone numbers and shipping addresses (no report needs them).
> Spend: maximum bytes billed on every scheduled query and a daily project quota, values set by you. Turning on the paid Google Ads connector needs your yes.
