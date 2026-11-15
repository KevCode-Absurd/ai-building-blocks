# Ad rules and age check

**When to use:** before launching any Snapchat ad, Dynamic Ad or creator ad. It catches claim, age, teen, disclosure and safe-zone problems before Snap's review does.

```
Check this Snapchat ad before launch.

- Format (Single Image or Video, Story, Collection, Sponsored Snaps, Commercial, Lens): {{format}}
- Script or transcript and on-screen text: {{ad_text}}
- Brand name and headline: {{brand_and_headline}}
- Is it a creator's post? Paid or gifted? Paid Partnership tag on? {{creator_relationship}}
- Any AI-made person, voice or scene: {{ai_elements}}
- Product category: {{category}}
- Countries, states and age range we plan to reach: {{countries_states_and_ages}}
- Proof for each claim: {{proof}}

Return a table: issue, where it appears, why it matters, the fix. Check:
1. Every claim has proof; flag any health, weight, money or "guaranteed" claim.
2. Age floor matches Snap's policy for each country and state (for example alcohol 21+ in the US; 18+, 21+ or 25+ by Indian state; dating, weight loss and cosmetic treatment 18+).
3. No customer lists or personalised targeting for under-18s in India, the EU or the UK.
4. Creator ads carry the Paid Partnership tag and say and show "ad" in the video (FTC in the US; an ASCI label such as Ad or Sponsored in India).
5. No AI person, voice or scene that could mislead; an AI person who speaks is said to be AI on screen.
6. Brand name up to 25 characters, headline up to 34, no all-capitals headline; logo and key text outside the top 150 px and bottom 330 px (450 px for Collection).
7. Sponsored Snaps: no specific discount offer; not a health, employment or credit ad.
8. Anything I must check in Snap's current advertising policies or in Ads Manager.
Do not give a legal ruling; where a point needs one, say "ask your adviser".
```
