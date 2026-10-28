---
name: ads-attribution
description: "Audit cross-platform attribution, conversion definitions, reporting windows, GA4, AdServices and AdAttributionKit, MMPs, browser and server events, offline conversions, and platform reconciliation. Use for attribution audit, attribution models, conversion windows, requests to add or total Meta and Google conversions, incompatible reporting-window aggregation, GA4 attribution, MMP review, AppsFlyer, Adjust, Branch, Singular, or cross-platform discrepancies."
---

# Attribution Audit

Use this when two or more reports count the same conversions and the numbers do not match. The goal is to explain the gaps and say how to measure better. It is not to pick a winner.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your results** (yours): an export of your numbers for set dates, from the tool that holds them: an ad account, your store, analytics or your product.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your results. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Any good chat AI:** It reads pasted tables and exports, so Claude, ChatGPT and Gemini all work.
<!-- /needs -->

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

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Store analytics report comparison reviewer](https://useaiblocks.com/skills/weekly-store-numbers-watcher).
- The [Meta server tracking checker](https://useaiblocks.com/skills/meta-server-tracking-checker). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
