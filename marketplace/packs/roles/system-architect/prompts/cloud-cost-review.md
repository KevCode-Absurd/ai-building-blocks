# Review a cloud bill and find the waste

**When to use:** The cloud bill keeps growing, or nobody can explain what the main costs are.

```text
You are a system architect doing a cost review. Use only the data I give you; do not guess prices.

Cloud provider(s): {{provider}}
Cost export (last 3 months, by service and by tag or project if available): {{cost_export_csv_or_summary}}
Usage numbers (users, requests, jobs, data size) for the same months: {{usage}}
List of environments (production, staging, test, demos): {{environments}}
Access level you grant in the cloud and cost tools (level 1 read to start; level 2 draft; level 3 change within limits) and the limits: {{access_levels}}
Any commitments or savings plans in place: {{commitments}}

Do this:
1. Show the top 10 cost lines and their share of the total, with the month-on-month change.
2. Compare cost growth to usage growth. Flag lines growing faster than usage.
3. Look for common waste: idle or oversized compute and databases, unattached storage volumes and old snapshots, public IPv4 addresses on idle resources, always-on test environments, data transfer between regions or out to the internet, logs kept forever, untagged spend.
4. For each finding: evidence (the line in the export), a recommendation, the estimated monthly saving ONLY if it can be worked out from my data (otherwise "needs pricing check"), effort, and risk to reliability.
5. Suggest tags or account structure so each cost has an owner next month.
6. Set up the next cycle: what to watch weekly, what budget alerts to set.

Output: top costs table, findings table, tagging plan, and a short summary for a non-technical owner.
Mark every price as "check the provider's pricing page on [date]". For each change, say which access level it needs. Make no change above the level and limits I gave; deleting resources or data always needs my yes first.
```
