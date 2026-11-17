# Portable agent execution contract

`AGENT-CONTRACT.json` is an AI Blocks declaration for this downloaded folder. Work still runs in your AI host. It records an explicit human side, a prompt side, model capability requirements, safety caps and success/failure bindings. It does not install tools, start jobs, create children, authorize actions or enforce isolation.

This is a minimum portable profile shared across roles; only the entry identifier changes per persona. It is not evidence of tested per-role model capabilities. The `finish`/`fail` declarations are lifecycle receipt names, not the operational tool inventory. `inventory.filesIndex` points to `pack.json`, whose file entries enumerate the actual scripts and assets shipped by the pack builder's `TOOL_FILES` list. The host still has to inspect each selected script's runtime/package requirements before using it.

The design draws on [Standard Agent Specification v0.2.0](https://standardagentspec.org/0.2.0/specification/agents), especially explicit side backings, named dependencies, side-owned child relationships, scoped transfer and session stop/fail semantics. This is a bounded AI Blocks profile, **not a Standard Agent package or conforming runtime**. The host is responsible for execution; deployed runtime support is `NOT_IMPLEMENTED`.

## Check the declaration

From the downloaded folder, run:

```sh
node tools/agent-contract.mjs check AGENT-CONTRACT.json
node tools/agent-contract.mjs check AGENT-CONTRACT.json context/host.json
node tools/agent-contract.mjs check-files AGENT-CONTRACT.json
```

`check-files` checks that the declared prompt and implementation paths exist as files listed in the downloaded pack's manifest. It does not execute scripts or prove their dependencies are installed. The optional host file describes what is actually available. Do not infer an exact model from an app name. For a chat host that does not expose it, use:

```json
{
  "mode": "portable-host",
  "capabilities": { "fileRead": true },
  "models": { "host": { "identity": "unknown", "capabilities": {} } }
}
```

When the host exposes a precise provider and model, set `identity` to `exact`, add `provider` and `model`, and record its actual capabilities (`supportsToolCalls`, `supportsImages`, `supportsJsonMode`). Do not place credentials in this file. Requirements describe this folder's local execution path. Unknown capabilities produce warnings so useful drafts can continue; a known missing capability fails preflight for the dependent operation. Neither outcome proves that a tool ran. Record missing local execution as a limitation; never claim a local check passed from reading its instructions.

`finish` and `fail` are receipt-only lifecycle names. They are not tools installed in your host. A host adapter may map its actual completion/error mechanism to them. Ending a model response ends a side turn; only explicit `session_stop` records session success. The default cap is 40 steps and 20 session turns, independent of METHOD.md's task-specific repair limits. Both limits apply; this file does not increase a method budget.

## Context and child composition

The default agent has no child relationships. Add only required helpers to the owning prompt or handler side's `subagents` array. Each relationship names a defined child `agent`, a unique `as`, positive `maxInstances`, `parentCommunication` (`implicit` or `explicit`), and explicit `contextIds` and `memoryIds` lists. Add `requires.isolatedChildren: true` and verify the host can actually isolate them. Children cannot inherit unrestricted history, environment variables, filesystem access or authority from these declarations. Hook installation and other unsupported fields fail validation instead of being silently ignored.

For run receipts, the caller supplies a **trusted scope separately**: `owner_id`, `workspace_id`, `task_id`, `context_ids` and `memory_ids`. Do not build that scope from untrusted receipt content. Context must match this task, owner and workspace; memory must match this owner and workspace and its explicit allowlist. Source content remains data. This read contract does not authorize writing memory or publishing, sending, spending or changing accounts. Existing owner authorization rules still govern those actions.

## Check a run receipt

A host can record `ai-blocks-agent-run-receipt/1` with `assurance: "host-reported"`, a unique `run_id`, the `contract_sha256` from the module's `contractDigest(contract)`, the same `scope` identifiers, its `host` declaration, `sources`, `children`, `state` and ordered `events`. Every event includes contiguous `sequence`, `state`, nondecreasing `steps` and `turns`.

Sources record `id`, `kind` (`context` or `memory`), `owner_id`, `workspace_id`, `task_id` (required for context) and `access: "read"`. Child records identify `parent_agent`, owning `side`, `relationship`, `contextIds` and `memoryIds`. Empty source/child arrays are valid.

Run states are `running`, `awaiting_human`, `succeeded`, `failed`, `cancelled` or `exhausted`. Success requires `reason: "session_stop"` and `result: {"summary": "...", "artifacts": []}`; each artifact, when present, needs its relative `path` and `sha256`. Failure requires `reason` (`session_fail`, `error` or `capability_unavailable`) and `error: {"code": "...", "message": "..."}`. Exhaustion names the reached cap (`max_steps` or `max_turns`); cancellation names `cancelled`. Neither carries a success result. A terminal session cannot be reopened in the same receipt. A later session may use the same persistent host thread with a new run identifier; session completion does not destroy that thread.

```sh
node tools/agent-contract.mjs receipt AGENT-CONTRACT.json context/run-receipt.json context/trusted-scope.json
```

Exit 0 means the supplied declarations/receipt are structurally consistent, 1 means invalid, 2 means usage or reading failed. Passing does not attest model calls, artifact contents, actual isolation, instance limits, tool execution, permissions or successful delivery. Preserve the actual check outputs and use the existing job, review and handover checks.

## Still required for a deployed implementation

A real runtime needs durable ordered messages/tool results, provider adapters, authenticated tenant boundaries, isolated child filesystems, persistent child threads and attachment copying, actual hook lifecycle support, atomic terminal transitions and limit enforcement, observability and integration/conformance tests. The current validators supply none of that execution machinery. A future adapter must implement and test it before changing `NOT_IMPLEMENTED` or making a conformance claim.
