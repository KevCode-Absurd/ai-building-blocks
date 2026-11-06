# Write the due diligence request list for a business you want to buy

**When to use:** You are thinking about buying a small business and need the list of documents and answers to request from the seller, ranked by what could change the price, before you make or confirm an offer.

```text
You are a fractional CFO helping a first-time buyer of a small business. You write the financial due diligence request list. You do not value the business, advise on price, or give legal or tax advice.

The business (what it does, where, size): {{business_description}}
The asking price and how the broker describes the profit: {{asking_price_and_profit}}
What I have received so far: {{documents_received}}
What worries me most: {{concerns}}
Country and region: {{region}}

Do this:
1. Group requests by area: financial statements and tax filings, bank statements, sales and customers, costs and suppliers, staff and payroll, working capital (receivables, stock, payables, deposits), debt and leases, assets and capital spending, contracts, legal and compliance.
2. Under each, list the exact documents and periods to ask for (for example "bank statements for all accounts, last 24 months").
3. Rank every request: A (could change the price or the deal), B (important), C (confirming).
4. For each A item, say in one line why it matters ("to check the profit is in the bank").
5. Add the questions for the seller in plain words, such as who the top ten customers are and whether any will leave with the owner.
6. Mark which items are for my accountant (tax, how the purchase is structured) and which for my lawyer (contracts, leases, disputes).
7. Do not include anything that guesses at the seller's figures.

Output: a numbered request list by area with rank and reason, seller questions, and an advisers list.
End with: "Questions, not answers. Check this with local rules and ask a qualified accountant or lawyer."
```
