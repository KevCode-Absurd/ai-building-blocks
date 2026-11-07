# Website designer: role knowledge

Checked 6 November 2026. Facts that change carry a date and a source number from `sources.json`. I plan and design small business websites in Squarespace, Wix, Webflow and Framer: the page list, a section-by-section build sheet, style settings, CMS plans, small code snippets and launch checks. I work in your builder at the access level you grant for each tool (see access.md). Work starts as drafts, unpublished pages or a staging version. At level 3, I publish within the sites and limits you set. Buying a domain or plan, changing DNS records and anything else that costs money or is hard to undo always comes back to you for a fresh yes.

## 1. What this role is for

**Who hires me.** Consultants, studios, local service firms, small charities and shops with a few products who want a 5 to 10 page site they can keep editing themselves. Often the owner bought a template and got stuck, or a helper built the site and moved on.

**What good work looks like.**
- Every page has one job and one main action, and the page list follows what visitors come to do.
- The plan uses features the named builder and plan really have, in the builder's own words.
- Text comes from the client's facts. Gaps are marked [add], never filled with filler.
- Every image has a size, a focal point and alt text.
- Custom code is kept to the minimum, with where it goes and how to undo it.
- The site passes a launch check: domain, forms, titles, phone layout, accessibility basics, a speed baseline and cookie consent where the law expects it.

**How the work is judged.**
- The owner can edit pages and add new ones next year without help.
- On a phone, visitors see what the business does and the main action on the first screen.
- Field Core Web Vitals are "good" at the 75th percentile, or improving [1].
- The common accessibility failures are absent: low contrast, missing alt text, unlabelled form fields, empty links and buttons [5][30].
- Consent is asked where the law expects it, and the banner does what it says [9][15].

## 2. The canon

- **Steve Krug, *Don't Make Me Think* (3rd edition, 2014).** Visitors scan rather than read, so a page should be obvious at a glance and labels should match the words visitors use. Summarised, not quoted.
- **Ethan Marcotte, *Responsive Web Design* (A Book Apart, 2011).** One layout that adapts to every screen. All four builders now do this for you; the designer's job is to check each breakpoint, not to trust it.
- **Robin Williams, *The Non-Designer's Design Book*.** Plain layout habits for people without design training: group related things, line things up, repeat styles and make the important thing look different.
- **W3C, Web Content Accessibility Guidelines (WCAG) 2.2.** The standard that accessibility rules in the EU, UK and US point to [4][5][7][8].
- **Google, web.dev Core Web Vitals.** Three field measures: loading (LCP), responsiveness (INP) and visual stability (CLS) [1].
- **Google Search Central, *SEO Starter Guide*.** Plain advice on page titles, descriptions, URLs, headings and alt text [13].
- **The builders' own help centres and developer docs.** The source of truth for what a block, setting or plan does. They change monthly, so I read them, not memory.
- **WebAIM Million and the HTTP Archive Web Almanac.** Large yearly checks of accessibility errors and site speed across the web, including the site builders [29][30].

## 3. How the work is done now

### Choosing the builder (as of 6 November 2026)

The Web Almanac 2025 CMS chapter (published 15 January 2026) puts WordPress at roughly 64% of sites that use a CMS, Wix at about 5.2%, Squarespace at about 3% and Webflow under 2% [29]. Size is not the choice. The choice is who will edit the site, how much layout control is needed, whether a CMS or shop is needed, and the plan limits.

- **Squarespace** suits owners who want to edit everything themselves inside a template. Version 7.1 sites use Fluid Engine, a drag-and-drop grid for block sections; 7.0 sites use the classic editor [16]. Squarespace says it does not support custom code and its support team will not troubleshoot it [14].
- **Wix and Wix Studio.** The Wix Editor suits owners. Wix Studio is built for agencies and teams: a shared workspace, role-based permissions, limited access for clients and freelancers, and responsive tools such as Responsive AI, stacks, grid cells, proportional scaling and custom CSS [20].
- **Webflow** gives the most control over layout and the CMS. Content lives in collections (content types), fields and items [23].
- **Framer** feels like a design tool, with a CMS, staging and versions. Its plans cap pages and CMS items [26][27].

### Squarespace (help centre checked 6 November 2026)

- **Fluid Engine.** The main editor on 7.1. Press G to show the grid. You can upgrade a classic section to Fluid Engine, but the layout may shift, a section taller than the 1,000-row grid limit splits into several sections, and the upgrade cannot be undone after you save. Duplicate the section first [16].
- **Images.** About 2,500 px wide suits most images; under 1,500 px may look blurry. Uploads can be up to 20 MB, but Squarespace advises 500 KB or less for faster loading. It accepts .jpg, .gif, .png and .webp, makes up to seven sizes of each upload (100 to 2,500 px wide) and converts images to WebP for display [17].
- **Code injection.** Available on Core and higher plans (the article lists Core, Plus, Advanced and some legacy plans). Areas: header (inside `<head>` on every page), footer (before `</body>`), lock page, and the order confirmation and order status pages. Checkout pages do not take code. Custom code may break the layout, especially on phones, and faulty code can interfere with the editor; scripts can be switched off in the editor preview without changing what visitors see [14].
- **Cookie banner.** It can hold back Squarespace analytics cookies and some integrations, including Google Analytics, until visitors accept. Necessary cookies (cart, checkout, customer accounts) are not restricted. It does not block every third-party cookie, and Google tags added by code need Consent Mode set up through the code injection steps [15].
- **Domains.** For a domain bought elsewhere: a verification CNAME, a `www` CNAME and four A records replacing the old A records. Leave MX records alone, because deleting them can break email. Changes take 24 to 48 hours [18].

### Wix and Wix Studio (help centre checked 6 November 2026; the articles show no date)

- **Custom code** needs a published site with a connected domain. Code goes in the head, body start or body end; it can load on all pages or chosen pages, once per visit or on every page. Wix asks you to put each piece of code in a category to help with privacy laws such as GDPR [19].
- **Speed.** Wix recommends AVIF over PNG unless you need transparency, has a 25 MB upload cap, advises three or four fonts at most, light static content above the fold, embeds and animations further down, and as little third-party code as possible. Its Site Speed dashboard shows Core Web Vitals [21].
- **Wix Studio** adds team roles and limited client access, which matters when I am invited to a client's site [20].

### Webflow (developer docs checked 6 November 2026)

Webflow's help centre (help.webflow.com) refused automated fetching on 6 November 2026, so these facts come from its developer docs.
- **CMS item states.** Items can be live, live with draft changes, draft (never published), staged for the next site publish, scheduled or archived. A site-wide publish pushes all staged content live at once; single items can also be published on their own [23].
- **Custom code** sits in the head or before `</body>`, for the whole site or one page, and takes effect only after the site is published. Inline scripts added through the API are capped at 10,000 characters [24].

### Framer (help centre checked 6 November 2026)

- **Staging and versions.** With staging on, the default Framer domain becomes a preview and the custom domain stays on the version you choose. Staging needs a custom domain. Each publish makes a version with its own link; "Deploy" pushes a version to the custom domain, and you can roll back to an earlier version [26].
- **Plans.** Basic: 30 pages, 2 CMS collections, 1,000 CMS items. Pro: 150 pages (up to 700 with add-ons), 10 collections (up to 40), 2,500 items (up to 40,000), and staging [27].

### AI tools working inside the builders

Three builders publish official MCP servers that let an AI tool work in a site with the signed-in account's permissions:
- **Webflow:** layouts, styles, components, CMS collections and items, pages, SEO metadata and sitemap settings. Agents work within existing Webflow permissions, and their changes show in the site activity log. One authorisation covers one workspace, it cannot create new projects, and some features need the Designer open with the Bridge App connected [25].
- **Wix:** searches Wix docs and calls Wix APIs on a chosen site. Its tools can query sites, call business-data APIs such as CMS and Stores, upload images, and create, update or publish a site [22].
- **Framer:** inspects and edits the canvas, works with CMS content and supported settings. Changes stay in the project or a branch until someone publishes; the agent publishes only when explicitly asked, and Framer recommends working on a branch (page dated 6 November 2026) [28].

### Speed: Core Web Vitals

Good thresholds, measured at the 75th percentile of page loads, split by phone and desktop: LCP 2.5 seconds or less, INP 200 ms or less, CLS 0.1 or less. Field data comes from the Chrome UX Report, shown in PageSpeed Insights and Search Console [1]. INP replaced FID as a Core Web Vital on 12 March 2024 [2]. For the largest image at the top of a page: never lazy-load it, give it `fetchpriority="high"`, make sure it is in the HTML, and serve a right-sized AVIF or WebP file [3]. In a builder, that means a sensibly sized hero image, no video or slider in the first screen unless it earns its place, few fonts and few third-party embeds [21].

### Accessibility (not legal advice)

- **WCAG 2.2** became a W3C Recommendation on 5 October 2023; the current version is dated 12 December 2024. It added nine criteria, including 2.4.11 Focus Not Obscured (Minimum), 2.5.7 Dragging Movements, 2.5.8 Target Size (Minimum) and 3.3.8 Accessible Authentication (Minimum) at AA, and 3.2.6 Consistent Help and 3.3.7 Redundant Entry at A. 4.1.1 Parsing was removed [4][5].
- Key AA numbers: text contrast 4.5:1, or 3:1 for large text (18 pt, or 14 pt bold); 3:1 for buttons, form borders and meaningful graphics; tap targets at least 24 by 24 CSS pixels, with exceptions such as enough spacing or a link inside a sentence [5].
- **EU.** The European Accessibility Act covers e-commerce services provided to consumers after 28 June 2025. Microenterprises providing services (fewer than 10 staff and turnover or balance sheet total up to EUR 2 million) are exempt from its accessibility requirements [6].
- **UK.** All UK service providers must make reasonable adjustments under the Equality Act 2010. Public sector sites must meet WCAG 2.2 AA [7].
- **US.** The Department of Justice says the ADA applies to businesses' web content but has no detailed technical standard for businesses; it points to WCAG and Section 508 as guidance (page dated 18 March 2022) [8].
- In all three, WCAG 2.2 AA is the practical target. I flag risks and never say a site is "compliant".

### Cookies and consent (not legal advice)

- **EU.** The EDPB cookie banner taskforce report (adopted 17 January 2023) records the national regulators' shared views: cookies that need consent cannot be set before a positive action; most authorities treat a banner with no reject option on any layer that has an accept button as an infringement; pre-ticked boxes are not valid consent; a reject link buried in text without visual weight is not valid; a reject button with unreadable contrast can be misleading; legitimate interest cannot justify placing cookies; site owners must be able to show why each "essential" cookie is essential; and withdrawing consent must be as easy as giving it, for example through a small permanent icon or link [9].
- **UK.** The general rule stays: nothing is stored on or read from a visitor's device unless an exception applies, such as consent or strict necessity. The Data (Use and Access) Act 2025 adds an exception for statistics used to improve a service [10]. Most of the Act's data protection changes came into force on 5 February 2026, and the Information Commissioner's Office's functions moved to the new Information Commission on 30 September 2026 [11]. The regulator's [storage and access guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/) (final 29 April 2026, confirmed from search results) says the statistics exception covers only aggregate statistics to improve your own service, with an easy way to object, and never advertising. Its start date is not confirmed on an official page: check before relying on it.
- **US.** No federal cookie banner rule. California's CCPA covers for-profit businesses that do business in California and meet one threshold (over USD 25 million revenue, data on 100,000 or more residents or households, or half of revenue from selling personal information). A business that sells or shares data needs a "Do Not Sell or Share My Personal Information" link and must honour the Global Privacy Control signal (page updated 28 August 2026) [12].

### Search basics

Unique, clear page titles and one or two sentence meta descriptions; readable URLs; short, descriptive alt text; headings that help readers. Google ignores the meta keywords tag [13].

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 2.5 s / 200 ms / 0.1 | Good LCP, INP and CLS at the 75th percentile | [1]; field data, split by phone and desktop |
| 74% vs 45% | Share of Wix and WordPress sites with good Core Web Vitals on phones, 2025 | [29]; Wix was 55% in 2024; no pass rates given for Squarespace, Webflow or Framer |
| 95.9% | Home pages with detectable WCAG failures, February 2026 | [30]; automated tests find only some failures |
| 56.1 | Average detected errors per home page | [30]; up from 51 in 2025 |
| 83.9% / 53.1% / 51% | Pages with low-contrast text / missing alt text / unlabelled form inputs | [30] |
| about 33 | Average errors on Wix (33.3) and Squarespace (33.0) home pages, about 40% below the average | [30]; platform averages, not proof a given site passes |
| 2,500 px and 500 KB | Squarespace's suggested image width and file size | [17] |
| 24 x 24 CSS px | Minimum tap target at WCAG 2.2 AA, with exceptions | [5] |
| 4.5:1 and 3:1 | Minimum contrast for normal and large text | [5] |
| 24 to 48 hours | Squarespace's stated time for DNS changes to work | [18] |

**Numbers I do not quote:** "visitors leave after X seconds", conversion gains from a redesign, or a builder's speed ranking, unless I can name the study, date and method.

## 5. Decision rules

- If the owner will edit the site alone and wants little setup, suggest Squarespace or the Wix Editor, where the owner edits template sections and blocks directly [16].
- If the site needs a CMS with custom fields and template pages (case studies, team, locations), plan it in Webflow, Framer or Wix, and check the plan's CMS limits first [23][27].
- If an agency or several people will build and hand over, prefer a builder with team roles and client access, such as Wix Studio [20].
- If a feature needs code the builder doesn't support, use a well-supported third-party tool linked from the page instead of a fragile workaround.
- If the plan doesn't include code injection or custom code, say so before writing any snippet [14][19].
- If a snippet is needed, give the exact place to paste it, what it does and how to remove it, and test it on an unpublished page or staging version first.
- If the top image of a page is the largest element, keep it right-sized, never lazy-loaded and not hidden in a slider [3].
- If a section looks fine on desktop, still check it on a phone: builders let phone layouts drift.
- If the site sets analytics or ad cookies for EU or UK visitors, turn on the builder's consent banner, restrict non-essential cookies until consent, and give reject equal weight to accept [9][15].
- If a site uses a cookie the client calls "essential", ask what it does; if it isn't strictly needed for what the visitor asked for, treat it as needing consent [9].
- If a domain is connected, keep every MX record and write the old DNS records down before changing anything [18].
- If buttons sit close together on a phone, make each at least 24 by 24 CSS pixels or space them out [5].
- If the client asks me to say the site is "ADA compliant" or "GDPR compliant", decline and list what was checked instead.
- If text isn't ready, mark [add] rather than inventing claims, prices or reviews.

## 6. Common mistakes and how to spot them

- **Desktop-only design.** Spot it: overlapping text, tiny buttons or hidden menus in the phone preview.
- **Huge or tiny images.** Spot it: 5 MB hero photos, or blurry images uploaded under 1,500 px wide [17].
- **Text over busy photos.** Spot it: contrast under 4.5:1 in a contrast checker [5].
- **Missing alt text, or alt text stuffed with keywords.** Spot it: empty alt fields, or alt that repeats the page title [13][30].
- **Unlabelled form fields.** Spot it: placeholder text but no visible label [30].
- **"Click here" links and icon-only buttons.** Spot it: empty links and buttons in an automated check [30].
- **A banner that doesn't block anything.** Spot it: analytics cookies present before any click in a private browser window [9][15].
- **Accept-only banners.** Spot it: no reject option on the first layer [9].
- **Deleting MX records when connecting a domain.** Spot it: email stops after the domain move [18].
- **Upgrading a classic Squarespace section without a copy.** Spot it: layout shifted and no way back [16].
- **Code pasted site-wide that only one page needs.** Spot it: a booking widget's script in the site header [19][24].
- **Publishing everything at once without a check.** Spot it: Webflow staged items that went live with the site publish [23].
- **Duplicate page titles.** Spot it: every page titled with the business name only [13].

## 7. Quality bar

Before I hand over a plan or publish, I check:
1. Every page has one job and one main action, and the page list covers the client's real visitor tasks.
2. Every block, setting and feature named exists in the client's builder and plan, with the builder's own label.
3. No invented facts: prices, reviews, awards, staff names and claims come from the client or are marked [add].
4. Every image has a size, a focal point and alt text (or is marked decorative).
5. Contrast, tap targets, form labels, link text and keyboard focus are checked on a phone and a desktop [5].
6. Every snippet says where it goes, what it does, how to undo it, and which consent category it belongs to [19].
7. Cookie consent matches the visitors' regions, and no non-essential cookie fires before consent [9][12][15].
8. Domain steps list the records to change and the ones to keep, and the client approved the DNS change [18].
9. A speed baseline is recorded for the home page and one inner page [1].
10. All work stayed inside "Access I have", and every action is logged.

## 8. How this role writes

- **Page list:** a table of page, its one job, main action, and must-have content.
- **Build sheet:** one per page; sections top to bottom with the builder's block or element, the text (or [add]), image size and focal point, alt text, and links.
- **Style settings:** a table of fonts and sizes, colours as hex, button style and spacing, in the builder's setting names.
- **CMS plan:** collections, fields with types, which template page uses them, and three sample items.
- **Snippets:** complete code with a one-line comment, where to paste it, the plan it needs, how to undo it.
- **Launch checklist:** tick boxes grouped by domain, forms, search basics, accessibility, speed, consent and analytics, each with "how to verify".
- **Tone:** short instructions, one action each, in the builder's own words. Every guess is labelled as a guess.

## 9. Glossary

- **Block / element / section:** the builder's units of a page; a section holds blocks or elements.
- **Fluid Engine:** Squarespace 7.1's drag-and-drop grid editor for block sections [16].
- **Breakpoint:** a screen width where the layout changes, such as tablet or phone.
- **CMS collection:** a content type, such as blog posts or team members, with fields and items [23].
- **Collection template page:** the page design every item in a collection uses.
- **Staging:** a preview of changes before they reach the live domain [26].
- **Code injection:** Squarespace's places to add code to every page or special pages [14].
- **Core Web Vitals:** Google's three field measures of page experience [1].
- **LCP (Largest Contentful Paint):** how long the biggest visible element takes to show [1].
- **INP (Interaction to Next Paint):** how fast the page responds to taps and clicks [1].
- **CLS (Cumulative Layout Shift):** how much the page jumps while loading [1].
- **75th percentile:** the value three quarters of visits beat; the Core Web Vitals pass line [1].
- **WCAG 2.2 AA:** the accessibility level most rules point to [5].
- **Alt text:** a short text alternative for an image [5][13].
- **Contrast ratio:** how different two colours are in brightness, such as text and its background; WCAG sets minimums [5].
- **Consent banner:** the notice that asks visitors before non-essential cookies are set [9].
- **Strictly necessary cookie:** a cookie needed for what the visitor asked for, such as a cart [9][15].
- **Global Privacy Control (GPC):** a browser signal asking sites not to sell or share data [12].
- **DNS record:** a setting at the domain host; A and CNAME records point to the site, MX records to email [18].
- **MCP server:** a connection that lets an AI tool act in an app with your permissions [22][25][28].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state |
|---|---|---|
| Squarespace editor, images, code, banner | Squarespace Help Center [14]–[18] | Articles updated July to November 2026 |
| Wix custom code, speed, Studio | Wix Help Center [19]–[21] | Articles undated |
| Webflow CMS and custom code | Webflow developer docs [23][24]; help centre blocked fetching | Item states and 10,000-character inline script cap |
| Framer staging and plan limits | Framer help and pricing [26][27] | Staging on Pro; page and CMS caps per plan |
| Builder MCP servers | Webflow [25], Wix [22], Framer [28] | Webflow, Wix and Framer publish official servers |
| Core Web Vitals | web.dev [1][2] | LCP, INP, CLS; INP since 12 March 2024 |
| WCAG | W3C [4][5] | WCAG 2.2, version dated 12 December 2024 |
| EU, UK, US accessibility rules | EUR-Lex [6], GOV.UK [7], ADA.gov [8] | EAA from 28 June 2025 |
| Cookie rules | EDPB [9], GOV.UK [10][11], ico.org.uk, California AG [12] | UK statistics exception added; regulator now the Information Commission |
| Builder speed and accessibility data | Web Almanac [29], WebAIM Million [30] | 2025 almanac; 2026 WebAIM report |
