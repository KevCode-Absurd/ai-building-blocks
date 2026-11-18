// Pages for the studio module. Register each page here; src/ui/pages/index.ts collects them.
import type { NavItem, PageDef } from "../types.ts";
import { lazy } from "preact/compat";
const StudioHome = lazy(() => import("./home.tsx").then(m => ({ default: m.StudioHome })));
const StudioAgent = lazy(() => import("./agent.tsx").then(m => ({ default: m.StudioAgent })));
import "./studio.css";

export const pages: PageDef[] = [
  { path: "/studio", access: "expert", component: StudioHome },
  { path: "/studio/agents/:id", access: "expert", component: StudioAgent },
];

export const nav: NavItem[] = [
  { label: "Studio", href: "/studio", group: "main", order: 70, show: me => me?.expert?.status === "approved" },
];
