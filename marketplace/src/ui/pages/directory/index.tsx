// Pages for the directory module. Register each page here; src/ui/pages/index.ts collects them.
import "./directory.css";
import type { NavItem, PageDef } from "../types.ts";
import { AgentsPage } from "./browse.tsx";
import { AgentProfilePage } from "./profile.tsx";
import { AgentFilePage } from "./file.tsx";
import { GuidePage, GuidesPage } from "./guides.tsx";

export const pages: PageDef[] = [
  { path: "/agents", access: "public", component: AgentsPage },
  { path: "/agents/:id", access: "public", component: AgentProfilePage },
  { path: "/agents/:id/files/*path", access: "public", component: AgentFilePage },
  { path: "/guides", access: "public", component: GuidesPage },
  { path: "/guides/:slug", access: "public", component: GuidePage },
];

export const nav: NavItem[] = [
  { label: "Agents", href: "/agents", group: "main", order: 10 },
];
