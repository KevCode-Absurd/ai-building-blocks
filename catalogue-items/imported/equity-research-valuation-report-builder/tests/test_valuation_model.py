import json
import math
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))


def standard_payload():
    return json.loads((ROOT / "tests/fixtures/standard-valuation-input.json").read_text())


def sector_payload():
    return json.loads((ROOT / "tests/fixtures/sector-valuation-input.json").read_text())


class ValuationModelTests(unittest.TestCase):
    def test_fcff_dcf_sensitivity_scenario_and_margin_of_safety(self):
        from valuation_model import calculate
        result = calculate(standard_payload())
        dcf = result["results"]["dcf"]
        self.assertEqual([row["revenue"] for row in dcf["forecast"]], [100.0] * 5)
        self.assertEqual([row["fcff"] for row in dcf["forecast"]], [15.0] * 5)
        self.assertAlmostEqual(dcf["enterprise_value"], 150.0, places=7)
        self.assertAlmostEqual(dcf["per_share_value"], 150.0, places=7)
        self.assertAlmostEqual(dcf["terminal_value_share"], 0.6209213231, places=8)
        self.assertEqual(dcf["sensitivity"]["discount_rates"], [.09, .10, .11])
        self.assertEqual(dcf["sensitivity"]["terminal_growth_rates"], [-.01, 0.0, .01])
        self.assertEqual((len(dcf["sensitivity"]["values"]), len(dcf["sensitivity"]["values"][0])), (3, 3))
        self.assertAlmostEqual(dcf["sensitivity"]["values"][1][1], 150.0, places=7)
        scenario = result["results"]["scenarios"]
        self.assertEqual(scenario["probability_weighted_ending_value"], 146.0)
        self.assertAlmostEqual(scenario["base_irr"], 0.0844717712, places=8)
        self.assertAlmostEqual(scenario["probability_weighted_irr"], 0.0786252214, places=8)
        mos = result["results"]["margin_of_safety"]
        self.assertAlmostEqual(mos["attractive_price"], 120.0, places=7)
        self.assertAlmostEqual(mos["high_conviction_price"], 97.5, places=7)

    def test_fcff_renderer_compatibility_fields_are_mechanical(self):
        from valuation_model import calculate
        payload = standard_payload()
        result = calculate(payload)
        self.assertEqual(result["market"], payload["market"])
        dcf = result["results"]["dcf"]
        row = dcf["forecast"][0]
        for key in ("period", "revenue", "growth", "operating_margin", "ebit", "d_and_a",
                    "capex", "delta_nwc", "net_borrowing", "fcff", "discount_factor", "pv"):
            self.assertIn(key, row)
        self.assertEqual({key: row[key] for key in ("period", "revenue", "growth", "operating_margin",
                                                     "ebit", "d_and_a", "capex", "delta_nwc", "net_borrowing", "fcff")},
                         {"period": "2027E", "revenue": 100.0, "growth": 0.0, "operating_margin": 0.20,
                          "ebit": 20.0, "d_and_a": 0.0, "capex": 0.0, "delta_nwc": 0.0,
                          "net_borrowing": 0.0, "fcff": 15.0})
        terminal = dcf["terminal"]
        self.assertEqual(set(("revenue", "growth", "margin", "cash_flow", "return_metric", "return_rate",
                              "implied_reinvestment_rate", "value", "present_value", "value_share")), set(terminal))
        self.assertEqual(terminal["revenue"], 100.0)
        self.assertEqual(terminal["growth"], 0.0)
        self.assertAlmostEqual(terminal["margin"], 0.15, places=7)
        self.assertAlmostEqual(terminal["cash_flow"], 15.0, places=7)
        self.assertEqual({key: terminal[key] for key in ("return_metric", "return_rate", "implied_reinvestment_rate")},
                         {"return_metric": "ROIC", "return_rate": 0.15, "implied_reinvestment_rate": 0.0})
        self.assertAlmostEqual(terminal["value"], 150.0, places=7)
        self.assertAlmostEqual(terminal["present_value"], dcf["terminal_pv"], places=7)
        self.assertAlmostEqual(terminal["value_share"], dcf["terminal_value_share"], places=7)
        reconciliation = result["results"]["reconciliation"]
        self.assertEqual(reconciliation["value_basis"], "enterprise_value")
        self.assertAlmostEqual(reconciliation["enterprise_value"], 150.0, places=7)
        self.assertAlmostEqual(reconciliation["equity_value"], 150.0, places=7)
        self.assertEqual({key: reconciliation[key] for key in (
            "excess_cash", "non_operating_investments", "debt", "minority_interest", "other_claims",
            "additional_equity_adjustments_total", "dilution_treatment", "diluted_shares", "fx_to_quote")},
            {"excess_cash": 0.0, "non_operating_investments": 0.0, "debt": 0.0, "minority_interest": 0.0,
             "other_claims": 0.0, "additional_equity_adjustments_total": 0.0,
             "dilution_treatment": "fully_diluted_shares", "diluted_shares": 1.0, "fx_to_quote": 1.0})

    def test_fcfe_renderer_compatibility_fields_and_equity_reconciliation(self):
        from valuation_model import calculate
        payload = standard_payload()
        dcf = payload["dcf"]
        dcf["basis"], dcf["discount_rate_type"] = "FCFE", "KE"
        for row in dcf["forecast"]:
            row.pop("operating_margin"); row.pop("cash_tax_rate")
            row["net_margin"], row["net_borrowing"] = 0.10, 2.0
        terminal = dcf["terminal"]
        terminal.pop("operating_margin"); terminal.pop("cash_tax_rate")
        terminal["net_margin"], terminal["net_borrowing"], terminal["return_metric"] = 0.10, 2.0, "ROE"
        result = calculate(payload)
        self.assertEqual(result["market"], payload["market"])
        row = result["results"]["dcf"]["forecast"][0]
        for key in ("period", "revenue", "growth", "net_margin", "net_income", "d_and_a", "capex",
                    "delta_nwc", "net_borrowing", "fcfe", "discount_factor", "pv"):
            self.assertIn(key, row)
        self.assertEqual({key: row[key] for key in ("period", "revenue", "growth", "net_margin", "net_income",
                                                     "d_and_a", "capex", "delta_nwc", "net_borrowing", "fcfe")},
                         {"period": "2027E", "revenue": 100.0, "growth": 0.0, "net_margin": 0.10,
                          "net_income": 10.0, "d_and_a": 0.0, "capex": 0.0, "delta_nwc": 0.0,
                          "net_borrowing": 2.0, "fcfe": 12.0})
        terminal = result["results"]["dcf"]["terminal"]
        self.assertEqual(set(("revenue", "growth", "margin", "cash_flow", "return_metric", "return_rate",
                              "implied_reinvestment_rate", "value", "present_value", "value_share")), set(terminal))
        self.assertEqual(terminal["revenue"], 100.0)
        self.assertEqual(terminal["growth"], 0.0)
        self.assertAlmostEqual(terminal["margin"], 0.12, places=7)
        self.assertAlmostEqual(terminal["cash_flow"], 12.0, places=7)
        self.assertEqual({key: terminal[key] for key in ("return_metric", "return_rate", "implied_reinvestment_rate")},
                         {"return_metric": "ROE", "return_rate": 0.15, "implied_reinvestment_rate": 0.0})
        self.assertAlmostEqual(terminal["value"], 120.0, places=7)
        reconciliation = result["results"]["reconciliation"]
        self.assertNotIn("enterprise_value", reconciliation)
        self.assertEqual(reconciliation["value_basis"], "equity_value")
        self.assertAlmostEqual(reconciliation["equity_value"], 120.0, places=7)
        self.assertEqual({key: reconciliation[key] for key in (
            "excess_cash", "non_operating_investments", "debt", "minority_interest", "other_claims",
            "additional_equity_adjustments_total", "dilution_treatment", "diluted_shares", "fx_to_quote")},
            {"excess_cash": 0.0, "non_operating_investments": 0.0, "debt": 0.0, "minority_interest": 0.0,
             "other_claims": 0.0, "additional_equity_adjustments_total": 0.0,
             "dilution_treatment": "fully_diluted_shares", "diluted_shares": 1.0, "fx_to_quote": 1.0})

    def test_sector_output_exposes_market_without_industrial_bridge(self):
        from valuation_model import calculate
        payload = sector_payload()
        result = calculate(payload)
        self.assertEqual(result["market"], payload["market"])
        reconciliation = result["results"]["reconciliation"]
        self.assertEqual(reconciliation["primary_method_id"], "GEV")
        self.assertIn("minimum_per_share_value", reconciliation)
        self.assertNotIn("enterprise_value", reconciliation)
        self.assertNotIn("excess_cash", reconciliation)

    def test_sector_enterprise_value_cannot_be_treated_as_equity(self):
        from valuation_model import calculate, ModelError
        payload = sector_payload()
        payload["methods"][0]["value_basis"] = "enterprise_value"
        with self.assertRaises(ModelError) as caught:
            calculate(payload)
        self.assertEqual("FIELD_INVALID", caught.exception.code)

    def test_fcfe_uses_net_borrowing_without_a_cash_or_debt_bridge(self):
        from valuation_model import calculate
        payload = standard_payload()
        dcf = payload["dcf"]
        dcf["basis"], dcf["discount_rate_type"] = "FCFE", "KE"
        for row in dcf["forecast"]:
            row.pop("operating_margin"); row.pop("cash_tax_rate"); row["net_margin"] = 0.10; row["net_borrowing"] = 2.0
        terminal = dcf["terminal"]
        terminal.pop("operating_margin"); terminal.pop("cash_tax_rate"); terminal["net_margin"] = 0.10; terminal["net_borrowing"] = 2.0; terminal["return_metric"] = "ROE"
        payload["bridge"].update({"excess_cash": 500.0, "debt": 400.0})
        result = calculate(payload)
        output = result["results"]["dcf"]
        self.assertEqual(output["basis"], "FCFE")
        self.assertNotIn("enterprise_value", output)
        self.assertAlmostEqual(output["forecast"][0]["fcfe"], 12.0, places=7)
        self.assertAlmostEqual(output["equity_value"], 120.0, places=7)
        payload["relative_cross_checks"][0]["value"] = 140.0
        self.assertAlmostEqual(calculate(payload)["results"]["relative_cross_checks"][0]["per_share_value"], 240.0, places=7)

    def test_rejects_basis_rate_conflicts_and_invalid_numbers(self):
        from valuation_model import ModelError, calculate
        cases = [(lambda p: p["dcf"].update(discount_rate_type="KE"), "RATE_BASIS_MISMATCH"),
                 (lambda p: p["market"].update(diluted_shares=0), "FIELD_INVALID"),
                 (lambda p: p["units"].update(fx_to_quote=0), "FIELD_INVALID"),
                 (lambda p: p["units"].update(fx_to_quote=True), "NUMBER_INVALID"),
                 (lambda p: p["dcf"].update(discount_rate="9%"), "NUMBER_INVALID"),
                 (lambda p: p["dcf"].update(discount_rate=math.inf), "NUMBER_NOT_FINITE"),
                 (lambda p: p["dcf"].update(discount_rate=math.nan), "NUMBER_NOT_FINITE")]
        for change, code in cases:
            with self.subTest(code=code):
                payload = standard_payload(); change(payload)
                with self.assertRaises(ModelError) as caught: calculate(payload)
                self.assertEqual(caught.exception.code, code)
        payload = standard_payload(); payload["dcf"]["basis"] = "FCFE"
        with self.assertRaises(ModelError) as caught: calculate(payload)
        self.assertEqual(caught.exception.code, "RATE_BASIS_MISMATCH")

    def test_forecast_terminal_and_sensitivity_validation_boundaries(self):
        from valuation_model import ModelError, calculate
        cases = []
        p = standard_payload(); p["dcf"]["forecast"] = p["dcf"]["forecast"][:4]; cases.append((p, "FORECAST_COUNT_INVALID"))
        p = standard_payload(); p["dcf"]["forecast"].append(dict(p["dcf"]["forecast"][-1], period="2032E", discount_period=6)); cases.append((p, "FORECAST_COUNT_INVALID"))
        p = standard_payload(); p["dcf"]["terminal"]["growth"] = .10; cases.append((p, "TERMINAL_RATE_INVALID"))
        p = standard_payload(); p["dcf"]["sensitivity"]["discount_rates"] = [.09, .10, .10]; cases.append((p, "SENSITIVITY_GRID_INVALID"))
        for payload, code in cases:
            with self.subTest(code=code):
                with self.assertRaises(ModelError) as caught: calculate(payload)
                self.assertEqual(caught.exception.code, code)
        p = standard_payload(); p["dcf"]["forecast"].append(dict(p["dcf"]["forecast"][-1], period="2032E", discount_period=6)); p["dcf"]["forecast_extension_reason"] = "A sixth explicit year is needed."; accepted = calculate(p); self.assertEqual(accepted["status"], "ok"); self.assertEqual(accepted["results"]["dcf"]["forecast_extension_reason"], p["dcf"]["forecast_extension_reason"])
        self.assertNotIn("forecast_extension_reason", calculate(standard_payload())["results"]["dcf"])
        p = standard_payload(); p["mode"] = "audit"; p["dcf"]["forecast"] = p["dcf"]["forecast"][:3]; p["dcf"]["forecast"][0]["discount_period"] = .5; self.assertEqual(calculate(p)["status"], "ok")

    def test_reverse_round_trip_and_impossible_reverse_warning(self):
        from valuation_model import calculate
        result = calculate(standard_payload())
        reverse = result["results"]["reverse_valuation"]
        self.assertEqual(reverse["input_price"], 150.0)
        self.assertEqual(reverse["input_price_source"], "reverse_valuation.forward_price")
        self.assertNotEqual(reverse["input_price"], standard_payload()["market"]["current_price"])
        self.assertAlmostEqual(reverse["implied_terminal_cash_flow_margin"], .15, places=7)
        self.assertAlmostEqual(reverse["implied_terminal_growth"], 0.0, places=7)
        payload = standard_payload(); payload["reverse_valuation"]["forward_price"] = 1.0
        self.assertTrue(calculate(payload)["results"]["reverse_valuation"]["warnings"])
        payload = standard_payload(); payload.pop("reverse_valuation")
        self.assertNotIn("reverse_valuation", calculate(payload)["results"])

    def test_relative_cross_check_reconciles_enterprise_value_and_fx(self):
        from valuation_model import calculate
        result = calculate(standard_payload())
        check = result["results"]["relative_cross_checks"][0]
        self.assertEqual(check["id"], "M02")
        self.assertAlmostEqual(check["per_share_value"], 140.0, places=7)
        payload = standard_payload(); payload["units"]["fx_to_quote"] = 2.0
        self.assertAlmostEqual(calculate(payload)["results"]["relative_cross_checks"][0]["per_share_value"], 280.0, places=7)

    def test_fcfe_reverse_growth_holds_absolute_net_borrowing_constant(self):
        from valuation_model import calculate
        payload = standard_payload()
        dcf = payload["dcf"]
        dcf["basis"], dcf["discount_rate_type"] = "FCFE", "KE"
        for row in dcf["forecast"] + [dcf["terminal"]]:
            row.pop("operating_margin"); row.pop("cash_tax_rate")
            row["net_margin"], row["net_borrowing"] = 0.10, 2.0
        dcf["terminal"]["return_metric"] = "ROE"
        payload["reverse_valuation"]["forward_price"] = 150.0
        reverse = calculate(payload)["results"]["reverse_valuation"]
        required_tv = reverse["required_terminal_value"]
        implied_g = reverse["implied_terminal_growth"]
        # Independent forward calculation: NI grows, fixed net borrowing does not.
        forward_tv = (100.0 * (1 + implied_g) * 0.10 + 2.0) / (0.10 - implied_g)
        self.assertAlmostEqual(forward_tv, required_tv, places=7)

    def test_discount_schedule_must_be_positive_and_increasing(self):
        from valuation_model import ModelError, calculate
        for index, value in ((0, 0.0), (0, -1.0), (1, 1.0), (2, 1.5)):
            payload = standard_payload()
            payload["dcf"]["forecast"][index]["discount_period"] = value
            with self.subTest(index=index, value=value):
                with self.assertRaises(ModelError) as caught:
                    calculate(payload)
                self.assertEqual(caught.exception.code, "FORECAST_TIMING_INVALID")

    def test_irr_rejects_nonconventional_future_cash_flows(self):
        from valuation_model import ModelError, calculate
        for field in ("exit_value", "dividends"):
            payload = standard_payload()
            payload["scenarios"]["items"]["base"][field] = -1 if field == "exit_value" else [-1, 0, 0, 0, 0]
            with self.subTest(field=field):
                with self.assertRaises(ModelError) as caught:
                    calculate(payload)
                self.assertEqual(caught.exception.code, "SCENARIO_SET_INVALID")

    def test_scenario_irr_and_scenario_errors(self):
        from valuation_model import ModelError, calculate
        payload = standard_payload(); payload["scenarios"] = {"horizon": 1, "items": {"bear": {"probability": .2, "exit_value": 80, "dividends": [0]}, "base": {"probability": .6, "exit_value": 100, "dividends": [10]}, "bull": {"probability": .2, "exit_value": 200, "dividends": [0]}}}
        scenario = calculate(payload)["results"]["scenarios"]
        self.assertAlmostEqual(scenario["scenarios"]["base"]["irr"], .10, places=8)
        self.assertEqual(scenario["scenarios"]["base"]["cash_flows"], [-100.0, 110])
        self.assertNotAlmostEqual(scenario["probability_weighted_irr"], sum(v["irr"] for v in scenario["scenarios"].values()) / 3, places=8)
        payload["scenarios"]["items"]["bull"]["probability"] = .3
        with self.assertRaises(ModelError) as caught: calculate(payload)
        self.assertEqual(caught.exception.code, "PROBABILITY_SUM_INVALID")
        payload = standard_payload(); payload["scenarios"]["items"].pop("bull")
        with self.assertRaises(ModelError) as caught: calculate(payload)
        self.assertEqual(caught.exception.code, "SCENARIO_SET_INVALID")
        payload = standard_payload(); payload["scenarios"]["items"]["base"]["dividends"] = [0]
        with self.assertRaises(ModelError) as caught: calculate(payload)
        self.assertEqual(caught.exception.code, "SCENARIO_SET_INVALID")

    def test_scenario_expected_return_is_total_holding_period_return(self):
        from valuation_model import ModelError, calculate
        payload = standard_payload()
        payload["market"]["current_price"] = 100.0
        payload["scenarios"] = {
            "horizon": 2,
            "items": {
                "bear": {"probability": 0.2, "exit_value": 80.0, "dividends": [2.0, 3.0]},
                "base": {"probability": 0.6, "exit_value": 130.0, "dividends": [4.0, 6.0]},
                "bull": {"probability": 0.2, "exit_value": 180.0, "dividends": [5.0, 7.0]},
            },
        }
        scenario = calculate(payload)["results"]["scenarios"]
        self.assertEqual(scenario["horizon_years"], 2)
        self.assertEqual(scenario["scenarios"]["base"]["dividends"], [4.0, 6.0])
        self.assertAlmostEqual(scenario["scenarios"]["base"]["expected_return"], 0.40, places=8)
        self.assertAlmostEqual(scenario["probability_weighted_ending_value"], 130.0, places=8)
        self.assertEqual(scenario["probability_weighted_dividends"], [3.8, 5.6])
        self.assertAlmostEqual(scenario["probability_weighted_expected_return"], 0.394, places=8)
        self.assertNotAlmostEqual(scenario["scenarios"]["base"]["expected_return"], scenario["scenarios"]["base"]["irr"], places=8)
        json.dumps(calculate(payload), allow_nan=False)
        for invalid_price in (0.0, -1.0):
            invalid = standard_payload()
            invalid["market"]["current_price"] = invalid_price
            with self.subTest(current_price=invalid_price):
                with self.assertRaises(ModelError) as caught:
                    calculate(invalid)
                self.assertEqual(caught.exception.code, "FIELD_INVALID")

    def test_sector_reverse_valuation_exposes_market_implied_multiple(self):
        from valuation_model import calculate
        result = calculate(sector_payload())
        reverse = result["results"]["reverse_valuation"]
        self.assertEqual(reverse, {
            "method": "market-implied-multiple",
            "value_basis": "per_share",
            "metric_name": "GEV per share",
            "metric_per_share": 80.0,
            "market_implied_multiple": 1.25,
            "primary_method_id": "GEV",
            "primary_implied_multiple": 1.875,
            "multiple_gap": -0.625,
        })
        json.dumps(result, allow_nan=False)

    def test_zero_cash_flow_and_overflow_are_structured_errors_or_finite(self):
        from valuation_model import ModelError, calculate
        payload = standard_payload(); payload.pop("reverse_valuation"); payload["dcf"]["base_revenue"] = 0
        result = calculate(payload)
        self.assertEqual(result["results"]["dcf"]["terminal_value_share"], 0.0)
        json.dumps(result, allow_nan=False)
        payload = standard_payload(); payload["dcf"]["base_revenue"] = 1e308; payload["dcf"]["forecast"][0]["growth"] = 1e308
        with self.assertRaises(ModelError) as caught: calculate(payload)
        self.assertEqual(caught.exception.code, "NUMBER_NOT_FINITE")

    def test_sector_route_excludes_dcf_tables_and_reconciles_methods(self):
        from valuation_model import ModelError, calculate
        result = calculate(sector_payload())
        self.assertEqual(result["results"]["dcf"]["status"], "not_applicable")
        self.assertNotIn("forecast", result["results"]["dcf"])
        self.assertEqual(result["results"]["methods"][0]["per_share_value"], 150.0)
        self.assertAlmostEqual(result["results"]["market_implied_multiple"], 1.25)
        payload = sector_payload(); payload["methods"] = payload["methods"][1:]
        with self.assertRaises(ModelError) as caught: calculate(payload)
        self.assertEqual(caught.exception.code, "NON_DCF_METHODS_MISSING")
        payload = sector_payload(); payload["primary_method_id"] = "PB"
        with self.assertRaises(ModelError) as caught: calculate(payload)
        self.assertEqual(caught.exception.code, "NON_DCF_METHODS_MISSING")
        payload = sector_payload(); payload["methods"] = payload["methods"][:1]
        with self.assertRaises(ModelError) as caught: calculate(payload)
        self.assertEqual(caught.exception.code, "NON_DCF_METHODS_MISSING")
        payload = sector_payload(); payload.pop("sector_dcf_unsuitable_reason")
        with self.assertRaises(ModelError) as caught: calculate(payload)
        self.assertEqual(caught.exception.code, "NON_DCF_METHODS_MISSING")
        payload = sector_payload(); payload["reverse_multiple"]["metric_per_share"] = 0
        with self.assertRaises(ModelError) as caught: calculate(payload)
        self.assertEqual(caught.exception.code, "FIELD_INVALID")

    def test_unknown_fields_json_safety_and_cli(self):
        from valuation_model import ModelError, calculate
        payload = standard_payload(); payload["unexpected"] = 1
        with self.assertRaises(ModelError) as caught: calculate(payload)
        self.assertEqual(caught.exception.code, "FIELD_UNKNOWN")
        json.dumps(calculate(standard_payload()), allow_nan=False)
        with tempfile.TemporaryDirectory() as directory:
            input_path, output_path = Path(directory) / "in.json", Path(directory) / "out.json"
            input_path.write_text(json.dumps(standard_payload()))
            success = subprocess.run([sys.executable, "-B", "scripts/valuation_model.py", str(input_path), "--output", str(output_path)], cwd=ROOT, text=True, capture_output=True)
            self.assertEqual(success.returncode, 0)
            self.assertEqual(json.loads(output_path.read_text())["status"], "ok")
            input_path.write_text("{")
            failure = subprocess.run([sys.executable, "-B", "scripts/valuation_model.py", str(input_path)], cwd=ROOT, text=True, capture_output=True)
            self.assertEqual(failure.returncode, 2)
            self.assertEqual(json.loads(failure.stdout)["errors"][0]["code"], "JSON_INVALID")
            input_path.write_text(json.dumps(dict(standard_payload(), unexpected=1)))
            failure = subprocess.run([sys.executable, "-B", "scripts/valuation_model.py", str(input_path)], cwd=ROOT, text=True, capture_output=True)
            self.assertEqual(failure.returncode, 2)
            self.assertEqual(json.loads(failure.stdout)["errors"][0]["code"], "FIELD_UNKNOWN")
            compatibility = subprocess.run([sys.executable, "-B", "scripts/financial_metrics.py", "growth", "120", "100", "--percent"], cwd=ROOT, text=True, capture_output=True)
            self.assertEqual(compatibility.returncode, 0)
            self.assertEqual(json.loads(compatibility.stdout)["result"], 20.0)
