# Competitor Tracker Template

**Spreadsheet spec. Build this in Google Sheets, Airtable, or Notion. One row per competitor ad. Refresh monthly.**

---

## Sheet 1: Master Competitor List

One row per competitor. Updated quarterly.

| Column | Type | Description |
|---|---|---|
| Competitor ID | Auto | C-001, C-002... |
| Brand Name | Text | |
| URL | Link | |
| Positioning | Dropdown | Premium / Mid-market / Budget / Aspirational / Purist / Adjacent |
| Primary Geo | Text | Where they spend the most |
| Est. Revenue Range | Dropdown | <$1M / $1-5M / $5-25M / $25M+ / Unknown |
| Est. Monthly Ad Spend | Number | Based on ads active × estimated spend rate |
| First Observed | Date | When you first tracked them |
| Last Refresh Date | Date | |
| Relationship | Dropdown | Direct / Price ceiling / Price floor / Adjacent |
| Notes | Text | |

---

## Sheet 2: Active Ad Inventory

One row per competitor ad. Refresh every 2-4 weeks.

| Column | Type | Description |
|---|---|---|
| Ad ID | Auto | A-001... |
| Competitor ID | Link to Sheet 1 | |
| Date First Seen | Date | |
| Date Last Seen | Date | Refresh on every pass |
| Still Active? | Checkbox | |
| Days Running | Formula | Last Seen - First Seen |
| Ad Library URL | Link | |
| Screenshot | Attachment | |
| Ad Copy (Primary) | Long text | Full ad text |
| Hook Line | Text | First 8-12 words |
| Format | Dropdown | static_image / ugc_hifi / ugc_problem_solution / yapper / video_storyboard |
| Theme | Dropdown | Urgency / Lifestyle / Social Proof / Educational / PAS / Us vs Them / FOMO / Aspirational / Features-Benefits |
| Awareness Stage | Dropdown | Unaware / Problem Aware / Solution Aware / Product Aware / Most Aware |
| Hook Tactic | Dropdown | Confession / Bold Claim / Relatability / Contrast / Curiosity |
| Visual Category | Dropdown | POV / Before-After / Unboxing / Text Overlay / Green Screen / Product-in-Action / Street Interview / Reaction / Skit / ASMR / Tutorial / Behind-the-Scenes |
| CTA Text | Text | |
| Landing Page URL | Link | |
| Offer (if any) | Text | |
| Notes | Text | |

---

## Sheet 3: Weekly Competitor Dashboard

Pivot table. Refreshed on every research pass.

| Competitor | # Active Ads | # New This Week | # Dropped This Week | Oldest Still Running (days) | Top Theme | Top Stage |
|---|---|---|---|---|---|---|
| [C-001] | | | | | | |
| [C-002] | | | | | | |

---

## Sheet 4: Category Pattern Rollup

Aggregate across all competitors. Shows the category pattern.

| Dimension | Category % |
|---|---|
| Theme — Urgency | |
| Theme — Lifestyle | |
| Theme — Social Proof | |
| Theme — Educational | |
| Theme — PAS | |
| Theme — Us vs Them | |
| Theme — FOMO | |
| Theme — Aspirational | |
| Theme — Features-Benefits | |
| Stage — Unaware | |
| Stage — Problem Aware | |
| Stage — Solution Aware | |
| Stage — Product Aware | |
| Stage — Most Aware | |
| Tactic — Confession | |
| Tactic — Bold Claim | |
| Tactic — Relatability | |
| Tactic — Contrast | |
| Tactic — Curiosity | |
| Format — Static | |
| Format — UGC Hi-Fi | |
| Format — UGC Problem-Solution | |
| Format — Yapper | |
| Format — Video Storyboard | |

---

## Sheet 5: Gap Map

Side-by-side: client vs category average.

| Dimension | Client % | Category Avg % | Delta | Opportunity? |
|---|---|---|---|---|
| Theme — Urgency | | | | |
| Theme — Lifestyle | | | | |
| (all 9 themes) | | | | |
| Stage — Unaware | | | | |
| (all 5 stages) | | | | |
| Tactic — Confession | | | | |
| (all 5 tactics) | | | | |
| Format — Static | | | | |
| (all 5 formats) | | | | |

**Opportunity rules:**
- Delta > +15% (client heavier): may be over-invested; audit performance
- Delta -15% to +15%: aligned with category
- Delta > -15% (client lighter): potential gap; evaluate for testing
- Dimension = 0% across all competitors: category whitespace; biggest opportunity if it fits positioning

---

## Sheet 6: Concept Log (from research)

When research surfaces a concept, log it here before it moves to the creative brief queue.

| Concept ID | Source (which competitor inspired it) | Theme × Tactic × Stage × Format | Hook | Gap it fills | Ship date target | Status |
|---|---|---|---|---|---|---|

---

## Refresh cadence

| Sheet | Refresh frequency | Owner |
|---|---|---|
| Sheet 1 (Competitor List) | Quarterly | Strategy lead |
| Sheet 2 (Ad Inventory) | Every 2-4 weeks | Research analyst |
| Sheet 3 (Weekly Dashboard) | Weekly | Strategy lead |
| Sheet 4 (Category Rollup) | Every research pass | Auto-pivot |
| Sheet 5 (Gap Map) | After each research pass | Strategy lead |
| Sheet 6 (Concept Log) | As concepts surface | Strategy lead |

---

## Alerts to set up

In Google Sheets, Airtable, or Notion, configure alerts for:

- **New competitor added to Sheet 1** → Strategy team
- **Ad in Sheet 2 running more than 60 days** → Flag as category winner, reverse-engineer
- **Competitor ad count drops more than 30% week over week** → Investigate (pivot, budget cut, or shut down)
- **A new theme / stage / tactic reaches more than 25% of category** → Re-evaluate whether client should test it

---

## How to use the tracker for the creative sprint

Every 2 weeks, before the creative planning meeting:

1. Refresh Sheet 2 (Ad Inventory) for all 5 competitors
2. Auto-pivot Sheets 3, 4, 5
3. Review Sheet 5 (Gap Map) for any new opportunities
4. Pull 3 candidate concepts from Sheet 6 into the sprint
5. Brief each concept using the `/creative-brief` skill
6. Ship in the next 10 business days
