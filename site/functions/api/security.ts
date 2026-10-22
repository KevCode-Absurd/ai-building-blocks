import { securityConfig, type SecurityEnv } from "../../src/server/api-security.ts";
export const onRequest = ({ request, env }: { request: Request; env: SecurityEnv }) => securityConfig(request, env);
