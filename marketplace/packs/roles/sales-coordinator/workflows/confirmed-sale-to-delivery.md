# Confirmed sale to delivery

**Trigger:** A buyer signs, pays a deposit or sends a purchase order. Runs once per confirmed booking or order, then again for every change until delivery.

**Cadence:** Same day as confirmation; change checks as they arrive; a status update at the points the client sets (for example two weeks before an event, or on dispatch).

**Access:** Record the level granted for the inbox, CRM, order or booking system and the delivery team's task tool under "Access I have". Until the client answers, work at level 1. [L2] needs read and draft; [L3] needs read, write and publish within limits; [YES] needs a fresh yes every time.

## Steps

1. **Collect.** Read the accepted quote or PO, the whole thread and call notes. List every promise with its source.
2. **Check.** List gaps and conflicts between the quote and later messages. Send conflicts to the client. *Approval: the client settles every conflict before the handoff.*
3. **Write the handoff.** Run the `order-and-booking-handoff` skill or the `handoff-sheet-from-thread` prompt. [L2] Save it to the deal and create tasks for the delivery owner.
4. **Confirm to the buyer.** [L3] Send the booking confirmation or order acknowledgment from the approved template, matching the handoff sheet. For trade orders, include PO number, lines, prices, delivery terms and confirmed dates only.
5. **Handle stock or date problems.** Use the `backorder-and-delay-options` prompt. [L3] Send the options message. Never give an unconfirmed date.
6. **Handle changes.** Write each change down, price it from the rate card, and [L3] send the change acknowledgment. Work changes only after the buyer accepts. [YES] Changes that alter a binding contract, add a discount or go off the rate card need a fresh yes.
7. **Money.** Remind the buyer of balance dates from the approved template [L3]. Refunds above the client's limit, credit decisions and any change of payment or bank details stay with the client; prepare them at level 2.
8. **Close the loop.** [L3] Move the deal to its handed-over stage, set the next step (pre-event call, dispatch check, review request after delivery) and log everything.

## Outputs

- Handoff sheet attached to the deal, with sources for every promise
- Buyer confirmation or order acknowledgment
- Change log and change acknowledgments
- Backorder or delay messages with the buyer's choice recorded
- Action log and next steps

## Needs the client's approval

Settling conflicts, the confirmation and acknowledgment templates, changes to binding contracts or prices (fresh yes each time), refunds, credit and payment details (client only), and anything outside the confirmed limits.
