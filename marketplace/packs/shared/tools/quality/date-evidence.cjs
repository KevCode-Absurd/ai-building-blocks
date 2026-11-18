// Date occurrence matching only: neither source authentication nor permission to promise a date.
// Keep the year. Never guess a year, locale, or the meaning of an ambiguous numeric date.
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const MONTH = '(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\\.?';
const YEAR = '((?:19|20)\\d{2})';
const patterns = [
  [/\b((?:19|20)\d{2})-(\d{1,2})-(\d{1,2})\b/g, m => [+m[1], +m[2], +m[3]]],
  [new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(?:of\\s+)?${MONTH},?\\s+${YEAR}\\b`, 'gi'), m => [+m[3], MONTHS.indexOf(m[2].slice(0, 3).toLowerCase()) + 1, +m[1]]],
  [new RegExp(`\\b${MONTH}\\s+(\\d{1,2})(?:st|nd|rd|th)?,?\\s+${YEAR}\\b`, 'gi'), m => [+m[3], MONTHS.indexOf(m[1].slice(0, 3).toLowerCase()) + 1, +m[2]]],
  [/\b(\d{1,2})([/.])(\d{1,2})\2((?:19|20)\d{2})\b/g, m => {
    const a = +m[1], b = +m[3];
    if (a <= 12 && b <= 12 && a !== b) return null;
    return a > 12 ? [+m[4], b, a] : [+m[4], a, b];
  }],
];
function dateOccurrences(text) {
  const found = [];
  for (const [pattern, parts] of patterns) for (const match of text.matchAll(pattern)) {
    const values = parts(match);
    if (!values) continue;
    const [year, month, day] = values;
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) continue;
    found.push({ start: match.index, end: match.index + match[0].length, text: match[0], key: date.toISOString().slice(0, 10) });
  }
  return found;
}
function sourceDateKeys(text) { return new Set(dateOccurrences(text).map(d => d.key)); }
function dateEvidenceForMatch(occurrences, start, length) {
  return occurrences.find(d => d.start === start && d.end >= start + length) || null;
}
module.exports = { dateOccurrences, sourceDateKeys, dateEvidenceForMatch };
