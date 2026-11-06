# AI referral tracking setup

**Trigger:** the start of any AEO or GEO engagement, or when a client asks "how much business does AI bring us?". Run once, then check monthly.

**Goal:** separate AI traffic and conversions from other channels so results can be measured, and be clear about what cannot be measured.

## Steps

1. **Check GA4's channel grouping** (level 1; tool: GA4, Viewer access or screenshots). Since May 2026 GA4's default channel group has an AI Assistant channel (medium `ai-assistant`) for visits from assistants such as ChatGPT, Gemini, Deepseek, Copilot and Grok. Clicks from Google AI Overviews and AI Mode stay in Organic Search. Confirm the client's reports use the default channel group or a custom group that keeps these rules.

2. **Add a referral check** (level 2 to save it in the client's GA4 property; level 3 for a custom channel group). Build an exploration in GA4 with session source, medium and landing page, filtered to known AI sources (for example sources containing chatgpt.com, perplexity.ai, gemini.google.com, copilot.microsoft.com, claude.ai). ChatGPT adds `utm_source=chatgpt.com` to referral links. Compare with the AI Assistant channel to find sources it misses, and keep a custom channel group only for those.

3. **Mark key events** (level 3, within the property and events agreed). Make sure leads, bookings, sign-ups and purchases are key events, so AI sessions can be judged on outcomes, not visits.

4. **Add a "How did you hear about us?" question** to forms and checkout (level 3 on the forms the client named, or as a request for their developer), with "AI assistant (ChatGPT, Gemini, Copilot, Perplexity, Claude)" as an option and a free-text box. Many AI-influenced visits arrive as Direct (app clicks often drop the referrer) or come later through branded search.

5. **Connect the first-party AI reports** (level 1; tools: Google Search Console and Bing Webmaster Tools). Confirm the site is verified in both. Record a baseline from the Search Console Generative AI performance report (impressions in AI Overviews and AI Mode, impressions only) and from Bing's AI Performance report (citations).

6. **Log bot activity** (optional, level 1; tool: server or CDN logs). Set up a monthly count of requests from OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Claude-SearchBot and Claude-User, with status codes. User-fetch requests show pages being read for real user questions.

7. **Build the monthly view** (level 2; tool: Data Studio (formerly Looker Studio) or a spreadsheet): AI Assistant sessions and key events, AI Overview and AI Mode impressions, Bing AI citations, form answers mentioning AI, branded search clicks. Put organic search beside it for context.

8. **Write the measurement note** for the client: what each number means, what it misses, and why the true influence of AI answers is larger than the tracked clicks.

## Outputs

- A GA4 setup checklist with screenshots.
- A baseline table for the four data sources.
- A monthly dashboard or sheet.
- A one-page measurement note.

## What needs the client's approval

At level 3, after the client confirms the action list and limits once, I do these within them and log each one: save the exploration and the monthly view, create the agreed custom channel group, mark the agreed key events, and add the agreed question to the named forms.

Always a new yes:

- Any other change to GA4 settings, channel groups or key events.
- Any change to checkout.
- Granting any user access to analytics, Search Console or Bing Webmaster Tools.
- Collecting or sharing server logs (remove personal data first).
