---
name: write-ad-copy-in-indian-languages
description: "Turns a store's approved English ad copy into Hinglish and one or two regional Indian languages (Hindi, Tamil, Telugu, Marathi, Bengali, Kannada, Malayalam or Gujarati), rewritten the way buyers in that language speak rather than translated word for word, while every claim, number, price, offer term and legal line stays exactly as approved. Locks the claims first, writes per platform field within limits, gets a native speaker's back-translation check, and pairs each language with the right audience and landing page. Use when the store sells beyond English-first metros, when regional audiences click but do not buy, or before a festival push in a state."
---

# Ad copy in Hinglish and Indian languages

**You get:** for each English ad, a Hinglish version and versions in one or two chosen regional languages, field by field (primary text, headline, description, on-screen text, call to action), with a claim lock table showing every number and promise unchanged, a native speaker's back-translation sign-off, and the audience and landing page each version runs with.

## When to use

- The store ships across India but every ad is in English.
- Tier 2 and tier 3 audiences click but convert poorly, and reviews or support chats come in Hindi or a regional language.
- A festival push (Diwali, Pongal, Onam, Durga Puja, Gudi Padwa) targets a state or language group.
- WhatsApp or COD-heavy buyers ask questions the English ad did not answer.

## Not for

- Writing the English ad in the first place: use `ad-copy-test-sets` or `headline-angle-set`.
- Translating product pages or the store: that is a site job for the store setup team, not ad copy.
- Checking claims in the English original: run `check-ad-copy-for-policy-and-claims` on it first.
- TikTok or Reels scripts: write them with `write-tiktok-ad-scripts`, then bring the openers here.

## What you need

Required:

1. **The approved English ads**, every field, with their claims already checked.
2. **Target languages and regions**, and why: orders by state from the Shopify order export (Shipping Province, Shipping Zip, Total), so the choice follows real demand.
3. **Customer words in that language**: reviews, WhatsApp or support chats, Instagram comments. Exact phrases, with source.
4. **Landing page language**: does the store have a Hindi or regional page, or only English?
5. **A native speaker** of each language to check the final copy (client staff, a freelancer, a trusted customer). Required for publishing.

Optional: past regional ad results, return-to-origin (RTO) rate by state, competitor ads in the language from Meta Ad Library.

If no native speaker is available, deliver Hinglish only and mark regional versions as drafts that must not run. Writing is read-only. Loading ads needs draft access; the client approves before publishing.

## Before you start: the gates

1. **English original approved.** Claims checked and offer live. Fail: fix the English first; a translated error is two errors.
2. **Demand and delivery for that region.** Orders or traffic exist in the region, and couriers serve its pincodes, including COD where offered. Fail: do not open a language where the store cannot deliver.
3. **Gross profit per order after RTO.** Regional COD orders can carry higher return-to-origin losses. Pass when `store-meta-math` gives gross profit per order for that region with its RTO rate [MEA-0037]. Fail: run prepaid-led copy only, or skip the region.
4. **Native check possible.** Fail: drafts only, as above.

## Steps

### 1. Choose the languages from data, not guesses

Rank states by orders and by add-to-carts from the order export and analytics. Pick Hinglish plus at most two regional languages for the first round. Hinglish (Hindi and English mixed, in Roman script) suits urban and Hindi-belt buyers who scroll in English letters; Devanagari Hindi and regional scripts suit buyers who read their own script. Which converts better for the store is a test, not a rule. Practitioner default: test both for Hindi.

### 2. Lock the claims before writing

Build a claim lock table from the English ad. Every item below must appear in the new language with the same meaning and the same number:

- product name and brand (keep in English unless the brand has an official local name);
- every number: price in rupees with the ₹ symbol, discount, size, quantity, days, ratings, review counts;
- offer terms: end date, minimum order, which products;
- delivery and payment: COD, UPI, prepaid discount, delivery days;
- legal or required lines: "incl. GST", disclaimers, "Ad" or partnership labels.

ASCI's code applies to ads in every language: claims need proof on demand, and ads must not mislead by omission [ADC-6146]. Quoted prices should include charges most buyers pay [ADC-6147].

### 3. Rewrite, do not translate

For each field:

- Start from the customer words in that language. Buyers' own phrases beat a translator's, because they carry the feeling of the problem [AVT-0007].
- Keep sentences short and spoken. Write at a simple reading level [ORG-0024].
- Pick the right address: in Hindi, "aap" for most products; "tum" only if the brand is clearly young and casual. Check gender agreement in verbs.
- Keep English words that buyers use in English: "delivery", "return", "COD", "size", "cotton", "offer". Forcing pure-language terms makes copy stiff.
- Replace English idioms with local ones of the same meaning, or with plain words. Never keep a pun that only works in English.
- Name the buyer in the copy where it helps targeting: a line that names who it is for lets broad targeting find them [ADC-0032].

### 4. Fit each platform field

Count characters with the platform's own preview, not a word counter, because Indic scripts combine characters and some tools count them differently. Google applies the same character limits across languages; only Chinese, Japanese and Korean count double [GAD-6140]. Keep headlines inside the limit after the rewrite; regional text often runs longer than English, so cut words, not claims.

### 5. Match the landing page

A regional ad that lands on an English-only page loses the buyer it just won; a niche audience works only when copy, page and proof all speak to it [AVT-0015]. Choose one:

- Store has a page in that language: link it.
- English page only: keep the ad's promise to what the English page shows clearly in its first screen (price, COD, delivery), and add one line such as "Order on WhatsApp in Hindi" only if the store really answers WhatsApp in Hindi. In India, automated WhatsApp journeys showed far higher click-through than broadcasts in one large dataset [EML-0048], so a WhatsApp option can be worth setting up.

### 6. Back-translation check

Send the new copy to the native speaker with the claim lock table. They:

1. translate each line back to English, without seeing the original;
2. mark any line that sounds machine-made, rude, too formal or wrong for the region;
3. confirm every locked item.

Fix every mismatch. A line passes only when the back-translation matches the English meaning and every locked item is identical.

### 7. Set audiences and the test

Run each language to its region or language audience, with the English ad as the control in the same region. Judge on orders and gross profit per order after RTO, not clicks. Keep one change per test: language, not language plus a new offer.

## Checks before you hand it over

- Every field of every English ad has a Hinglish and regional version, or a stated reason why not.
- The claim lock table shows every number, price, term and legal line identical across versions.
- A native speaker's back-translation is attached and every mismatch is fixed.
- Character counts come from the platform preview and fit the limits.
- Each version names its landing page, and the page shows the price, COD and delivery the ad promises.
- No English idiom or pun survives literally; brand and product names are consistent.
- Regions chosen from order data, with delivery and COD confirmed.
- Nothing published; the client approves each language.

## Output

**1. One-screen summary:** languages chosen and why (orders by state), regions and audiences, landing page per language, native checker, test plan.

**2. Claim lock table:**

| Item | English | Hinglish | Language 2 | Language 3 | Identical meaning (Y/N) |
|---|---|---|---|---|---|
| Price | ₹1,299 incl. GST | ₹1,299 incl. GST | | | |

**3. Copy sheet:**

| Ad | Field | English | Hinglish | Language 2 | Language 3 | Characters (platform) | Back-translation | Checker OK |
|---|---|---|---|---|---|---|---|---|

**4. To confirm:** WhatsApp language support, any regional delivery exceptions.

## Common mistakes

- **Machine translation shipped as is.** Step 6 requires a native back-translation.
- **Claims drifting in translation** ("up to" lost, a number rounded). Step 2's lock table.
- **Pure-language words nobody uses.** Step 3 keeps buyer-used English words.
- **Regional ad to an English page that hides COD.** Step 5 matches the page.
- **Opening a region the store cannot deliver to profitably.** Gates 2 and 3.
- **Choosing languages by guess.** Step 1 uses orders by state.

## Sources

- ADC-6146: ASCI code: substantiation, no misleading omissions, in any language.
- ADC-6147: quoted prices include charges most buyers pay; no false urgency.
- AVT-0007: use buyers' exact words, not parsed summaries.
- ORG-0024: write at a simple reading level.
- ADC-0032: name the buyer segment in the copy.
- AVT-0015: copy, page and proof must all speak to the niche buyer.
- EML-0048: WhatsApp journeys in India out-clicked broadcasts in one dataset.
- GAD-6140: Google character limits; only CJK counts double.
- MEA-0037: margin from delivered cost, here including RTO.

What makes this skill ours: languages are chosen from the store's orders by state and its RTO cost, not from a list of big languages; a claim lock table keeps every price, term and GST line identical; a native speaker back-translates before anything runs; and each version is paired with a page that shows what the ad promised.
