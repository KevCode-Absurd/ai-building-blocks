import { apiSecurity, type SecurityEnv } from "../../src/server/api-security.ts";
import { type AuthEnv } from "../../src/server/auth.ts";
import { d1Library, handleLibrary } from "../../src/server/account-library.ts";
import { saveRequestDiagnostics } from "../../src/server/save-diagnostics.ts";
import { securityJson } from "../../src/server/api-security.ts";
type Env = SecurityEnv & AuthEnv & { COMPOSER?: Parameters<typeof d1Library>[0] };
export const onRequest = async ({ request, env }: { request: Request; env: Env }) => {
  const diagnostics = saveRequestDiagnostics(request.method);
  try {
    const denied = await apiSecurity(request, env, fetch, diagnostics.report);
    if (denied) {
      return diagnostics.finish(denied);
    }
    return diagnostics.finish(await handleLibrary(request, env, env.COMPOSER ? d1Library(env.COMPOSER) : null, diagnostics.report));
  } catch {
    diagnostics.report("http", "unknown");
    return diagnostics.finish(securityJson(503, { error: "Account saving is temporarily unavailable. Your device copy is retained." }));
  }
};
