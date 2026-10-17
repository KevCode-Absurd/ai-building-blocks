# Source: skool AI CMO (prefix SKA)

Path: `C:\Users\kevin\OneDrive\Desktop\Business\Ecommerce OS\skool\AI CMO\`
Rights: **course**. This is a paid community course, so it is reference only: learn from it, don't republish it.
CSV: `skool-ai-cmo.csv` has 76 rows: 38 skill rows, 30 lesson/knowledge rows and 8 asset/housekeeping rows.
Inventory date: 2026-10-17

## 1. What the folder is

An offline export of the AI CMO Skool community, made on 4 Oct 2026 with Apify.

**Lessons (104, in 8 courses)**

| Course | Lessons |
|---|---|
| AI Content Generation | 25 |
| AI Landing Pages & CRO | 12 |
| Brand Brain | 6 |
| Connecting MCP's | 6 |
| Claude Code & Antigravity | 5 |
| Start Here | 5 |
| Weekly Live Calls | 3 |
| Skills & Agent Directory | 42 |

Most lesson pages are only a title, a Drive link to a skill and a video. The real text is in:
- the 22 text lessons of "Skills & Agent Directory" (checklists, playbooks, email guides);
- the Brand Brain live-build write-up;
- 2 sets of live-call notes.

**Other folders**

| Folder | What it holds |
|---|---|
| All Skills | 147 .md files, 34 SKILL.md entry points, 35 original zips (4 of them are multi-GB asset libraries), skills-manifest.json, index.html |
| Videos | 565 MP4 (not opened): 55 lesson videos (37 native Skool + 18 Loom, 9.47 h, 6.83 GiB), 492 archive examples, 18 Drive examples |
| Resources | 2 paste-in prompts for Static Ad Factory, 1 PNG flow chart, index.html |
| Audit & Notes | Export audit, START HERE note, 1 transcript ("Ad Formats To Steal"). The other 54 videos are not transcribed |
| Archive Data | Apify raw export (lessons.raw.json), manifests, reorganisation log of 1,087 moves, 55 video info files and download logs. Technical only |

**Overlap with other folders**
- `Ecommerce OS\AI CMO\` is the same skill set. Its SKILL.md files are byte-identical to the course copies, except:
  - `tof-statics` and `clone-from-screenshot` are not there;
  - the foreplay skill there is the newer version.
- Its 14 .docx files are the text lessons of "Skills & Agent Directory". They are byte-identical to the .docx copies in Creative Engine (CE) `skills\`.

## 2. Ported vs not ported (verified 2026-10-17)

The prior intake (`creative-engine\docs\SKILLS-INTAKE.md`, 2026-10-04) said 131 of 147 files were in CE byte for byte. That is no longer true:
- **Every active CE copy has since been rewritten.** All 34 SKILL.md hashes now differ from the course.
- The untouched course set is archived in `CE skills\_library\ai-cmo\`.
- In most of the rewrites CE keeps the method and adds honesty and production rules.
- **Some course content was dropped and is worth keeping** (sections 3 and 5).

| Skill | In CE? | What CE is missing |
|---|---|---|
| brand-brain | Yes | Nothing: CE is a superset |
| brand-guide | Yes | "Sentence patterns to avoid" table; white/opacity scale |
| brief-v2 + ai-copy-blacklist | Yes; blacklist enforced in code | Shame-removal check; UGC stacked-hook block; creative-state tally; >70% late-stage forces a Trigger concept; brief/ad naming |
| strategic-audit | Yes; also the Coverage screen | Vertical format leaders; 14-format checklist |
| foreplay-creative-strategy | Yes (newer text + JSON schemas) | Nothing. The older draft (2 copies) is superseded |
| foreplay-ad-board | Yes | Nothing |
| generate-50 | Yes (logic in code) | Photo FAIL/WARN/PASS; prompts-only export; per-tool prompt tips; retry rule; 3 headlines per slot |
| recreate-winning-ads | Yes | Archetype-to-render-mode table; per-ad MANIFEST |
| ai-ugc-hooks | Yes | Higgsfield CLI quirks and credit costs; avatar catalog (replaced on purpose) |
| ai-satisfying-hooks | Yes (product-motion version) | Aerial/ambient mechanics; overlay pixel recipe; ffmpeg concat graph; concurrency pattern |
| realistic-ai-ugc | Yes | ASMR sound lists and "selective audio"; street-interview format; Seedance input caps |
| ugc-script | Yes | Universal-desire pick; voice style by audience; creator-match note |
| podcast-ad | Yes, with deliberate reversals | J/L-cut audio overlap; ~40-45 words per 15 s clip |
| talking-object-ad | Yes | Abstract-to-object mapping; emotion by object type |
| claymation-ads | Yes | Clay material table; metaphor/enhancement pass; exit motion by phase |
| comic-book-ad | Yes | Gutter-break beat; sound arc; end-card panel |
| zack-d-films-ads | Yes | Gold-word jump; callback close; WPM word-count rule; push-in limit; MANIFEST |
| scroll-stopper-static-ads | Yes | Layout geometry (headline band, floating pill spec); "COMPLETE FINISHED AD" template; force-multiplier rules |
| tof-statics | Yes | Figma composition path only |
| Static Ad Factory, flash-photography, instant-photoshoot, Photoshoot Factory | Yes | Nothing (CE adds tools and media; course copies are text only) |
| asset-generator-cmo | Yes | --photoshoot mode; favourite-5 + random-5 rotation; placements vs treatments by product type |
| PDP Image Factory | Yes | "Proof is a recurring beat" and "one hero grammar" laws; bundle-card detail; capture gotchas |
| five-reasons-lp (+pro), cro-audit, cro-brain, clone-from-screenshot, shopify-liquid-themes | Yes (pages via `landing-pages\kinds\` and `checklist.json`; CE fixes course Liquid errors and adds a no-invented-proof gate) | Only trivia (an ffmpeg command) |
| advertorial-v1 | Yes | Scroll-motion and bento-card spec; "why this format works" table; discovery box; "tried" split layout; FAQ topic seeds |
| gpt-image-ads | Retired (obsolete) | n/a |
| email-design (zip) + references.zip (49 other-brand email images) | **No** | The whole skill. Hero concepts from real product photos, 2 HTML executions, a 600px@2x render, Klaviyo slicing. It is the only course skill CE lacks entirely |

**Knowledge lessons**

| Status | Lessons |
|---|---|
| Ported | 5 Buyer Segments, PDP Checklist, Must-Haves, Shopify Settings, 15 Avatar Hooks, Avatar Hook Structure, 5-Test Checklist, Context Questions. They live in hook-bank, landing-pages checklist and ad-review |
| **Not ported** | Brand Enemy worksheet, TOF/MOF/BOF 30-day framework, Klaviyo Audit, 12-Segment cheat sheet, Post-Purchase flow, Complete Email & SMS Flow Guide, 50 Email Copy Frameworks, DTC Swipe File routine. The 10 Founder Story playbook is mostly covered by CE organic ideas |

## 3. Every skill, one line each

**Brand and strategy**
- brand-brain: site + MCPs into 9 brand files; personas need real quotes.
- brand-guide: printable 5-page HTML brand guide from CSS tokens.
- brief-v2: weekly 3x3 concept sprint with a thinking block per concept.
- ai-copy-blacklist: AI-tell words to strip.
- strategic-audit: creative gap audit, ending in 10 gaps and 5 concepts.
- foreplay-creative-strategy: competitor ads clustered and analysed by Gemini into an HTML brief.
- foreplay-ad-board: 50-ad swipe board in 11 buckets.
- generate-50: 50-static sprint.
- recreate-winning-ads: visual DNA of own winners into new statics.

**Images**
- scroll-stopper-static-ads: problem-visual static.
- tof-statics: cold-audience concept statics (23 worlds, 4 modes).
- gpt-image-ads: obsolete prompts.
- static-ad-factory: statics from a ~4k-layout swipe library.
- asset-generator-cmo: base product photos from a reference.
- flash-photography: 8 flash candids.
- instant-photoshoot: 15 photos in one colour world + montage.
- photoshoot-factory: photos from a ~5k-look library.
- pdp-image-factory: 31-type PDP gallery.

**Video**
- ai-ugc-hooks: 10 talking-head hooks.
- ai-satisfying-hooks: 10 wordless b-roll hooks.
- realistic-ai-ugc: UGC director's brief in 15 s blocks.
- ugc-script: 5-beat UGC script.
- podcast-ad: 2-person podcast clip.
- talking-object-ad: object with a face.
- claymation-ads: 6-10 clay scenes.
- comic-book-ad: comic page filmed on a desk.
- zack-d-films-ads: CGI mechanism mini-documentary.

**Pages and CRO**
- five-reasons-lp / -pro: reasons-why listicle LP (+ Shopify section).
- advertorial-v1: first-person advertorial.
- cro-audit: audit deck from store data.
- cro-brain: 48 KB of CRO rules.
- clone-from-screenshot: page from a screenshot.
- shopify-liquid-themes: Liquid reference.
- email-design: unopened zip.

## 4. Risks to keep out of own-built items

**AI-directed or unsafe lines:**
- brand-brain: "MCP detection is silent, never tell the user"; "without asking for permission, write it"; it writes a self-loading CLAUDE.md.
- foreplay: "this skill OVERRIDES auto-mode"; its Gemini set-up saves the API key into `~/.claude/settings.json` and passes it in the URL.
- The Brand Brain lesson tells users to switch to Bypass Permissions.
- ai-ugc-hooks: the install uses `curl | sh`.

**Invented proof and false urgency:**
- Default "4.9" ratings and "500+" counts.
- Unsourced reviews and narrators.
- "[N] bought today" counters.
- "Frame products as limited runs".
- Rewording claims to get past the filter.
- The call advice to use "vague ads" to avoid Meta bans.

**Likeness, voice and others' work:**
- Pinterest real-person creators.
- Cloning a voice artist's voice.
- YouTube Shorts b-roll.
- Fake testimonial lines for generated people.
- Imitating named creators or studios.

**Commercial:**
- Affiliate links (Foreplay).
- Sales CTAs (Nu Reach Media, "book a call with Jordan").
- Ship Winning Ads is the course owner's own product.

## 5. Techniques worth turning into own-built items

1. **Email and retention pack (biggest gap).** Build these as RT skills on the Klaviyo MCP:
   - post-purchase 5-email flow: day 0/2/5-7/10-14/20, with skip conditions;
   - flow priority S/A/B/C tiers and timing per vertical (beauty review at 14-21 days, supplements at 30+ days);
   - 12 Klaviyo segments;
   - 15-point Klaviyo audit;
   - subject-line and email frameworks;
   - the course's email-design method ("nothing ends, everything dissolves" blends, a seamless hero from sampled edge colours, the hero as a product spectacle, A/B picks logged as taste data).
2. **Full-funnel monthly plan.** From TOF/MOF/BOF: a 60/30/10 spend split, 8-12 emails a month, 3-5 new TOFU creatives a month, and rebalancing rules. This is a workflow candidate.
3. **Competitor swipe routine.** Weekly, from the DTC Swipe File lesson and foreplay-ad-board:
   - the 5-element teardown;
   - 5 boards;
   - a tracker with columns for hook, format, offer, results and days running;
   - the JSON teardown schemas from the older foreplay copy.
4. **Brand enemy statement** as a brand-brain field (a prompt).
5. **Video craft add-ons for CE format skills:**
   - ASMR "selective audio" by category;
   - J/L-cut audio overlap;
   - gold-word caption jump;
   - WPM word-count rule;
   - gutter-break beat and sound arc (comic);
   - clay material table and metaphor pass;
   - abstract-to-object table (talking object);
   - aerial/ambient hook mechanics;
   - overlay and ffmpeg concat recipes.
6. **Static and PDP craft:**
   - scroll-stopper layout geometry and its 5 levers / 14 metaphors / 8 headline formulas;
   - brand.json banned-claims + verified-figures whitelist;
   - PDP laws "proof recurs" and "one hero grammar";
   - bundle cards with a value stack.
7. **Static sprint QA:**
   - photo FAIL/WARN/PASS;
   - prompts-only export;
   - archetype-to-render-mode table;
   - per-ad MANIFEST for single regeneration.
8. **Brief discipline:**
   - shame-removal check;
   - creative-state tally per stage;
   - the ">70% late-stage" rule;
   - PIVOT/ITERATE/SCALE/PROMO/HOLD modes;
   - hook diagnosis funnel with a ~$300 minimum spend.
9. **Shopify funnel data-pull prompt.** 365 days by month, then mobile vs desktop, then revenue by product. Feeds cro-audit.

## 6. Gaps in this inventory

- All 34 skills and the email zip were read in full and compared with CE. The zips were read in memory, never extracted. The images in references.zip were counted, not opened.
- 54 of 55 lesson videos have no transcript, so video-only lessons are described from their titles.
