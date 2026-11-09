---
name: asset-register-and-pm-calendar
description: Builds an asset and vehicle register (ID, location, age, hours or mileage, service interval and its source, last and next service, warranty, owner) and a planned preventive maintenance calendar from the makers' intervals and competent persons' schemes, spread so no week is overloaded, then sets it up in a CMMS or fleet tool. Use it for fleets, gyms, kitchens, small factories and property teams when service dates live in people's heads or invoices, breakdowns keep surprising the team, or a CMMS was bought and never filled. Marks every missing interval [confirm with maker].
---

# Asset register and PM calendar

## When to use

- Nobody can say what is due next month.
- Services happen when something breaks or a contractor rings.
- A CMMS or fleet tool was bought but holds no assets.
- Warranty claims are lost because nobody knew the dates.
- The business is growing and one person's memory is the system.

## Access needed

- **Level 1 (read):** asset lists, vehicle lists, service invoices, manuals, current tool exports.
- **Level 2 (read and draft):** add assets and PM schedules to the CMMS saved paused; build the register in a copy.
- **Level 3 (read, write and publish):** switch on approved PM schedules, update meters and dates, and keep the live register true within the agreed sites.

## What you need

1. Every asset or vehicle you have a record of: list, photos of plates, invoices.
2. Makers' manuals or service schedules, and warranty documents.
3. Any competent person's schemes: legionella written scheme, fire risk assessment actions, lifting or pressure examination dates, gas service dates, vehicle inspection intervals.
4. Hours or mileage for assets that run on use.
5. Sites, who looks after each, and when assets can be taken out of use (downtime windows).

## Steps

### 1. Give everything an ID

One short, permanent ID per asset (site code, type code, number: "LDS-TRD-04"). Label it on the asset. Vehicles keep the registration as a field, not as the ID.

### 2. Build the register

Columns: ID, asset, make and model, serial, site and location, year in service, hours or mileage, service task, interval, interval source (maker, competent person, law, or [confirm with maker]), last done, next due, warranty end, owner, criticality (what happens if it fails). Write the next-due formula out: next due = last done + interval, or the meter equivalent. Flag duplicates and unknowns.

### 3. Sort the intervals

- **Law, warranty or competent person:** use fixed dates that do not drift when a job runs late. MaintainX suggests fixed intervals for maker, warranty or regulatory schedules.
- **Wear-based servicing:** use meter triggers (hours, miles, cycles) or floating intervals that count from the last completed job.
- **Both matter:** use whichever comes first, as MaintainX plans and Fleetio reminders allow.
- **Missing:** mark [confirm with maker]. Do not guess. A wrong interval gives false comfort.
- **Habit:** "annual because we always have" is not a source. HSE's portable appliance guidance is the classic example: annual testing is not a legal requirement; frequency follows risk.

### 4. Spread the workload

Lay tasks across weeks. Count hours per week by person or contractor. Move flexible tasks out of overloaded weeks and into planned downtime. Keep fixed legal dates where they are. Group tasks on the same asset or site into one visit.

### 5. Add the compliance items

Put each competent person's dates in the same calendar with their name: legionella checks from the written scheme, fire alarm and emergency lighting checks, fire drills, gas services, vehicle inspections. The calendar records when; the competent person decides what and whether it passed.

### 6. Set it up in the tool

At level 2, add assets and PM schedules paused. In MaintainX, use maintenance plans with time, meter or combined triggers and nested tasks for monthly plus quarterly work. In UpKeep, set the trigger type and how far ahead work orders are created. In Fleetio, set service reminders with time and meter intervals and Due Soon thresholds. Check a sample of generated work orders against the register. At level 3, with a yes, switch on.

### 7. Keep it true

Each month, reconcile completed work orders against the calendar, update meters, add new assets and retire disposed ones (archive, never delete history).

## Checks

- Every asset has an ID, location, owner and criticality.
- Every interval names its source or is marked [confirm with maker].
- Legal and warranty dates use fixed intervals.
- No week is overloaded; totals are shown.
- Compliance items name the competent person.
- Generated work orders were sampled against the register before switching on.
- Nothing in the register says an asset is safe.
- The register carries the line: *Intervals come from the maker or your competent person; check this with local rules for legal inspection dates.*

## Output format

1. Register (table, with the next-due formula written out)
2. Interval sources and gaps list
3. 52-week PPM calendar (weeks across, assets down) with weekly hours
4. Compliance items with competent persons
5. Tool set-up notes and sample check
6. Open questions for the owner

## Example of good output (short)

> **Illustrative structure, not a real business: a gym business with two sites and about 120 pieces of kit. Copy the shape, never the content: every fact comes from the client's own context.**
>
> | ID | Asset | Site | Task | Interval | Source | Last | Next due |
> |---|---|---|---|---|---|---|---|
> | S1-TRD-04 | Treadmill | Site 1 | Belt and deck service | 6 months | Maker manual p. 31 | 12 May 2026 | 12 Nov 2026 |
> | S1-CAB-02 | Cable crossover | Site 1 | Cable inspection | [confirm with maker] | None found | 3 Feb 2026 | [NEEDED] |
> | S2-HWS-01 | Hot water calorifier | Site 2 | Flow and return temperatures | Monthly | Legionella written scheme (J. Okafor) | 2 Oct 2026 | 2 Nov 2026 |
>
> **Next due formula:** = last done + interval in months. Week 46 totals 14 hours for the in-house technician; three treadmill services moved to week 48 downtime.
