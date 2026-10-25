import { unzipSync } from "fflate";
import { COMMUNITY_MAX_BYTES, COMMUNITY_MAX_FILES, COMMUNITY_FILE_BYTES, type CommunityContent } from "./community.ts";
export function importCommunityZip(bytes: Uint8Array): Pick<CommunityContent, "instructions" | "files"> {
  if (bytes.length > COMMUNITY_MAX_BYTES) throw Error("Keep the ZIP under 600 KB.");
  let total = 0, count = 0;
  const seen = new Set<string>();
  const files = unzipSync(bytes, { filter(entry) {
    if (entry.name.endsWith("/")) return false;
    if (++count > COMMUNITY_MAX_FILES + 5 || (total += entry.originalSize) > COMMUNITY_MAX_BYTES || entry.originalSize > COMMUNITY_FILE_BYTES) throw Error("This pack exceeds the text upload limits (40 files, 100 KB each, 600 KB total).");
    if (entry.name.includes("\\") || entry.name.startsWith("/") || entry.name.split("/").some(p => !p || p === ".." || p === ".")) throw Error("This ZIP contains unsafe file paths.");
    if (seen.has(entry.name.toLowerCase())) throw Error("This ZIP contains duplicate file paths.");
    seen.add(entry.name.toLowerCase());
    return true;
  } });
  const decoder = new TextDecoder("utf-8", { fatal: true });
  const entries = Object.entries(files).map(([path, value]) => ({ path, content: decoder.decode(value) }));
  // A single enclosing folder is common in skill exports. Preserve all other paths.
  const first = entries[0]?.path.split("/")[0];
  if (first && entries.every(e => e.path.startsWith(first + "/"))) for (const e of entries) e.path = e.path.slice(first.length + 1);
  const main = entries.find(e => e.path === "SKILL.md") ?? entries.find(e => e.path === "HANDOFF.md");
  if (!main) throw Error("Include a root SKILL.md or HANDOFF.md in the ZIP.");
  return { instructions: main.content, files: entries.filter(e => !["SKILL.md", "community.json", "safety.json", "COMMUNITY_README.txt"].includes(e.path)) };
}
