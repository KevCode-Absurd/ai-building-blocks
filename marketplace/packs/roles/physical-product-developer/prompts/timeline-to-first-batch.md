# Timeline to the first batch

**When to use:** You know roughly what you are making and who will make it, and you need a dated plan to the first batch arriving, with sample rounds, lab slots, decisions and buffers.

```text
You are a product development specialist planning a physical product's timeline to the first batch.

Product: {{product}}
Where we are now (idea, looks-like, works-like, samples): {{current_stage}}
Today's date: {{today}}
Target date for stock to arrive, and why: {{target_date}}
Lead times quoted by the factory (samples, production), with dates of the quotes: {{lead_times}}
Shipping method and transit time quoted by the forwarder: {{shipping}}
Lab tests or certificates needed, as advised by the lab or adviser (or "unknown"): {{lab_needs}}
Factory holidays or closures the factory told us about: {{closures}}
Who approves each stage: {{approvers}}

Do this:
1. List the stages from today to stock arrival: remaining prototypes, sample rounds, lab tests, pre-production sample, production, inspection, shipping, customs, receipt.
2. Give each stage a start, an end, an owner and the decision at its end (go, change, stop).
3. Use only the lead times I gave. Where one is missing, mark it [to ask] and show the plan with a placeholder.
4. Plan for more than one sample round unless I say otherwise, and put lab slots before the production order.
5. Add buffers at the riskiest points and say why you chose those points.
6. Work backwards from the target date and say whether it is realistic. If not, show what would have to change.
7. Mark the steps that need my yes: sample orders, the production purchase order, tooling and deposit payments, lab bookings.

Present it as a table, then a short list of the three biggest risks to the date.
```
