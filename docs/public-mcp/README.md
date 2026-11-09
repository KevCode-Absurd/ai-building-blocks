# Public MCP server

Version **3.0.0** (`PUBLIC_MCP_VERSION` in `site/src/server/public-mcp.ts`, also on the server card and `/api/v1/status`). The server is at `https://useaiblocks.com/mcp`: stateless, read-only, no model calls, no hosted execution.

## One front door

For any business goal or problem, the host calls `start_outcome` with the owner's own words and follows the `next` step each result returns. The outcome orchestrator pins the outcome down with one batch of questions, has the host research how experts do the job, composes a plan from catalogue specialists and items, checks it, and stops for the owner's approval. `docs/public-mcp/outcome-delivery.md` and `site/src/outcomes/README.md` describe the method.

The other listed tools serve narrower jobs:

| Job | Tools |
|---|---|
| A whole business goal | `start_outcome`, `advance_outcome`, `record_outcome_decision`, `record_outcome_experiment` |
| After a test goes live | `read_back_outcome_experiment` (scheduled read-backs and guardrail alerts; REST `/api/v1/outcome-readbacks`) |
| Sharing a plan that worked | `prepare_outcome_pattern` (anonymised, owner consent, human review; REST `/api/v1/outcome-patterns`) |
| A page, ad, copy, email, audit or analysis | `prepare_job_context` first (REST `POST /api/v1/job-context`), then the item, specialist or team job |
| A team job | `start_job` with `deliverable_kind`, then `advance_job`; `propose_team`, `get_approaches`, `get_job_templates`, `get_job_preferences`, `set_job_preferences` |
| One item | `search_library`, then `get_skill`, `get_workflow` or `get_item`; `get_resource` for supporting files |
| One specialist | `find_specialist`, then `prepare_specialist` |
| A multi-step workflow | `plan_workflow`, then `prepare_workflow` |
| Hosts that need these names | `search`, `fetch` |

Every tool has a `title`. The public MCP lists 25 tools.

The server instructions (`PUBLIC_MCP_INSTRUCTIONS`) are about 2,200 characters, under 2,500. They put grounding first, because some hosts read only the first 512 characters: for a page, ad, copy, email, audit or analysis, frame the job (client, outcome, `deliverable_kind`, mode), ground it in the client's real assets or data before producing anything (`prepare_job_context`, then capture the live site or pull the account), write a taste brief, diverge on substance, build inside the client's system and check with an independent critic. Routing follows within the first 1,100 characters (`start_outcome` for a goal, then items, specialists, `start_job` with `deliverable_kind` for a team job, and workflows), then the run and authority rules. Domain guidance (for example how to read ad results) lives in the outcome method (`METHOD.md`, returned once by `start_outcome`), in `prepare_job_context` and in the specialist playbooks, not in the instructions.

## Grounding before production

Generic output is treated as a context failure, so produced work runs the Grounded Job Protocol: frame, ground, taste, diverge, build, check, record. The code is `site/src/jobs/grounding.mjs`; `site/src/jobs/README.md` has the job-engine detail.

**`prepare_job_context`** (REST mirror `POST /api/v1/job-context`, same JSON body). Arguments: `request` (required), `deliverable_kind`, `site_url`, `has_existing_asset` and `category`. It returns `schema: "ai-blocks-job-context/1"` with:

- `brief`: under 1,500 characters for the model to act on: the kind and mode, what to capture, the taste questions, the AI defaults to avoid, how to diverge and the check.
- `annex`: to save as `context/job-context.json`. It holds the protocol steps, `context_requirements`, the capture order and fields, the capture scripts for brand work (pinned `get_resource` paths in the `brand-dna-capture` and `brand-fidelity-check` skills, plus `https://agents.useaiblocks.com/tools/<file>`), the taste-brief sections and questions, `production_gate` with a `report_as` template, the diverge axes, `craft_rubric`, `gates`, and `defaults_to_avoid`. The defaults come from the published `ai-default-patterns/patterns.json`, or the embedded list when that is missing (`defaults_source` says which). `next` gives the `start_job` and `search_library` calls.
- `model_calls: 0`, `stored_by_service: false`.

**`deliverable_kind`** is one of `web_page`, `ad_creative`, `copy`, `email`, `audit`, `analysis`, `strategy`, `plan`, `code`, `ops_doc`, `other`. The host declares it on `prepare_job_context` and `start_job`; a declared kind always wins. Without one, a guess from the request words is used and marked `kind_source: "suggested"`. Assessment words without a creation verb suggest `audit` or `analysis`, never ad production. The mode defaults to `patch` whenever something exists: `has_existing_asset: false` or "from scratch" wording gives `new`, and a `site_url` with no existing asset gives `extend`.

**`taste_questions` replace dial questions.** A grounded `start_job` returns `brief`, `dials_line` and `taste_questions`. `dials_line` states the dials in one line ("Using a balanced mix, 1 output and a standard review; say if you want otherwise."), and `dial_questions` appear only when `ask_before_start` is `ask_dials`. The up to three SCOPE questions go to taste: position, what must never change, and 2 admired references and 1 to avoid for web, ad, copy and email work. Audits and analysis ask about the decision, what changed and what normal looks like. Strategy, plan and other work have their own sets. A request that names one deliverable, and audit, analysis, strategy, plan, code and ops-doc work, default to one output.

**The production grounding gate.** For jobs started under the grounding policy (`grounding_policy.version` 1), `advance_job` refuses the `produce` event until `grounding` is reported, in the event document or on the job card:

- `web_page`, `ad_creative`, `copy` and `email` need `brand_dna` (path `context/brand-dna.json`, `sha256`, `source`, `captured_at`, and `method` of `capture-brand-dna.mjs`, `brand-dna-snippet.js` or `manual`). They also need `taste_brief` (path `context/taste-brief.md`, `sha256`, at least 1 `brand_codes`, 2 `references_admired`, 1 `reference_avoid` and 1 `defaults_to_avoid`).
- `audit` and `analysis` need a `data_snapshot` (a path under `context/`, `sha256`, `source` and `captured_at`).
- Other kinds have no gate.

Only the structure is checked: these are host reports, not proof of capture. Jobs started before the policy replay unchanged. A direct-mode `start_job` result names `prepare_job_context` in `next_action.grounding`.

**`get_skill` `before_you_run`.** A detailed `get_skill` for a creative skill (pages, ads, copy, email, brand) or an assessment skill (audits, analysis) adds `before_you_run`, placed before `instructions`. It holds `{ title: "Before you run this", kind: "create" | "assess", lines, tool, precedence }`. The `lines` are five steps: ground, the taste or interview questions, the defaults to avoid, 2 or 3 directions or hypotheses, and an independent check. `tool` is a `prepare_job_context` call, and `precedence` says the captured context overrides the method's defaults on look and structure, never truth or permission. `next_action` then starts with "Run before_you_run first". Workflows and short views do not carry it.

## Tools that moved to REST

These tools are no longer in the public MCP `tools/list`. They still work on REST with the same arguments as the JSON body, and signed-in personal and company connections still list them. A client with a cached tool list that calls one gets a tool result with `isError: true` that names the REST route and `start_outcome`.

| Tool | REST route (POST) |
|---|---|
| `scope_specialist_request` | `/api/v1/request-scopes` |
| `prepare_scoped_specialist_work` | `/api/v1/scoped-work-preparations` |
| `route_scoped_specialist_work` | `/api/v1/scoped-work-routes` |
| `prepare_scoped_specialist_team` | `/api/v1/scoped-team-preparations` |
| `prepare_recommendation_handoff` | `/api/v1/recommendation-handoffs` |
| `prepare_specialist_team` | `/api/v1/specialist-team-preparations` |
| `checkpoint_specialist_team` | `/api/v1/specialist-team-checkpoints` |

`PUBLIC_MCP_TOOLS` is the full registry (REST, OpenAPI, signed-in connections). `PUBLIC_MCP_LISTED_TOOLS` is what the public MCP lists; `RETIRED_MCP_TOOLS` maps each moved tool to its route.

## Argument problems are tool errors

When arguments are wrong, the result is a tool result with `isError: true`, not a JSON-RPC `-32602` error, so the AI reads it and fixes its call. Outcome tools check the arguments against their input schemas first and report every problem at once:

```json
{
  "isError": true,
  "content": [{ "type": "text", "text": "Fix these and call advance_outcome again. Nothing was executed or saved.\nevent.brief.metric.direction: must be one of \"decrease\", \"increase\", \"reach\". Did you mean \"decrease\"?\nevent.brief.data_home: is required." }],
  "structuredContent": {
    "schema": "ai-blocks-tool-error/1",
    "error": {
      "code": "invalid_arguments",
      "issues": [
        { "path": "event.brief.metric.direction", "message": "must be one of \"decrease\", \"increase\", \"reach\".", "suggestion": "decrease" },
        { "path": "event.brief.data_home", "message": "is required." }
      ]
    }
  }
}
```

The `advance_outcome` event schema is a `oneOf` on `type`, built from the same field lists the validators use (`site/src/outcomes/outcome-schema.mjs`). Rule breaks in a plan (a decision without owner approval, a live action without per-action approval, a stage with no research step) are collected together, each against its stage. Unknown specialist and item ids get the nearest real id as `suggestion`. REST returns the same text in `error.message` (up to 800 characters).

## Resources

`aiblocks://roles` lists specialist roles 100 a page, alphabetically, with each area's count. Filter and page with `aiblocks://roles?area=marketing&page=2` (template `aiblocks://roles{?area,page}`). For a task, `find_specialist` ranks the roles instead. `aiblocks://roles/{id}` reads one role.

## Sizes (3 Nov 2026, measured with the test catalogue)

| | 2.3.0 | 3.0.0 |
|---|---|---|
| `tools/list` | 100,861 bytes, 22 tools | 53,955 bytes, 15 tools (17 tools after the read-back and pattern tools were added) |
| Server instructions | 11,865 characters | 1,829 characters |
| `start_outcome` result | 17,605 bytes (35,960 as an MCP reply) | 10,454 bytes (21,502 as an MCP reply) |
| `aiblocks://roles` | about 274 KB, all roles | one page of 100 roles |

`include_example` on `start_outcome` stays off by default; the worked example adds about 25 KB.
