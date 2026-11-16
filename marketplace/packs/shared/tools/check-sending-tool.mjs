#!/usr/bin/env node
// check-sending-tool.mjs: emails and texts built for one sending tool (its merge tags, its build steps, "load into X")
// must be built for the tool the owner sends from, and that tool must come from the owner, a connector or the org
// context, never from a script found on their site. A script shows a tool is installed, not where email is sent.
//
//   node tools/check-sending-tool.mjs deliverables --facts context/facts.md
//
// It finds every sending tool named in the deliverables. None, or three and more side by side (a tool-neutral build
// with a merge-tag map), passes. Each other tool named must have a line in facts.md that names it with
// "Source: owner", "Source: connector" or "Source: org context", and does not say it was assumed or seen on the site.
// FAIL (exit 1): a tool built for with no such line, or no facts file. Plain Node, no packages.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const SENDING_TOOLS = ["Klaviyo", "CleverTap", "Mailchimp", "Omnisend", "MoEngage", "WebEngage", "Netcore", "Brevo",
  "Sendinblue", "HubSpot", "Shopify Email", "Shopify Messaging", "Braze", "Iterable", "Customer.io", "Attentive", "Postscript",
  "Drip", "ActiveCampaign", "Zoho Campaigns", "Mailmodo", "Interakt", "Gupshup", "WATI", "AiSensy", "Privy", "SMSBump",
  "Sendlane", "Campaign Monitor", "Constant Contact", "Mailerlite", "Moosend", "Ometria", "Dotdigital", "Bloomreach"];
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const toolsIn = text => SENDING_TOOLS.filter(t => new RegExp(`(^|[^\\w])${esc(t)}(?![\\w])`, "i").test(text));

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const fi = args.indexOf("--facts");
  const factsFile = fi >= 0 ? args[fi + 1] : null;
  const targets = args.filter((a, i) => !a.startsWith("--") && !(fi >= 0 && i === fi + 1));
  if (!targets.length) { console.log("Usage: node tools/check-sending-tool.mjs <deliverable file|folder>... --facts context/facts.md"); process.exit(2); }
  const files = p => (fs.statSync(p).isDirectory() ? fs.readdirSync(p).flatMap(x => files(path.join(p, x))) : [p]);
  const named = new Map();
  for (const t of targets) for (const f of files(t).filter(f => /\.(html?|md|txt|csv|json|liquid)$/i.test(f)))
    for (const tool of toolsIn(fs.readFileSync(f, "utf8"))) named.set(tool, [...(named.get(tool) || []), path.basename(f)]);

  const res = [];
  if (!named.size) res.push(["OK", "No sending tool named in the work: a tool-neutral build."]);
  else if (named.size >= 3) res.push(["OK", `${named.size} sending tools named side by side (${[...named.keys()].join(", ")}): read as a tool-neutral build with a merge-tag map.`]);
  else {
    const facts = factsFile && fs.existsSync(factsFile) ? fs.readFileSync(factsFile, "utf8").split(/\r?\n/) : null;
    for (const [tool, where] of named) {
      const at = `${tool} (in ${[...new Set(where)].slice(0, 3).join(", ")})`;
      if (!facts) { res.push(["FAIL", `The work is built for ${at}, and there is no facts file to show who named it.`, "Ask the owner which tool they send from, and write it in context/facts.md with \"Source: owner\"."]); continue; }
      const lines = facts.filter(l => toolsIn(l).includes(tool));
      const sourced = lines.find(l => /source:\s*(the\s+)?(owner|connector|org[ -]context)|^\s*[-*]?\s*(\*\*)?owner\b|\bowner (said|says|told|confirmed|answered|named)\b|\(owner\b/i.test(l)
        && !/assum|not confirmed|installed|on (the|their) site|site script|did not object|didn't object|guess/i.test(l));
      if (sourced) res.push(["OK", `Built for ${tool}, which the facts trace to: ${sourced.trim().slice(0, 120)}`]);
      else res.push(["FAIL", `The work is built for ${at}, but no fact shows the owner, a connector or the org context named it${lines.length ? ` (facts say: ${lines[0].trim().slice(0, 100)})` : ""}.`, "A script on their site shows a tool is installed, not where email is sent. Ask which tool they send from, with what you found as the default; until they answer, build tool-neutral HTML and text with a merge-tag map."]);
    }
  }
  const nF = res.filter(r => r[0] === "FAIL").length;
  for (const [l, m, fix] of res) console.log(`${l} ${m}${fix ? ` Fix: ${fix}` : ""}`);
  console.log(`${nF ? "FAIL" : "PASS"}: ${named.size} sending tool(s) named, ${nF} fail.`);
  process.exit(nF ? 1 : 0);
}
