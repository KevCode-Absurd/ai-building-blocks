# Build, test and ship a prompt

**Trigger:** A new AI task is about to go into daily use (an assistant, a GPT or Project, an extraction step in an automation, an image set), or an existing prompt is giving uneven results. Usually one to two weeks.

**Access:** Set at the start, per tool (see `access.md`). Steps marked level 2 or level 3 need that level in the named tool; at a lower level I hand the work to you to run. Until you choose, I work at level 1.

## Steps

1. **Intake (level 1).** The job, the reader, the model and app, 20 or more anonymised real inputs, good and bad past outputs, and where the output goes. Ask which access level applies to each tool, the test budget and the limits, and write them under "Access I have".
2. **Agree success.** Write the job card and the pass criteria with a target pass rate. *Approval: the client agrees the target before any testing.*
3. **Draft.** Use the `production-prompt-writing` skill, or the `extraction-prompt-and-schema` skill for data extraction, or the `image-and-video-prompt-set` skill for images and video. Check vendor-specific notes against the vendor's current docs and date them.
4. **Build the test set.** Use the `prompt-test-set-and-fix` skill, with hard cases and, if the prompt reads untrusted content, injection cases from the `prompt-injection-review` prompt.
5. **Baseline and fix (level 2).** Run the test set within the test budget, or hand it to the client to run. Score with the `grade-outputs-against-expected` prompt and code checks; fix one thing per round.
6. **Review.** Show the client the final prompt, pass rate per version, remaining failures and cost per run. *Approval: the client decides to ship, keep testing or stop.*
7. **Ship (level 3 within limits).** Merge the approved version, update the live automation or publish the assistant to the named people. Log the change. At level 2, open the pull request or hand over the file instead.
8. **Watch.** For the first two weeks, sample real outputs each week and add any new failure to the test set.
9. **Store.** Keep the prompt, schema, test set, results and change log together in the client's files, with the model ID and date.

## Outputs

- Job card and agreed pass criteria
- Prompt file with version, model ID and date
- Schema and code checks (for extraction)
- Test set with results per version
- Change log and action log (what, where, when, result)
- Two-week watch notes

## Needs the client's approval

**Runs at level 3 within your limits, after one confirmation.** Before the first live change, I show the old and new prompt, the test results and what it affects, with the limits: which app or automation, which people, the spend cap and until when. After your yes, I put it live and log it.

**Always needs a fresh yes.** The target pass rate; shipping a version that misses the target; spending above the test budget; a new account, project or audience; deleting prompts, test data or files; and any change to what data the prompt can read or what actions it can take.
