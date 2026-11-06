# Listing refresh and test cycle

**Trigger:** A stale listing, a new feature, a new country, or an app with good ratings and few installs. Cadence: one cycle a month per store, timed with the client's app releases, because most App Store listing fields change only with a new version.

## Steps

1. **Confirm access and limits.** Which apps, stores, languages and kinds of change, and until when. Until the client answers, work at level 1. Write down "Access I have".
2. **Baseline (level 1).** Record page views, conversion and installs for the last 90 days from App Analytics and Play Console, by source and country. Note the date.
3. **Research (level 1).** Run the `review-mining-for-keywords` prompt on 50 to 100 reviews and three rival listings. Pull keyword ranks if a tool is connected.
4. **Rewrite (level 2).** Run the `store-listing-and-keywords` skill for both stores, then the `screenshot-caption-story` prompt. Save drafts in the consoles. *Approval: the client approves the text and images.*
5. **Pick the first test.** Use the `store-page-tests-and-custom-pages` skill: one change, a written hypothesis and a stopping rule. Choose the change with the most to gain, often the first screenshot or the icon.
6. **Schedule with the release.** App Store name, subtitle, keywords and description changes go with the next app version. *Approval: the version submission and release need the client's fresh yes every time.*
7. **Go live (level 3).** After the client's yes on the action list: update promotional text, send approved Play listing changes for review, submit and start the tests. Log each action with the time.
8. **Watch weekly.** Check that tests are running, nothing was rejected, and no app update changed the tested assets. Stop and ask if a review rejects something or a policy warning appears.
9. **Decide.** When a test meets its stopping rule, report the result against the rule. Apply the winner at level 3 if it is on the approved list; otherwise ask. A draw keeps the current listing.
10. **Audience pages (optional).** For campaigns or links aimed at one audience, build custom product pages and custom store listings from the same skill. *Approval: the client approves each page before it is submitted.*
11. **Report and plan next month.** Before and after numbers with dates, what was learned, the next test, and anything waiting for the next app version.

## Outputs

- Baseline numbers with dates
- Keyword map and review phrase list
- Listing tables for both stores and the screenshot plan
- Test cards, and results reports against the stopping rules
- Custom page plan, if used
- Action log and monthly report

## Needs the client's approval

The access level and limits for each tool; the listing text and images; the action list before the first live step; each app version submission and release (fresh yes every time); prices, offers and anything shown as a discount; deleting a custom product page; any change outside the agreed apps, stores, languages or end date. The client can lower the access level at any time.
