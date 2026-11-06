# Weekly revenue and calendar review

**Cadence:** Weekly (a 90-day pace check and gap-night sweep), plus a monthly review on the first working day of the month.

**Trigger:** The host hands over pricing, or asks "are we behind?", or prices have not changed in months.

**Access:** Level 1 (read) on the platforms, channel manager and pricing tool is enough to review and propose. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the host's limits (for example: "change nightly prices on the two cottages between your floor and ceiling; set minimum stays between 1 and 5 nights; no special offers, no cancellation policy changes").

## Steps

1. **First time only: build the rules.** Run the `nightly-pricing-and-stay-rules` skill: clean export, cost per booked night, break-even, base rate, layers, stay rules, floor and ceiling. *Approval: the host approves the rules, the floor and ceiling, and the discount settings before anything is applied.*
2. **Weekly: pace check.** Run the `booking-review-and-pace` skill, steps 5 and 6, for the next 90 days. List weeks behind, level and ahead.
3. **Weekly: gap sweep.** Find one- and two-night gaps in the next 60 days. Apply the gap-night rule with the `gap-night-and-minimum-stay-rules` prompt. [L3] Apply inside the approved ranges.
4. **Weekly: price check.** Confirm the calendar shows the intended prices on a sample of nights in each tool, and that stacked discounts stay above the floor. [L3] Correct anything outside the rules and log it.
5. **Weekly: events.** Add events the host lists. With web search connected, check each named event's official dates and record the date checked; without it, use the host's list only.
6. **Monthly: booking review.** Run the full `booking-review-and-pace` skill: occupancy, ADR and RevPAR by month and channel, net of fees, owner stays separated. Propose up to three changes with review dates. [L2] Draft them. *Approval: the host chooses which changes to make; changes outside the agreed limits always need a fresh yes.*
7. **Monthly: platform check.** Re-check the platform pages in `knowledge.md` section 10 (fees, Smart Pricing, cancellation policies) and note any change for the host.
8. **Log and report.** A weekly note: what changed (what, where, when, result), weeks behind and what was done, decisions waiting on the host.

## Outputs

- Rules table, floor and ceiling (first time)
- Weekly pace table and gap list
- Change log for prices and stay settings
- Monthly booking review with up to three proposals
- Weekly note to the host

## Needs the client's approval

The pricing rules, floor, ceiling and discount settings before first use; any price or stay setting outside the approved limits; special offers or custom quotes to guests; and any change to the cancellation policy. Check local rules on night caps and minimum stays before changing stay settings. Revenue figures are arithmetic from the host's data, not financial advice.
