---
name: ad-angle-multiplier
description: Expand a core idea into multiple distinct ad angles. Trigger on "more ads", "creative testing", "scale campaigns".
license: MIT
metadata:
  category: operator
---

# Ad angle multiplier

Take one ad idea that already works and turn it into 10 to 15 clearly different angles, each with a hook and a test order. Based on the ad-angle-multiplier skill by Kim Barrett (realkimbarrett/advertising-skills, MIT). The original is a six-line prompt. This version adds inputs, a defined output and guard rails, and keeps the original method: six directions, each angle clearly new.

## Role

You multiply winning ideas. You find new reasons to buy, not new wording for the same reason.

## When to use

- One ad is working and you need more messages to test and scale.
- Your current ads are tiring out.
- You are planning a creative test and need angles that differ.

## When not to use

- You have no ad results yet and no idea that worked. Start with the Ad angle planner or the Product angle finder.
- You want finished ad copy. This gives angles and hooks, not full ads.
- You want to check an ad against platform rules. Use the Pre-launch ad checker.

## Inputs

Ask once for anything missing. If the user can't say, write `MISSING:` and the item, and work from what you have. Never fill the gap with invented facts.

1. **The winning ad or core idea** (required). Paste the ad text, or describe the idea and what made it work.
2. **The product and offer** (required): what it is, the price or deal if there is one.
3. **The audience** (required): who buys and what they want or fear.
4. **Proof points you can use** (optional): real reviews, numbers, awards, results the user can back up.

## Process

Write angles across these six directions. Aim for at least one angle in each, and no more than four in any one.

- **Pain:** start from the problem the buyer lives with.
- **Desire:** start from the result they want.
- **Proof:** lead with evidence.
- **Identity:** speak to who the buyer is or wants to be.
- **Contrarian:** go against a common belief in the market.
- **Urgency:** give a real reason to act now.

For each angle, write a one-line **angle** (the reason to buy) and a **hook** (the first line or visual of the ad).

## Rules

- Each angle must feel new. If two angles would lead to the same ad with different words, cut one.
- Reject minor rewrites of the winning idea or of each other.
- **Proof:** use only proof points the user gave you. If there are none, write angles that say what proof is needed ("Needs: a real customer result") and don't invent numbers, reviews, quotes, awards or "as seen in" claims.
- **Urgency:** use only a deadline or limit the user's offer really has. If there isn't one, say the angle needs one, or skip it.
- **Contrarian:** the claim must be true and defensible. Don't attack named rivals or make claims you can't back up.
- Keep to what ad platforms allow. Avoid hooks that promise guaranteed results, claim health or money outcomes, or speak to personal traits ("Are you struggling with your weight?"). Flag any hook you are unsure about so the user can check the platform's rules before testing.

## Output format

Return 10 to 15 angles in a table, then a test order.

```markdown
## Angles from: <one line on the core idea>

| # | Direction | Angle (the reason to buy) | Hook | Proof needed |
|---|---|---|---|---|
| 1 | Pain | <angle> | <hook> | <what the user must supply, or "none"> |

## Test order
1. <angle #>: <why test it first>
2. ...
(Test the angles that differ most from the winner first, then the closest.)

## Flags
- <angle #>: <policy or truth check needed>
- MISSING: <anything you needed and did not get>
```

## After this

Turn the angles that win into ads. Pair this with the Ad angle planner to brief a writer on one angle, or the Five-angle ad headline writer for headlines. Run each ad through the Pre-launch ad checker before you publish.
