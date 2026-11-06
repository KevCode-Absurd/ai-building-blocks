# Acquisition diligence sprint (buying a small business)

**Trigger:** A buyer has found a small business, has the broker's summary or first accounts, and wants to know what to ask and what could change the deal before making or confirming an offer. **Cadence:** a focused sprint, usually two to four weeks, while the seller provides documents.

**Access:** Set at the start, per tool (see `access.md`). Reading the seller's data room is level 1. Building the buyer's own working folder and trackers is level 2. Sending anything to the seller or broker needs the buyer's fresh yes each time.

## Steps

1. **Frame the deal.** What is being bought (shares or assets), the asking price, the timing, how the buyer will pay (savings, loan, seller finance) and what worries the buyer most.
2. **First read.** From whatever has arrived, list the obvious gaps and the first red flags.
3. **Request list.** Run the `due-diligence-request-list` prompt: documents ranked A, B, C, with reasons and seller questions. *Approval: the buyer sends it, or says yes to me sending it to the named broker.*
4. **Profit check.** When accounts and bank statements arrive, run the `quality-of-earnings-review` skill: tie to the bank, rebuild adjusted profit with proof and strength, show upkeep spending, concentration and working capital by month.
5. **Cash after completion.** Estimate the cash the buyer needs for the first six months: working capital at its seasonal high, loan payments if borrowing, one-off costs of taking over. Mark every assumption.
6. **Debt and funding.** If the buyer is borrowing, run the `debt-map-and-payoff-plan` skill on the proposed loan (for example an SBA 7(a) loan in the US) and test cash cover with the adjusted profit, not the broker's figure. Use the `loan-offer-plain-words` prompt on any offer. *Approval: the buyer deals with the lender.*
7. **Red flag report.** Rank red flags by likely effect on the deal, each with evidence, the question and who answers it.
8. **Adviser hand-off.** Questions for the buyer's accountant (tax, structure, how the price is split across assets), lawyer (contracts, leases, warranties, disputes) and lender. *Approval: price and terms are the buyer's decision with their advisers.*
9. **Go, renegotiate or walk away.** I set out what the findings mean for each option in numbers; the buyer decides.

## Outputs

- Ranked request list and seller questions
- Tie-out and adjusted profit schedule with strength ratings
- Concentration, working capital and debt-like items
- Cash needed for the first six months
- Loan offer breakdown and cash cover, if borrowing
- Red flag report
- Questions for the accountant, lawyer and lender
- Action log of everything done in the tools

## Needs the client's approval

**Runs at level 3 within your limits, after one confirmation.** Organising the buyer's own working folder and trackers, and downloading documents from the seller's data room into it.

**Always needs a new yes.** Every message to the seller, broker or lender; any offer, letter of intent or agreement; any deposit or payment, which the buyer makes. I find questions, not answers, and I don't value the business: check this with local rules and ask a qualified accountant or lawyer.
