---
name: set-up-utm-tracking-for-all-channels
description: "One written UTM rule for every link a store sends out (paid social, Google, email, SMS, WhatsApp, organic social, creators, affiliates, QR codes), with a fixed list of allowed values mapped to GA4's channel rules, copy-ready templates for each channel, a link builder sheet, and a 10-minute weekly check that the rule is used. Fixes paid traffic landing in Organic Social, Unassigned sessions, mixed-case duplicates and UTMs on internal links. Use when GA4 channels look wrong, before launching creators or WhatsApp campaigns, or when several people build links."
---

# UTM tracking for every channel

**You get:** a one-page UTM rule, a value list (source, medium, campaign, content) mapped to the GA4 channel each lands in, ready templates for 10 channel types, a link builder sheet with formulas, and a weekly check sheet with pass or fail lines.

## When to use

- GA4 shows paid social as Organic Social, or a large Unassigned share.
- The same source appears as "Facebook", "facebook" and "fb".
- The store is starting creators, affiliates or WhatsApp campaigns and needs to see their sales.
- More than one person or agency builds links.

## Not for

- Setting up GA4 itself and checking it against orders: use `set-up-ga4-for-store-and-check-data`.
- Naming the ads inside the ad account: use `creative-naming-and-tagging-system` (this rule reuses its names in utm_content).
- Sales and profit per creator: use `track-creator-sales` (it uses these links).
- Deciding which channel deserves budget: use `blended-channel-profit-view`.

## What you need

1. **List of every place links go out**: ad platforms, email and SMS tool, WhatsApp tool or number, social profiles and link-in-bio, creators and affiliates, QR codes, marketplaces.
2. **GA4 traffic acquisition export**, last 28 days, by session source / medium and session campaign (level 1).
3. **Current naming**, if any: the ad naming rule, campaign names in each platform.
4. **Who builds links** in each channel.

Writing the rule changes nothing. Applying it inside ad accounts, email templates or link-in-bio pages is level 2 (draft) at least; live ads and scheduled sends change only after the client approves the list of edits. Editing a live ad can send it back to review; prefer adding parameters at the next new ad, or confirm with the client first.

## Before you start: the gates

1. **GA4 works.** Pass when purchases reach GA4 (capture check in `set-up-ga4-for-store-and-check-data`). Fail: fix that first; perfect tags on a broken property tell nothing.
2. **Google Ads auto-tagging is on.** It adds the gclid, is needed for conversion tracking, and wins over manual tags in GA4 [MEA-6225]. Do not turn it off to make UTMs show.
3. **Cache safety.** If the store sits behind a CDN or caching app, tracking parameters must stay out of the cache key, or every tagged link creates a fresh, slow page [SPD-0003]. Check with the developer or the app's settings.

## Steps

### 1. Fix the format

- Lowercase only. GA4 values are case sensitive, so "Google" and "google" are two rows [MEA-6221].
- Words joined with hyphens, no spaces, no special characters, English letters and numbers only, so every report and spreadsheet reads them the same way. Regional-language campaigns keep their language in the ad, not the tag.
- Always set utm_source, utm_medium and utm_campaign; add utm_content for the creative or link; use utm_id for the platform's campaign ID where the platform can fill it [MEA-6221].

### 2. Fix the allowed values

Medium decides the GA4 channel, so it is a closed list. Paid Social needs a social source and a medium matching cp, ppc, retargeting or paid*; any other medium on a social source becomes Organic Social [MEA-6220].

| Medium (exact) | Use for | GA4 default channel |
|---|---|---|
| paid-social | Meta, TikTok, Pinterest, Snapchat, LinkedIn ads | Paid Social |
| cpc | Microsoft Ads and other search ads without auto-tagging | Paid Search |
| social | Organic posts, stories, link in bio, DMs | Organic Social |
| email | Email campaigns and flows | Email |
| sms | Text messages | SMS (medium must be exactly sms) |
| whatsapp | WhatsApp broadcasts, flows and chat links | none: add a WhatsApp channel in a custom group |
| affiliate | Creators or partners paid on commission | Affiliates (must be exactly affiliate) |
| creator | Gifted or flat-fee creator posts | none: add a Creators channel in a custom group |
| display | Bought banners outside Google Ads | Display |
| qr | Packaging inserts, print, events | none: add an Offline channel in a custom group |

Source names the platform or sender: facebook, instagram, tiktok, pinterest, youtube, google, bing, newsletter, the store's email tool name, whatsapp, the creator's handle for creator links. Keep a fixed list; new values are added by the rule owner only.

Campaign: yyyy-mm-theme, for example 2026-11-diwali-gifting or 2026-11-bfcm. Use the same campaign name across channels for one push so the push can be read whole.

Content: the ad name from the naming rule, the email link position (hero, footer), or the creator's post ID.

Build one GA4 custom channel group (the default cannot be edited) that adds WhatsApp, Creators and Offline, plus AI assistants, whose influence mostly arrives without a link [AEO-0010].

### 3. Write the templates

Fill one per channel type in the sheet:

- **Meta and TikTok ads:** set parameters in the ad's URL parameters field, not the landing URL, so one template covers every ad. Both platforms offer dynamic values that fill in campaign, ad set and ad names or IDs at click time; copy the current macro names from the platform's own URL parameter builder. Template: source = facebook or tiktok (or the dynamic site source), medium = paid-social, campaign = campaign name, content = ad name, id = campaign ID.
- **Google Ads:** none needed; auto-tagging covers GA4 [MEA-6225]. Add UTMs only if another tool needs them, and know GA4 will ignore them.
- **Email and SMS:** most email and SMS tools can add UTMs to every link automatically; set the tool's defaults to this rule once, then spot-check one send.
- **WhatsApp (India first):** every link in broadcasts, catalog messages and automated flows carries source=whatsapp, medium=whatsapp, campaign, content = template name. Chat replies typed by agents use a short saved link per product.
- **Organic social and link in bio:** one tagged link per platform, content = post date or bio.
- **Creators and affiliates:** one link per creator: source = handle, medium = affiliate or creator, campaign = program and month. Give each creator a discount code too, as a backup for buyers who type the URL [MEA-0040].
- **QR codes:** source = insert, print or event name, medium = qr. Print a short redirect link so the target can change later.

### 4. Build the link builder sheet

Columns: Channel, Builder, Base URL, Source (drop-down), Medium (drop-down), Campaign, Content, ID, Final URL (formula joining with ? or & correctly and lowercasing), Short link, Date, Live from. Drop-downs stop free typing. Test each final URL once in a private window and confirm the page loads and the parameters survive any redirect.

### 5. Set the internal-link ban

Never put UTMs on links inside the store's own site: banners, menus, product links, pop-ups. An internal tagged link restarts the visit's source and steals credit from the channel that brought the buyer (practitioner default, long-standing analytics advice).

### 6. Run the weekly check (10 minutes, Monday)

In GA4 Traffic acquisition, last 7 days:

1. Unassigned sessions under 5% (practitioner default). Pass or fail.
2. No paid platform source under Organic Social with a medium outside the list.
3. No mixed-case or misspelled source or medium (filter for capitals and unknown values).
4. Campaign "(not set)" under 5% of tagged sessions.
5. Every live creator, WhatsApp flow and QR code has sessions or a reason why not.
6. Internal referrals: the store's own domain is not a top source.

Log fails with the link owner and fix date. Three fails in a row on one owner means the template, not the person, needs fixing.

### 7. Cross-check monthly

Compare GA4 channel shares of new-customer orders with the post-purchase survey (`post-purchase-how-did-you-hear-survey`) and spend shares [MEA-0045]. Tags show the last click that carried a link; the survey shows memory. Big gaps point to untagged links or channels that work without clicks.

## Checks before you hand it over

- Every medium value in the list maps to a named GA4 channel or a custom channel.
- Paid social templates use a medium that matches the Paid Social rule.
- All values are lowercase and hyphenated; drop-downs enforce the lists.
- Google Ads auto-tagging is on and untouched.
- Each channel type has a filled template and one tested final URL.
- The custom channel group covers WhatsApp, Creators, Offline and AI assistants.
- The weekly check sheet has six pass or fail lines and an owner.
- No live ad or send was edited without the client's yes.

## Output

**1. One-screen summary:** the rule in five lines, the medium list, what changes this week, who owns the rule.

**2. UTM rule page** (format, allowed values, internal-link ban, who may add values).

**3. Value list**

| Field | Allowed value | Meaning | GA4 channel | Added by, date |
|---|---|---|---|---|

**4. Templates**: one block per channel type with the parameter string.

**5. Link builder sheet** with the columns in step 4.

**6. Weekly check sheet**

| Week | Unassigned % | Paid in organic | Case errors | Campaign not set % | Dead links | Internal referrals | Fails, owner, fix date |
|---|---|---|---|---|---|---|---|

## Common mistakes

- **medium=facebook-ads or medium=ads.** It lands in Organic Social; step 2 uses paid-social.
- **Turning off Google auto-tagging.** Step 3 leaves Google Ads to the gclid.
- **Free-typed values.** Step 4 uses drop-downs.
- **UTMs on site banners.** Step 5 bans them.
- **WhatsApp left untagged.** In India it is often a top channel; step 3 tags every flow and broadcast.
- **Creator links without codes.** Buyers retype URLs; step 3 adds a code.

## Sources

- MEA-6220: GA4 Paid Social needs a paid medium; other mediums count as organic.
- MEA-6221: always set source, medium, campaign; values are case sensitive.
- MEA-6225: Google Ads auto-tagging is required and wins over UTMs in GA4.
- SPD-0003: keep tracking parameters out of CDN cache keys.
- AEO-0010: AI-assistant influence mostly arrives without a link.
- MEA-0040: small and new channels show up in other channels' numbers.
- MEA-0045: survey shares should roughly match spend shares.

What makes this skill ours: the medium list is mapped line by line to GA4's real channel rules, so a typo cannot hide paid spend as organic; WhatsApp, creators and QR codes get their own channels in a custom group; and a 10-minute weekly check catches drift before a month of data is lost.
