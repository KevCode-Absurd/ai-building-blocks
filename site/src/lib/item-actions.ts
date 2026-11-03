/** Item page actions: where "Run in my AI" sends the instructions, and how much subhead the opening shows. */

export type RunTarget = { id: "chatgpt" | "claude" | "gemini"; name: string; home: string; prefill: string | null };

/** Prefill links people already use. ChatGPT reads ?q= on chatgpt.com (the address its own browser search
 *  integration opens) and Claude reads ?q= on claude.ai/new. Gemini has no documented prefill link, so it
 *  always gets a copy and a new chat. Every option also copies the text, so an empty box is never a dead end. */
export const RUN_TARGETS: readonly RunTarget[] = [
  { id: "chatgpt", name: "ChatGPT", home: "https://chatgpt.com/", prefill: "https://chatgpt.com/?q=" },
  { id: "claude", name: "Claude", home: "https://claude.ai/new", prefill: "https://claude.ai/new?q=" },
  { id: "gemini", name: "Gemini", home: "https://gemini.google.com/app", prefill: null },
];

/** Long addresses get cut off or refused by servers. Past this, copy instead of prefilling. */
export const MAX_PREFILL_URL = 6000;

export const runTarget = (id: string) => RUN_TARGETS.find(t => t.id === id);

/** The address to open for this text, and whether the text rides along in it. */
export function runLink(id: string, text: string): { url: string; prefilled: boolean } {
  const target = runTarget(id) ?? RUN_TARGETS[0];
  const body = text.trim();
  if (target.prefill && body) {
    const url = target.prefill + encodeURIComponent(body);
    if (url.length <= MAX_PREFILL_URL) return { url, prefilled: true };
  }
  return { url: target.home, prefilled: false };
}

/** Keep the opening short: the first `max` sentences of a subhead. Abbreviations like "e.g." are rare in our copy;
 *  a sentence ends at . ! or ? followed by a space and a capital letter, a digit or a quote. */
export function capSentences(text: string, max = 3): string {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const parts = clean.split(/(?<=[.!?])\s+(?=["“'(A-Z0-9])/);
  return parts.length <= max ? clean : parts.slice(0, max).join(" ");
}
