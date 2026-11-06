// Pages for the directory module. Register each page here; src/ui/pages/index.ts collects them.
import "./directory.css";
import type { NavItem, PageDef } from "../types.ts";
import { AgentsPage } from "./browse.tsx";
import { AgentProfilePage } from "./profile.tsx";

export const pages: PageDef[] = [
  { path: "/agents", access: "public", component: AgentsPage },
  { path: "/agents/:id", access: "public", component: AgentProfilePage },
];

export const nav: NavItem[] = [
  { label: "Agents", href: "/agents", group: "main", order: 10 },
];
