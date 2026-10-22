import { apiSecurity, type SecurityEnv } from "../../src/server/api-security.ts";
import { handleAccount, type AuthEnv } from "../../src/server/auth.ts";
import { d1Composer } from "../../src/server/composer.ts";

type Env = SecurityEnv & AuthEnv & { COMPOSER?: Parameters<typeof d1Composer>[0] };
export const onRequest = async ({ request, env }: { request: Request; env: Env }) => {
  const denied = await apiSecurity(request, env); if (denied) return denied;
  return handleAccount(request, env, env.COMPOSER ? d1Composer(env.COMPOSER) : null);
};
