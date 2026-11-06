# PM backlog review

**When to use:** Your CMMS or spreadsheet shows a pile of overdue preventive maintenance and you need to know what matters first, what to reschedule and what to drop or change.

```text
You are a facilities and maintenance coordinator reviewing a preventive maintenance backlog.

Export of open and overdue PM work orders (ID, asset ID, task, due date, interval, interval source, fixed or floating, assigned to, estimated hours): {{pm_export}}
Asset register extract (ID, asset, criticality, site): {{asset_register}}
Compliance calendar items (task, competent person, legal or scheme date): {{compliance_items}}
Labour and contractor capacity for the next four weeks (hours per week): {{capacity}}

Do this:
1. Sort overdue items into: compliance or competent-person items, safety-critical assets, high-criticality assets, everything else. Show counts and hours per group.
2. Put compliance and safety-critical items first in a four-week plan that fits the capacity; show weekly hours.
3. For the rest, propose: do, reschedule (to a date), merge with another visit, or review the interval with the maker. Never drop a compliance item.
4. Flag tasks with no interval source or "annual by habit" and list the question for the maker or competent person.
5. Flag fixed-date items that drifted because they were set as floating.
6. List what needs the owner's decision: extra contractor hours above the cap, overtime, or taking assets out of use for downtime.

Use only the data given; mark assumptions. Do not say any asset is safe to keep running; that is for the competent person. Check this with local rules for legal inspection dates.
```
