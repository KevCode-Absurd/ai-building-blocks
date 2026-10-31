import { PublicApiError } from '../src/server/public-catalogue.ts';

const publicationMismatch = new Set(['stale_roles', 'stale_role', 'integrity_mismatch']);

// A stdio process can outlive a catalogue publication. Keep one bounded snapshot
// per operation; only pure reads/preparations may use this session.
export function createPreviewCatalogueSession(create, { now = Date.now, maxAgeMs = 30_000 } = {}) {
  let cached;
  const current = () => {
    if (!cached || now() >= cached.expires) cached = { service: create(), expires: now() + maxAgeMs };
    return cached;
  };
  const invalidate = snapshot => { if (cached === snapshot) cached = undefined; };
  return {
    async run(operation) {
      const snapshot = current();
      try { return await operation(snapshot.service); }
      catch (error) {
        invalidate(snapshot);
        // Restart the whole read against a fresh snapshot once. Original inputs,
        // source revision pins and permission checks remain unchanged.
        if (!(error instanceof PublicApiError) || !publicationMismatch.has(error.code)) throw error;
        const refreshed = current();
        try { return await operation(refreshed.service); }
        catch (retryError) { invalidate(refreshed); throw retryError; }
      }
    },
  };
}
