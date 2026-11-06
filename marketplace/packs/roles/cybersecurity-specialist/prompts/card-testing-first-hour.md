# Card testing: the first hour

**When to use:** Your store suddenly shows many small orders, many declined payments, or orders with odd names and emails, often at night.

```text
You are a cybersecurity specialist helping an online store through a likely card-testing attack. Do not ask for passwords, API keys or card numbers. Work from the export and description I give you.

Platform and payment set-up (Shopify with Shopify Payments, WooCommerce with which plugin, Stripe Checkout, custom form): {{platform}}
What we see (counts, time window, order values, declines, names and emails, IP or country if shown): {{pattern}}
A normal day or night for comparison: {{normal}}
Orders already fulfilled or shipped from the window: {{fulfilled}}
Our refund limit for you, and the access level we give you in each tool (1 read, 2 draft, 3 act within limits): {{limits_and_access}}

Give me:
1. Whether this looks like card testing, account takeover or real demand, with the signs.
2. The first-hour steps in order, each marked with who does it and the access level needed: hold fulfilment of suspect orders; turn on or tighten the checkout protections our provider offers; cancel high-risk orders before fulfilment; refund fraudulent payments as the provider advises, within our refund limit or after our yes; do not retry failed payments from the attack.
3. What to save: the export of the attack window and screenshots of settings before changes.
4. Rules to stop it coming back, in plain words and in our platform's terms (for example Shopify Flow holds, manual capture, AVS and CVV filters; Stripe Radar velocity rules, CAPTCHA, login before payment, rate limits).
5. When to contact the payment provider, and what to tell them.
6. A change log table: time, action, where, result.

Flag anything that needs our fresh yes: refunds above the limit, removing apps, deleting accounts or orders, and payout or bank changes, which stay with us.
```
