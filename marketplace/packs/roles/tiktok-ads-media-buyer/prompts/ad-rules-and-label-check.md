# Ad rules and AI-label check

**When to use:** before launching any TikTok ad or Spark Ad, to catch claims, disclosure, AI-label, teen and consent problems.

```
Check this TikTok ad before launch.

- Script or transcript and on-screen text: {{ad_text}}
- Caption: {{caption}}
- Is it a creator's post? Paid or gifted? {{creator_relationship}}
- Any AI-made or AI-changed person, voice or scene: {{ai_elements}}
- Product category: {{category}}
- Countries and age range we plan to reach: {{countries_and_ages}}
- Proof for each claim: {{proof}}

Return a table: issue, where it appears, why it matters, the fix. Check:
1. Every claim has proof; flag any health, weight, money or "guaranteed" claim.
2. Creator ads disclose the relationship in the video, spoken and on screen, and use TikTok's commercial content setting.
3. AI-made realistic people, voices or scenes have the AIGC disclosure on.
4. No personalised targeting of teens in the US; no targeted ads to children in the EU; restricted products not shown to under-18s.
5. The Pixel fires only after consent for UK and EU visitors on the landing page.
6. Anything I must check in TikTok's current advertising policy in Ads Manager.
Do not give a legal ruling; where a point needs one, say "ask your adviser".
```
