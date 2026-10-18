# Decision log

Newest first. The founder's latest direct instruction wins. Record changes here rather than mixing versions.

| Date | Decision | Source |
|---|---|---|
| 2026-10-18 | **Proposed: Make it yours** (decision 21). A ten-step learning track: check by eye, test sets, evals (code checks, cross-lab judge, blind A vs B), tightening, context (what to give and in what order), preparing data (pull, clean, protect, tag, digest for reviews and transcripts), style and material (e.g. a book: principles, examples, look-up, fine-tune last), interfaces, cheaper and faster inference, training. Runs on the person's own machine and key. Design: `docs/planning/09_MAKE_IT_YOURS.md`; deck slides 28–30. | Founder asked; design proposed |
| 2026-10-18 | **Proposed: one library with filters, and skill families** (decision 20). No separate boards: one list with six types (prompts, skills, routines, workflows, agents, apps), filtered by scope, business type (ecommerce first; lead gen is a business type, not an industry), function › area (e.g. Advertising › Meta, Google), platform and level. Tags only from `taxonomy.yaml`. /ecommerce is a saved view. Each skill is a family: a shared core plus industry packs, built into standalone versions (general, ecommerce, later lead gen, SaaS); a version must change the advice and beat the general one on its test set. Votes and reports count per version. Deck v2, slides 23–24. | Founder asked; design proposed |
| 2026-10-18 | **Model keys are in place:** the `.env` in the handoff folder, one level above the repo and outside git. The factory loads only the four lab keys, by name; the file's other entries are never used. | Founder |
| 2026-10-18 | **Sources to start: links, GitHub, YouTube transcripts and articles.** No Instagram reels or TikToks to start; the founder sends sources. Old decision 13 (reels) dropped. | Founder |
| 2026-10-18 | **No user data stored on the site.** No business data, files, brand brains, results or keys. Brand brains and mini tools run in the browser and download to the person's device; we help people store things themselves. Accounts hold only email, display name, comments, votes, stars, kits, follows and settings. | Founder |
| 2026-10-18 | **Everything free; comments for anyone signed in.** We answer questions in the comments. Paid priority help and a paid community come later. | Founder |
| 2026-10-18 | **Model budget = the credits we have:** the credits we have: about $200 Anthropic (until 27 Oct), $60–70 Google, $20 DeepSeek and $10 OpenAI, topped up when needed. $2 per run and $25 per round stay as safety stops. Anthropic credit used first (credit sprint 19–27 Oct). Decision 2 closed. | Founder |
| 2026-10-18 | **Business and build deck** (`docs/business-deck/`): market, beachhead, adjacent markets, site, votes/stars/kits, architecture, stack, phases. | Founder asked; content proposed |
| 2026-10-18 | **Intake engine.** One engine takes any source (YouTube video or transcript, Instagram reel, TikTok, article, Medium post, X or LinkedIn post, GitHub skill library, podcast, PDF) through nine stages: drop in, read (Gemini for video and audio), safety, idea cards, match to our jobs/ladders/workflows, decide what each becomes (improvement, mini tool, prompt, skill, routine, workflow, agent, how-to guide), a one-page report the founder ticks, build through the 12 steps, publish with credit. Ideas only, in our own words; no scrapers or logins; raw files private. Replaces "skills from the internet" as a separate pipeline; the GitHub safety check and licence rule are unchanged. Design proposed in `docs/planning/08_INTAKE_ENGINE.md`; v0 Nov–Dec, v1 always on Feb–Mar 2027, v2 public "Suggest a source" Apr 2027. | Founder (design proposed) |
| 2026-10-18 | **Mini tools.** Turn every calculator we built (discount, deal comparer, order margin and break-even, creative volume planner, CRO test, AI run cost and more) into free mini tools anyone can use: standalone, or ported into their own ChatGPT or Claude. The five ways to use them (site, download, sheet, in your AI, embed) are proposed in plan Part 6. | Founder |
| 2026-10-18 | **Models: no router.** Test only on the four labs we already have accounts and keys for: Claude (Anthropic), GPT (OpenAI), Gemini (Google) and DeepSeek. That covers what most people use; anyone wanting other models can test them themselves. Supersedes OpenRouter and the "Jev" question. | Founder |
| 2026-10-18 | **Free first; no selling at the start.** Build the whole platform and keep everything free: skills, workflows, guides, downloads. No paywall, no paid tests, no sale campaigns (the holiday sale sprint, the four launch jobs and the extra paid test cases are dropped). It's an evergreen resource. | Founder |
| 2026-10-18 | **Revenue comes later, one stream at a time:** affiliates, then advertising (site and YouTube), then consulting and implementation, then memberships (Member $99 or $199/mo for priority replies and implementation help; Pro $499/mo for in-depth help; custom implementation on top), premium workflows for very specific jobs, and a creator marketplace (70% creator / 30% us). Selling individual skills doesn't make sense. Supersedes the 2026-10-17 subscription revenue row. | Founder |
| 2026-10-18 | **General first, then industry, then job roles.** Port every skill we own into general listings any business can use. Industry boards hold the focused, more valuable versions: /ecommerce first, /saas next, then more by demand. Job-role boards (marketing, finance, operations, product) come after a few industries. | Founder |
| 2026-10-18 | **Boards are communities,** like subreddits: listings, downloads, comments and advice. Help with comments and implementation is the later membership value. | Founder |
| 2026-10-18 | **Not only skills.** The library covers prompts, skills, routines, workflows, applications and people's own agents and bots. Each comes ready-made and with a plain how-to guide for setting it up yourself, so a beginner gets value immediately and an expert finds the next level up. | Founder |
| 2026-10-18 | **Skills from the internet.** Bring in skills from GitHub and elsewhere. For each: credit and link the original, check it for malware and prompt injection, tighten and improve it, and show a before and after in plain words. The licence rule (copy only open licences) is proposed in the final plan, decision 4. Later, people upload their own skills through the same checks. | Founder |
| 2026-10-18 | **Tools section.** Plain guides to AI tools built from their documentation and our tests, plus how each tool is used in a given industry. Affiliate links are labelled. | Founder |
| 2026-10-18 | The final plan is now **version 4** (free platform). Where version 3 or the planning pack differ, version 4 wins. | Founder |
| 2026-10-18 | **Simple by default: every job is a ladder.** The steps run 0 by hand → 1 ask → 2 connect → 3 save to a sheet → 4 schedule (e.g. 9 am daily) → 5 mini app → 6 full app → 7 share with permissions → 8 agents act. A page shows only the next step, and people can jump ahead. The levels are Beginner, Intermediate, Advanced and Expert, replacing Starter → Production. | Founder |
| 2026-10-18 | **Use everything we've built.** Creative Engine's workflows become ready-made workflows people pick stages from, with the examples we already made. Those workflows are brand brain, static ads, copy, avatar to photoreal persona, and the video production board (Kanban). The ecomOS (Gehna) dashboard's patterns, never its data, become the Meta ads ladder. | Founder |
| 2026-10-18 | **UI:** keep it as basic as possible. Build on Creative Engine's Mercatura look (warm paper, one blue action, DM Serif/DM Sans, Normal/Advanced switch) and the ecomOS dashboard's data layouts. Reuse the design, not the code. | Founder |
| 2026-10-17 | **It is not an ecommerce platform.** The new home is the private repo `KevCode-Absurd/ai-building-blocks` (a working name). `ecommerce-workflow-platform` is superseded and can be archived. | Founder |
| 2026-10-17 | **Market:** digital businesses worldwide (brands, dropshippers, agencies, software, creators, services). Start with exact marketing jobs, then earn the right to adjacent functions. The catalogue is organised by job, function, industry pack and host. Ecommerce is the first industry pack. | Founder + handoff §market |
| 2026-10-17 | `docs/FINAL_PLAN.md` and `docs/final-plan/Final-Plan.pdf` are the plan of record. Where the planning pack (`docs/planning/`) or the archived v1 guide differ, the final plan wins. | Founder asked for a final plan |
| 2026-10-17 | Independent product in its own repo. Creative Engine is a read-only source of tested methods, not the product. | Business handoff + session |
| 2026-10-17 | **Platform of parts:** six levels (prompt → skill → routine → workflow → agent → system), four depth tiers (Starter → Production; renamed Beginner → Expert on 2026-10-18), items users can edit. Don't re-argue pilots vs platform. | Founder |
| 2026-10-17 | The brand brain is item #1, then M17 creative & static ads. | Founder |
| 2026-10-17 | ~~The first market is ecommerce.~~ **Superseded** the same day: see the market decision above. | — |
| 2026-10-17 | Examples use public data from well-known brands (Grüns, AG1, IM8; one software and one service or course business proposed in the final plan). They're labelled, use no invented claims, and are shown with and without the brand brain. No made-up demo brand; no private client data. | Founder |
| 2026-10-17 | Every item shows a recommended / budget / not-worth-it model from a simple model test. It also gives efficient-use guidance: caching order, reuse, how output degrades, lean mode. (Routing via OpenRouter was dropped on 2026-10-18.) | Founder |
| 2026-10-17 | ~~**Revenue:** subscription ($99 / $299 / $899), implementation ($5,000 bounded workflow), consulting ($1,500), affiliates, and advertising last. Creator marketplace later at 70/30. All prices are assumptions to test.~~ **Superseded** 2026-10-18: free first, revenue later (see above). | Business plan + founder |
| 2026-10-17 | Not selling access to other brands' ads. References come through the user's own connectors. | Founder |
| 2026-10-17 | Learning sources become pieces of know-how mapped into items. A piece stays in a prompt only if a with/without test shows it helps. | Session (docs/planning/07) |
| 2026-10-17 | ~~**Proposed, needs founder OK:** launch with four cross-industry jobs: brand brain (free), static ad pack (holiday sale edition first), landing-page audit and a Starter Meta ad audit.~~ **Dropped** 2026-10-18: no launch jobs; port everything. | Final plan, Part 4 |

## Open

The numbered list matches the decisions table in the final plan v4, Part 16.

1. ~~Router for model tests~~ Decided 2026-10-18: direct accounts with Anthropic, OpenAI, Google and DeepSeek; no router.
2. ~~Spend cap for model tests~~ Decided 2026-10-18: the credits we have per lab, with $2 per run and $25 per round as safety stops.
3. Who can comment: anyone with a free account, with members later getting priority replies?
4. Licence rule for imported skills: copy and adapt only open licences; otherwise a review page that links out?
5. Final brand name and domain.
6. What does "Creative Intelligence" UI refer to? (Read as the ecomOS dashboard for now.)
7. Sample numbers for data examples: a synthetic ad account labelled "sample numbers", or the founder's own account with permission?
8. Reuse the ecomOS (Gehna) dashboard: patterns only, never data? (It was found on 2026-10-18 at `ecom-intelligence/meta_gallery`.)
9. Course terms: can anything derived from Ecom Intelligence, Blue Sense Digital or Nu Reach be published?
10. OK to clean-room rewrite `copy-craft` (built from the purchased Copy Machine)?
11. A "Need help building this?" contact link at launch (no prices, offers or outreach)?
12. Mini tools: their own shelf in Tools and on each board, typed as applications; site, download, sheet, in your AI and embed; always free with no email; anyone may embed with a credit link? (Mid Nov)
13. Votes, stars and kits: ▲ Useful and "it worked / didn't" on listings; ▲▼ on comments; private stars grouped into kits that become workflows? (Mid Nov) (Replaces the dropped reels question.)
14. Membership price for the first tier: $99 or $199? (Later.)
15. Everything free at launch stays free for good; only new premium workflows can be paid? (Later.)
16. Ad and affiliate rules: one quiet slot, labelled links, rankings from tests only? (Later.)
17. How the build year is funded, and the money model rebuild in April 2027. (Later.)
18. Revive the archived retention module (`archive/retention-r1-r6`), or rebuild M21?
19. Archive the old `ecommerce-workflow-platform` repo? (Recommended; nothing is deleted.)
20. One library with filters and skill families (shared core + industry packs → versions), replacing separate boards? (By 2 Nov, before the site build.)
21. Make it yours: the ten-step track, with steps 1–5 and review data prep at launch, 6–9 in Feb–Apr, training by demand? (By 2 Nov.)

~~What is "Jev"?~~ Dropped 2026-10-18: no router needed.

Dropped on 2026-10-18: the holiday sale sprint (old 6) and the two extra test cases (old 9).
