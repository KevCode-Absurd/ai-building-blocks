---
name: matlab-access-datafeed
description: >
  Guide for accessing financial and economic data in MATLAB using the Datafeed Toolbox.
  Covers Bloomberg (market data via bloomberg/blp/bloombergHypermedia), FRED (Federal Reserve
  economic data via fredrs), Haver Analytics (economic data via haver/haverdirect/haverview),
  and LSEG Datastream (historical data via datastreamws). Use when connecting to any of these
  data providers from MATLAB.
license: https://www.mathworks.com/content/dam/mathworks/license/pmrl/license.md
metadata:
  author: MathWorks
  version: "1.2"
---

# Datafeed Toolbox — Bloomberg, FRED, Haver Analytics, and LSEG Datastream

Access financial and economic data from four major providers through the MATLAB Datafeed Toolbox.

## When to Use

- User wants to connect to **Bloomberg**, **FRED**, **Haver Analytics**, or **LSEG Datastream** from MATLAB
- User needs to retrieve market data (prices, history, real-time, reference data) via Bloomberg
- User needs to retrieve economic time series from the St. Louis Fed (FRED)
- User needs to fetch economic/financial time series from Haver Analytics databases
- User needs to retrieve historical financial data from LSEG Datastream
- User needs help choosing between interfaces within a provider (e.g., bloomberg vs blp vs bloombergHypermedia, haver vs haverview)
- User is writing MATLAB code involving securities, economic indicators, or data provider connectivity

## When NOT to Use

- General financial modeling or portfolio optimization that doesn't involve data provider connectivity
- Bloomberg Terminal keyboard shortcuts or Excel add-in questions (not MATLAB)
- Datastream Excel add-in (not MATLAB)
- Real-time streaming from LSEG (datastreamws is historical only)
- Data sources not covered here (e.g., Yahoo Finance)

## Before you write code

Ask once for anything missing. Never guess it, and never make up a ticker, series ID or date.

- The provider (Bloomberg, FRED, Haver or Datastream).
- The securities or series IDs and the date range. If the person is unsure of a FRED series ID, use `search` (see `references/fred.md`) and show the matches.
- The computer type (Windows, Mac or Linux) and the MATLAB release. If unknown, say which interfaces need which, and ask.
- Whether credentials are saved in MATLAB's secret store. If not, tell them to run `setSecret` themselves. Never ask them to paste a password or key into the chat.

If the request is outside this skill (for example Yahoo Finance data, or live streaming from Datastream), say so and stop.

## Output

Return one runnable MATLAB script, followed by short notes, in this order:

1. **Connect:** the connection code for the chosen interface, with credentials from `getSecret`.
2. **Pull data:** the fetch code for the securities or series and dates asked for, returning a table or timetable. Name the columns it returns.
3. **Close:** close the connection if the interface needs it.
4. **Notes:** the interface chosen and why, the provider's limits, and one next step (for example, load the result into a timetable for analysis).

If you cannot run MATLAB, say "not run" and do not claim the script works.

---

## Provider Overview

| Provider | Data Type | Interfaces | Reference |
|----------|-----------|------------|-----------|
| Bloomberg | Market data (equities, fixed income, derivatives, indices) | `bloomberg`, `blp`, `bloombergHypermedia`, `bloombergEMSX` | `references/bloomberg.md` |
| FRED | U.S. economic data (GDP, unemployment, CPI, interest rates) | `fredrs` (replaces obsolete `fred`) | `references/fred.md` |
| Haver Analytics | Global economic & financial data (macro, industry, surveys) | `haver`, `haverdirect`, `haverview` | `references/haver.md` |
| LSEG Datastream | Historical financial data (equities, indices, economics, expressions) | `datastreamws` | `references/datastreamws.md` |

## Quick Interface Selection

### Bloomberg — see `references/bloomberg.md` for full API patterns
- **Windows Desktop/Terminal user** → `bloomberg` (C++)
- **Need platform independence (Data License)** → `bloombergHypermedia`
- **Server/cloud, no Terminal (BPIPE)** → `bloombergBPIPE`
- **Existing `blp` users** → migrate to `bloomberg` (same API, no Java needed)

### FRED — see `references/fred.md` for full API patterns
- **Any platform** → `fredrs` (requires R2026a+, API key)
- **`fred` is obsolete** — do NOT use it

### Haver Analytics — see `references/haver.md` for full API patterns
- **Windows with local data files** → `haver`
- **Windows needing remote access** → `haverdirect`
- **Non-Windows / server / cloud** → `haverview` (REST API)

### LSEG Datastream — see `references/datastreamws.md` for full API patterns
- **Any platform** → `datastreamws` (REST API, requires Datastream credentials)

## How to Use References

Before generating code for a specific provider, read the corresponding reference file for detailed API patterns, function signatures, gotchas, and examples:
- Working with Bloomberg data → read `references/bloomberg.md`
- Working with FRED economic data → read `references/fred.md`
- Working with Haver Analytics data → read `references/haver.md`
- Working with LSEG Datastream data → read `references/datastreamws.md`

## Common Rules

- Always use `getSecret()` for credentials and API keys — never hardcode secrets
- All four providers require the **Datafeed Toolbox**
- `fredrs` additionally requires **R2026a** or later
- `datastreamws` available since **R2018b**
- Bloomberg and Haver local interfaces (`bloomberg`, `blp`, `haver`, `haverdirect`) are Windows-only; cloud/REST variants (`bloombergHypermedia`, `bloombergBPIPE`, `haverview`, `fredrs`, `datastreamws`) are platform-independent. `bpipe` is the Java version of `bloombergBPIPE`; use it only if you need Java.

---

Copyright 2026 The MathWorks, Inc.
