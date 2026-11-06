---
name: check-sheets-and-work-orders
description: Writes short daily check sheets for each vehicle or equipment type (one page, tick boxes, what a fail looks like, who to tell) and a work order form and log that tracks each fault from report to fixed with priority, downtime and cost, then sets them up in a CMMS or fleet tool so a failed check becomes a work order. Use it when checks are skipped or ticked without looking, faults are reported by shouting, repairs are never closed, or the owner cannot see downtime and cost per asset. Safety items come from the client's manuals or policies word for word.
---

# Check sheets and work orders

## When to use

- Drivers or staff skip daily checks, or tick every box in seconds.
- Faults are reported verbally and forgotten.
- Nobody knows which repairs are still open.
- The owner cannot say what an asset costs in repairs and downtime.
- A failed check does not stop the asset being used.

## Access needed

- **Level 1 (read):** current check sheets, fault notes, work order history, manuals.
- **Level 2 (read and draft):** build inspection forms, procedures and work order templates in the tool, not yet assigned.
- **Level 3 (read, write and publish):** switch on forms for the agreed assets, turn approved requests and failed checks into work orders, assign them, mark assets out of use under the client's rule, and close work orders with evidence.

## What you need

1. Asset types and how they are used (vans, tippers, forklifts, treadmills, ovens, compressors).
2. The makers' daily or pre-use checks, and the client's own safety policies.
3. Who does the check, when, and who is told about a fail.
4. The client's rule for taking an asset out of use, and who returns it to service.
5. Past fault notes or work orders, if any.
6. Where the business operates (for vehicle and equipment rules).

## Steps

### 1. Write the check sheets

One sheet per asset type, one page:
- Header: asset ID, date, time, checker, hours or mileage.
- Items: short commands ("Tyres: no cuts, no bulges"), grouped in the order the checker walks round.
- Columns: OK, Fail, "fail looks like", notes.
- Footer: "If any safety item fails: do not use, tell [role] now."

Take safety items from the maker's checks or the client's policy, word for word. Keep it to what matters; a sheet that takes too long gets ticked without looking. Add a "nil defects" signature so a completed check is visible.

For vehicles, align with the rules where the fleet runs: in the UK, DVSA's guide expects at least one walkaround check in every 24 hours a vehicle is in service, with defects written up and nil reports kept as good practice; in the US, commercial drivers report defects at the end of each day's work. For forklifts in the US, examination before use at least daily. Check this with local rules.

### 2. Write the work order form

Fields: work order number, asset ID, fault in the reporter's words, reported by, date and time, priority, safety impact (yes or no), asset status (in use, out of use), assigned to, parts, labour, contractor, cost, date fixed, downtime (hours or days), evidence (photo, service entry), closed by.

### 3. Set priorities in words

Write the priority rules with the owner, for example: urgent (safety item or asset out of use and needed today), high (asset out of use, workaround exists), normal (works but needs fixing), planned (next PM visit). Give each a target response time the owner sets. Do not borrow targets from elsewhere.

### 4. Connect the check to the work order

Every fail on the sheet becomes a request or work order the same day. In Fleetio, a failed inspection item can create an issue automatically. In MaintainX, requests from requester users or a QR-code portal go to an administrator to approve into work orders. Decide who approves and how fast.

### 5. Out of use, back in use

A safety fail means the asset is marked out of use under the client's rule. Only the competent person or qualified repairer returns it to service, recorded on the work order. The agent never marks it safe.

### 6. Close with evidence

A work order closes only when the fix is recorded: what was done, parts, time, cost, downtime and evidence. Fleetio reminders resolve only when the task is on a completed work order or service entry; use the same rule everywhere.

### 7. Review weekly

Open work orders by age and priority, repeat faults per asset, downtime and cost. Three repeats on one asset trigger a repair-or-replace review.

## Checks

- Each check sheet fits on one page and has a fail column and a "tell" line.
- Safety items match the maker's or client's wording.
- Every fail creates a work order the same day.
- Out-of-use and return-to-service rules name roles; the agent never returns an asset to service.
- Work orders carry downtime and cost and close only with evidence.
- Priority targets were set by the owner.
- The pack carries the line: *Safety items and sign-off come from your competent person; check this with local rules.*

## Output format

1. Check sheet per asset type
2. Work order form
3. Priority rules and targets
4. Out-of-use and return-to-service procedure
5. Tool set-up notes
6. Weekly work order review template

## Example of good output (short)

> **Made-up example: Kestrel Deliveries, 14 vans and 3 tippers (not a real business).**
>
> **Van daily walkaround, one page.** Van ID ___ Date ___ Mileage ___ Driver ___
>
> | Item | OK | Fail | Fail looks like |
> |---|---|---|---|
> | Tyres | ☐ | ☐ | Cut, bulge, cord showing, low |
> | Lights and indicators | ☐ | ☐ | Any not working |
> | Mirrors and glass | ☐ | ☐ | Cracked in driver's view, missing |
> | Brakes (walking speed test) | ☐ | ☐ | Pulls, spongy, warning light |
>
> **If any item fails: do not drive. Ring the yard supervisor now.** Nil defects: sign here ___
>
> **Work order WO-0412:** VAN-07, "brakes spongy", reported 06:40 by driver, urgent, out of use, assigned to Brightside Garage (approved, cap 400 pounds), fixed 14:10, downtime 7.5 hours, cost 286 pounds, invoice attached, returned to service by garage technician.
