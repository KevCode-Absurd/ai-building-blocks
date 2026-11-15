---
name: product-copy
description: Use when writing or rewriting a product description, product title, benefit list, feature bullets, or on-page product messaging for an online store — e.g. "write a description for this product", "rewrite my product copy", "how many benefits should I list", "should I say 500g or 25 servings", "name this color", "should we mention it's lab-tested".
---

# Product copy

Write product descriptions that people find persuasive, easy to grasp, and worth paying more for. The rules change how copy is *structured* and *measured* — number of claims, units, names, register — which move purchase intent and willingness to pay more than adjectives do.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Org context** (its products part), made by the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder): who you are, your buyers, voice, look, markets, claims and offers, kept in one folder.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Org context** with the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the org context, read:** `index.md`, `offers.json`, `facts.json`, `voice.md`, `foundation/claims.md`, `foundation/customer-talk.md`. Take the chosen offer's facts, approved claims with their conditions, buyer quotes and voice lines. Only `live` lines count as facts: stale, `unconfirmed` and `banned` lines do not. If `worked.md` is there, keep what the client kept and leave out what they killed. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: an org context is a `context/org-context/` folder with `index.md` in it. If it's there, read `index.md` and the files above. An older `context/brand-file/` folder, or a brand folder with `00-start-here.md` in it, still works as material. Look for the other things by name.
2. **Check what's missing.** Look for your org context. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to use

- Writing or rewriting a description, title, bullets, or hero message
- Choosing which features to mention, how many, in what units and register

## When not to use

- Auditing the whole page → the Product page auditor (`product-page-auditor`); photo/video direction → ask your AI for a shot list
- Discount or promotion wording → write the offer text on its own, apart from the product copy

## Inputs

Collect, or state your assumption:

- Product facts: materials, quantity, specs, ingredients or components (any branded?)
- The full list of candidate benefits
- Audience and how technical they are
- Where the copy sits and the length limit

> **Classify the product first.** *Hedonic* = bought for enjoyment, pleasure, or the experience (chocolate, fashion, decor, travel, spa, perfume). *Utilitarian* = bought to do a job, judged on function and value (detergent, appliances, insect repellent, tools, accounting software). If it's mixed, decide by what the buyer is optimizing for at the moment of purchase.

## Procedure

0. **Gather the facts first.** List any missing product facts (materials, specs, certifications). Ask for them, or state your assumption, before writing anything.
1. **Pick three claims.** Rank the benefits; keep the top three (three claims were 10.4% more persuasive than four; skepticism starts at the fourth. Source: Shu & Carlson, 2014). Move the rest to a spec table. Only the 10.4% figure comes from a study listed in reference.md. The "up to 40%" and "up to 30%" figures are practitioner tips with no study on file, and they are marked †. Treat every figure as a guide, not a promise, and never quote them as your own results.
2. **Best features only.** Don't pad with merely good features — the impression sinks to the weakest claim.
3. **Units people use.** Uses or pieces (30 washes, 8 cans), not standardized measures (750 g, 96 oz). Raises product evaluations and willingness to pay (Lembregts & Van den Bergh, 2019; Lembregts & Pandelaere, 2013).
4. **Smaller units for precision.** Drop to the next unit down: 180 seconds, not 3 minutes; 180 minutes, not 3 hours; 32 oz, not a quarter gallon. Reads more precise and credible; strongest for time (Zhang & Schwarz, 2011).
5. **Evocative color names.** "Midday sky blue", not "light blue" (Miller & Kahn, 2005).
6. **Feature branded components.** A branded ingredient or part (Gore-Tex, a licensed enzyme blend) goes up front; demand up to 40% higher. † Only name a component or make a claim such as "lab-tested" if you can document it. Remove any claim you cannot back up.
7. **Register by product type.** Utilitarian → science and effectiveness language works. Hedonic → avoid it ("lab-formulated" on a treat: up to 30% less likely to be chosen). †
8. **Plain language.** Unknown terms make the product seem worse and pricier; define or drop. †
9. **Describe touch** where feel matters (textiles, skincare) — the top online clothing pain point (see reference.md).
10. **Rational up, emotional down** in vertical layouts (Cian et al., 2015).
11. **Frame as an experience** (coffee with friends, not bean origin) when you want reviews. †

## Output

For food, supplements, cosmetics, baby products or anything with a health or safety claim, flag every such claim ("lab-tested", "clinically proven", "safe for children") for a person or legal reviewer to check before the copy is published.

1. Headline and body within the length limit.
2. Rules table:

| Rule | Where |
|---|---|
| Three claims | [CLAIM 1], [CLAIM 2], [CLAIM 3] |
| Intuitive units | "[N] [USES]" for "[WEIGHT OR VOLUME]" |
| Branded ingredient | [BRANDED COMPONENT, only if documented], first sentence |

3. What was cut and where it can go.

The percentage lifts marked † are guides, not expected results. Never quote them as the user's own numbers.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Check the landing page** with the [Product page auditor](https://useaiblocks.com/skills/product-page-auditor).
- **Write the ad copy** with the [Headline option writer](https://useaiblocks.com/skills/headline-option-writer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## What to do next

Check every claim against the live product facts and your documents. Run the copy through the Product page auditor, or A/B test the headline, before you publish.

## Common mistakes

- Working every supplied benefit in — six benefits read as a pitch; pick three.
- Leading with pack weight or volume — lead with uses.
- Keeping the supplier's color name.
- "Lab-tested" on a hedonic product.

## Quick reference

| Element | Rule |
|---|---|
| Claims | Exactly three, best only |
| Quantity | Uses/pieces, not grams/ounces |
| Precision | Smaller unit |
| Colors | Evocative names |
| Components | Name the brand |
| Register | Science only if utilitarian |
| Vocabulary | Plain |
| Texture | Describe if feel matters |
| Layout | Rational up, emotional down |

† No primary citation on file for this rule — a practitioner tip, not a measured finding.

Evidence and effect sizes: see [reference.md](reference.md).
