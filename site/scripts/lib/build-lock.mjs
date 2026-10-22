import fs from "node:fs";
import path from "node:path";
// A second catalogue build must not delete the first build's generated assets.
export async function acquireBuildLock(file) {
  const lockPath = path.resolve(file), started = Date.now();
  for (;;) {
    try {
      const fd = fs.openSync(lockPath, "wx"); fs.writeFileSync(fd, String(process.pid)); fs.closeSync(fd);
      const release = () => { try { if (fs.readFileSync(lockPath, "utf8") === String(process.pid)) fs.unlinkSync(lockPath); } catch {} };
      process.once("exit", release);
      process.once("SIGINT", () => { release(); process.exit(130); });
      process.once("SIGTERM", () => { release(); process.exit(143); });
      return;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      try {
        const owner = Number(fs.readFileSync(lockPath, "utf8"));
        if (Number.isInteger(owner) && owner > 0) {
          try { process.kill(owner, 0); }
          catch (e) { if (e.code === "ESRCH") { fs.unlinkSync(lockPath); continue; } }
        } else if (Date.now() - fs.statSync(lockPath).mtimeMs > 600000) { fs.unlinkSync(lockPath); continue; }
      } catch (e) { if (e.code === "ENOENT") continue; throw e; }
      if (Date.now() - started > 600000) throw new Error("Another catalogue build is still running. Retry after it finishes.");
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
}
