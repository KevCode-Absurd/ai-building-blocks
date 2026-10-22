---
name: equity-research-skill-v1-2
description: Produce listed-company research with the V1.2 Standard/Audit structured valuation and report pipeline. Use for V1.2 requests or this pipeline; honor another explicitly selected version. Excludes personal financial advice and private-company diligence.
---

# Equity Research V1.2

以“好赛道 × 好公司 × 好财务 × 好管理层 × 好趋势 × 好价格”为主线，分开公司质量与股票价值。将机械计算和排版交给脚本，保留 V1.1 研究纪律。

## 适用范围

遵循用户已选技能与版本；同一问题不叠加其他研究版本。快速问答、单一计算和小型更新只读取必要模块、给出来源或计算口径；不要求完整历史、同行研究或报告流水线。以下完整工作流、历史覆盖和交付验证适用于完整研究，或用户明确要求的对应模块。

## Mode routing

1. 明确要求 Audit：Audit Mode。
2. 明确要求 Standard：Standard Mode；有最终审计/重大冲突时说明这是有边界的研究，最终 Audit 仍待完成，不静默改名。
3. 未指定模式，但属重大仓位/最终审计、异常高证据或估值不确定性、重大未解决冲突：Audit。
4. 其他日常首次研究：**Standard Mode [DEFAULT]**。

遵循会话中的模型与推理档位；研究模式决定内容深度，不自动更改模型配置。

**Update Mode 仅预留，未实现增量引擎。** 普通业绩或 Thesis 更新缩小问题范围后使用 Standard（`meta.mode: standard`）；不宣称自动文件 diff、持久证据库或模型滚动更新。明确要求最终 Audit 时仍选 Audit。`update` 不是合法报告 mode。

## Research Budget / Stop Conditions / Do not over-research

Standard：Core Thesis 3–4 条；Metric Definition Continuity 5–6 项；MD&A Delta 3–5 项；关键承诺通常 1–3 项；1–2 个可比同行 primary 来源 + 1 个独立行业来源；Decision Loop 5–7 项；适用 DCF 时默认 5 个显式预测年；有行业或用户要求时按下文扩展规则处理。

**Evidence Stop Rule**：每条核心 Thesis 已有 1 个高质量 primary evidence + 1 个 counter evidence 或真正独立验证，且无重大未解决冲突，即停止搜索。仅为解决冲突、修复可比性或足以改变置信度/情景概率/估值才追加研究。证据足够后不补第 4、第 5 个同行或行业来源。

复用已打开文档、提取文本和精确 locator；提取最相关页/章节，不为形式遍历财报。证据找不到时写明检索覆盖、Insufficient Evidence 与低置信度，不脑补。Audit 无 Standard 数量上限，保留完整 V1.1 审计深度；仍避免无价值重复。完整预算见 [research-framework.md](references/research-framework.md)。

## 工作流：按需读取

1. 明确证券、交易所、币种、截止日、持有期、mode 与假设。
2. [evidence-policy.md](references/evidence-policy.md)：先证据后推断，区分 Fact / Management View / Market View / Calculation / Inference；保留日期与精确来源。
3. [sector-kpis.md](references/sector-kpis.md) + [research-framework.md](references/research-framework.md)：商业/竞争、行业 KPI、Independent Industry Validation、Thesis Evidence Matrix（支持、反证、置信度、待验证）。
4. [financial-analysis.md](references/financial-analysis.md)：先 Metric Definition Continuity，再三表、盈利质量与每股价值。保留 3–5 年、4–8 季度历史；资料不足写 Coverage、Reason、证据不足，预测不能充当历史。
5. [llm-fundamental-analysis.md](references/llm-fundamental-analysis.md)：MD&A Delta + Management Promise Tracker；Not Verifiable 写 Coverage 和 Gap。
6. [valuation-framework.md](references/valuation-framework.md)：LLM 负责假设和解释，脚本负责计算。FCFF 配 WACC，FCFE 配 Ke；银行、保险等用 sector-adaptive，保留 Reverse Valuation、Bear/Base/Bull、Expected Return、IRR、安全边际和估值对账。DCF 保留 3×3 sensitivity。
7. [investment-scorecard.md](references/investment-scorecard.md)：固定 V1.1 权重和 1–5 分；证据/反证/Thesis 回链；Thesis Breakers + Decision & Monitoring Loop。证据不足允许有理由的 N/A。
8. [report-schema.md](references/report-schema.md) + [report-template.md](references/report-template.md)：生成 compact report-content.json 与 valuation-input.json；运行下面流水线，按具体错误修复输入。

## 单一权威位置与交付

`summary` 给一句话判断、回报框架、主要未知数和 Thesis ID 引用；`theses` 是详细论证的唯一权威位置；`scorecard` 只给短理由及回链；`conclusion` 分开公司质量/股票价值并引用已有论证。不得重复段落、公式或整段推理。详细复算参数留在结构化文件，主阅读版只解释影响决策的结果。

```bash
python3 scripts/valuation_model.py valuation-input.json --output valuation-result.json
python3 scripts/render_report.py report-content.json --valuation valuation-result.json --output report.html
python3 scripts/validate_report.py report.html --strict --as-of YYYY-MM-DD --source-json report-content.json --valuation-json valuation-result.json
```

valuation-result.json 是市场价格/日期、DCF、终值、敏感性、反向估值、情景、Expected Return/IRR、安全边际和对账数字的唯一来源；LLM 不重复手算或手抄到多处。

默认最终输出固定 renderer 生成的 self-contained HTML。CSS、导航、卡片、表格、badges 与 print 样式来自模板；不逐次写 HTML/CSS、不默认生成 JS/SVG/canvas/图表，不手改机器属性。Standard 展示关键 5 年；超过 5 年须 forecast_extension_reason，说明行业特性或用户要求。Audit 保留完整桥接、情景假设台账与经营敏感性。

用户明确要求 Markdown 才输出 Markdown：保留研究合约，单列 `Mode: Standard` 或 `Mode: Audit`，使用 `--allow-markdown --strict --as-of YYYY-MM-DD` 验证，无 renderer provenance 要求。快速问答或单一计算可直接回答。

Validator 只证明可机器检查的结构、追溯与生成一致性；真实来源独立性、质量、证据充分性、假设合理性和投资判断需人工复核，不把 warning 宣称为已经验证。
