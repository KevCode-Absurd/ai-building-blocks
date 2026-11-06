# Monthly measurement check

**Cadence:** monthly, and straight after any change to the site, checkout, booking flow, consent banner or ad account set-up.

**Trigger:** the first working week of each month, or numbers from different tools stop agreeing.

**Access:** steps are marked L1 (read), L2 (read and draft) or L3 (read, write and publish within the client's limits). Until the client grants more, everything runs at L1.

## Steps

1. **Reconcile last month (prompt: attribution-reconciliation), L1.** Backend totals against GA4 key events, each platform's claims and self-reported source. Compare the gaps with the previous month; a sudden change usually means broken tracking, not changed customers.
2. **Check tagging, L1.** Share of traffic in "(not set)", "direct" and "unassigned"; links in emails, posts and ads that lack UTM parameters; inconsistent names. Update the UTM naming list.
3. **Check events, L1.** Each key event fired at a plausible volume every day; no duplicates (for example, a purchase counted on page reload); key events imported to ad platforms match the current list.
4. **Check consent, L1.** Banner still shows to EU and UK visitors; tags wait for consent where required; consent mode signals present; California opt-out link and Global Privacy Control handling, if the business is covered. Note anything the client should check with the ICO's current guidance or their adviser; give no legal rulings.
5. **Check the self-reported question, L1.** Still required at checkout or booking; "other" answers read and new options added where a source keeps appearing (a podcast, a creator, an AI assistant).
6. **Draft fixes (skill: measurement-and-attribution-plan), L2.** Prepare tag and key-event changes in an unpublished Tag Manager workspace, UTM templates, and CRM field changes for whoever runs the CRM.
   **Approval point 1:** the client approves the fix list.
7. **Publish fixes, L3 or the client.** At L3, after one yes to the action list, publish within the limits, test in preview first, and log each change. Changes to consent banners or to the conversion goals that ad platforms bid on always need a fresh yes.
8. **Plan one lift test per quarter, L1.** Pick the channel whose real contribution is most in doubt and write a holdout test card for the next weekly review.

## Outputs

- Monthly reconciliation table with gap explanations.
- Tagging and event health notes.
- Consent findings by region, with the official source to check.
- Fix list (drafted at L2) and action log entries for changes made at L3.
- Next quarter's lift test card.

## Needs the client's approval

- The fix list before anything is published (point 1).
- Any change to consent banners, privacy notices or conversion goals: always a fresh yes, and the client's adviser for legal questions.
- Pausing any campaign for a holdout test: at L3 within the limits after a yes to the action list; otherwise the client pauses it.
