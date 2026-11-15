---
name: brand-moodboard-for-shoots
description: "Builds one shoot and ad moodboard plus a do-and-don't sheet that keeps photographers, creators, designers and image tools on brand: 12 to 20 reference images grouped by light, setting, people, product framing and colour, each with a one-line reason; a fixed list of what never changes and what may vary; banned looks and AI defaults to avoid; and a short prompt block and creator brief section that carry the same rules. Built from the store's own best images and buyer data, not only taste. Use before a shoot, before briefing creators or an image tool, or when ads and photos look like they come from different brands."
---

# Moodboard for shoots and ads

**You get:** a one-page moodboard (12 to 20 references in five labelled groups), a do-and-don't sheet with fixed and variable rules, a 120-word prompt block for image tools, and a 150-word creator brief section, all saved as one shareable file (Google Slides, Figma, Canva or PDF).

## When to use

- A photographer, creator, agency or image tool is about to make images for the store.
- Ads, product photos and social posts look like they come from different brands.
- The store is moving into a new look, season or buyer group and needs the look agreed before money is spent.
- Creators keep delivering content that has to be redone.

## Not for

- Colours, fonts, buttons and spacing from the live theme: use `store-visual-identity-sheet`.
- Brand positioning and message: use `write-brand-positioning-and-messaging`.
- Words and tone: use `brand-voice-guide`.
- Settings for one batch of ad images: use `ad-batch-visual-direction`.
- The shot list for a specific shoot: use `art-direct-product-photoshoot`.

## What you need

Required:

1. **The store's own image history:** the 10 best-performing ad images and 10 worst from Ads Manager (by cost per purchase over the last 90 days, with spend), plus the current product and lifestyle photos.
2. **Buyer data:** who buys, from Shopify customer reports, post-purchase survey answers and reviews: age range, setting, what they use the product for.
3. **Brand files:** logo, colours, fonts from `store-visual-identity-sheet`.
4. **Gross profit per order** of the products the shoots will cover, so the board serves the products that matter [MEA-0037].

Optional: competitor ads from the Meta Ad Library, customer photos, earlier moodboards.

Read access to Ads Manager is enough. No spending or publishing happens in this job.

## Before you start: the gates

1. **Enough results to learn from.** Pass: at least 10 ads with meaningful spend, so "best" and "worst" mean something. Practitioner default: ads with at least 2 to 3 times the target cost per purchase in spend. Fail: build from buyer data and the product only, and mark the board "untested".
2. **Rights to references.** References are for direction only and stay internal. Fail: never put a reference image into an ad, and never ask a creator or tool to copy one closely.
3. **One decision-maker.** The client names who approves the board. Fail: ask before starting; boards by committee drift.

## Steps

### 1. Read the store's own winners and losers

Lay the 10 best and 10 worst ad images side by side. Write what the winners share in light, setting, people, framing and colour, and what the losers share. This is the evidence behind the board; taste comes second. Note that a new background colour alone does not make a new ad for delivery, so the board should vary bigger things (person, setting, angle) and lock the small ones [MCR-0022].

### 2. Pull references

Collect 30 to 40 candidate images, then cut to 12 to 20. Sources: the store's own best images first, then customer photos (internal use), then outside references. Borrow from industries far from the category, not from direct competitors; the further the idea travels, the more the brand stands apart [BRD-0003].

### 3. Group them in five rows

| Row | What it fixes | Example labels |
|---|---|---|
| Light | quality and direction | soft window light from the left; warm late afternoon; no hard flash |
| Setting | where the product lives | real kitchens and desks, lived-in; no empty studio for lifestyle |
| People | who appears and how | buyers who look like the store's customers, mid-action, product in hand |
| Product framing | how the product is shown | label facing camera, product sharp, at least a third of the frame in ads |
| Colour and texture | palette of sets and props | brand colours as accents; natural wood, linen; no neon |

Each image gets a one-line reason: "this, because...". An image without a reason is cut.

### 4. Write fixed and variable rules

- **Fixed (never changes):** product accuracy (the real product, exact variant, readable label), light quality, palette range, logo use, people who look like the buyers [AVT-0015], no other brands in frame.
- **Variable (should change between ads):** the person, the setting, the moment, the angle and the camera distance. Near-duplicate ads get grouped as one by Meta and add no reach, so variety must be real [MCR-0078].

### 5. Write the don'ts

Name them plainly, with an example image of each where possible:

- Overly sexual or idealised bodies used to sell a product that is not about the body; they pull the eye away from what is sold.
- Imagery that makes viewers feel bad about how they look; Meta's health and wellness rules restrict it [MCR-6044].
- AI defaults: glossy skin, perfect symmetry, floating products, impossible reflections, misspelled labels, the same smiling stock face.
- Fake customers: AI-made or staged people are never presented as real customers or reviewers [MCR-6045]; where an AI person is used, follow the platform's AI disclosure label.
- Props or logos from other brands.
- Anything the store cannot ship as shown (a colour not sold, an accessory not included).

### 6. Write the prompt block

A 120-word block for image tools that restates the fixed rules in plain words: light, setting, palette, framing, people, the real product photo as the reference, and the don'ts as an avoid list. It names no artist, photographer or brand to copy. Hand detailed prompt building to `ad-image-prompt-compiler`, and product accuracy checks to `keep-product-accurate-in-ai-media`.

### 7. Write the creator brief section

A 150-word section for creators: where to film (real home settings that match the setting row), light (face a window), how to hold and show the product (label to camera, in the first seconds), what to wear (plain colours), and the don'ts. Creators disclose paid partnerships under platform and local rules.

### 8. Test the board

Give the board to someone who has not seen the brand and show them 10 mixed images (5 on-brand, 5 not). Pass when they sort at least 8 correctly. Then agree the board with the named decision-maker and date it.

### Market notes

- **Settings:** settings, clothing and skin tones should match where the store's orders come from; a London flat, a Texas suburb and a Sydney summer look different. Buyer diversity should reflect the real customer base from data, not a token mix.
- **Seasons:** seasonal looks (Christmas, back to school, Eid, Lunar New Year, local festivals, weddings) are separate pages, not a change to the base board.
- **Skin tone:** avoid skin-lightening cues; several ad codes treat ads that show darker skin as less attractive or less successful as harmful.

## Checks before you hand it over

- The board has 12 to 20 images in five labelled rows, each with a reason.
- The best and worst ad comparison is attached, or the board is marked "untested".
- Fixed and variable rules are listed separately.
- The don'ts include AI defaults and the no-fake-customers rule.
- The prompt block and creator brief repeat the same rules and name no one to copy.
- A cold sorter sorted at least 8 of 10 images correctly.
- The decision-maker approved the board, with a date.

## Output

**One-screen summary:** the look in three sentences, what the store's winners share, the five fixed rules, the five don'ts, who approved it and when.

**Moodboard file:** five rows (light, setting, people, product framing, colour and texture), 12 to 20 images, a one-line reason under each.

**Do-and-don't sheet:**

| Area | Fixed rule (always) | May vary | Never | Example image |
|---|---|---|---|---|
| Light | | | | |
| Setting | | | | |
| People | | | | |
| Product framing | | | | |
| Colour and texture | | | | |
| AI use | | | | |

**Prompt block (120 words):** light, setting, palette, framing, people, reference photo instruction, avoid list.

**Creator brief section (150 words):** where, light, how to show the product, wardrobe, don'ts, disclosure.

## Common mistakes

- **A board of pretty images with no evidence.** Step 1 starts from the store's own winners and losers.
- **Copying a competitor's look.** Step 2 borrows from far categories [BRD-0003].
- **Locking everything.** Step 4 keeps the person, setting and angle variable so ads stay distinct [MCR-0078].
- **Casting by taste.** Step 4 fixes people to the real buyers [AVT-0015].
- **No AI rules.** Step 5 names AI defaults and bans fake customers [MCR-6045].
- **Boards nobody signed.** Step 8 tests and dates the approval.

## Sources

- BRD-0003: borrow design ideas from far industries.
- MCR-0022: a new background colour is not a new ad.
- MCR-0078: near-duplicate ads are grouped and add no reach.
- AVT-0015: photos, not just headlines, must speak to the buyer.
- MCR-6044: Meta limits imagery that builds negative self-perception.
- MCR-6045: fake and AI-made testimonials are banned in the US.
- MEA-0037: gross margin is the delivered cost to the door.

What makes this skill ours: the board starts from the store's own best and worst ads, not a mood; it says what must stay fixed and what must vary so ads stay distinct for delivery; AI defaults and fake customers are named as don'ts; and the same rules travel in a prompt block and a creator brief, tested by a cold sorter before anyone shoots.

## Selling in India

- A Mumbai flat, a Chennai home and a Delhi winter look different; match the regions orders come from.
- Diwali, Eid, Onam and wedding boards are separate seasonal pages.
- ASCI has specific guidelines against ads that show darker skin as less attractive or less successful.
