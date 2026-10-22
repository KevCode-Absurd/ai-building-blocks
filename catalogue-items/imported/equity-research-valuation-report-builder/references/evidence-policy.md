# 证据政策

## 五类证据标签

- **Fact**：原始资料直接披露且可复核的已发生事实。
- **Management View**：管理层目标、指引、预测、解释或归因；不得写成已实现的 Fact。
- **Market View**：Consensus、独立行业机构、分析师、媒体观点，以及竞争对手的指引或判断；注明口径和 `As of` 日期。竞争对手申报文件中已经发生的历史数字仍标为 Fact，不因来源是竞争对手而降级成观点。
- **Calculation**：基于已标记输入的数学计算；展示公式、输入、单位、期间和舍入规则，不写成 Fact。
- **Inference**：由证据和计算推导的分析判断；列出前提、推理链、替代解释和 `Confidence: High / Medium / Low`。

无法支持重要判断时写 **证据不足 / Insufficient Evidence**。

不得把 Calculation 写成 Fact，把管理层预估写成已发生事实，或把推断混进标记为 Fact 的句子。混合句必须拆分：先写可定位的证据，再单独写 Calculation 或 Inference。

## 来源优先级

监管申报/审计年报 → 财报/业绩会/公告 → 投资者演示/官网数据 → 政府/交易所/协会 → 券商/一致预期 → 可信媒体 → 其他二手资料。

冲突时记录双方口径、期间和日期，不静默拼接。对风险与当前判断优先使用最新可得资料；若改用较旧完整年度数据，说明理由。

## 引用与时间口径

核心数据和核心 Thesis 的引用使用以下定位链：

`Source ID → Document → Publication date → Reporting period → Page / Section / Item / Table → URL or local file`

例：`[S03][Fact] 2026Q2 Form 10-Q → 2026-08-06 → Item 2 MD&A → Revenue → p.34 → URL`。仅给 SEC、IR 或搜索首页不算精确定位。没有页码的 HTML 使用 Section / Item / Table / paragraph heading。

股价、市值、Consensus、同业估值、汇率、行业数据和新闻统一标记 `As of YYYY-MM-DD`。不同日期可并列，但不得隐式混合成同一时点的对比。

## 最小引用

V1.2 结构化来源角色为 `company-primary / competitor-primary / independent-industry / market-data / secondary`；角色与五类证据标签是两种不同分类。来源质量/真实独立性不因声明角色而被机器证明。沿用 [research-framework.md](research-framework.md) 的 Evidence Stop Rule，复用已抓取来源与 locator；有冲突时继续调查，证据足够时停止。

`[Source ID][标签] 结论 — 文档，日期，期间，页码 / Section / Item / Table，URL（网络资料加访问日期）`

对核心 Thesis 建矩阵：`Thesis ID｜Thesis｜Supporting Evidence IDs｜Counter Evidence IDs｜Evidence Type｜Confidence｜What Needs Validation`。每条影响投资结论的 Thesis 必须入表，且支持与反证引用可追溯 Source ID。

禁止把公司表述当独立验证、相关性当因果、股价上涨当质量证据，或制造不可复核数字。
