// The public "How we check items for safety" page (/how-we-check-safety), built at build time from the scan results in
// catalogue-items/_safety.json (tools/safety-scan.mjs). Every number is read from that file, so the page changes when a
// new scan is written. scripts/lib/trust-pages.mjs puts it into the site's page shell.

export const SAFETY_PATH = "/how-we-check-safety";

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const day = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso ?? "")); return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : ""; };
const n = (x) => Number(x ?? 0).toLocaleString("en-US");
const list = (items) => `<ul class="hub-list">${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;

export const LOOKS_FOR = [
  ["Code that downloads and runs other code", "Such as a command that pipes a web download straight into a shell."],
  ["Hidden payloads", "Code hidden by encoding, long scrambled blocks, or compiled files nobody can read."],
  ["Data sent to drop boxes", "Links to paste sites, tunnels and webhook catchers often used to steal data."],
  ["Reading saved secrets", "Code that opens SSH keys, cloud passwords, browser cookies or keychains."],
  ["Staying on your computer", "Steps that set a program to start again later or every time you log in."],
  ["Remote control and mining", "Code that opens a back door or mines cryptocurrency."],
  ["Commands that wipe things", "Deleting whole folders, rewriting code history or dropping a database."],
  ["Text aimed at your AI", "Words that tell the AI to ignore its rules, hide what it does, skip your approval, send your data out, or obey instructions from a web page."],
  ["Invisible characters", "Hidden text-direction marks and invisible characters that can hide words from you but not from an AI."],
];

/** The page: { url, title, documentTitle, desc, h1, body, modified } for prerender's render(). */
export function safetyPage(safety) {
  const s = safety?.stats ?? {}, when = day(safety?.scanned);
  const numbers = [
    [`${n(s.items)} items`, `scanned${when ? ` on ${when}` : ""}: every skill, prompt, workflow, agent and mind.`],
    [`${n(s.files)} files`, `read line by line. ${n(s.withScripts)} items include scripts.`],
    [`${n(s.findings)} matches`, `found by the scan. ${n(s.reviewed)} serious ones were each read in their real context, and every decision was written down with its reason.`],
    [`${n(s.falseAlarms)} false alarms`, "such as a security guide that shows an attack so you can spot it."],
    [`${n(s.notes)} notes`, "real but acceptable, such as an official installer. Each one is shown on that item's page."],
    [`${n(s.blocked)} withheld`, s.blocked ? "taken off the site until they are fixed." : "Nothing needed to be taken off the site in this scan."],
  ];
  const body = [
    `<p class="bp-sub">Before an item goes live, we scan every file it ships with for harmful code and for hidden instructions aimed at your AI. Nothing is run during the scan. Every serious match is then read in context, and we decide what happens to it. In this scan, Claude did the first read of each match and we checked a sample of its calls.</p>`,
    `<h2 class="hub-h2">The numbers</h2>${list(numbers.map(([a, b]) => `<b>${esc(a)}</b><span>${esc(b)}</span>`))}`,
    `<p class="small">Scan rules version ${esc(safety?.rules ?? "")}. This page is built from the same results file the site uses for each item's guardrails.</p>`,
    `<h2 class="hub-h2">What the scan looks for</h2>${list(LOOKS_FOR.map(([a, b]) => `<b>${esc(a)}</b><span>${esc(b)}</span>`))}`,
    `<h2 class="hub-h2">What we do with a match</h2>${list([
      ["False alarm", "The text warns against the thing, or teaches you to defend against it. We record why and move on."],
      ["Note", "It's real and has a good reason, like an official installer. We keep it and tell you on the item's page."],
      ["Withhold", "It could act against you. We take the item off the site, and anything that uses it, until it's fixed."],
    ].map(([a, b]) => `<b>${esc(a)}</b><span>${esc(b)}</span>`))}`,
    `<h2 class="hub-h2">Safety guardrails on every item</h2><p>Each item's page has a Safety guardrails section, and every download includes a SAFETY.md file. They say what the item can do, such as run scripts, connect to websites, delete files or need an API key, and what to check before you use it.</p>`,
    `<h2 class="hub-h2">What the scan can't promise</h2>${list([
      "It finds known patterns. A new kind of attack, or a well-hidden one, can get past it.",
      "It reads the files but doesn't run them, so it can't see what a script does with your data at run time.",
      "It checks the copy we ship. If you get the item from its original source, that copy may be different.",
      "Safety checked isn't the same as tested for quality. It means we found nothing harmful or hidden.",
    ].map((t) => `<span>${esc(t)}</span>`))}`,
    `<p>Found something we missed? Tell us on the <a href="/support">help page</a> and we'll look at it.</p>`,
    `<p class="hub-links"><span>Next</span><a href="/how-we-test">How we test the job planner</a><a href="/how-it-works">How it works</a><a href="/api-and-mcp#connect">Connect your AI</a></p>`,
  ].join("");
  return {
    url: SAFETY_PATH,
    title: "How we check items for safety",
    documentTitle: "How we check AI skills for malware and hidden instructions | AI Blocks",
    desc: `We scanned ${n(s.items)} AI skills, prompts, workflows and agents for harmful code and hidden instructions. See what we look for, what we found and what a scan can't promise.`,
    h1: "How we check items for safety",
    body,
    modified: safety?.scanned,
  };
}
