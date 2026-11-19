# Take a competitor's marketing apart

Use this for "reverse engineer X", "what is X doing", "teardown of X" or "how does X sell". Read ../access.md, ../knowledge.md, ../prompts/report-writing.md and tools/TEARDOWN.md first.

1. **Ask the mode first, in one message, before any collecting.** "Do you want this personalized to your brand, or general?"
   - **Personalized:** the moves and briefs use your products, prices, customers and voice, and the page puts your numbers next to theirs. Needs your store link (or your Org context, which has it).
   - **General:** a playbook for any store in the category. Briefs come with {placeholders} for you to fill in.
   In the same message confirm the competitor's link, the main market and any lane they care about most. If the owner has an Org context, offer personalized as the default and say what you will read from it. Wait for the answer; do not guess the mode.
2. **Collect them.** `node tools/teardown-collect.mjs <url> --out teardowns/<brand>`. Read evidence.md: scorecard, then every item, then the lane map and unknowns.
3. **Collect you (personalized only).** Read the Org context: voice, products, prices, customers, claims you may make. Then `node tools/teardown-collect.mjs <your-url> --out teardowns/<brand>/you` so your public numbers sit beside theirs as Y#. Pull your own Meta ads the same way as theirs (step 4) into the `you` folder.
4. **Meta Ad Library.** Follow the sampling order in tools/TEARDOWN.md with the connector: brand search, page_ids per country, page_ids plus hero-product and offer words, INACTIVE, and the brand name without page_ids for partner pages. Save each result with its query to `teardowns/<brand>/meta-<n>.json`, then `node tools/teardown-collect.mjs ads teardowns/<brand> teardowns/<brand>/meta-*.json`.
5. **Show their ads.** In a browser, open the brand's Ad Library page for the main country, active ads, sorted by impressions. Screenshot the first 6 to 8 ad cards and add each: `node tools/teardown-shots.mjs add teardowns/<brand> <image> --kind meta_ads --caption "what it shows, format, start date" --source <ad link> --note "the angle in a few words"`. Do the same for 1 to 3 Google ads from the Ads Transparency Center (`--kind google_ads`), and write down its ad count with `node tools/teardown-collect.mjs note teardowns/<brand> --area ads_google --key googleSeen --label "..." --url <link> --data '{"ads":2000,"ads_label":"~2k","region":"US","period":"any time"}'`.
6. **Show their landing pages.** `node tools/teardown-shots.mjs pages teardowns/<brand>` captures the homepage, hero product pages, landing and quiz pages and hidden offer products at phone and desktop width, and reads the colours and fonts the homepage really draws. It needs Playwright; without it, screenshot the pages yourself and `add` them with `--kind page`.
7. **Think before writing.** Write down, privately: the engine in one sentence; the loop; the 3 strongest proofs; the 3 biggest gaps; which lanes deserve a hand-off; in personalized mode, where the owner leads and trails. Prefer one sharp, non-obvious insight over ten generic ones.
8. **Write report.md** from `node tools/teardown-report.mjs template`, in the voice of ../prompts/report-writing.md. Start with the `**Mode:**` line. The page draws the charts, so write what they mean: short bullets, every claim cited, 10 moves ranked with an agent, a week and an effort each, and 6 or more hand-offs whose briefs fit the mode.
9. **Check.** `node tools/teardown-report.mjs check teardowns/<brand>`. Fix every error and every warning you can, including the writing ones. Re-run until ok.
10. **Render and split.** `node tools/teardown-report.mjs render teardowns/<brand> --embed` and `node tools/teardown-report.mjs handoffs teardowns/<brand>`. Open report.html and look at it at desktop and phone width: logo, colours, the board, the ad and page galleries, the charts. If the brand look reads wrong, render with `--brand <brand.json>`.
11. **Deliver.** Lead with the verdict and the first three moves, then share report.html as a file and the handoffs folder. Never post it publicly as if it were the brand's own page. Offer to start any hand-off with its agent.

## Comparing 2 to 4 competitors

Run steps 2 to 9 per brand, then write `teardowns/compare.md`: a table of lanes by brand (who wins each lane and the evidence), the best play to take from each, and the gap none of them fills. Hand-offs in the comparison point to each brand's evidence ids as `<brand>:E12`.

## Watching a competitor over time

Re-run the collector monthly into a new dated folder and compare: live Meta ads, launches, new products, price and offer changes, new tools, homepage pitch. Lead with what changed and what it suggests.
