---
name: nextjs-seo-indexing
description: "Fix SEO indexing issues, crawl budget problems, and Search Console coverage errors for Next.js apps. Covers canonical tags, noindex audits, sitemap health, static rendering, and internal linking."
category: seo
risk: safe
source: self
source_type: self
date_added: "2026-05-31"
author: Whoisabhishekadhikari
tags: [seo, indexing, nextjs, search-console, crawl-budget, canonical, sitemap]
tools: [claude, cursor, gemini, claude-code]
version: 1.0.0
---

# Next.js SEO Indexing & Crawl Budget Skill

Fix Google Search Console coverage issues, canonical problems, sitemap errors, and crawl budget waste in Next.js apps.

---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use

- Use when a Next.js site has Google Search Console coverage issues such as duplicate canonicals, accidental noindex, crawl waste, or discovered-but-not-indexed URLs.
- Use when auditing sitemap, robots.txt, redirect, internal-linking, or static-rendering problems before an SEO release.
- Use when you need framework-specific examples for Next.js App Router metadata, `generateMetadata`, `robots.js`, and sitemap routes.

---

## Understanding Search Console Coverage States

| Status | Meaning | Fix |
|--------|---------|-----|
| Crawled – not indexed | Google crawled but chose not to index | Improve content quality + canonical + internal links |
| Duplicate without canonical | Multiple URLs serve same content, no canonical | Add explicit canonical to the preferred URL |
| Excluded by noindex | `noindex` tag present | Remove noindex if page should be indexed |
| Duplicate, Google chose different canonical | Google prefers a different URL than you specified | Align canonical with the URL Google naturally picks |
| Alternative page with proper canonical | Correct — non-preferred duplicate pointing to canonical | Expected behavior, not a problem |
| Not found 404 | Page deleted or URL changed | Add redirect or restore page |
| Discovered – not indexed | Google knows it exists but hasn't crawled it | Improve internal linking + crawl budget |
| Page with redirect | Redirect chain or redirect to wrong target | Shorten redirect chain, verify destination |

---

## Step 1 — Canonical Audit

### Next.js App Router (metadata export)
```js
// app/blog/my-post/page.js
export const metadata = {
  title: 'My Post Title',
  alternates: {
    canonical: 'https://www.yourdomain.com/blog/my-post',
  },
};
```

### Next.js App Router (generateMetadata)
```js
// Next.js 15 and later: params is a Promise, so await it.
// Next.js 14 and earlier: read params.slug directly, with no await.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    alternates: {
      canonical: `https://www.yourdomain.com/blog/${slug}`,
    },
  };
}
```

### Common canonical mistakes to fix:
```js
// ❌ WRONG — relative URL
canonical: '/blog/my-post'

// ❌ WRONG — missing trailing slash inconsistency  
// (pick one and stick with it sitewide)

// ✓ CORRECT — absolute URL, consistent scheme + subdomain
canonical: 'https://www.yourdomain.com/blog/my-post'
```

---

## Step 2 — Noindex Audit

Find pages that are accidentally noindexed:

```bash
# Search for noindex in metadata (rg needs ripgrep installed; if you do not have it, use the grep line below)
rg -n --glob '*.{js,ts,jsx,tsx}' 'noindex|robots.*noindex' app pages

# Check layout.js — a noindex here affects ALL pages
grep -n "robots" app/layout.js

# Same search with plain grep, no install needed
grep -rnE "noindex" app pages --include=*.js --include=*.jsx --include=*.ts --include=*.tsx
```

In Next.js App Router, `robots` in the root layout applies globally. Only set it there if you want the whole site affected.

```js
// app/layout.js — only set robots if you need sitewide control
export const metadata = {
  // ✓ Allow indexing
  robots: { index: true, follow: true },
  // ❌ This would noindex the entire site:
  // robots: { index: false }
};
```

---

## Step 3 — Sitemap Health

### Verify sitemap routes return 200 + valid XML
```bash
curl -sI https://www.yourdomain.com/sitemap.xml | grep -i "content-type\|status"
curl -s https://www.yourdomain.com/sitemap.xml | head -20
```

### Next.js App Router sitemap (recommended pattern)
```js
// app/sitemap.js
export default async function sitemap() {
  const baseUrl = 'https://www.yourdomain.com';
  
  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ];
  
  // Dynamic pages (fetch from DB or CMS)
  const posts = await getPosts(); // your data fetch
  const dynamicPages = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
  
  return [...staticPages, ...dynamicPages];
}
```

### Multiple sitemaps (sitemap index)
```js
// app/sitemap-tools/sitemap.js  
// app/sitemap-blog/sitemap.js
// Each returns an array of URL entries
```

---

## Step 4 — Static Rendering Verification

Pages must be statically generated (or SSR with metadata in HTML) for Google to see SEO tags.

```bash
# Check build output — pages should show ● (static) not λ (dynamic)
npm run build 2>&1 | grep -E "○|●|λ|/blog|/tools"
```

```text
○  /about             (static)
●  /blog/[slug]       (SSG)  ← good
λ  /api/data          (serverless) ← expected for APIs
```

If important pages are `λ` (fully dynamic with no static generation), add:

```js
// app/blog/[slug]/page.js
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(post => ({ slug: post.slug }));
}
```

---

## Step 5 — Internal Linking Audit

Pages with zero internal links are rarely indexed. Every important page should be reachable from:
1. Homepage or navigation
2. A sitemap
3. At least one other content page

```bash
# Find pages that have no inbound links from other pages
# (manual check — grep for the slug across all files)
grep -r "/blog/my-orphan-post" --include=*.js --include=*.ts --include=*.jsx --include=*.tsx --include=*.md . | grep -v "sitemap\|the-page-itself"
```

---

## Step 6 — Redirect Audit

```bash
# Find all redirects in Next.js config
grep -A 3 "redirects" next.config.js

# Check for redirect chains (A → B → C — should be A → C)
# Test a suspected chain:
curl -sI https://www.yourdomain.com/old-url | grep -i location
```

```js
// next.config.js — keep redirects flat (no chains)
async redirects() {
  return [
    {
      source: '/old-url',
      destination: '/new-url', // Must NOT itself redirect
      permanent: true, // 308 for SEO
    },
  ];
}
```

---

## Step 7 — robots.txt Check

```bash
curl -s https://www.yourdomain.com/robots.txt
```

```text
# ✓ Good
User-agent: *
Allow: /
Sitemap: https://www.yourdomain.com/sitemap.xml

# ❌ Bad — disallows crawling of important content
Disallow: /blog/
Disallow: /tools/
```

```js
// app/robots.js (Next.js App Router)
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://www.yourdomain.com/sitemap.xml',
  };
}
```

---

## Indexing Checklist

- [ ] All important pages have absolute canonical URLs
- [ ] No important pages accidentally noindexed
- [ ] Sitemap routes return 200 with valid XML
- [ ] Sitemap submitted to Google Search Console
- [ ] Important pages statically generated (●) in build output
- [ ] No redirect chains (A→B→C should be A→C)
- [ ] robots.txt allows important content
- [ ] Every important page has ≥1 internal inbound link
- [ ] `generateStaticParams` added for dynamic routes with known slugs

## Next steps

After you deploy the fixes, run URL Inspection in Google Search Console on the affected URLs and ask for a new crawl. Then check the Pages report again in a few days. If pages are still not indexed, the cause may be thin or copied content, so run a general SEO audit.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Technical SEO auditor](https://useaiblocks.com/skills/technical-seo-auditor).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Limitations

- Does not guarantee Google will index a page; final indexing decisions remain with the search engine.
- Requires access to the codebase, deployed URLs, and ideally Google Search Console data for confident diagnosis.
- Treat recommendations that change URL structure, redirects, or canonical policy as production-impacting and review them before deployment.
