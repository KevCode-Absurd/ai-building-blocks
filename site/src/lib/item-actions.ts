/** Item page actions: how much subhead the opening shows. */

/** Keep the opening short: the first `max` sentences of a subhead. Abbreviations like "e.g." are rare in our copy;
 *  a sentence ends at . ! or ? followed by a space and a capital letter, a digit or a quote. */
export function capSentences(text: string, max = 3): string {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const parts = clean.split(/(?<=[.!?])\s+(?=["“'(A-Z0-9])/);
  return parts.length <= max ? clean : parts.slice(0, max).join(" ");
}
