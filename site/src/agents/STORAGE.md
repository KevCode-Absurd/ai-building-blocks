# Authenticated expert-agent preview

This is a separate preview entry, `src/worker-expert-preview.ts`. The production entry, production configuration, existing OAuth code and migration 0010 are unchanged. Do not point this preview at the production database. Migration `0011_expert_agent_records.sql` is new and has only been exercised locally.

## Request path

On an independently configured preview domain, set `EXPERT_AGENTS_ENABLED="true"`, retain the existing API/OAuth security configuration, bind its own `SPACES` D1 database, and use the preview entry. Apply the existing migrations plus 0011 only to that preview database. A deployment/configuration and real host connection trial are still needed before anyone can use it remotely.

The preview exposes expert tools on `/mcp/personal` or the existing company endpoint shape. It delegates OAuth/discovery and other routes to the existing worker. The expert endpoint advertises its own tools; it does not yet compose public catalogue or saved-library tools into that same tool list. Those existing connections and the preparation adapter remain available separately. With the flag absent, every request follows the existing worker.

Requests pass the existing origin/host/IP checks, bearer-token verification, resource/audience binding, per-grant limits, and MCP SDK transport. Tokens are not logged or forwarded to model providers. Read grants expose only read tools. Company membership is rechecked even for initialization/discovery; writes require both write consent and the current workspace owner. Authenticated user and scope determine ownership/workspace; tool arguments cannot select either. Existing author identity cannot silently transfer through company ownership changes.

These boundaries follow the [MCP authorization specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/security-considerations.mdx). Responses use `private, no-store`. Company-scoped records are readable by authorized company members: use personal scope for an expert's private material that the company should not receive. Buyer-private context must not be imported into a reusable expert package without separate permission.

## Native conversation sequence

1. `save_expert_profile`: supply a private `ai-blocks-expert-profile/1` profile. The server assigns authenticated ownership; credentials remain self-reported. No public identity is created.
2. `create_expert_agent`: choose an owned profile, task, deliverables, exclusions and review rules. The server saves an empty scoped agent.
3. `get_expert_record` with `kind: "agent"`: retrieve the exact current agent and digest.
4. `begin_expert_capture`: supply a new capture/source ID, the current `agent_sha256`, mode `interview` or `work-review`, and the selected evidence's declared rights/allowed uses/expiry.
5. `get_expert_record` with `kind: "capture"`: receive its next question. The host asks it and uses its own model for interpretation.
6. `record_expert_capture_answer`: persist the user-authorized answer. Repeat as useful. No transcript or external file is discovered automatically.
7. `propose_expert_learning`: save conditional knowledge, exceptions, named replacements and optional practice cases. See [CAPTURE.md](CAPTURE.md). The current agent is unchanged.
8. `preview_expert_learning`: render the exact `accept` or `reject` preview to the expert.
9. `review_expert_learning`: send their decision, exact preview digest, expected capture storage version and expected agent storage version. Acceptance atomically saves both records; rejection saves the review and keeps the agent unchanged.
10. `prepare_saved_expert_agent`: prepare a selected private revision for personal/company use, subject to declared source use and expiry. This does not authorize tool actions or commercial publication.

All mutations require `expected_version`, `idempotency_key` and `confirmed: true`. Those fields report a user-requested write; they do not independently prove human approval. New records require version zero. Reuse the same request key and exact arguments after an uncertain network response. Changed arguments with the same key fail. A conflicting expected version requires fetching and reviewing again.

`storage_version` is the version of a stored record. `agent.version` changes only when the agent changes; capture answers and proposals have their own storage versions. Profile versions must equal their expected storage version plus one. Prefixes namespace profile/agent/capture IDs internally; the same visible ID can exist in different kinds without collision.

## Persistence and transactions

The service uses dedicated `expert_agent_versions` and `expert_agent_requests` tables, not the coordinator's workflow/memory/outcome/run types. Inserts are immutable through the service. An acceptance transaction inserts its receipt, agent revision and capture review together; database revision triggers abort stale writes. [D1 batch transactions](https://developers.cloudflare.com/d1/worker-api/d1-database/#batch) roll back the sequence if one statement fails. Local tests exercise the SQL with SQLite and an equivalent batch adapter; they are not a remote Cloudflare deployment test.

The memory store mirrors these transaction and quota rules for tests. Each scope is bounded to 500 record IDs and 20 MB of version contents, with up to 1,000 storage versions per record and 600 KB per record. The HTTP transport retains the existing 64,000-byte request limit. Common credential patterns and unsafe JSON are rejected; this is not a comprehensive secret or personal-data detector. Stored evidence is private application data, not a promise of special encryption or resistance to all prompt extraction.

`get_expert_record` for a capture returns the stable source evidence used by an accepted rule. Portable worker preparation currently includes source references, not this complete interview archive. Full evidence-bearing export/source closure is the next export PR. There is no durable evaluation-report storage, profile publication, marketplace hiring, payments, inference or scheduled learning in this slice.

This preview retains history and has no deletion tool yet. Use synthetic or appropriately consented test data until scoped purge/retention controls and remote access review are implemented. Nothing should be called independently verified, trained, tested for professional competence, or market-ready based on these structural checks.

## Local verification

With Node 24 and the locked site dependencies installed:

```powershell
node --test site/test/expert-agent-*.test.mjs
node site/node_modules/typescript/bin/tsc --noEmit -p site/tsconfig.expert-agent.json
node site/scripts/demo-expert-agent-capture.mjs
```

The demo uses synthetic answers and the memory store. It performs no model calls, networking, deployment, spending, or actual expert evaluation. Tests additionally cover the SQL adapter, rollback races, OAuth PKCE, MCP HTTP, read/write consent, revoked/foreign-audience tokens and changing membership.
