import { useEffect, useRef, useState, type ReactNode } from "react";
import Comments from "./Comments";
import { Look, MakeIt, MakeNote, makeTitle } from "./MakeIt";
import { ArrowIcon, KitMenu } from "./ui";
import { type Catalogue, type Page, cap, formatOf, kindInfo, rendersOf, kindOf, loadPage, loadSkillText, pathOf, taskOf, wireSteps } from "./lib/data";
import { markViewed } from "./lib/store";
import { buildHandoffZip, download, finalOutputs, needsOf, orderFlow, zipName } from "./lib/handoff";
import { businessText, getBusiness, hasBusiness, useBusiness, withBusiness } from "./lib/business";
import { openTailor } from "./Tailor";
import { BusinessNote, openBusiness } from "./Business";
import { DownloadDialog } from "./DownloadDialog";
import type { Flow } from "./lib/store";
import { Link } from "./lib/router";
import AddToFlow from "./AddToFlow";
import Install from "./Install";
import { Before, Next, WhatYouGet } from "./Needs";
import { Gauge } from "./Gauge";
import PixelFace from "./PixelFace";
import { HelpedBy, MindSkills, WorkflowList, flowsUsing } from "./MindPack";
import { LabelBadges } from "./MindLabel";
import { useSeen, useTyped } from "./lib/typing";

// A list item that YAML read as a small map ("Check: this") still shows as text.
const txt = (x: unknown): string => (typeof x === "string" ? x : x && typeof x === "object" ? Object.entries(x as Record<string, unknown>).map(([k, v]) => (v == null ? k : `${k}: ${txt(v)}`)).join(" ") : String(x ?? ""));

type Props = { c: Catalogue; slug: string; toast: (m: string) => void; toBuilder: (slugs: string[], asNew?: string) => void };

/** A code window with a file name, line numbers and a copy button.
 *  With `typed`, the text writes itself out when it scrolls into view, like your AI answering, and can be replayed. */
export function Code({ name, text, toast, tall, typed }: { name: string; text: string; toast: (m: string) => void; tall?: boolean; typed?: boolean }) {
  const body = text.replace(/\n+$/, "");
  const lines = body.split("\n");
  const [ref, seen] = useSeen<HTMLElement>(0.25);
  const pre = useRef<HTMLPreElement>(null);
  const userScrolled = useRef(false);
  const { n, done, replay, skip } = useTyped(body, !!typed && seen, Math.min(4800, Math.max(1400, body.length * 2.5)));
  const showing = typed ? n : body.length;
  let off = 0, at = lines.length - 1;
  const rows = lines.map((l, i) => {
    const s0 = off;
    off += l.length + 1;
    const k = showing - s0;
    if (k >= l.length + (i < lines.length - 1 ? 1 : 0)) return <span className="ln" key={i}>{l || " "}{"\n"}</span>;
    if (k < 0) return <span className="ln ghost" key={i}>{l || " "}{"\n"}</span>;
    at = i;
    return <span className="ln" key={i}>{l.slice(0, k)}<span className="cursor" /><span className="ghost">{l.slice(k) || " "}</span>{"\n"}</span>;
  });
  // Keep the cursor in view while it writes, unless you scroll the window yourself.
  useEffect(() => {
    const p = pre.current;
    if (!typed || done || !p || userScrolled.current) return;
    const cur = p.querySelector(".cursor");
    if (!cur) return;
    const gap = cur.getBoundingClientRect().bottom - p.getBoundingClientRect().bottom;
    if (gap > -32) p.scrollTop += gap + 64;
  }, [typed, done, n]);
  const again = () => { userScrolled.current = false; if (pre.current) pre.current.scrollTop = 0; replay(); };
  return (
    <figure className={`code${tall ? " tall" : ""}`} ref={ref}>
      <figcaption>
        <span className="code-name">{name}</span>
        <span className="code-meta">{typed && !done ? `writing ${Math.min(at + 1, lines.length)} of ${lines.length} lines` : `${lines.length} lines`}</span>
        {typed && <button className="code-copy code-replay" onClick={done ? again : skip} data-testid="code-replay">{done ? "Replay" : "Skip"}</button>}
        <button className={`code-copy${typed ? " next" : ""}`} onClick={async () => { await navigator.clipboard.writeText(text).catch(() => {}); toast(`Copied ${name}`); }}>Copy</button>
      </figcaption>
      <pre ref={pre} className={typed ? "typed" : undefined} data-done={String(done)} onWheel={() => { userScrolled.current = true; }} onTouchStart={() => { userScrolled.current = true; }}>{rows}</pre>
    </figure>
  );
}

export function Section({ id, title, lead, children, wide }: { id: string; title: string; lead?: string; children: ReactNode; wide?: boolean }) {
  return (
    <section className={`bp-sec${wide ? " wide" : ""}`} id={id} aria-labelledby={`${id}-h`}>
      <h2 className="bp-h2" id={`${id}-h`}>{title}</h2>
      {lead && <p className="bp-note">{lead}</p>}
      {children}
    </section>
  );
}

/** Paste your own details once; copy the skill and your details together, ready for your AI. Drafts stay in this browser. */
function Composer({ slug, skill, give, toast }: { slug: string; skill: string | null; give: string[]; toast: (m: string) => void }) {
  const key = `abb:draft:${slug}`;
  const [text, setText] = useState(() => { try { return localStorage.getItem(key) ?? ""; } catch { return ""; } });
  useEffect(() => { try { if (text) localStorage.setItem(key, text); else localStorage.removeItem(key); } catch { /* private mode */ } }, [key, text]);
  const biz = useBusiness();
  const about = businessText(biz);
  const copy = async () => {
    if (!skill) return;
    await navigator.clipboard.writeText(`${skill.trim()}\n\n---\n\n${[about, text.trim()].filter(Boolean).join("\n")}\n`).catch(() => {});
    toast("Copied the skill with your details. Paste it into your AI.");
  };
  return (
    <div className="composer" data-testid="composer">
      <label htmlFor="composer-text">Your details</label>
      <textarea id="composer-text" value={text} onChange={(e) => setText(e.target.value)} rows={7} spellCheck
        placeholder={`${about ? "Your about-me file is already added. Paste the rest it needs" : "Paste what it needs"}:\n${give.map((g) => `- ${g}`).join("\n")}`} />
      <div className="composer-bar">
        <span className="small">{about ? <>Your about-me file{biz.name ? ` for ${biz.name}` : ""} is added too. <button className="link-btn" onClick={openBusiness}>Change it</button></> : text.trim() ? `${text.trim().split(/\s+/).length} words, saved in this browser` : "Nothing leaves your browser until you paste it into your AI."}</span>
        <button className="btn btn-primary btn-sm" disabled={!skill || (!text.trim() && !about)} onClick={copy} data-testid="composer-copy">Copy the skill with my details</button>
      </div>
    </div>
  );
}

export default function BlockPage({ c, slug, toast, toBuilder }: Props) {
  const b = c.bySlug[slug];
  const [page, setPage] = useState<Page | null | undefined>(undefined);
  const [skill, setSkill] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [dl, setDl] = useState<Flow | null>(null);
  const biz = hasBusiness(useBusiness());
  useEffect(() => {
    setPage(undefined); setSkill(null);
    loadPage(slug).then(setPage);
    loadSkillText(slug).then(setSkill);
    markViewed(slug);
  }, [slug]);
  useEffect(() => { document.title = `${b?.name ?? "Not found"} · AI Blocks`; return () => { document.title = "AI Blocks · Making humanity AI native"; }; }, [b]);

  if (!b) {
    return (
      <main className="wrap bp-missing">
        <h1 className="bp-h1">That page has moved</h1>
        <p className="bp-sub">There's nothing called “{slug}” any more. It may have a new name.</p>
        <Link to="/#library" className="btn btn-primary">Go to the library</Link>
      </main>
    );
  }

  const kind = kindInfo(b);
  const task = taskOf(b);
  const format = formatOf(b);
  const renders = rendersOf(b);
  const oldNames = Object.entries(c.renamed ?? {}).filter(([, to]) => to === b.slug).map(([from]) => from);
  const twin = b.twin ? c.bySlug[b.twin] : null;
  const isFlow = kindOf(b) === "workflow" && b.steps.length > 0;
  const p = page ?? null;
  const give = p?.you_give?.length ? p.you_give : b.inputs.map((x) => x.type.replace(/_/g, " "));
  const get = p?.you_get?.length ? p.you_get : b.outputs.map((x) => x.type.replace(/_/g, " "));
  const handoff = () => {
    const nodes = b.steps.map((s, i) => ({ id: `s${i + 1}`, slug: s.uses, x: i * 300, y: 0 }));
    const edges = wireSteps(c, b.steps.map((s) => s.uses)).map(([a, z], i) => ({ id: `e${i}`, from: nodes[a].id, to: nodes[z].id }));
    setDl({ id: b.slug, name: b.name, updated: 0, nodes, edges });
  };
  const dlOrder = dl ? orderFlow(dl) : null;
  const getPack = async () => {
    if (!dl) return false;
    const r = await buildHandoffZip(c, dl, getBusiness());
    if ("error" in r) { toast(r.error); return false; }
    download(r.blob, r.filename);
    return true;
  };
  const copySkill = async () => {
    if (!skill) return;
    await navigator.clipboard.writeText(withBusiness(skill, getBusiness())).catch(() => {});
    toast(biz ? "Skill copied with your about-me file. Paste it into your AI." : "Skill copied. Paste it into your AI.");
  };

  const has = (x?: unknown[]) => !!x && x.length > 0;
  // The workflows this skill is a step in, or for a mind, the workflows from their work.
  const inFlows = b.type === "mind" ? (b.flows ?? []).map((f) => c.bySlug[f]).filter(Boolean) : isFlow ? [] : flowsUsing(c, b.slug);
  const toc: [string, string, boolean][] = [
    ["get", "What you'll get", !!p?.output_shape],
    ["what", kindOf(b) === "mind" ? "Who they are" : "What it does", !!p?.explain],
    ["hire", `Hire ${b.name.split(" (")[0]}`, has(p?.hire?.jobs)],
    ["skills", `Skills from ${b.name.split(" (")[0]}'s work`, b.type === "mind"],
    ["flows", "Workflows from their work", b.type === "mind" && inFlows.length > 0],
    ["ideas", "Their big ideas", has(p?.ideas)],
    ["seats", "On a council", has(p?.seats)],
    ["io", "What you give it, what you get", true],
    ["before", "Before you start", !!p?.plan && (has(p.plan.needed) || has(p.plan.helps))],
    ["steps", "The steps", isFlow],
    ["install", "Add it to your AI", !isFlow],
    ["helped", "Who can help with this", has(b.minds)],
    ["flows", "Part of these workflows", b.type !== "mind" && inFlows.length > 0],
    ["make", renders === "video" ? "Make the video" : "Make the picture", !!renders],
    ["use", "How to use it", has(p?.how_to_use)],
    ["most", "What changes the result most", has(p?.tweaks)],
    ["test", "Test it", has(p?.judge) || has(p?.test)],
    ["best", "Works best with", has(p?.works_best_with?.tools) || has(p?.works_best_with?.inputs)],
    ["improve", "Make it fit your work", has(p?.improve)],
    ["file", isFlow ? "The workflow file" : "The skill file", true],
    ["next", "What to do next", has(p?.plan?.next)],
  ];

  return (
    <main className="bp" data-testid="block-page" data-slug={b.slug}>
      <Comments key={b.slug} slug={b.slug} name={b.name} also={oldNames} toast={toast} />
      {adding && <AddToFlow c={c} slug={b.slug} onClose={() => setAdding(false)} toast={toast} />}
      {dl && dlOrder && <DownloadDialog name={dl.name} zip={zipName(dl.name)} needs={needsOf(c, dlOrder)} finals={finalOutputs(c, dl, dlOrder)} onDownload={getPack} onClose={() => setDl(null)} />}
      <header className="wrap bp-hero">
        <div className="bp-top">
          <Link to="/#library" className="back"><span aria-hidden="true">←</span> Library</Link>
          <button className="link-btn tailor-link" onClick={() => openTailor(b.name)} data-testid="tailor-open">Want this skill tailored for you?</button>
        </div>
        {b.type === "mind" && <PixelFace face={b.face} area={b.area} slug={b.slug} size={112} className="bp-face" />}
        <p className="bp-kicker"><span className="kind">{kind.name}</span><Link to={`/?job=${task.id}#library`}>{task.name}</Link></p>
        <h1 className="bp-h1">{p?.headline || b.name}</h1>
        <p className="bp-sub">{p?.subhead || b.summary}</p>
        {b.type === "mind" && <LabelBadges c={c} labels={b.labels} />}
        {format && (
          <p className="bp-format" data-testid="format-note">
            <span className={`fmt fmt-${format}`}>{format === "image" ? "Image ad" : "Video ad"}</span>
            {twin && formatOf(twin) && formatOf(twin) !== format
              ? <>Want {format === "image" ? "a video" : "an image ad"} in the same look? <Link to={pathOf(twin)} data-testid="twin-link">{twin.name}</Link></>
              : <>{format === "image" ? "Makes one still image ad, not a video." : "Makes a video ad, not a still."}</>}
          </p>
        )}
        {renders && <MakeNote kind={renders} />}
        <div className="bp-actions">
          {isFlow ? (
            <>
              <button className="btn btn-primary" onClick={handoff} data-testid="download-handoff">Download the workflow</button>
              <button className="btn btn-dark" onClick={() => toBuilder(b.steps.map((s) => s.uses), b.name)}>Open in the builder</button>
            </>
          ) : (
            <>
              <a href="#install" className="btn btn-primary" data-testid="add-to-ai">Add it to your AI</a>
              <button className="btn btn-dark" disabled={!skill} onClick={copySkill} data-testid="copy-skill">Copy the skill</button>
              <KitMenu slug={b.slug} onChange={toast} />
              <button className="btn btn-dark" onClick={() => setAdding(true)} data-testid="add-to-workflow">Add to a workflow</button>
            </>
          )}
        </div>
        <BusinessNote />
        <Gauge level={b.thinking} why={p?.thinkingWhy ?? b.thinkingWhy ?? ""} />
        <p className="bp-file"><span>{b.name}</span><code>{b.slug}</code><span>{cap(b.level)}</span>{b.tested?.result === "pass" && <span data-testid="tested" title="Run on a real business's files and graded by a second AI against this page's checks">Tested</span>}</p>
      </header>

      <div className="wrap bp-body">
        <nav className="bp-toc" aria-label="On this page">
          <p>On this page</p>
          {toc.filter(([, , show]) => show).map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
          <a href="#comments" data-testid="toc-comments">Questions and comments</a>
        </nav>

        <div className="bp-main">
          {page === undefined && <p className="small">Loading…</p>}

          {p?.output_shape && (
            <Section id="get" title="What you'll get" lead="Every run hands it back in this order. Your details fill each <gap>." wide>
              <WhatYouGet plan={p.plan} tools={p.works_best_with?.tools ?? []}><Code name="what-you-get.txt" text={p.output_shape} toast={toast} /></WhatYouGet>
            </Section>
          )}

          {p?.explain && (
            <Section id="what" title={kindOf(b) === "mind" ? "Who they are" : "What it does"}>
              <div className="prose big" dangerouslySetInnerHTML={{ __html: p.html.explain }} />
              {has(p.when) && (
                <div className="when-box">
                  <h3>Reach for it when</h3>
                  <ul>{p.when.map((w, i) => <li key={i}>{txt(w)}</li>)}</ul>
                </div>
              )}
              {!isFlow && has(p.how_it_works) && (
                <>
                  <h3 className="sub-h">Step by step, here's what your AI does</h3>
                  <ol className="how-list">{p.how_it_works.map((s, i) => <li key={i}><span className="n">{String(i + 1).padStart(2, "0")}</span><div><b>{s.title}</b><p>{s.text}</p></div></li>)}</ol>
                </>
              )}
            </Section>
          )}

          {has(p?.hire?.jobs) && (
            <Section id="hire" title={`Hire ${b.name.split(" (")[0]}`} lead={`Bring a real problem from your business, your work or your life. This is how ${b.name.split(" (")[0]} would take it on.`}>
              <ul className="ideas" data-testid="mind-hire">{p!.hire!.jobs.map((x, i) => <li key={i}><b>{x.title}</b>{x.text && <p>{x.text}</p>}</li>)}</ul>
              {has(p!.hire!.steps) && (
                <>
                  <h3 className="sub-h">How they'd take on your problem</h3>
                  <ol className="how-list">{p!.hire!.steps.map((s, i) => <li key={i}><span className="n">{String(i + 1).padStart(2, "0")}</span><div><b>{s.title}</b><p>{s.text}</p></div></li>)}</ol>
                </>
              )}
              {has(p!.hire!.questions) && (
                <>
                  <h3 className="sub-h">First questions they'd ask you</h3>
                  <ul className="ideas">{p!.hire!.questions.map((q, i) => <li key={i}><p>{q}</p></li>)}</ul>
                </>
              )}
            </Section>
          )}

          {b.type === "mind" && (
            <Section id="skills" title={`Skills from ${b.name.split(" (")[0]}'s work`} lead={`Each skill does one job, and you can use it alone. Pick the ones you want and download them with ${b.name.split(" (")[0]} as one pack, so each job is done the way ${b.name.split(" (")[0]} would do it.`}>
              <MindSkills c={c} mind={b} toast={toast} />
            </Section>
          )}

          {b.type === "mind" && inFlows.length > 0 && (
            <Section id="flows" title="Workflows from their work" lead="Whole jobs built from their method. Each runs several skills in order, and each skill's result feeds the next.">
              <WorkflowList c={c} flows={inFlows} testid="in-workflows" />
            </Section>
          )}

          {has(p?.ideas) && (
            <Section id="ideas" title="Their big ideas" lead={`What it draws on when it answers. Each comes from ${b.name.split(" (")[0]}'s own work, with sources at the end of the skill file.`}>
              <ul className="ideas" data-testid="mind-ideas">{p!.ideas!.map((x, i) => <li key={i}><b>{x.title}</b>{x.text && <p>{x.text}</p>}</li>)}</ul>
            </Section>
          )}

          {has(p?.seats) && (
            <Section id="seats" title="On a council" lead="Put them on an advisory council with other minds, and they argue your decision. These are the seats we suggest. You can give them any role.">
              <ul className="seats">{p!.seats!.map((s, i) => <li key={i}><b>{s.seat}</b><span>Always asks: “{s.asks}”</span></li>)}</ul>
              <div className="bp-actions">
                <button className="btn btn-primary" data-testid="start-council" onClick={() => {
                  const with_ = [b.slug, ...(p!.pairs ?? []).filter((s) => c.bySlug[s]).slice(0, 2)];
                  toBuilder([...with_, ...(c.bySlug["advisory-council"] ? ["advisory-council"] : [])], `Council: ${with_.map((s) => c.bySlug[s].name.split(" (")[0]).join(", ")}`);
                }}>Start a council with {b.name.split(" (")[0]}</button>
                <Link to="/minds" className="btn btn-dark">Pick other minds</Link>
              </div>
            </Section>
          )}

          <Section id="io" title="What you give it, what you get">
            <div className="give-get">
              <div><h3>You give it</h3><ul>{give.map((x, i) => <li key={i}>{txt(x)}</li>)}</ul></div>
              <div><h3>You get</h3><ul>{get.map((x, i) => <li key={i}>{txt(x)}</li>)}</ul></div>
            </div>
            <Look b={b} kind={renders} />
          </Section>

          {p?.plan && (has(p.plan.needed) || has(p.plan.helps)) && (
            <Section id="before" title="Before you start" lead="It runs on its own. These make the result better, and none is required.">
              <Before plan={p.plan} />
            </Section>
          )}

          {isFlow && (
            <Section id="steps" title="The steps" lead="Each step is a skill. It saves its result, and the next step picks it up.">
              <ol className="flow-steps">
                {b.steps.map((s, i) => {
                  const sb = c.bySlug[s.uses];
                  const how = p?.how_it_works?.[i];
                  return (
                    <li key={i}>
                      <span className="n">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <b>{how?.title ?? sb?.name ?? s.uses}</b>
                        <p>{how?.text ?? s.note}</p>
                        {sb && <Link to={pathOf(sb)} className="step-link">{sb.name} <ArrowIcon size={12} /></Link>}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </Section>
          )}

          {!isFlow && (
            <Section id="install" title="Add it to your AI once, then start it by name" lead="It takes about two minutes, once. Pick the AI you use.">
              <Install b={b} skill={skill} toast={toast} />
            </Section>
          )}

          {has(b.minds) && (
            <Section id="helped" title="Who can help with this" lead="This skill comes from these people's work. In the builder, put one on the step to have it done their way, or download them together from their page.">
              <HelpedBy c={c} b={b} />
            </Section>
          )}

          {b.type !== "mind" && inFlows.length > 0 && (
            <Section id="flows" title="Part of these workflows" lead="This skill is a step in these workflows. Each one runs several skills in order, so the whole job gets done in one run.">
              <WorkflowList c={c} flows={inFlows} testid="in-workflows" />
            </Section>
          )}

          {renders && (
            <Section id="make" title={makeTitle(renders)} lead={renders === "image"
              ? "Claude writes the prompt but can't draw it. Finish it in a tool you already have."
              : "Claude writes the prompts but can't make video. Finish it in a tool you already have."}>
              <MakeIt kind={renders} />
            </Section>
          )}

          {has(p?.how_to_use) && (
            <Section id="use" title="How to use it">
              <ol className="num-list">{p!.how_to_use.map((s, i) => <li key={i}><span className="n">{i + 1}</span><span>{txt(s)}</span></li>)}</ol>
              {!isFlow && <Composer slug={b.slug} skill={skill} give={give} toast={toast} />}
            </Section>
          )}

          {has(p?.tweaks) && (
            <Section id="most" title="What changes the result most" lead="Get these parts of your input right and every run gets better.">
              <dl className="tweaks">{p!.tweaks.map((t, i) => <div key={i}><dt>{t.what}</dt><dd>{t.how}</dd></div>)}</dl>
            </Section>
          )}

          {(has(p?.judge) || has(p?.test)) && (
            <Section id="test" title="Test it">
              {has(p?.judge) && (
                <>
                  <h3 className="sub-h">Is the output good? Check these first</h3>
                  <ul className="checks">{p!.judge.map((j, i) => <li key={i}>{txt(j)}</li>)}</ul>
                </>
              )}
              {has(p?.test) && (
                <>
                  <h3 className="sub-h">Try it on your own work before you rely on it</h3>
                  <ol className="num-list">{p!.test!.map((s, i) => <li key={i}><span className="n">{i + 1}</span><span>{txt(s)}</span></li>)}</ol>
                </>
              )}
            </Section>
          )}

          {(has(p?.works_best_with?.tools) || has(p?.works_best_with?.inputs)) && (
            <Section id="best" title="Works best with" lead="It runs in any good AI chat. These tools and extra files give you the best result.">
              {has(p!.works_best_with!.tools) && (
                <dl className="best-tools">{p!.works_best_with!.tools!.map((t, i) => <div key={i}><dt>{t.name}</dt><dd>{txt(t.why)}</dd></div>)}</dl>
              )}
              {has(p!.works_best_with!.inputs) && (
                <>
                  <h3 className="best-h3">Add these for a better result</h3>
                  <ul className="plain-list">{p!.works_best_with!.inputs!.map((x, i) => <li key={i}>{txt(x)}</li>)}</ul>
                </>
              )}
            </Section>
          )}

          {has(p?.improve) && (
            <Section id="improve" title="Make it fit your work" lead="The skill is a plain text file. Change it once and every run after that fits you better.">
              <ul className="plain-list">{p!.improve.map((j, i) => <li key={i}>{txt(j)}</li>)}</ul>
            </Section>
          )}

          {has(p?.terms) && (
            <section className="bp-sec terms" aria-label="Words on this page">
              <h3>Words on this page</h3>
              <dl>{p!.terms.map((t, i) => <div key={i}><dt>{t.term}</dt><dd>{t.meaning}</dd></div>)}</dl>
            </section>
          )}

          {has(p?.credits) && (
            <section className="bp-sec terms credits" aria-label="Built with ideas from">
              <h3>Built with ideas from</h3>
              <ul className="plain-list">{p!.credits!.map((c, i) => <li key={i}>{c.url ? <a href={c.url} target="_blank" rel="noopener noreferrer">{c.title}</a> : c.title}{c.by && <>, {c.by}</>}{c.used && <><br /><span className="small">{c.used}</span></>}</li>)}</ul>
            </section>
          )}

          <Section id="file" title={isFlow ? "The workflow file" : "The skill file"} lead={`This is what your AI follows. It's saved as ${b.slug}/SKILL.md, the name Claude, Claude Code and our workflows call it by.`}>
            <details className="skill-file" open={!p}>
              <summary>Read the full {isFlow ? "workflow" : "skill"}</summary>
              {p ? <div className="prose" dangerouslySetInnerHTML={{ __html: p.html.skill }} /> : skill ? <pre className="prose">{skill}</pre> : <p className="small">Loading…</p>}
            </details>
          </Section>

          {has(p?.plan?.next) && (
            <Section id="next" title="What to do next" lead="When it's done, the skill asks what you want to do next and offers these. You can also ask for something else.">
              <Next plan={p!.plan!} />
            </Section>
          )}
        </div>
      </div>
    </main>
  );
}
