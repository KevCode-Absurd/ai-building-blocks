// /api/votes: "Did it work?" answers on item pages. The work is done in src/server/votes.ts.
// The answers share the comments database (binding COMMENTS); the table comes from migrations/0012_item_votes.sql.
import { d1Votes, handleVotes } from "../../src/server/votes.ts";
import { apiSecurity, type SecurityEnv } from "../../src/server/api-security.ts";

type Env = SecurityEnv & { COMMENTS?: Parameters<typeof d1Votes>[0]; COMMENTS_SALT?: string };

export const onRequest = async ({ request, env }: { request: Request; env: Env }) => {
  const denied = await apiSecurity(request, env);
  if (denied) return denied;
  return handleVotes(request, env.COMMENTS ? d1Votes(env.COMMENTS) : null, {
    ip: request.headers.get("cf-connecting-ip") ?? "",
    salt: env.COMMENTS_SALT,
  });
};
