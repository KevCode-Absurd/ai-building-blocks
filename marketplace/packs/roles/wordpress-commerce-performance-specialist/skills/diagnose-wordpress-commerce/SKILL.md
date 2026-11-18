---
name: diagnose-wordpress-commerce
description: Find WordPress and WooCommerce performance bottlenecks using buyer traces, PHP and database evidence, plugin/theme isolation and scheduled-job health.
---

# Diagnose WordPress commerce without breaking orders
Read ../../access.md and ../../knowledge.md. Verify WordPress, WooCommerce, PHP, theme/builder, hosting, cache and database versions, plus classic versus block cart/checkout and any headless frontend. Collect only necessary Site Health/system-status excerpts; redact credentials and customer data.

Use field evidence by template/device and traces for home, category, product and actual buyer interactions. Separate cached anonymous pages from logged-in and active-cart requests. Identify the LCP element, render delay, slow interactions and layout shifts before selecting browser fixes.

For high TTFB, inspect authorized server/APM and slow-query evidence: PHP worker saturation, external HTTP calls, expensive hooks, repeated queries, autoload size and cache hit/miss state. Record query fingerprints and timings rather than personal row contents. Plugin count alone cannot identify the culprit. Use short-lived profiling in isolated staging; SAVEQUERIES/debug plugins add overhead, so measure final performance without them and keep errors out of public HTML.

Reproduce a suspected plugin/theme conflict in a backed-up, isolated staging copy. Record active versions and configuration, disable one suspect at a time, measure, then restore it. Do not deactivate payments, inventory, taxes, shipping, consent or security on a live shop to benchmark. Prefer a child-theme/custom-plugin patch to edits overwritten by an update; do not modify core.

For database work, inspect current storage and compatibility (including order storage) before proposing schema changes. Preserve sessions, orders, stock and renewal records. No blanket deletion of options, transients or scheduled actions; identify ownership and a reversible, staging-tested migration if necessary.

For Action Scheduler, record pending/failed counts, oldest due age, hook/group, recurrence, error sample, runner and host-resource health. Distinguish a broken callback from insufficient throughput. Jobs can charge renewals, send messages or sync stock: do not replay, delete or increase concurrency blindly. Escalate a specific failing hook with evidence to its owner; a shorter queue after deleting it is not recovery.

Deliver a bottleneck hypothesis with falsifying evidence and a minimal fix. Use repair-wordpress-bottleneck and ../../workflows/paired-speed-proof.md to implement and verify.
