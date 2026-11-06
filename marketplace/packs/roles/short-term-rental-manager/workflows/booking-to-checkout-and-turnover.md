# Booking to check-out and turnover

**Trigger:** Every new booking.

**Cadence:** Runs per stay, with a daily check of arrivals, departures and turnovers.

**Access:** Level 1 (read) is enough to plan and write. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the host's limits (for example: "send the five approved messages through Hospitable between 8 am and 9 pm; answer guest questions from the house guide; schedule cleans in Breezeway with the two cleaners on your list; refunds up to your limit; no cancellations, no damage claims, no replies to negative reviews").

## Steps

1. **First time only: set up.** Write the listing, message set and house guide with the `guest-messages-and-house-guide` skill. Agree the turnover checklist with the cleaners (photos of each room, restock list, damage and lost-property reporting). *Approval: the host approves the listing, every template and the checklist before first use.*
2. **Booking made.** [L3] The booking-confirmed message goes out. Check the booking fits the house rules (guest count, dates, any local cap). [L3] Schedule the clean for the departure day in the cleaning tool, or confirm the tool did it automatically, and check the cleaner has it.
3. **A week before.** [L3] Send the directions and house guide message. Confirm the clean and any linen or restock order.
4. **Arrival day.** [L3] The arrival message goes through the platform's scheduled message or the lock tool, with the code from the lock tool, never through chat with me. Check the turnover was completed with photos before check-in time.
5. **During the stay.** [L3] Send the mid-stay check. Answer questions from the house facts. For problems, run the `reviews-and-guest-issues` skill: reply fast, fix first, log the time. Unsafe situations: the guest calls the emergency number first; tell the host at once. *Approval: refunds above the host's limit and any cancellation need a fresh yes.*
6. **Check-out.** [L3] Send the check-out message. The cleaner completes the checklist and photos.
7. **Turnover review.** Compare turnover photos with the reference photos. If there is damage, build the damage pack (`reviews-and-guest-issues`, step 4) the same day, because Airbnb and Booking.com both give 14 days. *Approval: the damage claim and its evidence need a fresh yes.*
8. **Review.** Ask every guest for a review the same way. [L3] Reply to positive and neutral reviews with the `review-reply` prompt. *Approval: replies to negative reviews need a fresh yes.*
9. **Close the loop.** Add any fix to the house guide, listing or checklist. Log every action.

## Outputs

- Approved listing, message set, house guide and turnover checklist (first time)
- Messages sent per stay and a guest-issue log
- Cleaning schedule and completed checklists with photos
- Damage packs when needed
- Review replies and a fix list

## Needs the client's approval

The listing, templates and checklist before first use; refunds above the limit; any cancellation; damage claims and evidence; replies to negative reviews; adding a new cleaner who will be paid; and payments to cleaners, which the host makes. Check local rules on guest numbers, registration display and safety equipment for each address.
