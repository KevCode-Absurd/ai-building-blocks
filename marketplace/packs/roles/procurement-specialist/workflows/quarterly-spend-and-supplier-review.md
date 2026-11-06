# Quarterly spend and supplier review

**Cadence:** every quarter, in the first two weeks after the quarter closes in the accounts. About half a day for a business with up to 100 active suppliers.

**Access:** level 1 in accounting and the contract folder is enough for the review. Level 3 in the calendar and the supplier tracker lets me keep dates and records current within your limits. Paying, cancelling and contacting suppliers about price need your yes.

## Steps

1. **Pull the spend (day 1).** Export the quarter's bills and card spend by supplier. Run the `spend-and-subscription-review` prompt to rank spend, mark recurring charges and flag duplicates, rises and odd charges.
2. **Check prices against contracts (day 1).** For the top suppliers, compare invoiced prices with contract prices and any price-review clause. Note the index the clause names and its latest value (for example the producer price index in the US).
3. **Renewals in the next 120 days (day 2).** List each with the last date to give notice. For each one worth testing, start the `negotiation-and-contract-terms-check` skill now. Level 3: add notice dates to the shared calendar.
4. **Re-screen suppliers (day 2).** Re-run the screening step of the `supplier-due-diligence-and-sanctions-check` skill for active suppliers whose country, sector or ownership changed, and for any supplier due its yearly review. Log the list, date and result. A possible match stops payments and goes to you and your adviser.
5. **Supplier performance (day 2).** On-time and in-full delivery, quality problems, disputes and credits, from your records. Mark keep, review or replace.
6. **Utilities (once a year per contract, or when a contract ends within six months).** Run the `energy-bill-and-tariff-check` prompt.
7. **Report (day 3).** One page: spend versus last quarter, savings achieved and where they show in the accounts, renewals and notice dates, supplier changes, screening results, and three actions with owners. *Approval: you choose which actions to take.*
8. **Act (after your yes).** Level 3: update the supplier tracker and calendar, and send approved price-review or renewal emails to existing supplier contacts. Cancelling a subscription or giving notice needs your fresh yes for each one.

## Outputs

- Ranked spend and recurring charges table
- Price-versus-contract exceptions
- 120-day renewal calendar with notice dates
- Re-screening log
- Supplier performance list (keep, review, replace)
- One-page quarterly report with three actions
- Action log (what, where, when, result)

## Needs the client's approval

**Runs within your limits after one confirmation.** Updating the supplier tracker and shared calendar, and sending approved renewal or price-review emails to existing supplier contacts (level 3).

**Always needs a fresh yes, or stays with you.** Cancelling any subscription or contract, giving notice, accepting new terms, raising a claim against a supplier, adding or changing a payee or bank details, and paying anything.
