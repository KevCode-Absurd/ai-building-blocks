---
name: resize-ads-for-every-placement
description: "Turns one approved ad into a full placement set: Meta feed 4:5, square 1:1, Stories and Reels 9:16, and Google display 1.91:1, 1:1 and 9:16, each rebuilt (not cropped) so the product, words, price and logo sit inside every platform's safe area and still read on a phone. Includes a phone-size read test, a file and naming sheet, and the right way to load the set as one ad with placement versions so it does not split delivery. Use when a winning or newly approved ad exists in one size only, before a launch, or when Stories or Reels show the ad with its words covered."
---

# Resize one ad for every placement

**You get:** one folder with 6 to 7 export files of the same ad (Meta 4:5, 1:1 and 9:16; Google 1.91:1, 1:1 and 9:16, plus an optional Google logo), each checked against its safe area and a phone-size read test, and a one-page sheet that says which file goes in which placement slot.

## When to use

- An approved ad exists in one size and needs to run on every placement the store buys.
- Stories or Reels results look weak and the ad's words or price sit under the platform's buttons.
- A Meta ad is being reused on Google display, Demand Gen or Performance Max.
- A batch of new statics is about to launch and only the 4:5 masters are done.

## Not for

- Designing the ad's layout from scratch: use `static-ad-layout-blueprint`.
- Making new image variations from one product photo: use `product-photo-ad-variations`.
- Building and naming the ads in Ads Manager: use `ad-launch-prepublish-check`.
- Video ads: the cut changes by placement, so use `cut-raw-footage-into-ad-variants`.

## What you need

Required:

1. **The approved master**, layered: Figma, Canva, Photoshop or PSD, or the HTML file if the ad was set as live type. A flat JPG only works if the product photo and logo are also supplied, because words must be reset, not stretched.
2. **The product photo and logo** at full size, transparent PNG where possible.
3. **The ad's copy and offer**, with the live product URL so the price and offer can be checked on the day.
4. **The placement list** the store actually buys: Meta feed, Stories, Reels, and whether Google display or Performance Max is live.

Optional: brand fonts and colours (from `store-visual-identity-sheet`), past results by placement from Ads Manager.

If the master is flat and no layers exist, rebuild it with live type before resizing. Read access is enough to check live ads. Uploading new files to a live ad needs draft access (level 2) and the client's yes before it publishes.

## Before you start: the gates

1. **The ad is approved and true.** Every claim, price and offer in the master matches the live page today. Pass: checked against the URL with the date. Fail: fix the master first; a resize multiplies an error by six.
2. **The offer is costed.** A price or discount in the ad has a known gross profit per order and break-even return from `store-meta-math`. A 30% discount can triple break-even ROAS [OFF-0065]. Fail: send back to the offer owner before making more sizes of it.
3. **Product is in stock** for the run and the landing page loads on mobile. Fail: hold.
4. **The layers exist.** Fail: rebuild before resizing.

## Steps

### 1. Build the size sheet

Use the platform's own pages on the day; these were current when this skill was written:

| Slot | Ratio | Build at | Safe area |
|---|---|---|---|
| Meta feed | 4:5 | 1440 x 1800 (Meta Ads Guide) | keep key items off the outer 5%, practitioner default |
| Meta square (feed, right column, some Audience Network) | 1:1 | 1440 x 1440 | outer 5%, practitioner default |
| Meta Stories and Reels | 9:16 | 1440 x 2560 | 14% top, 35% bottom, 6% each side clear of words, logo and key product detail [MCR-6040] |
| Google display landscape | 1.91:1 | 1200 x 628 | no text over image [GAD-6042] |
| Google display square | 1:1 | 1200 x 1200 | no text over image [GAD-6042] |
| Google display vertical | 9:16 | 900 x 1600 | no text over image [GAD-6042] |

On a 1080 x 1920 export the Meta 9:16 safe area means about 270 px clear at the top, 672 px at the bottom and 65 px each side [MCR-6040]. Older guides say 20% at the bottom; build to 35%.

### 2. Rebuild, never crop

Start each size from the layers. Move things, do not shrink them:

- **9:16 from 4:5:** keep the product in the middle band; put the headline in the top third just below the 14% line; nothing that matters below the 65% line. Extend the background upward and downward; never stretch the product.
- **1:1 from 4:5:** the frame loses height, so drop the least important line (usually a secondary benefit), not the font size.
- **1.91:1:** product on one side, space on the other. For Google this is a clean image; the words go into the headline and description fields, because Google advises against text, logos or play buttons laid over the image [GAD-6042].

If a background extension needs a generated fill, it may touch the background only. Never regenerate or redraw the product; hand any product edit to `keep-product-accurate-in-ai-media`.

### 3. Keep it one ad, not six

Near-duplicate ads get grouped as one by Meta's ad matching, so six uploaded copies add no new reach and split the learning [MCR-0078]. Load the sizes as placement versions of one ad (Ads Manager's placement asset customisation), not as separate ads. Avoid letting automatic format options pick the crop: they can push a story asset into feed or crop it badly [ADC-0065]. Turn off any automatic image expansion or crop option unless each result is checked by eye.

### 4. Phone-size read test

For each file:

1. Show it on a real phone at the size the platform shows it (feed at full width, story full screen), or at 375 px wide in a browser.
2. Hold the phone at arm's length for 2 seconds, then look away. Write down what you remember.
3. Pass when a person who has not seen the ad can say what the product is and the one promise. A static headline that is half clear fails; it must be fully clear or a clear curiosity line [MCR-0019].

Text size floor, practitioner default, test it: headline cap height at least 4% of the frame's short side; no line of words smaller than about 2.5% of the short side. On 1080 wide that is about 43 px and 27 px.

### 5. Overlay check on 9:16

Lay a safe-zone guide (a transparent PNG with the 14% / 35% / 6% bands shaded) over every 9:16 file. Any word, price, logo or the product's key detail inside a shaded band fails. Then preview the ad in Ads Manager's placement preview at draft level, if the client gives draft access, and screenshot each placement.

### 6. Price, offer and claims, one more time

Every size must carry the same price, same offer wording and same end date as the live page. If a line had to be cut to fit, it must not be the line that makes the offer true (for example "on orders over 50", in the store's currency). If the qualifying line cannot fit, drop the offer from that size and lead with the product instead.

### 7. Export and name

- JPG for photos, PNG for flat graphics with sharp type; sRGB colour.
- Meta files under 30 MB (Meta Ads Guide); Google files under 5,120 KB [GAD-6042]. Aim for under 1 MB anyway so previews load fast.
- Name: `<adname>_<placement>_<ratio>_<version>.jpg`, for example `ShakerA_story_9x16_v2.jpg`, using the store's naming rule if it has one.

### Market notes

- **UK, EU, Australia and other tax-inclusive markets:** if the ad shows a price, show the final price the buyer pays, including VAT or the goods and services tax; if the store charges a pay-on-delivery or other payment fee, the ad must not imply it is free.
- **Every market:** versions in other languages your buyers use (German, French, Spanish and others) often run longer than English; rebuild the layout for the longest version, never shrink the font to fit.
- **US and Canada:** sales tax is added at checkout, so "from $X" is fine if it matches the page. A discount in the ad needs the same terms as the site.

## Checks before you hand it over

- Every slot in the size sheet has a file at the exact pixel size, or a written reason why it is skipped.
- No word, price or logo sits inside the 9:16 shaded bands [MCR-6040].
- Google files carry no added text, logo or button over the image [GAD-6042].
- The product is pixel-identical to the approved master in every size: same label, colour and shape.
- Each file passed the 2-second phone read test with a named reader.
- Price, offer and end date match the live page, checked today with the date written down.
- The sizes are set up as one ad with placement versions, not as separate ads.
- Nothing was uploaded or published without the client's yes.

## Output

**One-screen summary:** ad name, sizes delivered, sizes skipped and why, the one line cut from smaller sizes, read-test result, and the date the price was checked.

**Placement sheet:**

| File name | Platform | Placement slot | Ratio | Pixels | KB | Safe area pass | Read test pass (reader) | Price checked (date) | Notes |
|---|---|---|---|---|---|---|---|---|---|

**Google text fields** (because the words come off the image):

| Field | Text | Characters |
|---|---|---|
| Short headline (up to 30) | | |
| Long headline (up to 90) | | |
| Description (up to 90) | | |
| Business name | | |

**Folder:** `/<adname>/masters`, `/<adname>/meta`, `/<adname>/google`, `/<adname>/previews` (phone screenshots).

## Common mistakes

- **Cropping the 4:5 to 9:16.** The headline lands under the profile bar and the price under the button. Step 2 rebuilds from layers.
- **Using an old safe-zone number.** Step 1 uses the current 35% bottom band [MCR-6040].
- **Pasting the Meta ad onto Google.** Text over the image is against Google's advice and unreadable at small sizes [GAD-6042]. Step 2 makes a clean version and moves the words to the fields.
- **Six ads instead of one.** Step 3 loads placement versions so delivery does not split [MCR-0078].
- **Shrinking text to fit.** Step 1 and step 4 cut a line instead.
- **Cutting the offer's condition.** Step 6 drops the offer rather than shows half of it.

## Sources

- MCR-6040: Meta 9:16 safe area is 14% top, 35% bottom, 6% sides.
- GAD-6042: Google display image sizes and no text, logo or button overlays.
- MCR-0078: near-duplicate ads are grouped and add no reach.
- ADC-0065: automatic formats can crop story assets into feed.
- MCR-0019: a static headline must be fully clear or clearly curious.
- OFF-0065: a discount can triple break-even ROAS, so the offer is costed first.

What makes this skill ours: each size is rebuilt from layers against the current 35% bottom band instead of cropped; Google gets a clean image with the words moved to its text fields; the set loads as one ad so delivery is not split; and an offer's qualifying line is never cut to make it fit.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. If the ad shows a price, show the final price including GST; if the store charges a COD fee, the ad must not imply free COD. Hindi and other regional-language versions often run longer than English; rebuild the layout for the longest version.
