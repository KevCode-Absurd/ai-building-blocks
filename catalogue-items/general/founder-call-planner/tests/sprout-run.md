# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 5 met. Invented facts: 0.

A thorough, well-ranked, fully grounded call plan: every number traces to the brand file, risky claims and the probiotics error are surfaced, and the product-in-hand and rights questions are all there. It only falls short on tagging: the 35 written-form questions don't say which file each answer will land in, which later filing steps rely on.

## Fix

In step 3 and 'What you hand back', state that written-form questions must carry the same '<- fills <gap> in <file>' tag as call questions, and that the Close questions are tagged too.

## Judge list

- Met: Nothing your brand file already confirms is asked as a fresh question.
  Known facts sit in the quick checks ("C8 The 30-day money-back guarantee covers the first order only"); call and form questions target unknowns and disputes.
- Not met: Every question says which gap it fills and which file the answer goes to.
  Call Q1-Q13 carry Gap and File, but written-form items like "21. The guarantee: what it covers..." name no target file; Close has no gap tag.
- Met: Every filed answer carries founder, date and question number, in the file the skill's table names.
  No answers yet ("No answers yet" in input); nothing filed, so nothing untagged. Vacuously met.
- Met: Beliefs are filed as story, not as claims.
  Nothing filed yet; plan instructs "note whether the answer is a document, a belief or a story" and grades ad results "reported".
- Met: Rights are recorded with who, where, how long and paid or unpaid. No limits on file means no use.
  Q5 and form 29 ask "who is in it, where it may run, how long, and whether it is paid or unpaid." Nothing recorded yet.

## What went in

```text
Brand file: the Sprout folder built from the website, reviews and
ads (00-start-here.md to log.md).

Gaps it already shows:
- Star rating stated four ways [disputed]
- "21" and "over 20" vitamins and minerals [disputed]
- One ad says "probiotics"; the ingredient list has none
- Grams of sugar per pack [unknown: founder]

The call is next Tuesday. Make the call plan. No answers yet.

[attached: sprout/brand.md, sprout/reviews.md]
```

## What came out

```text
# Sprout founder call plan (call: next Tuesday)

Send the written form and the "bring" list by **Sunday**, two days before the call.

---

## 1. Yes-or-no checks (one minute at the top of the call)

These come from the site and the brand's own rules. Confirm or correct each one. Nothing here is asked again later.

| # | Check | File |
|---|---|---|
| C1 | One pouch holds 28 daily packs, and the 84-pack size is 3 pouches. | `offers.md` |
| C2 | An adult pack is about 20 g. A kids pack is 15 g, 6 gummies. | `offers.md` |
| C3 | The base is pectin, with no gelatin. Vegan. Free from gluten, dairy, tree nuts, peanuts, caffeine, synthetic sweeteners and synthetic dyes. | `offers.md` |
| C4 | Folate is methylfolate and B12 is methylcobalamin, in both lines. | `offers.md` |
| C5 | It is made in NSF, GMP and FDA-registered facilities in the US and Canada. | `proof-and-claims.md` |
| C6 | The 2025 study ran 12 weeks, was randomized, double-blind and placebo-controlled, with 120 adults aged 23 to 59. Results: vitamin C +40.1%, folate +20.5%. | `proof-and-claims.md` |
| C7 | Subscribers get a limited flavour for 1 month, then switch back to Original automatically. | `offers.md` |
| C8 | The 30-day money-back guarantee covers the first order only. | `offers.md` |
| C9 | Orders ship within 24 hours and arrive in 3 to 5 days. | `offers.md` |
| C10 | The daily pack tears straight across the top edge only. The big pouch is never shown torn. | `00-start-here.md` |
| C11 | Tie-in characters and partner marks are never shown. Only the flavour description is used. | `00-start-here.md` |
| C12 | The brand colours are #00582D, #002C17, #FFF7DF, #007E40, #FFCC2E and #581E5A. The fonts are Work Sans and DM Mono. | `voice-and-look.md` |

---

## 2. Call list, ranked (about 60 minutes)

Each question shows the gap it fills and where the answer will be filed. After any claim, ask "How do you know?" and note whether the answer is a document, a belief or a story. If the call runs short, Q11 to Q13 move to the written form.

**Q1. The study, and what it proves.**
"Walk me through the 2025 study as you'd explain it to a friend. What did it show, and what didn't it test?"
Follow-ups: the site says "Clinically backed formula for energy, immunity, and daily wellness", "The results are in. [Sprout] works." and "backed by 35,000+ studies". What backs each line? Where is the file?
- *Gap:* claims marked pending (energy, immunity, "works", 35,000+ studies, "fast and efficient bioavailability").
- *File:* `proof-and-claims.md`, claims list.

**Q2. The gut and body angles in ads.**
"Tell me how 'Fix the Hot Girl Tummy' came about. Who wrote it, and what happened when it went live?"
Then ask the same about "Weight Loss Support", "Support Muscle While You Lose Weight", "Nutrition for Healthy Hair" and the 30/60/90-day timeline ("radiant skin", "hormone health").
For each line: what backs it? Has a platform, lawyer or regulator ever pushed back on it?
- *Gap:* pending claims, plus rejected ads (unknown).
- *File:* `proof-and-claims.md`, claims list and banned lines.

**Q3. The "probiotics" ad.**
"One ad says 'probiotics', and the ingredient list has none. Tell me about how that ad got made and approved."
Follow-ups: Is it still live? What would make you pull an ad the same day? Who approves ads, and how fast?
- *Gap:* "probiotics" in an ad versus the ingredient list (disputed); the approval process (unknown).
- *File:* `proof-and-claims.md` (banned lines), `00-start-here.md` (house rules), `log.md` (Decisions).

**Q4. Kids and GLP-1: the lines you won't cross.**
"Picture a parent reading a Kids ad. What would you never want them to see?"
Follow-ups:
- "Supports brain health" and "bright minds": what backs them?
- Sugar for children: what do you tell a parent who asks?
- GLP-1: reviews 11 and 14 mention it, and one ad says "fill the gaps while eating less on a GLP-1". Where is the line?
- What topics does the brand never touch?
- *Gap:* kids claims (pending), the GLP-1 angle (pending), topics never touched (unknown).
- *File:* `proof-and-claims.md`, `00-start-here.md` (house rules).

**Q5. Who may appear.**
"Would you appear in an ad, or lend your voice? Would an AI version of you, saying approved lines, be acceptable?"
Follow-ups:
- AI presenters: are they allowed? With what limits? Must they be labelled?
- Creators, staff or customers on file: who, where, for how long, paid or unpaid?
- May reviews be quoted word for word? With names or without?
- May we tell a story blended from several real reviewers, if it is labelled?
- *Gap:* all rights are unknown.
- *File:* `proof-and-claims.md` (rights), `00-start-here.md` (blended stories).

**Q6. The live offer.**
"A stranger lands on the site today. What should they buy first, and what price should they actually pay?"
Follow-ups:
- Ten discounts are live at once: 49%, 52%, 55%, 58%, 61%, $20 off, $29.99 "indefinitely", and others. Which is the real one?
- The $29.99 "indefinitely" price needs the new-customer SMS discount. How do we say that honestly?
- What is the deepest discount you have ever run? Which offers have you never run?
- *Gap:* the discount mess (disputed), the first product (unknown).
- *File:* `offers.md` (price summary), `00-start-here.md` (honesty lines), `log.md` (Decisions).

**Q7. After the first order.**
"Tell me about the last time a customer said they couldn't cancel. What happened?"
Follow-ups:
- What may an ad promise about pausing, skipping or cancelling?
- Why does the guarantee cover the first order only?
- The Kids page shows a $22.49 plan that "renews at $74.98", which is above the $53.32 one-time price. What does a Kids subscriber really pay?
- *Gap:* cancelling (the loudest complaint), Kids renewal price (unclear).
- *File:* `offers.md` (policies), `customers.md`.

**Q8. Trade-offs, and who it's wrong for.**
"What choice made Sprout harder or dearer to make, and why did you keep it?"
Follow-ups:
- Minerals sit at about 25% of daily value. Why?
- Who shouldn't buy it?
- Sugar-Free "worked too well" for some buyers, and some say the taste only grows on you after a few days. What do you tell those buyers?
- *Gap:* trade-offs and who it's wrong for (unknown).
- *File:* `offers.md` (product entry).

**Q9. The product in hand (online-store add-on).**
"Hold up an adult pouch and one daily pack. Use it once, and talk me through each step."
Follow-ups:
- Where does the pack open? What does each hand do? How long does it take? Where does the empty pack go?
- How many gummies are in an adult pack?
- Describe a gummy in your own words: shape, shine or matt, soft or firm, size against a fingertip.
- What sounds does it make: the pouch zip, the tear, the pour?
- When does a buyer first notice a change, and could a camera ever see it?
- How do pictures and AI images usually get it wrong?

Repeat this short version for the Kids pack and the current limited flavour. The recording is a reference only. It is not ad footage unless the founder says it may be.
- *Gap:* gummy count (unknown), the founder's own words on looks, use and timing.
- *File:* `offers.md` (product entries), `00-start-here.md` (never-show-wrong steps).

**Q10. The buyer.**
"Describe one real best customer, no name. What did they buy, and what did they say?"
Follow-ups:
- The reviews suggest 40% habit-quitters, 25% gut, 25% parents. Does that match what you see?
- Who do you want more of, and fewer of?
- What do people say on calls but never write in reviews?
- *Gap:* buyer shares inferred from reviews.
- *File:* `customers.md`, marked "founder's view". Keep the review-based picture alongside it.

**Q11. Voice and humour.**
"Read me something you wrote yourself recently: an email, a post, a voice note."
Follow-ups:
- The site says "f*&$%#g work" and "better poops". How far can humour go?
- Which words do you love, and which do you ban?
- Name three ads you wish were yours, and three you never want to resemble.
- Video: fast or slow? Phone-shot or polished? Close on the product or on the person?
- *Gap:* voice built only from the site.
- *File:* `voice-and-look.md`.

**Q12. The market.**
"When a sale is lost, what is it lost to? Include doing nothing."
Follow-ups:
- May we name the big greens powder, or compare prices with it?
- The "$1.26 vs $3.60" comparison is dated. Stand by it?
- Say the habit you're against the way you'd say it when annoyed.
- *Gap:* rival naming and price comparison (unknown).
- *File:* `market.md`.

**Q13. History and story.**
"The 'too expensive, here's 61% off' ad has 15+ live copies. Why do you think it works, and what number do you judge it by?"
Follow-ups:
- Only 2 of the 40 newest ads use the "I finally stuck with it" habit idea. Why so few?
- If time allows: what was going on the week you decided to start? Which parts of that story are private?
- *Gap:* no spend or results on file, no origin story.
- *File:* `log.md` (Results, graded "reported" unless a number comes with it), `business.md` (story).

**Close.**
- "What must be true in 90 days for this to be worth it? Give me one number."
- "What haven't we asked?"
- *File:* `log.md` (Decisions).

---

## 3. Written form (send by Sunday)

Please answer in writing and attach the file where one exists. "Don't know" and "never checked" are real answers.

**A. Formula and label**
1. Grams of sugar per pack, for Adults Low Sugar, Adults Sugar-Free, Kids, and each limited flavour. *(unknown: founder)*
2. For Sugar-Free: which sugar alcohol, and how many grams per pack?
3. The exact count of vitamins and minerals. Is it 21? Should the "20+" and "over 20" wording be changed, and on which pages? *(disputed)*
4. Does any product contain probiotics, at any dose? Yes or no. *(disputed)*
5. The full supplement facts panel for Adults and for Kids: calories, fiber grams and the name of the fiber blend.
6. Which "adaptogens" are in it, and how much of each? Are they in the Kids formula too?
7. How many gummies are in an adult pack?
8. The facts panel for the electrolyte variety pack. *(not captured)*

**B. Testing and certification**
9. The site says "70 pesticides, 4 heavy metals, 16 contaminants, 9 microbial", which adds up to 99, and also says "35 substances tested". Which figure is right, and what is the difference? *(gap spotted)*
10. The outside lab's name. May we name it in ads?
11. Is NSF a certification of the facility or of the product? What is the exact wording allowed?
12. Any required warnings: the FDA line in ads, Prop 65, Canada, retailer requirements.

**C. Public numbers (give the source, date and count for each)**
13. The star rating. It appears as 4.8 from 100,000; 4.75 from 109,639; 4.74 from 118,002; and 4.0 from 2,411 on a public review site. Which may appear in ads, and with what source line? *(disputed)*
14. The customer survey: date, number of people, method, exact question wording, and any incentive paid. This backs the 95%, 80%, 67% and 52% figures.
15. "Less than 1% of customers use our Money-Back Guarantee": the source and the period.
16. "Most fiber-focused supplements contain only 5g": the source.
17. "Backed by 35,000+ studies": the source and how the number was counted.

**D. Prices (please fill the gaps in this table)**
18. The full current price sheet. Missing cells: Kids subscription renewal, 84-pack subscriptions, Sugar-Free "starts at", and Kids limited-flavour subscription.
19. Current retail prices and pack sizes at big-box stores and warehouse clubs.
20. The HSA/FSA wording that is allowed, and the cashback partner's terms.

**E. Policies, in full**
21. The guarantee: what it covers, how long it lasts, who pays return shipping, how to claim, and how often it is claimed.
22. Cancel, pause and skip: the exact steps a customer takes, and the wording support uses.
23. The current free gifts: what they are, when the list changes, and the stock you hold.
24. Rules for the VIP program, the referral program and the smartwatch giveaway.

**F. The next 90 days**
25. Upcoming limited flavours and their dates, with the flavour description only and no partner names.
26. Stock limits, holiday shipping cut-offs and launch dates.

**G. Rights and marks**
27. Tie-in flavours: what may be said about each, and when each agreement ends.
28. Retailer logos and certification marks you may show, and the exact spelling of every trademark (brand, product names, fiber blend).
29. For each photo, video, creator clip and music track cleared for paid ads: who is in it, where it may run, how long, and whether it is paid or unpaid.
30. The licence for the chunky display font.

**H. Ads and approvals**
31. An export from the ad account showing spend and results for the top ads.
32. Every rejected ad, with the reason given.
33. Who approves ads, and how fast.

**I. Voice**
34. Three things you wrote yourself: an email, a post and a voice note.
35. Your list of words you love and words you ban.

---

## 4. Bring to the call, or send ahead

**Products on the desk, in the box they ship in:**
- Adults Original Low Sugar (one pouch and one loose daily pack)
- Adults Original Sugar-Free
- Kids Strawberry Burst
- The current limited flavour

**Five plain photos per product above:**
1. The pack front as sold
2. The gummies out of the pack
3. In a hand, for size
4. In use: torn across the top edge and poured into a palm
5. A close view of the gummy surface

Note which photos are missing. No product image or clip will be made before these are on file, unless it is labelled "product not confirmed".

**Documents:**
- The full 2025 study report
- The September 2026 lab report (certificate of analysis)
- Supplement facts panels for every product
- The survey method and question list
- Exports from each review platform
- The current price sheet
- Summaries of partner and licensing agreements
- Talent and creator releases
- The brand guidelines file
- Any notices from a platform, lawyer or regulator, including rejected-ad notices
```
