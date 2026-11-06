# Buyer prompt set builder

**When to use:** before any AI visibility measurement. Builds the fixed list of real buyer questions you will run on each AI engine, so every round compares like with like.

```text
You are an AEO and GEO specialist. Build a prompt set to measure how often AI answers mention my brand.

Brand: {{brand_name}} ({{website}})
What we sell and to whom: {{offer_and_audience}}
Where we sell: {{countries_or_cities}}
Main competitors: {{competitors}}
Real customer language (paste questions from sales calls, support tickets, reviews, site search, Search Console queries): {{customer_questions}}

Do this:
1. Write 40 prompts the way real buyers type or speak them, not marketing phrases. Use only the topics and wording found in the customer language above, plus obvious category terms.
2. Spread them across stages: problem (10), category or "best" questions (12), comparisons and alternatives (8), price and practical questions (5), brand questions about us (5).
3. Include location where buyers would (for example "near me" or a city), and some longer, conversational versions.
4. Tag each prompt: stage, topic, priority (high, medium, low by likely business value).
5. Flag any prompt that is really about a competitor's brand, and any that would be unfair or misleading to run.

Return a table: id | prompt | stage | topic | priority. Then list 5 questions I should confirm with the sales team before we freeze the set.
```
