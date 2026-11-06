# Campaign launch

**Trigger:** a new LinkedIn campaign, a new offer, or a rebuild after a review. About one to two weeks from intake to launch, mostly waiting on tracking and sales.

**Goal:** launch one well-sized campaign with clean tracking, a form sales can act on, and agreed limits.

## Steps

Steps 1 to 3 need level 1. Steps 4 to 6 use level 2. Step 8 needs level 3, or the client launches.

1. **Intake** (prompt: `account-intake`). Collect deal numbers, the buying group, target companies, budget, tracking state and access levels with limits. Write "Access I have".
2. **Deal maths** (prompt: `budget-from-deal-size`). Target cost per qualified lead and when results can be judged.
3. **Plan** (skill: `linkedin-campaign-plan`). Audience table with sizes, objective, formats, bid strategy, budget split, measurement.
4. **Tracking** (skill: `linkedin-account-and-tracking-review`, tracking steps). Insight Tag fires after consent for UK and EU visitors; conversions created with the right windows; tag and server share an eventId; qualified leads come back from one source. Code changes go to the client's developer as a spec.
5. **Form and follow-up** (skill: `linkedin-lead-gen-form-and-follow-up`). Build the form in draft, send a test lead, confirm it reaches the CRM, and name who calls within one working day.
6. **Ads** (prompt: `ad-copy-three-formats`). Build ads in draft. Check them against LinkedIn's advertising policies: claims backed, destination domain matches, no restricted category surprises.
7. **Approval.** Send the plan, ads, form and the list of launch actions with limits (prompt: `change-request-for-approval`). Wait for the yes.
8. **Launch** (level 3; tool: Campaign Manager). Launch only what was approved. Log each action with date and result. Check delivery and ad review status within 24 hours.
9. **First-week check.** Spend pacing, ad approvals, tag and form test leads, demographics showing the intended seniority and functions. Report in one page.

## Outputs

- Plan with deal maths and audience table.
- Tracking fix spec (if needed) and test results.
- Form spec and follow-up sequence.
- Approved launch list and the change log.

## Approval

**Needs the client's yes before launch:** the plan, budget and cap, ads, form wording (privacy and checkbox text approved by the client's adviser), and the launch action list.

**Always needs a fresh yes, even at level 3:** spend above the cap, a new ad account, uploading a contact or company list, promoting a person's own post, deleting anything, and any rejected ad or restricted account.
