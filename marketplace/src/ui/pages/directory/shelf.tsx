// The e-commerce shelves: prompts, skills, tools and minds a store owner can use beside the agents (one tab each on
// /e-commerce), and the page for one item (/e-commerce/:kind/:slug). Data: GET /api/knowledge/ecommerce/shelf[/:kind
// [/:slug]] (src/modules/knowledge/routes.ts), built from knowledge/ecommerce/library/ by scripts/build-packs.mjs.
// Nothing here runs a model: a prompt is copied into the visitor's own AI, a skill or mind is downloaded or loaded there.
import { useEffect, useRef, useState } from "preact/hooks";
import { Badge, Button, Notice, Page, Spinner, useLoad } from "../../components.tsx";
import { api, ApiError } from "../../lib/api.ts";
import { Link } from "../../lib/router.tsx";
import { shelfTitle } from "../../../modules/directory/titles.ts";
import { SafeMarkdown } from "./pack-parts.tsx";

export const SHELF_VERTICAL = "ecommerce";
export const SHELF_BASE = `/api/knowledge/${SHELF_VERTICAL}/shelf`;
export type ShelfKind = "prompts" | "skills" | "tools" | "minds";
export const SHELF_KINDS: ShelfKind[] = ["prompts", "skills", "tools", "minds"];
export const isShelfKind = (k: string): k is ShelfKind => (SHELF_KINDS as string[]).includes(k);

/** How each shelf is named and what its tab says it holds. */
export const SHELF_WORDS: Record<ShelfKind, { tab: string; one: string; many: string; lede: string; open: string }> = {
  prompts: { tab: "Prompts", one: "prompt", many: "prompts", open: "Open the prompt",
    lede: "Copy one into ChatGPT, Claude or Gemini, fill in the blanks about your store, and get the work back in one go." },
  skills: { tab: "Skills", one: "skill", many: "skills", open: "Open the skill",
    lede: "Step-by-step methods for a whole job, with checks before hand-over. The agents use these; you can add any one to your own AI." },
  tools: { tab: "Tools", one: "tool", many: "tools", open: "Open the tool guide",
    lede: "The software stores and their agents work in, checked on each maker's own pages: what it does for a store and how an agent connects." },
  minds: { tab: "Minds", one: "mind", many: "minds", open: "Open the mind",
    lede: "Think through a store problem the way a great marketer, founder or writer would, built from their public record." },
};

/** A team member as the shelves name them. */
export interface TeamName { id: string; name: string; title: string }

interface Base { slug: string; title: string; summary: string; stage: string; agents: string[]; path: string }
export interface PromptItem extends Base { module: string; fill: string[]; output: string; from: { dir: string; slug: string }[]; credit: string | null }
export interface SkillItem extends Base { module: string; when: string }
export interface ToolItem extends Base { maker: string; url: string; kind: string; jobs: string[]; connect: string; checked: string; sources: string[]; guide: string | null }
export interface MindItem extends Base { identity: string; area: string; questions: string[]; library: string }
export type ShelfItem = PromptItem | SkillItem | ToolItem | MindItem;

/** GET /api/knowledge/ecommerce/shelf: how many items each shelf holds, and with ?q= how many match. */
export interface ShelfSummary { vertical: string; built: string; stages: { id: string; label: string }[]; counts: Record<ShelfKind, number>; q?: string; found?: Record<ShelfKind, number> }
interface ShelfPage { kind: ShelfKind; total: number; offset: number; limit: number; stages: { id: string; label: string; n: number }[]; items: ShelfItem[] }
interface ItemAnswer { kind: ShelfKind; item: ShelfItem; text: string; prompt?: string }

const TOOL_KINDS: Record<string, string> = {
  "ai-tool": "AI tool", "store-platform": "Store platform", "store-app": "Store app", "ads-platform": "Ads platform", marketplace: "Marketplace",
  sourcing: "Sourcing", shipping: "Shipping", "data-and-research": "Data and research", finance: "Finance",
};
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
/** "shopify.com" for a source link, or the link as written if it is not a full address. */
const siteName = (url: string) => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; } };
export const itemHref =(kind: ShelfKind, slug: string) => `/e-commerce/${kind}/${encodeURIComponent(slug)}`;

/** "Used by Kofi and Tendai" with links, or nothing. */
function UsedBy(props: { ids: string[]; team: Map<string, TeamName>; max?: number }) {
  const named = props.ids.map(id => props.team.get(id)).filter((a): a is TeamName => !!a).slice(0, props.max ?? 3);
  if (!named.length) return null;
  return (
    <p class="dir-shelf-used">Used by {named.map((a, i) => <>{i > 0 && (i === named.length - 1 ? " and " : ", ")}<Link href={`/agents/${a.id}`}>{a.name}</Link></>)}</p>
  );
}

function ShelfCard(props: { kind: ShelfKind; item: ShelfItem; team: Map<string, TeamName>; stageLabel: string }) {
  const { kind, item } = props;
  const href = itemHref(kind, item.slug);
  const tag = kind === "tools" ? TOOL_KINDS[(item as ToolItem).kind] ?? "Tool" : kind === "minds" ? (item as MindItem).identity : props.stageLabel;
  // A card never trusts its fields: one that throws stops the whole grid redrawing (17 Nov: Minds kept showing tools).
  const fill = (kind === "prompts" && (item as PromptItem).fill) || [];
  const ask = kind === "minds" ? (item as MindItem).questions?.[0] : undefined;
  return (
    <article class={`dir-shelf-card dir-shelf-${kind}`}>
      {tag && <p class="dir-shelf-tag">{tag}</p>}
      <h3 class="dir-shelf-title"><Link href={href}>{item.title}</Link></h3>
      <p class="dir-shelf-summary">{item.summary}</p>
      {kind === "prompts" && fill.length > 0 && <p class="dir-shelf-fill">You fill in: {fill.slice(0, 3).join("; ")}{fill.length > 3 ? "; and more" : ""}</p>}
      {kind === "minds" && ask && <p class="dir-shelf-fill">Ask: "{ask}"</p>}
      <div class="dir-shelf-foot">
        <UsedBy ids={item.agents} team={props.team} max={2} />
        <Link href={href} class="dir-card-more">{SHELF_WORDS[kind].open}</Link>
      </div>
    </article>
  );
}

/** One shelf: stage chips, a grid of items (best match first when searching), and "Show more".
 *  The page mounts it with key={kind}, so a new tab starts empty instead of drawing the last tab's items. */
export function ShelfTab(props: { kind: ShelfKind; q: string; team: Map<string, TeamName>; onClear: () => void }) {
  const { kind, q } = props;
  const [stage, setStage] = useState("");
  const [loaded, setPages] = useState<ShelfPage[]>([]);
  useEffect(() => { setStage(""); }, [kind, q]);
  const params = (offset: number) => new URLSearchParams({ ...(q ? { q } : {}), ...(stage ? { stage } : {}), offset: String(offset), limit: "24" });
  const first = useLoad<ShelfPage>(() => api<ShelfPage>(`${SHELF_BASE}/${kind}?${params(0)}`), [kind, q, stage]);
  useEffect(() => { setPages(first.data ? [first.data] : []); }, [first.data]);
  // Only this shelf's pages are drawn: a card laid out for one kind cannot show another kind's item.
  const pages = loaded.filter(p => p.kind === kind);
  // What the list is showing now. "Show more" adds its page only if the list still shows the same thing.
  const showing = `${kind}|${q}|${stage}`;
  const now = useRef(showing);
  now.current = showing;
  const [more, setMore] = useState(false);
  const loadMore = async () => {
    const last = pages[pages.length - 1];
    // While a new search or stage loads, the list on screen is the old one: wait for the new first page.
    if (!last || more || first.loading) return;
    const asked = showing, base = pages[0];
    setMore(true);
    try {
      const next = await api<ShelfPage>(`${SHELF_BASE}/${kind}?${params(last.offset + last.limit)}`);
      if (now.current === asked) setPages(p => p[0] === base ? [...p, next] : p);
    }
    finally { setMore(false); }
  };
  const words = SHELF_WORDS[kind];
  // A failed load says so, even with an earlier list in hand: that list answers a different search.
  if (first.error) {
    const missing = /not have shelves/i.test(first.error);
    return (
      <div class="dir-ecom-note" role="status">
        <strong>{missing ? `The ${words.many} are on their way` : `We could not load the ${words.many} just now`}</strong>
        <p>{missing ? "The team already uses them. Meet the agents in the meantime." : <>Check your connection, then <button type="button" class="dir-link-button" onClick={first.reload}>try again</button>.</>}</p>
      </div>
    );
  }
  const head = pages[0];
  if (!head) return <p class="dir-result-line" aria-busy="true">Opening the {words.many}…</p>;
  const items = pages.flatMap(p => p.items);
  const stageName = new Map(head.stages.map(s => [s.id, s.label]));
  const shown = items.length, total = head.total;
  return (
    <div class="dir-shelf" aria-live="polite">
      <p class="dir-ecom-lede">{words.lede}</p>
      {head.stages.length > 1 && (
        <div class="dir-chips dir-ecom-stages" role="group" aria-label={`Show the ${words.many} for one stage of the work`}>
          <button type="button" class="dir-chip" aria-pressed={!stage} onClick={() => setStage("")}>All stages</button>
          {head.stages.map(s => (
            <button type="button" class="dir-chip" aria-pressed={stage === s.id} onClick={() => setStage(stage === s.id ? "" : s.id)}>
              {s.label} <span class="dir-chip-n">{s.n}</span>
            </button>
          ))}
        </div>
      )}
      {q && <p class="dir-result-line">{plural(total, words.one, words.many)} for "{q}"{total ? ", best match first" : ""}. <button type="button" class="dir-link-button" onClick={props.onClear}>Show them all</button></p>}
      {total === 0 ? (
        <div class="dir-ecom-note" role="status"><strong>No {words.many} match "{q}"</strong><p>Try fewer words, or look in another tab above.</p></div>
      ) : (
        <div class={`dir-shelf-grid${first.loading ? " dir-grid-stale" : ""}`}>
          {items.map(it => <ShelfCard kind={kind} item={it} team={props.team} stageLabel={stageName.get(it.stage) ?? ""} />)}
        </div>
      )}
      {shown < total && (
        <div class="dir-more">
          <Button kind="secondary" onClick={loadMore} busy={more}>Show more {words.many}</Button>
          <span class="dir-more-n">{shown} of {total}</span>
        </div>
      )}
    </div>
  );
}

// ---------- One item ----------

async function loadItem(kind: ShelfKind, slug: string): Promise<ItemAnswer | null> {
  try { return await api<ItemAnswer>(`${SHELF_BASE}/${kind}/${encodeURIComponent(slug)}`); }
  catch (e) { if (e instanceof ApiError && e.status === 404) return null; throw e; }
}

function CopyButton(props: { text: string; label: string; primary?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(props.text); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { /* No clipboard here: the text stays on the page to select by hand. */ }
  };
  return <button type="button" class={`btn ${props.primary ? "btn-primary" : "btn-line"}`} onClick={copy}>{copied ? "Copied" : props.label}</button>;
}

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/markdown;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** The body of a skill or mind file, without its front matter, for reading on the page. */
const bodyOf = (md: string) => md.replace(/^---\n[\s\S]*?\n---\n/, "");

export function ShelfItemPage(props: { params: Record<string, string> }) {
  const kind = props.params.kind, slug = props.params.slug;
  const valid = isShelfKind(kind);
  const state = useLoad(() => valid ? loadItem(kind, slug) : Promise.resolve(null), [kind, slug]);
  const team = useLoad<{ agents: TeamName[] }>(() => api(`/api/agents?vertical=${SHELF_VERTICAL}`), []);
  const names = new Map((team.data?.agents ?? []).map(a => [a.id, a]));
  const data = state.data;
  useEffect(() => { if (data) document.title = shelfTitle(data.item.title, SHELF_WORDS[data.kind].one); }, [data]);

  if (state.error) return (
    <Page title="We could not load this just now" intro="Check your connection, then try again.">
      <div class="row"><Button onClick={state.reload}>Try again</Button><Button kind="secondary" href="/e-commerce">Back to e-commerce</Button></div>
    </Page>
  );
  if (state.loading && !data) return <main class="page"><Spinner label="Loading…" /></main>;
  if (!valid || !data) return (
    <Page title="We could not find that" intro="It may have a new name. Search the e-commerce shelves for it.">
      <Button href={valid ? `/e-commerce?tab=${kind}` : "/e-commerce"}>Back to e-commerce</Button>
    </Page>
  );
  const { item, text } = data;
  const words = SHELF_WORDS[data.kind];
  const back = `/e-commerce?tab=${data.kind}`;
  return (
    <main class="page dir-shelf-page">
      <p class="dir-crumbs"><Link href="/e-commerce">E-commerce</Link> <span aria-hidden="true">/</span> <Link href={back}>{words.tab}</Link></p>
      <header class="dir-shelf-hero">
        <p class="eyebrow">E-commerce {words.one}{data.kind === "minds" ? ` · ${(item as MindItem).identity}` : data.kind === "tools" ? ` · ${TOOL_KINDS[(item as ToolItem).kind] ?? "Tool"}` : ""}</p>
        <h1>{item.title}</h1>
        <p class="lede">{item.summary}</p>
        <UsedBy ids={item.agents} team={names} max={4} />
      </header>
      {data.kind === "prompts" && <PromptBody item={item as PromptItem} prompt={data.prompt ?? ""} />}
      {data.kind === "skills" && <SkillBody item={item as SkillItem} text={text} />}
      {data.kind === "tools" && <ToolBody item={item as ToolItem} text={text} />}
      {data.kind === "minds" && <MindBody item={item as MindItem} text={text} />}
      <p class="dir-shelf-back"><Link href={back}>See every e-commerce {words.one}</Link> · <Link href="/e-commerce">Meet the team</Link></p>
    </main>
  );
}

function PromptBody(props: { item: PromptItem; prompt: string }) {
  const p = props.item;
  return (
    <>
      <div class="dir-shelf-actions"><CopyButton text={props.prompt} label="Copy the prompt" primary /><span class="dir-shelf-hint">Paste it into ChatGPT, Claude or Gemini, then fill in the [SQUARE BRACKETS].</span></div>
      <div class="dir-shelf-columns">
        <section aria-labelledby="fill-title"><h2 id="fill-title">What you fill in</h2><ul>{p.fill.map(f => <li>{f}</li>)}</ul></section>
        <section aria-labelledby="get-title"><h2 id="get-title">What you get</h2><p>{p.output}</p></section>
      </div>
      <section aria-labelledby="prompt-title">
        <h2 id="prompt-title">The prompt</h2>
        <pre class="dir-shelf-prompt">{props.prompt}</pre>
        <div class="dir-shelf-actions"><CopyButton text={props.prompt} label="Copy the prompt" /></div>
      </section>
      {(p.from.length > 0 || p.credit) && (
        <p class="dir-shelf-credit">
          {p.from.length > 0 && <>Built on {p.from.map((f, i) => <>{i > 0 && ", "}<a href={`https://useaiblocks.com/${f.dir === "orchestrators" ? "workflows" : "skills"}/${f.slug}`} target="_blank" rel="noopener">{f.slug.replace(/-/g, " ")}</a></>)} on useaiblocks.com, rewritten for online stores. </>}
          {p.credit}
        </p>
      )}
    </>
  );
}

function SkillBody(props: { item: SkillItem; text: string }) {
  const s = props.item;
  return (
    <>
      {s.when && <Notice tone="info" title="When to use it">{s.when}</Notice>}
      <div class="dir-shelf-actions">
        <button type="button" class="btn btn-primary" onClick={() => download("SKILL.md", props.text)}>Download SKILL.md</button>
        <CopyButton text={props.text} label="Copy the skill" />
        <span class="dir-shelf-hint">Add it to Claude as a skill, or paste it into any AI before you ask for the job.</span>
      </div>
      <SafeMarkdown text={bodyOf(props.text)} class="dir-shelf-doc" />
    </>
  );
}

function ToolBody(props: { item: ToolItem; text: string }) {
  const t = props.item;
  return (
    <>
      <div class="dir-shelf-actions">
        <a class="btn btn-primary" href={t.url} target="_blank" rel="noopener">Visit {t.title}</a>
        {t.guide && <a class="btn btn-line" href={t.guide} target="_blank" rel="noopener">Full guide on useaiblocks.com</a>}
      </div>
      <div class="dir-shelf-columns">
        <section aria-labelledby="jobs-title"><h2 id="jobs-title">What a store uses it for</h2><ul>{t.jobs.map(j => <li>{j}</li>)}</ul></section>
        <section aria-labelledby="connect-title"><h2 id="connect-title">How an agent works with it</h2><p>{t.connect}</p><p class="dir-shelf-hint">Agents start with read access and ask before anything is sent, spent or published.</p></section>
      </div>
      <p class="dir-shelf-credit">By {t.maker}. Checked {t.checked} on {t.sources.map((s, i) => <>{i > 0 && ", "}<a href={s} target="_blank" rel="noopener">{siteName(s)}</a></>)}.</p>
      {t.guide && <details class="dir-shelf-more"><summary>Read the full tool guide</summary><SafeMarkdown text={props.text.split("\n---\n").slice(1).join("\n---\n")} class="dir-shelf-doc" /></details>}
    </>
  );
}

function MindBody(props: { item: MindItem; text: string }) {
  const m = props.item;
  const first = m.questions[0] ?? "";
  const ask = `Use the attached mind file. You are thinking as ${m.title} would. ${first}`;
  return (
    <>
      <div class="dir-shelf-actions">
        <button type="button" class="btn btn-primary" onClick={() => download(`${m.slug}.md`, props.text)}>Download the mind</button>
        <CopyButton text={props.text} label="Copy the mind" />
        <a class="btn btn-line" href={m.library} target="_blank" rel="noopener">On useaiblocks.com</a>
      </div>
      <section aria-labelledby="ask-title">
        <h2 id="ask-title">Questions to ask about your store</h2>
        <ul class="dir-shelf-questions">{m.questions.map(q => <li><span>{q}</span> <CopyButton text={`Use the attached mind file. You are thinking as ${m.title} would. ${q}`} label="Copy" /></li>)}</ul>
        <p class="dir-shelf-hint">Attach the mind file in your AI, then paste a question. For example: "{ask.slice(0, 140)}{ask.length > 140 ? "…" : ""}"</p>
      </section>
      <details class="dir-shelf-more"><summary>Read the whole mind</summary><SafeMarkdown text={bodyOf(props.text)} class="dir-shelf-doc" /></details>
      <Badge>Built from public sources. Not affiliated with {m.title}.</Badge>
    </>
  );
}
