---
name: short-video-edit-pipeline
description: "Turns a store's raw footage or long recordings into finished vertical videos for Instagram Reels, YouTube Shorts and TikTok, with a human yes on the cut list before anything is rendered and a second yes before anything is posted. Logs and transcribes the footage, picks clips with a hook that shows the topic in the first frame, writes a cut list with on-screen text, captions, B-roll and music, then checks each render against each platform's length, safe-zone, caption, music-rights and AI-disclosure rules. Runs from a shared sheet and email or comments, with any editor (free or paid) or a code-based renderer. Use when footage piles up unedited, when a store starts posting short video, or when edits keep failing platform checks."
---

# Short-form video editing pipeline

**You get:** finished 1080 x 1920 videos for Reels, Shorts and TikTok, each with its cut list, captions, post text and platform check table, plus a weekly work queue sheet, approved before render and before posting.

Raw footage in, approved vertical videos out, with two human approvals and a platform check on every file. Tool-neutral: CapCut, DaVinci Resolve (free), Premiere, or a code-based renderer all fit.

## When to use

- The store has hours of footage or long recordings and posts little.
- A founder records, someone else edits, and drafts bounce back and forth with no clear approval step.
- Videos get cut off by app buttons, muted for music rights, or flagged for missing labels.
- The store wants a steady weekly output of Reels, Shorts and TikToks from one shoot.

## Not for

- Fixing a paid video ad's drop-off: use `video-ad-retention-fix`.
- Writing a creator or ad script from scratch: use `creator-video-script`.
- The cover image for each video: use `short-video-cover-series`.
- Choosing which ads to scale or cut: use `store-meta-creative-review`.

## What you need

Required:

1. **Footage**: a shared folder of raw clips or long recordings, original files, not compressed copies from a chat app.
2. **Scripts or talking points**, if any, and the topic list for the month.
3. **Brand tokens**: fonts, colours and logo from `store-visual-identity-sheet`, or the brand guide.
4. **Platforms and accounts**: which of Reels, Shorts and TikTok, and whether each account is a business or creator account (this changes which music is allowed).
5. **Approvers**: who approves the cut list and who approves the final post, with a turnaround time.

Optional: past post insights (views, 3-second hold, shares, non-follower share), product list with gross profit per purchase, music library access.

Access: editing and rendering touch only the shared folder (level 1 on the store's accounts). Posting needs publish access (level 3) or the client posts it; either way, nothing goes live without the second approval.

## Before you start: the gates

1. **Gross profit per purchase.** Only needed when choosing which product to feature or which post to turn into an ad. Pass when the store's money lines exist (`store-meta-math`). Fail: edit anyway, but do not rank products or recommend paid boosts.
2. **Capacity.** Editor hours a week and approver turnaround. A pipeline that makes 10 cuts a week for an approver who looks once a week jams. Set weekly output to what both can carry; four to six posts a week is a sound start [ORG-0015].
3. **Rights.** Pass when every person on camera has agreed to appear, every music track is cleared for the account type, and any reused customer content has written permission. Fail: drop that clip.
4. **Tracking.** For organic posts, platform insights are the measure. Note whether past insights are available; without them, step 10 starts the baseline.

## Steps

### 1. Set up the work queue

One shared sheet, one row per video, with these status columns: Raw, Logged, Cut list ready, Cut list approved, Rendered, Checked, Approved to post, Posted, Read at 7 days. Approvals happen as a reply in the sheet's comment thread or by email; no chat tool is needed. Each row links to its folder and records the brief: target length, how heavy the edit is (as recorded, light trim, or restructured), caption style (word by word, phrase, none) and music mood (or none). Set a cost ceiling per edit for any paid tools, and flag a row before it goes over.

### 2. Log and transcribe

Transcribe every recording with word-level timings using any tool (the editor's built-in captions or an open-source transcriber). Mark filler words, dead air and repeated takes. Build a shot log: file, start and end time, what is said or shown, framing, quality (focus, sound, light). Mark usable moments.

### 3. Pick the clips

A clip is worth cutting when it makes one point on its own in under about 60 seconds (practitioner default, test it). For each:

- **First frame:** shows the topic being done (the product in use, the food being eaten), not unrelated B-roll [ORG-0017].
- **Hook text on screen:** 5 to 8 words, grade 5 reading level; performance fell past 12 words [ORG-0016].
- **Hook levers:** spoken line, on-screen text and the visual are separate; write two or three options for each [MCR-0028].
- **Organic posts give, they do not sell:** no call to action until posts reach about 5,000 views (around 2,000 in a narrow niche) [ORG-0014].
- **Series:** if a format repeats, number it ("day 12 of...") so viewers come back [ORG-0018].

### 4. Write the cut list (approval 1)

Before any render, write one cut list per video:

| Field | Example content |
|---|---|
| Source and timecodes | File, in and out points for each segment |
| Hook | Spoken line, on-screen text (5 to 8 words), first-frame visual |
| Structure | Segment order, cuts, B-roll slots with what fills them |
| Captions | Style from brand tokens, burned in |
| Music | Track name and its licence for this account type |
| End | Last frame or loop point; call to action only if the account qualifies |
| Platforms | Reels, Shorts, TikTok, and any version differences |

Give every segment a job (hook, setup, proof, payoff, or ask) and cut any segment that has none. Fill B-roll slots from the store's own footage first; generate B-roll only when nothing real fits, and mark it for disclosure.

Send it to approver 1, who replies approve, change (with notes per segment) or reject. No render starts until the row reads "Cut list approved". Changing a list costs minutes; changing a render costs an hour.

### 5. Edit

Cut in any editor. Rules:

- Vertical 9:16 at 1080 x 1920; keep the source frame rate.
- Cut dead air and filler words; keep one idea per segment.
- Pace changes every few seconds in the first part (practitioner default, test it).
- If AI-made voice, faces or scenes are used, they are marked for disclosure in step 7. Never present AI-made people or results as real customers.

### 6. Captions

Burned-in captions, checked word for word against the transcript; product names, prices and numbers checked twice. Two lines at most, high contrast, inside the safe zone from step 7. Also upload a caption file where the platform allows, for search and accessibility.

### 7. Platform checks

Check each render against each platform's current rules; these change, so open each platform's help page on the day.

- **Length:** Reels, Shorts and TikTok all now accept videos of 3 minutes or more, but short pieces still suit most store content. Keep each cut to the length its idea needs.
- **Safe zones:** app buttons and captions cover the top, bottom and right edge. Keep text and faces out of roughly the top 14%, the bottom 35% and the right 10% of the frame (practitioner default from the platforms' ad guides, test it with each platform's overlay).
- **Music:** business accounts are often limited to a commercial music library; a track allowed on a personal account can be muted on a business one.
- **Disclosure:** label realistic AI-made or altered content with each platform's AI label; label paid creator content as a paid partnership.
- **Claims:** any product claim matches the store's approved claims; health and before-and-after claims follow platform rules.

Mark each check pass or fail in the sheet.

### 8. Render and review on a phone

Watch every render on a phone, once with sound and once muted. Pass or fail (practitioner defaults, test them):

- Length within 1 second of the approved target; the hook lands in the first 2 seconds.
- No audio clipping (peaks below about -1 dB); music sits roughly 12 dB under speech; no silent gap over half a second unless planned.
- Captions readable at phone size; colour consistent across cuts; the safe zone holds; the ending loops or closes cleanly. An end card shows the logo; it carries a call to action only when the account qualifies (step 3).

When something fails: a garbled transcript gets a second pass, then a person; a render that crashes is retried twice, then a person; unreadable captions go back a step with a size increase.

### 9. Final approval and posting (approval 2)

Send approver 2 the render, the post caption, hashtags (a few relevant ones), the cover from `short-video-cover-series`, and the check results. Post only after "Approved to post". Post natively where you can; one programme found schedulers cut reach [ORG-0013], so if the client uses a scheduler, compare reach for a month before deciding. On Instagram, a cut can first run as a trial reel to non-followers to read retention before the main post [MCR-0041].

### 10. Read the results at 7 days

Per video: views, 3-second hold, average watch time, shares, comments, saves, non-follower share. Judge by goal: shares for growth, comments and story views for selling [ORG-0019]. If 70 to 80% of views come from followers, the hook failed strangers; rewrite hooks, not volume [ORG-0029]. A post at about five times the usual views belongs in ads: hand it to `store-meta-creative-review` [ORG-0035]. Repost a clear winner in new formats with new hooks [ORG-0026].

## Checks before you hand it over

- Every video has an approved cut list dated before its render.
- First frame shows the topic; hook text is 8 words or fewer.
- Captions match the transcript word for word on names, prices and numbers.
- Each render passes the step 8 checks on length, hook timing, audio and captions.
- Safe zone, length, music licence and disclosure are pass for each platform.
- No AI-made person or result is passed off as a real customer.
- Nothing was posted without approval 2.
- Weekly output fits editor hours and approver turnaround.

## Output

1. **One-screen summary:** videos this week by status, what is waiting on whom, and last week's top and bottom performer with one lesson.
2. **Work queue sheet:** Video, Topic, Platforms, Status, Cut list link, Render link, Checks, Approver, Dates, 7-day results.
3. **Per video:** the cut list, the render (MP4, 1080 x 1920), the caption file, post caption and hashtags, and the check table: Platform, Length, Safe zone, Captions, Music licence, Disclosure, Claims, Pass or fail.

## Common mistakes

- **Rendering before approval.** Step 4 makes the cut list the approval point.
- **Pretty B-roll first.** The first frame must show the topic [ORG-0017].
- **Long hook text.** Keep it to 5 to 8 words [ORG-0016].
- **Music muted after posting.** Step 7 checks the licence for the account type.
- **Text under the app buttons.** Step 7 checks the safe zone on every platform.
- **Sales pitch on a small account.** Organic posts hold the ask until views grow [ORG-0014].
- **Judging by views alone.** Step 10 reads hold, shares and non-follower share.

## Sources

- MCR-0028: hook as spoken, text and visual levers.
- MCR-0041: trial reels to pre-test cuts.
- ORG-0013: native posting versus schedulers.
- ORG-0014: no call to action until about 5,000 views.
- ORG-0015: 4 to 6 posts a week to start.
- ORG-0016: 5 to 8 words of hook text.
- ORG-0017: first frame shows the topic.
- ORG-0018: numbered series.
- ORG-0019: judge posts by goal.
- ORG-0026: repost winners in new formats.
- ORG-0029: non-follower share as the hook test.
- ORG-0035: outperforming posts go to ads.

What makes this skill ours: the cut list is the approval point, so nothing renders before a yes; every file passes a per-platform check for safe zone, music licence and AI disclosure; the whole pipeline runs from one shared sheet with no chat tool; and only posts that beat the store's own baseline are passed to paid ads, where gross profit per purchase decides.
