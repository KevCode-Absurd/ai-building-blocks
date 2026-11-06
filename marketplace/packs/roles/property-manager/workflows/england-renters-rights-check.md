# England: Renters' Rights Act and landlord database check

**Trigger:** A landlord with homes in England asks "am I compliant?", takes on a new property, or their region's database window is about to open.

**Cadence:** Once per landlord, then monthly while rules are still being phased in (database rollout runs to 14 November 2027; Awaab's Law for private renting is under consultation to 18 December 2026).

**Access:** Level 1 (read) on the tenancy files and property software is enough. Steps marked [L2] need read and draft access. Registration on the landlord database must be started by the landlord through GOV.UK One Login; I prepare the information.

## Steps

1. **List every tenancy.** Address, start date, type before 1 May 2026, written or verbal, rent, rent day, deposit and scheme.
2. **Information duties.** For tenancies that existed on 1 May 2026, confirm the Information Sheet (or written terms for verbal tenancies) was given by 31 May 2026, and record how and when. Flag any gaps for the landlord's adviser.
3. **Letting practices.** Check adverts show an asking rent and invite no bids; no rent taken before signing and no more than one month in advance; criteria do not exclude people with children or on benefits; pet requests are answered with reasons. Use the `fair-listing-advert-check` prompt.
4. **Rent increases.** List the last increase date for each tenancy. Any future increase uses Form 4A with at least two months' notice and no more than once a year. *Approval: every rent change needs a fresh yes.*
5. **Possession readiness (facts only).** For each tenancy, record deposit protection and prescribed information dates and safety certificates on file, because a court looks at deposit protection before possession. Do not choose grounds; list questions for a solicitor. Notices served before 1 May 2026 need a court claim by the earlier of their validity or 31 July 2026.
6. **Safety and compliance.** Gas record within the year and given to the tenant; electrical report within five years; alarms; EPC. Use the `repairs-and-compliance-log` skill, step 7.
7. **Landlord database.** Find the property's region and its three-month window (West Midlands from 15 December 2026; London 15 July to 14 October 2027). Prepare the landlord and property details, managing agent contacts, and the safety certificates, EPC, tenancy details and licences to add within 28 days. [L2] Draft a dated reminder for the landlord ahead of the window. *The landlord registers and pays the fee.*
8. **Watch list.** Note what is not yet in force (ombudsman membership expected 2028, Decent Homes Standard proposed for 2035 or 2037, Awaab's Law timescales for private renting under consultation) and re-check monthly.
9. **Report.** A one-page status per landlord: done, gaps, deadlines, questions for a solicitor.

## Outputs

- Tenancy register with key dates
- Compliance status per tenancy (information, deposits, safety, rent changes)
- Database pack and window date per property
- Watch list of rules not yet in force
- One-page status report and solicitor questions

## Needs the client's approval

Any message to tenants arising from the check (a fresh yes for each notice), every rent change, anything touching possession, and the database registration and fee, which the landlord does. This is a checklist against official GOV.UK guidance as of 6 November 2026, not legal advice. Check local rules (some homes need a council licence, such as an HMO licence) and ask a qualified solicitor about any gap. For homes in Scotland, Wales or Northern Ireland, use that nation's guidance instead.
