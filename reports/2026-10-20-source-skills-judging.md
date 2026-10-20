# Can you hire a mind for a job? First judging round, 2026-10-20

The plan is in docs/SOURCE-SKILLS-PRD.md, subtask 1. For each hire, we gave the AI a mind's files (personality, playbook, knowledge) and one skill built from that mind's work. One helper played a busy person with a real job and wrote the request. Then it answered as the AI, following the skill. A separate judge scored each answer.

- **Cost:** subscription helpers only, Sonnet. No API credits.
- **Jobs:** all four are outside online shops, on purpose.

## Scores (1 to 5)

| Hire | Job | Useful | Specific | Mind shows | Honest | Skill followed | Length | /30 | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| Rob Fitzpatrick + Customer interview question writer | A bookkeeper tests a flat-fee service with hair salon owners | 4 | 4 | 5 | 4 | 5 | 3 | 25 | hire with fixes |
| Claude Hopkins + Free sample offer planner | A coffee roaster plans free samples on a 1,500 dollar budget | 3 | 4 | 4 | 5 | 4 | 4 | 24 | hire with fixes |
| Andy Grove + One-on-one meeting planner | A new engineering manager sets up one-on-ones with six reports | 4 | 5 | 5 | 4 | 5 | 3 | 26 | hire with fixes |
| Charlie Munger + Incentive checker | A dental clinic checks a front-desk bonus before launch | 4 | 5 | 4 | 4 | 5 | 3 | 25 | hire with fixes |

The average is 4.2 out of 5 (100 of 120 points). The judge was told to be hard to please: a 5 means a paid expert would sign it.

## What we learned

- **The minds come through.** "Mind shows" is the strongest score (4.5). Each answer used the person's method, not just their name: Fitzpatrick turns "would you buy?" into a question about what happened last time, Grove plans the meeting around the report rather than the manager, and Munger looks for how the bonus could be gamed.
- **Honest about gaps.** Every run marked what it didn't know with MISSING, and the judge found no invented facts. One run added a made-up personal aside ("as someone who has done this wrong plenty"), which a mind should not do.
- **Too long.** Length is the weakest score (3.25). Three answers ran about 1,300 words because the parts handed back repeated each other.
- **Numbers.** The sample planner didn't work out the sums from the figures the person gave.

## Fixes made in this sprint

- **Free sample offer planner:** step 9 now writes out the sums: samples the budget buys, buyers needed to break even, and the break-even rate. Where a figure is missing, it shows example values labelled as examples.
- **Customer interview question writer:** it now writes a three-line opening the person can use as is, instead of pointing to another skill.
- **One-on-one meeting planner:** it now totals the weekly hours the plan costs and says what to trim. It also has a case for leading a former peer.
- **Incentive checker:** what it hands back is now one pass, with one row per rule (mismatch, example, fix, guard), plus a line on what to tell the team.

## Next round

- Re-run these four jobs after the fixes and compare length and usefulness.
- Add four new hires from different areas: a story skill, a design review, a sales call and a decision check.
- Write a rule for every SKILL.md: what it hands back must not repeat itself.

## Round 2, 2026-10-21

We re-ran the same four jobs after the fixes, and the same judge standard was used.

| Hire | Round 1 /30 | Round 2 /30 | Verdict |
|---|---|---|---|
| Fitzpatrick + Customer interview question writer | 25 | 24 | hire with fixes |
| Hopkins + Free sample offer planner | 24 | 24 | hire with fixes |
| Grove + One-on-one meeting planner | 26 | 27 | hire |
| Munger + Incentive checker | 25 | 24 | hire with fixes |

- **Scores:** the total went from 100 to 99 of 120, so overall it was flat.
- **Fixes:** all four landed. The opening script is there, the break-even sums are written out, the weekly hours are totalled with the passed-over senior handled, and the incentive check is one table with a "tell the team" line.
- **Length:** still the weak spot. Answers ran 1,100 to 1,500 words, for three reasons. Every step and every part of the hand-back became its own section. MISSING gaps appeared in the text and again in a list at the end. And the checks repeated earlier points.

Changes since round 2:
- **Every skill:** each of the 553 SKILL.md files now tells the AI to say each point once, merge steps that give the same thing, aim for under 700 words unless the job needs more, mark gaps once where they belong, and list only the checks that failed. This is written in by tools/lib/needs.mjs.
- **Free sample offer planner:** the stop rule is now tied to the break-even rate it works out.

Next round: re-run the four jobs to see if the length rule works, then add four new hires. The minds have since been rebuilt from much more of their own words (see `reports/2026-10-21-thin-sources.md`), so the "mind shows" scores are worth checking again too.
