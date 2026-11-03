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
| One item | `search_library`, then `get_skill`, `get_workflow` or `get_item`; `get_resource` for supporting files |
| One specialist | `find_specialist`, then `prepare_specialist` |
| A multi-step workflow | `plan_workflow`, then `prepare_workflow` |
| Hosts that need these names | `search`, `fetch` |

Every tool has a `title`. The server instructions are about 1,800 characters and put the procedure in the first 512 characters. Domain guidance (for example how to read ad results) lives in the outcome method (`METHOD.md`, returned once by `start_outcome`) and in the specialist playbooks, not in the instructions.

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
