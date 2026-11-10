// /experts/:slug: an expert's public page: who they are and the agents they built. Public. The Worker sends the
// profile in the page (script#boot) and answers 404 while the expert has no live agent.
import { useEffect } from "preact/hooks";
import { Button, Notice, Page, Spinner, useLoad } from "../../components.tsx";
import { api, ApiError, peekBoot } from "../../lib/api.ts";
import { Link } from "../../lib/router.tsx";
import { Portrait } from "../directory/parts.tsx";
import { firstName, type PublicProfile } from "./shared.tsx";

type Answer = { profile: PublicProfile } | { missing: true };

async function loadProfile(slug: string): Promise<Answer> {
  try { return await api<{ profile: PublicProfile }>(`/api/expert-profiles/${encodeURIComponent(slug)}`); }
  catch (e) { if (e instanceof ApiError && e.status === 404) return { missing: true }; throw e; }
}

export function ExpertProfilePage(props: { params: Record<string, string> }) {
  const slug = props.params.slug ?? "";
  const state = useLoad(() => loadProfile(slug), [slug], peekBoot<Answer>(`/api/expert-profiles/${encodeURIComponent(slug)}`));
  if (state.error) return (
    <Page title="We could not load this page" intro="Check your connection, then try again.">
      <Notice tone="bad">{state.error}</Notice>
      <Button kind="secondary" href="/agents">See all agents</Button>
    </Page>
  );
  const data = state.data;
  if (!data || (state.loading && !("profile" in data && data.profile.slug === slug))) return <main class="page"><Spinner /></main>;
  if ("missing" in data) return (
    <Page title="We could not find that expert" intro="The address may be wrong, or this expert has no agent to show right now.">
      <div class="row"><Button href="/agents">See all agents</Button></div>
    </Page>
  );
  return <Profile p={data.profile} />;
}

function Profile(props: { p: PublicProfile }) {
  const p = props.p;
  const first = firstName(p.name);
  useEffect(() => { document.title = `${p.name}, expert | AI Blocks`; }, [p.slug]);
  return (
    <main class="page dir-profile exp-profile" style={`--dir-accent:${p.accent}`}>
      <Link href="/agents" class="dir-back">&larr; All agents</Link>
      <header class="dir-profile-hero">
        <Portrait name={p.name} src={p.portrait} accent={p.accent} size="large" eager />
        <div class="dir-profile-intro">
          <p class="eyebrow">Expert on AI Blocks</p>
          <h1>{p.name}</h1>
          <p class="lede">{p.headline}</p>
          {p.bio && <p class="dir-profile-bio exp-bio">{p.bio}</p>}
          {p.areas.length > 0 && (
            <>
              <h2 class="exp-areas-title">Works in</h2>
              <ul class="dir-tags exp-areas">{p.areas.map(a => <li>{a.label}</li>)}</ul>
            </>
          )}
        </div>
      </header>

      <section class="dir-section" aria-labelledby="exp-agents-title">
        <h2 id="exp-agents-title">Agents {first} built</h2>
        <p class="muted">{first} built {p.agents.length === 1 ? "this agent" : "these agents"} from their own way of working. Open one to see what it delivers.</p>
        <div class="dir-outcomes">
          {p.agents.map(a => (
            <article class="dir-outcome">
              <p class="eyebrow exp-agent-name">{a.persona_name}</p>
              <h3>{a.title}</h3>
              <p class="muted">{a.summary}</p>
              <Button kind="secondary" small href={a.href}>Meet {a.persona_name}</Button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
