# /buyer-psychology — Skill Prompt

**Synthesizes raw buyer interview data into a structured Psychology Brief. One run per persona.**

---

## The Prompt

```
You are the Buyer Psychology Research agent. Synthesize the research inputs below into a complete Psychology Brief using the TEEP framework (Trigger, Emotion, Evidence, Payoff).

INPUTS
Product: [NAME]
Persona working title: [ONE LINE]
Number of interviews: [N]
Raw interview notes or transcripts: [PASTE]
Survey data (optional): [PASTE]
Review mining notes (optional): [PASTE]
Competitor finalists observed in research: [LIST]

RULES
1. Use the buyer's EXACT phrases wherever possible. Do not paraphrase insights into marketing-speak.
2. Identify the dominant Trigger event type (Physical / Social / Calendar / Financial / Life-event / Content / Competitive).
3. For each TEEP element, output: dominant pattern + 1-2 supporting quotes.
4. Flag when evidence is thin ("Only 1 of 4 interviews mentioned this, treat as hypothesis, not pattern").
5. Calibrate voice axes (formal/casual, bold/subtle, rational/emotional) from how the buyers actually speak.
6. Produce a creative coverage map (which ads need to exist for this persona in the next 60 days).

OUTPUT FORMAT

## 1. Persona Snapshot
[One paragraph. Age, life stage, habit, frustration, aspiration.]

## 2. Trigger
Trigger event type: [TYPE(S)]
Dominant trigger pattern: [1-2 sentences describing the event or cue]
Exact quote:
> "[QUOTE]"
Internal monologue at trigger:
> "[QUOTE]"
Recommended Trigger-led ad: [tactic, format, opening line]

## 3. Emotion
Dominant emotions (1-2): [LIST]
What the emotion sounds like: "[QUOTE]"
What the emotion looks like in their daily life: [1-2 sentences]
Recommended Emotion-led ad: [tactic, opener, tone]

## 4. Evidence
Proof types the buyer actually asked for: [social / scientific / credentialing / demonstration / comparison]
What convinced them: "[QUOTE]"
What failed to convince them: "[QUOTE]"
Recommended Evidence-led ad: [proof type to lead with, format]

## 5. Payoff
Primary payoff (functional / identity / social / relief / time-money saved): [TYPE]
What they expected to get: "[QUOTE]"
What they actually got (if post-purchase interview): "[QUOTE]"
Recommended Payoff-led ad: [specific outcome to promise, format]

## 6. Quotable Phrases (5-10)
Exact buyer sentences to use in ad copy:
1. "[QUOTE]"
(up to 10)

## 7. Voice Calibration
Formal_casual: [1-10]
Bold_subtle: [1-10]
Rational_emotional: [1-10]
Descriptors: [2-3 adjectives]

## 8. What NOT to Say
[List of phrases, claims, or framings that will land poorly]

## 9. Creative Coverage Map
| TEEP Element | # Ads Needed | Theme | Tactic | Format | Priority |
|---|---|---|---|---|---|
| Trigger | 2 | ... | ... | ... | ... |
| Emotion | 2 | ... | ... | ... | ... |
| Evidence | 3 | ... | ... | ... | ... |
| Payoff | 1-2 | ... | ... | ... | ... |

## 10. Confidence Notes
- Strong patterns (evidenced in 3+ interviews): [LIST]
- Hypotheses (evidenced in 1-2 interviews, needs more data): [LIST]
- Gaps (not covered by research, needs follow-up interviews): [LIST]

## 11. Next Steps
- [3 actions for the strategy team this week]
```

---

## Example run

Input:
```
Product: Barrier Repair Serum
Persona working title: 30s female with cyclical flaking
Number of interviews: 4
Raw notes: [Pasted 4 transcripts, ~500 words each]
Survey data: [50-response survey summary]
Competitor finalists observed: Primally Pure, Fatco, Vintage Tradition
```

Expected output (abbreviated):

```
## 1. Persona Snapshot
Jessica, 32-38, mom of young kids. Wakes 5:45 AM, 90-second routine max. Tried 8-11 serums in 4 years. Cycle: skin flakes Wed-Fri, calms by Sunday, flakes again by Wednesday. Stopped believing skincare ads. Wants to look like herself at her age, not filtered.

## 2. Trigger
Trigger event type: Physical + Social
Dominant trigger pattern: A photo or comment that surfaces the cyclical nature of the flaking. Often a Thursday workday where coworker or partner comments.
Exact quote:
> "My husband said 'your skin looks dry AGAIN', like he had said it the week before. That was the moment."
Internal monologue at trigger:
> "How many times am I going to keep buying $48 serums that don't last?"
Recommended Trigger-led ad: Confession + POV. Caption: "I kept buying serums. None worked past Tuesday."

## 3. Emotion
Dominant emotions: Frustration, Relief-seeking
What the emotion sounds like: "I'm so tired of starting over every three months."
What the emotion looks like in daily life: Opens the bathroom cabinet, sees four half-used bottles, closes it.
Recommended Emotion-led ad: UGC monologue. Opens on the cabinet shot. Tone: resigned, honest.

## 4. Evidence
Proof types the buyer asked for: Demonstration + Social
What convinced them: "The before-after on day 14. The other two didn't show results that fast."
What failed to convince them: "Claims about clinical testing without a photo or a person."
Recommended Evidence-led ad: Day 1 vs Day 14 UGC. Paired with a short quote from a real customer.

## 5. Payoff
Primary payoff: Relief (plus identity: "looks like herself")
What they expected to get: "A week without thinking about my skin."
What they actually got: "Three weeks in, I stopped checking in the mirror at work."
Recommended Payoff-led ad: Static. Headline: "Three weeks in, you stop checking." Visual: a woman in a normal work moment, not posed.

## 6. Quotable Phrases
1. "None of them worked past Tuesday."
2. "I was buying the wrong thing for years."
3. "Third time this month my skin flaked on a work call."
4. "$340 on serums this year."
5. "The before-after on day 14 is what did it."
6. "If it had fragrance I wouldn't have tried it."
7. "If it doesn't work I'll return it."
8. "I told myself this was the last one I'd try."

## 7. Voice Calibration
Formal_casual: 8 (casual)
Bold_subtle: 6 (bold-leaning)
Rational_emotional: 6 (rational-leaning with emotional undertone)
Descriptors: honest, direct, worn-out

## 8. What NOT to Say
- "Luxurious", feels wrong for her. She is tired of luxury marketing.
- "Anti-aging", she does not think about age, she thinks about flaking.
- "Revolutionary", trigger word. She has heard it too many times.
- "Silky", too soft. She wants functional language.

## 9. Creative Coverage Map
| TEEP Element | # Ads | Theme | Tactic | Format |
|---|---|---|---|---|
| Trigger | 2 | Problem-Solution | Confession, Relatability | ugc_hifi, ugc_problem_solution |
| Emotion | 2 | Lifestyle | POV monologue | ugc_hifi |
| Evidence | 3 | Social Proof | Demo + Comparison | static_image, ugc_hifi |
| Payoff | 1 | Lifestyle | Outcome-led | static_image |

## 10. Confidence Notes
- Strong (4/4 interviews): Cyclical flaking pattern, Wed-Fri trigger, fragrance dealbreaker, Day 14 proof mattered
- Hypothesis (2/4): Reddit as a trusted exploration channel, validate with a follow-up survey
- Gap: We did not ask about subscription vs one-time purchase preference, follow up

## 11. Next Steps
- Ship Trigger-led ad #1 (Confession POV) this week
- Build Evidence-led comparison static by end of week
- Run a 50-person survey on subscription preference before next brief revision
```

---

## Variations

### Variation A, Fast brief (1 interview)

```
/buyer-psychology quick

Product: [NAME]
Persona: [PERSONA]
Single interview transcript: [PASTE]

Produce a fast brief. Mark everything as hypothesis, not pattern. Flag the gaps that need 2-3 more interviews to validate.
```

### Variation B, Brief refresh

```
/buyer-psychology refresh

Existing brief: [PASTE OR LINK]
New data: [PASTE, new interviews, reviews, survey data]

Compare new data to existing brief. Output ONLY the updated fields. Mark anything that flipped ("was X, now Y, because [evidence]").
```

### Variation C, Competitor persona

```
/buyer-psychology competitor

Competitor brand: [BRAND]
Their reviews (last 50): [PASTE]
Their best ad copy (top 5): [PASTE]

Reverse-engineer THEIR buyer persona from their public signals. Compare to our persona. Flag where they are reaching a different audience.
```
