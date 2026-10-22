import fs from "node:fs";
import path from "node:path";
const KEYS = new Set(["OPENAI_API_KEY", "ANTHROPIC_API_KEY", "GEMINI_API_KEY", "DEEPSEEK_API_KEY", "TEST_RUN_CAP_USD", "TEST_ROUND_CAP_USD", "WORKFLOW_COMPOSER_ENABLED", "WORKFLOW_DAILY_CAP_USD", "WORKFLOW_DEFAULT_MODEL", "WORKFLOW_SALT", "CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY", "CLERK_JWT_KEY"]);
// Read only known values, never print configuration contents.
export function loadWorkflowEnv(root) {
  const env = {};
  for (const file of [path.resolve(root, "../.env"), path.join(root, ".env")]) if (fs.existsSync(file)) for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/); if (m && KEYS.has(m[1])) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  for (const name of KEYS) if (process.env[name]) env[name] = process.env[name];
  return env;
}
