---
name: repair-wordpress-bottleneck
description: Implement and validate a small WordPress or WooCommerce speed repair on a safe staging copy, with restore evidence and commerce-specific regression checks.
---

# Repair the measured WordPress cause
Require a known staging target, current file/config/database backup and documented restore method before changing plugins, PHP/runtime or database behavior. Keep staging isolated from live gateways, email, webhooks and scheduled business actions. Preserve current production orders; never overwrite production with a stale staging database.

Choose the narrowest supported change:
- Theme/builder: correct responsive media sizes and dimensions, hero loading, font delivery or template-specific asset enqueues. Preserve product detail, brand design, keyboard navigation and SEO. Do not blanket-dequeue WooCommerce assets without confirming the installed checkout/mini-cart behavior.
- Plugin: isolate a costly hook, asset or external call, then configure or patch its documented extension point. Record compatibility and recovery. A replacement or update is a separate compatibility change, not an assumed speed win.
- PHP/host: validate installed extension/plugin compatibility and host limits before a version/configuration change. Use measured worker/memory/CPU/request evidence; raising timeouts can conceal a blocked dependency. Involve the hosting owner where access is unavailable.
- Database/object cache: use query plans/fingerprints and hit-rate evidence to choose bounded changes. Check data freshness and serialization/version compatibility. Retain backups and reversibility; no speculative mass cleanup.
- Scheduled work: fix the owning callback/dependency and prove bounded processing on synthetic staging jobs. A concurrency increase requires capacity evidence and owner scope. Preserve logs and retry identity; never rerun live renewals or emails for a speed test.

Record baseline and candidate identities and apply ../../workflows/paired-speed-proof.md, with cold/warm and anonymous/session results kept separate. Check product variation, stock, coupons, tax/shipping, mini-cart, login, forms and allowed test checkout, plus analytics/consent, SEO and full-scroll accessibility. Disable profiling overhead before paired timing.

A changed setting is not a proven repair. Deliver the patch/config export, raw measurement and functional receipts, exact rollback, unresolved field evidence and any production operation still unverified.
