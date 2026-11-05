// The blog (/blog): the articles, the guides already on the site, and the HTML for the index and each article.
// One module for the app (src/BlogPage.tsx), the prerenderer (scripts/prerender.mjs) and the sitemap
// (scripts/build-index.mjs), so crawlers and visitors read the same page.
// Each article is two files in src/content/blog: <slug>.json (title, description, lede, category, keywords,
// related) and <slug>.html (the body: h2 sections with ids, prompt boxes, a FAQ). test/blog.test.mjs checks both.
import { OPERATOR } from "./site-info-nav.mjs";

export const BLOG_PATH = "/blog";
export const BLOG_TITLE = "AI guides for getting real work done";
export const BLOG_DESCRIPTION = "Plain, step-by-step guides to using ChatGPT, Claude and Gemini for real business work: ads, websites, email, support, pricing, hiring and AI agents.";

export const CATEGORIES = [
  { id: "get-started", name: "Get started with AI", line: "Prompts, skills, agents and context: the basics of getting good work from your AI." },
  { id: "ads", name: "Ads and marketing", line: "Ad copy, tests, video scripts, product photos and Google Ads." },
  { id: "web", name: "Websites and search", line: "Landing pages, product pages, SEO and getting found in AI search." },
  { id: "content", name: "Email, social and content", line: "Welcome emails, cold emails, social posts and turning one piece into many." },
  { id: "business", name: "Run your business", line: "Customer support, meetings, pricing, competitors and hiring." },
];

// Guides that already have their own address. The blog lists them with the articles; their URLs stay the same.
export const GUIDES = [
  { href: "/train-your-own-ai-agent", category: "Get started with AI", title: "How to train your own AI agent, step by step",
    description: "Train ChatGPT, Claude or Gemini to do one job your way, with no code. Nine plain steps, five prompts and a free starter pack." },
  { href: "/me-md", category: "Get started with AI", title: "me.md: one file that tells every AI who you are",
    description: "Make one private file that tells ChatGPT, Claude and Gemini who you are. A template, three prompts to make it, and where to put it." },
  { href: "/how-it-works", category: "Get started with AI", title: "How AI skills, workflows and apps work",
    description: "What prompts, skills, workflows, agents and apps are, which one fits your job, and how to add each to your AI." },
  { href: "/api-and-mcp", category: "Get started with AI", title: "Connect your AI to AI Blocks with MCP or the API",
    description: "Connect ChatGPT, Claude, Codex or your own app once. Then your AI can find and get any skill or workflow when it needs one." },
  { href: "/industries", category: "Run your business", title: "AI help by business",
    description: "The jobs owners in online stores, software, local services and creator businesses bring to AI, with the skills and specialists for each." },
  { href: "/how-we-test", category: "Run your business", title: "How we test the AI job planner",
    description: "The requests we test our job planner on before every release, the scores, what we check and what we cannot check yet." },
];

// Reading order within each topic.
export const ORDER = [
  "chatgpt-prompts-for-work", "ai-prompts-vs-skills-vs-workflows", "give-ai-context-about-your-business", "make-ai-writing-sound-like-you",
  "stop-ai-making-things-up", "how-to-use-claude-skills", "what-is-mcp", "build-ai-workflow-without-code", "ai-agents-for-small-business",
  "analyse-spreadsheet-with-ai",
  "facebook-ad-copy-with-ai", "why-facebook-ads-stopped-working", "plan-ad-creative-tests", "video-ad-script-template", "turn-reviews-into-ads",
  "ai-product-photos", "google-ads-with-ai",
  "landing-page-checklist", "product-descriptions-that-sell", "seo-content-with-ai", "get-found-in-ai-search",
  "welcome-email-series", "cold-emails-with-ai", "social-media-content-calendar", "repurpose-content-with-ai",
  "ai-customer-support-replies", "ai-meeting-notes-action-items", "pricing-strategy-with-ai", "competitor-analysis-with-ai", "hiring-with-ai",
];

export const DEFAULT_DATE = "2026-11-05";
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const niceDate = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
export const postPath = (slug) => `${BLOG_PATH}/${slug}`;
export const categoryId = (name) => CATEGORIES.find(c => c.name === name)?.id ?? "get-started";

/** The words a reader reads in a body, for the reading time. */
export function bodyText(html) {
  return String(html).replace(/<(pre|script|style)[\s\S]*?<\/\1>/g, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim();
}
export const readingMinutes = (html) => Math.max(1, Math.round(bodyText(html).split(" ").length / 230));
/** The table of contents: every h2 with an id. */
export const sections = (html) => [...String(html).matchAll(/<h2[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)].map(m => ({ id: m[1], text: m[2].replace(/<[^>]+>/g, "").trim() }));

/** Articles in reading order; unknown slugs (not in ORDER) go last, by title. */
export function inOrder(posts) {
  const rank = (p) => { const i = ORDER.indexOf(p.slug); return i < 0 ? ORDER.length : i; };
  return [...posts].sort((a, b) => rank(a) - rank(b) || a.title.localeCompare(b.title));
}

/** One article page. `body` is the article's HTML; `posts` is every article's metadata, for the related links. */
export function blogPostHtml(post, body, posts, minutes = readingMinutes(body)) {
  const date = post.updated ?? post.published ?? DEFAULT_DATE;
  const toc = sections(body);
  const bySlug = new Map(posts.map(p => [p.slug, p]));
  const related = (post.related ?? []).map(s => bySlug.get(s)).filter(Boolean).slice(0, 3);
  return `<article class="blog-post">
<header class="post-hero">
<p class="eyebrow"><a href="${BLOG_PATH}">Blog</a> <span aria-hidden="true">/</span> <a href="${BLOG_PATH}#${categoryId(post.category)}">${esc(post.category)}</a></p>
<h1>${esc(post.title)}</h1>
<p class="lede">${esc(post.lede)}</p>
<p class="byline">By ${esc(OPERATOR)} · Updated <time datetime="${date}">${niceDate(date)}</time> · ${minutes} min read</p>
</header>
${toc.length ? `<nav class="toc" aria-label="On this page"><p class="toc-title">On this page</p><ol>${toc.map(s => `<li><a href="#${esc(s.id)}">${esc(s.text)}</a></li>`).join("")}</ol></nav>` : ""}
<div class="post-body">
<!--post-body-->${body}<!--/post-body-->
</div>
${related.length ? `<aside class="post-related" aria-labelledby="keep-reading"><h2 id="keep-reading">Keep reading</h2><ul class="blog-cards">${related.map(card).join("")}</ul></aside>` : ""}
<p class="post-back"><a href="${BLOG_PATH}">All articles and guides</a></p>
<p class="copy-status" id="copy-status" role="status" aria-live="polite"></p>
</article>`;
}

function card(p) {
  const href = p.href ?? postPath(p.slug);
  return `<li class="blog-card"><a href="${href}"><span class="blog-card-tag">${p.href ? "Guide" : `${p.minutes ?? ""}${p.minutes ? " min read" : "Article"}`}</span><span class="blog-card-title">${esc(p.title)}</span><span class="blog-card-desc">${esc(p.description)}</span></a></li>`;
}

/** The blog index: every topic with its articles, then the guides that live at their own address. */
export function blogIndexHtml(posts) {
  const ordered = inOrder(posts);
  return `<div class="blog-index">
<header class="blog-hero">
<p class="eyebrow">Blog</p>
<h1>${esc(BLOG_TITLE)}</h1>
<p class="lede">Step-by-step guides to using ChatGPT, Claude and Gemini for real work: ads, websites, email, support, pricing, hiring and AI agents. Every guide has prompts you can copy and the free skills that do the job.</p>
<nav class="blog-topics" aria-label="Topics">${CATEGORIES.map(c => `<a href="#${c.id}">${esc(c.name)}</a>`).join("")}</nav>
</header>
${CATEGORIES.map(c => {
    const items = [...ordered.filter(p => p.category === c.name), ...GUIDES.filter(g => g.category === c.name)];
    if (!items.length) return "";
    return `<section class="blog-topic" id="${c.id}" aria-labelledby="${c.id}-h"><h2 id="${c.id}-h">${esc(c.name)}</h2><p class="blog-topic-line">${esc(c.line)}</p><ul class="blog-cards">${items.map(card).join("")}</ul></section>`;
  }).join("\n")}
</div>`;
}

/** Article metadata for structured data (schema.org Article). */
export function articleLd(site, post, minutes) {
  const date = post.published ?? DEFAULT_DATE;
  const url = `${site}${postPath(post.slug)}`;
  return { "@type": "Article", "@id": `${url}#article`, headline: post.title, description: post.description, inLanguage: "en",
    author: { "@type": "Person", name: OPERATOR }, publisher: { "@id": `${site}/#org` }, datePublished: date, dateModified: post.updated ?? date,
    image: `${site}/og/default.png`, isAccessibleForFree: true, keywords: (post.keywords ?? []).join(", "), articleSection: post.category,
    timeRequired: `PT${minutes}M`, mainEntityOfPage: url };
}
