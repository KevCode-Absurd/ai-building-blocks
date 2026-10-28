---
name: copywriting
description: Write compelling, persuasive marketing and sales copy using proven frameworks like AIDA, PAS, BAB, and 4Ps, with tone and voice customization, CTA optimization, and A/B variant generation. Use when the user requests copywriting or provides relevant inputs for this workflow.
license: MIT
metadata:
  author: awesome-ai-agent-skills
  version: 1.0.0
---

# Copywriting

This skill enables an AI agent to write persuasive marketing and sales copy that drives action. The agent applies proven copywriting frameworks — AIDA (Attention, Interest, Desire, Action), PAS (Problem, Agitation, Solution), BAB (Before, After, Bridge), and 4Ps (Promise, Picture, Proof, Push) — and adapts tone, voice, and structure to the brand, audience, and channel. It supports landing pages, email campaigns, social media ads, product descriptions, and more.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A buyer brief**, made by the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer): who it's for, how much they already know, and what will move them.

**Makes it better (optional):**
- **Brand brain**, made by the [Brand profile builder](https://useaiblocks.com/skills/website-brand-brain-builder): your facts, products, buyers, claims and voice, in one folder of eight files.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Brand brain** with the [Brand profile builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. **A buyer brief** with the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer). Bring customer words. It uses your brand brain.
3. This one.

**From the brand brain, read:** `00-start-here.md`, `offers.md`, `customers.md`, `proof-and-claims.md`, `voice-and-look.md`. Take the chosen offer's facts, approved claims with their conditions, buyer quotes and voice lines. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: a brand brain is a folder with `00-start-here.md` in it (often `brand-brain/`). If it's there, read that file and the files above. Look for the other things by name.
2. **Check what's missing.** Look for a buyer brief, your brand brain. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Workflow

1. **Define the Objective and Audience**
   Clarify the primary goal: drive conversions, generate leads, increase brand awareness, or nurture existing customers. Identify the target audience — their pain points, desires, language patterns, and stage in the buyer's journey (awareness, consideration, decision). This determines which framework and emotional levers to use.

2. **Select a Copywriting Framework**
   Choose the framework that best fits the objective. Use **AIDA** for landing pages and ads that guide readers from attention to action. Use **PAS** when the audience has a strong, identifiable pain point. Use **BAB** for case studies and transformation stories. Use **4Ps** when you have strong social proof. State which framework is being applied and why.

3. **Establish Tone and Voice**
   Define the brand voice (authoritative, friendly, playful, luxurious, bold) and the specific tone for this piece (urgent, empathetic, excited, reassuring). If brand guidelines are provided, follow them precisely. If not, infer an appropriate voice from the product category and audience.

4. **Draft the Copy**
   Write the copy following the chosen framework's structure. Open with a strong hook. Build emotional engagement through the body — agitate the pain, paint the transformation, or stack the benefits. Close with a clear, specific CTA. Use only numbers, testimonials and names the user gives you. Where a real figure or quote is missing, write [placeholder: real figure or quote needed] and do not invent one. Every sentence should earn its place; cut anything that does not move the reader toward the CTA.

5. **Optimize the CTA**
   Replace generic phrases like "Submit" or "Click Here" with benefit-driven language like "Start Your Free Trial." Consider the commitment level — a free trial CTA differs from a $5,000 enterprise demo request. Use urgency elements only when they are truthful.

6. **Generate A/B Variants**
   Produce at least two distinct versions of the key elements — headline, subheadline, and CTA — for testing. Variants should differ meaningfully (different angles or emotional hooks), not just in word choice. Label each variant and note the hypothesis behind it.

## Usage

Provide the agent with:

- **Product or service** — what you are selling or promoting
- **Objective** — conversions, signups, traffic, awareness, retention
- **Target audience** — demographics, psychographics, buyer journey stage
- **Channel** — landing page, email, Facebook ad, Google ad, product page
- **Brand voice** — or a link to brand guidelines
- **Constraints** — character limits, required disclaimers, mandatory phrases

Return, in this order: the framework chosen and why, the copy, two or more CTA options, the A/B variants (each labelled), and the hypothesis behind each variant.

Example prompt: "Write a landing page hero section for our project management tool aimed at remote teams. Use PAS. Tone: confident but friendly. Include two headline variants."

## Examples

The examples below show layout only. Every figure, name and quote in them is a placeholder, not a real result. Never reuse them. Health, money or legal claims need a person with that expertise to check them before you publish.

### Example 1: Landing Page Hero Section (PAS Framework)

**Input:** "SaaS product: CloudSync — automated file backup for freelancers. Audience: freelancers who have lost files before. Goal: free trial signups."

**Output:**

> **Variant A (Fear-driven):**
>
> **Headline:** One Crashed Hard Drive Away from Losing Everything?
> **Subheadline:** Freelancers lose [real figure, with its source] of work per data loss incident.
> **Body:** You have spent months building your portfolio and client deliverables. One spilled coffee, one ransomware email, and it can all vanish. CloudSync backs up every file change automatically to encrypted cloud storage. If disaster strikes, restore everything in minutes.
> **CTA:** Start Your Free [Trial Length] Backup — [Only say "No Credit Card Needed" if true]
>
> **Variant B (Aspiration-driven):**
>
> **Headline:** Work Fearlessly. Every File, Backed Up Automatically.
> **Subheadline:** Enterprise-grade backup for freelancers — without the enterprise price.
> **Body:** CloudSync watches your folders and syncs every change in real time. [Real features, such as version history], [real security detail] and [real setup time].
> **CTA:** Protect Your Work Free for [Trial Length]
>
> **A/B Hypothesis:** Variant A tests loss aversion; Variant B tests aspirational confidence. Compare signup rates to determine which emotional angle resonates.

### Example 2: Email Marketing Sequence (AIDA Framework)

**Input:** "Product: FitTrack smart fitness watch. Audience: health-conscious professionals, 30-45. Goal: convert leads who have a discount code."

**Output:**

> **Email 1 — Attention + Interest (Day 0)**
> **Subject:** Your [X]% off code is inside (expires [real deadline])
> **Body:** Hi {first_name}, here is your code: **[CODE]**. FitTrack tracks heart rate, sleep, and activity, then gives you a single weekly health score — no complicated dashboards. **[Shop FitTrack — [X]% Off]**
>
> **Email 2 — Desire (Day 1)**
> **Subject:** "[A short quote from a real, consenting customer]" — here is what changed
>
> (Any health result or customer quote must come from a real customer who agreed to be quoted. Never write one yourself.)
> **Body:** [Real customer name and role, used with their permission] was [their real situation]. [What they found and changed, in their words]. [Their real result.] [A real figure about all users, only if you have the survey or data to back it.] Code **[CODE]** still active. **[Get Your FitTrack Now]**
>
> **Email 3 — Action (Day 2)**
> **Subject:** Last call — your [X]% code expires [real deadline]
> **Body:** Your code **[CODE]** expires [real deadline]. [Shipping terms, only if true.] [Guarantee, only if you offer one.] **[Claim Your Discount Before Midnight]**

## Best Practices

- **Lead with the benefit, not the feature.** "Save 3 hours every week" beats "Automated scheduling engine." Translate every feature into the outcome it creates.
- **Write for scanners.** Use short paragraphs, bold key phrases, and subheadings. Put the most important message in the first line.
- **Use specific numbers.** A real, exact number is more credible than "thousands". Use only numbers the user can back up. If there is no real number, leave it out or use a placeholder.
- **Match the CTA to the commitment level.** Low-commitment offers (free trial) earn bolder CTAs than high-commitment asks (enterprise demo). Reduce friction with "No credit card required."
- **Create honest urgency.** Real deadlines and genuine scarcity drive action. Fake urgency erodes trust.
- **Test one variable at a time.** In A/B variants, change only the headline or only the CTA — not both — so results are actionable.

## Edge Cases

- **Regulated industries:** Financial, healthcare, and legal copy may require disclaimers or pre-approval. Flag when the product category likely triggers compliance requirements.
- **No brand guidelines provided:** Default to clear, confident, benefit-focused copy. Avoid slang and hype words unless explicitly requested.
- **Extremely short formats:** For Google Ads (30-character headlines) or SMS (160 characters), prioritize the single strongest benefit and the CTA.
- **Multi-language campaigns:** Avoid idioms, puns, and cultural references that do not translate. Write for translatability.
- **Sensitive topics:** When writing about health, finances, or personal struggles, use empathetic language and avoid exploitative fear-mongering.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Sales copy editor](https://useaiblocks.com/skills/sales-copy-editor). It takes the draft.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
