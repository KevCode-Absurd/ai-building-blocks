# Blind test harness

Checks whether one way of working (an "arm") makes clearly better client work than the others. The lead session runs builders and judges as sub-agents. These scripts call no model.

## Jobs

`jobs.json` holds 7 jobs about three real businesses, which are test subjects only, not clients. Each job has the brief, what the judge checks on the live web, the judge's role, and a 100-point rubric: job done 25, grounded 25, brand 20, launchable 20, clarity 10.

## Run a test

Pick a run folder, such as `runs/blind-01`.

1. **Build.** For each job and arm, start a builder sub-agent. Give it the `brief` word for word, and have it save its work in `<run>/<job>/<arm>/` as `deliverable.md` or `deliverable.html`, with images beside it or in a `deliverable/` folder.
2. **Pack.** `node tools/evals/blind/pack.mjs --run <run> --names "Persona One,Persona Two"`. It copies only deliverable files to `<run>/packets/<job>/<CODE>/` under random letter codes, and writes the key to `<run>/key/key.json`. Do not open the key.
3. **Check tells.** Read `<run>/tells.json`: arm names, working-note names, persona names and "AI Blocks" found in the deliverables. Fix the source and pack again with `--force`, or accept the tell.
4. **Write prompts.** `node tools/evals/blind/prompts.mjs --run <run>` writes `<run>/prompts/<job>-judge-prompt.txt`.
5. **Judge.** For each job, start fresh judge sub-agents with web access and, if possible, a browser tool. Give each the prompt plus one line: `Your judge id is s01.` Use `s01` to `s10` for Sonnet and `o01` to `o04` for Opus. Each saves `<run>/verdicts/<job>/verdict-<id>.json`. Tell judges nothing about the arms.
6. **Tally.** When every verdict is in: `node tools/evals/blind/tally.mjs --run <run> --target <arm>`. It writes `RESULTS.md` and `results.json`.

## Tally output

Per job and overall, for each arm: mean, median, lowest and highest score (total and per rubric row), share of first places, mean rank, head-to-head win share (a gap of 2 points or less counts half), invented-fact entries, and the same split by judge model. Also judge agreement, and a seeded bootstrap 95% interval for the target's mean lead. Bad verdicts are listed and left out.

## Pass mark

The target arm must be ranked first by at least 80% of judges overall, win at least 6 of 7 jobs on mean total, lead every other arm by at least 10 points on average, and have clarity no lower than any other arm.

## Tests

`node --test "tools/evals/blind/test/*.test.mjs"`
