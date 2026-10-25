# EMQ Parameter Checklist

Reference for building high-quality CAPI events. Use this as a spec when implementing or auditing CAPI integrations.

---

## Required for every event (baseline)

Every CAPI event must include:

- [ ] `event_name` (Purchase, Lead, AddToCart, etc.)
- [ ] `event_time` (unix timestamp, UTC)
- [ ] `event_id` (shared with browser pixel for deduplication)
- [ ] `action_source` (website, email, phone_call, etc.)
- [ ] `event_source_url` (URL of the action)
- [ ] `user_data` (see below)
- [ ] `custom_data` (see below)

---

## User Data Parameters (the match signals)

All string values must be lowercase, trimmed, and SHA-256 hashed before sending. Exceptions: IP address, user agent, fbp, fbc, external_id (those are sent as-is or with specific hashing rules).

### Tier 1 (must have)
- [ ] `em` (email, hashed)
- [ ] `ph` (phone, E.164 format, hashed)
- [ ] `external_id` (customer_id or session_id, hashed)
- [ ] `client_ip_address` (NOT hashed)
- [ ] `client_user_agent` (NOT hashed)
- [ ] `fbp` (browser cookie, NOT hashed)
- [ ] `fbc` (click cookie, NOT hashed, only if fbclid was present)

### Tier 2 (boosts match quality meaningfully)
- [ ] `fn` (first name, hashed)
- [ ] `ln` (last name, hashed)
- [ ] `ct` (city, hashed, lowercase)
- [ ] `st` (state, hashed, 2-letter abbreviation, lowercase)
- [ ] `zp` (zip, hashed, 5 digit)
- [ ] `country` (hashed, 2-letter ISO, lowercase)

### Tier 3 (incremental)
- [ ] `db` (date of birth, YYYYMMDD, hashed)
- [ ] `ge` (gender, 'm' or 'f', hashed)

---

## Custom Data Parameters (for Purchase event)

- [ ] `currency` (ISO code, e.g. "USD")
- [ ] `value` (numeric, the actual purchase amount, NOT "0")
- [ ] `content_ids` (array of product IDs)
- [ ] `content_type` ("product" or "product_group")
- [ ] `contents` (array of {id, quantity, item_price})
- [ ] `num_items` (count)
- [ ] `order_id` (helps dedup and debugging)

---

## Hashing Rules (SHA-256)

Before hashing:
1. Lowercase the value
2. Trim leading/trailing whitespace
3. Strip special characters per field (see below)

### Per-field preprocessing:
- Email: lowercase, trim, then hash
- Phone: digits only (no +, no -, no spaces), include country code, then hash
- First/Last name: lowercase, trim, remove punctuation, then hash
- City: lowercase, remove spaces (e.g., "new york" becomes "newyork"), then hash
- State: 2-letter abbreviation, lowercase, then hash
- Zip: 5 digits only, then hash
- Country: ISO 2-letter, lowercase, then hash
- Date of birth: YYYYMMDD string, then hash
- Gender: single letter "m" or "f", then hash

---

## Deduplication (critical)

Every event must have a matching `event_id` in both browser pixel AND CAPI server event.

### Common `event_id` sources:
- Shopify: Use `checkout.token` or generate UUID per session
- Custom: Generate UUID at page load, store in sessionStorage, use for both browser and server events

### Deduplication rates:
- 0-30%: Something is badly broken. event_id not matching.
- 30-60%: Partial match. Some events deduping, some not.
- 60-90%: Healthy range.
- 90%+: Possibly only one side (browser or server) firing. Check coverage.

---

## Common Mistakes

1. **Hashing fbp, fbc, IP, or user agent.** Don't. These are sent as-is.
2. **Mixed hashing formats.** Some events hash with uppercase, some lowercase. Meta rejects. Pick one (lowercase) and stick to it.
3. **Sending `value: 0` on Purchase.** Algorithm can't learn. Always send the actual amount.
4. **Missing event_id on one side.** Browser has it, CAPI doesn't. No deduplication possible.
5. **Sending PII in custom_data.** Don't. PII goes in user_data, hashed. custom_data is for product info.
6. **Not handling international phones.** Meta expects E.164 with country code. "555-1234" is not enough.
7. **Caching event_time.** Every event gets a fresh timestamp. Stale timestamps get rejected.

---

## Test Events

Before deploying, use Meta's Test Events tab in Events Manager:
- Send test events with a unique test_event_code
- Verify all user_data parameters appear
- Verify match quality per parameter
- Check deduplication signal

Don't deploy until test events show EMQ 7.5+ with all intended parameters detected.

---

## Post-Deploy Verification

24-48 hours after deploy:
- [ ] EMQ per event in Events Manager -> Diagnostics
- [ ] Deduplication rate
- [ ] Event coverage (server event count close to actual purchase count)
- [ ] No rejected events (Events Manager shows rejection reasons)
- [ ] Attribution settled (Meta recalculates backfill over ~72 hours)
