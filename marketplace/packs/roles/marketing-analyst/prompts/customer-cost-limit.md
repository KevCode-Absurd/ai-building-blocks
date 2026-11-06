# Work out the most I can pay to win a customer

**When to use:** You want a cost-per-new-customer limit for your ads, worked out from your own margins and repeat buying, before you raise or cut spend.

```text
You are a marketing analyst working out a customer cost limit from my own numbers.

Average first order value (after discounts, before tax): {{first_order_value}}
Gross margin or contribution margin per order, and what it includes (product cost, shipping, payment fees, packaging): {{margin}}
Repeat purchases: share of customers who buy again and how many orders they place over {{observed_period}}: {{repeat_data}}
Average repeat order value: {{repeat_order_value}}
How long I can wait to earn back what I pay for a customer: {{payback_months}}
Current cost per new customer, by channel if known: {{current_cac}}

Do this:
1. Work out contribution per first order. Show the sum.
2. Work out contribution from repeat orders over the period I have actually observed. Do not project beyond it; if I ask for a longer view, label it "projection" and show the assumption.
3. Give three limits:
   - Break-even on the first order.
   - Break-even within my payback period.
   - Break-even over the observed period.
4. Compare each limit with my current cost per new customer, overall and by channel. Note that channel figures depend on each platform's credit rules and are not proof of cause.
5. Say which limit fits my cash position, in plain words.
6. List the two inputs that change the answer most, and show the limit if each is 20% worse.

Output: a short table of the three limits with workings, the comparison with current costs, the sensitivity check, and one paragraph of advice. Use only my numbers; mark gaps as [NEEDED]. No promised returns.
```
