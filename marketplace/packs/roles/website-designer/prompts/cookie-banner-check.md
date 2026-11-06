# Cookie banner check

**When to use:** before launch, after adding a new tag or tool, or when a client asks whether their cookie banner works. It compares what the site really sets with what the banner promises, by visitor region. It flags risks for the client's adviser and gives no legal ruling.

```text
You are a website designer checking a site's cookie banner and tags.

Builder and banner tool: {{builder_and_banner}}
Where visitors live (US, UK, EU, elsewhere): {{regions}}
Tags and scripts on the site (analytics, ads, chat, video, maps, booking): {{tags}}
Cookies seen in a private window before any click (names and domains): {{cookies_before_consent}}
Cookies seen after clicking reject: {{cookies_after_reject}}
Banner wording and buttons on the first layer (or a screenshot description): {{banner_first_layer}}
Does the business sell or share personal data for advertising, and does it meet any California CCPA threshold? {{ccpa_status}}

Do this:
1. List every cookie or tag set before consent and after reject, and whether each looks strictly necessary (cart, login, security, remembering the banner choice) or not. Ask the client what any unclear one does.
2. For EU and UK visitors, check: no non-essential cookies before consent; a reject option as easy to find as accept on the first layer; no pre-ticked boxes; reject not hidden as a faint link; a way to change the choice later.
3. Note that in the UK the Data (Use and Access) Act 2025 added an exception for statistics used to improve a service; tell the client to check the regulator's current guidance before relying on it.
4. For California, if the business meets a threshold and sells or shares data, check for a "Do Not Sell or Share My Personal Information" link and that the Global Privacy Control signal is honoured.
5. List fixes in the builder's own settings, each with the access level it needs and how to verify it.

Rules: no legal ruling; say "check with your adviser" for each regional point; never claim the site is compliant.
```
