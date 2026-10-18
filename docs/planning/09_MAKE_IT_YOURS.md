# 09 · Make it yours: test, tighten, teach, build on, speed up and train

**Date:** 2026-10-18
**Status:** proposed design (decision 21). Nothing is built yet. The business deck (slides 28–30) carries the short version. Where they differ, the final plan wins.
**Question (Kevin):** help people test and evaluate their outputs with evals, get their prompts right, tighten and change skills, and build an interface on top. Show them how to use their own data, for example a book they want their copywriting agent to learn from. Explain what context to give and how to structure it. Show how to prepare a big data set, such as reviews or call transcripts, so the model does its best work, and how to pull data from different sources. Show how to check the output of, say, a copywriter agent. Cover how to make inference cheaper and faster, and how modelling and training work.
**Short answer:** this is a learning track with ten steps, from "check it by eye" to "train a model". It is built mostly from tools we need for ourselves anyway. The factory's test sets, graders, blind judge and cost ledger become lessons and downloads that people run on their own machine, with their own key. We never see their data.

---

## 1. Why this matters

- **It answers the next question.** Once someone has a working listing, they ask how to know it's good, how to make it better, and how to make it theirs. Nobody answers that in plain words for non-developers.
- **It's what we already do.** Every listing goes through the 12 steps: test inputs, model tests, grading, fixes, before and after. Teaching it costs little, and it makes "tested" mean something people can check for themselves.
- **People search for it.** "How to test prompts", "AI evals", "train ChatGPT on my writing" and "fine-tune vs RAG" are common questions. They're good for search and YouTube.
- **It keeps people with us** as they move up the ladder, from Beginner to Expert.

## 2. The ten steps

| # | Step | What they learn | What we give them | Level | When |
|---|---|---|---|---|---|
| 1 | **Check by eye** | Judge an output against a written checklist, not a feeling. | The quality checklist from every listing; a "write your own checklist" prompt. | Beginner | Launch |
| 2 | **Test set** | Keep 10–20 fixed inputs (normal, hard and edge cases) so every change is judged on the same cases. Write down what a good answer must have. | A **test set builder** skill; every listing's own test set as a download. | Beginner | Launch |
| 3 | **Evals** | Score outputs three ways: code checks first (length, format, banned claims, required parts), then an AI judge with a scoring guide, then blind A-vs-B comparison. Never let a model judge its own work alone. | An **eval kit** in two forms: a Google Sheet, and a small script (Python or TypeScript), each running on the person's own key. A scoring-guide writer skill. | Intermediate | Launch |
| 4 | **Tighten** | Change one thing at a time, re-run the test set, and keep the change only if the score goes up. Re-run old cases so nothing that worked breaks. Cut words that don't change the result. | A **prompt tightener** skill that proposes one change at a time; before and after from our own listings. | Intermediate | Launch |
| 5 | **Give it the right context** | What to give and in what order (section 3): the task, who it's for, the brand brain, rules, reference material, examples, then the input and the output format. Label each part so the model can tell them apart. | A **context pack builder** skill and templates; every listing shows its own context order. | Beginner–Intermediate | Launch |
| 6 | **Prepare your data** | Pull data from its sources, clean it, remove personal details, tag it, and turn it into a short digest with counts and quotes (section 4). For reviews, call transcripts, support tickets, survey answers. | A **data prep** workflow (review miner, transcript tagger, digest builder); source guides for Shopify, Klaviyo, Meta, review apps, call recorders, Sheets. | Intermediate | Launch (reviews); Feb–Apr (the rest) |
| 7 | **Teach it your style and material** | The right order for a book, your past copy or your playbooks (section 5). | A **style guide extractor**, an example picker, a training-pair builder, and guides for Claude Projects, Gems, ChatGPT Projects and file search. | Intermediate–Advanced | Feb–Apr 2027 |
| 8 | **Put an interface on it** | No code first: a Custom GPT, Gem, Claude Project or a Sheet. Then a simple web app with a form, the prompt on the server side and the key never in the page. | Interface guides per tool; a **starter app template** (one form → one listing → result, with a cost cap). | Beginner (no code) to Advanced (app) | No-code at launch; template Feb–Apr |
| 9 | **Cheaper and faster** | Use the cheapest model that passes the evals. Cache the fixed part of the prompt, run batches when there's no rush, send less context, and start cheap, moving to a top model only when the cheap one fails a check. | The **AI run cost** mini tool; a **"fine-tune or prompt?" break-even** calculator; our model test results on every listing. | Advanced | Feb–Apr 2027 |
| 10 | **Train a model** | When fine-tuning pays off; how to build input → output pairs; distilling a top model's good outputs into a cheaper model; checking before and after on the same evals; when not to do it. | Advanced guides; the training-pair builder from step 7. | Expert | May 2027+, by demand |

Each step works like any other listing: a page with the result first, a "set it up yourself" guide, the ladder's "you are here, this is next", and comments.

## 3. What context to give, and how to structure it

The same model gives far better output when the context is complete, short and clearly labelled. We teach one order, and every listing uses it:

| # | Part | What goes in | Tip |
|---|---|---|---|
| 1 | **Task** | One sentence: what to make, and what it's for. | "Write 10 Meta ad hooks for our summer sale, for cold audiences." |
| 2 | **Who it's for** | The audience, their problem, where they'll see it. | Name the stage: cold, warm, returning customer. |
| 3 | **Brand brain** | Voice, offer, proof you can use, words to avoid. | Only the parts this task needs, not the whole brain. |
| 4 | **Rules** | Must and must not: claims, length, legal limits, format. | Write rules as a checklist, so the same list grades the output. |
| 5 | **Reference material** | The data digest (section 4), facts, product details. | Put long material near the top, each part in its own labelled block (for example `<reviews>`, `<product>`), with an ID on every quote. |
| 6 | **Examples** | 3–10 good outputs, and one bad one with why it's bad. | Your own best work beats anyone else's. |
| 7 | **The input** | Today's brief or question. | Last, after the reference, so the model reads the material first. |
| 8 | **Output format** | Exact shape: a table, numbered list, JSON, length. | Ask it to cite the quote IDs it used. |

- **Less, but labelled.** Give the model the right tenth of your data, not all of it. Unlabelled walls of text make it guess what matters.
- **Facts it can point to.** Every claim in the output should trace to a quote ID or a brain fact. That makes checking possible (section 6).
- **One context pack per job.** Save it as a file or a Project, so the same context is used every time and can be improved.

## 4. Preparing big data sets: reviews, call transcripts and the rest

Pasting 5,000 reviews or 40 call transcripts into a prompt gives weak, generic output. The model skims, misses patterns and invents averages. We teach a five-stage preparation that runs once and is then refreshed:

1. **Pull** from the sources:
   - **Exports:** Shopify orders, review apps (Judge.me, Okendo, Trustpilot), Klaviyo, Meta ads, support desks.
   - **Recordings:** call recorders such as Gong, Fathom, Zoom or Meet transcripts.
   - **Hand-collected:** survey tools, or a shared Sheet.
   - **Later:** a connector (MCP) or a scheduled routine pulls it automatically.
2. **Clean:** remove duplicates, spam and empty rows. Keep one row per review, or one row per speaker turn in a call, with its date, product, rating or deal stage, and an ID.
3. **Protect:** strip names, emails, phone numbers and order numbers before anything goes to a model, and keep the raw file on your side. This is your customers' data.
4. **Tag:** a cheap model labels each row:
   - **What it's about:** theme, product, objection.
   - **How they feel:** sentiment and the emotion behind it.
   - **Who and where:** the customer type and the stage of buying.

   Then check 20 rows by hand. Tags turn a pile of text into something you can count.
5. **Digest:** for each task, build a short digest:
   - the top themes, each with a count;
   - 3–5 exact quotes per theme, with their IDs;
   - what changed since the last digest.

   This is what goes into the context's reference block.

The same five stages work for any text you hold: sales calls, support tickets, survey answers, sales emails. Numbers (ad results, orders) go through a Sheet first. The model gets a small summary table, never the raw export.

## 5. Your style and material: the book example

Someone has a copywriting book and wants their copywriting agent to "learn" from it. Training on the book is rarely the best first move: fine-tuning on a book picks up its style weakly and its ideas poorly. The order we teach:

1. **Pull out the principles.** Turn the book into your own **style guide** in your own words: rules, structures, formulas, do's and don'ts, with a page reference for each. The style guide extractor does this one chapter at a time. Most of the value comes from this step.
2. **Add examples.** Give the agent 5–20 of your own best pieces, each with a short note on why it works. Examples teach style better than any description.
3. **Let it look things up.** Keep the full text privately in a Claude Project, a Gem, ChatGPT file search or your own folder. The agent can check a passage when it needs to, without the whole book in every prompt.
4. **Fine-tune only after that**, and only when:
   - you have hundreds of good input → output pairs;
   - the prompt-and-examples version passes your evals but is too slow or too expensive;
   - the break-even calculator says it pays.
5. **Test after every step.** Run the same evals each time. Include a **copying check** that flags any output repeating a run of the book's words, so the agent learns the method and never reproduces the text.

The same order applies to any material: past emails, winning ads, playbooks, brand books.

## 6. Checking the output: a copywriter agent as the example

| Check | How | Catches |
|---|---|---|
| **Code checks** | Length, required parts (hook, offer, call to action), banned words and claims, format | Broken or off-brief output, instantly and for free |
| **Grounded claims** | Every claim must cite a quote ID or brain fact; a script checks that the IDs exist and match | Invented reviews, made-up numbers, claims you can't make |
| **Copying check** | Flags any run of 8+ words copied from the book, a competitor or a review | Plagiarism, and reviews pasted as if they were ad copy |
| **Checklist judge** | An AI judge from another lab scores each output against the rules and the voice, with reasons | Wrong voice, weak hooks, missed rules |
| **Blind A vs B** | New version against the old one, on the same test briefs, order hidden | Whether a change really helped |
| **Your eye** | You read the top and bottom 5 each round | What the checks can't see yet; each finding becomes a new check |
| **Real results** | Run the winners; feed click-through and conversion back into the test set | The gap between "scores well" and "sells" |

The test set is 15–20 fixed briefs: normal, hard (thin data, a strict claim rule) and edge cases (a product with no reviews). Every change to the prompt, the context or the model is judged on the same briefs.

## 7. Guardrails

- **Rights.** Use material you own or have a licence for. Keep it private, and never publish passages from it. That matches our own rule: course and book material is reference only, rewritten in our own words. The guides say this plainly. They are not legal advice; anyone unsure should check the terms they bought the material under.
- **No data on our side** (decided 18 Oct). The eval kit, the training-pair builder, the style guide extractor and the app template run on the person's machine or in their own AI account, with their own key. We never receive their files, outputs or keys.
- **Customers' data is protected first.** Data prep strips personal details before any model sees it, and keeps raw files on the person's side.
- **Keys stay off pages.** The app template keeps the key on the server and adds a spend cap per run. The guides show why a key in a web page gets stolen.
- **Honest claims.** We show what our own tests found, with the model and the date. We never promise a score or a saving for someone else's data.
- **Content is data.** The eval kit's AI judge treats outputs as text to score, never as instructions.

## 8. Where it lives on the site

- **Learn › Make it yours:** the eight steps as a ladder, with lessons and videos.
- **Library:** the skills (test set builder, scoring-guide writer, prompt tightener, context pack builder, review miner, transcript tagger, digest builder, style guide extractor, training-pair builder) as listings under the **AI operations** function.
- **Apps:** the eval kit, the starter app template and the two calculators.
- **Every listing:** a "Test it yourself" link to its own test set and checklist, and a "Make your own version" link to step 4.

## 9. How we build it

| Piece | Built from | Effort | When |
|---|---|---|---|
| Steps 1–4 lessons | The 12-step pipeline and our own listing tests | Low: written while we build `run-test` and `grade` | Weeks 3–12 |
| Eval kit (sheet and script) | `run-test`, `grade`, the blind judge, the cost ledger | Medium: a public, simplified version of our tools | Weeks 5–10 |
| Test set builder, scoring-guide writer, prompt tightener | Our own test-set and fix steps | Low–medium: they go through the 12 steps like any listing | Weeks 5–12 |
| Context pack builder and templates | Our listings' context order (`05_PRODUCTION_PRINCIPLES.md`) | Low | Weeks 3–8 |
| Data prep for reviews (review miner, tagger, digest) | Creative Engine's review-mining work | Low–medium | Weeks 5–10 |
| Data prep for transcripts, tickets and surveys; source guides | The same five stages | Medium | Feb–Apr 2027 |
| No-code interface guides | Tool docs plus our exports | Low | Weeks 8–12 |
| Style guide extractor, training-pair builder, look-it-up guides | Intake engine idea cards (the same method) | Medium | Feb–Apr 2027 |
| Starter app template | The site's own stack (Next.js) | Medium | Feb–Apr 2027 |
| Break-even calculator | `build-mini-tool` | Low | Feb–Apr 2027 |
| Fine-tuning and distillation guides | Each lab's fine-tuning docs, tested on one small case per lab | Medium–high (training runs cost credit) | May 2027+, by demand |

Gate B (launch) gains one line: steps 1–5, review data prep, the eval kit and the no-code interface guides are live.

## 10. Open questions

- **Decision 21:** add "Make it yours" as a learning track, with steps 1–5 and review data prep at launch, steps 6–9 in February–April, and step 10 by demand? (Needed by 2 Nov, with decision 20.)
- Which language for the eval kit script first: Python (more common for evals) or TypeScript (same as our factory)? Recommendation: **Python first**, because that's what most guides and readers use.
- Which no-code interface first: Custom GPT, Gem or Claude Project? Recommendation: **all three from one export**, since our build step already makes each.
