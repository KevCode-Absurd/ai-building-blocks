# New vendor or tool intake

**Trigger:** Someone wants to sign up a new software tool, AI service or supplier that will handle personal data, card data or company systems. Run it before the contract is signed; most intakes take one to three working days.

**Access:** Set at the start, per tool (see `access.md`). Until you choose, I work at level 1.

## Steps

1. **Request (day 1).** Capture who wants the tool, what for, what data it will touch (fields, not records), who will use it, the cost and the contract term.
2. **Contract read (day 1).** Run the `contract-plain-summary` skill on the vendor's terms: dates, money, renewal, ending it, liability, data. Add the tracker row at level 2 (live at level 3).
3. **Data terms (day 1 to 2).** Run the `vendor-data-terms-check` prompt: processor terms, sub-processors, breach notice, transfer route, security reports. Draft the email asking the vendor for missing items. *Approval: the owner approves before the email is sent.*
4. **Privacy screen (day 2).** Using the `privacy-register-builder` skill, step 3, screen the new use: purpose, minimum data, who sees it, transfers, effect on people, safeguards. Note if a DPIA looks likely.
5. **AI screen (day 2, if the tool uses AI).** Add it to the register with the `ai-use-register` prompt and note any transparency or AI literacy action.
6. **Security and payments (day 2).** If the tool touches card payments or production systems, note the effect on PCI DSS scope or the control register, using the `audit-evidence-pack` skill.
7. **Decision note (day 3).** One page: what the tool does, data and risks found, contract flags, actions before go-live, and questions for a qualified lawyer or auditor. *Approval: the owner decides go, go with conditions, or no.*
8. **Records (after the decision).** At level 3, add the vendor to the records of processing and vendor list, set renewal reminders and assign go-live actions to named owners.

## Outputs

- Contract summary and tracker row
- Vendor data terms check and request email
- Privacy and AI screening notes
- One-page decision note with actions and questions
- Updated records of processing, vendor list and reminders
- Action log (what, where, when, result)

## Needs the client's approval

**Runs at level 3 within your limits, after one confirmation:** updating the tracker, records of processing and vendor list, setting reminders, and assigning go-live actions to named owners.

**Always needs a new yes:** emails to the vendor, signing or accepting terms, the go or no-go decision, and anything that commits the business. Legal judgements on the contract or on whether a DPIA is required: ask a qualified lawyer or auditor.
