// Pages for the experts module. Register each page here; src/ui/pages/index.ts collects them.
import type { NavItem, PageDef } from "../types.ts";
import { ApplyPage } from "./apply.tsx";
import { ExpertHome } from "./expert.tsx";
import "./experts.css";

export const pages: PageDef[] = [
  { path: "/experts/apply", access: "signed-in", component: ApplyPage },
  { path: "/expert", access: "signed-in", component: ExpertHome },
];

export const nav: NavItem[] = [
  { label: "Expert dashboard", href: "/expert", group: "account", order: 10, show: me => !!me?.expert },
  { label: "Apply as an expert", href: "/experts/apply", group: "account", order: 11, show: me => !me?.expert },
];
