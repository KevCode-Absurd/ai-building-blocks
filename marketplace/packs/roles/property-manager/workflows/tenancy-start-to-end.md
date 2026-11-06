# Tenancy from advert to deposit return

**Trigger:** A tenant gives notice, a home is coming empty, or a new property is ready to let.

**Cadence:** Once per tenancy, with dated checkpoints.

**Access:** Level 1 (read) is enough to prepare every document. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits (for example: "publish the approved advert on the listing sites in our property software; send viewing confirmations from the approved template; update the tenancy file; no offers, no rejections, no deductions").

## Steps

1. **Advert.** Write the advert and screening criteria with the `letting-and-tenancy-file` skill, steps 1 and 2, and the `fair-listing-advert-check` prompt. *Approval: the landlord approves the advert and criteria.* [L3] Publish the approved advert.
2. **Viewings and applications.** [L3] Confirm viewings from the approved template. Log every application in order of receipt against the written criteria.
3. **Checks.** In England, Right to Rent on every adult before the tenancy starts; in the US, screening through the landlord's own screening account, never pasted into chat. Prepare an applicant decision table. *Approval: the landlord chooses the tenant. Any adverse action notice (US) is drafted and sent only after a fresh yes.*
4. **Offer and agreement.** Draft the tenancy agreement from the landlord's template with their adviser's input. *Approval: offering or signing a tenancy needs a fresh yes. In England no rent is taken before signing and no more than one month in advance.*
5. **Move-in pack.** Build it with `letting-and-tenancy-file`, step 4: condition report with photos, Information Sheet (England), certificates, US lead disclosure for pre-1978 homes, contacts and repair reporting. Put the deposit's day-30 protection date in the calendar the day money arrives. *The landlord takes the deposit and protects it in the scheme; I prepare the prescribed information.*
6. **During the tenancy.** Run the `monthly-property-run` workflow.
7. **Notice to leave.** Log the date and the notice period. Send move-out instructions (approved template).
8. **Check-out.** Photograph in the same order as check-in. Build the deduction proposal with the `deposit-deduction-proposal` prompt. *Approval: a fresh yes before the proposal goes to the tenant or the scheme; the landlord releases the money.*
9. **Close the file.** Final meter readings, keys returned, deposit outcome, lessons for the next let.

## Outputs

- Advert and written screening criteria
- Applicant decision table
- Tenancy file and move-in pack with dates
- Condition reports at check-in and check-out
- Deduction proposal for approval
- Closed file with deposit outcome

## Needs the client's approval

The advert and criteria; the choice of tenant; any adverse action notice; offering or signing the tenancy; the deposit deduction proposal; and every movement of money, which the landlord makes. Check local rules at each step: letting, deposit and notice rules differ by country, UK nation, state and city. Ask a qualified solicitor or attorney if a tenant disputes a deduction.
