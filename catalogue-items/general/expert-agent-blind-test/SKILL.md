---
name: expert-agent-blind-test
description: Run a fair blind test of an expert's AI agent against the plain model on the expert's eval set. Gives both sides the same brief and data, labels answers at random, has a fresh calibrated judge score them with the expert's rubric (and again with the order swapped), and reports the win rate, hard fails, pass@1 and pass^k by case type, with the case count and a plain note on how much the result can be trusted.
---

# Expert agent blind test

You run a head-to-head test: the expert's agent against the same model with no agent files, on the expert's own cases. The test is only worth something if it is fair. Both sides get the same input, nobody grading knows which answer is which, and the judge grades the way the expert does. You report what happened, with the numbers that show how much weight it can bear.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.
- **A skill pack** (yours): skill files ready to add to an AI: a workflow file and one SKILL.md for each of its steps.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a document, a skill pack. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the method with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once and merge steps that give the same thing. In CHECKS MISSED, list checks that failed or could not run. If every required check ran and passed, write “none”.

**Tools that do this best:**
- **Claude Code or OpenAI Codex:** They can run each case three times, shuffle labels with a script and save every answer to a file.
- **A second AI from another company:** Using it as the judge cuts the risk that the judge prefers its own style.
<!-- /needs -->

## What you need

- **The agent:** its files or pack, and its version.
- **The eval set:** case files with input, "If asked", "Must include", "Must not" and "Right behaviour", marked tune or held-out (the expert-agent-eval-builder skill makes them).
- **The rubric and a calibrated judge** (`evals/judge.md`) with its agreement record. If agreement on fresh answers is under 90%, say so in the report.
- **A model to test on**, and ideally a second model family for the judge.
- **The expert**, for five blind picks at the end.

## Steps

1. **Freeze.** Write down the agent version, the model, its settings and the date. Don't change any agent file during the run.
2. **Set up two sides with the same input.**
   - Agent side: the agent loaded as usual.
   - Plain side: the same model and settings, in a new chat with no files, no custom instructions and no memory, plus one role line: "Role: [the agent's job title]. Do this job as an experienced professional would." That way the test measures the expert's knowledge, not the word "expert".
   - Both get the case input word for word, the same data files and the same request for the output format.
   - If either side asks a question, a separate chat plays the client and answers only from "If asked", the same way for both. Anything not listed gets "I don't know."
3. **Repeat runs.** Run each case 3 times per side (k = 3). If time is short, run once and say that consistency was not measured.
4. **Clean the answers.** Remove names, sign-offs and mentions of agent files (such as "per my playbook") from both. Change nothing else. Log what you removed.
5. **Random labels.** For each case, label the two answers A and B at random. If you can run code, use a random number, not your own choice. Otherwise ask the person to flip a coin. Keep the key in `evals/results/[run]/key.md`. The judge never sees it.
6. **Judge in a fresh context.** Give a new chat only `evals/judge.md`, the rubric, the case (without "Expert's own answer") and answers A and B. It scores each answer on every gate and on craft, then picks A, B or a tie. Run it again with A and B swapped. If the pick changes with the order, count a tie.
7. **Expert spot-check.** The expert picks blind on five cases. If they disagree with the judge on two or more, stop: recalibrate the judge before you trust this run.
8. **Score.**
   - A run passes when every gate passes and craft reaches the pass mark.
   - Win rate: wins plus half the ties, divided by the number of cases.
   - Hard fails: runs with any failed gate, for each side.
   - pass@1: the share of single runs that pass.
   - pass^k: the share of cases where all k runs pass. It shows whether the agent gets a case right every time, which matters more to a client than getting it right once.
9. **Read the result honestly.** With no ties, chance alone rarely gives 9 or more wins out of 10, 15 out of 20, 20 out of 30 or 26 out of 40. Fewer wins than that is a hint, not proof. Report held-out cases separately from tune cases: held-out results show whether the agent generalises.
10. **Write the report** to `evals/results/[YYYY-MM-DD]-v[version].md`.

## What you hand back

```text
BLIND TEST: <agent name> v<version> against plain <model>, <date>
Judge: <model>, agreement with the expert <x>% on passes, <y>% on fails, <z>% on pairs (<n> fresh answers)
Runs per case: <k>

| Split | Type | Cases | Agent wins | Ties | Plain wins | Win rate | Hard fails (agent / plain) | pass@1 (agent / plain) | pass^k (agent / plain) |
| tune | hero | ... |
| tune | edge | ... |
| tune | trap | ... |
| tune | regression | ... |
| held-out | all | ... |
| all | all | ... |

HOW MUCH TO TRUST THIS
<the case count, whether the win count clears the chance line, judge agreement, anything unfair in the set-up>

LOSSES
- <case id>: <what the judge said>, <likely cause: missing case, wrong rule, taste, method step, stale fact, rubric>

EXPERT SPOT-CHECK
<agreed on n of 5>

MISSING: <anything that stopped a fair run>
CHECKS MISSED
<one line each, or none>
```

Hand the losses to the expert, or to the expert-agent-improvement-loop skill. Each loss becomes a typed lesson and a regression case once the expert approves it.

<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Expert agent improvement loop](https://useaiblocks.com/skills/expert-agent-improvement-loop). It takes the test report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Example

On 7 November 2026, AI Blocks ran a five-job blind test for one client: the same model with and without AI Blocks, a fresh judge, and a second judge with the labels swapped. The averages were 82.0 against 79.0. That is the right shape of test, but five jobs and a three-point gap is a hint, not proof. It was run once per side, so it says nothing about consistency. For Kevin's Media Buyer agent, the same method on 20 of his own audit cases, run three times per side, with a judge that matches his grades, gives a result he can act on.

## Checks

- Both sides got the same input, data and "If asked" answers, and the plain side had no agent files.
- Labels were random and the judge never saw the key, the expert's own answer or any name.
- The judge ran twice per case with the order swapped.
- Held-out cases were not used to change the agent before this run.
- Every number is shown with its case count, model, date and judge agreement.

## If something is missing

- No calibrated judge: run the test, but label the report "judge not calibrated" and let the expert pick blind on every case instead.
- Fewer than 10 cases: run it as a smoke test and say the result can't support a claim.
- Only one model available: use it as judge in a fresh chat, and note that it may favour its own style.

## Avoid

- A weak baseline, such as a plain side with a worse model, less data or a one-line brief.
- Judging in the same chat that produced the answers.
- Dropping a crashed or empty run. It counts as a fail.
- Claims beyond the test, such as "better than human experts" or "proven" on a small set.
