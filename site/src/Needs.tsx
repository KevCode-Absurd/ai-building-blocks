// "Before you start" and "What to do next" on a block page: the same chain the skill file carries
// (tools/lib/needs.mjs, built into each page's data by scripts/build-index.mjs).
import type { ReactNode } from "react";
import type { Plan, PlanItem } from "./lib/data";
import { Link } from "./lib/router";

const local = (url: string) => url.replace(/^https:\/\/useaiblocks\.com/, "");

function Item({ i }: { i: PlanItem }) {
  const part = i.parts.length && i.maker?.slug === "website-brand-brain-builder" ? ` (its ${i.parts.join(" and ")} part)` : "";
  return (
    <li data-testid="need" data-key={i.key}>
      <b>{i.label}</b>{part}{i.maker ? <> · made by the <Link to={local(i.maker.url)}>{i.maker.name}</Link></> : <span className="small"> · yours</span>}
      <span className="need-what">{i.what.replace(/^./, (c) => c.toUpperCase())}.</span>
    </li>
  );
}

export function Before({ plan }: { plan: Plan }) {
  const { needed, helps, chain, brain } = plan;
  const required = needed.filter(i => i.required);
  const optional = [...needed.filter(i => !i.required), ...helps];
  return (
    <>
      {chain.length > 0 && (
        <>
          <h3 className="with-h">Recommended steps before this one</h3>
          <ol className="num-list chain" data-testid="chain">
            {chain.map((s, n) => (
              <li key={s.slug}>
                <span className="n">{n + 1}</span>
                <span><b>{s.label}</b> with the <Link to={local(s.url)}>{s.name}</Link>.{s.bring.length > 0 && <> Bring {s.bring.join(", ")}.</>}{s.uses.length > 0 && <> It uses your {s.uses.map((u) => (u.charAt(0).toLowerCase() + u.slice(1)).replace(/^your /, "")).join(" and ")}.</>}</span>
              </li>
            ))}
            <li className="here"><span className="n">{chain.length + 1}</span><span><b>This one.</b> Make each step once, then reuse what it makes.</span></li>
          </ol>
        </>
      )}
      {required.length > 0 && <><h3 className="with-h">Required material</h3><ul className="needs">{required.map(i => <Item key={i.key} i={i} />)}</ul></>}
      {optional.length > 0 && <details><summary>Improve the result (optional)</summary><ul className="needs">{optional.map(i => <Item key={i.key} i={i} />)}</ul></details>}
      {brain && <p className="bp-note" data-testid="brain-files">From your brand brain it reads {brain.files.map((f, n) => <span key={f}>{n ? ", " : ""}<code>{f}</code></span>)}.</p>}
      <p className="bp-note">Give your AI the required material when you run the task. It should ask about missing facts and mark gaps. Optional extras can wait.</p>
    </>
  );
}

export function Next({ plan }: { plan: Plan }) {
  return (
    <ul className="next-list" data-testid="next">
      {plan.next.map((x) => (
        <li key={x.slug}>
          <Link to={local(x.url)} className="next-one">
            {x.label.toLowerCase() !== x.name.toLowerCase() && <span className="next-job">{x.label}</span>}
            <b>{x.name}</b>
            {x.takes.length > 0 && <span className="small">Takes the {x.takes.join(" and ")}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** "What you'll get", near the top of a block page: what makes it better, the shape of the output, then what you could do next.
 *  The first and last parts are suggestions; the skill runs on its own. */
export function WhatYouGet({ plan, tools, children }: { plan?: Plan; tools: { name: string; why: string }[]; children: ReactNode }) {
  const better = [...(plan?.needed ?? []), ...(plan?.helps ?? [])];
  const next = plan?.next ?? [];
  return (
    <ol className="wyg" data-testid="what-you-get">
      {(better.length > 0 || tools.length > 0) && (
        <li className="wyg-part">
          <details><summary>Extra material and tools</summary>
          <ul className="wyg-chips">
            {better.map((i) => (
              <li key={i.key}>{i.maker ? <Link to={local(i.maker.url)}>{i.label}</Link> : <span>{i.label}</span>}</li>
            ))}
            {tools.map((t) => <li key={t.name} className="tool" title={t.why}><span>{t.name}</span></li>)}
          </ul></details>
        </li>
      )}
      <li className="wyg-part wyg-out">
        <h3 className="wyg-h">What it hands back</h3>
        {children}
      </li>
      {next.length > 0 && (
        <li className="wyg-part">
          <details><summary>Other tasks (optional)</summary><ul className="wyg-chips">{next.map((x) => <li key={x.slug}><Link to={local(x.url)}>{x.label}</Link></li>)}</ul></details>
        </li>
      )}
    </ol>
  );
}
