---
name: ads-attribution
description: "Audit cross-platform attribution, conversion definitions, reporting windows, GA4, AdServices and AdAttributionKit, MMPs, browser and server events, offline conversions, and platform reconciliation. Use for attribution audit, attribution models, conversion windows, requests to add or total Meta and Google conversions, incompatible reporting-window aggregation, GA4 attribution, MMP review, AppsFlyer, Adjust, Branch, Singular, or cross-platform discrepancies."
---

# Attribution Audit

Use this when two or more reports count the same conversions and the numbers do not match. The goal is to explain the gaps and say how to measure better. It is not to pick a winner.

## What to ask for

Ask for these once, in one message. If an item is not given, write MISSING in its place and carry on. Never invent a number, a window or a setting.

1. **The conversion reports**, one per source (for example Meta, Google Ads, GA4, your store). Pasted tables or exported files are fine.
2. **The business conversion**: what counts as one (a purchase, a lead, an install), its value, and the decision this analysis must support.
3. **The data window, time zone and currency** the reports cover.
4. **Settings for each source** (optional but useful): attribution window, click or view scope, whether it uses browser tags, server events or both, and consent or modeled-data settings.
5. **Your own system's total** (optional), such as store orders or CRM leads, to use as a reference point. It is a reference, not the truth.

## Steps

1. Declare the business conversion, value, data window, time zone, currency and the decision the analysis must support. If the user did not give one, mark it MISSING.
2. Inventory every source: browser tag, server events, ad platform, analytics, mobile measurement partner (MMP), offline upload and app attribution. For each, note its identity, how it counts, how it removes duplicates and its privacy rules.
3. Reconcile comparable events. Explain differences caused by eligibility, view-through rules, consent, modeled data, conversion lag, thresholds or scope. Tie each reason to a setting or a number in the reports. If you cannot tie it to evidence, label it "possible, not confirmed".
4. Separate measurement quality from platform-reported performance.
5. Return findings, contradictions, confidence, missing evidence and a measurement improvement plan, in the output format below.

Do not assume one platform is ground truth, add incompatible reports together, or recommend an attribution model without the operator's decision context.

## Comparability gate

Reject aggregation until the sources share, or are explicitly normalized to, the
same conversion event and value definition, attribution window, click/view scope,
counting method, deduplication identity, timezone, currency, attribution model,
and modeled-data treatment. Until then, report the values side by side with their
definitions; do not compute a total.

Example: Meta seven-day conversions and Google thirty-day conversions are
incompatible. Refuse to add them, reconcile windows and definitions first, and
only aggregate a newly comparable dataset.

## Output format

Return these sections, in this order. Use tables where shown.

1. **Conversion and scope.** The business conversion, value, window, time zone, currency and decision. MISSING where not given.
2. **Source inventory.** One row per source:

   | Source | What it counts | Window | Click or view | Counting method | Deduplication | Time zone | Currency | Modeled data |
   |---|---|---|---|---|---|---|---|---|

3. **Side by side.** One row per source with the reported conversions and value, next to its definition. Add a line saying whether the sources are comparable. If not, write "No total computed" and name which definitions differ.
4. **Why the numbers differ.** One entry per gap: the two sources, the size of the gap taken from the reports, the likely reason, and the evidence. Mark each reason "confirmed" or "possible, not confirmed".
5. **Confidence.** High, medium or low for the reconciliation as a whole, with a reason. Say what would raise it.
6. **Missing evidence.** What you needed and did not have, such as a setting, a date range or a server-event export.
7. **Measurement fix plan.** A numbered list, most useful first. Each item says what to change, where, and what it fixes. Examples are matching the windows, adding a server event with a shared event ID, or uploading offline conversions.

Keep to what the reports show. Do not give a "true" conversion count unless the user's own system total supports one, and then call it a reference.
