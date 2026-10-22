import { d1Composer, decodeCatalogue, handleComposer, type ComposerEnv } from "../../src/server/composer.ts";
import { apiSecurity, type SecurityEnv } from "../../src/server/api-security.ts";
import { authenticateUser, authConfigured, type AuthEnv } from "../../src/server/auth.ts";
type Env = SecurityEnv & ComposerEnv & AuthEnv & { COMPOSER?: Parameters<typeof d1Composer>[0]; ASSETS?: { fetch(req: Request): Promise<Response> } };
export const onRequest = async ({ request, env }: { request: Request; env: Env }) => {
const denied = await apiSecurity(request, env);
if (denied) return denied;
const userId = request.method === "POST" ? await authenticateUser(request, env) : null;
if (userId instanceof Response) return userId;
return handleComposer(request, async () => {
  const asset = new Request(new URL("/data/blocks.json", request.url));
  const response = env.ASSETS ? await env.ASSETS.fetch(asset) : await fetch(asset);
  if (!response.ok) throw new Error("Catalogue unavailable");
  return decodeCatalogue(await response.json());
}, { ...env, WORKFLOW_COMPOSER_ENABLED: authConfigured(env) ? env.WORKFLOW_COMPOSER_ENABLED : "false" }, env.COMPOSER ? d1Composer(env.COMPOSER) : null, request.headers.get("cf-connecting-ip") ?? "", undefined, userId);
};
