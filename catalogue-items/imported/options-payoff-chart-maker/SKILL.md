---
name: options-payoff
description: >
  Render an interactive options payoff chart — expiry P&L plus Black-Scholes theoretical
  value — with sliders for strikes, premium, IV, DTE, and spot. Use this skill whenever
  the user describes or shares an options position or strategy and wants to see how it
  makes or loses money: vertical, calendar, diagonal, or ratio spreads, butterflies,
  condors and iron condors, straddles, strangles, covered calls, protective or naked
  puts, or any multi-leg structure. This includes pasted strikes, premiums, and
  expiries, requests like "show me the payoff" or "draw the P&L curve", and broker
  screenshots (IBKR, TastyTrade, Robinhood). Use it even when details are partial —
  defaults fill the gaps.
---

# Options Payoff Curve Skill

The live-quote probe below is optional. If your host has not already executed it (for example, in Codex), run it only when the user wants a live price, and use the actual output; if shell access is unavailable, report that limitation and ask for the spot price. This skill is for learning, not for live trading decisions.

Generates an interactive HTML chart using the host's available visualization tool, or a standalone HTML file in Codex, showing:
- **Expiry payoff curve** (dashed gray line) — intrinsic value at expiration
- **Theoretical value curve** (solid colored line) — Black-Scholes price at current DTE/IV
- Dynamic sliders for all key parameters
- Real-time stats: max profit, max loss, breakevens, current P&L at spot

---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Step 1: Extract Strategy From User Input

When the user provides a screenshot or text, extract:

| Field | Where to find it | Default if missing |
|---|---|---|
| Strategy type | Title bar / leg description | "custom" |
| Underlying | Ticker symbol | none: ask the user. Never assume an index or ticker |
| Strike(s) | K1, K2, K3... in title or leg table | nearest round number |
| Premium paid/received | Filled price or avg price | none: required, ask the user. Never use a made-up premium |
| Quantity | Position size | none: required, ask the user |
| Multiplier | 100 for equity options, 100 for SPX | 100 |
| Expiry | Date in title | 30 DTE |
| Spot price | Current underlying price shown in the screenshot or text | live quote (see below); middle strike only if no quote is available |
| IV | Shown in greeks panel, or estimate from vega | 20% |
| Risk-free rate | — | 4.3% |

**Ask before you guess.** Premium and quantity are required. If either is missing, stop and ask the user for the real number before you draw anything. For the other fields, use a default only if the user cannot give one, and then show a visible "DEFAULTS USED" banner on the chart that lists each guessed value (premium, IV, spot, days to expiry). Never present a defaulted number as the user's real figure. When any default is used, also mark the stats cards "based on guessed values" and put "Educational only, not advice. Check every figure with your broker before you trade." on the chart.

**Spot for screenshots**: spot is the underlying's current price, and broker screenshots often omit it or show it far from the strikes — don't read it off the strike labels. Use the price shown, else a live quote (the SPX probe below, or yfinance for other underlyings). Fall back to the middle strike only when no quote is available, and tell the user you did.

**Current SPX reference price** (run this probe ONLY when the user has named SPX as the underlying. For any other ticker, do not run it: ask the user for the spot price, or run the same yfinance call with their ticker only if they ask for a live quote) (optional; this needs Python with yfinance, which reads an unofficial Yahoo data feed that may change or block requests. If it fails, ask the user for the spot price):
```
!`python3 -c "exec('try:\n import yfinance as yf\n p=yf.Ticker(\'^GSPC\').fast_info[\'lastPrice\']\n print(f\'SPX ≈ {p:.0f}\')\nexcept Exception:\n print(\'SPX price unavailable — check market data\')')"`
```

---

## Step 2: Identify Strategy Type

Match to one of the supported strategies below, then read the corresponding section in `references/strategies.md`.

| Strategy | Legs | Key Identifiers |
|---|---|---|
| **butterfly** | Buy K1, Sell 2×K2, Buy K3 | 3 strikes, "Butterfly" in title |
| **vertical_spread** | Buy K1, Sell K2 (same expiry) | 2 strikes, debit or credit |
| **calendar_spread** | Buy far-expiry K, Sell near-expiry K | Same strike, 2 expiries |
| **iron_condor** | Sell K2/K3, Buy K1/K4 wings | 4 strikes, 2 spreads |
| **straddle** | Buy Call K + Buy Put K | Same strike, both types |
| **strangle** | Buy OTM Call + Buy OTM Put | 2 strikes, both OTM |
| **covered_call** | Long 100 shares + Sell Call K | Stock + short call |
| **naked_put** | Sell Put K | Single leg |
| **ratio_spread** | Buy 1×K1, Sell N×K2 | Unequal quantities |

For strategies not listed, use `custom` mode: decompose into individual legs and sum their P&Ls.

---

## Step 3: Compute Payoffs

### Black-Scholes Put Price
```
d1 = (ln(S/K) + (r + σ²/2)·T) / (σ·√T)
d2 = d1 - σ·√T
put = K·e^(-rT)·N(-d2) - S·N(-d1)
```

### Black-Scholes Call Price (via put-call parity)
```
call = put + S - K·e^(-rT)
```

### Butterfly Put Payoff (expiry)
```
if S >= K3: 0
if S >= K2: K3 - S
if S >= K1: S - K1
else: 0
```
Net P&L per share = payoff − premium_paid

### Vertical Spread (call debit) Payoff (expiry)
```
long_call = max(S - K1, 0)
short_call = max(S - K2, 0)
payoff = long_call - short_call - net_debit
```

### Calendar Spread Theoretical Value
Calendar cannot be expressed as a simple expiry function — always use BS pricing for both legs:
```
value = BS(S, K, T_far, r, IV_far) - BS(S, K, T_near, r, IV_near)
```
For the expiry curve of a calendar (at the near expiry), the short near leg is settled at its intrinsic value, not zero: subtract max(S−K, 0) for calls or max(K−S, 0) for puts. The far leg is BS with its remaining time, T_far − T_near:
```
value_at_near_expiry = BS(S, K, T_far − T_near, r, IV_far) − intrinsic_near(S, K)
P&L = (value_at_near_expiry − net_debit) × quantity × multiplier
```
Check (call calendar, K = 100, 30 days left on the far leg, IV 20%, r 4.3%, debit 2): at S = 110 the far call is about 10.46, so P&L per share is 10.46 − 10 − 2 = −1.54. Leaving out the short leg's intrinsic value would wrongly show +8.46.

### Iron Condor Payoff (expiry)
```
put_spread = max(K2-S, 0) - max(K1-S, 0)   // short put spread
call_spread = max(S-K3, 0) - max(S-K4, 0)  // short call spread
payoff = credit_received - put_spread - call_spread
```

---

## Step 4: Render the Widget

When `visualize:read_me` is available, read modules `["chart", "interactive"]` before building and use `visualize:show_widget` to render. Otherwise use an available host visualization tool according to its documented interface. In Codex without an inline renderer, save a complete HTML document in the workspace, include the chart dependencies and CSS, verify it in a browser when available, and return a clickable file link. Preserve all controls and calculations below. Do not call tools that the host does not expose.

### Required Controls (sliders)

**Structure section:**
- All strike prices (K1, K2, K3... as needed by strategy)
- Premium paid/received
- Quantity
- Multiplier (100 default, show for clarity)

**Pricing variables section:**
- IV % (5–80%, step 0.5)
- DTE — days to expiry (0–90)
- Risk-free rate % (0–8%)

**Spot price:**
- Full-width slider, range = [min_strike - 20%, max_strike + 20%], defaulting to ACTUAL current spot

### Required Stats Cards (live-updating)
- Max profit (expiry)
- Max loss (expiry)
- Breakeven(s) — show both for two-sided strategies
- Current theoretical P&L at spot

### Chart Specs
- X-axis: SPX/underlying price
- Y-axis: Total USD P&L (not per-share)
- Blue solid line = theoretical value at current DTE/IV
- Gray dashed line = expiry payoff
- Green dashed vertical = strike prices (K2 center strike brighter)
- Amber dashed vertical = current spot price
- Fill above zero = green 10% opacity; below zero = red 10% opacity
- Tooltip: show both curves on hover

### Code template

Use this JS structure inside the widget, adapting `pnlExpiry()` and `bfTheory()` per strategy:

```js
// Black-Scholes helpers (always include)
function normCDF(x) { /* Horner approximation */ }
function bsCall(S,K,T,r,sig) { /* standard BS call */ }
function bsPut(S,K,T,r,sig) { /* standard BS put */ }

// Strategy-specific expiry payoff (returns per-share value BEFORE premium)
function expiryValue(S, ...strikes) { ... }

// Strategy-specific theoretical value using BS
function theoreticalValue(S, ...strikes, T, r, iv) { ... }

// Main update() reads all sliders, computes arrays, destroys+recreates Chart.js instance
function update() { ... }

// Attach listeners
['k1','k2',...,'iv','dte','rate','spot'].forEach(id => {
  document.getElementById(id).addEventListener('input', update);
});
update();
```

---

## Step 5: Respond to User

After rendering the widget, briefly explain:
1. What strategy was detected and how legs were mapped
2. Max profit / max loss at current settings
3. One key insight (e.g., "spot is currently [N] pts below the profit zone, expiring in [N] days")

Keep it concise — the chart speaks for itself.

---

## Reference Files

- `references/strategies.md` — Detailed payoff formulas and edge cases for each strategy type
- `references/bs_code.md` — Copy-paste ready Black-Scholes JS implementation with normCDF

Read the relevant reference file if you're unsure about payoff formula edge cases for a given strategy.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Bet price and odds reviewer](https://useaiblocks.com/skills/mispriced-bet-tester).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
