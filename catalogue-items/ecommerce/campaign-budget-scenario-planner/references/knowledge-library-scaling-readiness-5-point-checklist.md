# Scaling Readiness — 5-Point Checklist

**Before you scale ANY campaign, every point must be checked YES. If any is NO, do not scale. Diagnose first.**

---

## Point 1 — Efficiency is stable at current spend

**Check:**
- Last 7 days ROAS within ±10% of the prior 7 days
- CPA within ±10% of prior 7 days
- No single day's ROAS/CPA dropped more than 30% from the 7-day average

**If NO:**
The campaign is oscillating. Scaling adds noise to noise. Wait for 7 days of stability before scaling.

**Why it matters:** Scaling amplifies everything. If efficiency is unstable at $500/day, it will be MORE unstable at $750/day. Budget moves should ride stable water, not chop.

---

## Point 2 — Creative is fresh

**Check:**
- Top-spending ad frequency below 3.0 (for Meta)
- CTR on top ad has not declined more than 15% in the last 7 days
- At least 2 ads in the campaign within their first 21 days
- New creative variants queued and ready to launch within 7 days

**If NO:**
The campaign has a creative fatigue risk. Scaling will accelerate fatigue. Inject fresh creative BEFORE scaling.

**Why it matters:** Scaling a fatigued ad set means you are buying more reach on a creative that is already losing attention. The efficiency drop arrives fast.

---

## Point 3 — Audience is not exhausted

**Check:**
- Audience reach / audience size below 40% (Meta: check reach estimator)
- No pixel-retargeting audience campaign with frequency above 4.0
- No lookalike campaign where the source audience has grown less than 15% in 30 days

**If NO:**
The audience is saturating. Scaling pushes you into lower-quality segments of the audience, which depresses ROAS. Expand the audience (broader lookalike, new interests, new geo) before scaling.

**Why it matters:** You cannot scale beyond what the audience can absorb. Once saturation hits, you are just bidding against yourself.

---

## Point 4 — Funnel is intact

**Check:**
- Landing page CVR steady or improving
- Shopify / shop CVR not declining over 7 days
- Email capture rate steady
- No broken pixel events (Purchase, InitiateCheckout, AddToCart all firing)
- Customer support ticket volume / complaint rate not spiking

**If NO:**
You have a funnel leak. Scaling sends more traffic through a leaky funnel, which burns budget. Fix the funnel first, then scale.

**Why it matters:** Scaling is a multiplier. It multiplies everything — good and bad. Fix the leak before you turn up the volume.

---

## Point 5 — Inventory + fulfillment can handle the volume

**Check:**
- Current inventory > 2x next 7 days' projected orders at current velocity
- Fulfillment lead time < 3 business days
- No current out-of-stock risk on the hero SKU(s)
- Customer service bandwidth sufficient for 30%+ volume increase

**If NO:**
Scaling a campaign that runs into a stock-out destroys LTV. The ads keep running, conversions can't happen, ROAS craters, brand reputation takes a hit.

**Why it matters:** The best ad account in the world cannot outrun an out-of-stock. Check operations before you check Ads Manager.

---

## The checklist in use

Before ANY +20% or greater scale move:

- [ ] Point 1 — Efficiency stable (last 7 days ±10% vs prior 7)
- [ ] Point 2 — Creative fresh (frequency < 3.0, CTR stable, variants queued)
- [ ] Point 3 — Audience not exhausted (reach < 40%, retarget freq < 4.0)
- [ ] Point 4 — Funnel intact (LP CVR steady, pixel events firing)
- [ ] Point 5 — Inventory + fulfillment ready (> 2x projected demand)

**All 5 must be YES.** If any is NO, diagnose, fix, and re-check in 72 hours.

---

## The scale move itself

Assuming all 5 are YES:

| Scale size | When to use |
|---|---|
| **+20%** | First scale move. Safest. Use when confidence is medium. |
| **+30%** | Second scale move on same campaign within a week. Score above 85 on scorecard. |
| **+50%** | Rare. Only when: 3+ weeks of stable 90+ scorecard AND audience expansion is imminent AND creative variant is ready to absorb new reach. |

**Never move more than 30% in a single day.** Meta's learning phase disrupts at larger moves and you lose 3-5 days of efficiency to reset.

---

## After scaling

**Monitor 72 hours:**
- ROAS within ±10% of prior
- CPA within ±10% of prior
- Spend pacing to target (not dropping below 70% of expected)
- Frequency not climbing faster than expected
- CVR on landing page holding

**If monitoring shows degradation:**
- Day 1-2: Wait. Learning phase resets cause day-1 and day-2 noise.
- Day 3: If still degraded, cut back to the pre-scale budget. Reassess.
- Day 4+: If still degraded after revert, diagnose. Do not attempt the same scale again without a reason change.

---

## When to use horizontal scaling instead

Vertical scaling = budget increase on the same campaign.
Horizontal scaling = duplicate the campaign, run in parallel.

Use horizontal when:

- Budget per ad set is approaching Meta's efficiency ceiling (usually $500-1000/day per ad set)
- You want to test a new audience or creative pool without disrupting the winner
- The CBO campaign is concentrating 80%+ of spend on one ad set and you want distribution

How:
1. Duplicate the winning campaign
2. Change 1 lever in the duplicate (audience, creative, or placement) — never more than 1
3. Run both at 60% of the combined target spend for 7 days
4. Kill the loser, scale the winner

Horizontal scale is slower but safer once you are past $30k/month account spend.

---

## The most common scaling mistake

**Scaling winners without a pipeline of new winners behind them.**

A campaign that is scoring 95 today will score 60 in 8-12 weeks due to audience saturation + creative fatigue. If you scale without adding fresh creative + fresh audiences in parallel, you eventually have to cut the scaled campaign back to 40% of current spend — and you have no replacement ready.

**Rule:** For every dollar you add to a SCALE campaign, add 10 cents to a TEST campaign. Winners always run out.

---

## Edge case: scaling with limited attribution

Post-iOS-14, Meta's in-platform attribution is partial. If you are scaling based only on Meta-reported ROAS:

- Triangulate with GA4, Shopify, and Klaviyo / backend reporting
- Use 7-day attribution, not 1-day click
- Measure against blended CAC, not Meta-only CAC
- If the three sources diverge by more than 20%, do not scale; investigate attribution first

---

## Scaling is compounding, not transcendent

A 20% scale on a campaign spending $500/day adds $100/day. That is the move.

"I want to 5x this campaign" is not a scale plan. It is a gamble.

Scale is a compounding discipline. 4 weeks of compounding +20% moves takes you from $500/day to $1,037/day — a full double — while preserving efficiency. That is the game.
