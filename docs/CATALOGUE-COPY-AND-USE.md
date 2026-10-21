# Clear names and practical use of the library

Customer-facing copy lives in `catalogue-items/display-copy.yaml`. The build applies this editorial layer to the library, detail-page headlines and introductions, generated search pages, and the names used in workflow packs. Stable slugs, dependencies, source attribution and licensed instructions stay intact. Earlier display names remain searchable through the index's `aliases` field.

Use a familiar job name first. “Landing page audit” is clearer than a mechanical checker label. “Ad hook writer” is clearer than “Ad opening line batch writer”. A short description must name what the reader supplies and what useful result they receive. Do not imply that an instructional download runs on the website, a draft has been sent, or a result is proven.

Run `node tools/review-catalogue-copy.mjs` to screen every published entry, read and hash its source instructions, validate the editorial fields, and write `reports/catalogue-copy-review.json`. The report records retained copy as well as edits and lists duplicate names. Review duplicates before adding a rename so similar jobs remain distinguishable. This report checks copy and source structure; it does not replace model evaluations.

## Does a skill help?

A useful skill should ask for the facts it needs, follow a clear method, produce the promised deliverable and show what could not be checked. Try it on a small real task and compare the result with its checklist. Use more than one example before relying on it for recurring work. A specific name makes a job easier to find; it does not prove the method improves the result. Keep the existing rule that a Tested badge requires actual golden-set evidence.

## From a workflow to software

The downloadable workflow contains `HANDOFF.md`, `workflow.json` and its skill files. Give that folder and the app starter pack to a coding AI. Start with a form for the required inputs and a screen for saved results. Then add a server-side runner that follows the workflow, stores step results, stops for approvals and can retry a failed step on its own.

Uploaded files are enough for a first version. Add a supported API connection when the app needs fresh information, starting with the smallest read-only access. Store credentials on the server, tie each connection to the right workspace, and show when data was refreshed. The existing starter pack's stages 3 and 6 cover workflow execution and data connections.

Mercatura is the marketing example on `/apps`. Its Grüns study data is in the saved tour; customer research is labelled simulated. The tour does not make work, save changes or connect to visitors' accounts. The app starter pack and the separate Mercatura starter are the paths to building a running app with the user's own data.
