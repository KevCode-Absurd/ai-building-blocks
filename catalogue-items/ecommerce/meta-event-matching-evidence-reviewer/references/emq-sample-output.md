# Sample output: `/emq`

Run against an apparel brand on Shopify, CAPI via Stape. Redacted.

---

```
## Event Match Quality Audit: Brand_X
Account: act_XXXXXXX | Audit Date: 2026-03-10

### Per-Event Scores

| Event            | EMQ | Status | Priority |
|------------------|-----|--------|----------|
| Purchase         | 4.8 | BAD    | 1        |
| Lead             | n/a | -      | -        |
| AddToCart        | 5.1 | BAD    | 2        |
| InitiateCheckout | 6.2 | OK     | 3        |
| ViewContent      | 7.1 | GOOD   | -        |
```

[ANNOTATION: Purchase at 4.8 is the headline. That's the most valuable event and it's almost unusable for the algorithm. Every other event matters less if the final event is broken.]

```
### Missing Parameters (Purchase event)

Currently sent:
- em (email) - PRESENT but inconsistently hashed
- fn (first_name) - present
- ln (last_name) - present
- ct (city) - present
- country - present

Missing:
- external_id - Shopify customer_id available but not passed
- fbp - _fbp cookie captured in browser but not forwarded to server
- fbc - _fbc cookie same issue
- client_ip_address - Stape can provide, not configured
- client_user_agent - same
- zp (zip) - captured at checkout, not passed to Pixel event
- ph (phone) - captured at checkout, not hashed/passed

Impact of missing parameters: -3.7 EMQ points
```

[ANNOTATION: Shopify captures all of these at checkout. The data exists. It's just not being forwarded to Meta via CAPI. This is the most common EMQ failure pattern.]

```
### Deduplication Health

Browser Purchase events (last 30 days): 812
Server Purchase events (last 30 days): 694
Matched (deduped): 498
Dedup rate: 61% (NEEDS IMPROVEMENT)
```

[ANNOTATION: 61% dedup rate means 39% of events are either only firing from one source or not matching on event_id. Browser-blocked users (ad blockers) explain some gap, but event_id mismatch is the bigger cause here.]

```
### Revenue Impact Estimate

Current EMQ: 4.8
Target EMQ: 8.0+

Current attributed Purchases/month: 694 server events
Estimated missed attribution: ~230 events/month
At AOV $58: ~$13,340/month of Purchase revenue not credited to Meta

That's approximately 33% of Meta's true contribution being invisible.
Reported Meta ROAS: 1.82x
Estimated true Meta ROAS after fix: 2.40x-2.55x
```

[ANNOTATION: The ROAS estimate is the number the client cares about. Same ads, same budget, same shoppers. Better tracking = +35% reported ROAS. This is why EMQ audits pay for themselves in 48 hours.]

```
### Priority Fixes

1. Add external_id to CAPI Purchase events (30 min)
   Source: shopify.customer.id
   Config: Stape -> Customer Data -> Map customer_id to external_id
   EMQ impact: +1.0
   Why first: Highest impact per minute of effort

2. Fix email hashing consistency (15 min)
   Issue: Some events hash before lowercase, some after. Meta rejects mixed.
   Fix: Standardize to lowercase + trim + SHA-256 in all CAPI calls
   EMQ impact: +0.4

3. Forward fbp and fbc cookies from browser to CAPI (2 hours)
   Source: Capture _fbp and _fbc JS cookies on page load
   Config: Pass via checkout extension to Stape as user_data
   EMQ impact: +1.4

4. Add client_ip and client_user_agent (30 min)
   Source: Stape auto-captures, needs enable in account
   EMQ impact: +1.0

5. Add zip and hashed phone (45 min)
   Source: Shopify checkout custom attributes
   EMQ impact: +1.0

TOTAL: ~4.5 hours of work -> EMQ 4.8 to estimated 8.5-8.9
```

[ANNOTATION: Ranking fixes by "EMQ impact per hour" makes the sequence obvious. The first two fixes are cheap and get you to 6.2. That's enough to unlock algorithm stability even if the rest never gets done.]

---

## Follow-Up Monitoring

- **Day 1 after fixes deploy:** Check EMQ in Events Manager (updates hourly)
- **Day 3:** Confirm dedup rate climbs above 75%
- **Day 7:** Compare reported ROAS to Shopify-observed ROAS (gap should narrow)
- **Day 14:** If algorithm exits learning phase on campaigns that were stuck, credit EMQ fix

---

## Caveat

EMQ score improvement is a necessary condition for better attribution, not a sufficient one. You also need:
- Consistent event firing (not dropping events on slow connections)
- Correct value field (not $0 placeholder purchases)
- Correct currency
- Proper event_id shared between browser and server

This audit covers EMQ only. For a full pixel/CAPI audit, chain with the Meta tracking section of `/audit`.
