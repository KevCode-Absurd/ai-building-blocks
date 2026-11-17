---
name: ai-answer-visibility-audit
description: Measures how often a brand is mentioned, linked and cited in AI answers (Google AI Overviews and AI Mode, ChatGPT search, Perplexity, Microsoft Copilot, Claude, Gemini) for a fixed set of real buyer questions, run several times per engine. Codes every answer for mention, citation, position, rivals, sentiment and factual accuracy, maps the domains AI cites, and turns the gaps into a ranked fix plan. Use for a first AI visibility baseline, before and after AEO or GEO work, or when a client asks "does ChatGPT recommend us?"
---

# AI answer visibility audit

AI answers change from run to run. One screenshot proves nothing. This audit samples each question several times on each engine, records what happened in a fixed format, and reports shares ("named in 14 of 30 runs") instead of ranks. It also shows which outside sources the engines lean on, because that is where most of the fixable gaps are.

## When to use

- A first baseline for a new client.
- Before and after a round of AEO or GEO work.
- When a client hears "ChatGPT recommends our competitor" and wants to know if that is true and why.

## What you need

**Access:** level 1 for every step. Running questions in public AI tools needs no access at all; Search Console, Bing and GA4 data need level 1 or exports. Level 3 only to load the frozen prompt set into your tracker, within its prompt limits.

1. **Brand facts:** name and common variants, website, what it sells, to whom, where, price range, and three to five named competitors.
2. **Real buyer questions:** from sales calls, support tickets, site search, Search Console queries phrased as questions, and "People also ask". Aim for 30 to 60 questions across the buying stages: problem ("why does my boiler keep losing pressure"), category ("best boiler service plans in Leeds"), comparison ("Brand A vs Brand B"), and brand ("is Brand A any good").
3. **Engines and settings:** which engines matter to this market, and the country or city to test from.
4. **Optional data:** Search Console Generative AI report export, Bing Webmaster Tools AI Performance export, GA4 AI Assistant channel report, a tracker export (Profound, Peec AI, Otterly.AI, Semrush AI Visibility Toolkit or Ahrefs Brand Radar).

## Steps

### 1. Build and freeze the prompt set
Write each question the way a real buyer would type or say it. Tag each by stage and topic. Freeze the list and its wording; changing prompts between rounds breaks comparisons. Keep 10% as brand questions to test accuracy.

### 2. Set the test conditions
For each engine, record mode (for example ChatGPT with search on, Google AI Mode, Perplexity default), whether you are logged in, location, language and date. Use clean sessions with no personal memory or custom instructions. Note that trackers using APIs may see different answers from logged-in users; say which method you used.

### 3. Run each question several times
Run each prompt at least three times per engine per round for a baseline, more for the questions that matter most. A published test by SparkToro and Gumshoe found identical prompts rarely returned the same brand list, while the share of runs mentioning a brand was steadier. More runs give tighter numbers; state the count.

### 4. Code every answer
One row per run:

question | stage | engine | mode | run | date | brand mentioned (yes/no) | brand linked or cited (yes/no) | position in list (if a list) | rivals named | cited domains | sentiment (positive, neutral, negative) | facts stated about the brand | any fact wrong (yes/no, which)

Copy the cited URLs exactly. Mark answers where the engine did not search the web. Keep operational errors, absent AI answers, valid answers without mentions, and unverified factual claims distinct. A failed request is not evidence of brand absence.

### 5. Calculate the measures
- **Mention share:** valid answers mentioning the brand ÷ valid answer observations, by engine and stage.
- **Citation share:** valid answers citing the brand's site ÷ valid answer observations. A brand-name link and a supporting citation are separate fields.
- **Response availability:** valid answer observations ÷ scheduled observations; report operational failures and absent AI answers separately.
- **Rival shares** on the same basis.
- **Accuracy rate:** fully verified accurate brand answers ÷ brand answers assessed. Report unverified claims separately; lack of detected errors is not verification.
- **Top cited domains:** count how often each domain is cited across all runs, and mark each as own site, competitor, earned media (independent publisher, review site, directory, forum, encyclopedia) or marketplace.

Report shares with run counts (for example "31%, 19 of 61 runs"). Treat differences of a few runs as noise.

### 6. Read the platform data
Inspect available Search Console Generative AI impressions, Bing AI Performance and GA4 AI Assistant reports; use their actual fields and limits. Open the [report documentation](https://support.google.com/webmasters/answer/16984139) and [feature release notes](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports) before stating whether Google offers a dedicated report. Record both the documented capability and the independently observed account availability; no account access means availability unknown, not feature absent. The general AI-features page alone cannot settle this comparison. Follow workflows/ai-referral-tracking-setup.md for field limits and account checks. Record source update dates as well as retrieval dates. Resolve conflicting older general pages against newer feature documentation and release notes; do not silently discard either source. Account exports and a prompt panel have different populations and cannot establish causal revenue by themselves. Zero denominators mean not measurable.

### 7. Diagnose the gaps
For each weak area, decide which kind of gap it is:
- **Access gap:** crawlers blocked or pages not indexed (run the ai-crawler-access-review skill).
- **Content gap:** no page on the site answers the question directly (run citation-ready-page-rewrite or brief a new page).
- **Earned media gap:** engines cite third-party pages that do not mention the brand (target those domains for reviews, inclusion, data or expert comment).
- **Fact gap:** engines state wrong or outdated facts (run brand-facts-and-entity-audit).
- **Demand gap:** the question rarely triggers web search or mentions any brand.

### 8. Rank the fixes
Score each fix 1 to 3 on business value of the questions affected, likely effect, and effort (inverted). Put access and fact errors first: they are cheap and they block everything else.

## Checks before you ship

- Prompt set, engines, modes, dates, location and run counts are written down.
- No claim of "rank" or "position" as if it were stable.
- Every wrong fact has the source that likely caused it.
- Platform reports are labelled with their limits (Google's report shows impressions only).
- Vendor tracker numbers are labelled as vendor data.
- No fix involves fake reviews, planted forum posts or hidden text aimed at AI.

## Output format

1. **Summary:** mention and citation shares by engine against rivals, the biggest gap, the top three fixes.
2. **Engine table:** engine | runs | mention share | citation share | top rival share | accuracy.
3. **Stage table:** the same by buying stage.
4. **Cited domains table:** domain | type | times cited | mentions the brand? | action.
5. **Errors table:** wrong statement | engine | likely source | fix.
6. **Fix plan:** fix | gap type | questions affected | owner | effort | how we will measure.
7. **Appendix:** the prompt set and the raw coded rows.

## Example of good output (made for this kit, not a real client)

> **Summary.** Across 40 questions, 3 runs each on 4 engines (480 runs, 2026-11-02 to 2026-11-04, UK, logged out), the brand was mentioned in 22% of runs and cited in 9%. The main rival was mentioned in 61%. The gap is widest on category questions (8% versus 70%). Engines cited two review sites and one trade magazine in over half of category answers; none of them mention the brand.
>
> | Engine | Runs | Mention share | Citation share | Top rival | Accuracy |
> |---|---|---|---|---|---|
> | Google AI Mode | 120 | 28% (34) | 15% (18) | 66% | 9 of 10 brand answers correct |
> | ChatGPT search | 120 | 18% (22) | 6% (7) | 58% | 6 of 10 (states the old price) |
>
> **Top fixes.** 1) Correct the 2024 price on the brand's own pricing page and a directory listing that ChatGPT cites. 2) Apply to both review sites' category tests with the 2026 product. 3) Add a comparison page with the brand's own test data.
