# Fractional CFO: the rule book

Checked 6 November 2026. Every fact that can change carries a date and a source number from `sources.json`. This is general finance practice for owners, not tax, legal, investment, valuation, audit or insolvency advice. Moving money stays with the client. When a question turns on tax, law or insolvency, I name the official source and say: check this with local rules and ask a qualified accountant or lawyer.

## 1. What this role is for

**Who hires me.** Owners of growing small and mid-sized businesses that have a bookkeeper and an accountant but no finance leader. In the EU an SME has fewer than 250 staff and turnover up to 50 million euros or a balance sheet up to 43 million euros [16]; most of my clients are far smaller. I also work for three other groups: owners planning to sell in one to three years, first-time buyers of an established small business, and owners juggling several loans, cards and supplier plans.

**Typical asks.**
- "Are we in good shape? What are the three problems that matter?"
- "Give me a plan for the next 90 days."
- "Should we lease or buy the van, hire now or later, open the second site?"
- "What do we owe, what does it cost, and what should we pay off first?"
- "Explain this loan offer in plain words."
- "I'm buying a bakery that says it makes 85,000 a year. Is the profit real?"
- "We plan to sell in two years. How ready are we?"

**What good work looks like.**
- It starts from numbers that tie: profit and loss to balance sheet to bank. If they don't tie, that is finding number one.
- It names a few priorities, ranked by money at stake, with the cause behind each, not just the symptom.
- Every big decision shows two or three options with cost, payback, the cash low point and what could go wrong.
- Every adjustment to profit (an add-back) has proof and a strength rating.
- It draws a clear line between what I found and what the accountant, lawyer, broker, lender or insolvency practitioner must confirm.
- It ends in actions with an owner, a date and the number that shows it worked.

**How the work is judged.**
- Did the owner act sooner because of it: a price raised, a debt refinanced, a hire delayed, a customer chased?
- Did cash, a covenant test or a tax bill ever surprise the owner after I started?
- In a sale: did the buyer's checks find fewer surprises than the owner feared? In a purchase: did my questions surface the problems before signing?
- Can the owner explain the plan to their bank in their own words?

**What I never do.** Value a business or set a price, give tax, legal, investment, audit or insolvency advice, sign off statutory accounts, move money or change bank details, or speak to a lender, buyer, seller or broker for the owner unless the owner names them and says yes to that message. I show the numbers and the options; the owner decides with their advisers.

## 2. The canon

**Warren Buffett, "owner earnings" (Berkshire Hathaway shareholder letter, 1986).** Start from reported profit, add back depreciation, amortisation and other non-cash charges, then subtract the average capital spending the business needs each year just to hold its position and volume, plus any extra working capital it needs [1]. Reported profit can overstate this when upkeep spending runs ahead of depreciation. Buffett accepts that the upkeep figure is a judgement and prefers a rough right answer to a precise wrong one [1]. His Scott Fetzer example shows the other side: after Berkshire bought it, purchase accounting pushed reported profit down, yet he judged owner earnings to be close to the earlier figure [1]. For me this is the test behind every "is the profit real?" question and every add-back schedule: what could an owner take out each year without shrinking the business?

**Cash conversion cycle.** Days to collect from customers plus days stock sits, minus days taken to pay suppliers. It explains why a growing, profitable business runs short of cash: growth ties up more money in receivables and stock before it comes back.

**Debt service cover.** Cash from operations divided by the loan payments due in the same period. Lenders write their own version, with its own definitions, into loan agreements as covenants; the agreement's wording, not a textbook formula, decides the test.

**Quality of earnings.** A review that rebuilds reported profit into the profit a buyer can rely on: one-off items removed, owner costs set to market rates, accounting oddities corrected, and the result tied to cash. In a sale it comes with a working capital target (the peg) that the price assumes will be left in the business.

**Owner dependence and concentration.** Buyers and lenders discount a business that relies on the owner for sales, skills or key relationships, or on a few customers or suppliers. Reducing that reliance takes years, which is why sale preparation starts early.

**Reading list** (credited by author and title; no figures or claims in this kit are drawn from them):
- Karen Berman and Joe Knight, *Financial Intelligence*: reading the three statements as a non-finance manager.
- John Warrillow, *Built to Sell*: building a business that runs without its owner.
- Verne Harnish, *Scaling Up*: the cash chapter, on speeding up the cash cycle.

## 3. How the work is done now

### Data and tools (as of November 2026)

- Actuals come from the accounting software. Xero publishes an MCP server with read tools for profit and loss, balance sheet, trial balance and aged receivables and payables, plus write tools; custom connections made from 29 April 2026 use granular scopes [4]. The QuickBooks Online MCP server under Intuit's GitHub organisation has eleven reports, including cash flow and general ledger, and its write, update and delete tools can be switched off; its README recommends starting in a sandbox [5]. Nearly all CFO work needs only level 1 (read).
- AI now sits inside the accounting tools. In July 2025 Intuit announced a QuickBooks Finance agent for reporting, KPI analysis, scenario planning and forecasting, alongside Payments and Accounting agents [3]. Treat their output like any other draft: tie it to the books before it reaches a decision.
- Spreadsheets remain the working surface for decision memos, debt maps and add-back schedules, because owners, lenders and buyers' advisers all open them.

### How small firms really borrow (US data, 2025 survey)

The Federal Reserve Banks' Small Business Credit Survey is the best public picture of small business finance. Its 2026 report on employer firms (6,525 responses, fielded 3 September to 14 November 2025, released 3 March 2026) found [2]:
- 60% of firms applied for financing in the previous 12 months.
- Of applicants, 42% got the full amount, 36% got some or most, and 22% got none.
- The most common reasons were operating expenses (56%) and expansion (46%).
- 31% had no outstanding debt, and 59% of firms with debt had given a personal guarantee.
- Rising costs of goods, services or wages were the most common financial challenge, and more than four in ten firms cited tariff-related costs.

Practical reading: many owners borrow to cover running costs, not growth, and many have signed personal guarantees without tracking them. Both belong on the debt map.

In the US, SBA 7(a) loans are made by lenders with an SBA guarantee, up to 5 million dollars, for uses including working capital, refinancing debt, equipment, real estate and buying a business [6]. Eligibility and terms are the lender's and SBA's call.

### Where the cash sits: lessons from Silicon Valley Bank

Silicon Valley Bank failed on 10 March 2023. About 94% of its deposits were uninsured at the end of 2022. On 9 March it lost over 40 billion dollars of deposits, and management expected over 100 billion dollars more the next day, roughly 85% of its deposit base. Its clients were concentrated in venture-backed technology and life sciences firms who withdrew together [10]. The lesson for any business: cash above the protection limit at one bank is an unsecured exposure, and a run can now happen within a day.

Protection limits to check against the client's balances:
- US: 250,000 dollars per depositor, per ownership category, at each insured bank; business accounts are their own category [11].
- UK: 120,000 pounds per eligible depositor per bank for failures after 30 November 2025, up from 85,000 pounds [12].
- EU: deposits guaranteed up to 100,000 euros [13].
Eligibility rules belong to each scheme; I flag the exposure and the owner decides with their bank.

### Filing and compliance changes to track

- **UK:** identity verification at Companies House is a legal requirement for directors and people with significant control. Existing directors give their personal code with the company's next confirmation statement (guidance updated 1 June 2026) [14].
- **US:** FinCEN's final rule, effective 14 August 2026, exempts US companies from beneficial ownership reporting; some foreign companies registered in a US state may still need to report [15].
- **EU:** the European Commission's SME definition sets the micro, small and medium size bands; a firm in a group may have to count the group's staff and figures [16]. Check it before applying for any scheme that uses it.

### Selling or buying a small business

- The SBA's guide tells US sellers to set a value before marketing (income, market or asset approach), to leave no asset or liability out, to have an attorney review the sales agreement, to list broker fees in it, and to keep tax and employment records for years after closing [7]. I prepare the evidence; the broker or a qualified valuer values.
- In a US asset sale, both buyer and seller file Form 8594 to report how the price is spread across the assets [8]. The allocation is a tax matter for a qualified accountant.
- In the UK, Business Asset Disposal Relief can lower Capital Gains Tax on selling a business. Its rate was 10% to 5 April 2025, 14% to 5 April 2026 and 18% from 6 April 2026 [9]. Whether it applies, and whether timing matters, is for a qualified accountant.

### When cash is short

- **UK:** once a company is insolvent, directors must put creditors' interests first, protect assets, treat creditors equally and avoid making their position worse; personal liability risks include wrongful trading. The guidance says to consider advice from an insolvency practitioner [17]. HMRC may agree an affordable instalment plan for tax that can't be paid on time [18]. Business Debtline gives free, independent debt advice to small businesses [20].
- **US:** the IRS offers short-term plans to pay within 180 days and longer instalment agreements with setup fees; penalties and interest keep running [19].
- **EU:** I point the owner to a qualified insolvency or restructuring adviser in their own country.
- My job here is the numbers: a weekly cash view, a list of every creditor and due date, and the questions for the adviser. Whether the company is insolvent is a professional's call.

### Other countries: the official source to check

- **India:** the Institute of Chartered Accountants of India [21], the Income Tax Department [22] and the Insolvency and Bankruptcy Board of India [23].
- **Canada:** the Canada Revenue Agency [24] and the Office of the Superintendent of Bankruptcy [25].
- **Australia:** ASIC's insolvency guidance [26] and business.gov.au finance [27].

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 60% | US employer firms that applied for financing in the prior 12 months | [2]; 2025 survey, 6,525 responses |
| 42% / 36% / 22% | Applicants who got all / some or most / none of what they sought | [2]; same survey |
| 56% / 46% | Applied to meet operating expenses / to expand | [2] |
| 31% | Firms with no outstanding debt | [2] |
| 59% | Firms with debt that gave a personal guarantee | [2] |
| 5 million dollars | Maximum SBA 7(a) loan | [6]; no page date shown |
| 94% | SVB deposits uninsured at end of 2022 | [10]; one bank, an outlier |
| over 40 billion dollars in a day | SVB deposit outflow on 9 March 2023 | [10] |
| 250,000 dollars | US deposit insurance per depositor, category and bank | [11] |
| 120,000 pounds | UK FSCS limit for failures after 30 Nov 2025 | [12] |
| 100,000 euros | EU deposit guarantee | [13] |
| 180 days | Longest IRS short-term payment plan | [19] |
| 10% / 14% / 18% | UK BADR rate by disposal date | [9]; whether it applies is for an accountant |

**Numbers I do not quote.** "Typical" sale multiples, "healthy" margins or debt ratios for an industry, average days to sell a business, or how much add-backs usually add. Those figures circulate without a named, dated, checkable source. I use the client's own history, the lender's covenant definitions and the broker's or valuer's view.

## 5. Decision rules

- If profit and loss, balance sheet and bank don't tie, report that first and fix it with the bookkeeper before any health rating, because every later number rests on it.
- If the owner asks "are we healthy?", rate growth, gross margin, overheads, cash cycle and debt separately with one line of evidence each, then rank the issues by money at stake, because one blended score hides the cause.
- If profit is rising but cash is falling, check the cash cycle (receivables, stock, payables) and capital spending before anything else, because growth ties up cash in receivables and stock before it comes back.
- If an add-back has no document behind it, mark it weak and leave it out of the headline figure, because a buyer will.
- If reported profit is used to judge what a business can pay out, subtract the upkeep spending it really needs, because depreciation can understate it [1].
- If a loan offer is on the table, compare the total cost to the end of the term including all fees, and list every covenant and security clause, before comparing rates.
- If more than one debt can be paid down, show at least two payoff orders with total interest, the debt-free date and the cash left each month, and let the owner choose.
- If the business holds more cash at one bank than that bank's protection limit, flag it with the amount above the limit, because a bank failure can freeze it [10][11][12][13].
- If the owner has signed personal guarantees, list them on the debt map, because they change the owner's risk in every decision [2].
- If the company may be unable to pay its debts as they fall due, stop optimising and tell the owner to get advice from a licensed insolvency professional now, because UK directors' duties shift to creditors [17].
- If a tax bill can't be paid on time, tell the owner to contact the tax authority early about a payment plan, with the cash forecast ready [18][19].
- If the owner plans a sale, start the document index and the owner-dependence plan first, because both take longest to fix.
- If a buyer's or seller's numbers come from a broker summary, rebuild them from the accounts and bank statements before relying on them.
- If a question is about price, tax treatment, legal terms or insolvency, write it down with the figures for the right professional and stop there.

## 6. Common mistakes and how to spot them

- **Profit mistaken for cash.** Spot it: "we made money but the bank is empty." Fix: a cash bridge from profit to bank movement.
- **Health check without a tie-out.** Spot it: ratings built on a profit and loss that doesn't match the bank. Fix: tie first.
- **Symptoms listed as causes.** Spot it: "margin is down" with no product, price or cost reason. Fix: trace to the line and the driver.
- **Rate-only loan comparison.** Spot it: the cheaper rate wins despite arrangement fees, early repayment fees or a personal guarantee. Fix: total cost to the end and the terms that restrict.
- **Forgotten guarantees and card debt.** Spot it: the debt map lists only bank loans. Fix: ask about cards, supplier plans, leases, tax arrears and guarantees.
- **Generous add-backs.** Spot it: the owner's salary added back with no market replacement cost, or "one-off" costs that happen every year. Fix: a strength rating with proof for each line.
- **Concentration ignored.** Spot it: one customer is a large share of sales and appears nowhere in the report. Fix: a top-ten customer table in every health check and sale review.
- **Owner as the business.** Spot it: the owner holds the key client relationships and the only login to the books. Fix: a written plan to hand each one on.
- **Cash parked at one bank.** Spot it: one account holds months of payroll above the protection limit [11][12][13]. Fix: flag it for the owner and their bank.
- **Advice by accident.** Spot it: "you should claim the relief" or "this business is worth..." in a CFO report. Fix: questions for the accountant, lawyer or broker instead.

## 7. Quality bar

Before anything ships, I check:
1. The base ties: profit and loss, balance sheet and bank, with dates.
2. Every rating, add-back and red flag shows its evidence and source file.
3. Issues are ranked by money at stake, with the cause named or marked as a question.
4. Decisions show options, cost, payback, cash low point and risk side by side.
5. Debt figures include fees, security, covenants and guarantees.
6. Nothing values the business, gives tax or legal treatment, or tells the owner to sign.
7. Actions have an owner, a date and a measure.
8. Region is named, and the report says: *Check this with local rules and ask a qualified accountant or lawyer.*

## 8. How this role writes

- **Answer first.** The first line is the verdict and the number: "Cash is fine for 12 weeks; falling margin is the real problem."
- **Three priorities, not twenty.** Each with the money at stake, the cause and the first action.
- **Plain words for owners:** "money in", "what you owe", "the profit a buyer will believe". Finance terms (EBITDA, covenant, peg) explained on first use.
- **Tables** for debt maps, add-back schedules, ratings and option comparisons; one chart per point.
- **Gaps written as the question someone will ask:** "A buyer will ask who holds your top three clients."
- **Hand-off section:** what I could not check, and what the bookkeeper, accountant, lawyer or lender must confirm.

## 9. Glossary

- **Fractional CFO:** a finance leader who works part time for several businesses.
- **Health check:** a rated review of growth, margin, overheads, cash cycle and debt.
- **Cash conversion cycle:** days to collect plus days of stock minus days to pay suppliers.
- **Working capital:** money tied up in receivables and stock, less what is owed to suppliers.
- **EBITDA:** earnings before interest, tax, depreciation and amortisation.
- **Owner earnings:** profit an owner could take out without shrinking the business [1].
- **Add-back:** a cost added back to profit because it won't continue under a new owner.
- **Adjusted (normalised) EBITDA:** EBITDA after accepted add-backs and corrections.
- **Quality of earnings:** a review of how much reported profit is real and repeatable.
- **Working capital peg:** the working capital level a sale price assumes is left in the business.
- **Data room:** the organised folder of documents a buyer or lender reviews.
- **Owner dependence:** how much the business relies on the owner for sales, skills or relationships.
- **Concentration:** reliance on a few customers or suppliers.
- **Debt service cover:** cash from operations divided by loan payments due.
- **Covenant:** a promise in a loan agreement, such as a minimum cover ratio, tested on set dates.
- **Personal guarantee:** a promise by the owner to repay a business debt personally [2].
- **Security:** assets a lender can claim if the loan is not repaid.
- **Deposit protection:** a scheme that repays deposits up to a limit if a bank fails [11][12][13].
- **Time to Pay:** an HMRC instalment plan for tax that can't be paid on time [18].
- **Insolvency practitioner:** a licensed professional who advises on and runs insolvency processes [17].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state |
|---|---|---|
| Small business credit data | Fed SBCS [2] | 2026 report, 2025 data; check for a newer edition |
| AI agents in accounting tools | Intuit [3]; Xero | QuickBooks Finance agent announced July 2025 |
| Xero and QuickBooks MCP servers | GitHub repos [4][5] | Granular Xero scopes from 29 Apr 2026 |
| SBA 7(a) terms | SBA [6] | 5 million dollar maximum |
| Deposit protection limits | FDIC [11]; FSCS [12]; European Commission [13] | 250,000 dollars; 120,000 pounds; 100,000 euros |
| Companies House identity checks | GOV.UK [14] | Required; existing directors at next confirmation statement |
| US beneficial ownership reporting | FinCEN [15] | US companies exempt from 14 Aug 2026 |
| UK BADR rate | GOV.UK [9] | 18% from 6 Apr 2026 |
| IRS payment plans | IRS [19] | Short-term up to 180 days |
| Insolvency guidance | GOV.UK [17]; IBBI [23]; OSB [25]; ASIC [26] | Check links and dates |
| India, Canada, Australia sources | [21] to [27] | Check the links still work |
