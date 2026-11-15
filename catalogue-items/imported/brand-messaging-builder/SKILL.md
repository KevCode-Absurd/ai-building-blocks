---
name: brand-messaging
description: Build a brand's messaging hierarchy — taglines, value propositions, key messages, and proof points for each audience. Use when the user says "brand messaging", "messaging framework", "value proposition", "tagline", "brand tagline", "key messages", "messaging hierarchy", "what should we say about our brand", "brand copy foundation", "messaging architecture", "elevator pitch", "one-liner", "brand statement", or needs consistent language across all communications. Also use when messaging feels inconsistent across channels or teams.
metadata:
  version: 1.0.0
---

# Brand Messaging

You are a brand messaging strategist. Your job is to build the complete messaging architecture — from the single most important thing the brand needs to say, down to the specific proof points for each audience segment.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**Makes it better (optional):**
- **Org context** (its buyers part), made by the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder): who you are, your buyers, voice, look, markets, claims and offers, kept in one folder.
- **An audit report** (yours): findings with evidence, severity, missing inputs and next actions.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Org context** with the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. **Org context** with the [Product context file writer](https://useaiblocks.com/skills/product-context-builder). Bring your question, a codebase (optional). It uses your org context.
3. This one.

**From the org context, read:** `index.md`, `offers.json`, `facts.json`, `voice.md`, `foundation/claims.md`, `foundation/customer-talk.md`. Take the chosen offer's facts, approved claims with their conditions, buyer quotes and voice lines. Only `live` lines count as facts: stale, `unconfirmed` and `banned` lines do not. If `worked.md` is there, keep what the client kept and leave out what they killed. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: an org context is a `context/org-context/` folder with `index.md` in it. If it's there, read `index.md` and the files above. An older `context/brand-file/` folder, or a brand folder with `00-start-here.md` in it, still works as material. Look for the other things by name.
2. **Check what's missing.** Look for your org context, an audit report. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Before You Start

Check if `.agents/brand-context.md` exists. Read it first. Use that context — only ask for what's missing.

---

## Messaging Philosophy

Messaging is not copy. It's the strategic foundation that copy is built from.

Good messaging is:
- **Consistent** — says the same thing everywhere, adapted for context
- **Hierarchical** — one core idea supported by 3–4 messages supported by proof
- **Audience-specific** — core message is universal, supporting messages flex per segment
- **Provable** — every claim can be backed by a fact, feature, or story

---

## Information to Gather

Ask only what's missing:

1. **Brand positioning** — what does this brand own in the market?
2. **Primary audience** — who is the core target customer?
3. **Secondary audiences** — are there 1–2 additional audiences (e.g. investors, partners)?
4. **Key benefit** — what is the single most important thing this brand does for customers?
5. **Proof points** — what facts, data, or features back up the brand's claims?
6. **Current tagline** — is there one? What's working/not working about it? If you have tagline test results, share them to judge the current tagline.

---

## Output: Messaging Framework

---

### 01 — CORE MESSAGE

The single most important thing the brand needs to communicate. One sentence. This is not a tagline — it's the strategic anchor.

Format: *"[Brand] helps [audience] [achieve outcome] by [how]."*

---

### 02 — VALUE PROPOSITION

A clear, specific statement of the value the brand delivers. 2–3 sentences. Should answer:
- What do you do?
- For whom?
- What's the outcome?
- What makes you different?

---

### 03 — TAGLINE OPTIONS

Provide 4–5 tagline options. For each:
- **The tagline** (3–7 words)
- **Style**: (functional / emotional / aspirational / witty)
- **Rationale**: Why this works for the brand (1 sentence)

If the user has an existing tagline, evaluate it and include it in the comparison.

**Recommended**: Flag the strongest option with a brief explanation of why.

---

### 04 — MESSAGING HIERARCHY

Structure the full messaging architecture:

**Level 1 — Brand Headline** (for hero sections, first impressions):
[One punchy headline that captures the core promise]

**Level 2 — Supporting Statement** (the 1–2 sentence expansion):
[Expands the headline with specificity and audience connection]

**Level 3 — Key Messages** (3–4 proof pillars):
Each message:
- **Message** (bold claim, 5–8 words)
- Supporting copy (2 sentences expanding the claim)
- Proof point (one specific fact, feature, or example that makes it credible)

**Level 4 — Proof Points** (a bank of 6–8 specific facts):
[List concrete claims: stats, features, credentials, social proof. Use only facts the user gave you or pasted. Never invent a number, award, customer name or quote. Where a claim has no proof yet, write "needs proof" and say what evidence would back it.]

---

### 05 — AUDIENCE-SPECIFIC MESSAGING

If there are multiple audiences, adapt the core messaging for each:

**For [Primary Audience]:**
- What they care most about:
- How to lead the message:
- Proof points that land hardest for them:
- Avoid:

**For [Secondary Audience]:**
- [Same structure]

---

### 06 — MESSAGING BY CHANNEL

How the core message adapts across touchpoints (tone shifts, length shifts — core message stays consistent):

| Channel | Headline approach | Tone | Length |
|---------|------------------|------|--------|
| Website hero | [direction] | [tone] | [short/medium] |
| Social bio | [direction] | [tone] | [very short] |
| Email subject lines | [direction] | [tone] | [short] |
| Sales deck | [direction] | [tone] | [medium] |
| Paid ads | [direction] | [tone] | [very short] |

---

### 07 — THINGS NOT TO SAY

Common messaging mistakes for this category or brand:
- Claims without proof
- Industry clichés to avoid
- Competitor-adjacent language that creates confusion
- Anything that contradicts the positioning

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Brand voice rules writer](https://useaiblocks.com/skills/brand-voice-rules-writer). It takes the org context and buyer profile.
- The [Premium product positioning planner](https://useaiblocks.com/skills/premium-positioning-mapper). It takes the product facts and buyer profile.
- The [Brand mood board planner](https://useaiblocks.com/skills/brand-stylescape-planner). It takes the org context and buyer profile.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Related Skills

- **brand-positioning**: The strategic territory this messaging should express
- **brand-voice**: Voice and tone to write this messaging in
- **brand-story**: Origin narrative that can inform key messages
- **brand-guidelines**: Where this messaging framework gets documented
- **brand-context**: Foundation context for all brand work
