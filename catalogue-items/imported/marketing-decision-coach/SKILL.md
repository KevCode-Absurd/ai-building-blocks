---
name: marketing-mindset
description: "Use when a user asks how to win first customers, whether doing X will produce Y, how to write an ad or judge a marketing test — a marketer's decision framework, not a tactic library."
category: marketing
risk: safe
source: https://github.com/axelfreeman/marketing-mindset
source_repo: axelfreeman/marketing-mindset
source_type: community
date_added: 2026-09-21
author: axelfreeman
tags: [marketing, growth, positioning, cold-email, decision-making]
tools: [claude-code, cursor, codex-cli, gemini-cli]
license: MIT
license_source: https://github.com/axelfreeman/marketing-mindset/blob/master/LICENSE
---

# Marketing Mindset

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **Your offer** (yours): what you sell and the real terms: price, trial, guarantee, delivery.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, your offer. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Overview

Most agents answer a marketing question by reaching for a tactic: a hook template, a funnel diagram, a list of channels. That produces plausible text and no decision. This skill supplies the layer underneath — how an experienced marketer decides what to do, what volume a test needs before its result means anything, and when to kill a channel instead of optimizing it.

It is a pure reasoning skill. It reads the user's own context (product, offer, audience, budget, channel data) and returns a verdict with the reasoning attached, including the verdict "this is not worth doing". The full version lives at the source repository; this entry is adapted for this catalog.

## When to Use

- The user asks where their first customers will come from, or how to get client #1
- The user asks "should I do X to get Y" and wants an opinion rather than a yes
- The user wants an ad, landing page, or cold outreach sequence written for a real offer
- The user shares test results and asks whether they are good
- The user is choosing between channels, or deciding whether to kill one
- The user asks how to position or launch a B2B or SaaS product
- Do not use for generating a tactic inventory with no decision attached, and do not use it to produce fabricated proof, testimonials, or case studies

## How It Works

### Step 1: Establish the exchange

Marketing is an exchange. Every action must trade for something — money, clear prospects, a realistic chance of revenue, or something applicable immediately. If the exchange is zero, say so and name the missing half. This is the filter that kills most requests before any tactic is chosen.

### Step 2: Read the state of the business

Ask for the two numbers that decide everything else: how many paying clients exist today, and what channel produced them. With zero clients, the only honest advice is hand-won outreach plus the founder using their own product. Money is a scaling instrument, not a starting instrument — spend at zero clients buys noise.

### Step 3: Ground the hypothesis in live competitors

Benchmark against companies working the same audience right now and making money from it, not against well-known companies with no current motion. Recently founded, growing competitors produce the most copyable hypotheses because their moves are short and recent. Treat ranking lists, launch sites, and influencer endorsements as advertising, not as truth, and treat any report older than six months as history.

### Step 4: Size the test before judging it

Below a floor you are measuring randomness, not the market. State the floor before the test starts, and refuse to draw a conclusion below it.

| Channel | Minimum volume before a verdict |
|---|---|
| Cold email, deliverability smoke test | 50–100 sends |
| Cold email, reply-rate comparison | ~1,500–2,000 sends per variant |
| Subject-line test | 100–500 sends per version |
| Landing page smoke test | 100–200 targeted visitors |
| Paid ad | 1–3x target CPA over 48–72 hours |
| Strict A/B test | ~10,000 visitors and 300+ conversions per variation |

### Step 5: Apply a kill rule, not a feeling

Decide in advance what result means keep, what means re-hook, and what means stop — and hold the decision at the pre-declared volume. Killing a channel that cannot pay back within the stated budget is a result, not a failure, and it frees the capacity that a weak channel quietly consumes.

### Step 6: Write for attention, then for proof

Attention splits in two: a rational part that can be reached with numbers and a part that responds only to feeling. Both need to be addressed. In visuals, the eye sees sharply only in a small focal area, so a creative needs a background, a scene, one hero subject, and implied movement. In copy, the reader is thinking about themselves — content that lets them keep doing that outperforms content about the product.

### Step 7: Return a verdict

End with a decision: run it, change one variable and rerun at the stated volume, or stop and do something else. Attach the reasoning and the number that settles the question. When nothing has worked after the obvious options are exhausted, say that plainly rather than producing another reasonable variant — reasonable variants are the ones everyone already tried.

## Examples

The numbers in these three examples are made up to show the reasoning. They are not data. Use your own numbers.

### Example 1: "Our cold email gets 0.4% reply rate — how do we optimize it?"

The response does not start with subject lines. It asks how many emails were sent. At 300 sends, 0.4% is one reply; the correct answer is to keep sending to the pre-declared floor before changing anything. At 4,000 sends across two variants, the reply rate is a real signal, and the useful move is offer and targeting, not wording.

### Example 2: "We spent $2,000 on LinkedIn ads and got 3 signups. Should we increase the budget?"

The skill checks the spend against the target CPA and the pre-declared window. If $2,000 is below 1x target CPA and the campaign has run under 72 hours, the honest answer is that the data cannot support a decision yet. If spend has exceeded 3x target CPA with no conversion path, the answer is to stop and name what the campaign proved — that this channel, at this offer, does not pay back.

### Example 3: "Write me a landing page for my new API product."

The skill asks for the client count and the offer. With zero clients, it redirects to hand outreach first and treats the page as supporting evidence rather than the acquisition engine. With paying clients, it writes the page around the offer that is already converting, in the customer's own language pulled from their replies.

## Limitations

- This is a mindset and decision layer. It does not log into ad platforms, send email, or fetch analytics — it reasons over data the user provides.
- The volume floors are directional heuristics for early-stage B2B and SaaS work, not statistical guarantees, and they do not replace a properly powered experiment when the budget allows one.
- It does not produce fake social proof, invented case studies, or testimonials, and it will refuse requests framed that way.
- Channel economics differ by industry and average contract value; the kill rules depend on the target CPA and margin the user supplies.
- Scaling from 10 to 100+ clients is out of scope by design; this skill covers winning client #1 and the first ten.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [First customer launch planner](https://useaiblocks.com/skills/copilot-gtm-0-to-1-launch).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Source and License

Adapted from the [Marketing Mindset](https://github.com/axelfreeman/marketing-mindset) skill by Axel Freeman. The author's file header says MIT (licence file: https://github.com/axelfreeman/marketing-mindset/blob/master/LICENSE). The AI Blocks catalogue shares this copy under CC BY 4.0, as the LICENSE-CONTENT file in this item says. Credit goes to Axel Freeman and sickn33.
