# New listing launch

**Trigger:** A host is listing a home for short stays for the first time, adding a new unit, or moving to a new platform.

**Cadence:** Once per listing, over two to four weeks before the first guest, then a review after the first month.

**Access:** Level 1 (read) is enough to prepare everything. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the host's limits. Registration, licence and tax applications are made by the host.

## Steps

1. **Local rules first.** Run the `local-rules-and-registration-check` prompt for the address. With web search connected, check the city and national pages live and record dates; without it, list each item as [CHECK LOCAL RULES] with the office to ask. For EU addresses, check the national registry under Regulation (EU) 2024/1028; in England, note the registration scheme expected in March 2027 and the business rates test; in New York City, registration and the host-present, two-guest rules. *Approval: the host confirms the home can be let as planned and makes any applications.*
2. **Costs and break-even.** Run the `nightly-pricing-and-stay-rules` skill, step 2, with the host's cost list and platform fees.
3. **Prices and stay rules.** Run the rest of the `nightly-pricing-and-stay-rules` skill. With no booking history, start from the host's income goal and break-even, mark the base rate as a placeholder, and review after the first month. *Approval: the host approves rules, floor and ceiling.*
4. **Listing, messages and house guide.** Run the `guest-messages-and-house-guide` skill. Disclose every device; show the total price for US listings; add the registration number where required. *Approval: the host approves the listing and templates.*
5. **Connections.** Decide how each platform connects: Airbnb co-host access at the level the host grants; Booking.com and Vrbo through a channel manager or property management system, never by automating their sites. Agree the cancellation policy. *Approval: the cancellation policy and house rules are the host's decision.*
6. **Turnover set-up.** Choose cleaners, the checklist, reference photos of every room, linen and restock plan, and how cleaners hear about bookings (a tool that schedules cleans from the calendar, or a shared calendar). *Approval: adding a cleaner who will be paid needs the host's yes.*
7. **Go live.** [L3] Publish the approved listing and apply the approved prices and settings. Check the live listing on a phone as a guest would see it, including the total price.
8. **First month review.** Run the `booking-review-and-pace` skill and replace placeholders with real data.

## Outputs

- Local rules checklist with sources and dates
- Cost and break-even table
- Price calendar, stay rules, floor and ceiling
- Listing, message set and house guide
- Connection and access record per platform
- Turnover checklist and cleaner schedule
- First-month review

## Needs the client's approval

Whether the home can be let (after local rules), every application and fee, prices, floor and ceiling, the listing and templates, the cancellation policy and house rules, new cleaners, and going live. This is a launch checklist, not legal or tax advice; check local rules and ask a qualified adviser or accountant.
