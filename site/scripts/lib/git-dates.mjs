// Honest dates for catalogue files: the day a file's content last changed, and the day it first appeared.
// They come from git history, so a fresh checkout, a copy or a rebuild never moves them (file times do).
// A file with uncommitted changes, or one git doesn't know, falls back to its file time: that is the day it was
// really edited. Outside a git checkout everything falls back to file times, as before.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const git = (dir, args) => execFileSync("git", ["-c", "core.longpaths=true", "-C", dir, "-c", "core.quotePath=false", ...args], { encoding: "utf8", maxBuffer: 512 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });
// git quotes a path with unusual characters ("a\tb"); undo that.
const unquote = (p) => (p.startsWith('"') && p.endsWith('"') ? p.slice(1, -1).replace(/\\([0-7]{3}|.)/g, (_, c) => (c.length === 3 ? String.fromCharCode(parseInt(c, 8)) : { n: "\n", t: "\t", "\\": "\\", '"': '"' }[c] ?? c)) : p);
const day = (iso) => (iso ? new Date(iso).toISOString().slice(0, 10) : "");

/** Reads the history under `dir` once. Returns lookups by absolute path. */
export function gitDates(dir) {
  const root = path.resolve(dir);
  const last = new Map(), first = new Map(), dirty = new Set();
  let usable = false, shallow = false;
  try {
    const top = path.resolve(git(root, ["rev-parse", "--show-toplevel"]).trim());
    shallow = git(root, ["rev-parse", "--is-shallow-repository"]).trim() === "true";
    // Newest commit first: the first date seen for a file is its last change, the final one its first appearance.
    let when = "";
    for (const line of git(root, ["log", "--format=@%cI", "--name-only", "--no-renames", "--", "."]).split("\n")) {
      if (!line) continue;
      if (line.startsWith("@")) { when = line.slice(1); continue; }
      const file = path.resolve(top, unquote(line));
      if (!last.has(file)) last.set(file, when);
      first.set(file, when);
    }
    // Uncommitted edits and new files: their file time is the honest date until they are committed.
    for (const entry of git(root, ["status", "--porcelain", "-z", "--untracked-files=all", "--", "."]).split("\0")) {
      if (entry.length > 3 && entry[2] === " ") dirty.add(path.resolve(top, entry.slice(3)));
    }
    usable = true;
  } catch { /* Not a git checkout, or no git: file times only. */ }
  const mtime = (file) => { try { return fs.statSync(file).mtime.toISOString(); } catch { return ""; } };
  const exists = (file) => fs.existsSync(file);
  /** The newest change among the files that exist, as a full ISO time. */
  const modifiedAt = (files) => {
    const times = files.map((f) => path.resolve(f)).filter(exists).map((f) => (usable && !dirty.has(f) && last.has(f) ? last.get(f) : mtime(f))).filter(Boolean);
    return times.length ? times.reduce((a, b) => (Date.parse(a) >= Date.parse(b) ? a : b)) : "";
  };
  /** The first day any of the files was committed (or its file time when none has been). */
  const publishedAt = (files) => {
    const times = files.map((f) => path.resolve(f)).filter(exists).map((f) => (usable && first.has(f) ? first.get(f) : mtime(f))).filter(Boolean);
    return times.length ? times.reduce((a, b) => (Date.parse(a) <= Date.parse(b) ? a : b)) : "";
  };
  return {
    usable, shallow, dirty: dirty.size,
    modifiedAt, publishedAt,
    /** YYYY-MM-DD, the day shown as "Updated" and used as lastmod and dateModified. */
    modified: (files) => day(modifiedAt(files)),
    published: (files) => day(publishedAt(files)),
  };
}
