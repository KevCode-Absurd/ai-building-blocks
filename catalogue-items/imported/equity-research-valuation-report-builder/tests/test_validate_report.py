from __future__ import annotations

import sys
import re
import copy
import json
import subprocess
import tempfile
import unittest
from dataclasses import asdict
from functools import partial
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from validate_report import audit_report as current_audit_report, Issue  # noqa: E402
from render_report import render_report  # noqa: E402

audit_report = partial(current_audit_report, legacy_v11=True)


class ValidateReportTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.template = (ROOT / "tests/fixtures/v11-legacy-report-template.html").read_text(encoding="utf-8")

    @staticmethod
    def codes(issues):
        return {issue.code for issue in issues}

    def filled_report(self) -> str:
        values = {
            "AS_OF_DATE": "2026-08-20",
            "PRICE_AS_OF": "2026-08-20",
            "MONITORING_AS_OF": "2026-08-20",
            "CASH_FLOW_BASIS": "FCFF",
            "DISCOUNT_RATE_TYPE": "WACC",
            "DISCOUNT_RATE": "9.0%",
            "COMPARABILITY_STATUS": "Comparable",
            "PROMISE_STATUS": "Delivered",
            "BEAR_PROBABILITY": "20%",
            "BASE_PROBABILITY": "55%",
            "BULL_PROBABILITY": "25%",
            "BASE_IRR": "14.0%",
            "PROBABILITY_WEIGHTED_IRR": "12.0%",
            "PW_IRR_FORMULA_AND_METHOD": "IRR(probability-weighted cash flows)",
            "PW_TERMINAL_VALUE": "$120",
            "PW_DIVIDEND_CASH_FLOWS": "$1, $1, $1",
            "FORECAST_YEAR_1": "2027E",
            "FORECAST_YEAR_2": "2028E",
            "FORECAST_YEAR_3": "2029E",
            "FACT_STATEMENT": "公司披露收入同比增长 10%。",
            "MANAGEMENT_VIEW_STATEMENT": "管理层维持全年收入指引。",
            "MARKET_VIEW_STATEMENT": "独立行业机构预计需求保持稳定。",
            "CALCULATION_STATEMENT_AND_FORMULA": "FCF margin = FCF / Revenue = 20%。",
            "INFERENCE_STATEMENT": "证据组合支持盈利质量改善的判断。",
            "INDEPENDENT_DATA_OR_INSUFFICIENT": "独立行业数据支持该行业判断。",
            "ROIC_FORMULA_AND_INPUTS": "ROIC = NOPAT / Average Invested Capital = 15%",
        }
        for index, year in enumerate(range(2022, 2027), start=1):
            values[f"ANNUAL_YEAR_{index}"] = str(year)
        quarter_periods = (
            "2024Q3", "2024Q4", "2025Q1", "2025Q2",
            "2025Q3", "2025Q4", "2026Q1", "2026Q2",
        )
        for index, period in enumerate(quarter_periods, start=1):
            values[f"QUARTER_{index}"] = period
        for key in re.findall(r"\{\{([A-Z][A-Z0-9_]*)\}\}", self.template):
            if key in values:
                continue
            if key.startswith("SOURCE_") and key.endswith("_URL"):
                values[key] = f"https://example.com/{key.lower()}"
            elif key.startswith("SOURCE_") and key.endswith(("_PUBLICATION_DATE", "_ACCESS_DATE")):
                values[key] = "2026-08-20"
            elif key.startswith("SOURCE_") and key.endswith("_LOCATOR"):
                values[key] = "Item 2 MD&A → p. 34"
            elif key.startswith("SOURCE_") and key.endswith("_PERIOD"):
                values[key] = "2026Q2"
            elif key.startswith("SOURCE_") and key.endswith("_DOCUMENT"):
                values[key] = "2026Q2 official report"
            elif key.startswith("SCORE_") and key not in {"SCORECARD_TOTAL", "SCORECARD_COVERAGE"}:
                values[key] = "4"
            elif key in {"SCORECARD_TOTAL", "SCORECARD_COVERAGE"}:
                values[key] = "80/100" if key == "SCORECARD_TOTAL" else "100%"
            elif key.endswith("CONFIDENCE"):
                values[key] = "Medium"
            elif key.endswith("DATE") or key.endswith("_AS_OF"):
                values[key] = "2026-08-20"
            else:
                values[key] = "示例值"

        filled = self.template
        for key, value in values.items():
            filled = filled.replace("{{" + key + "}}", value)
        return filled

    def test_template_structure_passes(self) -> None:
        issues, report_format = audit_report(self.template, ".html", template=True)
        self.assertEqual("html", report_format)
        self.assertEqual([], issues)

    def test_filled_report_passes(self) -> None:
        issues, report_format = audit_report(self.filled_report(), ".html", template=False)
        self.assertEqual("html", report_format)
        self.assertEqual([], issues)

    def test_external_script_is_rejected(self) -> None:
        changed = self.template.replace("</head>", '<script src="https://example.com/x.js"></script></head>')
        issues, _ = audit_report(changed, ".html", template=True)
        self.assertIn("HTML_EXTERNAL_RESOURCE", self.codes(issues))

    def test_calculation_label_must_be_a_body_hook(self) -> None:
        changed = self.template.replace(
            'data-evidence="calculation"',
            'data-evidence="inference"',
            1,
        )
        issues, _ = audit_report(changed, ".html", template=True)
        self.assertIn("EVIDENCE_CALCULATION", self.codes(issues))

    def test_broken_fragment_is_rejected(self) -> None:
        changed = self.template.replace(
            "</body>",
            '<a href="#missing-source">broken</a></body>',
        )
        issues, _ = audit_report(changed, ".html", template=True)
        self.assertIn("BROKEN_FRAGMENT", self.codes(issues))

    def test_unresolved_placeholders_fail_filled_report(self) -> None:
        issues, _ = audit_report(self.template, ".html", template=False)
        self.assertIn("UNRESOLVED_PLACEHOLDER", self.codes(issues))

    def test_fcfe_and_wacc_mismatch_is_rejected(self) -> None:
        changed = self.template.replace("{{CASH_FLOW_BASIS}}", "FCFE")
        changed = changed.replace("{{DISCOUNT_RATE_TYPE}}", "WACC")
        issues, _ = audit_report(changed, ".html", template=False)
        self.assertIn("DCF_BASIS_MISMATCH", self.codes(issues))

    def test_scorecard_weight_error_is_detected(self) -> None:
        changed = self.template.replace(">20%</td>", ">25%</td>", 1)
        changed = changed.replace("{{", "").replace("}}", "")
        issues, _ = audit_report(changed, ".html", template=False)
        self.assertIn("SCORECARD_WEIGHT", self.codes(issues))

    def test_invalid_calendar_date_is_rejected(self) -> None:
        changed = self.filled_report().replace("2026-08-20", "2026-02-31")
        issues, _ = audit_report(changed, ".html", template=False)
        self.assertIn("AS_OF_INVALID", self.codes(issues))
        self.assertIn("DATE_INVALID", self.codes(issues))

    def test_expected_cutoff_must_match_report(self) -> None:
        issues, _ = audit_report(
            self.filled_report(), ".html", template=False, expected_as_of="2026-08-19"
        )
        self.assertIn("AS_OF_MISMATCH", self.codes(issues))
        self.assertIn("MARKET_AS_OF_AFTER_CUTOFF", self.codes(issues))

    def test_historical_coverage_is_enforced(self) -> None:
        changed = self.filled_report()
        for year in range(2023, 2027):
            changed = changed.replace(f"<td>{year}</td>", "<td>2022</td>", 1)
        issues, _ = audit_report(changed, ".html", template=False)
        self.assertIn("HISTORICAL_COVERAGE", self.codes(issues))

    def test_dcf_bridge_columns_are_enforced(self) -> None:
        changed = self.filled_report().replace(
            '<th class="num">D&amp;A</th>', '<th class="num">Removed Input</th>', 1
        )
        issues, _ = audit_report(changed, ".html", template=False)
        self.assertIn("COLUMN_DCF_FORECAST", self.codes(issues))

    def test_thesis_statement_column_is_distinct_from_thesis_id(self) -> None:
        changed = self.filled_report().replace("<th>Thesis</th>", "<th>Removed</th>", 1)
        issues, _ = audit_report(changed, ".html", template=False)
        self.assertIn("COLUMN_THESIS_EVIDENCE_MATRIX", self.codes(issues))

    def test_probability_weighted_irr_is_required(self) -> None:
        changed = self.filled_report().replace("Probability-weighted IRR", "Weighted return")
        issues, _ = audit_report(changed, ".html", template=False)
        self.assertIn("SCENARIO_FIELD_MISSING", self.codes(issues))

    def test_empty_thesis_matrix_is_rejected(self) -> None:
        changed = re.sub(
            r'(<div class="subsection" data-check="thesis-evidence-matrix">.*?<tbody>).*?(</tbody>)',
            r"\1\2",
            self.filled_report(),
            count=1,
            flags=re.S,
        )
        issues, _ = audit_report(changed, ".html", template=False)
        self.assertIn("TABLE_EMPTY", self.codes(issues))

    def test_evidence_block_requires_source_link(self) -> None:
        changed = re.sub(
            r'(<article class="evidence-item" data-evidence="fact">.*?)(<a[^>]+href="#S01"[^>]*>S01</a>)',
            r"\1S01",
            self.filled_report(),
            count=1,
            flags=re.S,
        )
        issues, _ = audit_report(changed, ".html", template=False)
        self.assertIn("EVIDENCE_LINK", self.codes(issues))

    def test_evidence_block_cannot_be_label_and_link_only(self) -> None:
        changed = self.filled_report().replace("公司披露收入同比增长 10%。", "", 1)
        issues, _ = audit_report(changed, ".html", template=False)
        self.assertIn("EVIDENCE_EMPTY", self.codes(issues))

    def test_source_anchor_cannot_be_empty(self) -> None:
        changed = re.sub(
            r'(<article class="source-item" id="S01"[^>]*>).*?(</article>)',
            r"\1\2",
            self.filled_report(),
            count=1,
            flags=re.S,
        )
        issues, _ = audit_report(changed, ".html", template=False)
        self.assertIn("SOURCE_ENTRY_EMPTY", self.codes(issues))
        self.assertIn("SOURCE_LINK_MISSING", self.codes(issues))

    def test_probability_weighted_irr_value_cannot_be_empty(self) -> None:
        changed = self.filled_report().replace(
            'data-irr-value="12.0%">12.0%</strong>', 'data-irr-value=""></strong>', 1
        )
        issues, _ = audit_report(changed, ".html", template=False)
        self.assertIn("IRR_VALUE_MISSING", self.codes(issues))

    def test_probability_weighted_irr_inputs_cannot_be_empty(self) -> None:
        changed = self.filled_report().replace(
            'data-value="$120">$120</span>', 'data-value=""></span>', 1
        )
        issues, _ = audit_report(changed, ".html", template=False)
        self.assertIn("IRR_INPUT_VALUE_MISSING", self.codes(issues))

    def test_text_as_of_after_cutoff_is_rejected(self) -> None:
        changed = self.filled_report().replace(
            "<time>2026-08-20</time>", "<time>2026-08-21</time>", 1
        )
        issues, _ = audit_report(
            changed, ".html", template=False, expected_as_of="2026-08-20"
        )
        self.assertIn("AS_OF_AFTER_CUTOFF", self.codes(issues))

    def test_report_cutoff_cannot_be_satisfied_by_price_date(self) -> None:
        changed = self.filled_report().replace(
            'data-report-cutoff="2026-08-20">2026-08-20',
            'data-report-cutoff="2026-08-19">2026-08-19',
        )
        issues, _ = audit_report(
            changed, ".html", template=False, expected_as_of="2026-08-20"
        )
        self.assertIn("REPORT_AS_OF_VISIBLE", self.codes(issues))

    def test_irr_machine_value_must_match_visible_value(self) -> None:
        changed = self.filled_report().replace(
            'data-irr-value="12.0%">12.0%</strong>',
            'data-irr-value="12.0%">11.0%</strong>',
            1,
        )
        issues, _ = audit_report(changed, ".html", template=False)
        self.assertIn("IRR_VISIBLE_MISMATCH", self.codes(issues))

    def test_source_machine_fields_must_match_visible_fields(self) -> None:
        changed = self.filled_report().replace(
            'data-source-field="publication-date">2026-08-20</span>',
            'data-source-field="publication-date">2026-08-19</span>',
            1,
        )
        issues, _ = audit_report(changed, ".html", template=False)
        self.assertIn("SOURCE_VISIBLE_MISMATCH", self.codes(issues))

    def test_historical_period_must_be_real_year_or_quarter(self) -> None:
        changed = self.filled_report().replace("<td>2022</td>", "<td>Year A</td>", 1)
        issues, _ = audit_report(changed, ".html", template=False)
        self.assertIn("HISTORICAL_PERIOD_FORMAT", self.codes(issues))

    def test_insufficient_evidence_phrase_alone_does_not_bypass_coverage(self) -> None:
        changed = self.filled_report()
        for year in range(2023, 2027):
            changed = changed.replace(f"<td>{year}</td>", "<td>2022</td>", 1)
        changed = changed.replace(
            "<h3>3–5 年趋势</h3>", "<h3>3–5 年趋势</h3><p>证据不足</p>", 1
        )
        issues, _ = audit_report(changed, ".html", template=False)
        self.assertIn("HISTORICAL_COVERAGE", self.codes(issues))

    def test_chinese_fcfe_cost_of_equity_is_accepted(self) -> None:
        changed = self.filled_report().replace("<strong>FCFF</strong>", "<strong>FCFE</strong>", 1)
        changed = changed.replace("<strong>WACC 9.0%</strong>", "<strong>权益资本成本 9.0%</strong>", 1)
        issues, _ = audit_report(changed, ".html", template=False)
        self.assertNotIn("DCF_BASIS_MISMATCH", self.codes(issues))

    def test_markdown_warning_can_be_explicitly_allowed(self) -> None:
        issues, _ = audit_report("# 示例", ".md", template=True)
        self.assertIn("FORMAT_MARKDOWN", self.codes(issues))
        allowed, _ = audit_report("# 示例", ".md", template=True, allow_markdown=True)
        self.assertNotIn("FORMAT_MARKDOWN", self.codes(allowed))

    def test_chinese_markdown_irr_evidence_and_source_contract(self) -> None:
        markdown = """# 示例研究

Mode: Audit

研究截止：As of 2026-08-20

[S01][Fact] 公司披露历史收入增长。
[S01][Management View] 管理层维持全年指引。
[S01][Market View] 独立行业机构判断需求稳定。
[S01][Calculation] FCF margin = FCF / Revenue = 20%。
[S01][Inference] 证据组合支持盈利质量改善，Confidence: Medium。

## Bear / Base / Bull 情景分析

基准 IRR：14.0%
概率加权 IRR：12.0%
计算方法：IRR(加权现金流)
概率加权期末价值：120
股息现金流：0

## 来源

<a id="S01"></a>
[S01] 2026Q2 official report → 2026-08-01 → 2026Q2 → Item 2 MD&A → p. 34 → https://example.com/report → accessed 2026-08-20
"""
        issues, _ = audit_report(
            markdown,
            ".md",
            template=False,
            expected_as_of="2026-08-20",
            allow_markdown=True,
        )
        relevant_prefixes = (
            "IRR_", "MARKDOWN_EVIDENCE", "SOURCE_", "REPORT_AS_OF",
        )
        relevant = [
            issue for issue in issues if issue.code.startswith(relevant_prefixes)
        ]
        self.assertEqual([], relevant)

    def test_bare_dcf_opt_out_is_rejected(self) -> None:
        changed = self.filled_report().replace(
            'data-check="dcf-forecast"', 'data-check="dcf-disabled"', 1
        )
        changed = changed.replace(
            '<section id="valuation" data-check="valuation-market-expectations">',
            '<section id="valuation" data-check="valuation-market-expectations"><p>DCF not applicable</p>',
            1,
        )
        issues, _ = audit_report(changed, ".html", template=False)
        self.assertIn("DCF_NOT_APPLICABLE_DETAIL", self.codes(issues))

    def test_dcf_opt_out_with_reason_and_alternative_is_allowed(self) -> None:
        changed = self.filled_report().replace(
            'data-check="dcf-forecast"', 'data-check="dcf-disabled"', 1
        )
        changed = changed.replace(
            '<section id="valuation" data-check="valuation-market-expectations">',
            '<section id="valuation" data-check="valuation-market-expectations">'
            '<p>DCF not applicable — Reason: regulated balance-sheet economics — '
            'Alternative method: P/TBV and excess return.</p>',
            1,
        )
        issues, _ = audit_report(changed, ".html", template=False)
        self.assertNotIn("DCF_ROUTE_UNDECLARED", self.codes(issues))
        self.assertNotIn("DCF_NOT_APPLICABLE_DETAIL", self.codes(issues))


class V12MarkdownModeTests(unittest.TestCase):
    def test_standard_compact_tables_do_not_require_audit_fields(self):
        text = """# Example
Mode: Standard
## Valuation Assumption Ledger
| Assumption ID | Assumption | Value | Evidence IDs |
|---|---|---|---|
| A01 | WACC | 10% | S01 |
"""
        issues, _ = current_audit_report(text, ".md", template=True, allow_markdown=True)
        codes = {issue.code for issue in issues}
        self.assertNotIn("COLUMN_VALUATION_ASSUMPTIONS", codes)
        self.assertNotIn("TABLE_OPERATING_SENSITIVITY", codes)
        audit_issues, _ = current_audit_report(text.replace("Mode: Standard", "Mode: Audit"), ".md", template=True, allow_markdown=True)
        audit_codes = {issue.code for issue in audit_issues}
        self.assertIn("COLUMN_VALUATION_ASSUMPTIONS", audit_codes)
        self.assertIn("TABLE_OPERATING_SENSITIVITY", audit_codes)


class V12MetadataTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.template = (ROOT / "assets/report-template.html").read_text(encoding="utf-8")
        cls.content = json.loads((ROOT / "tests/fixtures/standard-report.json").read_text())
        cls.valuation = json.loads((ROOT / "tests/fixtures/standard-valuation.json").read_text())
        cls.html = render_report(cls.content, cls.valuation, cls.template)
        cls.audit_content = json.loads((ROOT / "tests/fixtures/audit-report.json").read_text())
        cls.audit_valuation = json.loads((ROOT / "tests/fixtures/audit-valuation.json").read_text())
        cls.audit_html = render_report(cls.audit_content, cls.audit_valuation, cls.template)

    @staticmethod
    def codes(issues):
        return {issue.code for issue in issues}

    def metadata_issues(self, html=None, **kwargs):
        issues, _ = current_audit_report(html or self.html, ".html", **kwargs)
        return [i for i in issues if i.code.startswith(("REPORT_MODE", "REPORT_VERSION", "RENDERER_"))]

    def test_issue_blocking_and_serialization(self):
        issue = Issue("warning", "MANUAL", "review", blocking=False)
        self.assertFalse(asdict(issue)["blocking"])
        self.assertTrue(Issue("warning", "STRUCTURE", "check").blocking)

    def test_mode_missing_and_invalid(self):
        for attr, code in (("", "REPORT_MODE_MISSING"), ('data-report-mode="update"', "REPORT_MODE_INVALID")):
            with self.subTest(code=code):
                changed = self.html.replace('data-report-mode="standard"', attr)
                self.assertIn(code, self.codes(self.metadata_issues(changed)))

    def test_provenance_metadata_contract(self):
        mutations = (
            ('data-report-version="1.2"', '', "REPORT_VERSION_MISSING"),
            ('name="er-schema-version" content="1.2"', 'name="er-schema-version" content="1.1"', "REPORT_VERSION_INVALID"),
            ('name="generator"', 'name="removed"', "RENDERER_PROVENANCE_MISSING"),
            ('content="equity-research-skill-v1-2/render_report.py"', 'content="other"', "RENDERER_PROVENANCE_MISMATCH"),
            ('data-generated-by="render_report.py"', 'data-generated-by="other"', "RENDERER_PROVENANCE_MISMATCH"),
            ('data-renderer-version="1.2.0"', 'data-renderer-version="0"', "RENDERER_PROVENANCE_MISMATCH"),
            ('data-template-version="1.2"', '', "RENDERER_PROVENANCE_MISSING"),
        )
        for old, new, code in mutations:
            with self.subTest(old=old):
                self.assertIn(old, self.html)
                self.assertIn(code, self.codes(self.metadata_issues(self.html.replace(old, new, 1))))
        changed = re.sub(r'data-content-sha256="[^"]+"', 'data-content-sha256="bad"', self.html)
        self.assertIn("RENDERER_HASH_INVALID", self.codes(self.metadata_issues(changed)))
        changed = re.sub(r'data-valuation-sha256="[^"]+"', 'data-valuation-sha256="' + '0' * 64 + '"', self.html)
        self.assertIn("RENDERER_HASH_MISMATCH", self.codes(self.metadata_issues(changed)))

    def test_original_json_hashes_and_schemas(self):
        self.assertEqual([], self.metadata_issues(source_json=self.content, valuation_json=self.valuation))
        for field, payload in (("source_json", self.content), ("valuation_json", self.valuation)):
            for mutation in ("hash", "schema", "mode"):
                changed = copy.deepcopy(payload)
                if mutation == "hash":
                    changed["extra"] = "changed"
                elif mutation == "schema":
                    changed["schema_version"] = "wrong"
                elif field == "source_json":
                    changed["meta"]["mode"] = "audit"
                else:
                    changed["mode"] = "audit"
                with self.subTest(field=field, mutation=mutation):
                    self.assertTrue(any(i.severity == "error" for i in self.metadata_issues(**{field: changed})))

    def test_missing_original_inputs_is_nonblocking(self):
        issues = self.metadata_issues()
        self.assertEqual(["RENDERER_PROVENANCE_NOT_PROVEN"], [i.code for i in issues])
        self.assertFalse(issues[0].blocking)

    def test_explicit_legacy_only(self):
        legacy = (ROOT / "tests/fixtures/v11-legacy-report-template.html").read_text()
        self.assertIn("REPORT_MODE_MISSING", self.codes(current_audit_report(legacy, ".html", template=True)[0]))
        self.assertEqual([], current_audit_report(legacy, ".html", template=True, legacy_v11=True)[0])

    def test_markdown_mode_without_provenance(self):
        for mode in ("Standard", "Audit", "STANDARD"):
            issues, _ = current_audit_report(f"# Example\nMode: {mode}\n", ".md", template=True, allow_markdown=True)
            self.assertFalse(any(i.code.startswith(("REPORT_MODE", "RENDERER_")) for i in issues))
        for text in ("# Example", "Mode: Update", "text Mode: Standard"):
            issues, _ = current_audit_report(text, ".md", template=True, allow_markdown=True)
            self.assertTrue(any(i.code.startswith("REPORT_MODE") for i in issues))

    def run_cli(self, html, *flags):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "report.html"
            path.write_text(html, encoding="utf-8")
            result = subprocess.run([sys.executable, "-B", str(ROOT / "scripts/validate_report.py"), str(path), "--json", *flags], capture_output=True, text=True)
            return result, json.loads(result.stdout)

    def test_cli_strict_warning_classification(self):
        # Metadata-only template check still exercises all shared structural contracts.
        result, payload = self.run_cli(self.audit_html, "--strict", "--template")
        self.assertEqual(0, result.returncode, result.stdout)
        self.assertFalse(payload["legacy_v11"])
        self.assertFalse(payload["source_json_supplied"])
        self.assertTrue(all(not i["blocking"] for i in payload["warnings"]))
        result, payload = self.run_cli(self.audit_html.replace('lang="zh-CN"', ''), "--strict", "--template")
        self.assertEqual(1, result.returncode)
        self.assertTrue(any(i["code"] == "HTML_LANG" and i["blocking"] for i in payload["warnings"]))

    def test_cli_input_errors_are_concise_exit_two(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "input.json"
            for raw in ("invalid", "[]"):
                path.write_text(raw)
                result, payload = self.run_cli(self.html, "--source-json", str(path))
                self.assertEqual(2, result.returncode)
                self.assertEqual("error", payload["status"])
                self.assertNotIn("Traceback", result.stderr)


class V12PolicyTests(V12MetadataTests):
    def check(self, content=None, valuation=None, html=None, **kwargs):
        content = content or self.content
        valuation = valuation or self.valuation
        html = html or render_report(content, valuation, self.template)
        return current_audit_report(html, ".html", expected_as_of="2026-09-01", **kwargs)[0]

    def assert_valid(self, issues):
        self.assertEqual([], [i for i in issues if i.severity == "error" or i.blocking])

    def test_real_standard_and_audit_strict_contract(self):
        self.assert_valid(self.check(source_json=self.content, valuation_json=self.valuation))
        self.assert_valid(self.check(self.audit_content, self.audit_valuation))

    def test_all_standard_row_boundaries(self):
        cases = (("theses", None, 3, 4, "THESIS"), ("financials", "metric_continuity", 5, 6, "CONTINUITY"),
                 ("management", "mda_delta", 3, 5, "MDA"), ("management", "promises", 1, 3, "PROMISE"),
                 ("monitoring", None, 5, 7, "MONITORING"))
        for key, nested, minimum, maximum, code in cases:
            for count in (minimum-1, minimum, maximum, maximum+1):
                with self.subTest(component=key, count=count):
                    c = copy.deepcopy(self.content)
                    rows = c[key][nested] if nested else c[key]
                    original = copy.deepcopy(rows[0])
                    rows[:] = [copy.deepcopy(original) for _ in range(count)]
                    if key == "theses":
                        for i, row in enumerate(rows): row["id"] = f"T{i+1:02}"
                        if count < 3:
                            # Preserve fragment targets outside the matrix for the row-count test.
                            c["monitoring"] = [r for r in c["monitoring"] if "T03" not in r["thesis_ids"]]
                            for r in c["scorecard"].values(): r["thesis_ids"] = ["T01"]
                            c["conclusion"]["thesis_ids"] = ["T01"]
                            for r in c["risks_and_breakers"]["breakers"]: r["thesis_ids"] = ["T01"]
                    if nested == "promises":
                        for i, row in enumerate(rows): row["id"] = f"P{i+1:02}"
                    if count == 0:
                        # Renderer requires nonempty research arrays; validator must independently reject empty HTML tables.
                        html = re.sub(r'(<div class="table-wrap" data-check="promise-tracker">.*?<tbody>).*?(</tbody>)', r'\1\2', self.html, flags=re.S)
                        issues = self.check(html=html)
                    else:
                        issues = self.check(c)
                    codes = self.codes(issues)
                    self.assertEqual(count < minimum, f"STANDARD_{code}_MIN" in codes)
                    self.assertEqual(count > maximum, f"STANDARD_{code}_BUDGET" in codes)

    def test_standard_forecast_years_and_year_cell_count(self):
        for count in (4, 5, 6):
            v = copy.deepcopy(self.valuation)
            rows = v["results"]["dcf"]["forecast"]
            while len(rows) < count: rows.append(dict(rows[-1], period="2032E"))
            rows[:] = rows[:count]
            if count == 6: v["results"]["dcf"]["forecast_extension_reason"] = "User requested six years"
            if count == 4:
                html = self.html.replace('<td>2031E</td>', '<td></td>')
                self.assertIn("STANDARD_DCF_YEARS", self.codes(self.check(html=html)))
            else:
                issues = self.check(valuation=v)
                self.assert_valid(issues)
                self.assertEqual(count == 6, "STANDARD_DCF_EXTENSION_MANUAL_REVIEW" in self.codes(issues))
                if count == 6:
                    html = render_report(self.content, v, self.template).replace("Forecast extension reason:", "Extra context:")
                    self.assertIn("STANDARD_DCF_EXTENSION_REASON", self.codes(self.check(html=html)))
        html = self.html.replace("Terminal growth:", "2020 2021 2022 Terminal growth:")
        self.assertNotIn("STANDARD_DCF_EXTENSION_REASON", self.codes(self.check(html=html)))

    def test_audit_three_ten_years_and_complete_bridge(self):
        for count in (3, 10):
            v = copy.deepcopy(self.audit_valuation)
            row = v["results"]["dcf"]["forecast"][0]
            v["results"]["dcf"]["forecast"] = [dict(row, period=f"{2027+i}E") for i in range(count)]
            issues = self.check(self.audit_content, v)
            self.assert_valid(issues)
            self.assertFalse(any(i.code.startswith("STANDARD_") for i in issues))
        html = self.audit_html.replace('<th>Capex</th>', '<th>Removed</th>')
        self.assertIn("COLUMN_DCF_FORECAST", self.codes(self.check(html=html)))

    def test_compact_columns_and_generic_reverse(self):
        html = self.html.replace('<th>Discount Factor</th>', '<th>Removed</th>')
        self.assertIn("COLUMN_DCF_FORECAST", self.codes(self.check(html=html)))
        html = self.html.replace('reverse-dcf reverse-valuation valuation-market-expectations', 'reverse-dcf valuation-market-expectations')
        self.assertIn("REVERSE_VALUATION_MISSING", self.codes(self.check(html=html)))
        for field in ("Growth Period", "Implied / Base Steady-state Margin", "Return / Reinvestment", "Cash-flow / Discount Basis", "Method / Value Basis", "Conclusion"):
            html = re.sub(r'<tr><td>' + re.escape(field) + r'</td>.*?</tr>', '', self.html)
            if field == "Return / Reinvestment": html = html.replace("reinvestment", "removed")
            with self.subTest(field=field):
                self.assertIn("REVERSE_VALUATION_FIELD", self.codes(self.check(html=html)))

    def test_sector_route_without_dcf_only_fields(self):
        from tests.test_render_report import sector_pair
        c, v = sector_pair()
        self.assert_valid(self.check(c, v))
        html = render_report(c, v, self.template).replace("Alternative Method:", "Removed:")
        self.assertIn("DCF_NOT_APPLICABLE_DETAIL", self.codes(self.check(html=html)))

    def test_source_roles_and_insufficient_evidence(self):
        for count in (0, 1, 2, 3):
            c = copy.deepcopy(self.content)
            peer = c["sources"][1]
            if count == 0: peer["role"] = "secondary"
            for i in range(1, count): c["sources"].append(dict(peer, id=f"S{6+i:02}"))
            codes = self.codes(self.check(c))
            self.assertEqual(count == 0, "INDEPENDENT_EVIDENCE_MISSING" in codes)
            self.assertEqual(count > 2, "STANDARD_COMPETITOR_SOURCE_BUDGET" in codes)
        c = copy.deepcopy(self.content)
        c["sources"][2]["role"] = "secondary"
        ind = c["business"]["industry_validation"]
        ind["independent"].update(text="Insufficient Evidence", status="not_available", reason="No reliable survey after checking the industry publications", source_ids=[])
        ind["confidence"] = "low"
        ind["gap"] = "Independent demand evidence remains unavailable after the covered search."
        self.assertIn("INDEPENDENT_EVIDENCE_INSUFFICIENT", self.codes(self.check(c)))
        ind["confidence"] = "high"
        self.assertIn("INDEPENDENT_EVIDENCE_MISSING", self.codes(self.check(c)))

    def test_na_and_not_verifiable_are_narrow(self):
        c = copy.deepcopy(self.content)
        row = c["scorecard"]["industry"]
        row.update(score=None, evidence_ids=[], counter_evidence_ids=[], thesis_ids=[], rationale_or_gap="Gap: Independent demand evidence is unavailable after covered search.")
        self.assert_valid(self.check(c))
        row["rationale_or_gap"] = "Unknown"
        self.assertIn("SCORECARD_NA_GAP", self.codes(self.check(c)))
        c = copy.deepcopy(self.content)
        row = c["management"]["promises"][0]
        row.update(status="not-verifiable", source_ids=[], assessment="Coverage: Three calls and annual reports; Gap: Original numeric promise not found.")
        self.assert_valid(self.check(c))
        row["assessment"] = "Unknown"
        self.assertIn("PROMISE_NOT_VERIFIABLE_GAP", self.codes(self.check(c)))
        for key in ("metric_continuity", "annual_history", "quarterly_history"):
            c = copy.deepcopy(self.content); c["financials"][key][0]["source_ids"] = []
            self.assertIn("TRACEABILITY_LINK", self.codes(self.check(c)))

    def test_duplicate_prose_is_only_a_manual_signal(self):
        c = copy.deepcopy(self.content)
        repeated = "This is a substantive repeated analysis concerning the company's competitive advantage and long-term cash conversion, which belongs in one authoritative thesis section."
        c["summary"]["one_line_judgment"] = repeated
        c["conclusion"]["decision"] = repeated
        found = [i for i in self.check(c) if i.code == "POSSIBLE_DUPLICATE_ANALYSIS"]
        self.assertEqual(1, len(found)); self.assertFalse(found[0].blocking)

    def test_mutated_visible_html_cannot_reuse_original_hashes(self):
        issues = self.check(html=self.html.replace("USD 150", "USD 999", 1), source_json=self.content, valuation_json=self.valuation)
        self.assertIn("RENDERER_ARTIFACT_MISMATCH", self.codes(issues))

    def test_history_coverage_gap_is_visible_and_required(self):
        c = copy.deepcopy(self.content)
        c["financials"]["annual_history"] = c["financials"]["annual_history"][-1:]
        c["financials"]["history_coverage"] = {"annual": "Coverage: 2025 only; Reason: Earlier reports unavailable after IR archive search; Insufficient Evidence"}
        self.assert_valid(self.check(c))
        c["financials"]["history_coverage"]["annual"] = "Insufficient Evidence"
        self.assertIn("HISTORICAL_COVERAGE", self.codes(self.check(c)))

    def test_source_role_conflict_is_recorded_without_proving_independence(self):
        html = self.html.replace("</body>", '<span id="S02" data-source-role="independent-industry">Duplicate role</span></body>')
        issues = self.check(html=html)
        self.assertIn("DUPLICATE_ID", self.codes(issues))
        conflict = [i for i in issues if i.code == "SOURCE_ROLE_CONFLICT"]
        self.assertEqual(1, len(conflict))
        self.assertFalse(conflict[0].blocking)
        html = self.html.replace('data-source-role="company-primary"', '')
        self.assertIn("SOURCE_ROLE_INVALID", self.codes(self.check(html=html)))

    def test_audit_keeps_v11_ledger_and_operating_stress(self):
        for header in ("Parameter", "Bear", "Base", "Bull", "As of", "Rationale", "Scenario Link"):
            self.assertIn("<th>" + header + "</th>", self.audit_html)
        self.assertIn('data-check="operating-sensitivity"', self.audit_html)
        c = copy.deepcopy(self.audit_content)
        del c["valuation_context"]["operating_sensitivity"]
        from render_report import RenderError
        with self.assertRaises(RenderError):
            render_report(c, self.audit_valuation, self.template)


if __name__ == "__main__":
    unittest.main()
