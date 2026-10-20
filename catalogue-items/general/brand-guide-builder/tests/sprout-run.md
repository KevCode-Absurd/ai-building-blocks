# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A thorough, on-brand guide: every colour, font, voice line, rule and claim traces back to brand.md, the contrast maths is correct, and gaps (display font name, forest green's job, sachet look, sizes) are marked MISSING or 'guide's reading' rather than guessed. The owner can hand it to a freelance designer today; the only soft spots are the unverified print preview and the small yellow-on-kelly sample cell rendered below large-text size.

## Judge list

- Met: The guide uses your colours and fonts, not a generic grey and blue.
  ":root{ --forest:#00582D; --deep:#002C17; --cream:#FFF7DF; --kelly:#007E40; --sun:#FFCC2E; --plum:#581E5A; }" with Work Sans and DM Mono throughout.
- Met: Page 2 alone is enough to make one on-brand post.
  Quick sheet has chips with hex and job, allowed pairs, fonts, "Playful. Cheeky. Casual. Short. Plain.", copy rule, picture rule, products, brand world.
- Met: Every text colour shown on a background passes its contrast level, and failing pairs are named.
  Ratios (14.3, 11.2, 10.2, 8.1, 8.0, 5.7, 4.8, 3.4) all check out; "Never for text: yellow / cream 1.4:1 · kelly / deep forest 3.0:1 (2.96)..." named.
- Met: Voice examples are real lines from your copy, not invented ones.
  "Rip. Tip. Enjoy.", "Tastes like a treat, works like a supplement.", "Sachet is a fancy word for our gummy pack." all in brand.md.
- Met: It prints one topic per page with nothing cut off.
  "@page{size:A4;margin:0}", ".page{width:210mm;height:297mm;...break-after:page}"; page content estimates fit; run flags print preview unconfirmed under CHECKS MISSED.
- Met: Every blank in your brand file appears under "Not yet captured".
  Lists display font, forest green job, sugar grams, uncaptured subscription prices, electrolyte pack facts, price-doubter share, discount figure, rating source, logo rules.

## What went in

```text
Brand file: the Sprout folder. voice-and-look.md has colours with
hex and job, fonts, voice traits and real lines, image style and
the "show it right" pack rules. proof-and-claims.md has the claims
list.

No logo rules and no site code. This guide is for a freelance
designer making social posts.

[attached: sprout/brand.md]
```

## What came out

```text
# brand-guide.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Sprout · Brand guide</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Work+Sans:wght@500;700;800&display=swap" rel="stylesheet">
<style>
:root{
  --forest:#00582D; --deep:#002C17; --cream:#FFF7DF;
  --kelly:#007E40; --sun:#FFCC2E; --plum:#581E5A;
}
@page{size:A4;margin:0}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{font-family:'Work Sans',sans-serif;font-weight:500;color:var(--deep);background:var(--deep);
  -webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:210mm;height:297mm;margin:0 auto 8mm;background:var(--cream);padding:15mm 15mm 22mm;
  position:relative;overflow:hidden;break-after:page;page-break-after:always}
.page:last-child{break-after:auto;page-break-after:auto}
@media print{body{background:none}.page{margin:0}}
.foot{position:absolute;left:15mm;right:15mm;bottom:9mm;display:flex;justify-content:space-between;
  font-family:'DM Mono',monospace;font-size:7.5pt;text-transform:uppercase;letter-spacing:.08em;
  color:var(--forest);border-top:.4mm solid var(--forest);padding-top:2mm}
.tag{font-family:'DM Mono',monospace;font-size:7.5pt;text-transform:uppercase;letter-spacing:.1em;color:var(--forest);margin:0 0 1.5mm}
h1{font-weight:800;font-size:28pt;line-height:1.05;margin:0 0 4mm;color:var(--deep)}
h2{font-weight:700;font-size:12pt;margin:5mm 0 2mm;color:var(--deep)}
h3{font-weight:700;font-size:10pt;margin:3mm 0 1mm;color:var(--deep)}
p,li,td,th{font-size:9pt;line-height:1.38}
ul{margin:0;padding-left:4.5mm}
li{margin-bottom:.8mm}
.why{background:var(--deep);color:var(--cream);padding:3.5mm 5mm;border-radius:3mm;margin:0 0 4mm;font-size:9.5pt;line-height:1.45}
.why b{color:var(--sun)}
.reading{font-family:'DM Mono',monospace;font-size:7pt;text-transform:uppercase;letter-spacing:.06em}
.missing{font-family:'DM Mono',monospace;font-size:7.5pt;background:var(--sun);color:var(--deep);padding:.3mm 1.5mm;border-radius:1mm;white-space:nowrap}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:6mm}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4mm}
table{width:100%;border-collapse:collapse}
th{text-align:left;font-family:'DM Mono',monospace;font-size:7pt;text-transform:uppercase;letter-spacing:.06em;color:var(--forest);border-bottom:.4mm solid var(--forest);padding:1.2mm 1.5mm}
td{border-bottom:.2mm solid var(--forest);padding:1.2mm 1.5mm;vertical-align:top}
.do{border-left:1.5mm solid var(--forest);padding:1.5mm 3mm;margin-bottom:2mm}
.dont{border-left:1.5mm solid var(--plum);padding:1.5mm 3mm;margin-bottom:2mm;color:var(--plum)}
.do .lbl,.dont .lbl{font-family:'DM Mono',monospace;font-size:7pt;letter-spacing:.1em;text-transform:uppercase;display:block;margin-bottom:.5mm}
.frame{border:.5mm dashed var(--forest);border-radius:2mm;height:30mm;display:flex;align-items:center;justify-content:center;text-align:center;padding:2mm;
  font-family:'DM Mono',monospace;font-size:7pt;text-transform:uppercase;letter-spacing:.06em;color:var(--forest)}
/* chips */
.chip{display:flex;align-items:center;gap:3mm;margin-bottom:1.6mm}
.chip i{display:block;width:11mm;height:8mm;border-radius:1.5mm;flex:none;border:.2mm solid var(--deep)}
.chip span{font-size:8pt;line-height:1.25}
.pair{display:inline-flex;align-items:center;justify-content:center;width:18mm;height:10mm;border-radius:1.5mm;font-weight:700;font-size:11pt;margin:0 1mm 1mm 0}
.pairlbl{font-size:7.5pt}
/* swatches */
.sw{border-radius:3mm;height:46mm;padding:4mm;display:flex;flex-direction:column;justify-content:flex-end;border:.2mm solid var(--deep)}
.sw .n{font-weight:700;font-size:12pt}
.sw .h{font-family:'DM Mono',monospace;font-size:9pt}
.sw .j{font-size:8.5pt;margin-top:1mm}
.bgflow div{padding:2.5mm 4mm;font-size:8.5pt}
.cell{display:inline-block;padding:.6mm 2.5mm;border-radius:1mm;font-weight:700}
.bigline{font-weight:800;line-height:1.05}
</style>
</head>
<body>

<!-- 1. COVER -->
<section class="page" style="background:var(--deep);color:var(--cream)">
  <p class="tag" style="color:var(--sun)">Brand guide · for a freelance designer making social posts</p>
  <div style="margin-top:70mm">
    <div class="bigline" style="font-size:72pt;color:var(--sun)">Sprout</div>
    <div style="font-weight:700;font-size:26pt;margin-top:3mm">Brand guide</div>
    <p style="font-size:13pt;max-width:140mm;margin-top:8mm;color:var(--cream)">Sprout sells daily greens gummies in single-serve packs. One pouch holds 28 small daily packs. You tear one open and eat the small handful of green gummy bears inside.</p>
  </div>
  <div style="position:absolute;left:15mm;right:15mm;bottom:15mm;display:flex;justify-content:space-between" class="tag">
    <span style="color:var(--sun)">2026-10-18</span>
    <span style="color:var(--cream)">Read page 2 first. The rest explains why.</span>
  </div>
</section>

<!-- 2. QUICK SHEET -->
<section class="page">
  <p class="tag">Page 2 · Quick sheet</p>
  <h1>Everything on one page</h1>
  <div class="grid2">
    <div>
      <h3>Colours and their jobs</h3>
      <div class="chip"><i style="background:#00582D"></i><span><b>Forest green #00582D</b>, main green. Job <span class="missing">MISSING</span></span></div>
      <div class="chip"><i style="background:#002C17"></i><span><b>Deep forest green #002C17</b>, headings, dark sections</span></div>
      <div class="chip"><i style="background:#FFF7DF"></i><span><b>Warm cream #FFF7DF</b>, hero background</span></div>
      <div class="chip"><i style="background:#007E40"></i><span><b>Kelly green #007E40</b>, buttons</span></div>
      <div class="chip"><i style="background:#FFCC2E"></i><span><b>Sunflower yellow #FFCC2E</b>, stars, badges</span></div>
      <div class="chip"><i style="background:#581E5A"></i><span><b>Plum purple #581E5A</b>, top banner</span></div>

      <h3>Text on background: allowed</h3>
      <div>
        <span class="pair" style="background:var(--cream);color:var(--deep);border:.2mm solid var(--deep)">Aa</span>
        <span class="pair" style="background:var(--deep);color:var(--cream)">Aa</span>
        <span class="pair" style="background:var(--deep);color:var(--sun)">Aa</span>
        <span class="pair" style="background:var(--plum);color:var(--cream)">Aa</span>
        <span class="pair" style="background:var(--plum);color:var(--sun)">Aa</span>
        <span class="pair" style="background:var(--forest);color:var(--cream)">Aa</span>
        <span class="pair" style="background:var(--forest);color:var(--sun)">Aa</span>
        <span class="pair" style="background:var(--sun);color:var(--deep)">Aa</span>
        <span class="pair" style="background:var(--cream);color:var(--kelly);border:.2mm solid var(--deep)">Aa</span>
        <span class="pair" style="background:var(--kelly);color:var(--cream)">Aa</span>
      </div>
      <p class="pairlbl">Any of these at any size. <b>Large text only</b> (24 px, or 19 px bold): yellow on kelly, kelly on yellow (3.4:1). <b style="color:var(--plum)">Never for text:</b> yellow on cream; kelly, forest, deep forest and plum on each other.</p>

      <h3>Fonts and their jobs</h3>
      <p style="margin:0"><b style="font-weight:700">Work Sans Bold</b>: headings<br>
      Work Sans Medium: body<br>
      <span style="font-family:'DM Mono';text-transform:uppercase;font-size:8pt">DM Mono</span>: small uppercase tags<br>
      Chunky friendly display font: big statement lines. Name <span class="missing">MISSING</span></p>
    </div>
    <div>
      <h3>The voice in five words</h3>
      <p style="font-weight:800;font-size:15pt;margin:0;line-height:1.15">Playful. Cheeky. Casual. Short. Plain.</p>
      <h3>One copy rule</h3>
      <p style="margin:0">Numbers up front, short lines, and every health claim stays at "supports". Never "fix".</p>
      <h3>One picture rule</h3>
      <p style="margin:0">Bright, sunny, candy-like: a single pouch on a soft two-colour gradient with gummies scattered in front. Never clinical, never muted.</p>
      <h3>Each product in two lines</h3>
      <p style="margin:0 0 1.5mm"><b>Adults Original:</b> glossy deep-green stand-up pouch, big yellow wordmark, yellow bear face top right; small matte deep-green bears.<br><span style="color:var(--plum)">Never: a daily pack torn anywhere but straight across its top edge.</span></p>
      <p style="margin:0 0 1.5mm"><b>Kids:</b> sunflower-yellow pouch, green wordmark, pink "KIDS", "For ages 2 to 13"; 6 gummies a pack.<br><span style="color:var(--plum)">Never: the big pouch shown torn. It opens only at its resealable top.</span></p>
      <p style="margin:0 0 1.5mm"><b>Limited flavours:</b> gummies change shape and colour (red lemon slices, stars).<br><span style="color:var(--plum)">Never: tie-in characters or any partner brand's marks.</span></p>
      <h3>The brand world in one line</h3>
      <p style="margin:0">At home or outdoors, in bright sunny light, with everyday adults in casual clothes.</p>
    </div>
  </div>

  <h3 style="margin-top:4mm">Not yet captured (and the question that fills each gap)</h3>
  <ul style="columns:2;column-gap:6mm;font-size:7.5pt">
    <li style="font-size:7.5pt">Display font: what is its name, and where is it licensed?</li>
    <li style="font-size:7.5pt">Forest green #00582D: what is its job?</li>
    <li style="font-size:7.5pt">Button text: what colour sits on kelly-green buttons? (Cream passes at 4.8:1.)</li>
    <li style="font-size:7.5pt">Type sizes: what sizes do headlines and body use?</li>
    <li style="font-size:7.5pt">Logo: clear space, smallest size, uses to avoid?</li>
    <li style="font-size:7.5pt">Photos: can you share the brand's own shots (pack front, out of pack, in hand, in use, close-up) per product?</li>
    <li style="font-size:7.5pt">Daily pack (sachet): what colour, print and finish?</li>
    <li style="font-size:7.5pt">Kids gummies: what colour and shape?</li>
    <li style="font-size:7.5pt">Limited-flavour pouch: how does it differ from Original?</li>
    <li style="font-size:7.5pt">What visibly changes on camera, if anything?</li>
    <li style="font-size:7.5pt">Motion and sound: what pace, camera, sound and words on screen?</li>
    <li style="font-size:7.5pt">Brand world: which surfaces and props?</li>
    <li style="font-size:7.5pt">Do social posts need the FDA line? (The site has it; ads don't.)</li>
    <li style="font-size:7.5pt">Sugar: how many grams per pack?</li>
    <li style="font-size:7.5pt">Prices: Kids subscription ($22.49 vs "renews at $74.98"), 84-pack subscriptions, Sugar-Free first order, Kids limited subscription?</li>
    <li style="font-size:7.5pt">Discount: which one figure should posts quote (49%, 52%, 55%, 58% or 61%)?</li>
    <li style="font-size:7.5pt">Rating: which figure and source should posts quote?</li>
    <li style="font-size:7.5pt">Electrolyte variety pack: what are its facts?</li>
    <li style="font-size:7.5pt">Price-doubter buyers: what share of buyers are they?</li>
  </ul>
  <div class="foot"><span>Sprout · Brand guide</span><span>2026-10-18 · 2</span></div>
</section>

<!-- 3. COLOUR -->
<section class="page">
  <p class="tag">Page 3 · Colour</p>
  <h1>Colour</h1>
  <div class="why">The file gives each colour a job, not a meaning: <b>deep forest green</b> carries headings and dark sections, <b>warm cream</b> is the hero background, <b>kelly green</b> is for buttons, <b>sunflower yellow</b> for stars and badges, <b>plum</b> for the top banner. Together they make pictures that are "bright, sunny, candy-like ... never clinical, never muted." <span class="reading">What each colour stands for: not on file.</span></div>
  <div class="grid3">
    <div class="sw" style="background:#00582D;color:var(--cream)"><span class="n">Forest green</span><span class="h">#00582D</span><span class="j">Job: <span class="missing">MISSING</span></span></div>
    <div class="sw" style="background:#002C17;color:var(--cream)"><span class="n">Deep forest green</span><span class="h">#002C17</span><span class="j">Headings, dark sections</span></div>
    <div class="sw" style="background:#FFF7DF;color:var(--deep)"><span class="n">Warm cream</span><span class="h">#FFF7DF</span><span class="j">Hero background</span></div>
    <div class="sw" style="background:#007E40;color:var(--cream)"><span class="n">Kelly green</span><span class="h">#007E40</span><span class="j">Buttons</span></div>
    <div class="sw" style="background:#FFCC2E;color:var(--deep)"><span class="n">Sunflower yellow</span><span class="h">#FFCC2E</span><span class="j">Stars, badges</span></div>
    <div class="sw" style="background:#581E5A;color:var(--cream)"><span class="n">Plum purple</span><span class="h">#581E5A</span><span class="j">Top banner</span></div>
  </div>

  <h2>Contrast: text on background</h2>
  <div class="grid2">
    <table>
      <tr><th>Text on background</th><th>Ratio</th><th>Use</th></tr>
      <tr><td><span class="cell" style="background:var(--cream);color:var(--deep)">Deep forest on cream</span></td><td>14.3:1</td><td>Any size</td></tr>
      <tr><td><span class="cell" style="background:var(--deep);color:var(--cream)">Cream on deep forest</span></td><td>14.3:1</td><td>Any size</td></tr>
      <tr><td><span class="cell" style="background:var(--plum);color:var(--cream)">Cream on plum</span></td><td>11.2:1</td><td>Any size (and plum on cream)</td></tr>
      <tr><td><span class="cell" style="background:var(--deep);color:var(--sun)">Yellow on deep forest</span></td><td>10.2:1</td><td>Any size (and deep forest on yellow)</td></tr>
      <tr><td><span class="cell" style="background:var(--forest);color:var(--cream)">Cream on forest</span></td><td>8.1:1</td><td>Any size (and forest on cream)</td></tr>
      <tr><td><span class="cell" style="background:var(--plum);color:var(--sun)">Yellow on plum</span></td><td>8.0:1</td><td>Any size (and plum on yellow)</td></tr>
    </table>
    <table>
      <tr><th>Text on background</th><th>Ratio</th><th>Use</th></tr>
      <tr><td><span class="cell" style="background:var(--forest);color:var(--sun)">Yellow on forest</span></td><td>5.7:1</td><td>Any size (and forest on yellow)</td></tr>
      <tr><td><span class="cell" style="background:var(--kelly);color:var(--cream)">Cream on kelly</span></td><td>4.8:1</td><td>Any size (and kelly on cream)</td></tr>
      <tr><td><span class="cell" style="background:var(--kelly);color:var(--sun);font-size:11pt">Yellow on kelly</span></td><td>3.4:1</td><td>Large text only (and kelly on yellow)</td></tr>
      <tr><td colspan="3" style="color:var(--plum)"><b>Never for text:</b> yellow / cream 1.4:1 · kelly / deep forest 3.0:1 (2.96) · kelly / plum 2.3:1 · kelly / forest 1.7:1 · forest / deep forest 1.8:1 · forest / plum 1.4:1 · plum / deep forest 1.3:1. Either way round.</td></tr>
    </table>
  </div>

  <h2>How backgrounds follow each other down a page</h2>
  <div class="grid2">
    <div class="bgflow" style="border:.2mm solid var(--deep);border-radius:2mm;overflow:hidden">
      <div style="background:var(--plum);color:var(--cream)">1 · Plum top banner (on file)</div>
      <div style="background:var(--cream);color:var(--deep);padding:6mm 4mm">2 · Cream hero (on file)</div>
      <div style="background:var(--deep);color:var(--cream);padding:4mm 4mm">3 · Deep forest dark section (on file)</div>
    </div>
    <p style="margin:0">The site's order: the plum banner sits on top, the cream hero follows, and deep forest marks the dark sections. Yellow appears as stars and badges, and kelly green as the button.<br><br><span class="reading">The guide's reading, not on file:</span> for a social post, keep cream as the open ground and deep forest as the heavy block. Yellow is an accent, never a text colour on cream.</p>
  </div>
  <div class="foot"><span>Sprout · Brand guide</span><span>2026-10-18 · 3</span></div>
</section>

<!-- 4. TYPE -->
<section class="page">
  <p class="tag">Page 4 · Type</p>
  <h1>Type</h1>
  <div class="why"><b>Work Sans Bold</b> speaks in headings, <b>Work Sans Medium</b> explains in body copy, <b>DM Mono</b> labels in small uppercase tags, and a <b>chunky friendly display font</b> carries the big statement lines. Headlines follow the voice rule: "No guilt, no lab-coat tone in headlines."</div>

  <p class="tag">Display: big statement lines · font name <span class="missing">MISSING</span> · shown here in Work Sans 800 as a stand-in</p>
  <div class="bigline" style="font-size:44pt;margin-bottom:5mm">Rip. Tip. Enjoy.</div>

  <p class="tag">Work Sans Bold · headings</p>
  <div style="font-weight:700;font-size:22pt;line-height:1.15;margin-bottom:5mm">Tastes like a treat, works like a supplement.</div>

  <p class="tag">Work Sans Medium · body</p>
  <p style="font-size:11pt;max-width:150mm;margin:0 0 5mm">No more gagging on pills, sloshing chalky powders, or cleaning messy counters. We made daily nutrition, like, ridiculously easy.</p>

  <p class="tag">DM Mono · small uppercase tags</p>
  <p style="font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:.1em;font-size:10pt;margin:0 0 5mm">28 Daily Packs · Most popular</p>

  <h2>Size scale for a 1080 px-wide social post <span class="reading">· the guide's reading, not on file</span></h2>
  <table>
    <tr><th>Role</th><th>Font</th><th>Size</th><th>Line height</th></tr>
    <tr><td>Display statement</td><td>Display font (<span class="missing">MISSING</span>)</td><td>96 px</td><td>1.0</td></tr>
    <tr><td>Heading 1</td><td>Work Sans Bold</td><td>64 px</td><td>1.05</td></tr>
    <tr><td>Heading 2</td><td>Work Sans Bold</td><td>44 px</td><td>1.1</td></tr>
    <tr><td>Body</td><td>Work Sans Medium</td><td>30 px</td><td>1.35</td></tr>
    <tr><td>Small print</td><td>Work Sans Medium</td><td>24 px</td><td>1.35</td></tr>
    <tr><td>Tag</td><td>DM Mono, uppercase</td><td>20 px</td><td>1.2</td></tr>
  </table>

  <h2>Type on light and on dark</h2>
  <div class="grid2">
    <div style="background:var(--cream);border:.2mm solid var(--deep);border-radius:3mm;padding:5mm">
      <p class="tag" style="color:var(--forest)">Cream ground</p>
      <div style="font-weight:700;font-size:16pt;color:var(--deep);line-height:1.15">60+ ingredients, 21 vitamins &amp; minerals, and 6g fiber</div>
      <p style="color:var(--deep);margin:2mm 0 0">Deep forest headings, deep forest body, forest-green tags.</p>
    </div>
    <div style="background:var(--deep);border-radius:3mm;padding:5mm">
      <p class="tag" style="color:var(--sun)">Deep forest ground</p>
      <div style="font-weight:700;font-size:16pt;color:var(--sun);line-height:1.15">Savings, exclusive flavors, and a minor sense of superiority.</div>
      <p style="color:var(--cream);margin:2mm 0 0">Yellow or cream headings, cream body.</p>
    </div>
  </div>
  <div class="foot"><span>Sprout · Brand guide</span><span>2026-10-18 · 4</span></div>
</section>

<!-- 5. VOICE (1 of 2) -->
<section class="page">
  <p class="tag">Page 5 · Voice (1 of 2)</p>
  <h1>Voice</h1>
  <div class="why">Sprout talks like "a funny friend who is into wellness but refuses to be preachy." It is a playful, cheeky, casual internet voice: short lines, three-beat rhythms, numbers up front, and the gross thing said plainly ("better poops"). It names the enemy by how it feels: chalky powders, pills you gag on, a cobbled-together shelf.</div>

  <h2>Traits: this, not that</h2>
  <table>
    <tr><th>This</th><th>Not that</th><th>Real line</th></tr>
    <tr><td><b>Playful friend</b></td><td>Preachy, guilt</td><td>"We made daily nutrition, like, ridiculously easy."</td></tr>
    <tr><td><b>Short, three beats</b></td><td>Long explaining</td><td>"Rip. Tip. Enjoy."</td></tr>
    <tr><td><b>Names the enemy by feel</b></td><td>Vague "other supplements"</td><td>"No more gagging on pills, sloshing chalky powders, or cleaning messy counters."</td></tr>
    <tr><td><b>Cheeky about itself</b></td><td>Self-serious</td><td>"Savings, exclusive flavors, and a minor sense of superiority."</td></tr>
    <tr><td><b>Plain words</b></td><td>Lab coat</td><td>"Sachet is a fancy word for our gummy pack."</td></tr>
  </table>

  <h2>Tone by situation</h2>
  <table>
    <tr><th>Situation</th><th>How it sounds</th></tr>
    <tr><td>Headlines</td><td>Numbers up front, no guilt, no lab-coat tone. "Tastes like a treat, works like a supplement."</td></tr>
    <tr><td>Gut and digestion</td><td>Say it plainly ("better poops"), but the claim stays "supports digestion and gut health".</td></tr>
    <tr><td>Survey numbers</td><td>Always with "of surveyed users" (brand survey of 3,000+ customers).</td></tr>
    <tr><td>Star ratings</td><td>Always name the source and the number. The sources disagree.</td></tr>
    <tr><td>Kids posts</td><td>Claims about children get extra scrutiny. Keep to the approved list; no "bright minds", no "brain health".</td></tr>
    <tr><td>Gut-sensitive buyers</td><td>Point them to Low Sugar. Sugar-Free upsets some stomachs.</td></tr>
    <tr><td>Prices and offers</td><td>Quote the offer with its condition. $29.99 applies only with the new-customer SMS discount. The guarantee is first order only. Which single discount to quote: <span class="missing">MISSING</span></td></tr>
    <tr><td>Subscriptions, cancelling</td><td>Don't promise an easy cancel beyond the site's own words.</td></tr>
    <tr><td>GLP-1 mentions</td><td>Drug-adjacent. Needs care.</td></tr>
  </table>

  <h2>Words</h2>
  <div class="grid2">
    <div class="do"><span class="lbl">Use</span>"supports" · "daily pack" / "per pack" · "of surveyed users" · "Low Sugar", "Sugar-Free" · "methylfolate" · "pectin", "vegan" · "better poops" · the flavour description, not the partner's name</div>
    <div class="dont"><span class="lbl">Avoid</span>"fix" · "works" as a broad claim · "per gummy" for daily values · "revive" · "weight loss", "muscle" · "radiant skin", "metabolism", "hormone health" · "bright minds" · "35,000+ studies" · "4.8 stars from 100,000 reviews" with no source</div>
  </div>
  <p class="reading">Use / avoid lists are drawn from the claims file. A brand-made word list: not on file.</p>
  <div class="foot"><span>Sprout · Brand guide</span><span>2026-10-18 · 5</span></div>
</section>

<!-- 6. VOICE (2 of 2): CLAIMS -->
<section class="page">
  <p class="tag">Page 6 · Voice (2 of 2)</p>
  <h1>Claims: may say, may not say</h1>
  <div class="why">The brand's own rule is <b>"supports"</b>. These claims are on the label or backed by the brand's own study (2025, 12 weeks, randomized, double-blind, placebo-controlled, 120 healthy adults aged 23 to 59), which measured two vitamins in the blood. Nothing more.</div>

  <h2>May say</h2>
  <div class="do"><span class="lbl">On the label or backed</span>
    <ul>
      <li>"60+ ingredients, 21 vitamins &amp; minerals, and 6g fiber" in 1 pack</li>
      <li>"Clinically tested for nutrient absorption", with the study named and both numbers: vitamin C +40.1%, folate +20.5%</li>
      <li>"Supports digestion and gut health"</li>
      <li>Third-party tested for 70 pesticides, 4 heavy metals, 16 contaminants, 9 microbial contaminants</li>
      <li>Vegan, pectin base; free from gluten, dairy, nuts, synthetic dyes and synthetic sweeteners</li>
      <li>Methylfolate, not folic acid</li>
      <li>"95% of users take [Sprout] at least 4-6x per week with 80% taking daily", "67% ... experienced better, more regular digestion", "52% feel more energized", always "of surveyed users"</li>
    </ul>
  </div>

  <h2>May not say (as written)</h2>
  <table>
    <tr><th>Claim</th><th>Why not</th></tr>
    <tr><td>"Fix the Hot Girl Tummy"</td><td>"Fix" sounds like treating bloating. The rule is "supports".</td></tr>
    <tr><td>"Perfect Supplement for Weight Loss Support" / "Support Muscle While You Lose Weight"</td><td>No evidence on file.</td></tr>
    <tr><td>"Nutrition for Healthy Hair"</td><td>Must stay at "supports"; no growth promises.</td></tr>
    <tr><td>"60+ potent ingredients to revive whole body vitality"</td><td>Vague, no support.</td></tr>
    <tr><td>"Clinically backed formula for energy, immunity, and daily wellness"</td><td>The study did not test energy or immunity.</td></tr>
    <tr><td>"The results are in. [Sprout] works." / "these gummies actually f*&amp;$%#g work"</td><td>Over-broad; the study shows absorption only.</td></tr>
    <tr><td>"backed by 35,000+ studies"</td><td>Studies on ingredients, not the product.</td></tr>
    <tr><td>"Each gummy delivers 100% of your daily needs"</td><td>Wrong unit: it's per pack.</td></tr>
    <tr><td>30/60/90-day "radiant skin", "better metabolism", "hormone health", "peak health"</td><td>No support; reads like a promise of results.</td></tr>
    <tr><td>"Gummies begin breaking down almost immediately ..."</td><td>No support given.</td></tr>
    <tr><td>"help fill the gaps while eating less on a GLP-1"</td><td>Drug-adjacent. Needs care.</td></tr>
    <tr><td>Kids: "build strong bodies and bright minds", "Supports brain health"</td><td>Child claims get extra scrutiny.</td></tr>
    <tr><td>"Most fiber-focused supplements contain only 5g of fiber"</td><td>No source.</td></tr>
    <tr><td>"4.8 stars from 100,000 reviews"</td><td>Widget 4.75 / 109,639; reviews page 4.74 / 118,002; public site 4.0 / 2,411. Name the source.</td></tr>
    <tr><td>"Less than 1% ... use our Money-Back Guarantee"</td><td>Brand-reported, unverified.</td></tr>
    <tr><td>"$1.26" a serving vs "$3.60" for powders</td><td>Dated. Recheck before use.</td></tr>
  </table>
  <div class="foot"><span>Sprout · Brand guide</span><span>2026-10-18 · 6</span></div>
</section>

<!-- 7. PICTURES -->
<section class="page">
  <p class="tag">Page 7 · Pictures</p>
  <h1>Pictures</h1>
  <div class="why">The whole brand rests on one idea: make a supplement people <b>want</b> to eat. Its photos look the part: "bright, sunny, candy-like ... never clinical, never muted."</div>
  <div class="grid2">
    <div>
      <h3>Style</h3><p style="margin:0">A single pouch on a soft two-colour gradient, with gummies scattered in front.</p>
      <h3>People</h3><p style="margin:0">Everyday adults in casual clothes, at home or outdoors, pouring gummies into a hand.</p>
      <h3>Light and mood</h3><p style="margin:0">Bright and sunny. Candy-like, never clinical, never muted.</p>
      <h3>The gummies</h3><p style="margin:0">Small opaque deep-green bears, soft matte, about thumbnail height. Limited flavours change shape and colour (red lemon slices, stars).</p>
    </div>
    <div>
      <div class="frame" style="height:58mm">Brand photo: pouch on a two-colour gradient, gummies in front · not on file yet</div>
      <div class="frame" style="height:58mm;margin-top:4mm">Brand photo: adult at home or outdoors pouring gummies into a hand · not on file yet</div>
    </div>
  </div>
  <h2>Do and don't</h2>
  <div class="grid2">
    <div>
      <div class="do"><span class="lbl">Do</span>Tear the daily pack straight across its top edge.</div>
      <div class="do"><span class="lbl">Do</span>Pour the gummies out of the torn top into a palm or a bowl.</div>
      <div class="do"><span class="lbl">Do</span>Show the big pouch opened only at its resealable top.</div>
      <div class="do"><span class="lbl">Do</span>Keep it bright, sunny and candy-like.</div>
    </div>
    <div>
      <div class="dont"><span class="lbl">Don't</span>Tear the daily pack at the side, the bottom or a corner.</div>
      <div class="dont"><span class="lbl">Don't</span>Show the big pouch torn.</div>
      <div class="dont"><span class="lbl">Don't</span>Show cartoon tie-in characters or any partner brand's marks. Use the flavour description only.</div>
      <div class="dont"><span class="lbl">Don't</span>Go clinical or muted.</div>
      <div class="dont"><span class="lbl">Don't · rule of this guide</span>Use generated pictures of the product or people. Only the brand's own photos.</div>
    </div>
  </div>
  <div class="foot"><span>Sprout · Brand guide</span><span>2026-10-18 · 7</span></div>
</section>

<!-- 8. PRODUCT: ADULTS ORIGINAL -->
<section class="page">
  <p class="tag">Page 8 · Product on camera (1 of 3)</p>
  <h1>Sprout Original (Adults)</h1>
  <div class="why">The main product. Flavour Original, "Fresh &amp; Sweet": strawberry and sweet greens. Comes as <b>Low Sugar</b> or <b>Sugar-Free</b>. The two pouches look alike; <b>the Sugar-Free pouch adds a white burst</b>.</div>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:3mm">
    <div class="frame">Pack front · not on file yet</div>
    <div class="frame">Out of the pack · not on file yet</div>
    <div class="frame">In a hand · not on file yet</div>
    <div class="frame">In use · not on file yet</div>
    <div class="frame">Close-up · not on file yet</div>
  </div>
  <div class="grid2" style="margin-top:3mm">
    <div>
      <h3>How it looks</h3>
      <p style="margin:0">Small opaque deep-green bears, soft matte, about thumbnail height. One pack is "a small handful", about 20 g.</p>
      <h3>The pack</h3>
      <p style="margin:0"><b>Big pouch:</b> glossy deep-green stand-up foil pouch, big yellow wordmark, a yellow bear face top right, "28 Daily Packs" at the bottom. Resealable top. Sugar-Free adds a white burst. The 84-pack size is 3 pouches.<br>
      <b>Daily pack:</b> a small flat sachet, 28 per pouch. Colour, print and finish: <span class="missing">not on file yet</span></p>
      <h3>How it's used ("Rip. Tip. Enjoy.")</h3>
      <ol style="margin:0;padding-left:5mm">
        <li>Take one daily pack out of the pouch's resealable top.</li>
        <li>Tear it straight across its top edge.</li>
        <li>Pour the gummies from the torn top into a palm or a bowl.</li>
        <li>Eat them. No water, no mixing, no shaker.</li>
      </ol>
    </div>
    <div>
      <h3>What visibly changes</h3><p style="margin:0">not on file yet</p>
      <h3>How it moves and sounds</h3><p style="margin:0">not on file yet</p>
      <h3>What never to show</h3>
      <div class="dont"><span class="lbl">Don't</span>The daily pack torn at the side, the bottom or a corner.</div>
      <div class="dont"><span class="lbl">Don't</span>The big pouch torn.</div>
      <div class="dont"><span class="lbl">Don't</span>"Per gummy" daily values on screen. It's per pack.</div>
      <h3>Tell them apart</h3>
      <p style="margin:0">Low Sugar: plain deep-green pouch. Sugar-Free: same pouch plus a white burst. Kids: a yellow pouch (next page).</p>
    </div>
  </div>
  <div class="foot"><span>Sprout · Brand guide</span><span>2026-10-18 · 8</span></div>
</section>

<!-- 9. PRODUCT: KIDS -->
<section class="page">
  <p class="tag">Page 9 · Product on camera (2 of 3)</p>
  <h1>Sprout Kids</h1>
  <div class="why">For ages 2 to 13. Flavour Strawberry Burst. Parents buy it for picky eaters; their worry is "Is this just candy?" Claims about children get extra scrutiny.</div>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:3mm">
    <div class="frame">Pack front · not on file yet</div>
    <div class="frame">Out of the pack · not on file yet</div>
    <div class="frame">In a hand · not on file yet</div>
    <div class="frame">In use · not on file yet</div>
    <div class="frame">Close-up · not on file yet</div>
  </div>
  <div class="grid2" style="margin-top:3mm">
    <div>
      <h3>How it looks</h3>
      <p style="margin:0">One pack is 15 g, 6 gummies. Gummy colour and shape: <span class="missing">not on file yet</span></p>
      <h3>The pack</h3>
      <p style="margin:0"><b>Big pouch:</b> sunflower yellow, green wordmark, pink "KIDS", "For ages 2 to 13". Resealable top. Pouch shape and finish not stated; the adult pouch is a glossy stand-up foil pouch. The 84-pack size exists (packing not stated).<br>
      <b>Daily pack:</b> colour, print and finish <span class="missing">not on file yet</span></p>
      <h3>How it's used</h3>
      <ol style="margin:0;padding-left:5mm">
        <li>Take one daily pack out of the pouch's resealable top.</li>
        <li>Tear it straight across its top edge.</li>
        <li>Pour the 6 gummies into a palm or a bowl.</li>
        <li>Eat them.</li>
      </ol>
    </div>
    <div>
      <h3>What visibly changes</h3><p style="margin:0">not on file yet</p>
      <h3>How it moves and sounds</h3><p style="margin:0">not on file yet</p>
      <h3>What never to show or say</h3>
      <div class="dont"><span class="lbl">Don't</span>The daily pack torn anywhere but straight across the top; the big pouch torn.</div>
      <div class="dont"><span class="lbl">Don't</span>"build strong bodies and bright minds", "Supports brain health".</div>
      <h3>Tell them apart</h3>
      <p style="margin:0">Kids is the <b>yellow</b> pouch with a green wordmark and pink "KIDS". Adults is the <b>deep-green</b> pouch with a yellow wordmark.</p>
    </div>
  </div>
  <div class="foot"><span>Sprout · Brand guide</span><span>2026-10-18 · 9</span></div>
</section>

<!-- 10. PRODUCT: LIMITED FLAVOURS -->
<section class="page">
  <p class="tag">Page 10 · Product on camera (3 of 3)</p>
  <h1>Limited flavours (Adults and Kids)</h1>
  <div class="why">A new flavour every 4 to 8 weeks gives a fresh reason to buy. Subscribers get it for 1 month, then switch back to Original automatically. Several are tie-ins: <b>describe the flavour, never show the partner</b>.</div>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:3mm">
    <div class="frame">Pack front · not on file yet</div>
    <div class="frame">Out of the pack · not on file yet</div>
    <div class="frame">In a hand · not on file yet</div>
    <div class="frame">In use · not on file yet</div>
    <div class="frame">Close-up · not on file yet</div>
  </div>
  <div class="grid2" style="margin-top:3mm">
    <div>
      <h3>How they look</h3>
      <table>
        <tr><th>Flavour, as you may describe it</th><th>Gummy</th></tr>
        <tr><td>Raspberry Lemonade</td><td>Lemon-slice shaped, raspberry red</td></tr>
        <tr><td>Cherry, lemon lime, blue raspberry</td><td>Star-shaped</td></tr>
        <tr><td>Raspberry and blueberry</td><td>not on file yet</td></tr>
        <tr><td>Banana berry</td><td>not on file yet</td></tr>
        <tr><td>Strawberry vanilla</td><td>not on file yet</td></tr>
      </table>
      <h3>The pack</h3>
      <p style="margin:0">Limited-flavour pouch look: <span class="missing">not on file yet</span></p>
      <h3>How it's used</h3>
      <p style="margin:0">As Original: tear the daily pack straight across its top, pour into a palm or bowl, eat.</p>
    </div>
    <div>
      <h3>What visibly changes</h3><p style="margin:0">The gummy's shape and colour versus Original. Anything else: not on file yet.</p>
      <h3>How it moves and sounds</h3><p style="margin:0">not on file yet</p>
      <h3>What never to show</h3>
      <div class="dont"><span class="lbl">Don't</span>Cartoon tie-in characters or any partner brand's marks or names. Use the flavour description only.</div>
      <div class="dont"><span class="lbl">Don't</span>The daily pack torn anywhere but straight across the top; the big pouch torn.</div>
      <h3>Tell them apart</h3>
      <p style="margin:0">Original bears are deep green. Limited gummies change shape and colour (red lemon slices, stars).</p>
    </div>
  </div>
  <div class="foot"><span>Sprout · Brand guide</span><span>2026-10-18 · 10</span></div>
</section>

<!-- 11. WORLD AND MOTION -->
<section class="page">
  <p class="tag">Page 11 · World and motion</p>
  <h1>World and motion</h1>
  <div class="why">Sprout's world is the everyday: "Everyday adults in casual clothes, at home or outdoors." Sunny, candy-bright, and far from the "old way" it replaces: a half-used tub of powder and a shaker, a shelf of separate pill bottles.</div>
  <div class="grid2">
    <div>
      <h2>World</h2>
      <table>
        <tr><td><b>Places</b></td><td>At home or outdoors. In the studio: a soft two-colour gradient.</td></tr>
        <tr><td><b>Surfaces</b></td><td>not on file yet</td></tr>
        <tr><td><b>Light</b></td><td>Bright, sunny</td></tr>
        <tr><td><b>People</b></td><td>Everyday adults in casual clothes, pouring gummies into a hand</td></tr>
        <tr><td><b>Never in frame</b></td><td style="color:var(--plum)">Anything clinical or muted; tie-in characters; partner brands' marks; a torn big pouch</td></tr>
      </table>
      <div class="grid2" style="margin-top:4mm;gap:3mm">
        <div class="frame" style="height:42mm">Brand photo: at home · not on file yet</div>
        <div class="frame" style="height:42mm">Brand photo: outdoors · not on file yet</div>
      </div>
    </div>
    <div>
      <h2>Motion and sound</h2>
      <table>
        <tr><td><b>Pace</b></td><td>not on file yet</td></tr>
        <tr><td><b>Camera</b></td><td>not on file yet</td></tr>
        <tr><td><b>Sound</b></td><td>not on file yet</td></tr>
        <tr><td><b>Words on screen</b></td><td>not on file yet. Copy on screen follows the voice pages: short lines, numbers up front, "supports", not "fix".</td></tr>
      </table>
    </div>
  </div>
  <div class="foot"><span>Sprout · Brand guide</span><span>2026-10-18 · 11</span></div>
</section>

</body>
</html>
```

# brand-tokens.md

````markdown
# Sprout: brand tokens

From the Sprout brand file, last updated 2026-10-18. Values are the brand's own unless marked "guide's reading".

## Colours

| Name | Hex | Job |
|---|---|---|
| Forest green | #00582D | MISSING: job not on file |
| Deep forest green | #002C17 | Headings, dark sections |
| Warm cream | #FFF7DF | Hero background |
| Kelly green | #007E40 | Buttons |
| Sunflower yellow | #FFCC2E | Stars, badges |
| Plum purple | #581E5A | Top banner |

## Contrast pairs (text on background, either way round)

Normal text needs at least 4.5:1. Large text (24 px, or 19 px bold) needs at least 3:1.

| Pair | Ratio | Use |
|---|---|---|
| Deep forest / cream | 14.3:1 | Any size |
| Plum / cream | 11.2:1 | Any size |
| Yellow / deep forest | 10.2:1 | Any size |
| Forest / cream | 8.1:1 | Any size |
| Yellow / plum | 8.0:1 | Any size |
| Yellow / forest | 5.7:1 | Any size |
| Kelly / cream | 4.8:1 | Any size (cream text on kelly buttons) |
| Yellow / kelly | 3.4:1 | Large text only |
| Yellow / cream | 1.4:1 | Never for text |
| Kelly / deep forest | 2.96:1 | Never for text |
| Kelly / plum | 2.3:1 | Never for text |
| Kelly / forest | 1.7:1 | Never for text |
| Forest / deep forest | 1.8:1 | Never for text |
| Forest / plum | 1.4:1 | Never for text |
| Plum / deep forest | 1.3:1 | Never for text |

## CSS variables

```css
:root {
  --sprout-forest: #00582D;  /* job MISSING */
  --sprout-deep:   #002C17;  /* headings, dark sections */
  --sprout-cream:  #FFF7DF;  /* hero background */
  --sprout-kelly:  #007E40;  /* buttons */
  --sprout-sun:    #FFCC2E;  /* stars, badges */
  --sprout-plum:   #581E5A;  /* top banner */

  --font-heading: 'Work Sans', sans-serif; /* weight 700 */
  --font-body:    'Work Sans', sans-serif; /* weight 500 */
  --font-tag:     'DM Mono', monospace;    /* small uppercase tags */
  /* --font-display: MISSING (chunky friendly display font, name not on file) */

  /* Size scale for a 1080 px-wide social post: guide's reading, not on file */
  --size-display: 96px;
  --size-h1: 64px;
  --size-h2: 44px;
  --size-body: 30px;
  --size-small: 24px;
  --size-tag: 20px;
}
```

## Font import

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Work+Sans:wght@500;700;800&display=swap" rel="stylesheet">
```

Display font: MISSING. Until it's named, the guide uses Work Sans 800 as a stand-in.

## Size scale (guide's reading, not on file)

| Role | Font | Size | Line height |
|---|---|---|---|
| Display statement | Display font (MISSING) | 96 px | 1.0 |
| Heading 1 | Work Sans Bold | 64 px | 1.05 |
| Heading 2 | Work Sans Bold | 44 px | 1.1 |
| Body | Work Sans Medium | 30 px | 1.35 |
| Small print | Work Sans Medium | 24 px | 1.35 |
| Tag | DM Mono, uppercase | 20 px | 1.2 |

## Voice rule

Playful, cheeky, casual: a funny friend into wellness who refuses to be preachy. Use short lines, three-beat rhythms ("Rip. Tip. Enjoy."), numbers up front, and say the gross thing plainly ("better poops"). Name the enemy by feel: chalky powders, pills you gag on. No guilt and no lab-coat tone in headlines. Health claims stay at "supports", never "fix". Survey numbers always carry "of surveyed users". Ratings always name their source. Daily values are per pack, not per gummy. Never name tie-in partners; use the flavour description.

## Picture rule

Bright, sunny, candy-like: a single pouch on a soft two-colour gradient with gummies scattered in front, or everyday adults in casual clothes at home or outdoors pouring gummies into a hand. Never clinical, never muted. The daily pack is torn straight across its top edge, never the side, bottom or a corner. Gummies pour out of the torn top into a palm or bowl. The big pouch opens only at its resealable top and is never shown torn. No cartoon tie-in characters and no partner brands' marks. Use the brand's own photos only, never generated ones.

## Design tokens (W3C format)

```json
{
  "color": {
    "forest": { "$type": "color", "$value": "#00582D", "$description": "Forest green. Job MISSING." },
    "deep":   { "$type": "color", "$value": "#002C17", "$description": "Deep forest green. Headings, dark sections." },
    "cream":  { "$type": "color", "$value": "#FFF7DF", "$description": "Warm cream. Hero background." },
    "kelly":  { "$type": "color", "$value": "#007E40", "$description": "Kelly green. Buttons." },
    "sun":    { "$type": "color", "$value": "#FFCC2E", "$description": "Sunflower yellow. Stars, badges." },
    "plum":   { "$type": "color", "$value": "#581E5A", "$description": "Plum purple. Top banner." }
  },
  "font": {
    "heading": { "$type": "fontFamily", "$value": ["Work Sans", "sans-serif"], "$description": "Headings, bold." },
    "body":    { "$type": "fontFamily", "$value": ["Work Sans", "sans-serif"], "$description": "Body, medium." },
    "tag":     { "$type": "fontFamily", "$value": ["DM Mono", "monospace"], "$description": "Small uppercase tags." }
  },
  "fontWeight": {
    "heading": { "$type": "fontWeight", "$value": 700 },
    "body":    { "$type": "fontWeight", "$value": 500 }
  },
  "size": {
    "$description": "Guide's reading for a 1080 px-wide social post, not on file.",
    "display": { "$type": "dimension", "$value": "96px" },
    "h1":      { "$type": "dimension", "$value": "64px" },
    "h2":      { "$type": "dimension", "$value": "44px" },
    "body":    { "$type": "dimension", "$value": "30px" },
    "small":   { "$type": "dimension", "$value": "24px" },
    "tag":     { "$type": "dimension", "$value": "20px" }
  }
}
```
````

**Note**

- **Pages left out:** Logo (no clear space, smallest size or misuse rules on file) and Web parts (no site styles, and this guide is for social posts). Voice runs over two pages so the claims fit, and the add-on adds three product pages and a world page, for 11 pages in all.
- **Pairs that fail for text:** yellow on cream (1.4:1), and kelly, forest, deep forest and plum on each other (all under 3:1). Yellow on kelly is large text only (3.4:1).
- **To print:** save both files next to the brand file, open the HTML in Chrome and print to PDF on A4 with margins set to none.

**CHECKS MISSED**

- Fonts are not all the brand's own: the display font is unnamed, so Work Sans 800 stands in, marked MISSING.
- The forest green #00582D swatch has no job on file, so it shows MISSING instead of a job.
- Each product page shows the pack shape and pouch finish, but the daily sachet's colour, print and finish and the limited-flavour pouch look are not on file. Someone could not yet draw those correctly.
- One topic per page has not been confirmed in a real print preview. The pages are sized to fit A4, but that should be checked in Chrome before sending.
```
