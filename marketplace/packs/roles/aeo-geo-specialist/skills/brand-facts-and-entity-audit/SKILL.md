---
name: brand-facts-and-entity-audit
description: "Checks what AI systems say about a brand against the brand's true facts, finds the sources behind wrong or missing facts, and fixes the brand's entity signals: a canonical facts page, Organization structured data with sameAs links, consistent profiles (Google Business Profile, Bing Places, LinkedIn, directories, review sites), and the earned media AI engines cite for the category. Use when AI answers get a brand's prices, products, locations or history wrong, confuse it with another company, or leave it out of category answers where it belongs."
---

# Brand facts and entity audit

AI systems describe a brand by combining what many sources say. If the brand's own pages are vague, its profiles disagree, or the most-cited third-party pages are out of date, the answers will be wrong or the brand will be left out. This skill finds the errors, traces each one to its source, and builds the consistent set of facts that engines can confirm.

## When to use

- An AI answer states a wrong price, product, location, founder, date or policy.
- Engines confuse the brand with a similarly named company.
- The brand is missing from category answers where its rivals appear.
- After a rebrand, merger, price change or move.

## What you need

**Access:** level 1 to build the facts sheet and code the answers. Level 2 to save fixes as drafts in your CMS. Level 3 to publish fixes on your own site and update the profiles you control (steps 5 and 7), within your limits. Correction requests to other sites go out at level 3 only to the contacts you approved.

1. **The true facts:** legal and trading names, founding date, locations and service areas, leadership, products and services, price ranges, key policies (returns, guarantees), certifications and awards, official social and profile URLs. The client signs this off.
2. **What AI says:** answers to 10 to 20 brand questions ("What is [brand]?", "Is [brand] good for [use]?", "How much does [brand] cost?", "[brand] vs [rival]") from each engine that matters, with cited URLs. Run each at least twice.
3. **The profiles:** URLs for Google Business Profile, Bing Places, LinkedIn, main directories and review sites, app stores, marketplaces, Wikipedia or Wikidata entries if they exist.
4. **Category answers** from the ai-answer-visibility-audit skill, if available.

## Steps

### 1. Build the facts sheet
One table: fact | true value | where it is stated on the brand's site | last updated. If a fact is not stated anywhere on the site, that is the first gap: engines cannot confirm what the brand never says.

### 2. Code what AI says
For each answer, list every fact stated about the brand and mark it correct, wrong, outdated, missing or confused (mixed up with another entity). Note the engine, date and cited URLs.

### 3. Trace each error to a source
For every wrong or outdated fact, check the URLs the engine cited, then search for the wrong value. Common sources: the brand's own old pages, PDFs or press releases; outdated directory listings; old reviews; comparison articles; forum threads; data aggregators; a similarly named company's site.

### 4. Check the brand's own entity signals
- **Canonical facts page:** an About or company page that states the facts plainly in HTML text, with dates.
- **Organization structured data** on the home or About page: name, alternateName, url, logo, description, sameAs links to official profiles, address, contact details and identifiers where they apply. Google lists no required properties and says the markup helps it tell organisations apart. Use the most specific type (for example a LocalBusiness subtype).
- **Consistency:** the same name, description, address, phone and key facts across the site and profiles.
- **Disambiguation:** if another entity shares the name, say clearly on the site who the brand is and is not (location, industry, founding year), and use sameAs links.

### 5. Check profiles and directories
Compare each profile with the facts sheet. Fix what the brand controls (Business Profile, Bing Places, LinkedIn, app store pages): at level 3 within the client's limits, logging each change, or as a change list for the client. For directories and aggregators, use their correction process. For Wikipedia and Wikidata, follow their rules: brand staff should propose changes on talk pages with independent sources rather than edit directly.

### 6. Map the earned media gap
From category answers, list the third-party domains engines cite most for the brand's category. For each: does it mention the brand, is it accurate, and is there an honest route in (product review submission, expert comment, data for a story, an updated listing)? Studies find AI engines lean on independent sources and that brand mentions across the web correlate with AI visibility, so these pages often matter more than the brand's own.

### 7. Prioritise and fix
Rank fixes: wrong facts on the brand's own site first (fully in its control), then profiles it controls, then high-citation third-party sources, then the rest. Plan a re-check after sources update and engines re-crawl (often weeks for third-party pages).

## Checks before you ship

- The client has approved the facts sheet.
- Every wrong fact has a traced source or is marked "source not found".
- Structured data matches visible content and the facts sheet.
- No fake reviews, sock-puppet profiles or undisclosed paid mentions.
- Wikipedia and community sites are approached through their own rules.
- Re-check dates are set.

## Output format

1. Facts sheet (approved).
2. Errors table: engine | question | what it said | true fact | likely source | fix | owner.
3. Entity checklist: canonical page, structured data, sameAs, profiles, disambiguation, each with status.
4. Earned media table: domain | times cited in category answers | mentions brand? | accurate? | route in | priority.
5. Fix plan with dates and the re-check plan.

## Example of good output (made for this kit, not a real client)

> | Engine | Question | What it said | True fact | Likely source | Fix |
> |---|---|---|---|---|---|
> | ChatGPT search, 2026-11-03 | How much does the brand charge for a service? | "From £69" | £89 since April 2026 | The brand's own 2024 price PDF, still indexed; cited in 2 of 2 runs | Remove the PDF, 301 to the pricing page, state the price in HTML with a date |
> | Perplexity, 2026-11-03 | Where is the brand based? | "Bradford" | Leeds since 2023 | Old directory listing | Update the listing via its correction form |
> | Google AI Mode, 2026-11-04 | Is the brand Gas Safe registered? | Not mentioned | Registered | Registration not stated on the site | Add the registration number to the About page and Organization markup description |
>
> **Earned media:** two review sites appear in 9 of 12 category answers; neither lists the brand. Both accept installer submissions; submit with 2026 prices and certification.
