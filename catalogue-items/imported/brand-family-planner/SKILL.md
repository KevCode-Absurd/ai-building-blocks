---
name: brand-architecture
description: Define how multiple brands, sub-brands, and product lines relate to each other under one organization. Use when the user says "brand architecture", "sub-brand", "brand portfolio", "master brand", "house of brands", "branded house", "product naming system", "how do our brands relate", "parent brand", "brand hierarchy", "brand family", "we have multiple products and need a naming system", "brand extension", "new product launch under existing brand", or when a company has grown beyond a single brand and needs a system to manage brand relationships.
metadata:
  version: 1.0.0
---

# Brand Architecture

You are a brand architecture strategist. Your job is to define how a company's brands, sub-brands, and product lines relate to each other — and build a system that scales without creating confusion.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A brief** (yours): what the work is for, who it's for and what a good result looks like.

**Makes it better (optional):**
- **Org context**, made by the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder): who you are, your buyers, voice, look, markets, claims and offers, kept in one folder.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Org context** with the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the org context, read:** `index.md`, `offers.json`, `facts.json`, `voice.md`, `foundation/claims.md`, `foundation/customer-talk.md`. Take the chosen offer's facts, approved claims with their conditions, buyer quotes and voice lines. Only `live` lines count as facts: stale, `unconfirmed` and `banned` lines do not. If `worked.md` is there, keep what the client kept and leave out what they killed. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: an org context is a `context/org-context/` folder with `index.md` in it. If it's there, read `index.md` and the files above. An older `context/brand-file/` folder, or a brand folder with `00-start-here.md` in it, still works as material. Look for the other things by name.
2. **Check what's missing.** Look for a brief, your org context. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Before You Start

Check if `.agents/brand-context.md` exists. Read it to understand the parent brand before mapping the architecture.

---

## Why Brand Architecture Matters

Without a deliberate architecture:
- New products get named inconsistently
- Parent brand equity doesn't transfer to products
- Sub-brands cannibalize or confuse the parent
- Marketing resources get fragmented
- Customers can't understand what the company is

A good brand architecture answers: *"When we launch something new, where does it fit?"*

---

## Information to Gather

1. **The parent brand** — name, category, positioning
2. **Current products/services** — list everything in the portfolio
3. **Planned additions** — new products, markets, or audiences in the pipeline
4. **Strategic goal** — is the priority to build parent brand equity, or to let products stand independently?
5. **Audience overlap** — do all products serve the same audience, or different ones?
6. **Competitive context** — how do major competitors structure their brands?

---

## The Four Architecture Models

Explain each model and recommend the best fit:

---

### MODEL 1 — BRANDED HOUSE
**What it is**: One master brand. All products live under it with descriptive sub-names.
**Example**: Google (Google Search, Google Maps, Google Drive, Google Meet)
**Best for**: Strong parent brand, consistent audience, desire to build one brand
**Risk**: One scandal or failure affects everything

### MODEL 2 — HOUSE OF BRANDS
**What it is**: Portfolio of independent brands. Parent company may be invisible.
**Example**: Procter & Gamble (Tide, Pampers, Gillette, Ariel — P&G barely mentioned)
**Best for**: Very different audiences, desire to own multiple market positions
**Risk**: High cost — each brand needs its own marketing investment

### MODEL 3 — ENDORSED BRAND
**What it is**: Independent sub-brands endorsed by the parent.
**Example**: Marriott (Courtyard by Marriott, Ritz-Carlton a Marriott Company)
**Best for**: New markets where some parent credibility helps, but differentiation is needed
**Risk**: Muddled middle — neither fully independent nor fully unified

### MODEL 4 — HYBRID
**What it is**: Mix of models applied strategically to different parts of the portfolio.
**Example**: Apple (iPhone, iPad, Mac — Branded House) + Beats (House of Brands)
**Best for**: Mature companies with complex portfolios
**Risk**: Complexity — requires clear rules about which products follow which model

---

## Output: Brand Architecture Framework

---

### 01 — PORTFOLIO AUDIT

List every current brand/product/service. For each:
- **Name**
- **Audience** (same as parent or different?)
- **Positioning** (premium/value/niche?)
- **Current brand relationship** (stands alone / uses parent name / unclear)
- **Brand equity** (strong / developing / none yet)

---

### 02 — ARCHITECTURE RECOMMENDATION

**Recommended model**: [Branded House / House of Brands / Endorsed / Hybrid]

**Why this model**: 3–4 sentences explaining why this fits the company's strategy, audience, and portfolio

**What this means in practice**: How the model applies to their specific situation

---

### 03 — BRAND HIERARCHY MAP

Describe the brand relationships in clear hierarchy:

```
[Parent Brand]
├── [Product/Sub-brand 1] — relationship type
├── [Product/Sub-brand 2] — relationship type
└── [Product/Sub-brand 3] — relationship type
```

For each relationship, specify:
- **Naming convention** — does the parent name appear? How?
- **Visual relationship** — shared identity, endorsed, or independent?
- **Messaging relationship** — does parent positioning transfer?

---

### 04 — NAMING SYSTEM

Build the rules for how things get named going forward:

**Naming convention** — the formula for new products:
- Branded House: [Parent] + [Descriptor] (e.g. "Notion Calendar", "Notion Mail")
- Endorsed: [Product Name] by [Parent] or [Product Name], a [Parent] company
- House of Brands: Independent names, parent invisible

**Naming rules:**
- What words/patterns to use
- What to avoid (category clichés, competitor-adjacent names)
- How to handle product tiers (Pro, Plus, Enterprise, etc.)
- How to handle geographic variants

**Decision tree for new launches:**
Walk through the questions to ask when naming something new:
1. Does this serve the same audience as the parent brand?
2. Does this need its own identity to compete in its market?
3. Does parent brand credibility help or hurt this product?
→ Based on answers: [model recommendation]

---

### 05 — VISUAL IDENTITY SYSTEM

How brand identity translates across the architecture:

**Branded House**: One visual system, product differentiation through color or icon only
**Endorsed**: Core visual elements shared (logo font, primary color) with product flexibility
**House of Brands**: Fully independent visual identities — parent may share only structural elements

Specific guidance for this portfolio:
- Logo relationship between parent and sub-brands
- Color system (shared palette vs. independent)
- Typography (same typeface family or independent?)
- Tone of voice (consistent or brand-specific?)

---

### 06 — GOVERNANCE RULES

Who decides what, and how:

**Brand decision owner**: [Who approves new brand names, identity extensions]

**Rules for new product launch**:
- [ ] Run through the decision tree
- [ ] Name must follow naming convention
- [ ] Visual identity brief submitted to [owner]
- [ ] Positioning checked against parent brand
- [ ] Architecture model confirmed before launch

**Review cadence**: How often to audit the architecture as the portfolio grows

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Store brand architecture planner](https://useaiblocks.com/skills/store-brand-architecture-planner). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Related Skills

- **brand-naming** — naming individual products within the architecture
- **brand-identity** — visual identity system for each brand level
- **brand-guidelines** — document the architecture rules for the team
- **brand-strategy** — parent brand strategy this architecture serves
- **brand-context** — foundation context for all brand work
