# Report JSON and Renderer Schema V1.2

## Authority and pipeline

The model writes `report-content.json`; `valuation_model.py` writes `valuation-result.json`; `render_report.py` validates both and owns every HTML tag, style, link, ID, label, weight, and machine attribute. The renderer does not calculate valuation.

```bash
python3 scripts/render_report.py report-content.json \
  --valuation valuation-result.json \
  --output report.html
```

The normal output is self-contained HTML. Use Markdown only when the user explicitly requests it; Markdown is outside this renderer.

## Content top level

`report-content.json` uses UTF-8 JSON and exactly these keys:

```text
schema_version = "1.2"
meta
summary
evidence_scope
business
management
financials
valuation_context
theses
risks_and_breakers
scorecard
monitoring
conclusion
sources
```

Presentation input is forbidden. Do not add `html`, `markdown`, `css`, `class`, `tag`, or `data-*` fields. Put plain text and stable row objects in JSON; the renderer escapes all text and creates markup.

### Metadata and summaries

```text
meta:
  mode, company_name, ticker, exchange, currency, as_of,
  investment_horizon, language

summary:
  headline, one_line_judgment, investment_posture, posture_rationale,
  overall_confidence, maximum_unknown, company_quality, stock_value
```

`mode` is `standard` or `audit`. `update` is reserved and rejected. Dates use real `YYYY-MM-DD` calendar dates. `overall_confidence` is `high`, `medium`, or `low`. The fixed template is Chinese-first, so `meta.language` must be `zh-CN`.

### Evidence and operating analysis

```text
evidence_scope:
  source_coverage, primary_filing_status, earnings_call_status,
  industry_evidence_status, research_confidence, conflicts_and_gaps,
  evidence_blocks[]

evidence block:
  kind, text, source_ids, optional confidence

business:
  model_and_demand, value_creation, industry_stage_and_drivers,
  competitive_position, moats[], counter_evidence, industry_validation

moat:
  title, text, source_ids

counter_evidence:
  text, source_ids

industry_validation:
  claim,
  company {text, source_ids},
  competitors [{text, source_ids}],
  independent {text, source_ids, status, reason},
  agreement_or_conflict, confidence, gap
```

Evidence `kind` is one of `fact`, `management-view`, `market-view`, `calculation`, or `inference`. If genuinely independent industry evidence cannot be obtained, keep the `independent` row, use an empty `source_ids` list, state `status: "insufficient-evidence"`, record searched coverage in `reason`, explain the unresolved issue in `gap`, and lower confidence. Do not invent a source.

### Management and financial rows

```text
management:
  overview, mda_delta[], promises[]

MD&A delta:
  topic, previous_period, current_period, change, interpretation,
  source_ids, alternative_explanation, validation_task

promise:
  id, promise, promise_date, original_wording_locator, due_date,
  actual_result, source_ids, status, assessment

financials:
  overview, metric_continuity[], annual_history[], quarterly_history[],
  earnings_quality, kpi_inflections, sector_kpis[]

metric continuity:
  metric, periods, definition_scope_change, comparability_status,
  adjustment, source_ids

history:
  period, revenue, growth, margin, ocf, fcf, roic,
  earnings_quality_note, source_ids

sector KPI:
  metric, current, direction, source_ids
```

Comparability is `comparable`, `partially-comparable`, or `not-comparable`. Promise status is `delivered`, `partially-delivered`, `missed`, `revised`, `pending`, or `not-verifiable`.

### Valuation context, theses, breakers, Scorecard, and monitoring

```text
valuation_context:
  route, method_rationale, assumptions[], scenario_rationales,
  reverse_interpretation, reconciliation_note

assumption:
  id, assumption, value, source_ids

scenario_rationales:
  bear, base, bull; each is an object with:
    operating_assumptions, valuation_assumptions, trigger_or_falsifier

thesis:
  id, statement, supporting_source_ids, counter_source_ids,
  evidence_types, confidence, needs_validation, optional evidence_gap

risks_and_breakers:
  summary, breakers[]

breaker:
  breaker, trigger, confirmation_window, thesis_ids,
  scenario_probability_impact, valuation_impact, research_action

monitoring:
  metric, current_value, as_of, source_ids, next_update,
  bull_threshold, bear_threshold, thesis_ids,
  valuation_impact, research_action

conclusion:
  decision, company_quality, stock_value, margin_of_safety_rationale,
  validation_items, thesis_ids
```

`valuation_context.route` is `dcf` or `sector_adaptive` and must match the valuation result. The Scorecard contains exactly `industry`, `moat`, `financials`, `management`, `trend`, `valuation`, and `monitoring`. Each row contains:

```text
score (1–5 or null), evidence_ids, counter_evidence_ids,
thesis_ids, confidence, rationale_or_gap
```

The renderer owns the labels and weights `15/15/15/10/15/20/10`, computes total as `Σ(score / 5 × weight)`, and separately reports scored-weight coverage. JSON cannot redefine weights.

### Sources and identifiers

```text
source:
  id, role, document, publication_date, reporting_period,
  locator, url_or_path, access_date
```

Source roles are `company-primary`, `competitor-primary`, `independent-industry`, `market-data`, and `secondary`. URL/path allowlist: `http:`, `https:`, `file:`, or an absolute local path beginning with one `/`. Relative, protocol-relative, control-character, `javascript:`, `data:`, and `vbscript:` values are rejected.

Identifiers are `S01`–`S999`, `T01`–`T999`, `A01`–`A999`, and `P01`–`P999`. They must be well formed and unique. Every source/thesis reference must resolve before any output is written.

## Mode budgets

| Module | Standard | Audit |
|---|---:|---|
| Core Thesis | 3–4 | V1.1 audit depth; no Standard maximum |
| Metric continuity | 5–6 | Full material set |
| MD&A Delta | 3–5 | Full material set |
| Promise tracker | Normally 1–3 | All decision-relevant promises |
| Competitor sources | 1–2 | Expand to resolve conflicts |
| Independent-industry sources | At least 1 or explicit insufficient-evidence path | Expand to resolve conflicts |
| Monitoring rows | 5–7 | Full decision loop |
| Non-financial DCF | Five explicit periods by default | At least three; extend when justified |
| DCF display | Seven compact columns | Full 12-column bridge |

For Standard DCF, more than five periods requires non-empty `forecast_extension_reason` in `valuation.results.dcf`; the renderer shows `Forecast extension reason: ...`. The mode-aware validator enforces the research row budgets. Audit does not inherit Standard maximums.

## Valuation-result contract

Top level:

```text
schema_version = "valuation.v1"
engine_version = "1.2.0"
status = "ok"
mode, route, units, market, results, warnings, errors=[]

units:
  model_currency, quote_currency, amount_unit, fx_to_quote

market:
  as_of, price_as_of, current_price, diluted_shares
```

`mode`, route, and quote currency must match content. Hero price/date, primary value, scenarios, Expected Return, IRR, Margin of Safety, and conclusion valuation values come only from this file. Every numeric field must be a finite JSON number. Top-level `warnings` and DCF Reverse Valuation warnings are rendered visibly; they are not silently discarded.

### DCF route

```text
results.dcf:
  status="ok", basis, discount_rate_type, discount_rate,
  forecast[], optional forecast_extension_reason,
  terminal, explicit_pv, terminal_value, terminal_pv,
  terminal_value_share, implied_reinvestment_rate,
  optional enterprise_value, equity_value, per_share_value, sensitivity

FCFF forecast row:
  period, revenue, growth, operating_margin, ebit, nopat,
  d_and_a, capex, delta_nwc, net_borrowing, fcff,
  discount_factor, pv

FCFE forecast row:
  period, revenue, growth, net_margin, net_income,
  d_and_a, capex, delta_nwc, net_borrowing, fcfe,
  discount_factor, pv

terminal:
  revenue, growth, margin, cash_flow, return_metric, return_rate,
  implied_reinvestment_rate, value, present_value, value_share

sensitivity:
  discount_rates[3], terminal_growth_rates[3], values[3][3]
```

Additional DCF result sections:

```text
relative_cross_checks[]:
  id, name, kind, value_basis, value, note, per_share_value

reconciliation:
  primary_method, primary_per_share_value, cross_check_per_share_values,
  value_basis, equity_value, optional enterprise_value,
  excess_cash, non_operating_investments, debt, minority_interest,
  other_claims, additional_equity_adjustments_total,
  dilution_treatment, diluted_shares, fx_to_quote

reverse_valuation:
  assumptions_held_constant, input_price,
  input_price_source="reverse_valuation.forward_price",
  growth_period_years,
  required_terminal_value, required_terminal_cash_flow,
  implied_terminal_cash_flow_margin, implied_terminal_growth,
  return_metric, return_rate, implied_reinvestment_rate, warnings
```

For DCF, `basis=FCFF` requires `discount_rate_type=WACC` and `return_metric=ROIC`; `basis=FCFE` requires `discount_rate_type=KE` and `return_metric=ROE`. The renderer shows outer `market.current_price / price_as_of` separately from Reverse Valuation `input_price / input_price_source`; it must never imply that current market price drove a calculation that used `reverse_valuation.forward_price`. Reverse `implied_terminal_growth` and `implied_reinvestment_rate` may be `null` when the engine cannot derive an economically meaningful value; the renderer displays `N/A` and shows the corresponding warning.

FCFF renders the complete signed EV-to-equity bridge. FCFE renders only an `Equity Value Reconciliation`: primary method, equity-value basis, signed additional equity adjustments, equity value, dilution treatment, diluted shares, FX, per-share value, and reconciliation note. FCFE must not display enterprise value, cash, investments, debt, minority interest, or other-claims bridge rows because those operating financing items do not reconcile FCFE equity value.

### Shared scenario and Margin of Safety result

```text
scenarios:
  method, horizon_years,
  scenarios {bear, base, bull},
  base_irr, probability_weighted_ending_value,
  probability_weighted_dividends,
  probability_weighted_expected_return,
  probability_weighted_cash_flows,
  probability_weighted_irr

scenario row:
  probability, dividends, cash_flows, ending_value, expected_return, irr

margin_of_safety:
  required, high_conviction, attractive_price, high_conviction_price
```

### Sector-adaptive route

```text
results.dcf:
  status="not_applicable", reason, alternative_method

results.methods[]:
  id, name, kind, value_basis, value, note, per_share_value

results.market_implied_multiple

results.reverse_valuation:
  method, value_basis, metric_name, metric_per_share,
  market_implied_multiple, primary_method_id,
  primary_implied_multiple, multiple_gap

results.reconciliation:
  primary_method_id, primary_per_share_value,
  minimum_per_share_value, maximum_per_share_value, spread
```

Sector output also carries shared scenarios and Margin of Safety. It renders the DCF reason and alternative method, generic Reverse Valuation, and reconciliation; it does not render empty forecast, terminal, or sensitivity tables.

## Rendering, provenance, and errors

The fixed template contains exactly one `<!-- ER:HEAD -->` and one `<!-- ER:BODY -->`. It contains CSS, responsive breakpoints, and print styles but no company placeholders, scripts, external styles/fonts/images, SVG, or canvas.

Canonical hashes use:

```python
json.dumps(payload, ensure_ascii=False, sort_keys=True,
           separators=(",", ":"), allow_nan=False).encode("utf-8")
```

The HTML records generator/schema/renderer versions plus content and valuation SHA-256 values in both metadata and body attributes. It embeds no full JSON and no timestamp, so identical inputs produce byte-identical output.

Expected JSON/schema/render/I/O errors return CLI exit `2` and one compact JSON object:

```json
{"code":"MODE_RESERVED","path":"meta.mode","message":"update is reserved for a future engine"}
```

Unexpected errors return `1` without a traceback. Rendering completes in memory; the writer then creates a temporary sibling and atomically replaces the output. Validation failure cannot create or truncate the destination.

## Executable examples and Audit additions

Use [Standard content](../tests/fixtures/standard-report.json) and [Audit content](../tests/fixtures/audit-report.json) as executable structure examples. All example companies, sources and figures are synthetic test data, not investment evidence. Do not copy their facts. Use compact JSON for actual content rather than expanding every field onto separate lines.

For Audit, every `valuation_context.assumptions[]` row additionally requires `bear, base, bull, as_of, rationale` (plain strings; as_of is ISO date). Audit also requires `valuation_context.operating_sensitivity[]` rows with `variable, bear, base, bull, value_impact, thesis_ids`. The renderer creates scenario links and retains the V1.1 full assumption ledger and operating stress table. Standard uses the four-column assumptions table and scenario explanations.

Optional `financials.history_coverage` is an object with `annual` and/or `quarterly` text. When history is below the normal minimum, write `Coverage: actual periods; Reason: searched coverage and missing disclosure; Insufficient Evidence`. The renderer places each note beside the corresponding history table. Forecast periods cannot count as historical years; every asserted history row still needs source links.

Scorecard `score: null` displays N/A. Only a substantive `rationale_or_gap: "Gap: ..."` can justify empty evidence/counter/thesis lists. Promise `status: not-verifiable` may have no source only with substantive `Coverage: ...; Gap: ...` in assessment. These exceptions do not waive references for other asserted facts.

## Valuation input examples

Start from [Standard valuation input](../tests/fixtures/standard-valuation-input.json), [Audit valuation input](../tests/fixtures/audit-valuation-input.json), or [Sector valuation input](../tests/fixtures/sector-valuation-input.json). Run the engine to generate results; never manually author result numbers. All rates are decimals; monetary amounts and shares use the same scale. Positive Capex/DeltaNWC are outflows, positive net borrowing is an FCFE inflow.

For a full DCF report include `reverse_valuation: {forward_price: <price used for reverse solving>}`. Normally use current market price. A different input price is a conditional diagnostic and is displayed separately. Scenario exit values are future holding-period values, not current DCF present values.

Sector methods accept equity_value or per_share only; reconcile EV before input, explicitly explaining adjustments. Sector-specific primary method math is supplied by the analyst and must be reproducible in the assumption ledger; this engine handles per-share/FX reconciliation, market-implied multiple and shared scenario/return calculations.
