---
name: shopify-admin-b2b-company-overview
role: customer-ops
description: "Read-only: lists B2B company accounts with locations, catalogs, and payment terms for wholesale management."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - companies:query
  - companyLocations:query
status: stable
compatibility: Claude Code, Cursor, Codex, Gemini CLI
---

## Purpose
Queries all B2B company accounts and their associated locations, price lists, and payment terms. Provides a consolidated view of the wholesale account portfolio for ops and sales teams. Read-only — no mutations. Requires Shopify B2B (available on Shopify Plus).

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_customers`
- API scope: `read_customers` only. Use exactly this scope in the auth command above. We have not confirmed against Shopify's current docs that this one scope covers the B2B `companies` and `companyLocations` queries. If the first run fails with an access error that names a different read scope, stop, show the user the exact error, and let the store owner decide. Never request a write scope.
- Store must be on Shopify Plus with B2B enabled

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time.

## Workflow Steps

1. **OPERATION:** `companies` — query
   **Inputs:** `first: 250`, select `name`, `locationsCount`, `contactsCount`, `createdAt`, the latest order (date and value), pagination cursor
   **Expected output:** All B2B company accounts (with counts of locations and contacts, and the date and value of the latest order); paginate until `hasNextPage: false`. This query does not return payment terms or catalogs, so Step 2 fills those in, once per company ID from this step.

2. **OPERATION:** `companyLocations` — query, run once for each company ID from Step 1
   **Inputs:** `first: 250` per company, select `name`, `buyerExperienceConfiguration { paymentTermsTemplate, checkoutToDraft }`, `catalogsCount`
   **Expected output:** Company locations with payment and catalog configuration

## GraphQL Operations

```graphql
# companies:query — validated against api_version 2025-01
query B2BCompanies($after: String) {
  companies(first: 250, after: $after) {
    edges {
      node {
        id
        name
        note
        createdAt
        updatedAt
        locationsCount {
          count
        }
        contactsCount {
          count
        }
        orders(first: 1, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              createdAt
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

```graphql
# companyLocations:query — validated against api_version 2025-01
query CompanyLocationsDetail($companyId: ID!) {
  company(id: $companyId) {
    id
    name
    locations(first: 50) {
      edges {
        node {
          id
          name
          shippingAddress {
            countryCode
            city
          }
          buyerExperienceConfiguration {
            paymentTermsTemplate {
              name
              dueInDays
            }
            checkoutToDraft
          }
          catalogsCount {
            count
          }
        }
      }
    }
  }
}
```

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: B2B Company Overview                 ║
║  Store: <store domain>                       ║
║  Started: <YYYY-MM-DD HH:MM UTC>             ║
╚══════════════════════════════════════════════╝
```

**After each step**, emit:
```
[N/TOTAL] <QUERY|MUTATION>  <OperationName>
          → Params: <brief summary of key inputs>
          → Result: <count or outcome>
```

**On completion**, emit:

For `format: human` (default):
```
══════════════════════════════════════════════
B2B COMPANY OVERVIEW
  Total companies:   <n>
  Total locations:   <n>
  With net terms:    <n>
  With catalogs:     <n>

  Company: <name>
    Locations: <n>  |  Last order: <date>
    Payment terms: <terms name, or none>
  Output: b2b_companies_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "b2b-company-overview",
  "store": "<domain>",
  "total_companies": 0,
  "total_locations": 0,
  "companies": [],
  "output_file": "b2b_companies_<date>.csv"
}
```

## Output Format
CSV file `b2b_companies_<YYYY-MM-DD>.csv` with columns:
`company_id`, `company_name`, `locations_count`, `contacts_count`, `last_order_date`, `last_order_value`, `currency`, `payment_terms`, `has_catalog`

A company with no orders still gets a row. Its `last_order_date`, `last_order_value` and `currency` are left empty.

One row per company, so a company with several locations needs one rule: `payment_terms` lists each different terms name found across its locations, joined with "; " (for example "Net 30; Net 60"), and `has_catalog` is true if any location has a catalog. If a company has no payment terms on any location, write "none". Tell the user to check multi-location companies in Shopify admin.

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| Empty companies list | B2B not configured or no accounts | Exit with 0 companies, note B2B Plus requirement |
| `companies` query not available | Store not on Shopify Plus | Return clear error: B2B requires Shopify Plus |
| Access denied or partial data | The store did not grant `read_customers`, or your login cannot see B2B company data | Stop and show the user the exact error text. Do not add other scopes yourself. The store owner can grant access or confirm which read scope Shopify names in its error |

## What next

After the CSV is saved: (1) list accounts with no orders in 90 days and plan outreach; (2) check each account's catalog before a price change. Both are done by reading the CSV, not by this skill.

## Best Practices
- Run monthly as a wholesale account health check — companies with no orders in 90+ days may need outreach.
- `checkoutToDraft: true` means the buyer must have orders approved before payment — useful for understanding which accounts require manual order review.
- For companies with multiple locations but only one catalog, check if the catalog is correctly scoped to each location.
- This skill requires Shopify B2B (Shopify Plus feature) — it will return an empty result or an error on non-Plus stores.
