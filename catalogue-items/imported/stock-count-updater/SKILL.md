---
name: shopify-admin-inventory-adjustment
role: merchandising
description: "Apply inventory quantity adjustments to specific variants at specific locations — after a cycle count, 3PL return batch, or sync discrepancy correction."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - productVariants:query
  - inventoryAdjustQuantities:mutation
status: stable
compatibility: Claude Code, Cursor, Codex, Gemini CLI
---

**Source check by AI Blocks, 28 Oct 2026:** The [Shopify store auth reference](https://shopify.dev/docs/api/shopify-cli/store/store-auth) requires --store and comma-separated --scopes. Replace REQUIRED_SCOPES with the least permissions for the actual queries and mutations; confirm them in the Admin API reference before signing in. Do not run a command with placeholders. Complete browser sign-in yourself and keep tokens out of chat and logs. This is a documentation check, not a store login or live API test.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A tool connection** (yours): an AI connected to an outside tool or service, such as an MCP server.

**Makes it better (optional):**
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.
- **An audit report** (yours): findings with evidence, severity, missing inputs and next actions.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a tool connection, a spreadsheet, an audit report. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Purpose
Applies inventory quantity corrections to specific variants at specific locations — the programmatic equivalent of manually editing inventory in the Shopify admin. Use after a cycle count reveals discrepancies, after a 3PL return batch posts late, or after a stock check, such as the Stock sync error finder, finds Available/Committed drift. Replaces manual row-by-row inventory editing in the Shopify admin.

## Prerequisites
- `shopify store auth --store <domain> --scopes <REQUIRED_SCOPES>`
- API scopes: `read_products`, `write_inventory`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| format | string | no | human | Output format: `human` or `json` |
| dry_run | bool | no | true | Preview operations without executing mutations. Set it to false only after the user has seen the preview and said yes |
| adjustments | array | yes | — | Array of `{sku, location_id, delta}` objects. `delta` is the signed quantity change (e.g., `+5` to add 5 units, `-3` to remove 3) |
| reason | string | no | `correction` | Adjustment reason logged to audit trail: `correction`, `cycle_count`, `damaged`, `received`, `reservation_created`, `reservation_deleted`, `shrinkage` |
| reference_document_uri | string | no | — | URI to link the adjustment to a PO, return, or cycle count document |

The adjustments can come from a sync error report, such as one from the Stock sync error finder. Use its list of count differences as the starting adjustments.

## Safety

> ⚠️ Step 3 executes `inventoryAdjustQuantities` which immediately changes live inventory quantities. Incorrect adjustments can cause overselling (if you reduce too far) or inflated stock counts (if you add incorrectly). Run with `dry_run: true` to see the before/after quantities per SKU before committing. The `reason` field is logged permanently in Shopify's inventory activity history.

## Workflow Steps

1. **OPERATION:** `productVariants` — query
   **Inputs:** For each `{sku}` in `adjustments`: look up the variant by SKU to get its `inventoryItem.id`; also fetch current `inventoryQuantity` for before/after comparison
   **Expected output:** Map of `{sku → inventoryItemId, currentQuantity}` for all adjustment targets; abort if any SKU is not found

2. **Confirm before writing:** show the before and after quantity for every SKU and location. Do not run step 3 until the user clearly says yes to that exact preview.

3. **OPERATION:** `inventoryAdjustQuantities` — mutation
   **Inputs:** `changes` array of `{inventoryItemId, locationId, delta, ledgerDocumentUri}` using the reason and reference_document_uri parameters
   **Expected output:** `inventoryAdjustmentGroup.changes` with `quantityAfterChange` per item; `userErrors`

## GraphQL Operations

```graphql
# productVariants:query — validated against api_version 2025-01
query VariantBySku($first: Int!, $query: String) {
  productVariants(first: $first, query: $query) {
    edges {
      node {
        id
        sku
        inventoryQuantity
        inventoryItem {
          id
          tracked
        }
        product {
          title
        }
      }
    }
  }
}
```

```graphql
# inventoryAdjustQuantities:mutation — validated against api_version 2025-01
mutation InventoryAdjustQuantities($input: InventoryAdjustQuantitiesInput!) {
  inventoryAdjustQuantities(input: $input) {
    inventoryAdjustmentGroup {
      id
      reason
      changes {
        name
        delta
        quantityAfterChange
        item {
          id
          sku
        }
        location {
          id
          name
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
```

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: inventory-adjustment                 ║
║  Store: <store domain>                       ║
║  Started: <YYYY-MM-DD HH:MM UTC>             ║
╚══════════════════════════════════════════════╝
```

**After each step**, emit:
```
[N/TOTAL] <QUERY|MUTATION>  <OperationName>
          → Params: <brief summary of key inputs>
          → Result: <count or outcome, e.g., "143 records returned">
```

If `dry_run: true`, prefix every mutation step with `[DRY RUN]` and do not execute it.

**On completion**, emit:

For `format: human` (default):
```
══════════════════════════════════════════════
OUTCOME SUMMARY
  SKUs adjusted:        <value>
  Total units added:    <value>
  Total units removed:  <value>
  Errors:               <count, 0 if none>
  Output:               <filename or "none">
══════════════════════════════════════════════
```

For `format: json`, emit a JSON object with this schema:
```json
{
  "skill": "inventory-adjustment",
  "store": "<domain>",
  "started_at": "<ISO8601>",
  "completed_at": "<ISO8601>",
  "dry_run": true,
  "steps": [
    {
      "step": 1,
      "operation": "<OperationName>",
      "type": "query|mutation",
      "params_summary": "<string>",
      "result_summary": "<string>",
      "skipped": false
    }
  ],
  "outcome": {
    "skus_adjusted": 0,
    "total_units_added": 0,
    "total_units_removed": 0,
    "errors": 0,
    "output_file": "<filename|null>"
  }
}
```

## Output Format
CSV file `inventory-adjustments-<YYYY-MM-DD>.csv` with columns: `sku`, `product_title`, `location_name`, `quantity_before`, `delta`, `quantity_after`, `reason`.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Order hold manager](https://useaiblocks.com/skills/order-hold-manager). It takes the plan.
- The [Purchase order and reorder drafter](https://useaiblocks.com/skills/purchase-order-reorder). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| SKU not found | SKU doesn't exist in store | Verify SKU spelling; look the SKU up in the Shopify admin product list |
| `inventoryItem.tracked: false` | Variant has inventory tracking disabled | Enable tracking in Shopify admin before adjusting |
| `userErrors` from mutation | Invalid delta, invalid location, or permission issue | Check `write_inventory` scope and verify location GID |
| Delta would push quantity below 0 | Adjustment removes more than available | Confirm correct delta value; use negative delta only for known stock removals |

## Best Practices
1. Always run `dry_run: true` first — the before/after CSV preview lets you confirm every change before it hits live inventory.
2. Use `reason: cycle_count` with a `reference_document_uri` pointing to your count sheet — this creates a permanent audit trail in Shopify's inventory activity log.
3. Batch all corrections from a single count session into one command rather than applying one-at-a-time — the audit trail groups them under a single `inventoryAdjustmentGroup`.
4. After adjusting, check each location's quantity again in the Shopify admin, or run the Stock sync error finder, to confirm the differences are gone.
5. For 3PL return batches, use `reason: received` and link the return batch document URI — this makes reconciliation with your 3PL invoice straightforward.
