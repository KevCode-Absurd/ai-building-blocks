# Leading Indicators Monitoring Checklist

The weekly routine that catches problems 3-7 days before ROAS moves.

---

## The Five Metrics to Watch

### 1. CPM (Cost per 1,000 Impressions)
**Earliest signal.** Rises 3-5 days before CTR drops.

- [ ] Week-over-week change
- [ ] Flag if >15% up week-over-week
- [ ] Compare to account-wide CPM trend (isolate campaign-specific vs platform-wide)

### 2. Frequency
Predicts CTR decay at 2-3 day lag.

- [ ] Daily average over last 7 days
- [ ] Flag prospecting >2.5, critical >3.5
- [ ] Flag retargeting >5.0, critical >7.0

### 3. CTR vs 4-Week Baseline
Confirms fatigue once CPM has risen.

- [ ] Current 7-day CTR
- [ ] 4-week average CTR (baseline)
- [ ] Flag if current is down >15% from baseline
- [ ] Critical if down >25%

### 4. Hook Rate Drift (Video)
Thumbnail/opening decay before body decay.

- [ ] First-week baseline hook rate
- [ ] Current 7-day hook rate
- [ ] Flag if down >15% vs baseline

### 5. Reach Growth Rate
Catches audience saturation.

- [ ] Week-over-week reach growth at steady budget
- [ ] Flag if growth falls below 5%/week
- [ ] Critical if reach is flat

---

## The Cadence

### Daily (5 minutes)
- Glance at CPM on top 3 spenders
- Glance at frequency on any ad running >$200/day

### Monday Morning (15 minutes)
- Full leading indicators run for every active campaign
- Compare to last Monday's reading
- Note any metric that crossed a threshold

### Mid-Week Check (10 minutes, Wednesday)
- Re-check any metric that was yellow on Monday
- Escalate to red if worsening

### Friday Close (10 minutes)
- Final read before weekend
- Flag anything you want to catch first thing Monday

---

## Trigger Rules

### If CPM crosses +15%:
- Leave it. Monitor for 3 more days.

### If CPM crosses +30% or 2 weeks of +10%:
- Run full `/diagnose`
- Start building creative refresh

### If Frequency crosses 3.5 (prospecting) or 7.0 (retargeting):
- Audience expansion within 7 days OR budget reduction within 3 days
- Do not both increase budget AND keep audience the same

### If CTR drops >20% vs baseline:
- Creative refresh is due
- Ship within 10 days

### If Hook Rate drops >25%:
- New thumbnails/openings within 7 days
- Test 3-5 new openings against same body

### If Reach stalls + Frequency climbs + CPM up:
- Audience saturation. Expand before scaling.

---

## Common Mistakes

1. **Waiting for ROAS to drop.** By then, you're 5-10 days late.
2. **Reading CPM without context.** Platform-wide CPM trends during Q4 are real. Isolate campaign vs account.
3. **Increasing budget when frequency is climbing.** Classic accelerant mistake.
4. **Ignoring Hook Rate drift on evergreen ads.** Thumbnail fatigue happens first on long-running video.
5. **Monitoring only top spenders.** Mid-budget ads decay quietly and pile up.

---

## When to Escalate

Escalate from `/leading-indicators` to `/diagnose` if:
- ROAS drops below 80% of target
- 3+ indicators red simultaneously
- Indicators have been red for 5+ consecutive days
- Multiple campaigns showing the same pattern (platform-wide issue)

Escalate to `/andromeda-check` if:
- Leading indicators suggest saturation across multiple campaigns
- Team has been producing ads but diversity isn't improving
