import { d1Composer, type ComposerEnv } from "../../src/server/composer.ts";
import { apiSecurity, type SecurityEnv } from "../../src/server/api-security.ts";
import { handleTranscription } from "../../src/server/transcription.ts";
type Env = SecurityEnv & ComposerEnv & { COMPOSER?: Parameters<typeof d1Composer>[0] };
export const onRequest = async ({ request, env }: { request: Request; env: Env }) => {
  const denied = await apiSecurity(request, env);
  if (denied) return denied;
  return handleTranscription(request, env, env.COMPOSER ? d1Composer(env.COMPOSER) : null, request.headers.get("cf-connecting-ip") ?? "");
};
