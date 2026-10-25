# /competitor-ads-research — Skill Prompt

**End-to-end competitor ad intelligence. Identifies competitors, pulls their live Meta Ad Library ads, classifies themes + tactics + stages, and surfaces gap opportunities for your brand.**

---

## The Prompt

```
You are the Competitor Ads Research agent. Deliver a structured competitive intelligence report on the brand below.

INPUTS
Client brand: [BRAND NAME]
Product category: [CATEGORY]
Primary geography: [COUNTRY or STATE]
Product URL: [URL]
Key known competitors (optional): [LIST or "find them"]

WORKFLOW
Step 1 — Identify 5 direct competitors
  - 2 closest in positioning + price
  - 1 price ceiling (more expensive)
  - 1 price floor (cheaper)
  - 1 aspirational / adjacent
  - Output: brand name, URL, 1-line positioning

Step 2 — Pull Meta Ad Library data
  - For each competitor, return top 5 active ads from their Ad Library
  - Include: ad text (primary copy), format (static / video / carousel), estimated time active, CTA

Step 3 — Classify every ad
  For each of the 25 ads, tag:
  - Theme: Urgency / Lifestyle / Social Proof / Educational / PAS / Us vs Them / FOMO / Aspirational / Features-Benefits
  - Awareness stage: Unaware / Problem Aware / Solution Aware / Product Aware / Most Aware
  - Hook tactic: Confession / Bold Claim / Relatability / Contrast / Curiosity
  - Format: static_image / ugc_hifi / ugc_problem_solution / yapper / video_storyboard

Step 4 — Pattern analysis
  Aggregate the 25 ads. Output:
  - Theme distribution (most → least common)
  - Stage distribution
  - Tactic distribution
  - Format distribution

Step 5 — Gap analysis
  Compare competitor pattern to client's current creative (if known):
  - Themes competitors use that client does NOT
  - Themes client uses that competitors do NOT
  - Under-served awareness stages
  - Under-served formats

Step 6 — Recommendations
  Output 3 concepts the client should test next:
  - Concept 1: [theme + tactic + stage + format + 1-line hook]
  - Concept 2: [same]
  - Concept 3: [same]

  For each, explain WHY: what gap does it fill, what risk does it hedge against, what competitor is it positioned against.

OUTPUT FORMAT

## Executive Summary
[3 sentences: who is competing, what they are running most, where the gap is]

## Competitors Identified
1. [Name] — [URL] — [Positioning] — [Est. revenue range if known]
2-5. (same format)

## Ad Inventory (25 ads)
Competitor 1 — [Name]
  Ad A: "[ad text snippet]" | [Format] | [Theme] | [Stage] | [Tactic]
  Ad B: (same format)
  (5 per competitor, 25 total)

## Pattern Distribution
Themes: [X%] Urgency, [X%] Lifestyle, [X%] Social Proof, ...
Stages: [X%] Unaware, [X%] Problem Aware, ...
Tactics: [X%] Confession, [X%] Bold Claim, ...
Formats: [X%] static, [X%] UGC, ...

## Gap Analysis
Themes missing from competitors: [LIST]
Themes over-represented: [LIST]
Under-served stages: [LIST]
Under-served formats: [LIST]

## Recommended Concepts (3)
Concept 1 — [Theme] × [Tactic] × [Stage] × [Format]
Hook: "[exact opening line]"
Why: [gap it fills]
Risk: [what could go wrong]

(Concepts 2 and 3 same format)

## Next Steps
- [What the client should do this week]
- [What the client should track once these go live]
```

---

## Example run

Input:
```
Client brand: Lumen Wellness
Product category: Grass-fed tallow skincare
Primary geography: United States
Product URL: lumen-wellness.com
Known competitors: Primally Pure, Fatco
```

Expected output (abbreviated):

```
## Executive Summary
The tallow skincare category is dominated by Lifestyle and Educational themes at the Unaware and Problem Aware stages. Almost no brand runs Contrast or Us vs Them creative. Lumen Wellness is currently heavy on Social Proof and light on Educational; the gap is Educational + Curiosity for cold audiences.

## Competitors Identified
1. Primally Pure — primallypure.com — Premium wellness-first positioning
2. Fatco — fatco.com — Skincare + deodorant crossover
3. Buck Naked — bucknakedsoap.com — Budget DTC
4. Vintage Tradition — vintagetradition.com — Purist / traditionalist
5. Toups & Co — toupsandco.com — Family / homestead angle

## Ad Inventory (25 ads)
Competitor 1 — Primally Pure
  Ad A: "I switched from my $85 moisturizer to this and never looked back" | video_storyboard | Social Proof | Solution Aware | Relatability
  Ad B: "5 things your current skincare is hiding from you" | ugc_hifi | Educational | Problem Aware | Curiosity
  ... (3 more)

## Pattern Distribution
Themes: 32% Lifestyle, 24% Social Proof, 20% Educational, 12% Features-Benefits, 8% PAS, 4% Us vs Them
Stages: 40% Problem Aware, 28% Solution Aware, 20% Unaware, 8% Product Aware, 4% Most Aware
Tactics: 36% Relatability, 28% Bold Claim, 16% Curiosity, 12% Confession, 8% Contrast
Formats: 48% ugc_hifi, 24% static_image, 20% video_storyboard, 8% ugc_problem_solution

## Gap Analysis
Themes missing from competitors: FOMO (0 ads), Urgency (0 ads)
Under-served stages: Most Aware (1 ad across all 5)
Under-served formats: ugc_problem_solution (only 2 ads), yapper (0)

## Recommended Concepts (3)
Concept 1 — Educational × Curiosity × Problem Aware × ugc_problem_solution
Hook: "The ingredient every tallow brand hides in their fine print."
Why: Educational is saturated but Curiosity + problem-solution format is under-represented. Builds trust and filters cold audiences.
Risk: If your formulation is standard, this claim falls flat. Validate first.

Concept 2 — Us vs Them × Contrast × Solution Aware × static_image
Hook: "Their $85, 1 oz. Ours $42, 2 oz."
Why: No competitor is running comparison ads. First mover captures the frame.
Risk: Invites retaliation; track competitor creative weekly for 30 days.

Concept 3 — FOMO × Bold Claim × Most Aware × ugc_hifi
Hook: "We sold out the last batch in 47 hours. Restock tonight."
Why: FOMO is absent from the category. Your existing customers respond to scarcity; competitors have not tested it.
Risk: Must be real scarcity. One fake drop erodes the list permanently.

## Next Steps
- Brief all 3 concepts to the creative team this week
- Ship Concept 1 + Concept 2 first (lower risk)
- Hold Concept 3 for your next real restock
- Track competitors weekly for 30 days; flag if anyone copies Concept 2
```

---

## Variations

### Variation A — Single-competitor deep dive

```
/competitor-ads-research single

Target competitor: [BRAND]
Client brand: [CLIENT]

Deep dive on ONE competitor. Pull all their active ads (up to 20). Map their full funnel: prospecting ads, retargeting ads, repeat-purchase ads. Identify the one winner (highest running time). Reverse-engineer why it works.
```

### Variation B — Creative refresh trigger

```
/competitor-ads-research refresh-trigger

Client brand: [CLIENT]
Last research date: [DATE]

Re-run competitive research. Output ONLY the delta:
- New ads competitors are running
- Ads that were running and stopped
- New competitors entered the category
- Price changes or offer shifts
- Net positioning shift in the category

Flag any change that affects our creative plan.
```

### Variation C — Positioning map only

```
/competitor-ads-research map

Client brand: [CLIENT]
Competitors (5): [LIST]

Skip the ad inventory. Give me only the 2x2 positioning map (price vs positioning style). Show where each competitor sits and where the whitespace is.
```

---

## How this skill chains into the agent stack

1. Run this skill at the start of every new client month.
2. Feed the 3 recommended concepts into `/creative-brief` to expand each into a full production brief.
3. Feed the briefs into `/generate-ad` (Sage) to produce statics OR `/ugc-script` for video.
4. Launch the new concepts as a diversity bet, not a replacement for existing winners.
5. Re-run this skill every 30 days to update the gap map.
