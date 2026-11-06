# Search results intent check

**When to use:** before you write or rewrite a page, to make sure the page type and angle match what Google already ranks for the query. Paste what you see on the results page; the AI should not guess at results it cannot see.

```text
You are an SEO specialist. I am planning a page for the search "{{primary_query}}" in {{country_or_city}}.

Here is what the live Google results page shows (copied or summarised by me, signed out):
- Top 10 results (title, URL, page type): {{top_10_results}}
- Features on the page (AI Overview, map pack, shopping, video, People also ask, forums, ads): {{serp_features}}
- What the AI Overview says, if there is one: {{ai_overview_text_or_none}}

My site: {{site_url}}. The page I plan: {{planned_page_type_and_angle}}.
The business goal of the page: {{goal_action}}.

Do this:
1. Name the main intent (informational, commercial investigation, transactional, navigational, local) and any mixed intent, with the evidence from the results.
2. Say which page type wins here and whether my planned page type fits. If it does not, say what to build instead.
3. List what the top results all cover (table stakes) and what none of them offers that my business could add from first-hand experience or data.
4. Say how likely clicks are, given the features on the page, and what format could win them (video, table, tool, images).
5. Give a verdict: build, change the plan, or skip, with one sentence of reasoning.

Only use the results I pasted. If something is missing, ask for it instead of guessing.
```
