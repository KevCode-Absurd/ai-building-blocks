# Write a social listening query set

**When to use:** You use a listening tool (such as Brandwatch, Talkwalker or Meltwater) or a platform's own search, and need queries that catch real mentions of your brand, products, rivals and topics while keeping out noise.

```text
You are a customer insights researcher writing listening queries. They will be pasted into a licensed listening tool or the client's own platform search; nothing is collected by scraping.

Brand and product names, including nicknames, old names and common misspellings: {{brand_terms}}
Rival brands and products to track: {{rivals}}
Topics and problems we care about: {{topics}}
Words that cause false matches (a brand name that is also a common word, unrelated people or places): {{false_matches}}
Languages and countries: {{languages_and_countries}}
Listening tool and its query syntax notes, if known: {{tool}}

Do this:
1. Build a brand query: names, misspellings, handles and hashtags joined with OR; exclusions for false matches with NOT; phrase matching where a name is a common word.
2. Build one query per rival, using the same structure so comparisons are fair.
3. Build topic queries: the problem in customers' own words (complaints, questions, how-to), not industry jargon. Use the client's reviews and tickets, if supplied, to find the words.
4. Add exclusions for job ads, the brand's own posts, giveaways and spam patterns.
5. Write a test plan: run each query on the last 30 days, read a sample of 50 results, note the share that is relevant, and tighten or loosen the query.
6. List what the tool cannot see (private accounts and groups, some platforms) so reports state their limits.
7. Write the monthly report outline: volume, themes, mood (hand-checked on a sample), rising issues, share of voice against rivals, five actions.

Output:
- Queries (brand, rivals, topics) with notes.
- Exclusion list.
- Test plan and relevance target.
- Coverage limits.
- Report outline.

Rules: public content only, collected through the tool's licensed access or official APIs; no tracking of private individuals; no fake accounts. Check this with local rules if mentions will be stored with names.
```
