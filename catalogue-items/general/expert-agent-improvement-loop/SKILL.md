---
name: expert-agent-improvement-loop
description: Run the weekly 2 to 3 hour loop that makes an expert's AI agent better without drifting. Collects failures from real use, clusters them, proposes 10 specific fixes, lets the expert keep the best 2 (with reasons logged for the rest), tests them in a blind regression on the eval set, and bumps the version. Keeps client-only lessons out of the agent's general rules, and adds a monthly eval refresh and growth prompts for the expert.
---

# Expert agent improvement loop

You run one week's improvement cycle for an expert's agent. Ideas come from evidence (real failures), the expert chooses, and every change is tested blind before it stays. Two fixes a week that hold up beat ten that quietly break something else.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your notes** (yours): what to keep, change or drop.
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

**Makes it better (optional):**
- **A test report** (yours): what was tested, what passed, what failed and why.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your notes, a document, a test report. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the method with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once and merge steps that give the same thing. In CHECKS MISSED, list checks that failed or could not run. If every required check ran and passed, write “none”.

**Tools that do this best:**
- **Claude Code or OpenAI Codex:** They can apply each fix to a copy of your agent and run the test cases on both versions.
- **Any good chat AI:** Claude, ChatGPT or Gemini can group the mistakes and draft the fixes for you to save.
<!-- /needs -->

## What you need

- **The agent's files**, including "Rules I learned" and its version.
- **This week's evidence:** after-action reviews from real jobs, the expert's edits with reasons, client complaints, decision-journal calls that went wrong, and failed eval cases. Client details taken out.
- **The eval set and judge** (the expert-agent-eval-builder skill makes them), and the blind-test method (the expert-agent-blind-test skill).
- **The expert's time:** about 2 to 3 hours across the week.

## Steps

1. **Collect (30 minutes).** Put each failure in `training/improve/inbox.md` as one line: date, job, what went wrong, the evidence, and the expert's reason if they edited the work.
2. **Cluster (20 minutes).** Group the failures twice:
   - by what went wrong: missed step, wrong fact, weak judgment, off taste, broke a never-do, ignored a limit, went beyond access;
   - by the file at fault: scope card, a decision rule, a missing case, taste files, never-do, rubric, a method step, knowledge, access.

   Then sort each failure: would the fix be right for any client in the scope card, or only for this client? Test it by asking "Would this rule be right for a different client in the same scope?" Client-only lessons go to that client's own project (its context/ folder) and stop there. They never enter the agent's general rules, so one client's habits don't flatten the next client's work.
3. **Generate 10 candidates (15 minutes).** Write ten specific changes. Each one names the cluster it fixes, the file and the exact edit, the operation (add, edit, remove or confirm a rule), the effect it should have, and what it could break. Allowed kinds of change: clearer wording, a new case or a contrasting example, a rule split into smaller steps, a missing check, a new gate, or a fact update. Don't propose anything already in `training/improve/graveyard.md` unless there is new evidence.
4. **The expert keeps 2 (20 minutes).** They score each from 1 to 5 on how often the problem happens, how bad it is, how easy the fix is, how well it fits the scope card, and how risky it is. They keep two, and at least one must target the biggest cluster, so the loop doesn't drift toward easy tweaks. Log the other eight in the graveyard with a one-line reason each.
5. **Blind regression (45 to 60 minutes).** Apply the two changes to a candidate version. Run the tune cases, every regression case and the cases behind the target cluster, old version against new, with the blind-test method (random labels, fresh judge, swapped order). Keep a change only if:
   - there are no new hard fails;
   - every regression case still passes;
   - the target cluster improves;
   - the new version wins at least half the cases against the old one.

   If only one change passes, keep that one. Turn each fixed failure into a regression case. Leave held-out cases for the monthly refresh.
6. **Bump the version (10 minutes).** Set the new version (YYYY.MM.DD). Add a changelog line: the problem seen, the change made, and the numbers before and after. Add each kept change to "Rules I learned", typed:

```markdown
### R12 · decision_rule · active
Rule: [what to do or not do, specific enough to check]
Applies when: [the situation]
Why: [the reason]
From: [the failures, with dates]
Tested: [cases and version]
```

The types are `decision_rule`, `taste_reference`, `never_do`, `exemplar` and `check`. Status is `probation`, `active` or `retired` with a reason.

### Once a month (about 90 minutes)

- Add the month's new cases, keeping the mix (about 40% hero, 25% edge, 20% trap, 15% regression), and retire cases whose dated facts have changed.
- Write three to five new held-out cases (a peer is best), move the oldest held-out cases into the tune set, and run the held-out blind test. Report it on its own.
- Recalibrate the judge on ten fresh picks from the expert, because their criteria shift as they see more work. Version the rubric.
- Prune "Rules I learned". Past about 30 active rules, fold the confirmed ones into the main files (decision rules, never-do, taste, rubric) and retire the rest with reasons.
- Recheck dated facts against their official sources.
- Run one job for three different businesses. Where the businesses differ, the answers must differ. If they look alike, the rules have gone generic.

### Grow the expert, not only the agent

- **Ten things I could do better.** Once a month, the expert sends their agent this:

```text
Read my cases, decision rules, decision journal, the last month's failures and my eval results. List 10 things I could do better in my own work, each with the evidence behind it, or marked "a guess". Then list 3 problems I haven't faced yet that fit my scope card, such as a case type missing from my cases, a recent platform change, or a nearby job clients ask for. For each one, give me a realistic case to think through.
```

  They keep the two that hold up. Each becomes a small experiment in their real work, or a new case.
- **After-action review** after each real job: what was supposed to happen, what happened, what went well and why, what to change and how. The agent drafts it; the expert corrects it in five minutes.
- **Premortem** before a plan or launch: "It's three months from now and this failed. What are the three most likely reasons?" Each gets its evidence, an early warning sign and a check.
- **Decision journal:** before the result is known, write the decision, the options, the expected result, a probability, the reasons and a review date. At review, judge the call apart from the result. Each month, check that calls marked 70% came true about 7 times in 10.

## What you hand back

```text
WEEK OF <date>: <agent name> v<old> to v<new>
CLUSTERS
1. <cluster>: <n> failures, <file at fault>, general or client-only
CANDIDATES (10)
| # | Fix | Cluster | File | Scores (often, bad, easy, fit, risk) | Kept? |
KEPT
- <change>: regression <passed or failed>, <numbers before and after>
GRAVEYARD
- <idea>: <reason>
CLIENT-ONLY LESSONS (sent to the client's own project, not the agent)
- <lesson>
CHANGELOG LINE
<problem, change, before and after>
MISSING: <evidence or cases still needed>
CHECKS MISSED
<one line each, or none>
```

<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Personal agent builder](https://useaiblocks.com/skills/personal-agent-builder).
- **Decide what to do** with the [Decision checklist builder](https://useaiblocks.com/skills/decision-checklist-builder). It takes the lessons.
- The [Prompt fixer](https://useaiblocks.com/skills/prompt-fixer). It takes the test report.
- The [Persistent bug debugger](https://useaiblocks.com/skills/fix-loop-breaker). It takes the test report.
- The [Hiring mistake checklist builder](https://useaiblocks.com/prompts/hire-mistake-checklist-builder). It takes the lessons.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Example

For Kevin's Media Buyer agent, a week's inbox might hold his edits to three audits. If two edits fixed the same thing in different accounts, that cluster is a general candidate. If one edit only reflects one client's reporting preference, it goes to that client's project and never into the agent's rules. Of ten candidate fixes, Kevin keeps two. One of them targets the biggest cluster. The other eight go to the graveyard with a line each, so next week's list doesn't repeat them.

## Checks

- Every candidate is tied to a real failure, not to a general idea of good practice.
- No client-only lesson reached the agent's general files.
- Both kept changes passed the blind regression, or the failure is reported and the change was dropped.
- Held-out cases were not used to choose or tune a change.
- The version, the changelog line and the rule statuses are updated together.

## If something is missing

- No failures this week: run the "ten things" prompt or add three new edge cases instead, and say the loop had no evidence.
- No eval set yet: build one first with the expert-agent-eval-builder skill. Without it, changes can't be tested and shouldn't be kept.
- No time for the regression: keep the changes on probation and test them next week before relying on them.

## Avoid

- Rewriting the whole rulebook each week. It loses detail and drifts toward bland, universal advice.
- Keeping more than two changes a week. It hides which change caused a later failure.
- Rules that hold for every client in every case. Good rules say when they apply.
