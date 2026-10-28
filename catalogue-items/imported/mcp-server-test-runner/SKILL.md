---
name: mcp-server-testing
description: Tests and evaluates MCP servers - Inspector, the official conformance suite, an evaluation harness of realistic tasks with verifiable answers, transcript-driven iteration, tool-selection accuracy, CI regression gates. Use when the user asks to test, evaluate, measure, or build an eval harness for an MCP server or its tool selection. Not for fixing server code, hardening, or unit testing.
---

# mcp-server-testing

An MCP server's quality metric is **agent task success**, not endpoint
coverage. Unit tests catch code bugs; they say nothing about whether an agent
with zero context can pick the right tool and finish a real task. This skill
encodes the missing layers: protocol verification (Inspector + conformance)
and agent evaluation (verifiable tasks + transcript-driven iteration) —
the methodology agents skip, producing servers that "work" and fail in use.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When NOT to use

- Fixing the bugs testing finds (stdout pollution, lifecycle, schema code) →
  `mcp-server-implementation`. Rewriting descriptions/surface →
  `mcp-server-design`.
- Security checklists/scans → `mcp-server-security`. Auth flow issues →
  `mcp-server-auth`.
- Generic unit testing of non-MCP code, or choosing LLMs.

## Workflow

### 1. Gate 0 — build and start

`tsc`/`py_compile` passes; the server starts; env validation fails loudly.
Unit-test business logic as plain functions — if logic is only testable
through the protocol, the layering is wrong.

### 2. Protocol verification with Inspector

```bash
npx @modelcontextprotocol/inspector node dist/index.js   # or any launch cmd
uv run mcp dev server.py                                  # python shortcut
```

Web UI (localhost:6274) + CLI mode for scripting. Exercise **every** primitive:
each tool with valid input, at least one error path each (expect `isError`
results with recovery text, not protocol errors or crashes), empty-result
behavior (explanatory text, never nothing), oversized-input rejection.
Works-in-Inspector-but-not-in-client points at stdout pollution, paths, or env
— that's `mcp-server-implementation` territory. Keep Inspector current
(CVE-2025-49596 affected versions before 0.14.1).

### 3. Conformance suite

```bash
npx @modelcontextprotocol/conformance server --url http://localhost:3000/mcp
npx @modelcontextprotocol/conformance list        # available scenarios
```

Official scenario-based checks of lifecycle/transport/feature behavior
(`--spec-version` selects the revision). Triage every failure; a server that
passes Inspector clicking but fails conformance has protocol bugs real
clients will find.

### 4. Agent evals — the quality gate

Method (full detail + templates: `references/agent-evals.md`):

1. Write **~10 evaluation questions** against real data: independent,
   **read-only**, complex (multi-hop, paraphrased so keyword search can't
   shortcut), each with ONE stable, verifiable answer and a declared format.
2. **Solve each yourself with the tools** before accepting it — unsolved
   questions are diagnostic, wrong answers are poison.
3. Lint the suite: `python3 "${CLAUDE_SKILL_DIR}/scripts/lint_eval_suite.py" evals.xml`
4. Run through an agent harness against the live server; score exact-match;
   record accuracy, tool calls, latency, tokens, and the agent's own feedback.
5. **Read the failing transcripts** — this is where descriptions get fixed.
   Feed transcripts to a coding agent to propose description/schema edits
   (surface rules: `mcp-server-design`), keep a held-out subset, re-run.

### 5. Tool-selection accuracy as a classification eval

When agents pick wrong tools: build prompt→expected-tool pairs, run
selection-only evals offline (cheap, no execution), fix by rewriting
overlapping descriptions — not by prompt-tuning the agent. Add description
overlap detection to CI so a future edit can't silently re-collide two tools.

### 6. Regression gates in CI

Every tool-handler or description change runs: build, conformance (or a
scripted Inspector CLI pass), the eval suite (fail under threshold), schema
snapshot diff (breaking-change alarm), plus the stdio-hygiene and security
checks the sibling skills provide. A failing eval blocks merge exactly like a
failing unit test.

### 7. Load test remote servers

Drive realistic `tools/call` POSTs at the MCP endpoint (headers matter:
`Content-Type: application/json`, `Accept: application/json, text/event-stream`)
with a representative tool mix; thresholds fail the run (e.g. error rate <1%,
p95 < 500ms); include one expensive tool and watch sessions/auth under
concurrency. k6 template in `references/agent-evals.md`.

## Output spec

A tested server: Inspector pass over every primitive incl. error/empty paths;
conformance suite green (failures triaged in writing); an eval suite of ~10
verified questions with a baseline accuracy report (accuracy, tool calls,
tokens) and at least one transcript-driven improvement cycle completed; CI
running build + conformance + evals + schema diff; load-test thresholds for
remote deployments.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Test results analyst](https://useaiblocks.com/skills/agency-testing-test-results-analyzer). It takes the test report.
- The [Bug root cause finder](https://useaiblocks.com/skills/bug-root-cause-finder). It takes the test report.
- The [Flaky test fixer](https://useaiblocks.com/skills/flaky-test-fixer). It takes the test report.
- **Build it** with the [A-Evolve agent improvement loop builder](https://useaiblocks.com/skills/agent-improvement-loop). It takes the test set.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Gotchas

- **Self-evaluation is near random** — grade eval answers by exact match or a
  *different* session/model, never the agent that produced them.
- Compare against a **no-server baseline** once: if the agent scores the same
  without your server, the server is context tax (redesign, don't ship).
- Answers must be **stable**: no "current"/"latest"/live counts; fixed time
  windows; historical data. Dynamic answers make accuracy noise.
- Don't overfit: descriptions tuned on the full suite memorize it — hold out.
- Eval questions must not require writes; destructive-path testing belongs in
  guardrail regression (a prohibited action must be refused — see
  `mcp-server-security`), run against fixtures.
- Model upgrades shift selection behavior — re-run selection evals when the
  client's default model changes, not just when your code changes.

## Pointers

- `references/agent-evals.md` — question requirements + creation process,
  worked good/bad examples, harness design (agent loop, scoring, report),
  selection-eval format, k6 load-test template, conformance/Inspector CLI
  reference.
- `scripts/lint_eval_suite.py` — deterministic eval-suite linter (counts,
  duplicates, stability heuristics, answer-leak check).
