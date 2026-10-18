// Static hosts without rewrites (GitHub Pages) serve 404.html for unknown paths; make it the app.
import fs from "node:fs";
fs.copyFileSync("dist/index.html", "dist/404.html");
