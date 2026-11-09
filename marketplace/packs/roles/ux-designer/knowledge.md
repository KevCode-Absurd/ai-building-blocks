# UX designer: what the role knows

Checked 6 November 2026. Facts that can change carry a date and a source number from `sources.json`. Accessibility law is pointed to, not ruled on: whether a site or app meets the law in a given place is a question for the client's lawyer. I say what the standard asks and where the official page is.

## 1. What this role is for

**Who hires me.** Founders briefing a freelance developer, small product teams with no designer, agencies, nonprofits, schools and service firms whose website grew without a plan. The person asking usually knows something is wrong ("people can't find the prices", "sign-ups drop at step three", "support gets the same question every day") but not why.

**The four jobs inside the role.**
- **Information architecture:** page trees, menus, labels and the paths between pages, so visitors find things on the first try.
- **Interaction design:** screen lists, flow maps and text wireframes with every state (empty, loading, error, success), so a build starts without guesswork.
- **UX writing:** buttons, labels, hints, errors, empty states and onboarding text that keep people moving.
- **Research and review:** heuristic reviews, usability test plans, reading session notes and turning findings into a fix list.

**What good work looks like.**
- It starts from what people come to do, ranked by how often and how much it matters, not from the org chart.
- Every screen has one main job and one main action, and every state is written down.
- Words match the words users use; the same thing has the same name everywhere.
- Claims about behaviour come from watching real people, or are clearly marked as a reviewer's judgement.
- Accessibility is built in from the first sketch, not bolted on at the end.

**How the work is judged.** Task success (did people finish?), time and errors on key tasks, findability in a tree test, fewer support contacts about the same problem, accessibility checks passed, and how fast a developer could build from the spec without coming back with questions.

## 2. The canon

**Jakob Nielsen and Rolf Molich, the usability heuristics (1990; Nielsen's list of ten, 1994, page updated January 2024).** Ten broad rules for reviewing an interface: show system status, match the real world, give users control and freedom, be consistent, prevent errors, prefer recognition over recall, allow shortcuts for experts, keep design minimal, help people recover from errors, and give help when needed [1]. They are a checklist for a reviewer's eyes, not a substitute for watching users.

**Nielsen, severity ratings (1994).** Rate each problem by how often it happens, how badly it hurts when it does, and whether people keep hitting it; market impact also counts. The scale runs from 0 (not a problem) to 4 (catastrophe, fix before release) [2]. Severity is what turns a long list into a fix order.

**Nielsen, test with five users (2000).** Under a model where one user finds about a third of the problems, five users find most of them, so the best use of a budget is several small rounds with fixes in between, not one big study. With two very different user groups, test three or four of each [3]. The same article warns that quantitative studies need more people.

**Nielsen, thinking aloud (2012).** Ask people to say what they are thinking while they use the design, then stay quiet. It is cheap, works at any stage from paper to live product and persuades sceptical teams. Its limits: no reliable statistics from small samples, it feels unnatural, and a facilitator's prompts can change what people do [4].

**Steve Krug, *Don't Make Me Think, Revisited* (third edition, 2014).** Krug wrote it because usability work is valuable and much of it is not hard, so more people should be doing it. Pages should be obvious at a glance; if users have to stop and puzzle, the design has failed. The third edition carries the ideas beyond websites to apps and other things people use [9].

**Card sorting and tree testing (Nielsen Norman Group: Tankala and Sherwin, 2024; Laubheimer, 2023, reviewed 2026).** Card sorting is generative: people group and name content to show how they think about it. Open sorts are the most common. Tree testing is evaluative: people use a text-only menu to find where an answer lives, and you measure success, directness and time [5][6]. Sort first to get ideas, tree test to check the structure you chose.

**Error messages (Neusesser and Sunwall, 2023; GOV.UK Design System).** Put the message next to the problem, never rely on colour alone, name the specific problem in plain words, say how to fix it, never blame, skip the jokes, and keep what the user typed [7]. GOV.UK adds: use the same words in the error summary and next to the field, and avoid "invalid", "please", "sorry" and "oops" [23].

**GOV.UK, writing for user interfaces (2018).** Use the user's own words, start with less text and add help only when research shows it is needed, put the important words first, make link text make sense on its own, and "aim to be boring" [22].

**John Brooke, the System Usability Scale (1986), as documented by Jeff Sauro.** A ten-item questionnaire scored from 0 to 100. Across about 500 studies the average is about 68. A score is a percentile rank, not a percentage, and small samples need a confidence interval [10].

**W3C, Web Content Accessibility Guidelines (WCAG) 2.2.** The international standard for accessible web content, organised into success criteria at levels A, AA and AAA [11][12]. Level AA is the level laws and contracts usually name.

**Rosala and Moran on synthetic users (2024).** AI-generated "users" are fine for desk research, piloting an interview guide or listing hypotheses. They idealise behaviour, give shallow answers and cannot validate a concept. Use them to prepare for research, never instead of it [8].

## 3. How the work is done now

### Research and review

- **Small, repeated rounds.** Plan rounds of about five people from one user group, fix what you find, test again [3]. The GOV.UK Service Manual's practical limits still hold: recruit real or likely users, write realistic tasks that do not hint at the answer, have a note-taker, and run no more than six one-hour sessions a day with at least 15 minutes between them (page last updated 2017) [21].
- **Think-aloud is the default method** for moderated tests [4]. Remote sessions over video calls work for most screen-based products.
- **Unmoderated tools** run tree tests, card sorts, first-click tests and prototype tests without a facilitator. Vendors, plans and limits change often; the ones I checked on 6 November 2026 are listed in `access.md` with links to their own pages.
- **A review is not a test.** A heuristic review finds likely problems quickly [1][2]; only watching people shows what they actually do.

### Information architecture

- Start from the top visitor tasks, group pages by task, keep labels in visitors' words, then check with a tree test before building [6].
- Card sort sizes from Nielsen Norman Group (2024): at least 15 people for a qualitative open sort, 30 to 50 for a quantitative one, and 30 to 50 cards; more cards tire people out [5].
- Tree test tasks: short scenarios, no label words that give the answer away, a warm-up task, and a correct answer defined for each task [6].

### Interaction design and wireframes

- Text wireframes (zones, components, exact words, states and actions, written as a spec) are a fast way for a small team to agree a build before anyone opens a design tool.
- Touch targets: WCAG 2.2 sets a minimum of 24 by 24 CSS pixels for pointer targets, with exceptions for spacing, inline links and a few others [13]. Platform guides ask for more: Apple recommends at least 44 by 44 points [24]; Android recommends at least 48 by 48 dp [25]. Design to the platform guide; treat 24 pixels as the floor.
- Sign-in flows: WCAG 2.2's Accessible Authentication (Minimum) means no memory or puzzle test at sign-in unless there is an alternative or a helper such as a password manager or paste [14]. Do not block paste in password fields.
- Forms: WCAG 2.2 added Redundant Entry (do not make people type the same information twice in one process) and Consistent Help (put help in the same place on each page) [12].

### UX writing

- Microcopy follows the error and interface writing guidance above [7][22][23]: front-loaded, specific, no blame, and the same term for the same thing everywhere.
- Buttons name the result ("Save changes", "Pay £24.00"), not the mechanism ("Submit").

### Accessibility: the standard and the law (pointers, not rulings)

- **The standard.** WCAG 2.2 became a W3C Recommendation on 5 October 2023; the current dated version is 12 December 2024 [11][12]. It added nine success criteria, six at A or AA: Focus Not Obscured (Minimum), Dragging Movements, Target Size (Minimum), Consistent Help, Redundant Entry and Accessible Authentication (Minimum). It removed 4.1.1 Parsing [12].
- **United States.** The Department of Justice says the ADA applies to the web offerings of businesses open to the public, and that there is no regulation setting detailed technical standards for them; it names WCAG and the Section 508 standards as helpful guidance (guidance dated 18 March 2022) [17]. For state and local governments, a 2024 rule sets WCAG 2.1 Level AA; an Interim Final Rule on 20 April 2026 moved the compliance dates to 26 April 2027 for entities serving 50,000 people or more and 26 April 2028 for smaller ones and special districts [18].
- **European Union.** The European Accessibility Act's requirements apply from 28 June 2025 to products and services including e-commerce, online banking, transport websites and apps, and e-books [19]. Each member state's own law sets the detail, exemptions and enforcement. Point the client to their national rules and a lawyer.
- **United Kingdom.** Public sector websites and apps must meet WCAG 2.2 AA and publish an accessibility statement. Private service providers fall outside those regulations, but every UK service provider must make reasonable adjustments for disabled people under the Equality Act 2010 [20].
- **The real picture.** WebAIM's scan of one million home pages (February 2026 data) found detected WCAG failures on 95.9% of them, averaging 56.1 errors per page. Low-contrast text was the most common failure, then missing alt text and missing form labels [16]. Automated scans miss a lot; W3C's Easy Checks note that a page can pass quick checks and still have serious barriers [15].

### Deceptive design ("dark patterns")

- **EU:** the Commission's Digital Services Act page lists a ban on deceptive design such as aggressive pop-ups and confusing or misleading consent buttons on online platforms (page updated 1 October 2026) [26]. A Digital Fairness Act aimed at dark patterns, addictive design and unfair personalisation was still "under preparation" when checked on 6 November 2026 [27].
- **US:** the FTC's 2022 staff report named four tactics: disguised ads, hard-to-cancel subscriptions, buried terms and junk fees, and tricking people into sharing data [28].
- **UK:** I have not checked a UK source for this kit; ask the client's lawyer about UK consumer protection rules.
- My rule everywhere: no hidden cancel buttons, no pre-ticked consent, no fake urgency, no confirm-shaming. Flag them; do not design them.

### AI in UX work (as of November 2026)

- **AI drafts, people decide.** AI is useful for first drafts of microcopy, screen lists, test scripts and coding session notes. It is not a source of user evidence: synthetic users idealise behaviour [8].
- **Design tools with AI connectors.** Figma's MCP server lets an AI agent read design context (frames, components, variables) and, in beta, write native content to the canvas; writing outside your own drafts needs a Full seat, and canvas writing is free during the beta and will later be usage-based (Figma Help Center, checked 6 November 2026) [30]. This is what makes level 2 work (drafts in the client's file) possible; see `access.md`.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| About 85% | Share of problems five users find | [3]; a model that assumes one user finds about 31%; holds for one similar user group |
| 3 to 4 per group | Users per group when testing two different groups | [3] |
| About 20 | Users for a quantitative usability study | [3]; for metrics, not for finding problems |
| 15+ / 30 to 50 | Participants for qualitative / quantitative card sorts | [5]; with 30 to 50 cards |
| 0 to 4 | Nielsen severity scale | [2]; a judgement, best done by more than one reviewer |
| 68 | Average SUS score | [10]; about 500 studies; percentile, not percentage |
| 4.5:1 / 3:1 | Minimum contrast for normal / large text (WCAG AA) | [11]; large is 18 pt, or 14 pt bold |
| 24 x 24 CSS px | WCAG 2.2 minimum pointer target (AA) | [13]; five exceptions |
| 44 x 44 pt / 48 x 48 dp | Apple / Android recommended touch targets | [24][25]; platform guidance, not law |
| 95.9% / 56.1 | Home pages with detected WCAG failures / average errors per page | [16]; automated scan, February 2026 data |
| 70.22% | Average documented online cart abandonment | [29]; average of 50 studies, 2006 to 2025 |
| 18% / 17% | US shoppers who left checkout over forced account creation / a long or complicated checkout | [29]; excludes those "just browsing"; sample and year not shown on the page |
| 6 a day | Most one-hour moderated sessions to run in a day | [21]; GOV.UK practice, 2017 |

**Numbers I do not quote.** "Every $1 in UX returns $100", "users decide in 50 milliseconds" and similar figures circulate without a traceable method. Use the client's own analytics, or a named study with its date and sample, or say there is no reliable figure.

## 5. Decision rules

- If the client asks "what do users think?", ask what users need to do and test that, because people are poor at predicting their own behaviour and think-aloud shows what they actually do [4].
- If there is budget for one study of many people, split it into small rounds with fixes between, because later rounds check the fixes and find deeper problems [3].
- If two user groups behave very differently (buyers and sellers, patients and staff), recruit each separately [3].
- If the team argues about the menu, run a tree test on the options instead of voting, because success and directness settle it with evidence [6].
- If you have no idea how people group the content, run an open card sort first; if you already have a structure, tree test it [5][6].
- If a screen has two main actions, split the screen or make one clearly secondary, and write down why.
- If a field can fail, write its error message in the same pass as the field label, using the same words as the question [23].
- If a sign-in step asks people to remember or transcribe something, offer an alternative or allow paste and password managers [14].
- If a target is smaller than the platform guide, enlarge it or space it out; never go below the WCAG minimum without a listed exception [13][24][25].
- If a client asks for a hidden cancel path, pre-ticked consent or fake countdown, explain the risk, point to [26][27][28], and propose an honest version.
- If findings come from a review, label them "likely problems" and plan a test; if they come from sessions, say how many people hit each one.
- If AI produced the persona, quote or finding, label it as AI-generated and treat it as a hypothesis [8].
- If a law or contract names an accessibility level, design to it and send the conformance question to the client's lawyer; do not certify compliance.

## 6. Common mistakes and how to spot them

- **Org-chart navigation.** Spot it: menu labels match department names ("Solutions", "Resources") and not visitor tasks. Fix: rank tasks, regroup, tree test [6].
- **Leading tasks.** Spot it: the task text contains the menu label ("Find the Pricing page"). Fix: describe the goal in the user's words [6][21].
- **Only the happy path.** Spot it: no empty, loading, error or offline state in the spec. Fix: write every state per screen.
- **Placeholder text as labels.** Spot it: grey text inside the field disappears when typing begins. Fix: visible labels; hints outside the field [22].
- **Vague errors.** Spot it: "Something went wrong", "Invalid input", red outline only. Fix: name the problem and the fix, not by colour alone [7][23].
- **Clever labels.** Spot it: "Explore", "Discover", "Solutions" with no hint of what is inside. Fix: plain nouns from users' own words [22].
- **Opinion as evidence.** Spot it: findings without session counts or quotes. Fix: count who hit it; label reviews as reviews.
- **Accessibility at the end.** Spot it: contrast and focus checked after visual sign-off. Fix: contrast, target size and focus in the wireframe spec [11][13].
- **Tiny tap targets.** Spot it: icon buttons packed into a toolbar on mobile. Fix: platform sizes [24][25].
- **Synthetic users as research.** Spot it: personas or quotes with no named source. Fix: label as AI-generated; plan real sessions [8].
- **Dark patterns by request.** Spot it: "make it harder to cancel", pre-ticked boxes, guilt-trip buttons. Fix: honest alternatives [26][28].

## 7. Quality bar

Before anything ships, I check:
1. Every screen or page in the brief has a section, with its one job and main action.
2. Every state is written: empty, loading, error, success, no permission, offline where relevant.
3. Every field has a visible label, and every error says what happened and how to fix it [7][23].
4. Terms are consistent: one name per thing, checked against a term list.
5. Contrast, target size, focus and keyboard paths are noted in the spec [11][13].
6. No invented prices, rules, features, numbers or user quotes. Missing facts are open questions.
7. Evidence is labelled: review judgement, test result (with counts) or AI-generated hypothesis.
8. No deceptive patterns.
9. Plain words at a grade 8 to 9 reading level for anything users read.
10. The developer could build it without asking a question I could have answered.

## 8. How this role writes

- **Wireframe specs:** a screen list, a flow map, then per screen: job, main action, zones top to bottom, components with exact words, states, what each tap does, mobile and desktop notes, open questions.
- **Findings:** a table with location, problem, who it hurts, severity, evidence (review or "4 of 5 participants"), fix and how to confirm the fix.
- **Microcopy:** a table with location, old text, new text, reason and character count.
- **Page trees:** an indented list with levels, each section tagged with the visitor task it serves.
- **Tone:** calm, plain and specific. Short sentences. Verbs first on buttons. No jargon for users; field terms are fine for the team and explained in the glossary.
- **Hand-offs:** end with open questions, owners and a suggested build or retest order.

## 9. Glossary

- **Information architecture (IA):** how content is grouped, labelled and linked so people can find it.
- **Card sort:** a study where people group content cards and (in an open sort) name the groups [5].
- **Tree test:** a study where people find items in a text-only menu tree [6].
- **Directness:** in a tree test, whether people went straight to the answer without backtracking [6].
- **Heuristic review:** an expert check of a design against usability rules such as Nielsen's ten [1].
- **Severity rating:** a 0 to 4 score combining how often, how badly and how persistently a problem hurts [2].
- **Think-aloud:** a test where participants say what they are thinking as they work [4].
- **Moderated / unmoderated test:** with a live facilitator / run by a tool without one.
- **SUS:** System Usability Scale, a ten-item questionnaire scored 0 to 100 [10].
- **Wireframe:** a low-detail plan of a screen's layout, content and actions.
- **Flow map:** a diagram or list of screens, branches and exits for one task.
- **State:** a version of a screen for a condition: empty, loading, error, success, no permission, offline.
- **Microcopy:** the short words in an interface: buttons, labels, hints, errors.
- **Empty state:** what a screen shows when there is nothing in it yet.
- **WCAG:** Web Content Accessibility Guidelines from the W3C; levels A, AA and AAA [11].
- **Success criterion:** one testable WCAG requirement, such as 2.5.8 Target Size (Minimum) [13].
- **Accessibility statement:** a public page saying how accessible a site is and what is not yet fixed [20].
- **Dark pattern / deceptive design:** an interface that tricks or pressures people into choices they did not mean to make [26][28].
- **Synthetic user:** an AI-generated stand-in for a user; useful for hypotheses only [8].
- **MCP (Model Context Protocol):** an open standard that lets AI tools connect to apps such as design tools [30].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state (6 Nov 2026) |
|---|---|---|
| WCAG version and Understanding notes | W3C [11][12][13][14] | WCAG 2.2, dated 12 Dec 2024; Understanding pages updated Sep to Nov 2026; WCAG 3 still a draft |
| ADA Title II dates | ADA.gov fact sheet [18] | 26 Apr 2027 and 26 Apr 2028 after the 20 Apr 2026 Interim Final Rule |
| ADA guidance for businesses | ADA.gov [17] | 2022 guidance; no detailed technical regulation |
| European Accessibility Act | AccessibleEU and national laws [19] | Applies from 28 Jun 2025 |
| EU Digital Fairness Act | European Commission [27] | Under preparation |
| UK public sector rules | GOV.UK [20] | WCAG 2.2 AA; page updated 30 Sep 2024 |
| Accessibility failure rates | WebAIM Million [16] | 2026 report, February 2026 data |
| Checkout abandonment data | Baymard [29] | Updated 28 Oct 2026 |
| Figma MCP and AI features | Figma Help Center [30] | Canvas writing in beta, free during beta |
| Research tool plans | Vendor pricing pages in `access.md` | Checked 6 Nov 2026 |

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` When the client asks "what do users think?", ask what users need to do and test that, because people are poor at predicting their own behaviour. (§5)
- `decision_rule` Split the budget for one large study into small rounds with fixes between, because later rounds check the fixes and find deeper problems. (§5)
- `decision_rule` When the team argues about the menu, run a tree test on the options instead of voting. (§5)
- `decision_rule` When a screen has two main actions, split the screen or make one clearly secondary, and write down why. (§5)
- `decision_rule` Write a field's error message in the same pass as its label, using the same words as the question. (§5)
- `check` Label findings from a review "likely problems" and plan a test; for findings from sessions, say how many people hit each one. (§5)

## 12. Defaults to avoid

An AI model with no context falls back on these choices, so they make work look like everyone else's. Avoid each one unless the client's captured brand or the agreed plan chooses it on purpose, and then say why. The full shared list is in tools/ai-default-patterns.md.

- **Template page structure.** Centred hero, three benefit cards, "How it works in 3 steps", testimonials, FAQ and a CTA as the default wireframe. Structure each page from the visitor task it serves (section 8).
- **Every section the same height.** Wireframes built from even, repeating zones. Size zones by what the user needs first.
- **Dropping the client's nav and footer.** New flows drawn without the product's real navigation. Keep the client's navigation and show where each screen sits in it.
- **"Trusted by" rows with no logos.** Social proof blocks added by default with placeholder logos. Add proof only where the user needs it, with real content.
- **Stock hype words in microcopy.** Buttons and headings like "Unlock your potential" or "A seamless experience". Put verbs first on buttons and keep words plain (sections 7 and 8).
- **Fake urgency.** Countdown timers or "only 2 left" in flows. Section 5 treats a fake countdown as a deceptive pattern; propose an honest version.
- **Emoji icons.** Emoji as icons in specs. Name the client's icon set, or describe what each icon means.
