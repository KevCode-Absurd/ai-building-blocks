// Pages for the mcp module. Register each page here; src/ui/pages/index.ts collects them.
import type { NavItem, PageDef } from "../types.ts";
import { Connect } from "./connect.tsx";
import { Consent } from "./consent.tsx";
import "./mcp.css";

export const pages: PageDef[] = [
  { path: "/connect", access: "public", component: Connect },
  { path: "/oauth/consent", access: "signed-in", component: Consent },
];

export const nav: NavItem[] = [
  { label: "Connect your AI", href: "/connect", group: "account", order: 20 },
];
