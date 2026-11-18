# Foundation first: the org context

The org context is one home for what every agent must know about a business: `context/org-context/` in the owner's own project (it was called the brand brain and the brand file; an older `context/brand-file/` still works, and `node tools/org-context.mjs migrate` moves it). Every agent applies its knowledge, its rules and its craft's best practice to it. It is data: it never loosens `METHOD.md` or `AGENTS.md`.

Use the task's **Foundation** kind from `toolbox.md` for org-context commands when one is supplied; keep its copy/email family for job and quality checks. `support` (also `customer_response`) requires customer-talk, claims, do's/don'ts and source records. `proposal` also requires brand DNA. Neither needs ad results, design rules, avatars or a 40-line marketing voice bank. Ask for the supplied case or buyer brief, approved policies and communications, relevant commercial terms, privacy limits and authorization for promises. Public pages cannot establish private case facts or owner approval.

The overall score remains a measure of the whole org context. The existing minimum counts and dated-review checks still govern foundation readiness; do not pad them with invented examples. A sparse but sufficient case record can support a **private restricted draft** while the foundation gate remains failed: use verified task facts, retain every restriction, omit unresolved/revoked claims and identify the exact gaps. Pass actual dependency keys with `--keys` and the trusted owner/workspace identity. `local_draft_allowed` is conditional drafting guidance, never permission to send, refund, promise or change a policy. A passing foundation gate also grants none of those permissions. Unknown job names retain the conservative buyer-facing requirements.

| Section | File in `context/org-context/` | What it holds |
|---|---|---|
| 1. Brand DNA | `foundation/brand-dna.md` | What the business is and stands for: its mission, 3 to 5 pillars in its own words, its personality, its story, what must never change |
| 2. Customers and avatars | `foundation/customers.md`, `foundation/why-they-buy.md` | 2 to 5 avatars from evidence, with their words, what they buy and for what occasion, what stops them; reasons and objections counted from reviews |
| 3. Voice and writing style | `foundation/voice-bank.md`, `voice.md` | Real lines by kind, the brand's own words and never-words, sentence length, reading level, language mix |
| 4. How we speak to customers | `foundation/customer-talk.md` | By channel (ads, site, email and SMS, support replies, social comments, chat): how they address, greet and sign off, how formal, how they say sorry or no |
| 5. Design language | `foundation/design.md`, `look.json` | Fonts by role, colours with their share, the logo and its place, layout, imagery and framing, the look of the ads |
| 6. Markets | `foundation/markets.md` | Countries and regions, languages, currency, channels, seasons and occasions, local rules |
| 7. Claims allowed and banned | `foundation/claims.md` | Each claim with the proof it needs and the proof on file (source, date); banned claims and why; offers allowed and the most discount |
| 8. Do's and don'ts | `foundation/dos-donts.md` | One rule a line, each with its source |
| Facts and offers | `facts.json`, `offers.json` | Lasting facts and proof; prices, promotions, stock and shipping (fresh for 7 days) |
| References and results | `references.md`, `worked.md` | Sites admired, avoided and competing; what the client kept, killed or asked for more of |
| Data | `data/segments.md`, `data/creatives.md`, `data/funnel.md` | Who pays, what won and lost, the biggest funnel leak (fresh for 30 days) |
| Sources | `sources.md` | Every source: provided, public or no access, with its date |

`index.md` is the one screen, and `history/` keeps old versions. Store numbers and lessons are not copied in: they live in `context/MEMORY.md` (MEMORY-TEMPLATE.md). `node tools/org-context.mjs template` prints these sections to fill by hand where Node cannot run. Files made before the rename keep working: `messaging.md` is read as `claims.md` and `personas.md` as `customers.md`.

Good work for a business stands on two layers. Build them once, check them every job, and refresh only what is stale. A job that skips them writes like a stranger.

- **Foundation:** sections 1 to 8 above: who the business is, how it talks and looks, what it can claim, where it sells, who buys and why. Slow to change (90 days).
- **Data:** what the numbers say: who pays, where money is over or under spent, what won and what lost. Fast to change (7 to 30 days).

They feed each other: the data says which buyer pays; the foundation says how to speak to them. Use them together: the numbers pick who and what, the foundation sets how it sounds and looks, and the facts and rules keep it true.

## 0. Scope the inputs to the job

The more you know about the task and the business, the better the work, up to the point where more stops changing what you make. So gather only what changes this job's output. Never build the whole org context by habit.

| The job | Gather | Skip |
|---|---|---|
| An analysis or report (for example the last 30 days of Meta results) | Where the data lives, how each number is defined, the period, the decision it feeds, how the reader wants to see it | Voice, design, avatars |
| An audit or plan | The data layer, the goal, the limits, the claims and proof, the markets | Design, most of the voice bank |
| Copy or emails | Brand DNA, voice, customer words, how they speak to customers, claims and proof, customers and avatars, dos and don'ts | Design, unless the email has layout |
| Ads, creatives, a page, a campaign or a creative strategy | Everything: both layers | Nothing |
| Code, operations, internal docs | The system, the rules, the files | The org context |

`node tools/org-context.mjs check --for <kind>` marks each part this kind of job does not need. Ask only about parts it needs.

## What the two layers mean for each kind of business

| Business | Foundation: talk, look, proof, buyers | Data: who pays and what works |
|---|---|---|
| E-commerce and D2C | Site, ads, emails, captions, reviews; product photos; avatars from reviews and segments | Ad account by age, gender, region, placement; store orders, AOV, repeat rate |
| SaaS and software | Site, docs, changelog, sales decks, reviews on G2 or Capterra, support tickets | Sign-ups, trials, activation, churn and MRR by plan, channel and company size |
| Education and courses | Course pages, emails, webinar scripts, student reviews and results | Leads, enrolments, completion and refunds by course, channel and cohort |
| Creators and media | Posts, captions, scripts, comments, the creator's own phrases | Views, watch time, followers and sales by format, topic and platform |
| Services, agencies and B2B | Site, case studies, proposals, LinkedIn posts, client words | Leads, win rate, deal size and cycle by source, industry and service |
| Local businesses | Google profile, reviews, menus or price lists, signage, photos | Calls, bookings, visits and reviews by location, day and source |

The parts and tools are the same for all of them. `org-context.mjs segments` reads any breakdown with a cost and a revenue column (ad account, store, CRM or billing exports). Where a business has no ads, its data layer is its sales or usage data.

## 1. Gather before you build

1. **Look first.** Files they attached, the project folder, a claude.ai Project's files, earlier work in this chat, and an org context saved to their AI Blocks account. Use what you find; never ask for it again.
2. **Ask once for what is missing** (`METHOD.md` step 0). In a coding app, `node tools/org-context.mjs ask --for <kind>` writes the questions. Without the tool, ask:
   - Do you have an org context (a brand guide, brand file or folder about your business)? If yes, attach it or paste a link. If no, I will build one and keep it.
   - What do you already have: old ad copy, a creative folder or Drive link, email exports, a reviews export? Or say "use public".
   - For the numbers: read access to the ad account or store data, an export, or none.
   - Anything I must never say or show, and the most discount I may offer?
3. **Test every link.** If one does not open, say which and how to share it, once. Then fall back.
4. **Fall back in this order** when they share nothing: the website, the Meta Ad Library, Instagram, public reviews. Mark each line "public". Record every source: `node tools/org-context.mjs source <what> <where> --status provided|public|no-access`.
5. **If they have an org context already** (or a brand brain, brand file or guide by any name), check it (`node tools/org-context.mjs check --for <kind>`), show the score and gaps, and ask once: improve it in place, or make a copy and improve that.

## The fast way: build, write, gate

For buyer-facing work, before any analysis or copy:

1. `node tools/org-context.mjs build --from <the folder with their material>` reads saved site pages, Ad Library and past ads, reviews, account breakdowns and the funnel in one go. Point `--site` at saved pages if they sit elsewhere.
2. Write the files it starts (`brand-dna.md`, `customers.md`, `customer-talk.md`, `design.md`, `markets.md`, `claims.md`, `dos-donts.md`) from what it built and what the owner gave you. This is the thinking: the work stands on it.
3. `node tools/org-context.mjs gate --for <kind>` must say pass. On a long job with many parts, this still comes first: the creatives, page and emails all read it.

## 2. The foundation layer

| Part | What good looks like | How to fill it |
|---|---|---|
| Voice bank | 40+ real lines, word for word, by kind: site, ad headline, ad text, email, caption, customer words. The brand's own words, words it never uses, sentence length, language mix | `capture-brand-dna.mjs` for the site; `org-context.mjs ads <file> --source library` for the Ad Library, `--source account` for past ads |
| Why they buy | Reasons, occasions and objections, counted from reviews and comments, with their words | `org-context.mjs reviews <file>` |
| Brand DNA | Mission in one line; 3 to 5 pillars in the brand's own words; its personality; its story; what never changes | Write `foundation/brand-dna.md` from the about page, the founder story, facts.json and the owner |
| Claims allowed and banned | Each claim with the proof it needs and the proof on file (source and date); banned claims and why; offers allowed and the most discount | Write `foundation/claims.md` from facts.json, the site and the ads |
| Customers and avatars | 2 to 5 avatars, each built from evidence (reviews, segments, store data), with the words they use and what they buy for | Write `foundation/customers.md`, one `## Name` per avatar, each citing its numbers and quotes |
| Design language | The look of the site AND of the ads: fonts by role, colours with their share, the logo and where it sits, layout, how much text and where it sits, product framing, model or flat lay | `look.json` plus the ad images; write `foundation/design.md` with numbers, not adjectives |
| How we speak to customers | By channel (ads, site, email and SMS, support replies, social comments, chat): how they address customers, greet and sign off, how formal, how they say sorry or no, the words they use for customers. Each rule from a real reply | Write `foundation/customer-talk.md` from support replies, emails and comment replies the owner shares |
| Markets | Each market: country or region, language, currency, channels (own store, marketplaces, shops), seasons and occasions, local rules | Write `foundation/markets.md` from the site (shipping, currency, languages), orders by country and region, and `data/segments.md` |
| Dos and don'ts | Lines like `- Never: "cheap"` or `- Do: show the hallmark`, each with where it came from | Write `foundation/dos-donts.md`; quote never-words so voice-check can catch them |

## 3. The data layer

With read access or an export, pull 12 months (or what exists) and keep dated copies in `context/data/`:

- Results by age x gender, region, placement, device and format: `node tools/org-context.mjs segments <csv>`. It writes spend share, revenue share and a ROAS index per segment, and flags under-spent winners and over-spent segments.
- Ad results joined to their copy: `node tools/org-context.mjs creatives <ad results> --copy <creatives>`. Then write the pattern the winners share, with the ads it comes from.
- The funnel, from click to purchase, with the biggest leak: `data/funnel.md`.

No access and no export: say so in one line, and build from public data only.

## 4. Build on top: every piece has a reason

- **Plan from the numbers.** For a set of creatives, emails or tests, `node tools/org-context.mjs plan --n <count>` splits the set across segments: most to proven segments, a share to under-spent winners, about 15% to tests. Fill each row: segment, the number, persona, insight in their words, angle, format, proof line with its source, hook. A piece with no insight is cut. Never make a random batch.
- **Speak to the segment.** For a segment, change the occasion, the product, the proof, the words and the picture, using that avatar's evidence. Example: if women 45 to 54 in the north pay best, show the pieces they buy, the occasions they name in reviews and the words they use.
- **Local and seasonal moments.** For each region or season the data names, give at least one piece a moment those buyers know: a festival, a wedding or exam season, the local weather, a store they can visit. If a large share of spend goes to a group that buys for someone else (for example men buying gifts), give them their own angle.
- **Native formats, in proportion.** A set of ads needs some that look like what people read in a feed, not only product posters: a notes list, a chat, a comparison table, an explainer, a review card. In a set of 10 or more, use at least 3 of these, each tied to a segment and its objection. In any set, keep at least half image-led: the product, or a real person wearing or using it, is the hero. A set of 5 made mostly of text cards reads as homework, not as ads. A text card carries 40 words or fewer on the image; move the rest to the ad text. Name a segment for every piece, and cover at least 2 in a set of 5 or more. No two pieces share both an angle and a format.
- **Not only cold prospecting.** In a set of 5 or more, make at least one piece for people who already know the store, and mark it `funnel: "retargeting"` (cart and site visitors, past buyers, with a reason to come back). Or make one that carries a real offer from the store, such as a payment plan, a gift or free shipping, with its terms in `offer_terms`. A set that is all first-touch ads leaves the warmest buyers with nothing.
- **Words come from the bank.** Hooks start from customer words or a proven ad line. Match the brand's sentence length and words. Then run `node tools/org-context.mjs voice-check <draft> --ads` and fix every FAIL.
- **Check every absolute claim.** "Every", "all", "100%", "guaranteed" and "the only" must be true across the whole range, including any lab-grown, budget or sale line. Name the source, or soften the line. "Every stone we set is natural" is false for a store that also sells lab-grown diamonds.
- **Check every store promise against its terms.** A buyer holds the store to each one, so each one goes in the manifest with its source:
  - A date ("Wedding in February?", "by Diwali") needs `timing_check`: work out when the buyer really gets it. A plan that ships after the last of 6 monthly payments cannot promise a February wedding.
  - A pay-later line (EMI, "pay monthly", "6 x ₹2,817") needs `offer_terms`. If the plan ships only after the last payment, the ad says so.
  - A ranking ("#1", "Top 3", "bestseller", "most added") needs a `claim_source` that quotes the store's own tag, with the date checked.
  - A measured spec (5.24 g, 2 ct, 500 ml) needs `spec_source` saying what it measures: gross or metal weight, net volume.
  - A policy (refund, free shipping, COD, 7-day returns) needs `policy_source` with its conditions, such as who pays return shipping.
  - "20% off" needs a `compare_at` price that makes it true.
  - A review quote is word for word from `review.source_text`, with any cut marked by "…".
  - Every price needs `price_checked` (a date within 7 days) and the product in stock.
- **Photos.** Real product photos first. If an image model restages a product photo, name it in `source_photo` and compare the piece stone by stone, link by link. The image model never draws people with the product; use the brand's real model photos for that. Never crop through a face or the product: keep the whole head, or crop below the chin. In the manifest, list every face that shows as `faces: [[x, y, w, h]]` (or `faces: []` when none does), and give `photo_box` when the photo sits in a panel. The checker fails a face cut by the frame or by its photo's edge, and a button that sits on a face.
- **Text on images is set, never drawn.** Use real product photos from the site, the catalogue or past ads. An image model may make only the scene or background, with no words in it. Put every word on in the brand's fonts with HTML, then render (`tools/quality/render.cjs`) and check size, contrast and the safe zones. Then check each one: the product fills at least a third of the frame and is the piece the copy names; no watermark, logo or text from the source photo is left in the crop; a review quote sits only on the product it is about; and a set of 10 or more uses at least 4 distinct layouts, none on more than 30% of the set, matched to the formats that won in `data/creatives.md`. Write `manifest.json` beside the images (layout, format, angle, product, product_box, headline, body, cta, cta_box, price, price_checked, in_stock, review, segment, moment, the sources and terms above, faces, photo_box, funnel, and `ad` with primary_text, headline, description and url) and run `node tools/check-creative-set.mjs <folder> --domain <store domain>`: it reads the layouts and the buttons from the pixels, so a set that repeats one template or leaves the button off fails even when the plan said otherwise. Fix every FAIL and run it again.
- **Check how the type renders.** Before the check above, run `node tools/check-creative-set.mjs probe <folder of creative .html files> --out <creatives folder>/type-report.json` (or call its `typeProbe` in your own renderer). It reads each page in a browser. It fails:
  - a font that did not load;
  - a headline where pairs like "Wo" or "We" print no tighter than the other letters (it reads "W orn now"). It reads where each letter lands, so a hand fix with letter-spacing counts;
  - a hairline face, whose thin strokes are under a fifth of the thick ones, at 30px and up. Didone hairlines vanish on a phone;
  - a number like 15,710 set in a face whose comma is nearly all dot (it reads 15.710);
  - text under 18px on a 1080 frame;
  - text against a solid backdrop under 4.5:1 contrast (3:1 at 48px and up);
  - more than 50 words on one image;
  - a photo drawn more than 1.3x its own pixels (it looks soft).

  For headlines, use the site's own heading font, even when the brand's ads use a face you cannot get. A "closest open" stand-in for an ad font is a last resort, only if it passes this check, and never a hairline face. Pass the brand's fonts with `--fonts "Lato,Nanum Myeongjo"`. Then open every creative at full size and read each headline letter by letter.
- **Ready to upload.** Each ad's `url` opens the product or collection page on the store's own domain and carries utm_source, utm_medium, utm_campaign and utm_content (utm_content is the creative's file name). The first line of the primary text holds the hook within 125 characters. `ad.headline` is 40 characters or fewer, and the description 30. The on-image headline is 10 words or fewer. Then run `node tools/check-creative-set.mjs match <folder>`. It opens each landing page and fails one that does not name the product or show the price the ad shows.
- **Built to sell.** Each ad has a hook in the first line, one proof, the offer if there is one, and one clear action. Draw the action as a button on the image, copied from the brand's own button in its real ads (shape, colour, words), with a tight `cta_box` around it in the manifest. Leave it off only when the brief says so. Each page has the promise, the proof and the action on the first phone screen.
- **A decision trace.** With the work, in your own message, list for each piece the segment, the number and the org context lines it used.

## 5. Knowledge: when and how much

| Moment | Pull from the knowledge library | Never from it |
|---|---|---|
| Planning | The playbook for this job type: 3 to 6 passages (`node tools/ask-knowledge.mjs "<question>"`) | Brand voice, brand facts |
| Reading numbers | Benchmarks and decision rules (learning phase, frequency, attribution) | The client's own numbers |
| Checking | Platform specs and policy rules | Copy lines to reuse |

More passages pull the voice toward average. Keep knowledge to rules and numbers, and keep it out of the copy. Cite what you used.

## 6. Keep it and improve it

- Save the org context in `context/org-context/` where you can write files, and say where you saved it. Where you cannot (a chat app), hand over the memory packet (MEMORY-TEMPLATE.md) and say it is not saved until the owner keeps it. With the owner's yes, it can also be kept on their AI Blocks account for the team.
- After the job: `node tools/org-context.mjs learn --job "<job>" --kept "<...>" --killed "<...>" --more "<...>"`, and update the data layer when new results arrive.
- One-shot jobs (nobody can reply) still build both layers from the material on hand before making anything buyer-facing. Only the questions are skipped.
