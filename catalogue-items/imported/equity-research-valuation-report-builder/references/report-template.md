# 股票研究报告内容合约

完整研究默认输出 self-contained HTML；LLM 写 compact JSON，由 Python renderer 和固定 HTML/CSS 模板排版。仅当用户明确要求 Markdown 时按同一研究合约输出 .md。

## 生成规则

1. 按 [report-schema.md](report-schema.md) 生成 report-content.json；mode 必须为 standard 或 audit。示例文件是合成测试资料，不能引用为事实。
2. valuation-input.json → valuation_model.py → valuation-result.json；后者是全部估值数字唯一来源。LLM 只写证据、假设、解释，不重复手算。
3. renderer 负责 HTML、CSS、来源/Thesis 回链、导航、表格、badges、print 样式、格式化数字、哈希与 provenance。不得手写或修补页面样板、data 属性、CSS；纠正 JSON 后重渲染。
4. 默认无图表、JS、SVG、canvas 或外部资源依赖。Standard 用 5 年精简 DCF，Audit 用完整桥接；金融等行业不生成空 DCF 表。
5. 报告保留相邻的原始输入/结果 JSON 以供复算，必要时附机器参数；主文不重复公式或分析。证据不足不能用占位符、TBD 或空断言表掩盖。

```bash
python3 scripts/valuation_model.py valuation-input.json --output valuation-result.json
python3 scripts/render_report.py report-content.json --valuation valuation-result.json --output report.html
python3 scripts/validate_report.py report.html --strict --as-of YYYY-MM-DD --source-json report-content.json --valuation-json valuation-result.json
```

严格验证对错误和 blocking warning 返回失败；来源独立性/质量、研究逻辑与重复分析等无法机器证明的判断是 non-blocking warning。提供两个原始 JSON 时检查哈希并与确定性重渲染结果比较；缺少原始 JSON 时只检查标记，并明确提示 provenance 尚未证明。

用户明确要求 Markdown 时：`python3 scripts/validate_report.py report.md --allow-markdown --strict --as-of YYYY-MM-DD`；不要求 renderer provenance。旧 V1.1 报告仅在显式 `--legacy-v11` 下检查，不自动猜测版本。

## 用户明确要求 Markdown 时的机器可审计语法

Markdown 仍执行同一研究纪律，并使用以下稳定写法：

- 模式单列：`Mode: Standard` 或 `Mode: Audit`；Update 仅为预留，不可作为 mode。
- 报告级日期单列：`研究截止：As of YYYY-MM-DD`。
- 五类正文证据：`[S01][Fact] 实质陈述`、`[S02][Management View] ...`、`[S03][Market View] ...`、`[S01][Calculation] ...`、`[S01][Inference] ...`。
- 来源锚点与条目分两行：先写 `<a id="S01"></a>`，再写 `[S01] Document → Publication date → Reporting period → Page / Section / Item / Table → URL / absolute local file → accessed YYYY-MM-DD`。
- IRR 单列 `基准 IRR：...%`、`概率加权 IRR：...%`、`计算方法：IRR(加权现金流)`、`概率加权期末价值：...` 与 `股息现金流：...`；英文等价字段同样可用。

## 报告结构

1. **执行摘要**：一句话判断、公司质量、股票价值、风险收益、核心 Thesis、估值区间、置信度、最大未知数。
2. **研究范围与证据**：证券、交易所、币种、期限、`As of YYYY-MM-DD`、资料覆盖、口径、缺口、冲突和五类证据标签。
3. **商业模式与行业需求**：保留 Business 分析，对核心行业判断加入 Industry Evidence Triangulation。
4. **竞争优势与战略**：护城河的证据、方向、反证与价值影响。
5. **MD&A、管理层与资本配置**：MD&A Delta Analysis 与 Management Promise Tracker。
6. **财务分析与盈利质量**：3–5 年、4–8 季度、Metric Definition Continuity、三表验证、盈利质量、ROIC 和每股价值。
7. **行业 KPI、趋势与拐点**：领先、确认、风险指标及其可比性。
8. **估值与市场隐含预期**：方法路由、现金流口径、可复算模型、交叉验证与行业适配的 Reverse Valuation。
9. **Bear / Base / Bull**：经营假设、概率、价值、期限、股息、Expected Return、Base IRR、Probability-weighted IRR 和触发/证伪。
10. **投资 Thesis 与 Bear Case**：Core Thesis Evidence Matrix，包含支持、反证、置信度和待验证事项。
11. **风险、催化剂与 Thesis Breakers**：每个 Breaker 链接 Trigger、Confirmation、Thesis / Scenario / Valuation Impact 与 Research Action。
12. **Investment Scorecard**：每个分数链接 Evidence ID、Counter-Evidence ID、Thesis ID、Confidence 和 Rationale / Gap。
13. **Decision & Monitoring Loop**：当前值、下次更新、Bull / Bear 阈值、Thesis / Valuation Impact 和 Research Action。
14. **结论与待验证事项**：分别给出公司质量与股票价值，区分 Fair Value、Attractive Price 与 High-Conviction Price。
15. **来源**：按原始资料优先，标注 Source ID、文档、发布日期、报告期、页码 / Section / Item / Table、URL 和访问日期。

## 内容字段参考

实际 JSON 字段与 renderer 列名见 report-schema.md；下列完整列为 Audit/Markdown 的内容参考。Standard 假设台账只显示 ID / Assumption / Value / Evidence，DCF 只显示 Year / Revenue / Growth / Margin / FCFF或FCFE / Discount Factor / PV，经营压力放在情景解释中。Audit 保留完整假设台账和单列经营敏感性。FCFE 对账展示股权价值及显式非经营调整，不重复展示 EV/现金/债务桥接；sector_adaptive 对账展示主方法、区间、差异与说明。

- **Thesis Evidence Matrix**：`Thesis ID｜Thesis｜Supporting Evidence IDs｜Counter Evidence IDs｜Evidence Type｜Confidence｜What Needs Validation`。
- **Metric Definition Continuity**：`Metric｜Periods｜Definition / Scope Change｜Comparability Status｜Adjustment｜Source ID`。
- **MD&A Delta**：`Topic｜Previous Period｜Current Period｜Change｜Interpretation｜Evidence IDs｜Alternative Explanation｜Validation Task`。
- **Management Promise Tracker**：`Promise ID｜Management Promise｜Promise Date｜Original Wording / Locator｜Due Date｜Subsequent Actual Result｜Evidence ID｜Status｜Assessment`。
- **Industry Triangulation**：`Industry Claim｜Company Evidence｜Competitor Evidence｜Independent Industry Data｜Agreement / Conflict｜Confidence｜Gap`。
- **Annual Financial History**：`Period｜Revenue｜Growth｜Margin｜OCF｜FCF｜ROIC｜Earnings Quality Note｜Source ID`；正常至少 3 个年度，目标 3–5 年。
- **Quarterly Financial History**：`Period｜Revenue｜Growth｜Margin｜OCF｜FCF｜ROIC｜Earnings Quality Note｜Source ID`；正常至少 4 个季度，目标 4–8 季度。
- **Valuation Assumption Ledger**：`Assumption ID｜Parameter｜Bear｜Base｜Bull｜Evidence / Calculation｜As of｜Rationale｜Scenario Link`。
- **DCF Forecast（仅选用 DCF 时）**：`Year｜Revenue｜Growth｜Operating / Net Margin｜EBIT / Net Income｜D&A｜Capex｜ΔNWC｜Net Borrowing｜FCFF / FCFE｜Discount Factor｜PV`。
- **Operating Sensitivity**：`Operating Variable｜Bear｜Base｜Bull｜Value Impact｜Thesis Link`。
- **Valuation Reconciliation**：`Method｜Value Basis｜EV / Equity Value｜Cash / Investments｜Debt / Other Claims｜Minority Interest｜SBC / Dilution Treatment｜Diluted Shares｜FX｜Value / Share｜Reconciliation Note`。
- **Decision Loop**：`Metric｜Current / As of｜Source ID｜Next Update｜Bull Threshold｜Bear Threshold｜Thesis Impact｜Valuation Impact｜Research Action`。
- **Thesis Breakers**：`Breaker｜Trigger｜Confirmation Window｜Thesis Impact｜Scenario Probability Impact｜Valuation Impact｜Research Action`。
- **Scorecard**：`Dimension｜Score｜Weight｜Evidence IDs｜Counter-Evidence IDs｜Thesis IDs｜Confidence｜Rationale / Gap`。

银行、保险、REIT、资源等行业若 Revenue、OCF、FCF 或 ROIC 不具决策意义，可在对应单元格明确写 `N/A — reason`，并补充行业专用 KPI；不得为填满通用表而制造指标。
