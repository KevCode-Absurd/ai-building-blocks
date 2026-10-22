# Audience gaps and launch scope

Later execution update: `2026-10-22-artifact-e2e.md` records actual output checks and packaged fixes for the presentation, case deck, research paper and equity report. All 38 final slides/pages were inspected; the earlier static/application findings below remain historical baseline evidence.

Reviewed 22 October 2026. Launch target: **23 October 2026, Asia/Kolkata**.
Scope chosen by Kevin: students, workers, small businesses, enterprise teams and startups. Added priorities: presentations, case competition decks, research papers, documents, case studies, stock valuation and equity research.

## What the baseline actually showed

The published index before this expansion had **4,345 entries**, including **163 with a passing-test badge**. The other **4,182 entries (96.2%) did not carry that badge**. This is an inventory of existing claims, not a fresh audit of the older model evaluations. The catalogue has extensive teaching, HR, marketing, software, finance, procurement and startup content. Calling these entire subjects absent would be misleading.

The larger gaps are choosing a relevant starting point, supplying the right evidence, understanding runtime requirements, and demonstrating useful outputs. A repository import alone does not establish model quality or make the website an execution platform.

## Audience assessment

| Audience | Existing evidence | Gap | First launch change | Still needed |
|---|---|---|---|---|
| Students | Adaptive tutor, exam study roadmap, research paper writer, bibliography and figure tools | Learner-facing entry point; clear course-material intake; coherent reading-to-practice path; case competition format | Dedicated study/application tasks, five study imports, Students starter picks, case competition package, academic brief | Multi-turn learner evaluations, subject/level-specific examples, accessibility and language evaluation, explicit course-rule checks during execution |
| Workers | Meeting briefs, action register, reply drafts, spreadsheets, procedures | A general worker starting point; evidence and due-date intake; clear distinction between drafting and sending | Workers picks, résumé/application package, reusable source manifest | Real office-file round trips; task/calendar connector checks; representative report and document outputs |
| Small businesses | Support, invoices, suppliers, metrics and substantial marketing/ecommerce content | Simple operations path; weaker visibility for service businesses; reusable policy/data intake | Small businesses picks and work-context template | Non-ecommerce examples, local service workflows, regional invoice/tax checks, cash/report reconciliation on real permitted data |
| Enterprise teams | Policy explanation, vendor risk, scorecards, compliance and procedures | Discovery and provenance; tenant authorization, SSO, roles, audit retention and approved connector execution are not supplied by these downloadable packs | Enterprise picks; procurement architecture explicitly labelled as a design pattern | Company-specific access controls, data boundaries, evaluation and approval owners, audit evidence, connector and rollback validation. Do not sell the current site as an enterprise runtime |
| Startups | Idea testing, canvas, runway, financial models, metrics, onboarding, pitch content | A stage-based starting point; consistent evidence/assumption intake; reusable finished examples | Startups picks; presentation and equity/research collections reuse existing finance and product content | Founder/customer fixtures, cash/runway arithmetic checks, realistic pitch/data-room examples, source-based milestone decisions |

## Requested work: reuse and additions

| Work | Reuse already present | Addition or clarification | Remaining proof |
|---|---|---|---|
| Presentations and slide decks | Editable PowerPoint, HTML/Markdown decks, board and conference slides | SlideSage storyboard-to-PowerPoint package; Presentations starter path; format/duration/source brief | Render every slide, inspect overflow and chart labels, check editable objects and actual presentation playback |
| Case competition slides | Case-study story planning, financial models, competitor deck, pitch structure | Dedicated case competition package with rubric, recommendation, financials and Q&A appendix; its PPTX renderer has chart placeholders, stated on the listing | A complete competition brief-to-deck run, independently checked calculations, actual charts, rubric scoring and timing |
| Research papers | Manuscript writer, paper figures, bibliography checks | Five research/study modules; Research papers and documents picks; methods/results/citation brief | Claim-to-source verification, actual findings only, journal/course requirements, compiled/rendered manuscript and human author review |
| Documents and case studies | PaperJSX file generator, LibreOffice document builder, case-study story planner | A dedicated writing brief and direct starting path; no duplicate import of restricted proprietary document skills | DOCX/PDF opening, section/heading/table checks, source-grounded case facts, named-subject permissions |
| Stock valuation | Company fair value, financial statements, cost of capital, valuation methods, India DCF | Equity report package with evidence policy, deterministic calculation pipeline, scenarios and sensitivity inputs | Independently reconcile units, dates, diluted shares, cash-flow/discount-rate pairing, terminal assumptions and enterprise-to-equity bridge |
| Equity research reports | Company stock analyst, earnings reports, financial data packs | New report pipeline plus dedicated starter path and dated evidence/valuation brief | Source truth, counter-evidence, sector suitability, reproducible calculations and human research review. No live data feed is bundled |

## Source decisions

Every added source is pinned in metadata, keeps its license and source files, and has an import map. Names and setup explanations are our catalogue layer. Imported programs were not executed during the static import review. These are small/new projects in several cases; popularity is not evidence of quality. No new model-performance badge is earned by importing them.

| Repository | Selected content | License | Why retain it despite overlap |
|---|---|---|---|
| [jacquardlabs/study-skills](https://github.com/jacquardlabs/study-skills) | 5 learning/research modules | MIT | Learner-oriented sequence with reading locations, critique, comparison and interactive understanding checks. Existing summaries and teaching tools remain useful for different jobs |
| [artificialguybr/resume-ats-linkedin-optimizer](https://github.com/artificialguybr/resume-ats-linkedin-optimizer) | 1 application package | MIT | Applicant-facing, reusable factual profile and file renderer, broader than the existing product-manager résumé review |
| [agent-blueprint/agent-blueprint-skills](https://github.com/agent-blueprint/agent-blueprint-skills) | Procurement architecture only | Apache-2.0 | An agent-system design pattern, distinct from supplier scoring. Listing discloses implementation needs and optional commercial service links |
| [Calvinkub/super_subagent_skill_Hackathon](https://github.com/Calvinkub/super_subagent_skill_Hackathon) | Case competition slides only | MIT | Rubric-oriented recommendation structure, action titles, financials and appendix, distinct from generic slides. Optional companion agent is not required: the skill describes writing the spec directly |
| [vedraut/slidesage](https://github.com/vedraut/slidesage) | Storyboard and PowerPoint package | MIT | Deterministic renderer and business/education story modes. Node dependencies required. Upstream scripts not certified by the website regression suite |
| [evilhill/equity-research-skill](https://github.com/evilhill/equity-research-skill) | Valuation and report package | MIT | Structured evidence, assumptions, calculations and report provenance. Mainly Chinese; Python required. A validator does not establish investment truth |

Not imported: davidamitchell/Skills has no license file in the inspected clone. Family/travel/fitness candidates are outside Kevin's clarified launch audiences. Agent Blueprint's remaining skills are not bulk-imported; procurement is a reference pattern rather than a finished live automation. Existing restricted document skills are not copied from unofficial mirrors.

The automatic overlap report is a heuristic. Manual review distinguished learner feedback from broad tutoring, paper critique from claim extraction, literature synthesis from paper discovery, applicant drafting from hiring review, and agent architecture from procurement work. The six-source set is deliberately selective.

## Other gaps to keep visible

1. **Model evidence:** most catalogue entries lack a passing-test badge. The old `test-blocks.mjs` runner covers general/ecommerce/workflows and a business fixture; it does not evaluate the new imported academic/finance tasks. Do not run that fixture and call these subjects tested.
2. **Compatibility:** a chat-only AI can draft text; Python/Node renderers and browser checks need those tools. Generic "works everywhere" language needs continuing review against each dependency.
3. **Data intake:** saved context is a short browser-local note. Full documents are supplied to the user's chosen AI runner, not ingested into a new enterprise knowledge system by this change.
4. **Academic integrity:** source-backed writing is assistance with the user's findings. School/publication rules, authorship, citations and disclosure remain task constraints.
5. **Localization:** most catalogue explanations are English. The new equity source is largely Chinese; some existing financial tools assume Indian conventions. The finance deck review now names its India scope in cards and its introduction.
6. **Accessibility:** automated browser checks do not establish assistive-technology conformance. Include keyboard, screen-reader, reduced-motion and legibility checks in launch review.
7. **Finished examples:** source templates and synthetic fixtures are not evidence that the model can produce a good real deck, manuscript or report. Keep example data visibly labelled and review outputs before using them as showcases.
8. **Enterprise readiness:** downloadable skills and a shared space are not SSO, role-based access, tenant isolation, regulated retention or approved production integrations.
9. **Hosting capacity:** the baseline Pages report had 18,547 files and 453 files before its 19,000-file guard. The parallel hosting work has since selected Workers Static Assets with a 95,000-file guard for Workers Paid. Rebuild after additions, verify the chosen account/plan and keep supporting files inside ZIPs. The earlier Pages limit is historical, not the current configuration.
10. **Deployment:** there is no active `site/wrangler.jsonc` in this checkout. The prior handoff says account integration remains pending. Code and local tests cannot establish production readiness without preview, D1, secrets, domain and live-route checks.

## Validation evidence

Current machine evidence is written to `audience-coverage.json`, `audience-import-verification.json`, the per-repository import reports and the final launch report. The source verifier compares upstream files and license bytes and records full commits and SHA-256 hashes. Application unit/browser checks test discovery, intake and complete downloads. They do not run the imported model workflows or certify their output quality.

Source verification completed: **10 packages, 112 upstream files, zero copy/license/provenance problems**. The refreshed static audit covered **4,359 folders and 25,803 files**, with **zero structural findings**. Its 339 pattern candidates include one new match: `resume-job-application-builder/references/01-ats-and-formatting.md:46` describes a parser that can silently delete text. It is a description of an alleged parser behavior, not a command for the AI to conceal an action. The candidate was retained in the audit trail. Claims about particular résumé parsers remain upstream claims, not independently verified product guarantees.

See `docs/LAUNCH-2026-10-23.md` for the remaining launch gates and the distinction between local and deployed checks.

## Final application validation

- Published catalogue: **4,355 entries**, including all ten additions; all nine starter paths resolve their eight selected blocks. **163 existing passing-test badges**, **4,192 entries without one**. No new badges were added.
- Combined build: **18,600 files**. The hosting chat reports **41 unit tests passed**, including the final canonical-redirect regression.
- Final production-Worker audience suite: **4 passed in 20.2 seconds**, after the local emulator restart completed. This covers all five audiences, saved/shareable filter URLs, return to the full catalogue, saved study context in a complete licensed ZIP, all four requested work collections, all nine choices and open menus at 320 pixels, and a real template download. Evidence: `audience-worker-final-results/.last-run.json` and its artifacts.
- Additional browser matrix: **27 passed**: all nine starting paths at **320, 393 and 1440 pixels**, eight cards each, no horizontal overflow, no page errors and exact task-brief content. Evidence: `audience-browser-check.json`; `audience-worker-equity-research-320.png` and `audience-worker-case-competitions-1440.png` were visually inspected.
- The broader mobile matrix found long selected filter names overflowing at 320 pixels. Filter and option text now wrap within the available width; the new regression checks both closed and open menus. An intermediate browser run was interrupted by a local Worker restart and is retained separately from the successful final run.
- Source/model distinction: these checks validate catalogue integration and application behavior. The ten imported instruction/code packages have not received independent model-output or runtime certification from this work.

**Deployment remains pending.** The verified target here is the local Workers emulator. The Cloudflare migration chat owns staging/account/domain verification; no production deployment or paid subscription was performed by this audience-expansion work. The earlier authorized 22 October hosting preparation is preserved, with 23 October as this chat's requested deadline.
