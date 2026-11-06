# Monthly shipping cost and claims review

**Cadence:** Monthly, once the carrier invoices for the month are in.

**Trigger:** Also run it before any carrier, service or 3PL change, and when shipping cost per order jumps.

**Access:** Level 1 (read) on carrier invoices, the shipping platform, orders and the claims log is enough for the review. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits (for example: "update checkout rates to the approved table; change default boxes for the two named products; no carrier changes").

## Steps

1. **Collect the month.** Carrier invoices at line level, the order export with weights and boxes, the 3PL bill if any, and the claims log.
2. **Run the cost review.** Use the `shipping-cost-review` skill, steps 1 to 4: match invoices to orders, cost per order by zone, weight band, service and box, billed versus actual weight, surcharges.
3. **Check billing errors.** List charges that do not match the rate card or the parcel (wrong weight, wrong zone, duplicate charges, surcharges on parcels that should not have them). [L2] Draft a billing dispute for each. *Approval: the client sends disputes or approves them before they go; payment stays with the client.*
4. **Review claims.** From the claims log: claims opened, filed, paid, refused and still open; any deadline in the next month; money recovered against money lost. Bring every new or appealable claim to the client for a fresh yes.
5. **Rank fixes.** Use the `shipping-cost-review` skill, step 7, and the `packing-spec-per-product` prompt for box changes. Pick one or two fixes to test next month, each with a measure.
6. **Recheck cross-border rules if you ship abroad.** Check the current low-value rules for each destination with the `international-shipping-and-customs-prep` skill, step 4, and update landed costs.
7. **Apply approved changes.** [L3] Update checkout shipping rates to the approved table and change default boxes or services within the limits; log each change.
8. **Report.** One page: cost per order this month against last, top causes, billing errors found, claims recovered, fixes under test, and changes made.

## Outputs

- Monthly cost tables and one-page report
- Billing error list and draft disputes
- Claims status and next month's deadlines
- One or two fixes to test, with measures
- Updated landed costs for cross-border sales (if relevant)
- Change log (level 3)

## Needs the client's approval

Billing disputes; every claim and appeal; checkout rate changes (the table first); any change of carrier, service or 3PL; and anything that changes what customers pay. Paying bills and refunds above the client's limit stay with the client.
