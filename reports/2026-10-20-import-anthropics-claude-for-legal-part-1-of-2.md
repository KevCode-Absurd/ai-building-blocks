# Import from anthropics/claude-for-legal, 2026-10-20

76 skills found at commit 4a6c651. 5 ready to import, 19 to check against a skill we have, 0 to fix first, 52 skipped. Dry run: nothing written.

| Skill | Our name | Job | Licence | Decision | Closest we have | Notes |
|---|---|---|---|---|---|---|
| `ai-governance-legal/skills/ai-inventory` | - | - | Apache-2.0 | skip: Near-copy of our EU AI Act readiness checker and risk classifier; a register for a legal team. | EU AI Act readiness checker (43%), EU AI Act risk classifier (38%) | - |
| `ai-governance-legal/skills/aia-generation` | AI impact assessment writer | check-contracts | Apache-2.0 | check: may repeat a skill we have | HR AI use policy writer (18%), EU AI Act readiness checker (17%) | - |
| `ai-governance-legal/skills/cold-start-interview` | - | - | Apache-2.0 | skip: Setup interview that builds a law-firm practice profile for the repo's own plugins. | Browser test setup builder (14%), HR AI use policy writer (14%) | - |
| `ai-governance-legal/skills/customize` | - | - | Apache-2.0 | skip: Edits the repo's own practice profile; works only inside these plugins. | AWS security checker (16%), Change impact checker (14%) | - |
| `ai-governance-legal/skills/matter-workspace` | - | - | Apache-2.0 | skip: Law-firm matter and client file management. | Skill teacher (13%), Agent context setter (12%) | - |
| `ai-governance-legal/skills/policy-monitor` | - | - | Apache-2.0 | skip: Weekly sweep of a legal team's saved assessments; needs the repo's own register. | Recurring marketing routine builder (13%), Deal competitor playbook builder (12%) | - |
| `ai-governance-legal/skills/policy-starter` | Team AI use policy drafter | check-contracts | Apache-2.0 | check: may repeat a skill we have | Privacy policy drafter (24%), Policy page drafter (17%) | - |
| `ai-governance-legal/skills/reg-gap-analysis` | New AI rule gap checker | check-contracts | Apache-2.0 | check: may repeat a skill we have | Rules and approvals checker (18%), AI build-or-buy advisor (16%) | - |
| `ai-governance-legal/skills/use-case-triage` | - | - | Apache-2.0 | skip: Needs a use-case registry built by the repo's setup interview. | NDA quick checker (12%), AI workflow handoff planner (12%) | - |
| `ai-governance-legal/skills/vendor-ai-review` | AI vendor terms checker | check-contracts | Apache-2.0 | check: may repeat a skill we have | HR AI use policy writer (18%), Contract reviewer (17%) | - |
| `commercial-legal/skills/amendment-history` | Contract change tracer | check-contracts | Apache-2.0 | check: may repeat a skill we have | Contract risk reviewer (18%), Franchise and reseller terms writer (15%) | - |
| `commercial-legal/skills/cold-start-interview` | - | - | Apache-2.0 | skip: Setup interview that builds a law-firm practice profile for the repo's own plugins. | Browser test setup builder (14%), Codebase onboarding guide writer (14%) | - |
| `commercial-legal/skills/customize` | - | - | Apache-2.0 | skip: Edits the repo's own practice profile; works only inside these plugins. | AWS security checker (13%), Shopify checkout customizer (12%) | - |
| `commercial-legal/skills/escalation-flagger` | - | - | Apache-2.0 | skip: Routes issues to approvers in a legal department's escalation matrix. | Deal desk reviewer (19%), Discount policy designer (18%) | - |
| `commercial-legal/skills/matter-workspace` | - | - | Apache-2.0 | skip: Law-firm matter and client file management. | Skill teacher (12%), Agent context setter (11%) | - |
| `commercial-legal/skills/nda-review` | - | - | Apache-2.0 | skip: Same job and format as our NDA quick checker (green, yellow, red). | NDA quick checker (30%), Email sequence auditor (19%) | - |
| `commercial-legal/skills/renewal-tracker` | - | - | Apache-2.0 | skip: Same job as our Renewal watch planner; needs the repo's own renewal register. | Renewal watch planner (19%), Vendor agreement status checker (18%) | - |
| `commercial-legal/skills/review` | - | - | Apache-2.0 | skip: Only routes to the repo's other review skills. | Contract reviewer (19%), Deal screening memo writer (16%) | - |
| `commercial-legal/skills/review-proposals` | - | - | Apache-2.0 | skip: Approves playbook updates proposed by a monitoring agent in this repo. | Contract reviewer (16%), Candidate message drafter (12%) | - |
| `commercial-legal/skills/saas-msa-review` | Software subscription terms checker | check-contracts | Apache-2.0 | check: may repeat a skill we have | Vendor scorecard builder (17%), Supplier contract manager (17%) | - |
| `commercial-legal/skills/stakeholder-summary` | Contract plain-words summary writer | check-contracts | Apache-2.0 | check: may repeat a skill we have | Plain-words SQL explainer (25%), Data jargon translator (22%) | - |
| `commercial-legal/skills/vendor-agreement-review` | - | - | Apache-2.0 | skip: Same job as our Contract reviewer; needs a legal team playbook and approver routing. | Contract reviewer (31%), Deal desk reviewer (16%) | - |
| `corporate-legal/skills/ai-tool-handoff` | - | - | Apache-2.0 | skip: Hands work to Luminance or Kira, paid law-firm review tools. | AI instruction writer (12%), Contract risk reviewer (11%) | - |
| `corporate-legal/skills/board-minutes` | Board minutes drafter | document-work | Apache-2.0 | check: may repeat a skill we have | Meeting pre-read writer (19%), Investor pitch scriptwriter (14%) | - |
| `corporate-legal/skills/closing-checklist` | - | - | Apache-2.0 | skip: Deal-closing tracker for M&A lawyers; our Due diligence checklist builder covers the small-business case. | Month-end close day planner (22%), Due diligence checklist builder (16%) | - |
| `corporate-legal/skills/cold-start-interview` | - | - | Apache-2.0 | skip: Setup interview that builds a law-firm practice profile for the repo's own plugins. | Folder guide writer (13%), Terraform setup builder (13%) | - |
| `corporate-legal/skills/customize` | - | - | Apache-2.0 | skip: Edits the repo's own practice profile; works only inside these plugins. | AWS security checker (12%), Prospect outreach drafter (11%) | - |
| `corporate-legal/skills/deal-team-summary` | - | - | Apache-2.0 | skip: Briefs a law-firm deal team on data room findings. | Stakeholder update writer (31%), Call follow-up drafter (17%) | - |
| `corporate-legal/skills/diligence-issue-extraction` | - | - | Apache-2.0 | skip: Needs a virtual data room and house memo formats; overlaps our Startup due diligence reviewer. | Investment committee memo drafter (16%), Folder tidier (10%) | - |
| `corporate-legal/skills/entity-compliance` | Company filing deadline tracker | check-contracts | Apache-2.0 | check: may repeat a skill we have | Upcoming events calendar builder (17%), Sales tax summary builder (14%) | - |
| `corporate-legal/skills/integration-management` | - | - | Apache-2.0 | skip: Post-merger tracker for deal lawyers. | Due diligence checklist builder (16%), Customer onboarding planner (16%) | - |
| `corporate-legal/skills/material-contract-schedule` | - | - | Apache-2.0 | skip: Builds disclosure schedules for purchase agreements; deal-lawyer work. | Investment committee memo drafter (17%), Multi-platform post planner (16%) | - |
| `corporate-legal/skills/matter-workspace` | - | - | Apache-2.0 | skip: Law-firm matter and client file management. | Skill teacher (14%), Product context builder (13%) | - |
| `corporate-legal/skills/tabular-review` | Contract batch review grid builder | check-contracts | Apache-2.0 | check: may repeat a skill we have | Learn what sells from 50 different image ads (16%), Column mapping document writer (14%) | - |
| `corporate-legal/skills/written-consent` | Board written consent drafter | check-contracts | Apache-2.0 | import | Legal inquiry reply drafter (14%), Policy page drafter (12%) | - |
| `employment-legal/skills/cold-start-interview` | - | - | Apache-2.0 | skip: Setup interview that builds a law-firm practice profile for the repo's own plugins. | Cold re-read marker (13%), AI instruction writer (13%) | - |
| `employment-legal/skills/customize` | - | - | Apache-2.0 | skip: Edits the repo's own practice profile; works only inside these plugins. | AWS security checker (12%), Shopify checkout customizer (12%) | - |
| `employment-legal/skills/expansion-kickoff` | - | - | Apache-2.0 | skip: Near-copy of our New country hiring planner. | New country hiring planner (27%), New country expansion planner (18%) | - |
| `employment-legal/skills/expansion-update` | - | - | Apache-2.0 | skip: Updates a tracker made by the expansion kickoff skill. | App Store release notes writer (13%), Financial model refresher (13%) | - |
| `employment-legal/skills/handbook-updates` | Handbook change checker | hire-people | Apache-2.0 | check: may repeat a skill we have | HR policy drafter (19%), Change impact checker (15%) | - |
| `employment-legal/skills/hiring-review` | Offer letter and non-compete checker | hire-people | Apache-2.0 | import | Venture loan terms reviewer (11%), Build blueprint writer (11%) | - |
| `employment-legal/skills/internal-investigation` | Workplace investigation guide | hire-people | Apache-2.0 | check: may repeat a skill we have | Exit interview and grievance guide (16%), HR policy drafter (13%) | - |
| `employment-legal/skills/international-expansion` | - | - | Apache-2.0 | skip: Reference for the expansion skills; near-copy of our New country hiring planner. | New country hiring planner (21%), Headcount business case builder (16%) | - |
| `employment-legal/skills/investigation-add` | - | - | Apache-2.0 | skip: Thin step that only calls the internal-investigation skill, which we list. | Conversion funnel analyst (14%), Customer job interview planner (13%) | - |
| `employment-legal/skills/investigation-memo` | - | - | Apache-2.0 | skip: Thin step that only calls the internal-investigation skill, which we list. | Project skill finder (18%), Task handoff writer (11%) | - |
| `employment-legal/skills/investigation-open` | - | - | Apache-2.0 | skip: Thin step that only calls the internal-investigation skill, which we list. | Dev container setup builder (14%), Growth engine finder (10%) | - |
| `employment-legal/skills/investigation-query` | - | - | Apache-2.0 | skip: Thin step that only calls the internal-investigation skill, which we list. | Keyed ad results log keeper (13%), Agent run evidence auditor (13%) | - |
| `employment-legal/skills/investigation-summary` | - | - | Apache-2.0 | skip: Thin step that only calls the internal-investigation skill, which we list. | Solved-ticket help page writer (18%), Six-page narrative memo writer (13%) | - |
| `employment-legal/skills/leave-tracker` | - | - | Apache-2.0 | skip: Thin; reads a leave register kept by the repo's own log-leave skill. | Status report writer (15%), Meeting minutes writer (14%) | - |
| `employment-legal/skills/log-leave` | - | - | Apache-2.0 | skip: Thin; feeds a leave register used only by the repo's own plugin. | Missing product image finder (14%), Rising cost ladder builder (12%) | - |
| `employment-legal/skills/matter-workspace` | - | - | Apache-2.0 | skip: Law-firm matter and client file management. | Agent context setter (12%), Account tier ranker (10%) | - |
| `employment-legal/skills/policy-drafting` | - | - | Apache-2.0 | skip: Same job as our HR policy drafter and Workplace policy and handbook writer. | Staff announcement writer (20%), Test plan writer (13%) | - |
| `employment-legal/skills/termination-review` | Termination risk checker | hire-people | Apache-2.0 | import | Policy page drafter (12%), Privacy policy drafter (12%) | - |
| `employment-legal/skills/wage-hour-qa` | Pay and hours rules answerer | hire-people | Apache-2.0 | check: may repeat a skill we have | Attendance policy writer (17%), Policy page drafter (15%) | - |
| `employment-legal/skills/worker-classification` | Employee or contractor checker | hire-people | Apache-2.0 | check: may repeat a skill we have | Contractor program setup guide (26%), Rules and approvals checker (16%) | - |
| `external_plugins/cocounsel-legal/skills/deep-research` | - | - | Apache-2.0 | skip: Needs a paid Westlaw CoCounsel account to work. | Deep research reporter (17%), Policy removal test planner (14%) | - |
| `ip-legal/skills/cease-desist` | Cease-and-desist letter helper | check-contracts | Apache-2.0 | import | NDA quick checker (12%), Email drafter (10%) | - |
| `ip-legal/skills/clearance` | Trademark name first-check | check-contracts | Apache-2.0 | import | Legal risk rater (12%), HR AI use policy writer (12%) | - |
| `ip-legal/skills/cold-start-interview` | - | - | Apache-2.0 | skip: Setup interview that builds a law-firm practice profile for the repo's own plugins. | Skill safety reviewer (12%), Shopify landing page builder (11%) | - |
| `ip-legal/skills/customize` | - | - | Apache-2.0 | skip: Edits the repo's own practice profile; works only inside these plugins. | Shopify checkout customizer (13%), AWS security checker (13%) | - |
| `ip-legal/skills/fto-triage` | Patent launch-risk scanner | check-contracts | Apache-2.0 | check: may repeat a skill we have | Patent prior-art searcher (18%), Legal risk rater (11%) | - |
| `ip-legal/skills/infringement-triage` | Infringement first-look sorter | check-contracts | Apache-2.0 | check: may repeat a skill we have | Patent prior-art searcher (17%), Store brand protection planner (13%) | - |
| `ip-legal/skills/invention-intake` | Invention idea screener | check-contracts | Apache-2.0 | check: may repeat a skill we have | Patent prior-art searcher (19%), Privacy policy drafter (14%) | - |
| `ip-legal/skills/ip-clause-review` | IP clause checker | check-contracts | Apache-2.0 | check: may repeat a skill we have | Contract and term sheet reviewer (18%), Contract risk reviewer (15%) | - |
| `ip-legal/skills/matter-workspace` | - | - | Apache-2.0 | skip: Law-firm matter and client file management. | Task handoff writer (11%), Split shipment planner (11%) | - |
| `ip-legal/skills/oss-review` | - | - | Apache-2.0 | skip: Same job as our Open-source license checker. | Open-source license checker (31%), Open source promoter (15%) | - |
| `ip-legal/skills/portfolio` | - | - | Apache-2.0 | skip: IP register tracker for practice-management systems. | Renewal watch planner (15%), Project skill finder (14%) | - |
| `ip-legal/skills/takedown` | Copyright takedown notice helper | check-contracts | Apache-2.0 | check: may repeat a skill we have | Employee data privacy checker (17%), Policy page drafter (16%) | - |
| `law-student/skills/bar-prep-questions` | - | - | Apache-2.0 | skip: Law-student study drill, not for contract or rule checks. | Subject writing frame maker (15%), Sales tax summary builder (15%) | - |
| `law-student/skills/case-brief` | - | - | Apache-2.0 | skip: Law-student study drill, not for contract or rule checks. | Inbox triager (13%), Account snapshot writer (13%) | - |
| `law-student/skills/cold-call-prep` | - | - | Apache-2.0 | skip: Law-student study drill, not for contract or rule checks. | Lesson barrier spotter (12%), Hard-questions board prep coach (12%) | - |
| `law-student/skills/cold-start-interview` | - | - | Apache-2.0 | skip: Setup interview that builds a law-firm practice profile for the repo's own plugins. | Exam study roadmap builder (16%), TikTok Shop launch planner (11%) | - |
| `law-student/skills/customize` | - | - | Apache-2.0 | skip: Edits the repo's own practice profile; works only inside these plugins. | Shopify checkout customizer (13%), Shopify theme developer (12%) | - |
| `law-student/skills/exam-forecast` | - | - | Apache-2.0 | skip: Law-student study drill, not for contract or rule checks. | Duplicate SKU finder (11%), Headcount forecast builder (10%) | - |
| `law-student/skills/flashcards` | - | - | Apache-2.0 | skip: Law-student study drill, not for contract or rule checks. | Mini-course builder (10%), History thinking quiz designer (10%) | - |
| `law-student/skills/irac-practice` | - | - | Apache-2.0 | skip: Law-student study drill, not for contract or rule checks. | AI-written text detector (15%), Hidden value check (12%) | - |
