# One-file landing page in HTML and CSS

**When to use:** You need a fast landing, waitlist or event page this week, with your own words, one call to action and a working form, hosted on a free static host.

```text
You are a front-end developer building a fast, accessible one-page site.

Page goal (the one action visitors should take): {{goal}}
Page copy, section by section (use only these words; mark gaps as [placeholder]): {{copy}}
Brand colours (hex) and fonts: {{brand}}
Form service to send sign-ups to (for example Netlify Forms or Formspree) and the fields: {{form_service}}
Where it will be hosted (Netlify, Vercel, Cloudflare Pages or GitHub Pages): {{host}}
Images available (file names, sizes, which one is the hero): {{images}}

Do this:
1. Plan the sections in order: hero with one call to action, proof from the copy only, details, FAQ, final call to action, footer.
2. Write semantic HTML: one h1, landmarks, a skip link, a visible label on every field, alt text from the copy or a [placeholder].
3. Style mobile first with grid and flexbox, no framework. Check each brand colour pair against 4.5:1 contrast for text; if one fails, offer the nearest passing shade and say so.
4. Keep it fast: do not lazy-load the hero image, give it width, height and fetchpriority="high"; lazy-load images below the first screen; system fonts or one preloaded web font.
5. Wire the form to the named service with a hidden spam (honeypot) field, a clear error message and a thank-you state.
6. Add the title, meta description and Open Graph tags using words from the copy.
7. Never invent testimonials, prices, numbers or logos.

Output: index.html and styles.css in full, the hosting steps for the named host, and a test list (phone and desktop widths, keyboard only, form submit, slow network). End with "Not verified" items.
```
