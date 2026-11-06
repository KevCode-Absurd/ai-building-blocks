---
name: delivery-and-rights-check
description: Gets a finished cut out of the edit and onto each platform safely. Builds a dated delivery spec per platform (shape, size, length, codec, frame rate, captions), writes or checks the caption file, keeps a rights log for every song, sound effect, stock clip, font, logo and recognisable face, flags AI content that needs disclosure, and, with level 3 access, uploads or schedules within the client's limits. Covers YouTube, Shorts, Instagram Reels and LinkedIn as checked on 6 Nov 2026. Use before any video goes live, or when a video has been claimed, muted or rejected.
---

# Delivery and rights check

Most video problems show up after upload: a copyright claim, a muted track, captions that do not match, titles under the app's buttons, a file the platform rejects. This skill catches them before the client's name is on it. It gives no legal rulings; licence questions go to the rights owner or the client's lawyer.

## When to use

- A cut is approved and needs to go to one or more platforms.
- A client asks "can we use this song?" or "is this stock clip OK for an ad?".
- A video has been claimed, muted, blocked or rejected.

## What you need

- The final cut (or a link to it) and the approved script.
- The list of platforms and placements (organic, ad, website).
- Every music, sound, stock and font source, with whatever licence or receipt the client has.
- Names of everyone who appears, and their consent forms.
- Whether any picture, voice or music was made or altered with AI.
- **Access I have** in each tool. Steps 1 to 7 need level 1. Step 8 (uploading as private or unlisted, or saving as a draft) needs level 2. Step 9 (publishing or scheduling) needs level 3 within the client's limits.

## Steps

1. **Pull current specs.** Open each platform's help page and write the spec and the date checked. As of 6 Nov 2026: YouTube uses 16:9 as standard on computers and asks for MP4 with H.264 and AAC-LC or Opus audio at the recorded frame rate; Shorts may be up to 3 minutes, square or vertical; Instagram Reels ads are 9:16 at 1440 x 2560 recommended, MP4 or MOV, up to 15 minutes and 4 GB; LinkedIn video ads take MP4 from 3 seconds to 30 minutes, under 30 fps, with SRT captions. Check TikTok in its own business help centre, which blocked automated checks on that date.
2. **Make the delivery table.** One row per file: platform, placement, shape, pixel size, length, frame rate, codec, caption method, file name. Name files with project, shape, length and version.
3. **Check the frame.** Watch each version at its real size on a phone or the target screen. Titles inside safe areas (vertical: 14% top, 35% bottom, 6% sides free, per Meta's Reels ad spec); no black bars burned into the file for YouTube; nothing flashing more than three times in any one second (WCAG 2.3.1).
4. **Captions.** Write captions from the final audio, not the draft script. Name speakers when unclear and include sounds that matter (WCAG 1.2.2). Keep each caption to two lines of no more than 42 characters, at no more than 20 characters per second, on screen for five-sixths of a second to 7 seconds (Netflix English guide). Deliver SRT as plain UTF-8 for YouTube and LinkedIn; burn in open captions for platforms where sound-off viewing is common and the client wants them.
5. **Build the rights log.** One row per item: what it is, where it appears (timecode), source, licence type, what the licence allows (platforms, ads or organic, territory, term, credit), proof on file, and status (cleared, needs licence, replace). Use these basics:
   - A song recording usually involves two works, the composition and the recording, licensed separately (U.S. Copyright Office).
   - A track inside YouTube's Audio Library is described as safe for YouTube and not claimed by Content ID; Creative Commons tracks there need credit in the description.
   - Meta's Music Guidelines say business or other non-personal use of music needs the right licences.
   - Creative Commons NC material is non-commercial only; ND material cannot be edited.
   - Free stock licences have conditions (Pexels, for example, bars implying that people or brands shown endorse a product).
   - Every recognisable person needs written consent on file.
6. **AI disclosure.** If realistic people, places or events were made or altered with AI, plan the disclosure: on YouTube, set "AI use" in YouTube Studio for realistic synthetic content; in the EU, Article 50 of the AI Act requires deepfakes to be disclosed from 2 August 2026, with a lighter duty for evidently artistic or fictional work. AI help with scripts or minor fixes does not need YouTube disclosure.
7. **Report.** List blockers (no licence, no consent, spec failures) first, then fixes, then the ready files. If a claim has already arrived, explain the options YouTube lists: leave it, remove or replace the claimed audio, share revenue if eligible, or dispute only with real rights in hand.
8. **Level 2: upload as draft.** With level 2 access, upload each file as private, unlisted or draft, with title, description, captions and any required credit or disclosure. Do not publish. Log each upload.
9. **Level 3: publish within limits.** With level 3 access, show the action list (files, accounts, dates, placements) and get a yes, then publish or schedule within those limits. Ask again before posting to a new account or audience, deleting or replacing a live video, or anything outside the plan. Buying or accepting a music or stock licence commits the client to terms: get a fresh yes each time, and leave payment to the client. Log each action and its result; stop and report on any error, claim or policy warning.

## Checks

- Every file matches a dated spec from the platform's own page.
- Captions match the final audio and meet the timing floor.
- Every rights item is cleared, with proof on file, or replaced.
- AI disclosure planned where required.
- Nothing published without level 3 and a confirmed action list.

## Output format

1. **Delivery table** with specs and dates checked.
2. **Frame and caption check results.**
3. **Rights log.**
4. **AI disclosure note.**
5. **Blockers and fixes.**
6. **Action log** for level 2 and 3 work.

## Example of good output (short)

*Okafor Physio is a made-up clinic used only to show the format. Access I have: YouTube level 2, Instagram level 1.*

| Item | Where | Source | Licence | Allows | Proof | Status |
|---|---|---|---|---|---|---|
| Music bed | 0:00-0:58 | YouTube Audio Library | Standard Audio Library licence | Use on YouTube | Track name noted | Cleared for YouTube; replace for Instagram |
| Stock clip, runner | 0:12-0:15 | Pexels | Pexels licence | Commercial use, no credit | Download link saved | Cleared; no endorsement implied |
| Patient on camera | 0:20-0:31 | Filmed in clinic | Consent form | Web and social | Signed form on file | Cleared |

**Blocker:** the Instagram version needs a music track cleared for business use on Meta. **Log:** uploaded "Okafor_16x9_60s_v04" to YouTube as private with SRT captions; not published.
