#!/usr/bin/env python3
"""
Amazon Profit Calculator - Core Engine

Features:
- Cost breakdown calculation
- Profit margin calculation (gross/net)
- Break-even analysis
- Pricing recommendations
- Batch calculation support

Version: 1.0.0
"""

import json
import csv
from dataclasses import dataclass, field
from typing import List, Dict, Optional
from enum import Enum
import sys


class ProfitStatus(Enum):
    HEALTHY = "healthy"      # >20% net margin
    WARNING = "warning"      # 5-20% net margin
    DANGER = "danger"        # <5% net margin
    LOSS = "loss"            # Negative margin


# ============================================================
# Amazon Referral Fee Rates (by category)
# Simplified flat rates. Amazon charges the greater of the category percentage or a
# per-item minimum, and some categories are tiered by price. Check the current
# schedule: https://sellercentral.amazon.com/gp/help/external/200336920
# ============================================================

REFERRAL_FEE_RATES = {
    # Category: Rate
    "default": 0.15,
    "electronics": 0.08,
    "computers": 0.08,
    "camera": 0.08,
    "video_games": 0.15,
    "books": 0.15,
    "clothing": 0.17,
    "shoes": 0.15,
    "jewelry": 0.20,
    "watches": 0.15,
    "furniture": 0.15,
    "home": 0.15,
    "kitchen": 0.15,
    "beauty": 0.15,
    "health": 0.15,
    "grocery": 0.15,
    "pet": 0.15,
    "toys": 0.15,
    "baby": 0.15,
    "sports": 0.15,
    "outdoors": 0.15,
    "automotive": 0.12,
    "industrial": 0.12,
    "office": 0.15,
}

# FBA Fulfillment Fee Reference (simplified, based on size tier)
FBA_FULFILLMENT_FEES = {
    "small_standard": 3.22,      # Small standard (<1lb)
    "large_standard_1lb": 4.75,  # Large standard (<1lb)
    "large_standard_2lb": 5.40,  # Large standard (1-2lb)
    "large_standard_3lb": 6.10,  # Large standard (2-3lb)
    "small_oversize": 9.73,      # Small oversize
    "medium_oversize": 19.05,    # Medium oversize
    "large_oversize": 89.98,     # Large oversize
}

# Profit margin thresholds
PROFIT_THRESHOLDS = {
    "healthy": 0.20,    # >20%
    "warning": 0.05,    # 5-20%
    "danger": 0.00,     # 0-5%
}


# ============================================================
# Data Structures
# ============================================================

@dataclass
class ProductInput:
    """Single product input data"""
    sku: str = "SKU001"
    name: str = "Product"
    
    # Selling price
    selling_price: float = 0.0
    
    # Cost items
    product_cost: float = 0.0           # Product cost (FOB)
    shipping_cost: float = 0.0          # Inbound shipping
    fba_fulfillment_fee: float = 0.0    # FBA fulfillment fee
    fba_storage_fee: float = 0.0        # FBA storage fee (monthly avg)
    
    # Optional costs
    ad_spend_ratio: float = 0.0         # Ad spend ratio (0-1)
    return_rate: float = 0.0            # Return rate (0-1)
    return_processing_fee: float = 0.0  # Return processing fee per unit
    other_fees: float = 0.0             # Other fees
    
    # Platform related
    category: str = "default"           # Category (for Referral Fee)
    referral_fee_rate: Optional[float] = None  # Custom commission rate
    
    # For batch calculation
    monthly_sales: int = 0              # Monthly sales (for fixed cost allocation)
    fixed_costs: float = 0.0            # Fixed costs (for break-even)


@dataclass
class CostBreakdown:
    """Cost breakdown"""
    selling_price: float
    product_cost: float
    shipping_cost: float
    fba_fulfillment_fee: float
    fba_storage_fee: float
    referral_fee: float
    ad_cost: float
    return_cost: float
    other_fees: float
    
    total_cost: float = 0.0
    gross_profit: float = 0.0
    net_profit: float = 0.0
    gross_margin: float = 0.0
    net_margin: float = 0.0
    
    def __post_init__(self):
        self.total_cost = (
            self.product_cost +
            self.shipping_cost +
            self.fba_fulfillment_fee +
            self.fba_storage_fee +
            self.referral_fee +
            self.ad_cost +
            self.return_cost +
            self.other_fees
        )
        self.gross_profit = self.selling_price - self.product_cost - self.shipping_cost - self.fba_fulfillment_fee - self.referral_fee
        self.net_profit = self.selling_price - self.total_cost
        self.gross_margin = self.gross_profit / self.selling_price if self.selling_price > 0 else 0
        self.net_margin = self.net_profit / self.selling_price if self.selling_price > 0 else 0


@dataclass
class BreakEvenAnalysis:
    """Break-even analysis"""
    min_price: float              # Minimum price (break-even)
    break_even_units: int         # Break-even units
    safety_margin: float          # Safety margin
    current_margin_above_min: float  # Current price above minimum


@dataclass
class PricingSuggestion:
    """Pricing recommendation"""
    target_margin: float          # Target profit margin
    suggested_price: float        # Suggested price
    profit_per_unit: float        # Profit per unit


@dataclass
class AnalysisResult:
    """Complete analysis result"""
    product: ProductInput
    cost_breakdown: CostBreakdown
    break_even: BreakEvenAnalysis
    pricing_suggestions: List[PricingSuggestion]
    status: ProfitStatus
    summary: str


# ============================================================
# Core Calculation Functions
# ============================================================

def get_referral_fee_rate(category: str, custom_rate: Optional[float] = None) -> float:
    """Get Referral Fee rate"""
    if custom_rate is not None:
        return custom_rate
    return REFERRAL_FEE_RATES.get(category.lower(), REFERRAL_FEE_RATES["default"])


# Share of the product cost assumed lost on each returned unit (an assumption, not an Amazon figure).
RETURN_PRODUCT_LOSS_SHARE = 0.5


def per_unit_flat_cost(product: ProductInput) -> float:
    """Per-unit costs that do not change with the selling price.

    The same cost model is used by calculate_costs, calculate_break_even and
    calculate_pricing_suggestions, so every price this file suggests is checked
    against the same costs it reports.
    """
    return_cost = product.return_rate * (
        product.return_processing_fee + product.product_cost * RETURN_PRODUCT_LOSS_SHARE
    )
    return (
        product.product_cost +
        product.shipping_cost +
        product.fba_fulfillment_fee +
        product.fba_storage_fee +
        product.other_fees +
        return_cost
    )


def price_linked_rate(product: ProductInput) -> float:
    """Share of the selling price taken by the referral fee and ad spend."""
    return get_referral_fee_rate(product.category, product.referral_fee_rate) + product.ad_spend_ratio


def calculate_costs(product: ProductInput) -> CostBreakdown:
    """Calculate cost breakdown"""
    # Referral Fee
    referral_rate = get_referral_fee_rate(product.category, product.referral_fee_rate)
    referral_fee = product.selling_price * referral_rate

    # Ad cost
    ad_cost = product.selling_price * product.ad_spend_ratio

    # Return cost = return rate × (processing fee + share of product cost lost)
    return_cost = product.return_rate * (
        product.return_processing_fee + product.product_cost * RETURN_PRODUCT_LOSS_SHARE
    )
    
    return CostBreakdown(
        selling_price=product.selling_price,
        product_cost=product.product_cost,
        shipping_cost=product.shipping_cost,
        fba_fulfillment_fee=product.fba_fulfillment_fee,
        fba_storage_fee=product.fba_storage_fee,
        referral_fee=round(referral_fee, 2),
        ad_cost=round(ad_cost, 2),
        return_cost=round(return_cost, 2),
        other_fees=product.other_fees
    )


def calculate_break_even(product: ProductInput, costs: CostBreakdown) -> BreakEvenAnalysis:
    """Calculate break-even point"""
    # Flat per-unit cost (does not change with price), including returns
    flat_cost = per_unit_flat_cost(product)

    # Referral fee and ad spend are both a share of the NEW price, so solve:
    # min_price - flat_cost - min_price * (referral_rate + ad_ratio) = 0
    # min_price = flat_cost / (1 - referral_rate - ad_ratio)
    # Worked case: flat cost $10, referral 15%, ads 10% -> 10 / 0.75 = $13.33,
    # and at $13.33 the fees are $2.00 + $1.33, so profit is $0.00.
    denominator = 1 - price_linked_rate(product)
    if denominator > 0:
        min_price = flat_cost / denominator
    else:
        # Fees and ads take 100% or more of any price: no price breaks even.
        min_price = float("inf")
    
    # Break-even units (if fixed costs exist)
    if product.fixed_costs > 0 and costs.net_profit > 0:
        break_even_units = int(product.fixed_costs / costs.net_profit) + 1
    else:
        break_even_units = 0
    
    # Safety margin
    if min_price == float("inf"):
        safety_margin = float("-inf")
        margin_above_min = float("-inf")
    else:
        safety_margin = (product.selling_price - min_price) / product.selling_price if product.selling_price > 0 else 0
        margin_above_min = (product.selling_price - min_price) / min_price if min_price > 0 else 0

    return BreakEvenAnalysis(
        min_price=round(min_price, 2) if min_price != float("inf") else min_price,
        break_even_units=break_even_units,
        safety_margin=round(safety_margin, 4),
        current_margin_above_min=round(margin_above_min, 4)
    )


def calculate_pricing_suggestions(product: ProductInput, target_margins: List[float] = None) -> List[PricingSuggestion]:
    """Calculate pricing recommendations"""
    if target_margins is None:
        target_margins = [0.15, 0.20, 0.25, 0.30]
    
    suggestions = []
    
    # Base cost (excluding Referral Fee and ad cost as they're % of price).
    # Uses the same cost model as calculate_costs, including the product-loss part of returns.
    base_cost = per_unit_flat_cost(product)

    rate = price_linked_rate(product)

    for target_margin in target_margins:
        # Target: net_profit / selling_price = target_margin
        # net_profit = selling_price - base_cost - selling_price * (referral_rate + ad_ratio)
        # selling_price = base_cost / (1 - target_margin - referral_rate - ad_ratio)
        # Worked case: base cost $10, referral 15%, ads 10%, target 20% -> 10 / 0.55 = $18.18,
        # fees $2.73 + $1.82, profit $3.64 = 20% of $18.18.

        denominator = 1 - target_margin - rate
        if denominator > 0:
            suggested_price = base_cost / denominator
            profit_per_unit = suggested_price * target_margin
            
            suggestions.append(PricingSuggestion(
                target_margin=target_margin,
                suggested_price=round(suggested_price, 2),
                profit_per_unit=round(profit_per_unit, 2)
            ))
    
    return suggestions


def evaluate_profit_status(net_margin: float) -> ProfitStatus:
    """Evaluate profit status"""
    if net_margin < 0:
        return ProfitStatus.LOSS
    elif net_margin < PROFIT_THRESHOLDS["warning"]:
        return ProfitStatus.DANGER
    elif net_margin < PROFIT_THRESHOLDS["healthy"]:
        return ProfitStatus.WARNING
    else:
        return ProfitStatus.HEALTHY


def analyze_product(product: ProductInput, target_margins: List[float] = None) -> AnalysisResult:
    """Analyze single product"""
    costs = calculate_costs(product)
    break_even = calculate_break_even(product, costs)
    pricing = calculate_pricing_suggestions(product, target_margins)
    status = evaluate_profit_status(costs.net_margin)
    
    # Generate summary
    status_text = {
        ProfitStatus.HEALTHY: "✅ Healthy",
        ProfitStatus.WARNING: "⚠️ Warning",
        ProfitStatus.DANGER: "🔴 Danger",
        ProfitStatus.LOSS: "💀 Loss",
    }
    summary = f"{status_text[status]} | Net Margin {costs.net_margin*100:.1f}% | Profit/Unit ${costs.net_profit:.2f}"
    
    return AnalysisResult(
        product=product,
        cost_breakdown=costs,
        break_even=break_even,
        pricing_suggestions=pricing,
        status=status,
        summary=summary
    )


def analyze_batch(products: List[ProductInput], target_margins: List[float] = None) -> List[AnalysisResult]:
    """Batch analysis"""
    return [analyze_product(p, target_margins) for p in products]


# ============================================================
# Output Formatting
# ============================================================

def format_cost_breakdown(costs: CostBreakdown) -> str:
    """Format cost breakdown"""
    def pct(val):
        return f"{val/costs.selling_price*100:.1f}%" if costs.selling_price > 0 else "0%"
    
    lines = [
        f"Selling Price         ${costs.selling_price:.2f}   100%",
        "─" * 40,
        f"Product Cost          -${costs.product_cost:.2f}    {pct(costs.product_cost)}",
        f"Inbound Shipping      -${costs.shipping_cost:.2f}    {pct(costs.shipping_cost)}",
        f"FBA Fulfillment       -${costs.fba_fulfillment_fee:.2f}    {pct(costs.fba_fulfillment_fee)}",
        f"FBA Storage           -${costs.fba_storage_fee:.2f}    {pct(costs.fba_storage_fee)}",
        f"Referral Fee          -${costs.referral_fee:.2f}    {pct(costs.referral_fee)}",
        f"Advertising           -${costs.ad_cost:.2f}    {pct(costs.ad_cost)}",
        f"Returns               -${costs.return_cost:.2f}    {pct(costs.return_cost)}",
        f"Other Fees            -${costs.other_fees:.2f}    {pct(costs.other_fees)}",
        "─" * 40,
        f"Total Cost            ${costs.total_cost:.2f}    {pct(costs.total_cost)}",
        f"Net Profit            ${costs.net_profit:.2f}    {costs.net_margin*100:.1f}%",
    ]
    return "\n".join(lines)


def format_break_even(be: BreakEvenAnalysis, current_price: float) -> str:
    """Format break-even analysis"""
    if be.min_price == float("inf"):
        return "\n".join([
            "Break-even Price: none",
            "├── Referral fee + ad spend take 100% or more of any price, so every sale loses money",
        ])
    lines = [
        f"Break-even Price: ${be.min_price:.2f}",
        f"├── Below this price = Loss",
        f"",
        f"Current Price: ${current_price:.2f}",
        f"├── {be.current_margin_above_min*100:.1f}% above break-even",
        f"",
        f"Safety Margin: {be.safety_margin*100:.1f}%",
        f"├── Room for price reduction",
    ]
    if be.break_even_units > 0:
        lines.extend([
            f"",
            f"Break-even Units: {be.break_even_units}",
            f"├── Units needed to cover fixed costs",
        ])
    return "\n".join(lines)


def format_pricing_suggestions(suggestions: List[PricingSuggestion], current_price: float, current_margin: float) -> str:
    """Format pricing recommendations"""
    lines = [
        "| Target Margin | Recommended Price | Profit/Unit |",
        "|---------------|-------------------|-------------|",
    ]
    for s in suggestions:
        lines.append(f"| {s.target_margin*100:.0f}% | ${s.suggested_price:.2f} | ${s.profit_per_unit:.2f} |")
    
    lines.append(f"\nCurrent Price ${current_price:.2f} → Net Margin {current_margin*100:.1f}%")
    return "\n".join(lines)


def format_full_report(result: AnalysisResult) -> str:
    """Generate full report"""
    status_icons = {
        ProfitStatus.HEALTHY: "✅",
        ProfitStatus.WARNING: "⚠️",
        ProfitStatus.DANGER: "🔴",
        ProfitStatus.LOSS: "💀",
    }
    
    report = f"""
💰 **Amazon Profit Analysis Report**

**Product**: {result.product.name} ({result.product.sku})
**Status**: {status_icons[result.status]} {result.summary}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 **Cost Breakdown**

```
{format_cost_breakdown(result.cost_breakdown)}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 **Break-Even Analysis**

{format_break_even(result.break_even, result.product.selling_price)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 **Pricing Recommendations**

{format_pricing_suggestions(result.pricing_suggestions, result.product.selling_price, result.cost_breakdown.net_margin)}

"""
    return report


def format_batch_summary(results: List[AnalysisResult]) -> str:
    """Format batch analysis summary"""
    status_icons = {
        ProfitStatus.HEALTHY: "✅",
        ProfitStatus.WARNING: "⚠️",
        ProfitStatus.DANGER: "🔴",
        ProfitStatus.LOSS: "💀",
    }
    
    lines = [
        "📊 **Batch Analysis Summary**",
        "",
        "| SKU | Price | Total Cost | Net Profit | Margin | Status |",
        "|-----|-------|------------|------------|--------|--------|",
    ]
    
    total_profit = 0
    for r in results:
        c = r.cost_breakdown
        icon = status_icons[r.status]
        lines.append(f"| {r.product.sku} | ${c.selling_price:.2f} | ${c.total_cost:.2f} | ${c.net_profit:.2f} | {c.net_margin*100:.1f}% | {icon} |")
        total_profit += c.net_profit
    
    lines.append("")
    lines.append(f"**Total**: {len(results)} SKUs | Avg Profit/Unit ${total_profit/len(results):.2f}")
    
    # Statistics
    healthy = sum(1 for r in results if r.status == ProfitStatus.HEALTHY)
    warning = sum(1 for r in results if r.status == ProfitStatus.WARNING)
    danger = sum(1 for r in results if r.status == ProfitStatus.DANGER)
    loss = sum(1 for r in results if r.status == ProfitStatus.LOSS)
    
    lines.append(f"**Status Distribution**: ✅ {healthy} | ⚠️ {warning} | 🔴 {danger} | 💀 {loss}")
    
    return "\n".join(lines)


# ============================================================
# CSV Batch Processing
# ============================================================

def parse_csv(csv_content: str) -> List[ProductInput]:
    """Parse CSV content"""
    products = []
    reader = csv.DictReader(csv_content.strip().split('\n'))
    
    for row in reader:
        product = ProductInput(
            sku=row.get('sku', 'SKU'),
            name=row.get('name', 'Product'),
            selling_price=float(row.get('selling_price', 0)),
            product_cost=float(row.get('product_cost', 0)),
            shipping_cost=float(row.get('shipping_cost', 0)),
            fba_fulfillment_fee=float(row.get('fba_fee', 0)),
            fba_storage_fee=float(row.get('storage_fee', 0)),
            ad_spend_ratio=float(row.get('ad_ratio', 0)),
            return_rate=float(row.get('return_rate', 0)),
            return_processing_fee=float(row.get('return_fee', 0)),
            other_fees=float(row.get('other_fees', 0)),
            category=row.get('category', 'default'),
        )
        products.append(product)
    
    return products


# ============================================================
# CLI Entry Point
# ============================================================

def main():
    """Command line entry"""
    # Default test data
    test_product = ProductInput(
        sku="TEST001",
        name="Kitchen Gadget",
        selling_price=29.99,
        product_cost=6.00,
        shipping_cost=1.50,
        fba_fulfillment_fee=5.50,
        fba_storage_fee=0.30,
        ad_spend_ratio=0.10,
        return_rate=0.03,
        return_processing_fee=2.00,
        other_fees=0.50,
        category="kitchen",
    )
    
    # If JSON input provided
    if len(sys.argv) > 1:
        try:
            input_data = json.loads(sys.argv[1])
            if isinstance(input_data, list):
                # Batch mode
                products = [ProductInput(**p) for p in input_data]
                results = analyze_batch(products)
                print(format_batch_summary(results))
                return
            else:
                test_product = ProductInput(**input_data)
        except Exception as e:
            print(f"Error: {e}")
            sys.exit(1)
    
    # Single product analysis
    result = analyze_product(test_product)
    print(format_full_report(result))


if __name__ == "__main__":
    main()
