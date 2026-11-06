# Draft to clean copy

**Trigger:** A client sends a draft (report, article, web page, proposal, handbook) and a deadline. Works for one piece or a batch. Typical turnaround is set with the client at step 1, never assumed.

**Access:** Set at the start, per tool (see `access.md`). Steps marked level 2 or level 3 need that level in the named tool; at a lower level I hand you the files to apply yourself. Until you choose, I work at level 1.

## Steps

1. **Brief and access (day 1).** Ask the questions in `access.md`: reader, goal, level of edit, spelling and style guide, what must not change, length limit, deadline, and the access level for each tool. Write them at the top of the job notes under "Brief" and "Access I have".
2. **First read and level check.** Read the whole draft once. Write the main point in one sentence. If the structure doesn't work, say so now and offer the `structural-edit` skill before any line edit. *Approval: the client agrees the level of edit and the price or time before work starts.*
3. **Structural edit, if agreed.** Run `structural-edit`: one-sentence summary, reverse outline, ranked fixes, proposed outline (level 2: comments in the document and the outline saved beside it). The writer revises, or agrees that I move sections in a copy.
4. **Style sheet.** Run the `style-sheet-builder` prompt on the revised draft. *Approval: the client confirms any choice the house style doesn't decide.*
5. **Copy edit.** Run `copy-edit-and-proofread` steps 1 to 4 with tracked changes in Word or Suggesting mode in Google Docs (level 2). Flag claims with the `claim-and-source-flag-list` prompt. For text the public must act on, use `plain-language-rewrite` on the sections that need it.
6. **Writer review.** The writer accepts or rejects changes and answers queries. I answer their questions on any change.
7. **Consistency and proofread.** Run the `consistency-check` prompt, then the proofread pass from `copy-edit-and-proofread` step 5 on the final or laid-out version.
8. **Finalise.** At level 3, within the limits set, I accept the agreed changes into the master copy, save the clean version where agreed, or update the named page. Otherwise I hand back the clean and tracked files for the client to apply. *Approval: publishing or replacing a live page or file needs the yes given at the start of the job for that page; any change to published legal, medical or financial wording needs a new yes.*
9. **Close.** Send the change summary, open queries and the style sheet for next time. Log every action taken in the client's tools.

## Outputs

- Agreed brief and "Access I have" note
- Structural notes and proposed outline (if step 3 ran)
- Style sheet
- Tracked copy and clean copy
- Change summary (three to seven bullets) and author queries
- Claims list for the writer to check
- Proofread notes on the final version
- Action log of everything done in the client's tools (what, where, when, result)

## Needs the client's approval

**Runs at level 3 within your limits, after one confirmation.** Before the first live change, I show the list (accept tracked changes in the named files, update the named pages) and the limits: which files and pages, and until when. After your yes, I do these and log each one.

**Always needs a new yes.** The level of edit and scope, any change of meaning, cutting a section, any change to published legal, medical or financial wording, deleting or overwriting a file or page outside the agreed list, and sending anything to a new person.
