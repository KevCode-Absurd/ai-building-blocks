import { TASKS, AREAS } from '../../src/lib/catalogue-taxonomy.mjs';

/** Compile reviewed, declarative metadata; reject typos and conflicting filing. */
export function compileClassifications(source = {}) {
  const primary = new Map(), secondary = new Map(), jobFunctions = new Map(), topics = new Map();
  const tasks = new Set(TASKS.map(task => task.id)), areas = new Set(AREAS.map(area => area.id));
  for (const [section, destination, valid] of [['primary', primary, tasks], ['secondary', secondary, tasks], ['job_functions', jobFunctions, areas], ['topics', topics, null]]) {
    for (const [id, slugs] of Object.entries(source[section] ?? {})) {
      if (valid ? !valid.has(id) : !id.trim() || id.length > 100) throw Error(`classification.yaml: unknown ${section} id ${id}`);
      if (!Array.isArray(slugs) || slugs.some(slug => typeof slug !== 'string')) throw Error(`classification.yaml: ${id} needs a list of slugs`);
      if (new Set(slugs).size !== slugs.length) throw Error(`classification.yaml: duplicate slug in ${id}`);
      for (const slug of slugs) {
        if (section === 'primary') {
          if (destination.has(slug)) throw Error(`classification.yaml: conflicting primary use cases for ${slug}`);
          destination.set(slug, id);
        } else destination.set(slug, [...(destination.get(slug) ?? []), id]);
      }
    }
  }
  return {
    primary,
    fields(slug) {
      return { ...(secondary.has(slug) ? { tasks: secondary.get(slug) } : {}), ...(jobFunctions.has(slug) ? { jobFunctions: jobFunctions.get(slug) } : {}), ...(topics.has(slug) ? { topics: topics.get(slug) } : {}) };
    },
    validateSlugs(slugs) {
      const known = new Set(slugs);
      for (const slug of new Set([...primary.keys(), ...secondary.keys(), ...jobFunctions.keys(), ...topics.keys()])) if (!known.has(slug)) throw Error(`classification.yaml: unknown or withheld item ${slug}`);
    },
  };
}
