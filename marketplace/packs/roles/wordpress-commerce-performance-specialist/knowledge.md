# Commerce performance knowledge

## Evidence and priorities
A faster store must still communicate the offer, render approved product assets and let customers buy correctly. Rank affected templates and interactions using actual traffic, complaints and funnel evidence. Record missing business data; benchmark milliseconds alone do not establish lost revenue or conversion lift.

LCP measures visible main-content timing. Separate HTML response, resource availability and the delay before rendering; a late paint can remain even after an asset shrinks. Use field evidence to establish affected users and a trace to test a causal hypothesis. [1] INP needs interaction evidence across visits; test the slow buyer action rather than presenting load-only blocking time as responsiveness. [2] Inspect layout movement during the whole journey, not only its first screen. [3] Lighthouse results vary with environment and page behavior; preserve a series of paired observations instead of choosing the best score. [4]

## Retrieve only what this job needs
Begin with current shared brand facts: visual/typographic constraints, product image requirements, offer/price/stock rules, target devices/markets, essential measurement and consent. Then retrieve the platform, page-template and symptom slice of available ecommerce knowledge. Use the packaged knowledge map/search when available, and authorized source manifests for merchant Drive or ecommerce course notes; this pack does not imply that every source or EcomOS folder is accessible.

For a paid-traffic landing page, combine page experience evidence with campaign destination/offer requirements; for checkout, prioritize session and transactional correctness. Pull adjacent source passages only when a dependency or unresolved contradiction requires them. Keep source ID/date/version and distinguish current official implementation docs from dated playbooks or hypotheses. Do not copy private/course text into a public deliverable.

## Remember what was actually learned
Keep working context compact: target, revision, current hypothesis, authorization, next check. Record dated episodic runs with raw receipts and failure reasons. Keep stable merchant requirements in tenant-scoped brand memory. Promote semantic rules and procedural playbooks only when supported, scoped to platform/version and revisited after upgrades. Performance observations from one merchant do not become global facts or an authorization to change another store.

## WordPress and WooCommerce execution
Separate host capacity, PHP/application work, database work, cache behavior and browser rendering before changing settings. WordPress's optimization guidance covers these layers; it does not identify which plugin caused this store's problem. [6] Short diagnostic sampling can help, but query logging itself adds overhead and must be removed from final timing runs. [7]

WooCommerce's cache guidance identifies cart, account and checkout as personalized and documents its session cookies. Host-specific database-cache behavior differs from page-response caching. [8] Apply exclusions to the configured routes and actual edge rules, then test isolated sessions. Do not blindly remove WooCommerce scripts on pages outside cart/checkout: blocks, mini-carts, variations or extensions may require them there. Discover dependencies on the installed version.

Action Scheduler concurrency affects server load. A backlog can represent a failed business operation; do not erase or replay it merely to shrink the count. [9] Preserve hook-level failure evidence and verify recovery in an isolated environment before a scoped production operation. Never copy a live database into running staging without isolating payments, mail, webhooks and scheduled callbacks.

Use the role skills for platform-specific implementation and workflows/paired-speed-proof.md for measurement. A homepage-only lab pass cannot verify checkout, payment, stock or scheduled-job correctness.

## Sources

1. [Optimize Largest Contentful Paint](https://web.dev/articles/optimize-lcp), checked 2026-11-18.
2. [Optimize Interaction to Next Paint](https://web.dev/articles/optimize-inp), checked 2026-11-18.
3. [Optimize Cumulative Layout Shift](https://web.dev/articles/optimize-cls), checked 2026-11-18.
4. [Lighthouse performance scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring), checked 2026-11-18.
5. [HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching), checked 2026-11-18.
6. [WordPress optimization](https://developer.wordpress.org/advanced-administration/performance/optimization/), checked 2026-11-18.
7. [Debugging in WordPress](https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/), checked 2026-11-18.
8. [Configure caching plugins for WooCommerce](https://developer.woocommerce.com/docs/best-practices/performance/configuring-caching-plugins), checked 2026-11-18.
9. [Background processing at scale](https://actionscheduler.org/perf/), checked 2026-11-18.
