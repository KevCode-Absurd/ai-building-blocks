---
name: fix-commerce-delivery
description: Implement a measured storefront speed fix across rendering, assets, APIs or CDN configuration without changing product facts, branding or purchase behavior.
---

# Make the smallest effective storefront patch
Start from a trace-backed hypothesis and an authorized local or preview target. Read the current framework/provider documentation for the installed version; generic Next.js or CDN snippets are not safe defaults.

Choose the branch supported by evidence:
- **Slow HTML or APIs:** separate network/region latency from origin work using available request timing, tracing and logs. Locate serial fetches, repeated catalogue calls, expensive queries or cold starts. Parallelize only independent work; narrow payloads and cache only data whose freshness requirements are known. Product price, stock, customer price lists and currency are business correctness constraints.
- **Late hero resource:** make the actual LCP asset discoverable, responsive and correctly prioritized. Keep image fidelity/product geometry, required font identity and alt text. Do not lazy-load the above-fold LCP image or preload every asset. Confirm the chosen resource and bytes in the candidate trace.
- **Render delay or interaction work:** inspect blocking CSS/script, hydration boundaries and duplicate initialization before changing them. Remove demonstrated unused work, split noncritical handlers, reduce repeated layout reads/writes and keep server/client markup consistent. Never keep misleading generic SSR visible to game paint timing.
- **Long catalogue pages:** consider measured offscreen rendering containment only when layout dominates. Use content-visibility:auto with a geometry-based intrinsic size, keep every item in the DOM, and verify native find, focus, all-scroll visibility, page-height changes and CLS. Do not virtualize away indexable product content merely for a score.
- **Cache/CDN:** enumerate public versus personalized routes, cache keys, origin headers, vary dimensions, purge behavior and expiry. Never share account/cart/checkout responses across users or cache writes. Verify two isolated customer sessions and anonymous state, including country/currency/price variants. A cache hit must return correct stock/price policy and current release assets.
- **Third parties:** establish script owner, consent dependency and measured cost. Defer or remove only with merchant requirements preserved; retest payment, reviews, experiment assignment, attribution and essential support. Tag silence is not successful optimization.

Deliver actual native changes and a reversible diff when source access exists. Avoid rewrites or infrastructure purchases unsupported by evidence. Run relevant type/build/unit checks and targeted browser checks; follow ../../workflows/paired-speed-proof.md. If a production-only dependency cannot be exercised, name that limitation and provide a specific readback plan.
