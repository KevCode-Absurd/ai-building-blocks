# Tools

## Built

| Tool | Job |
|---|---|
| `lint-pages.mjs` | Checks every block page against `docs/PAGE-FORMAT.md` and `docs/WRITING.md` |
| `reading-level.mjs` | Reading grade of every block page, one page, or any text (`--text`, `--file`). We keep it at grade 10 or below |
| `readability.mjs` | The grade formula (Flesch-Kincaid) the two above and the site's tests share |
| `apply-renames.mjs`, `make-orchestrators.mjs` | Rename block folders; build the ready workflows |
| `import-skills.mjs` | Copies skills from a cloned skills repo into `catalogue-items/imported/`, as they are, with their licence and credit. Checks the licence (Apache 2.0, MIT and CC BY copy; anything else is skipped with the reason), finds skills we may already have, checks our name and summary, and keeps `NOTICE.md` up to date. A dry run only writes the report in `reports/`; `--write` copies. Names, jobs and summaries live in `import-map.yaml`. Steps in `docs/IMPORTING-SKILLS.md` |
| `eval-roles.mjs` | Tests AI specialists on their own golden tasks: one model works as the specialist, another grades the answer against the role's checks. `plan` prices the run without calling a model; `run --roles a,b` (or `--area x`) calls the API under the spend cap and saves results to `site/src/roles/role-evals.json`, which the next role build shows on each role page |
| `role-feedback.mjs` | Adds a reviewed lesson (principle, pitfall or quality check) to a specialist with its source, or imports records in the pack's FEEDBACK.md format. Lessons live in `site/src/roles/role-learned.json`; the next role build puts them first and records a new version. It also trains a specialist from a person's edits: `diff` prints the brief a host AI uses to turn a draft and its edited final into one rule, `rule` records the reviewed rule (only rules that fit the job reach its TRAINING.md), `run` records a reviewed job, and `maturity` shows the level (1 to 4) the recorded runs support. With no runs, a role says "Not measured yet" |
| `build-mini-tool.mjs` | Builds every mini tool five ways from its formula file in `mini-tools/` (download, embed, spreadsheet, AI skill and prompt; the site page reads the file directly) and checks each way against the worked examples. Runs with the site's `npm run index`. Tests: `npm run test:mini-tools` here |

## Item factory (planned, not built)

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

## File cleanup and production inventory

`qa/check-production-files.mjs --library` (or `--marketplace`) inspects every built path and size, rejects maintenance records and build debris, and preserves downloadable methods, examples and licences. Both normal production release commands run this check. The [12 November cleanup manifest](qa/file-cleanup-2026-11-12.json) records 102 exact paths, their original hashes, recovery commit and the reason for each removal or move. Generated crawl files and starter downloads are rebuilt before development, tests and publication rather than duplicated in Git.
