# Import queue, 2026-10-21

Every repo sent for import, dry-run with `tools/import-skills.mjs`. Each has its own report in `reports/` (named `2026-10-20-import-<repo>.md`). Clones live in `C:/Users/kevin/ab-sources/`, outside this repo.

## Ready now (names written in `tools/import-map.yaml`)

| Repo | Found | Ready | Skipped | Notes |
|---|---|---|---|---|
| anthropics/skills | 19 | 12 | 7 | docx, pdf, pptx, xlsx are "all rights reserved"; doc-coauthoring has no licence; 2 only work for Anthropic |
| openai/skills | 44 | 31 | 13 | 8 Figma skills are under Figma's own terms; 5 only work inside Codex or are copies |
| mattpocock/skills | 38 | 33 | 5 | 5 only route to his own skills or are stubs |

## Next: names to write, then import

| Repo | Found | Can copy | May repeat ours | Notes |
|---|---|---|---|---|
| coreyhaines31/marketingskills | 52 | 52 | 3 | MIT. Strong marketing set |
| bergside/awesome-design-skills | 67 | 67 | 2 | MIT |
| addyosmani/agent-skills | 25 | 25 | 3 | MIT |
| robpalmer99/claude-code-copywriting-skills | 5 | 5 | 2 | CC BY 4.0 |
| JimLiu/baoyu-skills | 22 | 22 | 1 | MIT. Leave out the 2 "danger" skills (unofficial web access) and the 4 for Chinese apps |
| nexscope-ai/eCommerce-Skills | 162 | 162 | 27 | MIT. Fits the ecommerce pack |
| zanwei/design-dna | 1 | 1 | 0 | MIT. Nothing like it in the library |
| Bhanunamikaze/Agentic-SEO-Skill | 1 | 1 | 0 | MIT |
| composio-community/awesome-codex-skills | 880 | 18 | 1 | 862 have no licence. 16 of the 18 are copies of Anthropic and OpenAI skills: take only create-plan and paperjsx |
| matlab/matlab-agentic-toolkit | 158 | 158 | 0 | BSD. Engineering and science, needs MATLAB |
| Leon-Drq/openagentskill | 2 | 2 | 0 | MIT |
| Egonex-AI/Understand-Anything | 9 | 9 | 2 | MIT, but they are parts of one plugin and 3 call its code. List as one plugin |

## Pick from, don't copy whole

| Repo | Found | Notes |
|---|---|---|
| sickn33/agentic-awesome-skills | 2,632 | Scan only `skills/` (`--path skills`); the plugin folders are copies. Gathers other people's skills under one licence, so check each author |
| alirezarezvani/claude-skills | 387 | Use `--exclude .gemini,.codex,.cursor`; 458 more are copies for other AIs |
| seb1n/awesome-ai-agent-skills | 103 | MIT |
| zhuyansen/awesome-claude-video-skills | 0 | A list of 326 video skill repos (CC0 list; each repo has its own licence). Pick the best 10 to 20 |

## Not imported

| Repo | Why |
|---|---|
| boraoztunc/skills | Several licence files, one per original author. Name the right one per skill in the map, or take the originals instead (copywriting and page-cro look like Corey Haines' skills) |
| syntax-syndicate/marketing-skills | A copy of Corey Haines' marketing skills. Take the original |
| NoShiftSherlock gist | A Markdown list of 51 skills with no licence. The skills look like copies of the repos above |
| tenfoldmarc/video-edit-skill | No licence file |
| maxazure/video-editing-skill | No licence file |
| SNLabat/SEO-GEO-AEO-Skill | No licence file |
| tourmind-com/Tourmind-Booking-Skills | Books and charges through TourMind's own service, and pitches it on install |
| jiweiyeah/Skills-Manager | An app for managing skills, not a skill. Could go on /apps or a tools list |
| browser-use/browser-use | A browser-control library, not a skill. Could go on a tools list |
| D4Vinci/Scrapling | A scraping library, not a skill |
| gosom/google-maps-scraper | A scraper app, not a skill, and it collects business contact details |

## Imported later on 2026-10-21

Two rules changed today. Skills that scrape public pages come in with a "Scrapes sites" label. Skills that only run with a paid outside account come in with a "Needs a paid account" label that names the service (map field `paid`).

| Repo | Kept | Notes |
|---|---|---|
| Jakeschincariol/youtube-agent-skill, AgriciDaniel/claude-youtube | 11, 1 | YouTube planning and growth |
| ZeroPointRepo/youtube-skills | 3 | Paid (TranscriptAPI), scrapes. The other 21 repeat our YouTube transcript reader |
| ScrapeCreators/social-media-research-skills | 9 | Paid (ScrapeCreators), scrapes. Skipped the creator-contact list builder |
| nbashaw/claude-cs | 1 | Customer support |
| anthropics/knowledge-work-plugins | 128 | Support, HR, legal, ops, finance, data, sales, marketing, product, small business, partner-built |
| tuanductran/hr-skills, carlopezzuto/recruiting | 52, 13 | Skipped bulk LinkedIn search |
| nimrodfisher, pymc-labs, Bin-Huang, wizard7558 | 23, 5, 1, 11 | Data and attribution |
| AgriciDaniel/claude-ads, TheMattBerman/meta-ads-kit | 6, 2 | Platform audits carry their reference notes |
| orchestra-research, Weizhena, GarethManning | 54, 3, 134 | Research and teaching |
| kishorkukreja/awesome-supply-chain | 75 | Supply chain |
| CosmoBlk, jacquescorbytuech, ThomasPraun, creationskiro | 1, 1, 0, 1 | Email and SaaS |
| checkout-page/ecommerce-skills | 14 | Pricing, discounts, reviews |
| proskillpacks/skills | 15 | Chargebacks, angry-customer replies, review replies |
| rampstackco/claude-skills | 82 | Email delivery, brand guides, content, product. 5 SEO skills need Ahrefs |
| anthropics/claude-for-legal | 42 | First checks, not legal advice. Each carries its plugin's setup interview |
| arnabbagxd/Brand-building-skills | 17 | Brand |
| strands-agents/agent-sop | 1 | SOP writer. Five more procedures sit as plain files in `agent-sops/`: rebuild later |
| ZhongHanLoo/deep-research-skill | 1 | Cited research, scrapes, uses many tokens |
| Paldom/mcp-server-skills | 5 | MCP design, security, testing |
| elevenlabs/skills | 8 | Paid (ElevenLabs). Audio |
| dlazy-ai/ecommerce-skills | 24 | Product photos with your own image model key. Skipped watermark removal and garment lifting |
| phuryn/pm-skills | 31 | Product. 38 repeat ours |
| wondelai/skills | 54 | Book methods. 51 end with Amazon links tagged `wondelai00-20` (their affiliate tag, kept as written) |
| Sushegaad/Claude-Skills-Governance-Risk-and-Compliance | 31 | Compliance rules |
| realkimbarrett/advertising-skills | 4 | MIT stated in the README (no LICENSE file); the README goes with each skill |
| K-Dense-AI/scientific-agent-skills | 76 | Science research. 8 skipped for their own licence (non-commercial, unknown, proprietary) |

Also lifted from earlier skips now that paid skills are allowed: Apify Actor builder, converter and schema writer, Gemini research and image makers, Multi-model answer panel (Fireworks), BrowserStack and TestRail runners, Course reading list builder (Consensus).

Not imported from the thin-job search: murphye/agent-skills-customer-service and jwynia/agent-skills (no licence), diogenes (GPL-3.0). No dedicated ad-testing or podcast repo turned up, so we build those ourselves.
