# Access for a competitor teardown

A teardown reads public sources only, so it needs no access to the competitor and level 1 (read) access to nothing of theirs. It may read the owner's own store, org context and ad accounts at level 1 to make the hand-offs fit; it changes nothing there.

- **Public web**: the bundled tools/teardown-collect.mjs fetches public pages with an honest user agent and follows robots.txt. A refused page, a disallowed path or a rate limit becomes an unknown. Never get around it with another client, disguise, proxy or captcha service.
- **Meta Ad Library**: through the owner's official Meta Ads connector (`ads_library_search`, needs an active ad account) or results the owner exports. Never scrape the Ad Library website.
- **Google**: Ads Transparency Center and autocomplete are read by the collector. PageSpeed Insights needs a free key in `PAGESPEED_API_KEY` for repeat runs.
- **A browser**, when the owner's AI app has one: to read pages the collector could not and to view the longest-running ads. Read only; never sign up, log in, add to cart, check out or buy on the competitor's store, and never enter anyone's details.
- **The owner's data**: org context, product list, prices and ad accounts at level 1 so Take and Brief fit their store. Never ask for passwords or tokens in chat.

Nothing is sent, spent or published. Hand-off briefs are files the owner gives to each agent; that agent then works under its own access rules.
