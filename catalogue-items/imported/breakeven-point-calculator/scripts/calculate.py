"""Cost-volume-profit: breakeven, target profit, margin of safety, operating leverage."""
from __future__ import annotations


def contribution_margin(price: float, variable_cost: float) -> float:
    return price - variable_cost


def breakeven_units(fixed_costs: float, price: float, variable_cost: float) -> float:
    cm = contribution_margin(price, variable_cost)
    if cm <= 0:
        raise ValueError("contribution margin must be positive")
    return fixed_costs / cm


def breakeven_sales(fixed_costs: float, cm_ratio: float) -> float:
    return fixed_costs / cm_ratio


def units_for_target_profit(fixed_costs: float, target: float, price: float, variable_cost: float) -> float:
    return (fixed_costs + target) / contribution_margin(price, variable_cost)


def breakeven_units_with_steps(
    base_fixed: float,
    step_cost: float,
    step_size: int,
    price: float,
    variable_cost: float,
    max_units: int,
) -> int | None:
    """First whole-unit volume with profit >= 0 when a step cost of `step_cost`
    applies to every `step_size` units of capacity (or part of it).

    Checks each step band in turn, so a breakeven that falls outside its own
    band is not reported. Returns None if no volume up to max_units breaks even.
    """
    import math

    cm = contribution_margin(price, variable_cost)
    if cm <= 0:
        raise ValueError("contribution margin must be positive")
    for steps in range(1, math.ceil(max_units / step_size) + 1):
        band_low = (steps - 1) * step_size + 1
        band_high = min(steps * step_size, max_units)
        fixed = base_fixed + steps * step_cost
        candidate = max(band_low, math.ceil(fixed / cm))
        if candidate <= band_high and cm * candidate - fixed >= 0:
            return candidate
    return None


def margin_of_safety(actual_sales: float, breakeven_sales_value: float) -> float:
    """Returned as a ratio of actual sales."""
    return (actual_sales - breakeven_sales_value) / actual_sales


def degree_of_operating_leverage(total_cm: float, operating_income: float) -> float:
    return total_cm / operating_income


if __name__ == "__main__":
    be = breakeven_units(120_000, 50.0, 30.0)
    assert be == 6_000
    assert abs(breakeven_sales(120_000, 0.4) - 300_000) < 1e-9
    assert units_for_target_profit(120_000, 40_000, 50.0, 30.0) == 8_000
    assert abs(margin_of_safety(400_000, 300_000) - 0.25) < 1e-12
    assert abs(degree_of_operating_leverage(160_000, 40_000) - 4.0) < 1e-12
    # Step-cost case from references/cvp-patterns.md: 5 supervisors, first non-loss volume 46,667
    assert breakeven_units_with_steps(5_400_000, 600_000, 10_000, 500.0, 320.0, 100_000) == 46_667
    print(f"breakeven: {be:,.0f} units | MOS 25% | DOL 4.0 | OK")
