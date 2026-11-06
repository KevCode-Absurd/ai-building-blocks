# Test briefs: hard AEO and GEO jobs

Each brief is a realistic, difficult request. The coach runs it against your agent and against a plain AI answer, then scores both against "A great answer must".

## 1. The thin brief

> We want to show up in ChatGPT. Can you do that? We sell accounting software for small firms.

A great answer must:
- Ask for real customer questions, main competitors and markets before promising anything.
- Explain that answers vary run to run, so it will measure a share of answers over many runs, not a rank.
- Check access first: robots.txt for OAI-SearchBot, CDN rules, and indexing in Bing and Google.
- Name the likely levers (clear facts, quotable pages, third-party sources AI cites) and say what is unknown because OpenAI does not publish how it ranks sources.
- Offer a concrete first step, such as a baseline audit of 30 questions.

## 2. The client who wants the wrong thing

> An agency says we need llms.txt, a special AI schema and 300 FAQ pages, one per question people ask AI. Can you build them by Friday?

A great answer must:
- Say plainly what the evidence shows: Google says it does not use llms.txt or need special schema; studies find no citation effect from llms.txt.
- Explain that a page per question variation counts as scaled content abuse in Google's view.
- Offer what would help instead: strengthening existing pages, a clear facts page, earned coverage.
- Allow a simple llms.txt if the client still wants it, with an honest note that it is not a ranking tool.
- Stay respectful about the agency while protecting the client.

## 3. Conflicting goals

> Legal wants us to block every AI company from our content. Marketing wants us in every AI answer. Sort it out.

A great answer must:
- Separate training crawlers (GPTBot, ClaudeBot, Google-Extended) from search and user-fetch agents (OAI-SearchBot, PerplexityBot, Claude-SearchBot and others).
- Show a decision table and robots.txt that blocks training while allowing visibility, with sources.
- Explain the limits: robots.txt is a request; user-fetch agents may not follow it; Google-Extended does not affect Search or AI Overviews.
- Mention the Search Console generative AI setting and what Exclude would cost.
- Put the final call with the client, in writing.

## 4. Tricky data

> Our tracker says our AI visibility jumped from 12% to 41% this month, but AI Assistant traffic in GA4 is flat. Is the tool broken?

A great answer must:
- Ask for run counts, prompt set changes, engine changes and the tracker's method before trusting either number.
- Explain run-to-run noise and how a changed prompt set or model can move a share without real change.
- Explain why mentions and clicks differ (many answers satisfy the user, app clicks lose referrers).
- Check the first-party reports: Search Console Generative AI impressions and Bing AI Performance citations.
- Propose a way to confirm: re-run a fixed subset with more runs.

## 5. Wrong facts everywhere

> ChatGPT and Perplexity keep saying we closed our Manchester branch. We did not. Customers are calling to ask.

A great answer must:
- Collect the answers with cited URLs, run several times.
- Trace the claim to its source (an old page of the client's, a directory, a news story, a similarly named business).
- Fix at the source first, then make the true fact clear on the client's own site, Business Profile and Bing Places, with dates.
- Set a re-check schedule and explain that changes take time to flow through.
- Not promise an instant fix or suggest contacting AI companies as the main route.

## 6. The dominant third party

> In every AI answer about our category, the engines cite one big review site, which ranks our rival first and does not list us.

A great answer must:
- Confirm the pattern with a coded sample and cited-domain counts.
- Find the honest route in: the site's submission or testing process, accurate data, a product to test.
- Look for the other sources engines cite and build presence there too.
- Strengthen the client's own comparison content with original data.
- Refuse fake reviews, paid undisclosed placements or pressure tactics.

## 7. The panicked publisher

> Our blog traffic fell 40% since AI Overviews spread. Should we block Google's AI?

A great answer must:
- Explain the real options: Search Console's generative AI setting (Exclude removes the site from AI Overviews and AI Mode but not from Search), snippet controls, and that Google-Extended does not affect Search.
- Lay out the trade-off: excluding removes citations and impressions as well as summaries.
- Use data: Search Console clicks, impressions and Generative AI impressions by page, and published studies with their caveats.
- Suggest content and format changes that still win clicks, and better conversion of the visits that remain.
- Leave the decision with the owner, with a way to test and reverse it.

## 8. The vendor promise

> A tool vendor shows a dashboard saying we 'rank 3rd in ChatGPT' and guarantees first place in 90 days for $3,000 a month. Should we sign?

A great answer must:
- Explain why a stable AI rank does not exist, citing research on run-to-run variation.
- Point out that no outside tool has access to Google's internal systems and that OpenAI publishes no ranking factors.
- List the questions to ask the vendor (prompt set, runs, method, what the work involves).
- Say what in the offer could be worth paying for, if anything.
- Give a clear verdict.
