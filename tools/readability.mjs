// How hard a piece of text is to read, as a US school grade (Flesch-Kincaid).
// Grade 8 reads like a good newspaper; we aim for 8 to 10. Plain code, no dependencies.

/** Syllables in one word, by counting vowel groups. Close enough to rank text; not a dictionary. */
export function syllables(word) {
  let w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|[^laeiouy]ed|[^laeiouy]e)$/, (m) => m[0]).replace(/^y/, "");
  return Math.max(1, (w.match(/[aeiouy]{1,2}/g) ?? []).length);
}

const clean = (text) => String(text ?? "")
  .replace(/`[^`]*`/g, "x")           // code reads as one short word
  .replace(/https?:\/\/\S+/g, "link")
  .replace(/[*_#>|]/g, " ");

/** Sentences: ends of sentences, and every line on its own (list items and headings are short sentences). */
export function sentences(text) {
  return clean(text).split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter((s) => /[a-z]/i.test(s));
}
export const wordsOf = (text) => clean(text).match(/[A-Za-z][A-Za-z'-]*/g) ?? [];

/** Flesch-Kincaid grade level of the text, to one decimal. Empty text is grade 0.
 *  Labels, numbers and other fragments under three words are left out: they aren't sentences, and counting
 *  them as sentences would make any page look easy. */
export function grade(text) {
  const s = sentences(text).filter((x) => wordsOf(x).length >= 3);
  const w = s.flatMap((x) => wordsOf(x));
  if (!w.length || !s.length) return 0;
  const syl = w.reduce((n, x) => n + syllables(x), 0);
  return Math.round((0.39 * (w.length / s.length) + 11.8 * (syl / w.length) - 15.59) * 10) / 10;
}

/** The words doing the most damage: three syllables or more, longest first, each once. */
export function hardWords(text, limit = 8) {
  const seen = new Set();
  return wordsOf(text)
    .filter((w) => syllables(w) >= 3 && !seen.has(w.toLowerCase()) && seen.add(w.toLowerCase()))
    .sort((a, b) => syllables(b) - syllables(a) || b.length - a.length)
    .slice(0, limit);
}

/** The longest sentences, which usually need splitting. */
export function longSentences(text, over = 22) {
  return sentences(text).filter((s) => wordsOf(s).length > over);
}
