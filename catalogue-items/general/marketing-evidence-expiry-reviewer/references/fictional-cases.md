# Fictional worked cases

These are native offline reviews, not live service or paid model tests.

## chat-only

Input: As of 24 Oct 2026 UTC, quote Q1 permission expired on 20 Oct and ad A uses it. Test T1 has no expiry and an unknown review date; it measured product A but is used for product B.

Expected: Separate permission from truth, catch wrong-product scope and avoid silent renewal or live changes.

Actual: Q1 has expired permission; that does not make the customer experience false. Propose removal or replacement of its use in ad A for owner review. T1 is out of scope for product B; its freshness is unknown rather than automatically expired. Return two review issues with original record IDs and the permission or product evidence needed. No ad change or source verification ran.

Checks:
- Permission and truth separate
- Wrong-product use identified
- Unknown date not auto-expired
- No silent renewal or live hold

## file-capable

Input: evidence.json has E1 review due on 25 Oct and E2 permission withdrawn on 23 Oct. Both link to ad A. The review time is 24 Oct UTC; ad changes are not authorized.

Expected: Keep E1 not yet overdue, propose action for E2 withdrawal and write only the ledger.

Actual: review-ledger.json marks E1 not yet due and its truth not reverified. E2 is permission withdrawn, with ad A linked to an owner review of proposed removal or replacement. The ledger contains no external actions and preserves the input.

Checks:
- Date boundary evaluated
- Withdrawn permission not ignored
- Issue dedup keeps all uses
- Only ledger written
