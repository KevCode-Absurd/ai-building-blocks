---
name: shopify-admin-publication-channel-audit
role: store-management
description: "Read-only: shows which products are published to which sales channels and flags unpublished active products."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - products:query
  - publications:query
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
Queries all active products and the publications (sales channels) they are visible on. Flags products that are active but missing from key channels (e.g., Online Store, Google Shopping, Meta). Prevents silent revenue loss from products that exist in the catalog but are invisible on sales channels. Read-only — no mutations.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_products,read_publications`
- API scopes: `read_products`, `read_publications`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| required_channels | array | no | ["Online Store"] | Channel names that all active products should be on |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time.

## Workflow Steps

1. **OPERATION:** `publications` — query
   **Inputs:** `first: 50`
   **Expected output:** All available publications (sales channels) with `id`, `name`

2. **OPERATION:** `products` — query
   **Inputs:** `query: "status:active"`, `first: 250`, select `publishedOnCurrentPublication`, `resourcePublications { publication { name } }`, pagination cursor
   **Expected output:** Active products with their channel publication status

3. For each product: check if it appears in each `required_channels` — flag if missing from any

## GraphQL Operations

```graphql
# publications:query — validated against api_version 2025-01
query SalesChannels {
  publications(first: 50) {
    edges {
      node {
        id
        name
        supportsFuturePublishing
        app {
          title
        }
      }
    }
  }
}
```

```graphql
# products:query — validated against api_version 2025-01
query ProductPublications($after: String) {
  products(first: 250, after: $after, query: "status:active") {
    edges {
      node {
        id
        title
        handle
        status
        resourcePublications(first: 20) {
          edges {
            node {
              publication {
                id
                name
              }
              publishDate
              isPublished
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
║  SKILL: Publication Channel Audit            ║
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
PUBLICATION CHANNEL AUDIT
  Active products:          <n>
  Sales channels found:     <n>
  Products missing channels: <n>

  Missing from "Online Store":
    "<product title>"  (<handle>)
  Output: publication_audit_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "publication-channel-audit",
  "store": "<domain>",
  "active_products": 0,
  "channels_found": 0,
  "missing_channel_count": 0,
  "output_file": "publication_audit_<date>.csv"
}
```

## Output Format
CSV file `publication_audit_<YYYY-MM-DD>.csv` with columns:
`product_id`, `title`, `handle`, `channel_name`, `is_published`, `publish_date`, `issue`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Product data gaps and catalogue review](https://useaiblocks.com/skills/monthly-catalogue-clean-up-keeper).
- The [Orphan product finder](https://useaiblocks.com/skills/orphan-product-finder).
- The [Online order fulfillment planner](https://useaiblocks.com/skills/online-order-fulfillment-planner). It takes the spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| Channel not found | Required channel not installed or renamed | Report channel as missing in summary |
| No active products | Empty catalog | Exit with 0 results |

## Best Practices
- Run after any bulk product import — products are not always published to all channels by default.
- For multi-channel stores, add all critical channels to `required_channels` to catch products missing from any of them.
- Products unpublished from a channel may be intentional (e.g., wholesale-only items) — review the flagged list before publishing.
- Pair with `product-data-completeness-score` — products with low data completeness scores should be fixed before being published to additional channels.
