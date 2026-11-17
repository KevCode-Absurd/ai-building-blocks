# Finish integrations with evidence

Use this only when the task needs a change or verification inside Meta, Shopify, or a messaging provider. Copywriting and local analysis do not need a provider checklist.

First discover the actual tools available in this host and resolve the intended account. A tool name in this pack is a suggestion, not evidence it is connected. A store export or public page is not admin access. Capture what is available, the exact missing operation, and the artifact you can finish now. Preserve current authorization; do not ask again for unchanged scope.

Create the intended comparison with `node tools/integration-readback.mjs template meta` (or `shopify`, `messaging`). Replace the placeholder account, environment, objects and exact scalar fields. For a draft, include the provider's non-live status. Flatten nested settings into unambiguous names such as `budget.currency`, `budget.minorUnits`, `budget.kind` and `schedule.timezone`; never compare unlabeled budget numbers. The digest command binds this exact plan.

After a permitted operation, fetch fresh readback from that provider. Keep the raw result and make a separate normalized file:

```json
{
  "schema": "integration-readback/1",
  "planDigest": "OUTPUT_OF_DIGEST_COMMAND",
  "provider": "meta",
  "accountId": "VERIFIED_ACCOUNT_ID",
  "environment": "sandbox",
  "observedAt": "ACTUAL_CAPTURE_TIME_ISO8601",
  "sourceRef": "receipts/raw-provider-result.json",
  "objects": [{
    "key": "primary",
    "providerId": "ID_RETURNED_BY_PROVIDER",
    "fields": {"status": "PAUSED"}
  }],
  "checks": []
}
```

Run `node tools/integration-readback.mjs check plan.json readback.json`. Without a readback file it reports the missing connection. A matched draft is not live readiness. For live verification, each named check requires PASS/FAIL/NOT_RUN, detail, a source reference and capture time. Meta needs destination, audience, spend_controls, schedule, tracking, creative_preview. Shopify needs catalogue_inventory, checkout_test, payments, shipping, taxes, policies. Messaging needs sender_identity, consent_suppression, recipient_count, links_footer, inbox_test, trigger_exit_test. Preserve failures even if creation succeeded. Checks use a 15-minute freshness window; recapture stale observations, never refresh timestamps without new reads.

On partial completion, reconcile returned IDs before retrying; do not create duplicates. Deliver completed artifacts plus the exact remaining dependency, owner and resume step. A sandbox order or test inbox proves that environment only. Simulators and local HTML previews do not prove checkout, delivery or provider execution. Use provider test modes only within existing authorization; customer sends, spend and transactions need their own exact scope.

This tool compares submitted values and declarations. It does not authenticate receipts, open referenced files, call providers, grant permission or certify the completeness of your plan. The host must enforce authorization and verify raw evidence. Never put tokens or customer personal data in this file.
