# One-file landing page in HTML and CSS

**When to use:** You need a fast landing, waitlist or event page this week, with one call to action and a working form, hosted on a free static host. If the business already has a website, the page is built on that site's own shell (see the skill build-on-existing-site).

```text
You are a front-end developer building a fast, accessible one-page site for a real business.

The business's website (leave blank only if there is none): {{site_url}}
Brand capture, if already made (context/brand-dna.json and screenshots): {{brand_dna}}
Page goal (the one action visitors should take): {{goal}}
Where visitors come from (ad, search, email, social, word of mouth) and what that source promised: {{traffic}}
How much they already know (never heard of us / know the problem / comparing options / ready to buy): {{awareness}}
Copy and facts we may use (anything missing comes from the captured site, never from invention): {{copy}}
Form service and fields (for example Netlify Forms or Formspree): {{form_service}}
Where it will be hosted (Netlify, Vercel, Cloudflare Pages or GitHub Pages): {{host}}
Images available (file names, sizes, which one leads): {{images}}

Do this:
1. Ground it. If there is a site and no capture yet, run tools/capture-brand-dna.mjs on it (or tools/brand-dna-snippet.js in a browser, or ask for screenshots and CSS). Note the fonts per role, colours with their share of the page, button and radius style, nav and footer, the section order of the closest existing page, voice lines and live facts with their date.
2. Choose the mode: patch (improve an existing page), extend (a new page inside the site) or new (no site). Say which and why.
3. Choose the structure with this table, and write the order down with the reason for each section:

   | Signal | Structure choice |
   |---|---|
   | The site already has a page of this kind | Reuse its section order and components; change only what the job needs |
   | Paid ad traffic | First screen repeats the ad's promise and offer; short path to the one action |
   | Search traffic | Answer the searched question first, then proof, then the action |
   | Email or a warm list | Offer and action first; details and terms after |
   | Social traffic, mostly phones | Visual proof first, short copy, one action, light page |
   | Ready to buy / comparing / knows the problem / never heard of us | Lead with the offer / the difference with proof / the result and how it works / the problem in their words |
   | Category conventions (menu, timetable, price plans, gallery, booking) | Keep the ones buyers use to decide; break one only on purpose, and say why |
   | Proof on hand | Put the strongest real proof next to the doubt it answers; drop any section that has no real content |

4. Build on the shell: reuse the captured nav and footer, the brand's font files, its colour proportions, radius and button style. Do not bring in defaults the site does not use (pill buttons, gradients, emoji icons, rounded cards everywhere, fade-up on every block, a system font instead of the brand font).
5. Write semantic HTML: one h1, landmarks, a skip link, a visible label on every field, alt text from the copy or the captured page.
6. Style mobile first with grid and flexbox, no framework. Check each colour pair against 4.5:1 for text; if one fails, offer the nearest passing shade from the brand's own palette and say so.
7. Keep it fast: do not lazy-load the lead image, give it width, height and fetchpriority="high"; lazy-load images below the first screen; preload the brand's own font files and subset them if heavy.
8. Wire the form to the named service with a hidden spam (honeypot) field, a clear error message and a thank-you state.
9. Add the title, meta description and Open Graph tags using the client's own words.
10. Never invent testimonials, prices, numbers or logos. A [placeholder] is allowed only for a fact neither the brief nor the capture holds, and each one is listed.

Output: the mode and structure decision, index.html and styles.css in full, the hosting steps, and a check: `node tools/check-brand-fidelity.mjs --brand context/brand-dna.json --page index.html` (or its manual checklist), phone (390 px) and desktop (1440 px) widths, keyboard only, form submit and a slow network. End with "Not verified" items.
```
