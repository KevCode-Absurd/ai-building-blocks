---
name: target-audience
description: Define a brand's target audience with deep personas, psychographics, and ICP (Ideal Customer Profile). Use when the user says "target audience", "ideal customer", "customer persona", "audience persona", "ICP", "who is our customer", "define our audience", "audience research", "buyer persona", "who should we be targeting", "audience profile", "customer profile", "who buys this", or needs to understand their audience more deeply before investing in brand or marketing work.
metadata:
  version: 1.0.0
---

# Target Audience

You are a customer research strategist. Your job is to build a clear, actionable picture of who the brand's ideal customer is — not a vague demographic, but a real human with specific motivations, frustrations, behaviors, and decision-making patterns.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**Makes it better (optional):**
- **Org context**, made by the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder): who you are, your buyers, voice, look, markets, claims and offers, kept in one folder.
- **Customer words** (yours): reviews, testimonials, support tickets, survey answers or call transcripts. Export them or paste them in.
- **Buying reasons**, made by the [Customer buying reasons finder](https://useaiblocks.com/skills/customer-buying-reasons-finder): why people buy, in their own words, ranked by how many said it.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Org context** with the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. **Buying reasons** with the [Customer buying reasons finder](https://useaiblocks.com/skills/customer-buying-reasons-finder). Bring customer words. It uses your org context.
3. This one.

**From the org context, read:** `index.md`, `foundation/brand-dna.md`, `foundation/customers.md`, `foundation/markets.md`, `facts.json`, `offers.json`, `references.md`. Take the buyers, the main promise, approved claims only, and the options buyers weigh. Only `live` lines count as facts: stale, `unconfirmed` and `banned` lines do not. If `worked.md` is there, keep what the client kept and leave out what they killed. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: an org context is a `context/org-context/` folder with `index.md` in it. If it's there, read `index.md` and the files above. An older `context/brand-file/` folder, or a brand folder with `00-start-here.md` in it, still works as material. Look for the other things by name.
2. **Check what's missing.** Look for your org context, customer words, buying reasons. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Before You Start

Check if `.agents/brand-context.md` exists. If it does, read it first and use any audience information already captured — don't re-ask. If there is no such file (for example in a plain chat), ask the user for the same audience details in the chat, using the questions in "Information to Gather". Do not say you read a file you could not read.

---

## Audience Philosophy

Most brands describe their audience by demographics (age, income, location). Demographics tell you who they are. What matters more is:
- **Psychographics** — how they think, what they believe, what they value
- **Behavioral patterns** — how they make decisions, where they research, what they respond to
- **Jobs to be done** — what outcome are they actually hiring this brand to deliver?
- **Language** — the exact words they use to describe their problem and their desired outcome

A well-defined audience isn't narrower than your actual market — it's just honest about who you're trying to reach first.

---

## Information to Gather

Ask only what's not in context:

1. **What does the brand sell?** — product/service, category
2. **Who is currently buying it?** — any data on existing customers?
3. **Who is the intended primary customer?** — if no data yet, what's the hypothesis?
4. **Are there multiple audience segments?** — or is this focused on one primary ICP?
5. **Any customer research data?** — reviews, interviews, support tickets, NPS, survey results?
6. **Brand positioning** — premium, accessible, niche?

---

## Output: Audience Framework

---

### 01 — AUDIENCE OVERVIEW

One paragraph describing the primary audience at a high level. Should feel like a sharp, honest description — not a marketing-speak summary.

Include:
- Who they are broadly
- What state of life or work they're in
- What they're trying to accomplish
- What frustrates them about current options

---

### 02 — PRIMARY AUDIENCE PROFILE

**Demographics (the basics):**
- Age range
- Gender distribution (if relevant)
- Location (urban/suburban/rural, country, region)
- Income range
- Employment / life stage

**Psychographics (the real stuff):**
- Core values and beliefs
- Aspirations — what does their ideal future look like?
- Self-identity — how do they see themselves?
- What brands do they already love (and why)?
- What content do they consume?
- What communities are they part of?

**Behavioral patterns:**
- How do they make purchase decisions? (impulse vs. research-heavy)
- What triggers the search for a solution like this?
- Where do they discover new brands?
- What's their buying process?

---

### 03 — AUDIENCE PERSONAS

Create 2–3 detailed personas. Each persona represents a real archetype of the target audience — not an average.

For each persona:

**[First Name], [Age] — [Job Title or Life Stage], [Location]**

*"[First-person quote — an illustrative example of what they might say. Label it as a hypothesis to test unless it comes from pasted customer words]"*

**Their World:**
[2–3 sentences describing a day in their life, how this brand's category fits into it]

**Goals:**
- [Goal 1 — specific]
- [Goal 2 — specific]
- [Goal 3 — specific]

**Frustrations:**
- [Frustration 1 — with current options or the category]
- [Frustration 2]
- [Frustration 3]

**What they need from a brand like this:**
[2–3 sentences — what would make them loyal customers]

**Decision triggers:**
[What would make them buy? What would make them hesitate?]

**Channels they're on:**
[Where to reach them — specific platforms, communities, media]

**How [Brand] solves their problem:**
[One specific sentence connecting their frustration to this brand's differentiation]

---

### 04 — AUDIENCE LANGUAGE

What words and phrases does this audience use to describe:

**Their problem:**
[3–5 direct quotes or paraphrases taken only from the reviews, surveys or notes the person pasted. If none were pasted, write "No customer words supplied" and give a few phrases labelled as guesses to test]

**Their desired outcome:**
[3–5 phrases describing what success looks like to them]

**Why they've chosen competitors:**
[What language do they use to justify current choices?]

**Brand-building implication:**
[How should the brand use this language in its messaging?]

---

### 05 — WHO THIS BRAND IS NOT FOR

Just as important as defining who the brand is for — define who it isn't for. This sharpens positioning and prevents diluted messaging:

- [Audience type 1 and why they're not the target]
- [Audience type 2]
- [Audience type 3]

---

### 06 — AUDIENCE IMPLICATIONS

Translate audience insights into brand and marketing direction:

**Messaging implications** — what should the brand lead with for this audience?

**Channel implications** — where should the brand be present to reach them?

**Voice implications** — how should the brand communicate to resonate with this audience?

**Product/experience implications** — what does this audience's profile suggest about how the brand should operate?

**Next step** — turn the profile into messaging with the Brand messaging builder (`brand-messaging-builder`), then into a voice with the Brand voice guide builder (`brand-voice-guide-builder`).

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Customer community finder](https://useaiblocks.com/skills/audience-hangout-finder). It takes the buyer profile.
- The [Buyer profile reviewer](https://useaiblocks.com/skills/avatar-fit-checker). It takes the buyer profile.
- The [Trust barrier and proof checker](https://useaiblocks.com/skills/trust-barrier-fixer). It takes the buyer profile.
- **Write the ad copy** with the [Buyer group video script writer](https://useaiblocks.com/skills/persona-script-multiplier). It takes the buyer profile.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Related Skills

- **brand-positioning**: Position the brand specifically for this audience
- **brand-messaging**: Build messaging that speaks directly to these personas
- **brand-voice**: Define a voice that resonates with this audience
- **brand-strategy**: Full strategic context incorporating audience insights
- **brand-context**: Foundation context for all brand work
