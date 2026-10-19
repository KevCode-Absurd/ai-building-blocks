// "Before you start" and "What to do next" on a block page: the same chain the skill file carries
// (tools/lib/needs.mjs, built into each page's data by scripts/build-index.mjs).
import type { Plan, PlanItem } from "./lib/data";
import { Link } from "./lib/router";

const local = (url: string) => url.replace(/^https:\/\/useaiblocks\.com/, "");

function Item({ i }: { i: PlanItem }) {
  const part = i.parts.length && i.maker?.slug === "website-brand-file-builder" ? ` (its ${i.parts.join(" and ")} part)` : "";
  return (
    <li data-testid="need" data-key={i.key}>
      <b>{i.label}</b>{part}{i.maker ? <> · made by the <Link to={local(i.maker.url)}>{i.maker.name}</Link></> : <span className="small"> · yours</span>}
      <span className="need-what">{i.what.replace(/^./, (c) => c.toUpperCase())}.</span>
    </li>
  );
}

export function Before({ plan }: { plan: Plan }) {
  const { needed, helps, chain, brain } = plan;
  return (
    <>
      {chain.length > 0 && (
        <>
          <h3 className="with-h">The steps before this one</h3>
          <ol className="num-list chain" data-testid="chain">
            {chain.map((s, n) => (
              <li key={s.slug}>
                <span className="n">{n + 1}</span>
                <span><b>{s.label}</b> with the <Link to={local(s.url)}>{s.name}</Link>.{s.bring.length > 0 && <> Bring {s.bring.join(", ")}.</>}{s.uses.length > 0 && <> It uses your {s.uses.map((u) => u.charAt(0).toLowerCase() + u.slice(1)).join(" and ")}.</>}</span>
              </li>
            ))}
            <li className="here"><span className="n">{chain.length + 1}</span><span><b>This one.</b> Make each step once, then reuse what it makes.</span></li>
          </ol>
        </>
      )}
      {needed.length > 0 && <><h3 className="with-h">Needed</h3><ul className="needs">{needed.map((i) => <Item key={i.key} i={i} />)}</ul></>}
      {helps.length > 0 && <><h3 className="with-h">Makes it better</h3><ul className="needs">{helps.map((i) => <Item key={i.key} i={i} />)}</ul></>}
      {brain && <p className="bp-note" data-testid="brain-files">From your brand brain it reads {brain.files.map((f, n) => <span key={f}>{n ? ", " : ""}<code>{f}</code></span>)}.</p>}
      <p className="bp-note">The skill checks for each of these first. In Claude Code it looks in your project; in a chat it asks you to attach them. If one is missing, it says so, links to the skill that makes it, and carries on with what you have.</p>
    </>
  );
}

export function Next({ plan }: { plan: Plan }) {
  return (
    <ul className="next-list" data-testid="next">
      {plan.next.map((x) => (
        <li key={x.slug}>
          <Link to={local(x.url)} className="next-one">
            <span className="next-job">{x.label}</span>
            <b>{x.name}</b>
            <span className="small">Takes the {x.takes.join(" and ")}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
