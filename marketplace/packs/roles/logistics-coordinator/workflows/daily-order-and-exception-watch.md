# Daily order and exception watch

**Cadence:** Every working day, first thing, before the first carrier collection.

**Trigger:** The client hands over order follow-up, or "where is my order?" tickets are growing.

**Access:** Level 1 (read) on the store, shipping platform and help desk is enough to produce the watch list. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits (for example: "hold orders with address errors; send the approved delay and tracing messages; send replacements up to the set value; no claims filed, no refunds").

## Steps

1. **First week only: set the rules.** Agree exception rules with the client from their own transit history (days unshipped, days with no scan by service, address checks, delivered-but-disputed). Write the message set with the `delay-and-lost-parcel-messages` prompt. *Approval: the client approves the rules and every template.*
2. **Pull the data.** Export orders and tracking, or read them through the connected tools.
3. **Run the watch.** Use the `order-exception-watch-list` prompt or the `carrier-claims-and-delivery-issues` skill, steps 1 and 2: flag, rank and give the next step for each order.
4. **Fix what can be fixed before collection.** [L3] Place fulfilment holds on orders with address problems and correct addresses the customer has confirmed; release them when fixed.
5. **Tell customers first.** [L2] Draft messages for each flagged order. [L3] Send them from approved templates, within the agreed hours and channels.
6. **Open claim cases.** For likely losses and damage, open a case in the claims log with the carrier's earliest and latest claim dates (`carrier-claims-and-delivery-issues`, steps 4 and 5). *Approval: each claim is filed only with the client's fresh yes.*
7. **Replacements and refunds.** [L3] Send replacements up to the client's set value. Refunds above the client's limit go to the client.
8. **Log and report.** List every live action (what, where, when, result), today's exception count against recent days, and any repeat cause with one suggested fix.

## Outputs

- Ranked exception list with next steps
- Customer messages sent or drafted
- Holds placed and released
- New claim cases with deadlines, waiting for the client's yes
- Daily action log and short trend note

## Needs the client's approval

The exception rules and every message template before first use; every carrier, marketplace or insurance claim; replacements above the set value; refunds above the client's limit; and any message to customers outside the agreed templates or channels.
