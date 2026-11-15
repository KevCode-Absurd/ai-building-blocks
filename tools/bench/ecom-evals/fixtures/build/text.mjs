// Text-heavy fixtures: E01 to E03 Org context builds, E16 to E18 ad image batches, E19 UGC scripts,
// E31 Pela review mining. Reviews and survey answers are written for this test; they are not real customers.
import { csv, md, fact, check, sum } from "./lib.mjs";

const reviews = (rows) => rows.map(([date, product, rating, text, extra]) => ({ date, product, rating, text, ...(extra ?? {}) }));

// ---------------------------------------------------------------- E01 Wild One, Org context build (3 signals)
export function E01() {
  const T = "E01", B = "Wild One";
  csv(T, "reviews export, last 6 months", B, "Shopify reviews app export, May to Oct 2026.", reviews([
    ["2026-05-03", "Cushioned Dog Harness", 5, "Finally a harness that doesn't look like hiking gear. Matches her collar."],
    ["2026-05-09", "Hands-Free Rope Leash", 5, "Wear it across my body on the subway. Love the Spruce."],
    ["2026-05-14", "Travel Carrier", 4, "Took it on a flight, fit under the seat on my airline. Check yours first."],
    ["2026-05-22", "Cushioned Dog Harness", 2, "My puppy chewed the strap in a week and warranty said no."],
    ["2026-06-02", "Waterproof Collar", 5, "Beach, mud, rain. Still looks new. The colours match everything."],
    ["2026-06-11", "Cat Harness & Leash", 5, "She didn't wiggle out! First time she has been on the balcony."],
    ["2026-06-19", "Poop Bags", 4, "Like that they're compostable, smell nicer than the cheap ones."],
    ["2026-06-25", "Cushioned Dog Harness", 5, "On in five seconds. No more pulling on the walk."],
    ["2026-07-02", "Travel Carrier", 5, "Airline approved and stylish, love it."],
    ["2026-07-08", "Cat Harness & Leash", 5, "Finally cat gear that isn't ugly. Bought the Lilac."],
    ["2026-07-15", "Walk Kit", 5, "Got the kit as a gift for my sister's new puppy. Packaging was so cute."],
    ["2026-07-21", "Cushioned Dog Harness", 1, "Chewed through in two days, not chew proof at all."],
    ["2026-07-29", "Cat Tunnel", 5, "My two cats live in it now."],
    ["2026-08-04", "Hands-Free Rope Leash", 4, "Great for running. Wish there was a shorter length."],
    ["2026-08-12", "Cat Harness & Leash", 4, "Took a few days for him to get used to it. Fit guide was helpful."],
    ["2026-08-19", "Waterproof Leash", 5, "Doesn't get smelly. Bought matching collar."],
    ["2026-08-26", "Cushioned Dog Harness", 2, "Strap chewed, they would not replace it."],
    ["2026-09-03", "Cat Harness & Leash", 5, "Indoor cat, first walk in the yard. She loved it."],
    ["2026-09-09", "Breakaway Cat Collar", 5, "Safety clasp works, cute colours."],
    ["2026-09-16", "Travel Carrier", 4, "Sturdy. Bit pricey but looks way better than others."],
    ["2026-09-22", "Cat Harness & Leash", 5, "I didn't know cat gear could look this good."],
    ["2026-09-30", "Poop Bag Carrier", 5, "Clips on, matches the leash. Little thing, big joy."],
    ["2026-10-04", "Cat Tunnel", 5, "Bought the harness and tunnel together. Worth it."],
    ["2026-10-09", "Cushioned Dog Harness", 5, "Third one, new colour every year."],
    ["2026-10-15", "Cat Harness & Leash", 5, "She didn't wiggle out, even when a dog barked."],
    ["2026-10-21", "Waterproof Collar", 1, "My dog chewed it. Warranty excluded chewing."],
    ["2026-10-27", "Cat Harness & Leash", 4, "Wish it came in more sizes for big cats."],
  ]));
  csv(T, "post-purchase survey, monthly", B, "Post-purchase survey: 'Who is this order for?' Monthly answers.", [
    { month: "2026-05", answers: 1180, for_my_dog: "96%", for_my_cat: "1%", gift: "3%" },
    { month: "2026-06", answers: 1240, for_my_dog: "86%", for_my_cat: "9%", gift: "5%" },
    { month: "2026-07", answers: 1310, for_my_dog: "79%", for_my_cat: "16%", gift: "5%" },
    { month: "2026-08", answers: 1290, for_my_dog: "73%", for_my_cat: "22%", gift: "5%" },
    { month: "2026-09", answers: 1350, for_my_dog: "69%", for_my_cat: "26%", gift: "5%" },
    { month: "2026-10", answers: 1420, for_my_dog: "63%", for_my_cat: "31%", gift: "6%" },
  ]);
  md(T, "three past emails with results", B, `
# Three past emails (test data)

## Email 1, 12 Aug 2026: "New drop: Limeade Reflective"
Subject: Glow up your walk. Body: 4 short lines, one photo of the leash at dusk, button "Shop Limeade". Click rate 3.9%, revenue per recipient $0.61, unsubscribe rate 0.12%.

## Email 2, 9 Sep 2026: "Unleash the ultimate walking experience"
Subject: Elevate every adventure with premium, best-in-class gear. Body: 3 long paragraphs about quality and innovation, 6 product photos. Click rate 1.1%, revenue per recipient $0.14, unsubscribe rate 0.41%.

## Email 3, 7 Oct 2026: "Cats, meet the outside"
Subject: Your cat's first walk. Body: 5 short lines, one photo of a cat on a balcony in the Lilac harness, button "Shop cat". Click rate 4.6%, revenue per recipient $0.77, unsubscribe rate 0.10%.
`);
  const chew = 5, total = 27;
  fact(T, "chew_complaints", `${chew} of ${total} reviews`); fact(T, "cat_share", "1% in May to 31% in Oct");
}

// ---------------------------------------------------------------- E02 KraveBeauty, Org context build (held-out, 3 signals)
export function E02() {
  const T = "E02", B = "KraveBeauty";
  csv(T, "reviews export, last 6 months", B, "Reviews app export, May to Oct 2026. The 'incentivised' column marks reviews from the July giveaway.", reviews([
    ["2026-05-04", "Great Barrier Relief", 5, "My skin finally calmed down after years of 10-step routines.", { incentivised: "no" }],
    ["2026-05-12", "Matcha Hemp Hydrating Cleanser", 5, "Gentle, doesn't strip. I threw out half my shelf.", { incentivised: "no" }],
    ["2026-05-20", "Great Barrier Relief", 5, "It healed my eczema in a week!!", { incentivised: "no" }],
    ["2026-06-01", "Oat So Simple Water Cream", 4, "Simple and light. Wish the jar was bigger.", { incentivised: "no" }],
    ["2026-06-09", "Beet The Sun SPF 40", 5, "No white cast. One cleanser, one serum, one SPF and done.", { incentivised: "no" }],
    ["2026-06-17", "Great Barrier Relief", 4, "Took a month but my redness is way down.", { incentivised: "no" }],
    ["2026-06-26", "24 Carrot Retinal", 3, "Bit drying at first. Started every other night.", { incentivised: "no" }],
    ["2026-07-05", "Mochi Berrier Moisture Cream", 5, "OMG obsessed!!! Best cream ever, holy grail, anti-aging miracle!!!", { incentivised: "yes" }],
    ["2026-07-05", "Mochi Berrier Moisture Cream", 5, "Amazing anti-aging, I look 10 years younger!", { incentivised: "yes" }],
    ["2026-07-06", "Mochi Berrier Moisture Cream", 5, "Best anti-aging cream, got it free and love it!!", { incentivised: "yes" }],
    ["2026-07-06", "Mochi Berrier Moisture Cream", 5, "Glow glow glow, anti-aging must have!!", { incentivised: "yes" }],
    ["2026-07-07", "Mochi Berrier Moisture Cream", 5, "So luxe, anti-aging magic!!!", { incentivised: "yes" }],
    ["2026-07-19", "Great Barrier Relief", 5, "I'm done with 10 steps. This replaced three products.", { incentivised: "no" }],
    ["2026-08-02", "Matcha Hemp Hydrating Cleanser", 5, "My go-to. Doesn't break me out.", { incentivised: "no" }],
    ["2026-08-14", "Beet The Sun SPF 40", 4, "Wears well under makeup.", { incentivised: "no" }],
    ["2026-08-27", "Great Barrier Relief", 5, "Repaired my damaged skin barrier, cured my rosacea.", { incentivised: "no" }],
    ["2026-09-08", "Oat So Simple Water Cream", 5, "Bought the refill. Love less packaging.", { incentivised: "no" }],
    ["2026-09-21", "Great Barrier Relief", 5, "My skin finally feels like mine again.", { incentivised: "no" }],
    ["2026-10-03", "Matcha Hemp Hydrating Cleanser", 5, "Simple routine, happy skin.", { incentivised: "no" }],
    ["2026-10-19", "24 Carrot Retinal", 4, "Gentle for a retinal. Slow and steady.", { incentivised: "no" }],
  ]));
  csv(T, "post-purchase survey", B, "'What made you buy today?' (pick one), 3,900 answers, May to Oct 2026.", [
    { reason: "I want a simpler routine", share: "44%" }, { reason: "My skin is irritated or sensitive", share: "29%" },
    { reason: "A creator or friend recommended it", share: "13%" }, { reason: "Anti-aging", share: "9%" }, { reason: "Other", share: "5%" },
  ]);
  md(T, "three past emails with results", B, `
# Three past emails (test data)

## Email 1, 3 Jun 2026: "Your skin doesn't need more"
Subject: Fewer steps, calmer skin. Body: a short founder note, one product, button "Shop the 3-step routine". Click rate 3.4%, unsubscribe rate 0.11%.

## Email 2, 15 Jul 2026: "SHOP NOW BEFORE IT'S GONE!!!"
Subject: Last chance!!! 25% off ends tonight. Body: countdown timer, 9 products, 4 buttons. Click rate 1.6%, unsubscribe rate 0.52%, spam complaints 0.21%.

## Email 3, 12 Sep 2026: "Why we only make a few products"
Subject: We said no to 40 launches. Body: a short story about saying no to trends, one photo, button "See the lineup". Click rate 2.9%, unsubscribe rate 0.09%.
`);
}

// ---------------------------------------------------------------- E03 Sleepy Owl, Org context build (1 signal)
export function E03() {
  const T = "E03", B = "Sleepy Owl Coffee";
  csv(T, "customer survey by channel", B, "Survey of 1,600 buyers, Oct 2026, split by where they last bought.", [
    { question: "Where did you last buy?", own_site_buyers: "own site (n=900)", quick_commerce_buyers: "Blinkit, Zepto or Instamart (n=700)" },
    { question: "Most bought product", own_site_buyers: "Cold Brew Packs (58%)", quick_commerce_buyers: "Protein Coffee and instant sachets (54%)" },
    { question: "Why they buy", own_site_buyers: "Taste, smooth not bitter (47%)", quick_commerce_buyers: "Speed, it arrives in minutes (51%)" },
    { question: "When they drink it", own_site_buyers: "Afternoon at home (44%)", quick_commerce_buyers: "Before or after the gym (39%)" },
    { question: "Age 18 to 24 / 25 to 34 / 35+", own_site_buyers: "28% / 52% / 20%", quick_commerce_buyers: "41% / 46% / 13%" },
  ]);
  csv(T, "reviews sample", B, "Recent reviews from the site and quick commerce apps.", reviews([
    ["2026-09-04", "Cold Brew Packs", 5, "Smooth, not bitter. My 3pm fix."],
    ["2026-09-11", "Protein Coffee", 5, "Came in 10 minutes. Better than the cafe one after the gym."],
    ["2026-09-19", "Cold Brew Packs", 4, "Brew overnight, wake up sorted. Wish it came faster to Pune."],
    ["2026-09-28", "Instant sachets", 4, "Easy for office."],
    ["2026-10-06", "Protein Coffee", 5, "15 g protein and tastes like coffee, not chalk."],
    ["2026-10-17", "Cold Brew Packs", 5, "Smooooth. Made a jar for the week."],
  ]));
}

// ---------------------------------------------------------------- E16 Wild One, ad image batch (2 signals)
export function E16() {
  const T = "E16", B = "Wild One";
  csv(T, "past static ad results, last 120 days", B, "Meta static ads for the Cushioned Dog Harness, USD.", [
    { concept: "Flat lay: harness on a coloured background", ads: 6, spend: 18400, ctr_link: "0.8%", cost_per_purchase: 61 },
    { concept: "Dog wearing it on a city street, product close-up inset", ads: 5, spend: 16900, ctr_link: "1.9%", cost_per_purchase: 27 },
    { concept: "Colour grid of all 9 colourways", ads: 3, spend: 7200, ctr_link: "1.1%", cost_per_purchase: 49 },
    { concept: "Text-heavy feature list on plain background", ads: 2, spend: 3100, ctr_link: "0.6%", cost_per_purchase: 88 },
  ]);
  csv(T, "ad comment themes, last 120 days", B, "Themes in comments on harness ads.", [
    { theme: "Does it come in big sizes? Finally fits my lab / my shepherd", comments: 214 },
    { theme: "Colour love (Limeade, Lilac)", comments: 180 }, { theme: "Price", comments: 66 }, { theme: "Does it stop pulling?", comments: 59 },
  ]);
  md(T, "product facts and brief", B, `
# Product facts and owner brief (test data)

- Cushioned Dog Harness: neoprene padding, three leash points (front, back and side for more control), sizes XS to XL (XL fits chests up to 41 inches). Price $48.
- Best-selling colours this quarter: Limeade, Oxford, Lilac.
- Do not claim it "stops pulling" or is "no-pull"; we can say "front clip for more control".
- The owner's words: "Make me a test batch of 5 new static ads for the harness. Medium size, for the feed."
- Output we need: a short creative brief, then exactly 5 image prompts (one per ad) ready for an image model, each with the on-image text (if any), aspect ratio 1:1, and the reason it should win.
`);
}

// ---------------------------------------------------------------- E17 Graza, ad image batch (held-out, 2 signals)
export function E17() {
  const T = "E17", B = "Graza";
  csv(T, "past static ad results, last 120 days", B, "Meta static ads, USD.", [
    { concept: "Bottle standing on a counter, studio light", ads: 7, spend: 21000, ctr_link: "0.9%", cost_per_purchase: 34 },
    { concept: "Hand squeezing oil onto food (eggs, pasta, salad), close-up", ads: 6, spend: 19800, ctr_link: "1.8%", cost_per_purchase: 19 },
    { concept: "Illustrated label art, no food", ads: 3, spend: 6300, ctr_link: "1.0%", cost_per_purchase: 37 },
  ]);
  csv(T, "ad comment themes, last 120 days", B, "Themes in comments on Graza ads.", [
    { theme: "I actually use olive oil now / squeeze is so easy", comments: 260 }, { theme: "Which one is for cooking vs finishing?", comments: 142 },
    { theme: "Price", comments: 51 }, { theme: "Is Frizzle olive oil?", comments: 33 },
  ]);
  md(T, "product facts and brief", B, `
# Product facts and owner brief (test data)

- "Drizzle" (finishing, 500 mL) and "Sizzle" (cooking, 750 mL) are extra virgin olive oil in squeeze bottles. "Frizzle" is a high heat blend and is not extra virgin.
- The owner's words: "Give me 5 new static ads for Drizzle and Sizzle for a December test. Feed size."
- Output we need: a short creative brief, then exactly 5 image prompts (one per ad) ready for an image model, each with the on-image text (if any), aspect ratio 1:1, and the reason it should win.
`);
}

// ---------------------------------------------------------------- E18 Taylor Stitch, ad image batch (2 signals)
export function E18() {
  const T = "E18", B = "Taylor Stitch";
  csv(T, "past static ad results, last 120 days", B, "Meta static ads for jackets, USD.", [
    { concept: "Studio shot on white, product only", ads: 6, spend: 22000, ctr_link: "0.7%", cost_per_purchase: 118 },
    { concept: "Worn outside (trail, coast, city in rain), real wear on the fabric", ads: 5, spend: 19400, ctr_link: "1.6%", cost_per_purchase: 64 },
    { concept: "New colour launch, bright background", ads: 3, spend: 8100, ctr_link: "1.0%", cost_per_purchase: 97 },
  ]);
  csv(T, "ad comment themes, last 120 days", B, "Themes in comments on jacket ads.", [
    { theme: "Mine is on year 5, 6, 7 and still going", comments: 198 }, { theme: "Is it waterproof?", comments: 121 },
    { theme: "Fit: does it run big?", comments: 97 }, { theme: "Price", comments: 80 },
  ]);
  md(T, "product facts and brief", B, `
# Product facts and owner brief (test data, figures for this test)

- Long Haul Jacket: heavy cotton canvas with a water-resistant finish. It is not waterproof and has no sealed seams.
- Fit runs a little boxy; the size guide suggests sizing down if between sizes.
- Price $208. Long Haul Guarantee: repairs for the life of the product.
- The owner's words: "5 new static ads for the Long Haul Jacket for December. Feed size. Make them feel like us."
- Output we need: a short creative brief, then exactly 5 image prompts (one per ad) ready for an image model, each with the on-image text (if any), aspect ratio 1:1, and the reason it should win.
`);
}

// ---------------------------------------------------------------- E19 Sleepy Owl, UGC scripts (2 signals)
export function E19() {
  const T = "E19", B = "Sleepy Owl Coffee";
  csv(T, "past video ad results, last 90 days", B, "Instagram Reels ads for Cold Brew Packs, INR.", [
    { hook: "Overnight demo: drop the pack in a jar at night, pour in the morning", ads: 4, spend: 410000, hook_rate_3s: "38%", cost_per_purchase: 210 },
    { hook: "3pm WFH slump, cold brew in 10 seconds from the fridge", ads: 3, spend: 290000, hook_rate_3s: "34%", cost_per_purchase: 240 },
    { hook: "Founder talks about the brand story", ads: 2, spend: 180000, hook_rate_3s: "19%", cost_per_purchase: 520 },
    { hook: "Cafe price comparison graphic", ads: 2, spend: 150000, hook_rate_3s: "27%", cost_per_purchase: 330 },
  ]);
  csv(T, "comment themes, last 90 days", B, "Themes in comments on Reels ads.", [
    { theme: "How much caffeine is in it?", comments: 310 }, { theme: "Smooth, not bitter", comments: 270 },
    { theme: "Can I make it hot?", comments: 120 }, { theme: "Does it help weight loss?", comments: 44 },
  ]);
  md(T, "product facts and brief", B, `
# Product facts and owner brief (test data, check against the public facts)

- One Cold Brew Pack makes about 450 ml, about 3 cups. The brand FAQ gives about 425 mg caffeine per pack.
- Steep 12 to 16 hours in the fridge.
- No health or weight-loss claims are allowed.
- The owner's words: "Write 3 UGC scripts for cold brew packs for Reels. 30 seconds each. For creators to shoot at home."
`);
}

// ---------------------------------------------------------------- E31 Pela, review mining (3 signals)
export function E31() {
  const T = "E31", B = "Pela";
  csv(T, "review themes by month", B, "Review theme counts, printed compostable cases, all models.", [
    { month: "2026-05", reviews: 410, edges_cracking_after_months: 8, prints_love: 96, survived_drops: 41, shipping_delay: 6, magsafe_issue: 22 },
    { month: "2026-06", reviews: 395, edges_cracking_after_months: 11, prints_love: 90, survived_drops: 38, shipping_delay: 5, magsafe_issue: 21 },
    { month: "2026-07", reviews: 420, edges_cracking_after_months: 17, prints_love: 99, survived_drops: 44, shipping_delay: 4, magsafe_issue: 19 },
    { month: "2026-08", reviews: 430, edges_cracking_after_months: 22, prints_love: 101, survived_drops: 40, shipping_delay: 7, magsafe_issue: 20 },
    { month: "2026-09", reviews: 405, edges_cracking_after_months: 26, prints_love: 94, survived_drops: 39, shipping_delay: 5, magsafe_issue: 18 },
    { month: "2026-10", reviews: 440, edges_cracking_after_months: 31, prints_love: 103, survived_drops: 46, shipping_delay: 41, magsafe_issue: 20 },
  ]);
  csv(T, "edge cracking by phone model, may to oct", B, "Reviews that mention edges cracking, by phone model.", [
    { model: "iPhone 16 and 16 Pro", mentions: 88, share_of_that_models_reviews: "9.1%" },
    { model: "iPhone 15 family", mentions: 17, share_of_that_models_reviews: "2.0%" },
    { model: "iPhone 17 family", mentions: 6, share_of_that_models_reviews: "1.4%" },
    { model: "Samsung and Pixel", mentions: 4, share_of_that_models_reviews: "1.1%" },
  ]);
  csv(T, "reviews sample", B, "A sample of recent reviews.", reviews([
    ["2026-10-02", "iPhone 16 Pro case", 2, "Edges started cracking at month 7. Loved it until then."],
    ["2026-10-04", "iPhone 17 case", 5, "Survived three drops on concrete. I was skeptical."],
    ["2026-10-05", "iPhone 16 case", 2, "Corner split after 8 months. Is this normal?"],
    ["2026-10-09", "iPhone 17 Pro case", 5, "The prints are so cute. Bought one for my sister too."],
    ["2026-10-12", "iPhone 15 case", 4, "Two years in, still good."],
    ["2026-10-14", "iPhone 16 Pro case", 3, "Cracked at the button cutout after 6 months."],
    ["2026-10-18", "iPhone 17 case", 1, "Order took 3 weeks. Never again. Posting this everywhere.", { note: "Same customer posted 38 near-identical reviews and comments across models on 18 to 20 Oct" }],
    ["2026-10-21", "iPhone 17 Pro case", 5, "Love that it won't sit in a landfill."],
    ["2026-10-26", "iPhone 16 case", 2, "Edge cracking again. Second case."],
  ]));
  check(sum([8, 11, 17, 22, 26, 31]) > 100, "cracking trend");
  fact(T, "cracking_trend", "8 to 31 per month; iPhone 16 family 9.1% vs 2.0% for 15 family");
  fact(T, "shipping_spike", "41 in Oct, 38 from one customer");
}
