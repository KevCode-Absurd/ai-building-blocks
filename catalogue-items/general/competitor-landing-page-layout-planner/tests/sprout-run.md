# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A careful, usable plan: it keeps the adult page's structure for Kids, strips every unsourced rating, stat, badge and adult-only claim, and gates every brand-wide fact not confirmed for Kids. The owner gets a clear list of what to fetch (renewal price, fiber grams, sugar grams, Kids ingredients) before the page can go live.

## Judge list

- Met: No sentence from the reference appears anywhere in the output.
  Only overlap is the mandatory FDA line and 'pause or cancel any time', both disclosed under CHECKS MISSED; the reference is Sprout's own page.
- Met: Every fact on the page is one you supplied.
  All prices ($24.99, $53.32, $66.65, $29.99, $49.99), testing numbers and R16 come from the input or brand.md; gaps marked 'MISSING renewal price'.
- Met: No rating, review count, press logo, badge, timer or stock figure appears unless you hold it.
  'Rating ... Remove. No Kids rating is held'; '1M+ customers', survey stats, '% discount badges and pop-up %' all listed under removed fact slots.
- Met: The first screen carries on from your ad.
  'Change to the ad headline "Fiber Kids Won't Fight" plus a new subhead'; h1 placed above gallery on phone.
- Met: Sections that don't suit how your product is bought are changed or removed.
  Bought again: subscribe box kept with renewal price slot; adult-only study, birthday price cut, athlete quote and survey removed.
- Met: The colours and fonts are yours, so the page can't be mistaken for the reference brand.
  CSS variables use Sprout hexes (#002C17, #007E40, #FFCC2E, #581E5A), Work Sans and DM Mono; display font marked MISSING.

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

The reference is text only, so section heights and columns can't be measured. Those cells say `MISSING (text ref)`, and the "Plan" value is what I propose for a phone-first build.

| # | Section (reference) | Height share | Columns | Background | Block type | Decision |
|---|---|---|---|---|---|---|
| 1 | Announcement bar, 4 rotating lines | MISSING (text ref). Plan: 1 thin line | 1 | Plan: plum #581E5A | Top bar | **Change to** one static line with no % figure: delivery plus first-order guarantee |
| 2 | Gallery | MISSING. Plan: about 1 screen on phone | 1 (phone), 2 with plan box (desktop) | Plan: cream #FFF7DF | Hero image carousel | **Keep**, but put the title above it on phone so the ad headline lands on the first screen |
| 3 | Title and line under it | MISSING | 1 | cream | Hero text | **Change to** the ad headline "Fiber Kids Won't Fight" plus a new subhead |
| 4 | Rating line (4.8/5, 100,000, 1M+ customers) | MISSING | 1 | cream | Stars and count | **Remove**. No Kids rating is held, and the brand-wide figures conflict (4.8 / 4.75 / 4.74 / 4.0) |
| 5 | 4 bullets | MISSING | 1 | cream | Tick list | **Change to** fact bullets for Kids. Immunity, clarity and energy claims removed |
| 6 | Select flavour (2 tiles) | MISSING | 2 | white | Tile picker | **Change to** a single Strawberry Burst display. The limited tile only comes back with its facts (see Not sourced) |
| 7 | Select sugar level | MISSING | 2 | white | Toggle | **Keep only if** Kids is sold in both Low Sugar and Sugar-Free (MISSING) |
| 8 | "How many?" 1 / 2 | MISSING | 2 | white | Toggle | **Keep**: "Buy 2 Save $5" (brand.md: more than one kid on the order) |
| 9 | Autoship plan box | MISSING | 1 | white with kelly-green border | Offer card, 2 options | **Change to** no % badge, renewal price beside the first-box price, one-time shown neutrally |
| 10 | Button and lines under it | MISSING | 1 | white | CTA and terms | **Change to** a button plus the guarantee limit stated in full. "<1% use guarantee" removed |
| 11 | Review cards (was #15, far down) | MISSING | 1 | Plan: cream | Quote card | **Change to** one real review (R16), **moved up** under the button |
| 12 | Accordions (Why, Ingredients, Sugar, Science, Directions, Benefits) | MISSING | 1 | white | Accordion | **Change to** Why, Ingredients, Sugar, Quality, Directions. Benefits removed. Science removed (the study was on adults 23 to 59) |
| 13 | "Modern Living Leaves Our Bodies Deficient" stats | MISSING | 1 | Plan: deep forest #002C17 | Stats band | **Change to** a picky-eater problem block with no stats (one stat had a missing number, the other only said "Source") |
| 14 | Customer survey (95% / 67% / 52%) | MISSING | 3 | n/a | Stats band | **Remove**. Adult customer survey only |
| 15 | Quality testing | MISSING | 1 | cream | Certification block | **Keep if** the testing applies to Kids lots (MISSING confirm) |
| 16 | Us vs. Them cost table | MISSING | 3 | white | Comparison table | **Change to** a format comparison against "the old way", with no prices (the price comparison is dated and for adults) |
| 17 | Birthday price cut | MISSING | 1 | n/a | Promo band | **Remove**. It covers adult subscriptions at $29.99 |
| 18 | Athlete quote | MISSING | 1 | n/a | Spokesperson quote | **Remove**. Paid adult spokesperson, no agreement on file for Kids |
| 19 | Find Your Flavor (4 tiles, incl. tie-ins) | MISSING | 2×2 | white | Tile grid | **Change to** one cross-sell tile, "Sprout Original for you", with adult facts. Tie-in tiles cut |
| 20 | FAQ | MISSING | 1 | white | Accordion | **Keep**, with new questions on price after the first box, sugar, dose and delivery |
| 21 | Review widget (4.75, 109,639) | MISSING | 1 | n/a | Review platform block | **Remove** until a Kids-only rating is sourced |
| 22 | SMS pop-up "55% Off" | n/a | 1 | n/a | Modal | **Change to** a plain sign-up that states its condition, and only if the $24.99 needs it (MISSING) |
| 23 | Footer | MISSING | 1 to 3 | deep forest #002C17 | Footer | **Keep**: FDA line and offer conditions in plain words. Contact details MISSING |
| 24 | Sticky bottom bar (new) | thin | 1 | white | Bottom bar | **Add on phone**: price, renewal and button, because the plan box sits below the first screen |

## 2. Layout rules

- **Width:** MISSING from the text reference. Plan: phone first, single column, 20 px side padding. Widen to 2 columns (gallery left, plan box right) at about 900 px or more, with content max width as a variable.
- **Spacing:** MISSING. Plan: one section-spacing variable, the same between every section.
- **Corners:** MISSING. Plan: one radius variable shared by cards, tiles and buttons. Set the value from the live site.
- **Buttons:** kelly green #007E40, full width on phone, at least 48 px tall, white bold label.
- **Type:**
  - Work Sans bold for headings.
  - Work Sans medium for body, at least 16 px.
  - DM Mono uppercase for small tags.
  - Display font for the big statement line: MISSING (the name isn't in brand.md).
- **Colour jobs:**
  - Deep forest #002C17: headings and dark bands.
  - Forest #00582D: secondary text and borders.
  - Cream #FFF7DF: hero and tinted bands.
  - Kelly #007E40: buttons.
  - Sunflower #FFCC2E: badges and the Kids pouch accent.
  - Plum #581E5A: top bar.
  - The pink of "KIDS" has no hex on file, so sunflower is reused for tags.
- **Images:** a pouch on a soft 2-colour gradient, with gummies in a small hand. Bright and never clinical.
- **Product rules for images:**
  - The daily pack is torn straight across the top edge only.
  - The big pouch is shown only at its resealable top, never torn.
  - No tie-in characters or partner marks.

## 3. Slot map

| Slot | Source | Text for the slot |
|---|---|---|
| 1 Top bar | brand.md (shipping, guarantee) | "Ships within 24 hours · 30-day money-back guarantee on your first order" |
| 2 Gallery | MISSING: Kids photos | [INSERT: yellow Kids pouch on soft gradient] [INSERT: one daily pack torn across the top, 6 green bears in a child's palm] [INSERT: kid eating, at home] |
| 3 Headline | Ad | "Fiber Kids Won't Fight" |
| 3 Subhead | brand.md (format, flavour, count) | "Strawberry Burst gummies in one little daily pack. Six bears. No mixing, no stirring, no standoff." |
| 3 Product name | brand.md | "Sprout Kids · For ages 2 to 13" |
| 4 Rating | none held | removed |
| 5 Bullets | brand.md, user facts | • 6 Strawberry Burst gummies per pack (15 g)<br>• Methylfolate, not folic acid<br>• Vegan pectin base, no gelatin, no synthetic dyes or sweeteners (**confirm for Kids**)<br>• Made for ages 2 to 13<br>• Fiber per pack: `MISSING` (the 6 g figure is for adults)<br>• "Supports digestion and gut health": **only if** this claim is approved for Kids (claims about children get extra scrutiny) |
| 6 Flavour | brand.md | Tag "FLAVOR". Text "Strawberry Burst". Limited Kids flavour: `MISSING` (which flavour, a description only, and its $57.05 / $27.79 terms) |
| 7 Sugar level | MISSING | `MISSING: is Kids sold in Sugar-Free?` If yes, add next to it: "Sugar-Free uses sugar alcohols, which can upset some tummies" (sugar alcohols are in brand.md; the tummy line is from the brand's own buyer notes) |
| 8 How many kids | brand.md | "How many kids? 1 / 2 · Buy 2, save $5" |
| 9 Plan box, Subscribe | user facts | Tag "EVERY 4 WEEKS". "28 packs" · "First box $24.99" · ~~$53.32~~ · "Then `MISSING renewal price` every 4 weeks" · `MISSING: does $24.99 need the text sign-up code? If yes, print "with text sign-up code" here` |
| 9 Plan box, One-time | user facts | "28 packs, delivered once · $53.32" (no negative labels) |
| 9 Shipping cost | MISSING | `MISSING: is shipping free on a Kids first order?` Show it only if confirmed |
| 10 Button | new | "Start Sprout Kids" |
| 10 Terms under button | user facts | "30-day money-back guarantee on your first order only. Later orders aren't covered." |
| 10 HSA/FSA | brand.md (brand-wide) | `MISSING: confirm Kids is HSA/FSA eligible`, otherwise cut |
| 11 Review card | user (R16) | "I have tried all of the 'green' options for the kids and this is the only one they love eating. They think it's a treat." Attribution: `MISSING (name or initials, review site, date for R16)` |
| 12 Accordion: Why | new, brand voice | "One pack a day, no negotiating. It goes in a lunchbox, a car door or a backpack, and there's nothing to wash up after." |
| 12 Accordion: Ingredients | MISSING | `MISSING: Kids ingredients panel and vitamin/mineral count` (21 is the adult figure) |
| 12 Accordion: Sugar | MISSING | `MISSING: grams of sugar per Kids pack.` Parents ask "Is the sugar okay for kids?", and this slot is the answer |
| 12 Accordion: Directions | brand.md | "Rip. Tip. Enjoy. Tear the top off one pack and tip 6 gummies into their hand, once a day." Plus `MISSING: label directions or warnings by age (2 to 3 vs older)` |
| 13 Problem block | brand.md (buyer, format) | Heading: "Skip the broccoli negotiations." Body: "Powders need stirring into something. Pills need swallowing. These just need a small hand." |
| 15 Quality | brand.md | "Third-party tested for 70 pesticides, 4 heavy metals, 16 contaminants and 9 microbial contaminants. Made in NSF, GMP and FDA-registered facilities in the US and Canada." Gate: `MISSING: confirm the testing covers Kids lots, plus the lab and test date for Kids` |
| 16 Comparison | brand.md (format, "the old way") | Rows: How you take it / Prep / Storage.<br>Sprout Kids: one daily pack / none / one pouch of 28.<br>The old way: powder in a drink / mix and shake / a tub, a shaker and a shelf of bottles. |
| 19 Cross-sell tile | brand.md | "One for you too? Sprout Original for adults: 28 packs. $66.65 one-time, or $29.99 for the first box with our text sign-up discount, then $49.99 every 4 weeks." [INSERT: green adult pouch] |
| 20 FAQ: price after first box | MISSING | "What does it cost after the first box?" → `MISSING renewal price` (the Kids page's "$74.98" is unexplained) |
| 20 FAQ: candy? | user facts, MISSING | "Is this just candy?" → "It's a daily supplement in gummy form, with methylfolate rather than folic acid." Add `MISSING vitamin count` and `MISSING sugar grams` |
| 20 FAQ: how many | brand.md | "How many a day?" → "One pack: 6 gummies." |
| 20 FAQ: delivery | brand.md | "When will it arrive?" → "We ship within 24 hours, and orders usually arrive 3 to 5 days later." |
| 20 FAQ: won't eat it | user facts | "What if they won't eat it?" → "Your first order has a 30-day money-back guarantee. It doesn't apply to later orders." |
| 20 FAQ: pause/cancel | product page (own terms) | "Can I pause or cancel?" → "Yes, at any time." Plus `MISSING: how (account page? email?)`. Don't promise more than this |
| 22 Pop-up | MISSING | Only if needed: "Get your first Sprout Kids box for $24.99. Enter your number for the code. New customers only." |
| 23 Footer | product page (standard text) | FDA line. An offer condition written out in full if the SMS code is needed. `MISSING: contact email, address` |
| 24 Bottom bar | user facts | "First box $24.99 · then `MISSING`/4 wks" + [Start Sprout Kids] |

## 4. Not sourced list

**Images**
- Kids pouch shots.
- A torn daily pack with 6 bears in a child's hand.
- Lifestyle photos of kids and parents.
- An adult pouch shot for the cross-sell.
- Logo file.

**Price and terms**
- Kids renewal price.
- Whether $24.99 needs the SMS code.
- Free shipping on a Kids first order.
- HSA/FSA eligibility for Kids.
- How to pause or cancel.

**Product facts**
- Kids fiber grams. The ad promises fiber, so this is the most urgent gap.
- Kids vitamin and mineral count.
- Kids ingredients panel.
- Sugar grams per pack.
- Whether Kids comes in Sugar-Free.
- Age-specific directions and warnings.
- Whether the vegan and free-from claims, third-party testing and "supports digestion" apply to Kids.

**Proof**
- R16 attribution: name or initials, site and date.
- A Kids-specific rating and count.
- Any Kids survey data.

**Removed fact slots**
- Rating line.
- "1M+ customers".
- Survey stats.
- "Modern living" stats.
- Clinical study (adults only).
- Cost-per-serving table.
- Birthday price cut.
- Athlete quote.
- "<1% use guarantee".
- % discount badges and pop-up %.
- Tie-in flavour tiles.

**Look**
- Hex for the "KIDS" pink (sunflower used instead).
- Display font name.
- Corner radius, spacing and width values (not readable from a text reference).

## 5. Skeleton HTML

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sprout Kids | Fiber Kids Won't Fight</title>
<style>
:root{
  --c-heading:#002C17;   /* deep forest: headings, dark bands */
  --c-brand:#00582D;     /* forest: secondary text, borders */
  --c-cream:#FFF7DF;     /* hero, tinted bands */
  --c-button:#007E40;    /* kelly: buttons */
  --c-badge:#FFCC2E;     /* sunflower: badges, tags (reused for KIDS pink: hex MISSING) */
  --c-topbar:#581E5A;    /* plum: top bar */
  --c-white:#FFFFFF;
  --f-head:"Work Sans",sans-serif; /* bold */
  --f-body:"Work Sans",sans-serif; /* medium */
  --f-tag:"DM Mono",monospace;
  --f-display:"Work Sans",sans-serif; /* MISSING: brand display font */
  --radius:12px;         /* MISSING: set from live site */
  --gap:48px;            /* MISSING: set from live site */
  --max:1100px;
}
*{box-sizing:border-box}
body{margin:0;font:500 16px/1.5 var(--f-body);color:var(--c-heading);background:var(--c-white)}
h1,h2,h3{font-family:var(--f-head);font-weight:700;margin:0 0 12px}
h1{font-family:var(--f-display);font-size:32px;line-height:1.1}
section{padding:var(--gap) 20px}
.wrap{max-width:var(--max);margin:0 auto}
.tag{font:500 12px var(--f-tag);text-transform:uppercase;letter-spacing:.06em;background:var(--c-badge);padding:2px 8px;border-radius:var(--radius)}
.btn{display:block;width:100%;min-height:48px;border:0;border-radius:var(--radius);background:var(--c-button);color:#fff;font:700 18px var(--f-head);cursor:pointer}
.img{background:#eee;border:2px dashed var(--c-brand);border-radius:var(--radius);aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;text-align:center;padding:12px;font-size:14px}
.card{border:2px solid var(--c-brand);border-radius:var(--radius);padding:16px;margin-bottom:12px}
.cream{background:var(--c-cream)} .dark{background:var(--c-heading);color:#fff} .dark h2{color:#fff}
.missing{background:#ffe9e9;font-weight:700}
#s01{background:var(--c-topbar);color:#fff;padding:8px 20px;text-align:center;font-size:14px}
#s24{position:sticky;bottom:0;background:#fff;padding:10px 20px;box-shadow:0 -2px 8px rgba(0,0,0,.1);display:flex;gap:12px;align-items:center}
#s24 .btn{width:auto;flex:1}
table{width:100%;border-collapse:collapse} td,th{border-bottom:1px solid var(--c-brand);padding:8px;text-align:left}
@media (min-width:900px){
  .hero{display:grid;grid-template-columns:1fr 1fr;gap:32px}
  #s24{display:none}
}
</style>
</head>
<body>

<div id="s01">Ships within 24 hours · 30-day money-back guarantee on your first order</div>

<section id="s02-s10" class="cream"><div class="wrap hero">
  <div>
    <!-- s03 first on phone so the ad headline is on screen one -->
    <div id="s03">
      <span class="tag">Sprout Kids · Ages 2 to 13</span>
      <h1>Fiber Kids Won't Fight</h1>
      <p>Strawberry Burst gummies in one little daily pack. Six bears. No mixing, no stirring, no standoff.</p>
    </div>
    <div id="s02">
      <div class="img">[INSERT: yellow Sprout Kids pouch on soft 2-colour gradient, resealable top closed]</div>
      <div class="img">[INSERT: one daily pack torn straight across the TOP edge, 6 green bears in a child's palm]</div>
    </div>
  </div>
  <div>
    <ul id="s05">
      <li>6 Strawberry Burst gummies per pack (15 g)</li>
      <li>Methylfolate, not folic acid</li>
      <li>Vegan pectin base, no gelatin, no synthetic dyes or sweeteners <span class="missing">[CONFIRM FOR KIDS]</span></li>
      <li>Made for ages 2 to 13</li>
      <li class="missing">MISSING: fiber grams per Kids pack</li>
    </ul>
    <p id="s06"><span class="tag">Flavor</span> Strawberry Burst</p>
    <p id="s07" class="missing">MISSING: sugar options for Kids (show toggle only if Sugar-Free exists)</p>
    <p id="s08">How many kids? <button>1</button> <button>2</button> Buy 2, save $5</p>
    <div id="s09">
      <label class="card"><input type="radio" name="plan" checked>
        <span class="tag">Every 4 weeks</span> 28 packs<br>
        First box <strong>$24.99</strong> <s>$53.32</s><br>
        Then <span class="missing">MISSING renewal price</span> every 4 weeks<br>
        <span class="missing">MISSING: "with text sign-up code" if required</span>
      </label>
      <label class="card"><input type="radio" name="plan">
        28 packs, delivered once · <strong>$53.32</strong>
      </label>
    </div>
    <div id="s10">
      <button class="btn">Start Sprout Kids</button>
      <p>30-day money-back guarantee on your first order only. Later orders aren't covered.</p>
    </div>
  </div>
</div></section>

<section id="s11"><div class="wrap card">
  <p>"I have tried all of the 'green' options for the kids and this is the only one they love eating. They think it's a treat."</p>
  <p class="missing">MISSING: reviewer name/initials, site, date (R16)</p>
</div></section>

<section id="s12"><div class="wrap">
  <details><summary>Why Sprout Kids?</summary><p>One pack a day, no negotiating. It goes in a lunchbox, a car door or a backpack, and there's nothing to wash up after.</p></details>
  <details><summary>Ingredients</summary><p class="missing">MISSING: Kids ingredients panel and vitamin/mineral count</p></details>
  <details><summary>How much sugar?</summary><p class="missing">MISSING: grams of sugar per Kids pack</p></details>
  <details><summary>Directions</summary><p>Rip. Tip. Enjoy. Tear the top off one pack and tip 6 gummies into their hand, once a day.</p><p class="missing">MISSING: label directions/warnings by age</p></details>
</div></section>

<section id="s13" class="dark"><div class="wrap">
  <h2>Skip the broccoli negotiations.</h2>
  <p>Powders need stirring into something. Pills need swallowing. These just need a small hand.</p>
</div></section>

<section id="s15" class="cream"><div class="wrap">
  <span class="tag">Tested</span>
  <p>Third-party tested for 70 pesticides, 4 heavy metals, 16 contaminants and 9 microbial contaminants. Made in NSF, GMP and FDA-registered facilities in the US and Canada.</p>
  <p class="missing">MISSING: confirm testing covers Kids lots; lab and date</p>
</div></section>

<section id="s16"><div class="wrap">
  <table>
    <tr><th></th><th>Sprout Kids</th><th>The old way</th></tr>
    <tr><td>How you take it</td><td>One daily pack</td><td>Powder in a drink</td></tr>
    <tr><td>Prep</td><td>None</td><td>Mix and shake</td></tr>
    <tr><td>Storage</td><td>One pouch of 28</td><td>A tub, a shaker and a shelf of bottles</td></tr>
  </table>
</div></section>

<section id="s19"><div class="wrap card">
  <div class="img">[INSERT: green Sprout Original adult pouch]</div>
  <h3>One for you too?</h3>
  <p>Sprout Original for adults: 28 packs. $66.65 one-time, or $29.99 for the first box with our text sign-up discount, then $49.99 every 4 weeks.</p>
</div></section>

<section id="s20"><div class="wrap">
  <h2>Questions</h2>
  <details><summary>What does it cost after the first box?</summary><p class="missing">MISSING: Kids renewal price</p></details>
  <details><summary>Is this just candy?</summary><p>It's a daily supplement in gummy form, with methylfolate rather than folic acid.</p><p class="missing">MISSING: vitamin count, sugar grams</p></details>
  <details><summary>How many a day?</summary><p>One pack: 6 gummies.</p></details>
  <details><summary>When will it arrive?</summary><p>We ship within 24 hours, and orders usually arrive 3 to 5 days later.</p></details>
  <details><summary>What if they won't eat it?</summary><p>Your first order has a 30-day money-back guarantee. It doesn't apply to later orders.</p></details>
  <details><summary>Can I pause or cancel?</summary><p>Yes, at any time.</p><p class="missing">MISSING: how to pause/cancel</p></details>
</div></section>

<footer id="s23" class="dark"><div class="wrap" style="padding:32px 20px">
  <p>These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure or prevent any disease.</p>
  <p class="missing">MISSING: full offer conditions for $24.99 (if SMS code needed, state it here)</p>
  <p class="missing">MISSING: contact email, address</p>
</div></footer>

<div id="s24">
  <span>First box $24.99 · then <span class="missing">MISSING</span>/4 wks</span>
  <button class="btn">Start Sprout Kids</button>
</div>

</body>
</html>
```

## 6. CHECKS MISSED

- **No sentence from the reference:** the FDA disclaimer is kept in its standard wording on purpose, because it is required text and not marketing copy. "Pause or cancel at any time" restates the page's own term, since brand.md holds no separate cancel terms.
- **Every fact supplied:** the vegan and free-from line, third-party testing, HSA/FSA and "supports digestion" are brand-wide facts in brand.md and are not confirmed for Kids. They are gated with CONFIRM/MISSING and must not ship until confirmed.
- **First screen carries on from the ad:** the words match "Fiber Kids Won't Fight", but no Kids fiber figure is on file. The page promises fiber without stating an amount until that MISSING is filled.
- **Price shown plainly:** the Kids renewal price is MISSING, so the plan box, FAQ and bottom bar can't go live as drafted. Showing $24.99 without its renewal price would repeat the adult page's problem.
- **Phone-width check:** not done visually, because no screenshot or render exists. Section heights and columns from the reference couldn't be read from text.

Next, want to check this page before it goes live with the [Meta ads compliance checker](https://useaiblocks.com/skills/meta-ads-compliance-checker), or write the full copy with the [Shopify landing page builder](https://useaiblocks.com/skills/shopify-landing-page-builder)? You can also name your own next step.
```
