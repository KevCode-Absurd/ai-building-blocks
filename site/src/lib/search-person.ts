/** Does a library search name one of the minds (a real person's thinking)? Then minds lead the results;
 *  otherwise they follow the tasks. A full name anywhere counts ("ideas from marie curie"). A surname counts
 *  only when it is the whole search and at least five letters, so "jobs" stays a search for jobs. */
type MindLike = { type?: string; name: string };

const plain = (text: string) => text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

export function namesAMind(blocks: readonly MindLike[], query: string): boolean {
  const q = plain(query);
  if (q.length < 4) return false;
  const padded = ` ${q} `, words = q.split(" ");
  return blocks.some(b => {
    if (b.type !== "mind") return false;
    const name = plain(b.name.split(" (")[0]);
    if (name.length < 4) return false;
    if (padded.includes(` ${name} `)) return true;
    const last = name.split(" ").pop()!;
    return words.length === 1 && last.length >= 5 && words[0] === last;
  });
}
