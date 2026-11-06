---
name: ai-crawler-access-review
description: Reviews whether the crawlers behind AI answers and AI training can reach a site, and whether that matches the owner's choices. Checks robots.txt for OAI-SearchBot, GPTBot, ChatGPT-User, Google-Extended, Googlebot, PerplexityBot, Perplexity-User, ClaudeBot, Claude-SearchBot, Claude-User and bingbot; CDN and firewall bot rules; meta robots and snippet controls; Bing NOCACHE and NOARCHIVE; the Search Console generative AI setting; server logs; and whether key content is in plain HTML. Produces a decision table and a recommended robots.txt. Use when setting up AEO work, when a client wants to block AI training without losing AI visibility, or when AI engines never cite the site.
---

# AI crawler access review

The first question in any AEO job: can the right bots reach the content, and has the owner chosen on purpose which bots to allow? Search crawlers, user-fetch agents and training crawlers do different things. Blocking the wrong one removes a site from answers; allowing the wrong one may hand content to training against the owner's wishes. This skill separates them and writes the rules.

## When to use

- At the start of every AEO or GEO engagement.
- A client wants to stop AI training but keep appearing in AI answers.
- An engine never cites the site even though it ranks well in search.
- After a CDN, firewall or hosting change.

## What you need

**Access:** level 1 for steps 1 to 7, because the review changes nothing. Level 2 to save the new robots.txt on staging or as a file, and to write CDN rules without switching them on. Level 3 to publish the agreed robots.txt lines and bot rules, within the bots and sites you named. The Search Console generative AI setting, and any rule that could block search engines or real visitors, always need a new yes.

1. The site's **robots.txt** (public at /robots.txt) and any subdomains' robots.txt.
2. **CDN or firewall bot settings:** screenshots of bot management or AI crawler blocking settings (for example in Cloudflare, Akamai, Fastly, or the host's security plugin).
3. **Server or CDN logs** for two to four weeks, filtered to the user agents below, with personal data removed (optional but valuable).
4. A screenshot of **Search Console Settings > Search generative AI** (owners only).
5. The owner's **position on AI training:** allow, block, or undecided.
6. Two or three **key page URLs** to test for content visibility.

## Steps

### 1. Record the owner's decisions
Ask two separate questions:
- "Do you want to appear and be cited in AI answers?" (almost always yes)
- "Do you want your content used to train AI models?" (a business and licensing choice; there is no wrong answer)

### 2. Read robots.txt against each agent
Fill this table from the file. Remember that a specific user-agent group overrides the `*` group for that bot.

| Agent | Purpose (per its owner's docs, checked 2026-11-06) | Current rule | Matches decision? |
|---|---|---|---|
| Googlebot | Google Search, including AI Overviews and AI Mode | | Must be allowed |
| Google-Extended | Gemini training and Gemini Apps grounding; no effect on Search | | Training choice |
| OAI-SearchBot | ChatGPT search | | Visibility choice |
| GPTBot | OpenAI training | | Training choice |
| ChatGPT-User | Fetches for a user's request; robots.txt may not apply | | Visibility |
| PerplexityBot | Perplexity search results; not training | | Visibility choice |
| Perplexity-User | Fetches for a user's request; generally ignores robots.txt | | Visibility |
| ClaudeBot | Anthropic training | | Training choice |
| Claude-SearchBot | Claude search | | Visibility choice |
| Claude-User | Fetches for a user's request | | Visibility |
| bingbot | Bing search | | Must be allowed |

Look for accidental blocks: a broad `Disallow: /` under `User-agent: *` with exceptions only for Googlebot, wildcard rules copied from a "block AI" template, or blocked CSS and JavaScript.

### 3. Check the layer above robots.txt
CDN and firewall rules can block a bot that robots.txt allows. Check bot management screens for "block AI crawlers" or "AI scrapers" switches and custom rules. If logs show requests from OpenAI, Perplexity or Anthropic agents getting 403 or challenge responses, the CDN is blocking them. Verify bots by their published IP lists where the owner documents them (OpenAI, Perplexity and Anthropic publish JSON lists), because user-agent strings can be faked.

### 4. Check page-level controls
- `noindex`, `nosnippet`, `data-nosnippet` and `max-snippet` limit what Google can show, in AI features as well as classic results.
- Bing's NOCACHE and NOARCHIVE tags (announced in 2023 for Bing Chat) limit use in chat answers and training; check whether the site uses them, and whether that matches the owner's wishes.
- The Search Console generative AI setting must be "Include" if the owner wants to appear in AI Overviews and AI Mode. "Exclude" removes the site from them within about one to two days.

### 5. Check content is readable without tricks
Fetch two or three key pages and view the raw HTML (or the page with JavaScript turned off). Key facts, prices and answers should be in the HTML text, not only in images, PDFs, collapsed tabs or content that loads after a click. Microsoft advises the same for its AI answers.

### 6. Read the logs
Count requests per agent per week, the status codes they received and the pages they fetched. Search agents that never appear may be blocked upstream or may not have discovered the site. User-fetch agents appearing on specific pages show real users asking about that content.

### 7. Write the recommendation
Produce the decision table, the exact robots.txt lines, any CDN changes and the Search Console setting. Explain that robots.txt is a request: Cloudflare reported in August 2025 that Perplexity used undeclared crawlers to reach sites that had blocked it. Owners who need hard blocks must use firewall rules, accepting the trade-offs. At level 3, apply only the lines and rules the owner agreed, check them the same day, and log each change.

## Checks before you ship

- Googlebot and bingbot are never blocked by an AEO change.
- Search, user-fetch and training agents are handled as separate decisions.
- Every rule cites the owner's documentation and the date checked.
- The robots.txt draft has been tested with a robots.txt testing tool or parser before going live.
- The owner approves training choices in writing.
- Changes take time: about 24 hours for OpenAI and Perplexity, one to two days for Google's AI setting.

## Output format

1. Summary: what is blocked, what should be, and the risk.
2. Decision table (as in step 2), completed.
3. Recommended robots.txt block in a code block.
4. CDN, page-level and Search Console changes.
5. Log findings, if logs were provided.
6. What to re-check and when.

## Example of good output (made for this kit, not a real client)

> **Summary.** The owner wants to appear in AI answers but not be used for training. Today robots.txt blocks every AI agent, including OAI-SearchBot and PerplexityBot, through a template copied in 2025, and the CDN's "block AI bots" switch is on. Result: the site cannot appear in ChatGPT or Perplexity search answers. Google-Extended is blocked, which matches the training choice and does not affect Google Search.
>
> ```text
> User-agent: GPTBot
> Disallow: /
>
> User-agent: ClaudeBot
> Disallow: /
>
> User-agent: Google-Extended
> Disallow: /
>
> User-agent: OAI-SearchBot
> Allow: /
>
> User-agent: PerplexityBot
> Allow: /
>
> User-agent: Claude-SearchBot
> Allow: /
>
> User-agent: *
> Disallow: /checkout/
> Disallow: /account/
> ```
>
> **Also:** turn off the CDN's blanket AI block and add a rule that blocks only the training agents; keep Search Console's generative AI setting on Include. Re-check logs in two weeks for OAI-SearchBot and PerplexityBot requests returning 200.
