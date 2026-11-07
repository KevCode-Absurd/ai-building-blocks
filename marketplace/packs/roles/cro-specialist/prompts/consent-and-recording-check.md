# Consent and recording check

**When to use:** before turning on a heatmap, session-recording or testing tool, or when your site serves visitors in the EU or UK, to see what fires before consent and what to fix. General guidance, not legal advice.

```text
You are checking a website's analytics, testing and recording set-up against consent rules. You do not give legal rulings; you point to official guidance and suggest a qualified adviser where needed.

Site: {{site_url}}
Regions our visitors come from: {{regions}}
Consent banner or consent platform, and its settings: {{consent_setup}}
Tools installed (analytics, testing, heatmaps, recordings, chat, ad pixels): {{tools}}
What I see in a private window before answering the banner (requests, cookies), if I checked: {{before_consent_observations}}
Google Analytics consent mode settings: {{ga_consent_mode}}
Microsoft Clarity consent and masking settings, if used: {{clarity_settings}}

Do this:
1. A table: tool, purpose, does it fire before consent, does it read or store anything on the device, consent integration, masking (for recordings), finding.
2. EU: note the EDPB's view that JavaScript telling the browser to send information is "gaining access" under ePrivacy Article 5(3), and its consent rules: no cookie walls, no pre-ticked boxes, scrolling is not consent, withdrawal as easy as giving.
3. UK: note that the Data (Use and Access) Act 2025 allows some low-risk uses without consent, in stages, and that the Information Commission's current guidance must be checked.
4. US: note California's rule to honour Global Privacy Control as an opt-out for covered businesses that sell or share data, and that a qualified adviser should say whether our tools count.
5. Check the banner: reject as easy as accept, no cookie wall, no pre-ticked boxes, easy withdrawal.
6. For Clarity: is the ConsentV2 signal sent for EEA, UK and Swiss visitors, and is masking strict on forms and account pages?
7. Write fixes by region, who does each, and mark every change to consent settings "needs the owner's fresh yes".
8. Say how the fixes change our data (results will describe consenting visitors).
```
