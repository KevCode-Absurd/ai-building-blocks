import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import { mockComposerAccount } from "./fixtures/composer-account";

const flow = () => ({ id: "flow-one", name: "Live workflow", nodes: [{ id: "node-one", slug: "fact-based-ad-copy-writer", x: 40, y: 110, notes: "Original notes" }], edges: [], updated: 1, customSkills: [{ slug: "custom-one", name: "Private skill", markdown: "Original complete instructions", summary: "Private skill", role: "make", inputs: [], outputs: [] }] });
const state = () => ({ kits: [{ id: "kit-one", name: "First kit", slugs: ["fact-based-ad-copy-writer"], updated: 1 }, { id: "kit-two", name: "Second kit", slugs: [], updated: 1 }], flows: [flow()], recent: [], currentFlow: null, draft: null as any });
function backend(seed = state()) {
  let data: Record<string, string> = { "abb:v1": JSON.stringify(seed) }, revision = 1, puts = 0, gets = 0, offline = false;
  return {
    get data() { return data; }, get puts() { return puts; }, get gets() { return gets; },
    replace(next: Record<string, string>) { data = next; revision++; },
    disconnect(value: boolean) { offline = value; },
    async attach(page: Page) {
      // Separate contexts represent foreground screens on separate devices.
      await page.addInitScript(() => Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" }));
      await mockComposerAccount(page, true, "alice", "alice");
      await page.route("**/api/library", async route => {
        if (offline) return route.abort("failed");
        if (route.request().method() === "PUT") {
          puts++; const input = route.request().postDataJSON();
          if (input.revision !== revision) return route.fulfill({ status: 409, json: { error: "Another device saved" } });
          data = input.data; revision++;
        } else gets++;
        return route.fulfill({ json: { data, revision } });
      });
    },
  };
}

test("two signed-in devices receive changes by polling and focus without reload or duplicate writes", async ({ page, browser }) => {
  const api = backend(); await api.attach(page); await page.goto("/account");
  const fresh = await browser.newContext(), other = await fresh.newPage();
  try {
    await other.clock.install(); await api.attach(other); await other.goto(new URL("/account", page.url()).href);
    await expect(other.getByTestId("account-page")).toHaveAttribute("data-save-status", "saved");
    await expect(other.getByRole("button", { name: /First kit/ })).toBeVisible();
    await page.getByRole("button", { name: "Manage my kits →", exact: true }).click();
    await page.locator('input[aria-label="Kit name"]').first().fill("Renamed on device one");
    await expect.poll(() => JSON.parse(api.data["abb:v1"]).kits[0].name).toBe("Renamed on device one");
    await other.clock.runFor(15000);
    await expect(other.getByRole("button", { name: /Renamed on device one/ })).toBeVisible();
    const next = JSON.parse(api.data["abb:v1"]); next.kits = next.kits.filter((k: any) => k.id !== "kit-two"); next.flows[0].name = "Workflow from device one"; next.flows[0].customSkills[0].markdown = "Updated exact private instructions";
    api.replace({ ...api.data, "abb:v1": JSON.stringify(next) });
    await other.evaluate(() => window.dispatchEvent(new Event("focus")));
    await expect(other.getByRole("button", { name: "Workflow from device one", exact: true })).toBeVisible();
    await expect(other.getByRole("button", { name: /Second kit/ })).toHaveCount(0);
    const puts = api.puts; await other.clock.runFor(30000); await expect(other.getByTestId("account-page")).toHaveAttribute("data-save-status", "saved");
    expect(api.puts).toBe(puts); expect(JSON.parse(api.data["abb:v1"]).kits).toHaveLength(1);
    expect(JSON.parse(api.data["abb:v1"]).flows[0].customSkills[0].markdown).toBe("Updated exact private instructions");
  } finally { await fresh.close(); }
});

test("stale independent edits merge automatically while both devices remain signed in", async ({ page }) => {
  await page.clock.install(); const api = backend(); await api.attach(page); await page.goto("/account");
  await expect(page.getByTestId("account-page")).toHaveAttribute("data-save-status", "saved");
  await page.getByRole("button", { name: "Manage my kits →", exact: true }).click();
  await page.locator('input[aria-label="Kit name"]').last().fill("My independent edit");
  const remote = JSON.parse(api.data["abb:v1"]); remote.kits[0].name = "Other device edit"; api.replace({ ...api.data, "abb:v1": JSON.stringify(remote) });
  await page.clock.runFor(1000);
  await expect.poll(() => JSON.parse(api.data["abb:v1"]).kits.map((kit: any) => kit.name)).toEqual(["Other device edit", "My independent edit"]);
  await expect(page.locator('input[aria-label="Kit name"]').first()).toHaveValue("Other device edit");
  await expect(page.getByTestId("save-hint")).toContainText("Saved to your account");
  const puts = api.puts; await page.clock.runFor(30000); expect(api.puts).toBe(puts);
});

test("overlapping edits preserve the device copy and server copy instead of overwriting either", async ({ page }) => {
  await page.clock.install(); const api = backend(); await api.attach(page); await page.goto("/account");
  await expect(page.getByTestId("account-page")).toHaveAttribute("data-save-status", "saved");
  await page.getByRole("button", { name: "Manage my kits →", exact: true }).click();
  await page.locator('input[aria-label="Kit name"]').first().fill("Pending local version");
  const remote = JSON.parse(api.data["abb:v1"]); remote.kits[0].name = "Saved remote version"; api.replace({ ...api.data, "abb:v1": JSON.stringify(remote) });
  await page.clock.runFor(1000); await expect(page.getByTestId("save-hint")).toContainText("Saving needs attention");
  expect(JSON.parse(api.data["abb:v1"]).kits[0].name).toBe("Saved remote version");
  await expect(page.locator('input[aria-label="Kit name"]').first()).toHaveValue("Pending local version");
  const puts = api.puts; await page.clock.runFor(30000); expect(api.puts).toBe(puts);
  const cache = await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith("abb:account-library/1:alice:")).map(key => JSON.parse(localStorage.getItem(key)!)));
  expect(cache.some(value => value.dirty && JSON.parse(value.data["abb:v1"]).kits[0].name === "Pending local version")).toBe(true);
});

test("an open workflow editor hydrates remote changes and keeps the selected step without echo saves", async ({ page }) => {
  const seed = state(); seed.draft = seed.flows[0]; seed.currentFlow = "flow-one" as any;
  await page.clock.install(); const api = backend(seed); await api.attach(page); await page.goto("/#build"); await page.clock.runFor(1000);
  await expect(page.getByRole("textbox", { name: "Workflow name", exact: true })).toHaveValue("Live workflow", { timeout: 15000 });
  await page.getByTestId("step-open").first().click();
  await page.getByText("Edit instructions and expert perspectives", { exact: true }).click();
  await expect(page.getByTestId("step-notes").getByRole("textbox", { name: "Extra instructions" })).toHaveValue("Original notes");
  await page.clock.runFor(1500);
  const next = JSON.parse(api.data["abb:v1"]); next.draft.name = "Updated while open"; next.draft.nodes[0].notes = "Remote exact step instructions"; next.draft.customSkills[0].markdown = "Remote exact custom skill";
  api.replace({ ...api.data, "abb:v1": JSON.stringify(next) }); const puts = api.puts;
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(page.getByRole("textbox", { name: "Workflow name", exact: true })).toHaveValue("Updated while open");
  await expect(page.getByTestId("step-notes").getByRole("textbox", { name: "Extra instructions" })).toHaveValue("Remote exact step instructions");
  await page.clock.runFor(30000); expect(api.puts).toBe(puts);
});

test("an idle composition receives a remote plan without saving it back in a loop", async ({ page }) => {
  const fixture = JSON.parse(fs.readFileSync(new URL("../test/fixtures/composer-plans.json", import.meta.url), "utf8")).cases[0];
  const api = backend(); const envelope = { format: "ai-blocks-composition/1", goal: fixture.goal, context: "", choices: {}, customSkills: [], plan: fixture.plan, model: "fixture", cost: 0 };
  api.replace({ ...api.data, "abb:composer": JSON.stringify(envelope) });
  await page.clock.install(); await api.attach(page); await page.route("**/api/compose", route => route.fulfill({ json: { enabled: false } })); await page.goto("/compose");
  await expect(page.getByTestId("compose-goal")).toHaveValue(fixture.goal);
  await page.clock.runFor(1500);
  const next = { ...envelope, goal: "Updated plan on another signed-in device" }; api.replace({ ...api.data, "abb:composer": JSON.stringify(next) });
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(page.getByTestId("compose-goal")).toHaveValue(next.goal);
  const puts = api.puts; await page.clock.runFor(30000); expect(api.puts).toBe(puts);
});

test("sync resumes on reconnect and returning to a visible tab without background polling", async ({ page }) => {
  await page.clock.install(); const api = backend(); await api.attach(page); await page.goto("/account");
  await expect(page.getByTestId("account-page")).toHaveAttribute("data-save-status", "saved");
  api.disconnect(true); await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(page.getByTestId("account-page")).toHaveAttribute("data-save-status", "error");
  await expect(page.getByRole("button", { name: /First kit/ })).toBeVisible();
  const changed = JSON.parse(api.data["abb:v1"]); changed.kits[0].name = "Changed while disconnected"; api.replace({ ...api.data, "abb:v1": JSON.stringify(changed) });
  api.disconnect(false); await page.evaluate(() => window.dispatchEvent(new Event("online")));
  await expect(page.getByRole("button", { name: /Changed while disconnected/ })).toBeVisible();
  await page.evaluate(() => Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" }));
  const gets = api.gets; await page.clock.runFor(30000); expect(api.gets).toBe(gets);
  changed.kits[0].name = "Changed while tab was hidden"; api.replace({ ...api.data, "abb:v1": JSON.stringify(changed) });
  await page.evaluate(() => { Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" }); document.dispatchEvent(new Event("visibilitychange")); });
  await expect(page.getByRole("button", { name: /Changed while tab was hidden/ })).toBeVisible(); expect(api.puts).toBe(0);
});


test("@council-sync an open council receives updates without echo writes or dropping unknown saved minds", async ({ page }) => {
  const api = backend(); const initialCouncil = ["richard-feynman", "mind-from-a-newer-catalogue"];
  api.replace({ ...api.data, "aib-council-draft": JSON.stringify(initialCouncil) });
  await page.clock.install(); await api.attach(page); await page.goto("/minds");
  await expect(page.getByTestId("council-bar")).toContainText("Richard Feynman");
  const initialPuts = api.puts; await page.clock.runFor(20000);
  expect(api.puts).toBe(initialPuts); expect(JSON.parse(api.data["aib-council-draft"])).toEqual(initialCouncil);
  api.replace({ ...api.data, "aib-council-draft": JSON.stringify(["ada-lovelace"]) });
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(page.getByTestId("council-bar")).toContainText("Ada Lovelace");
  await expect(page.getByTestId("council-bar")).not.toContainText("Richard Feynman");
  await page.clock.runFor(30000); expect(api.puts).toBe(initialPuts);
  await page.getByTestId("council-bar").getByRole("button", { name: "Clear", exact: true }).click();
  await page.clock.runFor(1000);
  await expect.poll(() => JSON.parse(api.data["aib-council-draft"])).toEqual([]);
  const savedPuts = api.puts; expect(savedPuts).toBe(initialPuts + 1);
  await page.clock.runFor(30000); expect(api.puts).toBe(savedPuts);
});
