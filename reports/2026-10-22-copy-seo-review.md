# Copy and SEO release review — 22 October 2026

Scope: homepage, composer, content intake, minds and shared prerender/metadata machinery. Applied the repository's proof-backed-sales-copy-writer, on-page-seo-tuner and technical-seo-auditor skills. This is a source review and release checklist, not a search-ranking or Core Web Vitals measurement.

Assumed audience: people who want reusable AI instructions and editable workflows for a real task. Assumed target queries: homepage “free AI skills”; composer “custom AI workflow builder”. No keyword-volume, competitor, Search Console or conversion evidence was supplied.

## Findings and implemented replacements

- Important: “Use AI like the top 1%” and “Turn hours of work into minutes” have no supporting benchmark in the reviewed sources. Replace numerical promises with the product's demonstrated capability.
- Proposed homepage title: “Free AI Skills & Custom Workflow Builder | AI Blocks” (52 characters).
- Proposed description: “Explore free AI skills, prompts and workflows. Build a custom workflow, edit the steps and download a pack to run in your AI. Try free browser tools too.” (153 characters).
- Proposed H1: “Build AI workflows for your work”. Proposed supporting copy: “Find a skill for your next task, or connect several into a workflow. Edit the steps, download the pack and run it in your own AI.”
- Important: homepage builder intro implies the website does the whole job. The implementation prepares files. Suggested heading: “Connect skills into a workflow you can run”; explain choosing a workflow, reviewing instructions and bringing the downloaded folder to the user's AI.
- Important: prerendered `/from-a-source` claims any link or file can be converted directly. IntakePage.tsx actually requires pasted source text and downloads a handoff pack. Suggested title: “Create AI skills from articles, transcripts and notes”; describe a source pack that the user's AI turns into skills.
- Important: prerendered workflow lead says “It runs several skills in a row”. Suggested replacement: “It guides your AI through several skills in order, passing each step's output to the next.”
- Existing composer heading and summary already explain a custom workflow, connected skills, checks and an editable download. Keep the distinction between composing a plan and executing it.
- Existing “Over 300 minds” is supported by the current catalogue's 305 minds. Prefer a generated count where that claim is maintained.
- Important: the old homepage title is repeated in fallback constants across several route components, while route metadata is now authoritative. Update all exact fallback constants when changing the homepage title to prevent flashes of inconsistent metadata.

## On-page review

| Dimension | Source assessment | Release verification |
| --- | --- | --- |
| Titles | Needs work: unsupported homepage claim and duplicated fallback strings | Compare built HTML, SPA, Open Graph and Twitter titles |
| Descriptions | Needs work: unsupported time savings; intake overpromises input handling | Check unique descriptions and outcome clarity |
| Headings | Homepage source has one H1 and section H2s; readable hierarchy | Check one rendered H1 after navigation |
| Body | Needs work: separate preparing instructions from running them | Review final hero and builder copy on mobile |
| Internal links | Homepage links library/builder; job hubs and related-page links exist | Fresh crawl for broken links and orphan pages |
| Media | Globe is decorative and aria-hidden; app screenshot images have alt/dimensions | Check images load and layout stays stable |
| URLs | Stable descriptive kind/slug URLs; canonical repair exists | Check 301 repairs and real unknown-page 404s |
| Schema | JSON-LD includes Organization, WebSite, WebPage and BreadcrumbList | Validate generated JSON-LD against visible content |

## Technical review

Source foundations are present: robots allows public content and references a sitemap; generated sitemaps use production canonical URLs; private spaces/unknown pages have noindex; prerender creates crawler-readable content and per-route metadata; worker preserves a real 404. No URL migration is proposed.

Unverified: current public HTML/status/headers (web access to useaiblocks.com failed), Search Console indexing, full post-change crawl, staging response noindex, HTTPS/HSTS live headers, schema validator, field Core Web Vitals and mobile interaction results. Existing dist predates this combined review and is not release evidence.

Release owner should run the fresh build, `npm run seo`, `npm run crawl` against that build, then inspect `/`, `/compose`, `/minds`, `/from-a-source`, `/space` and an unknown URL on staging and production. Confirm HTML/SPA metadata agree, private pages stay noindex and staging is excluded from indexing.

Proof placed: downloaded editable steps, skills and checks are observable in composer/builder; source pack behavior is documented in IntakePage.tsx. Assumed: audience and target queries above. Placeholders: none proposed for publishable copy. CHECKS MISSED: live indexing/performance/validation evidence listed above; no ranking or time-saving promises made.

Implementation status: the publisher delegated narrowly targeted copy constants after the review. Implemented the exact replacements above in App Home/hero/builder intro, index metadata/social descriptions, prerender home/intake/workflow lead and fallback homepage TITLE/HOME_DESC constants. Retained “Over 300 minds”; the current catalogue supports it. No Header, Globe, Builder, BuilderParts, CSS, metadata JSON rendering/sync hooks, icons, analytics, bootloader, routes, featured tools or typewriter timing was changed by this review.

Final builder heading: “Connect skills into a workflow you can run”. Final builder description: “Choose skills or start from a ready workflow. Review the steps, download one folder and give it to your AI to work through.” Final intake description: “Paste source text and download a handoff pack. Your AI uses it to turn the source's method into reusable skills and a workflow you can review.” Final workflow lead sentence: “It guides your AI through several skills in order, passing each step's output to the next.” The homepage title, description, H1 and lede are the exact proposed strings above, now implemented. Static homepage copy uses the same lede and links directly to composer and browser tools.

Checks: `node --check scripts/prerender.mjs` and `npx tsc -b` pass from site/. No build, catalogue regeneration, commit or deployment ran in this review. Fresh final build/live gates remain with the publisher.

Reference: [Google Search Central SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), checked during this review for people-first copy, descriptive titles/links and crawlable content. Character ranges are writing heuristics, not ranking guarantees.

## Source snapshot SHA-256

Hashes captured after copy verification; later changes by the coordinated release owner may change them.

| Source | SHA-256 |
| --- | --- |
| site/src/App.tsx | 0CC4A17F86B5A86D2E93CEE3085040C58C4A0B6D74C901A75E7FA7A80A585557 |
| site/index.html | FC69EBF21089F2CD7185B1390FD4CAE1E4B6DE35BC888187DD4F4537979A103C |
| site/scripts/prerender.mjs | 79A8F1C7A35125E981A11D502DF055E6CD0E1382186A67FD9F18D9894FA1494B |
| site/src/BlockPage.tsx | 740EEF8E36F82046FCE311392E0E3A23ACA7AF4EA7E95E85EFC600272176FF23 |
| site/src/HowItWorks.tsx | 4D975B07016FA2FC62758E86B94785B1BCBF603EEFB39F7DD878DEDEF70D1572 |
| site/src/MindsPage.tsx | B141C4FDDA85C473586B6D947B03FFFB4BEC4395026145A42BC6EC4D4B4D8353 |
| site/src/apps/AppsPage.tsx | BC0B9F85EF1605F34E576A346E8A70774361FE560BB1CE213B3BE61A99D43889 |
| site/src/aitools/AiToolsPage.tsx | 9798D4F18EF514311D79909469795E0D42485237FAFF666C7CDD5818CC06FF46 |
| site/src/space/SpacePage.tsx | BE873D2C3ADCFDFEFA990CA0C10F270C06AE1DFAA353BCFB260D0AC72BC6C88E |
| site/src/tools/ToolsPage.tsx | 09979EAF202092E85F8560335394A6FB6F35F7A677221E21A38D3CAD5ADBB70E |
