"""Package additive compatibility helpers without modifying upstream files."""
import json
import re
import shutil
import sys
from pathlib import Path

repo=Path(__file__).resolve().parents[2];root=Path(sys.argv[1]).resolve();imports=repo/'catalogue-items/imported';tools=Path(__file__).parent
case=imports/'case-competition-slide-deck-builder'
equity=imports/'equity-research-valuation-report-builder'
slides=imports/'storyboard-to-powerpoint-deck-builder'
paper=imports/'research-paper-writer'
for target in [case,equity,slides,paper]:
    backup=target/'SKILL.upstream.md'
    if not backup.exists():shutil.copy2(target/'SKILL.md',backup)
    (target/'launch-tools').mkdir(exist_ok=True)
    (target/'launch-tools/LICENSE').write_text('MIT License\n\nCopyright (c) 2026 AI Blocks contributors\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n',encoding='utf-8')
shutil.copy2(tools/'build_case.py',case/'launch-tools/build_case.py')
shutil.copy2(root/'inputs/case-deck.json',case/'launch-tools/sample.json')
shutil.copy2(tools/'render_equity.py',equity/'launch-tools/render_equity.py')
shutil.copy2(tools/'validate_equity.py',equity/'launch-tools/validate_equity.py')
shutil.copy2(root/'inputs/equity-content.json',equity/'launch-tools/sample-content.json')
shutil.copy2(root/'inputs/valuation-input.json',equity/'launch-tools/sample-valuation.json')
shutil.copy2(tools/'polish_presentation.py',slides/'launch-tools/finalize_pptx.py')
(slides/'templates').mkdir(exist_ok=True)
shutil.copy2(root/'inputs/presentation.json',slides/'templates/storyboard.example.json')
shutil.copy2(root/'inputs/operations.json',case/'launch-tools/operations.json')
shutil.copy2(root/'inputs/operations.json',slides/'launch-tools/operations.json')
shutil.copy2(root/'inputs/simulation-results.json',paper/'launch-tools/simulation-results.json')
shutil.copy2(root/'inputs/task-schedules.csv',paper/'launch-tools/task-schedules.csv')
shutil.copy2(root/'inputs/paper-outline-and-sources.json',paper/'launch-tools/outline-and-sources.json')
sources=equity/'launch-tools/sources';sources.mkdir(exist_ok=True)
for source in (root/'artifacts/sources').glob('*.json'):shutil.copy2(source,sources/source.name)
entrypoints={
case:'''---
name: case-competition-slide-deck-builder
description: Create an answer-first case competition or strategy deck with editable charts, a financial bridge, rollout gates and backup answers from a supplied case and rubric.
---

# Case competition deck

Read [the checked PowerPoint path](launch-tools/USAGE.md) before generating an editable deck. Use `launch-tools/build_case.py` for analysis and financial slides: the original script intentionally produces chart placeholders. Keep source notes and distinguish facts from assumptions.

Use the user's brief, judging rubric and time limit. Develop the recommendation and supporting analysis using the [upstream case method](SKILL.upstream.md). Preserve its answer-first story, complete-sentence titles, financial checks, implementation plan and Q&A backup. Supply real chart data to the added adapter, then render and inspect every slide. The included sample is explicitly synthetic.

Upstream method and layout: Calvinkub, MIT. AI Blocks added this entrypoint and compatibility helpers after a 22 October 2026 sample check. That check covers the retained fixture; it does not establish quality for every case.
''',
slides:'''---
name: storyboard-to-powerpoint-deck-builder
description: Turn supplied content and sources into an editable PowerPoint presentation for a business talk, lesson or report, using a validated storyboard and a selected style.
---

# Storyboard to PowerPoint

Read [the checked generation path](launch-tools/USAGE.md) for editable output with visible sources. A complete synthetic storyboard is included at `templates/storyboard.example.json`. Validate before rendering and confirm the output has the same number of slides.

Use the [upstream storytelling and design method](SKILL.upstream.md) for the brief, objectives, storyboard and style choice. The added finalizer is checked for `corporate-bright`; other styles still need their own source-note placement and layout review. Render and inspect every slide, including chart units, citations and any title wrapping.

Upstream renderer and method: Ved Raut / SlideSage, MIT. AI Blocks added this entrypoint, the missing example and the source-note finalizer on 22 October 2026. The retained eight-slide fixture is sample evidence, not a universal quality guarantee.
''',
equity:'''---
name: equity-research-valuation-report-builder
description: Build a dated equity research report from company filings, financial data and explicit valuation assumptions, with DCF scenarios, source traceability and English HTML output.
---

# Equity research and valuation

Establish the company, exchange, currency, as-of date and horizon from the request and supplied documents. Use [the English rendering and validation path](launch-tools/USAGE.md) when English is requested. It retains the upstream schema, valuation and provenance checks; the original renderer accepts only Chinese input.

Use the [upstream research framework](SKILL.upstream.md) and its references for evidence labels, thesis and counter-evidence, period comparisons, DCF assumptions, scenarios, risks and monitoring. Verify source dates, facts and calculations. The included sample uses only synthetic company, peer, industry and price exhibits. Live work requires actual verified sources and dated market data; the package includes no market-data feed.

Run the valuation engine, the appropriate renderer and its matching strict validator. Export HTML to PDF if requested and inspect every page. A structural pass does not establish source independence or the investment conclusion.

Upstream engine/framework: evilhill, MIT. AI Blocks added English compatibility, readable scenario/print layouts and this entrypoint after a 22 October 2026 synthetic fixture check.
''',
paper:'''---
name: research-paper-writer
description: Draft or revise a scientific manuscript from supplied findings and sources, using an appropriate structure, verified citations, clear limitations and rendered document checks.
---

# Research paper writer

Read [the portable workflow and dependency notes](launch-tools/USAGE.md), then the relevant parts of the [detailed scientific-writing guide](references/detailed-guide.md). Companion research/image skills and LaTeX assets named in that guide are not bundled; use available research, chart and document tools. Choose figures that explain the study and preserve the user's venue and scope.

Outline first, then write connected prose. Preserve actual methods and results, verify references against original sources and distinguish observations from interpretation. Apply reporting guidance that fits the study. For a synthetic sample, retain the data and calculation code and identify its narrow scope throughout.

Create the requested document, render its actual pages and inspect figures, captions, tables, citations and page breaks. Include uncertainty, limitations and relevant disclosure/availability statements. The retained 40-task simulation and reproduction script demonstrate one checked sample; they provide no evidence about a real organization.

Detailed guide attribution: K-Dense scientific-writing via sickn33/agentic-awesome-skills; see the retained content license and source metadata. AI Blocks added the portable entrypoint and sample resources on 22 October 2026. The earlier imported entrypoint is retained in `SKILL.upstream.md`.
'''}
for target,text in entrypoints.items():
    (target/'SKILL.md').write_text(text,encoding='utf-8')
    item=target/'item.yaml';metadata=item.read_text(encoding='utf-8')
    metadata=re.sub(r'^version: .*$','version: 1.0.1',metadata,flags=re.M)
    if 'Launch compatibility additions' not in metadata:
        metadata+='\n  - title: Launch compatibility additions\n    by: AI Blocks contributors\n    used: Added a portable entrypoint, reviewed helpers and labelled sample resources. Earlier imported entrypoint retained in SKILL.upstream.md.\n'
    item.write_text(metadata,encoding='utf-8')
print('Packaged additive helpers and four entrypoints; earlier imported files preserved in SKILL.upstream.md.')
