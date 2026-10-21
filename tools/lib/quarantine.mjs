// A blocked component also blocks every workflow/agent that would ship it.
export function quarantineClosure(blocks, initial) {
  const blocked = new Set(initial);
  let changed = true;
  while (changed) {
    changed = false;
    for (const b of blocks) if (!blocked.has(b.slug) && [...(b.uses ?? []), ...(b.steps ?? []).map(s => s.uses)].some(s => blocked.has(s))) {
      blocked.add(b.slug); changed = true;
    }
  }
  return blocked;
}
