# Budget Tier Decision Tree

Use this to classify a campaign into Scale / Maintain / Reduce / Kill in under 60 seconds.

---

## Step 1: Is ROAS above target (default 3.0x)?

- **YES** → go to Step 2
- **NO** → go to Step 4

## Step 2 (ROAS above target): Is there headroom?

Headroom signals:
- Lost Impression Share (Budget) > 20% (Google)
- OR: Meta campaign showing "limited by budget" indicator
- OR: Spend hitting daily cap consistently
- OR: ROAS 2x+ target AND running 14+ days stable

- **YES to any** → **SCALE** (Tier 1)
- **NO to all** → **MAINTAIN** (Tier 2, keep winning, can't grow)

## Step 3 (Scale confirmed): Which scenario?

- **Conservative (50% of headroom):** risk-averse client, new territory, first scale on this campaign
- **Moderate (75% of headroom):** DEFAULT, stable proven performer
- **Aggressive (100% of headroom):** proven >30 days, strong margin, willing to take decay hit

## Step 4 (ROAS below target): How bad?

- ROAS < 0.5x → **KILL** (Tier 4)
- Zero revenue with >$200 spend → **KILL**
- CPA > 3x target for 7+ days → **KILL**
- ROAS 0.5x to target, running 14+ days with no improvement → **REDUCE** (Tier 3)
- ROAS 0.5x to target, <14 days or improving → **MAINTAIN** (give it a chance)

---

## Visual Decision Tree

```
                  Is ROAS > target?
                        |
              ---------+-----------
              |                   |
             YES                  NO
              |                   |
         Has headroom?      How bad?
              |                   |
        ------+------      -------+--------
        |           |      |              |
       YES         NO     <0.5x        0.5x-target
        |           |      or 0 rev          |
      SCALE     MAINTAIN  or CPA>3x       14+ days
                           |                  |
                          KILL         ------+------
                                       |           |
                                      Yes          No
                                       |           |
                                     REDUCE     MAINTAIN
```

---

## Safety Rails Reminder

- Never >50% budget change per move
- 72-hour no-touch after scaling
- Single campaign never >60% of total budget
- Aggressive scaling = assume 10-20% ROAS decay

## Edge Cases

| Scenario | Tier | Reason |
|----------|------|--------|
| ROAS 4x, only 3 days running | MAINTAIN | Too early to scale, wait to 14 days |
| ROAS 0.4x, 30 days, improving | REDUCE (not kill) | Trend matters more than snapshot |
| ROAS 1.2x, high volume, cold prospecting | MAINTAIN | Cold prospecting target can be below overall target |
| ROAS 5x, <$100 total spend | MAINTAIN | Volume too low to trust, keep at current budget 7 more days |
| Zero revenue but great CTR | KILL | CTR without conversions means wrong audience or bad offer, not budget |
