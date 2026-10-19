# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 5 met. Invented facts: 0.

This is a strong, on-brand kids story: the fall and rise work, the pack is torn across the top as the brand requires, the price and customer line are accurate, and every invented scene detail is disclosed under Assumed. The only slip is a verbless fragment in the deals paragraph, which the judge list forbids, so it needs one small edit before use.

## Fix

In step 7 (Read for false notes) add: "Read each sentence alone; if it has no verb, join it to its neighbour. Short sentences are allowed only when they are whole."

## Judge list

- Met: The product doesn't appear before the turn, or before the reader knows the problem.
  Turn: "They were refusing the fight they could see coming." Then "A friend mentioned Sprout Kids" at word ~212 of 337 (63%).
- Met: Each drop has a different cost, and every paragraph adds an event, a cost or a detail.
  Smoothies cost food and "twenty minutes of every morning"; options cost "a week of hope" and money; deals cost the partner's patience.
- Met: There's no figure, quote, study or deadline you didn't supply. Any quote in quotation marks is word for word.
  Only supplied facts used: "$24.99", "free from synthetic dyes", "They think it's a treat." No quotation marks used; scene details disclosed under Assumed.
- Met: The reader is never blamed. The fixes fail, not the person.
  "Each one bought you about a week of hope, and then it went behind the cereal"; the fixes fail, the parent is never faulted.
- Not met: It reads aloud without fragments or rows of one-line paragraphs.
  "Three bites for dessert, two for screen time." is a verbless fragment; the final paragraph is also a single sentence.

## What went in

```text
Buyer: busy parents with picky eaters. They feel the problem but
don't know a kids' greens gummy exists. Want: no fight at the table.
Tried (from a review): "all of the 'green' options for the kids".
Doubts: "Is this just candy?" / "Is the sugar okay for kids?"
Real cause: none on file
Product facts: Sprout Kids, 1 pack a day, 6 strawberry gummies,
yellow pack, ages 2 to 13. Free from synthetic dyes. The pack is
torn open across the top.
Customer quote (word for word): "They think it's a treat."
Offer: first Kids box from $24.99
Length: 300 to 350 words
```

## What came out

```text
It's 6:40 on a Tuesday and you're scraping a forkful of broccoli into the bin. Nobody touched it, and you knew nobody would, so you're not sure why you still cook it.

You started with smoothies, blending a handful of spinach into banana and hoping the color wouldn't give it away. It did, and by Friday the rest of the bag had gone slimy in the fridge, along with twenty minutes of every morning.

So you tried all of the green options for the kids, the powders and chewables and little bottles with cartoon leaves on them. Each one bought you about a week of hope, and then it went behind the cereal with the others, and the money quietly added up.

Then came the deals. Three bites for dessert, two for screen time. It worked for a while, but dinner turned into a negotiation, and your partner started finding reasons to clear plates early.

The low point was small. Your youngest pushed the plate away before it reached the table, just from the green on it, and you heard yourself say fine and reach for the pasta.

And that's when you saw it. They weren't refusing the food. They were refusing the fight they could see coming.

A friend mentioned Sprout Kids at school pickup, a yellow pack of strawberry gummies. You wondered if it was just candy, and whether the sugar was okay for kids, so you read the label twice and noticed it's free from synthetic dyes. You bought one anyway, half expecting another tub for the cupboard.

The next morning you tore the pack open across the top, tipped the gummies into a small sticky hand, and waited for the argument. It didn't come. They think it's a treat.

It's 6:40 on a Tuesday now, and there's still broccoli on the plate, and some nights it still comes back. But nobody's bargaining, and you're sitting down.

If that Tuesday sounds familiar, the first Kids box is from $24.99, and I'd just try one.

MISSING: real cause

- `Shape:` drops: smoothies with hidden spinach (wasted food, morning time), all of the green options (money, hope), dessert and screen-time deals (partner's patience). Low point: the youngest pushing the plate away on sight and you reaching for the pasta. Product first appears at about 63% of words.
- `Cause used:` none, stayed with what the person notices
- `Assumed:` The scene details are invented as typical of the buyer: the 6:40 Tuesday, broccoli, smoothies, deals, the partner, the youngest child and the friend at pickup. The sugar doubt is raised but not answered, because there is no sugar figure on file. "Free from synthetic dyes" is the only product fact used in the rise. The customer quote and the review phrase appear word for word without quotation marks, so they read as narration.
```
