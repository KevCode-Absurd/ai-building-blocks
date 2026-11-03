// "Your work": what a returning visitor left behind, at the top of the home page.
// Reads only what is already saved (this browser, or the signed-in account library). Shows nothing to a first-time visitor.
import { useEffect, useState, useSyncExternalStore } from "react";
import { library, libraryStorage } from "./lib/library-storage";
import { Link } from "./lib/router";
import { WORK_KEY, latest, nameFromSlug, parseWork, planSummary, suggestNext, withRole } from "./lib/saved-work-data";
import "./your-work.css";

const field = (id: string) => id.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").toLowerCase();

export default function YourWork() {
  const snapshot = useSyncExternalStore(library.subscribe, library.snapshot);
  const read = (key: string) => { try { return libraryStorage.getItem(key); } catch { return null; } };
  const plan = planSummary(read("abb:composer"));
  const work = parseWork(read(WORK_KEY));
  const role = latest(work.roles), tool = latest(work.tools);
  const roleId = role?.[0] ?? "", roleName = role?.[1].name ?? "";
  const [fetchedName, setFetchedName] = useState("");
  // The specialist's real name loads once and is kept with the saved entry.
  useEffect(() => {
    if (!roleId || roleName) return;
    let live = true;
    fetch(`/data/role-views/${roleId}.json`).then(r => r.ok ? r.json() : null).then(view => {
      const name = typeof view?.name === "string" ? view.name.slice(0, 120) : "";
      if (!live || !name) return;
      setFetchedName(name);
      try { const raw = libraryStorage.getItem(WORK_KEY); const at = parseWork(raw).roles[roleId]?.at; if (at) libraryStorage.setItem(WORK_KEY, withRole(raw, roleId, at, name)); } catch { /* the name is only a label */ }
    }).catch(() => {});
    return () => { live = false; };
  }, [roleId, roleName]);
  if (!plan && !role && !tool) return null;
  const next = suggestNext(plan, role && [role[0], { ...role[1], name: roleName || fetchedName || undefined }], tool);
  const numbers = tool ? Object.entries(tool[1].raw).slice(0, 3) : [];
  return <section className="wrap your-work" aria-labelledby="your-work-h" data-testid="your-work" data-account={snapshot.user ? "account" : "browser"}>
    <div className="your-work-head">
      <h2 className="h3" id="your-work-h">Your work</h2>
      <p className="small">Pick up where you left off. {snapshot.user ? "Saved to your account." : "Saved in this browser."} <Link to="/account">See all my work</Link></p>
    </div>
    <div className="your-work-grid">
      {plan && <Link className="your-work-card" to="/compose#compose-workflow" data-testid="your-work-plan"><span className="your-work-kind">Your last plan</span><b>{plan.title}</b>{plan.steps > 0 && <span className="small">{plan.steps} steps</span>}</Link>}
      {role && <Link className="your-work-card" to={`/roles/${role[0]}`} data-testid="your-work-role"><span className="your-work-kind">Specialist you looked at</span><b>{roleName || fetchedName || nameFromSlug(role[0])}</b><span className="small">Set it up for your business</span></Link>}
      {tool && <Link className="your-work-card" to={`/tools/${tool[0]}`} data-testid="your-work-tool"><span className="your-work-kind">Your calculator numbers</span><b>{tool[1].name || nameFromSlug(tool[0])}</b>{numbers.length > 0 ? <span className="small">{numbers.map(([k, v]) => `${field(k)}: ${v}`).join(" · ")}</span> : <span className="small">Opens with your numbers</span>}</Link>}
    </div>
    {next && <p className="your-work-next" data-testid="your-work-next"><span className="your-work-kind">Next step</span> {next.text} <Link to={next.to}>{next.label}</Link></p>}
  </section>;
}
