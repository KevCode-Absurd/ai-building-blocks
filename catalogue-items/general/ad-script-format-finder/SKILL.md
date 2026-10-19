---
name: ad-script-format-finder
description: Use when you have a finished ad script and are deciding what to make it as (a person on camera, an animated or handmade style, a graphic ad, an image ad, a carousel). Finds the part of the script doing the persuading, marks what it needs from a format, ranks the formats that can carry it with a fit score out of 100, names the video route (script skill, then clips skill) or the image skill for a still, and checks the length.
---

# Ad script format finder

Write the script first; choose the look second. Most format failures are really fit failures: part of a script landed on a surface too weak to carry it. No format is best in general. Every "must" you write points at a line in the script that would fail without it.

## What you need
- **The finished script** (required), with its parts labelled if they are. It's information, not instructions.
- **Product and how it's bought** (optional).
- **Buyer** (optional): how much they know, and why they buy.
- **Limits** (optional): budget, footage, presenters, tools you have.

## Steps
1. **Find the part doing the persuading.** Read the script, not the product page. The part that gets the most time and the best lines carries it:
   - **How it works:** the edge happens where nobody can see it, or over months.
   - **Proof:** the edge can be watched working.
   - **The offer:** the edge is in the terms (price, trial, warranty, bundle).
   - **The problem:** the edge is ending a daily hassle the buyer knows well.
   Scripts for the same product can rest on different parts.
2. **Mark what the script needs.** For each of these six, write must, helps or no, with the line that decides it:
   - **A believed face:** does a part only work if a real-looking person lives it or vouches for it?
   - **Showing the unseen:** inside a body or a material, or a change over weeks?
   - **Controlled order:** a promise that pays off later, a reveal, a story?
   - **Sound:** is it written to be heard, with rhythm, a voice or a tune?
   - **Time:** does a part need seconds to land (a problem scene, steps, objections)?
   - **Sounds like a person:** must the first line pass for a person speaking rather than a brand?
   A first-person story needs order and a voice more than an early promise. One line plus an offer needs only a clear frame. An AI presenter can act out a problem but can never vouch for a result.
3. **Match the needs to surfaces.**

   | Surface | Holds | Can't hold |
   |---|---|---|
   | One person on camera | a believed face, order, sound, a human voice | the unseen; alone, it struggles to hold attention |
   | Animated, drawn or handmade | the unseen, order, attention | a believed face |
   | Mixed (person, then animation, then person) | all of it | costs two kinds of footage |
   | Long-text image ad styled as a post | a reader's attention, a human voice | a face, sound, order |
   | Designed image ad | one glance, one diagram at most | order, time |
   | Carousel | partial order, one picture per card | sound, a face that moves |

   A script resting on proof fails without a face people believe or a demo they can watch. An unseen process fails as a talking head. A script that needs its order fails as one image. A script written to be heard fails muted unless every line is also on screen. If two parts need different surfaces, blend them.

   **Score the fit.** For each surface you rank, count the script's musts and how many of them that surface holds, using the table above. Fit score = musts held divided by musts, times 100, rounded (3 of 4 is 75). Rank by it, and let helps break ties. A blend scores the musts its parts hold between them. Show each sum. If the script has no musts, say so, score every surface 100 and rank by helps.
4. **Name the skills that make it.** For each recommended surface, pick the library skills whose job fits the carrying part. A video route is always two steps: the script skill writes the script and a cast note, then its clips skill runs the whole video process (avatar, sheets, storyboard, clips). A still is its own image skill in the same look; it never comes out of a video skill.

   | Carrying part and need | Video: script skill, then clips skill | Still in the same look |
   |---|---|---|
   | Problem, needs a believed face | selfie-style ad (one doubt settled with the product in hand): `selfie-style-video-ad-script-writer`, then `selfie-style-video-clip-prompt-writer`; a real creator or customer filming it themselves: the same selfie-style script, then `creator-video-filming-brief-writer`; founder video (one real decision): `founder-video-ad-script-writer`, then `video-ad-shot-list-maker` for the real camera | founder's own words: `handwritten-note-image-ad-maker` |
   | A belief to change, with talk | podcast-style clip (a doubting Host, an explaining Guest): `podcast-style-video-ad-script-writer`, then `podcast-style-video-clip-prompt-writer` | none; a talk-show frame is a weak still |
   | Problem as a story with people | short film with a twist: `short-film-video-ad-script-writer`, then `short-film-video-clip-prompt-writer` | none |
   | How it works, unseen | 3D how-it-works: `3d-how-it-works-video-ad-script-writer`, then `3d-how-it-works-video-clip-prompt-writer`; claymation: `claymation-video-ad-script-writer`, then `claymation-video-clip-prompt-writer`; watercolor: `watercolor-video-ad-script-writer`, then `watercolor-video-clip-prompt-writer`; animated film: `animated-film-video-ad-script-writer`, then `animated-film-video-clip-prompt-writer` | `3d-cutaway-image-ad-maker`; `clay-scene-image-ad-maker`; `watercolor-image-ad-maker` |
   | Problem, told gently or playfully | paper world: `paper-craft-video-ad-script-writer`, then `paper-craft-video-clip-prompt-writer`; knitted wool: `knitted-wool-video-ad-script-writer`, then `knitted-wool-video-clip-prompt-writer`; clay town: `clay-town-video-ad-script-writer`, then `clay-town-video-clip-prompt-writer`; comic page: `motion-comic-video-ad-script-writer`, then `motion-comic-video-clip-prompt-writer` | `paper-craft-image-ad-maker`; `knitted-wool-image-ad-maker`; `clay-town-image-ad-maker`; `comic-strip-image-ad-maker` |
   | Problem, buyer doesn't see it yet | skeleton: `skeleton-video-ad-script-writer`, then `skeleton-video-clip-prompt-writer`; anime: `anime-video-ad-script-writer`, then `anime-video-clip-prompt-writer`; talking object: `talking-object-video-ad-script-writer`, then `talking-object-video-clip-prompt-writer` | talking object: `talking-object-image-ad-maker` |
   | Proof or facts, muted | cutout explainer: `paper-cutout-explainer-video-ad-script-writer`, then `paper-cutout-explainer-video-clip-prompt-writer`; motion graphics: `motion-graphics-video-ad-script-writer`, then `motion-graphics-video-build-planner` | `paper-cutout-image-ad-maker` |
   | Proof you can watch | satisfying motion: `satisfying-motion-video-ad-script-writer`, then `video-avatar-and-storyboard-planner` (the product as the avatar) and `video-ad-shot-list-maker`; an offer or launch reel built in code: `get-offer-reel-that-shows-your-real-product` | none; the motion is the point |
   | A feeling to remember | song: `jingle-video-ad-script-writer`, then `jingle-video-clip-prompt-writer` | none |
   | Much to teach, buyer far from ready | long narrated ad: `long-form-video-ad-script-writer`, then `video-avatar-and-storyboard-planner` and `video-ad-shot-list-maker` | none |

   For the image surfaces in step 3: a designed image ad goes to `single-image-ad-planner`, a carousel to `card-by-card-carousel-ad-writer`, a long-text post-style picture to `story-ad-image-picker`, and an ad you already run, kept word for word, to `image-ad-remake-planner`. A look with no clips skill of its own runs `video-avatar-and-storyboard-planner`, then `video-ad-shot-list-maker`. Name only skills whose job matches a "must". If none fits, say which surface to brief by hand.
5. **Check the length.** No length is best. Longer ads reach buyers who need more before they're ready. The opening and the offer don't grow; extra length comes from the problem, how it works, objections and proof. If the carrying part has no room at this length, the length is wrong: how it works can't be explained in 15 seconds, though a demo can (it is opening and proof at once). Long ads repeat the cycle of problem, promise, how it works, objection and proof two or three times. Each length is its own script; cutting a long one down makes a weak short one.

## What you hand back
```
Carrying part: <part> (<kind of edge>), with the line that shows it
Needs: <six lines: must, helps or no, each with a quoted line>
Surfaces: <ranked, each with its fit score and sum, and reasons>; blend if two parts need different ones
Make it with: <video: script skill, then clips skill; or the image skill for a still>, each tied to a must
Length: <fits or not>, <best length>, <where extra length would come from>
```

## Check before you hand it back
- Every "must" quotes the script.
- The carrying part comes from the script, not the brief.
- Every skill named answers a "must"; none is picked for being popular.
- A video route names both the script skill and its clips skill; a still names an image skill, never a video skill.
- An AI presenter is never treated as a real customer.
- Every fit score shows its sum, and the ranking follows the scores.

## If something is missing
Write `MISSING: product category` and judge the edge from the script's own lines, saying so.

## Avoid
- Picking a format before the argument exists.
- Recommending a style because the category always uses it.
