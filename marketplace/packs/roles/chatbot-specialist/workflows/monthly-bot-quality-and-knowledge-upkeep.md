# Monthly bot quality and knowledge upkeep

**Cadence:** Monthly, and straight away after any change to prices, policies, products, opening hours, the bot's model or its platform. About two to four hours for a small bot.

## Steps

1. **Pull the month's evidence (level 1).** A transcript sample (random, hand-overs, low ratings, complaints) with personal details removed; the vendor's figures; recent tickets the bot did not handle.
2. **Review transcripts.** Run the `review-bot-transcripts` prompt or the `chatbot-test-and-review` skill. Count wrong, risky and missed hand-over answers by type and severity.
3. **Read the numbers honestly.** Split confirmed resolutions from assumed ones (customers who left without asking for more), and check whether hand-overs carried context. A rising "resolution rate" with rising complaints is a warning, not a win.
4. **Find knowledge gaps.** Run the `new-entries-from-tickets` prompt to list questions the bot cannot answer and entries made stale by recent changes.
5. **Check the rules still hold.** Re-read the AI disclosure, hand-over route and privacy settings against any changes to the law or platform policy since last month (see "What changes fast" in the knowledge file).
6. **Draft fixes (level 2).** Draft new and corrected entries, reworded instructions and new test cases in a private copy or as unpublished drafts. *Approval: the owner approves each new or changed entry and any change to instructions or hand-over rules.*
7. **Retest.** Rerun the full test set, including last month's regression cases. No critical failure may remain.
8. **Publish (level 3).** Confirm the action list and limits with the owner if anything is new, then publish the approved changes and log each one. Without level 3, send the client a numbered change list.
9. **Report.** One page: what went wrong, what changed, retest results, knowledge entries added or retired, and anything for the owner or their adviser to decide.

## Outputs

- Transcript review table with counts by type and severity
- Confirmed vs assumed resolution figures and a note on hand-over quality
- New and corrected knowledge entries
- Updated instructions and test set with regression cases
- Retest sheet, before and after
- Monthly one-page report and action log

## Needs the client's approval

Every new, changed or retired knowledge entry; any change to instructions, disclosure or hand-over wording; changes to the bot's tools or channels; any live change at level 3, with the action list and limits confirmed before the first one; pausing or rolling back the bot unless this was agreed in advance.
