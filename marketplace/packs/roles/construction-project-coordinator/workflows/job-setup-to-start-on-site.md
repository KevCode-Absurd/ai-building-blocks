# Job setup to start on site

**Trigger:** A job is won (builder) or a contractor is chosen (client), and the start date is set.

**Cadence:** Once per job, finishing before the first day on site; repeat the checks if the scope or start date changes.

**Access:** Level 1 (read) on the contract or quote, scope, drawings list, programme and project tool is enough to prepare everything. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits (for example: "set up the Elm Road project in Procore; add the trades and designers to the directory; send RFIs to the architect and engineer; no messages to the client's neighbours or the council").

## Steps

1. **Read the paperwork.** Contract form and key dates, scope, drawings list with revisions, specification, trade list, quotes. Note who signs changes, who certifies payment and the notice rules the client points to.
2. **Duties and permits.** Run the `pre-start-duties-and-permits-checklist` prompt. List who holds each safety role, documents that must exist before start, whether the job may be notifiable, and the permits, approvals and inspections needed. *Approval: the client confirms each appointment and who applies for each permit; professionals confirm their own items. Check local rules.*
3. **Programme.** Run the `build-programme-and-look-ahead` skill to build the programme with the critical path, inspections, long-lead orders and client decisions. [L2] Build it in a copy. *Approval: the client (and contractor, where it is a contract document) accepts the programme.* [L3] Load the accepted programme into the live tool.
4. **Registers.** Using `rfis-submittals-and-changes`, set up the RFI log, the submittal register with submit-by dates, and the change log. Raise first RFIs for anything the documents don't settle. [L3] Send RFIs to the named designers.
5. **Records.** Set up the daily report template with the fixed headings, the delay log and the photo folder structure (`site-reports-and-delay-log`). [L3] Create the folders and templates in the agreed tool.
6. **Orders.** List long-lead items with order dates. *Approval: the client or builder places every order; I prepare the list and the purchase details at level 2.*
7. **First look-ahead.** Run the `two-week-look-ahead` prompt for the first two weeks. [L3] Send it to the named trades.
8. **Kick-off note.** Write a one-page note for the client: key dates, who does what, decisions they must make and by when, how they will hear about progress. [L2] Draft it. [L3] Send it to the named client contacts.

## Outputs

- Duties register and permits list
- Accepted programme with critical path and key dates
- RFI log, submittal register and change log
- Daily report template, delay log and photo folders
- Long-lead order list
- First two-week look-ahead
- Client kick-off note
- Action log (level 3)

## Needs the client's approval

Every safety appointment and permit application (the client and professionals decide; I track); the programme before it becomes a contract document; every order and payment (the client places and pays); messages to anyone outside the named contacts; and anything that changes the contract's price, time, scope or terms (a fresh yes every time, even at level 3).
