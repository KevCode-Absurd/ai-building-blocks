---
name: shopify-admin-shipping-rate-audit
role: fulfillment-ops
description: "Read-only: walks every delivery profile and zone to verify each has at least one valid shipping rate, surfacing zones with no rates or only manual rates."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - deliveryProfiles:query
status: stable
compatibility: Claude Code, Cursor, Codex, Gemini CLI
---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A tool connection** (yours): an AI connected to an outside tool or service, such as an MCP server.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a tool connection. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Purpose
Audits the shipping configuration for every delivery profile on the store. Surfaces (a) zones with zero shipping rates configured (causing checkout failures), (b) zones with only manual flat rates (no carrier-calculated rates, often a missed setup step), and (c) profiles with no zone coverage for known sales geographies. A misconfigured zone silently drops checkout conversions — this skill catches it before customers do. Read-only — no mutations.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_shipping`
- API scopes: `read_shipping`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| profile_filter | string | no | — | Optional delivery profile name to scope the audit |
| flag_manual_only | bool | no | true | Flag zones that have only manual rates (no carrier-calculated rates) |
| flag_high_price | float | no | — | Optional: flag any rate above this price (likely typo or stale) |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time. The skill reads delivery configuration only; it does not change any shipping behavior.

## Workflow Steps

1. **OPERATION:** `deliveryProfiles` — query
   **Inputs:** `first: 50`, select `profileLocationGroups`, `profileItems`, `name`, `default`, pagination cursor
   **Expected output:** All delivery profiles, including the default, with location groups and product associations; paginate until `hasNextPage: false`

2. For each profile, walk every `profileLocationGroups[].locationGroupZones`. For each zone, capture: zone name, country codes, method definitions (rates).

3. Flag zones with: zero `methodDefinitions`, OR only manual rates (no carrier-calculated method when `flag_manual_only: true`). Class each method by its `rateProvider.__typename` in the query: `DeliveryRateDefinition` is a manual rate, and `DeliveryParticipant` is a carrier-calculated rate, OR a method whose `price.amount > flag_high_price` if the threshold is set.

4. Aggregate findings per profile, then build a global summary of misconfigured zones across the store.

## GraphQL Operations

```graphql
# deliveryProfiles:query — validated against api_version 2025-01
query DeliveryProfilesAudit($after: String) {
  deliveryProfiles(first: 50, after: $after) {
    edges {
      node {
        id
        name
        default
        profileItems(first: 1) {
          edges {
            node {
              id
            }
          }
        }
        profileLocationGroups {
          locationGroup {
            id
            locations(first: 50) {
              edges {
                node {
                  id
                  name
                  address {
                    countryCode
                  }
                }
              }
            }
          }
          locationGroupZones(first: 50) {
            edges {
              node {
                zone {
                  id
                  name
                  countries {
                    code {
                      countryCode
                    }
                    provinces {
                      code
                    }
                  }
                }
                methodDefinitions(first: 50) {
                  edges {
                    node {
                      id
                      name
                      active
                      rateProvider {
                        __typename
                        ... on DeliveryRateDefinition {
                          price {
                            amount
                            currencyCode
                          }
                        }
                        ... on DeliveryParticipant {
                          carrierService {
                            id
                            name
                          }
                          fixedFee {
                            amount
                            currencyCode
                          }
                          percentageOfRateFee
                        }
                      }
                    }
                  }
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

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: Shipping Rate Audit                  ║
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
SHIPPING RATE AUDIT
  Profiles inspected:    <n>
  Zones inspected:       <n>
  Zones with no rates:   <n>
  Zones manual-only:     <n>
  Rates above threshold: <n>

  Critical issues (zero-rate zones):
    Profile: <name>  Zone: <name>  Countries: <list>
  Output: shipping_rate_audit_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "shipping-rate-audit",
  "store": "<domain>",
  "profiles_inspected": 0,
  "zones_inspected": 0,
  "zones_no_rates": 0,
  "zones_manual_only": 0,
  "rates_above_threshold": 0,
  "issues": [],
  "output_file": "shipping_rate_audit_<date>.csv"
}
```

## Output Format
CSV file `shipping_rate_audit_<YYYY-MM-DD>.csv` with columns:
`profile_name`, `zone_name`, `countries`, `rate_count`, `manual_rate_count`, `carrier_rate_count`, `min_rate`, `max_rate`, `currency`, `flag`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Order picking, packing and shipping planner](https://useaiblocks.com/skills/pick-pack-and-ship-improver). It takes the audit report.
- The [Product field bulk editor](https://useaiblocks.com/skills/product-field-bulk-editor). It takes the audit report.
- The [Stock count updater](https://useaiblocks.com/skills/stock-count-updater). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| Profile has no products | Empty profile | Note in output, do not flag as critical |
| Zone has only `DeliveryRateDefinition` (no carrier) | Manual rates only | Flag if `flag_manual_only: true` |
| Country list is null on a zone | Rest-of-world catch-all zone | Treat as wildcard, do not flag for missing countries |

## Best Practices
- Run after any major shipping change (new region launch, carrier switch) to confirm zone coverage matches the rollout plan.
- Zero-rate zones cause silent checkout failures — customers from that geography see "no shipping available" and abandon. Treat these as P0.
- Manual-only zones are not always wrong — flat-rate domestic shipping is a deliberate choice. Use `flag_manual_only: false` if your store is intentionally flat-rate.
- Optional: cross-reference flagged country codes with `customers:query` filtered by country to estimate revenue at risk. This needs the extra `read_customers` scope, which this read-only setup does not ask for, so skip it unless the user grants that scope.
- Run quarterly to catch zones added by app integrations or staff that drift from the documented configuration.
