// /ai-tools/<slug>: one AI product. What it does, who it suits, what it costs, the library blocks that run on it,
// and the products you'd compare it with.
import type { ReactNode } from "react";
import { ArrowIcon } from "../ui";
import { Link } from "../lib/router";
import { monthOf, pricingName, runsInName, type AiTools, type Tool } from "./data";
import { usePageMeta } from "./AiToolsPage";

function Bullets({ id, title, items, lead }: { id: string; title: string; items: string[]; lead?: string }) {
  return (
    <section className="at-sec" aria-labelledby={`${id}-h`} data-testid={`at-${id}`}>
      <h2 className="at-h2" id={`${id}-h`}>{title}</h2>
      {lead && <p className="bp-note">{lead}</p>}
      <ul className="at-list">{items.map((x) => <li key={x}>{x}</li>)}</ul>
    </section>
  );
}

function Facts({ t, d }: { t: Tool; d: AiTools }) {
  const row = (label: string, value: ReactNode) => <div className="at-fact" key={label}><dt>{label}</dt><dd>{value}</dd></div>;
  return (
    <dl className="at-facts" data-testid="at-facts">
      {row("Use it for", t.useCases.map((u, i) => <span key={u}>{i > 0 && ", "}<Link to={`/ai-tools?use=${u}`}>{d.useCaseName[u]}</Link></span>))}
      {row("Kind", t.categories.map((c) => d.categoryName[c]).join(", "))}
      {row("Runs in", t.runsIn.map(runsInName).join(", "))}
      {row("Works with", t.worksWith.length ? t.worksWith.map((w, i) => <span key={w.name}>{i > 0 && ", "}{w.slug && d.bySlug[w.slug] ? <Link to={`/ai-tools/${w.slug}`}>{w.name}</Link> : w.name}</span>) : "Works on its own")}
    </dl>
  );
}

export default function AiToolPage({ d, slug }: { d: AiTools; slug: string }) {
  const t = d.bySlug[slug];
  usePageMeta(t ? `${t.name} for ${d.useCaseName[t.useCases[0]].toLowerCase()}` : "AI tools", t ? `${t.name} by ${t.maker}: ${t.promise} What it does, who it suits, what it costs and the library blocks that use it.` : "That AI product is not listed.");
  if (!t) {
    return (
      <main className="wrap bp-missing" data-testid="ai-tool-missing">
        <h1 className="bp-h1">That AI product isn't listed</h1>
        <p className="bp-sub">It may have a new name, or we haven't added it yet. Every product we list is on the AI tools page.</p>
        <Link to="/ai-tools" className="btn btn-primary">See every AI product <ArrowIcon /></Link>
      </main>
    );
  }
  const alternatives = t.alternatives.map((s) => d.bySlug[s]).filter(Boolean);
  const host = t.url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  const checkPrice = /check the maker/i.test(t.pricing.from);
  return (
    <main className="bp at at-one" data-testid="ai-tool-page" data-slug={t.slug}>
      <header className="wrap bp-hero">
        <Link to="/ai-tools" className="back"><span aria-hidden="true">←</span> AI tools</Link>
        <p className="bp-kicker"><span className="kind">{d.useCaseName[t.useCases[0]]}</span>by {t.maker}</p>
        <h1 className="bp-h1">{t.name}</h1>
        <p className="bp-sub">{t.promise}</p>
        <div className="bp-actions">
          <a className="btn btn-primary" href={t.url} target="_blank" rel="noopener" data-testid="at-open">Open {t.name} <ArrowIcon /></a>
          {t.blocks.length > 0 && <a className="btn btn-dark" href="#blocks">{t.blocks.length} block{t.blocks.length === 1 ? "" : "s"} use it</a>}
        </div>
      </header>

      <div className="wrap at-one-body">
        <div className="at-main">
          <Bullets id="does" title="What it does" items={t.does} />
          <Bullets id="benefits" title="What you get out of it" items={t.benefits} />
          <div className="at-two">
            <Bullets id="best" title="Best for" items={t.bestFor} />
            <Bullets id="not" title="Not for" items={t.notFor} />
          </div>

          <section className="at-sec" aria-labelledby="blocks-h" id="blocks" data-testid="at-blocks">
            <h2 className="at-h2" id="blocks-h">Blocks that use it</h2>
            {t.blocks.length ? (
              <>
                <p className="bp-note">Skills, prompts and workflows in the library that run on {t.name} or write for it.</p>
                <ul className="at-blocks">{t.blocks.map((b) => <li key={b.slug}><Link to={b.path} data-testid="at-block-link">{b.name}<ArrowIcon size={12} /></Link></li>)}</ul>
              </>
            ) : (
              <p className="bp-note">No block in the library runs on {t.name} yet. <Link to="/from-a-source">Turn a guide into one</Link>, or <Link to="/#library">search the library</Link> for the job you have in mind.</p>
            )}
          </section>

          {alternatives.length > 0 && (
            <section className="at-sec" aria-labelledby="alt-h" data-testid="at-alternatives">
              <h2 className="at-h2" id="alt-h">Compare it with</h2>
              <div className="grid at-grid at-alt-grid">
                {alternatives.map((a) => (
                  <Link key={a.slug} to={`/ai-tools/${a.slug}`} className="card at-card at-alt" data-testid="at-alt-card" data-slug={a.slug}>
                    <span className="meta"><span className="kind">{d.useCaseName[a.useCases[0]]}</span><span className="type">{a.maker}</span></span>
                    <span className="nm">{a.name}</span>
                    <span className="peek">{a.promise}</span>
                    <span className="view">{a.pricing.from} <ArrowIcon size={12} /></span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="at-sec" aria-labelledby="checked-h" data-testid="at-checked">
            <h2 className="at-h2" id="checked-h">Last checked {monthOf(t.lastChecked)}</h2>
            <p className="bp-note">Prices and features come from these pages. If the maker has changed them since, the maker's page wins.</p>
            <ul className="at-sources">{t.sources.map((s) => <li key={s}><a href={s} target="_blank" rel="noopener nofollow">{s.replace(/^https?:\/\/(www\.)?/, "")}</a></li>)}</ul>
          </section>
        </div>

        <aside className="at-side">
          <div className="at-pricebox" data-testid="at-pricing">
            <span className="at-pricebox-h">{pricingName(t.pricing.model)}</span>
            <b className={`at-pricebox-from${checkPrice ? " soft" : ""}`}>{t.pricing.from}</b>
            <p>{t.pricing.note}</p>
            <a href={t.url} target="_blank" rel="noopener" className="at-pricebox-link">{host} <ArrowIcon size={12} /></a>
          </div>
          <Facts t={t} d={d} />
        </aside>
      </div>
    </main>
  );
}
