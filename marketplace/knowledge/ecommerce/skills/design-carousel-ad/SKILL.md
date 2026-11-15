---
name: design-carousel-ad
description: "Designs a story-led carousel ad card by card: the order of 3 to 7 cards, each card's on-image words, image direction, headline, description and link, built so the first card stops the right buyer and each swipe moves them one step closer to buying. Includes the swipe-flow logic (problem, proof, product, offer), Meta's card limits, a first-card test with two or three openers, and the rule that every card stays true to the live page and the store's own proof. Use when a product needs more than one image to explain, when a single static is not converting, or to show a bundle, a routine or a range."
---

# Carousel ad that tells a story

**You get:** a carousel spec sheet with 3 to 7 cards, each with its job, on-image words, image direction, card headline, description and link; the primary text; and a first-card test plan with two or three opening cards, ready for a designer or image tool to build at 1:1 (and 4:5 where the placement allows).

## When to use

- The product needs several steps to understand: how it works, what is in the box, a routine, before and after use.
- A single static gets clicks but few purchases, and buyers need more proof before the page.
- The store wants to show a bundle, a set or a small range in one ad.
- A strong review set or step-by-step demo exists that is too long for one image.

## Not for

- Choosing the angle or buyer: use `write-one-page-creative-brief` first.
- A single static image: use `static-ad-layout-blueprint`.
- A carousel built automatically from the catalogue: use `design-catalog-ad-overlays`.
- Organic Instagram carousels: use `repurpose-ads-into-organic-posts`.

## What you need

Required:

1. **The brief:** buyer, angle, the one promise, the offer, and the landing page. If there is no brief, write one with `write-one-page-creative-brief`; do not invent the angle here.
2. **Proof the store owns:** reviews CSV from the review app (Judge.me, Loox, Okendo, Yotpo or Shopify Product Reviews export: rating, body, reviewer name, date, product, photo URL), product claims and their evidence (`product-claims-profile`), and real product and in-use photos.
3. **The live product page** with price and stock, checked on the day.
4. **Gross profit per order** for the product or bundle shown, from `store-meta-math` or `build-sku-profit-sheet`.

Optional: past carousel results from Ads Manager (link click-through rate, cost per purchase, by card if available).

Read access is enough to plan. Building the ad in Ads Manager needs draft access (level 2); it publishes only on the client's yes.

## Before you start: the gates

1. **Gross profit per order is known** for what the carousel sells. Fail: compute it first; a carousel showing a 3-pack that loses money per order is not shipped [MEA-0037].
2. **Proof exists for every card that claims something.** Fail: cut the card. A carousel with five cards and one real proof point is a three-card carousel.
3. **The offer and price are live** and the landing page shows the same thing. Fail: hold.
4. **Enough budget to read a first-card test.** Practitioner default, test it: about 50 purchases across the test, or at least a week at the store's normal daily spend for one ad set. Fail: skip the test and run the strongest opener only.

## Steps

### 1. Pick the carousel's job

Choose one, from the brief:

| Job | When | Card flow |
|---|---|---|
| Explain | new or unclear product | problem, why old fixes fail, how this works, proof, offer |
| Prove | sceptical buyers, crowded category | promise, review 1, review 2, result or test, offer |
| Routine | product used in steps | the result, step 1, step 2, step 3, what you get |
| Range or bundle | several products or sizes | who it is for, option A, option B, option C, the bundle saving |

Keep one awareness stage, or move steadily from problem toward product. A problem-aware opener followed by a feature list loses both groups [MCR-0056]. Raise the sense of being sold gradually, card by card; the price belongs near the end, not on card 1 unless the price is the hook [MCR-0027].

### 2. Write card 1 first, and three versions of it

Card 1 does almost all the work: most people never swipe. Write it to stand alone as a static.

- Make it fully clear or a deliberate curiosity gap; the middle loses [MCR-0019].
- Name the buyer or their problem in 3 to 8 on-image words.
- Show the product or the problem in a way a phone screen can read.
- Add a visual cue that there is more (a cut-off object at the right edge, or "1/5"). Practitioner default, test it.

Write three card-1 versions that differ on promise or visual, not colour. A new background colour alone is not a new ad [MCR-0022].

### 3. Write cards 2 to N

For each card fill: job, on-image words (up to 10), image direction, card headline, card description, link.

- **One idea per card.** If a card needs two sentences on the image, split it or cut it.
- **End every card on a gap the next card closes:** a question, an unfinished thought, a number that needs explaining ("but is it enough?"). Number the cards when the steps are a sequence. The swipe is the only reason card 2 is ever seen.
- **Drop-card test.** Remove each card in turn and read the rest. If the argument still holds without it, that card is padding: cut it or give it a real job (the main doubt, the strongest proof, the offer terms).
- **Proof cards use real proof.** A review card shows the reviewer's first name and last initial, the star rating, the date and the source, word for word; answer one objection per review card [LPG-0053]. Never write a review; AI-made or edited reviews are banned in the US [MCR-6045] and under UK and EU consumer law.
- **Product cards show the exact variant sold**, from real photos.
- **The last card makes one offer** with its terms, and repeats the call to action.
- **Links:** each card can link to its own URL [MCR-6041]. Point a product card at that product; point the offer card at the bundle or offer page. Keep UTM tags the same pattern on each.

Length: 3 to 5 cards for most stores; 7 only when the routine truly has that many steps. Meta allows 2 to 10 [MCR-6041].

### 3b. Rebuilding a winning video or static as a carousel

When the store's own winner (often a video) is being rerun as a carousel, the message, buyer and offer stay fixed and only the format changes; rerunning a working angle in very different formats is one of the cheapest ways to widen its reach [MCR-6756].

1. **Lay the winner out in order:** each shot or part with its words and its job (opening, problem, turn, proof, offer). Fine print that stays on screen counts once, where it first appears.
2. **Find the beat that sells and check a carousel can carry it.** A believable face carries only if a real photo of that person exists. A reveal or turn works if it lands on a swipe. A line heard rather than read moves into card text or the primary text. Motion you watch finish becomes one card per step. If the carousel cannot carry the selling beat, say so first, then build the closest version and flag the risk to the owner.
3. **Keep every line and its order.** The opening line goes on card 1, the turn or promise lands on a swipe, and the offer with its action goes last. Spoken lines with no card go into the primary text in order. Do not rewrite proven words to fit; shorten only by cutting whole lines, and list each cut.
4. Map the beats to where the eye goes card by card, the same order a script uses; when objection, proof and offer will not fit, move them to the landing page rather than cramming a card [MCR-6690].

### 4. Fit the card text to Meta's limits

Meta's Feed carousel guidance: headline about 20 characters, description about 18, primary text about 80 [MCR-6041]. Longer text gets cut off. So the image carries the story; the card headline only names the step ("Step 2: Rinse", "Ships in 2 days"). Primary text above the carousel sets up the swipe in one or two lines.

### 5. Set the order rule

In Ads Manager, carousels have an option to show the best-performing cards first. Turn it off when the cards tell a story in order; leave it on only for a range carousel where any card can lead. Avoid flexible or automatic formats that may rebuild the cards into a carousel nobody approved [ADC-0065].

### 6. Design direction

- Build each card at 1:1 at least 1080 x 1080 [MCR-6041]; 4:5 where the placement accepts it.
- One layout grid across all cards: same margin, same headline position, same type sizes. Only the image and words change.
- A continuous background across cards (a panorama sliced into cards) works for routines; it fails if any single card makes no sense alone.
- Product photos must be the real product. Any AI-made scene keeps the real product photo and is disclosed by the platform's AI label where it applies.

### 7. Plan the first-card test

- Run the three card-1 versions as separate ads in one ad set, with cards 2 to N identical.
- Judge on cost per purchase against the break-even from gross profit per order, then on link click-through rate. A high click-through rate with few purchases is a false winner [MCR-0029].
- Read after about 50 purchases across the ads or 7 days, whichever comes later. Practitioner default, test it.
- Keep the winner; replace the loser with a new card-1 idea next round.

### Notes by market

- **Pay on delivery, tax and languages:** if pay on delivery is offered, say so on the offer card only if it is true for the product and the areas advertised. Show prices the way each market expects: tax included in the UK, EU and Australia; before sales tax in the US and Canada. Cards in other languages need a native reader to check the words on the image, not a translation tool alone.
- **Prices and shipping (all markets):** a "save X" card must match the site's real compare-at price (in the EU, the lowest price of the last 30 days). Free shipping thresholds must match checkout.

## Checks before you hand it over

- Card 1 works alone as a static and passes a 2-second phone read.
- Each card has one idea and no more than about 10 words on the image.
- Every review shown is real, word for word, with name, date and source.
- Each claim has a source in `product-claims-profile` or is cut.
- Card headlines fit about 20 characters and descriptions about 18 [MCR-6041].
- Every card link opens the matching live product or offer, in stock, at the advertised price, checked today.
- The order setting matches the carousel's job.
- Every card except the last ends on a gap, and no card survives the drop-card test as padding.
- A rebuilt winner keeps its lines in their original order, with any cut lines listed.
- Gross profit per order is known for the product or bundle on the offer card.

## Output

**One-screen summary:** the carousel's job, buyer, number of cards, the three card-1 versions in one line each, the offer and its break-even cost per purchase, and the test read date.

**Card sheet:**

| Card | Job | On-image words | Image direction (what we see, angle, light) | Card headline (20) | Description (18) | Link URL with UTM | Proof source |
|---|---|---|---|---|---|---|---|
| 1A | Stop the buyer | | | | | | |
| 1B | | | | | | | |
| 1C | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| Last | Offer and CTA | | | | | | |

**Ad-level fields:** primary text (about 80 characters), call-to-action button, "show best-performing cards first" on or off, placements.

**Test plan:** ads, budget per day, read date, winner rule (cost per purchase below break-even, then link click-through rate).

## Common mistakes

- **Cards that each make sense alone but give no reason to swipe.** Step 3 ends every card on a gap.
- **Rewriting a proven ad's words to fit the cards.** Step 3b keeps lines and order.
- **Card 1 is a logo or a lifestyle shot with no words.** Most viewers never swipe. Step 2 makes card 1 a standalone ad.
- **Five cards, one idea.** Step 3 cuts any card without a new job or proof.
- **Writing the story in the headline field.** It is cut at about 20 characters. Step 4 puts the story on the image.
- **Leaving auto-order on for a story.** Step 5 turns it off so step 3 does not show before step 1.
- **Testing colours instead of openers.** Step 2 changes the promise or the visual [MCR-0022].
- **Picking the winner by clicks.** Step 7 reads cost per purchase against break-even first [MCR-0029].

## Sources

- MCR-6041: Meta carousel 2 to 10 cards, 1:1, short card text, links per card.
- MCR-0019: a static is fully clear or a clear curiosity gap.
- MCR-0022: new colour or pose is not a new ad.
- MCR-0027: raise the sense of being sold gradually.
- MCR-0056: keep one awareness stage or move steadily down.
- MCR-0029: a high click-through rate can be a false winner.
- LPG-0053: each testimonial answers one objection.
- MCR-6045: fake and AI-made reviews are banned in the US.
- MCR-6756: rerun a working angle in very different formats.
- MCR-6690: map a static's beats to the eye path; move what will not fit to the landing page.
- ADC-0065: automatic formats can build carousels nobody approved.
- MEA-0037: gross margin is the delivered cost to the door.

What makes this skill ours: the carousel's job is chosen before any card is drawn; card 1 is written three ways and tested as a standalone ad while the rest stay fixed; the story lives on the image because Meta cuts card text at about 20 characters; and the winner is read on cost per purchase against the product's own break-even, not on clicks.

## Selling in India

- Say "Cash on delivery available" on the offer card only if it is true for the product and pin codes advertised.
- Show the GST-inclusive price.
- Hindi or regional-language cards need a native reader to check the words on the image.
