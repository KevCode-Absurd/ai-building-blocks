# 个人股票投资研究框架 V1.2

## Research Budget 与停止条件

模式优先级由 SKILL.md 决定；Standard 是日常首次研究默认值，Audit 保留 V1.1 全部研究纪律与必要深度。

| 项目 | Standard | Audit |
|---|---|---|
| Core Thesis | 3–4 条 | 按重大问题展开，无 Standard 上限 |
| Metric Continuity | 最重要的 5–6 个指标 | 所有影响结论的口径冲突 |
| MD&A Delta | 3–5 项关键变化 | 必要历史和冲突复核 |
| Promise Tracker | 通常 1–3 项 | 重要承诺完整追踪 |
| 独立行业验证 | 1–2 个同行 primary + 1 个独立行业来源 | 为解决不确定性扩展 |
| Decision Loop | 5–7 个可观察指标 | 按需要扩展 |
| DCF | 默认 5 个显式预测年 | 充分逐年桥接和必要延伸 |

Evidence Stop Rule：每条核心 Thesis 有一个高质量 primary evidence、一个 counter evidence 或真正独立验证、没有重大未解决冲突，即停止搜索。额外来源只用于解决冲突、修复口径或改变置信度/情景概率/估值。不要在证据足够后补第 4、第 5 个同行或行业来源。

复用已抓取文档、文本和 locator，只提取最相关页/章节。没有事实需要补足时，不重复打开同一文件。找不到证据则说明实际检索覆盖、Insufficient Evidence、Gap 和 Low confidence，不填造验证。

完整论证只在 Thesis authoritative section；Summary 为一句话引用，Scorecard 为索引，Conclusion 回链已有分析。Audit 同样不重复排版、计算或段落。

## 核心问题

这是什么生意？行业是否值得投资？公司是否优秀？基本面变好还是变差？价格隐含什么预期？风险收益是否合理？

## 研究模块

1. **范围**：证券、上市地、币种、报告期、截止日、投资期限、资料缺口。
2. **商业模式**：客户、价值主张、收费、经常性、单位经济、成本、资本强度、集中度。
3. **行业与需求**：历史规模/周期；当前订单/库存/预算；未来驱动、领先指标、时间窗与反证；供给、替代和监管。对影响核心 Thesis 的行业判断做 Independent Industry Validation。
4. **竞争与护城河**：份额、成本、差异化、转换成本、网络效应、品牌、资质、规模经济及其方向。
5. **MD&A 与管理层**：用财务数据验证解释；做 Previous → Current → Change → Interpretation 的 Delta Analysis；检查目标量化、承诺复盘、错误与不确定性披露、KPI 口径变化、激励和资本配置。
6. **财务与盈利质量**：检查核心时间序列可比性，连接三张表，解释增长、利润、周转、杠杆、现金流、ROIC 的驱动。
7. **趋势与拐点**：观察 3–5 年和 4–8 季度，区分季节、基数、一次性与结构变化；列领先、确认和证伪指标。
8. **预期与估值**：公司价值与股票价格分开；至少一种内在价值与一种相对/反向方法（不适用时说明），建立可复算 Bear / Base / Bull、概率、IRR 和安全边际。
9. **结论**：Thesis Evidence Matrix、Bear Case、催化剂、风险、Thesis Breakers、Decision & Monitoring Loop、估值区间和置信度。

## Independent Industry Validation

任何影响核心 Thesis 的行业判断，不得只依赖目标公司自身披露。对每项这类判断建立 Industry Evidence Triangulation：

| Industry Claim | Company Evidence | Competitor Evidence | Independent Industry Data | Agreement / Conflict | Confidence | Gap |
|---|---|---|---|---|---|---|

- Company Evidence 用于理解公司受到的具体影响，不因独立验证而降低原始披露的证据优先级。
- Competitor Evidence 选择商业模式、客户或地域有可比性的同行，说明不可比点。
- Independent Industry Data 优先政府、监管机构、行业协会或具有透明方法的第三方资料。
- 查找后仍无可靠数据时，明示 `Independent industry evidence unavailable / insufficient`，降低相关 Thesis 置信度；不用公司自身判断补位。

## Core Thesis Evidence Matrix

每一条真正影响投资结论的 Thesis 必须入表：

| Thesis ID | Thesis | Supporting Evidence IDs | Counter Evidence IDs | Evidence Type | Confidence | What Needs Validation |
|---|---|---|---|---|---|---|

每条支持与反证都连接 Source ID；没有找到反证不等于反证不存在，要说明搜索范围和证据缺口。`Confidence` 必须与证据质量、口径可比性和独立验证结果一致。

## Decision & Monitoring Loop

将 Watch Next 从“以后看什么”升级为“看到什么后改变哪个判断”：

| Metric | Current / As of | Source ID | Next Update | Bull Threshold | Bear Threshold | Thesis Impact | Valuation Impact | Research Action |
|---|---|---|---|---|---|---|---|---|

Research Action 是研究框架的决策含义，例如 `Reassess / Pause new conviction / Reduce confidence / Re-run valuation / Increase conviction`；不是个性化或强制交易指令。

每个 Thesis Breaker 对应：`Trigger｜Confirmation Window｜Thesis Impact｜Scenario Probability Impact｜Valuation Impact｜Research Action`。说明是单次数据还是连续多期确认，以及将如何重新分配 Bear / Base / Bull 概率。
