#!/usr/bin/env python3
"""
Shopify / DTC profit calculator.

AI Blocks note: the original script was an Amazon calculator (referral fees,
FBA fees, an "Amazon" report) and its break-even price did not match its own
cost model. This version uses the same cost model as SKILL.md for a store that
takes card payments and buys its own ads, and every result can be checked by
hand from the printed rows.

Cost model, per order, at selling price P:
  card fee     = P x card_rate + card_fixed_fee
  ad cost      = P x ad_spend_ratio
  return cost  = return_rate x cost_per_return
  other costs  = product_cost + inbound_shipping + fulfillment_fee
                 + customer_shipping + other_fees
  net profit   = P - (card fee + ad cost + return cost + other costs)
  max CAC      = P - (card fee + return cost + other costs)   (every cost but ads)

Break-even price (net profit = 0), and price for a target net margin m:
  P = (card_fixed_fee + return cost + other costs) / (1 - card_rate - ad_spend_ratio - m)
  with m = 0 for break-even. Only defined when card_rate + ad_spend_ratio + m < 1.

Usage:
  python3 calculator.py '{"selling_price": 40, "product_cost": 10, "card_rate": 0.029,
                          "card_fixed_fee": 0.30, "ad_spend_ratio": 0.25}'
All money is in one currency. Shares (rates, ratios, margins) are decimals: 0.25 = 25%.
card_rate and card_fixed_fee are required: use the rate on your own payment plan.
"""

import json
import sys

FIELDS = {
    # name: (default, required)
    "selling_price": (None, True),
    "product_cost": (None, True),
    "card_rate": (None, True),
    "card_fixed_fee": (None, True),
    "ad_spend_ratio": (0.0, False),
    "inbound_shipping": (0.0, False),
    "fulfillment_fee": (0.0, False),
    "customer_shipping": (0.0, False),   # only if you offer free shipping
    "return_rate": (0.0, False),
    "cost_per_return": (0.0, False),     # what one return costs you in total
    "other_fees": (0.0, False),
    "fixed_costs": (0.0, False),         # monthly costs that do not change per order
    "lifetime_orders": (None, False),    # average orders per customer, if known
    "cac": (None, False),                # what you pay to win one customer, if known
    "target_margins": ([0.10, 0.20, 0.30], False),
}


def read_input(raw: dict) -> dict:
    data = {}
    for name, (default, required) in FIELDS.items():
        if name in raw and raw[name] is not None:
            data[name] = raw[name]
        elif required:
            raise ValueError(f"Missing required field: {name}")
        else:
            data[name] = default
    for name in FIELDS:
        if name == "target_margins" or data[name] is None:
            continue
        if not isinstance(data[name], (int, float)) or data[name] < 0:
            raise ValueError(f"{name} must be a number of 0 or more")
    for name in ("card_rate", "ad_spend_ratio", "return_rate"):
        if data[name] >= 1:
            raise ValueError(f"{name} is a share, so it must be below 1 (0.25 = 25%)")
    if data["selling_price"] <= 0:
        raise ValueError("selling_price must be above 0")
    unknown = set(raw) - set(FIELDS)
    if unknown:
        raise ValueError(f"Unknown fields: {', '.join(sorted(unknown))}")
    return data


def price_for_margin(d: dict, margin: float):
    """Price that gives this net margin (0 = break-even), or None if impossible."""
    fixed_per_order = d["card_fixed_fee"] + d["return_rate"] * d["cost_per_return"] + other_costs(d)
    share_left = 1 - d["card_rate"] - d["ad_spend_ratio"] - margin
    if share_left <= 0:
        return None
    return fixed_per_order / share_left


def other_costs(d: dict) -> float:
    return (d["product_cost"] + d["inbound_shipping"] + d["fulfillment_fee"]
            + d["customer_shipping"] + d["other_fees"])


def analyse(d: dict) -> dict:
    p = d["selling_price"]
    card_fee = p * d["card_rate"] + d["card_fixed_fee"]
    ad_cost = p * d["ad_spend_ratio"]
    return_cost = d["return_rate"] * d["cost_per_return"]
    rows = [
        ("Product cost", d["product_cost"]),
        ("Inbound shipping", d["inbound_shipping"]),
        ("Warehouse fulfillment", d["fulfillment_fee"]),
        ("Customer shipping", d["customer_shipping"]),
        ("Card fee", card_fee),
        ("Advertising", ad_cost),
        ("Returns", return_cost),
        ("Other fees", d["other_fees"]),
    ]
    total = sum(v for _, v in rows)
    net = p - total
    max_cac = p - (total - ad_cost)
    result = {
        "rows": rows,
        "total_cost": total,
        "net_profit": net,
        "net_margin": net / p,
        "max_cac": max_cac,
        "break_even_price": price_for_margin(d, 0.0),
        "target_prices": [(m, price_for_margin(d, m)) for m in d["target_margins"]],
        "break_even_orders": None,
        "ltv": None,
        "ltv_cac": None,
    }
    if d["fixed_costs"] > 0 and net > 0:
        # Whole orders needed each month to cover fixed costs; round up.
        result["break_even_orders"] = -(-d["fixed_costs"] // net)
    if d["lifetime_orders"]:
        # Profit a customer brings over time before paying to win them.
        # Assumes repeat orders need no new ad spend; lower it if they do.
        result["ltv"] = d["lifetime_orders"] * max_cac
        if d["cac"]:
            result["ltv_cac"] = result["ltv"] / d["cac"]
    return result


def money(x: float) -> str:
    return f"-${-x:,.2f}" if x < 0 else f"${x:,.2f}"


def report(d: dict, r: dict) -> str:
    p = d["selling_price"]
    lines = ["Shopify / DTC profit per order", "",
             f"{'Selling price':<24}{money(p):>12}  100.0%", "-" * 44]
    for name, value in r["rows"]:
        if value:
            lines.append(f"{name:<24}{'-' + money(value):>12}  {value / p:6.1%}")
    lines += ["-" * 44,
              f"{'Net profit':<24}{money(r['net_profit']):>12}  {r['net_margin']:6.1%}",
              "",
              f"Max affordable CAC (price minus every cost except ads): {money(r['max_cac'])}"]
    be = r["break_even_price"]
    lines.append(f"Break-even price: {money(be)}" if be is not None
                 else "Break-even price: none (card rate plus ad share is 100% or more)")
    for m, price in r["target_prices"]:
        lines.append(f"Price for a {m:.0%} net margin: {money(price)}" if price is not None
                     else f"Price for a {m:.0%} net margin: not reachable at this ad share")
    if r["break_even_orders"] is not None:
        lines.append(f"Orders a month to cover fixed costs: {int(r['break_even_orders'])}")
    elif d["fixed_costs"] > 0:
        lines.append("Orders a month to cover fixed costs: never, each order loses money")
    if r["ltv"] is None:
        lines.append("LTV/CAC: not enough data (give lifetime_orders and cac)")
    else:
        lines.append(f"Profit per customer over time, before ads: {money(r['ltv'])}")
        lines.append(f"LTV/CAC: {r['ltv_cac']:.2f}" if r["ltv_cac"] is not None
                     else "LTV/CAC: not enough data (give cac)")
    return "\n".join(lines)


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(0)
    try:
        d = read_input(json.loads(sys.argv[1]))
    except (ValueError, json.JSONDecodeError) as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(2)
    print(report(d, analyse(d)))


if __name__ == "__main__":
    main()
