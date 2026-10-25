# Hook System Master Reference

**Three layers. One scroll-stop window. 1.3 seconds to earn the next 5.**

Every hook in this system is a combination of three layers working together: a **visual** (what they see), a **caption** (what they read), and a **voiceover** (what they hear). The caption sets the psychological tactic. The voiceover follows. The visual carries the attention load at scroll speed.

This reference maps the full combinatorial space: 5 tactics × 12 visual hooks × 18 voiceover hooks × 16 caption hooks.

---

## The 5 Psychological Tactics

| Tactic | Mechanism | Best Stages | Avoid At |
|---|---|---|---|
| **Confession** | Vulnerability disarms skepticism | Problem Aware, Solution Aware | Unaware |
| **Bold Claim** | Specificity forces cognitive evaluation | Solution Aware, Product Aware | Unaware |
| **Relatability** | Mirror neurons + tribal belonging | Unaware, Problem Aware | Most Aware |
| **Contrast** | Two reference points beat one | Solution Aware, Product Aware | Unaware |
| **Curiosity** | Information gap demands resolution | Unaware, Problem Aware | Most Aware |

---

## The 12 Visual Action Hooks

| # | Visual | Attention Mechanic | Static | UGC Hi-Fi | Prob-Sol | Yapper | Video Storyboard |
|---|---|---|---|---|---|---|---|
| 1 | POV / First-Person | Mirror neuron immersion | — | yes | yes | yes | yes |
| 2 | Before / After | Contrast detection (wired-in) | yes | yes | yes | yes | yes |
| 3 | Unboxing | Anticipation gap | — | yes | — | yes | yes |
| 4 | Text Overlay Reveal | Feed pattern break | yes | yes | yes | yes | yes |
| 5 | Green Screen / Trending | Borrowed cultural momentum | — | yes | — | yes | yes |
| 6 | Product-in-Action | Demonstration as proof | yes | yes | yes | yes | yes |
| 7 | Street Interview | Social proof + authenticity | — | yes | — | yes | yes |
| 8 | Reaction / Duet | Parasocial curiosity | — | yes | — | yes | yes |
| 9 | Skit / Comedy | Entertainment bypasses ad resistance | — | yes | yes | yes | yes |
| 10 | ASMR / Sensory | Reward center activation | — | yes | — | — | yes |
| 11 | Tutorial / How-To | Useful information promise | yes | yes | yes | yes | yes |
| 12 | Behind-the-Scenes | Exclusive access curiosity | — | yes | — | yes | yes |

---

## The 18 Voiceover Hooks

| # | Voiceover | Tactic Affinity |
|---|---|---|
| 1 | Personal Story Opener | Confession, Relatability |
| 2 | Stop Scrolling If | Bold Claim, Relatability |
| 3 | Product Discovery | Curiosity, Confession |
| 4 | Problem Acknowledgment | Relatability, Confession |
| 5 | Myth Bust Lead | Bold Claim, Curiosity |
| 6 | Testimonial Quote | Bold Claim, Relatability |
| 7 | Surprising Fact | Curiosity, Bold Claim |
| 8 | Expert Authority | Bold Claim, Curiosity |
| 9 | Sound Effect + Statement | Bold Claim, Curiosity |
| 10 | Day-in-the-Life | Relatability |
| 11 | Emotional Hook | Confession, Relatability |
| 12 | Question Opener | Curiosity, Relatability |
| 13 | Direct Address "You" | Bold Claim, Relatability |
| 14 | Direct Confrontation | Contrast, Bold Claim |
| 15 | Transformation Tease | Contrast, Curiosity |
| 16 | POV Narration | Relatability, Confession |
| 17 | Anti-Hype Opener | Confession, Bold Claim |
| 18 | Numbered List Tease | Curiosity, Bold Claim |

**Tactic distribution:** Curiosity (10), Relatability (10), Bold Claim (8), Confession (4), Contrast (2).

Contrast is under-represented on purpose. Contrast is a visual tactic. You SHOW the gap, you do not SAY the gap. Visual layer carries contrast almost entirely.

---

## The 16 Caption Hooks

| # | Caption | Tactic Affinity | Example |
|---|---|---|---|
| 1 | Confession | Confession | "I was wrong about tallow." |
| 2 | Bold Statement | Bold Claim | "Stop using that serum." |
| 3 | Question | Curiosity, Bold Claim | "Why is nobody talking about this?" |
| 4 | Number Shock | Bold Claim | "12,000 people switched this month" |
| 5 | This vs That | Contrast | "Their way vs our way" |
| 6 | Relatability | Relatability | "When you refresh your cart 3 times" |
| 7 | POV | Relatability | "POV: your skin is finally calm" |
| 8 | Myth Buster | Curiosity, Bold Claim | "Everyone tells you to hydrate. Wrong." |
| 9 | Tell Me Without Telling Me | Relatability | "Tell me you are a coffee snob without telling me" |
| 10 | Story Open | Confession, Relatability | "So I was standing in the bathroom at 6 AM" |
| 11 | Question / Challenge | Curiosity, Relatability | "What if you have been wrong about this?" |
| 12 | Announcement | Bold Claim | "NEW: Barrier Complex" |
| 13 | Direct Stat | Bold Claim | "89% of users saw results in 14 days" |
| 14 | Curiosity Gap | Curiosity | "The ingredient every serum hides" |
| 15 | Comparison Lead | Contrast | "Before. After. 14 days." |
| 16 | Tribal Callout | Relatability | "For the 5 AM crew" |

---

## Tactic × Stage Guardrails

The system automatically FILTERS tactics based on awareness stage. These are the avoid rules that override any score.

| Stage | Strong Tactics | Moderate | Avoid |
|---|---|---|---|
| Unaware | Curiosity, Relatability | Bold Claim | Contrast, Confession |
| Problem Aware | Confession, Relatability, Curiosity | Contrast | — |
| Solution Aware | Contrast, Bold Claim | Confession, Curiosity | — |
| Product Aware | Bold Claim, Contrast | Confession | Curiosity |
| Most Aware | Bold Claim | Contrast | Curiosity, Relatability |

---

## The Three Diversity Passes

When the system recommends 5 hooks, it runs 3 passes to enforce creative variety:

**Pass 1 (strict):** No duplicate visual, caption, OR voiceover. Max 2 of the same tactic.

**Pass 2 (relaxed):** If Pass 1 can't fill 5, allow voiceover repeats. Visual + caption stay unique.

**Pass 3 (backfill):** If still short, add whatever is available. Visual uniqueness always preserved.

**Priority order:** Visual uniqueness > caption uniqueness > voiceover uniqueness. Two ads with the same opening shot look identical in the feed. Two ads with the same opening line but different visuals still feel like different ads.

---

## How to Build a Hook Combination

1. **Select awareness stage.** This filters tactics automatically.
2. **Pick the dominant tactic.** The caption sets this.
3. **Select a caption** whose `tacticAffinity` includes the dominant tactic.
4. **Select a voiceover** whose `tacticAffinity` also includes that tactic.
5. **Select a visual** from the format-compatible list.
6. **Score the combination:** tactic-stage fit + persona alignment + format preferred tactic bonus.
7. **Run diversity enforcement** across the top 5.

**The golden rule:** caption and voiceover must complement, not duplicate. If the caption says the number, the voiceover names the feeling. If the caption names the feeling, the voiceover says the number.

---

## Static Ad Archetypes (10 recipe cards)

Static ads are one-layer. The image carries it. Same 5 tactics, different execution. Each archetype is a recipe for a specific layout:

1. **Bold Statement on Solid** — Single headline, solid background, product off-center
2. **Before / After Split** — Vertical or horizontal split, product in center seam
3. **Testimonial Quote Card** — Customer quote on top half, product + rating on bottom
4. **Number / Stat Hero** — Massive number, small context line, product corner-staged
5. **Us vs Them Comparison** — Two columns, feature checklist, winner highlighted
6. **Pattern Break Question** — Single bold question, tiny answer or CTA below
7. **Product Hero Minimal** — Product on branded background, no text or minimal tag
8. **3-Step Tutorial Grid** — Three small frames, one headline, product in frame 2 or 3
9. **Founder / Authority Portrait** — Person + short credential line + product call-out
10. **Aspirational Lifestyle** — Lifestyle shot, brand mark only, product subtle

Each archetype has tactic affinity and stage fit, same scoring engine as video.

---

## Format Compatibility Matrix (quick reference)

| Format | Compatible Visuals |
|---|---|
| Static image | Before/After, Text Overlay, Product-in-Action, Tutorial (7 total) |
| UGC Hi-Fi | All 12 |
| UGC Problem-Solution | POV, Before/After, Text Overlay, Product-in-Action, Skit, Tutorial, Behind-the-Scenes (7) |
| Yapper | POV, Before/After, Unboxing, Text Overlay, Green Screen, Product-in-Action, Street Interview, Reaction, Skit, Tutorial, Behind-the-Scenes (11) |
| Video Storyboard | All 12 |

---

## How to Read This Reference

Start with the awareness stage. Pick the dominant tactic from the Strong column. Pick a caption with that tactic affinity. Pick a voiceover that also has it. Pick a visual from the format-compatible list. Score and validate. Diversity-check across your top 5.

The system is combinatorial, but the rules narrow the choices fast. You are not picking from 12 × 16 × 18 = 3,456 options. You are picking from about 40-80 valid combinations per awareness stage, and diversity enforcement narrows that to a final 5.
