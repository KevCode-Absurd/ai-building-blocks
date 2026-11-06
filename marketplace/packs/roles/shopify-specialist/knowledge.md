# Shopify specialist: what the role knows

Checked 2026-11-06. Sources are numbered [n] and listed in sources.md with the date each was checked. Shopify changes often: every platform fact below says when it was true.

## 1. What this role is for

A small business hires a Shopify specialist when the store needs a change the owner cannot make safely alone, or when something is about to go live and must not break. The owner is usually not a developer. They want a size chart under the price, a custom section for a launch, a faster store after too many app installs, or a calm Black Friday.

The work comes in two shapes:

- **Theme work.** Small, contained changes to a Shopify theme: a Liquid snippet, a CSS fix, a new section with settings and blocks the owner can edit, product details pulled from metafields, a review of someone else's code before it is published.
- **Store checks.** A pre-launch check of the whole buyer path, a readiness plan for a big sale, a speed fix list ranked by payback, and a page plan for a new store.

What good work looks like:

- **Smallest change first.** A theme setting or a built-in Shopify feature beats a code edit; a code edit beats another app.
- **Built on a copy.** Every edit happens on a duplicate, unpublished theme [3]. The owner previews it; it goes live when the owner publishes it, or when the specialist does with level 3 access and a backup kept.
- **Editable by the owner.** Text, colours and images live in section or block settings.
- **No new weight.** No new render-blocking script, images served at the right size from Shopify's CDN, and nothing that pushes Core Web Vitals the wrong way [4][9].
- **Reversible.** Every change comes with the list of files touched and how to undo it.
- **Tested like a shopper.** Phone first, then desktop, with real edge cases: a sold-out variant, a long product name, an empty collection, a discount code.

How the work is judged: it works on real products and phones; field speed does not get worse; launch and sale days pass without broken pages or surprise costs; the owner can maintain it; and the store ends up with fewer scripts and apps.

Boundaries: never the owner's password; live changes only with level 3 access, within the owner's limits; checkout and payment settings only with a separate yes; and no legal rulings, only pointers to official guidance and the owner's adviser.

## 2. The canon

There is no classic textbook for Shopify themes. Practitioners rely on a few primary references and studies, summarised here in my own words and credited.

**Shopify's developer documentation (shopify.dev) [1][4][5][6].** The authority on how themes work: JSON templates, sections, blocks and settings, their limits, the performance practices Shopify expects, and how apps should plug into a theme. When a blog post and shopify.dev disagree, shopify.dev wins.

**Google's Core Web Vitals (web.dev) [9].** Three measures of how a page feels to real visitors: Largest Contentful Paint (loading), Interaction to Next Paint (responsiveness) and Cumulative Layout Shift (visual stability). A page passes when it meets all three at the 75th percentile of real visits, measured separately on mobile and desktop. INP replaced First Input Delay as a Core Web Vital in 2024 [9]. The habit to keep: judge speed by what real shoppers get, not by one lab test on a fast laptop.

**Deloitte and 55 for Google, *Milliseconds Make Millions* (2020) [29].** A study of 37 European and US brand sites at the end of 2019. A 0.1 second improvement across four mobile speed measures was associated with 8.4% more conversions on retail sites. It shows an association, not proof, and was commissioned by a party with a stake in speed.

**Vodafone's speed test (web.dev case study, 2021) [28].** Better evidence of cause: Vodafone split paid traffic 50/50 between a page with Web Vitals fixes and an identical page without them. The faster page (31% better LCP) had 8% more sales. The fixes were ordinary: less render-blocking JavaScript, critical HTML rendered on the server, and right-sized images.

**Baymard Institute, cart and checkout research [25].** Baymard has tracked cart abandonment studies since 2006 and runs its own usability testing and shopper surveys. Its big lessons for a Shopify store: unexpected extra costs are the top reason people abandon checkout, and trust, delivery speed, forced account creation and site errors follow. Most of these are fixed on the product page, cart and policies, before checkout.

**Katie Sherwin, Nielsen Norman Group, *UX Guidelines for Ecommerce Product Pages* (2019) [26].** A product page must answer the shopper's questions on the page: front-loaded descriptions, several images including scale and in-use shots, full price and shipping details, consistent option information, honest reviews, stock status per option and clear feedback after add to cart. This is the checklist behind most product page sections a specialist builds.

**W3C, Web Content Accessibility Guidelines 2.2 [24].** The standard that accessibility rules and audits point to. The numbers a theme developer uses daily: text contrast of at least 4.5:1, or 3:1 for large text. Shopify's own Theme Store requirements apply the same contrast ratios to themes it lists [7].

## 3. How the work is done now

### The theme platform, as of November 2026

- **Online Store 2.0 themes.** Pages are built from JSON templates that list sections and their settings, which the owner arranges in the theme editor. A JSON template can render up to 25 sections, each with up to 50 blocks, and a theme can hold up to 1,000 JSON templates [1]. Older "vintage" themes use the earlier template structure; on those, connecting metafields to the page often needs a code edit rather than the theme editor [15].
- **Horizon and theme blocks.** On 21 May 2025 Shopify released Horizon, a set of 10 free themes built with theme blocks [2]. The Summer '25 Edition also added AI tools that generate a custom block or a whole theme from a description [27]. Stores may run Horizon, an older free theme, a paid theme or a vintage theme, so check the theme and version before writing code.
- **Metafields.** Metafields add custom fields (size charts, care notes, ingredients) to products and other records. Definitions give those fields validation, and themes that support dynamic sources let the owner connect them to a section setting in the theme editor [15].
- **Apps and the theme.** Modern apps add features through theme app extensions, which do not edit theme code; Shopify requires them for new App Store apps [6]. Older apps inject code into theme files, and uninstalling an app does not always remove that code [5]. Shopify warns that even a stray line break left by an app takes a theme off its upgrade path [6].
- **Checkout is not theme code.** Checkout customisation now runs through checkout extensibility and Shopify Functions. Shopify Scripts could no longer be edited or published after 15 April 2026 and stopped running entirely on 30 June 2026 [16]. The "Additional scripts" box in checkout settings has been view-only since 28 August 2025, and non-Plus stores had until 26 August 2026 to upgrade their Thank you and Order status pages [17]. A request to "add this script to checkout" now means an app, a pixel or a Function, not a paste.
- **AI inside Shopify.** Sidekick, Shopify's admin assistant, gained multi-step reasoning in Summer '25 [27]. Store owners can also connect outside AI tools (Claude, ChatGPT, Gemini, Perplexity and others) through official connectors. Each connector asks for read-only or write access, is capped by the approving user's own permissions, and cannot be scaled back after approval without uninstalling it [12].

### The safe editing workflow

1. **Agree the access level.** Level 1 (read): theme files or screenshots. Level 2 (read and draft): a collaborator seat to edit unpublished copies. Level 3 (read, write and publish): live changes within the owner's limits. Record it as "Access I have" (see Access below).
2. **Edit a duplicate (level 2).** Shopify's own advice is to duplicate a theme before editing code, so changes can be thrown away [3].
3. **Know the limits of undo.** The code editor keeps a Timeline per file, but restoring replaces the whole file, history is finite, files in the assets folder have no history, and deleted files cannot be recovered [3]. So keep a copy of each original file and list every file you touch.
4. **Expect theme updates to bite.** When a Theme Store theme updates, code changes that conflict with the update are removed in the updated copy [3]. Settings-based changes survive better than code edits, which is another reason to expose text and colours as settings.
5. **Publish or schedule (level 3, or the owner).** Keep a backup copy of the live theme first. Since 31 March 2026, Rollouts (in the Markets section of the admin) can schedule theme changes to go live at a set time, add an end date so a promotion reverts on its own, or A/B test a theme change against the current theme with real shoppers. It is available on Basic plans and above; targeting a single market needs Advanced or Plus [18].

### Speed

- **Field data first.** The admin's Web performance dashboard reports LCP, INP and CLS from real visits over the past 30 days at the 75th percentile, with page-type and URL views. Data can lag by up to 36 hours, only 90 days are kept, and stores in private mode or with little traffic may show nothing or swing widely [8]. Its timeline marks app installs, theme updates and code changes, which makes "what changed?" easy to answer [8].
- **Lab tests second.** Lighthouse and PageSpeed lab scores help find causes, not prove results. Shopify's Theme Store minimum (an average Lighthouse performance score of 60) is a floor for theme sellers, not a goal for a store [7].
- **The usual fixes, in Shopify's own order of advice [4]:** use the `image_url` and `image_tag` filters so Shopify serves sized images with `srcset` and dimensions; never lazy-load the largest image at the top of the page and give it `fetchpriority="high"`; use a real `<img>` rather than a CSS background for the hero; defer scripts that are not needed at first paint; preload only one or two late-found resources; remove anti-flicker snippets when no test is running; and avoid apps that claim to boost speed scores by gaming Lighthouse.
- **Apps are usually the cause.** Shopify's audit guide: list every script by origin, check whether each is still needed, confirm removed apps really left (search `layout/theme.liquid`, the `snippets` folder, `render` and `include` tags and the page source for the app's domain), load the rest only where they are used, and measure the effect of blocking each one [5].

### Access by level, never by password

- **Collaborator accounts.** The owner shares a four-digit collaborator request code from Settings > Users > Security, then approves the request with a role that holds only the permissions the job needs. Collaborators cannot be given the Administrator role, must use two-step authentication, do not count towards the store's user limit, and lose access automatically after 90 days without logging in [10].
- **Permissions are blunt in places.** The Themes permission covers viewing, changing and publishing themes; Edit code is a separate permission [11]. So at level 2 the seat could publish, and "duplicates only" is a written limit the specialist keeps. Many other permissions (Orders, Products, Customers) have view-only options [11].
- **AI connectors.** Read-only access fits level 1; levels 2 and 3 need write access. The level cannot be lowered later without reinstalling, so choose it at install [12].
- **Level 3 rules.** Before the first live action, show the action list and limits (store, kinds of change, price or discount caps, time window) and get one yes. Ask again before anything outside them: a new store or market, deleting or overwriting data, publishing over the live theme without a backup, anything irreversible, or checkout and payment settings. Log every action and stop on errors or warnings.

### Launch and sale checks

- **Shopify's launch steps.** Choose a plan, add a business address, set up a payment method with test mode off, place test orders (checkout, inventory, shipping and taxes), preview the store, then launch, which removes the password page [14].
- **Policies.** Shopify supports return and refund, privacy, terms of service, shipping, contact information, legal notice and subscription policies; it can generate and maintain some automatically and links them in the checkout footer. The merchant stays responsible for what they say [13].
- **Product pages carry the sale.** Answer the questions on the page and show the full price and shipping terms early [26]. Unexpected extra costs are the most common reason US shoppers give for abandoning checkout in Baymard's survey [25].
- **Sale day is about change control.** Freeze theme and app changes before a big sale, schedule the sale theme and its end date in Rollouts [18], and remove or test every app that touches the storefront. Gymshark's experience (below) is the cautionary tale [30].

### Rules by region (general information, not legal advice)

- **EU, price reductions.** When a store announces a price cut to EEA shoppers, it must show the lowest price it charged in the previous 30 days or more; national law may ask for longer. In Shopify that usually means setting the compare-at price to that lowest price. Stores whose primary market is outside the EEA have compare-at prices hidden for EEA shoppers by default and can turn them on per market. For frequent discounts, Shopify suggests showing the lowest prior price through metafields or a theme statement [19].
- **EU and UK, cookies.** Shopify's automated privacy settings, on by default for new stores, set up a cookie banner for UK and EEA visitors where those markets are active, and collect non-essential data there only after opt-in consent. A privacy policy must be published first, and if a third-party banner app is used its regions must match Shopify's settings, or data may be collected before consent [20].
- **EU, accessibility.** From 28 June 2025 the European Accessibility Act requires e-commerce services sold to EU consumers to be accessible [21]. National laws set the details and any exemptions, so point clients to their own country's rules.
- **UK, prices.** Under the CMA's price transparency guidance (summary updated 7 January 2026), the headline price must be the total price including unavoidable fees and taxes; mandatory delivery charges must be shown up front and included when they can be worked out; hiding charges until later in the purchase is illegal, with fines of up to 10% of turnover or £300,000, whichever is greater [22].
- **US, accessibility.** The Department of Justice's position (guidance of 18 March 2022) is that the ADA applies to the web offerings of businesses open to the public. It has no detailed technical rule for them and names WCAG as helpful guidance [23].
- **US, privacy.** Shopify's privacy settings include a data sharing opt-out page for regions where visitors can opt out of the sale or sharing of their data [20].

## 4. Benchmarks and numbers

Use these to set expectations, never as promises. Each has a source, a date and a caveat.

- **Core Web Vitals thresholds.** Good: LCP 2.5 seconds or less, INP 200 milliseconds or less, CLS 0.1 or less, at the 75th percentile [9]. Shopify's dashboard marks LCP above 4 seconds and INP above 500 milliseconds as poor [8]. *Caveat:* these are Google's lines, not proof of sales impact on any one store.
- **Theme Store floors (as of Nov 2026).** Themes sold in Shopify's Theme Store need an average Lighthouse performance score of at least 60 and accessibility score of at least 90 across home, collection and product pages, body text contrast of 4.5:1, and touch targets of at least 24 by 24 CSS pixels [7]. *Caveat:* lab scores on demo content; a real store with apps and large images will score differently.
- **Cart abandonment.** Baymard's documented average is 70.22%, the mean of 50 studies from 2006 to 2025, with individual studies from 55% to 84%. Among US shoppers who abandoned during checkout (excluding those just browsing), the top reasons were extra costs too high (40%), delivery too slow (20%), not trusting the site with card details (19%) and forced account creation (18%) [25]. *Caveats:* Baymard's survey is of US shoppers; abandonment includes people who were never going to buy; the page does not state the survey's sample size.
- **Checkout improvement estimate.** Baymard estimates that an average large ecommerce site could gain 35.26% in conversion rate by fixing checkout usability issues [25]. *Caveat:* Baymard's own estimate for large US and EU sites, not a promise for a small Shopify store, and much of Shopify's checkout is not editable anyway.
- **Speed and sales, causal.** Vodafone (2021): 31% better LCP, 8% more sales in a 50/50 A/B test on paid traffic [28]. *Caveat:* one large telecom site, one test.
- **Speed and sales, associated.** *Milliseconds Make Millions* (end of 2019 data, published 2020): 0.1 seconds faster on mobile was associated with 8.4% more retail conversions [29]. *Caveat:* correlation, Google-commissioned, older metrics (some since replaced).
- **Case study: the app you forgot about.** In Shopify's published account (vendor-published, updated 29 August 2018), Gymshark's earlier site was offline for about eight hours on a Black Friday, which the article puts at an estimated $143,000 in lost sales; its CTO blamed a bug in an app the company was not even using. Gymshark then moved to Shopify [30]. *Caveat:* a vendor's marketing story about a rival platform; the general lesson is to remove what you do not use before peak traffic.

No source gives a trustworthy "good conversion rate" for a Shopify store. Use the store's own history as the baseline.

## 5. Decision rules

- If a theme setting, a built-in Shopify feature or an existing section can do the job, use it, because every code edit is something to maintain and can be lost in a theme update [3].
- If a change needs code, build it as a section or block with settings, because the owner can then edit text and colours without touching code.
- If a request touches checkout, use checkout extensibility, a Function or an app, because Shopify Scripts stopped running on 30 June 2026 and the Additional scripts box is view-only [16][17].
- If the owner wants another app for a small display feature, check whether a section, block or metafield can do it first, because each storefront app can add scripts that slow every page [5].
- If an app was uninstalled, search the theme for its leftovers before calling the job done, because uninstalling does not always remove its code [5].
- If field data and a lab score disagree, trust the field data for "is it a problem?" and use the lab test for "what is causing it?" [8][9].
- If the largest image at the top of a page is lazy-loaded or a CSS background, fix that before anything else on that page, because it delays LCP directly [4].
- If the store has too little traffic for the dashboard to show stable numbers, say so and judge changes with lab tests on the main templates instead [8].
- If a big sale is coming, freeze theme and app changes beforehand and schedule the sale changes, because untested changes at peak traffic carry the most risk [18][30].
- If a price reduction is shown to EEA shoppers, check how the compare-at price was set against the lowest price of the previous 30 days [19].
- If extra costs appear only at checkout, move shipping information onto product and cart pages, because surprise costs are the top stated reason for abandoning [25][22].
- If someone offers the store password or an API token, refuse it and offer a collaborator account with set permissions or an official connector at the level they choose [10][12].
- If no access level has been agreed for a tool, work at level 1, because the owner has not yet said what may change.
- If a level 3 action falls outside the agreed limits, stop and ask, even mid-job.
- If a client asks whether the store is legally compliant, describe what the official guidance says and refer them to a qualified adviser; never give a ruling.

## 6. Common mistakes, and how to spot them

- **Editing the live theme.** Spot it: the theme marked "Current" was edited in the code editor and there is no copy from before the change.
- **Hard-coded text and colours.** Spot it: the owner has to ask a developer to change a heading or a hex value.
- **App pile-up.** Spot it: several apps doing overlapping jobs (two review widgets, three pop-ups), each loading scripts on every page [5].
- **Ghost code.** Spot it: snippet files named after apps the store no longer has, or the page source still calling a removed app's domain [5].
- **Lazy-loaded or hidden hero image.** Spot it: the first large image has `loading="lazy"`, a fade-in animation, or is set as a CSS background [4].
- **Chasing a lab score.** Spot it: a "speed booster" app that hides content from Lighthouse, or a team celebrating a PageSpeed number while field data has not moved [4][8].
- **Untested edge cases.** Spot it: the new section breaks with a sold-out variant, a missing metafield value or a 70-character product name.
- **Surprise costs.** Spot it: shipping cost or delivery time appears for the first time at checkout [25].
- **Checkout scripts that no longer run.** Spot it: tracking or discount logic that relied on Scripts or the Additional scripts box and silently stopped [16][17].
- **Fake urgency and partial prices.** Spot it: countdown timers that reset, or prices that leave out unavoidable fees for UK shoppers [22].
- **Contrast and labels missed.** Spot it: light grey text on white, icon buttons with no accessible name, form fields without labels [7][24].

## 7. Quality bar: what an expert checks before handing over

1. Is the change built on a duplicate theme, with the original files saved, every touched file listed and every action logged at the agreed access level?
2. Could a setting, built-in feature or existing section have done this instead?
3. Can the owner change the text, images and colours in the theme editor?
4. Does it work on a phone and on desktop, with long text, empty values, sold-out variants and the store's real products?
5. Does it add any script, font or large image to pages where it is not used?
6. Do field Core Web Vitals hold steady after release, and was a baseline recorded before it?
7. Does it pass Theme Check or a careful read for Liquid errors, and is there no console error on the pages it touches?
8. Are contrast, focus states, labels and alt text in order?
9. Are install steps, test steps and undo steps written so a non-developer can follow them?
10. For launches and sales: have test orders gone through, are policies complete and consistent, and does each item on the day-of checklist have a named owner?

## 8. How this role writes

**Deliverables.**

- *Change request:* what changes, why, files touched, risk, how to test, how to undo, and who publishes (the owner, or the specialist at level 3 after a yes).
- *Action log (level 2 and 3):* what, where, when and the result of every action, sent with the handover.
- *Code handoff:* the code in fenced blocks with the file path above each one, comments in the code where a non-developer might look, and a schema with sensible defaults.
- *Install steps:* numbered, starting with "Duplicate your live theme", ending with "Preview, then publish when you are happy".
- *Test steps:* a table of page, device, case and expected result.
- *Check reports:* pass or fix lists grouped by buyer path step (home, collection, product, cart, checkout, confirmation, emails), with severity and owner.
- *Speed fix lists:* each fix with the page type, the evidence, the effort and the expected effect on a named metric.

**Tone and conventions.** Plain English for the owner, exact file paths for the developer (`sections/size-chart.liquid`). Say what you could not check. Never claim a speed or sales result in advance.

## 9. Glossary

- **Theme:** the files that control how the online store looks and behaves.
- **Liquid:** Shopify's template language, used in theme files to output store data.
- **JSON template:** a file that lists which sections a page shows and their settings [1].
- **Section:** a reusable, editable module of a page, with its own settings and blocks.
- **Block:** a smaller piece inside a section that the owner can add, remove and reorder.
- **Theme block:** a block defined once at theme level and reusable across sections; Horizon themes are built on them [2][27].
- **Schema:** the settings definition at the bottom of a section or block file.
- **Metafield:** a custom field added to products or other records, such as a size chart [15].
- **Dynamic source:** a theme editor setting connected to a metafield or other changing data [15].
- **Vintage theme:** a theme built on Shopify's older template structure, without sections on every page.
- **Theme app extension:** the modern way for apps to add app blocks and app embeds without editing theme code [6].
- **Ghost code:** code an uninstalled app left in the theme [6].
- **Script tag:** an older way for apps to inject scripts into the storefront, being retired [6].
- **Checkout extensibility:** Shopify's upgrade-safe system for customising checkout through apps and settings [17].
- **Shopify Functions:** custom backend logic for discounts, delivery and payment options, which replaced Scripts [16].
- **Collaborator account:** limited store access for a partner, requested with a code and approved by the owner [10].
- **Rollouts:** admin tool to schedule, end-date or A/B test theme changes [18].
- **LCP, INP, CLS:** Core Web Vitals for loading, responsiveness and visual stability [9].
- **Field data and lab data:** measurements from real visits versus a single simulated test [8].
- **75th percentile:** the value that three in four visits meet or beat, used for Web Vitals [9].
- **Compare-at price:** the higher "was" price shown next to a sale price [19].
- **Drip pricing:** adding unavoidable charges later in the purchase [22].

## 10. What changes fast

Re-check at each refresh:

- **Theme platform:** Shopify Editions (twice a year), the changelog and shopify.dev theme docs [1][2][27].
- **Script tags:** no new or updated ones after 1 October 2026; Shopify stops adding them to storefronts on 1 March 2027 [6].
- **Checkout:** checkout extensibility and Functions capabilities, plan limits, and any remaining upgrade deadlines [16][17].
- **Rollouts and plan availability:** what each plan can schedule or test [18].
- **AI connectors, MCP servers and Sidekick:** which tools can connect, what access levels they offer and what they can change [12][27]. These are new; check shopify.dev and the help centre before advising.
- **Web Vitals:** metric definitions and thresholds on web.dev, and how the admin dashboard reports them [8][9].
- **Rules:** EU price indication and national transpositions [19], EAA national laws [21], CMA guidance and enforcement [22], US DOJ web accessibility guidance [23], and Shopify's privacy settings [20].
- **Benchmarks:** Baymard's abandonment list [25].
