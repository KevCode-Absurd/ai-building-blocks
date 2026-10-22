#!/usr/bin/env python3
"""零依赖财务指标计算库与 CLI；金额保持相同单位。"""
from __future__ import annotations
import argparse, json
from typing import Optional

def safe_div(a: float, b: float) -> Optional[float]: return None if b == 0 else a / b
def growth(current: float, prior: float): return safe_div(current - prior, abs(prior))
def cagr(ending: float, beginning: float, years: float):
    return None if beginning <= 0 or ending < 0 or years <= 0 else (ending / beginning) ** (1 / years) - 1
def margin(profit: float, revenue: float): return safe_div(profit, revenue)
def roe(net_income: float, avg_equity: float): return safe_div(net_income, avg_equity)
def roa(net_income: float, avg_assets: float): return safe_div(net_income, avg_assets)
def roic(nopat: float, avg_invested_capital: float): return safe_div(nopat, avg_invested_capital)
def free_cash_flow(ocf: float, capex: float): return ocf - abs(capex)
def cash_conversion(net_income: float, ocf: float): return safe_div(ocf, net_income)
def turnover_days(balance: float, flow: float, days: float = 365):
    x = safe_div(balance, flow); return None if x is None else x * days
def cash_conversion_cycle(dso: float, dio: float, dpo: float): return dso + dio - dpo
def current_ratio(assets: float, liabilities: float): return safe_div(assets, liabilities)
def quick_ratio(cash: float, securities: float, receivables: float, liabilities: float): return safe_div(cash + securities + receivables, liabilities)
def net_debt(debt: float, cash: float): return debt - cash
def interest_coverage(ebit: float, interest: float): return safe_div(ebit, abs(interest))

FUNCTIONS = {"growth":(growth,2),"cagr":(cagr,3),"margin":(margin,2),"roe":(roe,2),"roa":(roa,2),"roic":(roic,2),"free_cash_flow":(free_cash_flow,2),"cash_conversion":(cash_conversion,2),"turnover_days":(turnover_days,(2,3)),"cash_conversion_cycle":(cash_conversion_cycle,3),"current_ratio":(current_ratio,2),"quick_ratio":(quick_ratio,4),"net_debt":(net_debt,2),"interest_coverage":(interest_coverage,2)}

def main():
    p=argparse.ArgumentParser(description="计算常用财务指标；比率以小数输出。")
    p.add_argument("metric",choices=sorted(FUNCTIONS)); p.add_argument("values",nargs="+",type=float); p.add_argument("--percent",action="store_true")
    a=p.parse_args(); fn,n=FUNCTIONS[a.metric]; valid=len(a.values) in n if isinstance(n,tuple) else len(a.values)==n
    if not valid: p.error(f"{a.metric} 参数数量应为 {n}")
    result=fn(*a.values)
    if result is not None and a.percent: result*=100
    print(json.dumps({"metric":a.metric,"result":result},ensure_ascii=False)); return 0
if __name__=="__main__": raise SystemExit(main())
