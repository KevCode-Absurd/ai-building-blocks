---
name: cms-collection-plan
description: "Plans the CMS for a small site in Webflow, Framer or Wix (and Squarespace collection pages): which collections to make, each field with its type and rules, how collections link, which template page and list sections use them, sample items, and a check against the plan's page and item limits. Use before building a blog, case studies, team, services, locations or events section, or when an existing CMS has grown messy."
---

# CMS collection plan

A CMS saves work only if the collections and fields are planned before the first item goes in. Renaming or retyping fields after 40 items is slow and risky. This skill plans it once, so the client's editor fills in a form instead of designing a page.

Access levels for this skill: planning needs level 1 (read the current CMS or screenshots). Creating collections, fields and draft or staged items needs level 2. Publishing items or the site needs level 3, within the client's limits. Deleting collections, fields or items always needs a fresh yes.

## When to use

- A Webflow, Framer or Wix site that needs a blog, case studies, team, services, locations or events.
- Moving content from pages into a CMS so the client can add items without design work.
- A CMS with duplicate fields, unused collections or inconsistent items.

## What you need

- **Access I have**: the level and limits per tool, written down. Until then, level 1.
- The builder and plan. Check the plan's limits on pages, collections and items on the vendor's pricing page; as of 6 November 2026, Framer Basic allows 2 CMS collections and 1,000 items, and Pro 10 collections and 2,500 items before add-ons.
- The content types the client wants and a few real examples of each (two case studies, three team members).
- Who will add items, how often, and whether anyone reviews before publishing.
- Any filters or sorting visitors need (by service, location, date).

## Steps

1. **List content types.** One collection per kind of thing that repeats and shares a layout. If there will only be a handful of items that rarely change, a normal page is simpler.
2. **Define fields per collection.** For each: field name, type (plain text, rich text, image, date, number, option, switch, link, reference to another collection), required or optional, and help text for the editor. Keep names in the client's words.
3. **Plan references.** Link collections instead of retyping: a case study references a service and a team member; a team member lists services. Note one-to-one and one-to-many links.
4. **Plan SEO fields.** A slug rule, a title field and a short description field per item, so every template page gets a unique title and meta description. Add an alt text field next to every image field.
5. **Plan the template page.** For each collection with its own pages: sections top to bottom, which field fills each element, and what shows when an optional field is empty.
6. **Plan list sections.** Where items appear on other pages (home, service pages), the filter, sort order and how many items show.
7. **Write three sample items** using the client's real facts, or [add] for gaps. Sample items show whether the fields work before anyone fills 40 of them.
8. **Check limits and growth.** Count pages, collections and items now and in a year against the plan. Flag if an upgrade will be needed; buying it stays with the client.
9. **Write the editor guide.** Field by field: what to type, image size, character guide for titles and descriptions, and the publish step. In Webflow, note that a site-wide publish pushes every staged item live at once, so drafts that aren't ready should stay drafts.
10. **Build (level 2) and publish (level 3).** At level 2, create the collections, fields and sample items as drafts or staged items. At level 3, after the client approves the samples, publish within the agreed limits and log each action.

## Checks

- Every collection repeats and shares a layout; nothing that should be a page is a collection.
- Every field has a type, a required or optional flag and help text.
- References replace retyped data.
- Every image field has an alt text field; every collection with pages has title, description and slug fields.
- Item and collection counts fit the plan, with growth noted.
- Empty optional fields don't leave blank boxes on the template page.
- Nothing published or deleted outside "Access I have"; actions logged.

## Output format

1. **Collections table**: collection, purpose, has its own pages (yes or no), expected items now and in a year.
2. **Fields table per collection**: field, type, required, help text.
3. **References**: which collection links to which, and how.
4. **Template page plan** and **list section plan**.
5. **Three sample items** per collection.
6. **Limits check** and **editor guide**.

## Example of good output (short)

*Northgate Studio is a made-up business used only to show the format: a four-person design agency on Webflow with case studies, team members and a blog.*

**Collections**

| Collection | Purpose | Own pages | Items now / in a year |
|---|---|---|---|
| Case studies | Show past work by service | Yes | 6 / 15 |
| Team | Who does the work | No | 4 / 6 |
| Services | Group work and filter case studies | Yes | 3 / 4 |
| Blog posts | Share know-how | Yes | 0 / 24 |

**Fields: Case studies**

| Field | Type | Required | Help text |
|---|---|---|---|
| Name | Plain text | Yes | Client and project, e.g. "[add client] website refresh" |
| Slug | Slug | Yes | Lowercase words with hyphens |
| Service | Reference to Services | Yes | Pick one |
| Lead designer | Reference to Team | No | Who ran the project |
| Summary | Plain text | Yes | One or two sentences; also used as the meta description |
| Hero image | Image | Yes | 1,600 x 900 px, under 300 KB |
| Hero image alt | Plain text | Yes | Describe what the image shows |
| Story | Rich text | Yes | Problem, what we did, result in the client's words |
| Result figure | Plain text | No | Only a number the client can prove, else leave empty |

**Limits check:** 3 collections with pages plus about 49 items in a year; well within the plan the client named. **Open question:** who approves case studies before they are published?
