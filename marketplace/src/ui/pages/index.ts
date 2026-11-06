// Every page and header link in the app. Modules register theirs in src/ui/pages/<module>/index.tsx.
import type { NavItem, PageDef } from "./types.ts";
import * as core from "./core.tsx";
import * as directory from "./directory/index.tsx";
import * as intake from "./intake/index.tsx";
import * as delivery from "./delivery/index.tsx";
import * as evaluation from "./evaluation/index.tsx";
import * as ops from "./ops/index.tsx";
import * as studio from "./studio/index.tsx";
import * as experts from "./experts/index.tsx";
import * as mcp from "./mcp/index.tsx";

const all = [directory, intake, delivery, evaluation, ops, studio, experts, mcp, core];

/** Module pages first, so a module can own a specific path; the core 404 page comes last. */
export const PAGES: PageDef[] = all.flatMap(m => m.pages);
export const NAV: NavItem[] = all.flatMap(m => m.nav).sort((a, b) => a.order - b.order);
