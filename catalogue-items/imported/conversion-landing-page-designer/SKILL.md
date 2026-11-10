---
name: landing-page-design
description: "System for building a new high converting landing page for a SaaS or software product that has no existing brand system: intake questions, page structure, layout selection, conversion copywriting, SEO, plus a default visual system (typography, spacing, radius, backgrounds, hero, icons, motion). Use it for a new product page with no live site or brand guide to follow. When the business already has a site or brand, run brand-dna-capture first: the brand's fonts, colours, components and section order win, and Part B applies only where the capture is silent."
---

# Landing Page Design

A landing page is not a homepage. A homepage serves multiple intents. A landing page wins one intent:

**one offer → one audience → one primary action.**

This skill has two halves. **Part A** decides what the page says and how it is structured. **Part B** is a default visual system for a product with no brand system of its own. Work through A before touching B.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A buyer brief**, made by the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer): who it's for, how much they already know, and what will move them.

**Makes it better (optional):**
- **Brand file**, made by the [Brand file builder](https://useaiblocks.com/skills/website-brand-brain-builder): your offers, facts, buyers, claims, voice and look, kept in one folder.
- **A page layout spec** (yours): a section-by-section layout for a page, with what each section holds.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Brand file** with the [Brand file builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. **A buyer brief** with the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer). Bring customer words. It uses your brand file.
3. This one.

**From the brand file, read:** `index.md`, `offers.json`, `facts.json`, `voice.md`. Take the chosen offer's facts, approved claims with their conditions, buyer quotes and voice lines. Only `live` lines count as facts: stale, `unconfirmed` and `banned` lines do not. If `worked.md` is there, keep what the client kept and leave out what they killed. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: a brand file is a `context/brand-file/` folder with `index.md` in it. If it's there, read `index.md` and the files above. An older brand brain folder, with `00-start-here.md` in it, still works as material. Look for the other things by name.
2. **Check what's missing.** Look for a buyer brief, your brand file, a page layout spec. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## First, ground the job

Before you start, follow the [Grounded job protocol](https://useaiblocks.com/skills/grounded-job-protocol): write the job card and choose the mode.

- **The business has a live site or a brand guide** (mode patch or extend): run [Brand DNA capture](https://useaiblocks.com/skills/brand-dna-capture) first. Its fonts, colours and their shares, buttons, nav, footer and section order win over every rule in Part B and over the structure in A2. Use Part B only for values the capture does not cover, and say which ones.
- **No site and no brand system** (mode new, for example a new SaaS product): Parts A and B apply as written, as one tested starting point rather than the only answer.
- Name the defaults you will avoid from [AI default patterns](https://useaiblocks.com/skills/ai-default-patterns), and check the built page with [Brand fidelity check](https://useaiblocks.com/skills/brand-fidelity-check) whenever a live site exists.


## Scope

Apply to new landing pages and marketing pages for products without an existing brand system. Order of authority: the user's explicit prompt, then the captured brand (brand-dna.json, a brand guide, the live site's components), then this file, then framework defaults. For an existing site, this file supplies conversion logic (Part A) and fills gaps; it never replaces the brand's own look.

**Companion skill.** For upgrading an *existing* site rather than building a new one, use `redesign-existing-projects` ([github.com/elayadesign/redesign-skill](https://github.com/elayadesign/redesign-skill)). It diagnoses generic patterns and defers to this file for every concrete value.

---

# PART A — Strategy and structure

## A1. Intake

Gather these before designing or writing. Ask only for what is missing, and ask in one batch rather than one question at a time. If you have a page layout spec from an earlier step, use its sections as the page structure instead of choosing new ones.

**Purpose**
- What is the ONE primary action? (trial, demo, buy, waitlist, download)
- What is the offer, exactly what do they get?
- What counts as a conversion? (click, signup, purchase)

**Audience and context**
- Who is the ICP?
- What problem are they trying to solve?
- Top three objections, meaning why they do not convert today
- Traffic source: ads, search, social, email
- What do visitors already know when they land?

**Proof and assets**
- Proof points: logos, testimonials, numbers, case studies
- Screenshots, demo video, product GIFs
- Guarantees, refund terms, cancellation terms

**Constraints**
- Brand voice: casual or professional
- Design direction: minimal editorial, playful 3D, glass UI
- Mobile priority?

If the user cannot answer, make a reasonable assumption, state it in one line, and continue. Do not stall the build.

## A2. Page structure

**Start from the site's own structure when one exists.** For a page on an existing site, begin with the section order and section kinds in the brand capture (or the page layout spec), then add or move sections only where an intake answer gives a reason. Record each change.

**One option: the 12 section SaaS structure.** It wins when the product is new software, the visitor arrives cold and needs the product explained, the buyer's questions really come in this order, and there is no site structure to keep. It is a weak fit for retail, luxury and editorial brands, for repeat visitors, and for product pages where buyers expect the store's own layout.

**Above the fold**
1. Headline, outcome plus audience
2. Subheadline, clarifies how and adds specificity
3. Primary CTA, clear verb plus what they get
4. One proof signal, logo strip, stat, or short testimonial
5. Hero visual, product screenshot or video, or a strong illustration

**Mid page (the argument)**
6. Problem to solution, one section
7. Benefits, three to five, outcome driven
8. How it works, three steps
9. Social proof, testimonials or a case study

**Bottom (objection handling)**
10. FAQ, six to twelve questions
11. Risk reversal, trial, cancel anytime, guarantee
12. Final CTA, identical to the top

For a new product page, a tagline reveal section (B11) can sit in the mid page argument, typically right after the hero or after benefits. It is optional, and for an existing brand it is used only if the brand already uses that kind of moment.

## A3. Layout selection

Pick one and say why.

| Type | Use when |
|---|---|
| **A. Classic hero plus sections** | The product is understandable from a hero screenshot. Most common. |
| **B. Long form story** | You need to educate and overcome skepticism. |
| **C. Minimal conversion page** | High intent traffic (email to known users), or a short offer like a download or waitlist. |
| **D. Comparison page** | Search intent includes alternatives ("X vs Y", "best for"). Usually paired with SEO pages. |

## A4. Conversion rules

**Match message to source.** If traffic comes from ads, mirror the ad headline in the hero and keep the same promise and visual tone.

**Make the next step obvious.** One primary CTA. Never place competing CTAs above the fold.

**Write benefit first.** Features are what it does. Benefits are what that means for them.

**Be specific.**
- ❌ "Save time and streamline"
- ✅ "Cut your weekly reporting from 4 hours to 15 minutes"

**Reduce risk.** Pick at least one: free trial, free plan, no credit card, cancel anytime, money back guarantee.

**Treat objections as a section, not a footnote.** Move the FAQ earlier for high friction offers. Put proof directly beside the claim it supports.

## A5. Copywriting

**Headline formulas**
- "{Outcome} without {pain}"
- "The {category} for {audience}"
- "Ship {result} in {time}"

**Subheadline.** One or two sentences. Clarify what it is and who it is for.

**CTA.** Verb plus what they get. Never "Learn more" or "Submit". Use "Start free trial", "Book a demo", "Get the checklist".

**Benefit bullets.** Bold benefit, then the proof or detail. Example: **Faster iteration** — generate three layout variants in one click.

Note: the copy rules in B1 still apply. No hyphens inside sentences, no orphaned words.

## A6. Build order

Work section by section, in this order:

1. Hero
2. Benefits
3. How it works
4. Proof
5. FAQ
6. Final CTA

Never rebuild the whole page on each iteration. Section by section keeps control and keeps diffs reviewable.

## A7. SEO and AEO

**Do not index** ad only campaign pages or highly time bound offers. Use `noindex` or keep them behind a non indexed path.

**Do index** evergreen offers and pages where search intent matches the promise. Add a clear title and meta description, internal links from the homepage and feature pages, and the FAQ in plain question and answer form for AEO. Add FAQ schema if appropriate.

## A8. Pitfalls

- Too many CTAs above the fold
- Vague value prop: "streamline", "optimize"
- A large feature list with no outcomes
- Proof buried at the bottom
- Mobile layout that breaks readability
- No clear next step

---

# PART B — Visual system

For a product with no brand system, every visual value must resolve through these rules instead of being invented ad hoc. When a brand capture or brand guide exists, its values come first: keep the brand's fonts (including a second font, italics or heavy weights it uses), its type sizes, spacing, radius, backgrounds, icons and motion, and use these rules only where the brand is silent.

## B1. Typography

### Fonts

**Existing brand:** use the brand's own fonts in their measured roles (brand-dna.json `type.roles`), load the same font files, and keep their case and weights. If a constraint blocks a brand font, embed it or stop and say so; never swap in one from the list below.

**New product with no brand fonts (default):** Geist, Manrope, Geist Mono or Poppins. Avoid Inter, Roboto, Arial, Open Sans and Helvetica unless the brief chooses one.

**Italics** are avoided by default, unless the brand uses them.

**One typeface per site by default.** Pair two fonts when the brand already does, or when the prompt asks for it. Geist Mono is allowed alongside a primary font only for code, data, or numeric UI where a monospace is functionally required.

**Ultra bold weights** (900 / black) are avoided by default. Keep them where the brand uses them.

### Copy rules

**No hyphens in text.** Do not use `-` inside body copy, headings, or labels. Rewrite the phrase instead.

**No orphaned words.** A single word must never sit alone on the last line. Apply `text-wrap: balance` for headings and `text-wrap: pretty` for body copy.

### Type scale

Always resolve font sizes to Tailwind's default type scale. Never leave arbitrary values in place, including `text-[19px]`, `font-size: 22px`, or `1.4rem`.

If an existing size does not land exactly on a step, snap it to the **closest step below**, taking both the size and its paired line height.

| Class | Size | Line height |
|---|---|---|
| `text-xs` | 12px (0.75rem) | 16px |
| `text-sm` | 14px (0.875rem) | 20px |
| `text-base` | 16px (1rem) | 24px |
| `text-lg` | 18px (1.125rem) | 28px |
| `text-xl` | 20px (1.25rem) | 28px |
| `text-2xl` | 24px (1.5rem) | 32px |
| `text-3xl` | 30px (1.875rem) | 36px |
| `text-4xl` | 36px (2.25rem) | 40px |
| `text-5xl` | 48px (3rem) | 1 |
| `text-6xl` | 60px (3.75rem) | 1 |
| `text-7xl` | 72px (4.5rem) | 1 |
| `text-8xl` | 96px (6rem) | 1 |
| `text-9xl` | 128px (8rem) | 1 |

Do not combine scale snapping with independently set custom line heights elsewhere in an audit. Tracking and line height may only be adjusted **within** the value the matched step already provides, so the two rules never fight each other.

### Button type

- Main buttons: `text-base` (16px), semibold.
- Smaller header buttons: `text-sm` (14px), semibold.

## B2. Spacing

Only these values. Nothing between them, nothing outside them.

| Token | Value |
|---|---|
| Spacing-0 | 0 |
| Spacing-25 | 2px |
| Spacing-50 | 4px |
| Spacing-75 | 8px |
| Spacing-100 | 12px |
| Spacing-200 | 16px |
| Spacing-300 | 24px |
| Spacing-400 | 32px |
| Spacing-500 | 40px |
| Spacing-600 | 48px |
| Spacing-700 | 64px |
| Spacing-800 | 80px |
| Spacing-900 | 96px |

**Main buttons:** 8px vertical padding, 12px horizontal padding.

## B3. Corner radius

Only use Tailwind's radius values.

**Nested radius formula.** When a shape sits inside another shape and the gap between them is **less than 32px**:

```
inner radius = outer radius − gap
```

Apply this only when the result is **greater than 2**. Below that, leave the inner shape square or unchanged.

Example: an outer card at `rounded-2xl` (16px) with 8px of internal padding gives an inner element an 8px radius (`rounded-lg`).

## B4. Borders and backgrounds

- **Never apply a border to only one side of a card.** Borders go all the way around or not at all.
- **Never use gradients in backgrounds.** Backgrounds are flat.

### Dark mode background colors

Use only these:

`#000000` · `#181818` · `#1F1F1F` · `#272727` · `#313131` · `#131209`

## B5. Hero section

### Heading color

- **Dark theme:** left to right gradient on the heading text, `#FFFFFF` → `#9B9B9B`.
- **Light theme:** left to right gradient on the heading text, `#000000` → `#666666`.

This is the one place gradients are used, and only on text, never on the background.

### Layout

- Heading and subheading both get a **max width of 680px**.
- Read the heading copy and insert line breaks at **meaningful** points.
- Never break a line in a way that cuts a phrase awkwardly or makes the sentence harder to read. Break where the thought breaks.

## B6. Icons

**Use:** Phosphor, Solar, or Iconamoon.

**Never use:** Material Icons, Material Symbols.

## B7. Motion choreography (fluid dynamics)

Never use default transitions. All motion simulates real world mass and spring physics through custom cubic beziers.

```
transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]
```

### Fluid island nav

**Closed state.** The navbar is a floating glass pill detached from the top: `mt-6`, `mx-auto`, `w-max`, `rounded-full`.

**Hamburger morph.** On click, the hamburger lines fluidly rotate and translate into a perfect X using `rotate-45` and `-rotate-45` with absolute positioning. They must never simply disappear.

**Modal expansion.** The menu opens as a screen filling overlay with a heavy glass effect: `backdrop-blur-3xl bg-black/80` or `bg-white/80`.

**Staggered mask reveal.** Nav links inside the expanded state fade in and slide up from an invisible box, `translate-y-12 opacity-0` resolving to `translate-y-0 opacity-100`, staggered per item with `delay-100`, `delay-150`, `delay-200`, and so on.

### Scroll interpolation

Elements never appear statically on load. As they enter the viewport they execute a gentle, heavy fade up:

```
translate-y-16 blur-md opacity-0  →  translate-y-0 blur-0 opacity-100
```

over 800ms or longer.

For JavaScript driven reveals use `IntersectionObserver` or Framer Motion's `whileInView`. **Never use `window.addEventListener('scroll')`** — it causes continuous reflows and kills mobile performance.

---

## B8. Content realism

Never ship filler. These are the tells that a page was generated rather than made.

Safety rule: the made-up names, numbers and avatars below are for design drafts only. Before the page goes live, swap every one for the real brand name, real reviews, real customers and verified figures. Never invent proof (reviews, statistics, customer names or results) on a live page. It can mislead buyers and break ad rules. If the real fact is missing, mark it "NEEDED" instead of making it up.

- **No Lorem Ipsum.** Write real draft copy.
- **No "John Doe".** Use the real customer names the user gives you. If there are none, write [CUSTOMER NAME].
- **No placeholder brands** like "Acme Corp", "Nexus", or "SmartFlow". Use the real brand name. If you do not have it, write [BRAND NAME].
- **No made-up numbers.** Never write a round fake figure like `99.99%` or `$100.00`, and never write an invented but real-looking one. Use only the user's real figures, or a marked gap such as [STAT NEEDED], [PRICE], [PHONE NUMBER].
- **No AI cliches.** Never "Elevate", "Seamless", "Unleash", "Next Gen", "Game changer", "Delve", "Tapestry", or "In the world of".
- **Sentence case headers**, not Title Case On Everything.
- **Active voice.** "We could not save your changes", not "Mistakes were made".
- **No exclamation marks in success messages**, and no "Oops!" in errors. Be direct: "Connection failed. Please try again."
- **Unique avatars** per person, and varied blog post dates.

## B9. States

Every interactive element ships with its full state set:

- **Hover** — background shift, slight scale, or translate
- **Active** — `scale(0.98)` or `translateY(1px)` for physical feedback
- **Focus** — a visible focus ring. Accessibility requirement, not optional.
- **Loading** — skeleton loaders shaped like the real layout, not circular spinners
- **Empty** — a composed "getting started" view, never a blank panel
- **Error** — inline and specific. Never `window.alert()`.

No dead links. A button pointing at `#` is either linked or visually disabled. The current page must be indicated in the navigation.

## B10. Ship requirements

Things that get forgotten and make a page feel unfinished:

- Privacy policy and terms links in the footer
- A custom, branded 404
- Client side form validation for email format and required fields
- A skip to content link for keyboard users
- Cookie consent where the jurisdiction requires it
- A branded favicon
- `<title>`, meta description, `og:image`, and social sharing tags
- Alt text on every meaningful image
- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<aside>`, `<section>`
- A way back from every page

## B11. Tagline reveal section (optional)

A new product page can include one large type section stating the core benefit or tagline, separate from the hero. Use it when the page has room for a single big statement and no brand pattern says otherwise. Skip it on an existing site unless the brand already uses this kind of moment. It sits further down the page as its own moment, not stacked directly under the hero.

**Copy**
- Minimum two lines of text.
- A benefit statement or tagline, written in the voice of A5, not a generic section heading.

**Typography**
- Size `text-4xl` to `text-6xl` depending on line count, following the B1 type scale.
- Max width capped like the hero, so lines break at meaningful points per B5.

**Animation**
- Text starts in a subtle, muted tone, roughly 25 to 35% opacity of the theme's base text color.
- As the section scrolls into view, each word transitions individually from that muted tone to the full text color, in reading order.
- Words activate one at a time as they cross a trigger line, not the entire block flipping at once. The transition uses the custom easing curve from B7, never a linear fade.
- Implement with `IntersectionObserver` per word. Never use a `window.addEventListener('scroll')` listener, per B7.

---

# Output format

When generating a landing page from scratch for a new product, return these in order before writing code (for an existing site, start the outline from the captured section order):

1. **Page outline** — sections and their order
2. **Hero copy** — headline, subheadline, CTA, proof line
3. **Benefits** — three to five outcome driven bullets
4. **How it works** — three steps
5. **FAQ** — six to twelve questions and answers
6. **SEO / AEO** — index or noindex recommendation, plus title and meta if indexed
7. **Layout recommendation** — A, B, C, or D, and why

Then build section by section per A6.

Next steps: check every figure and claim against real data, hand the layout and copy to a designer or developer, and test the hero with real visitors before you send ad traffic.

---

# Quick checklist

**Strategy**
- [ ] One offer, one audience, one primary action
- [ ] No competing CTAs above the fold
- [ ] Specific numbers instead of vague verbs
- [ ] At least one risk reversal
- [ ] Proof sits next to the claim it supports
- [ ] Layout type chosen deliberately

**Visual**
- [ ] Brand fonts, colours and components kept when a brand exists (cite the capture); otherwise a single approved typeface, no italics, no ultra bold
- [ ] No hyphens in copy, no orphaned words
- [ ] Every font size lands on a Tailwind scale step
- [ ] Every spacing value comes from the spacing table
- [ ] Nested radii follow the formula
- [ ] No single sided card borders, no background gradients
- [ ] Hero heading and subheading capped at 680px with meaningful line breaks
- [ ] Icons from Phosphor, Solar, or Iconamoon
- [ ] Every transition uses a custom cubic bezier, scroll reveals use IntersectionObserver
- [ ] If a tagline reveal section is used, minimum two lines, words activate one at a time on scroll
- [ ] For an existing site: the brand fidelity check passes (fonts, colour shares, buttons, nav and footer, placeholders, facts, 390 px, primary action)

**Content and ship**
- [ ] No Lorem Ipsum, no placeholder brands, no AI cliches, no round fake numbers
- [ ] Hover, active, focus, loading, empty, and error states all present
- [ ] No dead links, current nav item indicated
- [ ] 404, legal links, form validation, favicon, meta tags, alt text

Changed by AI Blocks (2026-11-09): scoped the skill to new products with no brand system; existing brands run brand-dna-capture first and their system wins; the 12 sections, the tagline reveal and the font list became defaults with stated conditions.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Check the landing page** with the [Landing page conversion reviewer](https://useaiblocks.com/skills/landing-page-auditor). It takes the page.
- The [Landing page design planner](https://useaiblocks.com/skills/landing-page-design-planner). It takes the page.
- The [30-point landing page checker](https://useaiblocks.com/prompts/landing-page-30-point-checker). It takes the page.
- The [Shopify landing page builder](https://useaiblocks.com/skills/shopify-landing-page-builder). It takes the page.
- The [Plain HTML landing page builder](https://useaiblocks.com/skills/static-html-landing-page-builder). It takes the page.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
