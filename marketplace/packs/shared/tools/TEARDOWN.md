# D2C competitor teardown: tools and run order

Three plain-Node tools take a rival store apart from public evidence and turn it into a data dashboard in the brand's own look, with 10 moves and a brief for each of your agents. None needs an API key; screenshots need Playwright.

**Ask first: personalized or general?** Personalized compares their store with yours and writes every brief for your products, prices and voice (your store is collected into `teardowns/<brand>/you` and cited as Y#). General writes a playbook with {placeholders}. The report's `**Mode:**` line records the answer, and the checker holds each mode to its rules.

| Step | Command | What it does |
|---|---|---|
| 1 | `node tools/teardown-collect.mjs <store-url> --out teardowns/<brand>` | Reads the storefront, every public product, three product pages, pixels and apps, robots.txt, llms.txt, sitemaps, Google autocomplete, YouTube, the Wayback Machine and Trustpilot. Writes `evidence.json` and `evidence.md`. |
| 2 | Personalized only: `node tools/teardown-collect.mjs <your-url> --out teardowns/<brand>/you` | Your own public numbers, to sit beside theirs. |
| 3 | Meta Ad Library through your connector, saved as JSON, then `node tools/teardown-collect.mjs ads teardowns/<brand> meta-*.json` | Live ad count, launch rate, longest-running ads, headlines, partner pages. See "Meta ads" below. Do the same for your own page in personalized mode. |
| 4 | `node tools/teardown-shots.mjs pages teardowns/<brand>` | Phone and desktop screenshots of the homepage, hero product pages, landing and quiz pages and hidden offer products, plus `shots/look.json`: the colours and fonts the homepage really draws, used for the report's theme. |
| 5 | Screenshot 6 to 8 ads in a browser, then `node tools/teardown-shots.mjs add teardowns/<brand> <image> --kind meta_ads --caption "..." --source <ad link> --note "..."` | Their ads, shown in the report. Open the Ad Library page for the brand, active ads, sorted by impressions. Use `--kind google_ads` for the Ads Transparency Center. |
| 6 | `node tools/teardown-collect.mjs note teardowns/<brand> --area ads_google --key googleSeen --label "..." --url <link> --data '{"ads":2000,"ads_label":"~2k"}'` | Records a number you read by hand in a browser (Google's ad count, a TikTok page) as cited evidence. |
| 7 | Write `teardowns/<brand>/report.md` | `node tools/teardown-report.mjs template` prints the skeleton; `prompts/report-writing.md` is the voice. |
| 8 | `node tools/teardown-report.mjs check teardowns/<brand>` | Hard rules: a mode line, citations resolve, 70%+ of claims cite, 10 moves with an agent and a week, hand-offs that fit the mode, no invented spend, quotes match the evidence. Writing warnings: reading grade, stock AI phrasing, em dashes. Fix and re-run until `"ok": true`. |
| 9 | `node tools/teardown-report.mjs render teardowns/<brand> --embed` | One self-contained, light `report.html`: them-vs-you board (or their numbers), the 10 moves by week, their ads, their landing pages, lessons, charts with notes, hand-off cards with a copy button and an evidence appendix. Marked as an independent teardown, not made by the brand. Share it as a file; never post it publicly as if it were the brand's own page. |
| 10 | `node tools/teardown-report.mjs handoffs teardowns/<brand>` | Writes `handoffs/<agent-id>.md`, one brief per agent, ready to hand over. |

Options: `--country GB` (Google region), `--max-pages 8` (catalogue pages of 250), `--no-wayback`, `--no-reviews`, `--no-google`, `--pagespeed` or `PAGESPEED_API_KEY` (mobile speed of the hero product page). On check and render, `--you <dir>` points at your store's bundle when it is not in `<dir>/you`; `--brand brand.json` overrides the look (`logo`, `background`, `text`, `accents`, `fonts.heading`, `fonts.body`).

## Meta ads (the most important paid evidence)

Use the Meta Ad Library tool your AI app has (the official Meta Ads connector has `ads_library_search`; it needs an active ad account). Never scrape the Ad Library website. Pull a sample in this order and save each raw result as a JSON file in the teardown folder:

1. Search by the brand name, `ad_active_status: ACTIVE`, the brand's main country, `limit: 50`. Note the brand's `page_id` (and any second brand page).
2. `page_ids: [<id>]`, ACTIVE, limit 50, for each main country (for example US, GB, CA, AU). Newest ads come first, so extra countries widen the sample.
3. `page_ids` plus `search_terms` for each hero product name or offer word from the evidence (for example "subscribe", "bundle", the best seller). This surfaces older ads that are still running: the winners.
4. `page_ids`, `ad_active_status: INACTIVE`, limit 50: what they stopped recently (the losers).
5. Brand name search without `page_ids`: other pages running ads for the brand are creators, affiliates or partners (partnership or whitelisted ads). Check the page names.

**Save each pull with its query**, so the tool can tell live ads from stopped ones and the brand page's count from a keyword count:

```json
{ "query": { "page_ids": ["102637398978655"], "ad_active_status": "ACTIVE", "countries": ["US"], "search_terms": null },
  "response": { "results": "…the connector's result, exactly as returned…" } }
```

The response may also be a compact list you write yourself to save tokens: `[{"id": "…", "page_id": "…", "page_name": "…", "title": "…", "start": "2026-11-04"}]`. Put the connector's `estimated_total_count` beside `query` and `response` so the live total is kept. Without a query the tool still reads the ads but does not claim a live total. The live total it reports is the estimate from an ACTIVE pull filtered to the brand page with no search words: that pull is step 2, so never skip it. Launch counts and run lengths use the brand page only; other pages are listed with a few headlines each, for you to judge (sister brands and creators matter; software firms naming the brand do not).

The connector returns headlines, dates and snapshot links, not ad text, formats or landing pages, and it lists newest ads first. So read angles from headlines and how many ads share each one, read run length from the oldest live ads you could surface with search words, and say what you could not see. If the connector is missing, ask the owner to export or paste Ad Library results, or record Meta as an unknown with the Ad Library link. If a browser is available, open the snapshot URLs of the 5 to 8 longest-running ads and write down the opening line, format (video, static, carousel), who is on screen, the offer and the landing page. Quote only what you saw.

## When the brand look is read wrong

The collector reads the logo, colours and fonts from the store's code. If the report shows a press logo, a collab font or the wrong colours, run `node tools/teardown-shots.mjs look teardowns/<brand>` (it reads what the browser draws), or write a small brand JSON with `logo`, `background`, `text`, `accents` and `fonts.heading` / `fonts.body` and render with `--brand <that file>`. Name the report file anything and pass it with `--report <file>`.

## Rules the tools follow, and you follow too

- Public pages only. The collector names itself in its user agent and obeys robots.txt. A site that refuses it, a path robots.txt disallows, or a rate limit is recorded as an unknown. Never get around a block: no other clients, disguises, proxies or captcha services. Read it yourself in a browser, or ask the owner.
- Never sign up, log in, add to cart, start checkout or buy on the competitor's store. Never enter anyone's details. Email history comes from public archives such as Milled.
- A pixel proves the tool is installed, not current spend. Unknown is never "not doing it". Spend, revenue, margins and conversion rates are private: use proxies (live ads, launch rate, run length, review growth) and label any estimate.
- Study the strategy, ship your own. Do not copy their ads, words, images or brand into the owner's work. Their name, logo and product images appear in the report only to analyse them.
