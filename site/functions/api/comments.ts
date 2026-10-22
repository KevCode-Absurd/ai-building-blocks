// Cloudflare Pages Function for /api/comments. The work is done in src/server/comments.ts.
// Setup (database, binding, secrets): docs/COMMENTS.md.
import { d1Store, handleComments } from "../../src/server/comments.ts";
import { apiSecurity, type SecurityEnv } from "../../src/server/api-security.ts";

type Env = SecurityEnv & { COMMENTS?: Parameters<typeof d1Store>[0]; COMMENTS_TEAM_TOKEN?: string; COMMENTS_SALT?: string };

export const onRequest = async ({ request, env }: { request: Request; env: Env }) => {
  const denied = await apiSecurity(request, env);
  if (denied) return denied;
  return handleComments(request, env.COMMENTS ? d1Store(env.COMMENTS) : null, {
    ip: request.headers.get("cf-connecting-ip") ?? "",
    salt: env.COMMENTS_SALT,
    teamToken: env.COMMENTS_TEAM_TOKEN,
  });
};
