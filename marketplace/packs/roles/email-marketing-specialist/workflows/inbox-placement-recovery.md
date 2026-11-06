# Inbox placement recovery

**Trigger:** clicks or orders from email fall sharply without a clear reason; customers say emails are in spam; bounces with 4.7.x or 5.7.x codes at Gmail or 550 5.7.515 at Outlook.com; Gmail Postmaster Tools shows a compliance problem or a spam rate approaching 0.3%.

**Cadence:** a one-off recovery, with a weekly check-in until the numbers are steady for several weeks.

## Steps

Steps 2, 3, 5 and 6 need level 1 (read). Steps 1, 4 and 7 can act at level 3, within the approved list.

1. **Stop making it worse.** Pause sends to their least engaged contacts (no click, order or reply in a long time; the client sets the window from their usual buying cycle), and pause any planned big send or list import. At level 3, once the client says yes, I pause them and log it; pausing can be undone. At lower levels this is a recommendation and the client makes the change.
2. **Collect the evidence (prompt: dns-and-header-read).** DNS records, headers from Gmail and Outlook.com, bounce codes, 60 days of results by mailbox provider, Postmaster Tools and SNDS screenshots if available, and a list of what changed and when.
3. **Diagnose (skill: deliverability-and-consent-check, steps 1 to 6).** Authentication and alignment, one-click unsubscribe, complaint and bounce trends, list sources and consent, volume history. Name the most likely cause and the evidence for it.
4. **Write the fix list.** DNS change requests with exact record text; platform settings to change (custom DKIM, unsubscribe headers); list actions (remove hard bounces, suppress unknown-source imports, start the sunset flow); content or frequency changes if complaints point to them.
   **Approval point 1:** the client approves the fix list, which is also the action list for level 3. At level 3, I apply the platform settings and list actions on it and change only the DNS records it names, then log each one. At level 2, I prepare them saved but switched off. At level 1, the client or their web person applies them.
5. **Verify the fixes (prompt: dns-and-header-read again).** The client pastes the new records and fresh headers. Confirm SPF, DKIM and DMARC pass with alignment, and one-click headers are present.
6. **Plan the restart (skill: deliverability-and-consent-check, step 8).** Week-by-week audience and volume, starting with the most recent clickers and buyers, with stop signals (deferrals, bounces, complaints).
   **Approval point 2:** the client approves the restart plan and the sunset rule.
7. **Weekly check (prompt: results-read-clicks-first).** Each week the client shares results by provider and Postmaster data, or I read them at level 1. At level 3, I send the restart sends on the approved plan, within its audience and volume limits, and stop at the first stop signal. Widen the audience only when complaints and bounces stay low. Tighten DMARC from p=none towards quarantine only when reports show all legitimate mail passing.
8. **Close and write rules.** When numbers are steady for several weeks, write the standing list rules: bounce handling, sunset policy, sign-up checks, import policy, maximum change in volume per send.

## Outputs

- Diagnosis with evidence.
- DNS and platform change requests with exact text.
- Restart plan by week, with stop signals.
- Weekly progress notes.
- Standing list hygiene and sending rules.

## Approval

**At level 3, after points 1 and 2 are approved:** the platform settings and list actions on the fix list, the DNS records it names, suppressions it lists, and the restart sends on the approved plan, within its audience and volume limits. Each one is logged.

**Always needs a new yes:** any change not on the list, any DNS record not named on it, importing contacts, deleting contacts (suppress rather than delete, so unsubscribed or bounced people are never re-added by accident), sending to a wider audience or at higher volume than the plan, and widening again after a stop signal. At level 1 or 2, the client makes every send.
