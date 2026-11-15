---
name: brand-opponent-statement
description: "Find the industry habit the store stands against, from counted customer complaints rather than founder guesses, and turn it into a one-line 'we oppose X because Y' statement the store can prove it lives up to. Mines the store's and rivals' 1 to 3 star reviews and forum threads, codes the complaints into old-way habits, keeps only habits the store demonstrably does differently, writes three candidate statements, and tests them as cheap ads judged on store orders before one is adopted. Use when the brand sounds like every rival, before a repositioning, or before writing a new round of ads. Read access; any test spend needs the owner's yes."
---

# Brand opponent statement

**You get:** a one-line 'we oppose X because Y' statement (or three candidates to test), backed by a habits table and counted customer quotes, with candidate cards and a test plan for the owner to approve.

A brand gets sharper when it names what it is against. The opponent is an industry habit or an old way of solving the problem, never a named company. It only works when buyers already resent that habit and the store can show it does otherwise. This skill finds that habit in what customers write, then tests it before the brand adopts it.

## When to use

- The brand's copy could belong to any rival in the category.
- Before a repositioning, a relaunch or a new hero product.
- Before a new round of ad concepts, to give them a shared point of view.
- Reviews keep mentioning the same frustration with "other brands".
- The team argues about positioning and needs evidence instead of taste.

## Not for

- Naming the brand or a product line: that is a naming project with trademark checks.
- Writing the ad concepts themselves: use `store-meta-concepts` after this.
- Checking whether claims are provable for a product: use `product-claims-profile`.
- A full rival ad study: use `cross-channel-competitor-map`.

## What you need

**Required**

- The store's own reviews (review app export: rating, title, body, date).
- Names or URLs of three to five rivals, or the store URL so you can find them. For each, their marketplace listing (Amazon or the local marketplace) or site reviews.
- The store's product row from `store-knowledge-folder` (`02-products.csv`): price paid and gross profit per purchase.
- The owner's view of the old way their product replaces, in one paragraph, saved as a hypothesis.

**Optional**

- Post-purchase survey answers, support tickets, return reasons.
- A Meta Ads Manager export (ad name, spend, purchases) if the store already runs ads, so tests can sit beside current winners.

**When something is missing.** Without rival reviews, use forum threads alone and mark the result "low confidence: no marketplace reviews". Without gross profit per purchase, write the statement but do not plan a paid test.

**Access.** Level 1, read, for research. Building test ads paused needs draft access; spending money on the test needs the owner's explicit yes and budget cap.

## Before you start: the gates

1. **Gross profit per purchase is known.** It sets the test's target cost per purchase. Fail: deliver statements and an organic test only.
2. **Cash for the test is stated.** The paid test in step 6 needs about three times the target cost per purchase per candidate, so three candidates need about nine times. Fail: run the organic path in step 6.
3. **The store can live up to it.** For each candidate, there must be an operational fact (policy, ingredient, process, price structure) that proves the store does differently. Fail for a candidate: drop it, however good it sounds.
4. **Tracking for the paid test.** Purchases in Ads Manager and Shopify orders for the last 30 days agree within about 20% (practitioner default, test it). Fail: judge the test on store orders with UTM-tagged links, not on Meta's count.

## Steps

### 1. Collect complaints, word for word

Spend about an hour on research, split between forums in the buyer's own problem words and marketplace reviews, pasting exact text [AVT-0011]; that split suits emotional or embarrassing problems, so shift time to reviews for practical goods. Sources:

- 1 to 3 star reviews of the top five to ten rival products on Amazon or the local marketplace. Look for phrases about money spent on fixes that did not work [AVT-0009].
- Forum threads found by searching "<problem> reddit" and similar, for fear and frustration words [AVT-0006].
- The store's own 4 and 5 star reviews that mention "other brands", "finally", "unlike".

Paste quotes verbatim with source, stars and date. Do not summarise yet [AVT-0007].

### 2. Code complaints into habits

Sort every quote through three lenses: what buyers resent about the category as a whole, where specific sellers let them down (recorded as the behaviour, never the seller's name), and the old way of solving the problem that the product replaces (the routine, tool or workaround buyers describe giving up). Then group the quotes by the industry habit behind them, not by product fault. A habit is something many sellers do on purpose: filler ingredients, sizing that runs small to look slim, subscriptions that are hard to cancel, vague sourcing, prices inflated for a permanent "sale", packaging waste, slow refunds. Count quotes per habit and note how many sources they span. Three-star reviews that disagree with each other (too basic, too complex) are not a habit to fight [AVT-0008].

Keep habits with at least ten quotes from at least two kinds of source (practitioner default, test it). Fewer means a hunch. If every habit is a hunch, do not stop: write one provisional statement, mark it provisional, and add one post-purchase survey question that would confirm or kill it (for example "What annoyed you most about the [category] you bought before?").

### 3. Keep only habits the store beats

For each habit, write the proof the store does otherwise: the policy text, the ingredient list, the process, the price history. If the product is functionally the same as rivals, a mechanism-based opponent will not be believed; pick a habit about service, honesty or a buyer group rivals ignore [AVT-0014]. Run each proof past `product-claims-profile` rules: an opponent line that implies a health effect needs the same evidence as a health claim.

### 4. Match the opponent to the market's stage

In a market that already knows the category and has tried existing options, attacking those options works; in a market that barely knows the problem, lead with the problem instead, and in a saturated one only a new mechanism or messenger cuts through [ADC-0001]. Note the stage for each candidate; a stage mismatch is a reason to drop it.

### 5. Write three candidate statements

Format: **We oppose [habit] because [pain buyers name, in their words]. Instead, [what the store does, with proof].** Then one plain sentence for the website and one hook line for ads.

Rules:
- Name the habit, never a company or a product. Comparative claims about a named rival need proof and invite legal risk (US false advertising law, the UK CAP Code and EU comparative advertising rules on disparagement).
- Use the customers' own words for the pain.
- Respect people who still buy the old way. Most future customers are using it today; a reader who bought the old way should feel understood, not foolish. Mock the habit, never the buyer.
- Choose the clearest statement the proof supports, not the angriest.
- A statement everyone on the team likes at once is usually too safe; one that splits the room has more energy [BRD-0016]. Keep at least one candidate that makes someone uncomfortable.
- Write each as a short story beat too: the frustration, then the fix. Misconceptions and frustrations make strong story ads when the brand can prove its side [ORG-0027].

### 6. Test before adopting

**Paid path (owner's yes required).** For each candidate, make one plain ad: the real product on a clean background with the hook line as a bold text bar, changing only the line between candidates [MCR-0075]. Or swap only the headline on an existing ad that already sends traffic to one product page [MCR-0080]. Run them side by side in one ad set. Judge each after it has spent about three times the target cost per purchase (the product's gross profit per purchase or lower): three or more store-side purchases keep, two wait, none or one cut [ADC-0039]. That rule suits accounts with modest purchase volume; for a high-priced product with few orders a day, use add-to-cart as an early read and extend the window.

**Organic path (no spend).** Post each candidate as a founder-voice short video or carousel on the store's main social account over two weeks. Compare saves, shares, comments and link clicks to the store's last 20 posts. This tells you what resonates, not what sells; label it so.

### 7. Adopt and write it down

Adopt the winner only if it beat the store's current best ad or post on the decision metric. Write the adopted statement into `store-knowledge-folder` (`03-voice-and-look.md`) with test dates and numbers, and add the result to the learnings log. Add the "never do" list: the habit itself, as an operating promise the team signs up to.

Turn the statement into a positive promise in one sentence (what buyers get, not only what the store refuses), and show what it changes: two rewrites of live copy (one product page line, one ad opener, before and after) and at least one product, policy or packaging decision the statement now forces (for example, refunds within two days, no permanent "sale" banner, sizing printed in centimetres). A statement that changes no decision is a slogan; send it back to step 3.

## Checks before you hand it over

1. Every candidate habit shows a quote count, source count and date range.
2. Every candidate names an operational proof the store holds, with a link or file.
3. No statement names a rival company or product.
4. No statement implies a health or results claim the product cannot support.
5. No statement mocks buyers of the old way; the adopted one has a positive promise, two copy rewrites and at least one decision it forces.
6. The test plan shows budget per candidate, the decision rule, and that spend waits for the owner's yes.
7. Test results are read from store orders when tracking failed gate 4.
8. The plain one-pass answer (a statement written from the brief alone) is shown, and the final beats it on proof and customer words.

## Output

1. **One-screen summary first:** the recommended statement (or "test first: three candidates"), the habit's quote count, the proof, and the test plan's total budget.
2. **Habits table:** habit, lens (category, seller behaviour, old way), quote count, source kinds, date range, store proof (yes or no, link), market stage fit, kept or dropped and why.
3. **Candidate cards (three):** statement, website sentence, ad hook line, two customer quotes, proof, "never do" promise.
4. **Test plan:** candidate, format, budget cap, target cost per purchase, decision rule, start and end date, owner approval line.
5. **Quotes file:** quote, habit, source, stars, date.
6. **After adoption:** the positive promise, two before-and-after copy rewrites, and the decisions the statement forces.

## Common mistakes

- **Starting from the founder's grudge.** Steps 1 and 2 start from counted customer complaints; the owner's view is one hypothesis.
- **Picking an enemy the store also commits.** Gate 3 drops any habit the store cannot prove it avoids.
- **Naming a rival.** Step 5 keeps the opponent a habit.
- **Adopting on team taste.** Step 6 tests on store orders or, at minimum, organic response.
- **Mechanism fights with a parity product.** Step 3 moves to service, honesty or an ignored buyer instead.
- **Judging a test on clicks.** The paid path judges on store-side purchases at three times target cost.
- **Sneering at buyers of the old way.** Step 5 mocks the habit, never the buyer.
- **A stance that changes nothing.** Step 7 names the decisions it forces.

## Sources

- [AVT-0011]: a timed hour split between forums and marketplace reviews.
- [AVT-0009]: buyers of failed fixes show the strongest pain.
- [AVT-0006]: forum threads for fears and buyer words.
- [AVT-0007]: paste quotes verbatim, by hand.
- [AVT-0008]: contradicting 3-star complaints are not a direction.
- [AVT-0014]: with a parity product, win on an unserved buyer, not a mechanism.
- [ADC-0001]: match the lead to the market's stage.
- [BRD-0016]: a choice that splits the team has energy.
- [ORG-0027]: frustrations and misconceptions make story ads.
- [MCR-0075]: smoke-test angles with one plain product image.
- [MCR-0080]: test angles by swapping only the headline.
- [ADC-0039]: judge a concept at three times target cost per purchase.

What makes this skill ours: the opponent comes from counted complaints across reviews and forums, not a workshop; a candidate is dropped unless the store holds operational proof it does otherwise; the test budget and keep-or-cut rule come from the product's gross profit per purchase and store-side orders; and the adopted line becomes a written operating promise, not just a slogan.
