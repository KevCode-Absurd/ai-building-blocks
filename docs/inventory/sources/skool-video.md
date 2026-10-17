# Source: skool video courses + Nuova Era (prefix SKV)

Paths: `C:\Users\kevin\OneDrive\Desktop\Business\Ecommerce OS\skool\` → `AI Video Bootcamp\`, `AI Video School\`, `Nuova Era AI Academy\`, plus `START HERE.html`
Rights: **course**. All three are paid Skool communities. Use them as reference only: learn from them, don't republish them. The Bootcamp also promotes its instructors' own tool (Promptwise).
CSV: `skool-video.csv`, **443 rows** (SKV-001 to SKV-443): 245 knowledge, 87 prompt, 54 skill, 38 workflow, 19 asset. By course: Bootcamp 229, AI Video School 69, Nuova Era 144, START HERE 1.
Porting tags (first token of `notes`): 108 PORTED, 75 PARTIAL, 52 NOT-PORTED, 208 N/A. Most of the N/A rows are admin pages, transcripts, packaging copies and navigation.
Inventory date: 2026-10-17

## How this was done

- I extracted every text file to plain text in `%TEMP%\skv\ext\`: 501 files (HTML, MD, TXT, JSON, PDF, DOCX, XLSX and `.skill` zip listings). pypdf and python-docx were not importable, so PDFs went through poppler `pdftotext`, DOCX through `zipfile` on `word/document.xml`, and XLSX through its sheet and shared-string XML. I did not open any media.
- I read every lesson page and every skill file. For the big prompt packs I read their structure and counted the prompts; for transcripts I sampled them, because each has a written guide that covers the same ground.
- I reused the prior Creative Engine (CE) audits: `docs/bootcamp-audit/*` (2026-10-11), `docs/courses/*` and `COURSES-PLAN.md` (2026-10-08). I checked them against the source text, then grepped CE `skills/` to confirm each "ported" claim. Every PORTED row names a CE skill or reference that actually cites or contains the technique.
- I found 41 groups of exact-duplicate files by text hash. Each copy has its own row, with `duplicate_of` pointing to the first copy. The ChatGPT/Claude skill twins and the `.skill` zips point to the unpacked Claude folder or to their archive zip.

## 1. Course structures

| | AI Video Bootcamp (Daniel/Matt, Promptwise) | AI Video School (Andy, Higgsfield) | Nuova Era AI Academy (Gennaro & Mary) |
|---|---|---|---|
| Lessons / courses | 130 / 11 | 63 / 7 | 75 / 14 |
| Lesson style | Mostly short pages plus a video. 37 have transcript PDFs, and 94 PDFs in all (83 unique) | Long written lessons with prompts inline | Long written lessons with prompts inline |
| Videos (not watched) | 94 mp4 (13.1 h, 10.4 GiB) | 13 mp4 + 1 mov | 8 mp4 + 1 mp3 |
| Images (not opened) | 150 png, 27 jpeg, 5 jpg, 7 gif, 1 webp | 127 png, 64 jpg, 24 jpeg, 11 gif, 1 webp | 99 png, 4 jpg |
| Skills | None (All Skills page is navigation only) | Prompt Director (1 SKILL.md, 3 copies) | 8 skills × ChatGPT/Claude twins, Prompt Director (5 refs), 2 standalone prompters, 17 `.skill` zips + 13 lesson copies |
| Archive data | lessons.raw.json has 132 records (130 lessons + 1 comment + 1 community); 285 resources, 398 links. 1 GIF failed; Golden Ticket/level rewards locked | 65 records (63 + 2); 228/228 resources | 77 records (75 + 2); 131/145 resources (14 × `1.png` failed) |

**Bootcamp sections:** Start Here (8, admin) · Creator Foundations (10) · AI Images (21, including 3 locked prompt banks of about 89, 31 and 34 prompts) · AI Videos (14) · AI Advertising & UGC (16) · Advanced Flows (10, Promptwise node canvas) · Social Media & Going Viral (23, of which 14 are niche pages, 12 of them video-only) · AI Filmmaking (9, all video-only) · Clone Yourself (12, HeyGen) · Live Calls + Monetization (6, with an agency contract DOCX and an hourly-rate XLSX) · Affiliate (1).

**AI Video School chapters:** First Day (5) · Basics (5) · Image (10) · Video (6) · Workflow Breakdowns (14, including a 4-lesson Brand Sheet module) · Monetization (11, including a 7-lesson Product Image Agency module) · Prompt Vault (12).

**Nuova Era courses:** Welcome (3) · Foundations (5) · Image Mastery (7) · Video Mastery (11, one rainy-café example carried through Gemini Omni Flash, Seedance 2.5, Kling start/end frames and Veo 3.1 dialogue) · Viral Cases (3) · Clone Yourself (7) · Hyper-Realistic Skin UGC (9) · Cinematic Style (2) · Anime (2) · Prompters + Skills (9) · AI Brand Product Workflow (3) · AI Audio (4) · Make Money (7) · Affiliate (3). It also has a 10-page "AI Stack We Actually Use" PDF (SKV-414; duplicate copy SKV-415).

**START HERE.html** (SKV-443) is the index of all 5 archived classrooms. AI CMO and AI Operator are inventoried under SKA.

**Overlap between the courses:** AVS and NE share the Prompt Director lineage; the AVS version (SKV-231) is an earlier, shorter form of the NE one (SKV-333). Both teach photorealism, character consistency, camera shots, upscaling and taste training in parallel lessons. The NE "Anime Style Skill" and "Seedance Prompter" resources are the same files as its two standalone prompters.

## 2. What is already in Creative Engine

CE absorbed most of the craft between 2026-10-08 and 10-11, mainly into `skills/production-principles/references/` and the format skills.

| Course technique (example rows) | CE owner (verified) |
|---|---|
| Realism lock / phrase cheat-sheet, photorealism, imperfections (SKV-028, 246, 348) | production-principles: environment-realism, portrait-realism, skin-detail-craft |
| Skin by face zone, hands and nails, contact details, skin playbook (SKV-376, 379, 380, 420) | skin-detail-craft.md, hands-and-accessories.md |
| AI avatar creation, character consistency, clone photo library (SKV-024, 248, 369) | avatars + identity-photo-library.md, recurring-character-motion.md; avatar settings packs built from Bootcamp "Influencer Studio" |
| Real-photo identity swap (SKV-247) | Avatar Studio swap prompt |
| Product in hand / place any product / commercial use cases (SKV-027, 398, 399) | product-placement.md, product-placement-techniques.md, commercial-image-treatments.md |
| Camera language, 12 shots, Shot Architect (SKV-352, 328) | camera-shots.md (cited by the anime and cinematic skills) |
| Camera moves: start/path/pace/arrival (SKV-048, 183-184, 257) | video-director, cinematic-ad-directing |
| Seedance timed prompts, Seedance 2.5 scene/refs, Kling start/end, Veo dialogue (SKV-046, 326, 360-362) | video-director, models.md, video-prompt-architecture, reference-storyboards, endpoint-transitions, dialogue-performance |
| Avatar UGC ads on Seedance (SKV-059): contents evidence, multi-clip arc, restrained gestures | realistic-ai-ugc, ugc-script, ai-ugc-hooks |
| Podcast ads (SKV-062, 204-205) | podcast-ad (listener reactions, cut continuity) |
| 2D animation, anime and GHOST HAND OVA (SKV-063, 386-387) | anime-comic-animation, including multi-clip-continuity.md |
| Claymation ads (SKV-064, 208-209) | claymation-animation, claymation-ads |
| Two-character one-room film, directing (SKV-384-385) | cinematic-ad-directing, video-director |
| 16 script frameworks, hooks, awareness, psychology (SKV-210, 213) | script-types, hook-bank, buyer-stage, ad-script-principles |
| Talking object (SKV-265) | talking-object-ad |
| Wide Face skill (SKV-332) | wide-face-portrait, which says it is adapted from Nuova Era's package. COURSES-PLAN had said "leave out", so this decision changed |
| Voice description order, audio landscape (SKV-320, 400) | voice-performance.md, audio-direction.md |
| Upscaling (SKV-037, 250, 351) | image-upscaling |

## 3. Not yet ported: techniques worth building as own skills or workflows

Ranked by how useful each would be for ecommerce ads. Unless noted, none of these exists in CE skills or `src` (I grepped for each).

**Video ad production (CPV)**
1. **Product-only "hyper-motion" spot** (SKV-293): one prompt makes an 8 s commercial with about 10 timed sub-second cuts (texture world, pack reveal, macro sweep across the label, hero, payoff, lock-off). It needs no script and no person. CE's video path always starts from a script, so this would be a new format (proposed name `hyper-motion-product-spot`). There is also a sister format, the wacky Japanese comedy spot (SKV-294).
2. **30 s single-generation selfie UGC ad** (SKV-061). It makes the whole ad in one Seedance 2.5 generation with one voice and six hard jump cuts. The prompt locks camera ownership (we look through the phone, no second phone, one free hand) and gives `@image` "appearance only" roles. This is COURSES-PLAN brick CV-08, still open.
3. **Phone-footage finishing / "contrast trick"** (SKV-050): lower contrast, a little less saturation, lifted highlights and subtle shake, applied after generation. CE's editor has no grading step (CE audit proposal 4).
4. **Audio finishing workflow** (SKV-403, 401, 402, 330): script → voice → music → SFX → mix → check. CE does not trim dead air, even out loudness, add room tone or lay a music bed (CA-01, CA-06, CA-08 open; no loudnorm or silence trim in `src`). Two parts to build: the Suno prompter as a music-bed skill, and the ElevenLabs Script Writer as a delivery-marks step (SKV-318, CA-03/CA-07).
5. **In-app clip evaluation** (SKV-358): watch each clip 3 times (normal, muted, paused) and check identity, hands and object drift. The checks exist only as manual guidance; the app step is COURSES-PLAN CV-09.
6. **Motion transfer** (Kling Motion Control / Higgsfield Genjutsu; SKV-051, 256, 365): a real performance video drives an avatar. CE has no route for it. This needs a rights-clean source performance.
7. **Chaotic pattern-interrupt hook pack + B-roll prompt modes** (SKV-059): a generator for 10 "what just happened" stunt hooks, plus fast-cut and normal-cut B-roll prompts. Covered by the CE proposals "UGC production modes" and "controlled hook packs".
8. **Two-person lifestyle conversation ad** (tennis and friends examples in SKV-061) and **sitcom scene ad** (SKV-367): new multi-person formats.
9. **Green-screen creator clip** (SKV-292): a presenter keyed over a PDP, review or screenshot. This needs a keying/layer step.
10. **Generative edit of existing clips** (Gemini Omni vs Seedance, SKV-047), plus a persistent **world/location kit** reused across jobs (short-film PDF SKV-203, CE Feature 3).
11. **Game-look stylised ads** (GTA-style, SKV-067; retro 8/16-bit, PS1 low-poly, rubber-hose, synthwave, felt and vinyl-toy looks in SKV-287). Build these only as original worlds, with no IP imitation.

**Static / product imagery (CPS)**
12. **One image → 9 camera angles / product angle sets** (SKV-253, plus the Bootcamp "angles" node SKV-079 and NE SKV-363): for PDP angle sets, storyboards and hook variants.
13. **Conceptual product-world images**, 10 concepts (SKV-286): surreal scale, material fusion, light-built set, reflective world and others. COURSES-PLAN CI-08, still open.
14. **Brand sheet generator** (SKV-271-274): product + URL → moodboard, ad, SKU, editorial and UGC images → one designed page. Useful as a pitch and onboarding asset.
15. **Makeup without losing skin detail** (SKV-378): no CE guidance; high fit for beauty brands.
16. Smaller items: **3D logo** end card (SKV-288), **placard/sign ad** (SKV-289), drawing/packaging illustration comes to life (SKV-266), toy-box style **transformation** hook (SKV-268), Canva-style region edit/layers (SKV-030), and LLM "collision" ideation prompts (SKV-259).

**Workflow tooling (SY)**
17. **Reusable recipes / node flows** (Promptwise Flows, MagicFlow, prompt node feeding several models; SKV-073-078): a saved, branchable workflow with one prompt sent to several models. This is CE audit Feature 2, not built.

Low ecommerce fit, recorded for completeness: the viral social niches (SKV-090-103; miniature, POV and fruit could become product-world ads), HeyGen headshot lip-sync and clone customisation (SKV-117, 119), and the Gemini Omni Flash, Veo and Kling routes.

## 4. Where the courses contradict CE (settle by render, per COURSES-PLAN)

- **What a clip's pack holds.** The courses send only refs (character, product, place) and direct the shots in words; AVS writes 10 sub-second cuts with no stills. CE attaches 1 still per shot, 3-5 shots per clip, cut on whole seconds.
- **How the product is described.** The courses name it only by its photo plus a lock sentence placed last. CE writes 2-3 facts in words.
- **Building one ad.** The courses make a whole ad in one generation (30 s); CE joins clips. For voice, the courses let the model speak and change the voice afterwards (or attach ElevenLabs audio as a reference); CE makes the voice first.
- **Character sheets.** The courses use 4-6 views including profile and teeth (and the Bootcamp passport has macro panels), or 1 portrait plus an identity line. CE uses 3 views.
- **Candidates.** The courses (AVS agency lesson) generate 10-20 and keep 2-5. CE renders once and mends.

## 5. Gaps and limits

- About 60 Bootcamp lessons are video-only with no transcript. That covers all of Filmmaking, Clone Yourself, Live Calls, most Social niches and the Nike/car/GTA/BMW/static-ad lessons. Their rows describe the page only. AVS has 12 videos and NE has 7 lesson videos not watched (Music Video, Motion Control, One Room, GHOST HAND, the viral cases and others), but their written prompts were read.
- I characterised the 173-page short-film PDF fully: character passports, location sheets, about 72 shots, and a 9-part prompt (stock and look, scene context, refs, strict exclusions, camera, timed action, how the motion is proved, SFX, strict negatives). I did not read every shot word for word.
- Course model rankings, credit and pricing claims, "up to 50 references" and similar claims are attributed, dated statements, not verified facts.
- CE source code was checked only by grep (loudnorm/silence trim, and skill files). Brick status is taken from COURSES-PLAN and the bootcamp audit.

## 6. Rights and red flags

- All rows are `rights=course`. The prompt banks name real fashion brands and photographers, and the examples imitate Nike, BMW, GTA, Warcraft and film franchises. Reuse the structure, never the brand or IP.
- **Instructions aimed at an AI:** every NE skill, both standalone prompters, the Bootcamp master prompts ("Meta Ad Builder" role prompts) and Prompt Director contain them. I inventoried them and did not follow them. The NE Seedance 2.5 skill's description refers to another creator's "Night Shift" routing selectors. The NE Wide Face skill is written in Italian and requires a canonical reference PNG.
- **Ethically problematic tactics, not to adopt:**
  - hiding "this is AI" comments with keyword filters while they still count as engagement, comment bait and engagement pods (SKV-222-223, 225-226)
  - pitch-shifting audio to dodge originality detection (CapCut transcript)
  - re-posting downloaded TikToks through motion control
  - watermark-removal links
  - skipping the platform "AI content" label (SKV-088)
  - merging 3 real people's Pinterest photos into an "influencer" (SKV-258, 262)
  - expert/therapist authority and anxiety-relief claims in the podcast and 2D examples
  - violent "employee slaps boss" sketch (SKV-269)
- **Personal and third-party data:** the Cooperation Agreement DOCX contains a real Croatian agency's registration details, so treat it as reference only. No secrets were found.
