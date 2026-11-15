---
name: long-form-sales-page-for-a-hero-product
description: "Writes a full long-form sales page for the one product that carries the store: 20 headline options with three picked, a lead chosen by the buyer's awareness, the story in the buyer's own words, the failed fixes, one named mechanism, a ranked proof stack, the six objections in the order buyers raise them, the offer and guarantee in plain terms, an FAQ and a two-options close, all in the brand's voice. Reads the market's sophistication from rival pages and writes one stage above it, finds one big idea a buyer would repeat to a friend, and keeps a claims log that ties every line to a file. Gated on gross profit per order, real proof and a desire found in buyers' words. Draft access at most; annabel-landing-pages builds it and nothing goes live without the owner's yes. Use when one hero product makes most of the profit and cold buyers need more than a short product page to believe it."
---

# Long-form sales page for a hero product

**You get:** one long-form sales page written in full, in page order (label line, 20 headlines with three picked, lead, story, failed fixes, mechanism, promise, proof stack, objections, offer, guarantee, FAQ, close and P.S.), a one-screen strategy summary (awareness stage, market sophistication, big idea, mechanism, the one promise), a button and image plan, and a claims log with a source for every line, ready for `annabel-landing-pages` to build.

A short product page works for a buyer who already wants the product. It fails the cold buyer who has tried three fixes, heard every claim and sees a price higher than the rivals'. That buyer needs a reason to believe this one is different, told in their own words, proved with real evidence, with each doubt answered before it turns into a back click. That is a long sales page. It is the oldest format in direct response, and it still sells a hero product when the work is done before the writing starts.

## When to use

- One product makes most of the store's gross profit, and cold paid traffic bounces off its product page while warm traffic buys.
- The product costs more than the rivals and the reason is in how it is made (a cast iron pan, a merino layer, a clinically dosed supplement).
- The market has heard every claim: rival ads all promise the same result, so a bigger claim will not cut through [MCR-6696].
- A long-copy ad or video sales letter works and needs a page that continues it; cold, unaware traffic from long video does better on a long page than on a product page [LPG-6619] [MCR-0033].
- The founder has a real reason the product exists, and buyers keep telling the same story in reviews.

## Not for

- A story told by one real person in editorial style: use `advertorial-story-page`.
- A numbered case of reasons: use `reasons-to-buy-listicle-page`.
- The everyday product page: use `write-product-page-copy`.
- Designing the offer, bundles or guarantee terms: `guarantee-and-risk-reversal` and `offer-bundle-threshold-design` (brendan-offers). This skill writes the words for the offer they designed.
- Building the page in the theme: `page-layout-rebuild` (annabel-landing-pages).
- Building the claims sheet from scratch: `product-claims-profile`.
- Reviewing copy across channels: `team-copy-scorecard-and-ranked-fixes`.
- Matching ads and emails to awareness stage across the funnel: `awareness-stage-message-match`.

## What you need

Required (read access, level 1):

1. **The org context**: voice, words to use and avoid, reading level, buyer types in their own words. If none exists, build it once with `store-meta-brand-dna`.
2. **Product facts and the making of it**: materials or ingredients with amounts, how it is made, what was tried and rejected in development, what the factory does that nobody mentions, sizes, what is in the box, care, warnings, origin.
3. **The claims sheet** from `product-claims-profile`: each claim marked proven, supported, customer-reported or banned, with its file.
4. **Customer words**: a reviews export (aim for 50 or more for the hero product; read the one and two star reviews first), support tickets, chat logs, return reasons, and any "what almost stopped you" survey answers.
5. **The offer** from brendan-offers: price, bundles as checkout shows them, gifts, the guarantee's real terms, delivery and returns.
6. **Gross profit per order** for the hero product (from `build-sku-profit-sheet` or `store-meta-math`).
7. **Three to five rival pages or ads**, as screenshots or text, to read how tired the market is.

Optional: the ad or video that will send traffic, past pages and their results, customer interview transcripts, founder notes, press with the outlet's words.

Access: level 1 to read and write the draft as a file. Level 2 to leave it as a draft in the store or docs. Publishing goes through `annabel-landing-pages` after the owner's yes.

Missing input: ask once, in one short list. Without reviews or tickets, run `customer-interview-script-and-summary` first. Without proof, stop at the gates. Never invent a story, a quote, a number or a result to fill a gap.

## Before you start: the gates

1. **Money gate.** Gross profit per order is known and positive after shipping, fees and returns [MEA-0037]. Fail: stop and send to `build-sku-profit-sheet`. A better page for a product that loses money loses more.
2. **Desire gate.** The want the page sells appears in buyers' words outside the brand's own marketing: in reviews, tickets, forums or interviews [MCR-6700]. Fail: what you have is a product description, not a sales page; go back to research.
3. **Proof gate.** At least one proof from the top four rungs of the ladder exists: a demonstration, third-party verification, a count of specific reviews, or named testimony from someone like the buyer [MCR-6712]. Founder assertion alone fails. Fail: collect proof first, for example by sending the product to about 20 real buyers in exchange for detailed, honest reviews [MCR-6684].
4. **Angle gate.** The angle has sold at break-even or better in an ad to a plain product page, or in an earlier page [LPG-0030]. Fail: write a short version and test the angle first; a long page multiplies a working angle, it does not rescue a wrong one.
5. **Claims and law gate.** Every objective claim needs a reasonable basis before it runs, and "tests prove" or "doctors recommend" needs that level of proof [MCR-6022]. A featured result better than most buyers get must say what buyers generally get [MCR-6025]. No fake, bought or AI-written reviews [MCR-6045]. UK and EU: the CAP Code, CMA guidance and the Unfair Commercial Practices Directive apply the same ideas, and green claims need a specific, whole-life basis. Deadlines and stock lines only when true. Health, money and legal claims get a qualified person's check. Fail: drop or narrow the claim.

## Steps

### 1. Run the five research hunts

Read the customer words by hand and paste exact phrases into five columns, each feeding one part of the page [MCR-6699]:

| Hunt | What to look for | Feeds |
|---|---|---|
| The accommodation | What the buyer changed in their life to live with the problem | The story and problem |
| The failed solution | What they tried, what it cost, why they quit | The failed fixes and "it won't work" |
| The nearly didn't buy | The last doubt before they paid | Risk reversal and guarantee |
| The word | The word or phrase buyers repeat most | Headline and hook |
| The moment | What happened just before they went looking | Lead and urgency |

Search the text for "but", "however", "worried", "almost", "wasn't sure" and "finally"; those words sit next to doubts and payoffs. Count each theme. A theme needs 3 or more mentions to lead a section; the counts stay in your notes, not in the copy. Write problems in the buyer's words, not the category label: "I can see my scalp", not "hair thinning" [MCR-6731].

### 2. Place the buyer and the market

**Awareness.** Decide what the traffic for this page already knows: unaware, problem aware, solution aware, product aware or most aware. Take it from the traffic source (cold prospecting, search terms, email segment) using `awareness-stage-message-match`. Write the stage on the brief; copy that mixes stages confuses everyone [MCR-6719].

**Sophistication.** List the main claim of each rival page or ad. Then place the market [MCR-6696] [ADC-0001]:

| Market stage | What rivals say | What our page must do |
|---|---|---|
| 1. New | Nobody makes the claim yet | State the promise plainly and first |
| 2. Claims growing | Everyone makes it, louder | Make it more specific or bigger, only within proof |
| 3. Claims doubted | Buyers no longer believe the promise | Lead with a new mechanism: why this works |
| 4. Mechanisms everywhere | Every rival explains how | A sharper or more specific mechanism |
| 5. Nothing believed | Buyers trust none of it | Sell who the buyer becomes, through the mechanism |

Write one stage above where rivals sit. Most hero products in crowded markets land at stage 3 or 4.

**Lead type.** Pick the opening from the awareness stage, then check you hold what it needs:

| Awareness | Lead to start with | Only if you have |
|---|---|---|
| Most aware | Offer: the deal and what it is worth | A real offer with full terms |
| Product aware | Promise: the biggest benefit you can back, proved in the next line | A fact that backs it |
| Solution aware | Promise or problem-solution | Buyer words for the problem |
| Problem aware | Problem-solution or secret: a little-known, checkable fact | A real fact from your proof |
| Unaware | Secret, proclamation (a bold, true claim read like news) or story | A recorded real event or buyer scene |

When the market is at stage 3 or higher, step one row colder than the awareness alone suggests.

### 3. Find the big idea and the mechanism

**Mechanism.** Every physical product has one: the reason a feature produces the promise [MCR-6695]. Ask three questions of the maker: what do you do that you think is boring, what did you reject during development, and what limit did the product force on you that you have never mentioned [MCR-6725]? A process every rival also uses can still be yours if nobody says it. Name it in two to four words a buyer could repeat. A contradiction such as "all the energy, none of the crash" is not a mechanism until the next line says why it is true [MCR-6683].

**Feature chain.** For each feature write: feature, which means the promise, because the mechanism [MCR-6704]. A feature with no promise is cut or moved to the details.

**One promise.** State what the buyer gets in one sentence. Avoid the four failures: no promise, five promises, a feature posing as a promise, or a promise bigger than the proof; a smaller promise you can prove beats a bigger one you cannot [MCR-6706].

**Big idea.** One sentence that joins the desire, the mechanism and the reason it matters now. Test it three ways: would a buyer repeat it to a friend; could the product next to yours on the shelf say it word for word [MCR-6689]; and does asking "so what?" of it end at the buyer's life, not the product [MCR-6716]? If a "why now" is used, tie it to a worry most buyers already share, not a fringe one [MCR-0004].

### 4. Build the proof stack and the claims log

Rank the proof you hold, strongest first: demonstration, third-party verification, count of specific reviews, named testimony from someone like the buyer, mechanism explanation, founder assertion [MCR-6712]. Replace every adjective with a checkable specific: a measured number, a named third party, a physical detail, a time or a proper noun [MCR-6713]. A counted specific can work as proof when the count is the claim, such as the review total and the word buyers use most [MCR-6714].

Put each proof directly under the claim it backs, then a second proof of a different kind. Start the claims log now: Line, Claim, Proof file, Status (proven, supported, customer-reported), Typical-results line needed (yes or no).

### 5. Rank the objections

Most buyers' doubts fall into six, and they come in this order [MCR-6698]:

| Objection | Answered by |
|---|---|
| Not for me | The buyer's own words and situation in the lead |
| It won't work | The mechanism and its proof |
| It won't work for me | Proof from people like this buyer |
| Not worth it | The offer, what it replaces and what doing nothing costs |
| What if I'm wrong | The guarantee in plain terms |
| I'll do it later | A true reason to act now, or none |

Answer each where it arises in the reading, not in the FAQ. Answer a doubt through an experience buyers already had ("you will feel it on day three, everyone does, so the first week is a half dose") rather than a generic reassurance [MCR-6709]. Doubts buyers will not admit (feeling lazy, feeling old) are answered without naming them. When price is the main doubt on a premium product, say the price and why plainly, early [MCR-6651].

### 6. Write the page in order

Draft in sections of 400 to 800 words; a long page in one go gets cut short.

1. **Label line** over the headline, naming who it is for in their words.
2. **Headline and deck.** Leave the final pick to step 8; write a working line now.
3. **Lead** (150 to 400 words), in the lead type from step 2. Its first sentence carries the reward or makes the next sentence impossible to skip. Do not name the product yet.
4. **The problem as a scene**, from the accommodation and the moment, in the buyer's words.
5. **What they tried and why it failed**, each fix with what it cost in money or time. Name fixes by category unless the statement is factual and fair.
6. **The mechanism**: the cause the old fixes missed, then how this works on it. Name the product only after the mechanism has landed [MCR-6691].
7. **The promise as scenes**: what the buyer can now do, not a list of results [MCR-6613].
8. **The proof stack** from step 4, each proof under its claim.
9. **Objections** in the order from step 5, woven through the proof.
10. **The offer**: what they get item by item, the price against a true, named alternative, bundles exactly as checkout shows them, savings as money amounts [LPG-0035].
11. **The guarantee** in brendan-offers' real terms: window, condition, who pays return postage, refund time.
12. **FAQ**: 6 to 10 questions taken from tickets and reviews, answers of one to three sentences.
13. **Close**: two options, keep the old way or try this with the risk removed [LPG-0054], ending on an identity line tied to the mechanism [MCR-6694].
14. **P.S.** restating the promise and the guarantee in two lines.

Buttons: the first after the offer is introduced, then after the proof, after the guarantee and at the close, each with risk reducers in the line under it [LPG-0038]. A small "skip to the offer" link near the top serves returning visitors. Length follows the ad: an ad that sold little needs a long lead before the product appears, about half the page; a long ad that already sold the idea needs a short one [LPG-0029]. Practitioner default for cold traffic, test it: 2,500 to 5,000 words.

### 7. Edit it like a copy chief

- Set the sentence choices: second person for the page, first person past tense for stories, present tense for the mechanism, varied length, contractions, reading level under grade 7 for general buyers [MCR-6717] [LPG-0047].
- Mark every bridge where the reader goes from story to pitch; the sense of being sold rises slowly or the reader leaves there [MCR-6738] [MCR-0027] [LPG-0012].
- Cut every line a rival could sign [MCR-6689]. Ban "it's not X, it's Y" lines [MCR-0016].
- Read it out loud at real pace and fix every stumble [MCR-6730].

### 8. Write the headline last

Write 20 headlines across the lead types that fit, using the word from step 1. Score each: does it pick out the right buyer read alone, does it promise a clear reward, is every number from the proof, and is any curiosity tied to what the product delivers. Pick three with different appeals and say why. The headline the ad traffic sees repeats the ad's promise in the ad's words, so the click and the page agree [LPG-0067] [ADC-6218].

### 9. Hand it over

Send the page, the button and image plan, and the claims log to the owner. Each image shows what the paragraph above it says, real or clearly a product image. The claims log goes to meenakshi-compliance; the build goes to `annabel-landing-pages`; ad cuts go to kofi-ad-copy. One line on what to watch: gross profit per session against the product page for the same ad [LPG-0026].

## Checks before you hand it over

- The one promise appears in at least 3 buyer mentions and on the claims sheet.
- Awareness stage and market stage are written on the summary, with the evidence.
- The mechanism is named in two to four words and matches the cause one to one.
- The product is not named before the mechanism lands.
- Every claim, number and quote has a file in the claims log; atypical results carry a typical-results line.
- The six objections are each answered, in order, before the FAQ.
- No line a rival could sign word for word; no "it's not X, it's Y".
- Offer, bundles, savings and guarantee match checkout and the policy pages.
- No invented person, review, result, deadline or stock line. No placeholder in the copy.
- Three headlines picked with reasons; the ad traffic's headline uses the ad's words.
- Nothing published or sent without the owner's yes.

## Output

**One-screen summary first:** awareness stage and evidence; market stage and the rival claims behind it; the big idea in one sentence; the mechanism name; the one promise; the three headlines picked and why; any assumption that changed the page (one line each, at most three).

**The page, in order:** label line, headline and deck, lead, story, failed fixes, mechanism, promise, proof, objections, offer, guarantee, FAQ, close, P.S., with buttons marked where they sit.

**Headlines:** all 20, each with its lead type, and the three picked.

**Claims log:** Line, Claim, Proof file, Status, Typical-results line.

**Image plan:** Section, What the image shows, Real photo or product image.

## Common mistakes

- **Writing before the research.** Step 1 banks the buyer's words first; most of the work is done before the first sentence.
- **A bigger claim in a tired market.** Step 2 reads the market stage and moves to a mechanism.
- **Five benefits and no promise.** Step 3 picks one promise smaller than the proof.
- **"We have no mechanism."** Step 3 finds it in how the product is made.
- **Naming the product too early.** Step 6 waits until the mechanism lands, so the buyer does not file it with the cheap ones.
- **Objections in the FAQ only.** Step 5 answers each where it arises.
- **Customers love it.** Step 4 swaps praise for a specific, counted or named proof.
- **A page that does not continue the ad.** Step 8 carries the ad's words into the headline.

## Sources

- MEA-0037: gross margin is the delivered cost to the door.
- MCR-6700: the desire must exist in buyers' words.
- MCR-6712, MCR-6684: the proof ladder; seeding real testers.
- LPG-0030: build long pages only after the angle breaks even.
- MCR-6022, MCR-6025, MCR-6045: US claims basis, typical results, fake review ban.
- MCR-6699, MCR-6731: the five research hunts; problems in buyer words.
- MCR-6719, MCR-6696, ADC-0001: one stage per piece; market sophistication; match the lead to the market.
- MCR-6695, MCR-6725, MCR-6683, MCR-6704: every product has a mechanism; the unsaid process; contradictions; the feature chain.
- MCR-6706, MCR-6689, MCR-6716, MCR-0004: one promise; shelf test; so what; why now.
- MCR-6713, MCR-6714: specifics over adjectives; counted proof.
- MCR-6698, MCR-6709, MCR-6651: six objections in order; pre-empt through experience; admit the price.
- MCR-6691, MCR-6613, MCR-6694: name the product after the mechanism; outcomes as scenes; identity close.
- LPG-0035, LPG-0054, LPG-0038, LPG-0029: savings as money; two-options close; risk reducers under buttons; lead length.
- MCR-6717, LPG-0047, MCR-6738, MCR-0027, LPG-0012, MCR-0016, MCR-6730: sentence rules, reading level, bridges, pitch creep, AI patterns, read aloud.
- LPG-0067, ADC-6218, LPG-0026: carry the ad's words; one claim across ad and page; judge against the product page.
- LPG-6619, MCR-0033: long pages for cold, long-video traffic.

What makes this skill ours: the research and placement come before a word is written; the market's tiredness sets the lead, not taste; one promise smaller than the proof; the mechanism dug out of how the product is really made; objections answered in the order buyers raise them; and every line tied to a file in the claims log.

## Selling in India

- ASCI's code also requires claims to be substantiated and testimonials to be genuine; health claims need extra care.
- Put cash on delivery, delivery time and the returns rule near every button, and show MRP inclusive of taxes in the offer block.
