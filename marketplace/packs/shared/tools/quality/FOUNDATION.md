# Foundation first

Good work for a business stands on two layers. Build them once, check them every job, and refresh only what is stale. A job that skips them writes like a stranger.

- **Foundation:** how the business talks and looks, what it can claim, who buys and why. Slow to change (90 days).
- **Data:** what the numbers say: who pays, where money is over or under spent, what won and what lost. Fast to change (7 to 30 days).

They feed each other: the data says which buyer pays; the foundation says how to speak to them. Use them together: the numbers pick who and what, the foundation sets how it sounds and looks, and the facts and rules keep it true.

## 0. Scope the inputs to the job

The more you know about the task and the business, the better the work, up to the point where more stops changing what you make. So gather only what changes this job's output. Never build the whole brain by habit.

| The job | Gather | Skip |
|---|---|---|
| An analysis or report (for example the last 30 days of Meta results) | Where the data lives, how each number is defined, the period, the decision it feeds, how the reader wants to see it | Voice, design, personas |
| An audit or plan | The data layer, the goal, the limits, the messaging and proof | Design, most of the voice bank |
| Copy or emails | Voice, customer words, messaging and proof, personas, dos and don'ts | Design, unless the email has layout |
| Ads, creatives, a page, a campaign or a creative strategy | Everything: both layers | Nothing |
| Code, operations, internal docs | The system, the rules, the files | The brand brain |

`node tools/brand-brain.mjs check --for <kind>` marks each part this kind of job does not need. Ask only about parts it needs.

## What the two layers mean for each kind of business

| Business | Foundation: talk, look, proof, buyers | Data: who pays and what works |
|---|---|---|
| E-commerce and D2C | Site, ads, emails, captions, reviews; product photos; personas from reviews and segments | Ad account by age, gender, region, placement; store orders, AOV, repeat rate |
| SaaS and software | Site, docs, changelog, sales decks, reviews on G2 or Capterra, support tickets | Sign-ups, trials, activation, churn and MRR by plan, channel and company size |
| Education and courses | Course pages, emails, webinar scripts, student reviews and results | Leads, enrolments, completion and refunds by course, channel and cohort |
| Creators and media | Posts, captions, scripts, comments, the creator's own phrases | Views, watch time, followers and sales by format, topic and platform |
| Services, agencies and B2B | Site, case studies, proposals, LinkedIn posts, client words | Leads, win rate, deal size and cycle by source, industry and service |
| Local businesses | Google profile, reviews, menus or price lists, signage, photos | Calls, bookings, visits and reviews by location, day and source |

The parts and tools are the same for all of them. `brand-brain.mjs segments` reads any breakdown with a cost and a revenue column (ad account, store, CRM or billing exports). Where a business has no ads, its data layer is its sales or usage data.

## 1. Gather before you build

1. **Look first.** Files they attached, the project folder, a claude.ai Project's files, earlier work in this chat, and a brand brain saved to their AI Blocks account. Use what you find; never ask for it again.
2. **Ask once for what is missing** (`tools/quality/INTAKE.md`). In a coding app, `node tools/brand-brain.mjs ask --for <kind>` writes the questions. Without the tool, ask:
   - Do you have a brand brain (a brand file, guide or folder)? If yes, attach it or paste a link. If no, I will build one and keep it.
   - What do you already have: old ad copy, a creative folder or Drive link, email exports, a reviews export? Or say "use public".
   - For the numbers: read access to the ad account or store data, an export, or none.
   - Anything I must never say or show, and the most discount I may offer?
3. **Test every link.** If one does not open, say which and how to share it, once. Then fall back.
4. **Fall back in this order** when they share nothing: the website, the Meta Ad Library, Instagram, public reviews. Mark each line "public". Record every source: `node tools/brand-brain.mjs source <what> <where> --status provided|public|no-access`.
5. **If they have a brain already,** check it (`node tools/brand-brain.mjs check --for <kind>`), show the score and gaps, and ask once: improve it in place, or make a copy and improve that.

## The fast way: build, write, gate

For buyer-facing work, before any analysis or copy:

1. `node tools/brand-brain.mjs build --from <the folder with their material>` reads saved site pages, Ad Library and past ads, reviews, account breakdowns and the funnel in one go. Point `--site` at saved pages if they sit elsewhere.
2. Write the four files it starts (`messaging.md`, `personas.md`, `design.md`, `dos-donts.md`) from what it built. This is the thinking: the work stands on it.
3. `node tools/brand-brain.mjs gate --for <kind>` must say pass. On a long job with many parts, this still comes first: the creatives, page and emails all read it.

## 2. The foundation layer

| Part | What good looks like | How to fill it |
|---|---|---|
| Voice bank | 40+ real lines, word for word, by kind: site, ad headline, ad text, email, caption, customer words. The brand's own words, words it never uses, sentence length, language mix | `capture-brand-dna.mjs` for the site; `brand-brain.mjs ads <file> --source library` for the Ad Library, `--source account` for past ads |
| Why they buy | Reasons, occasions and objections, counted from reviews and comments, with their words | `brand-brain.mjs reviews <file>` |
| Messaging | 3 to 5 pillars; a proof bank where every claim has a source; offers allowed; claims not allowed | Write `foundation/messaging.md` from facts.json, the site and the ads |
| Personas | 2 to 5 buyers, each built from evidence (reviews, segments, store data), with the words they use and what they buy for | Write `foundation/personas.md`, one `## Name` per persona, each citing its numbers and quotes |
| Design | The look of the site AND of the ads: how much text, where it sits, product framing, model or flat lay, the fonts and colours ads use, logo place | `look.json` plus the ad images; write `foundation/design.md` with numbers, not adjectives |
| Dos and don'ts | Lines like `- Never: "cheap"` or `- Do: show the hallmark`, each with where it came from | Write `foundation/dos-donts.md`; quote never-words so voice-check can catch them |

## 3. The data layer

With read access or an export, pull 12 months (or what exists) and keep dated copies in `context/data/`:

- Results by age x gender, region, placement, device and format: `node tools/brand-brain.mjs segments <csv>`. It writes spend share, revenue share and a ROAS index per segment, and flags under-spent winners and over-spent segments.
- Ad results joined to their copy: `node tools/brand-brain.mjs creatives <ad results> --copy <creatives>`. Then write the pattern the winners share, with the ads it comes from.
- The funnel, from click to purchase, with the biggest leak: `data/funnel.md`.

No access and no export: say so in one line, and build from public data only.

## 4. Build on top: every piece has a reason

- **Plan from the numbers.** For a set of creatives, emails or tests, `node tools/brand-brain.mjs plan --n <count>` splits the set across segments: most to proven segments, a share to under-spent winners, about 15% to tests. Fill each row: segment, the number, persona, insight in their words, angle, format, proof line with its source, hook. A piece with no insight is cut. Never make a random batch.
- **Speak to the segment.** For a segment, change the occasion, the product, the proof, the words and the picture, using that persona's evidence. Example: if women 45 to 54 in the north pay best, show the pieces they buy, the occasions they name in reviews and the words they use.
- **Local and seasonal moments.** For each region or season the data names, give at least one piece a moment those buyers know: a festival, a wedding or exam season, the local weather, a store they can visit. If a large share of spend goes to a group that buys for someone else (for example men buying gifts), give them their own angle.
- **Native formats.** A set of ads needs some that look like what people read in a feed, not only product posters: a notes list, a chat, a comparison table, an explainer, a review card. In a set of 10 or more, use at least 3 of these, each tied to a segment and its objection.
- **Words come from the bank.** Hooks start from customer words or a proven ad line. Match the brand's sentence length and words. Then run `node tools/brand-brain.mjs voice-check <draft> --ads` and fix every FAIL.
- **Check every absolute claim.** "Every", "all", "100%", "guaranteed" and "the only" must be true across the whole range, including any lab-grown, budget or sale line. Name the source, or soften the line. "Every stone we set is natural" is false for a store that also sells lab-grown diamonds.
- **Text on images is set, never drawn.** Use real product photos from the site, the catalogue or past ads. An image model may make only the scene or background, with no words in it. Put every word on in the brand's fonts with HTML, then render (`tools/quality/render.cjs`) and check size, contrast and the safe zones. Then check each one: the product fills at least a third of the frame and is the piece the copy names; no watermark, logo or text from the source photo is left in the crop; a review quote sits only on the product it is about; and a set of 10 or more uses at least 4 distinct layouts, none on more than 30% of the set, matched to the formats that won in `data/creatives.md`. Write `manifest.json` beside the images (layout, format, product, product_box, headline, body, cta, cta_box, price, review, segment, moment, and claim_source for any absolute claim) and run `node tools/check-creative-set.mjs <folder>`: it reads the layouts and the buttons from the pixels, so a set that repeats one template or leaves the button off fails even when the plan said otherwise. Fix every FAIL and run it again.
- **Built to sell.** Each ad has a hook in the first line, one proof, the offer if there is one, and one clear action. Draw the action as a button on the image, copied from the brand's own button in its real ads (shape, colour, words), with a tight `cta_box` around it in the manifest. Leave it off only when the brief says so. Each page has the promise, the proof and the action on the first phone screen.
- **A decision trace.** With the work, in your own message, list for each piece the segment, the number and the brain lines it used.

## 5. Knowledge: when and how much

| Moment | Pull from the knowledge library | Never from it |
|---|---|---|
| Planning | The playbook for this job type: 3 to 6 passages (`node tools/ask-knowledge.mjs "<question>"`) | Brand voice, brand facts |
| Reading numbers | Benchmarks and decision rules (learning phase, frequency, attribution) | The client's own numbers |
| Checking | Platform specs and policy rules | Copy lines to reuse |

More passages pull the voice toward average. Keep knowledge to rules and numbers, and keep it out of the copy. Cite what you used.

## 6. Keep it and improve it

- Save the brain in `context/brand-file/`. Tell the owner it is saved, and that it can be kept on their AI Blocks account for the team.
- After the job: `node tools/brand-file.mjs learn --job "<job>" --kept "<...>" --killed "<...>" --more "<...>"`, and update the data layer when new results arrive.
- One-shot jobs (nobody can reply) still build both layers from the material on hand before making anything buyer-facing. Only the questions are skipped.
