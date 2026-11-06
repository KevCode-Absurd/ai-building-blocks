# Fundraising round plan: from decision to close

**Trigger:** The founder decides to raise a pre-seed, seed or Series A round, or has fewer months of runway than a raise usually takes and needs a plan. **Cadence:** a setup phase, then a weekly pipeline review until the round closes or the founder stops.

**Access:** Set at the start, per tool (see `access.md`). Steps marked level 2 or level 3 need that level in the named tool; until you choose, I work at level 1. Level 3 outreach goes only to investors on your approved list, using approved templates.

## Steps

1. **Should we raise now? (level 1)** Check whether the company is default alive at today's spending and growth, how many months of runway are left, and what the money would get the company to. Agree the amount and instrument in principle. *Approval: the founder decides to raise; the instrument and documents are chosen with the lawyer.*
2. **Legal route first.** The founder's lawyer confirms which securities rules the raise will use (in the US, the SEC exemptions such as Rule 506(b), 506(c) or Regulation Crowdfunding; in the UK, how the financial promotion rules are met; in the EU, the prospectus and crowdfunding rules; elsewhere, the local regulator), what may be said in public, and who may be approached. I record the answer in the plan. *Approval: nothing public about the raise, and no outreach, until the lawyer has answered.*
3. **Numbers ready (level 1).** Tie the metrics and model to the books. Build the cap table and model the round with the `cap-table-and-round-model` skill so the founder knows the dilution before any conversation.
4. **Story and deck (level 2).** Run the `pitch-deck-story-and-text` skill in a copy of the deck; cut a teaser with the `teaser-deck-from-full-deck` prompt; review with the `deck-review-against-investor-questions` prompt. *Approval: the founder approves the final deck and teaser; the lawyer confirms they can be shared.*
5. **Data room (level 2).** Build it with the `fundraising-data-room-index` prompt, private until needed. *Approval: each investor given access must be on the approved list.*
6. **Investor list (level 2).** Run the `investor-fit-scoring` skill: criteria, scores from given facts, tiers, order, outreach notes, intro blurbs with the `forwardable-intro-blurb` prompt. Load the pipeline in the CRM. *Approval: the founder approves the list of investors to contact and the message templates. This becomes the approved list.*
7. **Practice meetings, then top fits (level 3 within limits).** Send approved messages to investors on the approved list in the planned order, and follow up on schedule. Log every message. *Approval: one confirmation of the send list and limits before the first send; any new investor or template needs a new yes.*
8. **Weekly pipeline review.** What moved, what is stuck, which follow-ups are due, what investors asked that the deck should answer. Judge by actions, not words. Update the deck appendix if the same question keeps coming up.
9. **Term sheets.** Run the `term-sheet-questions-for-your-lawyer` prompt for each term sheet: numbers, sale cases and the lawyer questions. *Approval: the founder decides with the lawyer; I give no view on which to accept.*
10. **Closing.** The lawyer prepares and sends the documents. Investors send money to the account the founder confirms by phone with a known contact; I never send or change bank details. Check where the new cash will sit against deposit protection limits. Update the cap table to match the signed documents once the lawyer confirms. Filings (for example Form D in the US) are made by the founder's lawyer or the company. *Approval: signing, issuing shares, filings and money are the founder's, every time.*
11. **First update.** Send the first investor update to the new investor list within a month of closing, using the `investor-update` skill.

## Outputs

- Raise decision note: runway, amount, instrument, milestones
- Legal route note from the lawyer's answer
- Cap table and round model
- Deck, teaser and investor question map
- Data room index
- Scored investor list, approved list and outreach notes
- Pipeline tracker and weekly review notes
- Term sheet comparisons and lawyer questions
- Action log of every message and change (what, where, when, result)

## Needs the client's approval

**Runs at level 3 within your limits, after one confirmation.** Sending approved templates to investors on the approved list, following up on schedule, updating pipeline stages, sharing data room links with approved investors, and updating the master deck.

**Always needs a new yes.** Any investor not on the approved list, a new template, any message about terms, anything public about the raise, any document sent as binding, issuing shares, filings, and anything involving money or bank details. No message ever promises or implies a return. Check this with local rules and ask a qualified accountant or lawyer.
