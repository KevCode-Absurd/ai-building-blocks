---
name: options-flow-analyzer
description: Real vs lottery call separation for options P/C ratio analysis — prevents signal inversion from deep OTM noise
category: finance
risk: safe
source: community
source_type: community
date_added: "2026-05-13"
author: tellmefrankie
tags: [options, sentiment-analysis, trading, polygon, market-analysis]
tools: [websearch]
---
# Options Flow Analyzer

Analyze options chain data with real vs lottery call separation — the key insight that prevents P/C ratio misinterpretation. Uses Polygon.io API.

## When to Use

- Use when raw put/call ratios appear bullish or bearish but may be distorted by cheap deep OTM contracts.
- Use when comparing options flow across watchlists, holdings, sectors, or event-driven names.
- Use when you need to separate institutional hedging from speculative lottery-ticket activity.
- Use when tracking options anomalies against a recent baseline.

## When Not to Use

- The user wants to know what to buy or sell, or when to time a trade. This skill reads options activity only and gives no advice.
- There is no Polygon.io key and no options data to paste in. Do not make up numbers.
- The user wants a view of one stock's price and news. Use a price and news check first.

## What it does

Standard P/C ratio analysis can be misleading. A low P/C can look "extremely bullish" when most of the volume is lottery calls ($0.01-$0.09 OTM options).

This skill separates:
- **Real calls**: Strike price within 5% of stock price, meaningful premium
- **Lottery calls**: Deep OTM, cheap premium, speculative bets
- **Real puts**: Actual hedging activity
- **Lottery puts**: Cheap downside bets

## Analysis Output

For each ticker:
- Real P/C ratio (excludes lottery noise)
- Lottery percentage (what % of volume is speculation)
- Per-expiry breakdown (weekly vs monthly vs LEAPS)
- Anomaly detection: P/C shifts >0.3, Call OI surges >30%, IV spikes >20%
- Sentiment classification: Bullish/Bearish/Neutral with confidence

## Example Output

_Illustration only. Every ticker, price and ratio below is made up to show the layout. Never present them as live or verified data. Use only data you pulled from Polygon.io or that the user pasted in._

```
Options Flow Summary — 2026-05-13

HOLDINGS:
CEG  $299.69 | Raw P/C: 1.06 | Lottery: 61% | Adj P/C: 2.72  BEARISH (was neutral raw)
IREN $55.15  | Raw P/C: 0.83 | Lottery: 34% | Adj P/C: 0.55  BULLISH
KTOS $56.99  | Raw P/C: 0.53 | Lottery: 28% | Adj P/C: 0.38  EXTREME BULLISH
RXRX $3.26   | Raw P/C: 0.38 | Lottery: 84% | Adj P/C: 2.37  BEARISH (was extreme bullish raw)

SECTORS:
XLI  | Raw P/C: 5.32 | Lottery:  8% | Adj P/C: 4.89  INSTITUTIONAL HEDGE

ANOMALIES:
XLI: P/C 5.32 vs 30-day baseline 0.87 — 4.5 std deviations above normal
RXRX: 84% lottery calls — raw P/C signal completely inverted after filtering
```

## Configuration

```
Analyze options flow for my watchlist:
Holdings: CEG, IREN, KTOS, RXRX, TEM
Sectors: SPY, QQQ, XLI, XLK
Separate real vs lottery calls (threshold: premium < $0.10, delta < 0.05).
Flag anomalies vs 30-day baseline.
```

## Requirements

- Polygon.io API key (free tier covers basic data; paid tier for full chain). Keep the key out of shared or logged chats: set it as an environment variable or in your tool's secrets settings.
- WebSearch for cross-verification

## Limitations

- Options data can be delayed, incomplete, or unavailable depending on the Polygon.io plan.
- Heuristics such as premium and delta thresholds need adjustment for ticker price, volatility, and expiry.
- Sentiment classifications are analytical signals, not financial advice or trade recommendations.
- Always cross-check unusual flow against price action, news catalysts, liquidity, and risk controls.

## Why the split matters

A raw put-call ratio counts cheap far out-of-the-money contracts the same as real positions. Splitting them out shows where meaningful money went. The author describes finding this while managing a portfolio. Their results are not tested here, so check any signal against price, news and volume.

Author: tellmefrankie (see the credit on the item page).
