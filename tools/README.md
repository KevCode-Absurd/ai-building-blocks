# Item factory (planned, not built)

TypeScript on Node, to match Creative Engine and the future Next.js site. See `docs/planning/06_BUILD_PLAN.md` §3 and `docs/planning/07_SOURCES_TO_SKILLS.md` §4.

| Tool | Job |
|---|---|
| `import-item` | Copy an own item from a source, with provenance; apply the new name; draft its `item.yaml` |
| `check-item` | Validate `item.yaml` against the checklist for its level; run the "won't adopt" scan |
| `build-exports` | Build the downloads: Claude Code, ChatGPT, custom GPT block, Codex, `prompt.txt`, lean version |
| `run-test` | Run an item on its golden inputs with cheap / mid / top models, directly on the four labs' APIs; log tokens, cache hits, cost, time and the trace |
| `grade` | Code checks first, then a blind judge (never the model that wrote the output); count the costliest mistakes |
| `build-graph` | Work out each item's needs / improves-with / feeds-into from `_types.yaml` |
| `register-source`, `split-source`, `group-pieces`, `map-pieces` | Turn learning sources into pieces of know-how and map them to items |
