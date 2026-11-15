---
name: ecommerce-competitor-analysis
description: "Cross-platform ecommerce competitor analysis and strategic intelligence. Multi-channel presence evaluation, strategy assessment, positioning analysis, and competitive benchmarking. Use when the user asks about competitor analysis, competitive research, market analysis, or competitive intelligence across platforms."
metadata: {"nexscope":{"emoji":"🔍","category":"ecommerce"}}
---

# E-commerce Competitor Analysis 🔍

Comprehensive cross-platform competitor intelligence. Analyze strategies, positioning, and performance across all channels.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Competitors** (yours): the brands buyers compare you with.

**Makes it better (optional):**
- **Org context** (its products part), made by the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder): who you are, your buyers, voice, look, markets, claims and offers, kept in one folder.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Org context** with the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the org context, read:** `index.md`, `references.md`, `facts.json`. Take the options buyers weigh, each competitor's pitch, strength and gap, and who your buyers are. Only `live` lines count as facts: stale, `unconfirmed` and `banned` lines do not. If `worked.md` is there, keep what the client kept and leave out what they killed. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: an org context is a `context/org-context/` folder with `index.md` in it. If it's there, read `index.md` and the files above. An older `context/brand-file/` folder, or a brand folder with `00-start-here.md` in it, still works as material. Look for the other things by name.
2. **Check what's missing.** Look for competitors, your org context. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## How to run this version (AI Blocks notes)

Work in this order:
1. List the rivals and the channels the user named. Ask once if either is missing.
2. For each rival, collect what is public on each channel: store or listing pages, prices, product range, messaging, social pages.
3. Fill the comparison tables from those pages.
4. List the gaps the user could win, and tag each one with the page it came from.

**Gather first:** the rival names or links, the user's product and market, the channels to check, and the user's own prices if they have them. Ask once for anything missing.

**Sourcing rule:** show a number (market share, traffic, conversion rate, order value, customer lifetime value, SKU count) only when a named public source supports it. Otherwise write "not found". Never fill these cells with an estimate. You cannot see a rival's private sales or traffic.

## Installation

Not needed here. Paste this file into your AI chat. (The author's own install command is left out on purpose.)

## Usage Examples

**Multi-platform competitor assessment:**
```
"Analyze my top 3 competitors across Amazon, Shopify, and social commerce - where are they strongest?"
```

**Strategic positioning analysis:**
```
"Compare competitor strategies in the sustainable fashion space - pricing, messaging, and market positioning"
```

**Channel performance evaluation:**
```
"Which competitors are winning on TikTok Shop vs Amazon and what's their different approach?"
```

## Core Capabilities

### 1. Cross-Platform Presence Analysis
- Multi-channel footprint mapping and strategic assessment
- Platform-specific performance and market share evaluation (only where a named public source gives the figure)
- Channel optimization and resource allocation analysis
- Omnichannel strategy effectiveness assessment

### 2. Strategic Intelligence & Positioning
- Brand positioning and messaging framework analysis
- Competitive differentiation and unique value proposition evaluation
- Marketing strategy and customer acquisition approach assessment
- Product portfolio and market expansion strategy analysis

### 3. Performance Benchmarking & Insights
- Market share and growth trajectory analysis
- Customer engagement and loyalty metrics comparison
- Operational efficiency and strategic execution evaluation
- Innovation pipeline and competitive advantage assessment

## How It Works

### Step 1: Multi-Platform Competitor Mapping
*Comprehensive cross-channel competitive landscape analysis*

Input: the rival names or links and the channels. Output: a table of where each rival sells, with the page each entry came from.

Map competitive presence and strategy:
- Identify and catalog competitor presence across all relevant e-commerce platforms
- Analyze platform-specific strategies, messaging, and performance indicators
- Evaluate omnichannel integration and cross-platform synergies
- Assess competitive strengths and weaknesses by channel

### Step 2: Strategic Analysis & Intelligence Gathering
*Deep-dive competitive strategy and positioning assessment*

Input: the channel table from step 1 and the rivals' public pages. Output: for each rival, its positioning, messaging, prices, product range and ways of winning customers.

Analyze competitive strategies and positioning:
- Evaluate brand positioning, messaging frameworks, and customer value propositions
- Analyze product portfolios, pricing strategies, and market expansion approaches
- Assess marketing strategies, customer acquisition tactics, and retention programs
- Identify competitive advantages, differentiators, and strategic vulnerabilities

### Step 3: Benchmarking & Strategic Recommendations
*Performance comparison and strategic opportunity identification*

Input: the notes from steps 1 and 2, and the user's own prices and message if given. Output: a list of gaps the user could win, each tagged with its source page, and a short plan.

Generate competitive insights and recommendations:
- Benchmark performance metrics and identify competitive gaps and opportunities
- Develop strategic recommendations for competitive positioning and market capture
- Create defensive strategies against competitive threats and offensive strategies for market expansion
- Establish ongoing competitive monitoring and strategic adaptation frameworks

## Output Format

```
## Cross-Platform Competitor Analysis Report
**Industry:** [Category] | **Competitors Analyzed:** [Number] | **Platforms:** [List]

### Competitive Landscape Overview

**Market Leaders by Channel:**

| Platform | Leader | Market Share (source URL, or "not found") | Key Advantage | Runner-up |
|----------|--------|------------------|---------------|-----------|
| Amazon | [Brand A] | [Source: URL or not found] | [Advantage] | [Brand B] |
| Shopify/DTC | [Brand C] | [Source: URL or not found] | [Advantage] | [Brand D] |
| TikTok Shop | [Brand E] | [Source: URL or not found] | [Advantage] | [Brand F] |
| eBay | [Brand G] | [Source: URL or not found] | [Advantage] | [Brand H] |
| Social Commerce | [Brand I] | [Source: URL or not found] | [Advantage] | [Brand J] |

### Individual Competitor Deep Dive

**Competitor #1: [Brand Name]**

**Platform Presence & Strategy:**
- **Primary channels:** [Ranked by importance and investment]
- **Omnichannel integration:** [Excellent/Good/Poor] - [Specific observations]
- **Platform-specific adaptations:** [How strategy varies by channel]

**Strategic Positioning:**
- **Brand positioning:** [How they position themselves in the market]
- **Target customer:** [Primary demographics and psychographics]
- **Value proposition:** [Core customer promise and differentiators]
- **Messaging framework:** [Key themes and communication style]

**Product & Pricing Strategy:**
- **Portfolio breadth:** [Number of SKUs and category coverage]
- **Pricing approach:** [Premium/Value/Competitive positioning]
- **Product innovation:** [R&D focus and launch frequency]
- **Bundle/upsell strategy:** [Cross-sell and revenue optimization]

**Marketing & Customer Acquisition:**
- **Primary channels:** [Paid ads, organic, influencer, etc.]
- **Content strategy:** [Educational, entertaining, promotional mix]
- **Social media presence:** [Platform focus and engagement levels]
- **Customer retention:** [Loyalty programs, email, community]

**Strengths & Weaknesses:**
- **Key strengths:** [Top 3 competitive advantages]
- **Vulnerabilities:** [Areas where they can be attacked]
- **Market opportunities:** [Segments they haven't captured]
- **Threat level:** [High/Medium/Low to your business]

### Cross-Platform Strategy Analysis

**Platform Specialization Patterns:**

| Strategy Type | Description | Examples | Success Factors |
|---------------|-------------|----------|-----------------|
| Amazon-First | Dominate marketplace, limited DTC | [Brands] | [Factors] |
| DTC-Focused | Own channel emphasis, limited marketplace | [Brands] | [Factors] |
| Omnichannel | Strong presence across all channels | [Brands] | [Factors] |
| Social-Native | TikTok/Instagram first, traditional second | [Brands] | [Factors] |

### Competitive Positioning Map

**Market Position Analysis:**

```
Premium Price
     |
[Brand A] ---- [Brand B]
     |              |
Quality/Features ---- Value/Features  
     |              |
[Brand C] ---- [Brand D]
     |
Budget Price
```

**Positioning Insights:**
- **Premium leaders:** [Brands and their positioning strategies]
- **Value champions:** [Brands winning on price-value equation]
- **Niche specialists:** [Brands dominating specific segments]
- **Mass market players:** [Brands competing for mainstream customers]

### Marketing Strategy Comparison

**Content & Messaging Analysis:**

| Competitor | Content Focus | Tone/Style | Platform Adaptation | Effectiveness |
|------------|---------------|------------|-------------------|---------------|
| [Brand A] | [Content focus] | [Tone/style] | [Platform adaptation] | [Your judgement, tied to a page you saw] |
| [Brand B] | [Content focus] | [Tone/style] | [Platform adaptation] | [Your judgement, tied to a page you saw] |

**Customer Acquisition Strategies:**
- **Paid advertising:** [Public spend evidence, such as an ad library link, or "not found". Never estimate a budget]
- **Influencer marketing:** [Partnership approaches and investment levels]
- **SEO/Content marketing:** [Content strategies and organic presence]
- **Email/SMS marketing:** [Retention and nurturing approaches]

### Performance Benchmarking

**Performance Metrics (named public source only; write "not found" if none):**

| Competitor | Monthly Traffic | Conversion Rate | Average Order Value | Customer Lifetime Value |
|------------|-----------------|-----------------|---------------------|------------------------|
| [Brand A] | [Source: URL or not found] | [Source: URL or not found] | [Source: URL or not found] | [Source: URL or not found] |
| [Brand B] | [Source: URL or not found] | [Source: URL or not found] | [Source: URL or not found] | [Source: URL or not found] |

**Growth Trajectory Analysis:**
- **Fastest growing:** [Brand] - [Growth drivers]
- **Market share shifts:** [Who's gaining/losing and why]
- **New market entrants:** [Recent newcomers and their impact]
- **Platform momentum:** [Which competitors are gaining where]

### Strategic Opportunities & Threats

**Market Gaps & Opportunities:**
1. **Underserved segment:** [Customer group not well-served]
   - **Gap:** [What's missing in current offerings]
   - **Opportunity:** [How to capture this segment]
   - **Competition level:** [Low/Medium/High]

2. **Platform opportunity:** [Channel with limited competition]
   - **Current leaders:** [Who dominates now]
   - **Entry barriers:** [What it takes to compete]
   - **Success potential:** [Market size and winability]

**Competitive Threats:**
- **Immediate threats:** [Competitors with overlapping strategies]
- **Long-term risks:** [Market trends that favor competitors]
- **Disruptive potential:** [New entrants or business models]

### Strategic Recommendations

**Defensive Strategies:**
1. **Strengthen core differentiators** - [Specific recommendations]
2. **Improve competitive weaknesses** - [Priority areas for investment]
3. **Monitor and respond to threats** - [Early warning systems and response plans]

**Offensive Strategies:**
1. **Exploit competitor weaknesses** - [Specific attack strategies]
2. **Capture underserved segments** - [Market expansion opportunities]
3. **Platform expansion** - [New channel opportunities]

**Resource Allocation Recommendations:**
- **High ROI channels:** [Where to increase investment]
- **Defensive spending:** [Areas requiring protection]
- **Innovation priorities:** [Product/service development focus]

### Competitive Monitoring Framework

**Ongoing Intelligence Requirements:**
- **Weekly monitoring:** [Price changes, new products, major campaigns]
- **Monthly analysis:** [Performance trends, market share shifts]
- **Quarterly deep-dive:** [Strategy changes, new initiatives]

**Key Performance Indicators:**
- **Market share changes** by platform and segment (only where a named public source gives it)
- **Share of voice** in paid and organic channels
- **Customer sentiment** and brand perception shifts
- **Innovation pipeline** and product launch frequency

### Implementation Roadmap

**Phase 1: Immediate Actions (0-30 days)**
- [ ] Implement competitive monitoring systems
- [ ] Address highest-priority competitive vulnerabilities
- [ ] Launch defensive strategies against immediate threats

**Phase 2: Strategic Initiatives (1-3 months)**
- [ ] Execute offensive strategies to capture opportunities
- [ ] Expand into underserved markets or platforms
- [ ] Strengthen competitive differentiators

**Phase 3: Long-term Positioning (3-6 months)**
- [ ] Build sustainable competitive advantages
- [ ] Establish market leadership in target segments
- [ ] Develop next-generation competitive strategies

### Success Metrics & KPIs

**Competitive Performance Indicators:**
- **Market share growth** in target segments: [YOUR TARGET, set by the user]
- **Share of voice improvement** across channels: [YOUR TARGET, set by the user]
- **Competitive differentiation** strength: [Measurement approach]
- **Customer preference** vs competitors: [Only if a public survey source exists, else "not found"]

### Next Actions
- [ ] Prioritize competitive threats and opportunities for immediate action
- [ ] Establish competitive monitoring and intelligence gathering systems
- [ ] Develop detailed strategic plans for top 3 opportunities identified
- [ ] Create competitive response protocols and decision frameworks
- [ ] Schedule regular competitive analysis reviews and strategy updates
```

**Limitations without real-time data:**
- Analysis based on publicly available information and research methods
- Performance metrics come only from named public sources; where there is none, the cell says "not found"
- Competitive intelligence requires ongoing monitoring for accuracy and relevance
- Strategic recommendations based on current market conditions and may need adjustment

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Check the money** with the [Price against value checker](https://useaiblocks.com/skills/price-against-value-checker).
- The [Market opportunity finder](https://useaiblocks.com/skills/competitor-white-space-mapper). It takes the competitors.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Best Practices

✅ **Multi-dimensional analysis**: Evaluate competitors across platforms, strategies, and performance metrics

✅ **Regular updates**: Refresh competitive intelligence at least monthly for dynamic markets

✅ **Action-oriented insights**: Focus on actionable intelligence rather than just data collection

✅ **Customer perspective**: Always analyze competitive strengths and weaknesses from customer viewpoint

✅ **Strategic integration**: Use competitive intelligence to inform all business decisions, not just competitive moves

---

*Original author: Nexscope AI, under the MIT licence (see the LICENSE file in this item).*
