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

Customer fields such as email, phone and names are cleaned as Meta's documentation says, then SHA-256 hashed before sending. These are sent as they are and must NOT be hashed: client_ip_address, client_user_agent, fbp and fbc. The external_id can be hashed, and Meta recommends it. Check Meta's current Conversions API "customer information parameters" page before you change anything.

### Strongest matching fields (send these first when you have them)
- [ ] `em` (email, hashed)
- [ ] `ph` (phone, E.164 format, hashed)
- [ ] `external_id` (customer_id or session_id, hashing recommended)
- [ ] `client_ip_address` (NOT hashed)
- [ ] `client_user_agent` (NOT hashed)
- [ ] `fbp` (browser cookie, NOT hashed)
- [ ] `fbc` (click cookie, NOT hashed, only if fbclid was present)

### Further fields (send when you collect them)
- [ ] `fn` (first name, hashed)
- [ ] `ln` (last name, hashed)
- [ ] `ct` (city, hashed, lowercase)
- [ ] `st` (state, hashed, 2-letter abbreviation, lowercase)
- [ ] `zp` (zip, hashed, 5 digit)
- [ ] `country` (hashed, 2-letter ISO, lowercase)

### Optional fields
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

### Reading deduplication
Meta publishes no single "healthy" percentage, so do not judge by one. Use only the counts you have from Events Manager. If both browser and server send an event and the counts do not line up, check first that both sides send the same `event_name` and `event_id`. If server events are far lower than browser events, or the reverse, check the server connection, ad blockers and consent settings as possible causes.

---

## Common Mistakes

1. **Hashing fbp, fbc, IP, or user agent.** Don't. These are sent as-is.
2. **Mixed hashing formats.** Some events hash with uppercase, some lowercase. The same person then hashes to different values and may not match. Clean values the same way every time, as Meta's documentation says.
3. **Sending `value: 0` on Purchase.** Value-based optimization has nothing to learn from. Send the real amount.
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

Do not go live until test events show all the parameters you meant to send. Match quality scores appear in Events Manager only after real events have come in.

---

## Post-Deploy Verification

24-48 hours after deploy:
- [ ] EMQ per event in Events Manager -> Diagnostics
- [ ] Deduplication rate
- [ ] Event coverage (server event count close to actual purchase count)
- [ ] No rejected events (Events Manager shows rejection reasons)
- [ ] Attribution settled (Meta recalculates backfill over ~72 hours)
