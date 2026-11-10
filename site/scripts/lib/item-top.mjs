// The top of an item page as plain HTML (scripts/prerender.mjs), matching what the app draws (src/BlockPage.tsx,
// src/BlockHeader.tsx): a visible format label, then what you give it, what you get back, how long it takes, one
// Download button and one line on how to use it. The inputs are listed here and nowhere else on the page.
import { itemBrief, levelLabel, plainWords, promptFileName, shortGloss } from "../../src/lib/item-brief.mjs";
import { formatOfKind } from "../../src/lib/formats.mjs";

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const list = (items) => (items.length ? `<ul>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : "");

/** The small line under the opening: the format first, then what is true of this item. No unexplained scores. */
export function factsLine({ kind, licence = "", by = "", level = "", tested = false, updated = "" }) {
  return [formatOfKind(kind).name, "Free", "No account", ...(licence ? [`${licence.replace(/-/g, " ")} licence`] : []), `Made by ${by || "AI Blocks"}`,
    ...(levelLabel(level) ? [levelLabel(level)] : []), ...(tested ? ["Safety checked"] : []), ...(updated ? [`Updated ${updated}`] : [])];
}

/** Where the Download link of a plain page points, or null when the app builds the download (a workflow or agent
 *  pack). A prompt with no extra files downloads as one text file with "prompt" in its name. */
export function downloadLink({ kind, slug, hasFiles = false, pack = false }) {
  if (pack) return null;
  if (hasFiles) return { href: `/skills/${slug}.zip`, name: "" };
  return { href: `/skills/${slug}/SKILL.md`, name: kind === "prompt" ? promptFileName(slug) : "" };
}

/** "At a glance": what you give it, what you get back, how long, then Download and how to use it. */
export function itemTopHtml({ kind, block, page, slug, steps = 0, hasFiles = false, pack = false, name = "" }) {
  const format = formatOfKind(kind);
  const brief = itemBrief({ kind, block, page, steps });
  const link = downloadLink({ kind, slug, hasFiles, pack });
  const extras = [...(page?.plan?.needed ?? []).filter((n) => !n.required), ...(page?.plan?.helps ?? [])].slice(0, 3).map((n) => `${plainWords(n.label)}${n.what ? ` (${shortGloss(n.what)})` : ""}`);
  const next = kind === "mind" && name ? `Then add the file to your AI once and ask for ${name} by name.` : format.next;
  return `<section id="task-start" class="item-brief"><h2>At a glance</h2><dl>`
    + (brief.give.length ? `<dt>You give it</dt><dd>${list(brief.give)}</dd>` : "")
    + (brief.get.length ? `<dt>You get back</dt><dd>${list(brief.get)}${brief.more ? `<p class="small"><a href="#get">See everything you get</a></p>` : ""}</dd>` : "")
    + `<dt>How long</dt><dd>${esc(brief.time)}</dd></dl>`
    + (extras.length ? `<p class="small">Better with, if you have them: ${esc(extras.join("; "))}.</p>` : "")
    + (link ? `<p><a class="btn btn-primary" href="${esc(link.href)}" download${link.name ? `="${esc(link.name)}"` : ""}>Download ${format.noun}</a></p>` : `<p><b>Download ${format.noun}</b> is the main button on this page.</p>`)
    + `<p class="small">${esc(next)}</p></section>`;
}

/** The other ways to use an item, in the item's own word for itself. */
export function otherWaysHtml({ kind, hasFiles = false, pack = false, coordinatorFiles = "" }) {
  const noun = formatOfKind(kind).noun;
  const line = coordinatorFiles ? `Give the whole pack to your AI and ask it to read ${coordinatorFiles}. It follows the instructions and stops at each checkpoint.`
    : pack ? "Copy the main instructions, or open the steps in the builder and change them."
    : kind === "prompt" ? "Copy the prompt and paste it into any chat. Add your details under it and send."
    : `Copy the ${noun} and paste it into any chat.${hasFiles ? " Copying leaves out the supporting files, so use the download for those." : ""}`;
  return `<section id="run"><h2>Other ways to use it</h2><p>${esc(line)} <a href="/how-it-works#use-in-ai">How to use</a></p></section>`;
}
