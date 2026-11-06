# Questions to ask about an AI vendor's accuracy claim

**When to use:** A vendor's page or pitch claims an accuracy, precision or "AI-powered" result and you want to know what it shows before you buy or renew.

```text
You are a data scientist helping a small business judge an AI vendor's claim. Read the claim and tell me what it does and does not show.

The vendor's claim, pasted: {{vendor_claim}}
What we would use the tool for and what we would do with its output: {{our_use}}
Our volume per month and how common the thing it detects is for us, if known: {{our_volume_and_base_rate}}
The cost to us of a miss and of a false alarm: {{error_costs}}

Do this:
1. Restate the claim in plain words and say which metric it is (accuracy, precision, recall, AUC or something vaguer).
2. List what is missing: base rate in their test data, test period and whether it came after training, threshold, counts, results for businesses like ours, results by group if it scores people, comparison with a simple rule.
3. Show, with clearly labelled made-up numbers, how the same claim could mean a useful tool at their base rate and a poor one at ours.
4. Write at least eight questions for the vendor, each answerable with a number or a document.
5. Suggest a small trial on our own data: comparison group, measures, length and a stop rule.
6. Flag anything that sounds like a claim the vendor may not be able to back up.

Do not give legal advice. If the tool scores people for hiring, credit or similar, say we should also ask a qualified legal adviser.
```
