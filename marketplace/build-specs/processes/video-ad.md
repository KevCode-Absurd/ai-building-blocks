# Video ad, from idea to signed-off final cut

A finished, on-brand video ad in 9:16 and 4:5, made from a script you approved, with real product shots, captions and an end card, ready for the launch team.

**Starts from:** A growth plan task, a creative refresh brief from the results review, or you asking for a new video ad.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Gather what we know | Tendai (tendai-ad-creative) | intake.md, channels.json | intake-complete | no | read |
| 2 | Angle and script | Devon (devon-video-ugc) | script.md, cost-estimate.json | script-review, copy-lint | yes | draft |
| 3 | Shot list and storyboard prompts | Devon (devon-video-ugc) | shots.md, storyboard-prompts.json | storyboard-review | no | draft |
| 4 | Rough storyboard frames | Devon (devon-video-ugc) | storyboard/contact-sheet.png, storyboard/frames.md, spend.json | storyboard-visual, spend-within-budget | yes | draft |
| 5 | Character and product reference sheets | Aurelio (aurelio-product-photos) | characters/sheet.md, characters/sheet.png, product/reference.png, spend.json | consistency-review, spend-within-budget | yes | draft |
| 6 | Final storyboard | Devon (devon-video-ugc) | storyboard/final-contact-sheet.png | consistency-review | no | draft |
| 7 | Scenes, prompts and model choice | Devon (devon-video-ugc) | scenes.json, cost-estimate.json | scene-plan-review | yes | draft |
| 8 | Generate the scenes | Devon (devon-video-ugc) | clips/clips.md, spend.json | clip-review, spend-within-budget | no | draft |
| 9 | Edit and merge | Cody (cody-video-editor) | cuts/rough-cut.mp4, cuts/edit-notes.md | cut-review | no | draft |
| 10 | Captions, graphics and end card | Cody (cody-video-editor) | final/final-9x16.mp4, final/final-4x5.mp4, final/end-card.png, final/captions.srt | graphics-review, logo-contrast | no | draft |
| 11 | Final review and sign-off | Kemal (kemal-creative-director) | final/*, tags.json, channels.json | creative-review, compliance-review | yes | draft |

## Stage by stage

### 1. Gather what we know

Collects every fact the video needs before anyone writes a word: who it is for, what problem it solves for them, the product facts and claims we can prove, the offer, what past videos taught us, and which connectors and files we can reach. Anything missing is listed as a question for you. It also writes channels.json: the launch processes this creative will go to (for example ["meta-launch", "tiktok-ads-launch"]), from the placements in the task or the growth plan.

- **Needs:** context/org-context/ (customers, voice, design, claims, do's and don'ts); context/goals.json; context/learnings.md; warehouse view creative_performance (last 90 days); the task that started this job
- **Makes:** intake.md, channels.json
- **Checks:** intake-complete (every heading in intake.md is filled from a named source, and missing facts are listed as answered questions, not guesses)
- **Stops and asks when:** the brief has no product, no offer or no main number to judge the ad by (missing input); the brief is not a video ad (for example an email, a listing or a price change), so it goes to the right process (misrouted)
- **Done when:** intake.md names the buyer, the gap we are solving, the one message, the proof we hold, the offer, the placement, and the open questions you answered.

### 2. Angle and script

Writes three hook options and one full script: beats with timings, voice-over, on-screen text, the product moment, proof, and the call to action. It follows direct-response rules: the first two seconds earn the next five, one idea per ad, and every claim traces to the proof in intake.md.

- **Needs:** intake.md; context/learnings.md
- **Makes:** script.md, cost-estimate.json
- **Checks:** script-review (the hook earns attention in two seconds, there is one idea, the voice matches the Org context, and every claim maps to proof); copy-lint (the copy checker exits 0 (no banned words, no made-up stats, reading level in range))
- **Costs money:** Sets the pre-production budget: storyboard frames and reference sheets, usually a few dollars of images.
- **Done when:** script.md has three hooks, timed beats that add up to the planned length, and every claim marked with its proof.
- **You sign off:** You read the three hooks, the script and the small pre-production budget. Reply yes with the code to lock them. To change anything, say what; the code stops working as soon as a file changes.

### 3. Shot list and storyboard prompts

Turns the locked script into a shot list: one row per shot with duration, framing, camera move, action, on-screen text and sound. Then writes one image prompt per shot for quick storyboard frames.

- **Needs:** script.md (signed off); context/org-context/ design rules
- **Makes:** shots.md, storyboard-prompts.json
- **Checks:** storyboard-review (every beat has a shot, timings add up, and each prompt describes the frame without inventing product details)
- **Done when:** Every script beat maps to at least one shot, durations add up to the script length, and each shot has a prompt.

### 4. Rough storyboard frames

Makes a quick still frame for each shot and lays them out on one contact sheet, so you can see the flow of the ad before any video money is spent.

- **Needs:** shots.md; storyboard-prompts.json
- **Makes:** storyboard/contact-sheet.png, storyboard/frames.md, spend.json
- **Checks:** storyboard-visual (the frames read in order as a story with the product moment clear, and nothing contradicts the design rules); spend-within-budget (money spent on generation (spend.json) is at or under the approved estimate (cost-estimate.json))
- **Costs money:** only inside the budget you approved at script; it stops before going over.
- **Done when:** There is one frame per shot on the contact sheet, in script order, each labelled with its shot number.
- **You sign off:** You look at the contact sheet. Reply yes with the code if the flow works, or say which shots to change.

### 5. Character and product reference sheets

Fixes how every person in the ad looks (face, age, clothes, setting) on a character sheet, and builds a product reference sheet from your real product photos, so every scene shows the same people and the true product, label and colours.

- **Needs:** storyboard/ (signed off); your real product photos; context/org-context/ (customer description and design)
- **Makes:** characters/sheet.md, characters/sheet.png, product/reference.png, spend.json
- **Checks:** consistency-review (people look the same in every frame and the product matches the real photos, label text included); spend-within-budget (money spent on generation (spend.json) is at or under the approved estimate (cost-estimate.json))
- **Costs money:** only inside the budget you approved at script; it stops before going over.
- **Done when:** Each person has front and side views and a written description, and the product sheet uses your real photos, not a redrawn product.
- **You sign off:** You check the people match your buyers and the product looks exactly like yours. Reply yes with the code.

### 6. Final storyboard

Redraws the storyboard frames using the character and product sheets, so each frame now shows the right people and the real product. These frames become the first frame or reference image for each video scene.

- **Needs:** storyboard/ (signed off); characters/; product/reference.png
- **Makes:** storyboard/final-contact-sheet.png
- **Checks:** consistency-review (people look the same in every frame and the product matches the real photos, label text included)
- **Done when:** Every frame matches its character and product sheet, and the shot order is unchanged from the signed-off rough storyboard.

### 7. Scenes, prompts and model choice

Splits the ad into scenes. For each scene it writes the video prompt, the reference frame, the length, the camera move and the sound, and picks the video model that suits it (for example one model for people talking, another for product close-ups). It estimates the cost, with at most two retries per scene, and lists it for you.

- **Needs:** storyboard/final-contact-sheet.png; shots.md
- **Makes:** scenes.json, cost-estimate.json
- **Checks:** scene-plan-review (every scene can be cut together at the planned lengths, and each model choice has a reason)
- **Costs money:** Raises the budget to cover video generation. cost-estimate.json is updated to the new total, and nothing is generated until you approve it.
- **Done when:** scenes.json covers every shot, and cost-estimate.json gives a total with the price source and date for each model.
- **You sign off:** You see each scene, the model chosen and the total cost. Reply yes with the code to approve that budget. Generation stops if it would go over.

### 8. Generate the scenes

Generates each scene with its chosen model and reference frame. Each clip is checked against its scene: right people, real product, readable label, no warped hands or text. A clip that fails gets at most two retries, inside the approved budget, then the scene goes back to you.

- **Needs:** scenes.json (approved); storyboard/; characters/; product/
- **Makes:** clips/clips.md, spend.json
- **Checks:** clip-review (each clip matches its scene, the product and label are true, and there are no warped hands, faces or text); spend-within-budget (money spent on generation (spend.json) is at or under the approved estimate (cost-estimate.json))
- **Costs money:** only inside the budget you approved at scene-plan; it stops before going over.
- **Done when:** Every scene has one approved clip listed in clips/clips.md with its model and retries, and spend.json records what each generation cost.

### 9. Edit and merge

Puts the clips in order, trims to the script timings, adds the voice-over and licensed music, and makes the cut feel fast in the first three seconds. Exports a rough cut for checking.

- **Needs:** clips/; script.md
- **Makes:** cuts/rough-cut.mp4, cuts/edit-notes.md
- **Checks:** cut-review (the cut follows the script beats, the first three seconds move fast, and the sound is clean)
- **Done when:** The rough cut matches the script beats within half a second each, and the music licence is written in edit-notes.md.

### 10. Captions, graphics and end card

Adds captions word for word from the script, on-screen text, the real logo laid on by the editing tool (never redrawn by a model), the offer and the end card. Makes a 9:16 version for Reels and Stories and a 4:5 version for feeds, with text inside the safe zones.

- **Needs:** cuts/rough-cut.mp4; context/org-context/ design rules; your logo file
- **Makes:** final/final-9x16.mp4, final/final-4x5.mp4, final/end-card.png, final/captions.srt
- **Checks:** graphics-review (captions match the script word for word, fonts and colours follow the design rules, and text stays in the safe zones); logo-contrast (the logo contrast ratio is at least 3 to 1)
- **Done when:** Both versions exist, captions match the script, the logo passes the contrast check, and no text sits in the top or bottom safe zones.

### 11. Final review and sign-off

A fresh reviewer who did not make the ad watches it against the intake and script: on brand, the hook lands in the first two seconds, claims are proven, the product is true to life. The compliance reviewer checks ad policy, music rights and whether the ad must be marked as made with AI. It also writes tags.json (concept, angle, hook type, format, length in seconds, persona, model used) so results can be compared by what was made. Before your sign-off it confirms channels.json, so your yes covers where the creative will run. Each channel gets its own launch job in the same folder.

- **Needs:** final/; intake.md; script.md
- **Makes:** final/*, tags.json, channels.json
- **Checks:** creative-review (a reviewer who did not make the ad finds it on brand, on message and true to the product); compliance-review (no policy problems, music is licensed, claims are proven, and the AI disclosure answer is recorded)
- **Done when:** review.md records PASS from both reviewers, the AI disclosure answer, and the licence notes, and your sign-off covers every file in final/ byte for byte.
- **You sign off:** You watch both versions. Reply yes with the code to sign off. The video then goes to the launch team with its script and review.

## Where you step in

- **Angle and script:** You read the three hooks, the script and the small pre-production budget. Reply yes with the code to lock them. To change anything, say what; the code stops working as soon as a file changes.
- **Rough storyboard frames:** You look at the contact sheet. Reply yes with the code if the flow works, or say which shots to change.
- **Character and product reference sheets:** You check the people match your buyers and the product looks exactly like yours. Reply yes with the code.
- **Scenes, prompts and model choice:** You see each scene, the model chosen and the total cost. Reply yes with the code to approve that budget. Generation stops if it would go over.
- **Final review and sign-off:** You watch both versions. Reply yes with the code to sign off. The video then goes to the launch team with its script and review.

## Then

When the last stage is done, the work moves, with the same folder, to each process named in channels.json: **meta-launch**, **tiktok-ads-launch**, **snapchat-launch**, **pinterest-launch**, **google-ads**. One launch job per channel.

## How we judge it

- Main number: the one you set in context/goals.json (for most stores, return on ad spend over 7 days).
- Video numbers: hook rate (3-second views divided by impressions), hold rate (ThruPlays divided by 3-second views), and click-through rate.
- Cost: money spent on generation for this video, against the estimate you approved.
