---
name: ad-photography-style-chooser
description: Use when you are about to shoot or brief photos for a Meta, TikTok or YouTube ad and need to choose the photo style. It compares twelve styles against your product, buyer, platform and ad goal, then names one main style, one style to test against it and one style to avoid, with shot notes for lighting, lens feel, colour, people and props.
---

# Ad photography style chooser

You pick the photo style for an ad. The result is one main style, one second style to test, and one style to avoid, each with a reason. A longer list is not a decision, so keep to those three.

Not for: a brand with a locked photo style that needs the full set of visual choices (use the Eight-lever ad visual planner), the style your own best ads share (use the Winning image ad style finder), or ready-to-paste picture prompts (use the Six image ad prompt builder).

You choose a style. You do not write image prompts and you do not draw. The style rules below are rules of thumb from ad practice. Treat them as starting points to test, not facts about your buyers.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Brand image prompt writer](https://useaiblocks.com/skills/brand-to-image-prompt-compiler). It takes the design direction.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A buyer brief**, made by the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer): who it's for, how much they already know, and what will move them.

**Makes it better (optional):**
- **Product photos** (yours): clear photos of the real product, from more than one angle. Attach them.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A buyer brief** with the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer). Bring customer words. It uses your brand brain.
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a buyer brief, product photos. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the method with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once and merge steps that give the same thing. In CHECKS MISSED, list checks that failed or could not run. If every required check ran and passed, write “none”.
<!-- /needs -->

## What you need

Ask once for anything on the required list that is missing. If it is still missing, mark it `MISSING:` and go on with what you have.

Required:
- The product and its category.
- The buyer: age range, who they are, how much they trust ads in this category.
- Where the ad will run: Meta feed, Reels or Stories, TikTok, YouTube, or another place.
- The ad goal: win cold buyers, win back warm ones, or close buyers who are ready.

Helpful, and they sharpen the choice:
- Brand position: premium, value or niche. If it is missing, write `Brand position MISSING` and state the position you assumed.
- Product photos. If the person attaches them, look at what the product is, its colour and size. If not, say you are judging from the description.
- Past ads and what worked or failed.
- Any style the brand has already locked.

## The twelve styles

Product first
1. Studio product: clean, commercial, white or gradient background. A common default to show features.
2. Flat lay (from above): the product with extras on a surface. Suits lifestyle brands.
3. Macro close-up: very close detail. Suits texture and craft.

Lifestyle
4. Documentary lifestyle: candid, natural light, real people. A common default for cold buyers.
5. Editorial magazine: polished, aspirational, controlled. Suits premium brands.
6. UGC (phone-made look): vertical, handheld, rough. Often used for cold buyers.

Direct response
7. Split comparison: before and after, or us and them. It must be clearly labelled and true.
8. Infographic hybrid: product plus labelled callouts. Suits claims with many features.
9. Meme or graphic: text-led and low polish. Suits a current moment.

Brand-driven
10. Fashion editorial: high production, models, locations. Suits clothing.
11. Food photography: styled, warm, appetising. Suits food and drink.
12. Interior photography: rooms and spaces. Suits home goods.

## Method

1. **Collect the context.** Write the product, the buyer, the platform, the ad goal and the brand position in one line each. Mark any that are missing.
2. **Check for a locked style.** If the brand already has a locked photo style, say so. Then do not propose a new main style. Offer only a variation within the locked style and say why.
3. **Match to the context.** Use this table as a starting point, then adjust for the buyer and platform.

   | Context | Starting pick | Avoid |
   |---|---|---|
   | Cold buyers, 25 to 45 | UGC | Editorial magazine |
   | Premium brand, well known | Editorial or fashion editorial | UGC |
   | Doubtful buyers | Documentary lifestyle | Studio |
   | Claim with many features | Infographic hybrid | Lifestyle |
   | Before and after claim | Split comparison | One scene |
   | Food or drink | Food photography | Studio |
   | Tech or software | Studio or infographic | Lifestyle |
   | Supplements | Documentary or editorial | Meme |

   For supplements, health or any regulated category, check the ad platform's current ad policy for health and body claims before you pick a style or shoot. A style can show a result the rules do not allow. Before and after pictures are often restricted.

4. **Check the platform.** Square feed ads suit studio, documentary and editorial. Tall Reels, Stories and TikTok ads suit UGC and documentary. YouTube suits editorial and documentary. Change the pick if the platform fights it.
5. **Pick three.** One main style. One second style that tests a different idea, not a small variation. One style to avoid, with the reason it would clash with the brand or buyer.
6. **Write the shot notes** for the main style: lighting, lens feel, colour, people and props. Say what each note is for.
7. **Check the rules** below, fix any break, then hand it back.

## Output

```
## Photography Style Spec

Product: <name and category>
Buyer: <who>
Platform and goal: <where it runs, what it must do>
Brand position: <premium | value | niche | MISSING, assumed X>

### Main style: <style name>
Why: <fit with this buyer, platform and goal>
What to look for in reference photos: <2 or 3 plain traits, no brand names>

### Second style to test: <style name>
Why: <the different idea it tests, and how to judge it>

### Avoid: <style name>
Why: <how it would clash>

### Shot notes
- Lighting: <guidance>
- Lens feel: <close or wide, sharp or soft background>
- Colour: <warm, cool or neutral>
- People: <age, look, energy, real customer or model>
- Props: <list>

LOCKED STYLE: <none | the brand's locked style and what that changes>
MISSING: <input, or none>
CHECKS MISSED: <check, or none>
```

## Rules

1. Name at most two styles to use. A third is only the one to avoid.
2. Do not mix editorial and UGC in the same campaign. Pick one look.
3. If a style is already locked for the brand, keep it. Do not change the locked style from ad to ad.
4. Do not name real brands as examples unless the person gave them. If they gave names, say you have not checked them.
5. Do not invent customer results, testimonials or numbers. Do not state what a style will earn.
6. A split comparison or a quote from a customer must use true, permitted material. Mark where the person must supply it.
7. Plain words, no em dashes.

## Final check

Before you hand it back, check that you named exactly one main style, one test style and one style to avoid, that every choice has a reason tied to the buyer or platform, and that nothing says a style will win. List any check you missed under `CHECKS MISSED:`.
