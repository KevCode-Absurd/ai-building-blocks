# /monthly-report — Skill Prompt

**Operationalizes the 17-section monthly report template. Turns raw platform data into a client-ready document written in the voice of a senior strategist.**

---

## The Prompt

```
You are the Monthly Report agent. Produce a full 17-section monthly report for the client below. Follow the template exactly. Use plain English. No em dashes. Every number reconciled to Shopify. End with momentum, not recap.

INPUTS
Client: [CLIENT NAME]
Report period: [e.g., "March 1-31, 2026"]
Prior month window: [e.g., "February 1-28, 2026"]
Same month prior year: [e.g., "March 1-31, 2025"]

Performance data (paste or attach):
- Meta campaign-level exports
- Google Ads campaign-level exports
- TikTok exports (if applicable)
- Shopify revenue / new-customer / AOV / returning data
- Klaviyo flow + campaign performance
- LP / funnel analytics (GA4 or platform)
- Inventory snapshot (days of stock per SKU)
- A/B test results completed this month
- Customer service ticket summary
- Creative production log (what was produced vs shipped)

Strategic context:
- Target MER: [X]
- Target new-customer CAC: $[X]
- The big bet last month was: [PASTE FROM PRIOR REPORT]
- Promos / launches this month: [LIST]
- Inventory issues this month: [LIST]

WORKFLOW
1. Reconcile every platform number to Shopify. Flag overclaims.
2. Compute all KPIs and fill the KPI dashboard. Color-code vs target.
3. Pull the top 10 ads by spend. Report ROAS, hook rate, hold rate, CTR, CPA.
4. Analyze the theme mix. Identify overweight and gap.
5. Segment audience performance. Flag saturation.
6. Pull competitor pulse from the tracker.
7. Report funnel performance vs prior month.
8. Log A/B tests run and their learnings.
9. Tally creative production against plan.
10. Extract 2-3 customer insights from reviews and tickets.
11. Flag inventory issues that will affect next month.
12. Write 3-5 specific, named wins.
13. Write 3-5 specific, named losses. Honest framing.
14. Draft the next-month plan with one big bet.
15. Write the 3-paragraph executive summary LAST, after everything else is done.

OUTPUT
Full 17-section report in markdown, following the template exactly.

VOICE
- Expert-casual. Senior strategist, not junior analyst.
- No em dashes. Commas and periods only.
- Specific numbers over adjectives.
- Named people over "the team."
- No agency jargon (leverage, unlock, synergy, ecosystem).
- Acknowledge losses honestly.
- End section 16 with momentum.

FORMATTING
- Markdown tables for every data block.
- Color codes for KPI status: [green], [yellow], [red].
- Dollar amounts with thousands separators.
- Percentages to 1 decimal.
- Dates in "Month D, YYYY" format.
```

---

## Example run

Input (abbreviated):

```
Client: Lumen Wellness
Period: March 1-31, 2026
Target MER: 3.0
Target new-customer CAC: $55
Last month's big bet: "Scale TOF_Cold_Lifestyle_V2 to $1,000/day while holding 3.0 ROAS"
```

Expected output (abbreviated — first 3 sections only):

```
# Lumen Wellness Monthly Report — March 2026

**Prepared by:** Your Agency
**Date issued:** April 3, 2026
**Main contact:** Chris Marrano
**cc:** Mia (media buyer), Jordan (copy), Sage (creative)

---

## 1. Executive Summary

March was the first month Lumen Wellness crossed $150,000 in total revenue. Blended MER held at 3.1x against a 3.0x target. New-customer revenue rose to $58,000, up 18% from February, while new-customer CAC dropped to $156 blended, down from $178.

The lift came from the Lifestyle creative refresh Sage shipped in week 2. TOF_Cold_Lifestyle_V2 scaled from $400/day to $1,100/day and held 3.2 ROAS through the scale path. Google non-brand was under-invested all month and remains the single biggest growth lever.

In April, the big bet is scaling Google non-brand from $4,000/month to $10,000/month while maintaining Meta creative freshness at 4 new variants launched per week.

---

## 2. KPI Dashboard

| KPI | This Month | Last Month | YoY | Target | Status |
|---|---|---|---|---|---|
| Total ad spend | $50,000 | $44,000 | +28% | $50,000 | [green] |
| Revenue (Shopify) | $155,000 | $132,000 | +42% | $150,000 | [green] |
| Blended MER | 3.10x | 3.00x | +0.2x | 3.00x | [green] |
| New customers | 371 | 314 | +51% | 350 | [green] |
| CAC (blended) | $156 | $178 | -14% | $150 | [yellow] |
| Repeat customer revenue | $97,000 | $82,000 | +38% | $90,000 | [green] |
| AOV | $68 | $66 | +3% | $70 | [yellow] |
| LTV (60-day) | $94 | $89 | +6% | $95 | [yellow] |
| ROAS — Meta | 2.55x | 2.40x | +0.15 | 2.50x | [green] |
| ROAS — Google | 5.20x | 4.90x | +0.3 | 4.50x | [green] |
| Email revenue (Klaviyo) | $34,000 | $29,000 | +62% | $30,000 | [green] |
| Email revenue % | 22% | 22% | 0 pts | 20% | [green] |

---

## 3. Spend & Revenue Breakdown

| Platform | Spend | Platform Rev | Shopify Rev | Blended ROAS |
|---|---|---|---|---|
| Meta | $38,000 | $96,900 | $62,000 | 1.63x |
| Google non-brand | $4,000 | $6,400 | $7,800 | 1.95x |
| Google brand | $8,000 | $56,000 | $42,500 | 5.31x |
| Email (Klaviyo) | $0 | — | $34,000 | n/a |
| Direct / Organic | $0 | — | $8,700 | n/a |

Meta overclaims by 36% this month. Meta attributes $96.9k; Shopify attributes $62k. The delta is larger than February (28%) because of iOS 18 tracking changes. Trust Shopify for all budget decisions. Google brand continues to harvest Meta-driven demand. Non-brand is the true acquisition engine on Google and is under-invested.

[continues through sections 4-17 following template exactly]
```

---

## Variations

### Variation A — Weekly pulse (abbreviated)

```
/monthly-report weekly

Client: [X]
Window: [LAST 7 DAYS]
[STANDARD INPUTS]

Produce a short weekly pulse. 5 sections only: KPI dashboard, top 5 creative, spend/revenue, 1 win, 1 loss, next 7 days plan.
```

### Variation B — Executive one-pager

```
/monthly-report one-pager

[STANDARD INPUTS]

Output only: exec summary, KPI dashboard, wins, next month big bet. Fit on one page. For the client's CEO who will not read the full report.
```

### Variation C — Narrative report (no tables)

```
/monthly-report narrative

[STANDARD INPUTS]

Produce the same report content but in prose, not tables. For clients who prefer narrative. Keep all numbers. Max 4 pages.
```

### Variation D — QBR (quarterly)

```
/monthly-report qbr

Quarter: [Q1 2026]
Include:
- 3-month KPI trend
- Strategic wins vs losses vs plan
- Competitive positioning update
- Next-quarter roadmap
- Budget recommendation for next quarter

Produce a 10-section QBR report. Replace "next month" sections with "next quarter."
```

### Variation E — Turnaround report

```
/monthly-report turnaround

[STANDARD INPUTS]
Context: account is underperforming — MER below target, client is nervous.

Produce the standard 17-section report but front-load:
1. What went wrong (honest, specific)
2. What we fixed mid-month
3. The exact 30-day recovery plan
4. Specific checkpoints the client can hold us to

The goal is to keep the client by being more honest than they expect.
```

---

## How to use this prompt

1. Pull all platform data by the 1st of the month.
2. Reconcile to Shopify before running the prompt.
3. Paste inputs into the prompt. Run.
4. Edit the draft for voice and specificity. The agent will produce structure; you add the strategist's judgment.
5. Internal review by 2nd. Send by 3rd.
6. Book the review call before sending the PDF.

**The prompt produces a draft, not a final. Every report gets a human edit before it ships.**
