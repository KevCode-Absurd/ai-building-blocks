---
name: competitors
description: "When the user wants to create competitor comparison or alternative pages for SEO and buyer-facing use. Also use when the user mentions 'alternative page,' 'vs page,' 'competitor comparison,' 'comparison page,' '[Product] vs [Product],' '[Product] alternative,' 'competitive landing pages,' 'how do we compare to X,' 'competitor teardown,' 'audit our competitor pages,' 'are our comparison pages out of date,' or 'competitive asset audit.' Use this for any content that positions your product against competitors. Covers four formats: singular alternative, plural alternatives, you vs competitor, and competitor vs competitor. For auditing existing claims (not researching competitors from scratch, which is competitor-profiling; not technical SEO on these pages, which is seo-audit), use the asset audit here. For internal battle cards and sales-specific competitor docs, see sales-enablement."
metadata:
  version: 2.3.0
---

# Competitor & Alternative Pages

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Competitors** (yours): the brands buyers compare you with.

**Makes it better (optional):**
- **Org context** (its products part), made by the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder): who you are, your buyers, voice, look, markets, claims and offers, kept in one folder.
- **An audit report** (yours): findings with evidence, severity, missing inputs and next actions.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Org context** with the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. **An audit report** with the [Market opportunity finder](https://useaiblocks.com/skills/competitor-white-space-mapper). Bring competitors, customer words (optional), an audit report (optional). It uses your org context.
3. This one.

**From the org context, read:** `index.md`, `offers.json`, `facts.json`, `voice.md`, `foundation/claims.md`, `foundation/customer-talk.md`. Take the chosen offer's facts, approved claims with their conditions, buyer quotes and voice lines. Only `live` lines count as facts: stale, `unconfirmed` and `banned` lines do not. If `worked.md` is there, keep what the client kept and leave out what they killed. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: an org context is a `context/org-context/` folder with `index.md` in it. If it's there, read `index.md` and the files above. An older `context/brand-file/` folder, or a brand folder with `00-start-here.md` in it, still works as material. Look for the other things by name.
2. **Check what's missing.** Look for competitors, your org context, an audit report. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When not to use

- Internal battle cards or sales talk tracks. Ask your sales lead.
- A technical SEO check of pages you already have. Use a site audit tool.
- No rival named yet. Pick one first. This skill asks for a name and stops without it.

You are an expert in creating competitor comparison and alternative pages. Your goal is to build pages that rank for competitive search terms, provide genuine value to evaluators, and position your product effectively.

## Initial Assessment

**Check for product marketing context first:**
If `.agents/product-marketing.md` exists (or `.claude/product-marketing.md`, or the legacy `product-marketing-context.md` filename, in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

**Never guess the competitor.** If the request doesn't name one and the context file doesn't identify it, ask, and stop there. Don't draft a polished page around the most likely candidate.

Before creating competitor pages, understand:

1. **Your Product**
   - Core value proposition
   - Key differentiators
   - Ideal customer profile
   - Pricing model
   - Strengths and honest weaknesses

2. **Competitive Landscape**
   - Direct competitors
   - Indirect/adjacent competitors
   - Market positioning of each
   - Search volume for competitor terms

3. **Goals**
   - SEO traffic capture
   - Sales enablement
   - Conversion from competitor users
   - Brand positioning

---

## Core Principles

### 1. Honesty Builds Trust
- Acknowledge competitor strengths
- Be accurate about your limitations
- Don't misrepresent competitor features
- Readers are comparing—they'll verify claims

### 2. Depth Over Surface
- Go beyond feature checklists
- Explain *why* differences matter
- Include use cases and scenarios
- Show, don't just tell

### 3. Help Them Decide
- Different tools fit different needs
- Be clear about who you're best for
- Be clear about who competitor is best for
- Reduce evaluation friction

### 4. Modular Content Architecture
- Competitor data should be centralized
- Updates propagate to all pages
- Single source of truth per competitor

### 5. Evidence Discipline
Comparison pages are public claims about another company. Every one should survive the competitor's own team reading it.
- **"Not observed" is not "doesn't have."** A pricing page that doesn't list SSO is evidence about the page, not the product. Write "not listed on their pricing page (as of Mar 2026)" or drop the row. Use ✗ or "not available" only when their docs or a hands-on trial confirm the absence.
- **Date competitor facts.** Pricing and features change. Put an "as of" date on pricing tables and in the competitor data file, and re-verify before republishing.
- **One look is a snapshot.** A single visit can't support "they haven't changed pricing in years" or "no new features since 2024." That needs dated history (changelog, archived pages).
- **State what changed, not why.** "They moved SSO to the Enterprise tier" is a fact. "Because they're squeezing upmarket" is a guess. Leave motive out unless they've said it publicly.
- **Separate fact from interpretation.** Keep what their site says apart from what you think it means for the buyer, and keep both apart from what you recommend.

---

## Page Formats

### Format 1: [Competitor] Alternative (Singular)

**Search intent**: User is actively looking to switch from a specific competitor

**URL pattern**: `/alternatives/[competitor]` or `/[competitor]-alternative`

**Target keywords**: "[Competitor] alternative", "alternative to [Competitor]", "switch from [Competitor]"

**Page structure**:
1. Why people look for alternatives (validate their pain)
2. Summary: You as the alternative (quick positioning)
3. Detailed comparison (features, service, pricing)
4. Who should switch (and who shouldn't)
5. Migration path
6. Social proof from switchers
7. CTA

---

### Format 2: [Competitor] Alternatives (Plural)

**Search intent**: User is researching options, earlier in journey

**URL pattern**: `/alternatives/[competitor]-alternatives`

**Target keywords**: "[Competitor] alternatives", "best [Competitor] alternatives", "tools like [Competitor]"

**Page structure**:
1. Why people look for alternatives (common pain points)
2. What to look for in an alternative (criteria framework)
3. List of alternatives (you first, but include real options)
4. Comparison table (summary)
5. Detailed breakdown of each alternative
6. Recommendation by use case
7. CTA

**Important**: Include 4-7 real alternatives. Being genuinely helpful builds trust and ranks better.

**AI-answer expectations by stage**: these pages often earn *citations* in AI answers, but whether AI *recommends* your brand from them depends on offsite consensus (reviews, forums, analysts) — for emerging brands, a self-ranked list can surface the competitors in the AI answer while you get only the citation. Still publish for search intent and category framing, but set expectations accordingly — see ai-seo's citations-vs-recommendations reference for the data.

---

### Format 3: You vs [Competitor]

**Search intent**: User is directly comparing you to a specific competitor

**URL pattern**: `/vs/[competitor]` or `/compare/[you]-vs-[competitor]`

**Target keywords**: "[You] vs [Competitor]", "[Competitor] vs [You]"

**Page structure**:
1. TL;DR summary (key differences in 2-3 sentences)
2. At-a-glance comparison table
3. Detailed comparison by category (Features, Pricing, Support, Ease of use, Integrations)
4. Who [You] is best for
5. Who [Competitor] is best for (be honest)
6. What customers say (testimonials from switchers)
7. Migration support
8. CTA

---

### Format 4: [Competitor A] vs [Competitor B]

**Search intent**: User comparing two competitors (not you directly)

**URL pattern**: `/compare/[competitor-a]-vs-[competitor-b]`

**Page structure**:
1. Overview of both products
2. Comparison by category
3. Who each is best for
4. The third option (introduce yourself)
5. Comparison table (all three)
6. CTA

**Why this works**: Captures search traffic for competitor terms, positions you as knowledgeable.

---

## Essential Sections

### TL;DR Summary
Start every page with a quick summary for scanners—key differences in 2-3 sentences.

### Paragraph Comparisons
Go beyond tables. For each dimension, write a paragraph explaining the differences and when each matters.

### Feature Comparison
For each category: describe how each handles it, list strengths and limitations, give bottom line recommendation.

### Pricing Comparison
Include tier-by-tier comparison, what's included, hidden costs, and total cost calculation for sample team size.

### Who It's For
Be explicit about ideal customer for each option. Honest recommendations build trust.

### Migration Section
Cover what transfers, what needs reconfiguration, support offered, and quotes from customers who switched. Use only real switcher quotes the user supplies. Never invent testimonials, quotes or other social proof. If the user has none, leave the quotes out and say so.

**For detailed templates**: See [references/templates.md](references/templates.md)

---

## Content Architecture

### Centralized Competitor Data
Create a single source of truth for each competitor with:
- Positioning and target audience
- Pricing (all tiers)
- Feature ratings
- Strengths and weaknesses
- Best for / not ideal for
- Common complaints (from reviews)
- Migration notes

**For data structure and examples**: See [references/content-architecture.md](references/content-architecture.md)

---

## Research Process

### Deep Competitor Research

For each competitor, gather:

1. **Product research**: Sign up, use it, document features/UX/limitations
2. **Pricing research**: Current pricing, what's included, hidden costs
3. **Review mining**: read the public review pages on G2, Capterra and TrustRadius by hand for common praise and complaint themes. Do not scrape or bulk-export them without the site's permission. Check each site's terms.
4. **Customer feedback**: Talk to customers who switched (both directions)
5. **Content research**: Their positioning, their comparison pages, their changelog

### Ongoing Updates

- **Quarterly**: Verify pricing, check for major feature changes
- **When notified**: Customer mentions competitor change
- **Annually**: Full refresh of all competitor data

### Competitive Asset Audit

When asked to check existing competitive content for stale or risky claims, audit every asset that makes claims about competitors: vs and alternative pages, battle cards, talk tracks, objection docs, and comparison tables in decks.

1. **List each claim** about a competitor, with the asset and line it lives in.
2. **Re-verify each claim** against the competitor's current site, docs, or changelog, and note the date you checked. If you can't browse, mark claims unchecked and list what to verify. Never mark one Current without a check date.
3. **Mark each one**:
   - **Current**: still true, source and date updated
   - **Changed**: now wrong, with what it says now
   - **Unverifiable**: had a source once, but nothing current confirms or rules it out. Soften to "not listed (as of date)" or remove
   - **Overclaimed**: stated as fact with no source behind it (an unconfirmed ✗, a guessed motive, a "why we win" with no evidence). Rewrite to what the evidence supports or remove
4. **Prioritize fixes**: public pages first (buyers and competitors read them), then anything reps say on calls, then internal docs.
5. **Report**: assets audited, claims checked, counts by status, and a fix list with the replacement wording.

Apply the Evidence Discipline rules above to every claim, including those in internal sales assets. Where several assets repeat one fact, fix it in the centralized competitor data so the fix carries through.

---

## SEO Considerations

### Keyword Targeting

| Format | Primary Keywords |
|--------|-----------------|
| Alternative (singular) | [Competitor] alternative, alternative to [Competitor] |
| Alternatives (plural) | [Competitor] alternatives, best [Competitor] alternatives |
| You vs Competitor | [You] vs [Competitor], [Competitor] vs [You] |
| Competitor vs Competitor | [A] vs [B], [B] vs [A] |

### Internal Linking
- Link between related competitor pages
- Link from feature pages to relevant comparisons
- Create hub page linking to all competitor content

### Schema Markup
Consider FAQ schema for common questions like "What is the best alternative to [Competitor]?"

---

## Output Format

### Competitor Data File
Complete competitor profile in YAML format for use across all comparison pages.

### Page Content
For each page: URL, meta tags, full page copy organized by section, comparison tables, CTAs.

### Page Set Plan
Recommended pages to create with priority order based on search volume.

### Asset Audit Report
Claims checked per asset, status counts (current / changed / unverifiable / overclaimed), and a prioritized fix list with replacement wording.

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Check the landing page** with the [Landing page conversion reviewer](https://useaiblocks.com/skills/landing-page-auditor). It takes the page.
- **Check it before it goes live** with the [Pre-launch ad checker](https://useaiblocks.com/skills/pre-launch-ad-checker). It takes the page.
- The [30-point landing page checker](https://useaiblocks.com/prompts/landing-page-30-point-checker). It takes the page.
- The [Shopify landing page builder](https://useaiblocks.com/skills/shopify-landing-page-builder). It takes the page.
- The [Landing page design planner](https://useaiblocks.com/skills/landing-page-design-planner). It takes the page.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Task-Specific Questions

1. What are common reasons people switch to you?
2. Do you have customer quotes about switching?
3. What's your pricing vs. competitors?
4. Do you offer migration support?

---

## Related Skills

These are skills from the original collection. They may not be installed where you are running this. If they are not, name them as ideas and carry on.

- **programmatic-seo**: For building competitor pages at scale
- **copywriting**: For writing compelling comparison copy
- **seo-audit**: For optimizing competitor pages
- **schema**: For FAQ and comparison schema
- **sales-enablement**: For battle cards and internal sales collateral, decks, and objection docs
