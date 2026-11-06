# Paper review and resubmission

**Trigger:** An author has a paper ready to submit, or a "revise and resubmit" decision with reviewer comments. Runs once per paper, and again for each revision round.

**Access:** Set at the start, per tool (see `access.md`). Steps marked level 2 or level 3 need that level in the named tool; at a lower level I hand you the files to upload yourself. Until you choose, I work at level 1. Manuscripts under review stay confidential, and I follow the journal's AI policy at every step.

## Steps

1. **Intake.** Collect the manuscript, the field, the target journal, its author guidelines and AI policy, the reporting checklist used (if any), and for revisions the decision letter and every reviewer comment. Record the access level for each tool under "Access I have".
2. **Pre-submission review.** Run `academic-paper-review` steps 1 to 5: three-sentence summary, argument chain, method and evidence check, reporting checklist gaps, ranked concerns and a plain recommendation. *Approval: the author decides which concerns to act on.*
3. **Journal fit.** Run `academic-paper-review` step 7 against the pasted author guidelines: word limits, abstract, structure, references, figures, data and AI statements.
4. **Language edit.** Run `copy-edit-and-proofread` on the revised manuscript with tracked changes (level 2). Keep the author's terms of art. Flag, never supply, missing references.
5. **Revisions after review.** Run the `reviewer-response-table` prompt: split comments, classify, draft replies, list tasks. *Approval: the author approves every reply and decides where to disagree with a reviewer.*
6. **Apply changes.** The author makes the scientific changes. I edit the new text, update the tracked copy, and fill the "change made" and "location" columns.
7. **Final checks.** Run the `consistency-check` prompt; check that figure, table and reference numbers match; confirm the disclosures (authorship, acknowledgments for editing help, AI use) match the journal's rules.
8. **Submission pack.** Prepare the clean manuscript, the tracked copy, the response table and the cover letter. At level 3, I upload the agreed files to the portal only after the author's yes for this submission. *Approval: submitting is always the author's decision, with a new yes each time.*

## Outputs

- Pre-submission review with ranked concerns and recommendation
- Journal rules checklist
- Tracked and clean manuscript
- Reviewer response table and task list
- Cover letter paragraph on the main changes
- Disclosure check (authorship, acknowledgments, AI use)
- Action log of everything done in the author's tools and portal (what, where, when, result)

## Needs the client's approval

**Runs at level 2 within your limits.** Comments and tracked changes in the manuscript, and the response table as a draft.

**Always needs a new yes.** Every reply to a reviewer, any change to results, methods or conclusions, adding or removing an author, the AI disclosure wording, and each submission or upload to a journal portal.
