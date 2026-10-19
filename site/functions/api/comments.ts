// Cloudflare Pages Function for /api/comments. The work is done in src/server/comments.ts.
// Setup (database, binding, secrets): docs/COMMENTS.md.
import { d1Store, handleComments } from "../../src/server/comments";

type Env = { COMMENTS?: Parameters<typeof d1Store>[0]; COMMENTS_TEAM_TOKEN?: string; COMMENTS_SALT?: string };

export const onRequest = ({ request, env }: { request: Request; env: Env }) =>
  handleComments(request, env.COMMENTS ? d1Store(env.COMMENTS) : null, {
    ip: request.headers.get("cf-connecting-ip") ?? "",
    salt: env.COMMENTS_SALT,
    teamToken: env.COMMENTS_TEAM_TOKEN,
  });
