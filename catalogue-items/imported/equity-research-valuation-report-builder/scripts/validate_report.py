#!/usr/bin/env python3
"""Audit V1.2 Standard/Audit reports, with explicit V1.1 compatibility.

This zero-dependency linter checks report structure, traceability hooks, HTML
self-containment, and obvious valuation-basis conflicts. It cannot verify that
sources are true, independent, or numerically correct.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
import sys
from collections import defaultdict
from dataclasses import asdict, dataclass, field
from datetime import date
from html.parser import HTMLParser
from pathlib import Path
from types import MappingProxyType
from typing import Iterable, Optional


DATE_RE = re.compile(r"\b20\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])\b")
ISO_LIKE_RE = re.compile(r"\b20\d{2}-\d{2}-\d{2}\b")
AS_OF_RE = re.compile(r"\bAs\s+of\s+(20\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01]))\b", re.I)
PLACEHOLDER_RE = re.compile(r"\{\{[A-Z][A-Z0-9_]*\}\}|\b(?:TBD|XXX)\b|As\s+of\s+YYYY-MM-DD", re.I)
LOCATOR_RE = re.compile(
    r"(?:\bp{1,2}\.\s*\d|\bpages?\s*\d|第?\s*\d+\s*页|\bitem\s+\d|"
    r"\bsection\s+[a-z0-9\u4e00-\u9fff][a-z0-9\u4e00-\u9fff ._/-]*|"
    r"\btable\s+[a-z0-9\u4e00-\u9fff][a-z0-9\u4e00-\u9fff ._/-]*|"
    r"\bnote\s+\d|\bpart\s+[ivx\d]+|章节\s*[:：]?\s*[\u4e00-\u9fff\w]+|表\s*\d)",
    re.I,
)


@dataclass(frozen=True)
class Issue:
    severity: str
    code: str
    message: str
    blocking: bool = True


@dataclass
class Cell:
    text: str
    links: list[str] = field(default_factory=list)


@dataclass
class Table:
    checks: set[str] = field(default_factory=set)
    rows: list[list[Cell]] = field(default_factory=list)

    @property
    def headers(self) -> list[str]:
        return [cell.text for cell in self.rows[0]] if self.rows else []


def _clean(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def _norm(text: str) -> str:
    text = _clean(text).lower().replace("&amp;", "&")
    return re.sub(r"[^a-z0-9\u4e00-\u9fff%/]+", " ", text).strip()


def _is_data_uri(value: str) -> bool:
    return value.strip().lower().startswith("data:")


def _valid_iso_date(value: str) -> bool:
    try:
        date.fromisoformat(value)
    except ValueError:
        return False
    return True


def _attrs(items: list[tuple[str, Optional[str]]]) -> dict[str, str]:
    return {key.lower(): (value or "") for key, value in items}


class ReportHTMLParser(HTMLParser):
    """Collect only the structural information needed by the linter."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.doctype = False
        self.html_lang = ""
        self.has_style = False
        self.meta_charset = False
        self.viewport = False
        self.styles: list[str] = []
        self._style_chunks: Optional[list[str]] = None
        self.headings: list[str] = []
        self._heading_chunks: Optional[list[str]] = None
        self.body_chunks: list[str] = []
        self.checks: set[str] = set()
        self.check_chunks: dict[str, list[str]] = defaultdict(list)
        self.evidence_labels: set[str] = set()
        self.evidence_blocks: list[dict[str, object]] = []
        self.ids: set[str] = set()
        self.id_counts: dict[str, int] = defaultdict(int)
        self.id_chunks: dict[str, list[str]] = defaultdict(list)
        self.id_links: dict[str, list[str]] = defaultdict(list)
        self.source_entries: dict[str, dict[str, str]] = {}
        self.source_field_blocks: list[dict[str, object]] = []
        self.fragment_links: list[str] = []
        self.resource_refs: list[str] = []
        self.market_as_of_values: list[str] = []
        self.irr_values: dict[str, str] = {}
        self.irr_inputs: dict[str, str] = {}
        self.irr_method = ""
        self.irr_value_blocks: list[dict[str, object]] = []
        self.irr_input_blocks: list[dict[str, object]] = []
        self.irr_method_blocks: list[dict[str, object]] = []
        self.report_as_of = ""
        self.metadata: dict[str, str] = {}
        self.provenance: dict[str, str] = {}
        self.source_roles: dict[str, set[str]] = defaultdict(set)
        self.report_cutoff_blocks: list[dict[str, object]] = []
        self.tables: list[Table] = []
        self._table: Optional[Table] = None
        self._row: Optional[list[Cell]] = None
        self._cell_chunks: Optional[list[str]] = None
        self._cell_links: list[str] = []
        self.stack: list[dict[str, object]] = []

    def handle_decl(self, decl: str) -> None:
        if decl.strip().lower().startswith("doctype html"):
            self.doctype = True

    def handle_starttag(self, tag: str, attrs_list: list[tuple[str, Optional[str]]]) -> None:
        tag = tag.lower()
        attrs = _attrs(attrs_list)
        node: dict[str, object] = {"tag": tag}
        if tag == "body":
            self.provenance = attrs
        if tag == "meta" and attrs.get("name"):
            self.metadata[attrs["name"].lower()] = attrs.get("content", "")

        element_id = attrs.get("id", "").strip()
        if element_id:
            self.ids.add(element_id)
            self.id_counts[element_id] += 1
            node["id"] = element_id
            if re.fullmatch(r"S\d+", element_id, re.I):
                self.source_roles[element_id].add(attrs.get("data-source-role", ""))
                parent_checks = {str(value) for value in self._active_values("checks")}
                self.source_entries[element_id] = {
                    "document": attrs.get("data-source-document", "").strip(),
                    "publication_date": attrs.get("data-publication-date", "").strip(),
                    "reporting_period": attrs.get("data-reporting-period", "").strip(),
                    "locator": attrs.get("data-locator", "").strip(),
                    "url": attrs.get("data-source-url", "").strip(),
                    "access_date": attrs.get("data-access-date", "").strip(),
                    "in_sources": "true" if "sources" in parent_checks else "false",
                }

        check = attrs.get("data-check", "").strip()
        if check:
            checks = {item for item in re.split(r"[\s,]+", check) if item}
            self.checks.update(checks)
            node["checks"] = checks

        evidence = attrs.get("data-evidence", "").strip().lower()
        if evidence:
            self.evidence_labels.add(evidence)
            index = len(self.evidence_blocks)
            self.evidence_blocks.append({"label": evidence, "chunks": [], "links": []})
            node["evidence_index"] = index

        if attrs.get("data-market-data") is not None or "data-as-of" in attrs:
            self.market_as_of_values.append(attrs.get("data-as-of", ""))
        if "data-report-as-of" in attrs:
            self.report_as_of = attrs.get("data-report-as-of", "").strip()
        if "data-report-cutoff" in attrs:
            index = len(self.report_cutoff_blocks)
            self.report_cutoff_blocks.append({
                "value": attrs.get("data-report-cutoff", "").strip(), "chunks": []
            })
            node["report_cutoff_index"] = index
        if attrs.get("data-irr"):
            key = attrs["data-irr"].strip().lower()
            value = attrs.get("data-irr-value", "").strip()
            self.irr_values[key] = value
            index = len(self.irr_value_blocks)
            self.irr_value_blocks.append({"key": key, "value": value, "chunks": []})
            node["irr_value_index"] = index
        if attrs.get("data-irr-input"):
            key = attrs["data-irr-input"].strip().lower()
            value = attrs.get("data-value", "").strip()
            self.irr_inputs[key] = value
            index = len(self.irr_input_blocks)
            self.irr_input_blocks.append({"key": key, "value": value, "chunks": []})
            node["irr_input_index"] = index
        if "data-irr-method" in attrs:
            self.irr_method = attrs.get("data-irr-method", "").strip()
            index = len(self.irr_method_blocks)
            self.irr_method_blocks.append({"value": self.irr_method, "chunks": []})
            node["irr_method_index"] = index

        source_field = attrs.get("data-source-field", "").strip().lower()
        if source_field:
            source_ids = [
                str(value) for value in self._active_values("id")
                if re.fullmatch(r"S\d+", str(value), re.I)
            ]
            index = len(self.source_field_blocks)
            self.source_field_blocks.append({
                "source_id": source_ids[-1] if source_ids else "",
                "field": source_field,
                "href": attrs.get("href", "").strip(),
                "chunks": [],
            })
            node["source_field_index"] = index

        if tag == "html":
            self.html_lang = attrs.get("lang", "")
        elif tag == "meta":
            if "charset" in attrs:
                self.meta_charset = bool(attrs["charset"])
            if attrs.get("name", "").lower() == "viewport" and attrs.get("content"):
                self.viewport = True
        elif tag == "style":
            self.has_style = True
            self._style_chunks = []
        elif re.fullmatch(r"h[1-6]", tag):
            self._heading_chunks = []

        href = attrs.get("href", "")
        src = attrs.get("src", "")
        if tag == "a" and href.startswith("#"):
            self.fragment_links.append(href[1:])
        if tag == "link" and href and "stylesheet" in attrs.get("rel", "").lower():
            self.resource_refs.append(f"<link href=\"{href}\">")
        if tag == "script" and src:
            self.resource_refs.append(f"<script src=\"{src}\">")
        if tag in {"img", "audio", "video", "source", "iframe", "embed"} and src and not _is_data_uri(src):
            self.resource_refs.append(f"<{tag} src=\"{src}\">")
        if tag == "object" and attrs.get("data") and not _is_data_uri(attrs["data"]):
            self.resource_refs.append(f"<object data=\"{attrs['data']}\">")

        self.stack.append(node)

        if tag == "table":
            active_checks = self._active_values("checks")
            self._table = Table(checks=set(active_checks))
        elif tag == "tr" and self._table is not None:
            self._row = []
        elif tag in {"th", "td"} and self._row is not None:
            self._cell_chunks = []
            self._cell_links = []

        if tag == "a" and href:
            if self._cell_chunks is not None:
                self._cell_links.append(href)
            for element_id in self._active_values("id"):
                self.id_links[str(element_id)].append(href)
            for index in self._active_values("evidence_index"):
                self.evidence_blocks[int(index)]["links"].append(href)  # type: ignore[index]

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, Optional[str]]]) -> None:
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)

    def handle_data(self, data: str) -> None:
        if not data:
            return
        self.body_chunks.append(data)
        if self._style_chunks is not None:
            self._style_chunks.append(data)
        if self._heading_chunks is not None:
            self._heading_chunks.append(data)
        if self._cell_chunks is not None:
            self._cell_chunks.append(data)
        for check in set(self._active_values("checks")):
            self.check_chunks[str(check)].append(data)
        for element_id in set(self._active_values("id")):
            self.id_chunks[str(element_id)].append(data)
        for index in set(self._active_values("evidence_index")):
            self.evidence_blocks[int(index)]["chunks"].append(data)  # type: ignore[index]
        for index in set(self._active_values("report_cutoff_index")):
            self.report_cutoff_blocks[int(index)]["chunks"].append(data)  # type: ignore[index]
        for index in set(self._active_values("irr_value_index")):
            self.irr_value_blocks[int(index)]["chunks"].append(data)  # type: ignore[index]
        for index in set(self._active_values("irr_input_index")):
            self.irr_input_blocks[int(index)]["chunks"].append(data)  # type: ignore[index]
        for index in set(self._active_values("irr_method_index")):
            self.irr_method_blocks[int(index)]["chunks"].append(data)  # type: ignore[index]
        for index in set(self._active_values("source_field_index")):
            self.source_field_blocks[int(index)]["chunks"].append(data)  # type: ignore[index]

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag in {"th", "td"} and self._cell_chunks is not None and self._row is not None:
            self._row.append(Cell(_clean(" ".join(self._cell_chunks)), list(self._cell_links)))
            self._cell_chunks = None
            self._cell_links = []
        elif tag == "tr" and self._row is not None and self._table is not None:
            if self._row:
                self._table.rows.append(self._row)
            self._row = None
        elif tag == "table" and self._table is not None:
            self.tables.append(self._table)
            self._table = None
        elif re.fullmatch(r"h[1-6]", tag) and self._heading_chunks is not None:
            heading = _clean(" ".join(self._heading_chunks))
            if heading:
                self.headings.append(heading)
            self._heading_chunks = None
        elif tag == "style" and self._style_chunks is not None:
            self.styles.append("".join(self._style_chunks))
            self._style_chunks = None

        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index].get("tag") == tag:
                del self.stack[index:]
                break

    def _active_values(self, key: str) -> list[object]:
        values: list[object] = []
        for node in self.stack:
            value = node.get(key)
            if isinstance(value, set):
                values.extend(value)
            elif value is not None:
                values.append(value)
        return values

    @property
    def text(self) -> str:
        return _clean(" ".join(self.body_chunks))

    def block_text(self, check: str) -> str:
        return _clean(" ".join(self.check_chunks.get(check, [])))


REQUIRED_CHECKS = {
    "executive-summary": ("执行摘要", "executive summary"),
    "evidence-scope": ("研究范围与证据", "evidence"),
    "business-industry": ("商业模式与行业需求", "business", "行业需求"),
    "competition-strategy": ("竞争优势与战略", "competition", "护城河"),
    "management-capital-allocation": ("md&a", "管理层与资本配置"),
    "financials-earnings-quality": ("财务分析与盈利质量", "earnings quality"),
    "kpi-trends-inflections": ("趋势与拐点", "trend", "inflection"),
    "valuation-market-expectations": ("估值与市场隐含预期", "valuation"),
    "scenario-analysis": ("bear / base / bull", "bear/base/bull", "情景分析"),
    "thesis-bear-case": ("投资 thesis", "bear case"),
    "risks-catalysts-breakers": ("风险、催化剂", "thesis breakers", "thesis breaker"),
    "scorecard": ("investment scorecard", "投资评分卡"),
    "decision-loop": ("decision & monitoring loop", "watch next", "监控"),
    "conclusion-validation": ("结论与待验证", "conclusion"),
    "sources": ("来源", "sources"),
}


TABLE_REQUIREMENTS: dict[str, list[tuple[str, tuple[str, ...]]]] = {
    "thesis-evidence-matrix": [
        ("Thesis ID", ("thesis id", "主张 id")),
        ("Thesis", ("=thesis", "=主张")),
        ("Supporting Evidence", ("supporting evidence", "支持证据")),
        ("Counter Evidence", ("counter evidence", "反证")),
        ("Evidence Type", ("evidence type", "证据类型")),
        ("Confidence", ("confidence", "置信度")),
        ("What Needs Validation", ("what needs validation", "待验证")),
    ],
    "metric-continuity": [
        ("Metric", ("metric", "指标")),
        ("Periods", ("periods", "期间")),
        ("Definition / Scope Change", ("definition", "scope change", "定义", "范围变化")),
        ("Comparability Status", ("comparability status", "可比性")),
        ("Adjustment", ("adjustment", "调整")),
        ("Source", ("source", "来源")),
    ],
    "mda-delta": [
        ("Topic", ("topic", "主题")),
        ("Previous Period", ("previous period", "上期")),
        ("Current Period", ("current period", "本期")),
        ("Change", ("change", "delta", "变化")),
        ("Interpretation", ("interpretation", "解读")),
        ("Evidence IDs", ("evidence ids", "证据 id")),
        ("Alternative Explanation", ("alternative explanation", "替代解释")),
        ("Validation Task", ("validation task", "验证任务")),
    ],
    "promise-tracker": [
        ("Promise ID", ("promise id", "承诺 id")),
        ("Management Promise", ("management promise", "管理层承诺")),
        ("Promise Date", ("promise date", "time", "承诺日期", "时间")),
        ("Original Wording / Locator", ("original wording", "locator", "原始表述", "定位")),
        ("Due Date", ("due date", "到期日")),
        ("Subsequent Actual Result", ("subsequent actual result", "actual result", "后续实际结果")),
        ("Evidence ID", ("evidence id", "证据 id")),
        ("Status", ("status", "状态")),
        ("Assessment", ("assessment", "评估")),
    ],
    "industry-triangulation": [
        ("Industry Claim", ("industry claim", "行业判断")),
        ("Company Evidence", ("company evidence", "公司证据")),
        ("Competitor Evidence", ("competitor evidence", "竞争对手证据")),
        ("Independent Industry Data", ("independent industry", "独立行业")),
        ("Agreement / Conflict", ("agreement", "conflict", "一致", "冲突")),
        ("Confidence", ("confidence", "置信度")),
        ("Gap", ("gap", "缺口")),
    ],
    "financial-history-annual": [
        ("Period", ("period", "期间")),
        ("Revenue", ("revenue", "收入")),
        ("Growth", ("growth", "增长")),
        ("Margin", ("margin", "利润率")),
        ("OCF", ("ocf", "operating cash flow", "经营现金流")),
        ("FCF", ("fcf", "free cash flow", "自由现金流")),
        ("ROIC", ("roic", "投入资本回报")),
        ("Earnings Quality Note", ("earnings quality", "盈利质量")),
        ("Source", ("source", "来源")),
    ],
    "financial-history-quarterly": [
        ("Period", ("period", "期间")),
        ("Revenue", ("revenue", "收入")),
        ("Growth", ("growth", "增长")),
        ("Margin", ("margin", "利润率")),
        ("OCF", ("ocf", "operating cash flow", "经营现金流")),
        ("FCF", ("fcf", "free cash flow", "自由现金流")),
        ("ROIC", ("roic", "投入资本回报")),
        ("Earnings Quality Note", ("earnings quality", "盈利质量")),
        ("Source", ("source", "来源")),
    ],
    "valuation-assumptions": [
        ("Assumption ID", ("assumption id", "假设 id")),
        ("Parameter", ("parameter", "参数")),
        ("Bear", ("bear", "悲观")),
        ("Base", ("base", "基准")),
        ("Bull", ("bull", "乐观")),
        ("Evidence / Calculation", ("evidence", "calculation", "证据", "计算")),
        ("As of", ("as of", "截至")),
        ("Rationale", ("rationale", "理由", "依据")),
        ("Scenario Link", ("scenario link", "情景关联")),
    ],
    "operating-sensitivity": [
        ("Operating Variable", ("operating variable", "经营变量")),
        ("Bear", ("bear", "悲观")),
        ("Base", ("base", "基准")),
        ("Bull", ("bull", "乐观")),
        ("Value Impact", ("value impact", "价值影响")),
        ("Thesis Link", ("thesis link", "thesis 关联")),
    ],
    "valuation-reconciliation": [
        ("Method", ("method", "方法")),
        ("Value Basis", ("value basis", "价值口径")),
        ("EV / Equity Value", ("ev", "equity value", "企业价值", "股权价值")),
        ("Cash / Investments", ("cash", "investments", "现金", "投资")),
        ("Debt / Other Claims", ("debt", "other claims", "债务", "其他索取权")),
        ("Minority Interest", ("minority", "少数股东")),
        ("SBC / Dilution Treatment", ("sbc", "dilution", "稀释")),
        ("Diluted Shares", ("diluted shares", "摊薄股数")),
        ("FX", ("fx", "汇率")),
        ("Value / Share", ("value / share", "value share", "每股价值")),
        ("Reconciliation Note", ("reconciliation", "对账")),
    ],
    "decision-loop": [
        ("Metric", ("metric", "指标")),
        ("Current / As of", ("current", "as of", "当前")),
        ("Source", ("source", "来源")),
        ("Next Update", ("next update", "下次更新")),
        ("Bull Threshold", ("bull threshold", "多头阈值")),
        ("Bear Threshold", ("bear threshold", "空头阈值")),
        ("Thesis Impact", ("thesis impact", "thesis 影响")),
        ("Valuation Impact", ("valuation impact", "估值影响")),
        ("Research Action", ("research action", "action", "研究行动")),
    ],
    "thesis-breakers": [
        ("Breaker", ("breaker", "破坏条件")),
        ("Trigger", ("trigger", "触发")),
        ("Confirmation", ("confirmation", "确认窗口")),
        ("Thesis Impact", ("thesis impact", "thesis 影响")),
        ("Scenario Impact", ("scenario probability impact", "scenario impact", "情景影响")),
        ("Valuation Impact", ("valuation impact", "估值影响")),
        ("Research Action", ("research action", "action", "研究行动")),
    ],
    "scorecard": [
        ("Dimension", ("dimension", "维度")),
        ("Score", ("score", "评分")),
        ("Weight", ("weight", "权重")),
        ("Evidence IDs", ("evidence ids", "证据 id")),
        ("Counter-Evidence IDs", ("counter evidence ids", "counter-evidence ids", "反证 id")),
        ("Thesis IDs", ("thesis ids", "thesis id", "主张 id")),
        ("Confidence", ("confidence", "置信度")),
        ("Rationale / Gap", ("rationale", "gap", "理由", "缺口")),
    ],
    "dcf-forecast": [
        ("Year", ("year", "年份")),
        ("Revenue", ("revenue", "收入")),
        ("Growth", ("growth", "增长")),
        ("Margin", ("margin", "利润率")),
        ("Profit", ("ebit", "net income", "profit", "利润")),
        ("D&A", ("d&a", "depreciation", "折旧摊销")),
        ("Capex", ("capex", "capital expenditure", "资本开支")),
        ("ΔNWC", ("nwc", "working capital", "营运资本")),
        ("Net Borrowing", ("net borrowing", "净借款")),
        ("Cash Flow", ("fcff", "fcfe", "现金流")),
        ("Discount Factor", ("discount factor", "折现因子")),
        ("PV", ("pv", "present value", "现值")),
    ],
}


def _header_has(headers: Iterable[str], aliases: Iterable[str]) -> bool:
    normalized = [_norm(header) for header in headers]
    for alias in aliases:
        exact = alias.startswith("=")
        normalized_alias = _norm(alias[1:] if exact else alias)
        if any(
            header == normalized_alias if exact else normalized_alias in header
            for header in normalized
        ):
            return True
    return False


def _table_check_from_headers(headers: list[str]) -> set[str]:
    checks: set[str] = set()
    for check, groups in TABLE_REQUIREMENTS.items():
        if sum(_header_has(headers, aliases) for _, aliases in groups) >= max(3, len(groups) - 1):
            checks.add(check)
    if all(_header_has(headers, aliases) for aliases in (("=year",), ("revenue",), ("growth",), ("margin",), ("fcff", "fcfe", "cash flow"), ("discount factor",), ("=pv",))):
        checks.add("dcf-forecast")
    if all(_header_has(headers, aliases) for aliases in (("assumption id",), ("=assumption",), ("=value",), ("evidence ids",))):
        checks.add("valuation-assumptions")
    return checks


class MarkdownDocument:
    def __init__(self, text: str) -> None:
        self.raw_text = text
        self.text = _clean(text)
        self.headings = [
            _clean(match.group(1))
            for match in re.finditer(r"(?m)^#{1,6}\s+(.+?)\s*$", text)
        ]
        searchable = _norm(" ".join(self.headings) + " " + self.text)
        self.checks = {
            check
            for check, aliases in REQUIRED_CHECKS.items()
            if any(_norm(alias) in searchable for alias in aliases)
        }
        for check, aliases in {
            "thesis-evidence-matrix": ("thesis evidence matrix", "证据矩阵"),
            "metric-continuity": ("metric definition continuity", "口径连续性"),
            "mda-delta": ("md&a delta", "delta analysis"),
            "promise-tracker": ("management promise tracker", "承诺追踪"),
            "industry-triangulation": ("industry evidence triangulation", "独立行业验证"),
            "financial-history-annual": ("3–5 年趋势", "annual history"),
            "financial-history-quarterly": ("4–8 季度趋势", "quarterly history"),
            "valuation-assumptions": ("valuation assumption ledger", "估值假设台账"),
            "reverse-dcf": ("reverse dcf", "市场隐含预期"),
            "reverse-valuation": ("reverse valuation", "反向估值"),
            "operating-sensitivity": ("operating sensitivity", "经营敏感性"),
            "valuation-reconciliation": ("valuation reconciliation", "估值对账"),
            "irr-analysis": ("probability-weighted irr", "概率加权 irr"),
            "thesis-breakers": ("thesis breakers",),
            "margin-of-safety": ("margin of safety", "安全边际"),
        }.items():
            if any(_norm(alias) in searchable for alias in aliases):
                self.checks.add(check)
        self.evidence_labels = {
            label
            for label in ("fact", "management-view", "market-view", "calculation", "inference")
            if re.search(label.replace("-", r"[\s-]+"), self.text, re.I)
        }
        self.evidence_blocks: list[dict[str, object]] = []
        self.ids = set(re.findall(r"<a\s+(?:name|id)=[\"']([^\"']+)", text, re.I))
        self.fragment_links = re.findall(r"\[[^\]]+\]\(#([^)]+)\)", text)
        self.id_chunks: dict[str, list[str]] = defaultdict(list)
        self.market_as_of_values = DATE_RE.findall(text)
        self.tables = self._parse_tables(text)
        for table in self.tables:
            table.checks.update(_table_check_from_headers(table.headers))
            self.checks.update(table.checks)

    def _parse_tables(self, text: str) -> list[Table]:
        lines = text.splitlines()
        tables: list[Table] = []
        index = 0
        while index + 1 < len(lines):
            if lines[index].lstrip().startswith("|") and re.match(
                r"^\s*\|?\s*:?-{3,}", lines[index + 1]
            ):
                block = [lines[index]]
                index += 2
                while index < len(lines) and lines[index].lstrip().startswith("|"):
                    block.append(lines[index])
                    index += 1
                rows = []
                for line in block:
                    values = [part.strip() for part in line.strip().strip("|").split("|")]
                    rows.append([Cell(re.sub(r"\[[^\]]+\]\((#[^)]+)\)", "", value).strip(),
                                           re.findall(r"\[[^\]]+\]\((#[^)]+)\)", value))
                                 for value in values])
                tables.append(Table(rows=rows))
                continue
            index += 1
        return tables

    def block_text(self, check: str) -> str:
        return self.text if check in self.checks else ""


def parse_report(text: str, suffix: str):
    if suffix.lower() in {".html", ".htm"}:
        parser = ReportHTMLParser()
        parser.feed(text)
        parser.close()
        return parser, "html"
    if suffix.lower() in {".md", ".markdown"}:
        return MarkdownDocument(text), "markdown"
    raise ValueError("仅支持 .html、.htm、.md 或 .markdown 报告")


def _find_table(document, check: str) -> Optional[Table]:
    for table in document.tables:
        if check in table.checks:
            return table
    return None


def _column_index(headers: list[str], aliases: Iterable[str]) -> Optional[int]:
    normalized = [_norm(header) for header in headers]
    for alias in aliases:
        exact = alias.startswith("=")
        normalized_alias = _norm(alias[1:] if exact else alias)
        for index, header in enumerate(normalized):
            if header == normalized_alias if exact else normalized_alias in header:
                return index
    return None


def _rows_after_header(table: Table) -> list[list[Cell]]:
    return [row for row in table.rows[1:] if any(cell.text.strip() for cell in row)]


def _add(issues: list[Issue], severity: str, code: str, message: str, blocking: bool = True) -> None:
    issues.append(Issue(severity, code, message, blocking))


MODE_POLICIES = MappingProxyType({
    "standard": MappingProxyType({"thesis-evidence-matrix": (3, 4), "metric-continuity": (5, 6),
        "mda-delta": (3, 5), "promise-tracker": (1, 3), "decision-loop": (5, 7), "dcf_years": 5}),
    "audit": MappingProxyType({"thesis-evidence-matrix": (1, None), "metric-continuity": (1, None),
        "mda-delta": (1, None), "promise-tracker": (1, None), "decision-loop": (1, None), "dcf_years": 3}),
})
SOURCE_ROLES = {"company-primary", "competitor-primary", "independent-industry", "market-data", "secondary"}


def _mode_and_provenance(document, fmt, text, issues, legacy, source, valuation):
    if legacy:
        return "audit"
    if fmt == "markdown":
        modes = re.findall(r"(?im)^\s*Mode:\s*(\S+)\s*$", text)
        mode = modes[0].lower() if len(modes) == 1 else ""
    else:
        p, m = document.provenance, document.metadata
        mode = p.get("data-report-mode", "")
        for value in (p.get("data-report-version", ""), m.get("er-schema-version", "")):
            if value != "1.2":
                _add(issues, "error", "REPORT_VERSION_INVALID" if value else "REPORT_VERSION_MISSING", "需要 V1.2 报告版本。")
        for value, expected in ((m.get("generator", ""), "equity-research-skill-v1-2/render_report.py"),
                (p.get("data-generated-by", ""), "render_report.py"),
                (p.get("data-renderer-version", ""), "1.2.0"), (m.get("er-renderer-version", ""), "1.2.0"),
                (p.get("data-template-version", ""), "1.2")):
            if value != expected:
                _add(issues, "error", "RENDERER_PROVENANCE_MISMATCH" if value else "RENDERER_PROVENANCE_MISSING", f"生成器标记应为 {expected}。")
        missing = []
        for label, payload, schema in (("content", source, "1.2"), ("valuation", valuation, "valuation.v1")):
            body_hash, meta_hash = p.get(f"data-{label}-sha256", ""), m.get(f"er-{label}-sha256", "")
            if not all(re.fullmatch(r"[0-9a-f]{64}", x) for x in (body_hash, meta_hash)):
                _add(issues, "error", "RENDERER_HASH_INVALID", f"{label} SHA-256 格式无效。")
            if body_hash != meta_hash:
                _add(issues, "error", "RENDERER_HASH_MISMATCH", f"{label} meta/body 摘要不一致。")
            if payload is None:
                missing.append(label)
                continue
            if not isinstance(payload, dict):
                _add(issues, "error", "RENDERER_INPUT_SCHEMA", f"{label} JSON 根必须是 object。")
                continue
            payload_meta = payload.get("meta", {})
            payload_mode = payload_meta.get("mode") if label == "content" and isinstance(payload_meta, dict) else payload.get("mode")
            if payload.get("schema_version") != schema or (label == "valuation" and payload.get("engine_version") != "1.2.0"):
                _add(issues, "error", "RENDERER_INPUT_SCHEMA", f"{label} schema/engine 版本无效。")
            if payload_mode not in ("standard", "audit") or payload_mode != mode:
                _add(issues, "error", "RENDERER_INPUT_MODE", f"{label} mode 与 HTML 不一致。")
            try:
                digest = hashlib.sha256(json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False).encode("utf-8")).hexdigest()
                if digest != body_hash:
                    _add(issues, "error", "RENDERER_HASH_MISMATCH", f"{label} 原始 JSON 摘要不一致。")
            except (TypeError, ValueError):
                _add(issues, "error", "RENDERER_INPUT_SCHEMA", f"{label} 不是有限有效 JSON。")
        if missing:
            _add(issues, "warning", "RENDERER_PROVENANCE_NOT_PROVEN", "未提供原始 " + ", ".join(missing) + " JSON；仅检查标记，不能证明生成过程。", False)
        elif not any(i.severity == "error" and i.code.startswith("RENDERER_") for i in issues):
            # Hashes alone cannot bind visible HTML. Deterministically re-render the
            # supplied inputs and compare the artifact before accepting provenance.
            try:
                from render_report import render_report
                expected_html = render_report(source, valuation, (Path(__file__).resolve().parents[1] / "assets/report-template.html").read_text(encoding="utf-8"))
                if expected_html != text:
                    _add(issues, "error", "RENDERER_ARTIFACT_MISMATCH", "HTML 与相同 JSON 的确定性重渲染结果不一致。")
            except (ValueError, OSError, TypeError) as exc:
                _add(issues, "error", "RENDERER_INPUT_SCHEMA", f"原始输入不能重渲染：{exc}")
    if mode not in ("standard", "audit"):
        _add(issues, "error", "REPORT_MODE_INVALID" if mode else "REPORT_MODE_MISSING", "报告须声明 Standard 或 Audit；不推断缺失 mode。")
    return mode


def _cell(table, row, aliases):
    index = _column_index(table.headers, aliases)
    return row[index] if index is not None and index < len(row) else Cell("")


def _has_statement(text, label):
    match = re.search(rf"(?:{label})\s*[:：]\s*([^;；]+)", text, re.I)
    return bool(match and len(_norm(match.group(1)).replace(" ", "")) >= 6)


def _na_exception(table, check, row, label):
    if check == "scorecard" and _cell(table, row, ("=score", "评分")).text.upper() == "N/A":
        return label in {"Evidence IDs", "Counter-Evidence IDs", "Thesis IDs"} and _has_statement(_cell(table, row, ("rationale", "gap")).text, "(?:evidence\\s+)?gap")
    if check == "promise-tracker" and _norm(_cell(table, row, ("status",)).text) == "not verifiable":
        assessment = _cell(table, row, ("assessment",)).text
        return label == "Evidence ID" and _has_statement(assessment, "coverage") and _has_statement(assessment, "gap")
    return False


def _mode_policy(document, mode, issues, legacy, template):
    if template or mode not in MODE_POLICIES:
        return
    codes = {"thesis-evidence-matrix": "THESIS", "metric-continuity": "CONTINUITY", "mda-delta": "MDA", "promise-tracker": "PROMISE", "decision-loop": "MONITORING"}
    for check, code in codes.items():
        table = _find_table(document, check)
        count = len(_rows_after_header(table)) if table else 0
        minimum, maximum = MODE_POLICIES[mode][check]
        if count < minimum:
            _add(issues, "error", f"{mode.upper()}_{code}_MIN", f"{check} 至少 {minimum} 行，实际 {count}。")
        if maximum is not None and count > maximum:
            _add(issues, "warning", f"STANDARD_{code}_BUDGET", f"{check} 超过 Standard {maximum} 行预算。")
    for check, code in (("scorecard", "SCORECARD_NA_GAP"), ("promise-tracker", "PROMISE_NOT_VERIFIABLE_GAP")):
        table = _find_table(document, check)
        if table:
            for row in _rows_after_header(table):
                special = (_cell(table, row, ("=score",)).text.upper() == "N/A") if check == "scorecard" else (_norm(_cell(table, row, ("status",)).text) == "not verifiable")
                if special and not _na_exception(table, check, row, "Evidence IDs" if check == "scorecard" else "Evidence ID"):
                    _add(issues, "error", code, f"{check} 特殊状态必须解释检索覆盖/证据缺口。")
    if legacy:
        return
    if hasattr(document, "source_roles"):
        roles = document.source_roles
        for source_id, declared in roles.items():
            if not declared <= SOURCE_ROLES:
                _add(issues, "error", "SOURCE_ROLE_INVALID", f"{source_id} 缺失或含无效来源角色。")
            if len(declared) != 1:
                _add(issues, "warning", "SOURCE_ROLE_CONFLICT", f"{source_id} 多重角色需要人工判断。", False)
        industry = _find_table(document, "industry-triangulation")
        for role, aliases in (("competitor-primary", ("competitor evidence",)), ("independent-industry", ("independent industry",))):
            count = sum(role in values for values in roles.values())
            insufficient = bool(industry and any(
                re.search(r"insufficient evidence|证据不足|not available", _cell(industry, row, aliases).text, re.I)
                and len(_norm(_cell(industry, row, ("=gap",)).text)) >= 6
                and _norm(_cell(industry, row, ("confidence",)).text) == "low"
                for row in _rows_after_header(industry)))
            if mode == "standard" and not count:
                if insufficient:
                    _add(issues, "warning", "INDEPENDENT_EVIDENCE_INSUFFICIENT", f"{role} 证据不足，已记录低置信度和缺口。", False)
                else:
                    _add(issues, "error", "INDEPENDENT_EVIDENCE_MISSING", f"缺少 {role} 或明确的证据不足/Gap/Low 路径。")
            if mode == "standard" and role == "competitor-primary" and count > 2:
                _add(issues, "warning", "STANDARD_COMPETITOR_SOURCE_BUDGET", "同行来源超过 Standard 1–2 个预算。")
        _add(issues, "warning", "SOURCE_INDEPENDENCE_MANUAL_REVIEW", "仅检查声明的来源角色；真实独立性、质量与证据充分性需要人工复核。", False)
    _add(issues, "warning", "RESEARCH_LOGIC_MANUAL_REVIEW", "结构通过不代表论证正确；假设合理性、重大冲突、停止条件和投资判断仍需人工复核。", False)
    spans = []
    for check in ("executive-summary", "thesis-bear-case", "scorecard", "conclusion-validation"):
        chunks = document.check_chunks.get(check, []) if hasattr(document, "check_chunks") else []
        for chunk in chunks:
            normalized = _norm(chunk)
            if len(normalized) >= 120:
                spans.append((check, normalized))
    if any(a != b and x == y for i, (a, x) in enumerate(spans) for b, y in spans[i+1:]):
        _add(issues, "warning", "POSSIBLE_DUPLICATE_ANALYSIS", "摘要/Thesis/Scorecard/结论存在较长的完全重复文字，请复核。", False)


def audit_report(
    text: str,
    suffix: str,
    template: bool = False,
    expected_as_of: Optional[str] = None,
    allow_markdown: bool = False,
    legacy_v11: bool = False,
    source_json: Optional[dict] = None,
    valuation_json: Optional[dict] = None,
) -> tuple[list[Issue], str]:
    document, report_format = parse_report(text, suffix)
    issues: list[Issue] = []
    mode = _mode_and_provenance(document, report_format, text, issues, legacy_v11, source_json, valuation_json)
    _mode_policy(document, mode, issues, legacy_v11, template)

    if report_format == "markdown" and not allow_markdown:
        _add(
            issues,
            "warning",
            "FORMAT_MARKDOWN",
            "完整报告默认应交付 self-contained HTML；仅在用户明确要求 Markdown 时保留此格式。",
        )

    for check, aliases in REQUIRED_CHECKS.items():
        if check not in document.checks:
            _add(issues, "error", f"SECTION_{check.upper().replace('-', '_')}",
                 f"缺少必备模块：{aliases[0]}")

    if not template:
        placeholders = sorted(set(PLACEHOLDER_RE.findall(text)))
        if placeholders:
            preview = ", ".join(placeholders[:5])
            extra = f" 等 {len(placeholders)} 项" if len(placeholders) > 5 else ""
            _add(issues, "error", "UNRESOLVED_PLACEHOLDER", f"存在未替换占位符：{preview}{extra}")
        as_of_values = AS_OF_RE.findall(document.text)
        if not as_of_values:
            _add(issues, "error", "AS_OF_MISSING", "未找到真实的 As of YYYY-MM-DD 日期。")
        for value in sorted(set(as_of_values)):
            if not _valid_iso_date(value):
                _add(issues, "error", "AS_OF_INVALID", f"As of 日期不是有效日历日期：{value}")
            elif expected_as_of and _valid_iso_date(expected_as_of) and value > expected_as_of:
                _add(issues, "error", "AS_OF_AFTER_CUTOFF",
                     f"文本 As of 日期 {value} 晚于研究截止日 {expected_as_of}。")
        for value in sorted(set(ISO_LIKE_RE.findall(document.text))):
            if not _valid_iso_date(value):
                _add(issues, "error", "DATE_INVALID", f"报告含无效日历日期：{value}")
        if expected_as_of:
            if not _valid_iso_date(expected_as_of):
                _add(issues, "error", "EXPECTED_AS_OF_INVALID",
                     f"指定的研究截止日无效：{expected_as_of}")
            elif expected_as_of not in as_of_values:
                _add(issues, "error", "AS_OF_MISMATCH",
                     f"报告级 As of 日期未与指定研究截止日 {expected_as_of} 对齐。")

    required_labels = {
        "fact": "Fact",
        "management-view": "Management View",
        "market-view": "Market View",
        "calculation": "Calculation",
        "inference": "Inference",
    }
    for key, label in required_labels.items():
        if key not in document.evidence_labels:
            _add(issues, "error", f"EVIDENCE_{key.upper().replace('-', '_')}",
                 f"正文未找到证据标签：{label}")

    for check, groups in TABLE_REQUIREMENTS.items():
        if check == "dcf-forecast":
            continue
        if not legacy_v11:
            if check == "operating-sensitivity" and mode == "standard":
                continue
            if check == "valuation-assumptions" and mode == "standard":
                groups = [("Assumption ID", ("assumption id",)), ("Assumption", ("=assumption", "=parameter")), ("Value", ("=value", "=base")), ("Evidence IDs", ("evidence ids", "evidence calculation"))]
            elif check == "valuation-reconciliation" and report_format == "html":
                table = _find_table(document, check)
                if table and _header_has(table.headers, ("bridge item",)):
                    groups = [("Bridge Item", ("bridge item",)), ("Value", ("=value",))]
                else:
                    groups = [("Primary Method", ("primary method",)), ("Primary Value", ("primary value",)), ("Minimum", ("minimum",)), ("Maximum", ("maximum",)), ("Spread", ("spread",)), ("Note", ("note",))]
            elif report_format == "html":
                # V1.2 renderer uses compact, semantically identical labels.
                aliases_extra = {"What Needs Validation": ("needs validation",), "Comparability Status": ("comparability",),
                    "Management Promise": ("=promise",), "Evidence ID": ("source ids",), "Evidence IDs": ("source ids",),
                    "Thesis Impact": ("thesis ids",)}
                groups = [(label, aliases + aliases_extra.get(label, ())) for label, aliases in groups]
        table = _find_table(document, check)
        if table is None:
            _add(issues, "error", f"TABLE_{check.upper().replace('-', '_')}",
                 f"未找到结构化表格：{check}")
            continue
        for label, aliases in groups:
            if not _header_has(table.headers, aliases):
                _add(issues, "error", f"COLUMN_{check.upper().replace('-', '_')}",
                     f"{check} 缺少列：{label}")
        if not template:
            rows = _rows_after_header(table)
            if not rows:
                _add(issues, "error", "TABLE_EMPTY", f"结构化表格没有数据行：{check}")
            for row_number, row in enumerate(rows, start=1):
                for label, aliases in groups:
                    index = _column_index(table.headers, aliases)
                    if index is not None and (index >= len(row) or not row[index].text.strip()):
                        if not legacy_v11 and _na_exception(table, check, row, label):
                            continue
                        _add(issues, "error", "TABLE_EMPTY_CELL",
                             f"{check} 第 {row_number} 行缺少必填值：{label}")

    for check in (
        "thesis-evidence-matrix", "metric-continuity", "mda-delta",
        "promise-tracker", "industry-triangulation", "financial-history-annual",
        "financial-history-quarterly", "valuation-assumptions", "reverse-dcf",
        "operating-sensitivity", "valuation-reconciliation", "irr-analysis", "thesis-breakers",
        "margin-of-safety",
    ):
        if not legacy_v11 and (check == "reverse-dcf" or (mode == "standard" and check == "operating-sensitivity")):
            continue
        if check not in document.checks:
            _add(issues, "error", f"DISCIPLINE_{check.upper().replace('-', '_')}",
                 f"缺少研究纪律模块：{check}")

    scenario_text = document.block_text("scenario-analysis")
    for label, aliases in {
        "Bear": ("bear", "悲观"),
        "Base": ("base", "基准"),
        "Bull": ("bull", "乐观"),
        "Probability": ("probability", "概率"),
        "Operating assumptions": ("operating assumptions", "经营假设"),
        "Valuation assumptions": ("valuation assumptions", "估值假设"),
        "Holding period": ("holding period", "持有期"),
        "Dividends": ("dividends", "股息", "分红"),
        "Expected return": ("expected return", "预期回报"),
        "IRR": ("irr",),
        "Expected Value": ("expected value", "期望价值"),
        "Base IRR": ("base irr", "基准 irr"),
        "Probability-weighted IRR": ("probability weighted irr", "概率加权 irr"),
        "Trigger / Falsifier": ("trigger", "falsifier", "触发", "证伪"),
    }.items():
        if scenario_text and not any(_norm(alias) in _norm(scenario_text) for alias in aliases):
            _add(issues, "error", "SCENARIO_FIELD_MISSING", f"Bear/Base/Bull 缺少字段：{label}")

    if not template:
        irr_text = document.block_text("irr-analysis")
        if report_format == "html":
            irr_values = {
                "Base IRR": document.irr_values.get("base", ""),
                "Probability-weighted IRR": document.irr_values.get("probability-weighted", ""),
            }
            irr_method = document.irr_method
            terminal_value = document.irr_inputs.get("terminal-value", "")
            dividend_cash_flows = document.irr_inputs.get("dividend-cash-flows", "")
            for block in document.irr_value_blocks + document.irr_input_blocks:
                visible = _clean(" ".join(block["chunks"]))  # type: ignore[arg-type]
                same = visible == str(block["value"])
                if not legacy_v11:
                    try:
                        number = float(block["value"])
                        same = visible == (f"{number * 100:.2f}%" if block in document.irr_value_blocks else f"{number:,.4f}".rstrip("0").rstrip("."))
                        if block in document.irr_value_blocks:
                            irr_values["Base IRR" if block["key"] == "base" else "Probability-weighted IRR"] = visible
                    except (ValueError, TypeError):
                        pass
                if not same:
                    _add(issues, "error", "IRR_VISIBLE_MISMATCH",
                         f"IRR 字段 {block['key']} 的机器值与读者可见值不一致。")
            for block in document.irr_method_blocks:
                visible = _clean(" ".join(block["chunks"]))  # type: ignore[arg-type]
                value = str(block["value"])
                if value not in visible:
                    _add(issues, "error", "IRR_VISIBLE_MISMATCH",
                         "IRR 计算方法的机器值未显示给读者。")
        else:
            irr_values = {}
            for label, pattern in (
                ("Base IRR", r"(?:base\s+irr|基准\s*irr)\s*[:：]\s*(-?\d+(?:\.\d+)?\s*%)"),
                ("Probability-weighted IRR",
                 r"(?:probability[\s-]+weighted\s+irr|概率加权\s*irr)\s*[:：]\s*(-?\d+(?:\.\d+)?\s*%)"),
            ):
                match = re.search(pattern, irr_text, re.I)
                irr_values[label] = match.group(1) if match else ""
            irr_method = irr_text
            terminal_match = re.search(
                r"(?:probability[\s-]+weighted\s+terminal\s+value|概率加权期末价值)\s*[:：]\s*([^;；|｜。]+)",
                irr_text, re.I,
            )
            terminal_value = terminal_match.group(1).strip() if terminal_match else ""
            dividend_match = re.search(
                r"(?:dividend\s+cash\s+flows|股息现金流)\s*[:：]\s*([^;；|｜。]+)", irr_text, re.I
            )
            dividend_cash_flows = dividend_match.group(1).strip() if dividend_match else ""
        for label, value in irr_values.items():
            if not re.fullmatch(r"-?\d+(?:\.\d+)?\s*%", value.strip()):
                _add(issues, "error", "IRR_VALUE_MISSING", f"{label} 必须显示可解析的百分比数值。")
        for label, aliases in {
            "Formula / method": ("formula / method", "formula method", "计算方法") + (() if legacy_v11 else ("irr method",)),
            "Probability-weighted terminal value": ("probability weighted terminal value", "概率加权期末价值"),
            "Dividend cash flows": ("dividend cash flows", "股息现金流"),
        }.items():
            if not any(_norm(alias) in _norm(irr_text) for alias in aliases):
                _add(issues, "error", "IRR_INPUT_MISSING", f"Probability-weighted IRR 缺少：{label}")
        if not re.search(r"\birr\s*\(|\bxirr\s*\(|\bnpv\b|加权现金流|weighted\s+cash\s+flow", irr_method, re.I):
            _add(issues, "error", "IRR_METHOD_MISSING",
                 "Probability-weighted IRR 必须说明使用概率加权现金流重新求 IRR 的方法。")
        if not re.search(r"\d", terminal_value):
            _add(issues, "error", "IRR_INPUT_VALUE_MISSING",
                 "Probability-weighted terminal value 必须显示数值。")
        if not re.search(r"\d|\bnone\b|无股息", dividend_cash_flows, re.I):
            _add(issues, "error", "IRR_INPUT_VALUE_MISSING",
                 "Dividend cash flows 必须显示数值，或明确写 None / 无股息。")

    safety_text = document.block_text("margin-of-safety")
    for label, aliases in {
        "Fair Value": ("fair value",),
        "Attractive Price": ("attractive price",),
        "High-Conviction Price": ("high conviction price", "high-conviction price"),
        "Rationale": ("rationale", "理由", "依据"),
    }.items():
        if safety_text and not any(_norm(alias) in _norm(safety_text) for alias in aliases):
            _add(issues, "error", "MARGIN_OF_SAFETY_FIELD", f"Margin of Safety 缺少：{label}")

    if report_format == "html":
        if not document.doctype:
            _add(issues, "warning", "HTML_DOCTYPE", "HTML 未声明 <!doctype html>。")
        if not document.meta_charset:
            _add(issues, "error", "HTML_CHARSET", "HTML 缺少 charset 声明。")
        if not document.has_style:
            _add(issues, "error", "HTML_INLINE_STYLE", "HTML 缺少内嵌 <style>。")
        if not document.viewport:
            _add(issues, "warning", "HTML_VIEWPORT", "HTML 缺少 viewport，移动端阅读可能受影响。")
        if not document.html_lang:
            _add(issues, "warning", "HTML_LANG", "HTML 缺少 lang 属性。")
        combined_css = "\n".join(document.styles)
        if "@media print" not in combined_css.lower():
            _add(issues, "warning", "HTML_PRINT_CSS", "HTML 未找到 @media print。")
        if re.search(r"@import\s", combined_css, re.I):
            _add(issues, "error", "HTML_CSS_IMPORT", "CSS 使用 @import，不满足 self-contained 要求。")
        for match in re.finditer(r"url\(([^)]+)\)", combined_css, re.I):
            value = match.group(1).strip(" \t\r\n\"'")
            if value and not _is_data_uri(value) and not value.startswith("#"):
                document.resource_refs.append(f"CSS url({value})")
        for resource in document.resource_refs:
            _add(issues, "error", "HTML_EXTERNAL_RESOURCE",
                 f"发现外部或本地资源依赖：{resource}")

        for target in sorted(set(document.fragment_links)):
            if target and target not in document.ids:
                _add(issues, "error", "BROKEN_FRAGMENT", f"内部链接没有对应目标：#{target}")

        for element_id, count in sorted(document.id_counts.items()):
            if count > 1:
                _add(issues, "error", "DUPLICATE_ID",
                     f"HTML id 必须唯一：#{element_id} 出现 {count} 次。")

        if not template:
            if not document.report_as_of or not _valid_iso_date(document.report_as_of):
                _add(issues, "error", "REPORT_AS_OF_MISSING",
                     "HTML 缺少有效的 data-report-as-of 报告级研究截止日。")
            elif expected_as_of and document.report_as_of != expected_as_of:
                _add(issues, "error", "REPORT_AS_OF_MISMATCH",
                     f"报告级研究截止日 {document.report_as_of} 与指定日期 {expected_as_of} 不一致。")
            if len(document.report_cutoff_blocks) < 3:
                _add(issues, "error", "REPORT_AS_OF_VISIBLE",
                     "页眉、研究范围与页脚都必须显示绑定的报告级研究截止日。")
            for block in document.report_cutoff_blocks:
                value = str(block["value"])
                visible = _clean(" ".join(block["chunks"]))  # type: ignore[arg-type]
                if value != document.report_as_of or visible != value:
                    _add(issues, "error", "REPORT_AS_OF_VISIBLE",
                         "报告级研究截止日的机器值与读者可见值不一致。")
            for value in document.market_as_of_values:
                value = value.strip()
                if not DATE_RE.fullmatch(value) or not _valid_iso_date(value):
                    _add(issues, "error", "MARKET_AS_OF_INVALID",
                         f"市场敏感数据缺少有效 data-as-of：{value or '(empty)'}")
                elif expected_as_of and _valid_iso_date(expected_as_of) and value > expected_as_of:
                    _add(issues, "error", "MARKET_AS_OF_AFTER_CUTOFF",
                         f"市场敏感数据日期 {value} 晚于研究截止日 {expected_as_of}。")
            source_ids = sorted(value for value in document.ids if re.fullmatch(r"S\d+", value, re.I))
            if not source_ids:
                _add(issues, "error", "SOURCE_IDS_MISSING", "未找到 S01 形式的来源锚点。")
            referenced_source_ids = {
                value for value in document.fragment_links if re.fullmatch(r"S\d+", value, re.I)
            }
            for source_id in source_ids:
                source_text = _clean(" ".join(document.id_chunks.get(source_id, [])))
                source_entry = document.source_entries.get(source_id, {})
                if not source_text or len(_norm(re.sub(rf"\b{re.escape(source_id)}\b", "", source_text, flags=re.I))) < 8:
                    _add(issues, "error", "SOURCE_ENTRY_EMPTY", f"{source_id} 来源条目没有实质内容。")
                if source_entry.get("in_sources") != "true":
                    _add(issues, "error", "SOURCE_OUTSIDE_SECTION",
                         f"{source_id} 必须位于 data-check=\"sources\" 的来源模块内。")
                required_source_fields = {
                    "document": "Document",
                    "publication_date": "Publication date",
                    "reporting_period": "Reporting period",
                    "locator": "Page / Section / Item / Table",
                    "url": "URL / local file",
                    "access_date": "Access date",
                }
                for field_name, label in required_source_fields.items():
                    if not source_entry.get(field_name, "").strip():
                        _add(issues, "error", "SOURCE_FIELD_MISSING",
                             f"{source_id} 缺少结构化来源字段：{label}")
                for field_name, label in (
                    ("publication_date", "Publication date"),
                    ("access_date", "Access date"),
                ):
                    value = source_entry.get(field_name, "")
                    if value and not _valid_iso_date(value):
                        _add(issues, "error", "SOURCE_DATE_INVALID",
                             f"{source_id} 的 {label} 不是有效日期：{value}")
                    elif value and expected_as_of and _valid_iso_date(expected_as_of) and value > expected_as_of:
                        _add(issues, "error", "SOURCE_DATE_AFTER_CUTOFF",
                             f"{source_id} 的 {label} {value} 晚于研究截止日 {expected_as_of}。")
                locator = source_entry.get("locator", "")
                if locator and not LOCATOR_RE.search(locator):
                    _add(issues, "warning", "SOURCE_LOCATOR",
                         f"{source_id} 缺少 Page / Section / Item / Table 等精确定位。")
                if source_entry.get("url") and source_entry.get("url") not in document.id_links.get(source_id, []):
                    _add(issues, "error", "SOURCE_LINK_MISSING",
                         f"{source_id} 的可点击链接与 data-source-url 不一致。")
                visible_fields = {
                    (str(block["source_id"]), str(block["field"])): block
                    for block in document.source_field_blocks
                }
                for field_name, visible_name in {
                    "document": "document",
                    "publication_date": "publication-date",
                    "reporting_period": "reporting-period",
                    "locator": "locator",
                    "url": "url",
                    "access_date": "access-date",
                }.items():
                    block = visible_fields.get((source_id, visible_name))
                    if block is None:
                        _add(issues, "error", "SOURCE_VISIBLE_FIELD_MISSING",
                             f"{source_id} 缺少可见来源字段：{visible_name}")
                        continue
                    visible = _clean(" ".join(block["chunks"]))  # type: ignore[arg-type]
                    expected = source_entry.get(field_name, "")
                    if visible != expected:
                        _add(issues, "error", "SOURCE_VISIBLE_MISMATCH",
                             f"{source_id} 的 {visible_name} 机器值与读者可见值不一致。")
                    if field_name == "url" and str(block["href"]) != expected:
                        _add(issues, "error", "SOURCE_VISIBLE_MISMATCH",
                             f"{source_id} 的 URL 显示值、href 与机器值不一致。")
            for source_id in sorted(referenced_source_ids):
                if source_id not in document.source_entries:
                    _add(issues, "error", "SOURCE_TARGET_INVALID",
                         f"被引用的 {source_id} 不是 Sources 模块中的结构化来源条目。")

            for block in document.evidence_blocks:
                label = str(block["label"])
                block_text = _clean(" ".join(block["chunks"]))  # type: ignore[arg-type]
                links = [str(link) for link in block["links"]]  # type: ignore[arg-type]
                substantive_text = re.sub(
                    r"\b(?:fact|management\s+view|market\s+view|calculation|inference|"
                    r"confidence|high|medium|low|S\d+)\b",
                    " ", block_text, flags=re.I,
                )
                if len(_norm(substantive_text).replace(" ", "")) < 6:
                    _add(issues, "error", "EVIDENCE_EMPTY",
                         f"{label} 正文区块只有标签或链接，没有实质陈述。")
                if not any(re.fullmatch(r"#S\d+", link, re.I) for link in links):
                    _add(issues, "error", "EVIDENCE_LINK",
                         f"{label} 正文区块缺少指向 S01 形式来源的内部链接。")
                if label == "fact" and re.search(
                    r"因此|意味着|可能|推算|预计|预期|implies?|likely|derived", block_text, re.I
                ):
                    _add(issues, "warning", "FACT_MIXED_SENTENCE",
                         "Fact 区块含推断/指引措辞；请拆成 Fact 与 Calculation、Management View 或 Inference。", False)

    if report_format == "markdown" and not template:
        raw_text = document.raw_text
        cutoff_match = re.search(
            r"(?im)^\s*(?:研究截止|research\s+cutoff)\s*[:：]\s*(?:as\s+of\s+)?"
            r"(20\d{2}-\d{2}-\d{2})\s*$",
            raw_text,
        )
        if not cutoff_match or not _valid_iso_date(cutoff_match.group(1)):
            _add(issues, "error", "REPORT_AS_OF_MISSING",
                 "Markdown 必须单列 `研究截止：As of YYYY-MM-DD`。")
        elif expected_as_of and cutoff_match.group(1) != expected_as_of:
            _add(issues, "error", "REPORT_AS_OF_MISMATCH",
                 f"Markdown 报告级研究截止日 {cutoff_match.group(1)} 与指定日期 {expected_as_of} 不一致。")

        evidence_pattern = re.compile(
            r"(?im)^\s*\[(S\d+)\]\[(Fact|Management[\s-]+View|Market[\s-]+View|"
            r"Calculation|Inference)\]\s+(.+?)\s*$"
        )
        evidence_entries: list[tuple[str, str, str]] = [
            (match.group(1), _norm(match.group(2)).replace(" ", "-"), match.group(3).strip())
            for match in evidence_pattern.finditer(raw_text)
        ]
        for key, label in required_labels.items():
            matching = [entry for entry in evidence_entries if entry[1] == key]
            if not matching:
                _add(issues, "error", "MARKDOWN_EVIDENCE_ENTRY",
                     f"Markdown 正文缺少 `[S01][{label}] 实质陈述` 格式的证据条目。")
            for source_id, _, statement in matching:
                substantive = re.sub(r"\[[^\]]+\]\([^)]+\)", " ", statement)
                if len(_norm(substantive).replace(" ", "")) < 6:
                    _add(issues, "error", "EVIDENCE_EMPTY",
                         f"Markdown {label} 条目 {source_id} 没有实质陈述。")

        source_pattern = re.compile(r"(?im)^\s*\[(S\d+)\]\s+(.+?)\s*$")
        markdown_sources = {
            match.group(1): match.group(2).strip()
            for match in source_pattern.finditer(raw_text)
        }
        sources_heading = re.search(r"(?im)^#{1,6}\s+(?:来源|sources)\s*$", raw_text)
        if not markdown_sources:
            _add(issues, "error", "SOURCE_IDS_MISSING",
                 "Markdown Sources 模块缺少 `[S01] Document → ...` 来源条目。")
        for source_id, source_text in markdown_sources.items():
            line_match = re.search(
                rf"(?im)^\s*\[{re.escape(source_id)}\]\s+.+$", raw_text
            )
            if not sources_heading or (line_match and line_match.start() < sources_heading.start()):
                _add(issues, "error", "SOURCE_OUTSIDE_SECTION",
                     f"{source_id} 必须位于 Markdown Sources / 来源标题之后。")
            if source_id not in document.ids:
                _add(issues, "error", "SOURCE_TARGET_INVALID",
                     f"{source_id} 缺少 `<a id=\"{source_id}\"></a>` 内部链接目标。")
            dates = ISO_LIKE_RE.findall(source_text)
            if len(dates) < 2 or any(not _valid_iso_date(value) for value in dates):
                _add(issues, "error", "SOURCE_DATE_INVALID",
                     f"{source_id} 必须含有效 Publication date 与 Access date。")
            if expected_as_of and any(value > expected_as_of for value in dates if _valid_iso_date(value)):
                _add(issues, "error", "SOURCE_DATE_AFTER_CUTOFF",
                     f"{source_id} 含晚于研究截止日 {expected_as_of} 的来源日期。")
            if not re.search(r"(?:20\d{2}\s*Q[1-4]|FY\s*20\d{2}|20\d{2}年|\bN/A\b|不适用)", source_text, re.I):
                _add(issues, "error", "SOURCE_FIELD_MISSING",
                     f"{source_id} 缺少 Reporting period。")
            if not LOCATOR_RE.search(source_text):
                _add(issues, "warning", "SOURCE_LOCATOR",
                     f"{source_id} 缺少 Page / Section / Item / Table 等精确定位。")
            if not re.search(r"https?://|(?:^|\s)/(?:Users|Volumes|private)/", source_text, re.I):
                _add(issues, "error", "SOURCE_LINK_MISSING",
                     f"{source_id} 缺少 URL 或绝对 local file 路径。")
            if not re.search(r"accessed|访问日期", source_text, re.I):
                _add(issues, "error", "SOURCE_FIELD_MISSING",
                     f"{source_id} 缺少 Access date 标签。")

        referenced_source_ids = {
            source_id for source_id, _, _ in evidence_entries
        } | {
            value for value in document.fragment_links if re.fullmatch(r"S\d+", value, re.I)
        }
        for source_id in sorted(referenced_source_ids):
            if source_id not in markdown_sources:
                _add(issues, "error", "SOURCE_TARGET_INVALID",
                     f"被引用的 {source_id} 没有 Markdown 来源条目。")
        for target in sorted(set(document.fragment_links)):
            if target and target not in document.ids:
                _add(issues, "error", "BROKEN_FRAGMENT", f"内部链接没有对应目标：#{target}")

    if not template:
        continuity = _find_table(document, "metric-continuity")
        if continuity:
            status_index = _column_index(continuity.headers, ("comparability status", "可比性"))
            if not legacy_v11:
                status_index = _column_index(continuity.headers, ("comparability", "可比性"))
            allowed = ("comparable", "partially comparable", "not comparable")
            if status_index is not None:
                for row in _rows_after_header(continuity):
                    if status_index < len(row):
                        status = _norm(row[status_index].text)
                        if status and not any(value == status or status.startswith(value + " ") for value in allowed):
                            _add(issues, "error", "COMPARABILITY_STATUS",
                                 f"无效 Comparability Status：{row[status_index].text}")

        promise = _find_table(document, "promise-tracker")
        if promise:
            status_index = _column_index(promise.headers, ("status", "状态"))
            allowed = {
                "delivered", "partially delivered", "missed", "revised",
                "pending", "not verifiable",
            }
            if status_index is not None:
                for row in _rows_after_header(promise):
                    if status_index < len(row):
                        status = _norm(row[status_index].text)
                        if status and status not in allowed:
                            _add(issues, "error", "PROMISE_STATUS",
                                 f"无效 Promise Status：{row[status_index].text}")

        for check, minimum, label in (
            ("financial-history-annual", 3, "年度"),
            ("financial-history-quarterly", 4, "季度"),
        ):
            table = _find_table(document, check)
            if not table:
                continue
            period_index = _column_index(table.headers, ("period", "期间"))
            periods = {
                row[period_index].text.strip()
                for row in _rows_after_header(table)
                if period_index is not None and period_index < len(row) and row[period_index].text.strip()
            }
            block_text = document.block_text(check)
            has_insufficient = bool(re.search(
                r"evidence\s+insufficient|insufficient\s+evidence|证据不足", block_text, re.I
            ))
            has_coverage = bool(re.search(r"(?:coverage|覆盖)\s*[:：]\s*\S+", block_text, re.I))
            has_reason = bool(re.search(r"(?:reason|原因)\s*[:：]\s*\S+", block_text, re.I))
            limited_path = has_insufficient and has_coverage and has_reason
            if len(periods) < minimum and not limited_path:
                _add(issues, "error", "HISTORICAL_COVERAGE",
                     f"{label}历史仅有 {len(periods)} 个期间；至少需要 {minimum} 个，或同时说明 Coverage、Reason 与证据不足。")
            ordered_periods: list[int] = []
            for period in [
                row[period_index].text.strip()
                for row in _rows_after_header(table)
                if period_index is not None and period_index < len(row)
            ]:
                if check == "financial-history-annual":
                    match = re.fullmatch(r"(?:FY\s*)?(20\d{2})(?:A)?|(?:20\d{2})年", period, re.I)
                    if match:
                        year_match = re.search(r"20\d{2}", period)
                        ordered_periods.append(int(year_match.group()) if year_match else 0)
                else:
                    match = re.fullmatch(r"(20\d{2})\s*Q([1-4])|Q([1-4])\s*(20\d{2})", period, re.I)
                    if match:
                        if match.group(1):
                            ordered_periods.append(int(match.group(1)) * 4 + int(match.group(2)))
                        else:
                            ordered_periods.append(int(match.group(4)) * 4 + int(match.group(3)))
                if not match:
                    _add(issues, "error", "HISTORICAL_PERIOD_FORMAT",
                         f"{label}历史期间格式无效：{period}")
            if len(ordered_periods) > 1 and any(
                current <= previous for previous, current in zip(ordered_periods, ordered_periods[1:])
            ):
                _add(issues, "error", "HISTORICAL_PERIOD_ORDER",
                     f"{label}历史期间必须唯一并按时间升序排列。")

        traceability_rules = {
            "metric-continuity": (("Source", ("source", "来源"), "S"),),
            "financial-history-annual": (("Source", ("source", "来源"), "S"),),
            "financial-history-quarterly": (("Source", ("source", "来源"), "S"),),
            "mda-delta": (("Evidence IDs", ("evidence ids", "证据 id"), "S"),),
            "promise-tracker": (("Evidence ID", ("evidence id", "证据 id"), "S"),),
            "decision-loop": (
                ("Source", ("source", "来源"), "S"),
                ("Thesis Impact", ("thesis impact", "thesis 影响"), "T"),
            ),
            "thesis-breakers": (
                ("Thesis Impact", ("thesis impact", "thesis 影响"), "T"),
            ),
            "operating-sensitivity": (("Thesis Link", ("thesis link", "thesis 关联"), "T"),),
            "valuation-assumptions": (
                ("Evidence / Calculation", ("evidence", "calculation", "证据", "计算"), "S-or-calculation"),
                ("Scenario Link", ("scenario link", "情景关联"), "fragment"),
            ),
            "thesis-evidence-matrix": (
                ("Supporting Evidence", ("supporting evidence", "支持证据"), "S"),
                ("Counter Evidence", ("counter evidence", "counter-evidence", "反证"), "S"),
            ),
            "scorecard": (
                ("Evidence IDs", ("evidence ids", "证据 id"), "S"),
                ("Counter-Evidence IDs", ("counter evidence", "counter-evidence", "反证 id"), "S"),
                ("Thesis IDs", ("thesis ids", "thesis id", "主张 id"), "T"),
            ),
        }
        for check, rules in traceability_rules.items():
            table = _find_table(document, check)
            if not table:
                continue
            for column_name, aliases, target_kind in rules:
                if not legacy_v11:
                    if column_name == "Scenario Link" and mode == "standard":
                        continue
                    if column_name in ("Evidence ID", "Evidence IDs"):
                        aliases = aliases + ("source ids",)
                    if column_name == "Thesis Impact":
                        aliases = aliases + ("thesis ids",)
                index = _column_index(table.headers, aliases)
                if index is None:
                    continue
                for row_number, row in enumerate(_rows_after_header(table), start=1):
                    if not legacy_v11 and _na_exception(table, check, row, column_name):
                        continue
                    cell = row[index] if index < len(row) else Cell("")
                    if target_kind == "S-or-calculation":
                        valid = any(re.fullmatch(r"#S\d+", link, re.I) for link in cell.links)
                        valid = valid or bool(re.search(r"calculation|计算|公式", cell.text, re.I))
                    elif target_kind == "fragment":
                        valid = any(link.startswith("#") for link in cell.links)
                    else:
                        valid = any(re.fullmatch(rf"#{target_kind}\d+", link, re.I) for link in cell.links)
                    if not valid:
                        _add(issues, "error", "TRACEABILITY_LINK",
                             f"{check} 第 {row_number} 行的 {column_name} 缺少合格的内部追溯链接。")

        industry = _find_table(document, "industry-triangulation")
        if industry:
            for label, aliases, allow_insufficient in (
                ("Company Evidence", ("company evidence", "公司证据"), False),
                ("Competitor Evidence", ("competitor evidence", "竞争对手证据"), True),
                ("Independent Industry Data", ("independent industry", "独立行业"), True),
            ):
                index = _column_index(industry.headers, aliases)
                if index is None:
                    continue
                for row_number, row in enumerate(_rows_after_header(industry), start=1):
                    cell = row[index] if index < len(row) else Cell("")
                    has_source = any(re.fullmatch(r"#S\d+", link, re.I) for link in cell.links)
                    insufficient = allow_insufficient and bool(re.search(
                        r"unavailable|insufficient|not available|不可得|证据不足|暂无", cell.text, re.I
                    ))
                    if not (has_source or insufficient):
                        _add(issues, "error", "INDUSTRY_VALIDATION_LINK",
                             f"industry-triangulation 第 {row_number} 行的 {label} 缺少来源或 Insufficient Evidence 说明。")

        thesis_matrix = _find_table(document, "thesis-evidence-matrix")
        if thesis_matrix:
            thesis_id_index = _column_index(thesis_matrix.headers, ("thesis id", "主张 id"))
            if thesis_id_index is not None:
                for row_number, row in enumerate(_rows_after_header(thesis_matrix), start=1):
                    value = row[thesis_id_index].text.strip() if thesis_id_index < len(row) else ""
                    if not re.fullmatch(r"T\d+", value, re.I) or value not in document.ids:
                        _add(issues, "error", "THESIS_ID_TARGET",
                             f"Thesis Matrix 第 {row_number} 行的 Thesis ID 必须是可链接的 T01 形式锚点。")

        scorecard = _find_table(document, "scorecard")
        if scorecard:
            score_index = _column_index(scorecard.headers, ("score", "评分"))
            weight_index = _column_index(scorecard.headers, ("weight", "权重"))
            weights: list[float] = []
            for row in _rows_after_header(scorecard):
                if score_index is not None and score_index < len(row):
                    value = _clean(row[score_index].text)
                    if value.upper() != "N/A":
                        try:
                            score = float(value)
                            if not 1 <= score <= 5:
                                raise ValueError
                        except ValueError:
                            _add(issues, "error", "SCORECARD_SCORE",
                                 f"Scorecard 分数必须为 1–5 或 N/A：{value}")
                if weight_index is not None and weight_index < len(row):
                    match = re.search(r"-?\d+(?:\.\d+)?", row[weight_index].text)
                    if match:
                        weights.append(float(match.group()))
                    else:
                        _add(issues, "error", "SCORECARD_WEIGHT",
                             f"Scorecard 权重必须是百分比数值：{row[weight_index].text}")
            if weights and abs(sum(weights) - 100) > 0.5:
                _add(issues, "error", "SCORECARD_WEIGHT",
                     f"Scorecard 权重合计为 {sum(weights):g}%，应为 100%。")

        probabilities: list[float] = []
        for scenario in ("bear", "base", "bull"):
            match = re.search(
                rf"\b{scenario}\b(?:\s+case)?\s*(?:·|:|：|—|-)\s*(\d+(?:\.\d+)?)\s*%",
                scenario_text,
                re.I,
            )
            if not match:
                match = re.search(rf"\b{scenario}\b\s+(\d+(?:\.\d+)?)\s*%", scenario_text, re.I)
            if match:
                probabilities.append(float(match.group(1)))
        if len(probabilities) == 3 and abs(sum(probabilities) - 100) > 0.5:
            _add(issues, "error", "SCENARIO_PROBABILITY",
                 f"Bear/Base/Bull 概率合计为 {sum(probabilities):g}%，应为 100%。")
        elif scenario_text and len(probabilities) < 3:
            _add(issues, "warning", "SCENARIO_PROBABILITY_PARSE",
                 "无法解析全部 Bear/Base/Bull 概率；请使用清晰的百分比。")

    valuation_text = document.block_text("valuation-market-expectations")
    dcf_not_applicable = bool(re.search(r"DCF\s+(?:not\s+applicable|不适用)", valuation_text, re.I))
    forecast = _find_table(document, "dcf-forecast")
    if forecast:
        dcf_groups = TABLE_REQUIREMENTS["dcf-forecast"]
        if mode == "standard" and not legacy_v11:
            dcf_groups = [(label, aliases) for label, aliases in dcf_groups if label in {"Year", "Revenue", "Growth", "Margin", "Cash Flow", "Discount Factor", "PV"}]
        for label, aliases in dcf_groups:
            if not _header_has(forecast.headers, aliases):
                _add(issues, "error", "COLUMN_DCF_FORECAST", f"DCF forecast 缺少列：{label}")
        if "dcf-sensitivity" not in document.checks:
            _add(issues, "error", "DCF_SENSITIVITY_MISSING",
                 "完整 DCF 缺少 Discount Rate × Terminal Growth 敏感性。")
        if not template:
            forecast_rows = _rows_after_header(forecast)
            if not forecast_rows:
                _add(issues, "error", "TABLE_EMPTY", "DCF forecast 没有数据行。")
            for row_number, row in enumerate(forecast_rows, start=1):
                for label, aliases in dcf_groups:
                    index = _column_index(forecast.headers, aliases)
                    if index is not None and (index >= len(row) or not row[index].text.strip()):
                        _add(issues, "error", "TABLE_EMPTY_CELL",
                             f"dcf-forecast 第 {row_number} 行缺少必填值：{label}")
            years = [_cell(forecast, row, ("=year", "年份")).text for row in forecast_rows if _cell(forecast, row, ("=year", "年份")).text.strip()]
            minimum = 5 if mode == "standard" and not legacy_v11 else 3
            if len(years) < minimum:
                _add(issues, "error", "STANDARD_DCF_YEARS" if minimum == 5 else "DCF_YEARS", f"DCF 至少应明确展示 {minimum} 个逐年预测期。")
            if not legacy_v11 and mode == "standard" and len(years) > 5:
                if re.search(r"(?:forecast extension reason|预测期延长原因)\s*[:：]\s*\S+", document.text, re.I):
                    _add(issues, "warning", "STANDARD_DCF_EXTENSION_MANUAL_REVIEW", "预测期超过五年；请人工确认延长原因符合行业特性或用户要求。", False)
                else:
                    _add(issues, "error", "STANDARD_DCF_EXTENSION_REASON", "Standard 超过五年须显示 Forecast extension reason。")
            terminal_text = _norm(document.block_text("dcf-forecast") if legacy_v11 else document.block_text("valuation-market-expectations"))
            for label, aliases in {
                "Terminal Growth": ("terminal growth", "永续增长"),
                "Terminal Margin": ("terminal margin", "终值利润率"),
                "Terminal Value Share": ("terminal value", "终值占比"),
                "Terminal ROIC": ("terminal roic", "终值 roic") + (() if legacy_v11 else ("roic", "roe")),
                "Terminal Reinvestment": ("reinvestment", "再投资"),
            }.items():
                if not any(_norm(alias) in terminal_text for alias in aliases):
                    _add(issues, "error", "DCF_TERMINAL_FIELD", f"完整 DCF 缺少：{label}")
            sensitivity = _find_table(document, "dcf-sensitivity")
            if sensitivity and (len(sensitivity.headers) < 4 or len(_rows_after_header(sensitivity)) < 3):
                _add(issues, "error", "DCF_SENSITIVITY_GRID",
                     "DCF 敏感性至少应为 3 个折现率 × 3 个终值增长率。")
    elif not dcf_not_applicable:
        _add(issues, "error", "DCF_ROUTE_UNDECLARED",
             "未找到逐年 DCF，也未明确说明 DCF not applicable / DCF 不适用及替代方法。")
    elif not template:
        has_reason = bool(re.search(r"(?:reason|原因)\s*[:：]\s*\S+", valuation_text, re.I))
        has_alternative = bool(re.search(
            r"(?:alternative\s+method|替代方法)\s*[:：]\s*\S+", valuation_text, re.I
        ))
        if not (has_reason and has_alternative):
            _add(issues, "error", "DCF_NOT_APPLICABLE_DETAIL",
                 "DCF 不适用时必须明确写出 Reason / 原因与 Alternative method / 替代方法。")

    reverse_text = document.block_text("reverse-dcf") if legacy_v11 else document.block_text("reverse-valuation")
    if not legacy_v11 and not reverse_text and mode == "audit":
        reverse_text = document.block_text("reverse-dcf")
    if not legacy_v11 and not reverse_text:
        _add(issues, "error", "REVERSE_VALUATION_MISSING", "缺少 generic Reverse Valuation。")
    reverse_fields = {
        "Market price / As of": ("market price", "市场价格"),
        "Implied growth period": ("implied growth period", "隐含增长期"),
        "Steady-state margin": ("steady state margin", "稳态利润率"),
        "Reinvestment / ROIC": ("reinvestment", "roic", "再投资"),
        "Cash-flow / discount basis": ("cash flow / discount basis", "cash flow discount basis", "现金流 折现口径"),
        "Conclusion": ("conclusion", "结论"),
    }
    if not legacy_v11:
        reverse_fields = {"Market price / date": ("market price / date", "market price / as of"),
            "Method / value basis": ("method / value basis",), "Implied assumptions": ("implied", "隐含"),
            "Analyst / Base Comparison": ("analyst / base comparison",), "Conclusion": ("conclusion", "结论")}
        if forecast:
            reverse_fields.update({"Growth period": ("growth period",), "Steady-state margin": ("steady state margin",),
                "Reinvestment": ("reinvestment",), "ROIC/ROE": ("roic", "roe"), "Cash-flow / discount basis": ("cash flow / discount basis",)})
    for label, aliases in reverse_fields.items():
        if reverse_text and not any(_norm(alias) in _norm(reverse_text) for alias in aliases):
            _add(issues, "error", "REVERSE_DCF_FIELD" if legacy_v11 else "REVERSE_VALUATION_FIELD", f"Reverse Valuation 缺少字段：{label}")

    if not template and forecast:
        basis_match = re.search(
            r"(?:selected\s+cash-flow\s+basis|现金流口径)\s*[:：]\s*(fcff|fcfe)",
            valuation_text, re.I,
        )
        rate_match = re.search(r"(?:discount\s+rate|折现率)\s*[:：]\s*([^.;。]{1,80})", valuation_text, re.I)
        if not legacy_v11 and report_format == "html":
            basis_match = re.search(r"cash-flow / discount basis\s*(FCFF|FCFE)", valuation_text, re.I)
            rate_match = re.search(r"cash-flow / discount basis\s*(?:FCFF|FCFE)\s*/\s*(WACC|KE)", valuation_text, re.I)
        if not basis_match:
            _add(issues, "error", "DCF_BASIS_MISSING", "完整 DCF 未明确 Selected cash-flow basis: FCFF 或 FCFE。")
        else:
            basis = basis_match.group(1).lower()
            rate_text = rate_match.group(1).lower() if rate_match else ""
            if basis == "fcff" and not re.search(r"\bwacc\b|加权平均资本成本", rate_text, re.I):
                _add(issues, "error", "DCF_BASIS_MISMATCH", "FCFF 必须使用 WACC 折现。")
            if basis == "fcfe" and not re.search(
                r"cost\s+of\s+equity|\bke\b|股权资本成本|权益资本成本", rate_text, re.I
            ):
                _add(issues, "error", "DCF_BASIS_MISMATCH", "FCFE 必须使用 Cost of Equity / Ke 折现。")

    return issues, report_format


def validate(
    text: str,
    suffix: str = ".md",
    template: bool = False,
    expected_as_of: Optional[str] = None,
    allow_markdown: bool = False,
    legacy_v11: bool = False,
    source_json: Optional[dict] = None,
    valuation_json: Optional[dict] = None,
) -> tuple[list[str], list[str]]:
    """Backward-compatible wrapper returning error and warning messages."""
    issues, _ = audit_report(text, suffix, template, expected_as_of, allow_markdown, legacy_v11, source_json, valuation_json)
    return (
        [issue.message for issue in issues if issue.severity == "error"],
        [issue.message for issue in issues if issue.severity == "warning"],
    )


def main() -> int:
    parser = argparse.ArgumentParser(
        description="检查 V1.2 Standard/Audit 结构与追溯；不证明来源真实性或投资判断。"
    )
    parser.add_argument("report", type=Path)
    parser.add_argument("--strict", action="store_true", help="将 blocking warning 也视为失败，人工复核提示不阻断")
    parser.add_argument("--json", action="store_true", dest="json_output", help="输出 JSON")
    parser.add_argument("--template", action="store_true", help="校验未填充 HTML 模板的结构")
    parser.add_argument("--as-of", dest="expected_as_of",
                        help="要求报告级研究截止日与此 YYYY-MM-DD 日期一致")
    parser.add_argument("--allow-markdown", action="store_true",
                        help="用户明确要求 Markdown 完整报告时，取消默认 HTML 格式警告")
    parser.add_argument("--legacy-v11", action="store_true", help="显式检查原 V1.1 报告，不推断模式")
    parser.add_argument("--source-json", type=Path, help="原始 report-content.json")
    parser.add_argument("--valuation-json", type=Path, help="原始 valuation-result.json")
    args = parser.parse_args()

    try:
        text = args.report.read_text(encoding="utf-8")
        inputs = []
        for path in (args.source_json, args.valuation_json):
            value = json.loads(path.read_text(encoding="utf-8")) if path else None
            if path and not isinstance(value, dict):
                raise ValueError(f"{path}: JSON 根必须为 object")
            inputs.append(value)
        issues, report_format = audit_report(
            text, args.report.suffix, args.template, args.expected_as_of, args.allow_markdown,
            args.legacy_v11, *inputs,
        )
    except (OSError, UnicodeError) as exc:
        if args.json_output:
            print(json.dumps({"status": "error", "exit_code": 2, "message": str(exc)}, ensure_ascii=False))
        else:
            print(f"ERROR: 无法读取报告：{exc}", file=sys.stderr)
        return 2
    except Exception as exc:
        if args.json_output:
            print(json.dumps({"status": "error", "exit_code": 2, "message": str(exc)}, ensure_ascii=False))
        else:
            print(f"ERROR: 无法解析报告：{exc}", file=sys.stderr)
        return 2

    errors = [issue for issue in issues if issue.severity == "error"]
    warnings = [issue for issue in issues if issue.severity == "warning"]
    failed = bool(errors or (args.strict and any(issue.blocking for issue in warnings)))

    if args.json_output:
        print(json.dumps({
            "status": "fail" if failed else ("pass_with_warnings" if warnings else "pass"),
            "format": report_format,
            "strict": args.strict,
            "template": args.template,
            "expected_as_of": args.expected_as_of,
            "allow_markdown": args.allow_markdown,
            "legacy_v11": args.legacy_v11,
            "source_json_supplied": args.source_json is not None,
            "valuation_json_supplied": args.valuation_json is not None,
            "errors": [asdict(issue) for issue in errors],
            "warnings": [asdict(issue) for issue in warnings],
        }, ensure_ascii=False, indent=2))
    else:
        for issue in errors:
            print(f"ERROR [{issue.code}]: {issue.message}")
        for issue in warnings:
            print(f"WARNING [{issue.code}]: {issue.message}")
        if failed:
            print(f"FAIL: {len(errors)} errors, {len(warnings)} warnings")
        elif warnings:
            print(f"PASS WITH WARNINGS: 0 errors, {len(warnings)} warnings")
        else:
            print("PASS: 0 errors, 0 warnings")

    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
