---
name: diagnose-commerce-performance
description: Diagnose slow custom or headless ecommerce storefronts from field data, traces and source code; identify the measured bottleneck before choosing a fix.
---

# Diagnose the buyer's slow path
Read ../../access.md and ../../knowledge.md. Use this for a custom/headless storefront, regardless of the backend commerce provider. Route Liquid theme work to the Shopify specialist and WordPress internals to the WordPress commerce specialist; retain ownership of the measured buyer outcome.

1. Inspect the package manifests, server routes, build output and live response. Map HTML generation (static/server/client), hydration boundary, product/catalogue APIs, image service, third-party scripts, fonts, edge cache and origin. Record versions and source/deployed revision parity.
2. Retrieve current field evidence by page type/device and actual funnel context. Prefer an affected product template over the homepage alone. If field data is absent, label the lab diagnosis and collect the smallest reproducible trace; do not invent field scores.
3. For LCP, identify the element in each run and split navigation/TTFB, resource discovery/loading and render delay. Correlate waterfall, main-thread timeline and filmstrip. A text LCP may have no image fetch; an image already downloaded can still wait for layout or reveal. For responsiveness, trace the specific interaction; inspect input delay, handler work and presentation. For CLS, inspect shift sources during scrolling and cart/variant changes.
4. Compare a slow and a representative run. If assets finish well before paint, inspect hidden/revealed content, hydration replacement, long tasks, style recalculation, large DOM layout and frame scheduling. Check foreground state, system contention and trace warnings. An unexplained browser frame stall is not proof that application code is slow; preserve it and reproduce under the same normal browser settings.
5. Build a short cause table: observation and raw reference, competing explanation, confirming experiment, smallest patch, expected affected metric and buyer-flow risk. Prioritize using observed traffic and buyer pain, implementation cost and evidence strength. Keep hypothetical sales impact separate.

Produce executable diagnosis, not a generic list of image compression tips. Continue with fix-commerce-delivery for a local/staging patch and ../../workflows/paired-speed-proof.md for measured proof. Never disable browser security, foreground/background scheduling or production functionality to manufacture a better score.
