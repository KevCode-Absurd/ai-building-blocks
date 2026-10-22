---
name: case-competition-slides
metadata:
  version: "1.0.0"
description: Generate consulting-grade case competition decks — MBB / McKinsey style with an answer-first executive summary, action-title slides that pass the "titles test", chart-led analysis, a financials section, and an appendix of backup slides for Q&A. Renders to a polished single-file HTML deck (print-to-PDF ready) or an editable PPTX. Use whenever the user is preparing a business/consulting case competition presentation, a strategy recommendation deck, or asks for "case competition slides", "consulting deck", "McKinsey-style slides", "pyramid principle deck", or a PPTX/HTML recommendation presentation.
---

# Case Competition Slides

Create consulting-grade recommendation decks that win business and case competitions. This skill encodes the way MBB (McKinsey, Bain, BCG) consultants structure a deck: **answer-first, MECE, action titles, appendix for Q&A** — and renders it to either a single-file **HTML** deck or an editable **PPTX**.

Pairs with the `consulting-deck-builder` subagent (which specifies the deck) and complements the general `html-slides` and `dataviz` skills.

## When to Use

Trigger this skill when the user is building a **case competition** or **strategy recommendation** presentation — not a generic slide deck. Signals: "case competition", "consulting deck", "McKinsey/Bain/BCG style", "pyramid principle", "recommendation deck", "action titles", "executive summary slide", or a request to export a recommendation to PPTX/HTML/PDF.

For general-purpose or creatively-themed slides, prefer the `html-slides` skill. This skill deliberately favors a **restrained, credible, executive** aesthetic over a flashy one — judges score substance and clarity.

## The Non-Negotiable Rules (case competition decks)

1. **Answer first.** Slide 1 after the title is the **Executive Summary**: the recommendation + 2–3 supporting reasons + the quantified impact. A judge who reads only this slide must understand the whole answer.
2. **Action titles.** Every slide title is a **complete sentence stating the takeaway** — a claim, not a label. "The premium segment is growing 3× faster and is underserved" — not "Market Analysis". Reading the titles alone must tell the full story (**the titles test**).
3. **Pyramid structure.** Governing thought (recommendation) → 2–3 MECE reasons → evidence beneath each. Every slide ladders up to the recommendation. No orphan analysis.
4. **One idea per slide, chart-led.** Minimal text. The visual carries the point. Put the message in the action title; the body proves only that.
5. **Quantify.** Show the numbers — market size, ROI, margin impact — with sourced footnotes and stated assumptions.
6. **Appendix for Q&A.** Detailed models, benchmarks, sensitivities, and rejected options go in a clearly-divided appendix, one backup slide per anticipated tough question, indexed for fast retrieval.
7. **Executive aesthetic.** Restrained palette (one deep primary + one accent), clean type, consistent layout, readable when projected. No AI-slop purple gradients, no clutter.

## Standard Deck Structure

Build this flow unless the case calls for a variation (see `references/deck-anatomy.md`):

1. **Title** — case name, team, date
2. **Executive summary** — recommendation + 2–3 reasons + impact (the answer)
3. **Context / problem** — the situation and the decision to be made
4. **Approach** — the framework and the key questions (optional, keep short)
5. **Analysis sections** — one section per supporting reason, each chart-led
6. **Financials** — quantified impact (sizing, ROI/NPV, margin bridge)
7. **Recommendation & roadmap** — the answer restated + implementation plan
8. **Risks & mitigations**
9. **Appendix divider** + **backup slides** for Q&A

## How to Produce a Deck

### Step 1 — Get or write the deck spec

The deck is defined by a JSON spec (`scripts/deck-spec.example.json` is a complete example). Each slide has a `type`, an **action-title**, and content. If a `consulting-deck-builder` subagent produced a slide-by-slide outline, convert it to the spec. Otherwise write the spec from the analysis, enforcing the rules above.

Before rendering, **run the titles test**: read every `title` in order. If they don't tell the complete story, rewrite them — do not proceed with label-style titles.

### Step 2 — Choose the output format

Ask the user (or infer): **HTML**, **PPTX**, or **both**.

- **HTML** — single self-contained file, keyboard-navigable, print-to-PDF ready. Best for a polished, controlled, projector-friendly deliverable. Start from `assets/template.html`.
- **PPTX** — editable PowerPoint, best when the competition requires an editable file or judges expect PowerPoint. Generate with `scripts/build_pptx.py`.

### Step 3a — Render HTML

Copy `assets/template.html` and populate the slides from the spec. Keep it a single file with inline CSS/JS. Each slide fits `100vh` — if content overflows, split it. Use the built-in slide layouts (title, exec-summary, section, analysis with chart area, financials, roadmap, risks, appendix). Swap in real charts (inline SVG or the `dataviz` skill) rather than placeholders. Verify the deck opens in a browser and every slide fits the viewport.

### Step 3b — Render PPTX

```bash
python3 scripts/build_pptx.py <deck-spec.json> <output.pptx>
```

The script requires `python-pptx` (`pip install python-pptx`). It lays out action-title slides with a consistent master, an executive-summary layout, section dividers, chart-placeholder bodies, a financials layout, and an appendix section. Edit the produced `.pptx` for final polish or to drop in real charts.

### Step 4 — Verify

- **Titles test** passes (titles alone tell the story).
- Executive summary contains the recommendation, reasons, and quantified impact.
- Every claim has a source/assumption footnote where numbers appear.
- Appendix backup slides exist for the top anticipated questions.
- HTML: opens cleanly, each slide fits the viewport, prints to PDF well.
- PPTX: opens in PowerPoint/Keynote/Google Slides without layout breakage.

## Files

- `references/deck-anatomy.md` — detailed anatomy of each slide type, action-title patterns, and deck-flow variations by case type.
- `assets/template.html` — starter single-file consulting HTML deck with all slide layouts and keyboard navigation.
- `scripts/build_pptx.py` — generates an editable PPTX from a deck spec.
- `scripts/deck-spec.example.json` — a complete example deck spec to copy and adapt.

## Key Reminders

- **Substance and structure lead; design supports.** A clear, MECE, answer-first deck in a plain style beats a beautiful deck with buried logic.
- **Never bury the recommendation.** If the answer isn't on slide 2, the deck is wrong.
- **Keep the main story tight; push depth to the appendix.**
- **Round to defensible precision.** State assumptions next to every number.
