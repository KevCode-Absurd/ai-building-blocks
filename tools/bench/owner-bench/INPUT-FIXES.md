# Better input for each job: the prepare step (13 Nov 2026)

In round 2, agents ran about two library lookups a job and skipped the steps they were told to follow. So the lookup is now one tool that reads the brief for them:

```
node tools/prepare-job.mjs <brief>
```

It writes `context/knowledge-brief.md` (the ranked cards, with when each holds and fails, plus the gaps) and adds its lookups to `context/trace.md`. On 890 cards it takes about 0.4 seconds. It needs no model and no network.

## Measured on 24 independent job briefs

A separate agent wrote the set without seeing the retrieval code: `marketplace/test/fixtures/ecommerce-jobs-golden.json`. Each brief has 5 to 10 must-have cards and 3 to 5 cards that look relevant but are wrong for that business. Run it with `node scripts/eval-prepare.mjs --split`.

| Way to get cards | Must-have cards in top 15 | Useful share | Wrong cards shown |
|---|---|---|---|
| Two lookups, as agents did in round 2 | 33% | 38% | 12 |
| The whole brief as one query | 39% | 53% | 6 |
| **Prepare step** | **46%** | 43% | 15 |

I tuned on the odd-numbered briefs and checked on the even ones: prepare scored 48% on the tuning half and 45% on the check half. That is 41% more must-have cards than the typical agent found.

The cost is more wrong-looking cards. Each one is printed with its "fails when" line for the agent to check, rather than hidden, because missing a needed card costs more than showing an extra one.

## The ten input fixes, and where each stands

1. **Questions each card answers** (doc2query). Done: every card's "Asked as" lines are indexed with it.
2. **The brief turned into queries.** Done: each request sentence, each data signal and the whole brief are searched, and their rankings merged.
3. **Signals read from the data.** Done:
   - the standout row in each table, said as what it means ("scale toward the best return on ad spend segment");
   - the biggest item in a list of shares;
   - the funnel step that drops most.
4. **Facts as filters.** Done:
   - market, Amazon marketplace and store platform come from the brief;
   - cards written for another situation are pushed down: subscription, TikTok Shop, Amazon, cash on delivery, Black Friday, SMS, WhatsApp, wholesale, dropshipping, brand-new stores, or a market the card names only in its text.
5. **Light rerank.** Done: a boost for the requested modules, for a "holds when" that matches the brief, and when several queries agree, plus the tier prior.
6. **No near-duplicates.** Done: a card that says nearly what a picked card says is skipped.
7. **One stored brand file.** Done: house rule 1 now reuses `context/brand-file/` and never rebuilds it per job.
8. **One card per search unit.** Done: prepare indexes each card as one unit.
9. **A gap log.** Done: any request or signal with no strong card is listed under Gaps, with "decide from the brief, never from memory".
10. **A real-job eval gate.** Done:
    - the 24-brief set and `eval-prepare.mjs`;
    - `test/prepare-job.test.ts` checks the parser, the filters, the de-duplication and that the generated pack tool is up to date.

## Where the library itself is thin (content, not search)

These came from the labeller:
- no card on cutting returned cash-on-delivery orders (RTO) itself: pincode risk, prepaid nudges, confirmation calls;
- Amazon India (one card);
- TikTok ads (5 to 7 cards);
- ad-copy craft;
- PRD, SET and SEC have 12 to 16 cards each.

Better search cannot fix these. They need new cards.

## Not done

- **A neural reranker:** left out until fixes 1 to 3 stop improving the eval, as planned.
- **Agent results:** not re-run with the prepare step yet. That needs Anthropic and OpenAI API credit for the 20-judge panel.
