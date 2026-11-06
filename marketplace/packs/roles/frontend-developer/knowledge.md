# Front-end developer: role knowledge

Checked 6 November 2026. Facts that change carry their own date and a source number from `sources.json`. I write HTML, CSS, JavaScript, TypeScript, React and Vue code, browser extension files, tests and test lists. I work in your tools at the access level you grant for each one (see access.md): level 1 reads, level 2 opens branches and pull requests, and level 3 merges and deploys within your limits. I cannot see your page render or run your code unless a connected tool lets me or you share the results, so I mark anything I could not check.

## 1. What this role is for

**Who hires me.** Founders testing an idea, small marketing teams that need a landing page this week, agencies short of front-end hands, and product teams of two to twenty engineers with no dedicated front-end specialist. The person asking is often a founder, a marketer or a back-end developer who wants the screen side done properly.

**What good work looks like.**
- The page or component works at phone, tablet and desktop widths, with a keyboard and with a screen reader.
- Every state is designed and built: default, hover, focus, loading, empty, error, success and disabled.
- It loads and responds fast on a mid-range phone, not just on the developer's laptop.
- The code fits the existing project: same framework version, naming, styling approach and test tool.
- Tests check what a user sees and does, so they survive refactoring.
- Nothing is invented: no fake testimonials, prices, API fields or package names.

**How the work is judged.**
- Core Web Vitals from real users at the 75th percentile: Largest Contentful Paint (LCP) 2.5 seconds or less, Interaction to Next Paint (INP) 200 milliseconds or less, Cumulative Layout Shift (CLS) 0.1 or less [1].
- Accessibility against WCAG 2.2 level AA, the target most rules point to [9][16].
- Bugs reported after release, especially "it breaks on my phone" and "I can't use it with a keyboard".
- How long the next developer takes to change the code safely.
- For marketing pages, whether the one action the page exists for (sign-up, purchase, enquiry) works every time.

## 2. The canon

**Ethan Marcotte, "Responsive Web Design" (A List Apart, 2010).** Named three ingredients: fluid grids, flexible images and media queries [29]. The idea still holds: design for a range of widths, not a list of devices. Today grid, flexbox and `clamp()` do most of the work that media queries once did.

**Brad Frost, *Atomic Design* (2016).** Interfaces are built in five stages: atoms, molecules, organisms, templates and pages [30]. The lesson for small teams is to build small parts that work alone, then check them inside a real page, because a component that looks fine in isolation can break in context.

**W3C, Web Content Accessibility Guidelines (WCAG) 2.2.** The standard for accessible web content, published as a W3C Recommendation on 5 October 2023 [10]; the current dated version is 12 December 2024 [9]. WCAG 2.2 added nine success criteria, including Focus Not Obscured, Dragging Movements, Target Size (Minimum), Consistent Help, Redundant Entry and Accessible Authentication, and removed 4.1.1 Parsing as obsolete [10].

**W3C, ARIA Authoring Practices Guide (APG).** Two rules to remember: no ARIA is better than bad ARIA, and a role is a promise. Giving a `div` the role of button means you must also build the keyboard behaviour a button has, because ARIA adds no behaviour of its own [11]. The APG patterns, such as the modal dialog, define the expected keys and focus moves [12].

**Kent C. Dodds and the Testing Library project.** The guiding principle: the more your tests resemble the way your software is used, the more confidence they give you [23]. Test through the screen (roles, labels, text, clicks, typing), not through component internals.

**The React team, "You Might Not Need an Effect".** Compute values from props and state during render, handle user actions in event handlers, and keep effects for syncing with systems outside React, such as a non-React widget, timers or the network [20]. Most "flicker" and "infinite loop" bugs in React code trace back to ignoring this page.

**Google's web.dev and the Core Web Vitals programme.** Three field metrics, one each for loading, responsiveness and visual stability, measured on real visits [1]. web.dev's guides break each metric into parts you can fix, such as the four parts of LCP [4].

**OWASP, Cross Site Scripting Prevention Cheat Sheet.** Frameworks escape output by default; the danger is in the escape hatches, such as React's `dangerouslySetInnerHTML`, and in URL, CSS and JavaScript contexts. Sanitise user-written HTML with a maintained library such as DOMPurify, and treat Content Security Policy as a second layer, never the main defence [24].

## 3. How the work is done now

### The platform first

- **Baseline** tells you when a web feature is safe to use. "Newly available" means it works in the core browser set: Chrome, Edge, Firefox and Safari on desktop and mobile. "Widely available" means 30 months have passed since then [18]. Use widely available features freely; add a fallback for newly available ones.
- **Native elements before libraries.** The `<dialog>` element opened with `showModal()` makes the rest of the page inert, closes on Escape and moves focus inside; it is Baseline widely available and has worked across browsers since March 2022 [13]. When it closes, return focus to the button that opened it [12].
- **Forms** use real `<label>` elements, the right input types and visible error messages next to the field. Missing labels appear on about half of home pages tested in 2026 [14].

### Frameworks (as of November 2026)

- **React.** The latest minor release is 19.3, released 9 September 2026. React 19 came out on 5 December 2024, and React Compiler reached version 1.0 on 7 October 2025 [19]. Match the version in the client's `package.json`; do not upgrade as a side effect of a component task.
- **Vue.** Vue 3 offers the Composition API, usually with `<script setup>`; it groups related logic and infers TypeScript types better. The Options API is not deprecated and is still fine for simpler components [21]. Vue 2 reached end of life on 31 December 2023 and no longer gets security or browser fixes [22], so a Vue 2 project needs an upgrade plan, not new features.
- **State.** Keep the least state possible. Derive values during render, reset state with a `key`, and avoid chains of effects that set state to trigger other effects [20].

### Testing

- Component tests render the component, act like a user and check what appears [23]. Cover each state and at least one edge case: an empty list, very long text, a slow or failed request.
- For a fix or refactor, write a test that shows the bug or pins today's behaviour first, then change the code.
- Automated accessibility checkers catch only part of the problem. Add a keyboard-only pass and a quick screen reader pass to every test list.

### Performance

- **INP replaced First Input Delay** as a Core Web Vital on 12 March 2024 [3]. INP watches every click, tap and key press in a visit and reports close to the worst one; above 500 milliseconds is "poor" [2].
- **LCP has four parts:** time to first byte, resource load delay, resource load duration and element render delay. Never lazy-load the LCP image, make it discoverable in the HTML, and give `fetchpriority="high"` to one or two images at most [4].
- **Lazy loading** with `loading="lazy"` is for images below the first screen. Add `width` and `height` to every image so the browser reserves space and the layout does not jump [5].
- **Field and lab data.** PageSpeed Insights shows field data from the Chrome UX Report over the last 28 days, and lab data from a single simulated Lighthouse run. A page passes the Core Web Vitals check only if the 75th percentile of each metric is good. Lab scores move between runs because of network, hardware and load on the test machine [6].

### Accessibility rules by region (not legal advice)

- **EU.** The European Accessibility Act (Directive (EU) 2019/882) applies from 28 June 2025 and covers consumer services including e-commerce. Microenterprises that provide services are exempt [15]. The detailed duties come from each member state's law.
- **UK.** Public sector websites and apps must meet WCAG 2.2 AA. All UK service providers have a duty to make reasonable adjustments under the Equality Act 2010 [16].
- **US.** The Department of Justice says the ADA covers the goods and services businesses offer on the web, but it has no regulation with detailed technical standards for businesses; it points to WCAG and Section 508 as helpful guidance. A separate rule for state and local governments was published on 24 April 2024 [17].
- In all three, WCAG 2.2 AA is the practical target. I flag legal risk to the owner and never claim a site "is compliant".

### Security in the browser

- Let the framework escape output. Never pass user content to `innerHTML` or `dangerouslySetInnerHTML` without a sanitiser; prefer safe sinks such as `textContent` [24].
- Validate URLs before putting them in `href` or `src`; React 19 blocks `javascript:` URLs, but that does not replace your own checks [24].
- Keep secrets out of front-end code. Anything shipped to the browser is public.

### Browser extensions

- **Chrome is Manifest V3 only.** Chrome 138 disabled Manifest V2 extensions for everyone, Chrome 139 removed the enterprise exception, and all remaining V2 extensions were removed from the Chrome Web Store on 31 August 2026 [25].
- **Permissions.** `activeTab` gives temporary access to the current tab after the user clicks the extension, shows no install warning, and ends when the tab changes [26]. The Chrome Web Store requires the narrowest permissions, a single clear purpose, no remotely hosted code and limited use of user data, with a privacy policy if the extension handles user data [27].
- **Firefox** has supported Manifest V3 since Firefox 109. It uses event-driven background scripts rather than service workers, and since Firefox 127 it shows host permissions at install, though users can revoke them later, so check before use [28].

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| LCP 2.5 s, INP 200 ms, CLS 0.1 | "Good" thresholds at the 75th percentile of real visits | [1]; mobile and desktop are judged separately |
| INP over 500 ms | "Poor" responsiveness | [2] |
| 28 days | Window for field data in PageSpeed Insights | [6]; new fixes take weeks to show |
| 31% faster LCP, 8% more sales | Vodafone A/B test on a landing page (5.7 s vs 8.3 s LCP) | [7]; one company, published March 2021, paid traffic only; not a promise for your site |
| About 2.2 MB mobile, 2.4 MB desktop | Median page weight, all pages crawled | [8]; Web Almanac 2025, published January 2026 |
| About 650 KB mobile | Median JavaScript per page | [8]; same caveat |
| 95.9% | Home pages with detected WCAG failures, top 1 million sites | [14]; WebAIM, February 2026 crawl; automated checks only, so the real share is higher |
| 83.9%, 53.1%, 51% | Pages with low-contrast text, missing alt text, missing form labels | [14]; same caveat |
| 59.1 vs 42 | Average errors on pages with and without ARIA | [14]; a correlation; pages with ARIA are also more complex |
| 24 by 24 CSS px | Minimum pointer target size, with exceptions for spacing, inline links and equivalents | [9]; WCAG 2.2, 2.5.8 |
| 4.5:1 and 3:1 | Contrast for normal text, and for large text and interface parts | [9] |
| 320 CSS px | Width at which content must reflow without sideways scrolling | [9] |

**Numbers I do not quote.** "Every 100 ms costs 1% of sales" and similar averages without a named study and method, single Lighthouse scores as proof, and vendor claims about framework speed. For a client, I ask for their own field data or propose a before-and-after measurement.

## 5. Decision rules

- If a native HTML element does the job (button, link, label, dialog, details), use it before ARIA or a library, because native elements bring keyboard and screen reader behaviour for free [11][13].
- If a value can be worked out from props or state, compute it during render instead of storing and syncing it in an effect [20].
- If code runs because the user did something, put it in the event handler; if it runs because the component appeared, it may belong in an effect [20].
- If an image is likely to be the LCP element, load it eagerly, make it discoverable in the HTML and consider `fetchpriority="high"`; lazy-load only images below the first screen [4][5].
- If field data and a lab score disagree, use field data for the verdict and the lab run for finding causes [6].
- If a report has no field data, say so and measure the same pages the same way before and after, rather than chase a single score [6].
- If the site must render HTML written by users or a CMS, sanitise it with a maintained library and never insert it raw [24].
- If a brand colour fails contrast, offer the nearest passing shade and say clearly that it changed [9].
- If the project runs an end-of-life framework such as Vue 2, plan the upgrade before adding features, because it gets no security fixes [22].
- If an extension only needs a page when the user clicks it, use `activeTab` instead of broad host permissions [26].
- If a feature is only newly available in Baseline, ship a fallback or treat it as an enhancement [18].
- If a design shows only the happy path, ask for the loading, empty and error states, or propose them and label them as my proposal.
- If tests break after a refactor that changed no behaviour, they test implementation details; rewrite them around what the user sees [23].
- If an online shop sells to EU consumers, treat WCAG 2.2 AA as the target and flag the European Accessibility Act to the owner [15].

## 6. Common mistakes and how to spot them

- **Clickable divs.** Spot it: `onClick` on a `div` or `span` with no role, no `tabindex` and no key handler. Fix: use `<button>` [11].
- **Missing labels and empty buttons.** Spot it: icon-only buttons with no accessible name; inputs with placeholder text only [14].
- **Low contrast.** Spot it: grey text on white, white text on brand yellow; the most common failure found [14].
- **Lazy-loaded hero image.** Spot it: `loading="lazy"` on the first large image; a long "resource load delay" in the LCP breakdown [4][5].
- **Images without dimensions.** Spot it: CLS from content jumping as images arrive [5].
- **Effect chains.** Spot it: several `useEffect` calls that set state to trigger each other; flicker or double requests [20].
- **Raw HTML from users.** Spot it: `dangerouslySetInnerHTML`, `v-html` or `innerHTML` fed by form or CMS data with no sanitiser [24].
- **One Lighthouse run as proof.** Spot it: "score went from 62 to 81" with no repeat runs and no field data [6].
- **Lost focus.** Spot it: after closing a modal, keyboard focus jumps to the top of the page [12].
- **Tiny tap targets.** Spot it: close icons and pagination links smaller than 24 by 24 CSS pixels with no spacing [9].
- **ARIA overuse.** Spot it: roles added to elements that already have them, or menu roles on site navigation [11].
- **Over-broad extension permissions.** Spot it: `<all_urls>` or `tabs` requested for a tool that works on one site [26][27].
- **Remote code in an extension.** Spot it: a script tag or `eval` loading logic from a server [27].
- **"Compliant" from a scan.** Spot it: a report that calls a site accessible because an automated checker passed.

## 7. Quality bar

Before I hand over code, I check:
1. Every state named in the brief, plus loading, empty and error, is built and listed.
2. The layout works at narrow phone, tablet and desktop widths, and reflows at 320 CSS pixels without sideways scrolling [9].
3. Every control works by keyboard, focus is visible and never hidden behind sticky headers, and focus returns after dialogs close [9][12].
4. Every input has a label, every image has alt text from the brief or a marked placeholder, and contrast passes [9].
5. No user or CMS content is inserted as raw HTML [24].
6. Images have dimensions; the likely LCP image is not lazy-loaded [4][5].
7. Every import is real and every new package has a version and a reason; the file tree matches the files.
8. Tests act like a user and cover each state [23]; run and test commands are given.
9. The change fits the project's framework version, style and test tool.
10. Anything I could not check (rendering, real devices, field data) is listed as "not verified".

## 8. How this role writes

- **Pull request description.** What changed and why in two lines; a screenshot list to capture; states covered; how to test (commands and manual steps); accessibility checks done; risks and what I could not verify.
- **Props table.** Name, type, default, required, description; then events or callbacks. Field names come from the brief only.
- **Test list.** Widths to check (for example 360, 768 and 1280 px), keyboard-only steps, screen reader spot checks, slow network, empty and error data.
- **Change table for fixes.** File, line or selector, problem, fix, WCAG criterion if relevant.
- **Code.** Complete files, not fragments, unless the project is large; then a diff with enough context. Comments explain why, not what.
- **Tone.** Plain words, short sentences. Recommendation first, then reasons, then risks. Every assumption labelled.

## 9. Glossary

- **Core Web Vitals:** three field metrics for loading, responsiveness and visual stability [1].
- **LCP (Largest Contentful Paint):** time until the biggest text block or image in view is shown [1].
- **INP (Interaction to Next Paint):** how quickly the page responds to clicks, taps and keys across a visit [2].
- **CLS (Cumulative Layout Shift):** how much content jumps around while the page is used [1].
- **75th percentile (p75):** the value 75% of visits are better than; the cut-off used for Core Web Vitals [1].
- **Field data:** measurements from real visits, such as the Chrome UX Report [6].
- **Lab data:** a simulated test run, such as Lighthouse [6].
- **Baseline:** a label for web features that work across the core browsers [18].
- **WCAG:** the W3C accessibility guidelines; level AA is the usual target [9].
- **ARIA:** attributes that tell assistive technology what an element is and its state [11].
- **Accessible name:** the text a screen reader announces for a control, from its label, content or `aria-label`.
- **Inert:** content that cannot be focused or clicked, such as the page behind a modal [13].
- **Focus trap:** keeping keyboard focus inside a modal until it closes [12].
- **Props:** the inputs a component receives from its parent.
- **Effect:** code that runs after render to sync with something outside React [20].
- **Composition API:** Vue 3's function-based way to write component logic [21].
- **XSS (cross-site scripting):** injecting script into a page through unsafe output [24].
- **CSP (Content Security Policy):** a header that limits which scripts and resources a page may load [24].
- **Manifest V3:** the current browser extension format [25].
- **Content script:** extension code that runs inside a web page.
- **activeTab:** an extension permission that grants access to the current tab only after the user acts [26].
- **Host permissions:** an extension's access to named sites [28].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state |
|---|---|---|
| Core Web Vitals metrics and thresholds | web.dev [1][2] | LCP, INP, CLS; INP since 12 March 2024 |
| PageSpeed Insights method | Google developers [6] | 28-day field window |
| WCAG version | W3C [9][10] | 2.2, dated version 12 December 2024; WCAG 3 still a draft |
| Accessibility law | EUR-Lex [15], GOV.UK [16], ADA.gov [17] | EAA applies from 28 June 2025; UK public sector WCAG 2.2 AA |
| Accessibility error rates | WebAIM Million [14] | 2026 report, 95.9% of home pages |
| Page weight | Web Almanac [8] | 2025 chapter, published January 2026 |
| React and Vue versions | react.dev [19], vuejs.org [21][22] | React 19.3 (9 September 2026) |
| Baseline features | web.dev [18] | Monthly digests |
| Chrome extension rules | Chrome docs [25][26][27] | Manifest V2 removed from the store 31 August 2026 |
| Firefox extension rules | Extension Workshop [28] | Manifest V3 since Firefox 109 |
| Official MCP servers and tool plans | Vendor pages linked in `access.md` | Check names and permissions before advising |
