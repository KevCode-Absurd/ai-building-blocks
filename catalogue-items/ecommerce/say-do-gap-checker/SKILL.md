---
name: say-do-gap-checker
description: Use when you are about to make a decision from a survey, poll or interview answers. It separates what people said from what they did, flags answers that are polite or flattering, scores how far you can trust the set out of 100, and picks the cheapest behaviour test to run before you spend.
---

# Say-do gap checker

You check how much a set of survey answers can be trusted for a decision. People often say one thing and do another. You sort answers into what people said and what they did, weight what they did more, flag the answers that are likely polite or flattering, score the trust in the set, and name the cheapest test of real behaviour to run next.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Customer words** (yours): reviews, testimonials, support tickets, survey answers or call transcripts. Export them or paste them in.
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **Your results** (yours): an export from Meta Ads Manager, Google Ads or your store, for set dates.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for customer words, your question, your results. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the method with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once and merge steps that give the same thing. In CHECKS MISSED, list checks that failed or could not run. If every required check ran and passed, write “none”.

**Tools that do this best:**
- **Any good chat AI:** Sorts and flags the answers and works out the score with the sum shown.
- **Shopify:** Can host a pre-order page or a waiting list page without a full build. You need a paid Shopify plan.
- **Meta Ads Manager:** Lets you split-test two names or packs with the same budget and read the click-through.
<!-- /needs -->

## What you need
- **The answers and how they were collected** (required): the survey, poll or interview text, who was asked, how many, and the exact wording of the questions.
- **The decision you plan to make** (required): for example, launch this flavour, pick this name, change this price.
- **Behaviour data** (optional): clicks, add-to-carts, pre-orders, orders, repeat orders, time on page. Name the date range.

Does not fit: decisions you can test directly in a day. Just test them. A store under about 1,000 visits a month cannot run a click test well; use pre-orders to 20 real buyers or direct conversations instead. The studies behind this method are old lab studies from the 2000s. Their lesson, that what people say and what they do differ, is sound. Their exact percentages are not for planning.

## Steps
1. **Sort every answer into say or do.** Say is a stated opinion. Do is an action that cost the person money, time or a click. Give do answers about three times the weight of say answers when you judge the set. The three is a starting weight to adjust, not a measured figure.
2. **Flag answers where the person wants to look good.** Look for answers that make the person seem healthy, kind, green, smart or thrifty ("I only buy eco products", "I always hunt for a bargain"), and answers that please the asker. These are likely to be higher than what they do.
3. **Flag taste or preference answers given with the brand visible.** In the cola study in the book Buyology, more than half of the people preferred the challenger when they tasted without seeing the brand. When the brands were named, 75 percent said the leader. So run a blind version and a branded version as two separate tests, and do not mix the answers.
4. **Flag one-sip or one-glance tests of things used over time.** A sweet sip can beat a full can; a trial size can mislead. A quick poll of a first reaction does not tell you how people feel after a month.
5. **Keep the author's warning in mind.** He argues that much of what people choose happens without thinking. Treat the reasons customers give as stories, not causes. He also argues that most new product launches fail. Both are his claims from the 2000s and we could not verify them, so give no percentages and do not use them as a benchmark for your store. They are a reason to test behaviour before you spend.
6. **Never kill an idea on stated dislike alone** if early clicks or time on the page say otherwise. In the book's TV pilot study, viewers rated an unaired show as the one they were least likely to watch, yet their brain response ranked it above a known flop. A store cannot scan brains, so the useful version is: look at what people did in the first days.
7. **Pick the cheapest behaviour test.** Choose from:
   - A landing page with a pre-order button.
   - A split-test ad on two names or two packs.
   - A small run sold at a price.
   Set the pass line before the test, such as "click-through at least 1.5 times our own average". The 1.5 is an example. Set yours from your own numbers. If the store has no click-through baseline yet, run the test on a small budget for a few days first and use that result as the baseline, or use a count of real pre-orders as the pass line (for example, 20 from real buyers).
8. **Keep the test honest.** A pre-order must say it is a pre-order, show a real ship date and a refund route, and only take money for something you can deliver. If you are not ready to take money, use a "join the waiting list" button and say so. Do not show an ad for a product that does not exist as if it were in stock. Check ad platform rules.
9. **Score the set** with the rules below.
10. **State the decision to make now** and the result that would change it.

## Score it
The score measures how far these answers can be trusted for this decision. It does not say whether the idea is good.

Start at 100. Take off:
- 15 for leading questions (wording that suggests the right answer).
- 25 if the answers are all stated and there is no behaviour data.
- 15 for a preference test with the brand visible.
- 10 for a one-sip or one-glance test of something used over time.
- 20 for any group with fewer than about 30 answers.
- 15 if the sample includes people who are not buyers or do not match the buyer.
- 10 if more than a third of the answers were flagged as polite or flattering.

Stop at 0. Show the sum on the score line, name each item taken off, and say which did not apply. These amounts are a starting set to adjust, not measured figures. A score under 50 means: do not decide on these answers alone. Run the behaviour test first. A high score does not mean the idea will sell.

## What you hand back
Use these labels in this order:

```
DECISION: <what will be decided from these answers>
ANSWERS READ: <n> | asked: <who, how many> | wording seen: <yes/no>

SAY OR DO
Said (stated opinions): <n> | Did (actions): <n>
Weighted view: <what the "did" answers say vs what the "said" answers say>

LIKELY POLITE, FLATTERING OR UNTRUE
1. "<answer>" | why flagged: <wants to look good / pleases the asker / brand visible / one sip>

TRUST SCORE  <n>/100  (100 - <items> = <n>)
Did not apply: <items>

BEHAVIOUR TEST TO RUN FIRST
Test: <pre-order page | split-test ad | small run>
Setup: <what is shown, to whom, for how long>
Pass line (set now): <...>
Honesty note: <pre-order terms or waitlist wording>

DECISION NOW: <what to do today>
WHAT WOULD CHANGE IT: <result that would flip the call>
CHECKS MISSED: <none | list>
```

<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Customer switching barrier planner](https://useaiblocks.com/skills/switch-friction-remover). It takes the audit report.
- The [Customer needs profile builder](https://useaiblocks.com/skills/job-based-avatar-builder). It takes the audit report.
- The [Customer switching journey mapper](https://useaiblocks.com/skills/switch-story-mapper). It takes the audit report.
- The [Subscription signup page reviewer](https://useaiblocks.com/skills/subscription-page-take-rate-checker). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Checks
- Every flagged answer says why it was flagged.
- The sum on the score line adds up and names every item taken off.
- The test has a pass line written before it runs.
- The old study figures are not used as planning numbers.
- The pre-order or waitlist wording is honest about price, ship date and refunds.
- Nothing in the advice asks a customer to pay for a product you cannot deliver.

## If something is missing
- No question wording: `MISSING: the exact survey questions`. Mark the leading-question item as not checked, and say the score is a ceiling.
- No sample size: `MISSING: how many people answered`.
- No decision: `MISSING: the decision these answers feed`.
- No behaviour data: say so, take the 25 off, and start the behaviour test.

## Avoid
- Weighing a stated "I would buy this" the same as a pre-order.
- Running one test that mixes blind and branded answers.
- Quoting the cola or TV study figures as benchmarks.
- Killing an idea because people said they disliked it, when they clicked.
- A fake door that takes money for something that does not exist.
