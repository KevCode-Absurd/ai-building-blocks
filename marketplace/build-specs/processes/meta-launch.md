# Launch signed-off creative on Meta

Signed-off videos or images become live Facebook and Instagram ads with matching copy, tracked links and a spend cap you approved, then get checked after launch and handed to the results loop.

**Starts from:** A signed-off job from the video ad or image ad process. It keeps the same folder, so the script, files and reviews travel with it.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Ad copy for each creative | Kofi (kofi-ad-copy) | ad-copy.md, utm.md | copy-lint, copy-review, compliance-review | no | draft |
| 2 | Campaign structure and budget | Lindsey (lindsey-meta-media-buyer) | structure.md | structure-review | no | read |
| 3 | Ad pack for approval | Lerato (lerato-creative-producer) | ad-pack.md | pack-complete | yes | draft |
| 4 | Build the ads as drafts | Dustin (dustin-ad-deployment) | previews.md | none | yes, the plan | publish |
| 5 | Go live | Dustin (dustin-ad-deployment) | launch-record.md | none | yes, the plan | publish |
| 6 | Check after launch | Lindsey (lindsey-meta-media-buyer) | verify.md, register.json | launch-verify | no | read |

## Stage by stage

### 1. Ad copy for each creative

Writes the primary text, headline and description for each signed-off creative, built from its script, its visuals and what past copy taught us. Gives two or three versions per creative, each inside Meta's length limits, plus the tracked link (UTMs) for each ad.

- **Needs:** final/ and review.md from the creative job; script.md or image-copy.md; context/org-context/ voice and claims; context/learnings.md
- **Makes:** ad-copy.md, utm.md
- **Checks:** copy-lint (the copy checker exits 0); copy-review (the copy carries the creative's message, opens with the buyer's problem or desire, and stays in the brand voice); compliance-review (no policy problems, no unproven claims, and no restricted wording for the product category)
- **Done when:** Each creative has its copy versions and one tracked link, and every claim is proven.

### 2. Campaign structure and budget

Decides where the new ads go: a new campaign or a test inside an existing one, the ad set setup, the daily budget, the end date and the spend cap, using the account's own history and the money limits you set. Checks tracking health first; if tracking is broken it stops and says so.

- **Needs:** ad-copy.md; context/limits.json; warehouse view ads_daily and context/tracking.md (the tracking audit from store setup); context/experiments.md
- **Makes:** structure.md
- **Checks:** structure-review (budgets are inside limits, each ad set can plausibly reach about 50 results a week or the reason is stated, and tracking was checked first)
- **Done when:** structure.md gives the campaign and ad set choice, the daily budget in whole units, the end date, the spend cap, and the reason for each, inside your limits.

### 3. Ad pack for approval

Puts the final files, the copy, the links and the structure into one ad pack: a page in the job folder, copied to your shared Drive folder if you connected one, with a short note in your Slack channel if you set one up. If you work with a client, this is the pack they approve.

- **Needs:** final/; ad-copy.md; utm.md; structure.md
- **Makes:** ad-pack.md
- **Checks:** pack-complete (every ad in the pack has a file, copy, link, budget and dates, and nothing is missing from the signed-off creative job)
- **Done when:** ad-pack.md shows each ad with its file, copy, link, budget and dates on one page.
- **You sign off:** You (or your client, through you) check the pack. Reply yes with the code to send it to the build step. Your Slack thumbs-up alone does not count; the yes must come from you in Claude, or on the approval page when hosted.

### 4. Build the ads as drafts

Shows you a build plan, then on your yes uploads the files and creates the creative, campaign, ad set and ads in your ad account as drafts or paused, so nothing spends yet. Every campaign, ad set and ad name ends with the creative's job tag (its folder name, for example [job-0007]), so the data pipeline joins results to the creative and a retry can search for the tag first instead of making a copy. Then pulls a preview link for each ad.

- **Needs:** ad-pack.md (signed off); Meta ads connector at level 2 or 3
- **Makes:** previews.md
- **Goes live:** Through the Meta ads connector: media uploads, plus a creative, campaign, ad set and ads created as drafts or paused. No money is spent at this stage.
- **Done when:** Every step of the build plan ran once and was read back, and previews.md lists a preview link for each ad.

### 5. Go live

Shows you the go-live plan: the exact objects to switch on, the total new daily spend, the end date and the cap, with the preview links. On your yes it switches them on, and only those.

- **Needs:** previews.md; Meta ads connector at level 3
- **Makes:** launch-record.md
- **Goes live:** Through the Meta ads connector: one activate step with the exact object ids. Money starts to be spent from this step.
- **Done when:** The activate step ran once, the objects read back as active or in review, and launch-record.md lists their ids, budgets and dates.

### 6. Check after launch

Within a day of launch, reads every ad back: Meta's review result, delivery, spend against the cap, and any errors. Records the link between each ad id and its creative in the creative register, so results flow back to the right script and design. It adds its ads to register.json and never replaces lines another channel wrote.

- **Needs:** launch-record.md; Meta ads connector (read)
- **Makes:** verify.md, register.json
- **Checks:** launch-verify (what is live matches the approved plans exactly, and every rejection has a cause and a fix)
- **Done when:** Every ad is active or its rejection is explained with a fix, and register.json maps each ad id to its creative and job.

## Where you step in

- **Ad pack for approval:** You (or your client, through you) check the pack. Reply yes with the code to send it to the build step. Your Slack thumbs-up alone does not count; the yes must come from you in Claude, or on the approval page when hosted.
- **Build the ads as drafts:** approve the exact plan of live changes
- **Go live:** approve the exact plan of live changes

## Then

When the last stage is done, the work moves to **results-loop** with the same folder.

## How we judge it

- The launch matches the approved plan exactly: names, budgets, end date, links and status.
- Every ad passed Meta's review, or a rejection was handled within a day.
