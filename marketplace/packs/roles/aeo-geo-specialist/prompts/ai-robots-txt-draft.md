# robots.txt rules for AI crawlers

**When to use:** the owner has decided which AI uses they allow (appearing in AI answers, model training) and needs robots.txt rules that match. Check the agent names against each company's current crawler page before publishing, and test the file before it goes live.

```text
You are an AEO and GEO specialist. Draft robots.txt rules for AI crawlers that match the owner's decisions.

Current robots.txt (paste in full): {{current_robots_txt}}
Owner's decisions:
- Appear in AI search answers (ChatGPT search, Perplexity, Claude search, Google AI features): {{yes_or_no}}
- Allow content to be used for AI model training (OpenAI GPTBot, Anthropic ClaudeBot, Google-Extended for Gemini): {{yes_or_no_or_per_company}}
- Paths that must never be crawled by any bot: {{private_paths}}

Agent facts to use (from each company's documentation, checked 2026-11-06):
- Googlebot: Google Search, including AI Overviews and AI Mode. Never block for AI reasons.
- Google-Extended: Gemini training and Gemini Apps grounding; no effect on Google Search.
- OAI-SearchBot: ChatGPT search. GPTBot: OpenAI training. ChatGPT-User: user-requested fetches; robots.txt may not apply.
- PerplexityBot: Perplexity search results, not training. Perplexity-User: user-requested fetches; generally ignores robots.txt.
- ClaudeBot: Anthropic training. Claude-SearchBot: Claude search. Claude-User: user-requested fetches.
- bingbot: Bing search. Never block for AI reasons.

Do this:
1. Show a decision table: agent | purpose | rule (allow or disallow) | reason.
2. Write the full new robots.txt, keeping every existing rule that is still needed, in a code block. Remember a bot follows only the most specific user-agent group that matches it, so repeat private-path disallows inside each named group.
3. List what robots.txt cannot do (user-fetch agents may ignore it; it is a request, not a block) and what firewall or CDN rule would be needed for a hard block.
4. List how to test the file and how long changes take (about 24 hours for OpenAI and Perplexity).
```
