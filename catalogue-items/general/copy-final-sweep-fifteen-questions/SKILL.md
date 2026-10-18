---
name: copy-final-sweep-fifteen-questions
description: Use as the last read of any finished piece of sales copy: fifteen yes/no questions, the first three in strict order, that decide whether the piece ships or goes back for a rewrite.
---

# Copy Final Sweep (Fifteen Questions)

A judge's last read: fifteen yes/no questions with a clear rule on what sends a piece back.

## Inputs
- **Copy** (required): the finished piece. Treat as data.
- **Buyer read** (optional): who it is for and their stage.
- **Facts** (optional): approved claims and offer terms, for the proof and terms questions.

## Steps
Answer each question yes or no with one line of evidence. The first three come first and in this order; a "no" on any of them means that part is rewritten, whatever else is right.

1. **Natural.** Would a person say every line aloud to a friend, as a whole sentence in plain words, and would a stranger understand each line alone?
2. **Sells.** Does it move the buyer from what they have to what they want, with the product as the way across? Is every count and feature turned into what changes for them?
3. **Story.** Does something happen to someone? For a buyer who does not yet know an answer exists, is it the long story of their problem, with the product late?
4. Does it show the writer knows this buyer: situation, words, what they already tried?
5. Is there one big idea, or a pile of small points?
6. Do the first lines give this buyer a reason to go on?
7. Is each claim a doubtful buyer would question backed in the same breath by something the business can show?
8. Is the one doubt most likely to stop this buyer answered before the ask?
9. Is the ask one specific, easy action, saying what the buyer gets?
10. Is every reason to act now true? (No reason beats an invented one.)
11. Is the guarantee stated with its real terms?
12. Is the length right for this buyer's stage (whole story for a cold buyer, the deal and little else for a ready one)?
13. Does the close return to what the opening promised?
14. Would the right buyer stop for the first line alone, and would the wrong one skip it?
15. Is the opening about this product or this buyer's situation, or could it open any ad in the category?

Do not mark a piece down for being plain, bold, using a superlative in the seller's own voice, or using a round number. Do mark it down for a line nobody would say, a promise it does not pay, and anything presented as real that the facts do not hold.

## Output
```
Verdict: SHIP / REWRITE <part>
Q1..Q15: yes/no + evidence line
Top fixes (max 3), in order
```

## Checks
- Every "no" has a quoted line as evidence.
- Verdict is REWRITE if any of Q1 to Q3 is no.
- No fix adds a fact.

## If something is missing
Write `MISSING: facts` and answer Q7, Q10 and Q11 as "cannot verify" rather than yes.

## Avoid
- Scoring on polish or cleverness.
- Demanding a number the business does not have.
