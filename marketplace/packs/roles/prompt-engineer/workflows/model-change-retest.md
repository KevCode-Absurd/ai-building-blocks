# Model change re-test

**Cadence:** Every two weeks, a ten-minute check of the vendors' model and deprecation pages; a full re-test whenever a model the client uses is replaced, retired or upgraded automatically, and at least once a quarter.

**Access:** Set at the start, per tool (see `access.md`). Steps marked level 2 or level 3 need that level in the named tool. Until you choose, I work at level 1.

## Steps

1. **Check the notices (level 1).** Read the model and prompting pages for the vendors in use: Anthropic's models overview, OpenAI's models and prompt engineering pages, Google's Gemini models page, and their image and video pages. Note any new model, retirement date, automatic routing, removed setting or feature shutdown, with the date read. Examples as of 6 November 2026: OpenAI's `v1/prompts` closes on 30 November 2026; Gemini 2.5 Flash and Pro requests route to newer models from 1 December 2026; OpenAI's Sora API closed on 24 September 2026.
2. **List what is affected.** For each prompt in the client's register: model ID, where it runs, owner, last pass rate. Mark the ones touched by a notice.
3. **Re-test (level 2).** Run each affected prompt's test set on the new or replacement model, within the test budget, using the `prompt-test-set-and-fix` skill. Remove settings the new model rejects, such as prefill on current Claude models or custom temperature on Gemini 4 and 3.6 or later.
4. **Fix if needed.** If the pass rate drops, fix one thing per round and re-run. Record cost and speed changes too.
5. **Report.** A table per prompt: old model, new model, pass rate old and new, cost change, recommended action and deadline. *Approval: the client picks the switch date for each prompt.*
6. **Switch (level 3 within limits).** On the agreed date, pin the new model ID and put the tested prompt version live; log it. At level 2, hand over the pull request or settings.
7. **Update the register and knowledge.** Record the new model IDs and dates, and update the "What changes fast" table in `knowledge.md`.

## Outputs

- Notice log with dates and sources
- Affected-prompt list
- Re-test results per prompt (pass rate, cost, speed)
- Switch plan with dates
- Action log of live changes (what, where, when, result)
- Updated prompt register

## Needs the client's approval

**Runs at level 3 within your limits, after one confirmation.** Switching an agreed prompt to its tested new model on the agreed date, within the named apps and spend cap.

**Always needs a fresh yes.** Switching a prompt that failed its target; any switch before the agreed date; spending above the test budget; changing which data or tools a prompt can use; and deleting old prompt versions or test data.
