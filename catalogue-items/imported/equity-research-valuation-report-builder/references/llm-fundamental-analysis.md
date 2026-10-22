# LLM 基本面文本分析

用于比较 MD&A、风险因素、业绩会和投资者材料。LLM 用于检索、归类、比较和提出验证假设，不替代原始证据。

## 流程

1. 按文件、日期、发言人和章节切分，保留出处。
2. 提取需求、价格、销量、成本、产能、订单、客户、竞争、资本配置和风险。
3. 对 Previous period 与 Current period 做 Delta Analysis，而不只总结当期。
4. 检查 KPI 定义连续性；必要时回到更早文件确认首次披露与重述。
5. 连接财务或经营数据；无法连接时标为 Management View。
6. 用 Management Promise Tracker 追踪历史承诺与后续结果。
7. 将文本发现转成验证任务、反证或置信度调整，不直接转成 Fact。

## MD&A Delta Analysis

Standard 展示 3–5 项实质变化，Promise Tracker 通常 1–3 项；Audit 可延伸历史与来源冲突工作。Not Verifiable 必须同时写 `Coverage: 已检索文件/期间；Gap: 仍缺什么证据`，不得作为跳过管理层问责的捷径。

完整研究至少比较相邻两期；如需判断承诺兑现，延伸到承诺首次出现的期间。使用表格：

| Topic | Previous Period | Current Period | Change | Interpretation | Evidence IDs | Alternative Explanation | Validation Task |
|---|---|---|---|---|---|---|---|

重点检查：

- 新增、删除或停止披露的主题与 KPI。
- KPI 定义、Guidance、风险因素、时间窗口和归因的改变。
- 定量披露增加或减少，不确定性措辞和回答方式的改变。
- 管理层上期所说的原因是否被当期数据支持。

“未再披露”只表示在已检索材料中未找到，不自动等于恶化或故意隐瞒。语气变化是 Inference，必须给出可定位的原文或忠实释义与替代解释。

## Management Promise Tracker

| Promise ID | Management Promise | Promise Date | Original Wording / Locator | Due Date | Subsequent Actual Result | Evidence ID | Status | Assessment |
|---|---|---|---|---|---|---|---|---|

`Status` 使用 `Delivered / Partially Delivered / Missed / Revised / Pending / Not Verifiable`。对 Pending 承诺不提前评分；对 Revised 同时保留原承诺和新口径。评估管理层可信度时，展示可复核的 Delivered / Missed 记录，不只根据当期言论打分。

## 管理层坦诚度

观察是否主动披露不利变化、承认错误、解释权衡、量化不确定性、保持口径并复盘承诺。不要凭措辞流畅或情绪判断诚信，不进行心理推断、欺诈指控或“测谎”。引文须可定位；缺失内容只说“未在已检索材料发现”。

推荐表格：主题｜期间变化｜原文/释义与出处｜标签｜财务验证｜投资含义｜替代解释｜下一步。
