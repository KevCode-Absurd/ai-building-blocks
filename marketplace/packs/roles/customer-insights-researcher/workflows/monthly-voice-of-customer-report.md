# Monthly voice-of-customer report

**Cadence:** Monthly, in the first week of the month, covering the month before. For a business with a steady flow of reviews, support tickets, survey answers or social mentions. Takes about a day once the label list is set up.

**Access:** Ask which level the client grants for each tool (review platforms, support desk, survey tool, listening tool, CRM, shared drive) and write it down as "Access I have". Until they answer, work at level 1 (read). Log every action: what, where, when, result.

## Steps

1. **Collect (day 1).** Pull last month's reviews, tickets, survey answers and mentions through exports, official connectors or the listening tool. No scraping against site terms. *Level 1.*
2. **Clean and code (day 1).** Run the `review-and-mention-mining` skill: remove duplicates and spam, code every item with the standing label list, add new labels when needed, hand-check sentiment on a sample. *Level 1. Level 2: draft new tags or saved searches in the support or listening tool. Level 3 within limits: apply the agreed tags.*
3. **Scores (day 1).** If a feedback survey runs, read it with the `feedback-survey-and-nps` prompt: score with its base, trend, and open-answer themes. *Level 1.*
4. **Compare (day 1).** Compare each label's count and share with the last three months; find spikes and their likely causes (launches, stock, delivery, price, outages). *Level 1.*
5. **Words and fixes (day 1).** Update the customer words file and the fix list with the `customer-words-and-fix-list` prompt. Mark fixes done last month and whether their complaint fell. *Level 1.*
6. **Review requests (as agreed).** If the client wants more reviews, keep the request flow within the rules (every customer asked the same way, no rewards tied to ratings, platform rules followed). *Level 2: draft the emails and timing. Level 3 within limits: send to all eligible customers. Approval: the client approves the flow and any change to it. Check this with local rules.*
7. **Report (day 2).** Two pages: what customers said most, what changed, rising issues, the five actions in order, and last month's fixes and their effect. *Level 3 within limits: share with the named readers. Approval: the client approves before anything is shared outside the team.*
8. **Escalate.** Any safety issue, legal threat, data breach report or formal complaint found in the data goes to the client the same day, not in the monthly report. Replies to formal complaints need a fresh yes.

## Outputs

- Coded data set for the month
- Theme table with counts, shares, trends and quotes
- Score and open-answer readout (if surveyed)
- Updated customer words file and fix list
- Two-page monthly report
- Action log of everything done in the client's tools

## Needs the client's approval

New tags or saved searches made live; the review request flow and every change to it; sharing the report outside the team; any reply to a formal complaint; anything outside the agreed level 3 limits.
