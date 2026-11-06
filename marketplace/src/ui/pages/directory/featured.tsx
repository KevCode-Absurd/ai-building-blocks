// A small strip of the most useful agents, for the home page (or any page) to drop in:
//   import { FeaturedAgents } from "./directory/featured.tsx";
//   <FeaturedAgents />            the first 6 agents by `sort`
//   <FeaturedAgents count={3} />
import "./directory.css";
import { useLoad } from "../../components.tsx";
import { api } from "../../lib/api.ts";
import { Link } from "../../lib/router.tsx";
import { AgentCard, CardSkeletons, type AgentCardData, type AgentList } from "./parts.tsx";

/** The first `count` agents. The API already lists them by `sort` (lower = more useful), then name. */
export function pickFeatured(agents: AgentCardData[], count = 6): AgentCardData[] {
  return agents.slice(0, count);
}

export function FeaturedAgents(props: { count?: number; title?: string }) {
  const count = props.count ?? 6;
  const state = useLoad<AgentList>(() => api("/api/agents"), []);
  // The home page should never break because of this strip: on an error it shows nothing.
  if (state.error) return null;
  const data = state.data;
  if (data && !data.agents.length) return null;
  return (
    <section class="dir-featured" aria-labelledby="dir-featured-title">
      <div class="dir-section-head">
        <h2 id="dir-featured-title">{props.title ?? "Meet a few of the agents"}</h2>
        <Link href="/agents" class="dir-card-more">{data ? `See all ${data.total} agents` : "See all agents"}</Link>
      </div>
      <div class="dir-grid dir-grid-featured">
        {data ? pickFeatured(data.agents, count).map(a => <AgentCard agent={a} compact />) : <CardSkeletons count={count} />}
      </div>
    </section>
  );
}
