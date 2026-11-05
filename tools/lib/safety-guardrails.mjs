// Plain guardrails for one item, from its safety scan entry (catalogue-items/_safety.json, written by tools/safety-scan.mjs).
// Shown as "Safety guardrails" on the item's page and shipped as SAFETY.md in its download. Grade 8 wording, one idea a line.

const LANG = { py: "Python", js: "JavaScript", mjs: "JavaScript", cjs: "JavaScript", ts: "TypeScript", tsx: "TypeScript", jsx: "JavaScript", sh: "shell", bash: "shell", zsh: "shell",
  ps1: "PowerShell", psm1: "PowerShell", bat: "Windows batch", cmd: "Windows batch", rb: "Ruby", go: "Go", rs: "Rust", php: "PHP", pl: "Perl", r: "R", m: "MATLAB", sql: "SQL",
  ipynb: "notebook", swift: "Swift", kt: "Kotlin", java: "Java", cs: "C#", c: "C", cc: "C++", cpp: "C++", h: "C", lua: "Lua", applescript: "AppleScript", vbs: "VBScript" };

const CAN = {
  shell: "It can run commands on your computer. Ask your AI to show each command and wait for your OK.",
  "file-delete": "It can delete files. Back up your work first, or point it at a copy.",
  "file-write": "It can create or change files. Point it at a copy of your work the first time.",
  secrets: "It needs an API key or token. Use one with the least access you can, and keep it in a settings file, not in the chat.",
  installs: "It asks you to install other software. Get it from the official site, and check the name is spelled right.",
  browser: "It can control a web browser. Watch what it does, and don't let it sign in to your main accounts.",
  messaging: "It can send emails or messages. Check each one before it goes out.",
  payments: "It can touch payments. Try it in test mode first.",
  database: "It can change a database. Run it on a copy first.",
  git: "It can change your code history. Save and back up your work first.",
  "untrusted-input": "It reads outside text, such as web pages, emails or reviews. Your AI should treat that text as information, not as orders.",
};

const FLAG = {
  privilege: "Some steps need administrator rights. Read those commands before you approve them.",
  "url-shortener": "It has a shortened link. Check where it goes before you open it.",
  "raw-ip-url": "It connects to a bare internet address with no site name. Check you trust it first.",
  "unpinned-remote-install": "It installs a package straight from a web address. Check the source first.",
  "too-large": "One of its files was too big for our scan to read in full.",
  archive: "It includes a packed archive that our scan didn't open. Check it before you unpack it.",
  "scanner-suppression": "Some lines carry notes asking security scanners to skip them. We scanned those lines anyway.",
};

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2026-11-05" -> "5 Nov 2026", the date style used across the site. */
export const scanDay = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso ?? "")); return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : String(iso ?? ""); };

/** The guardrails for one item, most important first. `entry` may be undefined (an item the scan has not seen). */
export function guardrails(entry) {
  const e = entry ?? {}, can = new Set(e.can ?? []), out = [];
  for (const n of e.notes ?? []) out.push(n);
  const scriptCount = Object.values(e.scripts ?? {}).reduce((a, b) => a + b, 0);
  if (scriptCount) {
    const langs = [...new Set(Object.keys(e.scripts).map((x) => LANG[x] ?? x))].slice(0, 3).join(", ");
    out.push(`It comes with ${plural(scriptCount, "script file")} (${langs}). Read them, and run them in a test folder before you use them on real files.`);
    if (e.hosts?.length) {
      const shown = e.hosts.slice(0, 4).join(", "), more = e.hosts.length > 4 ? ` and ${e.hosts.length - 4} more` : "";
      out.push(`Its scripts connect to ${shown}${more}. Only run them if you trust these sites.`);
    } else if (can.has("network")) out.push("Its scripts connect to the internet. Check where they send data before you run them.");
  }
  for (const [id, text] of Object.entries(CAN)) if (can.has(id) && !(id === "file-write" && can.has("file-delete"))) out.push(text);
  for (const f of e.flags ?? []) if (FLAG[f]) out.push(FLAG[f]);
  if (!scriptCount && !e.opaque && !can.has("shell") && !can.has("network")) out.push("It's text only: no scripts, and it makes no web calls on its own.");
  out.push("Don't paste passwords, API keys or card numbers into the chat with it.");
  return [...new Set(out)];
}

/** SAFETY.md for a download: the same guardrails, with the scan date and what the scan can't promise. */
export function safetyMarkdown(name, entry, scanned) {
  return [`# Safety guardrails: ${name}`, "",
    `AI Blocks scanned every file in this download on ${scanDay(scanned)} for harmful code and hidden instructions (things like downloading and running code, sending data to unknown sites, reading saved passwords, and text that tries to override your AI's rules). Nothing in it was run.`, "",
    ...guardrails(entry).map((g) => `- ${g}`), "",
    "A scan finds known patterns. It can't prove a file is safe, so read anything you plan to run. How we check: https://useaiblocks.com/how-we-test", ""].join("\n");
}
