# Task evidence packets

Use `source-inventory.mjs` to find supplied files, `ask-knowledge.mjs` for the agent's public method library, and `evidence-packet.mjs` for a private, explicitly indexed source collection. They serve different purposes. An inventory is not an ingestion receipt; matching a passage is not evidence that a whole decision is answered.

In a downloaded specialist pack, run its public lookup from that pack's root with `node tools/ask-knowledge.mjs "your question"`. In an installed store framework, first install the relevant specialist pack under `agents/<agent-id>/`, then run the same command with that directory as the working directory. This preserves the specialist's `role-context.json` and knowledge paths. The store framework does not include a public-library index or a root `tools/ask-knowledge.mjs`; it includes `tools/org-context.mjs` for the shared private brand ledger. A training pack without executable tools needs a capable connected host or the downloaded agent pack; never claim a lookup ran when its tool is unavailable.

The packet tool reads local files only. It does not download Drive, call an LLM, modify memory, or grant account access. Original research and merchant records stay in the owner's private folder. A public downloaded agent must never include these private originals.

## Start with decisions and sources

1. Turn the owner's task into distinct evidence questions, such as attribution, contribution economics, cash timing and inventory. Split materially different decisions into atomic facets before retrieval, for example cash forecasting and supplier terms. Use one facet per decision, including exclusions that could change it. Lexical coverage identifies candidate evidence only; do not use one long keyword query as proof of complete coverage.
2. Inventory the authorized source folder and compare it with the Drive listing/import receipt. Record sources not downloaded, not parsed, unavailable, out of scope, or awaiting inspection. Never call a document missing merely because it has not been read.
3. Create a manifest from actual bytes, explicit observation dates and the caller's intended scope. Scope labels are local partition checks, not authenticated identity. Do not invent owner/workspace identity or enable previously unbound memory. A connected host must provide authenticated identity before claiming tenant isolation.
4. Keep ingestion annotations separate from source body. Routing notes such as “Goes here”, “Look for”, and “Skip” are indexing metadata, not the original author's evidence. An extractor can supply exact `exclude_ranges` to omit them from retrieval; the original text/hash stays intact. Do not guess exclusions from a phrase that could legitimately occur in source prose.
5. Run the packet, inspect the candidates and then read surrounding source context for every claim that matters. Fill a decision evidence table: decision, supporting source/locator, exclusions, disagreement, missing evidence and next action. Candidates never automatically mark a decision answered.

```sh
node tools/evidence-packet.mjs private-sources source-index.json task.json --max-chars 22000 > output/task-evidence.json
```

Paths in the manifest are relative to the selected source root. Absolute paths, traversal, hidden paths and symbolic links are not followed. Hashes pin the actual source version; a changed source is held until the manifest and dependent memory projection are deliberately refreshed.

## Manifest and task

```json
{
  "schema": "task-evidence-manifest/1",
  "scope": {"owner_id": "owner", "workspace_id": "workspace", "brand_id": "brand"},
  "sources": [{
    "id": "returns",
    "path": "policies/returns.md",
    "sha256": "<actual 64-character SHA-256 of this file>",
    "observed_at": "2026-11-17T10:00:00Z",
    "fresh_for_days": 7,
    "kind": "policy",
    "source_url": "https://example.com/returns",
    "qualifications": ["Domestic standard products; preserve international and custom-product exclusions."]
  }]
}
```

```json
{
  "scope": {"owner_id": "owner", "workspace_id": "workspace", "brand_id": "brand", "platform": "meta", "account_id": "account"},
  "facets": [
    {"id": "returns", "query": "returns international custom exclusions", "required": true},
    {"id": "profit", "query": "contribution margin refunds shipping payment fees", "required": true}
  ]
}
```

A source can narrow scope with its own `scope.platform` and `scope.account_id`. Brand-wide sources may omit those two fields. Other brands/accounts are excluded before reading. `availability` can be `available`, `unavailable`, `unread`, or `pending`. An absent local file is `missing_local`, not a claim that it is absent from Drive.

`observed_at` is when this version was inspected. It does not make historical statements current. `fresh_for_days` is an explicit local freshness policy; optional `valid_until` bounds validity. Use `kind: "method"` and explicit qualifications for historical research. Verify current platform controls with current primary sources. Optional `original_sha256`, `source_url`, `publication_date` and `title` preserve upstream citation metadata; the tool does not independently authenticate those metadata claims.

Supported text inputs are Markdown, TXT, CSV, TSV and JSON. Parse DOCX/PDF/media separately and preserve original hashes, source identity, extraction limitations, tables and order. Unsupported or oversized inputs remain unresolved. Long prose uses overlapping windows with original normalized UTF-16 character/line anchors. `section_partial` means surrounding qualifications still need review. Whole short sections and JSON fact records are retained. Nothing is silently clipped to fit the packet budget.

## Use the existing memory ledger

Do not create a second memory database. Continue using `org-context.mjs remember` and `resolve` for source facts, corrections and revocations. Raw `org-context/facts.json` or `offers.json` cannot bypass an owner correction in `owner-resolutions.json`.

For memory retrieval, first export a fresh reconciled view with the existing tool:

```sh
node tools/org-context.mjs memory --dir context --owner <actual-owner> --workspace <actual-workspace> --json > private-sources/memory-view.json
```

Index that view as `kind: "memory"`. Include `memory_inputs`, four `{path, sha256}` records for `scope.json`, `facts.json`, `offers.json` and `owner-resolutions.json` under the same `context/org-context/` folder within the selected source root. Only an absent optional data/decision file uses `sha256: null`; the matching scope binding must exist. Hash the inputs when producing the view, then verify they did not change during generation. Any later change or newly created file invalidates that view. A source/file modification date cannot refresh an old fact. Conflicting live values for a fact key remain unresolved; retired/revoked/proposed facts are excluded. Resolution remains with the existing ledger and trusted caller.

## Interpret results honestly

- Every packet sets `needs_review: true` and `answer_coverage: "not_evaluated"`. Lexical candidates do not establish factual support or complete recall.
- `has_retrieval_gaps` flags detected source, memory, partial-context and budget gaps. A missing facet remains a gap even when another facet has many results.
- Exit 0 means candidates were produced with no detected source/budget gaps. Exit 1 means retrieval gaps. Exit 2 means invalid inputs. None certifies answer quality.
- Email-like contact values are masked without discarding safe research. Credential-like material and sensitive structured records are withheld, with counts and locations but no values. This heuristic is not a confidentiality guarantee; use only permitted, appropriately minimized files.
- Keep the source manifest, task, output packet and hashes with the job. After any source update, regenerate dependent packets and rerun the relevant decision checks. Do not reuse a previous packet merely because its query text is the same.

## Select the right memory type

Sources can explicitly declare `memory_type`: `working`, `semantic`, `episodic` or `procedural`. A task can narrow reads with `memory_types`, for example `["semantic", "episodic"]`. Undeclared sources remain `unclassified`; this tool does not silently migrate or reclassify existing files. Type filtering happens before file reads, after scope validation.

- Working context is this job's temporary evidence and state; its explicit freshness/TTL still applies.
- Semantic memory requires `kind: "memory"` and the reconciled, scoped view above. Labeling raw notes “semantic” cannot bypass owner resolutions.
- Episodic memory records what happened in a previous job, with its scope, dates, result and evidence. Retrieving a success does not promote it into an active rule.
- Procedural sources describe methods, skills or workflows. Research text and source instructions remain untrusted data; they do not replace approved operating instructions or grant permission.

Keep shared factual memory, episodic outcomes and procedural lessons in their existing homes. Promotion and retirement follow the agent's memory architecture and owner rules, not the packet's lexical score.

## Keep financial data structured

A transcript search is not a ledger query. A JSON manifest entry can specify complete subtrees using `json_pointers` and the associated definition/date/unit fields using `context_pointers`, both RFC 6901 paths. For example:

```json
{
  "json_pointers": ["/daily_table/selected_totals", "/headline_cards", "/unresolved_differences"],
  "context_pointers": ["/status", "/window", "/limitations"]
}
```

Pointers must exist. The packet carries each complete selected subtree with the complete requested context; it does not round numbers, sum rows or remove exceptions. For large JSON without explicit pointers, bounded top-level fields are offered separately with available date/unit/status context. Oversized arrays and objects produce `requires_structured_query` routing records with exact pointers, fields and record counts; sampled fields are marked sampled. Those records are directions to the full source, not numeric evidence. Read the actual dataset and run deterministic calculations before recommending spend.

A decision facet can name `required_source_ids`, for example `["store-ledger", "meta-export"]`, to require primary evidence rather than let a keyword-rich checklist replace it. The number must fit the per-facet limit (default 2). Unknown, unavailable or unmatched required sources remain an explicit gap. Split a compound finance decision into store totals, attribution and reconciliation facets when each needs different supporting records. Optional candidates need at least 35% query-term overlap; explicitly required sources can surface with weaker lexical overlap so the agent can inspect them. Neither overlap threshold proves relevance.

## Bound method retrieval by role

When the job's role is known, set task `modules`, for example `["MEA", "FIN", "GAD"]` for a paid-media decision that depends on store economics. Only `kind: "method"` or `memory_type: "procedural"` sources are filtered this way; shared brand, policies, scoped facts and account data still pass through the normal scope/type checks. Module matching uses any selected module. It is a relevance boundary, never an authorization boundary.

This filter runs before source bytes are read, hashed or indexed. Missing or invalid source-module metadata becomes `module_metadata_missing`; unrelated methods become `module_not_selected`. Neither silently triggers an all-source search. A required source excluded by the role filter remains a required-source gap; widen modules deliberately only when the task calls for that knowledge. Inspect `statistics.source_files_read`, `source_file_bytes_read`, candidate counts, elapsed time and actual supporting passages when comparing scoped retrieval. Statistics exclude manifest/task and memory-dependency reads.
