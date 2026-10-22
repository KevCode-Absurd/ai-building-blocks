#!/usr/bin/env python3
"""Build an editable, consulting-style case-competition PPTX from a deck spec.

Usage:
    python3 build_pptx.py <deck-spec.json> <output.pptx>

Requires: python-pptx  (pip install python-pptx)

The spec format is documented in ../SKILL.md and exemplified in
deck-spec.example.json. Every slide carries an ACTION TITLE (a full-sentence
takeaway). This script lays out an answer-first deck: title, executive
summary, context, analysis (chart-placeholder), financials, roadmap, risks,
and an appendix section. Drop in real charts after generation for final polish.
"""

import json
import sys

try:
    from pptx import Presentation
    from pptx.util import Inches, Pt, Emu
    from pptx.dml.color import RGBColor
    from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
except ImportError:
    sys.exit("Missing dependency. Install with:  pip install python-pptx")

# 16:9 canvas
EMU_W = Inches(13.333)
EMU_H = Inches(7.5)
MARGIN = Inches(0.6)


def hex_color(value, fallback):
    try:
        return RGBColor.from_string(value.lstrip("#"))
    except Exception:
        return RGBColor.from_string(fallback)


class DeckBuilder:
    def __init__(self, spec):
        self.spec = spec
        meta = spec.get("meta", {})
        self.primary = hex_color(meta.get("primary", "#0F2A43"), "0F2A43")
        self.accent = hex_color(meta.get("accent", "#C8892A"), "C8892A")
        self.ink = RGBColor.from_string("1A1A1A")
        self.muted = RGBColor.from_string("6B7280")
        self.light = RGBColor.from_string("F3F4F6")
        self.white = RGBColor.from_string("FFFFFF")
        self.prs = Presentation()
        self.prs.slide_width = EMU_W
        self.prs.slide_height = EMU_H
        self.blank = self.prs.slide_layouts[6]
        self.page = 0

    # ---- low-level helpers -------------------------------------------------
    def _slide(self):
        return self.prs.slides.add_slide(self.blank)

    def _rect(self, slide, x, y, w, h, fill=None, line=None):
        shp = slide.shapes.add_shape(1, x, y, w, h)  # 1 = rectangle
        shp.fill.solid()
        shp.fill.fore_color.rgb = fill if fill else self.white
        if line is None:
            shp.line.fill.background()
        else:
            shp.line.color.rgb = line
            shp.line.width = Pt(0.75)
        shp.shadow.inherit = False
        return shp

    def _text(self, slide, x, y, w, h, text, size=18, color=None, bold=False,
              align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, font="Calibri"):
        box = slide.shapes.add_textbox(x, y, w, h)
        tf = box.text_frame
        tf.word_wrap = True
        tf.vertical_anchor = anchor
        tf.margin_left = 0
        tf.margin_right = 0
        tf.margin_top = 0
        tf.margin_bottom = 0
        para = tf.paragraphs[0]
        para.alignment = align
        run = para.add_run()
        run.text = text
        run.font.size = Pt(size)
        run.font.bold = bold
        run.font.name = font
        run.font.color.rgb = color if color else self.ink
        return box

    def _bullets(self, slide, x, y, w, h, items, size=16):
        box = slide.shapes.add_textbox(x, y, w, h)
        tf = box.text_frame
        tf.word_wrap = True
        for i, item in enumerate(items):
            para = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
            para.space_after = Pt(8)
            run = para.add_run()
            run.text = u"•  " + str(item)
            run.font.size = Pt(size)
            run.font.name = "Calibri"
            run.font.color.rgb = self.ink
        return box

    def _footer(self, slide, source=None):
        self.page += 1
        meta = self.spec.get("meta", {})
        left = meta.get("team", "")
        if source:
            left = (left + "  |  Source: " + source) if left else "Source: " + source
        self._text(slide, MARGIN, Emu(EMU_H - Inches(0.45)),
                   Inches(11.0), Inches(0.3), left, size=9, color=self.muted)
        self._text(slide, Emu(EMU_W - Inches(1.2)), Emu(EMU_H - Inches(0.45)),
                   Inches(0.6), Inches(0.3), str(self.page), size=9,
                   color=self.muted, align=PP_ALIGN.RIGHT)

    def _action_title(self, slide, title):
        # accent rule + action title band
        self._rect(slide, MARGIN, Inches(0.55), Inches(0.12), Inches(0.9),
                   fill=self.accent)
        self._text(slide, Emu(MARGIN + Inches(0.3)), Inches(0.5),
                   Emu(EMU_W - MARGIN - MARGIN - Inches(0.3)), Inches(1.05),
                   title, size=21, color=self.primary, bold=True,
                   anchor=MSO_ANCHOR.MIDDLE)
        # divider
        self._rect(slide, MARGIN, Inches(1.62),
                   Emu(EMU_W - MARGIN - MARGIN), Emu(Pt(1)), fill=self.light)

    def _chart_placeholder(self, slide, x, y, w, h, note):
        box = self._rect(slide, x, y, w, h, fill=self.light)
        self._text(slide, x, y, w, h, note or "[ chart ]", size=13,
                   color=self.muted, align=PP_ALIGN.CENTER,
                   anchor=MSO_ANCHOR.MIDDLE)
        return box

    # ---- slide types -------------------------------------------------------
    def title_slide(self, s):
        slide = self._slide()
        self._rect(slide, 0, 0, EMU_W, EMU_H, fill=self.primary)
        self._rect(slide, MARGIN, Inches(3.0), Inches(1.6), Inches(0.14),
                   fill=self.accent)
        self._text(slide, MARGIN, Inches(3.3), Inches(11.5), Inches(2.0),
                   s.get("title", ""), size=34, color=self.white, bold=True)
        self._text(slide, MARGIN, Inches(5.1), Inches(11.5), Inches(0.6),
                   s.get("subtitle", ""), size=16, color=self.light)

    def executive_summary(self, s):
        slide = self._slide()
        self._action_title(slide, s.get("title", ""))
        top = Inches(1.95)
        # recommendation callout
        rec = s.get("recommendation", "")
        if rec:
            self._rect(slide, MARGIN, top, Emu(EMU_W - MARGIN - MARGIN),
                       Inches(1.0), fill=self.primary)
            self._text(slide, Emu(MARGIN + Inches(0.25)), top,
                       Emu(EMU_W - MARGIN - MARGIN - Inches(0.5)), Inches(1.0),
                       "Recommendation:  " + rec, size=15, color=self.white,
                       bold=True, anchor=MSO_ANCHOR.MIDDLE)
        reasons = s.get("reasons", [])
        ry = Inches(3.2)
        col_w = Emu((EMU_W - MARGIN - MARGIN - Inches(0.6)) / max(len(reasons), 1))
        for i, reason in enumerate(reasons):
            x = Emu(MARGIN + i * (col_w + Inches(0.3)))
            self._text(slide, x, ry, Inches(0.6), Inches(0.5), str(i + 1),
                       size=26, color=self.accent, bold=True)
            self._text(slide, x, Emu(ry + Inches(0.55)), col_w, Inches(2.0),
                       reason, size=14, color=self.ink)
        impact = s.get("impact", "")
        if impact:
            iy = Inches(6.0)
            self._rect(slide, MARGIN, iy, Emu(EMU_W - MARGIN - MARGIN),
                       Inches(0.75), fill=self.light)
            self._text(slide, MARGIN, iy, Emu(EMU_W - MARGIN - MARGIN),
                       Inches(0.75), "Impact:  " + impact, size=15,
                       color=self.primary, bold=True, align=PP_ALIGN.CENTER,
                       anchor=MSO_ANCHOR.MIDDLE)
        self._footer(slide)

    def context(self, s):
        slide = self._slide()
        self._action_title(slide, s.get("title", ""))
        self._text(slide, MARGIN, Inches(2.0), Inches(7.0), Inches(3.5),
                   s.get("body", ""), size=16, color=self.ink)
        if s.get("bullets"):
            self._bullets(slide, Inches(8.2), Inches(2.0), Inches(4.4),
                          Inches(3.5), s["bullets"])
        self._footer(slide, s.get("source"))

    def analysis(self, s):
        slide = self._slide()
        self._action_title(slide, s.get("title", ""))
        self._chart_placeholder(slide, MARGIN, Inches(2.0), Inches(7.3),
                                Inches(4.6), s.get("chart_note"))
        if s.get("bullets"):
            self._bullets(slide, Inches(8.3), Inches(2.1), Inches(4.3),
                          Inches(4.4), s["bullets"])
        self._footer(slide, s.get("source"))

    def financials(self, s):
        self.analysis(s)  # same layout: chart + supporting numbers

    def roadmap(self, s):
        slide = self._slide()
        self._action_title(slide, s.get("title", ""))
        phases = s.get("phases", [])
        n = max(len(phases), 1)
        gap = Inches(0.3)
        total = EMU_W - MARGIN - MARGIN
        col_w = Emu((total - gap * (n - 1)) / n)
        y = Inches(3.0)
        for i, ph in enumerate(phases):
            x = Emu(MARGIN + i * (col_w + gap))
            self._rect(slide, x, y, col_w, Inches(0.55), fill=self.primary)
            self._text(slide, x, y, col_w, Inches(0.55),
                       ph.get("label", ""), size=13, color=self.white,
                       bold=True, align=PP_ALIGN.CENTER,
                       anchor=MSO_ANCHOR.MIDDLE)
            self._rect(slide, x, Emu(y + Inches(0.55)), col_w, Inches(1.9),
                       fill=self.light)
            self._text(slide, Emu(x + Inches(0.15)), Emu(y + Inches(0.7)),
                       Emu(col_w - Inches(0.3)), Inches(1.6),
                       ph.get("text", ""), size=13, color=self.ink)
        self._footer(slide, s.get("source"))

    def risks(self, s):
        slide = self._slide()
        self._action_title(slide, s.get("title", ""))
        y = Inches(2.1)
        for item in s.get("risks", []):
            self._rect(slide, MARGIN, y, Inches(0.12), Inches(1.15),
                       fill=self.accent)
            self._text(slide, Emu(MARGIN + Inches(0.3)), y, Inches(11.0),
                       Inches(0.4), "Risk:  " + item.get("risk", ""),
                       size=15, color=self.primary, bold=True)
            self._text(slide, Emu(MARGIN + Inches(0.3)), Emu(y + Inches(0.45)),
                       Inches(11.6), Inches(0.7),
                       "Mitigation:  " + item.get("mitigation", ""),
                       size=13, color=self.ink)
            y = Emu(y + Inches(1.35))
        self._footer(slide, s.get("source"))

    def appendix_divider(self, s):
        slide = self._slide()
        self._rect(slide, 0, 0, EMU_W, EMU_H, fill=self.primary)
        self._rect(slide, MARGIN, Inches(3.4), Inches(1.6), Inches(0.14),
                   fill=self.accent)
        self._text(slide, MARGIN, Inches(3.65), Inches(11.5), Inches(1.0),
                   s.get("title", "Appendix"), size=32, color=self.white,
                   bold=True)

    def appendix(self, s):
        slide = self._slide()
        self._action_title(slide, s.get("title", ""))
        if s.get("chart_note"):
            self._chart_placeholder(slide, MARGIN, Inches(2.0), Inches(7.3),
                                    Inches(4.6), s.get("chart_note"))
            if s.get("bullets"):
                self._bullets(slide, Inches(8.3), Inches(2.1), Inches(4.3),
                              Inches(4.4), s["bullets"])
        elif s.get("bullets"):
            self._bullets(slide, MARGIN, Inches(2.1), Inches(12.0),
                          Inches(4.4), s["bullets"])
        self._footer(slide, s.get("source"))

    def build(self):
        dispatch = {
            "title": self.title_slide,
            "executive_summary": self.executive_summary,
            "context": self.context,
            "approach": self.context,
            "analysis": self.analysis,
            "financials": self.financials,
            "roadmap": self.roadmap,
            "recommendation": self.context,
            "risks": self.risks,
            "appendix_divider": self.appendix_divider,
            "appendix": self.appendix,
        }
        for s in self.spec.get("slides", []):
            handler = dispatch.get(s.get("type"))
            if handler is None:
                # unknown type -> render as a titled bullet slide
                s = dict(s)
                handler = self.appendix
            handler(s)
        return self.prs


def main():
    if len(sys.argv) != 3:
        sys.exit("Usage: python3 build_pptx.py <deck-spec.json> <output.pptx>")
    with open(sys.argv[1], "r", encoding="utf-8") as f:
        spec = json.load(f)
    prs = DeckBuilder(spec).build()
    prs.save(sys.argv[2])
    print("Wrote %s (%d slides)" % (sys.argv[2], len(prs.slides._sldIdLst)))


if __name__ == "__main__":
    main()
