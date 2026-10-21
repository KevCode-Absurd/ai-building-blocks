// Editorial copy is separate from licensed source instructions and stable URLs.
export function applyDisplayCopy(item, page, edit) {
  if (!edit) return { item, page, aliases: [] };
  const allowed = new Set(["name", "summary", "subhead", "reason"]);
  for (const [key, value] of Object.entries(edit)) {
    if (!allowed.has(key) || typeof value !== "string" || !value.trim()) throw new Error(`Invalid display copy: ${item.slug}/${key}`);
  }
  const before = page?.name ?? item.name;
  const fields = Object.fromEntries(["name", "summary", "subhead"].filter((key) => edit[key]).map((key) => [key, edit[key]]));
  if (edit.name) fields.headline = edit.name;
  return {
    item: { ...item, ...fields },
    page: { ...page, ...fields },
    aliases: edit.name && before !== edit.name ? [before] : [],
  };
}
