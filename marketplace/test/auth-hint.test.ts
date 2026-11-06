// The browser app skips downloading Clerk on public pages unless the visitor may be signed in (src/ui/lib/auth.tsx).
import { test } from "node:test";
import assert from "node:assert/strict";
import { maybeSignedIn } from "../src/ui/lib/session-hint.ts";

test("Clerk's __client_uat cookie says whether someone may be signed in", () => {
  assert.equal(maybeSignedIn(""), false);
  assert.equal(maybeSignedIn("__client_uat=0"), false);
  assert.equal(maybeSignedIn("abb:theme=dark; __client_uat=0; other=1"), false);
  assert.equal(maybeSignedIn("__client_uat=1793900000"), true);
  assert.equal(maybeSignedIn("a=b; __client_uat_Xy12=1793900000"), true);
  assert.equal(maybeSignedIn("__client_uat_Xy12=0"), false);
  assert.equal(maybeSignedIn("", "?__clerk_handshake=abc"), true, "coming back from sign-in");
});
