# Complaint to resolution

**Trigger:** A supplier, retailer, landlord, bank or service has let the owner down and a first informal request has not fixed it. Runs over days or weeks until the matter is settled or the owner drops it.

**Cadence:** One check on each reply date until the matter closes.

**Access:** Level 1 (read) on email and files is enough to build the case. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access. Because disputes involve money, each letter also needs the owner's yes on its facts and outcome before it goes, even at level 3.

## Steps

1. **Gather the facts.** Collect every date, amount, reference, name and promise, plus emails, receipts, photos and the other side's terms, from the owner's inbox and files. No card numbers, bank details or ID numbers.
2. **Build the timeline and letter.** Run the `formal-letter-and-complaint` skill, steps 1 to 4: timeline, one-sentence outcome with a reply date, the letter, and an email or web form version. [L2] Save the letter in drafts and file the timeline. *Approval: the owner confirms every fact, the outcome and the reply date.*
3. **Send.** [L3] Send the letter or submit the web form from the owner's account once the owner says yes to it, and log it. Otherwise the owner sends it.
4. **Log it.** Add the matter to the action register with the reply date. [L3] Add a reminder to the owner's calendar for the day after.
5. **Check routes and deadlines.** Same skill, step 6: list the routes that may apply (the company's complaints process, a card billing dispute, an ombudsman), each with its official page and any time limit, such as 60 days for a US card billing error or the eight-week final response period for UK financial firms. *Approval: the owner decides which route to use, after checking their rights with an advice service where money is involved.*
6. **On the reply date.** If there is a good reply, draft a short acknowledgement. If there is no reply or a poor one, draft the follow-up letter (skill step 5). [L3] Send it after the owner's yes.
7. **Escalate if needed.** Draft the escalation to the complaints team or ombudsman, summarising what happened, what was tried and what is wanted now, with the evidence list. *Approval: the owner decides to escalate; submitting it is a fresh yes even at level 3.*
8. **Close.** When resolved, file the timeline, letters and action log under the naming rule from `admin-system-setup` [L3, or the owner files them], and note any lesson (for example, "always get delivery dates in writing from this supplier").

## Outputs

- Timeline of the matter
- Letter, email or web form version, follow-up and escalation drafts
- Routes and deadlines to check, with official links
- Action register entry, reminders and the log of what was sent
- Filed record of the matter

## Needs the client's approval

Every fact, the outcome sought, each letter before it goes, choosing a route, escalating to an ombudsman or other body, and accepting any offer. This is not legal advice; for disputes involving money or rights, the owner checks with an advice service or a qualified adviser.
