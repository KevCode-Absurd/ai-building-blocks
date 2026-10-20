# Aswath Damodaran: his valuation toolkit

His method, in our own words, so you can run it step by step. Each rule is tagged to the sources. Numbers shown "as of" are dated snapshots, not live data: pull current inputs from the data pages on his Damodaran Online site. None of this is advice to buy or sell anything. It is a way to work out what something is worth and what a price assumes.

## Step 0: value or price?

Value is what the cash flows, growth and risk justify. Price is what buyers pay today, driven by supply, demand and mood [S2][S3]. If your end value is a multiple of earnings, a target return or the last funding round, you are pricing [S6][S8]. Both are fair games. Do not blend them in one number.

## The value bridge: operating assets to value per share

In this order [S3][S7][S10]:

1. Value the operating assets: the present value of free cash flows to the firm, including terminal value.
2. Add cash and marketable securities, at face value by default.
3. Add stakes in other firms and idle assets, valuing each stake if you can.
4. Subtract all debt, leases, unfunded pension and health promises, and minority interests.
5. Subtract employee options already granted, valued with an option model [S2][S4][S10].
6. Divide by shares in issue, including restricted stock already granted [S10].

Amazon, February 2000 (his figures): operating assets $15,170 million, plus $26 million cash, less $349 million debt gives equity of $14,847 million. Options were worth $2,892 million. That leaves $11,955 million for common stock, or $35.08 a share [S4].

## Free cash flow and reinvestment

Free cash flow to the firm (FCFF) is after-tax operating income, minus net capital spending, minus the rise in working capital, before debt payments. Discount it at the cost of capital. Firm valuation is easier than equity valuation when borrowing will change, since you need not forecast debt flows [S3][S7]. Forecast operating income from the story, not last year's results [S9]. Treat stock pay as a real cost, never an add-back [S10].

Reinvestment rate = (capital spending minus depreciation plus change in working capital) divided by after-tax operating income. It is the price of growth [S8].

## Growth = reinvestment rate times return on capital

Growth from new investment is the reinvestment rate times the return on capital. Growth that earns the cost of capital adds nothing, growth above it adds value, growth below it destroys value [S7][S8].

Worked example 1 (his Inferno slides): a firm earns $120 million after tax and its cost of capital is 10%. No growth: $120 / 0.10 = $1,200 million. Grow 2% at a 10% return, so reinvest 2/10 = 20%: free cash flow $96 million, and $96 / (0.10 - 0.02) = $1,200 million. Grow 3%, reinvest 30%: $84 / 0.07 = $1,200 million [S7]. Same value. (Our arithmetic: at a 15% return the 2% case reinvests 13.3% and is worth about $1,300 million.)

High growth fades fast toward the economy's rate, and size makes it harder to hold [S7][S9]. For young firms, whose margins are still moving, he swaps this formula for revenue growth, a target margin and sales per dollar of capital (below) [S4][S9].

## Terminal value rules

The terminal value covers everything after the forecast [S8]:

1. Close in one of three ways: perpetual growth, a growing annuity (a stream for a set number of years), or liquidation value.
2. Never close with a peer multiple. Convert your own inputs into an intrinsic multiple if you want one.
3. Cap stable growth at the economy's growth. His practical cap is the risk-free rate you used, or at most one point above. Near the discount rate the value explodes; above it, it turns negative.
4. Tie reinvestment to growth: terminal reinvestment rate = stable growth / stable return on capital. Capital spending equal to depreciation means growth for free.
5. Make the end year mature: beta near 1, debt near the industry norm, industry margins [S7].
6. A big terminal value is not a flaw. What matters is that the end year is realistic.
7. Allow an excess return only if you state it. Amazon in 2000 used a 20% return and 6% growth, so a 30% reinvestment rate [S4][S8].

## The cost of capital, step by step

1. **Risk-free rate.** Default-free, in the same currency and real or nominal terms as the cash flows [S7]. Since the April 2025 US rating cut he subtracts the US default spread from the 10-year Treasury yield [S20]. January 2026: 4.18% yield, 0.23% spread, 3.95% risk-free [S20]. For another currency, take the local government yield minus its default spread (his 2010 rupee case: 8% minus 3% is 5%) [S7]. Keep flows and rates in one currency and value should not depend on the choice [S9].
2. **Equity risk premium (ERP).** The extra return stocks are priced to earn over safe bonds. He takes it from the market: set today's index level equal to the present value of expected cash returned to holders (dividends plus buybacks), growing near term and then at a stable rate. Solve for the discount rate. That is the expected stock return. Subtract the risk-free rate [S20][S23]. On 1 January 2026 the S&P 500 stood at 6845.5, implied return 8.41%, premium 4.23% over the Treasury yield (our subtraction from the default-free rate: 4.46%). At a 2% premium that index would be worth about 14,834, and at 6% about 4,790, so value is touchy to this input [S20]. As of 1 October 2026: 3.70% over a 5.29% Treasury yield, implied return 8.99% [S23]. Pull the latest month from his data page.
3. **Country risk.** Country premium = the country's default spread times the ratio of equity volatility to bond volatility. Weight by where the firm earns and operates, using a lambda: its revenue share from the country over the average firm's share (his Chippewa case: 20% / 77% = 0.26) [S7].
4. **Beta, bottom-up.** Not one stock's regression beta. Average the unlevered betas (debt stripped out) of many peers, weight by business value, then re-lever: levered = unlevered x (1 + (1 - tax rate) x debt-to-equity) [S7][S11]. His Tata Chemicals case: 42% at 1.05 and 58% at 0.86 gives 0.94 [S7].
5. **Cost of equity** = risk-free + beta x ERP, plus lambda x country premium where it applies. No small-cap or illiquidity premiums: they come from noisy history, overlap, and small firms grow out of them [S7].
6. **Cost of debt** = risk-free + default spread for the rating. With no rating, build a synthetic one from interest coverage (operating income / interest expense) [S7][S24]. As of January 2026, large non-financial firms, coverage then rating and spread: 8.5+ AAA 0.40%; 6.5 to 8.5 AA 0.55%; 5.5 to 6.5 A+ 0.70%; 4.25 to 5.5 A 0.78%; 3 to 4.25 A- 0.89%; 2.5 to 3 BBB 1.11%; 2.25 to 2.5 BB+ 1.38%; 2 to 2.25 BB 1.84%; 1.75 to 2 B+ 2.75%; 1.5 to 1.75 B 3.21%; 1.25 to 1.5 B- 5.09%; 0.8 to 1.25 CCC 8.85%; 0.65 to 0.8 CC 12.61%; 0.2 to 0.65 C 16%; under 0.2 D 19% [S24]. Tax shield at the marginal rate. Keep "debt" narrow, since vague items lower the cost of capital and inflate value [S7].
7. **Weights.** Market values, not book, with leases as debt [S21]. Don't freeze an off-target debt ratio: his Hormel case fell from 7.0% with no debt to about 6.57% near 30% debt [S7].
8. **Blend.** Equity weight x cost of equity + debt weight x after-tax cost of debt. Invented illustration (ours): 70% at 9% and 30% at 5% pre-tax with 25% tax gives 6.3% + 1.125% = 7.43%.
9. **Plausibility.** As of early 2026, 80% of US firms had a dollar cost of capital between 5.26% and 9.88%, and globally 6.28% to 11.66%. A US firm at 14% is above the 90th percentile and goes on his suspect list. Don't fine-tune inside the band [S21].
10. **Project hurdle rate.** Match it to the return you measure: cost of equity for equity returns, cost of capital for returns before debt. Use the beta of the investment, not of the company doing it. Let it fall as the business ages (a small global AI start-up: 11.66% falling toward 8.65%) [S21].

Survival worries go in a failure chance, not a higher rate [S6][S9].

## Valuing young or loss-making firms

1. **Revenue.** Start from the total market, choose a share, let growth shrink as size grows. Check dollars against the market and the biggest rival: his Amazon reached $39 billion by year ten, against Barnes and Noble's $2.98 billion [S4].
2. **Target margin.** Use what the real business earns when mature (Amazon as a retailer: about 10% pre-tax by year ten, from -36.7%), and draw a path. Research and long-term marketing are expensed, which understates early profit [S4].
3. **Reinvestment.** Each year = change in revenue / sales-to-capital. Amazon used 3.00. Check the implied return on capital ends sensible (20.39% in year ten) [S4]. Worked example 2 (ours): revenue up $6 billion at 3.0 means $2 billion invested.
4. **Fading cost of capital.** Uber 12% to 8% [S13]; Facebook above 11%, falling [S9].
5. **Failure chance, kept apart.** Expected value = going-concern value x (1 - p) + distress value x p. His Secure Mail case: $177.56 million x 0.6 + 0 = $106.54 million. Uber 2014 used 10% [S6][S13]. Of 1998 start-ups, about 82% lived to year one, about 44% to year seven, and only about 25% of information firms [S6].
6. **Checks.** Revenue against the market, margin against the industry, implied return on capital against the cost of capital [S4][S9].
7. **A range.** Terminal value can be 90% to 100% or more of today's value, so ask: will it survive, when will it be stable, and what will it look like [S6]?

The venture capital method takes forecast earnings, applies today's multiple and discounts at 50% or so. His example: $200 million in three years at 50% is $59.26 million. The multiple is pricing, and the high rate hides survival risk and never falls as the firm matures [S6].

## Narrative to numbers, and possible, plausible, probable

His chain, as run for Uber [S13]: one-sentence story; market size; market growth; share; the slice of revenue kept; mature margin; reinvestment; fading cost of capital; failure chance. Test each block as possible, plausible or probable. For any new market ask: is there a reason to switch, can users beat inertia, will incumbents fight back [S12]. Go segment by segment, and note whether network effects are local (city winners) or global [S12]. Value the merely possible as an option with a dollar range, not inside the base ($2 to 3 billion for Uber and car ownership) [S12][S13]. Insider knowledge raises odds; it is not proof [S12].

Reverse-engineer a price: Uber at about $17 billion needed a market roughly three times bigger or a share above 20% [S13]. After each news item say whether it breaks the story, shifts it or tweaks it [S16].

## Breakeven revenue: reading a price backwards

His December 2025 recipe [S22]:

1. Start from the market cap.
2. Use a simple equity model of a mature firm growing at or below the economy.
3. Inputs: cost of equity (about 8% for the S&P 500 in November 2025, 9% to 12% for riskier stocks, 6% to 7% for safer), inflation 2.5%, stable nominal growth 4%, and a net margin and return on equity to set profit and reinvestment.
4. Solve for steady-state revenue, adjusted for the wait and a lower cash yield while it grows.
5. Place that revenue five years out and find the growth needed.
6. Run possible, plausible, probable on it.
7. Add up every competitor's breakeven revenue. If the total beats the market, prices are too high in aggregate, even if each looks possible alone.

Snapshots: Nvidia at $5 trillion needed about $483 billion of steady-state revenue, or about $678 billion with five years of growth at a 53% net margin; Tesla, at a 5.31% margin, over $2.2 trillion [S22]. Highly priced is not the same as overpriced [S22].

## Relative valuation done right

Find comparables, scale prices by a common measure, adjust for growth, risk and cash flow [S3][S5]. Four tests [S5]:

- **Definition.** Equity value goes with equity measures (price to earnings), firm value with firm measures (enterprise value to EBITDA). Same definition and year-end for every firm.
- **Description.** Look at the whole market spread, not only your sector. Use medians and percentiles. Dropping loss-makers biases the average up.
- **Analysis.** Every multiple rests on cash flow, growth and risk. For a stable firm, price to earnings = payout x (1 + g) / (cost of equity - g). Compare growth for price to earnings, return on equity for price to book, margin for price to sales.
- **Application.** A comparable has similar cash flows, growth and risk, not just the same sector. With few peers, widen the pool and use a regression.

Use multiples to sanity-check a DCF, not as the answer [S13].

## Private businesses

Same method, harder inputs [S11]:

1. **Owner pay.** Restate operating income after a market salary for each role the owner plays, and strip personal costs.
2. **Beta.** Bottom-up from public peers, re-levered at a target debt ratio. 0.90 unlevered with 25% debt-to-equity and 40% tax gives 0.90 x (1 + 0.6 x 0.25) = 1.04.
3. **Total beta.** If the buyer holds the business as most of their wealth, divide beta by the correlation with the market (0.90 / 0.50 = 1.80). Use it only if the likely buyer is that undiversified.
4. **Illiquidity discount.** It depends on firm and buyer. Rules of thumb run 20% to 30%; restricted-stock studies average 33% to 35%. Larger, profitable firms with easy-to-sell assets deserve less.
5. **Key person.** If the owner is the business, discount [S6].
6. **Terminal value.** If the owner won't sell, assume continuation; otherwise a sale or liquidation.
7. **Control.** Control value = value run best minus value as run. Near zero for well-run firms. No flat 20% premium. Weight the chance management truly changes (Hormel: 10% chance, so $31.91 x 0.90 + $37.80 x 0.10 = $32.50) [S7].

## Decline and distress

In the data he shows, roughly a quarter to two fifths of firms had falling revenue, yet analysts almost never model negative growth [S8].

Worked example 3 (his terminal value slides): $100 million after-tax operating income next year, 10% cost of capital, growth of -5%. With no asset sales: 100 / (0.10 + 0.05) = $666.67 million. If it sells assets earning a 7.5% return, reinvestment is -5% / 7.5% = -66.7% (cash comes out), and the firm is worth about $1,111 million [S8]. Shrinking can release cash worth more than the flows those assets would make.

Cost of denial: a mature firm earning $100 million with no growth is worth $1 billion at 10%. In his example, chasing 5% growth at a 5% return cut it to about $792 million [S18]. Cheap-looking firms that keep spending to regain growth (Cisco, Microsoft and Merck for a decade) are value traps [S18]. For Microsoft in fiscal 2013 he valued the existing businesses with no growth near $270 billion and read the market as pricing in value destruction [S18].

For firms that may fail, weight going-concern and distress value by the chance of failure, backed out of bond prices or ratings. Las Vegas Sands (February 2009): about a 13.5% annual default chance, so ten-year survival near 23% [S6][S7]. For holding companies, add up the parts, less debt, and compare with market value [S19].

## Options, dilution and share counts

Worked example 4 (class quiz): firm value $2,000 million, debt $1,000 million, 100 million shares at $10, plus 10 million at-the-money options. Fully diluted: $1,000m / 110m = $9.09 (too low). Treasury stock method: $1,100m / 110m = $10.00 (too high). Option-value method: options worth $5.42 each, $54.2 million in all, leaving $945.8 million, or $9.46 a share [S2].

For future share sales by young firms, pick one method, never both: keep today's count and let early losses cut value, or forecast new shares at forecast prices [S10]. Issuing above value helps current holders; below hurts them [S10].

## Common DCF mistakes he names

- Trailing numbers instead of the story [S9].
- Growth above the economy forever, or growth with no reinvestment [S8].
- A peer-multiple close, his "Trojan Horse" [S8].
- Regression betas, build-up premiums, book cost of debt [S7].
- Vague debt, or a frozen debt ratio [S7].
- Mixed real and nominal flows or currencies [S7][S9].
- All uncertainty stuffed into the discount rate [S6][S9].
- Your macro view leaking into a company value [S7].
- Stock pay added back, dilution counted twice [S10].
- A flat control premium [S7].
- Decimals that fake precision [S15].
- More inputs than you can explain [S2][S9].
