#!/usr/bin/env python3
"""Deterministic, dependency-free valuation calculations and JSON CLI."""
from __future__ import annotations

import argparse, json, math
from typing import Any

ENGINE_VERSION = "1.2.0"

class ModelError(ValueError):
    def __init__(self, code: str, path: str, message: str):
        self.code, self.path, self.message = code, path, message
        super().__init__(message)

def _fail(code, path, message): raise ModelError(code, path, message)
def _obj(v, p):
    if not isinstance(v, dict): _fail("FIELD_INVALID", p, "must be an object")
    return v
def _arr(v, p):
    if not isinstance(v, list): _fail("FIELD_INVALID", p, "must be an array")
    return v
def _num(v, p):
    if isinstance(v, bool) or not isinstance(v, (int, float)): _fail("NUMBER_INVALID", p, "must be a number")
    if not math.isfinite(v): _fail("NUMBER_NOT_FINITE", p, "must be finite")
    return float(v)
def _str(v, p):
    if not isinstance(v, str) or not v: _fail("FIELD_INVALID", p, "must be a non-empty string")
    return v
def _fields(o, required, optional, p):
    missing = required - o.keys(); unknown = o.keys() - required - optional
    if missing: _fail("FIELD_REQUIRED", p, "missing " + sorted(missing)[0])
    if unknown: _fail("FIELD_UNKNOWN", p, "unknown " + sorted(unknown)[0])

def _validate_scenarios(source):
    _fields(source, {"horizon", "items"}, set(), "scenarios")
    horizon = _num(source["horizon"], "scenarios.horizon")
    if horizon <= 0 or horizon != int(horizon): _fail("SCENARIO_SET_INVALID", "scenarios.horizon", "must be a positive integer")
    items = _obj(source["items"], "scenarios.items")
    if set(items) != {"bear", "base", "bull"}: _fail("SCENARIO_SET_INVALID", "scenarios.items", "must contain bear, base, and bull")
    total = 0.0
    for name, item in items.items():
        item = _obj(item, "scenarios.items." + name); _fields(item, {"probability", "exit_value", "dividends"}, set(), "scenarios.items." + name)
        probability = _num(item["probability"], "scenarios.items." + name + ".probability")
        if probability < 0: _fail("SCENARIO_SET_INVALID", "scenarios.items." + name, "probability cannot be negative")
        total += probability
        if _num(item["exit_value"], "scenarios.items." + name + ".exit_value") < 0: _fail("SCENARIO_SET_INVALID", "scenarios.items." + name, "exit value cannot be negative")
        dividends = _arr(item["dividends"], "scenarios.items." + name + ".dividends")
        if len(dividends) != int(horizon): _fail("SCENARIO_SET_INVALID", "scenarios.items." + name, "dividends must match horizon")
        for i, v in enumerate(dividends):
            if _num(v, f"scenarios.items.{name}.dividends[{i}]") < 0: _fail("SCENARIO_SET_INVALID", f"scenarios.items.{name}.dividends[{i}]", "IRR supports non-negative future distributions only")
    if abs(total - 1) > 1e-9: _fail("PROBABILITY_SUM_INVALID", "scenarios.items", "probabilities must sum to 1")

def _validate_common(p, sector):
    req = {"schema_version", "mode", "route", "units", "market", "scenarios", "margin_of_safety"}
    opt = {"sector_dcf_unsuitable_reason", "primary_method_id", "methods", "reverse_multiple"} if sector else {"bridge", "dcf", "relative_cross_checks", "reverse_valuation"}
    _fields(p, req, opt, "$")
    if p["schema_version"] != "valuation.v1": _fail("SCHEMA_VERSION_UNSUPPORTED", "schema_version", "unsupported schema version")
    if p["mode"] not in ("standard", "audit"): _fail("FIELD_INVALID", "mode", "must be standard or audit")
    u = _obj(p["units"], "units"); _fields(u, {"model_currency", "quote_currency", "amount_unit", "fx_to_quote"}, set(), "units")
    for key in ("model_currency", "quote_currency", "amount_unit"): _str(u[key], "units." + key)
    if _num(u["fx_to_quote"], "units.fx_to_quote") <= 0: _fail("FIELD_INVALID", "units.fx_to_quote", "must be positive")
    m = _obj(p["market"], "market"); _fields(m, {"as_of", "price_as_of", "current_price", "diluted_shares"}, set(), "market")
    _str(m["as_of"], "market.as_of"); _str(m["price_as_of"], "market.price_as_of")
    if _num(m["current_price"], "market.current_price") <= 0: _fail("FIELD_INVALID", "market.current_price", "must be positive")
    if _num(m["diluted_shares"], "market.diluted_shares") <= 0: _fail("FIELD_INVALID", "market.diluted_shares", "must be positive")
    mos = _obj(p["margin_of_safety"], "margin_of_safety"); _fields(mos, {"required", "high_conviction"}, set(), "margin_of_safety")
    _num(mos["required"], "margin_of_safety.required"); _num(mos["high_conviction"], "margin_of_safety.high_conviction")
    _validate_scenarios(_obj(p["scenarios"], "scenarios"))

def _validate_dcf(p):
    _validate_common(p, False)
    if p["route"] != "dcf": _fail("ROUTE_CONFLICT", "route", "standard valuation route must be dcf")
    for key in ("bridge", "dcf"):
        if key not in p: _fail("FIELD_REQUIRED", key, "required for dcf valuation")
    b = _obj(p["bridge"], "bridge"); reqb = {"excess_cash", "non_operating_investments", "debt", "minority_interest", "other_claims", "additional_equity_adjustments", "dilution_treatment"}; _fields(b, reqb, set(), "bridge")
    for key in reqb - {"additional_equity_adjustments", "dilution_treatment"}: _num(b[key], "bridge." + key)
    _str(b["dilution_treatment"], "bridge.dilution_treatment")
    for i, adjustment in enumerate(_arr(b["additional_equity_adjustments"], "bridge.additional_equity_adjustments")):
        adjustment = _obj(adjustment, f"bridge.additional_equity_adjustments[{i}]"); _fields(adjustment, {"label", "amount", "reason"}, set(), f"bridge.additional_equity_adjustments[{i}]")
        _str(adjustment["label"], "adjustment.label"); _num(adjustment["amount"], "adjustment.amount"); _str(adjustment["reason"], "adjustment.reason")
    d = _obj(p["dcf"], "dcf"); req = {"basis", "discount_rate_type", "discount_rate", "base_revenue", "forecast", "terminal", "sensitivity"}; _fields(d, req, {"forecast_extension_reason"}, "dcf")
    if d["basis"] not in ("FCFF", "FCFE"): _fail("FIELD_INVALID", "dcf.basis", "must be FCFF or FCFE")
    expected = "WACC" if d["basis"] == "FCFF" else "KE"
    if d["discount_rate_type"] != expected: _fail("RATE_BASIS_MISMATCH", "dcf.discount_rate_type", f"{d['basis']} requires {expected}")
    rate = _num(d["discount_rate"], "dcf.discount_rate")
    if rate <= -1: _fail("FIELD_INVALID", "dcf.discount_rate", "must be greater than -1")
    _num(d["base_revenue"], "dcf.base_revenue"); rows = _arr(d["forecast"], "dcf.forecast")
    if p["mode"] == "standard" and (len(rows) < 5 or (len(rows) > 5 and not d.get("forecast_extension_reason"))): _fail("FORECAST_COUNT_INVALID", "dcf.forecast", "standard requires five periods unless extension reason is supplied")
    if p["mode"] == "audit" and len(rows) < 3: _fail("FORECAST_COUNT_INVALID", "dcf.forecast", "audit requires at least three periods")
    if d.get("forecast_extension_reason") is not None: _str(d["forecast_extension_reason"], "dcf.forecast_extension_reason")
    if "relative_cross_checks" in p:
        checks = _arr(p["relative_cross_checks"], "relative_cross_checks")
        for i, check in enumerate(checks):
            check = _obj(check, f"relative_cross_checks[{i}]")
            _fields(check, {"id", "name", "kind", "value_basis", "value", "note"}, set(), f"relative_cross_checks[{i}]")
            for key in ("id", "name", "kind", "value_basis", "note"): _str(check[key], f"relative_cross_checks[{i}].{key}")
            _num(check["value"], f"relative_cross_checks[{i}].value")
    if "reverse_valuation" in p:
        reverse = _obj(p["reverse_valuation"], "reverse_valuation")
        _fields(reverse, {"forward_price"}, set(), "reverse_valuation")
        _num(reverse["forward_price"], "reverse_valuation.forward_price")
    common = {"period", "discount_period", "growth", "da_revenue", "capex_revenue", "delta_nwc_revenue"}; needed = common | ({"operating_margin", "cash_tax_rate"} if d["basis"] == "FCFF" else {"net_margin", "net_borrowing"})
    previous_discount_period = 0.0
    for i, row in enumerate(rows):
        row = _obj(row, f"dcf.forecast[{i}]"); _fields(row, needed, set(), f"dcf.forecast[{i}]"); _str(row["period"], f"dcf.forecast[{i}].period")
        for key in needed - {"period"}: _num(row[key], f"dcf.forecast[{i}].{key}")
        if row["discount_period"] <= previous_discount_period: _fail("FORECAST_TIMING_INVALID", f"dcf.forecast[{i}].discount_period", "must be positive and strictly increasing")
        previous_discount_period = row["discount_period"]
    terminal = _obj(d["terminal"], "dcf.terminal"); tneeded = {"growth", "da_revenue", "capex_revenue", "delta_nwc_revenue", "return_metric", "return_rate"} | ({"operating_margin", "cash_tax_rate"} if d["basis"] == "FCFF" else {"net_margin", "net_borrowing"})
    _fields(terminal, tneeded, set(), "dcf.terminal")
    for key in tneeded - {"return_metric"}: _num(terminal[key], "dcf.terminal." + key)
    if terminal["return_metric"] != ("ROIC" if d["basis"] == "FCFF" else "ROE"): _fail("RATE_BASIS_MISMATCH", "dcf.terminal.return_metric", "return metric conflicts with basis")
    if terminal["return_rate"] <= 0: _fail("FIELD_INVALID", "dcf.terminal.return_rate", "must be positive")
    if terminal["growth"] >= rate: _fail("TERMINAL_RATE_INVALID", "dcf.terminal.growth", "must be below discount rate")
    s = _obj(d["sensitivity"], "dcf.sensitivity"); _fields(s, {"discount_rates", "terminal_growth_rates"}, set(), "dcf.sensitivity")
    rates = [_num(x, f"dcf.sensitivity.discount_rates[{i}]") for i, x in enumerate(_arr(s["discount_rates"], "dcf.sensitivity.discount_rates"))]
    gs = [_num(x, f"dcf.sensitivity.terminal_growth_rates[{i}]") for i, x in enumerate(_arr(s["terminal_growth_rates"], "dcf.sensitivity.terminal_growth_rates"))]
    if len(rates) != 3 or len(gs) != 3 or rates != sorted(rates) or gs != sorted(gs) or len(set(rates)) != 3 or len(set(gs)) != 3 or rates[1] != rate or gs[1] != terminal["growth"] or any(g >= r for r in rates for g in gs): _fail("SENSITIVITY_GRID_INVALID", "dcf.sensitivity", "must be distinct ascending values centered on base assumptions")

def _irr(cashflows):
    def npv(r): return sum(v / (1+r)**i for i, v in enumerate(cashflows))
    lo, hi = -.999999, 1.0
    while npv(hi) > 0 and hi < 1_000_000: hi *= 2
    if npv(lo) * npv(hi) > 0: _fail("IRR_UNSOLVABLE", "scenarios", "cash flows do not have a solvable IRR")
    for _ in range(200):
        mid = (lo+hi)/2
        if npv(mid) > 0: lo = mid
        else: hi = mid
    return (lo+hi)/2

def _forecast(d, rate, g_override=None):
    revenue, out, explicit = float(d["base_revenue"]), [], 0.0; fcfe = d["basis"] == "FCFE"
    for source in d["forecast"]:
        revenue *= 1 + source["growth"]
        d_and_a = revenue * source["da_revenue"]
        capex = revenue * source["capex_revenue"]
        delta_nwc = revenue * source["delta_nwc_revenue"]
        if fcfe:
            net_income = revenue * source["net_margin"]; cf = net_income + d_and_a - capex - delta_nwc + source["net_borrowing"]
            row = {"period": source["period"], "revenue": revenue, "growth": source["growth"],
                   "net_margin": source["net_margin"], "net_income": net_income, "d_and_a": d_and_a,
                   "capex": capex, "delta_nwc": delta_nwc, "net_borrowing": source["net_borrowing"], "fcfe": cf}
        else:
            ebit = revenue*source["operating_margin"]; nopat = ebit*(1-source["cash_tax_rate"]); cf = nopat + d_and_a - capex - delta_nwc
            row = {"period": source["period"], "revenue": revenue, "growth": source["growth"],
                   "operating_margin": source["operating_margin"], "ebit": ebit, "nopat": nopat,
                   "d_and_a": d_and_a, "capex": capex, "delta_nwc": delta_nwc, "net_borrowing": 0.0, "fcff": cf}
        factor = 1/(1+rate)**source["discount_period"]; row.update(discount_factor=factor, pv=cf*factor); out.append(row); explicit += cf*factor
    t = d["terminal"]; g = t["growth"] if g_override is None else g_override; terminal_revenue = revenue*(1+g)
    margin = (t["net_margin"] + t["da_revenue"] - t["capex_revenue"] - t["delta_nwc_revenue"] + t["net_borrowing"]/terminal_revenue if fcfe else t["operating_margin"]*(1-t["cash_tax_rate"]) + t["da_revenue"] - t["capex_revenue"] - t["delta_nwc_revenue"])
    tcf = terminal_revenue*margin; tv = tcf/(rate-g); factor = 1/(1+rate)**d["forecast"][-1]["discount_period"]
    return out, explicit, tv, tv*factor, terminal_revenue, margin

def _bridge(b): return b["excess_cash"]+b["non_operating_investments"]-b["debt"]-b["minority_interest"]-b["other_claims"]+sum(x["amount"] for x in b["additional_equity_adjustments"])
def _adjustments(b): return sum((x["amount"] for x in b["additional_equity_adjustments"]), 0.0)

def _finite(value, path="results"):
    if isinstance(value, float) and not math.isfinite(value): _fail("NUMBER_NOT_FINITE", path, "calculation produced a non-finite result")
    if isinstance(value, dict):
        for key, item in value.items(): _finite(item, f"{path}.{key}")
    elif isinstance(value, list):
        for index, item in enumerate(value): _finite(item, f"{path}[{index}]")
    return value

def _scenarios(p):
    source, price = p["scenarios"], p["market"]["current_price"]; horizon = int(source["horizon"]); items = source["items"]
    weighted_dividends = [sum(v["probability"]*v["dividends"][i] for v in items.values()) for i in range(horizon)]; weighted_exit = sum(v["probability"]*v["exit_value"] for v in items.values()); output = {}
    for name, item in items.items():
        flows = [-price]+item["dividends"][:-1]+[item["dividends"][-1]+item["exit_value"]]; output[name] = {"probability": item["probability"], "dividends": list(item["dividends"]), "cash_flows": flows, "ending_value": item["exit_value"], "expected_return": (item["exit_value"] + sum(item["dividends"]) - price) / price, "irr": _irr(flows)}
    flows = [-price]+weighted_dividends[:-1]+[weighted_dividends[-1]+weighted_exit]
    return {"method": "Bisection IRR on scenario cash flows and probability-weighted cash flows", "horizon_years": horizon, "scenarios": output, "base_irr": output["base"]["irr"], "probability_weighted_ending_value": weighted_exit, "probability_weighted_dividends": weighted_dividends, "probability_weighted_expected_return": (weighted_exit + sum(weighted_dividends) - price) / price, "probability_weighted_cash_flows": flows, "probability_weighted_irr": _irr(flows)}

def _mos(value, mos): return {"required": mos["required"], "high_conviction": mos["high_conviction"], "attractive_price": value*(1-mos["required"]), "high_conviction_price": value*(1-mos["high_conviction"])}

def _reverse(p, dcf_result):
    d, m, u = p["dcf"], p["market"], p["units"]; price = p.get("reverse_valuation", {}).get("forward_price", m["current_price"]); _num(price, "reverse_valuation.forward_price")
    target_equity = price*m["diluted_shares"]/u["fx_to_quote"]; target = target_equity-(_bridge(p["bridge"]) if d["basis"] == "FCFF" else _adjustments(p["bridge"]))
    required_pv = target-dcf_result["explicit_pv"]; factor = 1/(1+d["discount_rate"])**d["forecast"][-1]["discount_period"]; required_tv = required_pv/factor; g, r = d["terminal"]["growth"], d["discount_rate"]
    _, _, _, _, terminal_revenue, margin = _forecast(d, r)
    implied_margin = required_tv*(r-g)/terminal_revenue
    last_revenue = dcf_result["forecast"][-1]["revenue"]
    terminal = d["terminal"]
    fixed_borrowing = terminal["net_borrowing"] if d["basis"] == "FCFE" else 0.0
    # Net borrowing is an absolute amount, not a revenue-linked margin.
    operating_cf_margin = (terminal["net_margin"] + terminal["da_revenue"] - terminal["capex_revenue"] - terminal["delta_nwc_revenue"]) if d["basis"] == "FCFE" else margin
    revenue_linked_cf = operating_cf_margin * last_revenue
    denominator = required_tv + revenue_linked_cf
    implied_g = (required_tv*r - revenue_linked_cf - fixed_borrowing)/denominator if denominator else None
    warnings=[]
    if required_tv <= 0: warnings.append("Required terminal value is non-positive; reverse assumptions are not economically meaningful.")
    if abs(implied_margin) > 1: warnings.append("Implied terminal cash-flow margin is extreme.")
    if implied_g is None or abs(implied_g) > .1 or (implied_g is not None and implied_g >= r): warnings.append("Implied terminal growth is impossible or extreme.")
    return {"assumptions_held_constant": "Explicit forecast, discount rate, bridge, FX, diluted shares, and all non-terminal assumptions.", "input_price": price, "input_price_source": "reverse_valuation.forward_price", "growth_period_years": d["forecast"][-1]["discount_period"], "required_terminal_value": required_tv, "required_terminal_cash_flow": required_tv*(r-g), "implied_terminal_cash_flow_margin": implied_margin, "implied_terminal_growth": implied_g, "return_metric": d["terminal"]["return_metric"], "return_rate": d["terminal"]["return_rate"], "implied_reinvestment_rate": implied_g/d["terminal"]["return_rate"] if implied_g is not None else None, "warnings": warnings}

def _dcf(p):
    _validate_dcf(p); d, b, u, m = p["dcf"], p["bridge"], p["units"], p["market"]; rate = d["discount_rate"]; rows, explicit, tv, tpv, _, _ = _forecast(d, rate); gross = explicit+tpv; equity = gross+(_bridge(b) if d["basis"] == "FCFF" else _adjustments(b)); per_share = equity*u["fx_to_quote"]/m["diluted_shares"]
    _, _, _, _, terminal_revenue, terminal_margin = _forecast(d, rate)
    terminal = {"revenue": terminal_revenue, "growth": d["terminal"]["growth"], "margin": terminal_margin,
                "cash_flow": terminal_revenue * terminal_margin, "return_metric": d["terminal"]["return_metric"],
                "return_rate": d["terminal"]["return_rate"],
                "implied_reinvestment_rate": d["terminal"]["growth"] / d["terminal"]["return_rate"],
                "value": tv, "present_value": tpv, "value_share": tpv/gross if gross else 0.0}
    values=[]
    for sr in d["sensitivity"]["discount_rates"]:
        line=[]
        for sg in d["sensitivity"]["terminal_growth_rates"]:
            _, pv, _, stpv, _, _ = _forecast(d, sr, sg); line.append((pv+stpv+(_bridge(b) if d["basis"] == "FCFF" else _adjustments(b)))*u["fx_to_quote"]/m["diluted_shares"])
        values.append(line)
    result = {"status":"ok", "basis":d["basis"], "discount_rate_type":d["discount_rate_type"], "discount_rate":rate, "forecast":rows, "terminal":terminal, "explicit_pv":explicit, "terminal_value":tv, "terminal_pv":tpv, "terminal_value_share":tpv/gross if gross else 0.0, "implied_reinvestment_rate":d["terminal"]["growth"]/d["terminal"]["return_rate"], "equity_value":equity, "per_share_value":per_share, "sensitivity":{"discount_rates":d["sensitivity"]["discount_rates"], "terminal_growth_rates":d["sensitivity"]["terminal_growth_rates"], "values":values}}
    if d["basis"] == "FCFF": result["enterprise_value"] = gross
    if d.get("forecast_extension_reason") is not None: result["forecast_extension_reason"] = d["forecast_extension_reason"]
    cross_checks=[]
    for check in p.get("relative_cross_checks", []):
        value=check["value"]
        if check["value_basis"] == "per_share": per=value
        elif check["value_basis"] == "enterprise_value": per=(value+_bridge(b))*u["fx_to_quote"]/m["diluted_shares"]
        elif check["value_basis"] == "equity_value": per=value*u["fx_to_quote"]/m["diluted_shares"]
        else: _fail("FIELD_INVALID", "relative_cross_checks.value_basis", "unsupported value basis")
        cross_checks.append(dict(check, per_share_value=per))
    warnings=[]
    if any(row.get("ebit", 0)<0 and d["forecast"][i]["cash_tax_rate"]>0 for i,row in enumerate(rows)): warnings.append("Negative EBIT with a positive cash tax rate implies a tax benefit in NOPAT; validate recoverability or use a zero cash tax rate.")
    if result["terminal_value_share"] > .8: warnings.append("Terminal value share is high.")
    reconciliation = {"primary_method":"dcf", "primary_per_share_value":per_share, "cross_check_per_share_values":[x["per_share_value"] for x in cross_checks],
                      "value_basis": "enterprise_value" if d["basis"] == "FCFF" else "equity_value",
                      "equity_value": equity, "excess_cash": b["excess_cash"],
                      "non_operating_investments": b["non_operating_investments"], "debt": b["debt"],
                      "minority_interest": b["minority_interest"], "other_claims": b["other_claims"],
                      "additional_equity_adjustments_total": _adjustments(b), "dilution_treatment": b["dilution_treatment"],
                      "diluted_shares": m["diluted_shares"], "fx_to_quote": u["fx_to_quote"]}
    if d["basis"] == "FCFF": reconciliation["enterprise_value"] = gross
    output = {"dcf":result, "relative_cross_checks":cross_checks, "reconciliation":reconciliation, "scenarios":_scenarios(p), "margin_of_safety":_mos(per_share,p["margin_of_safety"])}
    if "reverse_valuation" in p: output["reverse_valuation"] = _reverse(p,result)
    return output, warnings

def _sector(p):
    _validate_common(p, True)
    if p["route"] != "sector_adaptive": _fail("ROUTE_CONFLICT", "route", "sector valuation route must be sector_adaptive")
    for key in ("sector_dcf_unsuitable_reason","primary_method_id","methods","reverse_multiple"):
        if key not in p: _fail("NON_DCF_METHODS_MISSING", key, "required for sector adaptive valuation")
    _str(p["sector_dcf_unsuitable_reason"], "sector_dcf_unsuitable_reason"); _str(p["primary_method_id"], "primary_method_id"); methods=[]
    for i, method in enumerate(_arr(p["methods"], "methods")):
        method=_obj(method, f"methods[{i}]"); _fields(method,{"id","name","kind","value_basis","value","note"},set(),f"methods[{i}]")
        for key in ("id","name","kind","value_basis","note"): _str(method[key],f"methods[{i}].{key}")
        value=_num(method["value"],f"methods[{i}].value")
        if method["value_basis"] not in ("equity_value","per_share"): _fail("FIELD_INVALID",f"methods[{i}].value_basis","sector methods require equity_value or per_share; reconcile enterprise value to equity before input")
        per_share=value if method["value_basis"]=="per_share" else value*p["units"]["fx_to_quote"]/p["market"]["diluted_shares"]; methods.append(dict(method,per_share_value=per_share))
    primary_ids = {x["id"] for x in methods if x["kind"] == "intrinsic"}
    if not primary_ids or not any(x["kind"] in ("relative","reverse") for x in methods) or p["primary_method_id"] not in primary_ids: _fail("NON_DCF_METHODS_MISSING","methods","must select an intrinsic primary and include a relative or reverse method")
    rev=_obj(p["reverse_multiple"],"reverse_multiple"); _fields(rev,{"metric_name","metric_per_share"},set(),"reverse_multiple"); _str(rev["metric_name"],"reverse_multiple.metric_name"); metric=_num(rev["metric_per_share"],"reverse_multiple.metric_per_share")
    if metric == 0: _fail("FIELD_INVALID", "reverse_multiple.metric_per_share", "must not be zero")
    primary=next(x for x in methods if x["id"]==p["primary_method_id"]); vals=[x["per_share_value"] for x in methods]; spread=max(vals)-min(vals); warnings=["Large reconciliation spread across valuation methods."] if min(vals) and spread/abs(min(vals))>.5 else []
    market_implied_multiple = p["market"]["current_price"] / metric
    primary_implied_multiple = primary["per_share_value"] / metric
    return {"dcf":{"status":"not_applicable","reason":p["sector_dcf_unsuitable_reason"],"alternative_method":primary["id"]},"methods":methods,"market_implied_multiple":market_implied_multiple,"reverse_valuation":{"method":"market-implied-multiple","value_basis":"per_share","metric_name":rev["metric_name"],"metric_per_share":metric,"market_implied_multiple":market_implied_multiple,"primary_method_id":primary["id"],"primary_implied_multiple":primary_implied_multiple,"multiple_gap":market_implied_multiple-primary_implied_multiple},"reconciliation":{"primary_method_id":primary["id"],"primary_per_share_value":primary["per_share_value"],"minimum_per_share_value":min(vals),"maximum_per_share_value":max(vals),"spread":spread},"scenarios":_scenarios(p),"margin_of_safety":_mos(primary["per_share_value"],p["margin_of_safety"])}, warnings

def calculate(payload: dict) -> dict:
    try:
        p=_obj(payload,"$"); route=p.get("route")
        if route=="dcf": results,warnings=_dcf(p)
        elif route=="sector_adaptive": results,warnings=_sector(p)
        else: _fail("ROUTE_CONFLICT","route","must be dcf or sector_adaptive")
        return _finite({"schema_version":"valuation.v1","engine_version":ENGINE_VERSION,"status":"ok","mode":p["mode"],"route":route,"units":p["units"],"market":p["market"],"results":results,"warnings":warnings,"errors":[]})
    except (OverflowError, ZeroDivisionError):
        _fail("NUMBER_NOT_FINITE", "results", "calculation produced a non-finite result")

def _error_output(error): return {"schema_version":"valuation.v1","engine_version":ENGINE_VERSION,"status":"error","mode":None,"route":None,"units":{},"results":{},"warnings":[],"errors":[{"code":error.code,"path":error.path,"message":error.message}]}
def main():
    parser=argparse.ArgumentParser(); parser.add_argument("input"); parser.add_argument("--output"); args=parser.parse_args()
    try:
        with open(args.input,encoding="utf-8") as f: output=calculate(json.load(f)); code=0
    except json.JSONDecodeError as exc: output,code=_error_output(ModelError("JSON_INVALID","$","invalid JSON: "+exc.msg)),2
    except ModelError as exc: output,code=_error_output(exc),2
    except Exception: return 1
    text=json.dumps(output,ensure_ascii=False,allow_nan=False,indent=2)
    if args.output:
        with open(args.output,"w",encoding="utf-8") as f: f.write(text+"\n")
    else: print(text)
    return code
if __name__=="__main__": raise SystemExit(main())
