# Prove a storefront change
Use this for any claim that a patch made a storefront faster. Decide the primary metric and a practical improvement threshold before running comparisons. Capture baseline and candidate revisions plus deployed asset hashes where available; never benchmark an old bundle while describing a new patch.

Select representative home, collection/search and product pages plus the affected cart/checkout path. Keep URL/content, consent state, user state, device, viewport, browser version, CPU/network throttling, location, cache condition and interaction script equivalent within each comparison. Cold-cache and warm-cache are separate experiments. Record third-party failures and redirects.

Run at least five complete before/after pairs, alternating order, sequentially in a quiet environment. Save every raw report/trace, errors included. If resources compete, record the invalidating event and rerun the entire pair; retain the rejected evidence and reason. Do not repeatedly rerun only the losing side. Review individual runs and dispersion as well as the paired median.

From the exported pack root, obtain the exact input schema with:
```sh
node tools/performance-review.mjs template
node tools/performance-review.mjs observations.json
```
Populate the template with observations, not example values. The tool checks paired comparability, declared thresholds, LCP/TBT/CLS guardrails and functional evidence. It supports descriptive lab comparisons, not INP certification or statistical significance. Retain its actual verdict, including NOT_COMPARABLE, INCONCLUSIVE or REGRESSION. IMPROVED_LAB is not release approval or proven sales uplift.

Keep Lighthouse simulated values, observed trace timings and field measurements in separately labeled columns. Load-only TBT is not field INP. Test real interactions such as variant selection, search, add-to-cart, quantity changes and checkout validation with traces when supported. Record field source, URL versus origin scope, device and observation window; lack of sufficient real-user data is unknown.

Before release, verify visible content/brand fidelity, full scroll, native find, keyboard focus, responsive overflow, links, SEO/canonicals and analytics consent behavior. Check price/stock, variants, cart totals and session separation in an authorized environment. Test the page after deployment and after cache invalidation; retain release identity and rollback criteria. A failed buying flow blocks release even if the lab score improves.

Deliver patch/config diff; prioritized cause-to-change table; raw evidence index; comparison summary; functional pass/fail with receipts; field follow-up and any unverified production steps. Stop after evidence supports the decision; do not tune a score by changing checks or hiding features.
