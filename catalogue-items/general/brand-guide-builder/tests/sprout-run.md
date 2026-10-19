# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

The HTML guide is strong: brand colours and fonts, correctly computed contrast ratios, real voice lines, careful claims page, and every gap flagged as 'not on file yet'. But the run hit its token limit mid-way through brand-tokens.md, so the fonts, voice and picture rules, the W3C JSON block and the two-line hand-back NOTE are missing, leaving the second deliverable unusable as-is.

## Fix

Reorder steps 4 to 6 so brand-tokens.md and the two-line NOTE are written before brand-guide.html, and add to step 4 a size budget (shared CSS classes, no repeated inline styles) so the HTML cannot crowd out the smaller files.

## Judge list

- Met: The guide uses your colours and fonts, not a generic grey and blue.
  ":root{ --forest:#00582D; --deep:#002C17; --cream:#FFF7DF; --kelly:#007E40; --sun:#FFCC2E; --plum:#581E5A; --head:'Work Sans' ... --mono:'DM Mono'"
- Met: Page 2 alone is enough to make one on-brand post.
  Quick sheet has six chips with hex and job, 14 allowed pairs, fonts, "Playful. Cheeky. Casual. Plain. Never preachy.", copy rule, picture rule, products, world line.
- Met: Every text colour shown on a background passes its contrast level, and failing pairs are named.
  Ratios recomputed (cream/deep 14.29, cream/kelly 4.84, sun/kelly 3.43, sun/cream 1.41) are correct; "Never for text: sunflower with cream · kelly with deep forest..."
- Met: Voice examples are real lines from your copy, not invented ones.
  "We made daily nutrition, like, ridiculously easy." "Rip. Tip. Enjoy." "Savings, exclusive flavors, and a minor sense of superiority." all in brand.md.
- Met: It prints one topic per page with nothing cut off.
  "@page{size:A4;margin:0}" and ".page{...height:297mm...break-after:page}" per section; overflow:hidden could clip silently but layout is plausibly within A4. Not verifiable by rendering.
- Met: Every blank in your brand file appears under "Not yet captured".
  13 gaps listed: logo, forest green job, display font, size scale, pink/white-burst hex, gradient, photos, motion and sound, kids/limited looks, offer, sugar, disclaimer, electrolyte pack.

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
**sprout/brand-guide.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Sprout · Brand guide · October 2026</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@500;700;800&family=DM+Mono:wght@500&display=swap" rel="stylesheet">
<style>
:root{
  --forest:#00582D; --deep:#002C17; --cream:#FFF7DF;
  --kelly:#007E40; --sun:#FFCC2E; --plum:#581E5A;
  --head:'Work Sans',sans-serif; --mono:'DM Mono',monospace;
}
@page{size:A4;margin:0}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
html,body{margin:0;padding:0}
body{background:var(--deep);font-family:var(--head);font-weight:500;color:var(--deep);font-size:8.6pt;line-height:1.38}
.screen-note{max-width:210mm;margin:6mm auto;padding:3mm 5mm;background:var(--sun);color:var(--deep);font-family:var(--mono);font-size:8pt;text-transform:uppercase;letter-spacing:.05em}
.page{width:210mm;height:297mm;margin:0 auto 8mm;padding:15mm 15mm 19mm;position:relative;overflow:hidden;background:var(--cream);break-after:page;page-break-after:always}
.page:last-of-type{break-after:auto;page-break-after:auto}
@media print{body{background:none}.page{margin:0}.screen-note{display:none}}
h1{font-weight:700;font-size:22pt;line-height:1.08;margin:1mm 0 4mm;color:var(--deep);letter-spacing:-.01em}
h2{font-weight:700;font-size:11pt;margin:0 0 1.6mm;color:var(--deep)}
h3{font-weight:700;font-size:9pt;margin:0 0 1mm;color:var(--forest)}
p{margin:0 0 2mm}
ul,ol{margin:0 0 2mm;padding-left:4.5mm}
li{margin-bottom:.7mm}
.tag{font-family:var(--mono);font-weight:500;font-size:6.8pt;text-transform:uppercase;letter-spacing:.09em;color:var(--forest)}
.reason{font-size:10pt;line-height:1.42;border-left:1.2mm solid var(--kelly);padding:1mm 0 1mm 4mm;margin:0 0 5mm;max-width:165mm}
.foot{position:absolute;left:15mm;right:15mm;bottom:8mm;border-top:.3mm solid var(--forest);padding-top:2mm;display:flex;justify-content:space-between;font-family:var(--mono);font-size:6.6pt;text-transform:uppercase;letter-spacing:.08em;color:var(--forest)}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:6mm}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:3mm}
.box{border:.3mm solid var(--forest);border-radius:2mm;padding:3mm 3.5mm}
.notyet{font-family:var(--mono);font-size:7pt;text-transform:uppercase;letter-spacing:.06em;color:var(--plum)}
.do,.dont{display:inline-block;font-family:var(--mono);font-size:6.6pt;text-transform:uppercase;letter-spacing:.08em;padding:.6mm 1.8mm;border-radius:1mm;color:var(--cream);margin-right:1.5mm}
.do{background:var(--kelly)} .dont{background:var(--plum)}
.dontbox{border:.5mm solid var(--plum);border-radius:2mm;padding:3mm 3.5mm}
.dontbox h2{color:var(--plum)}
.dontbox li{color:var(--deep)}
/* chips */
.chips{display:grid;grid-template-columns:repeat(6,1fr);gap:2mm;margin-bottom:4mm}
.chip{border-radius:2mm;padding:2.5mm;height:24mm;display:flex;flex-direction:column;justify-content:space-between;border:.3mm solid var(--forest)}
.chip b{font-size:8pt;line-height:1.1}
.chip span{font-family:var(--mono);font-size:6.4pt;text-transform:uppercase;letter-spacing:.05em;line-height:1.25}
.bg-forest{background:var(--forest);color:var(--cream)}
.bg-deep{background:var(--deep);color:var(--cream)}
.bg-cream{background:var(--cream);color:var(--deep)}
.bg-kelly{background:var(--kelly);color:var(--cream)}
.bg-sun{background:var(--sun);color:var(--deep)}
.bg-plum{background:var(--plum);color:var(--cream)}
/* pair samples */
.pairs{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5mm;margin-bottom:2mm}
.pair{border-radius:1.5mm;padding:1.4mm 2mm;font-size:7pt;line-height:1.2;border:.3mm solid var(--forest)}
.pair b{font-size:9.5pt;margin-right:1mm}
.mini{display:inline-block;width:3mm;height:3mm;border-radius:.6mm;vertical-align:-.4mm;border:.2mm solid var(--deep)}
/* swatches */
.sw{border-radius:2.5mm;height:44mm;padding:4mm;display:flex;flex-direction:column;justify-content:space-between;border:.3mm solid var(--forest)}
.sw .n{font-weight:700;font-size:12pt;line-height:1.1}
.sw .h{font-family:var(--mono);font-size:9pt}
.sw .j{font-size:8pt;line-height:1.3}
/* matrix */
table{border-collapse:collapse;width:100%}
.mx th,.mx td{border:.3mm solid var(--forest);text-align:center;padding:1.3mm 1mm;font-size:7pt;vertical-align:middle}
.mx th{font-family:var(--mono);font-weight:500;font-size:6.2pt;text-transform:uppercase;letter-spacing:.04em;color:var(--deep);background:var(--cream)}
.mx td b{display:block;font-size:10pt;line-height:1.1}
.mx td.lg b{font-size:15pt;font-weight:700}
.mx td.no{background:var(--cream);color:var(--plum);font-family:var(--mono);font-size:6.4pt;text-transform:uppercase}
.mx td.x{background:var(--cream);color:var(--forest)}
.lt th,.lt td{border-bottom:.3mm solid var(--forest);text-align:left;padding:1.4mm 1.5mm;vertical-align:top;font-size:7.6pt}
.lt th{font-family:var(--mono);font-weight:500;font-size:6.4pt;text-transform:uppercase;letter-spacing:.06em;color:var(--forest)}
/* frames */
.strip{display:grid;grid-template-columns:repeat(5,1fr);gap:2mm;margin-bottom:5mm}
.frame{height:34mm;border:.5mm dashed var(--forest);border-radius:2mm;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:2mm;font-family:var(--mono);font-size:6.6pt;text-transform:uppercase;letter-spacing:.05em;color:var(--deep)}
.frame em{font-style:normal;color:var(--plum);margin-top:1.5mm;font-size:6pt}
.stack div{padding:2.6mm 4mm;font-size:8pt}
.quote{font-weight:700;color:var(--deep)}
.small{font-size:7.4pt}
</style>
</head>
<body>

<div class="screen-note">To print: File › Print › Save as PDF · Paper A4 · Margins: none · Background graphics: on</div>

<!-- 1 COVER -->
<section class="page bg-deep" style="display:flex;flex-direction:column;justify-content:space-between;padding:22mm 20mm">
  <div>
    <div class="tag" style="color:var(--sun)">For designers making social posts</div>
  </div>
  <div>
    <div style="font-weight:800;font-size:76pt;line-height:.95;color:var(--cream);letter-spacing:-.02em">Sprout</div>
    <div style="font-weight:700;font-size:28pt;color:var(--sun);margin-top:3mm">Brand guide</div>
    <p style="font-size:13pt;line-height:1.4;color:var(--cream);max-width:140mm;margin-top:8mm">Daily greens gummies in single-serve packs. Tear one open and eat the small handful of green gummy bears inside. No water, no mixing, no shaker.</p>
  </div>
  <div style="font-family:var(--mono);font-size:8pt;text-transform:uppercase;letter-spacing:.08em;color:var(--cream)">October 2026 · from the brand file last updated 2026-10-18</div>
</section>

<!-- 2 QUICK SHEET -->
<section class="page">
  <div class="tag">02 · Quick sheet</div>
  <h1>Read this page and you can make a Sprout post.</h1>

  <div class="chips">
    <div class="chip bg-forest"><b>Forest green</b><span>#00582D<br>Brand green · job not on file</span></div>
    <div class="chip bg-deep"><b>Deep forest</b><span>#002C17<br>Headings, dark sections</span></div>
    <div class="chip bg-cream"><b>Warm cream</b><span>#FFF7DF<br>Hero background</span></div>
    <div class="chip bg-kelly"><b>Kelly green</b><span>#007E40<br>Buttons</span></div>
    <div class="chip bg-sun"><b>Sunflower</b><span>#FFCC2E<br>Stars, badges</span></div>
    <div class="chip bg-plum"><b>Plum</b><span>#581E5A<br>Top banner</span></div>
  </div>

  <div class="g2">
    <div>
      <h2>Text on background: allowed</h2>
      <div class="pairs">
        <div class="pair bg-cream"><b>Aa</b>Deep forest 14.3</div>
        <div class="pair bg-cream" style="color:var(--plum)"><b>Aa</b>Plum 11.2</div>
        <div class="pair bg-cream" style="color:var(--forest)"><b>Aa</b>Forest 8.1</div>
        <div class="pair bg-cream" style="color:var(--kelly)"><b>Aa</b>Kelly 4.8</div>
        <div class="pair bg-sun"><b>Aa</b>Deep forest 10.1</div>
        <div class="pair bg-sun" style="color:var(--plum)"><b>Aa</b>Plum 8.0</div>
        <div class="pair bg-sun" style="color:var(--forest)"><b>Aa</b>Forest 5.7</div>
        <div class="pair bg-deep"><b>Aa</b>Cream 14.3</div>
        <div class="pair bg-deep" style="color:var(--sun)"><b>Aa</b>Sunflower 10.1</div>
        <div class="pair bg-plum"><b>Aa</b>Cream 11.2</div>
        <div class="pair bg-plum" style="color:var(--sun)"><b>Aa</b>Sunflower 8.0</div>
        <div class="pair bg-forest"><b>Aa</b>Cream 8.1</div>
        <div class="pair bg-forest" style="color:var(--sun)"><b>Aa</b>Sunflower 5.7</div>
        <div class="pair bg-kelly"><b>Aa</b>Cream 4.8</div>
      </div>
      <p class="small"><b>Large text only (24 px+, or 19 px+ bold):</b> kelly on sunflower, sunflower on kelly (3.4).<br>
      <b style="color:var(--plum)">Never for text:</b> sunflower with cream · kelly with deep forest · forest with deep forest · kelly with forest · plum with any green.</p>

      <h2 style="margin-top:3mm">Fonts</h2>
      <p class="small"><b>Work Sans Bold:</b> headings, it speaks.<br>
      <b>Work Sans Medium:</b> body, it explains.<br>
      <span style="font-family:var(--mono)">DM MONO:</span> small uppercase tags.<br>
      <b>Chunky display font:</b> big statement lines. <span class="notyet">Name not on file</span></p>

      <h2 style="margin-top:3mm">Voice in five words</h2>
      <p style="font-weight:700;font-size:11pt">Playful. Cheeky. Casual. Plain. Never preachy.</p>

      <div class="box" style="margin-bottom:2mm"><h3>One copy rule</h3>Health claims stay at "supports". Never "fix", never a promised result. Numbers go up front.</div>
      <div class="box"><h3>One picture rule</h3>The daily pack tears straight across its top edge, and the gummies pour from that top into a palm or bowl. Never the side, bottom or a corner.</div>
    </div>

    <div>
      <h2>The products</h2>
      <p class="small"><b>Adults Original:</b> glossy deep green foil stand-up pouch, big yellow wordmark, yellow bear face top right, small matte deep-green bears.<br><span class="dont">Never</span>the big pouch torn. It opens only at its resealable top.</p>
      <p class="small"><b>Kids:</b> sunflower yellow pouch, green wordmark, pink "KIDS", "For ages 2 to 13".<br><span class="dont">Never</span>"bright minds" or brain claims.</p>
      <p class="small"><b>Limited flavours:</b> the gummies change shape and colour (red lemon slices, stars).<br><span class="dont">Never</span>tie-in characters or partner marks. Name the flavour only.</p>

      <h2 style="margin-top:3mm">The world in one line</h2>
      <p class="small">Bright, sunny, candy-like: everyday adults in casual clothes at home or outdoors, or one pouch on a soft two-colour gradient. Never clinical, never muted.</p>

      <h2 style="margin-top:3mm">Not yet captured</h2>
      <ol class="small" style="padding-left:4mm">
        <li><b>Logo:</b> Where are the logo files, and what are the clear space, smallest size and misuse rules?</li>
        <li><b>Forest green #00582D:</b> What is its job?</li>
        <li><b>Display font:</b> Which chunky display font sets the big statement lines?</li>
        <li><b>Size scale:</b> What type sizes does the brand use on social frames? (A working scale is on page 4.)</li>
        <li><b>Extra colours:</b> What are the hex values of the pink "KIDS" and the Sugar-Free white burst, and are they palette colours?</li>
        <li><b>Gradient:</b> Which two colours make the pack-shot gradient?</li>
        <li><b>Photos:</b> Where are the brand's own photos for each shot: pack front, out of the pack, in a hand, in use, close-up?</li>
        <li><b>Motion and sound:</b> What pace, camera, sound and on-screen words do videos use?</li>
        <li><b>Kids and limited looks:</b> What do the Kids gummies look like, and what do limited-flavour pouches look like?</li>
        <li><b>Offer:</b> Which discount is the real current one? Seven different figures are live at once.</li>
        <li><b>Sugar:</b> How many grams of sugar are in each pack?</li>
        <li><b>Disclaimer:</b> Should social ads carry the FDA line from the site footer?</li>
        <li><b>Electrolyte pack:</b> What is in it, and how does it look?</li>
      </ol>
    </div>
  </div>
  <div class="foot"><span>Sprout · Brand guide · October 2026</span><span>02 / 11</span></div>
</section>

<!-- 3 COLOUR -->
<section class="page">
  <div class="tag">03 · Colour</div>
  <h1>Greens you'd want to eat.</h1>
  <p class="reason">Sprout is a greens supplement that refuses to look like medicine. The deep greens come from the pouch and the gummies themselves. Warm cream and sunflower yellow make it sunny and candy-like. Kelly green is for buttons and plum for the top banner. The aim is "a treat", never clinical, never muted.</p>

  <div class="g3" style="margin-bottom:5mm">
    <div class="sw bg-forest"><div class="n">Forest green</div><div><div class="h">#00582D</div><div class="j">Brand green. Its job is not on file yet.</div></div></div>
    <div class="sw bg-deep"><div class="n">Deep forest green</div><div><div class="h">#002C17</div><div class="j">Headings and dark sections.</div></div></div>
    <div class="sw bg-cream"><div class="n">Warm cream</div><div><div class="h">#FFF7DF</div><div class="j">Hero background. The light base.</div></div></div>
    <div class="sw bg-kelly"><div class="n">Kelly green</div><div><div class="h">#007E40</div><div class="j">Buttons and calls to act.</div></div></div>
    <div class="sw bg-sun"><div class="n">Sunflower yellow</div><div><div class="h">#FFCC2E</div><div class="j">Stars and badges. Also the yellow wordmark and the Kids pouch.</div></div></div>
    <div class="sw bg-plum"><div class="n">Plum purple</div><div><div class="h">#581E5A</div><div class="j">Top banner.</div></div></div>
  </div>

  <div class="g2" style="grid-template-columns:1.55fr 1fr">
    <div>
      <h2>Contrast: text colour (row) on background (column)</h2>
      <table class="mx">
        <tr><th></th><th>Cream</th><th>Sunflower</th><th>Kelly</th><th>Forest</th><th>Plum</th><th>Deep</th></tr>
        <tr><th>Deep</th>
          <td class="bg-cream"><b>Aa</b>14.29</td><td class="bg-sun"><b>Aa</b>10.15</td><td class="no">never<br>2.96</td><td class="no">never<br>1.77</td><td class="no">never<br>1.27</td><td class="x">–</td></tr>
        <tr><th>Plum</th>
          <td class="bg-cream" style="color:var(--plum)"><b>Aa</b>11.22</td><td class="bg-sun" style="color:var(--plum)"><b>Aa</b>7.97</td><td class="no">never<br>2.32</td><td class="no">never<br>1.39</td><td class="x">–</td><td class="no">never<br>1.27</td></tr>
        <tr><th>Forest</th>
          <td class="bg-cream" style="color:var(--forest)"><b>Aa</b>8.06</td><td class="bg-sun" style="color:var(--forest)"><b>Aa</b>5.72</td><td class="no">never<br>1.67</td><td class="x">–</td><td class="no">never<br>1.39</td><td class="no">never<br>1.77</td></tr>
        <tr><th>Kelly</th>
          <td class="bg-cream" style="color:var(--kelly)"><b>Aa</b>4.84</td><td class="bg-sun lg" style="color:var(--kelly)"><b>Aa</b>3.43 large</td><td class="x">–</td><td class="no">never<br>1.67</td><td class="no">never<br>2.32</td><td class="no">never<br>2.96</td></tr>
        <tr><th>Sunflower</th>
          <td class="no">never<br>1.41</td><td class="x">–</td><td class="bg-kelly lg" style="color:var(--sun)"><b>Aa</b>3.43 large</td><td class="bg-forest" style="color:var(--sun)"><b>Aa</b>5.72</td><td class="bg-plum" style="color:var(--sun)"><b>Aa</b>7.97</td><td class="bg-deep" style="color:var(--sun)"><b>Aa</b>10.15</td></tr>
        <tr><th>Cream</th>
          <td class="x">–</td><td class="no">never<br>1.41</td><td class="bg-kelly"><b>Aa</b>4.84</td><td class="bg-forest"><b>Aa</b>8.06</td><td class="bg-plum"><b>Aa</b>11.22</td><td class="bg-deep"><b>Aa</b>14.29</td></tr>
      </table>
      <p class="small" style="margin-top:2mm">Normal text needs 4.5:1 and large text (24 px, or 19 px bold) needs 3:1. Pairs marked "large" are for headlines only. Kelly on deep forest (2.96) misses even the large level.</p>
    </div>
    <div>
      <h2>How backgrounds follow down a page</h2>
      <div class="stack" style="border:.3mm solid var(--forest);border-radius:2mm;overflow:hidden;margin-bottom:2mm">
        <div class="bg-plum">Plum: top banner strip</div>
        <div class="bg-cream" style="padding-top:6mm;padding-bottom:6mm"><b>Cream: hero</b> with deep-forest heading and a kelly button</div>
        <div class="bg-deep" style="padding-top:5mm;padding-bottom:5mm">Deep forest: dark section, cream or sunflower text</div>
        <div class="bg-cream">Cream again</div>
      </div>
      <p class="small">Plum and the three greens nearly merge (1.3 to 2.3:1), so keep cream between two dark bands. Sunflower sits as a badge or stars on top of a band. It is never a band under cream text.</p>
    </div>
  </div>
  <div class="foot"><span>Sprout · Brand guide · October 2026</span><span>03 / 11</span></div>
</section>

<!-- 4 TYPE -->
<section class="page">
  <div class="tag">04 · Type</div>
  <h1>Bold to speak, medium to explain.</h1>
  <p class="reason">Work Sans Bold speaks: it carries the headlines in the short, punchy voice. Work Sans Medium explains the facts in the body. DM Mono labels the small uppercase tags. A chunky, friendly display font shouts the big statement lines, but its name is not on file yet.</p>

  <div class="box" style="margin-bottom:3mm">
    <div class="tag">Work Sans Bold · headings</div>
    <div style="font-weight:700;font-size:26pt;line-height:1.08;margin-top:1mm">We made daily nutrition, like, ridiculously easy.</div>
  </div>
  <div class="box" style="margin-bottom:3mm">
    <div class="tag">Work Sans Medium · body</div>
    <div style="font-weight:500;font-size:12pt;line-height:1.4;margin-top:1mm">No more gagging on pills, sloshing chalky powders, or cleaning messy counters.</div>
  </div>
  <div class="g2" style="margin-bottom:4mm">
    <div class="box">
      <div class="tag">DM Mono · small uppercase tags</div>
      <div style="font-family:var(--mono);font-size:10pt;text-transform:uppercase;letter-spacing:.08em;margin-top:2mm;color:var(--forest)">60+ ingredients · 21 vitamins &amp; minerals · 6g fiber</div>
    </div>
    <div class="box" style="border-style:dashed">
      <div class="tag">Display font · big statement lines</div>
      <div class="notyet" style="margin-top:2mm">Not on file yet. Don't substitute another font. Set statement lines in Work Sans Bold until the brand names it.</div>
    </div>
  </div>

  <div class="g2" style="grid-template-columns:1fr 1.25fr">
    <div>
      <h2>Size scale <span class="notyet">working scale, not from the brand file</span></h2>
      <table class="lt">
        <tr><th>Role</th><th>Font</th><th>1080 px frame</th></tr>
        <tr><td>Statement</td><td>Display (TBC) / WS Bold</td><td>120 px</td></tr>
        <tr><td>Headline</td><td>Work Sans Bold</td><td>80 px</td></tr>
        <tr><td>Subhead</td><td>Work Sans Bold</td><td>56 px</td></tr>
        <tr><td>Body</td><td>Work Sans Medium</td><td>36 px</td></tr>
        <tr><td>Tag</td><td>DM Mono, uppercase</td><td>26 px</td></tr>
      </table>
      <p class="small" style="margin-top:2mm">Confirm with the brand. Treat everything under 24 px as normal text when checking contrast.</p>
    </div>
    <div class="g2" style="gap:3mm">
      <div class="bg-cream" style="border:.3mm solid var(--forest);border-radius:2mm;padding:4mm">
        <div class="tag">On light</div>
        <div style="font-weight:700;font-size:17pt;line-height:1.05;margin:2mm 0">Rip. Tip. Enjoy.</div>
        <p class="small">Tastes like a treat, works like a supplement.</p>
        <div style="font-family:var(--mono);font-size:7pt;text-transform:uppercase;letter-spacing:.08em;color:var(--kelly)">Sachet is a fancy word for our gummy pack.</div>
      </div>
      <div class="bg-deep" style="border-radius:2mm;padding:4mm">
        <div class="tag" style="color:var(--sun)">On dark</div>
        <div style="font-weight:700;font-size:17pt;line-height:1.05;margin:2mm 0;color:var(--cream)">Rip. Tip. Enjoy.</div>
        <p class="small" style="color:var(--cream)">Tastes like a treat, works like a supplement.</p>
        <div style="font-family:var(--mono);font-size:7pt;text-transform:uppercase;letter-spacing:.08em;color:var(--sun)">Sachet is a fancy word for our gummy pack.</div>
      </div>
    </div>
  </div>
  <div class="foot"><span>Sprout · Brand guide · October 2026</span><span>04 / 11</span></div>
</section>

<!-- 5 VOICE -->
<section class="page">
  <div class="tag">05 · Voice</div>
  <h1>A funny friend who's into wellness.</h1>
  <p class="reason">People quit supplements because they're unpleasant, so Sprout sounds like the opposite: a funny friend who is into wellness but refuses to be preachy. Short lines and three-beat rhythms, numbers up front, the gross thing said plainly. No guilt, and no lab-coat tone in headlines.</p>

  <h2>Five traits: this, not that</h2>
  <table class="lt" style="margin-bottom:4mm">
    <tr><th style="width:24%">This</th><th style="width:22%">Not that</th><th>Real line</th></tr>
    <tr><td><b>Playful</b></td><td>Lab-coat, preachy</td><td class="quote">"We made daily nutrition, like, ridiculously easy."</td></tr>
    <tr><td><b>Short, three beats</b></td><td>Long explaining</td><td class="quote">"Rip. Tip. Enjoy."</td></tr>
    <tr><td><b>Names the enemy by feel</b></td><td>Naming competitors</td><td class="quote">"No more gagging on pills, sloshing chalky powders, or cleaning messy counters."</td></tr>
    <tr><td><b>Says the gross thing plainly</b></td><td>Coy euphemism</td><td class="quote">"better poops"</td></tr>
    <tr><td><b>Cheeky, self-aware</b></td><td>Guilt or hype</td><td class="quote">"Savings, exclusive flavors, and a minor sense of superiority."</td></tr>
  </table>

  <h2>Tone by situation</h2>
  <table class="lt" style="margin-bottom:4mm">
    <tr><td style="width:24%"><b>Headlines</b></td><td>Cheeky and short, with numbers up front. No lab coat. <span class="quote">"Tastes like a treat, works like a supplement."</span></td></tr>
    <tr><td><b>Product facts</b></td><td>Plain numbers, per pack (never per gummy). <span class="quote">"60+ ingredients, 21 vitamins &amp; minerals, and 6g fiber"</span></td></tr>
    <tr><td><b>Gut and digestion</b></td><td>Plain and warm, kept at "supports". Point gut-sensitive buyers to Low Sugar, because Sugar-Free upsets some stomachs.</td></tr>
    <tr><td><b>Price and offers</b></td><td>One offer, stated exactly, with its small print. $29.99 needs the SMS line: "Offer assumes customer has received and uses promotional SMS discount reserved for new customers only."</td></tr>
    <tr><td><b>Kids</b></td><td>Talks to parents. Picky-eater pain, ingredient hooks (<span class="quote">"Methylfolate, Not Folic Acid"</span>), poop humour. No claims about bodies or minds.</td></tr>
    <tr><td><b>Subscriptions</b></td><td>Honest. Don't promise easy cancelling beyond the site's own words. The guarantee covers the first order only. A limited flavour switches back to Original after 1 month.</td></tr>
  </table>

  <div class="g2">
    <div class="box"><h3>Words to use</h3>supports · daily pack · rip, tip · chalky powders, gagging on pills, shaker (the enemy) · better poops · "of surveyed users" · Low Sugar / Sugar-Free (exact names) · per pack</div>
    <div class="dontbox"><h3 style="color:var(--plum)">Words to avoid</h3>fix · cure · treat (medically) · weight loss · muscle · revive · "works" on its own · per gummy · peak health · guilt words · partner brand or character names · a star rating with no source</div>
  </div>
  <div class="foot"><span>Sprout · Brand guide · October 2026</span><span>05 / 11</span></div>
</section>

<!-- 6 VOICE: CLAIMS -->
<section class="page">
  <div class="tag">06 · Voice: claims</div>
  <h1>Say "supports". Name the source.</h1>
  <p class="reason">The brand's own rule is "supports". The study measured two vitamins in the blood and nothing else, so copy stays inside what the label and that study show. If a claim isn't on the left-hand list, check before you use it.</p>

  <div class="g2" style="grid-template-columns:1fr 1.5fr">
    <div class="box">
      <h2 style="color:var(--kelly)">May say</h2>
      <ul class="small">
        <li>"60+ ingredients, 21 vitamins &amp; minerals, and 6g fiber" in 1 pack</li>
        <li>"Clinically tested for nutrient absorption." Name the study (2025, 12 weeks, randomized, double-blind, placebo-controlled, 120 adults) and its two numbers: vitamin C +40.1%, folate +20.5%</li>
        <li>"Supports digestion and gut health"</li>
        <li>Third-party tested for 70 pesticides, 4 heavy metals, 16 contaminants, 9 microbial contaminants</li>
        <li>Vegan, pectin base. Free from gluten, dairy, nuts, synthetic dyes and synthetic sweeteners</li>
        <li>Methylfolate, not folic acid</li>
        <li>Survey numbers, always with "of surveyed users" (brand survey of 3,000+): 95% take it 4–6x a week, 80% daily · 67% better, more regular digestion · 52% feel more energized</li>
      </ul>
      <p class="small" style="margin-top:2mm"><b>Note:</b> the site footer carries the standard FDA line, but the ads don't. Whether posts need it is <span class="notyet">not on file yet</span>.</p>
    </div>
    <div class="dontbox">
      <h2>May not say as written</h2>
      <table class="lt">
        <tr><th>Claim</th><th>Why, and what to do</th></tr>
        <tr><td>"Fix the Hot Girl Tummy"</td><td>"Fix" sounds like treating bloating. Keep it at "supports".</td></tr>
        <tr><td>Weight loss / "Support Muscle While You Lose Weight"</td><td>No evidence on file. Drop it.</td></tr>
        <tr><td>"Nutrition for Healthy Hair"</td><td>Only "supports". No growth promises.</td></tr>
        <tr><td>"revive whole body vitality"</td><td>Vague, with no support. Drop it.</td></tr>
        <tr><td>"Clinically backed formula for energy, immunity…"</td><td>The study tested absorption of 2 vitamins, not energy or immunity.</td></tr>
        <tr><td>"[Sprout] works" / "actually f*&amp;$%#g work"</td><td>Too broad. The study shows absorption only.</td></tr>
        <tr><td>"backed by 35,000+ studies"</td><td>Those are studies on the ingredients, not on the product.</td></tr>
        <tr><td>"Each gummy delivers 100%…"</td><td>Wrong unit. It is per pack.</td></tr>
        <tr><td>30/60/90-day "radiant skin", "hormone health", "peak health"</td><td>Reads like a promise of results. No support.</td></tr>
        <tr><td>"breaking down almost immediately… bioavailability"</td><td>No support given.</td></tr>
        <tr><td>"fill the gaps… on a GLP-1"</td><td>Drug-adjacent. Check with the brand first.</td></tr>
        <tr><td>Kids: "strong bodies and bright minds", "brain health"</td><td>Claims about children get extra scrutiny. Drop them.</td></tr>
        <tr><td>"Most fiber supplements contain only 5g"</td><td>No source given.</td></tr>
        <tr><td>"4.8 stars from 100,000 reviews"</td><td>The counts differ (4.75/109,639 · 4.74/118,002 · 4.0/2,411). Always name the source and count.</td></tr>
        <tr><td>"Less than 1% use our Money-Back Guarantee"</td><td>Brand-reported and unverified.</td></tr>
        <tr><td>"$1.26" vs "$3.60" a serving</td><td>Dated price comparison. Recheck it.</td></tr>
      </table>
    </div>
  </div>
  <div class="foot"><span>Sprout · Brand guide · October 2026</span><span>06 / 11</span></div>
</section>

<!-- 7 PICTURES -->
<section class="page">
  <div class="tag">07 · Pictures</div>
  <h1>Bright, sunny, candy-like.</h1>
  <p class="reason">Sprout sells a supplement people want to eat, so its pictures look like a treat, not medicine: sunny light, candy colours and real people mid-day. Never clinical, never muted.</p>

  <div class="g3" style="margin-bottom:5mm">
    <div class="box"><h3>Image style</h3>A single pouch on a soft two-colour gradient, with gummies scattered in front. Bright and candy-like. <span class="notyet">Gradient colours not on file</span></div>
    <div class="box"><h3>People</h3>Everyday adults in casual clothes, at home or outdoors, pouring gummies into a hand.</div>
    <div class="box"><h3>Light and mood</h3>Bright and sunny. Fun and easy. Never clinical, never muted.</div>
  </div>

  <div class="g2" style="margin-bottom:5mm">
    <div class="box">
      <h2><span class="do">Do</span></h2>
      <ul>
        <li>Tear the daily pack straight across its top edge.</li>
        <li>Pour the gummies from the torn top into a palm or a bowl.</li>
        <li>Show the big pouch closed, or open only at its resealable top.</li>
        <li>Set one pouch on a soft gradient, gummies scattered in front.</li>
        <li>Use everyday people in casual clothes, at home or outdoors.</li>
        <li>Use the brand's own photos only.</li>
      </ul>
    </div>
    <div class="dontbox">
      <h2><span class="dont">Don't</span></h2>
      <ul>
        <li>Tear a daily pack at the side, the bottom or a corner.</li>
        <li>Show the big pouch torn.</li>
        <li>Show cartoon tie-in characters or any partner brand's marks.</li>
        <li>Use clinical settings, lab coats, or muted or grey colour.</li>
        <li>Use generated pictures of the product or of people.</li>
      </ul>
    </div>
  </div>

  <div class="g2" style="grid-template-columns:1fr 1fr">
    <div class="frame" style="height:52mm">Brand photo needed<br>Hero: pouch on gradient, gummies in front<em>No brand photos on file yet</em></div>
    <div class="frame" style="height:52mm">Brand photo needed<br>Person pouring gummies into a hand<em>No brand photos on file yet</em></div>
  </div>
  <div class="foot"><span>Sprout · Brand guide · October 2026</span><span>07 / 11</span></div>
</section>

<!-- 8 PRODUCT: ADULTS ORIGINAL -->
<section class="page">
  <div class="tag">08 · Product on camera · main product</div>
  <h1>Sprout Original (Adults)</h1>
  <p class="reason">This is the hero product, and every rule here protects the one idea: rip a pack and eat it. No water, no mixing, no shaker. The tear and the pour are the brand's signature moves, so they have to be right.</p>

  <div class="strip">
    <div class="frame">Pack front<em>Photo not on file</em></div>
    <div class="frame">Out of the pack<em>Photo not on file</em></div>
    <div class="frame">In a hand<em>Photo not on file</em></div>
    <div class="frame">In use<em>Photo not on file</em></div>
    <div class="frame">Close-up<em>Photo not on file</em></div>
  </div>

  <div class="g2">
    <div>
      <div class="box" style="margin-bottom:3mm"><h3>How it looks</h3>A glossy deep green stand-up foil pouch with a big yellow wordmark, a yellow bear face top right and "28 Daily Packs" at the bottom. The gummies are small, opaque, deep-green bears, soft matte, about thumbnail height. Flavour: Original, "Fresh &amp; Sweet" (strawberry and sweet greens).</div>
      <div class="box" style="margin-bottom:3mm"><h3>Low Sugar vs Sugar-Free: how to tell them apart</h3>The Sugar-Free pouch adds a <b>white burst</b>. With no burst, it's Low Sugar. <span class="notyet">Burst hex not on file</span></div>
      <div class="box"><h3>The pack</h3>One pouch holds 28 daily packs (small flat sachets), and the pouch has a resealable top. The 84-pack size is 3 pouches. One daily pack is about 20 g, "a small handful" of gummies.</div>
    </div>
    <div>
      <div class="box" style="margin-bottom:3mm"><h3>How it's used</h3>
        <ol>
          <li>Open the big pouch at its resealable top.</li>
          <li>Take out one daily pack.</li>
          <li>Tear it straight across the top edge.</li>
          <li>Tip the gummies out of the top into a palm or bowl.</li>
          <li>Eat them. No water. ("Rip. Tip. Enjoy.")</li>
        </ol>
      </div>
      <div class="box" style="margin-bottom:3mm"><h3>What visibly changes</h3>The daily pack goes from sealed to torn across the top, and the gummies move from the pack to the hand. Nothing else is on file.</div>
      <div class="box" style="margin-bottom:3mm"><h3>How it moves and sounds</h3><span class="notyet">Not on file yet</span></div>
      <div class="dontbox"><h2>Never show</h2>
        <ul>
          <li>A daily pack torn at the side, the bottom or a corner</li>
          <li>The big pouch torn</li>
          <li>Partner marks or cartoon characters</li>
          <li>"Per gummy" doses on screen (they are per pack)</li>
        </ul>
      </div>
    </div>
  </div>
  <div class="foot"><span>Sprout · Brand guide · October 2026</span><span>08 / 11</span></div>
</section>

<!-- 9 PRODUCT: KIDS -->
<section class="page">
  <div class="tag">09 · Product on camera</div>
  <h1>Sprout Kids</h1>
  <p class="reason">Kids is for the busy parent with picky eaters, so it is sunny yellow where Adults is deep green. It has to read as nutrition, not candy, because parents ask "Is this just candy?" Claims about children get extra scrutiny.</p>

  <div class="strip">
    <div class="frame">Pack front<em>Photo not on file</em></div>
    <div class="frame">Out of the pack<em>Photo not on file</em></div>
    <div class="frame">In a hand<em>Photo not on file</em></div>
    <div class="frame">In use<em>Photo not on file</em></div>
    <div class="frame">Close-up<em>Photo not on file</em></div>
  </div>

  <div class="g2">
    <div>
      <div class="box" style="margin-bottom:3mm"><h3>How it looks</h3>A sunflower yellow pouch with a green wordmark, a pink "KIDS" and "For ages 2 to 13". Flavour: Strawberry Burst. Gummy look: <span class="notyet">not on file yet</span>. Pink hex: <span class="notyet">not on file yet</span>.</div>
      <div class="box" style="margin-bottom:3mm"><h3>Kids vs Adults: how to tell them apart</h3>Kids is a <b>yellow pouch with a green wordmark and pink "KIDS"</b>. Adults is a <b>deep green pouch with a yellow wordmark</b>. Never swap them in a post meant for one or the other.</div>
      <div class="box"><h3>The pack</h3>A pouch of 28 daily packs. One pack is 15 g, 6 gummies. The 84-pack size is also sold.</div>
    </div>
    <div>
      <div class="box" style="margin-bottom:3mm"><h3>How it's used</h3>
        <ol>
          <li>Open the big pouch at its resealable top.</li>
          <li>Take out one daily pack.</li>
          <li>Tear it straight across the top edge.</li>
          <li>Tip the 6 gummies out of the top into a palm or bowl.</li>
        </ol>
      </div>
      <div class="box" style="margin-bottom:3mm"><h3>What visibly changes</h3>The pack goes from sealed to torn across the top. Nothing else is on file.</div>
      <div class="box" style="margin-bottom:3mm"><h3>How it moves and sounds</h3><span class="notyet">Not on file yet</span></div>
      <div class="dontbox"><h2>Never show</h2>
        <ul>
          <li>A pack torn at the side, the bottom or a corner, or the big pouch torn</li>
          <li>Cartoon tie-in characters or partner marks</li>
          <li>"Strong bodies and bright minds" or brain-health claims</li>
        </ul>
      </div>
    </div>
  </div>
  <div class="foot"><span>Sprout · Brand guide · October 2026</span><span>09 / 11</span></div>
</section>

<!-- 10 PRODUCT: LIMITED FLAVOURS -->
<section class="page">
  <div class="tag">10 · Product on camera</div>
  <h1>Limited flavours</h1>
  <p class="reason">A new flavour every 4 to 8 weeks gives people a fresh reason to buy. The gummy's shape and colour are the news, so show them clearly. Many of these flavours are tie-ins, but the partner never appears, only the flavour.</p>

  <div class="strip">
    <div class="frame">Pack front<em>Photo not on file</em></div>
    <div class="frame">Out of the pack<em>Photo not on file</em></div>
    <div class="frame">In a hand<em>Photo not on file</em></div>
    <div class="frame">In use<em>Photo not on file</em></div>
    <div class="frame">Close-up of the shape<em>Photo not on file</em></div>
  </div>

  <div class="g2">
    <div>
      <div class="box" style="margin-bottom:3mm"><h3>How it looks</h3>The gummies change shape and colour by flavour:
        <ul class="small" style="margin-top:1mm">
          <li><b>Raspberry Lemonade:</b> lemon-slice shaped, raspberry red</li>
          <li><b>Cherry, lemon lime, blue raspberry:</b> star-shaped (an ice-pop tie-in)</li>
          <li><b>Raspberry and blueberry; banana berry; strawberry vanilla:</b> shape <span class="notyet">not on file</span></li>
        </ul>
        Pouch look: <span class="notyet">not on file yet</span>.</div>
      <div class="box"><h3>Limited vs Original: how to tell them apart</h3>Original is <b>small deep-green bears</b>. A limited flavour has its <b>own shape and colour</b> (red lemon slices, stars). Name the flavour in the copy.</div>
    </div>
    <div>
      <div class="box" style="margin-bottom:3mm"><h3>The pack and use</h3>The same pouch of 28 daily packs, opened and torn the same way: resealable top, then each daily pack straight across its top. Subscribers get the limited flavour for 1 month, then it switches back to Original automatically.</div>
      <div class="box" style="margin-bottom:3mm"><h3>What visibly changes · how it moves and sounds</h3>The pack goes from sealed to torn across the top. Motion and sound: <span class="notyet">not on file yet</span>.</div>
      <div class="dontbox"><h2>Never show</h2>
        <ul>
          <li>Cartoon tie-in characters</li>
          <li>Any partner brand's name, logo or marks. Use the flavour description only.</li>
          <li>A pack torn at the side, the bottom or a corner, or the big pouch torn</li>
        </ul>
      </div>
    </div>
  </div>
  <div class="foot"><span>Sprout · Brand guide · October 2026</span><span>10 / 11</span></div>
</section>

<!-- 11 WORLD AND MOTION -->
<section class="page">
  <div class="tag">11 · World and motion</div>
  <h1>Everyday life, sunny side up.</h1>
  <p class="reason">Sprout is the one healthy habit people actually stick to. Its world is ordinary days at home or outside, in bright light, with real people, because it is meant to fit into a busy life, not a clinic.</p>

  <div class="g2">
    <div>
      <h2>The world</h2>
      <table class="lt" style="margin-bottom:3mm">
        <tr><td style="width:28%"><b>Places</b></td><td>At home or outdoors</td></tr>
        <tr><td><b>Surfaces</b></td><td>A soft two-colour gradient for pack shots. A palm or bowl for the gummies. Others: <span class="notyet">not on file</span></td></tr>
        <tr><td><b>Light</b></td><td>Bright and sunny</td></tr>
        <tr><td><b>People</b></td><td>Everyday adults in casual clothes, pouring gummies into a hand. Children in frame: <span class="notyet">not on file</span></td></tr>
      </table>
      <div class="dontbox"><h2>Never in frame</h2>
        <ul>
          <li>Clinical settings, lab coats</li>
          <li>Muted, grey colour</li>
          <li>Cartoon tie-in characters, partner brand marks</li>
          <li>A torn big pouch, or a daily pack torn anywhere but the top</li>
        </ul>
      </div>
      <p class="small" style="margin-top:3mm">No brand photos are on file yet, so these lists stand alone.</p>
    </div>
    <div>
      <h2>Motion and sound</h2>
      <table class="lt">
        <tr><td style="width:32%"><b>Pace</b></td><td><span class="notyet">Not on file yet</span></td></tr>
        <tr><td><b>Camera</b></td><td><span class="notyet">Not on file yet</span></td></tr>
        <tr><td><b>Sound</b></td><td><span class="notyet">Not on file yet</span></td></tr>
        <tr><td><b>Words on screen</b></td><td><span class="notyet">Not on file yet</span>. Until then, on-screen copy follows the voice and claims pages (05–06).</td></tr>
      </table>
    </div>
  </div>
  <div class="foot"><span>Sprout · Brand guide · October 2026</span><span>11 / 11</span></div>
</section>

</body>
</html>
```

**sprout/brand-tokens.md**

````markdown
# Sprout: brand tokens
October 2026 · from the brand file last updated 2026-10-18

## Colours
| Name | Hex | Job |
|---|---|---|
| Forest green | #00582D | Brand green (job not on file yet) |
| Deep forest green | #002C17 | Headings, dark sections |
| Warm cream | #FFF7DF | Hero background |
| Kelly green | #007E40 | Buttons |
| Sunflower yellow | #FFCC2E | Stars, badges (also the wordmark on the Adults pouch and the Kids pouch colour) |
| Plum purple | #581E5A | Top banner |

Not on file: the pink "KIDS" hex, the Sugar-Free white burst hex, and the two pack-shot gradient colours.

## Contrast pairs (text on background)
Normal text needs 4.5:1. Large text (24 px, or 19 px bold) needs 3:1.

**Allowed for all text**
| Text | Background | Ratio |
|---|---|---|
| Deep forest | Cream | 14.29 |
| Plum | Cream | 11.22 |
| Forest | Cream | 8.06 |
| Kelly | Cream | 4.84 |
| Deep forest | Sunflower | 10.15 |
| Plum | Sunflower | 7.97 |
| Forest | Sunflower | 5.72 |
| Cream | Deep forest | 14.29 |
| Cream | Plum | 11.22 |
| Cream | Forest | 8.06 |
| Cream | Kelly | 4.84 |
| Sunflower | Deep forest | 10.15 |
| Sunflower | Plum | 7.97 |
| Sunflower | Forest | 5.72 |

**Large text only**
| Text | Background | Ratio |
|---|---|---|
| Kelly | Sunflower | 3.43 |
| Sunflower | Kelly | 3.43 |

**Never for text**
| Pair | Ratio |
|---|---|
| Sunflower / Cream | 1.41 |
| Kelly / Deep forest | 2.96 |
| Plum / Kelly | 2.32 |
| Forest / Deep forest | 1.77 |
| Kelly / Forest | 1.67 |
| Plum / Forest | 1.39 |
| Plum / Deep forest | 1.27 |

## CSS variables
```css
@import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@500;700&family=DM+Mono:wght@500&display=swap');

:root {
  --sprout-forest: #00582D;   /* brand green, job not on file */
  --sprout-deep:   #002C17;   /* headings, dark sections */
  --sprout-cream:  #FFF7DF;   /* hero background */
  --sprout-kelly:  #007E40;   /* buttons */
  --sprout-sun:    #FFCC2E;   /* stars, badges */
  --sprout-plum:   #581E5A;   /* top ban
```
