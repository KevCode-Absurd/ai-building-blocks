# Hook Testing Scorecard

**Spreadsheet spec. Build this in Google Sheets, Airtable, or Notion. Track every hook you test. Find which tactics work in your account.**

---

## Sheet 1: Hook Log

| Column | Type | Description |
|---|---|---|
| Hook ID | Auto | Unique ID (H-001, H-002, etc) |
| Launch Date | Date | Day the ad went live |
| Ad Name | Text | Internal naming convention |
| Product | Text | Which product the hook promotes |
| Awareness Stage | Dropdown | Unaware / Problem Aware / Solution Aware / Product Aware / Most Aware |
| Dominant Tactic | Dropdown | Confession / Bold Claim / Relatability / Contrast / Curiosity |
| Visual Category | Dropdown | POV / Before-After / Unboxing / Text Overlay / Green Screen / Product-in-Action / Street Interview / Reaction / Skit / ASMR / Tutorial / Behind-the-Scenes |
| Voiceover Category | Dropdown | (18 options from voiceover-hooks list) |
| Caption Category | Dropdown | (16 options from caption-hooks list) |
| Format | Dropdown | static_image / ugc_hifi / ugc_problem_solution / yapper / video_storyboard |
| Campaign | Text | Meta/Google campaign name |
| Spend | Currency | Cumulative spend on this hook |
| Impressions | Number | |
| Clicks | Number | |
| CTR | Formula | Clicks / Impressions |
| Hook Rate | Number | 3-sec video plays / Impressions (video only) |
| Hold Rate | Number | Thru-plays / 3-sec plays (video only) |
| Thumb-Stop Ratio | Formula | Hook Rate × 100 |
| Purchases | Number | |
| CPA | Formula | Spend / Purchases |
| ROAS | Number | |
| Frequency | Number | 7-day frequency |
| Status | Dropdown | Live / Paused / Killed / Winner |
| Kill Reason | Text | If killed: fatigue / low CTR / low CVR / no spend |
| Notes | Text | Anything worth remembering |

---

## Sheet 2: Tactic Performance Rollup

Pivot table from Sheet 1. Columns:

| Tactic | # Hooks Tested | Total Spend | Avg CTR | Avg Hook Rate | Avg Hold Rate | Avg CPA | Avg ROAS | # Winners | Winner Rate |
|---|---|---|---|---|---|---|---|---|---|
| Confession | | | | | | | | | |
| Bold Claim | | | | | | | | | |
| Relatability | | | | | | | | | |
| Contrast | | | | | | | | | |
| Curiosity | | | | | | | | | |

**Interpretation rules:**
- Winner rate above 25% — tactic is working. Scale it.
- Winner rate 10-25% — tactic is viable. Continue testing variations.
- Winner rate under 10% — tactic is misfiring for your audience. Stop or change stage targeting.
- Avg ROAS above account baseline — scale tactic. Below baseline — kill tactic for that stage.

---

## Sheet 3: Visual Performance Rollup

| Visual Category | # Hooks | Avg Hook Rate | Avg CTR | Avg ROAS | Notes |
|---|---|---|---|---|---|
| POV | | | | | |
| Before/After | | | | | |
| (all 12) | | | | | |

**Interpretation:** The visual category drives Hook Rate more than any other factor. If a category has Hook Rate under 20% across 3+ ads, the visual is not stopping the scroll for your audience. Retire it.

---

## Sheet 4: Voiceover Performance Rollup

| Voiceover Category | # Hooks | Avg Hold Rate | Avg ROAS |
|---|---|---|---|
| Personal Story Opener | | | |
| Stop Scrolling If | | | |
| (all 18) | | | |

**Interpretation:** Voiceover drives Hold Rate. If voiceover A has Hold Rate 12% and voiceover B has 28% on the same visual, voiceover B is earning the next 15 seconds. Prefer B in future combinations.

---

## Sheet 5: Caption Performance Rollup

| Caption Category | # Hooks | Avg CTR | Avg ROAS |
|---|---|---|---|
| Confession | | | |
| Bold Statement | | | |
| (all 16) | | | |

**Interpretation:** Caption drives CTR in mute-scroll environments (Instagram feed). If a caption category has CTR under 0.8%, it is not earning clicks. Rotate it out.

---

## Sheet 6: Awareness Stage × Tactic Matrix

| | Unaware | Problem Aware | Solution Aware | Product Aware | Most Aware |
|---|---|---|---|---|---|
| Confession | | | | | — |
| Bold Claim | — | | | | |
| Relatability | | | — | — | — |
| Contrast | — | | | | |
| Curiosity | | | — | — | — |

Populate each cell with average ROAS from hooks tested in that stage × tactic combination. Highlight the top 3 cells green. These are your known winners. Highlight the 3 worst cells red. These are your known dead zones.

---

## Weekly Review Ritual

Every Friday:

1. Pull the latest data into Sheet 1.
2. Refresh the 5 rollup sheets (Tactic, Visual, Voiceover, Caption, Stage Matrix).
3. Identify 1 winner to scale (highest ROAS with minimum 3 days spend and frequency under 3.0).
4. Identify 1 loser to kill (ROAS below 0.5x OR spend over $200 with zero purchases).
5. Identify 1 untested cell in the Stage × Tactic matrix. Brief one new hook targeting that cell.
6. Log the decisions in the Notes column.

The goal is not to test everything. The goal is to fill in the matrix so your account has a working hook in every awareness stage you target.
