import { test, expect } from "./fixtures/composer-staging-test";

test("changing the request selects different specialist steps", async ({ page }) => {
  let modelCalls = 0;
  page.on("request", request => { if (request.method() === "POST" && request.url().includes("/api/compose")) modelCalls++; });
  await page.goto("/compose"); await page.getByRole("tab", { name: "Free assembly" }).click();
  const goal = page.getByTestId("compose-goal");
  const steps = page.getByTestId("compose-steps");
  await goal.fill("i want to audit my ad of my ecommerce store");
  await page.getByTestId("compose-submit").click();
  await expect(steps).toContainText("Pre-launch ad checker");
  await expect(steps).toContainText("Marketing claim evidence checker");
  await expect(page.getByTestId("compose-unmatched")).toHaveCount(0);
  await goal.fill("Can you please help me write a product FAQ for my ecommerce store");
  await expect(steps).toHaveCount(0);
  await page.getByTestId("compose-submit").click();
  await expect(steps).toContainText("Product launch FAQ writer");
  await expect(steps).not.toContainText("Pre-launch ad checker");
  await goal.fill("Write four welcome emails");
  await page.getByTestId("compose-submit").click();
  await expect(steps).toContainText("Email sequence writer");
  await expect(steps).not.toContainText("Product launch FAQ writer");
  expect(modelCalls).toBe(0);
});

test("unmatched requests disclose the repeated template and preserve the request when switching to AI", async ({ page }) => {
  await page.route("**/api/compose", route => route.fulfill({ json: { enabled: true } }));
  await page.goto("/compose"); await page.getByRole("tab", { name: "Free assembly" }).click();
  const request = "Write a travel itinerary for a three-day family trip";
  await page.getByTestId("compose-goal").fill(request);
  await page.getByTestId("compose-submit").click();
  await expect(page.getByTestId("compose-unmatched")).toBeVisible();
  await expect(page.getByTestId("compose-unmatched")).toContainText("Different unmatched requests produce the same steps");
  await expect(page.getByTestId("compose-download")).toHaveCount(0); await expect(page.getByTestId("compose-steps")).toHaveCount(0);
  await page.getByRole("button", { name: "Use AI composition for this request" }).click();
  await expect(page.getByRole("tab", { name: "AI composition", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByTestId("compose-goal")).toHaveValue(request);
});

test("an unavailable AI service reports no specialist match without a misleading download", async ({ page }) => {
  await page.route("**/api/compose", route => route.fulfill({ json: { enabled: false } }));
  await page.goto("/compose"); await page.getByRole("tab", { name: "Free assembly" }).click();
  await page.getByTestId("compose-goal").fill("Create a wedding budget with editable cost categories");
  await page.getByTestId("compose-submit").click();
  await expect(page.getByTestId("compose-unmatched")).toContainText("AI composition is currently unavailable");
  await expect(page.getByTestId("compose-download")).toHaveCount(0); await expect(page.getByTestId("compose-steps")).toHaveCount(0);
});
