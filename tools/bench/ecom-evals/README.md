# E-commerce eval suite

This is the bench we run every improvement round on. It asks the questions a store owner really asks, on real named brands, with account data built so we know the right calls. It compares plain Claude with our agents, 3 runs each, judged blind on the owner's seven grades.

Kevin's brief: "Imagine what questions an e-commerce owner will ask, and then optimise for that, across the stack."

## What is in this folder

| Path | What it is | Who may see it |
|---|---|---|
| `TASKS.json` | 33 owner questions: area, agent, brand, inputs, deliverable, outcome, job checks, traps, signal count, split | Maintainers and the checker only. Its checks and traps are key material. |
| `brands/<slug>/PUBLIC-FACTS.md` | Sourced, dated public facts for 8 real brands | Everyone |
| `brands/<slug>/ORG-CONTEXT.md` | Each brand's Org context: customers and avatars, voice, how they speak to customers, design language, markets, claims they can and cannot make, do's and don'ts, brand DNA. Facts cite PUBLIC-FACTS; avatars and examples are marked (test) | Arms and judges |
| `fixtures/<task>/` | Test data for each task: CSV and Markdown, "(test data)" in every file name and first line | Arms and judges |
| `fixtures/build/` | The generator. It rebuilds every fixture and asserts each planted signal holds | Maintainers |
| `keys/<task>.md` | Answer keys: signals, decoys, right calls, what would be wrong, facts to check | The checker only |
| `RUBRIC.md` | The seven owner grades with anchors, job checks, reproducibility, image grades | Judges get the grades section |
| `ARMS.md`, `arms/RULES-DELIVERABLE.md` | The three arms and the shared deliverable rules | Arms get the rules |
| `judge/` | Sheet templates: pairwise, single answer, checker, images | Judges |
| `scripts/` | `make-sheets.mjs`, `finish-run.mjs`, `score.mjs`, `compare-rounds.mjs`, `render-images.mjs`, `selftest.mjs`, `lib.mjs` | Maintainers |

## The brands

All real, small to mid size, across categories. Account data is test data; public facts are sourced and dated 15 Nov 2026.

| Slug | Brand | Category | Base |
|---|---|---|---|
| `taylor-stitch` | Taylor Stitch | Apparel (menswear) | US |
| `krave-beauty` | KraveBeauty | Skincare | US |
| `graza` | Graza | Food (olive oil) | US |
| `ritual` | Ritual | Supplements | US |
| `fellow` | Fellow | Home (coffee gear) | US |
| `wild-one` | Wild One | Pets | US |
| `pela` | Pela | Accessories (phone cases) | Canada |
| `sleepy-owl` | Sleepy Owl Coffee | Food and drink | India |

## The tasks

33 tasks across Org context, Meta, Google, TikTok, Amazon, CRO audit, landing page, website, email audit, on-brand email, retention, ad images, UGC scripts, SEO, AEO, market and product research, offers, unit economics, India COD, sourcing and landed cost, tracking, product page copy, review mining and inventory. 12 are held-out (frozen, never used to choose a change). Signal counts vary on purpose: 2 tasks have 0 signals (the right call is "no change"), 3 have 1, 24 have 2 to 3, and 4 have 4 or more. Every ads and email task hides at least one non-obvious segment-by-format or segment-by-offer signal, and has a job check for it.

## How to run a round on Kevin's Claude plan

Text runs and judges always go on the Claude plan: `claude -p` with no `ANTHROPIC_API_KEY` set, or Claude Code subagents. Never an API key for text. OpenAI is used only to render images, and only with a spend cap.

1. **Self-test** (offline, about a minute): `node scripts/selftest.mjs`
2. **Build the run folders.** Put rounds outside any repo, so no arm can stumble on packs or keys:
   `node scripts/make-sheets.mjs prompts --round R1 --rounds-dir C:/aib/evals/rounds`
   Options: `--tasks E04,E13`, `--arms plain,code`, `--runs 3`, `--model opus`, `--packs <dist/packs folder>`.
   Build the packs you mean to test first, and note the commit; each run's `meta.json` records the pack's sha256.
3. **Run the arms:** `bash C:/aib/evals/rounds/R1/run-arms.sh`. Each run is a fresh `claude -p` in its own folder, with MCP servers off (`--strict-mcp-config`), skills, subagents and the web blocked, and only the tools its arm allows. It skips runs that already have `answer.md`, so you can stop and restart. `finish-run.mjs` saves the answer, logs tokens and cost, and audits every tool call; a run that read outside its folder is marked contaminated and left out of judging.
   With subagents instead: give each line of `RUNS.md` to a fresh subagent. Subagent runs cannot be audited automatically, so read a sample of transcripts.
4. **Render images** (creative tasks E16 to E18): dry run first, then render with a cap:
   `node scripts/render-images.mjs --round R1 --rounds-dir C:/aib/evals/rounds`
   `node scripts/render-images.mjs --round R1 --rounds-dir C:/aib/evals/rounds --go --max-usd 4 --usd-per-image <current price>`
   Defaults: model gpt-image-2.5-sunburst, quality medium, 1024x1024, run 1's 5 prompts per arm per task. The key is read inside the script from the `.env` one folder above the repo and is never printed.
5. **Build the blind sheets:** `node scripts/make-sheets.mjs sheets --round R1 --rounds-dir ...` and, after images, `... image-sheets --round R1 ...`. The unblinding key goes to `R1/_key/`, apart from the sheets.
6. **Run the judges:** `bash .../R1/run-judges.sh` (one fresh `claude -p` per sheet, Read only), or give `JUDGES.md` lines to fresh subagents. Image sheets need a judge that can open images (a subagent with Read). Judges never see the arm, word counts, file names, `TASKS.json`, `keys/` or `_key/`.
7. **Score:** `node scripts/score.mjs --round R1 --rounds-dir ...` writes `SCORE.md`, `score.json` and `tune-reasons.md`.
8. **Compare with the last promoted round:** `node scripts/compare-rounds.mjs --base R0 --cand R1 --arm code --rounds-dir ...`. Exit 0 means promote.

## What one round costs

| Item | Full round | Quick round (tune only, plain vs code) |
|---|---|---|
| Arm runs (tasks x arms x 3) | 33 x 3 x 3 = **297** | 21 x 2 x 3 = 126 |
| Single-answer judge calls (one per run) | 297 | 126 |
| Checker calls (one per run) | 297 | 126 |
| Pairwise judge calls (pairs x 3 runs x 2 orders x tasks) | 3 pairs (code vs plain, chat vs plain, code vs chat) x 3 x 2 x 33 = **594** | 1 x 3 x 2 x 21 = 126 |
| Image judge calls | 3 (one sheet per creative task, 15 images each) | 2 |
| **Claude calls in total** | **1,488** | 506 |
| Images rendered (OpenAI, medium) | 3 tasks x 3 arms x 5 = 45 | 2 x 2 x 5 = 20 |

Drop the code vs chat pair with `--pairs code:plain,chat:plain` to save 198 judge calls. Agent runs in the coding app take the most tokens; `SCORE.md` reports logged tokens and cost per arm, so the plan's usage can be checked after each round.

## How scoring works

- **Grades:** seven owner grades, 1 to 10, from the single-answer judge (see `RUBRIC.md`). The owner score is their weighted mean.
- **Win rate:** pairwise, both orders, each order to a fresh judge. A pick counts only if both orders agree; otherwise it is a tie. The share is wins over decided pairs, with a 95% interval from a bootstrap that resamples tasks, then runs inside each task (the task is the unit, not the judge).
- **pass^3:** a run passes a task when the checker marks every job check pass, no decoy is taken and no false signal is presented. pass^3 is the share of tasks where all 3 runs pass. Worst-of-3 and spread come from the owner score.
- **Knowledge lift:** per task, agent minus context-matched plain on grade 2 (domain principles) and grade 4 (backed by sound sources), plus grade 7 (insight). This is the part only our method and knowledge add, since plain Claude had the same files. A good answer is never marked down for using a sound outside source.
- **Length check:** the share of decided pairs won by the longer answer. Well above half means length may be swaying judges.
- **Held-out:** reported as numbers only. Its judge reasons are never written to `tune-reasons.md`.

## The improvement loop

1. **Run** a round on the current packs (the base).
2. **Find the weakest areas** in `SCORE.md`: lowest owner score, lowest worst-of-3, failed pass^3, negative knowledge lift, decoys taken, false signals. Read `tune-reasons.md` and a sample of tune transcripts to find the failure reason (missed a signal, took a decoy, off voice, unbacked claim, unclear first screen).
3. **Fix the thing behind it:** the agent's job skill, the knowledge card, the tool, or the method rule. One family of changes per round, so a result can be traced to a change. New rules start on probation.
4. **Re-run tune** for the touched areas (`--tasks`), score, and check the gain is real (outside the interval, and not just longer answers).
5. **Check held-out:** run the full held-out set once on the candidate packs. Do not read held-out answers or reasons to decide anything.
6. **Promote** only if `compare-rounds.mjs` says PROMOTE: tune improved and held-out did not fall on owner score, worst-of-3, pass^3, win share, or any single grade by more than 0.1. Otherwise keep the base and try the next fix.

House rules for the bench:
- Never put key text, brand names from this suite, avatar names or key figures into packs, skills, cards or method files. That would teach to the test. `../owner-bench/scripts/bench-leak-guard.cjs` reads this suite's brand names, avatar tags ("Dan, 41") and key figures; run it before promoting a round.
- Never edit a held-out task, fixture or key to fit a result. Retire a task only between releases, and replace it with a fresh one on a new brand.
- Rebuild fixtures with `node fixtures/build/build-fixtures.mjs` after any change, then update the key from `--facts`.
- Plain English at grade 8 to 9 in anything an owner or agent reads; no em or en dashes; no prices for AI Blocks; agents serve stores anywhere (India-only work belongs to ishita-india-commerce).
