// The browser side of spaces (src/server/spaces.ts): the owner key this browser keeps, and calls to /api/spaces.
// The key is like a password for the space. It stays in this browser and travels only in the Authorization header,
// or in a "use it on another device" link the owner copies, where it sits after # so it never reaches a server log.
import { useSyncExternalStore } from "react";
import type { Item, Kind, PublicItem, Space, Visibility } from "../server/spaces";
import { protectedHeaders } from "./turnstile";
import { getAccountToken, hasAccount } from "./library-storage";
import type { AccessPolicy } from "../server/space-access";

export type { Item, Kind, PublicItem, Space, Visibility };
export const KIND_NAMES: Record<Kind, string> = { skill: "Skill", prompt: "Prompt", workflow: "Workflow", kit: "Kit", agent: "Agent" };

const KEY = "abb:space-key";
const listeners = new Set<() => void>();
const read = () => { try { return localStorage.getItem(KEY) ?? ""; } catch { return ""; } };
let key = read();
export function setSpaceKey(k: string) {
  key = k.trim();
  try { key ? localStorage.setItem(KEY, key) : localStorage.removeItem(KEY); } catch { /* private mode: keep it for this visit */ }
  listeners.forEach((l) => l());
}
export const legacySpaceKey = () => key;
export const spaceKey = () => hasAccount() ? "account" : key;
export const useSpaceKey = () => useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => key);
if (typeof window !== "undefined") window.addEventListener("storage", (e) => { if (e.key === KEY) { key = read(); listeners.forEach((l) => l()); } });

/** A link that opens this space on another device: /space#key=... (the part after # stays in the browser). */
export const deviceLink = (k: string) => `${location.origin}/space#key=${encodeURIComponent(k)}`;
export const shareLink = (token: string) => `${location.origin}/s/${encodeURIComponent(token)}`;

export class SpaceError extends Error {
  constructor(message: string, public status: number) { super(message); }
}
async function call<T>(method: string, path: string, body?: unknown, auth?: string, extra: Record<string, string> = {}): Promise<T> {
  let r: Response;
  try {
    const verification = method === "POST" && path === "" ? await protectedHeaders("create_space") : {};
    const credential = auth === undefined ? await getAccountToken() ?? key : auth;
    r = await fetch(`/api/spaces${path}`, { method, cache: "no-store", headers: { "content-type": "application/json", ...verification, ...extra, ...(credential ? { authorization: `Bearer ${credential}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch (e) {
    throw new SpaceError(e instanceof Error ? e.message : "Couldn't reach the site. Check your connection and try again.", 0);
  }
  const out = await r.json().catch(() => ({}));
  if (!r.ok) throw new SpaceError(out.error ?? (r.status === 404 ? "Spaces aren't switched on for this copy of the site yet." : "That didn't work. Try again."), r.status);
  return out as T;
}

export type NewItem = { kind: Kind; title: string; summary?: string; body?: string; data?: unknown; visibility?: Visibility };
export const spaces = {
  make: (name: string) => call<{ space: Space; ownerKey: string; shareToken: string }>("POST", "", { name }),
  mine: (k?: string) => call<{ space: Space; shareToken: string; access: AccessPolicy; items: Item[] }>("GET", "/me", undefined, k),
  access: (access: AccessPolicy) => call<{ access: AccessPolicy }>("PUT", "/me/access", access),
  claim: (legacy = key) => call<{ ok: true }>("POST", "/me/claim", undefined, undefined, { "x-space-key": legacy }),
  rename: (name: string) => call<{ space: Space }>("PATCH", "/me", { name }),
  newLink: () => call<{ shareToken: string }>("POST", "/me/link"),
  add: (item: NewItem) => call<{ item: Item }>("POST", "/me/items", item),
  change: (id: string, patch: Partial<NewItem>) => call<{ item: Item }>("PATCH", `/me/items/${encodeURIComponent(id)}`, patch),
  remove: (id: string) => call<{ ok: true }>("DELETE", `/me/items/${encodeURIComponent(id)}`),
  shared: (token: string) => call<{ space: { name: string; updated: string }; items: Item[] }>("GET", `/shared/${encodeURIComponent(token)}`, undefined, hasAccount() ? undefined : ""),
  publicList: () => call<{ items: PublicItem[] }>("GET", "/public", undefined, ""),
  publicItem: (id: string) => call<{ item: Item }>("GET", `/public/${encodeURIComponent(id)}`, undefined, ""),
};

/** Reads a dropped or picked file: one SKILL.md or text file, or a zip with SKILL.md files inside. */
export async function itemsFromFile(file: File): Promise<NewItem[]> {
  if (/\.zip$/i.test(file.name)) {
    const { unzipSync, strFromU8 } = await import("fflate");
    const files = unzipSync(new Uint8Array(await file.arrayBuffer()));
    return Object.entries(files)
      .filter(([n]) => /(^|\/)SKILL\.md$/i.test(n) || (/\.md$/i.test(n) && !/(^|\/)(references|templates)\//i.test(n) && Object.keys(files).filter((x) => /\.md$/i.test(x)).length === 1))
      .slice(0, 50)
      .map(([n, bytes]) => fromText(strFromU8(bytes), n.split("/").slice(-2, -1)[0] || n.replace(/\.md$/i, "")));
  }
  return [fromText(await file.text(), file.name.replace(/\.(md|txt)$/i, ""))];
}

/** A skill file's name and line from its frontmatter, or its first heading and first sentence. */
export function fromText(text: string, fallback: string, kind: Kind = "skill"): NewItem {
  const t = text.replace(/\r\n?/g, "\n");
  const fm = /^---\n([\s\S]*?)\n---/.exec(t)?.[1] ?? "";
  const field = (k: string) => new RegExp(`^${k}:\\s*(.+)$`, "m").exec(fm)?.[1].trim().replace(/^["']|["']$/g, "") ?? "";
  const heading = /^#\s+(.+)$/m.exec(t)?.[1].trim() ?? "";
  const slugName = field("name").replace(/-/g, " ");
  const title = heading || (slugName ? slugName.charAt(0).toUpperCase() + slugName.slice(1) : "") || fallback.replace(/[-_]/g, " ");
  const summary = (field("description") || t.replace(/^---[\s\S]*?---/, "").replace(/^#.*$/gm, "").trim().split(/(?<=\.)\s/)[0] || "").slice(0, 240);
  return { kind, title: title.slice(0, 80) || "Untitled", summary, body: t };
}
