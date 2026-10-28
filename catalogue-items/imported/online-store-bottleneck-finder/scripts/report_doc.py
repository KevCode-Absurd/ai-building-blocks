#!/usr/bin/env python3
"""
Supply Chain Analyzer - Document Report Generator
Supply ChainAnalyze - Report documentGenerate（Suitable for sharing/Demo）
"""

from datetime import datetime
from calculator import SupplyChainInput, analyze, HealthStatus


def generate_doc_report(data: SupplyChainInput, output_path: str = "report.md") -> str:
    """
    GenerateReport document（Markdown Format，SuitableExport PDF/PPT）
    """
    result = analyze(data)
    
    # StatusIcon
    status_icons = {
        HealthStatus.HEALTHY: "🟢",
        HealthStatus.WARNING: "🟡",
        HealthStatus.DANGER: "🔴"
    }
    
    # MetricsTable
    metrics_table = "| Metrics | CurrentValue | Planning line (unsourced) | Position |\n|:---:|:---:|:---:|:---:|\n"
    for m in result.metrics:
        icon = status_icons[m.status]
        metrics_table += f"| {m.name} | **{m.value}{m.unit}** | {m.benchmark}{m.unit} | {icon} |\n"
    
    # CostStructure
    cost = result.cost_breakdown
    cost_bars = ""
    cost_items = [
        ("ProductCost", cost['product_cost_ratio'], "🔴"),
        ("FBAFulfillment", cost['fba_ratio'], "🔵"),
        ("Advertisingfee", cost['ad_ratio'], "🟣"),
        ("InboundLogistics", cost['shipping_ratio'], "🟠"),
        ("Storagefee", cost['storage_ratio'], "🟤"),
        ("Other", 5, "⚪"),
        ("Net Profit", cost['net_margin'], "🟢"),
    ]
    for name, ratio, emoji in cost_items:
        bar = "█" * int(ratio / 2) if ratio > 0 else ""
        cost_bars += f"| {emoji} {name} | {bar} | {ratio}% |\n"
    
    # BottleneckPart
    bottlenecks_section = ""
    if result.bottlenecks:
        for i, b in enumerate(result.bottlenecks, 1):
            emoji = "🥇" if i == 1 else "🥈" if i == 2 else "🥉"
            bottlenecks_section += f"""
### {emoji} Bottleneck {i}: {b.title}

**Against the planning line**: {b.severity}

**IssueDescription**  
{b.problem}

**BusinessImpact**  
{b.impact}

**Optimization Suggestions**  
{b.suggestion}

---
"""
    else:
        bottlenecks_section = "\n**No measure is outside the planning lines. These lines are unsourced starting points, not proof the store is healthy.**\n"
    
    # ExecuteList
    action_items = """
### 📋 ExecuteList

**basicweeks**
- [ ] Export FBA LibraryageReport，Mark exceeds 60 days SKU
- [ ] Calculate each  SKU safe all Inventoryquantity
- [ ] OrganizeSupplierContact info，Prepare negotiation

** below weeks**
- [ ] Clear slow-movingInventory（On-site promotion/Off-site clearance）
- [ ] ContactSuppliertalkPayment terms
- [ ] AdjustRestockfrequencyRate

**basicmonths**
- [ ] InventorydaysTarget：Drop to 45 days to  inside 
- [ ] Evaluate small BatchHigh frequencyRestockModeFeasibility
- [ ] Review execution results
"""
    
    # Assemble document
    doc = f"""---
title: Supply ChainBottleneckAnalyzeReport
date: {datetime.now().strftime("%Y-%m-%d")}
author: Supply Chain Analyzer
---

# 📦 Supply ChainBottleneckAnalyzeReport

> **GenerateTime**: {datetime.now().strftime("%Yyears%mmonths%dDay %H:%M")}  
> **AnalyzePlatform**: {data.platform.upper()}

---

## 📌 CoreConclusion

<div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">

**{result.summary}**

Based onProvided by youData，Found **{len([m for m in result.metrics if m.status != HealthStatus.HEALTHY])}** MetricsNeedAttention。

</div>

---

## 📊 Key MetricsOverview

{metrics_table}

---

## 💰 CostStructureAnalyze

** each pieceProductCostBreakdown** (Selling Price ${cost['selling_price']:.2f})

| Itemitem | Proportion | Ratio |
|:---|:---|---:|
{cost_bars}

**Net Profit: ${cost['net_profit']:.2f}/piece ({cost['net_margin']}%)**

---

## 🎯 Bottleneck Diagnosis & Optimization Suggestions

{bottlenecks_section}

---

## 🚀 Action Plan

{action_items}

---

## 📈 prePeriodEffect

| OptimizationItem | Current | Target | prePeriodRevenue |
|:---|:---:|:---:|:---|
| Inventoryweeksconvert | {data.inventory_days}days | 45days | ReleaseInventoryCapital，ReduceStoragefee |
| PeriodStoragefee |  has  | no | Estimate from your own storage invoices |
| SupplierPayment terms | {data.supplier_payment_days}days | 30days | Improve cash flow |

---

## 📎 Appendix

### DataSource

- ProductCost: ${data.product_cost}/piece (UserInput)
- InboundCost: ${data.shipping_cost_per_unit}/piece (UserInput)
- FBA Fee: ${data.fba_fee}/piece (UserInput)
- Selling Price: ${data.selling_price}/piece (UserInput)
- Inventorydays: {data.inventory_days}days (UserInput)

### BenchmarkValueDescription

The planning lines in this report are the original author's unsourced starting points. They are not industry data. Replace them with your own targets.

---

<div style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 40px;">

**Powered by Supply Chain Analyzer Skill | NexScope**

</div>
"""
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(doc)
    
    return output_path


if __name__ == "__main__":
    import sys
    import json
    # No built-in sample figures: a report must come from the user's own numbers.
    if len(sys.argv) < 2:
        print("Usage: python report_doc.py '<JSON with your own figures>'", file=sys.stderr)
        sys.exit(2)
    data = SupplyChainInput(**json.loads(sys.argv[1]))
    output = generate_doc_report(data, "supply_chain_report.md")
    print(f"Report written: {output}")
