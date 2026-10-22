/// <reference types="vite/client" />
// The app starter pack, read straight from ../app-starter at build time, so the page and the download share one source.
// The zip is made in the browser by plain code, so it's the same every time.
import type { Zippable } from "fflate";

const RAW = import.meta.glob("../../../app-starter/**/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

/** Every file, keyed by its path inside the pack (README.md, stages/1-one-screen.md…), in a fixed order. */
export const FILES: [string, string][] = Object.entries(RAW)
  .map(([k, v]) => [k.replace(/^.*app-starter\//, ""), v] as [string, string])
  .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b));
function rank(p: string) {
  return ["README.md", "START-HERE.md", "BUILD-RULES.md", "QUESTIONS.md"].indexOf(p) + 1 || (p.startsWith("stages/") ? 10 : 20);
}
export const file = (p: string) => FILES.find(([k]) => k === p)?.[1] ?? "";

/** The prompt people paste: everything under the first line rule in START-HERE.md. */
export const START_PROMPT = file("START-HERE.md").split(/\n---\n/).slice(1).join("\n---\n").trim();

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Each stage's number, name and what you get, from the top of its file. */
export const STAGES = FILES.filter(([k]) => k.startsWith("stages/")).map(([k, v]) => {
  const title = /^# Stage (\d+) · (.+)$/m.exec(v);
  const get = /^\*\*You get:\*\* (.+)$/m.exec(v);
  return { file: k, n: Number(title?.[1] ?? 0), name: title?.[2] ?? k, get: cap(get?.[1] ?? ""), optional: /optional/i.test(title?.[2] ?? "") };
});


export async function starterZip(): Promise<Blob> {
  const { strToU8, zipSync } = await import("fflate");
  const files: Zippable = {};
  // A fixed date keeps the zip byte-for-byte the same on every download.
  const mtime = new Date("2026-10-19T00:00:00Z");
  for (const [k, v] of FILES) files[`app-starter/${k}`] = [strToU8(v.replace(/\r\n/g, "\n")), { mtime }];
  return new Blob([zipSync(files, { level: 6 })], { type: "application/zip" });
}
