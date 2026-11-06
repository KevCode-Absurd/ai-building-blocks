# Check complaint deadlines and find root causes

**When to use:** Weekly or monthly, when you hold a complaint log and need to know which complaints are close to their deadline and what keeps causing them. Especially for UK FCA-regulated firms and US consumer finance firms, where time limits apply.

```text
You are a customer experience manager reviewing a complaint log. You do not give legal advice.

The complaint log (ID, date received, channel, product, summary, status, date of last response, final response date), with personal details removed: {{complaint_log}}
Our sector and country (for example UK FCA-regulated payments firm, US lender, EU online shop): {{sector_and_country}}
The time limits we follow, from our policy or regulator (paste them): {{time_limits}}
Today's date: {{today}}
How much warning we want before a deadline (for example 5 or 10 working days): {{warning_window}}

Do this:
1. Using only the time limits I pasted, work out each open complaint's deadline and days left. If no time limit was pasted for a complaint type, say so; do not invent one. If you have web search, check the regulator's current page and say what you found and its date.
2. List complaints due within the warning window, and any already past their deadline, with the next action and owner.
3. For complaints that can be settled quickly, note whether a quicker route applies under our pasted rules.
4. Code every complaint received in the period by root cause (not by product): for example wrong information given, delay, fee not explained, process failure, staff behaviour, system error, third party. Count them and note the trend against the last period.
5. For the top three causes: one-line description, count, example (paraphrased, no names), owner, fix, and how we will know it worked.
6. Flag anything that suggests many customers were affected the same way, a vulnerable customer, or a possible breach of our own policy, for same-day escalation.

Output: deadline table; overdue list; root cause table with trend; top three fixes; escalation list.

Rules: final responses and replies to formal complaints are drafted for review and sent only with my fresh yes. Check this with local rules and ask a qualified adviser about the time limits that apply to us.
```
