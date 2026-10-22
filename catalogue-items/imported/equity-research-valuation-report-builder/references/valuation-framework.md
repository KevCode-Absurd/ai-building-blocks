# 估值框架

估值回答当前价格计入了什么、不同情景的回报是否补偿风险，不制造单点精确目标价。统一 `As of` 日期、币种、汇率、股本、净债务、少数股东权益和稀释口径，并展示公式与输入来源。

## 方法路由

- 稳定现金流：DCF、FCF yield、EV/EBIT。
- 高增长/SaaS：DCF、EV/Revenue、EV/FCF，连接增长、长期利润率、SBC 和每股稀释。
- 金融：P/B、P/TBV、P/E、DDM 或 Excess Return，连接 ROE、资本和信用成本；不机械套用工业企业 FCFF。
- REIT：P/AFFO、NAV、资本化率。
- 周期/资源：中周期利润、NAV、单位成本。
- 亏损/生物科技：风险调整 NPV、现金跑道和里程碑。

至少用一种内在价值方法与一种相对或反向方法交叉验证；不适用时明确说明原因与替代方法。不使用 DCF 时写成 `DCF not applicable — Reason: ... — Alternative method: ...`（或对应中文字段），不得只写“不适用”。只在选用 DCF 时强制执行下文 DCF 的逐年预测、终值和敏感性规则。

## 现金流与折现率必须匹配

### FCFF 路径

`EBIT − Cash Tax = NOPAT`

`NOPAT + D&A − Capex − ΔNWC = FCFF`

- 用 **WACC** 折现得到 Enterprise Value。
- `Enterprise Value + Excess Cash + Non-operating Investments − Debt − Minority Interest − Other Claims = Equity Value`。
- 说明现金、投资资产和债务的时点、折价与重复计算检查。

### FCFE 路径

`Net Income + D&A − Capex − ΔNWC + Net Borrowing = FCFE`

- 用 **Cost of Equity / Ke** 折现，直接得到 Equity Value。
- 不得再机械加回已经反映在 FCFE 的现金或净债务变化；单独加入非经营投资时说明未被现金流包含。

不得用 FCFE 配 WACC，也不得用 FCFF 配 Cost of Equity。不同方法只能在各自口径完成后做交叉验证，不拼成一条混合 DCF。

## 逐年预测与可复算性

Standard 非金融 DCF 默认恰好 5 个显式预测年；少于 5 年不能作为完整 Standard DCF。超过 5 年必须填写 `dcf.forecast_extension_reason`，说明行业特性或用户明确要求。Audit 可延长预测期、使用分段折现期并展示完整桥接。

LLM 生成假设，运行 `python3 scripts/valuation_model.py valuation-input.json --output valuation-result.json`。输入结构从 [Standard 样例](../tests/fixtures/standard-valuation-input.json) 或 [行业样例](../tests/fixtures/sector-valuation-input.json) 取用；字段/输出参考 [report-schema.md](report-schema.md)。样例均为合成数据，不能当作真实披露。金额与股数须同一缩放单位；汇率为 model currency → quote currency。Capex、ΔNWC 正值表示现金流出，Net Borrowing 正值表示 FCFE 流入。

`reverse_valuation.forward_price` 是反向求解输入价格：日常市场隐含预期应填研究截止日市场价；可用其他价格做条件诊断，但须明确不是当前市场隐含预期。`scenarios.items.*.exit_value` 是持有期末价值，不是今天的 DCF 现值；须有退出假设支持，不能机械复制 Fair Value。

`discount_period` 必须为正且严格递增，Audit 可含小数折现期。当前 IRR 求解器仅支持初始买入后非负的分红/分配与退出价值；负分配或多次资本注入不在此接口范围内，应另行披露与复算。FCFE 反推终值增长时保持绝对金额 Net Borrowing 不变，不把它误作收入比例。

valuation-result.json 独占机械结果：市场数据、DCF/终值、3×3 sensitivity、Reverse Valuation、情景 Expected Return/IRR、安全边际与对账。原始假设和完整机器结果与 HTML 一起保留便于复算；Standard 主文只展示关键结果，不重复公式。sector_adaptive 的方法输入须为已对账的 equity_value 或 per_share，行业特定内在价值计算需在假设中解释，不能把 EV 直接当 Equity。

完整 DCF 展示每个明示预测年；预测期长度按行业和稳态到达时间设定，不隐藏线性过渡、快速回归或中周期正常化假设。

| Year | Revenue | Growth | Operating / Net Margin | EBIT / Net Income | D&A | Capex | ΔNWC | Net Borrowing | FCFF / FCFE | Discount Factor | PV |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|

Audit 对每个主要假设给出 `Assumption ID｜Parameter｜Bear｜Base｜Bull｜Evidence / Calculation｜As of｜Rationale｜Scenario Link`。Standard 在主文列 Assumption ID、Assumption、Value、Evidence IDs，情景中解释经营与估值差异，完整参数保存在结构化文件；不得让读者猜测未披露假设。

## 利润率 Bridge

对逐年改善或恶化的核心利润率，展示：

`Current Margin + Volume / Utilization + Price + Product Mix + Productivity − New Capacity Ramp − SBC − Other Costs = Normalized Margin`

能量化时给出百分点贡献与来源；无法可靠量化时使用定性 Bridge，明示其为 Inference 并降低置信度，不制造伪精确数字。

## SBC、回购与稀释

特别对 SaaS 和股权激励密集公司，同时展示 SBC、Gross Buybacks、Net Share Count、Diluted Shares、Convertible Debt 和 Employee Awards。说明 SBC 在现金流、利润率与每股估值中的处理，不得在一处加回、另一处又忽略稀释。

## Terminal Value

完整 DCF 披露 Terminal Growth、Discount Rate、Terminal Margin、Terminal ROIC / Reinvestment 假设和 Terminal Value 占总估值比例。检查 `g < discount rate`；终值占比过高时，显著提示估值对远期假设的敏感性。

## Sensitivity 与 Reverse Valuation

完整 DCF 展示 3×3 `Discount Rate × Terminal Growth`。Standard 最重要的经营变量压力体现在 Bear/Base/Bull 中；Audit 另列 Operating Sensitivity 并回链 Thesis。

所有方法均保留 Reverse Valuation。DCF 反向检查 Equity / EV、FCFF / FCFE 与折现率一致性，比较增长期、稳态现金流率、再投资与 ROIC/ROE；脚本分别求固定增长下的隐含利润率、固定利润率下的隐含增长，不能当作市场唯一预测。银行/保险用 P/TBV、P/GEV、股息或超额回报等适配方法的隐含预期，保留市价/日期、方法/价值口径、隐含假设、基准比较和结论；不强制 DCF-only 字段。

## Bear / Base / Bull 投资情景

情景必须改变经营假设，不只改倍数或折现率。展示：

| Scenario | Probability | Operating Assumptions | Valuation Assumptions | Value / Share | Holding Period | Dividends | Expected Return | IRR | Trigger / Falsifier |
|---|---:|---|---|---:|---:|---:|---:|---:|---|

- Bear / Base / Bull 概率合计 100%；每个概率说明证据与 `As of` 日期。
- `Expected Value = Σ(Scenario Probability × Scenario Value)`。
- `Expected Return = (Expected Value + Expected Dividends − Current Price) / Current Price`。
- 至少报告可解析百分比形式的 **Base IRR** 与 **Probability-weighted IRR**。Probability-weighted IRR 应展示计算方法、概率加权期末价值与各期股息现金流，并据此重新求 IRR；不直接算术平均三个情景 IRR。
- 持有期可按研究问题设为 3–5 年或其他合理区间；必须展示具体期限，股息时点与再投资假设。

## Margin of Safety

分开：

- **Fair Value**：Base 情景下的估计内在价值。
- **Attractive Price**：在所需安全边际后的研究进入区间。
- **High-Conviction Price**：在更严格风险补偿与证据门槛下的价格。

安全边际结合 Business Quality、Forecast Confidence、Cyclicality、Policy Risk、Balance Sheet、Valuation Sensitivity 和证据可比性。可以参考低/中/高不确定性区间，但不机械套用固定百分比；必须解释为什么这家公司需要该安全边际。

## 估值调节表

最后用一张调节表说明不同方法的价值口径、股数、净现金/净债务、少数股东权益、非经营投资、汇率与每股价值。对方法间差异给出原因，不用简单平均隐藏口径冲突。
