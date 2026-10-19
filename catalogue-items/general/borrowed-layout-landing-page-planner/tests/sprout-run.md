# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A careful, honest Kids page plan that strips every adult-only or unverified element (ratings, study, survey, discount percentages, athlete, tie-in flavour) and keeps only facts on file, with per-day prices correctly computed. The owner gets a usable skeleton plus a clear list of Kids facts to supply (fiber grams, renewal price, sugar options, $24.99 condition) before it can go live.

## Judge list

- Met: No sentence from the reference appears anywhere in the output.
  Reference is Sprout's own page; reused lines like "Supports digestion and gut health" are brand.md approved claims, other copy is new ("No mixing, no pills, no standoff at the table").
- Met: Every fact on the page is one you supplied.
  "First order from $24.99 ($0.89/day for the first box)" and "$53.32 ($1.90/day)" are arithmetic on given prices; all else traced to brand.md or input.
- Met: No rating, review count, press logo, badge, timer or stock figure appears unless you hold it.
  "Rating + customer count ... Remove. No Kids rating is held"; "All % discount figures: 52, 55, 58 and 61" removed.
- Met: The first screen carries on from your ad.
  Hero tag "FIBER KIDS WON'T FIGHT" above the title, with "MISSING: grams of fiber per Kids pack" flagged to back it.
- Met: Sections that don't suit how your product is bought are changed or removed.
  "bought again, so the subscribe box and the ingredient accordion fit. Results timelines are not added."
- Met: The colours and fonts are yours, so the page can't be mistaken for the reference brand.
  CSS variables use Sprout's hexes (#00582D, #002C17, #FFF7DF, #007E40, #FFCC2E, #581E5A) and Work Sans / DM Mono.

## What went in

```text
Reference: our own adult product page, as text top to bottom
(sprout/product-page.md). No screenshot, so no heights or columns.

Build: a landing page for Sprout Kids on the same structure.

Kids facts (sprout/brand.md): pouch of 28 packs, 1 pack = 15 g,
6 gummies, ages 2 to 13, Strawberry Burst, yellow pouch. One-time
$53.32. First order "starts at" $24.99. Renewal price not clear.
Methylfolate, not folic acid (from our Kids ads).
Guarantee: 30 days, first order only. Ships within 24 hours.
Review: "I have tried all of the 'green' options for the kids and this
is the only one they love eating. They think it's a treat." (R16)
Ad: "Fiber Kids Won't Fight".
Bought again.

[attached: sprout/brand.md, sprout/product-page.md]
```

## What came out

```text
## 1. Layout map

The reference is text only, so height share and columns can't be read. Backgrounds are listed only where the text shows them.

| # | Section (reference) | Height share | Columns | Background | Block type | Decision |
|---|---|---|---|---|---|---|
| 1 | Rotating announcement bar | not given | 1 | not given (brand: plum top banner) | Announcement bar | **Change to** one fixed line: shipping and first-order guarantee. No % figures. |
| 2 | Gallery | not given | not given | soft gradient (inferred) | Hero image gallery | **Keep.** Kids pouch and gummies only. |
| 3 | Title | not given | 1 | not given | Hero headline | **Change to** Kids product name, plus the ad headline above it. |
| 4 | Under-title line | not given | 1 | not given | Hero subline | **Change to** a pack-facts line. The reference's vitality claim is unsupported. |
| 5 | Rating + customer count | not given | 1 | not given | Numbers strip | **Remove.** No Kids rating is held, and the adult figures conflict (4.8, 4.75, 4.74, 4.0). |
| 6 | 4 benefit bullets | not given | 1 | not given | Bullet list | **Change to** 4 bullets from claims on file. No energy, immunity, clarity or brain claims. |
| 7 | Flavour selector | not given | 2 tiles | not given | Option tiles | **Change to** 1 tile, Strawberry Burst. The tie-in flavour is removed. |
| 8 | Sugar-level selector | not given | 2 | not given | Option toggle | **Change to** whatever Kids really offers (MISSING). |
| 9 | "How many?" selector | not given | 2 | not given | Quantity toggle | **Keep** as "How many kids?" with Buy 2 Save $5. |
| 10 | Plan box (subscribe / one-time) | not given | 1, 2 stacked options | not given | Offer card | **Keep, change contents.** Plain prices, renewal shown at the same size, no "No…" lines on one-time. |
| 11 | Main button | not given | 1 | brand: kelly green | Button | **Keep.** |
| 12 | Trust lines under button | not given | 1 | not given | Small print list | **Change to** renewal, shipping and first-order guarantee. "Less than 1%" and "clinically tested" are removed. |
| 13 | Accordions (Why, Ingredients, Sugar, Science, Directions, Benefits) | not given | 1 | not given | Accordion | **Change.** Science (adult study) becomes Testing. Benefits is cut to on-file claims. |
| 14 | "Bodies deficient" stats | not given | not given | not given | Stats band | **Remove.** One number is missing, sources are bare "Source" links, and it is adult population data. |
| 15 | Customer survey stats | not given | not given | not given | Stats band | **Remove.** The survey is not Kids-specific. |
| 16 | Quality / testing | not given | not given | not given | Certification block | **Keep** only if the testing covers Kids lots (MISSING). |
| 17 | Review cards by theme | not given | not given | not given | Testimonial row | **Change to** a review block moved up to here (fixes reviews at the very bottom). Only R16 is held. |
| 18 | Us vs. Them cost table | not given | 3 | not given | Comparison table | **Remove.** Adult, dated prices with an unlabelled column. |
| 19 | Birthday price cut | not given | 1 | not given | Promo band | **Remove.** Adult $29.99 offer. |
| 20 | Athlete quote | not given | not given | not given | Endorsement | **Remove.** Adult paid spokesperson, and no Kids endorser on file. |
| 21 | Find Your Flavor tiles | not given | 4 tiles | not given | Tile grid | **Remove.** One Kids flavour, and tie-in characters are banned. |
| 22 | FAQ | not given | 1 | not given | Accordion | **Keep, new questions** for the parent buyer. |
| 23 | Reviews widget at bottom | not given | 1 | not given | Review-site block | **Remove.** Merged into #17, and no Kids rating is held. |
| 24 | SMS pop-up | n/a | n/a | n/a | Pop-up | **Remove** unless the $24.99 needs SMS (MISSING). Then it becomes a plain sign-up with no % figure. |
| 25 | Footer | not given | not given | not given | Footer | **Keep.** FDA line, plus an offer-condition line if one applies. |

**Page job.**
- Ad: "Fiber Kids Won't Fight".
- Buyer: the busy parent with a picky eater.
- Single reason to buy: a daily pack of 6 strawberry gummies that kids treat like a treat, with no fight at the table.
- Offer: first order from $24.99.
- Way of buying: bought again, so the subscribe box and the ingredient accordion fit. Results timelines are not added.

## 2. Layout rules

The text reference gives no width, spacing, corners or button shape. The values below are starting points set here, not read from the reference.

- **Width:** phone first, single column. Content max 1120 px on desktop. The plan box sits beside the gallery at 900 px and wider.
- **Spacing:** one section spacing value used everywhere. Starting point is 48 px on phone and 80 px on desktop.
- **Corners:** one radius variable for cards, tiles and buttons. Starting point is 16 px.
- **Button:** full width on phone, kelly green #007E40, white bold label, at least 48 px tall.
- **Type:** sans throughout. Work Sans bold for headings, Work Sans medium for body at 16 px or more. DM Mono uppercase for small tags. A chunky display font for the hero line (font name MISSING).
- **Colour jobs:**

  | Job | Colour |
  |---|---|
  | Hero background | cream #FFF7DF |
  | Headings and dark bands | deep forest #002C17 |
  | Buttons | kelly #007E40 |
  | Badges | sunflower #FFCC2E |
  | Top bar | plum #581E5A |
  | Accents | forest #00582D |

  Body text colour is not defined, so deep forest #002C17 is reused for it.

## 3. Slot map

| Slot | Source | Text for the slot |
|---|---|---|
| 1. Announcement bar | brand.md shipping; user's guarantee | Ships within 24 hours · 30-day money-back guarantee on your first order |
| 2. Gallery images | MISSING | See Not sourced list |
| 3a. Hero tag (above title) | Ad | FIBER KIDS WON'T FIGHT |
| 3b. Title | brand.md product name | Sprout Kids Greens Gummies |
| 4. Subline | User facts | One small pack, 6 Strawberry Burst gummies, once a day. For ages 2 to 13. |
| 5. Rating line | n/a | Removed |
| 6. Bullet 1 | User (Kids ads) | Methylfolate, not folic acid |
| 6. Bullet 2 | brand.md "fine to repeat" | Supports digestion and gut health. Confirm this is on the Kids label. |
| 6. Bullet 3 | User facts | 6 gummies, 15 g, 1 pack a day |
| 6. Bullet 4 | brand.md free-from list | No synthetic dyes or synthetic sweeteners. Confirm it applies to Kids. |
| 6. Fiber amount (to back the ad) | MISSING | MISSING: grams of fiber per Kids pack |
| 7. Flavour tile | User facts | Strawberry Burst |
| 8. Sugar level | MISSING | MISSING: whether Kids comes in Low Sugar and Sugar-Free, and grams of sugar per pack |
| 9. Quantity label | brand.md | How many kids? 1 / 2 · Buy 2, save $5 |
| 10. Subscribe option | User facts | Subscribe · 28 packs every 4 weeks · First order from $24.99 ($0.89/day for the first box) · Then renews at MISSING every 4 weeks |
| 10. $24.99 condition | MISSING | MISSING: whether $24.99 needs the SMS sign-up, as the adult $29.99 does |
| 10. Renewal price | MISSING | MISSING: Kids renewal price for 1 kid and for 2 kids. The Kids page's "$74.98" is unexplained. |
| 10. One-time option | User facts | One-time · 28 packs, delivered once · $53.32 ($1.90/day) |
| 10. Shipping cost per option | MISSING | MISSING: whether Kids subscribe and one-time ship free |
| 10. % badge / crossed-out price | n/a | Removed. Prices are shown plain, side by side. |
| 11. Button | Copy | Start their daily pack |
| 12. Trust line 1 | Plan | Your first order is $24.99. After that it renews every 4 weeks at MISSING. |
| 12. Trust line 2 | User facts | Ships within 24 hours |
| 12. Trust line 3 | User facts | 30-day money-back guarantee, first order only |
| 12. Pause/cancel line | MISSING | MISSING: the Kids page's own pause/cancel wording. Use it as is, and promise nothing beyond it. |
| 12. HSA/FSA line | brand.md | HSA/FSA eligible through [third-party service]. Confirm it applies to Kids. |
| 13a. Why Sprout Kids? | brand.md positioning, buyer 3 | No mixing, no pills, no standoff at the table. They tear open one pack, eat 6 strawberry gummies, and the daily habit is done before school. |
| 13b. Ingredients & allergies | brand.md; user | Pectin base, no gelatin, vegan. Methylfolate, not folic acid. MISSING: Kids ingredient panel and Kids vitamin and mineral doses. |
| 13c. Sugar | MISSING | MISSING: Kids sugar options and grams. The sugar-alcohol note is MISSING if Sugar-Free is offered. |
| 13d. Testing & certifications | brand.md | Third-party tested for 70 pesticides, 4 heavy metals, 16 contaminants and 9 microbial contaminants. Made in NSF, GMP and FDA-registered facilities in the US and Canada. Confirm both apply to Kids. |
| 13e. Directions | User facts; brand.md show-it-right | Tear 1 pack straight across the top. Pour out the 6 gummies. One pack a day, ages 2 to 13. MISSING: the Kids label's own directions and any age or supervision warning. |
| 13f. Benefits | brand.md "fine to repeat" | Supports digestion and gut health (pending Kids label). No brain, immunity or "bright minds" claims. |
| 13g. Science (adult study) | n/a | Removed. The 2025 study was in adults aged 23 to 59. |
| 14–15. Stats bands | n/a | Removed |
| 16. Quality block heading | Copy | What we test for, so you don't have to wonder |
| 16. Quality block body | brand.md | Same text as 13d. The lab name and lot date are MISSING for Kids. |
| 17. Review heading | Copy | From a parent who tried the rest |
| 17. Review card | User, R16, word for word | "I have tried all of the 'green' options for the kids and this is the only one they love eating. They think it's a treat." Source: R16. Reviewer name, platform and date are MISSING. |
| 17. Rating / count | n/a | Removed |
| 18–21 | n/a | Removed |
| 22. FAQ Q1 | Copy | What ages is it for? A: 2 to 13. |
| 22. FAQ Q2 | MISSING | How much fiber is in a pack? A: MISSING |
| 22. FAQ Q3 | MISSING | How much sugar? A: MISSING |
| 22. FAQ Q4 | User facts; brand.md | When does it arrive? A: We ship within 24 hours. Orders arrive in 3 to 5 days on average. |
| 22. FAQ Q5 | Plan | What happens after the first box? A: A new pouch of 28 packs every 4 weeks at MISSING. |
| 22. FAQ Q6 | User facts | Can I get my money back? A: Yes, within 30 days on your first order. Later orders aren't covered. |
| 22. FAQ Q7 | MISSING | Can I pause or cancel? A: MISSING (the site's own wording only) |
| 22. FAQ Q8 | User (Kids ads) | Why methylfolate? A: It's the form of folate we use instead of folic acid. MISSING: Kids folate dose. |
| 24. Pop-up | n/a | Removed. Rebuild only if the $24.99 needs SMS, with no % figure. |
| 25. Footer FDA line | Brand legal footer | Standard FDA statement, using the exact legal wording from your current footer |
| 25. Footer offer note | MISSING | MISSING: the $24.99 condition, if any |
| 25. Footer contact | MISSING | MISSING: contact details |

## 4. Not sourced list

**Images**
- Kids pouch photo: yellow pouch, green wordmark, pink "KIDS", "For ages 2 to 13".
- Torn Kids daily pack: torn straight across the top.
- 6 Kids gummies in a palm or bowl. The colour and shape of Kids gummies is MISSING. Do not use the adult green bears under the Kids name.
- Parent and child lifestyle shot.
- Logo file.
- The gradient colours for pack shots are not defined.

**Fact slots removed**
- Star rating and review count.
- "1M+ customers".
- The adult study.
- Survey stats.
- National nutrient and digestion stats.
- Cost-per-serving comparison.
- Birthday $29.99 offer.
- Athlete quote.
- Tie-in flavour tile.
- All % discount figures: 52, 55, 58 and 61.
- "Less than 1% use the guarantee".

**Facts MISSING**
- Kids fiber grams. This is needed to back the ad.
- Kids renewal price for 1 and 2 kids.
- The $24.99 condition.
- Kids shipping cost.
- Kids sugar options and grams.
- Kids ingredient panel and doses.
- Kids directions and age warnings.
- Whether the testing, facilities, free-from list, HSA/FSA and the "supports digestion" claim apply to Kids.
- Kids pause/cancel wording.
- R16's reviewer, platform and date.

**Colour and type gaps**
- No body-text colour is defined, so deep forest #002C17 is reused.
- The display font name is MISSING.
- The Kids pink is not given as a hex, so it is not used.

**Other**
- Contact details and the returns policy page link are MISSING.

## 5. Skeleton HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sprout Kids Greens Gummies</title>
<style>
  :root{
    --c-forest:#00582D; --c-deep:#002C17; --c-cream:#FFF7DF;
    --c-button:#007E40; --c-badge:#FFCC2E; --c-banner:#581E5A;
    --c-text:var(--c-deep); /* body text colour not defined: reuses deep forest */
    --f-head:"Work Sans",sans-serif; --f-body:"Work Sans",sans-serif;
    --f-tag:"DM Mono",monospace;
    --f-display:"Work Sans",sans-serif; /* MISSING: display font name */
    --radius:16px; --space:48px; --max:1120px;
  }
  *{box-sizing:border-box}
  body{margin:0;font:500 16px/1.5 var(--f-body);color:var(--c-text);background:#fff}
  h1,h2,h3{font-family:var(--f-head);font-weight:700;color:var(--c-deep);margin:0 0 12px}
  .wrap{max-width:var(--max);margin:0 auto;padding:0 20px}
  section{padding:var(--space) 0}
  .tag{font:500 13px var(--f-tag);text-transform:uppercase;letter-spacing:.06em}
  .slot{border:2px dashed var(--c-forest);border-radius:var(--radius);aspect-ratio:1/1;
        display:flex;align-items:center;justify-content:center;text-align:center;padding:16px}
  .missing{background:var(--c-badge);padding:0 4px}
  .btn{display:block;width:100%;min-height:48px;border:0;border-radius:var(--radius);
       background:var(--c-button);color:#fff;font:700 18px var(--f-head);cursor:pointer}
  .card{border:2px solid var(--c-forest);border-radius:var(--radius);padding:16px;margin-bottom:12px}
  details{border-bottom:1px solid var(--c-forest);padding:14px 0}
  summary{font-weight:700;cursor:pointer;min-height:32px}
  #s01{background:var(--c-banner);color:#fff;text-align:center;padding:10px 16px;font-size:14px}
  #s02{background:var(--c-cream)}
  .hero-line{font-family:var(--f-display);font-size:34px;line-height:1.1}
  @media (min-width:900px){
    :root{--space:80px}
    .hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start}
    .hero-line{font-size:48px}
  }
</style>
</head>
<body>

<!-- 01 Announcement bar -->
<div id="s01">Ships within 24 hours · 30-day money-back guarantee on your first order</div>

<!-- 02–12 Hero: gallery + buy box -->
<section id="s02"><div class="wrap hero-grid">
  <div>
    <div class="slot">[INSERT: Sprout Kids yellow pouch on gradient, 1:1]</div>
    <div class="slot" style="margin-top:12px">[INSERT: Kids pack torn straight across the top, 6 gummies in a palm, 1:1]</div>
  </div>
  <div>
    <p class="tag">Fiber kids won't fight</p>
    <h1 class="hero-line">Sprout Kids Greens Gummies</h1>
    <p>One small pack, 6 Strawberry Burst gummies, once a day. For ages 2 to 13.</p>
    <ul>
      <li>Methylfolate, not folic acid</li>
      <li>Supports digestion and gut health <span class="missing">[confirm on Kids label]</span></li>
      <li>6 gummies, 15 g, 1 pack a day</li>
      <li>No synthetic dyes or synthetic sweeteners <span class="missing">[confirm for Kids]</span></li>
      <li><span class="missing">MISSING: grams of fiber per Kids pack</span></li>
    </ul>

    <p class="tag">Flavour</p>
    <div class="card">Strawberry Burst</div>

    <p class="tag">Sugar level</p>
    <div class="card"><span class="missing">MISSING: Kids sugar options and grams</span></div>

    <p class="tag">How many kids?</p>
    <div class="card">1 / 2 · Buy 2, save $5</div>

    <div class="card">
      <strong>Subscribe</strong> · 28 packs every 4 weeks<br>
      First order from $24.99 ($0.89/day for the first box)<br>
      Then renews at <span class="missing">MISSING</span> every 4 weeks
    </div>
    <div class="card">
      <strong>One-time</strong> · 28 packs, delivered once<br>
      $53.32 ($1.90/day)
    </div>

    <button class="btn">Start their daily pack</button>
    <p style="font-size:16px">
      Your first order is $24.99. After that it renews every 4 weeks at <span class="missing">MISSING</span>.<br>
      Ships within 24 hours.<br>
      30-day money-back guarantee, first order only.<br>
      <span class="missing">MISSING: Kids pause/cancel wording (site's own words only)</span>
    </p>

    <!-- 13 Accordions -->
    <details><summary>Why Sprout Kids?</summary>
      <p>No mixing, no pills, no standoff at the table. They tear open one pack, eat 6 strawberry gummies, and the daily habit is done before school.</p></details>
    <details><summary>Ingredients &amp; allergies</summary>
      <p>Pectin base, no gelatin, vegan. Methylfolate, not folic acid. <span class="missing">MISSING: Kids ingredient panel and doses</span></p></details>
    <details><summary>Sugar</summary>
      <p><span class="missing">MISSING: Kids sugar options, grams, and a sugar-alcohol note if Sugar-Free is offered</span></p></details>
    <details><summary>Testing &amp; certifications</summary>
      <p>Third-party tested for 70 pesticides, 4 heavy metals, 16 contaminants and 9 microbial contaminants. Made in NSF, GMP and FDA-registered facilities in the US and Canada. <span class="missing">[confirm for Kids]</span></p></details>
    <details><summary>Directions</summary>
      <p>Tear 1 pack straight across the top. Pour out the 6 gummies. One pack a day, ages 2 to 13. <span class="missing">MISSING: Kids label directions and age or supervision warning</span></p></details>
  </div>
</div></section>

<!-- 16 Quality -->
<section id="s16"><div class="wrap">
  <h2>What we test for, so you don't have to wonder</h2>
  <p>Third-party tested for 70 pesticides, 4 heavy metals, 16 contaminants and 9 microbial contaminants. <span class="missing">[confirm for Kids; lab and lot date MISSING]</span></p>
</div></section>

<!-- 17 Review (moved up) -->
<section id="s17" style="background:var(--c-cream)"><div class="wrap">
  <h2>From a parent who tried the rest</h2>
  <blockquote class="card">"I have tried all of the 'green' options for the kids and this is the only one they love eating. They think it's a treat."
    <footer class="tag">Source: R16 · <span class="missing">MISSING: reviewer, platform, date</span></footer></blockquote>
</div></section>

<!-- 22 FAQ -->
<section id="s22"><div class="wrap">
  <h2>Questions parents ask</h2>
  <details><summary>What ages is it for?</summary><p>2 to 13.</p></details>
  <details><summary>How much fiber is in a pack?</summary><p><span class="missing">MISSING</span></p></details>
  <details><summary>How much sugar?</summary><p><span class="missing">MISSING</span></p></details>
  <details><summary>When does it arrive?</summary><p>We ship within 24 hours. Orders arrive in 3 to 5 days on average.</p></details>
  <details><summary>What happens after the first box?</summary><p>A new pouch of 28 packs every 4 weeks at <span class="missing">MISSING</span>.</p></details>
  <details><summary>Can I get my money back?</summary><p>Yes, within 30 days on your first order. Later orders aren't covered.</p></details>
  <details><summary>Can I pause or cancel?</summary><p><span class="missing">MISSING: site's own wording</span></p></details>
  <details><summary>Why methylfolate?</summary><p>It's the form of folate we use instead of folic acid. <span class="missing">MISSING: Kids folate dose</span></p></details>
</div></section>

<!-- 25 Footer -->
<footer id="s25" style="background:var(--c-deep);color:#fff;padding:32px 0"><div class="wrap">
  <p>[INSERT: logo]</p>
  <p>[INSERT: standard FDA statement, exact legal wording from current footer]</p>
  <p><span class="missing">MISSING: $24.99 offer condition, if any</span></p>
  <p><span class="missing">MISSING: contact details, returns policy link</span></p>
</div></footer>

</body>
</html>
```
```
