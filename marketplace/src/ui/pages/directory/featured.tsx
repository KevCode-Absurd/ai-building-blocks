// A small strip of agents for the home page (or any page) to drop in:
//   import { FeaturedAgents } from "./directory/featured.tsx";
//   <FeaturedAgents />            6 agents, one from each of several areas
//   <FeaturedAgents count={3} />
// The server picks them (GET /api/agents?featured=N, see pickFeatured in modules/directory/views.ts): the best agent
// from each area in a fixed order that leads with variety, so the strip shows code, data and design, not six marketers.
import "./directory.css";
import { useLoad } from "../../components.tsx";
import { api, peekBoot } from "../../lib/api.ts";
import { Link } from "../../lib/router.tsx";
import { AgentCard, CardSkeletons, type FeaturedList } from "./parts.tsx";

export function FeaturedAgents(props: { count?: number; title?: string }) {
  const count = Math.min(12, Math.max(1, props.count ?? 6));
  // The home page carries the first answer (src/pages.ts), so the cards paint at once and the page doesn't shift.
  const path = `/api/agents?featured=${count}`;
  const state = useLoad<FeaturedList>(() => api(path), [count], peekBoot<FeaturedList>(path));
  // The home page should never break because of this strip: on an error it shows nothing.
  if (state.error) return null;
  const data = state.data;
  if (data && !data.agents.length) return null;
  return (
    <section class="dir-featured" aria-labelledby="dir-featured-title">
      <div class="dir-section-head">
        <h2 id="dir-featured-title">{props.title ?? "Meet a few of the agents"}</h2>
        {/* The live count of every agent you can hire, from the API: the roster keeps growing. */}
        <Link href="/agents" class="dir-card-more">{data ? `See all ${data.total} agents` : "See all agents"}</Link>
      </div>
      <div class="dir-grid dir-grid-featured">
        {data ? data.agents.slice(0, count).map(a => <AgentCard agent={a} compact />) : <CardSkeletons count={count} />}
      </div>
    </section>
  );
}
