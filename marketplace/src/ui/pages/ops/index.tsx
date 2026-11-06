// Pages for the ops module. Register each page here; src/ui/pages/index.ts collects them.
import type { NavItem, PageDef } from "../types.ts";
import "./ops.css";
import { OpsHome } from "./home.tsx";
import { OpsJob } from "./job.tsx";
import { OpsAgents } from "./agents.tsx";
import { OpsExperts } from "./experts.tsx";
import { OpsBeta } from "./beta.tsx";
import { OpsCosts } from "./costs.tsx";
import { OpsReview } from "./review.tsx";

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
