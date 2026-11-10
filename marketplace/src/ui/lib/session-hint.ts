// Whether the browser app should load Clerk now (src/ui/lib/auth.tsx). No imports, so tests can load it in Node.

/** Pages anyone can use signed out (expert profiles and invite pages too, not the application). Elsewhere (accounts, consent, ops, studio) Clerk always loads. */
export const PUBLIC_PAGE = /^\/($|agents(\/|$)|guides(\/|$)|connect$|experts\/(?!apply(\/|$))[^/]+)/;

/** Clerk keeps a __client_uat cookie on useaiblocks.com: a timestamp while someone is signed in, "0" or missing
 *  otherwise. Without it, a public page skips downloading Clerk (most of the page weight) until the visitor signs in. */
export function maybeSignedIn(cookie: string, search = ""): boolean {
  if (/[?&]__clerk_/.test(search)) return true;
  return cookie.split(/;\s*/).some(c => /^__client_uat(_[^=]*)?=/.test(c) && !/=0?$/.test(c));
}
