---
name: competitive-brief
description: Research competitors and generate a positioning and messaging comparison with content gaps, opportunities, and threats. Use when building sales battlecards, when finding positioning gaps and messaging angles competitors haven't claimed, or when a competitor makes a move and you need to assess the impact.
argument-hint: "<competitor or market segment>"
---

# Competitive Brief

> This skill works with web search alone. Paid tools (social listening, SEO tools, analyst reports, alert services) are optional extras, and your AI can only use them if you connect them or paste their results.

Research competitors and generate a structured competitive analysis comparing positioning, messaging, content strategy, and market presence.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**Makes it better (optional):**
- **Competitors** (yours): the brands buyers compare you with.
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Competitors** with the [Competitor ad format analyst](https://useaiblocks.com/skills/ad-library-teardown-counter). Bring reference ads, a spreadsheet (optional).
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for competitors, your question. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Trigger

User asks for a competitive analysis, competitor research, or market comparison. In Claude Code this can also be started with `/competitive-brief`; in ChatGPT, Gemini or a plain chat, just ask in words.

## When not to use

For one quick fact about a rival, such as a price, search their site directly. For private data such as rival traffic or revenue, use a paid research tool: this reads public pages only. For a one-page sales sheet, run this brief first and then ask for a battlecard.

## Inputs

Gather the following from the user:

1. **Competitor name(s)** — one or more competitors to analyze (required)

2. **Your company/product context** (optional but recommended):
   - What you sell and to whom
   - Your positioning or value proposition
   - Key differentiators you want to highlight

3. **Focus areas** (optional — if not specified, cover all):
   - Messaging and positioning
   - Product and feature comparison
   - Content and thought leadership strategy
   - Recent announcements and news
   - Pricing and packaging (if publicly available)
   - Market presence and audience

## Research Process

For each competitor, research using web search. Read public pages only, and read them one at a time. Check each site's terms and robots rules before you collect anything. Do not log in, do not bypass a paywall, do not bulk-collect pages or reviews, and do not create accounts or start free trials for a rival. Quote a rival's words only from pages you opened, with the link.

1. **Company website** — homepage messaging, product pages, about page, pricing page
2. **Recent news** — press releases, funding announcements, product launches, partnerships (last 6 months)
3. **Content strategy** — blog topics, resource types, social media presence, webinars, podcasts
4. **Review sites and comparisons** — third-party comparisons, analyst mentions, customer review themes
5. **Job postings** — hiring signals that indicate strategic direction (optional)

### Research Sources

Gather intelligence from these categories of sources:

#### Primary Sources (Direct from Competitor)
- **Website**: homepage, product pages, pricing, about page, careers
- **Blog and resource center**: content themes, publishing frequency, depth
- **Social media profiles**: messaging, engagement, content strategy
- **Public product demos and tours**: UX, features, onboarding experience. Use only demo videos and tours that need no sign-up; never create an account or start a free trial for a rival
- **Webinars and events**: topics, speakers, audience engagement
- **Press releases and newsroom**: announcements, partnerships, milestones
- **Job postings**: hiring signals that reveal strategic priorities (e.g., hiring for a new product line or market)

#### Secondary Sources (Third-Party)
- **Review sites**: G2, Capterra, TrustRadius, Product Hunt — customer sentiment themes
- **Analyst reports**: Gartner, Forrester, IDC — market positioning and category placement
- **News coverage**: TechCrunch, industry publications — funding, partnerships, narrative
- **Social listening**: mentions, sentiment, share of voice across social platforms
- **SEO tools**: keyword rankings, organic traffic estimates, content gaps
- **Financial filings**: revenue, growth rate, investment areas (for public companies)
- **Community forums**: community forums (e.g. Reddit, Discourse), industry chat groups (e.g. Slack communities) — user sentiment. Use only public posts or groups the user already belongs to; never create an account to join one

### Research Cadence
- **Deep competitive analysis**: quarterly (full research across all sources)
- **Competitive monitoring**: monthly (scan for new announcements, content, messaging changes)
- **Real-time alerts**: ongoing (set up alerts for competitor brand mentions, press, job postings)

## Competitive Brief Structure

### 1. Executive Summary
- 2-3 sentence overview of the competitive landscape
- Key takeaway: your biggest opportunity and biggest threat

### 2. Competitor Profiles

For each competitor:

#### Company Overview
- What they do (one-sentence positioning)
- Target audience
- Company size/stage indicators (funding, employee count if available)
- Key recent developments

#### Messaging Analysis
- Primary tagline or headline
- Core value proposition
- Key messaging themes (3-5)
- Tone and voice characterization
- How they describe the problem they solve

#### Product/Solution Positioning
- How they categorize their product
- Key features they emphasize
- Claimed differentiators
- Pricing approach (if publicly available)

#### Content Strategy
- Blog frequency and topics
- Content types produced (ebooks, webinars, case studies, tools)
- Social media presence and engagement approach
- Thought leadership themes
- SEO strategy observations (what terms they appear to target)

#### Strengths
- What they do well
- Where their messaging resonates
- Competitive advantages

#### Weaknesses
- Gaps in their messaging or positioning
- Areas where they are vulnerable
- Customer complaints or criticism themes (from reviews)

### 3. Messaging Comparison Matrix

| Dimension | Your Company | Competitor A | Competitor B |
|-----------|-------------|--------------|--------------|
| Primary tagline | ... | ... | ... |
| Target buyer | ... | ... | ... |
| Key differentiator | ... | ... | ... |
| Tone/voice | ... | ... | ... |
| Core value prop | ... | ... | ... |

(Include user's company only if they provided their positioning context)

### 4. Content Gap Analysis
- Topics your competitors cover that you do not (or vice versa)
- Content formats they use that you could adopt
- Keywords or themes they own vs. opportunities they have missed

### 5. Opportunities
- Positioning gaps you can exploit
- Messaging angles your competitors have not claimed
- Audience segments they are underserving
- Content or channel opportunities

### 6. Threats
- Areas where competitors are strong and you are vulnerable
- Trends that favor their positioning
- Recent moves that could shift the market

### 7. Recommended Actions
- 3-5 specific, actionable recommendations based on the analysis
- Quick wins (things you can act on this week)
- Strategic moves (longer-term positioning or content investments)

## Analysis Frameworks

### Messaging Comparison Frameworks

#### Value Proposition Comparison

For each competitor, document:
- **Promise**: what they promise the customer will achieve
- **Evidence**: how they prove the promise (data, testimonials, demos)
- **Mechanism**: how their product delivers on the promise (the "how it works")
- **Uniqueness**: what they claim only they can do

#### Narrative Analysis

Identify each competitor's story arc:
- **Villain**: what problem or enemy they position against (status quo, legacy tools, complexity)
- **Hero**: who is the hero in their story (the customer? the product? the team?)
- **Transformation**: what before/after do they promise?
- **Stakes**: what happens if you do not act?

This reveals positioning strategy and emotional appeals.

#### Messaging Strengths and Vulnerabilities

For each competitor's messaging, assess:
- **Clarity**: can a first-time visitor understand what they do in 5 seconds?
- **Differentiation**: is their positioning distinct or generic?
- **Proof**: do they back up claims with evidence?
- **Consistency**: is messaging consistent across channels?
- **Resonance**: does their messaging address real customer pain points?

### Content Gap Analysis Methodology

#### Content Audit Comparison

Map content across competitors by:

| Topic/Theme | Your Content | Competitor A | Competitor B | Gap? |
|-------------|-------------|--------------|--------------|------|
| [Topic 1] | Blog post, ebook | Blog series, webinar | Nothing | Opportunity for B |
| [Topic 2] | Nothing | Whitepaper | Blog post, video | Gap for you |
| [Topic 3] | Case study | Nothing | Case study | Parity |

#### Content Type Coverage

| Content Format | You | Comp A | Comp B | Comp C |
|----------------|-----|--------|--------|--------|
| Blog posts | Y | Y | Y | Y |
| Case studies | Y | Y | N | Y |
| Ebooks/Whitepapers | N | Y | Y | N |
| Webinars | Y | Y | Y | N |
| Podcast | N | N | Y | N |
| Video content | N | Y | Y | Y |
| Interactive tools | N | N | N | Y |
| Templates/Resources | Y | N | Y | N |

#### Identifying Content Opportunities
1. **Topics they cover that you do not**: potential gaps in your content strategy
2. **Topics you cover that they do not**: potential differentiators to amplify
3. **Formats they use that you do not**: format gaps that could reach new audiences
4. **Audience segments they address that you do not**: underserved audiences
5. **Search terms they rank for that you do not**: SEO content gaps

#### Content Quality Assessment
- Depth: surface-level or comprehensive?
- Freshness: regularly updated or stale?
- Engagement: do posts get comments, shares, links?
- Production value: text-only or multimedia?
- Thought leadership: original insights or rehashed content?

### Positioning Strategy

#### Positioning Statement Framework

For your company and each competitor, define (or reverse-engineer) their positioning statement:

> For [target audience], [product/company] is the [category] that [key benefit/differentiator] because [reason to believe].

Example:
> For mid-market SaaS marketing teams, Acme is the campaign management platform that unifies planning and execution in one workspace because it is built on a single data model that eliminates tool fragmentation.

#### Positioning Map

Plot competitors on a 2x2 matrix using the two most important dimensions for your market:

Common axis pairs:
- **Price vs. Capability** (low cost / basic vs. premium / full-featured)
- **Ease of Use vs. Power** (simple / limited vs. complex / flexible)
- **SMB Focus vs. Enterprise Focus** (self-serve / individual vs. sales-led / team)
- **Point Solution vs. Platform** (does one thing well vs. does many things)
- **Innovative vs. Established** (new approach vs. proven track record)

Identify which quadrant is underserved or where your differentiation is strongest.

#### Category Strategy
- **Create a new category**: if you do something genuinely different, define and own the category (high risk, high reward)
- **Reframe the existing category**: change how buyers evaluate the category to favor your strengths
- **Win the existing category**: compete directly on recognized criteria and out-execute
- **Niche within the category**: own a specific segment, use case, or audience

#### Positioning Pitfalls to Avoid
- Positioning against a competitor rather than for a customer need
- Claiming too many differentiators (pick 1-2 that matter most)
- Using category jargon the customer does not use
- Positioning on features rather than outcomes
- Changing positioning too frequently (confuses the market)

### Battlecard Creation

A competitive battlecard is a one-page reference for sales and marketing teams. Include:

#### Header
- Competitor name and logo
- Last updated date
- Competitive win rate (if tracked)

#### Quick Overview
- What they do (one sentence)
- Their target customer
- Pricing model summary
- Key recent developments

#### Their Pitch
- How they describe themselves
- Their primary tagline
- Their top 3 claimed differentiators

#### Strengths (Be Honest)
- Where they genuinely compete well
- What customers like about them (from reviews)
- Features or capabilities where they lead

#### Weaknesses
- Consistent customer complaints (from reviews)
- Technical limitations
- Gaps in their offering
- Areas where customers report dissatisfaction

#### Our Differentiators
- 3-5 specific ways your product or approach is different
- For each: the differentiator, why it matters to the customer, and proof

#### Objection Handling
| If the prospect says... | Respond with... |
|------------------------|----------------|
| "[Competitor] does X too" | "Here is how our approach differs..." |
| "[Competitor] is cheaper" | "Here is what that price difference gets you..." |
| "I've heard good things about [Competitor]" | "They are strong at X. Where we differ is..." |

#### Landmines to Set
Questions to ask prospects early that highlight your advantages:
- "How do you currently handle [area where competitor is weak]?"
- "How important is [capability you have that they lack]?"
- "Have you considered [risk that your product mitigates]?"

#### Landmines to Defuse
Questions competitors might encourage prospects to ask you, with prepared responses.

#### Win/Loss Themes
- Common reasons deals are won against this competitor
- Common reasons deals are lost to this competitor
- What types of prospects favor them vs. you

#### Battlecard Maintenance
- Review and update quarterly at minimum
- Update immediately after major competitor announcements
- Incorporate win/loss feedback from sales team
- Track which objection-handling responses are most effective

## Output

Present the full competitive brief with clear formatting. Note the date of the research so the user knows the freshness of the data.

After the brief, ask:

"Would you like me to:
- Create a battlecard for your sales team based on this analysis?
- Draft messaging that exploits the positioning gaps identified?
- Dive deeper into any specific competitor?
- Set up a competitive monitoring plan?"

Changed by AI Blocks (2026-10-28): added rules to read public pages one at a time, check site terms, and never log in, pass a paywall, create accounts or start free trials; demos and chat groups limited to public or already-joined sources.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Market opportunity finder](https://useaiblocks.com/skills/competitor-white-space-mapper). It takes the competitors.
- The [Competitor store analyst](https://useaiblocks.com/skills/rival-store-comparer). It takes the competitors.
- The [Competitor ad teardown writer](https://useaiblocks.com/skills/competitor-ad-teardown-writer). It takes the competitors.
- **Write the landing page** with the [Competitor comparison page writer](https://useaiblocks.com/skills/alternative-page-writer). It takes the competitors.
- **Plan your strategy** with the [Positioning statement writer](https://useaiblocks.com/skills/positioning-statement-writer). It takes the competitors.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
