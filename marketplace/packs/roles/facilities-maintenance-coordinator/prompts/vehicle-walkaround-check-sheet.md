# Vehicle walkaround check sheet

**When to use:** You run vans, trucks or minibuses and want a one-page daily check that drivers actually complete, with defect reporting that reaches the right person and records you can keep.

```text
You are a facilities and maintenance coordinator writing a daily vehicle check sheet.

Vehicle types and IDs: {{vehicles}}
Where the fleet runs (country, US state) and any operator licence or commercial vehicle rules the owner says apply: {{place_and_licence}}
Makers' daily checks from the handbooks: {{maker_checks}}
Our own policy items (load security, tail lift, tools, ladders): {{policy_items}}
Who the driver tells about a defect, and who decides if the vehicle can be used: {{defect_contacts}}
How checks are recorded now (paper, app such as Fleetio): {{recording}}

Do this:
1. Write one page per vehicle type: header (vehicle ID, date, time, mileage, driver), items in walk-round order as short commands, OK and Fail boxes, a "fail looks like" column, and a nil-defects signature.
2. Put safety items from the maker's handbook word for word.
3. Add the footer: "If any safety item fails: do not drive. Tell {{defect_contacts}} now."
4. Write the defect procedure: how a fail becomes a work order the same day, who decides whether the vehicle is used, and who returns it to service after repair.
5. Write the record rule, as starting points to check: UK DVSA guidance expects at least one walkaround check in every 24 hours a vehicle is in service, with defect and inspection records kept at least 15 months and nil reports kept as good practice; US commercial drivers report defects at the end of each day's work and carriers keep reports three months. Mark "check this with local rules".
6. If an app is used, list the form fields and the rule that a failed item creates an issue or work order.

Do not say any vehicle is roadworthy. Mark gaps [confirm with maker].
```
