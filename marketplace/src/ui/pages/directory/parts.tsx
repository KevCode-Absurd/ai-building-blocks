// Pieces shared by the directory pages: portraits with a fallback, agent cards, hire links.
// Agents run in people's own AI, so "Hire" leads to the agent's download and connect section (#dir-pack).
import { useState } from "preact/hooks";
import type { AgentCard as AgentCardData } from "../../../modules/directory/views.ts";
import { Button } from "../../components.tsx";
import { Link, navigate } from "../../lib/router.tsx";

export type { AgentCardData };
export type { AgentProfile, AgentOutcome } from "../../../modules/directory/views.ts";

export interface AgentList {
  total: number;
  area: string | null;
  q: string;
  /** With ?role=: the job role the list is for. */
  role: { id: string; name: string; department: string; summary: string } | null;
  areas: { id: string; label: string; count: number }[];
  agents: AgentCardData[];
}

/** GET /api/agents?featured=N: a few agents from different areas, and how many live agents there are in all. */
export interface FeaturedList {
  total: number;
  agents: AgentCardData[];
}

/** The agent's profile, at the section to download it or load it into your own AI. */
export function hireHref(personaId: string): string {
  return `/agents/${encodeURIComponent(personaId)}#dir-pack`;
}

/** "1 day", "3 days", "12 hours": how long a job takes, rounded the way people say it. */
export function turnaround(hours: number): string {
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"}`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"}`;
}

/** Dark or light text, whichever reads better on the accent colour. */
function inkOn(hex: string): string {
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!m) return "#ffffff";
  const lin = (c: string) => { const v = parseInt(c, 16) / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const l = 0.2126 * lin(m[1]) + 0.7152 * lin(m[2]) + 0.0722 * lin(m[3]);
  return l > 0.36 ? "#0a0a0a" : "#ffffff";
}

function initials(name: string): string {
  const parts = name.split(/[\s-]+/).filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 1)).toUpperCase();
}

/**
 * The agent's portrait on a soft accent background. Lazy-loaded with a fixed square box so nothing jumps.
 * If the image is missing or fails, shows the agent's initial on the accent colour instead.
 */
export function Portrait(props: { name: string; src: string; accent: string; size?: "card" | "large" | "small"; eager?: boolean }) {
  // State is keyed by src, so a new agent on the same component starts fresh without an extra render.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const failed = failedSrc === props.src, loaded = loadedSrc === props.src;
  const style = `--dir-accent:${props.accent};--dir-ink:${inkOn(props.accent)}`;
  return (
    <div class={`dir-portrait dir-portrait-${props.size ?? "card"}${loaded ? " dir-portrait-loaded" : ""}`} style={style}>
      {failed ? (
        <span class="dir-avatar" aria-hidden="true"><span>{initials(props.name)}</span></span>
      ) : (
        // eager is the profile's big portrait, the page's largest image: fetch it first and paint it without waiting.
        <img src={props.src} alt="" width={512} height={512} loading={props.eager ? "eager" : "lazy"}
          fetchpriority={props.eager ? "high" : "auto"} decoding={props.eager ? "auto" : "async"}
          onLoad={e => { if ((e.currentTarget as HTMLImageElement).naturalWidth > 0) setLoadedSrc(props.src); else setFailedSrc(props.src); }}
          onError={() => setFailedSrc(props.src)} />
      )}
    </div>
  );
}

/**
 * What kind of work the agent does, in one line under its title: "Makes: landing page copy, homepage copy and
 * service page copy", or "Reviews and advises: ..." for an agent that audits. Worked out from the agent's outcomes
 * (modules/directory/work.ts), so a title that sounds like a maker cannot hide an agent that only reviews.
 */
export function WorkLine(props: { does: NonNullable<AgentCardData["does"]>; class?: string }) {
  const { label, things } = props.does;
  const listed = things.length <= 1 ? things.join("") : `${things.slice(0, -1).join(", ")} and ${things[things.length - 1]}`;
  return <p class={`dir-does dir-does-${props.does.nature} ${props.class ?? ""}`}><b>{label}{listed ? ":" : ""}</b>{listed ? ` ${listed}` : ""}</p>;
}

/** An agent card for the browse grid, the profile's related list and the home page. */
export function AgentCard(props: { agent: AgentCardData; compact?: boolean; headingLevel?: 2 | 3 }) {
  const a = props.agent;
  const profile = `/agents/${a.id}`;
  const H = props.headingLevel === 2 ? "h2" : "h3";
  return (
    <article class={`dir-card${props.compact ? " dir-card-compact" : ""}`} style={`--dir-accent:${a.accent}`}>
      <a href={profile} class="dir-card-art" tabIndex={-1} aria-hidden="true"
        onClick={(e: MouseEvent) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; e.preventDefault(); navigate(profile); }}>
        <Portrait name={a.name} src={a.portrait} accent={a.accent} />
      </a>
      <div class="dir-card-head">
        <H class="dir-card-name"><Link href={profile}>{a.name}</Link></H>
        <p class="dir-card-title">{a.title}</p>
        {a.mega && <p class="dir-card-team">Leads a team of {a.mega.team_size}</p>}
        {a.does && <WorkLine does={a.does} class="dir-card-does" />}
      </div>
      <p class="dir-card-tagline">{a.tagline}</p>
      {!props.compact && a.outcomes.length > 0 && (
        <ul class="dir-card-outcomes" aria-label={`What ${a.name} delivers`}>
          {a.outcomes.map(o => <li>{o}</li>)}
        </ul>
      )}
      <div class="dir-card-foot">
        <p class="dir-card-meta">{a.area_label}</p>
        <div class="dir-card-actions">
          <Button href={hireHref(a.id)} small>Hire {a.name}</Button>
          <Link href={profile} class="dir-card-more">About {a.name}</Link>
        </div>
      </div>
    </article>
  );
}

/** Placeholder cards while the first list loads, so the grid does not jump. */
export function CardSkeletons(props: { count: number }) {
  return <>{Array.from({ length: props.count }, () => <div class="dir-card dir-card-skeleton" aria-hidden="true"><div class="dir-portrait" /><span /><span /><span /></div>)}</>;
}

/** The four steps of a hire, the same everywhere. The agent works in the person's own AI. */
export function HowHiringWorks(props: { name?: string }) {
  const who = props.name ?? "the agent", Who = props.name ?? "The agent";
  return (
    <section class="dir-how" aria-labelledby="dir-how-title">
      <h2 id="dir-how-title">How hiring works</h2>
      <ol class="dir-how-steps">
        <li><span class="step-n">1</span><h3>Add {who} to your AI</h3><p>Download the files, or connect your AI and load {who} in your chat. It is free.</p></li>
        <li><span class="step-n">2</span><h3>Say what you need</h3><p>In your own words. {Who} asks only for what is missing.</p></li>
        <li><span class="step-n">3</span><h3>Choose what {who} can touch</h3><p>Reading is the default. Drafting or publishing in your tools needs your yes, within your limits, and every action is logged.</p></li>
        <li><span class="step-n">4</span><h3>Check the work</h3><p>{Who} checks it against a checklist before handing it over. It all runs on your own AI plan.</p></li>
      </ol>
    </section>
  );
}
