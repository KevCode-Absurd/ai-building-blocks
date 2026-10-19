# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A careful, honest Kids page plan that strips every unheld rating, discount percentage and adult-only claim, keeps the real review word for word, and flags the Kids renewal price as a launch blocker rather than guessing it. The owner gets a usable phone-first skeleton plus a clear list of facts to confirm before anything ships.

## Judge list

- Met: No sentence from the reference appears anywhere in the output.
  Copy is rewritten, e.g. "We usually ship within 24 hours. Most boxes land 3 to 5 days after that."; only brand-file fact lists recur.
- Met: Every fact on the page is one you supplied.
  Prices, pack size, ages, guarantee, shipping all from input; adult-level facts flagged: "Flag: confirm this covers Kids lots."
- Met: No rating, review count, press logo, badge, timer or stock figure appears unless you hold it.
  "Rating line ... Remove. No Kids rating held"; also removed 1M+, MOST POPULAR badge, % discounts, athlete, review widget.
- Met: The first screen carries on from your ad.
  Headline "Fiber kids won't fight." matches ad; fiber grams flagged "Don't ship the headline without it."
- Met: Sections that don't suit how your product is bought are changed or removed.
  "Fit check: the reference is bought again, and so is Kids. The subscribe box, the quantity selector and the FAQ suit it."
- Met: The colours and fonts are yours, so the page can't be mistaken for the reference brand.
  Uses brand.md values: "--c-bg:#FFF7DF; --c-heading:#002C17 ... --font-head:'Work Sans'"; reference is Sprout's own page.

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

No screenshot was supplied, so height shares, columns, image side and backgrounds can't be read. They are marked `MISSING`. The order and block types below come from the page text (sprout/product-page.md).

| # | Section | Height share | Columns | Background | Block type | Keep / change / remove |
|---|---|---|---|---|---|---|
| 1 | Announcement bar (rotating, 4 lines) | MISSING | MISSING | MISSING | Announcement bar | **Change to** one static line with the real Kids offer, no % figure |
| 2 | Gallery | MISSING | MISSING | MISSING (inferred soft gradient) | Hero image gallery | **Change to** Kids pouch and pack images (labelled boxes) |
| 3 | Title + line under title | MISSING | MISSING | MISSING | Hero text | **Change to** a headline that carries on from the ad |
| 4 | Rating line (stars, count, customers) | MISSING | MISSING | MISSING | Rating badge | **Remove**. No Kids rating held, and the adult figures conflict. |
| 5 | 4 benefit bullets | MISSING | MISSING | MISSING | Bullet list | **Change to** 4 Kids facts |
| 6 | Flavour selector (2 tiles) | MISSING | MISSING | MISSING | Option tiles | **Change to** 1 tile, Strawberry Burst |
| 7 | Sugar level selector | MISSING | MISSING | MISSING | Option toggle | **Remove** until Kids sugar options are confirmed |
| 8 | Quantity selector ("how many") | MISSING | MISSING | MISSING | Option toggle | **Keep**, as "How many kids?" with Buy 2 Save $5 |
| 9 | Plan box (subscribe / one-time) | MISSING | MISSING | MISSING | Offer card | **Change to** plain prices, no badge %, no strikethrough, no negative one-time lines |
| 10 | Button + lines under button | MISSING | MISSING | MISSING | CTA + terms | **Change to** a button plus the true terms |
| 10a | (new position) Review card | — | 1 | — | Quote card | **Change to** R16 moved up under the button. In the reference, proof sat at the very bottom. |
| 11 | Accordions (6) | MISSING | 1 | MISSING | Accordion list | **Keep 4** (Why, Ingredients, Directions, Testing). **Remove** Benefits and Low Sugar vs Sugar-Free. |
| 12 | "Deficient" stats section | MISSING | MISSING | MISSING | Stats band | **Remove**. One number is missing and the sources aren't named. |
| 13 | Customer survey section | MISSING | MISSING | MISSING | Stats band | **Remove**. The survey is of adult customers and has no Kids data. |
| 14 | Quality testing section | MISSING | MISSING | MISSING | Certification block | **Keep**, once confirmed for Kids lots |
| 15 | Review cards by theme | MISSING | MISSING | MISSING | Testimonial row | **Remove** as a row. The single real review now sits at 10a. |
| 16 | Us vs. Them cost table | MISSING | MISSING | MISSING | Comparison table | **Remove**. The prices are adult and dated, and one label isn't captured. |
| 17 | Birthday price cut | MISSING | MISSING | MISSING | Promo band | **Remove**. It is an adult price. |
| 18 | Athlete quote | MISSING | MISSING | MISSING | Endorsement | **Remove**. It is an adult endorsement with no Kids consent on file. |
| 19 | Find Your Flavor tiles | MISSING | MISSING | MISSING | Tile grid | **Change to** 2 tiles: Kids Strawberry Burst and Adults Original (parent buys both). No tie-ins. |
| 20 | FAQ | MISSING | 1 | MISSING | Accordion FAQ | **Keep**, rewritten for Kids |
| 21 | Review widget (stars + list) | MISSING | MISSING | MISSING | Review-site block | **Remove**. No Kids rating held. |
| 22 | Text sign-up pop-up | — | — | — | Pop-up | **Change to** a sign-up that states it unlocks the $24.99 first order (no %) |
| 23 | Footer | MISSING | MISSING | MISSING | Footer | **Keep**: disclaimer, offer condition, contact |

Fit check: the reference is bought again, and so is Kids. The subscribe box, the quantity selector and the FAQ suit it. No timeline section exists in the reference, so none is added.

## 2. Layout rules

- **Content width:** MISSING (no screenshot). The skeleton uses a placeholder variable.
- **Section spacing:** MISSING. Placeholder variable.
- **Corner style:** MISSING. Placeholder variable.
- **Button shape:** MISSING. Fill colour is kelly green #007E40 (the brand's button job).
- **Type feel:**
  - Sans throughout.
  - Strong weight contrast: Work Sans bold for headings, Work Sans medium for body.
  - DM Mono for small uppercase tags.
  - A chunky display font for big statement lines. Its name is `MISSING`.
- **Image shapes:** MISSING.
- **Build order:** phone first.
  - Body text at least 16 px.
  - Full-width buttons on phone.
  - Plan box and button as high as the phone first screen allows.

## 3. Slot map

| Slot | Fact source | Text for the slot |
|---|---|---|
| 1. Announcement bar | Kids "starts at" $24.99 (user); SMS condition (brand.md footer note, adult) | "First Kids order $24.99 with our text sign-up 📱". Flag: confirm the SMS condition applies to Kids. |
| 2. Gallery image 1 | Kids pouch look (brand.md) | `[INSERT: Kids pouch, sunflower yellow, green wordmark, pink "KIDS", "For ages 2 to 13", on a soft 2-colour gradient, a few gummies in front]` |
| 2. Gallery image 2 | Show-it-right rules (brand.md) | `[INSERT: one Kids daily pack torn straight across the top, 6 gummies pouring into a child-size palm]` |
| 2. Gallery image 3 | Brand photo style | `[INSERT: parent and kid at home, bright and sunny, kid holding the open pack]` |
| 2. Gallery link | Label | MISSING: Kids nutrition label image |
| 3. Tag | — | `SPROUT KIDS · STRAWBERRY BURST` |
| 3. Headline | Ad "Fiber Kids Won't Fight" (user) | "Fiber kids won't fight." |
| 3. Line under headline | 6 gummies, 15 g, ages 2 to 13 (user) | "6 strawberry gummies in one tear-open pack. No mixing, no bargaining, no hiding powder in a smoothie. Ages 2 to 13." |
| 3. Fiber proof | — | MISSING: grams of fiber per Kids pack. The 6 g figure is per adult pack. Don't ship the headline without it. |
| 5. Bullet 1 | User | "1 pack a day: 6 gummies, 15 g" |
| 5. Bullet 2 | User | "Made for ages 2 to 13" |
| 5. Bullet 3 | User (Kids ads) | "Methylfolate, not folic acid" |
| 5. Bullet 4 | brand.md (brand-level) | "Vegan, pectin base, no gelatin". Flag: confirm on the Kids label. |
| 6. Flavour tile | User | "Strawberry Burst". Description line: MISSING (no Kids flavour description on file). |
| 8. Quantity | brand.md offers | "How many kids? 1 / 2. Add a second and save $5." |
| 9. Subscribe option | User + Kids page | "28 packs every 4 weeks. First order $24.99 with the text sign-up discount (new customers). Renews at MISSING."<br>Flag: $24.99 conflicts with the $22.49 shown in the Kids page plan box. Decide which is live. |
| 9. Subscribe renewal | — | MISSING: Kids renewal price for 1 kid. The Kids page shows $74.98, likely for 2 kids. **Blocks launch.** |
| 9. Subscribe shipping | Kids page plan box ("with free shipping") | "Free shipping on your first order". Flag: confirm it applies at $24.99. |
| 9. One-time option | User | "28 packs, sent once. $53.32." Shipping cost: MISSING. |
| 10. Button | — | "Start Strawberry Burst" |
| 10. Guarantee line | User | "30-day money-back guarantee on your first order only." |
| 10. Shipping line | User + brand.md | "Usually out the door within 24 hours." |
| 10. Cancel terms | — | MISSING: Kids subscription pause/cancel terms, quoted from the policy page |
| 10. HSA/FSA | brand.md (adult page) | MISSING: confirm Kids is HSA/FSA eligible. Otherwise cut. |
| 10a. Review | R16 (user), word for word | "I have tried all of the 'green' options for the kids and this is the only one they love eating. They think it's a treat."<br>Attribution: MISSING (reviewer name or initial, where posted, date). |
| 11. Accordion: Why Sprout Kids | User facts | "No shaker, no spoon, no standoff. Tear the top, tip out 6, done. Small enough for a lunchbox or a car cup holder." |
| 11. Accordion: Ingredients & allergies | brand.md (brand-level) | "Vegan pectin gummies. Made without gluten, dairy, tree nuts, peanuts, caffeine, synthetic sweeteners or synthetic dyes. Folate as methylfolate."<br>Full Kids ingredient list and vitamin count: MISSING. Confirm the free-from list on the Kids label. |
| 11. Accordion: Directions | User | "One pack a day. Tear across the top and hand over the 6 gummies inside. One pouch holds 28 packs." |
| 11. Accordion: Testing | brand.md (brand-level) | See section 14 |
| 14. Testing block heading | — | "Tested before it gets near a lunchbox" |
| 14. Testing block body | brand.md | "Third-party tested for 70 pesticides, 4 heavy metals, 16 contaminants and 9 microbial contaminants. Made in NSF, GMP and FDA-registered facilities in the US and Canada."<br>Flag: confirm this covers Kids lots. Kids lab name and date: MISSING. |
| 14. Image | — | `[INSERT: Kids pouch, plain background]` |
| 19. Tile 1 | User | "Sprout Kids · Strawberry Burst". Image: `[INSERT: Kids pouch]` |
| 19. Tile 2 | brand.md | "Sprout Adults · Original, strawberry and sweet greens". Image: `[INSERT: Adult green pouch]` |
| 20. FAQ: How many a day? | User | "One pack, which is 6 gummies (15 g)." |
| 20. FAQ: What ages? | User | "Ages 2 to 13." |
| 20. FAQ: Is it just candy? | User | "It's a daily supplement in gummy form, with folate as methylfolate. Full nutrition panel: MISSING." |
| 20. FAQ: How much sugar? | — | MISSING: Kids sugar grams and sugar options. Cut the question if not supplied. |
| 20. FAQ: When does it arrive? | brand.md | "We usually ship within 24 hours. Most boxes land 3 to 5 days after that." |
| 20. FAQ: Can I get my money back? | User | "Yes, within 30 days on your first order. Later orders aren't covered by the guarantee." |
| 20. FAQ: Can I pause or cancel? | — | MISSING: policy wording |
| 22. Pop-up | User + brand.md | "Get your first Kids order for $24.99. Pop in your number and we'll text the code." Flag: same SMS confirmation as slot 1. |
| 23. Disclaimer | — | `[Standard FDA dietary-supplement disclaimer, pasted from legal]` |
| 23. Offer note | brand.md (adult wording) | "$24.99 first-order price needs the text sign-up discount for new customers only." Flag: confirm for Kids. |
| 23. Contact | — | MISSING: support email, address, contact page |
| Removed fact slots | — | Rating (4); stats band (12); survey (13); review row (15); cost table (16); birthday price (17); athlete (18); review widget (21); all % discounts; strikethrough price; "MOST POPULAR" badge; VIP line; limited-flavour bar; Benefits accordion (Kids brain and "strong bodies" claims are unsupported); adult study (adults only, 23 to 59) |

## 4. Not sourced list

**Reference and layout**
- MISSING: reference screenshots, desktop and phone. Needed for height shares, columns, image side, backgrounds, width, spacing, corners and button shape.

**Kids product facts**
- MISSING: Kids renewal price for 1 kid. **Blocks launch.** A subscribe box without it repeats the adult page's renewal problem.
- MISSING: grams of fiber per Kids pack. Needed to back the ad headline.
- MISSING: Kids nutrition panel, vitamin and mineral count, full ingredient list.
- MISSING: Kids sugar grams and whether Kids comes in Sugar-Free.
- MISSING: Strawberry Burst flavour description line.
- MISSING: Kids limited flavour name. The tie-in can't be shown, so the slot is removed.
- MISSING: one-time order shipping cost.
- MISSING: Kids pause/cancel terms.

**Confirmations against the brand file**
- MISSING: confirm $24.99 vs the $22.49 on the Kids page.
- MISSING: confirm the $24.99 price needs the SMS discount.
- MISSING: confirm free shipping applies to the first Kids order.
- MISSING: confirm brand-level facts hold for Kids: vegan, free-from list, testing counts, HSA/FSA.
- MISSING: R16 attribution (name or initial, platform, date).

**Images**
- No photo files supplied. All image slots are labelled boxes:
  - Kids pouch
  - torn Kids pack with 6 gummies
  - parent and kid scene
  - Adult pouch
  - Kids label
- MISSING: Kids gummy colour and shape for Strawberry Burst. Adult gummies are green bears; Kids not captured.

**Brand assets**
- MISSING: logo file.
- MISSING: pink hex for "KIDS". Reused #FFCC2E as the Kids accent instead; no shade invented.
- MISSING: display font name. Work Sans bold stands in.
- Colour jobs reused:
  - #FFF7DF hero and page background
  - #002C17 headings and dark band
  - #007E40 buttons
  - #FFCC2E Kids accent and tags
  - #581E5A announcement bar
  - #00582D secondary text and links

## 5. Skeleton HTML

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sprout Kids · Strawberry Burst</title>
<!-- No tracking scripts. Add analytics separately, on purpose. -->
<style>
:root{
  --c-bg:#FFF7DF; --c-heading:#002C17; --c-text:#00582D;
  --c-button:#007E40; --c-accent:#FFCC2E; --c-bar:#581E5A;
  --font-head:"Work Sans",sans-serif; --font-body:"Work Sans",sans-serif;
  --font-tag:"DM Mono",monospace;
  --font-display:"Work Sans",sans-serif; /* MISSING: display font */
  --radius:12px;      /* placeholder: measure from screenshot */
  --space:48px;       /* placeholder */
  --width:1120px;     /* placeholder */
}
*{box-sizing:border-box}
body{margin:0;background:var(--c-bg);color:var(--c-text);font:500 16px/1.5 var(--font-body)}
h1,h2,h3{font-family:var(--font-head);font-weight:700;color:var(--c-heading)}
h1{font-family:var(--font-display);font-size:2rem;line-height:1.1}
.wrap{max-width:var(--width);margin:0 auto;padding:0 20px}
section{padding:var(--space) 0}
.tag{font:500 12px var(--font-tag);text-transform:uppercase;letter-spacing:.08em;background:var(--c-accent);color:var(--c-heading);padding:4px 8px;border-radius:var(--radius);display:inline-block}
.btn{display:block;width:100%;min-height:52px;border:0;border-radius:var(--radius);background:var(--c-button);color:#fff;font:700 18px var(--font-head);cursor:pointer}
.img-slot{border:2px dashed var(--c-text);border-radius:var(--radius);aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;text-align:center;padding:16px;font-size:14px}
.bar{background:var(--c-bar);color:#fff;text-align:center;padding:8px 12px;font-size:14px}
.option{border:2px solid var(--c-text);border-radius:var(--radius);padding:16px;margin:8px 0}
details{border-bottom:1px solid var(--c-text);padding:14px 0}
summary{font-weight:700;cursor:pointer;min-height:44px}
.tiles{display:grid;gap:16px}
@media(min-width:768px){
  .hero{display:grid;grid-template-columns:1fr 1fr;gap:40px} /* columns: MISSING from screenshot */
  .tiles{grid-template-columns:1fr 1fr}
  .btn{max-width:420px}
}
</style>
</head>
<body>

<div id="s01-bar" class="bar">First Kids order $24.99 with our text sign-up 📱</div>

<main class="wrap">
<section id="s02-hero" class="hero">
  <div id="s02-gallery">
    <div class="img-slot">[INSERT: Kids pouch, yellow, green wordmark, pink KIDS, ages 2 to 13, soft gradient]</div>
    <div class="img-slot">[INSERT: Kids pack torn straight across the top, 6 gummies into a small palm]</div>
    <div class="img-slot">[INSERT: parent and kid at home, bright, kid holding open pack]</div>
    <a href="#">[INSERT: Kids nutrition label link]</a>
  </div>
  <div>
    <span class="tag">Sprout Kids · Strawberry Burst</span>
    <h1 id="s03-title">Fiber kids won't fight.</h1>
    <p>6 strawberry gummies in one tear-open pack. No mixing, no bargaining, no hiding powder in a smoothie. Ages 2 to 13.</p>
    <!-- MISSING: Kids fiber grams -->
    <ul id="s05-bullets">
      <li>1 pack a day: 6 gummies, 15 g</li>
      <li>Made for ages 2 to 13</li>
      <li>Methylfolate, not folic acid</li>
      <li>Vegan, pectin base, no gelatin</li>
    </ul>

    <div id="s06-flavour" class="option">Strawberry Burst<br><small>[MISSING: flavour description]</small></div>

    <fieldset id="s08-qty"><legend>How many kids?</legend>
      <label><input type="radio" name="q" checked> 1</label>
      <label><input type="radio" name="q"> 2 (save $5)</label>
    </fieldset>

    <div id="s09-plan">
      <label class="option"><input type="radio" name="plan" checked>
        <strong>Subscribe</strong>: 28 packs every 4 weeks. First order $24.99 with the text sign-up discount (new customers). Renews at [MISSING]. Free shipping on your first order.
      </label>
      <label class="option"><input type="radio" name="plan">
        <strong>One-time</strong>: 28 packs, sent once. $53.32. Shipping: [MISSING]
      </label>
    </div>

    <button id="s10-cta" class="btn">Start Strawberry Burst</button>
    <p><small>30-day money-back guarantee on your first order only. Usually out the door within 24 hours. [MISSING: pause/cancel terms]</small></p>

    <blockquote id="s10a-review">"I have tried all of the 'green' options for the kids and this is the only one they love eating. They think it's a treat."<br><small>[MISSING: reviewer, platform, date]</small></blockquote>
  </div>
</section>

<section id="s11-accordions">
  <details><summary>Why Sprout Kids?</summary><p>No shaker, no spoon, no standoff. Tear the top, tip out 6, done. Small enough for a lunchbox or a car cup holder.</p></details>
  <details><summary>Ingredients &amp; allergies</summary><p>Vegan pectin gummies. Made without gluten, dairy, tree nuts, peanuts, caffeine, synthetic sweeteners or synthetic dyes. Folate as methylfolate. [MISSING: full Kids ingredient list]</p></details>
  <details><summary>Directions</summary><p>One pack a day. Tear across the top and hand over the 6 gummies inside. One pouch holds 28 packs.</p></details>
  <details><summary>Testing</summary><p>See below.</p></details>
</section>

<section id="s14-testing">
  <h2>Tested before it gets near a lunchbox</h2>
  <p>Third-party tested for 70 pesticides, 4 heavy metals, 16 contaminants and 9 microbial contaminants. Made in NSF, GMP and FDA-registered facilities in the US and Canada.</p>
  <div class="img-slot">[INSERT: Kids pouch, plain background]</div>
</section>

<section id="s19-tiles" class="tiles">
  <a href="#"><div class="img-slot">[INSERT: Kids pouch]</div>Sprout Kids · Strawberry Burst</a>
  <a href="#"><div class="img-slot">[INSERT: Adult green pouch]</div>Sprout Adults · Original, strawberry and sweet greens</a>
</section>

<section id="s20-faq">
  <h2>Questions from parents</h2>
  <details><summary>How many a day?</summary><p>One pack, which is 6 gummies (15 g).</p></details>
  <details><summary>What ages?</summary><p>Ages 2 to 13.</p></details>
  <details><summary>Is it just candy?</summary><p>It's a daily supplement in gummy form, with folate as methylfolate. [MISSING: nutrition panel]</p></details>
  <details><summary>When does it arrive?</summary><p>We usually ship within 24 hours. Most boxes land 3 to 5 days after that.</p></details>
  <details><summary>Can I get my money back?</summary><p>Yes, within 30 days on your first order. Later orders aren't covered by the guarantee.</p></details>
  <details><summary>Can I pause or cancel?</summary><p>[MISSING: policy wording]</p></details>
</section>
</main>

<footer id="s23-footer" class="wrap">
  <p><small>[Standard FDA dietary-supplement disclaimer, pasted from legal]</small></p>
  <p><small>$24.99 first-order price needs the text sign-up discount for new customers only.</small></p>
  <p><small>[MISSING: logo, support email, address, contact page]</small></p>
</footer>

<!-- s22 pop-up: "Get your first Kids order for $24.99. Pop in your number and we'll text the code." Build in your pop-up tool; no % figure. -->
</body>
</html>
```

## 6. Score

Checks passed:
1. No sentence from the reference ✓
2. Every fact supplied ✓ (brand-level facts flagged for Kids confirmation)
3. No unheld rating, count, badge, timer or stock figure ✓
4. First screen carries on from the ad ✓ (fiber grams flagged)
5. Wrong-way-of-buying sections changed or removed ✓
6. Own colours and fonts ✓
7. Checked at phone width ✗
8. No tracking scripts ✓

**7 / 8 × 100 = 88**

- **Missed, phone-width check:** the page is built phone-first, but it hasn't been rendered at phone width. With no phone screenshot of the reference, the first-screen order can't be compared either.
```
