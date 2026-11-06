// Pieces shared by the directory pages: portraits with a fallback, agent cards, hire links.
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
  areas: { id: string; label: string; count: number }[];
  agents: AgentCardData[];
}

/** /new with the agent (and a job type or the buyer's words) filled in. */
export function hireHref(personaId: string, opts: { job?: string | null; text?: string | null } = {}): string {
  const q = new URLSearchParams({ persona: personaId });
  if (opts.job) q.set("job", opts.job);
  if (opts.text) q.set("text", opts.text);
  return `/new?${q}`;
}

export const usd = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

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
        <img src={props.src} alt="" width={512} height={512} loading={props.eager ? "eager" : "lazy"} decoding="async"
          onLoad={e => { if ((e.currentTarget as HTMLImageElement).naturalWidth > 0) setLoadedSrc(props.src); else setFailedSrc(props.src); }}
          onError={() => setFailedSrc(props.src)} />
      )}
    </div>
  );
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
      </div>
      <p class="dir-card-tagline">{a.tagline}</p>
      {!props.compact && a.outcomes.length > 0 && (
        <ul class="dir-card-outcomes" aria-label={`What ${a.name} delivers`}>
          {a.outcomes.map(o => <li>{o}</li>)}
        </ul>
      )}
      <div class="dir-card-foot">
        <p class="dir-card-price">{a.price_from_usd !== null ? <>From <b>{usd(a.price_from_usd)}</b></> : "Fixed price before you start"}</p>
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

/** The four steps of a hire, the same everywhere. */
export function HowHiringWorks(props: { name?: string }) {
  const who = props.name ?? "The agent";
  return (
    <section class="dir-how" aria-labelledby="dir-how-title">
      <h2 id="dir-how-title">How hiring works</h2>
      <ol class="dir-how-steps">
        <li><span class="step-n">1</span><h3>Describe the job</h3><p>In your own words. {who} asks at most three questions.</p></li>
        <li><span class="step-n">2</span><h3>Approve a fixed price and checklist</h3><p>You see the price and what "good" means before work starts.</p></li>
        <li><span class="step-n">3</span><h3>Get checked work</h3><p>Every draft is checked against your checklist before you see it.</p></li>
        <li><span class="step-n">4</span><h3>Ask for up to two changes</h3><p>Then accept it. Free during the beta.</p></li>
      </ol>
    </section>
  );
}
