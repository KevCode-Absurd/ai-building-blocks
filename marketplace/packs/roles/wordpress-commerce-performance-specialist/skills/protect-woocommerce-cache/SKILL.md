---
name: protect-woocommerce-cache
description: Configure and verify WooCommerce caching boundaries so faster public pages cannot leak sessions or break carts, checkout, accounts, prices or inventory.
---

# Prove cache correctness before celebrating speed
Map every active layer: browser, optimization plugin, full-page/host cache, object cache and CDN. Read the actual host/plugin documentation and current WooCommerce routing. Distinguish page-response caching from object/database caching; one layer's exclusion is not proof that the edge obeys it.

Create a route/state matrix using the configured localized slugs, not only /cart:
- Public catalogue HTML/assets: decide keys and freshness for language, country, currency, customer pricing, stock and promotions.
- Cart, checkout and My Account: exclude personalized page responses from shared caching. Include login, order-pay/order-received and any custom customer pages.
- Add-to-cart parameters, wc-ajax, Store API cart/checkout operations, webhooks and payment callbacks: verify operation-specific dynamic handling; never blindly cache all REST routes or strip their cookies.
- Logged-in/cart sessions: inspect woocommerce_cart_hash, woocommerce_items_in_cart and wp_woocommerce_session_* plus relevant host/plugin rules. Preserve customer identity and request/response cookie behavior. _wc_session_ database-cache exclusions are host-specific, not a command to disable a compatible object cache globally.

Use two isolated test sessions and an anonymous session. Add different products, change quantities, apply authorized test coupons, select variants and test supported shipping/tax/currency states. Confirm one visitor never receives another cart/account data. Inspect actual response headers/cache outcomes and HTML/JSON, not just the control-panel checkbox.

In a confirmed sandbox, verify checkout validation, test payment, order receipt and inventory behavior. Without sandbox permission, stop before purchase and mark payment/order proof incomplete. Recheck after purge, expiry and release, both cold and warm. Cache purge scope and origin load must be bounded to the authorized operation.

Deliver the exact provider-specific configuration diff, exclusion matrix, session-isolation receipts, rollback and residual gaps. Do not disable security or consent controls, share personalized responses, suppress commerce requests or change prices to gain a green performance score.
