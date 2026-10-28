---
name: supply-chain-optimization-amazon-lite
version: 1.0.0
description: Supply Chain Optimization (Lite) - Diagnose bottlenecks and provide cost reduction strategies through conversation
platform: amazon
lang: en
---

# Supply Chain Optimization (Lite)

Supply chain bottleneck analysis tool - Conversation-based version

No API integration required. Collect data through guided conversation, automatically diagnose bottlenecks and output cost reduction strategies.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Use Cases

- Amazon seller supply chain health check
- Bottleneck identification and cost optimization
- Supply chain decision support

## Workflow

### Step 1: Trigger Skill

User says:
```
Analyze my supply chain
Supply chain diagnosis
I want to optimize supply chain costs
```

### Step 2: Business Profile Collection

Guide user to describe in natural language:

```
👋 Starting Supply Chain Analysis

Please describe your situation in a sentence or two, like:
"I sell kitchen products, 15 SKUs, $50K monthly sales, sourcing from Yiwu, sea freight to FBA, shipping costs seem high"

Or just tell me what problem you want to solve.
```

**Identify and confirm:**
- Category
- SKU count
- Monthly revenue scale
- Sourcing location
- Logistics model
- Main pain points

### Step 3: Supply Chain Data Collection

Guide user to provide key data:

```
📊 I need some data to locate bottlenecks (rough numbers are fine)

**Sourcing**
• Product cost (FOB): $___/unit
• Supplier payment terms: ___ days
• Lead time: ___ days

**Logistics**
• Shipping cost per unit: $___
• Transit time: ___ days

**Sales**
• Average selling price: $___
• FBA fulfillment fee: $___/unit
• Monthly storage fee: $___/unit
• Ad spend ratio: ___%

**Inventory**
• Current inventory days: ___ days
• Long-term storage fees: Yes/No

Just reply in natural language.
```

### Step 4: Bottleneck Diagnosis

Run calculation script:

```bash
python3 scripts/calculator.py '{"product_cost": 8, "supplier_payment_days": 0, "production_days": 30, "shipping_cost_per_unit": 1.5, "shipping_days": 35, "selling_price": 29.99, "fba_fee": 5.5, "storage_fee": 0.4, "ad_spend_ratio": 0.15, "inventory_days": 60, "has_long_term_storage": false}'
```

The numbers above are placeholders only; use the user's own. All eleven fields shown are required (`production_days` is the supplier lead time; `ad_spend_ratio` is a fraction from 0 to 1). `daily_sales`, `current_inventory` and `platform` (default `"amazon"`) are optional. If the user did not give a required number, ask for it or mark it as an estimate; do not invent it.

Output diagnosis report:
- Key metrics table (with health status)
- Cost structure breakdown
- Top 3 bottlenecks

### Step 5: Cost Reduction Strategies

For each bottleneck provide:
- Problem description
- Impact analysis
- Specific recommendations
- Action checklist

Then say what to do next: test the top fix first, one change at a time, and re-run this analysis with the new numbers once it has run for a full sales cycle.

### Step 6: Output Format Selection

```
📤 Analysis complete! Choose output format:

1️⃣ **Text** - View in current conversation (already shown)
2️⃣ **Web Chart** - Generate visual report webpage
3️⃣ **Report Doc** - Document format for sharing/presentation

Reply with number or say "generate web report"
```

---

## Benchmark Configuration

The following benchmarks can be customized based on your business:

| Metric | Healthy | Warning | Danger |
|--------|---------|---------|--------|
| Gross Margin | >40% | 30-40% | <30% |
| Shipping Ratio | <5% | 5-10% | >10% |
| Net Margin | >20% | 10-20% | <10% |
| Inventory Turnover | <45 days | 45-60 days | >60 days |
| Cash Cycle | <90 days | 90-120 days | >120 days |

To adjust, modify `BENCHMARKS` in `scripts/calculator.py`.

These thresholds are generic defaults from the original author, not sourced industry figures. Tell the user so whenever you show a healthy, warning or danger label, and ask them to replace the thresholds with targets for their own category before acting on any label.

---

## File Structure

```
amazon-lite/
├── SKILL.md          # Index (this file)
├── SKILL.en.md       # English version
├── SKILL.zh-CN.md    # Chinese version
├── _meta.json
└── scripts/
    └── calculator.py
```

---

_Version 1.0.0 | Platform: Amazon | Lang: English_

---

**Part of [Nexscope AI](https://www.nexscope.ai/?co-from=skill) — AI tools for e-commerce sellers.**

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Order picking, packing and shipping planner](https://useaiblocks.com/skills/pick-pack-and-ship-improver). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
