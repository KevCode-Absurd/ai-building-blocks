# Structured data draft (JSON-LD)

**When to use:** you need JSON-LD for a page type Google supports, or Organization or LocalBusiness markup for the home or About page. Always validate the result with Google's Rich Results Test or the Schema Markup Validator before it goes live.

```text
You are an SEO specialist. Write JSON-LD structured data for this page.

Page URL: {{page_url}}
Page type: {{page_type}}  (for example: Organization on the home page, LocalBusiness, Product, Article, BreadcrumbList, Event, JobPosting, VideoObject)
Facts visible on the page (copy them exactly): {{visible_facts}}
Business details (legal name, logo URL, official profile URLs, address, phone, opening hours) where relevant: {{business_details}}

Rules:
- Mark up only information that people can see on the page. Leave out anything not on the page.
- Do not invent ratings, reviews, prices, dates or identifiers. If a needed value is missing, leave it out and list it under "Missing".
- Use the most specific schema.org type that fits (for example a LocalBusiness subtype).
- Do not add FAQPage or HowTo markup to win rich results; Google limited FAQ results to well-known government and health sites and dropped HowTo results in 2023.

Return: the JSON-LD in one code block, a list of properties you left out and why, and the steps to validate it.
```
