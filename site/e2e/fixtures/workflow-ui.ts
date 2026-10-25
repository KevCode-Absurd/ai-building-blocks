import { expect, type Page } from "@playwright/test";

export async function composerOptions(page: Page) {
 const summary = page.getByText("Customize: planner, minds and imports", { exact: true });
 await expect(summary).toBeVisible();
 if (!await summary.evaluate(el => (el.parentElement as HTMLDetailsElement).open)) await summary.click();
}
export async function choosePlanner(page: Page, mode: "free" | "ai") {
 await composerOptions(page);
 await page.getByRole("tab", { name: mode === "free" ? "Find steps from the library" : "AI planning", exact: true }).click();
 if ((await page.getByTestId("compose-goal").inputValue()).trim() && await page.getByTestId("compose-submit").textContent() === "Continue") await page.getByTestId("compose-submit").click();
}
export async function submitPlan(page: Page) {
 const button = page.getByTestId("compose-submit");
 if (await button.textContent() === "Continue") { await button.click(); if (await button.textContent() === "Continue") return; }
 await button.click();
}
export async function exportEditable(page: Page) {
 const summary = page.getByText("Other formats", { exact: true });
 if (!await summary.evaluate(el => (el.parentElement as HTMLDetailsElement).open)) await summary.click();
 await page.getByTestId("compose-export").click();
}
export async function editStepOptions(page: Page) {
 const summary = page.getByText("Edit instructions and expert perspectives", { exact: true });
 if (!await summary.evaluate(el => (el.parentElement as HTMLDetailsElement).open)) await summary.click();
}
export async function planOptions(page: Page) {
 const button=page.getByTestId("compose-submit");
 if (await button.textContent() === "Continue") await button.click();
 const summary=page.getByText("Customize the plan (optional)", {exact:true});
 if (!await summary.evaluate(el => (el.parentElement as HTMLDetailsElement).open)) await summary.click();
 await expect(summary).toBeVisible();
}
