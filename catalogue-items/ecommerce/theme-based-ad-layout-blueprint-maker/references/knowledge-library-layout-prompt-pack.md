---
name: layout-templates
description: Generate ad layout blueprints using 9 marketing themes with space allocation, composition rules, and text hierarchy. Use when: "layout for", "ad structure", "how should this ad be composed", "template for [theme]", "aspect ratio layout".
---

# Layout Templates — Ready-to-Paste Prompt Pack

Skill prompt pack for requesting a specific theme's layout blueprint.

---

## Purpose

Given a selected theme and a product, produce a full layout specification the creative team (or the image pipeline) can execute:
- Space allocation (what % of the frame each element occupies)
- Composition rules
- Text hierarchy (primary, secondary, tertiary)
- Variant recommendation (1 of 3-4 per theme)

---

## When to Trigger

- User says: "layout for X", "how should this ad be composed", "template for [theme]", "give me a Problem/Solution blueprint".
- Before handing a brief to a designer.
- Before firing the image generator.

Do NOT trigger for:
- Copy-only requests ("write me a headline") — use the copy skill.
- Generic "make me an ad" requests — needs theme selection first.

---

## Inputs Required

| Input | Example | Required? |
|---|---|---|
| Theme key | `urgency`, `problem_solution`, `aspirational`, etc | Yes |
| Product | Name + one-sentence description | Yes |
| Aspect ratio | 1:1, 4:5, 9:16, 16:9 | Yes |
| Awareness stage | unaware → most_aware | Recommended |
| Variant preference | "announcement style", "split-screen", "negative space" | Optional |
| Brand voice snippet | Sample of winning ad copy | Recommended for tone |

---

## Workflow

**Step 1: Validate inputs.**
Confirm theme is one of 9 valid keys. Reject if "custom" or undefined.

**Step 2: Pull theme characteristics.**
Load the theme's `adStructure`, `layoutComposition`, `technicalSpecifications`, `headlineTemplates`, `layoutVariations`.

**Step 3: Pick a variant.**
If the user specified a variant, use it. Otherwise pick variant 1 as default (usually the most flexible).

**Step 4: Apply aspect-ratio constraints.**
- 1:1: any composition works
- 4:5: prefer vertical splits over horizontal
- 9:16: mobile-optimized, text overlay <20 words
- 16:9: headline + product hero dominate, no multi-panel layouts

**Step 5: Generate layout spec.**
Output the full layout blueprint with every element's share, position, and content type.

**Step 6: Flag any mandatory reinforcements.**
If the theme is Problem/Solution, Us vs Them, or Features/Benefits, emit the mandatory reinforcement block.

---

## Output Format

```markdown
# Layout Blueprint — [Theme Name]

**Theme:** [theme_key]
**Variant:** [1-4 label]
**Aspect Ratio:** [ratio]
**Product:** [name]

## Space Allocation

| Element | Share | Position | Content |
|---|---|---|---|
| [element 1] | X% | [position] | [what goes here] |
| [element 2] | X% | [position] | [what goes here] |
| ... |

Total: ~100%

## Composition Rules

- [rule 1]
- [rule 2]
- [rule 3]

## Text Hierarchy

- **Primary (largest):** [element]
- **Secondary:** [element]
- **Tertiary (smallest):** [element]

## Mandatory Reinforcements

[If theme requires split-screen, callouts, or negative space, state it here in ALL CAPS]

## Technical Specs

- Max total text on image: [N] words
- Font sizes: [primary, secondary, tertiary]
- Contrast requirements: [if any]

## Variant Alternatives

If this variant does not fit:
- **Variant 2:** [brief description]
- **Variant 3:** [brief description]
- **Variant 4:** [brief description]

## Handoff Notes for Image Pipeline

`adiq_fields`:
- theme: [theme_key]
- background_type: [inferred]
- text_density: [low / medium / high, inferred from theme]
- aspect_ratio: [input]
- product_hero_percentage: [from ad structure table]
```

---

## Theme Key Reference

| Key | When to use |
|---|---|
| `urgency` | Legitimate time-sensitivity, most aware buyers |
| `problem_solution` | Agitate + relieve, split-screen mandatory |
| `us_vs_them` | Name the alternative, comparison ad |
| `features_benefits` | 3-4 callout product ad |
| `aspirational` | Sell the lifestyle, 30-40% negative space |
| `social_proof` | Testimonial-led, review aggregation |
| `educational` | Step-by-step, teaches the problem or the use |
| `offer` | Deal-led, price-forward |
| `ugc` | Native creator aesthetic, 9:16 mobile-first |

---

## Quality Checks Before Output

1. **Space allocation sums to ~100%.** Do not emit a layout where shares total <95% or >105%.
2. **Mandatory rules included.** If theme is Problem/Solution or Us vs Them, the split-screen rule MUST appear in the output.
3. **Text hierarchy has exactly 3 levels.** Primary, secondary, tertiary. No "primary 1" and "primary 2."
4. **Aspect ratio fits the chosen variant.** Do not recommend horizontal split for 9:16.

---

## Customization Hooks

- **Add a 10th theme:** add to `THEME_CHARACTERISTICS` in `theme-characteristics.ts`, add to this skill's theme key reference, add abbreviated format.
- **Change default variant:** default is variant 1. Adjust per account testing history.
- **Relax text caps:** themes cap total text. If your vertical performs with more text, adjust per theme.

---

## Example Invocation

```
User: /layout-templates problem_solution, aspect 9:16, product "Lumen Wellness Body Butter"

Agent: [returns the blueprint above with Problem/Solution split-screen for 9:16 vertical]
```
