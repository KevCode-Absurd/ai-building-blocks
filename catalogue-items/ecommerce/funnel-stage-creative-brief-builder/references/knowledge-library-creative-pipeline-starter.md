# Creative Pipeline Starter

Scaffold describing the minimum files and contracts required to rebuild the creative pipeline from scratch in your own codebase.

Because the pipeline spans 15+ files across two systems, this starter is organized as a directory plan with the essential code contracts inline.

---

## Directory Layout

```
lib/
├── strategy/
│   ├── types.ts                          # The taxonomy (AngleType, CellStatus, AwarenessStageKey, etc)
│   ├── brand-intelligence.ts             # Perplexity + Claude research chain
│   ├── persona-generator.ts              # 3-5 personas per brand
│   ├── priority-scoring.ts               # Matrix + scoring formula
│   ├── sprint-planner.ts                 # Concept generation (big file)
│   ├── brief-generator.ts                # Copy-ready strategy briefs
│   ├── production-brief-generator.ts     # Full execution specs
│   └── preflight-checker.ts              # Quality gate
├── prompts/
│   ├── theme-characteristics.ts          # 9 theme structures
│   ├── brand-visual-vocabulary.ts        # Colors, lighting, props per brand
│   ├── prompt-optimizer.ts               # createBriefing() assembles 15 sections
│   └── optimizer-system-prompt.ts        # Grok's instructions
└── gemini/
    └── image-generator.ts                # Stage 3: generateAdImage()
```

---

## Essential Type Contracts (`lib/strategy/types.ts`)

```typescript
export type AngleType =
  | 'pain_point' | 'desired_outcome' | 'use_case' | 'social_proof'
  | 'urgency_scarcity' | 'education' | 'comparison' | 'identity'
  | 'objection_handling' | 'curiosity_hook'

export type CellStatus =
  | 'empty' | 'learning' | 'testing' | 'winner' | 'fatigued'

export type AwarenessStageKey =
  | 'unaware' | 'problem_aware' | 'solution_aware'
  | 'product_aware' | 'most_aware'

export interface StrategyBrief {
  id: string
  persona_id: string
  awareness_stage: AwarenessStageKey
  concept_data: {
    headlines: string[]
    subheadlines: string[]
    body: string
    ctas: string[]
  }
  copy_framework: {
    headline_formula: string
    hook_pattern: string
    cta_style: string
  }
  visual_direction: {
    style: string
    mood: string
    color_palette: string[]
  }
  generation_config: {
    format: 'static' | 'video' | 'carousel'
    theme: string
    background: string
  }
}

export interface ProductionBrief {
  strategy_brief_id: string
  hooks: Array<{
    text_overlay: string
    visual_description: string
    vibe: string
  }>
  body_structure: string
  copy_blocks: {
    primary_text: string
    headline: string
    description: string
  }
  format_specs: {
    aspect_ratios: string[]
    duration_seconds?: number
  }
  // THE CONTRACT: this object is what the image pipeline consumes
  adiq_fields: {
    theme: string
    background_type: string
    lighting_style: string
    typography_style: string
    aspect_ratio: string
    format: 'static' | 'video' | 'carousel'
    product_hero_percentage: number
    text_density: 'low' | 'medium' | 'high'
  }
}
```

---

## Priority Scoring Formula (`priority-scoring.ts`)

```typescript
export const FUNNEL_WEIGHTS: Record<AwarenessStageKey, number> = {
  most_aware: 5,
  product_aware: 4,
  solution_aware: 3,
  problem_aware: 2,
  unaware: 1,
}

export const COVERAGE_PENALTIES: Record<CellStatus, number> = {
  empty: 3.0,
  fatigued: 2.5,
  learning: 1.5,
  testing: 1.0,
  winner: 0.3,
}

export function scorePriority(
  stage: AwarenessStageKey,
  personaSpendShare: number,   // 0-1
  status: CellStatus,
  daysSinceLastBrief: number
): number {
  const freshnessPenalty = Math.min(daysSinceLastBrief / 14, 2.0) // caps at 2x after 28 days
  return FUNNEL_WEIGHTS[stage]
    * personaSpendShare
    * COVERAGE_PENALTIES[status]
    * freshnessPenalty
}
```

---

## Framework Instructions (`brief-generator.ts`)

```typescript
export function getFrameworkInstructions(stage: AwarenessStageKey): string {
  switch (stage) {
    case 'unaware':
      return `Framework: Pattern Interrupt + Curiosity Loop.
Rules: headline opens with an unexpected statement or surprising stat.
Body teases a revelation without giving the answer. CTA drives click to learn more.`

    case 'problem_aware':
      return `Framework: PAS (Problem-Agitate-Solution).
Rules: headline names the pain in the reader's own language.
Body agitates the pain in 1-2 sentences, then presents the solution. CTA is specific to the solution.`

    case 'solution_aware':
      return `Framework: Differentiation + Proof.
Rules: headline positions this product vs alternatives.
Body explains the unique mechanism + proof point. CTA emphasizes switching.`

    case 'product_aware':
      return `Framework: BAB (Before-After-Bridge) + Social Proof.
Rules: headline describes the after-state.
Body: 1 sentence before, 1 sentence after, 1 sentence bridge (= the product), 1 proof quote. CTA emphasizes immediate start.`

    case 'most_aware':
      return `Framework: Direct Offer + Urgency.
Rules: headline leads with the offer itself.
Body is 1-2 sentences of value prop + urgency. CTA is transactional.`
  }
}
```

---

## Banned Phrases (`preflight-checker.ts`)

```typescript
export const BANNED_PHRASES: RegExp[] = [
  /\bunlock\b/i,
  /\bunleash\b/i,
  /\bgame[ -]?chang(er|ing)\b/i,
  /\brevolutionary\b/i,
  /\bleverage\b/i,
  /\bnavigate\b/i,
  /\bdelve\b/i,
  /\btransformative\b/i,
  /\belevate your\b/i,
  /\bharness the power\b/i,
]

export function scanForBannedPhrases(copy: string): string[] {
  return BANNED_PHRASES
    .filter(pattern => pattern.test(copy))
    .map(pattern => pattern.source)
}
```

---

## Rebuild Checklist

1. [ ] Define the type system (`types.ts`) first. Everything downstream depends on it.
2. [ ] Build brand intelligence with 24h cache. Two-model chain (web research + synthesis).
3. [ ] Persona generator runs against brand intelligence output.
4. [ ] Priority scoring math from constants above.
5. [ ] Sprint planner must have the no-silent-fallback property. Throw on AI failure.
6. [ ] Brief generator injects framework-by-stage.
7. [ ] Production brief generator produces the `adiq_fields` contract.
8. [ ] Preflight checker runs on every brief before handoff.
9. [ ] Theme characteristics file contains all layout rules (colors go elsewhere).
10. [ ] Image pipeline consumes `adiq_fields`, produces images.

---

## Critical Architectural Decisions

1. **One-way data flow.** Strategy → briefs → production → images. No back-edges.
2. **Every step reads from real data.** No AI brainstorming on empty inputs.
3. **Framework mapping is fixed, not AI-chosen.** Unaware always gets Pattern Interrupt. Most aware always gets Direct Offer. Determinism beats cleverness.
4. **The `adiq_fields` object is the contract.** Versioning happens here. Breaking this shape breaks both pipelines.
5. **Themes are structure, not visuals.** A Problem/Solution layout works for a coffee brand or a skincare brand. Colors come from brand vocabulary, not themes.
