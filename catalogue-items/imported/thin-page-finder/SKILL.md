---
name: shopify-admin-page-content-audit
role: store-management
description: "Read-only: lists all pages and blog posts, flags empty or short content and missing SEO fields."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - pages:query
  - articles:query
status: stable
compatibility: Claude Code, Cursor, Codex, Gemini CLI
---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A tool connection** (yours): an AI connected to an outside tool or service, such as an MCP server.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a tool connection. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Purpose
Scans all store pages and blog articles for missing or thin content (short body, missing SEO title/description, empty body). Thin pages can rank poorly and give customers little to read. Read-only — no mutations. Complements `seo-metadata-audit` (which covers products and collections; on AI Blocks this is the Store SEO gap finder).

## Prerequisites
- A paid or account-based AI tool that can run commands (a plain chat cannot run this), and a Shopify store you can sign in to as staff.
- Authenticated Shopify CLI session (the `read_content` scope lets the skill read pages and blog posts, and change nothing): `shopify store auth --store <domain> --scopes read_content`
- API scopes: `read_content`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| min_body_length | integer | no | 100 | Flag pages with body content shorter than this (characters) |
| include_unpublished | bool | no | false | Also audit unpublished pages and articles |
| format | string | no | human | Output format: `human` or `json` |

## SEO fields
The SEO title and description are read from the `global.title_tag` and `global.description_tag` metafields, where Shopify keeps them by default. If your store or an SEO app keeps them somewhere else, "missing" flags can be wrong. Spot-check a few flagged pages in Shopify before you act on the list.

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time.

## Workflow Steps

1. **OPERATION:** `pages` — query
   **Inputs:** `first: 250`, select `title`, `body`, `bodySummary`, `seo`, `publishedAt`, pagination cursor
   **Expected output:** All pages with content and SEO data

2. **OPERATION:** `articles` — query
   **Inputs:** `first: 250`, select `title`, `body`, `seo`, `publishedAt`, `blog { title }`, pagination cursor
   **Expected output:** All blog articles with content data

3. Flag: empty body, body < `min_body_length`, missing SEO title, missing SEO description

## GraphQL Operations

```graphql
# pages:query — uses the api_version set in the front matter
query PageContentAudit($after: String) {
  pages(first: 250, after: $after) {
    edges {
      node {
        id
        title
        handle
        publishedAt
        bodySummary
        body
        seoTitle: metafield(namespace: "global", key: "title_tag") { value }
        seoDescription: metafield(namespace: "global", key: "description_tag") { value }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

```graphql
# articles:query — uses the api_version set in the front matter
query ArticleContentAudit($after: String) {
  articles(first: 250, after: $after) {
    edges {
      node {
        id
        title
        handle
        publishedAt
        body
        summary
        seoTitle: metafield(namespace: "global", key: "title_tag") { value }
        seoDescription: metafield(namespace: "global", key: "description_tag") { value }
        blog {
          id
          title
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: Page Content Audit                   ║
║  Store: <store domain>                       ║
║  Started: <YYYY-MM-DD HH:MM UTC>             ║
╚══════════════════════════════════════════════╝
```

**After each step**, emit:
```
[N/TOTAL] <QUERY|MUTATION>  <OperationName>
          → Params: <brief summary of key inputs>
          → Result: <count or outcome>
```

**On completion**, emit:

For `format: human` (default):
```
══════════════════════════════════════════════
PAGE CONTENT AUDIT
  Pages scanned:    <n>  |  Issues: <n>
  Articles scanned: <n>  |  Issues: <n>

  Issues:
    Page: "<title>" — empty body
    Article: "<title>" — missing SEO description
  Output: content_audit_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "page-content-audit",
  "store": "<domain>",
  "pages_scanned": 0,
  "articles_scanned": 0,
  "issues_found": 0,
  "output_file": "content_audit_<date>.csv"
}
```

## Output Format
CSV file `content_audit_<YYYY-MM-DD>.csv` with columns:
`type`, `id`, `title`, `handle`, `published_at`, `body_length`, `has_seo_title`, `has_seo_description`, `issue`

The `issue` column holds one or more of these flags: "empty body" (nothing to read), "short body" (under `min_body_length` characters), "missing SEO title" and "missing SEO description". Fix empty bodies first, then short ones, then the missing search fields.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Store SEO completeness checker](https://useaiblocks.com/skills/store-seo-gap-finder).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| No pages or articles | Minimal store | Exit with 0 results |

## Best Practices
- The default `min_body_length` is 100 characters, which catches near-empty pages. Many SEO guides call a page under about 300 words thin; that is about 1,500 characters. This is a rule of thumb, not a search-engine rule. Set `min_body_length: 1500` for a stricter check.
- The About, FAQ, and Contact pages are high-trust pages that should never be empty — prioritize these.
- Run after any CMS migration or theme change that may have wiped page content.
- Pair with `seo-metadata-audit` (on AI Blocks, the Store SEO gap finder) for a complete SEO audit covering products, collections, pages, and blog articles in one workflow.
