import { test, expect } from "@playwright/test";

// After a deploy, a page opened earlier asks for code files that are gone. The app reloads once to get the new page,
// reports the failure, and shows its recovery screen instead of reloading again if the file is still missing.
test("a page whose code file is gone reloads once, then opens", async ({ page }) => {
  const reports: string[] = [];
  let blocked = 0, navigations = 0;
  page.on("framenavigated", frame => { if (frame === page.mainFrame()) navigations++; });
  await page.route("**/api/client-error", route => { reports.push(route.request().postData() ?? ""); return route.fulfill({ status: 204 }); });
  // Every request for the page's code fails until the page reloads, as it does after a real deploy.
  await page.route(/\/assets\/ToolsPage-[\w-]+\.js$/, route => navigations <= 1 ? (blocked++, route.fulfill({ status: 404, contentType: "text/plain", body: "Not found" })) : route.continue());
  let loads = 0;
  page.on("load", () => { loads++; });
  await page.goto("/tools");
  // The prerendered page shows first; the reload follows when the app's code for it fails to load.
  await expect.poll(() => loads).toBe(2);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.waitForTimeout(1500);
  await expect(page.getByTestId("page-recovery")).toHaveCount(0);
  expect(loads).toBe(2);
  expect(blocked).toBeGreaterThanOrEqual(1);
  await expect.poll(() => reports.length).toBeGreaterThanOrEqual(1);
  expect(JSON.parse(reports[0])).toMatchObject({ kind: "chunk", route: "/tools" });
});

test("a code file that stays missing shows the recovery screen after one reload", async ({ page }) => {
  await page.route("**/api/client-error", route => route.fulfill({ status: 204 }));
  await page.route(/\/assets\/ToolsPage-[\w-]+\.js$/, route => route.fulfill({ status: 404, contentType: "text/plain", body: "Not found" }));
  let loads = 0;
  page.on("load", () => { loads++; });
  await page.goto("/tools");
  await expect(page.getByTestId("page-recovery")).toBeVisible();
  await page.waitForTimeout(1500);
  expect(loads).toBe(2);
});
