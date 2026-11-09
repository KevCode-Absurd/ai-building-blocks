---
name: expert-agent-eval-builder
description: Build the test that shows whether an expert's AI agent beats plain AI on the expert's own jobs. Writes a rubric of pass/fail gates and weighted craft criteria in the expert's words, an eval set of 20 to 50 cases in a fixed format (about 40% hero, 25% edge, 20% trap, 15% regression, plus a held-out slice), and a judge prompt calibrated to the expert's own grades until it agrees more than 90% of the time.
---

# Expert agent eval builder

You build three things for one expert's agent: a rubric, an eval set and a calibrated judge. Together they are the written statement of what the agent promises to do well, and the means to check it. A rubric and judge that don't agree with the expert measure nothing, so calibration is part of the job, not an extra.

The expert does every grading step. You draft, organise and check.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a document. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the method with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once and merge steps that give the same thing. In CHECKS MISSED, list checks that failed or could not run. If every required check ran and passed, write “none”.

**Tools that do this best:**
- **Claude Code or OpenAI Codex:** They can write one file per case into your project and keep the index up to date.
- **A second AI from another company:** A judge from a different model family is less likely to favour the style of the model being tested.
<!-- /needs -->

## What you need

- **The expert's captured files**, if they have them: scope card, cases, decision rules, taste pairs and never-do list (the expert-knowledge-interview skill makes them). At least the list of jobs the agent does.
- **The expert's time:** about 2 hours for the rubric and cases, and 45 to 60 minutes to grade the calibration set.
- **Optional:** the job's existing scorecard or rubric, test briefs, and real data exports they may share.

## Steps

### 1. Write the rubric (about 30 minutes) to `expert/rubric.md`

One section per job in the scope card.

1. **Gates**, pass or fail, where one fail fails the answer:
   - G1: every fact traces to the input or a named source;
   - G2: no invented numbers;
   - G3: stays within the access and limits given;
   - G4: no placeholder the input could have filled;
   - one more gate for each never-do a reviewer can check from the work alone.
2. **Craft**, 4 to 7 criteria with weights that add up to 100. Start from the job's family:

   | Family | Starting weights |
   |---|---|
   | Web page | Job and conversion logic 20, brand fidelity 25, launchability 20, specificity 15, distinctiveness 10, clarity 10 |
   | Ad creative | Strategic idea 20, range across real differences 20, brand fidelity 15, hook 15, specificity 15, platform fit 15 |
   | Copy or email | Voice fidelity 25, specificity 20, job done 20, proof grounded 15, distinctiveness 10, clarity 10 |
   | Audit or analysis | Diagnosis specific to this account 25, evidence 20, prioritised actions with expected impact 20, correctness 20, clarity 15 |
   | Strategy or plan | Grounded in this business 25, options and trade-offs 20, decision quality 20, actionability 20, clarity 15 |
   | Other | Job done 30, correctness 25, fits the existing system 20, clarity 15, specificity 10 |

   Then make it theirs. Replace generic criteria with the taste constructs that predict good work, in their words. Keep a specificity test ("could a competitor publish this unchanged?"). Ask the expert to set the weights.
3. **Anchors.** For each criterion, describe what 1, 3 and 5 look like, using their pairwise picks as the examples.
4. **Pass mark:** all gates pass and craft is at least 70, unless the expert sets another bar.

### 2. Build the eval set (about 1 to 1.5 hours) to `evals/`

Write `evals/eval-set.md` as an index, and one file per case in `evals/cases/`:

```markdown
# E07: [short title]
Type: [hero | edge | trap | regression]
Split: [tune | held-out]
Job: [from the scope card]
Source: [case what-if | think-aloud | test brief | real job, date | written by a peer]
Added: [YYYY-MM-DD]
Depends on: [platform facts or prices the case relies on, with the date they were true]
## Input
The brief, word for word as a client would send it, and the data files both sides get (in evals/data/).
## If asked
What the client says to likely questions. Anything not listed gets "I don't know."
## Must include
## Must not
## Right behaviour
[do the job | ask first, and which question | stop and hand over | decline]
## Expert's own answer
Optional. Never shown to either side or to the judge.
```

Aim for this mix. Start with 20 cases and grow to 40 or more before showing results to anyone else.

| Type | Share | What it is | Where it comes from |
|---|---|---|---|
| Hero | about 40% | The main jobs, done normally | Real cases, the think-aloud task |
| Edge | about 25% | Partial data, clashing goals, an unusual industry or size | What-ifs, or changing one detail of a hero case |
| Trap | about 20% | Missing tracking, the wrong file, an ambiguous ask, or instructions hidden inside a provided document. Right behaviour is to ask, decline or hand over | The scope card's "stop and ask" list |
| Regression | about 15% | Mistakes already found and fixed | Teach-back corrections, then every real failure |

Rules:

- Spread cases across at least three different businesses, so a rule that suits only one fails somewhere.
- For public-facing work (ads, pages, copy), build cases on real named businesses' public assets, with the link and the capture date. Label the brief as an exercise written for the test. Never say the business asked for it.
- Mark 20% to 30% of cases "held-out", spread across the types. The expert writes these, or a trusted peer does. Keep them outside the agent's folder until test time, and never write a rule from one.
- Grow the set with small changes to passing cases: a different industry, budget, platform or language, or two requests blended into one ambiguous ask.
- The expert approves every case. Keep a note of the cases they reject and why.

### 3. Calibrate the judge (45 to 60 minutes) to `evals/judge.md`

1. Write the judge prompt: "You are a strict reviewer. You will see a case and one or two answers. Score each answer on every gate (pass or fail, with the reason), then on each craft criterion from 1 to 5 using the anchors. If there are two answers, pick the better one or call a tie, with one line on why. Judge only the work. You don't know who or what wrote it." Add the rubric and an empty "Worked examples" section. The judge never sees "Expert's own answer", so it rewards doing the job well rather than matching one reference.
2. Build a calibration set of 20 to 30 answers, separate from the eval set: some from the agent, some from plain AI, some of the expert's own work and a few with a deliberate flaw. Include ten pairs.
3. The expert grades all of them blind: each gate, a craft score, a pick for each pair, and a one-line critique.
4. Run the judge in a fresh chat on the same set, ideally with a different model family from the one the agent uses.
5. Compare. Report two numbers separately: how often the judge passes what the expert passes, and how often it fails what the expert fails. Add pair agreement.
6. For each disagreement, add the expert's critique to "Worked examples", or reword a vague criterion. Run again.
7. Check the result on 10 fresh answers the judge hasn't seen. The target is more than 90% agreement on those. If three rounds don't get there, the rubric is the problem: go back to the expert's taste picks, not to the judge's wording.

Record each round in judge.md: date, set size, the two agreement numbers, pair agreement and what changed.

## What you hand back

`expert/rubric.md`, `evals/eval-set.md`, the case files, `evals/judge.md` with its agreement record, then:

```text
EVAL SET
Cases: <n>   hero <n> | edge <n> | trap <n> | regression <n>   held-out: <n>
Businesses covered: <n>
JUDGE
Agrees on passes: <x>%   Agrees on fails: <y>%   Pair agreement: <z>%   on <n> fresh answers
READY FOR A BLIND TEST: <yes, or what is missing>
MISSING: <cases or grades still needed>
CHECKS MISSED
<one line each, or none>
```

<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Expert agent blind test](https://useaiblocks.com/skills/expert-agent-blind-test). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Example

For Kevin's Creative Strategist agent, a hero case could use an exercise brief written for the test, built on Allbirds' public website and its ads in the Meta Ad Library, with the capture date. Allbirds didn't ask for it, and the brief says so. A trap case could hand over a product sheet with a line hidden in it that tries to change the task; the right behaviour is to treat it as data and say so. A regression case comes from teach-back: if the agent once proposed ten colour variants of one ad as ten concepts, a case checks that it now offers concepts that differ in substance.

## Checks

- Gate and craft weights add up correctly, and every never-do that can be checked is a gate.
- The mix is within about five points of each target share, and held-out cases are 20% to 30% of the set.
- Every case has "Must include", "Must not" and "Right behaviour", and none relies on a fact without its date.
- The judge never sees the expert's own answer or which side wrote what.
- Agreement is reported as two separate numbers, measured on answers the judge was not tuned on.

## If something is missing

- No captured cases: build hero cases from the expert's last five real jobs, and mark the set "thin".
- No time to grade 30 answers: grade 20, and report agreement with the count.
- Agreement stays under 90%: say so, and don't use the judge's scores as proof.

## Avoid

- One reference answer that every output is scored against. It pulls all outputs toward one template.
- Writing rules or examples from held-out cases.
- Cases that only test format, or only one business.
- A judge built from the same chat that wrote the agent's answers.
