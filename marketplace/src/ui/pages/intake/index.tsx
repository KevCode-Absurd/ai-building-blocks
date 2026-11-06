// Pages for the intake module. Register each page here; src/ui/pages/index.ts collects them.
import "./intake.css";
import type { NavItem, PageDef } from "../types.ts";
import { NewRequestPage } from "./new.tsx";
import { RequestPage } from "./request.tsx";

export const pages: PageDef[] = [
  { path: "/new", access: "buyer", component: NewRequestPage },
  { path: "/requests/:id", access: "buyer", component: RequestPage },
];

export const nav: NavItem[] = [
  { label: "New job", href: "/new", group: "main", order: 20 },
];
