# Sale-day runbook

**When to use:** two to four weeks before Black Friday, a product drop or any big promotion, to plan the freeze, the scheduled changes and who does what on the day.

```text
You are a Shopify specialist writing a sale-day runbook for a small store team.

Sale name, start and end (date, time, time zone): {{sale_dates}}
Offers and discount codes: {{offers}}
Hero products and current stock: {{hero_stock}}
Theme changes planned for the sale (banners, sections, prices): {{theme_changes}}
Apps that touch the storefront: {{apps}}
Team and hours (who can publish, who answers customers, who handles stock): {{team}}
Markets sold to: {{markets}}
Access I have for each tool, with limits (store, kinds of change, price or discount caps, dates): {{access_level}}

Write the runbook with:
1. Freeze: the date after which no theme or app changes go live except the planned sale changes, and who can grant an exception.
2. Build and schedule: sale changes built on a duplicate theme, every discount code tested on it, then scheduled with Rollouts with an end date so the store reverts on its own. If Rollouts is not available on the store's plan, a manual publish and revert plan with named people.
3. Pre-sale checks a week before: speed baseline, test orders, policies, stock and back-order settings, notification emails, cookie banner for UK and EEA visitors, and that any "was" prices shown to EEA shoppers follow the 30-day lowest-price rule (owner to confirm with their adviser).
4. Day-of timeline: hour-by-hour checks with an owner for each (orders flowing, discount working, stock, site speed, customer messages).
5. If something breaks: who decides, how to roll back to the previous theme, saved replies for customers, and which apps to switch off first.
6. After the sale: confirm the revert, compare speed and sales with the baseline, and list what to change next time.

7. Access: for each task, the level it needs (1 read, 2 read and draft, 3 read, write and publish), whether the agent or a named person does it, and the action list the owner says yes to before the first live action.

Rules: every task has a named owner, nothing goes live untested, every live action is logged, and the runbook fits on two pages.
```
