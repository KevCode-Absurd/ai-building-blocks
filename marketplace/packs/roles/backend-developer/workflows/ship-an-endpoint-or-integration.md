# Ship an endpoint or integration, from brief to production

**Trigger:** A client needs a new endpoint, a webhook receiver, a sync with another service or a schema change, or an existing one is losing data or doing things twice. Usually a few days to two weeks of elapsed time.

## Steps

1. **Agree access (level 1 until answered).** Ask which level the client grants for each tool: code host, database, payment provider, store or CRM, logs. Connect only through official connectors, MCP servers or each tool's own sign-in. Record the "Access I have" list.
2. **Write the contract or flow (level 1).** For an endpoint, use the `endpoint-contract-table` prompt. For an integration, draw the flow and the names-to-confirm table (`webhook-receiver` or `third-party-api-client` skill, steps 1 and 2). *Approval: the client confirms who may call it, what happens twice, and the contract.*
3. **Design the data (level 1).** If tables change, use the `safe-database-migration` skill, steps 1 to 3, and classify every change as safe, locking or destructive.
4. **Build on a branch (level 2).** Use the `api-endpoint-build`, `webhook-receiver` or `third-party-api-client` skill. Work against the provider's sandbox with test keys and a development database.
5. **Test (level 2).** Happy path, each error, ownership, duplicate, race, retry and replay tests; run migrations up, down and up on a copy. Run the `what-happens-twice-review` and `api-security-review` prompts on the diff.
6. **Open the pull request (level 2).** Contract, code, migrations, tests, curl examples, "what happens twice" note and the go-live checklist from the `integration-go-live-checklist` prompt. *Approval: a named reviewer on the client's team approves.*
7. **Stage it (level 2 or 3).** Deploy to staging through the client's pipeline and run the curl examples and sandbox events there.
8. **Confirm the production action list.** Which environment, which migrations and their class, the rollback for each, live endpoints or schedules to register, who watches. *Approval: the client says yes before the first production deploy in the job.*
9. **Deploy to production (level 3).** Through the client's own pipeline, never from a laptop. Run safe migrations in order. Any destructive step (drop, truncate, delete, overwriting backfill) waits for its own fresh yes and a confirmed, recently tested backup, even within level 3.
10. **Prove and watch.** One controlled live action, checked end to end. Watch errors, webhook deliveries, duplicates and slow queries for the agreed period. If something unexpected happens, stop and ask.
11. **Hand over.** Contract, flow, run book (how to replay a failed event, how to re-run a sync, how to roll back), and the action log.

## Outputs

- "Access I have" list
- Contract table or flow sketch with names to confirm
- Pull request with code, migrations, tests and curl examples
- Review notes from the "what happens twice" and API security checks
- Confirmed production action list and go-live checklist
- Action log and run book

## Needs the client's approval

The access level for each tool; the contract and the "what happens twice" rules; every pull request (a named reviewer); the production action list before the first production deploy; a fresh yes for every destructive database step, with a tested backup first; and anything outside the agreed limits, such as new accounts, new environments, wider API scopes or changes to secrets and permissions. Refunds, payouts and changes to bank or payout details stay with the client. The client can lower the access level at any time.
