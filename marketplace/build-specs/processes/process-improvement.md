# Improve how the team works (monthly)

Once a month the team looks at its own track record (where jobs stalled, which checks kept failing, what you changed at sign-off, and which creatives won) and proposes a small number of changes to the processes, each approved by you before it takes effect.

**Starts from:** The monthly scheduled run, after the monthly numbers process. It needs at least one finished job.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Read the team's track record | Margaret (margaret-job-orchestrator) | track-record.md | numbers-check | no | read |
| 2 | Read what the work achieved | Callum (callum-reporting) | results-record.md | numbers-check, results-review | no | read |
| 3 | Propose changes to the processes | Malcolm (malcolm-ecommerce-growth) | proposals.md | proposal-review | yes | draft |
| 4 | Apply the accepted changes | Margaret (margaret-job-orchestrator) | applied.md | none | yes, the plan | publish |

## Stage by stage

### 1. Read the team's track record

Reads every job card on the board from the last month: how long each stage took, which checks said FIX and why, where you asked for changes at a sign-off, which plans failed or were blocked, and which steps waited longest for you. Counts are made by reading the files, not from memory.

- **Needs:** board/ (job cards and their history); agent-state/log.jsonl; agent-state/plans/ and runs/; processes/
- **Makes:** track-record.md
- **Checks:** numbers-check (every count, median and rate in the record recomputes from its own inputs)
- **Done when:** track-record.md lists, per process, the jobs finished, the median days per stage, the most common FIX reasons, the sign-off changes you asked for, and every blocked or failed plan step.

### 2. Read what the work achieved

Joins the month's finished creatives to their results in the warehouse: hit rate against your main target, the second numbers you chose (for example hook rate), generation spend per winner, and which tags (angle, hook type, format, person, length, model) won or lost. Checks that the lessons in context/learnings.md still hold, and marks any that new results contradict.

- **Needs:** warehouse views creative_performance and daily_blended; context/goals.json; context/learnings.md
- **Makes:** results-record.md
- **Checks:** numbers-check (every count, median and rate in the record recomputes from its own inputs); results-review (each pattern has its sample size and dates, small samples are marked as hunches, and no result is credited to a tag without enough spend)
- **Done when:** results-record.md gives the hit rate with its count and dates, spend per winner, the tag patterns with their sample sizes, and each lesson marked holds, weaker or contradicted.

### 3. Propose changes to the processes

Proposes at most three changes, each tied to evidence from the two records: for example a new check where the same FIX keeps coming back, a stage moved earlier, a sign-off you never change dropped to a lighter look, a different model for a stage that keeps failing, or a lesson promoted into an intake question. Each change says what it fixes, the cost, and how we will know next month if it worked. Changes to your money limits or goals are never made here; they are their own file plans.

- **Needs:** track-record.md; results-record.md; processes/
- **Makes:** proposals.md
- **Checks:** proposal-review (each change fixes a problem the records show, is small enough to judge in a month, and does not weaken a sign-off, a check or the approval gate without a stated reason)
- **Done when:** proposals.md has no more than three changes, each with its evidence, expected effect, cost, and the number that will show next month whether it worked.
- **You sign off:** You read the three proposals. Reply yes with the code to accept the list as written, or say which to drop. Accepting here does not change any process yet; each change is shown to you as an exact file change in the next stage.

### 4. Apply the accepted changes

Writes each accepted change as a new version of the process file, checks it with node agent/process.mjs check, and proposes it with node agent/actions.mjs propose-file, which shows you the old and new file side by side with a code. Each process file changes only on your yes. Jobs already running keep the version they started with.

- **Needs:** proposals.md (signed off)
- **Makes:** applied.md
- **Goes live:** Owner-held process files in processes/, changed one file plan at a time through node agent/actions.mjs propose-file. Nothing outside the store folder changes.
- **Done when:** applied.md lists each accepted change with its file plan code and whether you approved it, and every changed process still passes the process check.

## Where you step in

- **Propose changes to the processes:** You read the three proposals. Reply yes with the code to accept the list as written, or say which to drop. Accepting here does not change any process yet; each change is shown to you as an exact file change in the next stage.
- **Apply the accepted changes:** approve the exact plan of live changes

## How we judge it

- Hit rate: the share of launched creatives that beat the main target in context/goals.json, month by month.
- Time from brief to launch, and how many stages needed a second round.
- Generation spend per winning creative.
- How often you changed work at a sign-off, and why.
