import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

// A filesystem path is not a URL: temp folders may contain spaces, # or %.
// Keep the bundle cleanup in both the success and module-error paths.
export async function importEvaluationBundle(file) {
  try {
    return await import(pathToFileURL(file).href);
  } finally {
    fs.rmSync(file, { force: true });
  }
}
