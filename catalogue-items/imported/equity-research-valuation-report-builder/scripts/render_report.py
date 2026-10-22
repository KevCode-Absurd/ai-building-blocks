#!/usr/bin/env python3
"""Render validated V1.2 research JSON into deterministic self-contained HTML."""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import math
import os
import re
import tempfile
from datetime import date
from pathlib import Path
from typing import Any, Iterable, Optional
from urllib.parse import urlsplit


SCHEMA_VERSION = "1.2"
RENDERER_VERSION = "1.2.0"
GENERATOR = "equity-research-skill-v1-2/render_report.py"
HEAD_SENTINEL = "<!-- ER:HEAD -->"
BODY_SENTINEL = "<!-- ER:BODY -->"
TOP_LEVEL_KEYS = {"schema_version", "meta", "summary", "evidence_scope", "business", "management", "financials", "valuation_context", "theses", "risks_and_breakers", "scorecard", "monitoring", "conclusion", "sources"}
SCORE_KEYS = ("industry", "moat", "financials", "management", "trend", "valuation", "monitoring")
EVIDENCE_KINDS = {"fact", "management-view", "market-view", "calculation", "inference"}
CONFIDENCE = {"high", "medium", "low"}
COMPARABILITY = {"comparable", "partially-comparable", "not-comparable"}
PROMISE_STATUS = {"delivered", "partially-delivered", "missed", "revised", "pending", "not-verifiable"}
SOURCE_ROLES = {"company-primary", "competitor-primary", "independent-industry", "market-data", "secondary"}
ID_PATTERN = re.compile(r"^(?P<prefix>[STAP])(?:0[1-9]|[1-9][0-9]{1,2})$")


class RenderError(ValueError):
    def __init__(self, code: str, path: str, message: str) -> None:
        self.code = code
        self.path = path
        self.message = message
        super().__init__(message)


def _fail(code: str, path: str, message: str) -> None:
    raise RenderError(code, path, message)


def _e(value: Any) -> str:
    return html.escape(str(value), quote=True)


def _fmt(value: Any) -> str:
    if value is None:
        return "N/A"
    if isinstance(value, bool):
        return _e(value)
    if isinstance(value, (int, float)):
        text = f"{value:,.4f}".rstrip("0").rstrip(".")
        return text if text != "-0" else "0"
    return _e(value)


def _pct(value: Any) -> str:
    if value is None:
        return "N/A"
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return f"{value * 100:.2f}%"
    return _e(value)


def _money(value: Any, currency: str) -> str:
    return f"{_e(currency)} {_fmt(value)}"


def _links(ids: Iterable[str]) -> str:
    return ", ".join(f'<a class="source-ref" href="#{_e(item)}">{_e(item)}</a>' for item in ids)


def _table(headers: list[str], rows: list[list[str]], *, check: Optional[str] = None, table_id: Optional[str] = None) -> str:
    attributes = []
    if check:
        attributes.append(f'data-check="{_e(check)}"')
    if table_id:
        attributes.append(f'id="{_e(table_id)}"')
    attr_text = (" " + " ".join(attributes)) if attributes else ""
    head = "".join(f"<th>{_e(item)}</th>" for item in headers)
    body = "".join("<tr>" + "".join(f"<td>{cell}</td>" for cell in row) + "</tr>" for row in rows)
    return f'<div class="table-wrap"{attr_text}><table><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table></div>'


def _safe_url(value: Any, path: str) -> str:
    if not isinstance(value, str) or not value:
        _fail("URL_UNSAFE", path, "must be a non-empty absolute URL or path")
    if any(ord(char) < 32 or ord(char) == 127 for char in value):
        _fail("URL_UNSAFE", path, "control characters are not allowed")
    if value.startswith("//"):
        _fail("URL_UNSAFE", path, "protocol-relative URLs are not allowed")
    parsed = urlsplit(value)
    if parsed.scheme:
        if parsed.scheme.lower() not in {"http", "https", "file"}:
            _fail("URL_UNSAFE", path, "URL scheme is not allowed")
        if parsed.scheme.lower() in {"http", "https"} and not parsed.netloc:
            _fail("URL_UNSAFE", path, "HTTP URLs require a host")
        if parsed.scheme.lower() == "file" and not parsed.path.startswith("/"):
            _fail("URL_UNSAFE", path, "file URLs require an absolute path")
    elif not (value.startswith("/") and not value.startswith("//")):
        _fail("URL_UNSAFE", path, "relative paths are not allowed")
    return value


def _object(value: Any, path: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        _fail("FIELD_INVALID", path, "must be an object")
    return value


def _array(value: Any, path: str) -> list[Any]:
    if not isinstance(value, list):
        _fail("FIELD_INVALID", path, "must be an array")
    return value


def _text(value: Any, path: str, *, allow_empty: bool = False) -> str:
    if not isinstance(value, str) or (not allow_empty and not value.strip()):
        _fail("FIELD_INVALID", path, "must be a non-empty string")
    return value


def _number(value: Any, path: str) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(float(value)):
        _fail("NUMBER_INVALID", path, "must be a finite number")
    return float(value)


def _nullable_number(value: Any, path: str) -> Optional[float]:
    if value is None:
        return None
    return _number(value, path)


def _enum(value: Any, allowed: set[str], path: str, *, code: str = "ENUM_INVALID") -> str:
    if not isinstance(value, str) or value not in allowed:
        _fail(code, path, f"must be one of {', '.join(sorted(allowed))}")
    return value


def _number_array(value: Any, path: str) -> list[Any]:
    items = _array(value, path)
    for index, item in enumerate(items):
        _number(item, f"{path}[{index}]")
    return items


def _text_array(value: Any, path: str) -> list[Any]:
    items = _array(value, path)
    for index, item in enumerate(items):
        _text(item, f"{path}[{index}]")
    return items


def _fields(value: Any, required: set[str], optional: set[str], path: str) -> dict[str, Any]:
    item = _object(value, path)
    missing = sorted(required - set(item))
    if missing:
        missing_path = f"{path}.{missing[0]}" if path else missing[0]
        _fail("FIELD_REQUIRED", missing_path, "required field is missing")
    unknown = sorted(set(item) - required - optional)
    if unknown:
        unknown_path = f"{path}.{unknown[0]}" if path else unknown[0]
        _fail("FIELD_UNKNOWN", unknown_path, "unknown field")
    return item


def _iso_date(value: Any, path: str) -> str:
    text = _text(value, path)
    try:
        parsed = date.fromisoformat(text)
    except ValueError:
        _fail("DATE_INVALID", path, "must be a real ISO calendar date")
    if parsed.isoformat() != text:
        _fail("DATE_INVALID", path, "must use YYYY-MM-DD")
    return text


def _reject_presentation_fields(value: Any, path: str = "") -> None:
    if isinstance(value, dict):
        for key, item in value.items():
            item_path = f"{path}.{key}" if path else key
            lowered = str(key).lower()
            if lowered in {"html", "markdown", "css", "class", "tag"} or lowered.startswith("data-") or lowered.startswith("data_"):
                _fail("PRESENTATION_FIELD_FORBIDDEN", item_path, "presentation fields are renderer-owned")
            _reject_presentation_fields(item, item_path)
    elif isinstance(value, list):
        for index, item in enumerate(value):
            _reject_presentation_fields(item, f"{path}[{index}]")


def _validate_id_rows(rows: list[Any], prefix: str, path: str) -> set[str]:
    identifiers: set[str] = set()
    for index, value in enumerate(rows):
        row = _object(value, f"{path}[{index}]")
        identifier = row.get("id")
        id_path = f"{path}[{index}].id"
        if not isinstance(identifier, str) or not ID_PATTERN.fullmatch(identifier) or not identifier.startswith(prefix):
            _fail("ID_FORMAT_INVALID", id_path, f"must be {prefix}01–{prefix}999")
        if identifier in identifiers:
            _fail("ID_DUPLICATE", id_path, "identifier is duplicated")
        identifiers.add(identifier)
    return identifiers


def _validate_references(value: Any, path: str, source_ids: set[str], thesis_ids: set[str]) -> None:
    if isinstance(value, dict):
        for key, item in value.items():
            item_path = f"{path}.{key}" if path else key
            if key == "source_ids" or key.endswith("_source_ids") or key in {"evidence_ids", "counter_evidence_ids"}:
                items = _array(item, item_path)
                for index, identifier in enumerate(items):
                    reference_path = f"{item_path}[{index}]"
                    if not isinstance(identifier, str) or not ID_PATTERN.fullmatch(identifier) or not identifier.startswith("S"):
                        _fail("ID_FORMAT_INVALID", reference_path, "must be S01-S999")
                    if identifier not in source_ids:
                        _fail("REFERENCE_BROKEN", reference_path, "source identifier does not exist")
            elif key == "thesis_ids":
                items = _array(item, item_path)
                for index, identifier in enumerate(items):
                    reference_path = f"{item_path}[{index}]"
                    if not isinstance(identifier, str) or not ID_PATTERN.fullmatch(identifier) or not identifier.startswith("T"):
                        _fail("ID_FORMAT_INVALID", reference_path, "must be T01-T999")
                    if identifier not in thesis_ids:
                        _fail("REFERENCE_BROKEN", reference_path, "thesis identifier does not exist")
            else:
                _validate_references(item, item_path, source_ids, thesis_ids)
    elif isinstance(value, list):
        for index, item in enumerate(value):
            _validate_references(item, f"{path}[{index}]", source_ids, thesis_ids)


def _validate_content(content: Any) -> dict[str, Any]:
    content = _object(content, "$")
    _reject_presentation_fields(content)
    _fields(content, TOP_LEVEL_KEYS, set(), "")
    if content["schema_version"] != SCHEMA_VERSION:
        _fail("SCHEMA_VERSION_UNSUPPORTED", "schema_version", "content schema must be 1.2")

    meta = _fields(content["meta"], {"mode", "company_name", "ticker", "exchange", "currency", "as_of", "investment_horizon", "language"}, set(), "meta")
    for key in ("company_name", "ticker", "exchange", "currency", "investment_horizon", "language"):
        _text(meta[key], f"meta.{key}")
    if meta["mode"] == "update":
        _fail("MODE_RESERVED", "meta.mode", "update is reserved for a future engine")
    _enum(meta["mode"], {"standard", "audit"}, "meta.mode", code="MODE_INVALID")
    if meta["language"] != "zh-CN":
        _fail("LANGUAGE_UNSUPPORTED", "meta.language", "fixed template language must be zh-CN")
    _iso_date(meta["as_of"], "meta.as_of")

    summary = _fields(content["summary"], {"headline", "one_line_judgment", "investment_posture", "posture_rationale", "overall_confidence", "maximum_unknown", "company_quality", "stock_value"}, set(), "summary")
    for key, value in summary.items():
        _text(value, f"summary.{key}")
    _enum(summary["overall_confidence"], CONFIDENCE, "summary.overall_confidence")

    scope = _fields(content["evidence_scope"], {"source_coverage", "primary_filing_status", "earnings_call_status", "industry_evidence_status", "research_confidence", "conflicts_and_gaps", "evidence_blocks"}, set(), "evidence_scope")
    for key in ("source_coverage", "primary_filing_status", "earnings_call_status", "industry_evidence_status", "research_confidence", "conflicts_and_gaps"):
        _text(scope[key], f"evidence_scope.{key}")
    for index, value in enumerate(_array(scope["evidence_blocks"], "evidence_scope.evidence_blocks")):
        row = _fields(value, {"kind", "text", "source_ids"}, {"confidence"}, f"evidence_scope.evidence_blocks[{index}]")
        _enum(row["kind"], EVIDENCE_KINDS, f"evidence_scope.evidence_blocks[{index}].kind")
        _text(row["text"], f"evidence_scope.evidence_blocks[{index}].text")
        if row.get("confidence") is not None:
            _enum(row["confidence"], CONFIDENCE, f"evidence_scope.evidence_blocks[{index}].confidence")

    business = _fields(content["business"], {"model_and_demand", "value_creation", "industry_stage_and_drivers", "competitive_position", "moats", "counter_evidence", "industry_validation"}, set(), "business")
    for key in ("model_and_demand", "value_creation", "industry_stage_and_drivers", "competitive_position"):
        _text(business[key], f"business.{key}")
    for index, value in enumerate(_array(business["moats"], "business.moats")):
        _fields(value, {"title", "text", "source_ids"}, set(), f"business.moats[{index}]")
    _fields(business["counter_evidence"], {"text", "source_ids"}, set(), "business.counter_evidence")
    industry = _fields(business["industry_validation"], {"claim", "company", "competitors", "independent", "agreement_or_conflict", "confidence", "gap"}, set(), "business.industry_validation")
    _fields(industry["company"], {"text", "source_ids"}, set(), "business.industry_validation.company")
    for index, value in enumerate(_array(industry["competitors"], "business.industry_validation.competitors")):
        _fields(value, {"text", "source_ids"}, set(), f"business.industry_validation.competitors[{index}]")
    _fields(industry["independent"], {"text", "source_ids", "status", "reason"}, set(), "business.industry_validation.independent")
    _enum(industry["confidence"], CONFIDENCE, "business.industry_validation.confidence")

    management = _fields(content["management"], {"overview", "mda_delta", "promises"}, set(), "management")
    _text(management["overview"], "management.overview")
    for index, value in enumerate(_array(management["mda_delta"], "management.mda_delta")):
        _fields(value, {"topic", "previous_period", "current_period", "change", "interpretation", "source_ids", "alternative_explanation", "validation_task"}, set(), f"management.mda_delta[{index}]")
    promises = _array(management["promises"], "management.promises")
    for index, value in enumerate(promises):
        row = _fields(value, {"id", "promise", "promise_date", "original_wording_locator", "due_date", "actual_result", "source_ids", "status", "assessment"}, set(), f"management.promises[{index}]")
        _iso_date(row["promise_date"], f"management.promises[{index}].promise_date")
        _iso_date(row["due_date"], f"management.promises[{index}].due_date")
        _enum(row["status"], PROMISE_STATUS, f"management.promises[{index}].status")

    financials = _fields(content["financials"], {"overview", "metric_continuity", "annual_history", "quarterly_history", "earnings_quality", "kpi_inflections", "sector_kpis"}, {"history_coverage"}, "financials")
    if "history_coverage" in financials:
        coverage = _fields(financials["history_coverage"], set(), {"annual", "quarterly"}, "financials.history_coverage")
        for key, value in coverage.items():
            _text(value, f"financials.history_coverage.{key}")
    for key in ("overview", "earnings_quality", "kpi_inflections"):
        _text(financials[key], f"financials.{key}")
    for index, value in enumerate(_array(financials["metric_continuity"], "financials.metric_continuity")):
        row = _fields(value, {"metric", "periods", "definition_scope_change", "comparability_status", "adjustment", "source_ids"}, set(), f"financials.metric_continuity[{index}]")
        _enum(row["comparability_status"], COMPARABILITY, f"financials.metric_continuity[{index}].comparability_status")
    history_fields = {"period", "revenue", "growth", "margin", "ocf", "fcf", "roic", "earnings_quality_note", "source_ids"}
    for name in ("annual_history", "quarterly_history"):
        for index, value in enumerate(_array(financials[name], f"financials.{name}")):
            _fields(value, history_fields, set(), f"financials.{name}[{index}]")
    for index, value in enumerate(_array(financials["sector_kpis"], "financials.sector_kpis")):
        _fields(value, {"metric", "current", "direction", "source_ids"}, set(), f"financials.sector_kpis[{index}]")

    valuation_context = _fields(content["valuation_context"], {"route", "method_rationale", "assumptions", "scenario_rationales", "reverse_interpretation", "reconciliation_note"}, {"operating_sensitivity"}, "valuation_context")
    _enum(valuation_context["route"], {"dcf", "sector_adaptive"}, "valuation_context.route")
    assumptions = _array(valuation_context["assumptions"], "valuation_context.assumptions")
    for index, value in enumerate(assumptions):
        extra = {"bear", "base", "bull", "as_of", "rationale"}
        row = _fields(value, {"id", "assumption", "value", "source_ids"} | (extra if meta["mode"] == "audit" else set()), extra if meta["mode"] != "audit" else set(), f"valuation_context.assumptions[{index}]")
        for key in extra & row.keys():
            _text(row[key], f"valuation_context.assumptions[{index}].{key}")
        if "as_of" in row:
            _iso_date(row["as_of"], f"valuation_context.assumptions[{index}].as_of")
    if meta["mode"] == "audit":
        if "operating_sensitivity" not in valuation_context:
            _fail("FIELD_REQUIRED", "valuation_context.operating_sensitivity", "Audit retains V1.1 operating sensitivity")
        for index, value in enumerate(_array(valuation_context["operating_sensitivity"], "valuation_context.operating_sensitivity")):
            _fields(value, {"variable", "bear", "base", "bull", "value_impact", "thesis_ids"}, set(), f"valuation_context.operating_sensitivity[{index}]")
    rationales = _fields(valuation_context["scenario_rationales"], {"bear", "base", "bull"}, set(), "valuation_context.scenario_rationales")
    for key in ("bear", "base", "bull"):
        rationale = _fields(rationales[key], {"operating_assumptions", "valuation_assumptions", "trigger_or_falsifier"}, set(), f"valuation_context.scenario_rationales.{key}")
        for field in ("operating_assumptions", "valuation_assumptions", "trigger_or_falsifier"):
            _text(rationale[field], f"valuation_context.scenario_rationales.{key}.{field}")

    theses = _array(content["theses"], "theses")
    for index, value in enumerate(theses):
        row = _fields(value, {"id", "statement", "supporting_source_ids", "counter_source_ids", "evidence_types", "confidence", "needs_validation"}, {"evidence_gap"}, f"theses[{index}]")
        for evidence_index, kind in enumerate(_array(row["evidence_types"], f"theses[{index}].evidence_types")):
            _enum(kind, EVIDENCE_KINDS, f"theses[{index}].evidence_types[{evidence_index}]")
        _enum(row["confidence"], CONFIDENCE, f"theses[{index}].confidence")

    risks = _fields(content["risks_and_breakers"], {"summary", "breakers"}, set(), "risks_and_breakers")
    for index, value in enumerate(_array(risks["breakers"], "risks_and_breakers.breakers")):
        _fields(value, {"breaker", "trigger", "confirmation_window", "thesis_ids", "scenario_probability_impact", "valuation_impact", "research_action"}, set(), f"risks_and_breakers.breakers[{index}]")

    scorecard = _fields(content["scorecard"], set(SCORE_KEYS), set(), "scorecard")
    for key in SCORE_KEYS:
        row = _fields(scorecard[key], {"score", "evidence_ids", "counter_evidence_ids", "thesis_ids", "confidence", "rationale_or_gap"}, set(), f"scorecard.{key}")
        if row["score"] is not None and not (1 <= _number(row["score"], f"scorecard.{key}.score") <= 5):
            _fail("NUMBER_INVALID", f"scorecard.{key}.score", "must be 1-5 or null")
        _enum(row["confidence"], CONFIDENCE, f"scorecard.{key}.confidence")

    for index, value in enumerate(_array(content["monitoring"], "monitoring")):
        row = _fields(value, {"metric", "current_value", "as_of", "source_ids", "next_update", "bull_threshold", "bear_threshold", "thesis_ids", "valuation_impact", "research_action"}, set(), f"monitoring[{index}]")
        _iso_date(row["as_of"], f"monitoring[{index}].as_of")
    conclusion = _fields(content["conclusion"], {"decision", "company_quality", "stock_value", "margin_of_safety_rationale", "validation_items", "thesis_ids"}, set(), "conclusion")
    for index, value in enumerate(_array(conclusion["validation_items"], "conclusion.validation_items")):
        _text(value, f"conclusion.validation_items[{index}]")

    sources = _array(content["sources"], "sources")
    for index, value in enumerate(sources):
        row = _fields(value, {"id", "role", "document", "publication_date", "reporting_period", "locator", "url_or_path", "access_date"}, set(), f"sources[{index}]")
        _enum(row["role"], SOURCE_ROLES, f"sources[{index}].role")
        _iso_date(row["publication_date"], f"sources[{index}].publication_date")
        _iso_date(row["access_date"], f"sources[{index}].access_date")
        _safe_url(row["url_or_path"], f"sources[{index}].url_or_path")

    source_ids = _validate_id_rows(sources, "S", "sources")
    thesis_ids = _validate_id_rows(theses, "T", "theses")
    _validate_id_rows(assumptions, "A", "valuation_context.assumptions")
    _validate_id_rows(promises, "P", "management.promises")
    _validate_references(content, "", source_ids, thesis_ids)
    return content


def _validate_common_results(results: dict[str, Any]) -> None:
    scenarios = _fields(results.get("scenarios"), {"method", "horizon_years", "scenarios", "base_irr", "probability_weighted_ending_value", "probability_weighted_dividends", "probability_weighted_expected_return", "probability_weighted_cash_flows", "probability_weighted_irr"}, set(), "valuation.results.scenarios")
    _text(scenarios["method"], "valuation.results.scenarios.method")
    horizon = _number(scenarios["horizon_years"], "valuation.results.scenarios.horizon_years")
    if horizon <= 0 or not horizon.is_integer():
        _fail("NUMBER_INVALID", "valuation.results.scenarios.horizon_years", "must be a positive whole number")
    horizon_count = int(horizon)
    scenario_items = _fields(scenarios["scenarios"], {"bear", "base", "bull"}, set(), "valuation.results.scenarios.scenarios")
    for name in ("bear", "base", "bull"):
        path = f"valuation.results.scenarios.scenarios.{name}"
        row = _fields(scenario_items[name], {"probability", "dividends", "cash_flows", "ending_value", "expected_return", "irr"}, set(), path)
        probability = _number(row["probability"], f"{path}.probability")
        if not 0 <= probability <= 1:
            _fail("NUMBER_INVALID", f"{path}.probability", "must be between zero and one")
        dividends = _number_array(row["dividends"], f"{path}.dividends")
        cash_flows = _number_array(row["cash_flows"], f"{path}.cash_flows")
        if len(dividends) != horizon_count:
            _fail("FIELD_INVALID", f"{path}.dividends", "length must match horizon_years")
        if len(cash_flows) != horizon_count + 1:
            _fail("FIELD_INVALID", f"{path}.cash_flows", "length must be horizon_years plus one")
        for key in ("ending_value", "expected_return", "irr"):
            _number(row[key], f"{path}.{key}")
    weighted_dividends = _number_array(scenarios["probability_weighted_dividends"], "valuation.results.scenarios.probability_weighted_dividends")
    weighted_cash_flows = _number_array(scenarios["probability_weighted_cash_flows"], "valuation.results.scenarios.probability_weighted_cash_flows")
    if len(weighted_dividends) != horizon_count:
        _fail("FIELD_INVALID", "valuation.results.scenarios.probability_weighted_dividends", "length must match horizon_years")
    if len(weighted_cash_flows) != horizon_count + 1:
        _fail("FIELD_INVALID", "valuation.results.scenarios.probability_weighted_cash_flows", "length must be horizon_years plus one")
    for key in ("base_irr", "probability_weighted_ending_value", "probability_weighted_expected_return", "probability_weighted_irr"):
        _number(scenarios[key], f"valuation.results.scenarios.{key}")
    margin = _fields(results.get("margin_of_safety"), {"required", "high_conviction", "attractive_price", "high_conviction_price"}, set(), "valuation.results.margin_of_safety")
    for key in margin:
        _number(margin[key], f"valuation.results.margin_of_safety.{key}")


def _validate_valuation(valuation: Any, content: dict[str, Any]) -> dict[str, Any]:
    valuation = _fields(valuation, {"schema_version", "engine_version", "status", "mode", "route", "units", "market", "results", "warnings", "errors"}, set(), "valuation")
    if valuation["schema_version"] != "valuation.v1":
        _fail("SCHEMA_VERSION_UNSUPPORTED", "valuation.schema_version", "valuation schema must be valuation.v1")
    if valuation["engine_version"] != "1.2.0":
        _fail("ENGINE_VERSION_UNSUPPORTED", "valuation.engine_version", "valuation engine must be 1.2.0")
    errors = _array(valuation["errors"], "valuation.errors")
    if valuation["status"] != "ok" or errors:
        _fail("VALUATION_NOT_OK", "valuation.errors", "valuation result contains errors")
    _text_array(valuation["warnings"], "valuation.warnings")
    _enum(valuation["mode"], {"standard", "audit"}, "valuation.mode")
    _enum(valuation["route"], {"dcf", "sector_adaptive"}, "valuation.route")
    meta = content["meta"]
    if valuation["mode"] != meta["mode"]:
        _fail("MODE_MISMATCH", "meta.mode", "content and valuation modes differ")
    if valuation["route"] != content["valuation_context"]["route"]:
        _fail("ROUTE_MISMATCH", "valuation_context.route", "content and valuation routes differ")
    units = _fields(valuation["units"], {"model_currency", "quote_currency", "amount_unit", "fx_to_quote"}, set(), "valuation.units")
    for key in ("model_currency", "quote_currency", "amount_unit"):
        _text(units[key], f"valuation.units.{key}")
    if _number(units["fx_to_quote"], "valuation.units.fx_to_quote") <= 0:
        _fail("NUMBER_INVALID", "valuation.units.fx_to_quote", "must be positive")
    if units["quote_currency"] != meta["currency"]:
        _fail("CURRENCY_MISMATCH", "meta.currency", "content currency and valuation quote currency differ")
    market = _fields(valuation["market"], {"as_of", "price_as_of", "current_price", "diluted_shares"}, set(), "valuation.market")
    _iso_date(market["as_of"], "valuation.market.as_of")
    _iso_date(market["price_as_of"], "valuation.market.price_as_of")
    if market["as_of"] != meta["as_of"]:
        _fail("DATE_MISMATCH", "valuation.market.as_of", "valuation as-of must match report as-of")
    if _number(market["current_price"], "valuation.market.current_price") <= 0:
        _fail("NUMBER_INVALID", "valuation.market.current_price", "must be positive")
    if _number(market["diluted_shares"], "valuation.market.diluted_shares") <= 0:
        _fail("NUMBER_INVALID", "valuation.market.diluted_shares", "must be positive")

    results = _object(valuation["results"], "valuation.results")
    if valuation["route"] == "dcf":
        required_results = {"dcf", "relative_cross_checks", "reconciliation", "scenarios", "margin_of_safety", "reverse_valuation"}
        _fields(results, required_results, set(), "valuation.results")
        _validate_common_results(results)
        dcf = _fields(results["dcf"], {"status", "basis", "discount_rate_type", "discount_rate", "forecast", "terminal", "explicit_pv", "terminal_value", "terminal_pv", "terminal_value_share", "implied_reinvestment_rate", "equity_value", "per_share_value", "sensitivity"}, {"forecast_extension_reason", "enterprise_value"}, "valuation.results.dcf")
        if dcf["status"] != "ok":
            _fail("FIELD_INVALID", "valuation.results.dcf.status", "DCF route requires status ok")
        basis = _enum(dcf["basis"], {"FCFF", "FCFE"}, "valuation.results.dcf.basis")
        discount_type = _enum(dcf["discount_rate_type"], {"WACC", "KE"}, "valuation.results.dcf.discount_rate_type")
        expected_discount_type = "WACC" if basis == "FCFF" else "KE"
        if discount_type != expected_discount_type:
            _fail("RATE_BASIS_MISMATCH", "valuation.results.dcf.discount_rate_type", f"{basis} requires {expected_discount_type}")
        _number(dcf["discount_rate"], "valuation.results.dcf.discount_rate")
        if "forecast_extension_reason" in dcf:
            _text(dcf["forecast_extension_reason"], "valuation.results.dcf.forecast_extension_reason")
        forecast = _array(dcf["forecast"], "valuation.results.dcf.forecast")
        mode = valuation["mode"]
        reason = dcf.get("forecast_extension_reason")
        if mode == "standard" and (len(forecast) < 5 or (len(forecast) > 5 and not isinstance(reason, str)) or (isinstance(reason, str) and not reason.strip())):
            _fail("FORECAST_COUNT_INVALID", "valuation.results.dcf.forecast", "Standard requires five periods unless an extension reason is supplied")
        if mode == "audit" and len(forecast) < 3:
            _fail("FORECAST_COUNT_INVALID", "valuation.results.dcf.forecast", "Audit requires at least three periods")
        common = {"period", "revenue", "growth", "d_and_a", "capex", "delta_nwc", "net_borrowing", "discount_factor", "pv"}
        needed = common | ({"operating_margin", "ebit", "nopat", "fcff"} if basis == "FCFF" else {"net_margin", "net_income", "fcfe"})
        for index, value in enumerate(forecast):
            path = f"valuation.results.dcf.forecast[{index}]"
            row = _fields(value, needed, set(), path)
            _text(row["period"], f"{path}.period")
            for key in needed - {"period"}:
                _number(row[key], f"{path}.{key}")
        for key in ("explicit_pv", "terminal_value", "terminal_pv", "terminal_value_share", "implied_reinvestment_rate", "equity_value", "per_share_value"):
            _number(dcf[key], f"valuation.results.dcf.{key}")
        if basis == "FCFF":
            if "enterprise_value" not in dcf:
                _fail("FIELD_REQUIRED", "valuation.results.dcf.enterprise_value", "FCFF result requires enterprise value")
            _number(dcf["enterprise_value"], "valuation.results.dcf.enterprise_value")
        elif "enterprise_value" in dcf:
            _number(dcf["enterprise_value"], "valuation.results.dcf.enterprise_value")
        terminal = _fields(dcf.get("terminal"), {"revenue", "growth", "margin", "cash_flow", "return_metric", "return_rate", "implied_reinvestment_rate", "value", "present_value", "value_share"}, set(), "valuation.results.dcf.terminal")
        expected_return_metric = "ROIC" if basis == "FCFF" else "ROE"
        if _enum(terminal["return_metric"], {"ROIC", "ROE"}, "valuation.results.dcf.terminal.return_metric") != expected_return_metric:
            _fail("RETURN_BASIS_MISMATCH", "valuation.results.dcf.terminal.return_metric", f"{basis} requires {expected_return_metric}")
        for key in set(terminal) - {"return_metric"}:
            _number(terminal[key], f"valuation.results.dcf.terminal.{key}")
        sensitivity = _fields(dcf.get("sensitivity"), {"discount_rates", "terminal_growth_rates", "values"}, set(), "valuation.results.dcf.sensitivity")
        discount_rates = _number_array(sensitivity["discount_rates"], "valuation.results.dcf.sensitivity.discount_rates")
        growth_rates = _number_array(sensitivity["terminal_growth_rates"], "valuation.results.dcf.sensitivity.terminal_growth_rates")
        values = _array(sensitivity["values"], "valuation.results.dcf.sensitivity.values")
        if len(discount_rates) != 3 or len(growth_rates) != 3 or len(values) != 3 or any(not isinstance(row, list) or len(row) != 3 for row in values):
            _fail("SENSITIVITY_INVALID", "valuation.results.dcf.sensitivity", "requires a 3x3 grid")
        for row_index, row in enumerate(values):
            for column_index, value in enumerate(row):
                _number(value, f"valuation.results.dcf.sensitivity.values[{row_index}][{column_index}]")
        cross_checks = _array(results["relative_cross_checks"], "valuation.results.relative_cross_checks")
        for index, value in enumerate(cross_checks):
            path = f"valuation.results.relative_cross_checks[{index}]"
            row = _fields(value, {"id", "name", "kind", "value_basis", "value", "note", "per_share_value"}, set(), path)
            for key in ("id", "name", "note"):
                _text(row[key], f"{path}.{key}")
            _enum(row["kind"], {"intrinsic", "relative", "reverse"}, f"{path}.kind")
            _enum(row["value_basis"], {"enterprise_value", "equity_value", "per_share"}, f"{path}.value_basis")
            for key in ("value", "per_share_value"):
                _number(row[key], f"{path}.{key}")
        rec = _fields(results["reconciliation"], {"primary_method", "primary_per_share_value", "cross_check_per_share_values", "value_basis", "equity_value", "excess_cash", "non_operating_investments", "debt", "minority_interest", "other_claims", "additional_equity_adjustments_total", "dilution_treatment", "diluted_shares", "fx_to_quote"}, {"enterprise_value"}, "valuation.results.reconciliation")
        _text(rec["primary_method"], "valuation.results.reconciliation.primary_method")
        _enum(rec["value_basis"], {"enterprise_value", "equity_value"}, "valuation.results.reconciliation.value_basis")
        _text(rec["dilution_treatment"], "valuation.results.reconciliation.dilution_treatment")
        _number_array(rec["cross_check_per_share_values"], "valuation.results.reconciliation.cross_check_per_share_values")
        for key in ("primary_per_share_value", "equity_value", "excess_cash", "non_operating_investments", "debt", "minority_interest", "other_claims", "additional_equity_adjustments_total", "diluted_shares", "fx_to_quote"):
            _number(rec[key], f"valuation.results.reconciliation.{key}")
        if basis == "FCFF":
            if "enterprise_value" not in rec:
                _fail("FIELD_REQUIRED", "valuation.results.reconciliation.enterprise_value", "FCFF reconciliation requires enterprise value")
            _number(rec["enterprise_value"], "valuation.results.reconciliation.enterprise_value")
        elif "enterprise_value" in rec:
            _number(rec["enterprise_value"], "valuation.results.reconciliation.enterprise_value")
        reverse = _fields(results["reverse_valuation"], {"assumptions_held_constant", "input_price", "input_price_source", "growth_period_years", "required_terminal_value", "required_terminal_cash_flow", "implied_terminal_cash_flow_margin", "implied_terminal_growth", "return_metric", "return_rate", "implied_reinvestment_rate", "warnings"}, set(), "valuation.results.reverse_valuation")
        _text(reverse["assumptions_held_constant"], "valuation.results.reverse_valuation.assumptions_held_constant")
        _number(reverse["input_price"], "valuation.results.reverse_valuation.input_price")
        _enum(reverse["input_price_source"], {"reverse_valuation.forward_price"}, "valuation.results.reverse_valuation.input_price_source")
        if _enum(reverse["return_metric"], {"ROIC", "ROE"}, "valuation.results.reverse_valuation.return_metric") != expected_return_metric:
            _fail("RETURN_BASIS_MISMATCH", "valuation.results.reverse_valuation.return_metric", f"{basis} requires {expected_return_metric}")
        for key in ("growth_period_years", "required_terminal_value", "required_terminal_cash_flow", "implied_terminal_cash_flow_margin", "return_rate"):
            _number(reverse[key], f"valuation.results.reverse_valuation.{key}")
        for key in ("implied_terminal_growth", "implied_reinvestment_rate"):
            _nullable_number(reverse[key], f"valuation.results.reverse_valuation.{key}")
        _text_array(reverse["warnings"], "valuation.results.reverse_valuation.warnings")
    elif valuation["route"] == "sector_adaptive":
        required_results = {"dcf", "methods", "market_implied_multiple", "reverse_valuation", "reconciliation", "scenarios", "margin_of_safety"}
        _fields(results, required_results, set(), "valuation.results")
        _validate_common_results(results)
        dcf = _fields(results["dcf"], {"status", "reason", "alternative_method"}, set(), "valuation.results.dcf")
        if dcf["status"] != "not_applicable":
            _fail("FIELD_INVALID", "valuation.results.dcf.status", "sector route requires not_applicable")
        _text(dcf["reason"], "valuation.results.dcf.reason")
        _text(dcf["alternative_method"], "valuation.results.dcf.alternative_method")
        methods = _array(results["methods"], "valuation.results.methods")
        for index, value in enumerate(methods):
            path = f"valuation.results.methods[{index}]"
            row = _fields(value, {"id", "name", "kind", "value_basis", "value", "note", "per_share_value"}, set(), path)
            for key in ("id", "name", "note"):
                _text(row[key], f"{path}.{key}")
            _enum(row["kind"], {"intrinsic", "relative", "reverse"}, f"{path}.kind")
            _enum(row["value_basis"], {"enterprise_value", "equity_value", "per_share"}, f"{path}.value_basis")
            _number(row["value"], f"{path}.value")
            _number(row["per_share_value"], f"{path}.per_share_value")
        _number(results["market_implied_multiple"], "valuation.results.market_implied_multiple")
        rec = _fields(results["reconciliation"], {"primary_method_id", "primary_per_share_value", "minimum_per_share_value", "maximum_per_share_value", "spread"}, set(), "valuation.results.reconciliation")
        _text(rec["primary_method_id"], "valuation.results.reconciliation.primary_method_id")
        for key in ("primary_per_share_value", "minimum_per_share_value", "maximum_per_share_value", "spread"):
            _number(rec[key], f"valuation.results.reconciliation.{key}")
        reverse = _fields(results["reverse_valuation"], {"method", "value_basis", "metric_name", "metric_per_share", "market_implied_multiple", "primary_method_id", "primary_implied_multiple", "multiple_gap"}, set(), "valuation.results.reverse_valuation")
        _enum(reverse["method"], {"market-implied-multiple"}, "valuation.results.reverse_valuation.method")
        _enum(reverse["value_basis"], {"per_share"}, "valuation.results.reverse_valuation.value_basis")
        _text(reverse["metric_name"], "valuation.results.reverse_valuation.metric_name")
        _text(reverse["primary_method_id"], "valuation.results.reverse_valuation.primary_method_id")
        for key in ("metric_per_share", "market_implied_multiple", "primary_implied_multiple", "multiple_gap"):
            _number(reverse[key], f"valuation.results.reverse_valuation.{key}")
    return valuation


def _canonical_hash(payload: dict[str, Any], path: str) -> str:
    try:
        encoded = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False).encode("utf-8")
    except (TypeError, ValueError) as error:
        _fail("JSON_VALUE_INVALID", path, str(error))
    return hashlib.sha256(encoded).hexdigest()


def _validate_inputs(content: Any, valuation: Any, template_text: str) -> tuple[dict[str, Any], dict[str, Any], str, str]:
    if isinstance(content, dict) and isinstance(content.get("meta"), dict) and isinstance(valuation, dict):
        declared_mode = content["meta"].get("mode")
        if declared_mode in ("standard", "audit") and valuation.get("mode") in ("standard", "audit") and declared_mode != valuation["mode"]:
            _fail("MODE_MISMATCH", "meta.mode", "content and valuation mode must match")
    if template_text.count(HEAD_SENTINEL) != 1:
        _fail("TEMPLATE_SENTINEL_INVALID", "template", "ER:HEAD must occur exactly once")
    if template_text.count(BODY_SENTINEL) != 1:
        _fail("TEMPLATE_SENTINEL_INVALID", "template", "ER:BODY must occur exactly once")
    content = _validate_content(content)
    valuation = _validate_valuation(valuation, content)
    return content, valuation, _canonical_hash(content, "content"), _canonical_hash(valuation, "valuation")


def _render_evidence(content: dict[str, Any]) -> str:
    scope = content["evidence_scope"]
    blocks = []
    labels = {"fact": "Fact", "management-view": "Management View", "market-view": "Market View", "calculation": "Calculation", "inference": "Inference"}
    for block in scope["evidence_blocks"]:
        kind = block["kind"]
        confidence = f" · Confidence: {_e(block['confidence'])}" if block.get("confidence") else ""
        blocks.append(f'<article class="evidence-item" data-evidence="{_e(kind)}"><span class="badge {_e(kind)}">{_e(labels.get(kind, kind))}</span><p>{_e(block["text"])}{confidence} {_links(block["source_ids"])}</p></article>')
    return f'''<section id="evidence" data-check="evidence-scope">
      <div class="section-kicker">02 · Research Scope &amp; Evidence</div><h2>研究范围与证据</h2>
      <p class="section-lead">{_e(scope["source_coverage"])}</p>
      <div class="grid-2"><article class="card"><h3>证据覆盖</h3><p>Primary filing: {_e(scope["primary_filing_status"])}<br>Earnings call: {_e(scope["earnings_call_status"])}<br>Independent industry: {_e(scope["industry_evidence_status"])}<br>Confidence: {_e(scope["research_confidence"])}</p></article><article class="card"><h3>冲突与缺口</h3><p>{_e(scope["conflicts_and_gaps"])}</p></article></div>
      <div class="subsection evidence-grid">{"".join(blocks)}</div>
    </section>'''


def _render_business(content: dict[str, Any]) -> str:
    business = content["business"]
    validation = business["industry_validation"]
    competitor = "<br>".join(f'{_e(item["text"])} {_links(item["source_ids"])}' for item in validation["competitors"])
    validation_row = [[_e(validation["claim"]), f'{_e(validation["company"]["text"])} {_links(validation["company"]["source_ids"])}', competitor, f'{_e(validation["independent"]["text"])} {_links(validation["independent"]["source_ids"])}<br>{_e(validation["independent"]["status"])}: {_e(validation["independent"]["reason"])}', _e(validation["agreement_or_conflict"]), _e(validation["confidence"]), _e(validation["gap"])]]
    moat_cards = "".join(f'<article class="card"><h3>{_e(item["title"])}</h3><p>{_e(item["text"])} {_links(item["source_ids"])}</p></article>' for item in business["moats"])
    return f'''<section id="business" data-check="business-industry">
      <div class="section-kicker">03 · Business, Industry &amp; Competition</div><h2>商业模式与行业需求</h2><p class="section-lead">{_e(business["model_and_demand"])}</p>
      <div class="grid-2"><article class="card"><h3>价值创造</h3><p>{_e(business["value_creation"])}</p></article><article class="card"><h3>行业阶段</h3><p>{_e(business["industry_stage_and_drivers"])}</p></article></div>
      <div class="subsection" data-check="industry-triangulation"><div class="subsection-head"><h3>Independent Industry Validation</h3><p>Company → Competitor → Independent</p></div>{_table(["Industry Claim","Company Evidence","Competitor Evidence","Independent Industry Data","Agreement / Conflict","Confidence","Gap"], validation_row)}</div>
      <div class="subsection" data-check="competition-strategy"><div class="subsection-head"><h3>竞争与护城河</h3><p>{_e(business["competitive_position"])}</p></div><div class="grid-3">{moat_cards}<article class="card"><h3>最强反证</h3><p>{_e(business["counter_evidence"]["text"])} {_links(business["counter_evidence"]["source_ids"])}</p></article></div></div>
    </section>'''


def _render_management(content: dict[str, Any]) -> str:
    management = content["management"]
    delta_rows = [[_e(row[key]) if key != "source_ids" else _links(row[key]) for key in ("topic", "previous_period", "current_period", "change", "interpretation", "source_ids", "alternative_explanation", "validation_task")] for row in management["mda_delta"]]
    promise_rows = []
    for row in management["promises"]:
        promise_rows.append([f'<span id="{_e(row["id"])}">{_e(row["id"])}</span>', _e(row["promise"]), _e(row["promise_date"]), _e(row["original_wording_locator"]), _e(row["due_date"]), _e(row["actual_result"]), _links(row["source_ids"]), _e(row["status"]), _e(row["assessment"])])
    return f'''<section id="management" data-check="management-capital-allocation"><div class="section-kicker">04 · MD&amp;A &amp; Management</div><h2>MD&amp;A、管理层与资本配置</h2><p class="section-lead">{_e(management["overview"])}</p>
      <div class="subsection">{_table(["Topic","Previous Period","Current Period","Change","Interpretation","Source IDs","Alternative Explanation","Validation Task"], delta_rows, check="mda-delta")}</div>
      <div class="subsection">{_table(["Promise ID","Promise","Promise Date","Original Wording / Locator","Due Date","Actual Result","Source IDs","Status","Assessment"], promise_rows, check="promise-tracker")}</div>
    </section>'''


def _render_history(rows: list[dict[str, Any]], check: str) -> str:
    rendered = [[_e(row[key]) if key != "source_ids" else _links(row[key]) for key in ("period", "revenue", "growth", "margin", "ocf", "fcf", "roic", "earnings_quality_note", "source_ids")] for row in rows]
    return _table(["Period","Revenue","Growth","Margin","OCF","FCF","ROIC","Earnings Quality","Source IDs"], rendered, check=check)


def _render_financials(content: dict[str, Any]) -> str:
    financials = content["financials"]
    coverage = financials.get("history_coverage", {})
    continuity = [[_e(row[key]) if key != "source_ids" else _links(row[key]) for key in ("metric", "periods", "definition_scope_change", "comparability_status", "adjustment", "source_ids")] for row in financials["metric_continuity"]]
    kpis = [[_e(row["metric"]), _e(row["current"]), _e(row["direction"]), _links(row["source_ids"])] for row in financials["sector_kpis"]]
    return f'''<section id="financials"><div class="section-kicker">05 · Financials</div><h2>财务质量、口径与趋势</h2><p class="section-lead">{_e(financials["overview"])}</p>
      <div class="subsection">{_table(["Metric","Periods","Definition / Scope Change","Comparability","Adjustment","Source IDs"], continuity, check="metric-continuity")}</div>
      <div class="subsection" data-check="financial-history-annual"><div class="subsection-head"><h3>Annual History</h3></div>{_render_history(financials["annual_history"], "financial-history-annual")}<p>{_e(coverage.get("annual", ""))}</p></div>
      <div class="subsection" data-check="financial-history-quarterly"><div class="subsection-head"><h3>Quarterly History</h3></div>{_render_history(financials["quarterly_history"], "financial-history-quarterly")}<p>{_e(coverage.get("quarterly", ""))}</p></div>
      <div class="grid-2 subsection"><article class="card" data-check="financials-earnings-quality"><h3>Earnings Quality</h3><p>{_e(financials["earnings_quality"])}</p></article><article class="card" data-check="kpi-trends-inflections"><h3>KPI Trends &amp; Inflections</h3><p>{_e(financials["kpi_inflections"])}</p></article></div>
      <div class="subsection">{_table(["Sector KPI","Current","Direction","Source IDs"], kpis)}</div>
    </section>'''


def _render_dcf(valuation: dict[str, Any]) -> str:
    results = valuation["results"]
    dcf = results["dcf"]
    basis = dcf["basis"]
    cash_key = basis.lower()
    rows = []
    full = valuation["mode"] == "audit"
    for row in dcf["forecast"]:
        margin = row.get("operating_margin", row.get("net_margin"))
        if full:
            profit = row["ebit"] if basis == "FCFF" else row["net_income"]
            rows.append([_e(row["period"]), _fmt(row["revenue"]), _pct(row["growth"]), _pct(margin), _fmt(profit), _fmt(row["d_and_a"]), _fmt(row["capex"]), _fmt(row["delta_nwc"]), _fmt(row["net_borrowing"]), _fmt(row[cash_key]), _fmt(row["discount_factor"]), _fmt(row["pv"])])
        else:
            rows.append([_e(row["period"]), _fmt(row["revenue"]), _pct(row["growth"]), _pct(margin), _fmt(row[cash_key]), _fmt(row["discount_factor"]), _fmt(row["pv"])])
    sensitivity = dcf["sensitivity"]
    sensitivity_rows = []
    for rate, values in zip(sensitivity["discount_rates"], sensitivity["values"]):
        sensitivity_rows.append([_pct(rate)] + [_fmt(value) for value in values])
    terminal = dcf["terminal"]
    headers = ["Year", "Revenue", "Growth", "Operating / Net Margin", "EBIT / Net Income", "D&A", "Capex", "ΔNWC", "Net Borrowing", "FCFF / FCFE", "Discount Factor", "PV"] if full else ["Year", "Revenue", "Growth", "Margin", basis, "Discount Factor", "PV"]
    extension = f'<div class="note">Forecast extension reason: {_e(dcf["forecast_extension_reason"])}</div>' if dcf.get("forecast_extension_reason") else ""
    return f'''<div class="subsection" data-dcf-view="{"full" if full else "compact"}"><div class="subsection-head"><h3>DCF Forecast · {basis}</h3><p>{_e(dcf["discount_rate_type"])} {_pct(dcf["discount_rate"])}</p></div>{_table(headers, rows, check="dcf-forecast")}
      {extension}
      <div class="note">Terminal growth: {_pct(terminal["growth"])} · Terminal margin: {_pct(terminal["margin"])} · { _e(terminal["return_metric"]) }: {_pct(terminal["return_rate"])} · Reinvestment: {_pct(terminal["implied_reinvestment_rate"])} · Terminal value share: {_pct(terminal["value_share"])}</div></div>
      <div class="subsection"><div class="subsection-head"><h3>Discount Rate × Terminal Growth Sensitivity</h3><p>Value per share</p></div>{_table(["Discount Rate / Terminal Growth"] + [_pct(item) for item in sensitivity["terminal_growth_rates"]], sensitivity_rows, check="dcf-sensitivity")}</div>'''


def _render_warnings(valuation: dict[str, Any]) -> str:
    warnings = [("Engine", item) for item in valuation["warnings"]]
    if valuation["route"] == "dcf":
        warnings.extend(("Reverse Valuation", item) for item in valuation["results"]["reverse_valuation"]["warnings"])
    if not warnings:
        return ""
    items = "".join(f"<li><strong>{_e(origin)}:</strong> {_e(message)}</li>" for origin, message in warnings)
    return f'<div class="subsection note" data-check="valuation-warnings"><h3>Valuation Warnings</h3><ul>{items}</ul></div>'


def _render_dcf_audit_trail(content: dict[str, Any], valuation: dict[str, Any]) -> str:
    results = valuation["results"]
    cross_rows = [[_e(row["id"]), _e(row["name"]), _e(row["kind"]), _e(row["value_basis"]), _fmt(row["value"]), _fmt(row["per_share_value"]), _e(row["note"])] for row in results["relative_cross_checks"]]
    rec = results["reconciliation"]
    shared_rows = [
        ["Primary Method", _e(rec["primary_method"])],
        ["Value Basis", _e(rec["value_basis"])],
    ]
    equity_rows = [
        ["+ Additional Equity Adjustments", _fmt(rec["additional_equity_adjustments_total"])],
        ["= Equity Value", _fmt(rec["equity_value"])],
        ["Dilution Treatment", _e(rec["dilution_treatment"])],
        ["Diluted Shares", _fmt(rec["diluted_shares"])],
        ["FX to Quote", _fmt(rec["fx_to_quote"])],
        ["= Per-share Value", _fmt(rec["primary_per_share_value"])],
        ["Reconciliation Note", _e(content["valuation_context"]["reconciliation_note"])],
    ]
    if results["dcf"]["basis"] == "FCFF":
        title = "Signed EV-to-Equity Bridge"
        subtitle = "Complete reconciliation audit trail"
        bridge_rows = shared_rows + [
            ["Enterprise Value", _fmt(rec["enterprise_value"])],
            ["+ Excess Cash", _fmt(rec["excess_cash"])],
            ["+ Non-operating Investments", _fmt(rec["non_operating_investments"])],
            ["- Debt", _fmt(rec["debt"])],
            ["- Minority Interest", _fmt(rec["minority_interest"])],
            ["- Other Claims", _fmt(rec["other_claims"])],
        ] + equity_rows
    else:
        title = "Equity Value Reconciliation"
        subtitle = "FCFE excludes the enterprise-value bridge"
        bridge_rows = shared_rows + equity_rows
    return f'''<div class="subsection" data-check="relative-cross-checks"><div class="subsection-head"><h3>Relative Cross-checks</h3><p>Mechanical values from valuation-result.json</p></div>{_table(["Method ID","Method","Kind","Value Basis","Value","Value / Share","Note"], cross_rows)}</div>
      <div class="subsection"><div class="subsection-head"><h3>{title}</h3><p>{subtitle}</p></div>{_table(["Bridge Item","Value"], bridge_rows, check="valuation-reconciliation")}</div>'''


def _render_sector_valuation(content: dict[str, Any], valuation: dict[str, Any]) -> str:
    context = content["valuation_context"]
    results = valuation["results"]
    dcf = results["dcf"]
    market = valuation["market"]
    currency = valuation["units"]["quote_currency"]
    method_rows = [[_e(item["id"]), _e(item["name"]), _e(item["kind"]), _e(item["value_basis"]), _fmt(item["value"]), _fmt(item["per_share_value"]), _e(item["note"])] for item in results["methods"]]
    reverse = results["reverse_valuation"]
    reverse_rows = [
        ["Market Price / Date", f'{_money(market["current_price"], currency)} / {_e(market["price_as_of"])}'],
        ["Method / Value Basis", f'{_e(reverse["method"])} / {_e(reverse["value_basis"])}'],
        ["Metric", f'{_e(reverse["metric_name"])} / {_fmt(reverse["metric_per_share"])} per share'],
        ["Market-implied Multiple", _fmt(reverse["market_implied_multiple"])],
        ["Primary-implied Multiple", _fmt(reverse["primary_implied_multiple"])],
        ["Multiple Gap", _fmt(reverse["multiple_gap"])],
        ["Analyst / Base Comparison", f'{_e(reverse["primary_method_id"])} at {_fmt(reverse["primary_implied_multiple"])} versus market {_fmt(reverse["market_implied_multiple"])}'],
        ["Conclusion", _e(context["reverse_interpretation"])],
    ]
    rec = results["reconciliation"]
    reconciliation_rows = [[_e(rec["primary_method_id"]), _fmt(rec["primary_per_share_value"]), _fmt(rec["minimum_per_share_value"]), _fmt(rec["maximum_per_share_value"]), _fmt(rec["spread"]), _e(context["reconciliation_note"])]]
    return f'''<div class="subsection" data-dcf-view="not-applicable"><article class="card callout"><h3>DCF Not Applicable</h3><p><strong>Reason:</strong> {_e(dcf["reason"])}</p><p><strong>Alternative Method:</strong> {_e(dcf["alternative_method"])}</p></article></div>
      <div class="subsection">{_table(["Method ID","Method","Kind","Value Basis","Value","Value / Share","Note"], method_rows)}</div>
      <div class="subsection">{_table(["Primary Method","Primary Value / Share","Minimum","Maximum","Spread","Note"], reconciliation_rows, check="valuation-reconciliation")}</div>
      <div class="subsection" data-check="reverse-valuation valuation-market-expectations"><div class="subsection-head"><h3>Reverse Valuation</h3><p>Conditional implied expectation</p></div>{_table(["Field","Value"], reverse_rows)}</div>'''


def _render_valuation(content: dict[str, Any], valuation: dict[str, Any]) -> str:
    context = content["valuation_context"]
    results = valuation["results"]
    assumptions = [[f'<span id="{_e(row["id"])}">{_e(row["id"])}</span>', _e(row["assumption"]), _e(row["value"]), _links(row["source_ids"])] for row in context["assumptions"]]
    assumption_headers = ["Assumption ID", "Assumption", "Value", "Evidence IDs"]
    operating_html = ""
    if content["meta"]["mode"] == "audit":
        assumption_headers = ["Assumption ID", "Parameter", "Bear", "Base", "Bull", "Evidence / Calculation", "As of", "Rationale", "Scenario Link"]
        assumptions = [[f'<span id="{_e(row["id"])}">{_e(row["id"])}</span>', _e(row["assumption"]), _e(row["bear"]), _e(row["base"]), _e(row["bull"]), _links(row["source_ids"]), _e(row["as_of"]), _e(row["rationale"]), '<a href="#scenarios">Bear / Base / Bull</a>'] for row in context["assumptions"]]
        operating_rows = [[_e(row["variable"]), _e(row["bear"]), _e(row["base"]), _e(row["bull"]), _e(row["value_impact"]), _links(row["thesis_ids"])] for row in context["operating_sensitivity"]]
        operating_html = _table(["Operating Variable", "Bear", "Base", "Bull", "Value Impact", "Thesis Link"], operating_rows, check="operating-sensitivity")
    if valuation["route"] == "dcf":
        dcf_html = _render_dcf(valuation)
        dcf = results["dcf"]
        terminal = dcf["terminal"]
        reverse = results["reverse_valuation"]
        rec = results["reconciliation"]
        market = valuation["market"]
        currency = valuation["units"]["quote_currency"]
        reverse_rows = [
            ["Current Market Price / Date", f'{_money(market["current_price"], currency)} / {_e(market["price_as_of"])}'],
            ["Reverse Input Price / Source", f'{_money(reverse["input_price"], currency)} / {_e(reverse["input_price_source"])}'],
            ["Method / Value Basis", f'Reverse DCF / {_e(rec["value_basis"])}'],
            ["Cash-flow / Discount Basis", f'{_e(dcf["basis"])} / {_e(dcf["discount_rate_type"])} {_pct(dcf["discount_rate"])}'],
            ["Required Terminal Value", _fmt(reverse["required_terminal_value"])],
            ["Required Terminal Cash Flow", _fmt(reverse["required_terminal_cash_flow"])],
            ["Growth Period", f'{_fmt(reverse["growth_period_years"])} years'],
            ["Implied / Base Steady-state Margin", f'{_pct(reverse["implied_terminal_cash_flow_margin"])} / {_pct(terminal["margin"])}'],
            ["Implied / Base Terminal Growth", f'{_pct(reverse["implied_terminal_growth"])} / {_pct(terminal["growth"])}'],
            ["Return / Reinvestment", f'{_e(reverse["return_metric"])} {_pct(reverse["return_rate"])}; implied {_pct(reverse["implied_reinvestment_rate"])} / base {_pct(terminal["implied_reinvestment_rate"])}'],
            ["Analyst / Base Comparison", f'Base terminal margin {_pct(terminal["margin"])} and growth {_pct(terminal["growth"])}; reverse-input-implied margin {_pct(reverse["implied_terminal_cash_flow_margin"])} and growth {_pct(reverse["implied_terminal_growth"])}'],
            ["Assumptions Held Constant", _e(reverse["assumptions_held_constant"])],
            ["Conclusion", _e(context["reverse_interpretation"])],
        ]
        reverse_html = f'''<div class="subsection" data-check="reverse-dcf reverse-valuation valuation-market-expectations"><div class="subsection-head"><h3>Reverse Valuation</h3><p>Conditional implied expectation versus analyst base</p></div>{_table(["Field","Value"], reverse_rows)}</div>
      {_render_dcf_audit_trail(content, valuation)}'''
    else:
        dcf_html = _render_sector_valuation(content, valuation)
        reverse_html = ""
    scenario_cards = []
    scenarios = results["scenarios"]
    for name in ("bear", "base", "bull"):
        item = scenarios["scenarios"][name]
        rationale = context["scenario_rationales"][name]
        scenario_cards.append(f'<article class="card scenario {name}"><div class="scenario-head"><div class="scenario-name">{_e(name)} · {_pct(item["probability"])}</div><div class="scenario-price">{_money(item["ending_value"], valuation["units"]["quote_currency"])}</div></div><div class="scenario-body"><dl><dt>Operating assumptions</dt><dd>{_e(rationale["operating_assumptions"])}</dd><dt>Valuation assumptions</dt><dd>{_e(rationale["valuation_assumptions"])}</dd><dt>Trigger / Falsifier</dt><dd>{_e(rationale["trigger_or_falsifier"])}</dd><dt>Holding period</dt><dd>{_fmt(scenarios["horizon_years"])} years</dd><dt>Dividends</dt><dd>{_e(item["dividends"])}</dd><dt>Expected Return</dt><dd>{_pct(item["expected_return"])}</dd><dt>IRR</dt><dd>{_pct(item["irr"])}</dd><dt>Cash flows</dt><dd>{_e(item["cash_flows"])}</dd></dl></div></article>')
    mos = results["margin_of_safety"]
    return f'''<section id="valuation" data-check="valuation-market-expectations"><div class="section-kicker">06 · Valuation</div><h2>估值、隐含预期与回报</h2><p class="section-lead">{_e(context["method_rationale"])}</p>
      <div class="subsection">{_table(assumption_headers, assumptions, check="valuation-assumptions")}</div>
      {operating_html}
      {dcf_html}
      {reverse_html}
      {_render_warnings(valuation)}
      <div class="subsection" id="scenarios" data-check="scenario-analysis irr-analysis"><div class="subsection-head"><h3>Bear / Base / Bull</h3><p>Probabilities and cash flows from valuation-result.json</p></div><div class="grid-3">{"".join(scenario_cards)}</div>
        <div class="summary-strip"><div><span>Expected Value</span><strong>{_money(scenarios["probability_weighted_ending_value"], valuation["units"]["quote_currency"])}</strong></div><div><span>Probability-weighted Expected Return</span><strong data-expected-return="probability-weighted" data-expected-return-value="{_e(scenarios["probability_weighted_expected_return"])}">{_pct(scenarios["probability_weighted_expected_return"])}</strong></div><div><span>Base IRR</span><strong data-irr="base" data-irr-value="{_e(scenarios["base_irr"])}">{_pct(scenarios["base_irr"])}</strong></div><div><span>Probability-weighted IRR</span><strong data-irr="probability-weighted" data-irr-value="{_e(scenarios["probability_weighted_irr"])}">{_pct(scenarios["probability_weighted_irr"])}</strong></div></div>
        <div class="note" data-irr-method="{_e(scenarios["method"])}">IRR method: {_e(scenarios["method"])} · Probability-weighted terminal value: <span data-irr-input="terminal-value" data-value="{_e(scenarios["probability_weighted_ending_value"])}">{_fmt(scenarios["probability_weighted_ending_value"])}</span> · Dividend cash flows: <span data-irr-input="dividend-cash-flows" data-value="{_e(scenarios["probability_weighted_dividends"])}">{_e(scenarios["probability_weighted_dividends"])}</span></div>
      </div>
    </section>'''


def _render_theses_and_risks(content: dict[str, Any]) -> str:
    thesis_rows = []
    for row in content["theses"]:
        thesis_rows.append([f'<span id="{_e(row["id"])}">{_e(row["id"])}</span>', _e(row["statement"]), _links(row["supporting_source_ids"]), _links(row["counter_source_ids"]), _e(" + ".join(row["evidence_types"])), _e(row["confidence"]), _e(row["needs_validation"]), _e(row.get("evidence_gap", ""))])
    breaker_rows = [[_e(row["breaker"]), _e(row["trigger"]), _e(row["confirmation_window"]), _links(row["thesis_ids"]), _e(row["scenario_probability_impact"]), _e(row["valuation_impact"]), _e(row["research_action"])] for row in content["risks_and_breakers"]["breakers"]]
    return f'''<section id="thesis" data-check="thesis-bear-case"><div class="section-kicker">07 · Thesis &amp; Breakers</div><h2>投资 Thesis 与反证</h2><p class="section-lead">Thesis Matrix 是详细论证的唯一权威位置。</p>
      <div class="subsection">{_table(["Thesis ID","Thesis","Supporting Evidence IDs","Counter Evidence IDs","Evidence Types","Confidence","Needs Validation","Evidence Gap"], thesis_rows, check="thesis-evidence-matrix")}</div>
      <div class="subsection" data-check="risks-catalysts-breakers"><div class="subsection-head"><h3>Thesis Breakers</h3><p>{_e(content["risks_and_breakers"]["summary"])}</p></div>{_table(["Breaker","Trigger","Confirmation Window","Thesis IDs","Scenario Probability Impact","Valuation Impact","Research Action"], breaker_rows, check="thesis-breakers")}</div>
    </section>'''


def _render_scorecard(content: dict[str, Any]) -> str:
    labels = {"industry": "行业与需求", "moat": "商业模式与护城河", "financials": "财务质量", "management": "管理层与资本配置", "trend": "趋势与拐点", "valuation": "估值与隐含预期", "monitoring": "风险收益与可监测性"}
    weights = {"industry": 15, "moat": 15, "financials": 15, "management": 10, "trend": 15, "valuation": 20, "monitoring": 10}
    rows = []
    weighted = 0.0
    coverage = 0
    for key, weight in weights.items():
        row = content["scorecard"][key]
        score = row["score"]
        if score is not None:
            weighted += float(score) * weight / 5.0
            coverage += weight
        rows.append([_e(labels[key]), _e("N/A" if score is None else score), _e(f"{weight}%"), _links(row["evidence_ids"]), _links(row["counter_evidence_ids"]), _links(row["thesis_ids"]), _e(row["confidence"]), _e(row["rationale_or_gap"])])
    return f'''<section id="scorecard" data-check="scorecard"><div class="section-kicker">08 · Investment Scorecard</div><h2>Investment Scorecard</h2><p class="section-lead">总分：{weighted:.1f}/100 · 已评分权重覆盖率：{coverage}%</p>{_table(["Dimension","Score","Weight","Evidence IDs","Counter-Evidence IDs","Thesis IDs","Confidence","Rationale / Gap"], rows)}</section>'''


def _render_monitoring_and_conclusion(content: dict[str, Any], valuation: dict[str, Any]) -> str:
    rows = [[_e(row["metric"]), f'<span data-market-data data-as-of="{_e(row["as_of"])}">{_e(row["current_value"])}</span> / {_e(row["as_of"])}', _links(row["source_ids"]), _e(row["next_update"]), _e(row["bull_threshold"]), _e(row["bear_threshold"]), _links(row["thesis_ids"]), _e(row["valuation_impact"]), _e(row["research_action"])] for row in content["monitoring"]]
    conclusion = content["conclusion"]
    mos = valuation["results"]["margin_of_safety"]
    currency = valuation["units"]["quote_currency"]
    return f'''<section id="monitoring" data-check="decision-loop"><div class="section-kicker">09 · Decision &amp; Monitoring Loop</div><h2>Decision &amp; Monitoring Loop</h2><p class="section-lead">指标变化直接回链 Thesis、估值与下一项研究行动。</p>{_table(["Metric","Current / As of","Source IDs","Next Update","Bull Threshold","Bear Threshold","Thesis IDs","Valuation Impact","Research Action"], rows)}</section>
    <section id="conclusion" data-check="conclusion-validation"><div class="section-kicker">10 · Conclusion</div><h2>结论与待验证事项</h2><div class="grid-2"><article class="card"><h3>Decision</h3><p>{_e(conclusion["decision"])}</p><h3>公司质量</h3><p>{_e(conclusion["company_quality"])}</p><h3>股票价值</h3><p>{_e(conclusion["stock_value"])}</p><p>Thesis links: {_links(conclusion["thesis_ids"])}</p></article><article class="card dark-card" data-check="margin-of-safety"><h3>Margin of Safety</h3><p>Fair Value: <strong>{_money(_primary_value(valuation), currency)}</strong><br>Attractive Price: <strong>{_money(mos["attractive_price"], currency)}</strong><br>High-Conviction Price: <strong>{_money(mos["high_conviction_price"], currency)}</strong></p><p><strong>Rationale:</strong> {_e(conclusion["margin_of_safety_rationale"])}</p></article></div><div class="note">待验证事项：{_e("；".join(conclusion["validation_items"]))}。Action 是研究框架含义，不是个性化交易指令。</div></section>'''


def _render_sources(content: dict[str, Any]) -> str:
    items = []
    for source in content["sources"]:
        url = source["url_or_path"]
        attrs = " ".join(f'data-{name}="{_e(source[key])}"' for name, key in (("source-role", "role"), ("source-document", "document"), ("publication-date", "publication_date"), ("reporting-period", "reporting_period"), ("locator", "locator"), ("source-url", "url_or_path"), ("access-date", "access_date")))
        items.append(f'<article class="source-item" id="{_e(source["id"])}" {attrs}><div class="source-id">{_e(source["id"])}</div><p><strong data-source-field="document">{_e(source["document"])}</strong> → <span data-source-field="role">{_e(source["role"])}</span> → <span data-source-field="publication-date">{_e(source["publication_date"])}</span> → <span data-source-field="reporting-period">{_e(source["reporting_period"])}</span> → <span data-source-field="locator">{_e(source["locator"])}</span> → <a data-source-field="url" href="{_e(url)}">{_e(url)}</a> → accessed <span data-source-field="access-date">{_e(source["access_date"])}</span></p></article>')
    return f'''<section id="sources" data-check="sources"><div class="section-kicker">11 · Sources</div><h2>来源</h2><p class="section-lead">Source ID → Role → Document → Publication date → Reporting period → Locator → URL / path → Access date。</p><div class="sources">{"".join(items)}</div></section>'''


def _primary_value(valuation: dict[str, Any]) -> Any:
    results = valuation["results"]
    if valuation["route"] == "dcf":
        return results["dcf"]["per_share_value"]
    return results["reconciliation"]["primary_per_share_value"]


def _render_body(content: dict[str, Any], valuation: dict[str, Any], content_hash: str, valuation_hash: str) -> str:
    meta = content["meta"]
    summary = content["summary"]
    market = valuation["market"]
    results = valuation["results"]
    scenarios = results["scenarios"]
    mos = results["margin_of_safety"]
    currency = valuation["units"]["quote_currency"]
    body_attrs = f'data-report-version="1.2" data-report-mode="{_e(meta["mode"])}" data-report-as-of="{_e(meta["as_of"])}" data-generated-by="render_report.py" data-renderer-version="{RENDERER_VERSION}" data-template-version="1.2" data-content-sha256="{content_hash}" data-valuation-sha256="{valuation_hash}"'
    return f'''<body {body_attrs}>
      <header class="masthead"><div class="shell"><div class="topline"><div class="brand"><span class="brand-mark">ER</span> Fundamental Research · V1.2 · {_e(meta["mode"])}</div><div class="asof">AS OF <time data-report-cutoff="{_e(meta["as_of"])}">{_e(meta["as_of"])}</time> · {_e(meta["investment_horizon"])}</div></div><div class="hero"><div><div class="eyebrow">{_e(meta["company_name"])} · {_e(meta["ticker"])} · {_e(meta["exchange"])}</div><h1>{_e(summary["headline"])}</h1><p class="hero-subtitle">{_e(summary["one_line_judgment"])}</p></div><aside class="verdict"><div class="verdict-label">Investment posture</div><div class="verdict-title">{_e(summary["investment_posture"])}</div><div class="verdict-note">{_e(summary["posture_rationale"])}</div><div class="hero-metrics"><div class="hero-metric"><span>Current price</span><strong data-market-data data-as-of="{_e(market["price_as_of"])}">{_money(market["current_price"], currency)}</strong><em>As of {_e(market["price_as_of"])}</em></div><div class="hero-metric"><span>Primary value</span><strong>{_money(_primary_value(valuation), currency)}</strong><em>{_e(valuation["route"])}</em></div><div class="hero-metric"><span>Attractive price</span><strong>{_money(mos["attractive_price"], currency)}</strong><em>{_pct(mos["required"])}</em></div><div class="hero-metric"><span>Confidence</span><strong>{_e(summary["overall_confidence"])}</strong><em>{_e(summary["maximum_unknown"])}</em></div></div></aside></div></div></header>
      <div class="nav-wrap"><nav class="nav shell" aria-label="报告导航"><a href="#executive-summary">核心判断</a><a href="#evidence">证据</a><a href="#business">商业与行业</a><a href="#management">MD&amp;A</a><a href="#financials">财务</a><a href="#valuation">估值</a><a href="#thesis">Thesis</a><a href="#scorecard">Scorecard</a><a href="#monitoring">监控</a><a href="#sources">来源</a></nav></div>
      <main class="shell"><section id="executive-summary" data-check="executive-summary"><div class="section-kicker">01 · Executive Summary</div><h2>执行摘要</h2><p class="section-lead">{_e(summary["one_line_judgment"])}</p><div class="grid-2"><article class="card callout"><h3>公司质量</h3><p>{_e(summary["company_quality"])}</p></article><article class="card dark-card"><h3>股票价值</h3><p>{_e(summary["stock_value"])}</p></article></div><div class="metric-row"><div class="metric"><div class="metric-label">Base IRR</div><div class="metric-value">{_pct(scenarios["base_irr"])}</div><div class="metric-note">{_e(meta["investment_horizon"])}</div></div><div class="metric"><div class="metric-label">Probability-weighted IRR</div><div class="metric-value">{_pct(scenarios["probability_weighted_irr"])}</div><div class="metric-note">Weighted cash flows</div></div><div class="metric"><div class="metric-label">Probability-weighted Expected Return</div><div class="metric-value">{_pct(scenarios["probability_weighted_expected_return"])}</div><div class="metric-note">Holding-period return</div></div><div class="metric"><div class="metric-label">High-Conviction Price</div><div class="metric-value">{_money(mos["high_conviction_price"], currency)}</div><div class="metric-note">{_pct(mos["high_conviction"])}</div></div></div></section>
      <p class="section-lead">Research cutoff: As of <time data-report-cutoff="{_e(meta["as_of"])}">{_e(meta["as_of"])}</time>.</p>
      {_render_evidence(content)}{_render_business(content)}{_render_management(content)}{_render_financials(content)}{_render_valuation(content, valuation)}{_render_theses_and_risks(content)}{_render_scorecard(content)}{_render_monitoring_and_conclusion(content, valuation)}{_render_sources(content)}</main>
      <footer><div class="shell"><strong>{_e(meta["company_name"])}（{_e(meta["ticker"])}）Equity Research</strong><br>研究截止：As of <time data-report-cutoff="{_e(meta["as_of"])}">{_e(meta["as_of"])}</time>。本报告为研究框架输出，不构成个性化投资建议。</div></footer>
    </body>'''


def render_report(content: dict[str, Any], valuation: dict[str, Any], template_text: str) -> str:
    """Validate and return byte-deterministic self-contained HTML."""
    content, valuation, content_hash, valuation_hash = _validate_inputs(content, valuation, template_text)
    meta = content["meta"]
    title = f'{meta["company_name"]}（{meta["ticker"]}）投资研究｜{meta["as_of"]}'
    head = f'<meta name="generator" content="{GENERATOR}">\n  <meta name="er-schema-version" content="1.2">\n  <meta name="er-renderer-version" content="{RENDERER_VERSION}">\n  <meta name="er-content-sha256" content="{content_hash}">\n  <meta name="er-valuation-sha256" content="{valuation_hash}">\n  <title>{_e(title)}</title>'
    return template_text.replace(HEAD_SENTINEL, head).replace(BODY_SENTINEL, _render_body(content, valuation, content_hash, valuation_hash))


def write_report(content: dict[str, Any], valuation: dict[str, Any], template_text: str, output: Path) -> None:
    """Render fully, then atomically replace output without truncating on failure."""
    rendered = render_report(content, valuation, template_text)
    output = Path(output)
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary_name = ""
    try:
        with tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=output.parent, prefix=f".{output.name}.", suffix=".tmp", delete=False) as handle:
            temporary_name = handle.name
            handle.write(rendered)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary_name, output)
    except Exception:
        if temporary_name:
            try:
                Path(temporary_name).unlink()
            except FileNotFoundError:
                pass
        raise


def main(argv: Optional[list[str]] = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("content")
    parser.add_argument("--valuation", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args(argv)
    try:
        content = json.loads(Path(args.content).read_text(encoding="utf-8"))
        valuation = json.loads(Path(args.valuation).read_text(encoding="utf-8"))
        template = Path(__file__).resolve().parents[1].joinpath("assets", "report-template.html").read_text(encoding="utf-8")
        write_report(content, valuation, template, Path(args.output))
        return 0
    except (json.JSONDecodeError, RenderError, OSError) as error:
        if isinstance(error, RenderError):
            payload = {"code": error.code, "path": error.path, "message": error.message}
        elif isinstance(error, json.JSONDecodeError):
            payload = {"code": "JSON_INVALID", "path": "$", "message": error.msg}
        else:
            payload = {"code": "IO_ERROR", "path": "$", "message": str(error)}
        print(json.dumps(payload, ensure_ascii=False, separators=(",", ":")))
        return 2
    except Exception:
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
