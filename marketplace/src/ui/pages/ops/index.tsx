// Pages for the ops module. Register each page here; src/ui/pages/index.ts collects them.
import type { NavItem, PageDef } from "../types.ts";
import "./ops.css";
import { lazy } from "preact/compat";
const OpsHome = lazy(() => import("./home.tsx").then(m => ({ default: m.OpsHome })));
const OpsJob = lazy(() => import("./job.tsx").then(m => ({ default: m.OpsJob })));
const OpsAgents = lazy(() => import("./agents.tsx").then(m => ({ default: m.OpsAgents })));
const OpsExperts = lazy(() => import("./experts.tsx").then(m => ({ default: m.OpsExperts })));
const OpsBeta = lazy(() => import("./beta.tsx").then(m => ({ default: m.OpsBeta })));
const OpsCosts = lazy(() => import("./costs.tsx").then(m => ({ default: m.OpsCosts })));
const OpsReview = lazy(() => import("./review.tsx").then(m => ({ default: m.OpsReview })));

export const pages: PageDef[] = [
  { path: "/ops", access: "ops", component: OpsHome },
  { path: "/ops/jobs/:id", access: "ops", component: OpsJob },
  { path: "/ops/agents", access: "ops", component: OpsAgents },
  { path: "/ops/experts", access: "ops", component: OpsExperts },
  { path: "/ops/beta", access: "ops", component: OpsBeta },
  { path: "/ops/costs", access: "ops", component: OpsCosts },
  { path: "/ops/review", access: "ops", component: OpsReview },
];

export const nav: NavItem[] = [
  { label: "Ops", href: "/ops", group: "main", order: 90, show: me => !!me?.roles.ops },
];
