# Image ad set, from brief to signed-off files

A set of on-brand image ads (usually 3 to 5 different concepts, each in 4:5 and 9:16) with the real product and logo, checked for design and claims, ready for the launch team.

**Starts from:** A growth plan task, a creative refresh brief from the results review, a new product or offer, or you asking for new image ads.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Gather what we know | Tendai (tendai-ad-creative) | intake.md, channels.json | intake-complete | no | read |
| 2 | Concepts | Kemal (kemal-creative-director) | concepts.md, cost-estimate.json | concept-review | yes | draft |
| 3 | Words on the image | Kofi (kofi-ad-copy) | image-copy.md | copy-lint, copy-review | no | draft |
| 4 | Design the images | Ayaka (ayaka-ad-design) | final/images.md, spend.json | logo-contrast, design-review, spend-within-budget | no | draft |
| 5 | Final review and sign-off | Kemal (kemal-creative-director) | final/*, tags.json, channels.json | creative-review, compliance-review | yes | draft |

## Stage by stage

### 1. Gather what we know

Collects where the data comes from and what is true before any design starts: who the buyer is, the gap or problem we are solving for them, the proof and claims we hold, the offer, where the ads will run, what past ads taught us, and which files and connectors we can reach. Gaps become questions for you. It also writes channels.json: the launch processes this creative will go to (for example ["meta-launch", "tiktok-ads-launch"]), from the placements in the task or the growth plan.

- **Needs:** context/org-context/ (customers, voice, design, claims, do's and don'ts); context/goals.json; context/learnings.md; warehouse view creative_performance (last 90 days); the task that started this job
- **Makes:** intake.md, channels.json
- **Checks:** intake-complete (every heading in intake.md is filled from a named source, and missing facts are listed as answered questions, not guesses)
- **Done when:** intake.md names the buyer, the gap, the proof, the offer, the placements, the winning and losing patterns from past ads, and the answered questions.

### 2. Concepts

Proposes 3 to 5 truly different concepts, not colour swaps: each one has an angle, the buyer moment it speaks to, the one message, the visual idea, and the reason past results suggest it can win. Each concept names what it tests, so the results teach us something.

- **Needs:** intake.md; context/learnings.md
- **Makes:** concepts.md, cost-estimate.json
- **Checks:** concept-review (the concepts differ in angle or buyer moment, each names its test, and none repeats a pattern that lost before without a reason)
- **Costs money:** Sets the image generation budget for the set. Nothing is generated until you approve it.
- **Done when:** Each concept has an angle, a message, a visual idea, the test it runs, and a link to the learning or gap behind it.
- **You sign off:** You pick the concepts to make and see the generation cost estimate. Reply yes with the code to approve the list and the budget as written, or say which to drop or change.

### 3. Words on the image

Writes the headline and any short text that sits on each image, within the character limits for each placement, in the brand voice, with every claim tied to proof.

- **Needs:** concepts.md (signed off); context/org-context/ voice and claims
- **Makes:** image-copy.md
- **Checks:** copy-lint (the copy checker exits 0); copy-review (each line is clear in one second, in the brand voice, and every claim is proven)
- **Done when:** Each concept has its on-image words, under the limits, with claims marked with their proof.

### 4. Design the images

Generates the scene or background, then lays your real product cutout and your real logo on top with an editing tool at fixed positions, so the product and logo are never redrawn by a model. Adds the words exactly as written. Exports 4:5 and 9:16 for each concept.

- **Needs:** concepts.md; image-copy.md; your real product photos and logo; context/org-context/ design rules
- **Makes:** final/images.md, spend.json
- **Checks:** logo-contrast (every image's logo contrast ratio is at least 3 to 1); design-review (the product is the real one, the text is exact and readable at phone size, and the design follows the Org context design rules); spend-within-budget (money spent on generation is at or under the approved estimate)
- **Costs money:** only inside the budget you approved at concepts; it stops before going over.
- **Done when:** Every approved concept has both sizes listed in final/images.md, the logo passes the contrast check, and the text matches image-copy.md exactly.

### 5. Final review and sign-off

A reviewer who did not design the set checks each image against the intake and the design rules: does it stop the scroll, is the product true to life, is the message clear in one second, is it on brand. The compliance reviewer checks ad policy, claims and whether the image must be marked as made with AI. It also writes tags.json (concept, angle, hook type, format, length in seconds, persona, model used) so results can be compared by what was made. Before your sign-off it confirms channels.json, so your yes covers where the creative will run. Each channel gets its own launch job in the same folder.

- **Needs:** final/; intake.md; concepts.md
- **Makes:** final/*, tags.json, channels.json
- **Checks:** creative-review (a reviewer who did not make the images finds them on brand, clear and true to the product); compliance-review (no policy problems, claims are proven, and the AI disclosure answer is recorded)
- **Done when:** review.md records PASS from both reviewers for each image and the AI disclosure answer, and your sign-off covers every file in final/ byte for byte.
- **You sign off:** You look at every image. Reply yes with the code to sign off the set. It then goes to the launch team.

## Where you step in

- **Concepts:** You pick the concepts to make and see the generation cost estimate. Reply yes with the code to approve the list and the budget as written, or say which to drop or change.
- **Final review and sign-off:** You look at every image. Reply yes with the code to sign off the set. It then goes to the launch team.

## Then

When the last stage is done, the work moves, with the same folder, to each process named in channels.json: **meta-launch**, **pinterest-launch**, **snapchat-launch**, **google-ads**. One launch job per channel.

## How we judge it

- Main number: the one you set in context/goals.json (for most stores, return on ad spend over 7 days).
- Image numbers: click-through rate, cost per click and cost per purchase for each concept.
- Cost: money spent on image generation for this set, against the estimate you approved.
