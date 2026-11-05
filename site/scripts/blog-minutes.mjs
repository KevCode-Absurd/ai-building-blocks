// Writes each blog article's reading time into its metadata (src/content/blog/<slug>.json), so the index and the
// article show the same number without loading every body. Run after editing an article: node scripts/blog-minutes.mjs
import fs from "node:fs";
import path from "node:path";
import { readingMinutes } from "../src/lib/blog.mjs";

const DIR = "src/content/blog";
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith(".json"))) {
  const file = path.join(DIR, f), post = JSON.parse(fs.readFileSync(file, "utf8"));
  const minutes = readingMinutes(fs.readFileSync(path.join(DIR, `${post.slug}.html`), "utf8"));
  if (post.minutes === minutes) continue;
  fs.writeFileSync(file, JSON.stringify({ ...post, minutes }, null, 2) + "\n");
  console.log(`${post.slug}: ${minutes} min`);
}
