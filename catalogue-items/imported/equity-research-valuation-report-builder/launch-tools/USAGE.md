# English report rendering

AI Blocks compatibility addition, 22 October 2026. Original MIT instructions and scripts remain in `../SKILL.upstream.md` and `../scripts/`.

The upstream renderer accepts only `zh-CN`. For English, set `meta.language` to `en` and use the added renderer and matching validator. Both run the upstream schema, reference, valuation and provenance checks; the validator compares the complete HTML with an exact deterministic re-render from the supplied inputs. No validation checks are disabled.

```sh
python scripts/valuation_model.py launch-tools/sample-valuation.json --output launch-tools/result.json
python launch-tools/render_equity.py launch-tools/sample-content.json --valuation launch-tools/result.json --output launch-tools/report.html
python launch-tools/validate_equity.py launch-tools/report.html --source-json launch-tools/sample-content.json --valuation-json launch-tools/result.json
python -m http.server 5197 --bind 127.0.0.1 --directory launch-tools
```

Open `http://127.0.0.1:5197/report.html`; the five sample source links then resolve. These JSON exhibits are synthetic, including the purported company, peer and industry roles. They provide no real independent corroboration. No company, exchange listing or share price in this sample is real. For live work, replace every exhibit with verified filings and dated price data and review source independence.

The adapter translates fixed labels, supports English input and fixes scenario labels collapsing into single-letter columns. It includes landscape print styles for wide matrices. Export to PDF and inspect every page, especially multi-page financial tables and the scenario section. Source truth and investment reasoning remain manual checks.

The sample is a calculation golden case: flat $15m annual FCFF at 10% WACC gives $150m EV. Add $20m excess cash, subtract $30m debt, divide by 10m diluted shares: $14/share. A 20% discount gives $11.20; the $12 sample price is a 14.2857% discount to value, or 16.6667% upside to price. All amounts except per-share values are USD millions.
