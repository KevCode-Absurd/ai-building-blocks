import { apiSecurity, securityJson, type SecurityEnv } from "../../../src/server/api-security.ts";
import { handleCommunity, type CommunityEnv } from "../../../src/server/community.ts";
import { d1Community, type CommunityDatabase } from "../../../src/server/community-store.ts";
type Env = SecurityEnv & CommunityEnv & { COMPOSER?: CommunityDatabase; ASSETS: { fetch(request: Request): Promise<Response> } };
export async function onRequest({ request, env }: { request: Request; env: Env }) {
  try {
    const denied = await apiSecurity(request, env); if (denied) return denied;
    return await handleCommunity(request, env, env.COMPOSER ? d1Community(env.COMPOSER) : null, async () => {
      const response = await env.ASSETS.fetch(new Request(new URL("/data/blocks.json", request.url)));
      if (!response.ok) throw Error("Catalogue unavailable"); return response.json();
    });
  } catch { return securityJson(503, { error: "Community publishing is temporarily unavailable." }); }
}
