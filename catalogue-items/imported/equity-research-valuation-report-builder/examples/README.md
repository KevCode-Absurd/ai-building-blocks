# Examples

These examples demonstrate invocation and the report pipeline, not investment recommendations. The [fixtures](../tests/fixtures/) contain a fictional company, synthetic figures, and example-domain URLs that are not real research sources. No financial-report PDFs, broker research, account data, or portfolios are included.

## Research prompts

Standard:

```text
Use $equity-research-skill-v1-2 in Standard Mode to analyze [company/ticker].
Use [exchange], [currency], and the research cutoff [YYYY-MM-DD].
Review the attached annual/quarterly filings and relevant independent evidence.
Assess a five-year holding period. Produce HTML and retain the content,
valuation assumptions, and calculation-result JSON files. Label evidence gaps;
stop searching when the skill's evidence conditions are met.
```

Audit:

```text
Use $equity-research-skill-v1-2 in Audit Mode for a final review of [company].
Use the same source materials and cutoff date as the earlier research.
Resolve material source conflicts, show the full relevant assumption ledger
and valuation bridges, and identify what would invalidate the thesis.
```

For a bank or insurer, identify the sector and request the skill's sector-adaptive route; do not require an industrial-company FCFF model. Never place real account details or private portfolio holdings in a public example.

## Offline synthetic pipeline

Run from the repository root or installed skill directory. The commands create ignored local output files and do not fetch example URLs. Re-running replaces these generated examples.

```sh
mkdir -p outputs
python3 -B scripts/valuation_model.py tests/fixtures/standard-valuation-input.json --output outputs/standard-valuation.json
python3 -B scripts/render_report.py tests/fixtures/standard-report.json --valuation outputs/standard-valuation.json --output outputs/standard.html
python3 -B scripts/validate_report.py outputs/standard.html --strict --as-of 2026-09-01 --source-json tests/fixtures/standard-report.json --valuation-json outputs/standard-valuation.json

python3 -B scripts/valuation_model.py tests/fixtures/audit-valuation-input.json --output outputs/audit-valuation.json
python3 -B scripts/render_report.py tests/fixtures/audit-report.json --valuation outputs/audit-valuation.json --output outputs/audit.html
python3 -B scripts/validate_report.py outputs/audit.html --strict --as-of 2026-09-01 --source-json tests/fixtures/audit-report.json --valuation-json outputs/audit-valuation.json

python3 -B scripts/valuation_model.py tests/fixtures/sector-valuation-input.json --output outputs/sector-valuation.json
python3 -B scripts/financial_metrics.py growth 120 100 --percent
```

Open `outputs/standard.html` or `outputs/audit.html` locally. Both report validators should return exit code 0 with two deliberate manual-review warnings: `SOURCE_INDEPENDENCE_MANUAL_REVIEW` and `RESEARCH_LOGIC_MANUAL_REVIEW`. The growth example returns `20.0` percent.

The Audit fixture uses three forecast periods to exercise the retained audit minimum; it is not a recommendation to use three years for every audit. The DCF fixtures use a reverse-input price different from the current price to test conditional reverse valuation. For current-market implied expectations in real research, use the cutoff-date market price.

The sector fixture demonstrates calculation and reconciliation output only; no complete sector report fixture is bundled. See the [schema](../references/report-schema.md) for content fields and the [valuation framework](../references/valuation-framework.md) for method boundaries.

For reproducible real research, retain the original source documents and input/result JSON outside the public repository. Rewrite JSON inputs and re-render rather than manually editing generated HTML.
