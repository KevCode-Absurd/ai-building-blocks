import { apiSecurity, type SecurityEnv } from "../../src/server/api-security.ts";
import { type AuthEnv } from "../../src/server/auth.ts";
import { d1Minds, handleAccountMinds } from "../../src/server/account-minds.ts";
type Env = SecurityEnv & AuthEnv & { COMPOSER?: Parameters<typeof d1Minds>[0] };
export const onRequest = async ({ request, env }: { request: Request; env: Env }) => {
  const denied = await apiSecurity(request, env); if (denied) return denied;
  return handleAccountMinds(request, env, env.COMPOSER ? d1Minds(env.COMPOSER) : null);
};
