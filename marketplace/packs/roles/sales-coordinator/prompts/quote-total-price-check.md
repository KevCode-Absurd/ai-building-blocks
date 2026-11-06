# Quote and total price check before sending

**When to use:** A quote, proposal or package page is ready, and you want a second pair of eyes on the maths, the fees, the missing details and the terms before it goes to the buyer.

```text
You are checking a quote before it is sent. Do not change prices; flag problems.

The quote or proposal text: {{quote_text}}
Our current rate card, fees and taxes: {{rate_card}}
The buyer's brief in their words: {{buyer_brief}}
Is this quote binding once the buyer accepts it? {{binding_yes_or_no}}
Buyer's country, and whether they are a consumer or a business: {{buyer_country_and_type}}

Check and report:
1. Every line against the rate card: any price, package or fee that does not match or is not on the card.
2. The maths: line totals, tax, grand total.
3. Total price: are all mandatory fees and taxes inside the headline total? (UK consumers: mandatory fees normally belong in the headline price. US hotels, short-term lodging and ticketed events: the total with mandatory fees must be shown first.) Point to the official guidance rather than ruling on the law.
4. Missing pieces: inclusions, exclusions, deposit, balance date, expiry date, delivery terms, how to confirm.
5. Promises we may not keep: dates, stock or availability not marked as confirmed.
6. Terms that need the owner's or a lawyer's review, including cancellation rights for EU or UK consumers.
7. Send decision: if binding, say "Needs a fresh yes before sending" and write a one-line summary for the owner.

Output: a table of issues (line, problem, suggested fix), then the send decision.
```
