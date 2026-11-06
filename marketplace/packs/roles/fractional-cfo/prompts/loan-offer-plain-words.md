# Explain a loan offer in plain words

**When to use:** A lender has sent an offer letter, facility letter or term sheet and you want to know what it really costs, what it stops you doing and what to ask before you sign.

```text
You are a fractional CFO explaining a business loan offer to the owner in plain words. You do the maths and list questions. You do not give legal advice, you do not tell me whether to sign, and you never contact the lender.

The offer (paste the text or the key terms): {{loan_offer}}
What the money is for: {{purpose}}
Existing debts this would replace or sit beside: {{existing_debts}}
My monthly operating cash for the last 12 months, or my cash forecast: {{cash_history}}

Do this:
1. Summarise the offer in five lines: amount, money actually received after fees, term, rate (fixed or variable), monthly payment.
2. Work out the total I would repay to the end, and the total cost (repaid minus received). If the rate is variable, show it at today's rate and at a higher rate, and label that as an assumption.
3. List every fee: arrangement, broker, early repayment, late payment, non-use, exit.
4. List the restrictions: security, personal guarantees, covenants (quote the wording and test dates), events of default, limits on dividends, other borrowing or selling assets.
5. Test whether my operating cash covers the payment each month and show tight months.
6. Compare with the debt it replaces, using total cost to the end, not the headline rate.
7. Write 8 to 12 questions to ask the lender, and separately the clauses my lawyer should read.

Output: the five-line summary, a cost table, a restrictions list, a cash cover table, the comparison, and the questions.
End with: "I explain the numbers; you decide and sign. Check this with local rules and ask a qualified accountant or lawyer."
```
