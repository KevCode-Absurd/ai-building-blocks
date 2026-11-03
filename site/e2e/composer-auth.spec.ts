import { choosePlanner, submitPlan, composerOptions } from "./fixtures/workflow-ui";
import { test, expect } from "./fixtures/staging-aware-test";
import { mockComposerAccount } from "./fixtures/composer-account";

test("anonymous visitors get a free plan before sign-in, without sending AI requests", async ({ page }) => {
  await page.route("**/api/auth", route => route.fulfill({ json: { configured: false, publishableKey: null } }));
  let authRequests = 0, aiRequests = 0;
  page.on("request", req => { if (req.url().includes("/api/auth")) authRequests++; if (req.method() === "POST" && req.url().includes("/api/compose")) aiRequests++; });
  await page.goto("/compose");
  await page.getByTestId("compose-goal").fill("Build a landing page from scratch");
  // Goal to plan in one click: no Continue step and no sign-in.
  await expect(page.getByTestId("compose-submit")).toHaveText("Create my plan");
  await page.getByTestId("compose-submit").click();
  await expect(page.getByTestId("plan-ready")).toBeVisible();
  await expect(page.getByTestId("compose-saved")).toContainText("Saved in this browser");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("abb:v1") ?? "{}").flows?.length)).toBe(1);
  // Editing the request keeps the plan; it is only marked as made for the earlier request.
  await page.getByTestId("compose-goal").fill("Build a landing page from scratch for a bakery");
  await expect(page.getByTestId("compose-stale")).toBeVisible();
  await expect(page.getByTestId("plan-ready")).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("abb:composer") ?? "{}").goal)).toBe("Build a landing page from scratch");
  await page.getByTestId("compose-goal").fill("Build a landing page from scratch");
  await composerOptions(page);
  await page.getByTestId("compose-pick-start").click();
  await expect(page.getByTestId("compose-start")).toBeVisible();
  await page.getByTestId("compose-start").getByRole("button", {name: /^Start with:/}).first().click();
  await expect(page.getByTestId("builder")).toBeVisible();
  expect(authRequests).toBeLessThanOrEqual(1); expect(aiRequests).toBe(0);
});

test("AI asks for login and preserves the request across the sign-in redirect @mobile", async ({ page }) => {
  await mockComposerAccount(page, false);
  await page.route("**/api/compose", route => route.fulfill({ json: { enabled: true } }));
  await page.goto("/compose");
  await page.getByTestId("compose-goal").fill("Build a landing page from scratch");
  await choosePlanner(page, "ai");
  await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeVisible();
  await expect(page.getByTestId("compose-submit")).toHaveText("Sign in for an AI plan");
  await expect(page.getByText("No payment details needed.", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("fixture:redirect"))).toBeTruthy();
  await page.reload(); await composerOptions(page);
  await expect(page.getByTestId("compose-goal")).toHaveValue("Build a landing page from scratch");
  await expect(page.getByRole("tab", { name: "AI plan" })).toHaveAttribute("aria-selected", "true");
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
  await choosePlanner(page, "ai");
  await expect(page.getByTestId("compose-account")).toContainText("3 workflows created");
  await expect(page.getByTestId("compose-account")).toContainText("6 attempts left today");
  await submitPlan(page);
  await page.getByRole("button", { name: "Complete simulated verification" }).click();
  await expect(page.getByRole("alert")).toContainText("session expired");
  expect(sent?.authorization).toBe("Bearer token-after-human-check");
  expect(sent?.["x-turnstile-token"]).toBe("auth-ui-fixture-token");
  await expect(page.getByTestId("compose-submit")).toHaveText("Sign in for an AI plan");
  await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeVisible();
});

test("missing Clerk configuration leaves free assembly usable", async ({ page }) => {
  await page.route("**/api/auth*", route => route.fulfill({ json: { configured: false, publishableKey: null } }));
  await page.route("**/api/compose", route => route.fulfill({ json: { enabled: false } }));
  await page.goto("/compose");
  await page.getByTestId("compose-goal").fill("Build a landing page from scratch");
  await choosePlanner(page, "ai");
  // Guest pages defer account configuration until a sign-in is requested.
  await page.getByRole("button", {name: "Sign in", exact: true}).click();
  await expect(page.getByTestId("compose-submit")).toBeDisabled();
  await expect(page.getByTestId("compose-goal")).toHaveValue("Build a landing page from scratch");
  await choosePlanner(page, "ai");
  await expect(page.getByTestId("compose-account")).toContainText("Sign-in is unavailable");
  await expect(page.getByTestId("compose-submit")).toBeDisabled();
  await choosePlanner(page, "free");
  await page.getByTestId("compose-goal").fill("Build a landing page from scratch");
  await submitPlan(page);
  await expect(page.getByTestId("plan-ready")).toBeVisible();
  await page.getByTestId("compose-pick-start").click();
  await expect(page.getByTestId("compose-start")).toBeVisible();
  await page.getByTestId("compose-start").getByRole("button", {name: /^Start with:/}).first().click();
  await expect(page.getByTestId("builder")).toBeVisible();
});
