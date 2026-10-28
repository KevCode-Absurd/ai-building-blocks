---
name: gtm-0-to-1-launch
description: Launch new products from idea to first customers. Use when launching products, finding early adopters, building launch week playbooks, diagnosing why adoption stalls, or learning that press coverage does not equal growth. Includes the three-layer diagnosis and the 2-week experiment cycle.
license: MIT
metadata:
  author: Smit Patel (https://linkedin.com/in/smitkpatel)
  source: https://github.com/github/awesome-copilot/tree/main/skills/gtm-0-to-1-launch
---

# 0-to-1 Launch

Plan how a new product reaches its first customers. The goal is not headlines. It is finding the first 10 customers who can't live without you. Based on the gtm-0-to-1-launch skill by Smit Patel, shared in github/awesome-copilot (MIT).

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A plan** (yours): a dated plan: what to do, in what order, with a decision rule for each step.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a plan. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Any good chat AI:** It plans from your notes. No code or files are needed.
<!-- /needs -->

## When to use

- "How do we launch this product?"
- "How do we get our first 10 customers?"
- "We launched but nobody is using it."
- "Product Hunt or direct outreach?"
- "We have awareness but no sign-ups, or sign-ups but no use."

## When not to use

- Your product already has steady customers and you want to scale. Use the Self serve product growth planner.
- You want a market position, not a launch plan. Use the SaaS market position adviser or the Positioning statement writer.
- You sell to large companies through long deals. Use the Enterprise account deal planner.
- You want a launch checklist for a physical product or a store. Use the Thirty day launch planner.

## Inputs to gather first

Ask once, in one message, for what is missing. If the user can't answer, write `MISSING: <item>` and carry on. Never invent customers, numbers or competitors.

1. **Product** (required): what it does, in a sentence or two.
2. **Target buyer** (required): the role or kind of person who has the problem.
3. **Price or plan** (optional): what you will charge, or "not set".
4. **Existing users or waitlist** (optional): how many, and where they came from. Zero is a fine answer.
5. **Channels you can use** (optional): personal network, email, communities, LinkedIn, events.
6. **Competitors or tools people use today** (optional): names, if known.
7. **Team time** (optional): hours per week the team can give to the launch.

If the product is live, also ask what has happened so far: sign-ups, activations, replies. Use only the numbers the user gives.

## Steps

1. **Pick the situation.** Not launched yet, launched with no traction, or launched with sign-ups but weak use.
2. **If it has stalled, run the three-layer diagnosis** (framework 2) before proposing anything else.
3. **Build the buyer target list** (framework 3): who to contact first, and why them.
4. **Write the launch sequence** by week, using direct outreach before press (framework 1).
5. **Write two to four two-week experiments** (framework 4), each with success criteria and a kill rule.
6. **Add partner-led entry** (framework 5) only if the user has no distribution of their own.
7. **Set the signals to watch** (framework 6) and say what would mean "not yet".
8. **Check your work.** Every number comes from the user. Every example figure is labelled "illustrative". Unknowns are marked `MISSING`.

## Core frameworks

### 1. Press is not growth

The author reports a press-heavy feature launch that brought many impressions but few sign-ups, because the feature needed education and hand-holding that press can't give. We have not verified those figures, so treat the story as the author's account, not a benchmark. The lesson: early customers usually come from direct outreach, not press.

What to do instead: email a short list of target customers, say what you built and the problem it solves for teams like theirs, offer early access, and walk them through setup yourself. Press matters later, at a funding round or a major milestone.

### 2. The three-layer diagnosis (why launches stall)

Find which layer is broken before spending on a fix.

**Layer 1: Positioning.** Symptoms: your message sounds like your competitors'. Buyers see you as interchangeable. Sales calls drift into feature comparisons. Fix: claim a position rivals can't easily copy. Test new messaging in outreach before changing the product.

**Layer 2: Experience.** Symptoms: people sign up but never finish the first task. Too many entry points. Help pages describe features, not outcomes. Fix: pick two or three "undeniable use cases" that give value fast. Limit onboarding to those. Put advanced features behind a later step. Rewrite help around the job the user wants done.

**Layer 3: Alignment.** Symptoms: the team says it has no time for customers. Each function chases a different metric. Every idea has equal weight. Fix: set one shared north star and use it as a tiebreaker: "Does this help us win a customer?" Cut what doesn't. Show progress weekly.

```
Do prospects understand what you are?
  No  -> Layer 1: positioning. Test new messaging first.
  Yes -> Do users finish their first task after signing up?
           No  -> Layer 2: experience. Limit onboarding to 2-3 use cases.
           Yes -> Is the team aligned on what matters?
                    No  -> Layer 3: alignment. One north star, weekly review.
                    Yes -> Keep iterating.
```

### 3. The first 10 customers

The first 10 customers are for learning, not revenue. You learn: does the product solve the problem, how people reach value, what objections come up, who the real buyer is, and how long a sale takes.

Where to find them:
- **Your personal network (the first two or three).** Ask for feedback, then ask them to pay. Free users give different feedback from paying ones.
- **Direct outreach (next customers).** Build a list of about 100 target accounts. Personalise each message to their pain. Test two or three message angles and see which gets replies.
- **People who hit a limit.** The strongest prospects have already used a similar tool and outgrown it. Write outreach around that limit. The author says these convert better than cold outreach. We haven't verified a figure, so measure it yourself.
- **Communities** (for developer products). Say what you built and for whom, ask for early users, and offer hands-on onboarding.

### 4. The two-week experiment cycle

Speed beats polish at this stage.
- Write the success criteria before you start.
- Test one thing at a time: message, channel, price or feature.
- Run it for two weeks at most. If there is no signal by then, stop.
- If it works, put more time into it the following week. If not, drop it.
- Write down what you learned either way.

When an experiment works, turn it into a playbook before you scale it: goal, steps, expected result, metrics, risks. If a stranger could not run it, it is not written well enough.

### 5. Partner-led entry (when you have no distribution)

1. Name the market leaders in your segment.
2. Approach them with a problem their users have, not a partnership pitch.
3. Start with one narrow integration that solves one problem.
4. Run a pilot of a few months before asking for more.
5. Build reference customers together.
6. Once integrated, they can reach their own base.

Don't chase partners everywhere. Pick two or three categories at a time. Don't expect partners to promote you without support.

### 6. Signals that you have fit

Product-market fit means customers pull you forward. Look for:
- **Retention:** people come back in week 4 after joining in week 1, and usage grows.
- **Organic growth:** referrals, "can I add my team?", inbound interest without paid ads.
- **Sales:** shorter sales cycles, a rising share of trials that convert, customers who say "we need this now".
- **Words:** when asked, many users say they would be very disappointed if the product went away (a well-known survey test by Sean Ellis uses 40% as a rule of thumb). Customers can say what it is for, and speak about it publicly.

The thresholds people quote (such as 40% retention) are rules of thumb, not laws. Ask the user to set their own targets. If these signals are absent, don't scale spending yet.

## Output format

Return a plan in this layout. Keep each section short.

```markdown
# First-customer launch plan: <product>

**Where you are:** <not launched / launched with no traction / traction but weak use>
**Main bet:** <one sentence>

## Diagnosis (if launched)
| Layer | Evidence from you | Verdict (ok / broken / unknown) |
|---|---|---|
| Positioning | | |
| Experience | | |
| Alignment | | |

## Buyer targets
| Segment | Pain | Channel | Contacts to reach | Why first |
|---|---|---|---|---|

## Launch sequence
| Week | Action | Owner | Done when |
|---|---|---|---|

## Experiments (two weeks each)
| # | Test | One thing changed | Success criteria | Kill rule |
|---|---|---|---|---|

## Signals to watch
- <metric>, the user's target: <number or MISSING>

## Missing or unverified
- <each MISSING input, and each figure the user must supply>
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Software launch evidence reviewer](https://useaiblocks.com/skills/saas-launch-review-agent). It takes the plan.
- The [Self-service product growth planner](https://useaiblocks.com/skills/copilot-gtm-product-led-growth). It takes the plan.
- The [Repeat purchase habit planner](https://useaiblocks.com/skills/buying-habit-stack-designer). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Common mistakes

1. Aiming for headlines instead of use.
2. No target customer list before launch. Build the list first.
3. Too many options and no defaults. Pick two or three use cases and guide hard.
4. Giving the product away free to everyone. Free users give polite feedback.
5. Scaling before you learn.
6. Planning for weeks, testing for days.
7. Fixing the wrong layer.

## Related items

- Self serve product growth planner (scale after first traction)
- SaaS market position adviser (position before launch)
- Revenue partnership program planner (partner-led entry in depth)
