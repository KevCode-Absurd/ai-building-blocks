import type { JSX } from "preact";
import type { Me } from "../lib/auth.tsx";

/**
 * access: who may open the page.
 *   public     anyone
 *   signed-in  any signed-in person
 *   buyer      signed in with beta access (ordering work)
 *   expert     approved expert
 *   reviewer   reviewer or ops
 *   ops        AI Blocks team
 */
export type Access = "public" | "signed-in" | "buyer" | "expert" | "reviewer" | "ops";

export interface PageDef {
  path: string;                       // e.g. "/agents/:id"
  access: Access;
  component: (props: { params: Record<string, string>; query: URLSearchParams }) => JSX.Element;
}

/** Header links. group "main" shows in the top bar; "account" in the account menu. */
export interface NavItem {
  label: string;
  href: string;
  group: "main" | "account";
  order: number;
  show?: (me: Me | null) => boolean;
}
