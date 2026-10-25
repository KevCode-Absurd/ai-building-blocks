import BrowserTool from "./BrowserTool";
import { BROWSER_TOOLS } from "./browser-tools.mjs";

// Browser utilities do not need the calculator registry, examples or formula
// engine. Keep that larger payload on calculator and directory routes.
export default function BrowserToolPage({ path, toast }: { path: string; toast: (message: string) => void }) {
  const tool = BROWSER_TOOLS.find(tool => tool.slug === path.split("/")[2]);
  return tool ? <BrowserTool key={tool.slug} tool={tool} toast={toast} /> : null;
}
