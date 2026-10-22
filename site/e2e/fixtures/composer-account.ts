import type { Page } from "@playwright/test";

// Browser-only fixture; backend verification uses real RSA signatures in unit tests.
export async function mockComposerAccount(page: Page, signedIn = true, userId = "user_browser_fixture", sessionToken = "browser-fixture-session") {
  await page.route("**/api/auth*", route => route.fulfill({ json: route.request().url().includes("?usage")
    ? { completed: 3, attemptsToday: 4, dailyAttemptLimit: 10 }
    : { configured: true, publishableKey: "pk_test_browser-fixture" } }));
  const sdkFixture = `
    export class Clerk {
      listeners = new Set();
      session = ${signedIn ? `{ id: "sess_browser_fixture", status: "active", user: { id: ${JSON.stringify(userId)} }, getToken: async () => sessionStorage.getItem("fixture:session-token") || ${JSON.stringify(sessionToken)} }` : "null"};
      constructor() { window.__switchMindAccount = id => { this.session = id ? { id: 'sess_' + id, status: 'active', user: { id }, getToken: async () => id } : null; this.listeners.forEach(l => l()); }; }
      async load() {}
      addListener(listener) { this.listeners.add(listener); listener(); return () => this.listeners.delete(listener); }
      async redirectToSignIn(options) { sessionStorage.setItem("fixture:redirect", JSON.stringify(options)); }
      async redirectToSignUp(options) { sessionStorage.setItem("fixture:signup", JSON.stringify(options)); }
      async signOut() { this.session = null; location.assign("/compose"); }
    }
  `;
  // The production dynamic import retains Clerk's named export. Intercept only
  // this test SDK boundary; every protected POST in these fixture tests is mocked.
  for (const pattern of ["**/@clerk_clerk-js.js*", "**/assets/clerk-*.js"]) {
    await page.route(pattern, route => route.fulfill({ contentType: "text/javascript", body: sdkFixture }));
  }
}
