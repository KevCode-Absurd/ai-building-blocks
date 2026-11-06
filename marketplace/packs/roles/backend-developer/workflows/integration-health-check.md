# Integration and API health check

**Cadence:** Monthly, plus straight away after a provider's deprecation or API version notice, a spike in failed webhooks, or a customer report of a duplicate charge, email or record. About two hours for a small app with a handful of integrations.

## Steps

1. **List what is connected (level 1).** For each integration: provider, API version pinned, event types subscribed, endpoint URL, which account or key it uses, owner, and when its secret was last rotated.
2. **Read delivery logs (level 1).** Failed and retried webhook deliveries in each provider's dashboard since the last check. Shopify removes a subscription after repeated failures, so confirm every expected subscription still exists.
3. **Check the dedupe and failure tables (level 1).** Events stuck in "failed", sync failures waiting for a person, and any event IDs processed twice.
4. **Reconcile a sample (level 1).** Pick recent payments, orders or records in the provider and confirm each exists once in the client's database, with the right status.
5. **Check API traffic (level 1).** Error rates by route, 429s returned and received, slow endpoints, and slow queries in the database.
6. **Check versions and notices (level 1).** Provider API version and deprecation notices, runtime and framework support dates (for example, Node.js 20 is end of life), and the "What changes fast" table in `knowledge.md`.
7. **Check access (level 1).** Keys and connector sessions belonging to people who left, scopes wider than needed, MCP servers in read-only mode where they should be, and branch protection and environment reviewers still on.
8. **Fix what slipped (level 2).** Use the relevant skill (`webhook-receiver`, `third-party-api-client`, `api-endpoint-build`, `safe-database-migration`) and open a pull request with tests. *Approval: a named reviewer on the client's team approves.*
9. **Apply fixes (level 3).** Within the agreed limits, deploy through the client's pipeline, replay failed events from the provider's dashboard or CLI, and re-run failed syncs. Bulk replays, deleting duplicate records or any destructive data fix need a fresh yes and a backup first.
10. **Report.** One page: integrations healthy, fixed and at risk; failed events and how they were resolved; reconciliation results; upcoming deprecations; access changes needed; every action taken from the log.

## Outputs

- Integration register with versions, owners and secret rotation dates
- Delivery and failure summary
- Reconciliation sample results
- Pull requests for fixes
- One-page monthly report with the action log

## Needs the client's approval

Every pull request (a named reviewer), bulk replays, deleting or merging duplicate records, any destructive data fix (fresh yes and a backup first), rotating or changing secrets, changes to scopes, accounts or event subscriptions, and upgrading a pinned provider API version. Refunds and payouts stay with the client. The client can lower the access level at any time.
