# Landing page, from brief to live and checked

A new Shopify landing page for one offer and one traffic source, written from real customer words, laid out for phones first, built on an unpublished theme copy, checked for speed, signed off by you in preview, then made live and checked at its public address.

**Starts from:** A growth plan task, an ad or email that needs a page that matches its promise, a page that gets traffic but too few sales, or you asking for a new landing page.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Gather what we know | Annabel (annabel-landing-pages) | intake.md | intake-complete | no | read |
| 2 | Customer words and message brief | Annabel (annabel-landing-pages) | research/voc-bank.md, message-brief.md | brief-review | yes | draft |
| 3 | Page copy | Annabel (annabel-landing-pages) | page-copy.md, claims-log.md | copy-lint, readability, copy-review, claims-review | no | draft |
| 4 | Product page copy, where needed | Georgia (georgia-product-copy) | product-copy.md | product-copy-lint, product-match-review, claims-review | no | draft |
| 5 | Layout and phone first screen | Larissa (larissa-store-ux) | wireframe.md | layout-review | no | draft |
| 6 | Build on an unpublished theme copy | Yaroslav (yaroslav-shopify-dev) | build-record.md | theme-check, code-review | yes, the plan | publish |
| 7 | Render check at phone and desktop sizes | Yaroslav (yaroslav-shopify-dev) | preview/page.html, preview/shots-phone.png, preview/shots-desktop.png, preview-check.md | render, visual-review, copy-match | no | read |
| 8 | Speed check before launch | Arjun (arjun-page-speed) | speed.md, numbers.json | numbers-check, speed-review | no | read |
| 9 | Preview pack for your sign-off | Annabel (annabel-landing-pages) | page-pack.md | pack-complete | yes | draft |
| 10 | Make the page live | Yaroslav (yaroslav-shopify-dev) | go-live-record.md | none | yes, the plan | publish |
| 11 | Check the live page | Yaroslav (yaroslav-shopify-dev) | verify.md | live-verify, seo-basics, tracking-check | no | read |

## Stage by stage

### 1. Gather what we know

Collects every fact the page needs before anyone writes: the one action the page asks for, who lands on it and from which ad, email or search, what that source promised them, the offer and its end date, the proof and claims we hold, what past pages taught us, and the numbers for the page this traffic lands on today. It also writes down which tools we can reach and at what level (Shopify connector or CLI, Google Analytics, Search Console). Anything missing becomes a question for you.

- **Needs:** context/org-context/ (customers, voice, design, claims, do's and don'ts); context/goals.json; context/learnings.md; the ad, email or search terms that will send traffic, from the creatives folder if there is one; GA4 through the Analytics MCP (read): landing page sessions, bounce rate, add-to-cart and purchase events for the last 8 whole weeks; Shopify connector or CLI (read): the current page, the products on offer, recent sales for them; the task that started this job
- **Makes:** intake.md
- **Checks:** intake-complete (every heading in intake.md is filled from a named source with its date, the access table is filled, and missing facts are listed as answered questions, not guesses)
- **Done when:** intake.md names the one action, the buyer, the traffic source and its promise, the gap the page solves, the offer, the proof we hold, the current numbers with dates, the access we have, and the questions you answered.

### 2. Customer words and message brief

Turns reviews, support questions, survey answers and sales notes into a bank of the customers' own words: what pushed them to buy, what they want, what worries them, what they used before. From that it writes a short message brief: the core promise, the reasons to believe, the top objections and the proof needed for each, and where the page should open for a reader at this stage of awareness. The page is not written until you agree the message, because changing the message after drafting wastes the most time.

- **Needs:** intake.md; review app export, help desk export and any survey answers you shared; context/learnings.md
- **Makes:** research/voc-bank.md, message-brief.md
- **Checks:** brief-review (the promise is one idea a buyer at this awareness stage will care about, each objection has proof we hold, and every quote traces to voc-bank.md)
- **Done when:** message-brief.md has one core promise, three to five reasons, the top objections each paired with proof we hold, and every customer quote traced to its source in voc-bank.md.
- **You sign off:** You read the message brief: the promise, the reasons, the objections and the proof each one needs. Reply yes with the code to lock it, or say what to change. Any guarantee, trial or deadline in it must be one you will honour.

### 3. Page copy

Writes the full page for one action: three headline options with the reason each fits, the lead, the offer and risk reversal, objection answers with proof beside each claim, the calls to action, the SEO title and meta description, and notes for the first phone screen. Every section says its job and every claim carries its evidence id. It then runs an honesty check on claims, reviews and urgency before anyone else sees it.

- **Needs:** message-brief.md (signed off); research/voc-bank.md; context/org-context/ voice and claims
- **Makes:** page-copy.md, claims-log.md
- **Checks:** copy-lint (the copy checker exits 0 (counts are right, no placeholders, no internal words in customer copy)); readability (the readability check exits 0 for a consumer audience); copy-review (in a separate pass from the writer, the page scores 2 or more on each of the 12 conversion checks, matches the traffic source's promise, and does at least as well as the live page on every point); claims-review (every claim, review, price, reduction, guarantee and deadline is proven or cut, customer names and quotes have permission, and the claims log matches the copy)
- **Done when:** page-copy.md has three headlines, every section with its job, every claim marked with its evidence id, and claims-log.md gives each claim a status of keep, narrow or cut.

### 4. Product page copy, where needed

If the page sends people to product pages whose copy does not match the new promise, rewrites only what is needed on those products: title, bullets, description, FAQ and alt text, from a checked fact sheet, with every unconfirmed fact marked for you to confirm. If no product copy needs to change, it says so in one line with the reason, and the job moves on.

- **Needs:** page-copy.md; message-brief.md; Shopify connector (read): the linked products and their current copy; product labels and spec sheets
- **Makes:** product-copy.md
- **Checks:** product-copy-lint (the copy checker exits 0, or product-copy.md says no product copy needs to change); product-match-review (the product copy carries the same promise as the landing page, changes only what the reason requires, and marks every unconfirmed fact); claims-review (every claim, review, price, reduction, guarantee and deadline is proven or cut, customer names and quotes have permission, and the claims log matches the copy)
- **Done when:** product-copy.md lists each product with its old and new text and the reason, or states that no product copy needs to change and why.

### 5. Layout and phone first screen

Writes the page as a wireframe in words: the order of sections, what sits on the first phone screen, the one main button and where it repeats, each component with its exact words, and every state a shopper can hit (sold-out size, add-to-cart error, slow image, long product name). It then walks the page as the buyer named in the intake and fixes the problems it finds, and checks tap target size, contrast and reading order.

- **Needs:** page-copy.md; product-copy.md; context/org-context/ design rules; the live theme's existing sections, from the Shopify connector or CLI (read)
- **Makes:** wireframe.md
- **Checks:** layout-review (the first phone screen shows the promise and the main button, there is one main action, every state has words, and nothing adds a step between the page and the cart)
- **Done when:** wireframe.md covers every section in order with its words and states, names the theme section or new section each one uses, and lists the usability problems found and fixed.

### 6. Build on an unpublished theme copy

Checks the page address (handle) is free, then shows you a build plan. On your yes it writes the new page template, and any new section, to an unpublished copy of your theme, and creates the page as hidden, set to use that template. Shoppers see nothing yet. It reuses the theme's own sections where it can, keeps the likely largest image loading first, gives every image its size, and adds no new scripts. It keeps a copy of every file it touches.

- **Needs:** wireframe.md; page-copy.md; product-copy.md; an unpublished copy of your live theme (you duplicate it in the admin, or the CLI pushes one with shopify theme push --unpublished); Shopify connector at level 2, or the Shopify CLI in Claude Code
- **Makes:** build-record.md
- **Checks:** theme-check (Theme Check reports no errors on the files written, and any warning is explained in build-record.md); code-review (only new files were written, the code reuses theme sections where possible, has editor settings for text the owner will change, adds no script, and the page was created hidden)
- **Goes live:** Nothing goes live at this stage. Through the Shopify connector or the Shopify CLI: the new template and any new section files are written to the unpublished theme copy, and the page is created with isPublished false and its templateSuffix set. Product copy changes, if any, wait for the go-live plan.
- **Done when:** Every step of the build plan ran once and was read back, the hidden page exists with the right template, and build-record.md lists the theme copy id, the page id, the handle and every file written.

### 7. Render check at phone and desktop sizes

Opens the page on the theme copy's preview, saves it as a local file with its styles and images, and renders it at phone (390 pixels wide) and desktop (1280 pixels wide) sizes with the render tool. The pictures are checked against the wireframe and the approved copy: the first phone screen, nothing cut off, no sideways scrolling, the words exactly as approved.

- **Needs:** build-record.md; wireframe.md; page-copy.md
- **Makes:** preview/page.html, preview/shots-phone.png, preview/shots-desktop.png, preview-check.md
- **Checks:** render (both phone and desktop renders are written and neither reports HORIZONTAL OVERFLOW); visual-review (the renders match the wireframe section by section, the first phone screen shows the promise and the main button, and text is readable at phone size); copy-match (every word on the rendered page matches the approved page-copy.md exactly, headline included)
- **Done when:** Both renders exist, there is no horizontal overflow, the first phone screen matches the wireframe, and preview-check.md lists any difference found and how it was fixed.

### 8. Speed check before launch

Runs Lighthouse on the preview page for phones 3 to 5 times and takes the middle result, and does the same for the live page the traffic uses today, so the two compare like with like. Checks the largest image is not lazy-loaded, images have sizes, fonts do not block the first screen, and no app script was added. Lab numbers are a guide; real-visitor numbers come at day 28.

- **Needs:** build-record.md; preview link of the theme copy; intake.md (the current landing page)
- **Makes:** speed.md, numbers.json
- **Checks:** numbers-check (every median and difference in speed.md recomputes from the runs in numbers.json); speed-review (the new page is no slower than the current page on median LCP and CLS for phones, or the reason is stated and accepted, and lab results are not presented as field data)
- **Done when:** speed.md gives the median LCP, CLS and total blocking time for the new and current page with run counts and the date, and any fix found was made on the theme copy and re-run.

### 9. Preview pack for your sign-off

Puts everything you need to decide on one page: the preview link, the phone and desktop pictures, the chosen headline, the claims log, any product copy changes, the speed result, and the exact go-live plan that will follow. You test the preview on your own phone.

- **Needs:** preview-check.md; speed.md; claims-log.md; product-copy.md
- **Makes:** page-pack.md
- **Checks:** pack-complete (the pack has the preview link, both renders, the headline, the claims log, any product changes, the speed numbers and the exact go-live steps, and nothing signed off earlier is missing)
- **Done when:** page-pack.md shows the preview link, both renders, the headline, the claims, the product changes, the speed numbers and the go-live steps on one page.
- **You sign off:** You open the preview on your phone and read the pack. Reply yes with the code to send it to go-live, or say what to change. Changing any file makes the code stop working.

### 10. Make the page live

Shows you the go-live plan: push only the new template and new section files to the live theme, then make the page visible, then any product copy changes, one step at a time. Nothing else on the live theme is touched. On your yes it runs those steps and only those. If you use only the Shopify connector, it cannot write to your live theme, so the plan gives you the exact steps to add the template in your admin, and the agent makes the page visible after you say it is done. Undo: hide the page again; the template file alone changes nothing for shoppers.

- **Needs:** page-pack.md (signed off); build-record.md; Shopify CLI in Claude Code (theme push with --only, --nodelete and --allow-live) or you, for the template step; Shopify connector at level 3 for the page and product updates
- **Makes:** go-live-record.md
- **Goes live:** Through the Shopify CLI: shopify theme push to the live theme id with --only for each new file and --nodelete, which needs --allow-live. Through the Shopify connector or CLI: pageUpdate with isPublished true for this page id, then productUpdate for each approved product copy change, with old values saved first. Shoppers can see the page from this step.
- **Done when:** Every step of the go-live plan ran once and was read back, and go-live-record.md lists the live theme id, the files pushed, the page id and address, and each product change with its old value.

### 11. Check the live page

Within an hour of going live, opens the public address and checks it returns 200, uses the new template, matches the signed-off preview at phone and desktop sizes, and has the right title, meta description and canonical tag. It adds a product to the cart, checks the cart opens, and checks in GA4 realtime that the page view and add-to-cart events arrive once each. It then runs the speed test on the live address. If anything is wrong, it stops and shows you an undo plan.

- **Needs:** go-live-record.md; page-pack.md; GA4 through the Analytics MCP (realtime report)
- **Makes:** verify.md
- **Checks:** live-verify (the live page returns 200 with the new template, matches the signed-off preview, only the planned files and records changed, and live lab speed is within normal run-to-run noise of the preview); seo-basics (the title, meta description and canonical are the approved ones, the page is indexable unless you chose otherwise, and it does not compete with an existing page for the same searches); tracking-check (the page view, add-to-cart and purchase events fire once each on the new template, and consent settings behave the same as on other pages)
- **Done when:** verify.md records the status code, the template, the render match, the tags, the cart test, the events seen and the live lab speed, or an undo plan for anything that failed.

## Where you step in

- **Customer words and message brief:** You read the message brief: the promise, the reasons, the objections and the proof each one needs. Reply yes with the code to lock it, or say what to change. Any guarantee, trial or deadline in it must be one you will honour.
- **Build on an unpublished theme copy:** approve the exact plan of live changes
- **Preview pack for your sign-off:** You open the preview on your phone and read the pack. Reply yes with the code to send it to go-live, or say what to change. Changing any file makes the code stop working.
- **Make the page live:** approve the exact plan of live changes

## Then

When the last stage is done, the work moves to **site-results** with the same folder.

## How we judge it

- Main number: the one you set in context/goals.json. For most landing pages this is the conversion rate of sessions that land on the page, read from GA4 and checked against Shopify orders.
- Page numbers: add-to-cart rate, bounce rate and revenue per session for sessions that land on the page, against the page or pages the same traffic used before.
- Speed: p75 LCP, INP and CLS on phones, with lab results before launch and field data at day 28.
