// Cloudflare Pages Function for /api/spaces and everything under it. The work is done in src/server/spaces.ts.
// Setup (database, binding, secrets): docs/SPACES.md.
import { d1Spaces, handleSpaces } from "../../../src/server/spaces";

type Env = { SPACES?: Parameters<typeof d1Spaces>[0]; SPACES_TEAM_TOKEN?: string; SPACES_SALT?: string };

export const onRequest = ({ request, env }: { request: Request; env: Env }) =>
  handleSpaces(request, env.SPACES ? d1Spaces(env.SPACES) : null, {
    ip: request.headers.get("cf-connecting-ip") ?? "",
    salt: env.SPACES_SALT,
    teamToken: env.SPACES_TEAM_TOKEN,
  });
