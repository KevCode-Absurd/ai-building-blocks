# 投资评分卡

评分用于暴露判断与缺口，不机械给出买卖结论。每项 1–5 分，写证据、反证和置信度；不足填 N/A。Scorecard 是已有研究的索引，不得在评分表中首次引入未分析的实质结论。

| 维度 | 权重 |
|---|---:|
| 行业与需求 | 15% |
| 商业模式与护城河 | 15% |
| 财务质量 | 15% |
| 管理层与资本配置 | 10% |
| 趋势与拐点 | 15% |
| 估值与隐含预期 | 20% |
| 风险收益与可监测性 | 10% |

总分：`Σ(单项分/5 × 权重)`；报告最高/最低项，不隐藏 N/A。若有 N/A，同时披露已评分权重覆盖率；不静默将其权重重分配到其他项。V1.2 renderer 负责固定权重与总分；JSON 不重新定义权重。理由保持短句并回链 Thesis，避免写成另一份 Thesis 论证。

## 可追溯评分表

| Dimension | Score | Weight | Evidence IDs | Counter-Evidence IDs | Thesis IDs | Confidence | Rationale / Gap |
|---|---:|---:|---|---|---|---|---|

- `Evidence IDs` 与 `Counter-Evidence IDs` 直接回链正文 Source ID；`Thesis IDs` 单独回链 Thesis Evidence Matrix，不接受“见上文”。
- `Rationale` 解释为什么是该分数，而不是重复维度名称。评分与证据冲突时，降低分数或置信度并说明原因。
- 证据不足时使用 N/A，不用默认中性分数掩盖缺口。缺少回链时必须在 Rationale / Gap 写明实质 `Gap: ...`；正常评分仍须证据、反证与 Thesis 回链。
- 权重合计必须为 100%；分数为 1–5 或 N/A。计算总分时标记 `Calculation`。

## Thesis 与 Bear Case

Standard Thesis 用 3–4 条可验证陈述说明市场可能错在哪里、如何兑现、为何现在；Audit 按重大问题扩展。每条连接证据、时间窗和估值。Bear Case 写最强反方：需求、竞争、利润率、资产负债表、执行、监管或估值如何失败。

## Thesis Breakers

只列会令核心逻辑失效的条件。每项使用：

| Breaker | Trigger | Confirmation Window | Thesis Impact | Scenario Probability Impact | Valuation Impact | Research Action |
|---|---|---|---|---|---|---|

`Confirmation Window` 说明一次事件、单季或连续多期才确认。`Scenario Probability Impact` 说明 Bear / Base / Bull 概率如何变化，`Valuation Impact` 说明需重跑哪些假设。`Research Action` 是复核、暂停新增确信、降低置信度、重跑估值或提高确信度等研究含义，不是强制交易指令。

## Watch Next

建立 Decision & Monitoring Loop：

| Metric | Current / As of | Source ID | Next Update | Bull Threshold | Bear Threshold | Thesis Impact | Valuation Impact | Research Action |
|---|---|---|---|---|---|---|---|---|

阈值必须可观察，并说明是绝对值、同比/环比、市场份额或事件条件。每项连接 Thesis ID；`Valuation Impact` 说明影响增长、利润率、概率、折现率或安全边际中的哪个参数。在下次披露后循环更新：`Observation → Evidence Matrix → Scenario Probabilities → Valuation → Scorecard / Conclusion`。
