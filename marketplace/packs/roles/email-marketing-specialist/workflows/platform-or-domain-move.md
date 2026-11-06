# Platform or sending domain move

**Trigger:** the client is switching email platform (for example from Mailchimp to Klaviyo, or the reverse), adding a new sending subdomain, or changing the From domain after a rebrand.

**Cadence:** one project, with a weekly check, lasting as long as the warm-up needs (M3AAWG suggests about six weeks on average for a new domain).

## Steps

Steps 1 and 7 need level 1 (read). Steps 3 and 4 use level 2. Steps 2, 5 and 6 need level 3 if I do them; otherwise the client does.

1. **Inventory what exists (skill: email-program-plan, step 1).** The client exports contacts with consent fields, sign-up sources and dates, suppression lists (unsubscribes, bounces, complaints), tags, flows with their copy and logic, templates, and sign-up forms. Nothing is moved without its consent record.
   **Approval point 1:** the client confirms what moves, what is left behind (for example, unknown-source contacts) and the suppression list.
2. **Set up authentication before any send (prompt: dns-and-header-read).** The new platform gives DKIM and any SPF or return-path records; the client's web person adds them, or I add the records named on the approved list at level 3. Publish or update DMARC at p=none with reports if not already stricter. Confirm with fresh headers that DKIM is signed with the client's domain and DMARC passes.
3. **Rebuild templates (skill: html-email-build-and-qa).** Move or rebuild templates with the new platform's merge tags, unsubscribe tags and editable regions. Hand over the test checklist.
4. **Rebuild flows (skill: lifecycle-flow-builder).** Recreate triggers, filters, timing and exit rules, and fix weak flows while moving them. Build them at level 2 and keep them switched off until approval.
   **Approval point 2:** the client approves templates and flows before switch-on.
5. **Warm up (skill: deliverability-and-consent-check, step 8).** Start with recent clickers and buyers, raise volume in steps over several weeks (M3AAWG suggests about six weeks on average for a new domain), and spread sends through the day. Keep sending from the old platform to the rest of the list during the overlap if possible.
   **Approval point 3:** the client approves the week-by-week warm-up plan. At level 3, I send each step of it within its audience and volume limits, and slow down at the first stop signal.
6. **Switch on flows** once warm-up has reached the flow's audience size. At level 3 I switch on the approved flows and log it; otherwise the client does.
7. **Weekly check (prompt: results-read-clicks-first).** Results by mailbox provider, bounces, complaints, Postmaster data. Slow down at the first rise in deferrals or complaints.
8. **Close the old platform.** Make sure the suppression list was imported and works before the old account closes, then export a final archive for the client's records. Closing the old account can't be undone, so it needs its own yes even at level 3.

## Outputs

- Migration inventory and suppression list check.
- DNS change requests and verification notes.
- Rebuilt templates and flows, ready to switch on.
- Warm-up plan and weekly notes.
- A short handover note: where things live now and the standing rules.

## Approval

- What moves and what does not (point 1).
- Templates and flows before switch-on (point 2).
- The warm-up plan (point 3).
- At level 3, these three yeses form the action list: I import the agreed contacts with their consent records, add the named DNS records, send the warm-up steps and switch on the approved flows, within the limits.
- Always a new yes: any DNS record or platform change not on the list, contacts outside the agreed import, sending faster than the plan, and closing the old account. At level 1 or 2, the client makes these changes and every send.
