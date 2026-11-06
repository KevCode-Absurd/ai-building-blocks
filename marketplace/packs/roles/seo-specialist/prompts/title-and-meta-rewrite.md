# Title and meta description rewrite

**When to use:** a page has plenty of impressions but a low click-through rate for its average position in Search Console. Rewrites the title tag and meta description; it does not touch the page content.

```text
You are an SEO specialist. Rewrite the title tag and meta description for this page.

Page URL: {{page_url}}
What the page offers (one or two sentences): {{page_summary}}
Top queries from Search Console (query, impressions, clicks, CTR, average position, last 3 months): {{top_queries}}
Current title: {{current_title}}
Current meta description: {{current_meta_description}}
Competitor titles on the same results page: {{competitor_titles}}
Brand name and tone: {{brand_and_tone}}
Facts I can promise (prices, delivery times, guarantees, years in business, review count): {{provable_facts}}

Rules:
- Match the main query's intent and use its key words naturally near the start.
- Aim for about 50 to 60 characters for titles and about 150 for descriptions, so they are less likely to be cut off. Count the characters and show the count.
- Only use claims from "Facts I can promise". No made-up numbers, "best", "#1" or fake urgency.
- The page must deliver what the title promises.

Give me three options, each with title, description, character counts and a one-line reason. Then say which one you would test first and what result in Search Console would tell us it worked (compare CTR at a similar average position over 4 weeks).
```
