# Enquiry to paid job

**Trigger:** A new enquiry arrives (phone, web form, email or booking request). Also run it as a cleanup when quotes pile up unanswered.

**Access:** Level 1 (read) on the job tool and inbox is enough to draft quotes and messages. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits (for example: "book site visits, send the approved follow-ups on quotes the owner has sent, convert accepted quotes to jobs; no quotes sent without the owner's yes").

## Steps

1. **Log the enquiry.** Capture the request in the customer's words, address, contact preference and how they found the business. [L3] Create the request in the job tool and send the "we've got your request" reply from the approved template.
2. **Decide: quote from notes or site visit.** If the job can be priced from photos and the price list, go to step 4. Otherwise book a site visit. [L3] Book it into a window using the `scheduling-and-dispatch` skill and send the confirmation.
3. **Site visit notes.** Give the technician a short list of what to capture: measurements, access, what is there now, photos, hidden-problem risks.
4. **Write the quote.** Run the `quote-and-scope-writer` skill: scope, price lines from the client's list, exclusions, allowances, terms, cancellation wording for the region. [L2] Save it as a draft quote with the open questions. *Approval: the owner checks and says yes to this quote before it is sent.*
5. **Send the quote.** With the owner's yes for this quote, send it from the job tool.
6. **Follow up.** Load the approved follow-ups into the tool's automation, or send them by hand on schedule (`quote-follow-up-and-price-explainer` prompt). [L3] Follow-ups on a sent quote go out within the client's rules.
7. **Accepted: book the job.** [L3] Convert the quote to a job, book it with the `scheduling-and-dispatch` skill, attach the job checklist (`job-sheets-and-handover`) and send the confirmation. If a deposit is due, prepare the request; the client takes the payment.
8. **On site changes.** Any change uses the change note from `quote-and-scope-writer`, step 8. *Approval: the customer approves in writing before the extra work; the owner approves the price.*
9. **Finish and invoice.** Check the checklist, photos and sign-off; send the handover pack; prepare the invoice from the job record. [L3] Send the invoice and the approved invoice reminders. Payment collection and refunds stay with the client.
10. **Review request and log.** [L3] Send the review request to every completed job. Log every live action.

## Outputs

- Logged request and acknowledgement
- Site visit booking and capture list
- Draft quote with open questions
- Follow-up schedule
- Booked job with checklist attached
- Change notes (if any), handover pack, invoice
- Action log (level 3)

## Needs the client's approval

Every quote before it is sent; every change note's price; any discount; deposit and payment terms; refunds above the client's limit; and replies to formal complaints. Taking or charging payments stays with the client.
