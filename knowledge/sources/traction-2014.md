# Traction source and adaptation record

Source: Gabriel Weinberg and Justin Mares, *Traction: A Startup Guide to Getting Customers*, 2014 first edition. Supplied privately as a 230-page PDF. The PDF and full extracted text remain outside published assets. This file and the skill files contain original operating notes rather than the book's prose, examples or case studies.

The edition uses a five-step Bullseye process: brainstorm, rank, prioritize, test and focus. Its search advertising chapter is misnumbered 8 in the supplied table of contents and chapter heading; it occupies the ninth chapter position. Page references below are one-based PDF file positions, not printed page numbers.

## Rebuilt ideas

- Consider an idea for every channel before excluding channels. Familiarity is not evidence of fit.
- Start with one measurable, dated traction goal. Find the important bottleneck on the path to that goal, and coordinate product work with customer acquisition learning.
- Rank channel ideas using the business's buyer, stage, constraints and evidence. Select a few small tests; the supplied edition suggests three promising channels. A smaller resource cap can justify fewer.
- Early tests resolve uncertainty about customer cost, reachable scale and customer fit. Testing a channel is different from fully optimizing or scaling it.
- Focus on a supported channel after testing. If no pilot is promising, use what failed to inform a new exploration round. Revisit the channel choice when stage, saturation, costs or customer needs change.
- Tracking must exist before interpreting tests. Slow channels and long sales cycles need a suitable follow-up horizon.

## Channel source map

| Channel | Chapter | PDF pages |
|---|---|---|
| Viral Marketing | 6 | 48–59 |
| Public Relations | 7 | 60–69 |
| Unconventional PR | 8 | 70–81 |
| Search Engine Marketing | 9, misnumbered 8 | 82–91 |
| Social and Display Ads | 10 | 92–101 |
| Offline Ads | 11 | 102–113 |
| Search Engine Optimization | 12 | 114–125 |
| Content Marketing | 13 | 126–133 |
| Email Marketing | 14 | 134–142 |
| Engineering as Marketing | 15 | 143–150 |
| Targeting Blogs | 16 | 151–156 |
| Business Development | 17 | 157–166 |
| Sales | 18 | 167–178 |
| Affiliate Programs | 19 | 179–187 |
| Existing Platforms | 20 | 188–196 |
| Trade Shows | 21 | 197–204 |
| Offline Events | 22 | 205–212 |
| Speaking Engagements | 23 | 213–219 |
| Community Building | 24 | 220–226 |

## SaaS additions and general mode

The source concerns startups broadly. SaaS is the default adaptation requested for this library. The profile distinguishes a self-serve product from a product sold through people, and a user from a buying account. Each pilot follows useful product activation, paid conversion and retained customer quality. Subscription prices alone do not establish average revenue, lifetime value or gross margin.

The measurement reference distinguishes cash-only cost from fully loaded CAC, handles zero paid customers without inventing a denominator, matches monthly units in payback calculations and separates attributed demand from incremental demand. These explicit definitions and the current-source checks are library additions, not claims that historical platform settings remain correct.

General-business mode keeps the same 19 skills and decision process. It substitutes meaningful first use, enquiry or order, order-level contribution, delivery capacity and repeat-purchase cycles for software-specific assumptions.

## Maintenance and verification

Maintain the channel notes in `tools/lib/traction-channels.mjs` and generation rules in `tools/build-traction.mjs`. Rebuild with `node tools/build-traction.mjs`. Catalogue entries are generated original content with source credit and `example_pending: true`; structural and browser tests do not award model-tested badges.

The app prepares an AI brief and downloads complete skill packs. It does not call a model, scrape the submitted product URL or promise instant recommendations inside the website. After attaching the pack to a browsing-capable AI, the workflow reads the product, compares all 19 channels, prepares only selected pilots and waits for observed results before a focus verdict. Agents are reusable instruction files; installing them does not create a recurring job or authorize external actions.
