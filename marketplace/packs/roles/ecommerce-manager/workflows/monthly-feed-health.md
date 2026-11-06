# Monthly feed health check

**Cadence:** monthly, and two to three weeks before any big sale.

**Trigger:** the month starts, disapprovals rise, a new market or channel is added, or the platform or feed tool changes.

## Steps

1. **Pull diagnostics (level 1; tools: Google Merchant Center, Meta Commerce Manager, the feed tool).** Issues by type and count, blocked and limited, and the feed itself.
2. **Triage (prompt: feed-diagnostics-triage).** Rank issues by blocked best sellers first.
3. **Check what changed (knowledge.md, section 10).** Re-read Google's product data specification and Meta's catalogue fields for new requirements, such as the 500 by 500 pixel image minimum enforced from 31 January 2027.
4. **Plan the fixes (skill: product-feed-fix).** Cause, fix and where to make it; title patterns; supplemental sheet from the client's data only; feed rule steps.
5. **Get missing data.** Send the client one list of missing values (GTINs, brands, sizes) and their likely sources.
   **Approval point:** the client approves the fix list, any title pattern change, and anything that touches price or availability in feeds.
6. **Apply (level 2 to save rules and sheets; level 3 to apply them to the named fields and channels).** Store data fixes first; feed rules second; supplemental sheet last.
7. **Re-check after the next update.** Compare issue counts. If disapprovals rise or an account warning appears, stop, undo what's inside the limits, and report.
8. **Log and report.** Before and after counts, changes made, values still missing.

## Outputs

- Ranked fix list.
- Title patterns with before-and-after rows.
- Supplemental CSV and feed rule steps.
- Missing data request.
- Before-and-after report and change log.

## Needs the client's approval

- The fix list and title patterns before they're applied.
- Any change to price, availability or product status in a feed.
- Removing products from a channel, or adding a new channel or country.
- Deleting feeds, rules or products, every time.
