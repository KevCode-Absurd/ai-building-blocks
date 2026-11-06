// Registry of every module's API routes and scheduled work. Modules add routes in their own routes.ts only.
import type { Route } from "../core/http.ts";
import type { Env } from "../env.ts";
import * as catalogue from "./catalogue/routes.ts";
import * as intake from "./intake/routes.ts";
import * as runner from "./runner/routes.ts";
import * as evaluation from "./evaluation/routes.ts";
import * as delivery from "./delivery/routes.ts";
import * as ops from "./ops/routes.ts";
import * as studio from "./studio/routes.ts";
import * as experts from "./experts/routes.ts";
import * as mcp from "./mcp/routes.ts";
import * as directory from "./directory/routes.ts";

const modules: { routes: Route[]; scheduled?: ((env: Env) => Promise<void>)[] }[] = [catalogue, intake, runner, evaluation, delivery, ops, studio, experts, mcp, directory];

export const moduleRoutes: Route[] = modules.flatMap(m => m.routes);
export const scheduledTasks: ((env: Env) => Promise<void>)[] = modules.flatMap(m => m.scheduled ?? []);
