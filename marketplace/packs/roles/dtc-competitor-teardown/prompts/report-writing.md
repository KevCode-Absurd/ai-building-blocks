# How to write the teardown report

The page is a dashboard. It draws the charts, the them-vs-you board, the ad gallery and the page screenshots from the evidence. Your words say what the numbers mean and what to do. Keep them short.

## Who reads it

A D2C founder or marketer who runs the store. Busy, sharp, not a marketing scholar. They want to know three things: what is this brand doing that works, what should I copy or beat, and who on my team does it this week.

## Voice

- Plain and direct. Say the thing, then the proof. "They run about 339 live Meta ads [E21]. You run about 218 [Y22]."
- Write like a sharp operator talking to a friend who owns a store. Warm, sure, never loud.
- Use "you" for the reader. Name the competitor by name, never "the brand".
- Numbers beat adjectives. "29 of 100 ads say Limited Time Only [E24]" beats "they lean hard on urgency".
- Reading grade 8 to 9. Most sentences under 18 words. One idea per sentence.

## Words and patterns to avoid

These make a report read as machine-written. `teardown-report.mjs check` flags them.

| Instead of | Write |
|---|---|
| leverage, utilize | use |
| robust, seamless, holistic | say what it does |
| unlock, elevate, supercharge | grow, raise, add (or say how) |
| landscape, ecosystem | market, the shelf, the category |
| in order to | to |
| delve into | look at |

- No "It's not X, it's Y." No "not just X, but Y." State the point.
- No stock openers: "In today's market", "Let's dive in", "Here's the thing", "The bottom line".
- No question you answer yourself ("The secret? Volume.").
- No em dashes. Use a full stop, a comma or a colon.
- No pile-ups: end the sentence when the point is made.
- Never quote a line unless it is in the evidence or a screenshot note word for word.

## Each section

- **The short version:** 3 to 5 bullets. Bold lead of 4 to 8 words, then one or two sentences with the number and the citation.
- **10 moves for you:** a table with #, Move, Why (their data), How, Agent, Effort, Week. Move starts with a verb. Why cites their evidence, and yours in personalized mode. How is the first concrete step, not a goal. Agent is `Name (\`agent-id\`)`. Effort is S, M or L. Week is 1 to 4. Rank by how much it moves sales for the effort.
- **Their ads and Their landing pages:** 3 to 6 bullets each, about what the screenshots and numbers show. Point at the card ("the top ad by impressions") so the reader looks.
- **Lessons:** 5 bullets. Bold lead, then why it works for this buyer and what it means for any D2C store.
- **Data sections:** 2 to 4 bullets each. Do not repeat the chart. Say what it means.
- **You vs them (personalized only):** where the owner leads, where they trail, with Y# and E# side by side.
- **Hand-offs:** at least 6 agents in different lanes. The Brief is a job the agent can start now, with numbers and a date.

## The two modes

Ask before you start: "Do you want this personalized to your brand, or general?"

- **Personalized:** read the owner's Org context first. Run `teardown-collect.mjs` on their store into `<dir>/you`. Every brief uses their products, prices and voice and cites their store as Y#. At least 5 of the 10 moves cite Y#. Never hand them the competitor's claims: if Graza says "squeeze bottle", the owner's brief talks about the owner's own bottle, sizes and story.
- **General:** no owner data. Briefs use placeholders in braces for the owner's facts: {your hero product}, {your price}, {your proof point}. Never put the competitor's product names, ingredients or ad lines in a brief.

## Honesty

- Cite every claim. Unknown is not absent: say what could not be seen and link the place to check.
- Spend, revenue and conversion rates are private. Use proxies (live ads, launch rate, run length, review counts) and label any estimate.
- Study the strategy. Do not copy their words, images or brand.
