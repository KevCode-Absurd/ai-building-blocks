import { test, expect } from "./fixtures/staging-aware-test";
import { mockComposerAccount } from "./fixtures/composer-account";

test("anonymous visitors can switch to free assembly without sending AI requests", async ({ page }) => {
  await page.route("**/api/auth", route => route.fulfill({ json: { configured: false, publishableKey: null } }));
  let authRequests = 0, aiRequests = 0;
  page.on("request", req => { if (req.url().includes("/api/auth")) authRequests++; if (req.method() === "POST" && req.url().includes("/api/compose")) aiRequests++; });
  await page.goto("/compose");
  await page.getByRole("tab", { name: "Free assembly" }).click();
  await page.getByTestId("compose-goal").fill("Build a landing page from scratch");
  await page.getByTestId("compose-submit").click();
  await expect(page.getByTestId("compose-steps")).toBeVisible();
  expect(authRequests).toBeLessThanOrEqual(1); expect(aiRequests).toBe(0);
});

test("AI asks for login and preserves the request across the sign-in redirect @mobile", async ({ page }) => {
  await mockComposerAccount(page, false);
  await page.route("**/api/compose", route => route.fulfill({ json: { enabled: true } }));
  await page.goto("/compose");
  await page.getByTestId("compose-goal").fill("Build a landing page from scratch");
  await page.getByRole("tab", { name: "AI composition" }).click();
  await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeVisible();
  await expect(page.getByTestId("compose-submit")).toBeDisabled();
  await expect(page.getByText("No payment details needed.", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("fixture:redirect"))).toBeTruthy();
  await page.reload();
  await expect(page.getByTestId("compose-goal")).toHaveValue("Build a landing page from scratch");
  await expect(page.getByRole("tab", { name: "AI composition" })).toHaveAttribute("aria-selected", "true");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("AI refreshes the token after human verification, shows usage and handles an expired session", async ({ page }) => {
  await mockComposerAccount(page);
  // This UI flow intercepts every protected POST and uses a synthetic challenge;
  // it does not create a Clerk session or validate a real Turnstile token.
  await page.route("**/api/security", route => route.fulfill({ json: { required: true, sitekey: "auth-ui-fixture" } }));
  await page.addInitScript(() => {
    sessionStorage.setItem("fixture:session-token", "token-before-human-check");
    (window as any).turnstile = {
      render(element: HTMLElement, options: any) {
        const button = document.createElement("button");
        button.type = "button"; button.textContent = "Complete simulated verification";
        button.onclick = () => {
          // Simulate a short-lived session JWT expiring while a human verifies.
          sessionStorage.setItem("fixture:session-token", "token-after-human-check");
          options.callback("auth-ui-fixture-token");
        };
        element.append(button); return "auth-ui-fixture";
      },
      remove() {},
    };
  });
  let sent: Record<string, string> | undefined;
  await page.route("**/api/compose", async route => {
    if (route.request().method() !== "POST") return route.fulfill({ json: { enabled: true } });
    sent = route.request().headers();
    expect(route.request().postDataJSON().userId).toBeUndefined();
    return route.fulfill({ status: 401, json: { error: "Your session expired. Sign in again." } });
  });
  await page.goto("/compose");
  await page.getByTestId("compose-goal").fill("Build a landing page from scratch");
  await page.getByRole("tab", { name: "AI composition" }).click();
  await expect(page.getByTestId("compose-account")).toContainText("3 workflows created");
  await expect(page.getByTestId("compose-account")).toContainText("6 attempts left today");
  await page.getByTestId("compose-submit").click();
  await page.getByRole("button", { name: "Complete simulated verification" }).click();
  await expect(page.getByRole("alert")).toContainText("session expired");
  expect(sent?.authorization).toBe("Bearer token-after-human-check");
  expect(sent?.["x-turnstile-token"]).toBe("auth-ui-fixture-token");
  await expect(page.getByTestId("compose-submit")).toBeDisabled();
  await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeVisible();
});

test("missing Clerk configuration leaves free assembly usable", async ({ page }) => {
  await page.route("**/api/auth*", route => route.fulfill({ json: { configured: false, publishableKey: null } }));
  await page.route("**/api/compose", route => route.fulfill({ json: { enabled: false } }));
  await page.goto("/compose");
  await page.getByRole("tab", { name: "AI composition" }).click();
  await expect(page.getByTestId("compose-account")).toContainText("Sign-in is being connected");
  await expect(page.getByTestId("compose-submit")).toBeDisabled();
  await page.getByRole("tab", { name: "Free assembly" }).click();
  await page.getByTestId("compose-goal").fill("Build a landing page from scratch");
  await page.getByTestId("compose-submit").click();
  await expect(page.getByTestId("compose-steps")).toBeVisible();
});
