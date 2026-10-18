# Online store add-on: Fifty Static Ad Test Sprint

Extra inputs
- Product photo inventory per product and per variant, filed by job. Products and variants each get their own slots.
- Live offers per product, in the offer's own words, so offer-first and price-anchor slots use real terms.

Added rules for a store
- Slots are assigned per product by arithmetic; an angle that fits only one product is used only in that product's slots.
- Children's products: write to the adult buyer and show the product, no child.
- Ads of a physical product show it open, held, worn or in use only the way the product facts say; otherwise closed and at rest.
- Run `product-truth-sheet-from-photos` for any product that has fewer than three usable photos, and suggest `product-photoshoot-set-workflow` before the sprint.
- A before and after for a store is the old way against the new (objects), never a body or a face.
