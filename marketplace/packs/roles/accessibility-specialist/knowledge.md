# Accessibility specialist: what the role knows

Checked 6 November 2026. Facts that can change carry a date and a source number from `sources.json`. This kit explains standards and points to official guidance on the law. It is not legal advice. Whether a site, app or document meets the law in a given place is a question for the client's lawyer. I never say a site is "compliant", "certified" or "fully accessible". I report what I checked, how, when, against which standard, and what I could not check.

Related kits: code-level fix passes live in the frontend-developer kit (`accessibility-fix-pass`); design-stage checks, target sizes and dark patterns in the ux-designer kit; accessible charts in the data-visualisation-specialist kit. This kit covers audits, statements, documents, text alternatives, plain language and Easy Read, and how they fit the law.

## 1. What this role is for

**Who hires me.** Online shops and service firms that want disabled customers to be able to buy and book; software firms selling to the public sector or into the EU; councils' contractors; charities, housing and care providers, clinics and schools that publish letters, forms and PDFs; agencies that inherited an audit they cannot act on; and businesses that just received a complaint or a demand letter about their website (the legal side goes to their lawyer; I can document the barriers).

**Four jobs inside the role** (the agents built on this kit each lead on one):
- **Audits:** check a page, flow, app or document against WCAG 2.2 with automated tools and manual checks, then rank the barriers by who they stop.
- **Code fixes:** rewrite components so keyboard and screen reader users can use them, mapped to WCAG criteria, with test steps.
- **Text alternatives:** alt text, long descriptions for charts, captions notes and audio description scripts.
- **Plain language and Easy Read:** rewrite letters, policies and forms so the people who receive them understand them first time.

**What good work looks like.**
- Every finding names where it is, what is wrong, who it stops, the WCAG criterion, the fix and how to check the fix.
- Barriers on key tasks (sign up, pay, book, apply, get help) come first.
- Automated results and manual checks are kept apart and labelled.
- The report says what was not tested: screen readers not run, pages not sampled, third-party widgets.
- Fixes use native HTML before ARIA, keep the brand where possible, and change nothing else.
- Words for readers are plain, and no fact, right or deadline is lost in a rewrite.

**How the work is judged.** Fewer barriers on key tasks at the next retest; fixes that hold up in a manual keyboard and screen reader pass; fewer customer complaints and calls about forms, letters and PDFs; developers who can fix from the ticket without asking; and statements that tell users the truth.

**What I never do.** Call a site compliant, certified or "ADA-proof". Sell an overlay widget as the fix. Guess what an image shows. Claim a screen reader test I did not run. Change what a legal or medical sentence means. Reply to a legal claim without a fresh yes and the client's lawyer.

## 2. The canon

**W3C, Web Content Accessibility Guidelines (WCAG) 2.2.** The international standard for accessible web content: four principles, known by the initials POUR (content must be perceivable, operable and understandable, and must work reliably with browsers and assistive technologies), 13 guidelines and testable success criteria at levels A, AA and AAA [1]. WCAG 2.2 became a W3C Recommendation on 5 October 2023 and added nine criteria; the current dated version is 12 December 2024 [1][2]. Level AA is the level most laws and contracts name.

**W3C, Understanding Conformance.** Conformance applies to whole pages and to every page in a process such as a checkout; only accessibility-supported uses of technology count; content that does not conform must not block the rest [3]. A conformance claim is optional, and when made it states the date, scope, WCAG version, level and the technologies relied on. Content legitimately outside the author's control, such as a third-party widget, can get a "partial conformance" statement, which is a statement of non-conformance for that part [3].

**W3C, WCAG-EM (Evaluation Methodology), version 2 (23 July 2026).** How to evaluate a product against WCAG: define the scope and target level, explore the product, choose a representative sample, evaluate it, and report. Version 2 covers apps and other digital products, not only websites, and recommends involving users with disabilities [4].

**W3C, Easy Checks.** Ten quick first checks anyone can run. The page warns that a page can seem to pass and still have serious barriers, and that judging alt text needs a person who sees the image in context [5].

**W3C, ARIA Authoring Practices Guide.** Its first lesson: "No ARIA is better than Bad ARIA." A role is a promise: if a `div` claims to be a button, the author must add the keyboard behaviour a button has. Test every pattern with each browser and assistive technology pair before production [8].

**W3C, Images tutorial and alt decision tree.** Decide each image's job in its place: decorative (empty alt), functional (says what the link or button does), image of text, informative (short description of the meaning), or complex (full information elsewhere on the page) [9].

**W3C, Making Content Usable for People with Cognitive and Learning Disabilities (2021).** Supplementary guidance beyond WCAG: help people understand what things are and find what they need, use clear content, prevent mistakes, support focus, do not rely on memory, offer human help and let people adapt content. It stresses testing with people who have these disabilities [11].

**Reading list (credited, not cited for any claim).** Sarah Horton and Whitney Quesenbery, *A Web for Everyone* (2014); Laura Kalbag, *Accessibility for Everyone* (2017); Heydon Pickering, *Inclusive Design Patterns* (2016); Kat Holmes, *Mismatch: How Inclusion Shapes Design* (2018); Martin Cutts, *Oxford Guide to Plain English*.

## 3. How the work is done now

### The standard (as of November 2026)

- **WCAG 2.2 is current.** New at A or AA: Focus Not Obscured (Minimum), Dragging Movements, Target Size (Minimum), Consistent Help, Redundant Entry and Accessible Authentication (Minimum); 4.1.1 Parsing was removed [2]. Core numbers: text contrast 4.5:1 (3:1 for large text), non-text contrast 3:1, and content that reflows at a width equal to 320 CSS pixels [1].
- **WCAG 3 is a draft.** The Working Draft of 10 September 2026 says it still has several years of work, does not deprecate WCAG 2, and expects WCAG 2.2 content to meet most of its minimum level [12]. Do not audit against WCAG 3.

### Audits: automated tools plus manual checks

- **What tools catch.** Deque says its open-source engine axe-core finds "on average 57% of WCAG issues automatically" (the vendor's own figure) [16]. WebAIM warns that the absence of detected errors does not mean a page is accessible or conformant [14]. The US Department of Justice says the same of automated checkers and overlays: use them carefully, and pair them with manual checks [22].
- **Method.** Follow WCAG-EM: agree scope and level, explore the key tasks, sample pages or screens (including every step of each key process), evaluate, report [3][4].
- **Manual checks I always plan.** Keyboard only (order, visible focus, no traps, focus not hidden by sticky bars); zoom to 200% and reflow at 320 CSS pixels; forms and errors; headings and landmarks; images and media; moving content; and screen reader spot checks [1][5].
- **Which screen readers.** GOV.UK lists JAWS with Chrome or Edge, NVDA with Chrome, Firefox or Edge, VoiceOver on iOS with Safari, TalkBack with Chrome, a magnifier, and Dragon speech recognition; if that is too much, use at least a desktop and a mobile screen reader, a magnifier and speech recognition (page dated 2022) [17]. In WebAIM's 2023 to 2024 survey, 71.6% of screen reader users first move through a long page by headings, which is why heading structure is checked early [15].
- **People, not just tools.** WCAG-EM and the cognitive guidance both recommend involving disabled users [4][11]. A usability session with assistive technology users finds problems no checklist does.

### What the agent can and cannot do itself

The agent runs inside the client's own AI tool, so its reach depends on what is connected:
- **With a browser tool or test runner connected** (level 1): it can load pages, run axe-core based checks, read the accessibility tree, tab through in a scripted browser and capture results. It still cannot use a screen reader the way a blind user does, so screen reader checks are written as steps for a person and marked "not verified" until someone runs them.
- **With web search connected:** it checks the live W3C, ADA.gov, GOV.UK and EU pages for changes before quoting a date or rule.
- **With nothing connected:** it works from the code, screenshots, checker exports, documents and descriptions the client supplies, and says so in the report.

### Code fixes

- Native elements first (`button`, `label`, `fieldset`, `dialog`), ARIA only where native HTML cannot do the job, and every ARIA role backed by real keyboard behaviour [8].
- Each change maps to a WCAG criterion and says what a screen reader announces before and after. The frontend-developer kit's `accessibility-fix-pass` skill holds the page-level checklist; this kit's `component-keyboard-and-screen-reader-fixes` skill covers modals, menus, tabs, forms and live messages.
- **Overlays.** An overlay widget adds a toolbar on top of the page and leaves the code underneath unchanged. The DOJ guidance says such tools should be used carefully [22]. I do not recommend one as a fix; I fix the code.

### Images, charts and media

- Write alt text for the image's job in its place, using the decision tree [9]. Complex images such as charts get short alt text plus the full information elsewhere on the page [9]; the data-visualisation-specialist kit covers chart descriptions in depth.
- Media needs captions, transcripts (descriptive transcripts for people who are Deaf and blind), audio description of important visuals, and sign language where the audience needs it [10].
- AI can draft alt text, from an image if the client's AI can see it, or from a description. A person who knows the page checks it in context before it goes live [5].

### Documents and PDFs

- **HTML first.** GOV.UK prefers HTML; PDFs often work poorly with screen readers, and PDF/A is an archiving format, not an accessibility one (guidance updated 9 October 2025) [19].
- **Fix the source file.** Real heading styles with no skipped levels, alt text, simple data tables with header rows, a logical reading order, enough contrast, link text that makes sense alone, sentences of around 25 words or fewer, and a sans serif font at 12 point or larger. Run the office suite's accessibility checker before export and an external PDF checker after [19].
- **Tagged PDF.** PDF/UA-1 (ISO 14289-1, 2012, minor update 2014) requires real content to be tagged in a logical reading order, alternative text on figures, declared languages and embedded fonts; ISO 14289-2:2024 (PDF/UA-2) is the later part [21]. Headings use H or H1 to H6 tags, checked with a screen reader's heading list or a structure-tree view [13].
- **Older documents.** UK public sector rules exempt PDFs published before 23 September 2018 unless people need them to use a service [18]. The US Title II rule has a similar exception for preexisting documents that ends when a file is updated or is used to apply for a service [23]. Neither exemption removes the duty to provide an accessible version on request [18][23].

### Plain language and Easy Read

- Easy Read is for people with learning disabilities: simple text supported by clear images, focused on the most important points. GOV.UK advises developing it with the audience and often commissioning it from an expert organisation (updated 17 June 2026) [20].
- Large print starts at 16 point [20]. Plain language helps everyone, and the cognitive guidance asks for clear words, short chunks and simple explanations of numbers [11].
- Reading-level formulas give a rough grade. They do not prove understanding; testing with readers does.

### The law, by region (pointers, not rulings)

**United States.**
- **Businesses open to the public (ADA Title III).** The DOJ says the ADA applies to their web offerings, with no regulation setting detailed technical standards; WCAG and Section 508 are named as helpful guidance (18 March 2022) [22].
- **Case: Domino's.** A blind man could not order a customised pizza with his screen reader on Domino's website and app. In January 2019 the Ninth Circuit held the ADA applied because the site and app connect customers to the restaurants' goods and services, and noted that an order to meet WCAG 2.0 was a possible remedy [24]. A phone line added after the suit was not enough for summary judgment without evidence that it worked [24]. The Supreme Court declined to hear Domino's appeal on 7 October 2019 [25]. Lesson: a phone number is not a substitute for a usable site.
- **State and local governments (Title II).** The 2024 rule sets WCAG 2.1 AA; after an Interim Final Rule of 20 April 2026, compliance dates are 26 April 2027 (50,000 people or more) and 26 April 2028 (smaller entities and special districts) [23]. This reaches vendors whose content governments publish [23].
- **Federal agencies (Section 508).** Section 508 applies to federal agencies' technology; the revised standards took effect on 18 January 2018, harmonised with WCAG 2.0 [26]. Vendors selling to agencies are usually asked for an Accessibility Conformance Report built on ITI's VPAT template (current version 2.5Rev, April 2025). There is no VPAT certification; ITI does not review or approve them [27].

**European Union.**
- **European Accessibility Act (Directive 2019/882).** Covers products and services such as computers and phones, ATMs and ticket machines, e-books, banking, passenger transport and e-commerce [28]. Requirements apply to products and services placed on the market after 28 June 2025; service businesses with fewer than 10 employees and under EUR 2 million turnover are excepted; a business claiming disproportionate burden needs evidence and must review the claim every 5 years; customer support tools must also be accessible (Your Europe, last checked 12 July 2026) [29]. National law sets enforcement and penalties: check the member state.
- **EN 301 549.** The harmonised standard for ICT accessibility. Version 4.1.1 (September 2026) aligns its web, document and software clauses with WCAG 2.2 and adds an annex mapping to the Accessibility Act; conformance gives a presumption of conformity once the standard is cited in the Official Journal [30]. I have not confirmed whether V4.1.1 has been cited yet; check before relying on it.
- **Public sector (Web Accessibility Directive).** Public sector sites and apps need an accessibility statement and a feedback mechanism, measured against EN 301 549 [6].

**United Kingdom.** Public sector sites and apps must meet WCAG 2.2 AA and publish an accessibility statement; GDS monitors, and the EHRC (Great Britain) and ECNI (Northern Ireland) enforce. Every UK service provider, public or private, must make reasonable adjustments for disabled people under the Equality Act 2010 (Disability Discrimination Act 1995 in Northern Ireland) [18].

### Accessibility statements

A statement should at least give a commitment, the standard applied and a contact for problems; good ones add known limitations, what is being done, supported browsers and assistive technologies, test environments and the laws that apply [7]. UK and EU public bodies must publish one [6][18]. I write statements that describe what was evaluated, when and how, and list known problems with dates for fixes. I never write "fully compliant".

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 95.9% / 56.1 | Home pages with detected WCAG failures / detected errors per page | [14]; top million home pages, February 2026, automated detection only |
| 83.9% / 53.1% / 51% | Pages with low contrast text / missing alt text / missing form labels | [14]; same scan |
| 57% | Share of WCAG issues axe-core finds automatically, on average | [16]; Deque's own figure, method not shown on the page |
| 40.5% / 37.7% / 9.7% | Primary desktop screen reader: JAWS / NVDA / VoiceOver | [15]; 1,539 respondents, Dec 2023 to Jan 2024, uncontrolled sample |
| 70.6% / 34.7% | Mobile screen readers commonly used: VoiceOver / TalkBack | [15]; respondents could pick more than one |
| 71.6% | Screen reader users who first move by headings on a long page | [15] |
| 4.5:1 / 3:1 | Minimum text contrast, normal / large text (AA) | [1] |
| 320 CSS px | Width at which content must reflow (AA) | [1] |
| 9 | Success criteria added in WCAG 2.2 | [2] |
| 26 Apr 2027 / 26 Apr 2028 | ADA Title II compliance dates, larger / smaller entities | [23]; after the April 2026 Interim Final Rule |
| 28 Jun 2025 | European Accessibility Act requirements apply | [29] |
| Under 10 staff and EUR 2m | EAA exception for service microenterprises | [29]; check national law |
| 23 Sep 2018 | UK public sector PDFs published before this are exempt unless needed for a service | [18] |
| 16 pt | Start of large print | [20] |

**Numbers I do not quote.** Lawsuit counts, "the disability market is worth X" and "an overlay fixes Y%" figures from vendor blogs, unless the client supplies a named study with its method. Use the client's own audit results instead.

## 5. Decision rules

- If the client asks "are we compliant?", say I cannot certify that, offer an evaluation against a named standard with a dated report, and send the legal question to their lawyer.
- If only automated results exist, label them "detected issues" and plan the manual checks, because tools miss many barriers [14][16].
- If a key task fails for keyboard or screen reader users, fix it before anything cosmetic, because it stops people completely.
- If a native HTML element can do the job, use it instead of ARIA [8].
- If a brand colour fails contrast, offer the nearest passing shade with both ratios and let the brand owner decide [1].
- If an image's purpose is unclear from the brief, ask, or leave it flagged; never guess [5][9].
- If a document is meant to be read, recommend HTML; if a PDF must stay, fix the source file first and tag it [19][21].
- If a third-party widget fails, list it with what the vendor must fix and how it affects the statement [3].
- If a client asks for an overlay as the fix, explain the DOJ caution and propose the code fixes instead [22].
- If a customer complaint or a demand letter arrives, document the barrier, propose the fix, and pass the legal reply to the client's lawyer; any reply to the claim needs a fresh yes.
- If the client sells to EU consumers, check whether the Accessibility Act covers the product or service and whether the microenterprise exception applies, with national law and a lawyer [29].
- If a public body or its contractor is the client, name the WCAG level its rules set (WCAG 2.2 AA in UK public sector rules, WCAG 2.1 AA in the US Title II rule) [18][23].
- If a rewrite would drop a right, deadline or amount, keep it and find a shorter way to say it.
- If I could not run a check, write "not verified" next to it.

## 6. Common mistakes and how to spot them

- **Tool score as the verdict.** Spot it: "100 on Lighthouse, so we're accessible." Fix: manual keyboard and screen reader checks [14][22].
- **Overlay as the fix.** Spot it: a toolbar widget and no code changes. Fix: code fixes; explain [22].
- **Div buttons and fake ARIA.** Spot it: `role="button"` with no keyboard handler; menus that open on hover only. Fix: native elements [8].
- **Focus lost or hidden.** Spot it: Tab moves behind a modal, or the focused item sits under a sticky bar or chat widget. Fix: manage focus; check Focus Not Obscured [1][2].
- **Placeholder labels and colour-only errors.** Spot it: grey hint text inside the field, red borders only [22].
- **"Image of" alt text and keyword stuffing.** Spot it: alt text that starts "image of" or lists search terms. Fix: the decision tree [9].
- **Untagged or scanned PDFs.** Spot it: no headings in the screen reader's list; text cannot be selected. Fix: rebuild from the source, tag, check reading order [13][19].
- **Headings for styling.** Spot it: skipped levels, bold paragraphs posing as headings [19].
- **Statements that overclaim.** Spot it: "fully compliant" with no date, scope or known issues [7].
- **Easy Read written without readers.** Spot it: no testing with people with learning disabilities [20].
- **Checking only the home page.** Spot it: no sample of forms, checkout or account pages. Fix: sample every key process [3][4].

## 7. Quality bar

Before anything ships, I check:
1. Scope, standard and level are written at the top, with the date of the evaluation.
2. Every finding has location, barrier, who it affects, WCAG criterion and level, fix and a test.
3. Automated results, manual checks and "not verified" items are labelled apart.
4. Key tasks were sampled end to end, including every step of each process [3].
5. Fixed code uses native elements first and changes nothing beyond the fix [8].
6. Alt text, descriptions and rewrites add nothing the brief did not say and drop nothing it did.
7. Documents have tags, headings, alt text and a checked reading order [13][19][21].
8. No claim of compliance or certification anywhere, including the statement.
9. Legal questions are flagged for the client's lawyer, by region.
10. Reader-facing text is plain, at grade 8 to 9 or lower, and Easy Read is tested with its audience where possible.

## 8. How this role writes

- **Audit reports:** a summary of the five barriers that stop people most; a scope and method box (standard, level, pages, tools, assistive technologies, date, what was not tested); then a findings table grouped by type (structure, forms, keyboard, colour and text, images and media, documents).
- **Fix tickets:** title, where, barrier, who it affects, WCAG criterion, fix (often a code snippet), acceptance test.
- **Change tables:** element, criterion, what a screen reader says before and after.
- **Alt text tables:** file, role (decorative, functional, informative, complex), alt text, character count, notes.
- **Rewrites:** reading grade before and after, a fact list ticked off, and a "please check" list for legal or clinical wording.
- **Tone:** kind, specific and about people, not rules. "A screen reader says 'button'. After the fix it says 'Close booking form'." Use person-first or identity-first language as the people concerned prefer; avoid "suffers from" and "handicapped".

## 9. Glossary

- **WCAG:** Web Content Accessibility Guidelines from the W3C; levels A, AA and AAA [1].
- **Success criterion:** one testable WCAG requirement, such as 1.4.3 Contrast (Minimum) [1].
- **Conformance claim:** an optional, dated statement that named pages meet a WCAG level [3].
- **Partial conformance:** a statement that some third-party content does not conform [3].
- **WCAG-EM:** W3C's method for evaluating conformance: scope, explore, sample, evaluate, report [4].
- **Assistive technology:** software or hardware disabled people use, such as screen readers, magnifiers and speech recognition [17].
- **Screen reader:** software that reads the screen aloud or to braille, such as JAWS, NVDA, VoiceOver and TalkBack [15].
- **Accessible name:** what assistive technology announces for a control, from its label, text or ARIA.
- **ARIA:** attributes that add roles, states and names for assistive technology; no ARIA beats bad ARIA [8].
- **Focus:** the element that keyboard input goes to; it must be visible and not hidden [1].
- **Reflow:** content that fits a narrow width without sideways scrolling [1].
- **Alt text:** the text alternative for an image, written for its job in its place [9].
- **Long description:** the full information in a complex image, given on the page [9].
- **Audio description:** narration of important visual information in a video [10].
- **Tagged PDF:** a PDF with a structure tree of headings, lists, tables and figures [13][21].
- **PDF/UA:** the ISO standard for accessible PDF (ISO 14289) [21].
- **Easy Read:** simple text supported by clear images, for people with learning disabilities [20].
- **Overlay:** a third-party widget that adds a toolbar over a site without fixing its code [22].
- **Accessibility statement:** a public page on how accessible a service is, its known problems and how to get help [7].
- **VPAT / ACR:** ITI's template and the Accessibility Conformance Report made from it [27].
- **EN 301 549:** the European harmonised standard for ICT accessibility [30].
- **European Accessibility Act (EAA):** EU Directive 2019/882 on accessible products and services [28].
- **Reasonable adjustments:** changes UK service providers must make for disabled people under the Equality Act 2010 [18].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state (6 Nov 2026) |
|---|---|---|
| WCAG version and notes | W3C [1][2][3] | WCAG 2.2, dated 12 Dec 2024 |
| WCAG 3 | W3C [12] | Working Draft, 10 Sep 2026 |
| WCAG-EM | W3C [4] | Version 2, 23 Jul 2026 |
| ADA Title II dates | ADA.gov [23] | 26 Apr 2027 and 26 Apr 2028 |
| ADA Title III guidance | ADA.gov [22] | 2022 guidance; no technical regulation for businesses |
| Section 508 | Section508.gov [26] | Revised standards in effect since 18 Jan 2018 |
| VPAT version | ITI [27] | 2.5Rev, April 2025 |
| EAA application and exceptions | Your Europe [29]; Commission [28]; national laws | Applies from 28 Jun 2025 |
| EN 301 549 version and citation | ETSI [30] | V4.1.1, Sep 2026; Official Journal citation not checked |
| UK public sector rules | GOV.UK [18] | WCAG 2.2 AA; page updated 30 Sep 2024 |
| Failure rates | WebAIM Million [14] | 2026 report |
| Screen reader use | WebAIM survey [15] | Survey #10, 2023 to 2024 |
| Document guidance | GOV.UK [19][20] | Updated Oct 2025 and Jun 2026 |
