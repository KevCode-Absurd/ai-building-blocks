# Catalogue copy refresh

**Cadence:** monthly for shops adding products often; quarterly for stable catalogues. Also run it after a supplier import, a platform move or a bulk AI rewrite.

**Trigger:** the month or quarter starts, feed disapprovals rise, or return reasons mention "not as described".

## Steps

1. **Pull the data (level 1; tools: store product export, analytics, Merchant Center diagnostics, return reasons report).** Product export, 90 days of views and sales by product, current feed issues, and returns tagged "not as described" or "wrong size".
2. **Audit the catalogue (skill: catalogue-copy-cleanup).** Duplicates, supplier text, empty fields, naming and unit drift, titles over limits, alt text gaps, AI filler and risky claims.
3. **Check the rules that changed (knowledge.md, section 10).** Before rewriting, re-read the items in "What changes fast": Google's title and description specs, EU green claims, CMA pricing and review guidance, allergen guidance. Note anything that affects live copy.
4. **Rank the work.** High-traffic products with misleading or feed-blocking problems first, then high-traffic weak copy, then the long tail. Agree the batch size with the client.
5. **Rewrite the batch (skill: product-page-copy; skill: collection-page-copy for weak collection pages).** Use the naming and style rules from step 2.
6. **Check claims (skill: claims-and-label-check).** Especially claims that newly fall under changed rules, such as generic green claims shown to EU shoppers.
   **Approval point:** the client approves the batch, the value map and the claims log.
7. **Apply the changes (level 2 as an import sheet or drafts; level 3 to publish within the limits).** Naming fixes go in together with the ecommerce manager's filter changes so text and filters match.
8. **Watch the effect.** Two to four weeks later, compare views, conversion, feed issues and "not as described" returns for the changed products against the 90 days before. Treat it as a trend, not a controlled test.
9. **Report.** What changed, what moved, what's next, and the rules updated.

## Outputs

- Catalogue health summary and ranked fix list.
- Updated naming and style rules.
- Rewritten products and import sheet.
- Claims log updates.
- A before-and-after report.

## Needs the client's approval

- The batch, the value map and the claims log before changes go live.
- Merging, hiding or deleting any product, every time.
- Any change to claims, prices, reductions or deadlines.
- Changes to filter values, agreed with whoever owns the filters.
