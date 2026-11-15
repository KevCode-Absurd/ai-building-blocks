# Method notes: why the bench works this way

On 16 Nov 2026 six readers went through Hamel Husain's evals FAQ (hamel.dev/blog/posts/evals-faq) and every page it links to. That covered:
- his core posts and the flashcards;
- the evals-skills plugin;
- Anthropic's "Demystifying evals for AI agents";
- the papers on judge validation, self-preference and abstention;
- the coding benchmarks, plus the titles and chapters of the videos.

This note records what we took, what we left out, and the choices Kevin made.

## What we already did that the sources back

- A held-out set that is never used to choose a change.
- pass^3 and worst-of-3, because an owner gets one run, not the best of three.
- Pairwise judging in both orders, with each order sent to a fresh judge.
- Tasks with no signal, where the right answer is "no change".
- A contamination audit on every run.
- Claude judges on Kevin's plan. Using the same family of model as the task is fine once the judge agrees with the expert, and that agreement is what we now measure.

## What changed

1. **Judges are checked against Kevin.** He is the one expert who decides what "good" means. He labels a sample of tune answers on a local review page (`scripts/review.mjs`). `scripts/agreement.mjs` then reports two rates per grade: the share of his fails the judge also failed, and the share of his passes the judge also passed. Both should reach 0.85 to 0.9. Raw agreement is not used, because it looks good whenever one class is rare.
2. **Kevin's grades stay, with a yes/no layer under them.** His seven grades keep their 1 to 10 scale and weights (his choice, 16 Nov). Each grade gets 2 to 4 yes/no sub-checks, which the judge answers first. It then writes a critique that quotes the answer, and only then gives the score. A pass line at 7 is what agreement is measured on. The sources prefer binary calls because the middle of a scale hides doubt; this keeps Kevin's grades and adds that.
3. **Free code checks run before any judge** (`scripts/asserts.mjs`). Dashes, placeholders, internal codes and must-include figures are checked by code, on every arm. We tuned them against round 1's real answers until good copy passed. Two examples that must pass: a merge field such as "[name]", and a live cart value such as "$X away from free shipping".
4. **A must-pass gate.** Nothing invented, no claim the brand cannot make, no decoy taken. The owner score stays the headline (Kevin's choice). Promotion also needs the held-out must-pass rate not to fall.
5. **Failures are found by reading, not guessed in advance.** Kevin's one-line notes on the first thing that went wrong in each answer get grouped into counted failure types. The most common type picks the next round's fix. New job checks come from failures we have seen, or from hard rules.
6. **The checker names the first failure** (read, diagnose, decide, number, decoy, deliver), and every pass needs a quote. The most common first failure shows where to fix first.
7. **Owner critiques become judge examples.** Only labels from the train split of tune tasks are used, never held-out ones.
8. **The suite must stay hard.** Tasks every arm always passes graduate to a regression set. Tasks no arm ever passes get their key checked. A 100% pass rate means the test has stopped teaching.
9. **Model ids are recorded** for arms and judges, and the rubric version is stamped on every sheet. A silent model change, or judging rounds on different rubrics, now shows up as a warning.
10. **Cheaper tune rounds.** `--pair-runs r1` judges pairs on one run only. Grades and job checks still cover all 3 runs.

## The agents that do the work

The build-specs agents run real jobs: plan, owner yes, write, check after. Their evals follow the same sources:
- a trace log per job;
- code checks that every write had a matching yes before it and that the check after matches the approved plan;
- a table of last good stage against first failed stage;
- a sandbox with a fake ad platform and a simulated owner that can only reach fake tools.
"Should stop" tasks pass only if the agent stops before the step it cannot undo. Owner sign-offs and change requests are recorded as free labels. See `marketplace/build-specs/evals/`.

## What we did not adopt, and why

- **Switching the grades to pass/fail.** Kevin chose to keep his 1 to 10 grades with the yes/no layer.
- **A pass-all rate as the headline.** Kevin chose the owner score plus the must-pass gate.
- **One judge per failure type straight away.** That would multiply judge calls. A grade gets its own focused judge only if its agreement stays below target.
- **Similarity scores (ROUGE, BERTScore) as quality.** They are used only to find answers worth reading, if at all.
- **A vendor eval platform.** Plain files and a local page fit "no GitHub Actions" and the plan-only rule.
