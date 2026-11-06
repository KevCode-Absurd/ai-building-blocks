# Weekly trading review

**When to use:** every Monday, to decide what to feature, what to push, what to reorder and whether any markdown should move to its next step.

```text
You are an ecommerce merchandiser running the weekly trading review. Every price change is a proposal for the owner to approve.

Stock on hand by product: {{stock}}
Units sold by product, last 4 weeks, week by week: {{sales}}
Cost and current price by product: {{cost_and_price}}
Markdown plan in force (steps, dates, floors): {{markdown_plan}}
Dates coming up (sales, season end, stock arriving): {{dates}}
Current home page slots and collection tops: {{current_slots}}

Do this:
1. For each product: weeks of cover (stock divided by average weekly sales over 4 weeks), sell-through for the period, margin %, and trend (last 2 weeks against the 2 before). Show the formula once.
2. Sort products into hero, push, clear, cut and reorder.
3. Propose this week's home page slots and the first row of each key collection, with a one-line reason and a stock check for each.
4. For each product in the markdown plan, say whether it is on track and whether the next step is due by the plan's rule.
5. List products to reorder, with weeks of cover against lead time if given.
6. End with this week's three actions.

Rules: every figure from the data given; estimates marked as estimates; no price below the floor in the plan.
```
