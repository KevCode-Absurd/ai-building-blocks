# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

Three ready-to-brief ads that keep every quote exact, with correct headline, short and long counts and honest MISSING lines where the owner still needs site names, verification status and a second buyer for two long texts. The only slip is a trim-record note calling Review 1's phrase 61 characters when it is 62, which doesn't affect any ad.

## Judge list

- Met: Quote on image matches the review letter for letter, or the cut is recorded
  All three Phrase lines match the input word for word; Trim record: "All three images carry their phrase whole. Nothing on any image is cut."
- Met: Each ad uses a different customer and the set argues one reason to buy
  Reviews 1, 18, 5 lead Ads 1-3; review 6 only in Ad 3 long text; all serve "finally a supplement I stick with"
- Met: Headlines 27 characters or fewer, or the trim record says why not
  "Headline (27): I've been able to stick to." / "(27): they started tasting better" / "(21): I just take these now" — counts verified
- Met: Short main text 50-150 characters and lands the quote's point
  "Short (97): For anyone who keeps giving up on supplements. One buyer says Sprout is the one they kept taking." — 97, 97, 82 all verified
- Met: No invented name, city, star rating or face beside a quote
  "No star ratings, review counts, names or faces are used, because none are on file." Site/retailer names marked MISSING placeholders
- Met: Unverified and free-product reviews flagged before paid use
  "MISSING: verified status for reviews 1, 18, 5 and 6. Confirm before paid use." and free-product MISSING line

## What went in

```text
Reason to buy: finally a supplement I stick with.
Phrases:
- Review 1 (brand site): "...[Sprout] has been the one thing I've
  been able to stick to."
- Review 18 (retailer): "I thought the first pack I tried tasted
  terrible, but after the third day they started tasting better"
- Review 5 (brand site): "I just take these now and it's easier
  for me to manage."
Backup: review 6 "not having to clean a shaker bottle or extra
dishes". Doubt: "A gummy can't hold enough to replace my powder."
Photos: the deep green pouch; one daily pack torn across the top,
gummies pouring into a palm.
Verified and free-product status: not on file. Number of ads: 3
```

## What came out

```text
I can't draw images in this chat, so you'll get a brief for each ad, not finished pictures.

AD 1  Pull / big quote card
Phrase (Review 1, brand site): "...[Sprout] has been the one thing I've been able to stick to."
Other words: "Review from sproutsite.com" in small plain type under the quote. Use the real site name: MISSING: site name as published. Sprout wordmark small, bottom corner.
Scene: Flat background in the brand's deep green (match the pouch), with off-white type. The quote fills about two thirds of the frame. The real deep green pouch photo sits small, bottom right, placed as the photo itself and not redrawn. The quote runs exactly as above, ellipsis and brackets included.
Rule: cut only at a whole word, never reword

FEED TEXT, AD 1
Headline (27): I've been able to stick to.
Short (97): For anyone who keeps giving up on supplements. One buyer says Sprout is the one they kept taking.
Long (36, not counting the gap): If every supplement you have tried ended up at the back of a cupboard, this is for you. One Sprout buyer wrote, "...[Sprout] has been the one thing I've been able to stick to." MISSING: backup quotes (a second buyer who leads no ad in this set). Try Sprout.
Description (0): none

AD 2  Doubt / question and reply
Phrase (Review 18, retailer): "I thought the first pack I tried tasted terrible, but after the third day they started tasting better"
Other words: Question above the quote, in plain type: "Do they taste bad at first?" [inferred: drawn from the worry this reviewer raised, not from your doubts list]. Under the quote, small: "Retailer review". Use the real retailer name: MISSING: retailer name.
Scene: Plain light background. The question sits small at the top. The quote is the largest text, beneath it as the reply, with no full stop added. The real photo of the daily pack torn across the top, gummies pouring into a palm, sits lower third, placed as the photo and not redrawn.
Rule: cut only at a whole word, never reword

FEED TEXT, AD 2
Headline (27): they started tasting better
Short (97): If the first taste puts you off, you are not alone. One buyer says it got better after day three.
Long (31, not counting the gap): Worried about the taste? One buyer on a retailer site wrote, "I thought the first pack I tried tasted terrible, but after the third day they started tasting better". MISSING: backup quotes (a second buyer who leads no ad in this set). Try Sprout.
Description (0): none

AD 3  Habit / routine shot
Phrase (Review 5, brand site): "I just take these now and it's easier for me to manage."
Other words: "Review from sproutsite.com" small under the quote. Use the real site name: MISSING: site name as published.
Scene: The real pouch where it lives day to day, such as an open work bag or a desk beside keys and a mug. MISSING: photo of the product in a day-to-day spot. Until you have one, place the real pouch photo into a generated desk or bag setting. Never let the tool draw the pouch. The quote runs as one line across the top. If it won't fit at a readable size, use two lines; don't cut it.
Rule: cut only at a whole word, never reword

FEED TEXT, AD 3
Headline (21): I just take these now
Short (82): For mornings with no time to mix a shake. One buyer says they just take these now.
Long (46): Some days there is no time to mix a shake. One Sprout buyer said, "I just take these now and it's easier for me to manage." Another buyer liked "not having to clean a shaker bottle or extra dishes." One daily pack, no mixing. Try Sprout.
Description (0): none

TRIM RECORD
- Ad 1 headline: cut from the start of the phrase down to "I've been able to stick to." The whole phrase is 61 characters, over 27.
- Ad 2 headline: cut to the last four words, "they started tasting better". The whole phrase is far over 27.
- Ad 3 headline: cut after "now". The full phrase is 55 characters.
- All three images carry their phrase whole. Nothing on any image is cut.
- Review 1 as supplied already has an ellipsis and a bracketed "[Sprout]". Both mean someone edited the original before it reached me. They are kept exactly as given.
- Review 6 is used only in Ad 3's long text, so that buyer appears once in the set.

FLAGS
- MISSING: verified status for reviews 1, 18, 5 and 6. Confirm before paid use.
- MISSING: free product status for reviews 1, 18, 5 and 6. If any reviewer got Sprout free or was paid, say so beside their quote on the image and in the text.
- MISSING: how reviews were collected. If only buyers expected to be happy were invited, don't run these.
- MISSING: original wording of Review 1 behind "...[Sprout]". Check the source. If the brackets replace "this" or similar, consider showing the reviewer's real words.
- Review 18: "the first pack I tried" may not refer to Sprout. Confirm it is a Sprout review about Sprout before using it.
- Review 5: "easier for me to manage" doesn't say what is being managed. If the source means a health condition, it becomes a health claim the brand must back, or the ad can't run.
- Doubt on file ("A gummy can't hold enough to replace my powder"): no quote on file answers it, so no ad or description uses it. Find a review that does, plus your dose facts, before addressing it.
- No star ratings, review counts, names or faces are used, because none are on file.
- Photos: I only have your descriptions of the two photos, not the photos themselves. Colour match and label words are still to check.

CHECKS MISSED
- Image text not read at full size. No image has been made yet; read every quote letter by letter once it is.
- Photo check not done. Photos were described, not attached.
- Free product, payment and verified status not confirmed (see flags).
- Long main text for Ads 1 and 2 lacks a second buyer quote (MISSING: backup quotes).

To make the pictures: paste each brief into ChatGPT (GPT Image) or Gemini (Nano Banana) with your real product photos attached. Free plans have tight daily limits. You can also use Higgsfield's image tool, or in Claude Code send the prompt to the OpenAI or Google image API with `OPENAI_API_KEY` or `GEMINI_API_KEY` (each picture is billed). If a word comes out wrong, fix that word on the image. Don't make the ad again from the brief. Check the headline cut-offs in the Meta Ads Manager previews.

What next? You could check these before they go live with the Meta ads compliance checker (https://useaiblocks.com/skills/meta-ads-compliance-checker), plan what to test with the Image ad gap finder (https://useaiblocks.com/skills/image-ad-gap-finder), or name your own next step.
```
