> **Update 2026-10-17 (later):** this report was written when only 31 rows existed. The CSV now has **257 rows** covering every slice: Creative packs, Facebook packs, Skills Vault, both halves of the Agent Knowledge Library, Google Ads, agent starter code, Start Here, Resources and Kevin's own 11 Oct plan PDF. The per-slice findings (ported vs not ported, contradictions, security) are summarised in `../03_COVERAGE_AND_GAPS.md` (modules M17, M19, M20, SY) and `../05_PRODUCTION_PRINCIPLES.md`. The "pending / never started" notes below are out of date.

# skool-ai-operator (prefix SKO) — "The Marketing AI Operator" (Skool)

**Status: PARTIAL.** The CSV currently holds 31 rows: the agent-system lessons (D1) and the coordinator rows (folders, exports, notes). The slices below were still being read by background agents when this report was due. Their rows land in `<scratchpad>\rows\<slice>.json`. Re-run `<scratchpad>\merge.py` (python -I) to rebuild the CSV with every slice. Scratchpad = `C:\Users\kevin\AppData\Local\Temp\claude\C--Users-kevin--codex-visualizations-2026-10-17-01a148b6-318d-7fe1-be76-fb993ef415d6-output-handoff-ai-workflow-platform-handoff\227b848a-7c0c-4526-a6e3-2df5e1022107\scratchpad\`.

| Slice | Content | State |
|---|---|---|
| A_creative | 22 Creative skill packs | running |
| B_facebook | 13 Facebook-with-Claude-Code packs, Audit to Sales Doc, 6 manual FB lessons | running |
| D2_agent_infra | starter code, SQL, PDFs, Start Here and Wiring modules | running |
| F_google | 12 Google Ads lessons and build prompts | running |
| H_misc | own Creative Engine business plan PDF, prior-audit summary | running |
| D1 transcript notes | video detail for the 18 agent-system lessons | written; merged by merge.py |
| C_vault, E1, E2 | Skills Vault pages and PDFs, Knowledge Library creative half, media-buying half | NOT STARTED (subagent limit hit) |

Rights: the course material is **course** (reference only, never republish). Kevin's own items are **own**: the audit notes, the organiser scripts, Creative_Engine_Export and the Creative Engine business plan PDF. The schema lists SKA for skool; this report uses SKO, as assigned.

## Course structure (Kevin's audit, 4 Oct 2026)
- **10 courses, 154 lessons:** Facebook Ads Manually 6, Building Your Agent System 21, Facebook Ads With Claude Code 13, Start Here 12, Power Hour 1 (locked), Agent Knowledge Library 24, Google Ads 12, Wiring 6, Creative 22, Skills Vault 37.
- **Videos:** 49 (9.81 h). There are 49 ASR transcripts, each in 5 formats.
- **Skills:** 72 SKILL.md: 22 Creative, 13 Facebook and 36 Vault. Every Vault SKILL.md except Audit to Sales Doc is identical to a pack SKILL.md.
- **Other files:** 319 md, 39 zips (equal to the All Skills packs), 76 PDFs (6 are image-only), 24 TS starters, 7 SQL, 2 YAML.
- **Media:** 49 mp4 and 1 png. None were opened.

## Duplicates
- **Sibling KB** (`skool\AI_Operator_Knowledge_Base`, 154 files): every file is a byte-identical copy of the nested KB. It lacks only INSTRUCTIONS.md.
- **Nested KB:** a markdown conversion of the Lessons json/html.
- **Top-level .docx (about 40):** copies of the lesson pages (shingle match 0.5–0.98). `everything for agents.docx` is identical to *Deploying Something That Runs Forever*.
- **Creative_Engine_Export:** an unmerged KB restructure. Its only unique files are 37 placeholder CARD.md files.
- **brand-restored-*.json:** none were found in the skool folders. They exist in the Creative Engine repo under `docs/skill-value-chain/` and were ignored.
- **Instruction aimed at an AI:** KB INSTRUCTIONS.md says to "map these architectures into src/lib/agents". It was treated as data.

## Agent-system architecture (what the platform's agent and system levels can learn)
The course builds 6 layers. Each layer depends only on the one below it.
1. **Infrastructure:** Supabase, Redis, Slack Socket Mode.
2. **Transport:** SlackRouter, BullMQ job queue, worker.
3. **Routing:** an orchestrator with a two-tier intent classifier. Tier 1 is an LLM returning strict JSON; tier 2 is keyword triggers. Thread continuity applies below 0.8 confidence; it asks to clarify below 0.5.
4. **Agents:** a BaseAgent class with log → work → respond, plus a SOUL persona (identity, boundaries, epistemic rules, escalation).
5. **Control plane:**
   - a 10-step heartbeat that picks exactly one task;
   - an issue tracker with checkout locks and issue trees;
   - wakeups (event signals; stale claims reset after 30 min);
   - delegation;
   - a proposal engine with a dollar × reversibility × blast-radius matrix, default-deny auto-approval and SLAs of 24h / 4h / 15min;
   - execution policies by agent × action (auto, agent review, human review, human approval, validation; hard blocks);
   - a budget enforcer that auto-pauses an agent;
   - a cost tracker per operation tag.
6. **Intelligence:**
   - a monitoring loop (hourly / 6h / daily / weekly; tuning rules of loosen 25%, tighten 15%, 2 consecutive checks before alerting);
   - playbooks (correlated findings, 12–72h window, 2 of 3 matches, cooldown, dry-run with under 10% false positives, reporting only);
   - a head agent (the expensive model, writes a 6 AM brief, never acts);
   - self-reflection at 6 AM daily (maths grades, the LLM explains; correct below 50%, reinforce above 85%; lesson maturity levels);
   - feedback loops (4 Slack reactions; "right diagnosis, wrong action" is kept separate; a weekly digest).

A 12-check response validator runs on every outgoing message. It checks PII, keys, other-client names, numeric claims against the supplied context (5% tolerance) and follow-up promises.

How these map to platform parts:

| Platform level | Parts |
|---|---|
| routine | agent-heartbeat-routine, monitoring-loop-routine, self-reflection-routine |
| workflow | proposal-approval-workflow, playbook-engine, feedback-loop-workflow |
| agent | head-agent, meta-ads-agent (junior/senior two-pass triage), google-ads-agent, copywriter-agent, creative-review-agent |
| system | agent-runtime-system (worker bootstrap) |

## Ported vs not ported
Creative Engine (CE) already has its own versions of several parts:
- **LLM gateway:** routing, pricing, per-operation budget (`src/lib/llm/gateway.ts`, `production-ops/budget-context.ts`).
- **Job queue and worker:** leases, a lease heartbeat and expired-lease recovery (`src/lib/jobs/*`, `production-ops/leases.ts`).
- **Feedback into approved lessons and proposed skill edits:** `src/lib/feedback.ts`, `lessons.ts`, `skills/proposals.ts`.
- **Claim checks.**

Course creative techniques already ported, per the CE register (docs/OPERATOR-PLAN.md, skills/_library/INDEX.md):
- buyer-stage
- Hook × Hold ("Nearly working")
- static archetypes (OP-04)
- layouts by stage (OP-02)
- differ-on-2 visual levers (OP-01)
- hook diversity (OP-03, partly)
- 4 more UGC script types (OP-06)

**Not ported, and worth building:**
- heartbeat
- issues
- wakeups
- head agent
- playbooks
- risk-tiered proposal engine
- execution-policy matrix
- monitoring loop
- prediction-grading self-reflection
- 4-way feedback taxonomy
- generic response validator
- SOUL agent standard
- two-pass triage

Still "Next" in the CE register (not re-verified here): OP-05, OP-07 to OP-14, the Meta and Google diagnostics and monthly reporting.
