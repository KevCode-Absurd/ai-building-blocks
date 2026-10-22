# 财务分析

## 顺序

先做 Metric Definition Continuity，再统一期间、币种、持续经营和 GAAP/IFRS 口径；建立 3–5 年与 4–8 季度序列；计算指标；把变化拆为销量、价格、组合、成本、汇率、并购和一次性因素；用现金流和资产负债表验证利润。

资料确实不足时，不用一句“证据不足”绕过历史覆盖。分别写明 `Coverage: 实际期间｜Reason: 缺失原因｜证据不足`，并说明它如何限制趋势判断。

## Metric Definition Continuity

Standard 只覆盖最重要且影响判断的 5–6 个指标；Audit 扩展到所有需要解决的重大口径问题，不适用 Standard 上限。计算公式、输入、期间与来源只记录一次，机械计算交给脚本；主文解释变化及投资含义。

任何核心 KPI 跨期比较前，检查它们是否真的是“同一个东西”：

- Definition、Scope、Segment 和 Product coverage。
- Accounting treatment、Reporting basis 和 Currency basis。
- Continuing / discontinued operations、Restatement 以及 Acquisition / disposal impact。
- 报告频率、计量时点、表示单位与管理层后续重新定义。

每个核心时间序列在表格中记录：`Metric｜Periods｜Definition / Scope Change｜Comparability Status｜Adjustment｜Source`。`Comparability Status` 只能为：

- **Comparable**：口径一致，可严格比较。
- **Partially Comparable**：存在可识别但无法完全重述的差异；趋势仅具方向性。
- **Not Comparable**：定义或范围变化使增长率失去意义；分开展示，不计算跨期增长。

定义改变时不得直接写“A 上升至 B”。应写明两期各自口径、差异、是否重述，并说明趋势是严格可比还是仅具方向性。停止披露是待调查信号，不自动等于恶化。

## 指标

- 增长：同比、环比、CAGR、有机增长。
- 盈利：毛利率、营业/净利率、增量利润率。
- 效率：应收/库存/应付天数、现金转换周期、资产周转。
- 杠杆：净债务、净债务/EBITDA、利息保障、流动/速动比率。
- 现金：经营现金流、FCF、FCF 利润率、现金转换率。
- 回报：ROE、ROA、ROIC；说明平均余额、税率和投入资本定义。

可运行 `python scripts/financial_metrics.py --help`。除数为零或数据缺失时不擅自填零。

## 盈利质量红旗

利润增长但现金落后；应收/库存快于收入；长期“非经常”调整；收购掩盖有机疲弱；回购仅抵消稀释；供应商融资、保理、资本化或口径变化美化结果。

每项重要指标给出公式、期间、来源、结果和解释。金融、REIT、资源等优先行业 KPI。

## 三表与每股价值验证

根据行业连接真正相关的利润表、资产负债表和现金流项目，例如 Revenue ↔ Receivables / Inventory / Contract Liabilities ↔ OCF，或 Net Income ↔ SBC / Capex / 并购现金支出 ↔ Net Share Count。不为填满清单而分析不适用项目。

同时展示 Gross Buybacks、SBC / Employee Awards、Diluted Shares 和 Net Share Count 的变化，用每股价值而非只看公司总量判断回购是否真正创造价值。
