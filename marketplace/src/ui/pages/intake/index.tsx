// Pages for the intake module. Register each page here; src/ui/pages/index.ts collects them.
import "./intake.css";
import type { NavItem, PageDef } from "../types.ts";
import { lazy } from "preact/compat";
const NewRequestPage = lazy(() => import("./new.tsx").then(m => ({ default: m.NewRequestPage })));
const RequestPage = lazy(() => import("./request.tsx").then(m => ({ default: m.RequestPage })));

export const pages: PageDef[] = [
  { path: "/new", access: "buyer", component: NewRequestPage },
  { path: "/requests/:id", access: "buyer", component: RequestPage },
];

export const nav: NavItem[] = [
  { label: "Describe a job", href: "/new", group: "main", order: 20, show: me => !!me?.hostedJobs },
];
