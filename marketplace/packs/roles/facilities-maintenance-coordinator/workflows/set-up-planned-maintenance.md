# Set up planned maintenance

**Trigger:** A business has no maintenance system, a CMMS or fleet tool was bought and never filled, or a new site or fleet is taken on. Usually two to six weeks, depending on the number of assets.

## Steps

1. **Agree access and limits (day 1).** List the tools and ask which access level the owner grants for each, the approved contractors and the cost cap per order and per month. Record it under "Access I have". *Approval: owner sets levels, contractors and caps.*
2. **Gather what exists (week 1, level 1).** Asset and vehicle lists, service invoices, manuals, warranty papers, risk assessments, written schemes, contractor reports. Photograph plates where lists are missing.
3. **Build the register (week 1 to 2).** Use the `asset-register-and-pm-calendar` skill: IDs first, then the register with interval sources. Mark every missing interval [confirm with maker]. *Approval: owner confirms the asset list and criticality.*
4. **Build the compliance calendar (week 2).** Use the `compliance-calendar` skill. Name the competent person for each item; mark gaps [NEEDED]. *Approval: each competent person confirms their items and frequencies.*
5. **Build the PM calendar (week 2 to 3).** Spread tasks across 52 weeks with weekly hours; fixed intervals for legal and warranty dates, meter or floating for wear. *Approval: owner approves the calendar and any planned downtime.*
6. **Write checks and the work order process (week 3).** Use the `check-sheets-and-work-orders` skill. Test one check sheet per asset type with the people who will use it, and cut what slows them down. *Approval: owner approves priority rules and the out-of-use rule; safety items come from the maker or competent person.*
7. **Load the tool (week 3 to 4, level 2).** Add assets, PM schedules (paused), inspection forms and request routing in MaintainX, UpKeep, Fleetio or the spreadsheet. Sample generated work orders against the register.
8. **Switch on (week 4, level 3 after a yes).** Show the list of live actions and limits, get a yes, switch on PMs and forms, and brief the team on how to report faults (request portal, QR codes, app).
9. **First review (week 6).** Run the `weekly-maintenance-review` workflow and report: assets loaded, PMs live, checks completed, work orders raised and closed, gaps still [confirm with maker] or [NEEDED], and the action log.

## Outputs

- Access record and limits
- Asset and vehicle register with interval sources
- Compliance calendar with competent persons
- 52-week PPM calendar with weekly hours
- Check sheets, work order form, priority and out-of-use rules
- Tool set up and switched on
- First review report and action log

## Needs the client's approval

Access levels, contractors and caps, the asset list, every competent-person item, the PM calendar and downtime, priority and out-of-use rules, and switching on live schedules.
