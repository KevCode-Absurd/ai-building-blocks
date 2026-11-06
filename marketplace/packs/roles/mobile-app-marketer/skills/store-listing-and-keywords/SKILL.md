---
name: store-listing-and-keywords
description: Writes a full App Store and Google Play listing from the current listing, recent reviews and rival apps - a keyword map by theme, then name, subtitle or short description, keyword field, promotional text and full description inside each store's limits, plus screenshot captions that tell one story. Checks Apple and Google Play metadata rules (no ranking or price claims, no competitor names, no keyword stuffing). Drafts at access level 2; promotional text and approved Play listing edits go live only at level 3 within the client's limits; App Store fields that need a new app version go out with a submission the client approves each time. Use it for a new app, a stale listing, a new country or language, or an app with good reviews and few installs.
---

# Store listing and keywords

## When to use

- A new app needs its first listing on both stores.
- The listing hasn't changed since launch, or the app has good ratings but few installs.
- The app is going into a new country or language.
- A big feature shipped and the listing still sells the old app.

## What you need

1. The current listing text for both stores, per language, and screenshots of the current images.
2. 50 to 100 recent reviews as text, good and bad.
3. Three rival apps the client names, with their listing text.
4. One sentence on what the app does and one on who it is for.
5. Keyword data if the client has a tool (AppTweak, Appfigures or similar). Without it, the map is built from reviews, rival listings and store search suggestions, and marked "volume unknown".
6. App Analytics and Play Console page views and conversion for the last 90 days, to compare later.
7. Access: level 1 to read. Level 2 to save drafts in the consoles. Level 3, within the client's limits, to change promotional text and send approved Play listing edits for review.

## Steps

### 1. Write down the job and the audience

One line each: the job people hire the app for, and who they are. Every field must serve those two lines.

### 2. Mine the reviews for words

Read every review. Note the words people use for the problem, the outcome and the features they mention, and the complaints. Users' words often beat the team's words ("see what's due this week" over "bill management"). Tag each phrase: problem, outcome, feature, objection.

### 3. Build the keyword map

- Group phrases into 4 to 8 themes.
- For each keyword note the source (review, rival listing, search suggestion, tool), relevance (does the app really do this?) and, if a tool is connected, its volume and difficulty.
- Drop anything the app doesn't do, competitor names and trademarks. Apple and Google both treat these as misleading metadata.

### 4. Place keywords by field (as of 6 November 2026)

**App Store**
- Name (30 characters): brand plus the one most important term.
- Subtitle (30): the outcome, with the second most important term.
- Keyword field (100 characters, commas, no spaces after commas): the rest of the high-value terms. Don't repeat words already in the name or subtitle. Skip plurals of included words, category names, the word "app", competitor names and trademarks.
- Promotional text (170): what's new or seasonal. It doesn't affect search rank, so write it for people, and change it any time without a new version.
- Description (4,000): for people, not search. Lead with the benefit in the first lines.

**Google Play**
- Name (30): brand plus the most important term. No emojis, no "#1" or "Best", no price or promotion words.
- Short description (80): the outcome in plain words. No emojis or repeated punctuation.
- Full description (4,000): write for people, using the main terms where they explain something. No keyword lists, no anonymous testimonials, no ranking claims.

### 5. Write each field

- First lines sell: the outcome, for whom, and why this app. Features come after.
- Specific beats clever: "See every bill due this week" beats "Take control of your money".
- Count every field. Count characters per language, not in the English draft.

### 6. Plan the screenshots as a story

- Frame 1: the main benefit, with the screen that delivers it.
- Frames 2 to 4: the top three features, one per frame.
- Next frame: proof (a real rating or award the client can show, or a real result from their own data).
- Last frames: secondary features or who it's for.
- Captions short enough to read at thumbnail size. Each screen shows the real app in use, not a logo or splash. On Play, caption text should cover no more than 20% of the image.
- App Store: up to 10 screenshots; the first one to three show in search when there's no preview video. Play: up to 8 per device type; games need at least three landscape 16:9 or portrait 9:16.

### 7. Check the rules

Run the checks below. Fix before handing over.

### 8. Act at the right level

- Level 2: save drafts in App Store Connect (in a version not yet submitted) and in Play Console (not sent for review).
- Level 3, after the client's yes on the action list: change promotional text; send approved Play listing changes for review.
- Fresh yes every time: submitting the app version that carries App Store name, subtitle, keyword and description changes.
- Note the date of each change, so later conversion data can be compared before and after.

## Checks

- Every field within its limit for that store and language.
- No word repeated between Apple's name, subtitle and keyword field.
- No competitor names, trademarks, celebrity names, prices, "#1", "Best", "Free" or "New" in titles or graphics.
- No claims the app can't back up; any rating or award shown is real and current.
- Every screenshot shows the app in use.
- Keywords the app doesn't serve are dropped, not hidden.
- The client knows which App Store fields wait for the next version.

## Output format

1. Job and audience lines.
2. Review phrase list with tags.
3. Keyword map: theme, keyword, source, relevance, volume (or "unknown"), field per store, keep or drop.
4. App Store listing table: field, limit, text, count, target keyword.
5. Google Play listing table: same columns.
6. Screenshot plan: frame, caption, what the screen shows, purpose.
7. What goes live now (level 3) and what waits for the next version (fresh yes).
8. The test to run first (hand to `store-page-tests-and-custom-pages`).

## Example of good output (short)

*Made-up app for illustration: "Tallyleaf", a bill reminder app.*

> **Keyword map (extract)**
>
> | Theme | Keyword | Source | App Store | Play |
> |---|---|---|---|---|
> | Due dates | bill reminder | 31 reviews | Name | Name |
> | Due dates | due date | reviews | Keywords | Full description |
> | Outcome | late fees | reviews | Subtitle | Short description |
> | Rival | (rival brand) | rival listing | Dropped: trademark | Dropped |
>
> | Field | Limit | Text | Count |
> |---|---|---|---|
> | App Store name | 30 | Tallyleaf: Bill Reminder | 24 |
> | Subtitle | 30 | Avoid late fees on every bill | 29 |
> | Play short description | 80 | See every bill due this week and get a nudge before late fees hit. | 66 |
>
> **Frame 1 caption:** "Every bill due this week, on one screen." Screen: the week view with three bills.
