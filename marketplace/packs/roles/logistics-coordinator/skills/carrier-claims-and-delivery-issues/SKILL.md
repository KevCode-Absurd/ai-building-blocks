---
name: carrier-claims-and-delivery-issues
description: Handles late, stuck, lost and damaged parcels from first warning to money back - an exception watch on tracking, the customer message at each stage, a claim pack per case with the carrier's own deadline and evidence, a claims log, and packing and dispatch rules that make claims easier to win. Use it daily for exceptions, whenever a parcel goes missing or arrives broken, and monthly to recover money from old cases. Sends approved delay messages with level 3 access; every claim is filed only with the client's fresh yes.
---

# Carrier claims and delivery issues

## When to use

- Parcels show no tracking movement, bounce between depots or say "delivered" when the customer has nothing.
- A customer reports damage or missing items.
- Lost and damaged parcels are being refunded or replaced but never claimed back.
- Claims keep being refused for missing evidence or late filing.

Do not use it to threaten carriers with legal action, to decide who is legally liable, or to refund customers above the client's limit.

## Access needed

- **Level 1 (read):** orders, tracking, the shipping platform, carrier accounts, the help desk and any claims log.
- **Level 2 (read and draft):** draft customer messages, claim packs saved but not submitted, a draft claims log.
- **Level 3 (read, write and publish):** send delay and delivery-problem messages from approved templates, place or release fulfilment holds, send replacements within the client's set limit, and keep the claims log up to date. **Filing a claim with any carrier, marketplace or insurer needs a fresh yes for each claim.** Refunds above the client's limit stay with the client.

## What you need

1. Carriers and services used, and the client's account or contract terms with each.
2. Each carrier's current claim rules: who may file, time windows, evidence, cover and declared value. If the client does not have them, I take them from the carrier's current published terms and mark anything I cannot confirm [check with carrier].
3. The order and tracking export, and the help desk tickets about delivery.
4. Proof of value (invoice or cost price), packing photos, weights and proof of posting where kept.
5. The client's refund and replacement policy, and the limit up to which I may send replacements.

## Steps

### 1. Set the exception rules with the client
Agree what counts as a problem: no scan for a set number of days (by service), delivered but disputed, returned to sender, address problem, damage reported. Use the client's own transit history to set the days, not a guess.

### 2. Run the watch
Each day, list exceptions with order, carrier, service, last scan and date, days since, value and customer impact. Rank by impact and value.

### 3. Message the customer first
Tell the customer what is known, what is being done and when they will hear next, before they write in. Never promise a delivery date the carrier has not given. In the US, if an order cannot ship by the promised time, the FTC rule requires offering the buyer a delay or a cancellation with a prompt refund. In the EU and UK, the seller handles consumer delivery problems; the customer is not sent to the courier.

### 4. Open a case and note the deadlines
For each likely loss or damage: the earliest date a claim can be filed and the latest, from the carrier's own terms. USPS, for example (as of 6 Nov 2026): damaged or missing contents at once and within 60 days of mailing; lost items from 15 days (7 for Priority Mail Express) to 60 days. For US truck freight covered by 49 U.S.C. 14706, carriers may not allow less than 9 months to file. Put both dates in the log.

### 5. Build the claim pack
Facts in date order (ordered, packed, posted, scans, customer report), what is claimed (value, shipping, as the carrier's terms allow), and the evidence: order and tracking number, proof of value, proof of insurance or declared value if used, packing and damage photos, weights, the customer's report. Keep the packaging and contents for damage claims until settled; carriers may ask to inspect.

### 6. Ask for the fresh yes, then file
Show the client the claim pack, amount and deadline. Only with their yes for this claim, file it in the carrier's portal or through the shipping platform. Record the claim number and the date of the expected decision.

### 7. Track and follow up
Chase on the carrier's stated timeline. If refused, record the reason and whether the carrier allows an appeal and by when (USPS allows 30 days). Bring appeals back to the client for a fresh yes.

### 8. Fix the cause
Monthly, group cases by carrier, service, route, product and packer. Write packing and dispatch rules that prevent repeats and make claims easier to win: photo before sealing, weigh and record, the right service and cover for high-value items, proof of posting kept.

## Checks

- Every deadline comes from the carrier's current terms or the client's contract, or is marked [check with carrier].
- Every customer message is honest, dated and promises only what the client approved.
- Every claim pack has the evidence the carrier asks for.
- No claim was filed, and no appeal sent, without a fresh yes.
- No legal threats or liability opinions in any message.
- Replacements and refunds stayed within the client's limits.

## Output format

1. Daily exception list with next step and owner.
2. Customer message set by stage: delayed, being looked into, replacement sent, refunded, delivered-but-missing, damaged.
3. Claim pack per case.
4. Claims log columns: order, carrier, service, issue, claim open date, deadline, evidence status, amount, claim number, outcome, appeal date.
5. Monthly cause review and packing rules.

## Example of good output (short)

*Made-up business for illustration: Little Fern Candles, UK seller using two carriers.*

> **Exception:** Order 20871, tracked 48-hour service, last scan "at depot" 6 days ago, value 42 pounds, customer has not written yet.
> **Customer message (sent from approved template):** "Hi Priya, your candles are taking longer than they should. The courier's last update was on Friday at their depot, and we've asked them to trace it. We'll update you by Thursday, and if it hasn't moved by then we'll send a replacement straight away."
> **Claim log:** opened 6 Nov; carrier's claim window [check with carrier: client's contract says 28 days from despatch, carrier site not confirmed]; evidence: proof of value (invoice), packing photo, weight 0.9 kg, proof of posting. Status: waiting for trace result.
> **For your yes:** claim for 42 pounds plus postage, to file on 13 Nov if no movement.
