import { test, expect } from "./fixtures/composer-staging-test";
import { mockVoiceCapture } from "./fixtures/voice-capture";

test("microphone icon fits a phone and retains a visible timer @mobile", async ({ page }, info) => {
  await mockVoiceCapture(page); await page.goto("/compose");
  const voice = page.getByTestId("compose-voice");
  await expect(voice).toHaveAccessibleName("Record voice request");
  const box = await voice.boundingBox(); expect(box?.width).toBe(44); expect(box?.height).toBe(44);
  await expect(page.getByRole("timer")).toHaveText("5:00 remaining");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator(".compose-request-box").screenshot({ path: info.outputPath("microphone-icon.png") });
});
test("typed requests accept10,000 characters and recorded voice has a cumulative five-minute cap", async ({ page }) => {
  await mockVoiceCapture(page); await page.clock.install(); await page.goto("/compose");
  await page.getByRole("tab", { name: "Free assembly", exact: true }).click();
  const goal = page.getByTestId("compose-goal"), voice = page.getByTestId("compose-voice");
  await expect(goal).toHaveAttribute("maxlength", "10000");
  await expect(voice).toHaveAccessibleName("Record voice request");
  await expect(voice).toHaveText("");
  await expect(voice.locator("svg")).toHaveCount(1);
  await expect(voice).toHaveAttribute("title", "Record with OpenAI Whisper");
  await goal.fill("Build"); await voice.click(); await expect(voice).toHaveAccessibleName("Stop recording");
  await expect(goal).toBeDisabled(); await expect(page.getByTestId("compose-submit")).toBeDisabled();
  await page.clock.runFor(60000); await voice.click();
  await expect(goal).toHaveValue("Build a landing page from scratch");
  await expect(page.getByRole("timer")).toHaveText("4:00 remaining");
  await voice.click(); await expect(voice).toHaveAccessibleName("Stop recording"); await page.clock.runFor(240000);
  await expect(voice).toBeDisabled(); await expect(page.getByRole("timer")).toHaveText("0:00 remaining");
  await expect(page.getByText("Five-minute voice limit reached.", { exact: false })).toBeVisible();
  await expect(page.getByTestId("compose-submit")).toBeEnabled();
  expect(await page.evaluate(() => (window as any).__micStops)).toBe(2);
});

test("recorded transcript obeys the character cap and denied permission keeps typing available", async ({ page }) => {
  await mockVoiceCapture(page); await page.clock.install(); await page.goto("/compose");
  await page.getByRole("tab", { name: "Free assembly", exact: true }).click();
  const goal = page.getByTestId("compose-goal"), voice = page.getByTestId("compose-voice");
  await goal.fill("Create a report ".padEnd(9998, "x")); await voice.click(); await expect(voice).toHaveAccessibleName("Stop recording");
  await page.clock.runFor(1500); await voice.click(); await expect(goal).toBeEnabled();
  expect((await goal.inputValue()).length).toBe(10000); await expect(voice).toBeDisabled();
  await goal.fill("Build a landing page"); await page.evaluate(() => (window as any).__denyMic = true); await voice.click();
  await expect(page.getByText("Microphone permission was denied.", { exact: false })).toBeVisible();
  await expect(goal).toBeEnabled(); await expect(page.getByTestId("compose-submit")).toBeEnabled();
});
