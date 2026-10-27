---
name: fintel-data
description: >
  Query Fintel (fintel.io) institutional market data through its REST API or
  official MCP server. Use this skill whenever the user mentions Fintel or asks about
  short interest, short interest ratio or days to cover, short squeeze data, borrow
  rate or cost to borrow, shares available to borrow, daily short volume,
  fails-to-deliver (FTD), 13F institutional owners ("who owns X"), insider buying or
  selling from SEC Form 3/4/5, analyst price targets, ratings and forecasts, dividend
  or earnings history and calendars, EOD or last prices, security lookup by ticker,
  CUSIP, ISIN, or FIGI, Fintel leaderboards, or their Fintel watchlists and alerts.
  Read-only: GET endpoints only.
---

# Fintel Data Skill

## Before you start

- **Paid service.** This skill needs a Fintel API key from a paid Fintel plan. Short interest also has to be switched on for the account. If the user has no key, say so, and stop. Do not guess figures from memory. Point to free public sources instead: SEC EDGAR for 13F holders and Form 3, 4 and 5 insider filings, and the exchanges or FINRA for short interest reports.
- **Needs a shell.** The steps use `curl` and a shell, so your AI must be able to run commands (for example Claude Code). On a plain chat that cannot run commands, say that, and ask the user to paste the Fintel data or use their MCP connection.
- **US securities first.** Several datasets are US only (fails-to-deliver, 13F holders and Form 3, 4 and 5 filings). For other countries, check the entitlements in `/v1/account` and report what is missing. Do not fill gaps.
- **Never put the key in your reply.** Do not print `FINTEL_API_KEY` or write it to a file you share.
- **Not investment advice.** Present the data and where it came from. Do not give a buy, sell or squeeze call.
- **If the question is missing.** Ask once for the ticker. If no question is given, return a short summary of short interest, top owners, recent insider filings, analyst targets and the next dividend date.

If your host has not already executed the shell probe in Step 1 (for example, in Codex), run the command inside the `!` wrapper with its shell tool before choosing a setup path. Use the actual output; if shell access is unavailable, report that limitation.

Fintel ([fintel.io](https://fintel.io)) is an institutional-grade market
intelligence platform.
Its strongest datasets are the ones most other providers lack: **short
interest, borrow rates, short volume, fails-to-deliver, 13F institutional
ownership, and insider transactions**.

Fintel exposes two surfaces backed by the same data contract:

| Surface | Endpoint | Auth | Best for |
|---|---|---|---|
| **REST** | `https://api.fintel.io/v1/*` | `X-API-KEY` header | Default — curl from any CLI agent |
| **MCP** | `https://mcp.fintel.io/mcp` | `X-API-KEY` header | MCP-native clients, tool auto-discovery |

Both require a Fintel API key. **This skill is read-only** — only call
GET endpoints. The API also exposes write endpoints (create/delete stock
lists, alert subscriptions, teams); do not call them.

---

## Step 1: Resolve FINTEL_API_KEY

The skill resolves `FINTEL_API_KEY` in this order:
1. `FINTEL_API_KEY` environment variable
2. `FINTEL_API_KEY` in `.env` in the current directory
3. `FINTEL_API_KEY` in `.env` at the git repo root (so a worktree inherits the key from the main checkout)

```
!`if [ -n "$FINTEL_API_KEY" ]; then echo "KEY_FROM_ENV_VAR"; elif [ -f .env ] && grep -qE "^FINTEL_API_KEY=" .env; then echo "KEY_FROM_LOCAL_DOTENV:$(pwd)/.env"; else GIT_COMMON=$(git rev-parse --path-format=absolute --git-common-dir 2>/dev/null); if [ -n "$GIT_COMMON" ]; then ROOT=$(dirname "$GIT_COMMON"); if [ -f "$ROOT/.env" ] && grep -qE "^FINTEL_API_KEY=" "$ROOT/.env"; then echo "KEY_FROM_ROOT_DOTENV:$ROOT/.env"; else echo "KEY_NOT_SET"; fi; else echo "KEY_NOT_SET"; fi; fi`
```

This probe needs a bash or zsh shell. On Windows, run it in Git Bash or WSL, or set `FINTEL_API_KEY` as a Windows environment variable first and tell the user so; if the probe cannot run, ask the user whether the key is set.

Then act on the result:

- `KEY_FROM_ENV_VAR` — use `$FINTEL_API_KEY` directly in curl calls.
- `KEY_FROM_LOCAL_DOTENV:<path>` / `KEY_FROM_ROOT_DOTENV:<path>` — load once before calling:
  ```bash
  export FINTEL_API_KEY=$(grep -E "^FINTEL_API_KEY=" <path> | head -1 | cut -d= -f2- | sed 's/^["'\'']//;s/["'\'']$//')
  ```
- `KEY_NOT_SET` — ask the user for their key. Keys come with a Fintel API
  plan ([fintel.io](https://fintel.io), docs at
  [api.fintel.io/docs](https://api.fintel.io/docs)). They can either
  `export FINTEL_API_KEY="..."` or add `FINTEL_API_KEY=...` to `.env` at
  the repo root (preferred for worktrees).

---

## Step 2: Resolve the Security

Most endpoints are addressed by `{country}/{symbol}` — an ISO country
code plus ticker, e.g. `us/AAPL`. Default to `us` when the user gives
only a ticker.

If the ticker is ambiguous or the user gives a company name, CUSIP,
ISIN, or FIGI, resolve it first:

```bash
# name / ticker / CUSIP / ISIN / FIGI search
curl -s -H "X-API-KEY: $FINTEL_API_KEY" "https://api.fintel.io/v1/securities?query=apple&country=us"
# exact identifier lookup (type: cusip, isin, ticker, id)
curl -s -H "X-API-KEY: $FINTEL_API_KEY" "https://api.fintel.io/v1/identifiers/isin/US0378331005"
```

---

## Step 3: Match the Request to an Endpoint

| User wants | Endpoint | Notes |
|---|---|---|
| Short interest, days to cover | `/v1/securities/{country}/{symbol}/short-interest` | Trailing year, NYSE/NASDAQ-reported. Limited availability — must be enabled per account; 403 means not entitled |
| Borrow rate, cost to borrow, shares available | `/v1/securities/{country}/{symbol}/borrow-rate` | Latest securities-lending fee rate, rebate rate, shares available |
| Daily short volume | `/v1/securities/{country}/{symbol}/short-volume` | Trailing year: short, short-exempt, total volume |
| Fails-to-deliver / FTD | `/v1/securities/{country}/{symbol}/fails-to-deliver` | Trailing-year SEC FTD records (US only) |
| Institutional owners / 13F holders | `/v1/securities/{country}/{symbol}/owners` | Current SEC 13F-derived holders |
| Insider transactions / Form 4 | `/v1/securities/{country}/{symbol}/insiders` | SEC Form 3/4/5-derived; `count` param |
| Analyst price targets | `/v1/securities/{country}/{symbol}/price-targets` | High, low, mean, median |
| Analyst buy/hold/sell ratings | `/v1/securities/{country}/{symbol}/analyst-ratings` | Aggregated recommendations |
| Revenue / EPS forecasts | `/v1/securities/{country}/{symbol}/forecast` | Aggregated analyst estimates |
| EOD price history | `/v1/securities/{country}/{symbol}/eod` | `period`: 1m, 3m, 6m, 1y (default), 2y, 3y, 5y, all |
| Latest price + derived stats | `/v1/securities/{country}/{symbol}/last-price` | 52w high/low, WTD/MTD/YTD change; falls back to EOD close with `meta.warnings=["quote_stale"]` |
| Dividend history | `/v1/securities/{country}/{symbol}/dividends` | |
| Earnings history and surprises | `/v1/securities/{country}/{symbol}/earnings` | |
| Upcoming earnings (one stock / market-wide) | `/v1/securities/{country}/{symbol}/calendar/earnings` or `/v1/calendar/earnings` | `from`/`to` ISO dates, default today +7d, max 90d window |
| Upcoming dividends (one stock / market-wide) | `/v1/securities/{country}/{symbol}/calendar/dividends` or `/v1/calendar/dividends` | Same window rules |
| A specific fundamental metric | `/v1/securities/{country}/{symbol}/data-points/{key}` | Discover keys via `/v1/data-definitions?query=...` |
| Top/bottom ranked stocks | `/v1/leaderboards` then `/v1/leaderboards/{key}/entries` | 503 not_available means retry later; `meta.status="beta"` means stub data |
| Security profile, listings, identifier history | `/v1/securities/{country}/{symbol}` | |
| User's watchlists | `/v1/stock-lists`, `/v1/stock-lists/{id}/items` | Also `/insiders`, `/owners`, `/filings` per list |
| User's alerts | `/v1/alerts`, `/v1/alert-messages` | |
| Account / entitlements | `/v1/account` | |

Full parameter details, country/exchange discovery endpoints, and more
curl examples: read `references/api-reference.md`.

---

## Step 4: Call the API

```bash
curl -s -H "X-API-KEY: $FINTEL_API_KEY" \
  "https://api.fintel.io/v1/securities/us/AAPL/short-volume" | python3 -m json.tool
```

- Success responses are JSON; some carry a `meta` object (warnings,
  freshness, status). Surface `meta.warnings` to the user when present.
- Errors return `{"error": {"code": "...", "message": "..."}}` — e.g.
  `unauthorized` (bad/missing key), `403` (dataset not enabled for the
  account, common for short-interest), `503 not_available` (ranking
  service down — retry later, don't treat as empty data).
- Usage is metered per account — batch thoughtfully; don't poll.

---

## Step 5: MCP Alternative (Optional)

For MCP-native setups, the same tools are discoverable from the official
server (tool names like `fintel.get_short_interest`,
`fintel.get_security_owners` — REST parity, same entitlements):

```bash
claude mcp add --transport http fintel https://mcp.fintel.io/mcp --header "X-API-KEY: your_key_here"
```

Prefer REST via curl when shell access is available — it needs no setup
beyond the key. Use MCP when the user explicitly asks for it or shell
access is restricted (note: neither works on Claude.ai's sandbox).

---

## Step 6: Respond to the User

- Format numbers cleanly: prices to 2 decimals, percentages to 1-2
  decimals, share counts with commas or abbreviations (2.3M, 1.1B).
- For short data: put it in context: short interest as % of float, days to
  cover, borrow fee trend direction. Report what the numbers are. Do not
  call a pattern a squeeze setup and do not predict price moves.
- For ownership/insiders: use tables (holder, shares, change, date).
  Distinguish buys from sells and option exercises in Form 4 data.
- Note the data source: "Fintel" with dataset provenance (SEC 13F, Form
  3/4/5, NYSE/NASDAQ short reports) when relevant.
- Never turn the data into a trading recommendation, price target, or
  squeeze call — present facts and let the user draw conclusions.
- Return this layout: (1) a one-line header with ticker, country and the date you pulled the data;
  (2) one short table or list per dataset asked for (short interest and borrow, top holders,
  insider filings, analyst targets, dividend dates), each with its source and as-of date;
  (3) a "Not available" line for any dataset that returned 403 or empty, with the reason;
  (4) a closing line: check the filings at the source before you act, and pair this with an
  earnings or dividend calendar if timing matters.

---

## Reference Files

- `references/api-reference.md` — full REST endpoint reference: all GET
  endpoints with parameters, defaults, limits, error semantics, MCP tool
  name mapping, and curl examples.
