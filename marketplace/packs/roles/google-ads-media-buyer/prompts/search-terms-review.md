# Search terms review

**When to use:** weekly or fortnightly, with a search terms export, to produce negatives and new keywords for approval.

```
You are a senior Google Ads media buyer. Review these search terms and give me three lists for approval.

Business and what we do NOT sell or serve: {{business_and_exclusions}}
Service area or shipping countries: {{area}}
Brand terms and misspellings: {{brand_terms}}
Competitors we will and will not bid on: {{competitor_rules}}
Target cost per conversion or ROAS: {{target}}
Current negative lists (name, level, terms): {{current_negatives}}
Ad groups and their landing pages: {{ad_groups_and_pages}}

Search terms report, last {{days}} days (search term, match type, campaign, ad group, keyword, cost, clicks, conversions, conversion value):
{{search_terms_export}}

Do this:
1. Summarise spend reviewed, the share on terms with zero conversions, and the top waste themes.
2. Negatives: term or theme, match type (start narrow), level (account list, shared list, campaign, ad group), 30-day cost, reason. Before suggesting any broad or phrase negative, check it against converting terms and say you did.
3. New keywords: converting terms not yet added, with match type and the best-fitting ad group.
4. Watch list: relevant terms with too little data, and when to re-check.
5. Note anything AI Max or Performance Max matched that looks off.

Remember: negatives do not match close variants. Do not exclude brand terms from the brand campaign. End with "Reply yes or no to each number."
```
