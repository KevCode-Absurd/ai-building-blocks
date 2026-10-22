from __future__ import annotations

import copy
import hashlib
import html as html_lib
import json
import re
import subprocess
import sys
import tempfile
import unittest
from html.parser import HTMLParser
from pathlib import Path
from typing import Optional

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from render_report import RenderError, render_report, write_report
from valuation_model import calculate


FIXTURES = ROOT / "tests" / "fixtures"
TEMPLATE = ROOT / "assets" / "report-template.html"


def load_json(name: str) -> dict:
    return json.loads((FIXTURES / name).read_text(encoding="utf-8"))


def canonical_hash(payload: dict) -> str:
    encoded = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def _escape_for_href(value: str) -> str:
    return html_lib.escape(value, quote=True)


def sector_pair() -> tuple[dict, dict]:
    content = load_json("standard-report.json")
    content["valuation_context"]["route"] = "sector_adaptive"
    content["valuation_context"]["method_rationale"] = "银行使用 sector-adaptive P/B 与股息方法，不强行 DCF。"
    valuation = load_json("standard-valuation.json")
    valuation["route"] = "sector_adaptive"
    scenarios = valuation["results"]["scenarios"]
    margin = valuation["results"]["margin_of_safety"]
    valuation["results"] = {
        "dcf": {"status": "not_applicable", "reason": "银行现金流与债务是经营项目，工业企业 FCFF 不适用。", "alternative_method": "GEV"},
        "methods": [
            {"id": "GEV", "name": "Growth-adjusted equity value", "kind": "intrinsic", "value_basis": "per_share", "value": 130.0, "note": "Primary", "per_share_value": 130.0},
            {"id": "PB", "name": "P/B cross-check", "kind": "relative", "value_basis": "per_share", "value": 120.0, "note": "Peer range", "per_share_value": 120.0}
        ],
        "market_implied_multiple": 1.25,
        "reverse_valuation": {
            "method": "market-implied-multiple", "value_basis": "per_share", "metric_name": "Book value",
            "metric_per_share": 80.0, "market_implied_multiple": 1.25, "primary_method_id": "GEV",
            "primary_implied_multiple": 1.625, "multiple_gap": -0.375
        },
        "reconciliation": {"primary_method_id": "GEV", "primary_per_share_value": 130.0, "minimum_per_share_value": 120.0, "maximum_per_share_value": 130.0, "spread": 10.0},
        "scenarios": scenarios,
        "margin_of_safety": margin
    }
    return content, valuation


def add_expected_return_contract(content: dict, valuation: dict) -> tuple[dict, dict]:
    content = copy.deepcopy(content)
    valuation = copy.deepcopy(valuation)
    content["valuation_context"]["scenario_rationales"] = {
        "bear": {"operating_assumptions": "Demand slows.", "valuation_assumptions": "Lower exit value.", "trigger_or_falsifier": "Retention below 100%."},
        "base": {"operating_assumptions": "Growth normalizes.", "valuation_assumptions": "Base exit value.", "trigger_or_falsifier": "FCF margin near plan."},
        "bull": {"operating_assumptions": "Adoption accelerates.", "valuation_assumptions": "Higher exit value.", "trigger_or_falsifier": "Retention above 115%."}
    }
    scenarios = valuation["results"]["scenarios"]
    scenarios["horizon_years"] = 5
    expected = {"bear": -0.20, "base": 0.50, "bull": 1.00}
    for name, item in scenarios["scenarios"].items():
        item["dividends"] = [0.0] * 5
        item["expected_return"] = expected[name]
    scenarios["probability_weighted_expected_return"] = 0.46
    return content, valuation


def fresh_fcfe_pair() -> tuple[dict, dict]:
    content = load_json("standard-report.json")
    payload = load_json("standard-valuation-input.json")
    dcf = payload["dcf"]
    dcf["basis"], dcf["discount_rate_type"] = "FCFE", "KE"
    for row in dcf["forecast"]:
        row.pop("operating_margin")
        row.pop("cash_tax_rate")
        row["net_margin"], row["net_borrowing"] = 0.10, 2.0
    terminal = dcf["terminal"]
    terminal.pop("operating_margin")
    terminal.pop("cash_tax_rate")
    terminal["net_margin"], terminal["net_borrowing"], terminal["return_metric"] = 0.10, 2.0, "ROE"
    payload["bridge"].update({
        "excess_cash": 500.0,
        "non_operating_investments": 300.0,
        "debt": 400.0,
        "minority_interest": 200.0,
        "other_claims": 100.0,
        "additional_equity_adjustments": [{"label": "Other equity adjustment", "amount": -5.0, "reason": "FCFE equity-only adjustment"}],
    })
    return content, calculate(payload)


class FragmentParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: list[str] = []
        self.fragments: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, Optional[str]]]) -> None:
        values = dict(attrs)
        if values.get("id"):
            self.ids.append(values["id"])
        href = values.get("href")
        if href and href.startswith("#"):
            self.fragments.append(href[1:])


class RendererInitialTests(unittest.TestCase):
    def setUp(self) -> None:
        self.content = load_json("standard-report.json")
        self.valuation = load_json("standard-valuation.json")
        self.template = TEMPLATE.read_text(encoding="utf-8")

    def test_output_is_deterministic_self_contained_and_has_provenance(self) -> None:
        first = render_report(self.content, self.valuation, self.template)
        second = render_report(self.content, self.valuation, self.template)
        self.assertEqual(first.encode("utf-8"), second.encode("utf-8"))
        self.assertIn('<meta name="generator" content="equity-research-skill-v1-2/render_report.py">', first)
        self.assertIn('data-generated-by="render_report.py"', first)
        self.assertIn("<style>", first)
        self.assertNotIn("<script", first.lower())
        self.assertNotIn("http-equiv=\"refresh\"", first.lower())

    def test_model_markup_is_only_escaped_text(self) -> None:
        payload = copy.deepcopy(self.content)
        payload["summary"]["headline"] = '<script>alert("x")</script> & 研究'
        output = render_report(payload, self.valuation, self.template)
        self.assertIn("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; 研究", output)
        self.assertNotIn('<script>alert("x")</script>', output)

    def test_unsafe_source_url_is_rejected(self) -> None:
        payload = copy.deepcopy(self.content)
        payload["sources"][0]["url_or_path"] = "javascript:alert(1)"
        with self.assertRaises(RenderError) as raised:
            render_report(payload, self.valuation, self.template)
        self.assertEqual("URL_UNSAFE", raised.exception.code)
        self.assertEqual("sources[0].url_or_path", raised.exception.path)

    def test_failed_render_preserves_existing_output(self) -> None:
        payload = copy.deepcopy(self.content)
        payload["sources"][0]["url_or_path"] = "data:text/html,bad"
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / "report.html"
            target.write_text("KEEP", encoding="utf-8")
            with self.assertRaises(RenderError):
                write_report(payload, self.valuation, self.template, target)
            self.assertEqual("KEEP", target.read_text(encoding="utf-8"))


class RendererContractTests(unittest.TestCase):
    def setUp(self) -> None:
        self.content = load_json("standard-report.json")
        self.valuation = load_json("standard-valuation.json")
        self.audit_content = load_json("audit-report.json")
        self.audit_valuation = load_json("audit-valuation.json")
        self.template = TEMPLATE.read_text(encoding="utf-8")

    def assert_render_error(self, code: str, path: str, content: dict, valuation: Optional[dict] = None) -> RenderError:
        with self.assertRaises(RenderError) as raised:
            render_report(content, valuation or self.valuation, self.template)
        self.assertEqual(code, raised.exception.code)
        self.assertEqual(path, raised.exception.path)
        return raised.exception

    def test_standard_and_audit_minimal_fixtures_render_with_mode_specific_dcf(self) -> None:
        standard = render_report(self.content, self.valuation, self.template)
        audit = render_report(self.audit_content, self.audit_valuation, self.template)
        self.assertIn('data-report-mode="standard"', standard)
        self.assertIn('data-dcf-view="compact"', standard)
        self.assertIn("<th>Margin</th>", standard)
        self.assertNotIn("Operating / Net Margin", standard)
        self.assertIn('data-report-mode="audit"', audit)
        self.assertIn('data-dcf-view="full"', audit)
        for heading in ("Year", "Revenue", "Growth", "Operating / Net Margin", "EBIT / Net Income", "D&amp;A", "Capex", "ΔNWC", "Net Borrowing", "FCFF / FCFE", "Discount Factor", "PV"):
            self.assertIn(f"<th>{heading}</th>", audit)

    def test_provenance_hashes_match_canonical_payloads(self) -> None:
        output = render_report(self.content, self.valuation, self.template)
        content_hash = canonical_hash(self.content)
        valuation_hash = canonical_hash(self.valuation)
        self.assertIn(f'<meta name="er-content-sha256" content="{content_hash}">', output)
        self.assertIn(f'<meta name="er-valuation-sha256" content="{valuation_hash}">', output)
        self.assertIn(f'data-content-sha256="{content_hash}"', output)
        self.assertIn(f'data-valuation-sha256="{valuation_hash}"', output)
        self.assertEqual(3, output.count('data-report-cutoff="2026-09-01"'))
        self.assertNotIn(json.dumps(self.content, ensure_ascii=False, sort_keys=True), output)

    def test_mode_schema_currency_and_route_mismatches_fail(self) -> None:
        cases = []
        content = copy.deepcopy(self.content); content["meta"]["mode"] = "update"
        cases.append(("MODE_RESERVED", "meta.mode", content, self.valuation))
        content = copy.deepcopy(self.content); content["meta"]["mode"] = "audit"
        cases.append(("MODE_MISMATCH", "meta.mode", content, self.valuation))
        content = copy.deepcopy(self.content); content["meta"]["currency"] = "HKD"
        cases.append(("CURRENCY_MISMATCH", "meta.currency", content, self.valuation))
        content = copy.deepcopy(self.content); content["valuation_context"]["route"] = "sector_adaptive"
        cases.append(("ROUTE_MISMATCH", "valuation_context.route", content, self.valuation))
        content = copy.deepcopy(self.content); content["schema_version"] = "1.1"
        cases.append(("SCHEMA_VERSION_UNSUPPORTED", "schema_version", content, self.valuation))
        valuation = copy.deepcopy(self.valuation); valuation["schema_version"] = "valuation.v0"
        cases.append(("SCHEMA_VERSION_UNSUPPORTED", "valuation.schema_version", self.content, valuation))
        valuation = copy.deepcopy(self.valuation); valuation["engine_version"] = "1.1.0"
        cases.append(("ENGINE_VERSION_UNSUPPORTED", "valuation.engine_version", self.content, valuation))
        valuation = copy.deepcopy(self.valuation); valuation["errors"] = [{"code": "BAD"}]
        cases.append(("VALUATION_NOT_OK", "valuation.errors", self.content, valuation))
        for code, path, candidate_content, candidate_valuation in cases:
            with self.subTest(code=code, path=path):
                self.assert_render_error(code, path, candidate_content, candidate_valuation)

    def test_malformed_and_duplicate_ids_fail_before_render(self) -> None:
        for collection, index, key, bad, code, path in (
            ("sources", 0, "id", "source-1", "ID_FORMAT_INVALID", "sources[0].id"),
            ("theses", 0, "id", "T0000", "ID_FORMAT_INVALID", "theses[0].id"),
            ("assumptions", 0, "id", "A0", "ID_FORMAT_INVALID", "valuation_context.assumptions[0].id"),
            ("promises", 0, "id", "P1000", "ID_FORMAT_INVALID", "management.promises[0].id")
        ):
            payload = copy.deepcopy(self.content)
            target = payload[collection] if collection in payload else payload["valuation_context" if collection == "assumptions" else "management"][collection]
            target[index][key] = bad
            with self.subTest(collection=collection):
                self.assert_render_error(code, path, payload)
        payload = copy.deepcopy(self.content)
        payload["sources"][1]["id"] = "S01"
        self.assert_render_error("ID_DUPLICATE", "sources[1].id", payload)
        duplicate_cases = (
            ("theses", self.content["theses"][0], "theses[3].id"),
            ("assumptions", self.content["valuation_context"]["assumptions"][0], "valuation_context.assumptions[3].id"),
            ("promises", self.content["management"]["promises"][0], "management.promises[1].id")
        )
        for name, duplicate, path in duplicate_cases:
            payload = copy.deepcopy(self.content)
            target = payload[name] if name == "theses" else payload["valuation_context" if name == "assumptions" else "management"][name]
            target.append(copy.deepcopy(duplicate))
            with self.subTest(duplicate=name):
                self.assert_render_error("ID_DUPLICATE", path, payload)

    def test_broken_source_and_thesis_references_fail(self) -> None:
        payload = copy.deepcopy(self.content)
        payload["theses"][0]["supporting_source_ids"] = ["S999"]
        self.assert_render_error("REFERENCE_BROKEN", "theses[0].supporting_source_ids[0]", payload)
        payload = copy.deepcopy(self.content)
        payload["monitoring"][0]["thesis_ids"] = ["T999"]
        self.assert_render_error("REFERENCE_BROKEN", "monitoring[0].thesis_ids[0]", payload)

    def test_missing_path_invalid_dates_and_presentation_fields_fail(self) -> None:
        payload = copy.deepcopy(self.content); del payload["meta"]["ticker"]
        self.assert_render_error("FIELD_REQUIRED", "meta.ticker", payload)
        payload = copy.deepcopy(self.content); payload["sources"][0]["publication_date"] = "2026-02-30"
        self.assert_render_error("DATE_INVALID", "sources[0].publication_date", payload)
        payload = copy.deepcopy(self.content); payload["summary"]["html"] = "<b>do not render</b>"
        self.assert_render_error("PRESENTATION_FIELD_FORBIDDEN", "summary.html", payload)
        payload = copy.deepcopy(self.content); payload["sources"][0]["url_or_path"] = "relative/report.pdf"
        self.assert_render_error("URL_UNSAFE", "sources[0].url_or_path", payload)
        payload = copy.deepcopy(self.content); payload["sources"][0]["url_or_path"] = "https://example.com/ok\u0007bad"
        self.assert_render_error("URL_UNSAFE", "sources[0].url_or_path", payload)

    def test_all_fragment_targets_exist_exactly_once(self) -> None:
        output = render_report(self.content, self.valuation, self.template)
        parser = FragmentParser(); parser.feed(output)
        for fragment in parser.fragments:
            with self.subTest(fragment=fragment):
                self.assertEqual(1, parser.ids.count(fragment))
        for identifier in ("S01", "S02", "S03", "S04", "S05", "T01", "T02", "T03", "A01", "A02", "A03", "P01"):
            self.assertEqual(1, parser.ids.count(identifier))

    def test_sector_route_renders_na_and_generic_reverse_without_empty_dcf(self) -> None:
        content, valuation = sector_pair()
        output = render_report(content, valuation, self.template)
        self.assertIn("DCF Not Applicable", output)
        self.assertIn("银行现金流与债务是经营项目", output)
        self.assertIn("Alternative Method", output)
        self.assertIn("Reverse Valuation", output)
        self.assertIn("Market-implied Multiple", output)
        self.assertNotIn('data-check="dcf-forecast"', output)
        self.assertNotIn('data-check="dcf-sensitivity"', output)

    def test_standard_forecast_extension_reason_is_required_and_visible(self) -> None:
        valuation = copy.deepcopy(self.valuation)
        valuation["results"]["dcf"]["forecast"].append(copy.deepcopy(valuation["results"]["dcf"]["forecast"][-1]))
        valuation["results"]["dcf"]["forecast"][-1]["period"] = "2032E"
        self.assert_render_error("FORECAST_COUNT_INVALID", "valuation.results.dcf.forecast", self.content, valuation)
        valuation["results"]["dcf"]["forecast_extension_reason"] = "行业采用周期需要第六个显式年份。"
        output = render_report(self.content, valuation, self.template)
        self.assertIn("Forecast extension reason: 行业采用周期需要第六个显式年份。", output)

    def test_html_has_no_external_or_active_content_and_keeps_print_contract(self) -> None:
        output = render_report(self.content, self.valuation, self.template)
        lowered = output.lower()
        for forbidden in ("<script", "<link", "<img", "<svg", "<canvas", "url(http", "javascript:", "data:text/html"):
            self.assertNotIn(forbidden, lowered)
        self.assertIn("@media print", output)
        self.assertIn('<meta name="viewport"', output)
        self.assertIn('<meta charset="utf-8">', output)
        self.assertIn('<html lang="zh-CN">', output)
        self.assertIn("Example &amp; Company 例证公司", output)
        self.assertIn("language=zh-CN&amp;view=full", output)

    def test_fixture_contract_counts_and_evidence_types_are_stable(self) -> None:
        self.assertEqual({"fact", "management-view", "market-view", "calculation", "inference"}, {row["kind"] for row in self.content["evidence_scope"]["evidence_blocks"]})
        self.assertEqual(3, len(self.content["theses"]))
        self.assertEqual(5, len(self.content["financials"]["metric_continuity"]))
        self.assertEqual(3, len(self.content["management"]["mda_delta"]))
        self.assertEqual(1, len(self.content["management"]["promises"]))
        self.assertEqual(3, len(self.content["financials"]["annual_history"]))
        self.assertEqual(4, len(self.content["financials"]["quarterly_history"]))
        self.assertEqual(5, len(self.content["monitoring"]))
        self.assertEqual({"industry", "moat", "financials", "management", "trend", "valuation", "monitoring"}, set(self.content["scorecard"]))
        self.assertEqual(["A01", "A02", "A03"], [row["id"] for row in self.content["valuation_context"]["assumptions"]])
        self.assertEqual(5, len(self.valuation["results"]["dcf"]["forecast"]))
        self.assertEqual([3, 3, 3], [len(row) for row in self.valuation["results"]["dcf"]["sensitivity"]["values"]])
        self.assertGreaterEqual(len(self.audit_valuation["results"]["dcf"]["forecast"]), 3)

    def test_url_allowlist_accepts_supported_forms_and_rejects_all_unsafe_forms(self) -> None:
        for url in ("http://example.com/report", "https://example.com/report", "file:///research/report.pdf", "/research/report.pdf"):
            payload = copy.deepcopy(self.content); payload["sources"][0]["url_or_path"] = url
            with self.subTest(accepted=url):
                self.assertIn(_escape_for_href(url), render_report(payload, self.valuation, self.template))
        for url in ("javascript:alert(1)", "data:text/html,bad", "vbscript:msgbox(1)", "//example.com/report", "report.pdf", "http:relative"):
            payload = copy.deepcopy(self.content); payload["sources"][0]["url_or_path"] = url
            with self.subTest(rejected=url):
                self.assert_render_error("URL_UNSAFE", "sources[0].url_or_path", payload)

    def test_template_sentinels_must_each_appear_once(self) -> None:
        with self.assertRaises(RenderError) as missing:
            render_report(self.content, self.valuation, self.template.replace("<!-- ER:BODY -->", ""))
        self.assertEqual("TEMPLATE_SENTINEL_INVALID", missing.exception.code)
        self.assertEqual("template", missing.exception.path)
        with self.assertRaises(RenderError) as raised:
            render_report(self.content, self.valuation, self.template + "<!-- ER:HEAD -->")
        self.assertEqual("TEMPLATE_SENTINEL_INVALID", raised.exception.code)
        self.assertEqual(1, self.template.count("<!-- ER:HEAD -->"))
        self.assertEqual(1, self.template.count("<!-- ER:BODY -->"))
        self.assertNotIn("{{", self.template)

    def test_cli_success_and_expected_error_are_concise_json(self) -> None:
        script = ROOT / "scripts" / "render_report.py"
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "report.html"
            success = subprocess.run([sys.executable, "-B", str(script), str(FIXTURES / "standard-report.json"), "--valuation", str(FIXTURES / "standard-valuation.json"), "--output", str(output)], text=True, capture_output=True, check=False)
            self.assertEqual(0, success.returncode, success.stdout + success.stderr)
            self.assertTrue(output.exists())
            bad = copy.deepcopy(self.content); bad["meta"]["mode"] = "update"
            bad_path = Path(directory) / "bad.json"; bad_path.write_text(json.dumps(bad), encoding="utf-8")
            failed_output = Path(directory) / "failed.html"
            failed = subprocess.run([sys.executable, "-B", str(script), str(bad_path), "--valuation", str(FIXTURES / "standard-valuation.json"), "--output", str(failed_output)], text=True, capture_output=True, check=False)
            self.assertEqual(2, failed.returncode)
            self.assertFalse(failed_output.exists())
            error = json.loads(failed.stdout)
            self.assertEqual({"code", "path", "message"}, set(error))
            self.assertEqual("MODE_RESERVED", error["code"])
            self.assertNotIn("Traceback", failed.stdout + failed.stderr)
            invalid_json = Path(directory) / "invalid.json"; invalid_json.write_text("{", encoding="utf-8")
            invalid = subprocess.run([sys.executable, "-B", str(script), str(invalid_json), "--valuation", str(FIXTURES / "standard-valuation.json"), "--output", str(Path(directory) / "invalid.html")], text=True, capture_output=True, check=False)
            self.assertEqual(2, invalid.returncode)
            self.assertEqual("JSON_INVALID", json.loads(invalid.stdout)["code"])


class ReviewerFixContractTests(unittest.TestCase):
    def setUp(self) -> None:
        self.content = load_json("standard-report.json")
        self.valuation = load_json("standard-valuation.json")
        self.template = TEMPLATE.read_text(encoding="utf-8")

    def test_scorecard_uses_v11_scale_fields_and_exact_weighted_total(self) -> None:
        expected_fields = {"score", "evidence_ids", "counter_evidence_ids", "thesis_ids", "confidence", "rationale_or_gap"}
        for key, row in self.content["scorecard"].items():
            with self.subTest(dimension=key):
                self.assertEqual(expected_fields, set(row))
                self.assertTrue(row["score"] is None or 1 <= row["score"] <= 5)
        output = render_report(self.content, self.valuation, self.template)
        self.assertIn("总分：76.5/100", output)

    def test_expected_return_is_distinct_and_scenario_cards_keep_all_inputs(self) -> None:
        content, valuation = add_expected_return_contract(self.content, self.valuation)
        output = render_report(content, valuation, self.template)
        self.assertIn("Expected Value", output)
        self.assertIn("Expected Return", output)
        self.assertIn("Probability-weighted Expected Return", output)
        self.assertIn("46.00%", output)
        for value in ("Operating assumptions", "Valuation assumptions", "Trigger / Falsifier", "Holding period", "Dividends", "IRR"):
            self.assertGreaterEqual(output.count(value), 3)

    def test_dcf_reverse_valuation_has_common_fields_and_base_comparison(self) -> None:
        content, valuation = add_expected_return_contract(self.content, self.valuation)
        output = render_report(content, valuation, self.template)
        for label in ("Market Price / Date", "Method / Value Basis", "Cash-flow / Discount Basis", "Required Terminal Cash Flow", "Growth Period", "Implied / Base Steady-state Margin", "Implied / Base Terminal Growth", "Return / Reinvestment", "Analyst / Base Comparison", "Conclusion"):
            with self.subTest(label=label):
                self.assertIn(label, output)
        self.assertIn("FCFF / WACC", output)

    def test_reverse_dcf_distinguishes_market_price_from_reverse_input_provenance(self) -> None:
        fresh = calculate(load_json("standard-valuation-input.json"))
        output = render_report(self.content, fresh, self.template)
        reverse_block = re.search(r'<div class="subsection" data-check="reverse-dcf reverse-valuation valuation-market-expectations".*?</div></div>', output, re.DOTALL)
        self.assertIsNotNone(reverse_block)
        self.assertIn("Current Market Price / Date", reverse_block.group(0))
        self.assertIn("USD 100 / 2026-09-01", reverse_block.group(0))
        self.assertIn("Reverse Input Price / Source", reverse_block.group(0))
        self.assertIn("USD 150 / reverse_valuation.forward_price", reverse_block.group(0))

        missing = copy.deepcopy(fresh)
        del missing["results"]["reverse_valuation"]["input_price"]
        with self.assertRaises(RenderError) as raised:
            render_report(self.content, missing, self.template)
        self.assertEqual("FIELD_REQUIRED", raised.exception.code)
        self.assertEqual("valuation.results.reverse_valuation.input_price", raised.exception.path)

    def test_fcfe_reconciliation_omits_non_equity_ev_bridge_rows(self) -> None:
        content, valuation = fresh_fcfe_pair()
        output = render_report(content, valuation, self.template)
        self.assertIn("Equity Value Reconciliation", output)
        self.assertNotIn("Signed EV-to-Equity Bridge", output)
        reconciliation = re.search(r'<div class="table-wrap" data-check="valuation-reconciliation">.*?</table></div>', output, re.DOTALL)
        self.assertIsNotNone(reconciliation)
        for label in ("Primary Method", "Value Basis", "+ Additional Equity Adjustments", "= Equity Value", "Dilution Treatment", "Diluted Shares", "FX to Quote", "= Per-share Value", "Reconciliation Note"):
            with self.subTest(label=label):
                self.assertIn(label, output)
        for omitted in ("Enterprise Value", "+ Excess Cash", "+ Non-operating Investments", "- Debt", "- Minority Interest", "- Other Claims", "500", "400", "300", "200"):
            with self.subTest(omitted=omitted):
                self.assertNotIn(omitted, reconciliation.group(0))

    def test_sector_reverse_valuation_uses_named_result_contract(self) -> None:
        content, valuation = sector_pair()
        content, valuation = add_expected_return_contract(content, valuation)
        valuation["results"]["reverse_valuation"] = {
            "method": "market-implied-multiple", "value_basis": "per_share", "metric_name": "Book value",
            "metric_per_share": 80.0, "market_implied_multiple": 1.25, "primary_method_id": "GEV",
            "primary_implied_multiple": 1.625, "multiple_gap": -0.375
        }
        output = render_report(content, valuation, self.template)
        for text in ("Market Price / Date", "Method / Value Basis", "Book value", "Market-implied Multiple", "Primary-implied Multiple", "Multiple Gap", "Analyst / Base Comparison", "Conclusion"):
            self.assertIn(text, output)

    def test_engine_and_reverse_warnings_are_visible_and_escaped(self) -> None:
        content, valuation = add_expected_return_contract(self.content, self.valuation)
        valuation["warnings"] = ['Engine <script>alert("x")</script> warning']
        valuation["results"]["reverse_valuation"]["warnings"] = ["Reverse <b>extreme</b>"]
        output = render_report(content, valuation, self.template)
        self.assertIn("Valuation Warnings", output)
        self.assertIn("Engine &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; warning", output)
        self.assertIn("Reverse &lt;b&gt;extreme&lt;/b&gt;", output)
        self.assertNotIn("<b>extreme</b>", output)

    def test_relative_cross_checks_and_complete_signed_bridge_are_visible(self) -> None:
        content, valuation = add_expected_return_contract(self.content, self.valuation)
        output = render_report(content, valuation, self.template)
        self.assertIn("Relative Cross-checks", output)
        self.assertIn("EV/FCF", output)
        for label in ("Enterprise Value", "+ Excess Cash", "+ Non-operating Investments", "- Debt", "- Minority Interest", "- Other Claims", "+ Additional Equity Adjustments", "= Equity Value", "Dilution Treatment", "Diluted Shares", "FX to Quote", "= Per-share Value"):
            self.assertIn(label, output)
        self.assertNotIn("Debt / Claims", output)

    def test_numeric_enums_basis_and_nullable_reverse_are_structured(self) -> None:
        content, valuation = add_expected_return_contract(self.content, self.valuation)
        probes = []
        item = copy.deepcopy(valuation); item["units"]["fx_to_quote"] = "one"; probes.append((item, "NUMBER_INVALID", "valuation.units.fx_to_quote"))
        item = copy.deepcopy(valuation); item["results"]["dcf"]["discount_rate_type"] = "KE"; probes.append((item, "RATE_BASIS_MISMATCH", "valuation.results.dcf.discount_rate_type"))
        item = copy.deepcopy(valuation); item["results"]["dcf"]["forecast"][0]["growth"] = "fast"; probes.append((item, "NUMBER_INVALID", "valuation.results.dcf.forecast[0].growth"))
        item = copy.deepcopy(valuation); item["results"]["scenarios"]["scenarios"]["bear"]["cash_flows"][1] = "zero"; probes.append((item, "NUMBER_INVALID", "valuation.results.scenarios.scenarios.bear.cash_flows[1]"))
        item = copy.deepcopy(valuation); item["results"]["scenarios"]["scenarios"]["bear"]["dividends"][1] = "zero"; probes.append((item, "NUMBER_INVALID", "valuation.results.scenarios.scenarios.bear.dividends[1]"))
        item = copy.deepcopy(valuation); item["results"]["dcf"]["sensitivity"]["values"][0][0] = "bad"; probes.append((item, "NUMBER_INVALID", "valuation.results.dcf.sensitivity.values[0][0]"))
        for candidate, code, path in probes:
            with self.subTest(path=path):
                with self.assertRaises(RenderError) as raised:
                    render_report(content, candidate, self.template)
                self.assertEqual(code, raised.exception.code)
                self.assertEqual(path, raised.exception.path)
        nullable = copy.deepcopy(valuation)
        nullable["results"]["reverse_valuation"]["implied_terminal_growth"] = None
        nullable["results"]["reverse_valuation"]["implied_reinvestment_rate"] = None
        nullable["results"]["reverse_valuation"]["warnings"] = ["No economically meaningful implied growth."]
        output = render_report(content, nullable, self.template)
        self.assertIn("N/A", output)
        self.assertIn("No economically meaningful implied growth.", output)

    def test_malformed_reference_and_unhashable_enums_are_render_errors_and_cli_exit_two(self) -> None:
        content, valuation = add_expected_return_contract(self.content, self.valuation)
        malformed = copy.deepcopy(content); malformed["theses"][0]["supporting_source_ids"] = [[]]
        with self.assertRaises(RenderError) as raised:
            render_report(malformed, valuation, self.template)
        self.assertEqual("ID_FORMAT_INVALID", raised.exception.code)
        self.assertEqual("theses[0].supporting_source_ids[0]", raised.exception.path)
        bad_enum = copy.deepcopy(content); bad_enum["meta"]["mode"] = []
        with self.assertRaises(RenderError) as enum_error:
            render_report(bad_enum, valuation, self.template)
        self.assertEqual("MODE_INVALID", enum_error.exception.code)
        with tempfile.TemporaryDirectory() as directory:
            malformed_path = Path(directory) / "bad.json"
            malformed_path.write_text(json.dumps(malformed), encoding="utf-8")
            valuation_path = Path(directory) / "valuation.json"
            valuation_path.write_text(json.dumps(valuation), encoding="utf-8")
            result = subprocess.run([sys.executable, "-B", str(ROOT / "scripts" / "render_report.py"), str(malformed_path), "--valuation", str(valuation_path), "--output", str(Path(directory) / "bad.html")], text=True, capture_output=True, check=False)
            self.assertEqual(2, result.returncode)
            self.assertEqual("ID_FORMAT_INVALID", json.loads(result.stdout)["code"])

    def test_language_matches_fixed_template(self) -> None:
        content, valuation = add_expected_return_contract(self.content, self.valuation)
        content["meta"]["language"] = "en-US"
        with self.assertRaises(RenderError) as raised:
            render_report(content, valuation, self.template)
        self.assertEqual("LANGUAGE_UNSUPPORTED", raised.exception.code)
        self.assertEqual("meta.language", raised.exception.path)

    def test_margin_of_safety_block_owns_complete_result_and_context_fields(self) -> None:
        content, valuation = add_expected_return_contract(self.content, self.valuation)
        output = render_report(content, valuation, self.template)
        block = re.search(r'<article[^>]+data-check="margin-of-safety".*?</article>', output, re.DOTALL)
        self.assertIsNotNone(block)
        for text in ("Fair Value", "USD 150", "Attractive Price", "USD 120", "High-Conviction Price", "USD 97.5", "Rationale", content["conclusion"]["margin_of_safety_rationale"]):
            with self.subTest(text=text):
                self.assertIn(text, block.group(0))

    def test_fresh_standard_engine_output_renders_without_fixture_drift(self) -> None:
        content = copy.deepcopy(self.content)
        content["valuation_context"]["scenario_rationales"] = add_expected_return_contract(self.content, self.valuation)[0]["valuation_context"]["scenario_rationales"]
        fresh = calculate(load_json("standard-valuation-input.json"))
        output = render_report(content, fresh, self.template)
        self.assertIn("Expected Return", output)
        self.assertIn("Relative Cross-checks", output)


if __name__ == "__main__":
    unittest.main()
