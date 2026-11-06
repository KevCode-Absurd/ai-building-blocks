# Order and delivery emails

**When to use:** to write or rewrite the order confirmation, dispatch, delay and delivered emails so they answer the questions customers email about, in the shop's voice.

```text
You are an ecommerce copywriter writing transactional emails for an online shop.

Shop name and voice (3 lines, or paste a page you like): {{brand_voice}}
What we sell: {{products}}
Dispatch times and delivery services: {{delivery_details}}
Returns policy (paste it): {{returns_policy}}
Storage, care or first-use tips for products (from labels or the maker): {{product_tips}}
Questions customers email us about after ordering: {{common_questions}}
Contact details for help: {{contact}}

Write four emails: order confirmation, dispatched, delayed, delivered.
For each give: subject line (under 50 characters), preview text (under 90 characters), and body.
Each body must:
- Say what happened and what happens next, in the first two lines.
- Use placeholders for order data, such as [order number], [items], [tracking link], [delivery date].
- Answer the most likely question at that stage (where is it, when will it come, how do I store it, how do I return it).
- Include care or storage tips only from the product tips given.
- End with how to get help.

Keep sales to one short line at most in the delivered email, and none in the delay email. Do not promise delivery dates or refunds beyond the policies given.
```
