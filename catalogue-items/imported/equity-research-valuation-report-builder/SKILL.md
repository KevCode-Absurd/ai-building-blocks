---
name: equity-research-valuation-report-builder
description: Build a dated equity research report from company filings, financial data and explicit valuation assumptions, with DCF scenarios, source traceability and English HTML output.
---

# Equity research and valuation

Establish the company, exchange, currency, as-of date and horizon from the request and supplied documents. Use [the English rendering and validation path](launch-tools/USAGE.md) when English is requested. It retains the upstream schema, valuation and provenance checks; the original renderer accepts only Chinese input.

Use the [upstream research framework](SKILL.upstream.md) and its references for evidence labels, thesis and counter-evidence, period comparisons, DCF assumptions, scenarios, risks and monitoring. Verify source dates, facts and calculations. The included sample uses only synthetic company, peer, industry and price exhibits. Live work requires actual verified sources and dated market data; the package includes no market-data feed.

Run the valuation engine, the appropriate renderer and its matching strict validator. Export HTML to PDF if requested and inspect every page. A structural pass does not establish source independence or the investment conclusion.

Upstream engine/framework: evilhill, MIT. AI Blocks added English compatibility, readable scenario/print layouts and this entrypoint after a 22 October 2026 synthetic fixture check.
