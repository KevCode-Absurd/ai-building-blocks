// Pages for the studio module. Register each page here; src/ui/pages/index.ts collects them.
import type { NavItem, PageDef } from "../types.ts";
import { StudioHome } from "./home.tsx";
import { StudioAgent } from "./agent.tsx";
import "./studio.css";

export const pages: PageDef[] = [
  { path: "/studio", access: "expert", component: StudioHome },
  { path: "/studio/agents/:id", access: "expert", component: StudioAgent },
];

export const nav: NavItem[] = [
  { label: "Studio", href: "/studio", group: "main", order: 70, show: me => me?.expert?.status === "approved" },
];
