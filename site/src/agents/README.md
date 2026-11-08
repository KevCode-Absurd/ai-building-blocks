# Expert-agent preparation: first implementation slice

This module lets a host prepare a private, task-scoped agent using supplied records. It includes a transport-neutral MCP tool adapter and an offline directory exporter. These pure helpers do not store anything themselves. The separate authenticated service composes private persistence into the existing personal/company MCP and REST router when enabled; see [STORAGE.md](STORAGE.md) for migration and rollout requirements.

It reuses the existing specialist worker files and `abb-manifest/1` integrity manifest. The original worker and workflow-integrity helpers are dependencies, not alternative implementations.

## Run checks

From the repository root with Node 24:

```powershell
node --test site/test/expert-agent-contract.test.mjs site/test/expert-agent-mcp.test.mjs
```

## Start a draft in a host integration

```javascript
import { createExpertAgentPreparationAdapter } from './expert-agent-mcp.mjs';

// Obtain these values from the authenticated integration, never from tool arguments.
const adapter = createExpertAgentPreparationAdapter({
  owner_id: 'authenticated-owner-id',
  workspace_id: 'selected-workspace-id',
  profile_id: 'owned-profile-id',
  as_of: '2026-10-30'
});

const draft = await adapter.call('start_expert_agent', {
  id: 'opportunity-assessment',
  name: 'Product opportunity reviewer',
  task: 'Assess product opportunities using supplied evidence.'
});
// Render draft.next_questions in the user's AI; use its model for the interview.
// Explicitly record approved updates in draft.agent, then call prepare_expert_agent.
```

The identifiers above demonstrate an adapter call. This module does not authenticate them. A production adapter must derive and authorize ownership and company membership server-side. The schema is version 1 and is not yet a durable storage or public compatibility commitment.

Tools supplied by the adapter:

- `start_expert_agent`: a minimal private draft plus a short question queue.
- `prepare_expert_agent`: structural checks, worker files and manifest.
- `suggest_agent_questions`: uncovered scope and method questions.
- `assess_agent_submission`: a request-for-review preflight. Even a fully passing result is not publication, independent verification or action authority.

## Prepare files locally

Create a JSON wrapper with `agent` and optionally `profile` using the returned record shape, then:

```powershell
node site/src/agents/expert-agent-cli.mjs prepare input.json NEW_OUTPUT_DIRECTORY 2026-10-30 personal
```

The destination must not exist. `company` is the other supported private export intent; it checks declared source-use permission but does not authenticate company access. Commercial publication is deliberately a separate future adapter.

## What the contract checks

- Profile and agent identities are separate; public preview includes only explicitly selected self-reported claims.
- Source references, workspace boundaries, allowed uses, expiry and declared rights are explicit.
- Proposed and rejected knowledge do not appear in the approved knowledge file.
- Revisions preserve owner/workspace/agent identity and bind the parent digest.
- Development reports bind exact agent, suite, configuration and artifact hashes, with evidence for each check.
- Failing, missing, blocked or unrun checks do not count as passing.
- Local reports cannot set `platform_verified`; host-reported approval cannot authorize publication.
- Referenced methods do not count as complete source closure. The complete-source exporter must materialize and verify their supporting files and licences.

## Boundaries

No model calls, source discovery, credentials, semantic assessment, weight training, continuous background work, hosted execution, persistence, payments or publication are performed. Returned files can contain private source/profile records and are not a public listing. Hashes prove correspondence to supplied bytes, not professional correctness. A pseudonym is not a promise of anonymity.

Development cases are visible to the expert. Hidden publication tests must live in a different restricted evaluation service. Local JSON checks do not prove that a host obeys the worker instructions.

## Guided capture and feedback

[CAPTURE.md](CAPTURE.md) describes the interview/work-review flow, evidence, inactive proposals, exact preview review and parent-linked candidate revisions. The pure functions live in `expert-agent-capture.mjs`; they do not persist data or run a model. Add `site/test/expert-agent-capture.test.mjs` to the check command above to cover this flow.

## Authenticated private storage

[STORAGE.md](STORAGE.md) describes private profile/agent/capture records, write consent, current membership, author ownership, optimistic concurrency, exact approved revisions, export and all-history deletion. These server modules add persistence around the pure preparation/capture code. The production router composes their tools additively when `EXPERT_AGENTS_ENABLED=true` and the database has migrations 0011 and 0012. Code readiness is separate from deployment; verify the actual enabled environment before claiming storage is available. The older isolated preview entry remains useful for separate-environment tests.

Run all `site/test/expert-agent-*.test.mjs` checks, the dedicated `site/tsconfig.expert-agent.json` TypeScript check, and `site/scripts/demo-expert-agent-capture.mjs` for the synthetic local walkthrough. The demo makes no model calls.

Exact private JSON export and approved worker preparation are supported. Complete evidence-bearing method-source bundles, real host acceptance trials and durable practice reports remain separate work. Publication, marketplace hiring and commercial execution require their own evidence and integrations.
