import { useEffect, useRef, useState, type MouseEvent } from "react";
import { BLOG_PATH, GUIDES_PATH, blogIndexHtml, blogPostHtml, guidesIndexHtml } from "./lib/blog.mjs";
import { Link, navigate } from "./lib/router";
import { isStaticPage } from "./lib/site-nav.mjs";
import { initialPageHtml } from "./lib/public-opening";
import { StartupReady } from "./StartupReady";
import "./blog.css";

/** /blog, /guides and /blog/<slug>: the blog index, the guides page and each article. The HTML comes from src/lib/blog.mjs, the same code
 *  scripts/prerender.mjs uses, so the page a crawler reads matches this one. Article bodies load one at a time, except
 *  the one the visitor opened first: its text is already in the built page, so it draws at once and nothing moves. */
type Post = { slug: string; title: string; description: string; lede: string; category: string; keywords?: string[]; related?: string[]; minutes?: number; published?: string; updated?: string };
const POSTS = Object.values(import.meta.glob<Post>("./content/blog/*.json", { eager: true, import: "default" }));
const BODIES = import.meta.glob<string>("./content/blog/*.html", { query: "?raw", import: "default" });
// The article text the built page arrived with, between the markers blogPostHtml puts around it.
const builtBody = (path: string) => initialPageHtml(path).match(/<!--post-body-->([\s\S]*?)<!--\/post-body-->/)?.[1] ?? null;

export default function BlogPage({ path }: { path: string }) {
  const slug = path === BLOG_PATH || path === GUIDES_PATH ? null : path.slice(BLOG_PATH.length + 1);
  const post = slug ? POSTS.find(p => p.slug === slug) : undefined;
  const [body, setBody] = useState<string | null>(() => (post ? builtBody(path) : null));
  const [failed, setFailed] = useState(false);
  const main = useRef<HTMLElement>(null);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  useEffect(() => () => { timers.current.forEach(clearTimeout); timers.current.clear(); }, []);
  useEffect(() => {
    if (!post || body !== null) return;
    const load = BODIES[`./content/blog/${post.slug}.html`];
    if (!load) { setFailed(true); return; }
    let live = true;
    load().then(html => { if (live) setBody(html); }).catch(() => { if (live) setFailed(true); });
    return () => { live = false; };
  }, [post]);
  // A link to a section (/blog/x#faq) lands there once the article has drawn.
  useEffect(() => {
    if (!body || !location.hash) return;
    requestAnimationFrame(() => { try { document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView(); } catch { /* bad hash */ } });
  }, [body]);

  async function click(event: MouseEvent<HTMLElement>) {
    const target = event.target as Element;
    const link = target.closest<HTMLAnchorElement>("a[href]");
    const href = link?.getAttribute("href") ?? "";
    if (link && href.startsWith("/") && !href.startsWith("//") && !link.hasAttribute("download") && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0) {
      const to = href.split(/[?#]/)[0];
      if (!/\.[a-z0-9]+$/i.test(to) && !isStaticPage(to)) { event.preventDefault(); navigate(href); }
      return;
    }
    const button = target.closest<HTMLButtonElement>("button[data-copy]");
    const root = main.current;
    if (!button || !root?.contains(button) || button.disabled) return;
    const source = root.querySelector<HTMLElement>(`[id="${button.dataset.copy}"]`);
    const status = root.querySelector<HTMLElement>("#copy-status");
    if (!source) return;
    const label = button.textContent;
    button.disabled = true;
    try {
      await navigator.clipboard.writeText(source.textContent?.trim() ?? "");
      if (status) status.textContent = "Prompt copied. Paste it into ChatGPT, Claude or Gemini.";
      button.textContent = "Copied";
    } catch {
      const range = document.createRange();
      range.selectNodeContents(source);
      const selection = window.getSelection();
      selection?.removeAllRanges(); selection?.addRange(range);
      if (status) status.textContent = "Text selected. Use your device's Copy command.";
      button.textContent = "Text selected";
    }
    const timer = setTimeout(() => { button.textContent = label; button.disabled = false; timers.current.delete(timer); }, 1800);
    timers.current.add(timer);
  }

  if (slug && (!post || failed)) return <main className="wrap blog-page" data-testid="blog-page"><StartupReady /><div className="blog-missing"><h1>{post ? "This article didn't load" : "This article doesn't exist"}</h1><p>{post ? "Check your connection, then reload the page." : "The address may have changed."}</p><Link to={BLOG_PATH} className="btn btn-dark btn-sm">See all articles and guides</Link></div></main>;
  if (slug && body === null) return <main className="wrap blog-page" data-testid="blog-page"><p role="status" className="small">Opening the article…</p></main>;
  const html = post ? blogPostHtml(post, body ?? "", POSTS, post.minutes) : path === GUIDES_PATH ? guidesIndexHtml(POSTS) : blogIndexHtml(POSTS);
  return <><main ref={main} className="wrap blog-page" data-testid="blog-page" onClick={click} dangerouslySetInnerHTML={{ __html: html }} /><StartupReady /></>;
}
