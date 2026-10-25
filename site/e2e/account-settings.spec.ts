import { test, expect } from "@playwright/test";
import { mockComposerAccount } from "./fixtures/composer-account";

const kitData = (name: string) => JSON.stringify({ kits: [{ id: name, name, slugs: ["fact-based-ad-copy-writer"], updated: 1 }], flows: [], recent: [], currentFlow: null, draft: null });

test("public pages have no saving banner or backup tools; signup returns to the account hub", async ({ page }) => {
  await mockComposerAccount(page, false);
  await page.goto("/compose");
  await expect(page.getByTestId("account-link")).toHaveText("Sign up");
  await expect(page.getByTestId("persistence-bar")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Download backup" })).toHaveCount(0);
  await expect(page.getByText("Clearing browser data", { exact: false })).toHaveCount(0);
  await page.getByTestId("account-link").click();
  await expect(page.getByRole("heading", { name: "Keep what works." })).toBeVisible();
  await page.getByRole("button", { name: "Create a free account", exact: true }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem("fixture:signup") || "null"))).toMatchObject({ signUpForceRedirectUrl: new URL("/account", page.url()).href });
  await page.getByRole("link", { name: "Already have an account? Sign in" }).click();
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem("fixture:redirect") || "null"))).toMatchObject({ signInForceRedirectUrl: new URL("/account", page.url()).href });
});

test("account settings import, backup and restore preserve existing saved work", async ({ page }) => {
  await mockComposerAccount(page, true, "owner", "owner");
  let data: Record<string, string> = { "abb:v1": kitData("Account original") }, revision = 1;
  await page.route("**/api/library", route => {
    if (route.request().method() === "PUT") { const input = route.request().postDataJSON(); expect(input.revision).toBe(revision); data = input.data; revision++; }
    return route.fulfill({ json: { data, revision } });
  });
  await page.addInitScript(raw => localStorage.setItem("abb:v1", raw), kitData("Browser original"));
  await page.goto("/account");
  await expect(page.getByRole("button", { name: /Account original/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Download backup" })).toHaveCount(0);
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await page.getByRole("button", { name: "Import browser saves" }).click();
  await expect.poll(() => JSON.parse(data["abb:v1"]).kits.map((k: any) => k.name)).toEqual(["Account original", "Browser original"]);
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download backup", exact: true }).click();
  const file = await downloaded;
  expect(file.suggestedFilename()).toBe("ai-blocks-backup.json");
  const body = await (await file.createReadStream())!.toArray();
  const backup = JSON.parse(Buffer.concat(body).toString());
  expect(backup.data["abb:v1"]).toBe(data["abb:v1"]);
  expect(JSON.parse(backup.browserData["abb:v1"]).kits[0].name).toBe("Browser original");
  await page.getByLabel("Restore backup", { exact: true }).setInputFiles({ name: "restore.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ format: "ai-blocks-library/1", data: { "abb:v1": kitData("Restored kit") } })) });
  await expect.poll(() => JSON.parse(data["abb:v1"]).kits.length).toBe(3);
  await page.getByRole("button", { name: "Manage profile & sign-in" }).click();
  expect(await page.evaluate(() => sessionStorage.getItem("fixture:profile"))).toBe("opened");
  await page.getByRole("link", { name: "My work", exact: true }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: /Restored kit/ })).toBeVisible();
  await expect(page.getByTestId("account-page")).toHaveAttribute("data-save-status", "saved");
});

test("guest kit prompt is contextual and settings explain browser retention on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockComposerAccount(page, false);
  await page.addInitScript(raw => localStorage.setItem("abb:v1", raw), kitData("Mobile kit"));
  await page.goto("/account");
  await page.getByRole("button", { name: /Mobile kit/ }).click();
  await expect(page.getByTestId("save-hint")).toContainText("Sign up to save your kits");
  await expect(page.getByTestId("save-hint").getByRole("link")).toHaveAttribute("href", "/sign-up");
  await page.getByTestId("save-hint").getByRole("link").click();
  await expect(page.getByRole("heading", { name: "Keep what works." })).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("link", { name: "View this browser’s saved work →" }).click();
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(page.getByText(/no scheduled expiry/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

for (const signIn of [false, true]) test(`${signIn ? "sign-in" : "signup"} automatically merges browser kits, custom skills and workflows without an import step`, async ({ page }) => {
  await mockComposerAccount(page, false);
  const flow = (name: string) => ({ id: "same-flow", name, nodes: [{ id: "node", slug: "fact-based-ad-copy-writer", x: 0, y: 0 }], edges: [], updated: 1, customSkills: [{ slug: "custom-private", name: "My custom skill", markdown: "Keep these exact instructions" }] });
  const guest = { "abb:v1": JSON.stringify({ ...JSON.parse(kitData("Browser kit")), flows: [flow("Browser workflow")], draft: flow("Browser draft") }), "abb:composer": JSON.stringify({ format: "ai-blocks-composition/1", plan: { title: "Browser plan" } }) };
  let data: Record<string, string> = { "abb:v1": JSON.stringify({ ...JSON.parse(kitData("Account kit")), flows: [flow("Account workflow")], draft: flow("Account draft") }), "abb:composer": JSON.stringify({ format: "ai-blocks-composition/1", plan: { title: "Account plan" } }) }, revision = 4, puts = 0;
  const accountBefore = JSON.parse(data["abb:v1"]);
  await page.route("**/api/library", route => {
    if (route.request().headers().authorization !== "Bearer alice") return route.fulfill({ json: { data: {}, revision: 0 } });
    if (route.request().method() === "PUT") { const input = route.request().postDataJSON(); expect(input.revision).toBe(revision); data = input.data; revision++; puts++; }
    return route.fulfill({ json: { data, revision } });
  });
  await page.addInitScript(raw => { if (!localStorage.getItem("fixture:signup-seed")) { for (const [key, value] of Object.entries(raw)) localStorage.setItem(key, value); localStorage.setItem("fixture:signup-seed", "yes"); } }, guest);
  await page.goto(signIn ? "/sign-in" : "/sign-up");
  await page.getByRole("button", { name: signIn ? "Sign in" : "Create a free account", exact: true }).click();
  const destination = await page.evaluate(signIn => { const options = JSON.parse(sessionStorage.getItem(signIn ? "fixture:redirect" : "fixture:signup")!); return signIn ? options.signInForceRedirectUrl : options.signUpForceRedirectUrl; }, signIn);
  expect(new URL(destination).searchParams.get("browser_save")).toBeTruthy();
  await page.evaluate(() => (window as any).__switchMindAccount("alice"));
  await page.goto(destination);
  await expect(page.getByTestId("account-page")).toHaveAttribute("data-save-status", "saved");
  await expect(page.getByRole("button", { name: /Browser kit/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Browser workflow", exact: true })).toBeVisible();
  const merged = JSON.parse(data["abb:v1"]);
  expect(merged.kits[0]).toEqual(accountBefore.kits[0]); expect(merged.flows[0]).toEqual(accountBefore.flows[0]); expect(merged.draft).toEqual(accountBefore.draft);
  expect(merged.flows.find((f: any) => f.name === "Browser workflow").customSkills).toEqual(flow("").customSkills);
  expect(merged.browserSaves[0].data).toEqual(guest);
  expect(JSON.parse(data["abb:composer"]).plan.title).toBe("Account plan");
  await expect(page.getByRole("button", { name: "Download editable browser plan →", exact: true })).toBeVisible();
  expect(puts).toBe(1);
  await page.reload(); await expect(page.getByTestId("account-page")).toHaveAttribute("data-save-status", "saved"); expect(puts).toBe(1);
  expect(await page.evaluate(() => localStorage.getItem("abb:v1"))).toBe(guest["abb:v1"]);
  if (signIn) {
    await page.evaluate(() => (window as any).__switchMindAccount(null));
    await page.goto("/sign-in"); await page.getByRole("button", { name: "Sign in", exact: true }).click();
    const again = await page.evaluate(() => JSON.parse(sessionStorage.getItem("fixture:redirect")!).signInForceRedirectUrl);
    expect(again).not.toBe(destination);
    await page.evaluate(() => (window as any).__switchMindAccount("alice")); await page.goto(again);
    await expect(page.getByTestId("account-page")).toHaveAttribute("data-save-status", "saved");
    expect(puts).toBe(1); expect(JSON.parse(data["abb:v1"]).browserSaves).toHaveLength(1);
  }

  await page.evaluate(() => (window as any).__switchMindAccount("bob"));
  await expect(page.getByTestId("account-page")).toHaveAttribute("data-account", "bob");
  await expect(page.getByRole("button", { name: /Browser kit/ })).toHaveCount(0);
});

for (const signIn of [false, true]) test(`${signIn ? "sign-in" : "signup"} retries an interrupted transfer automatically`, async ({ page }) => {
  await mockComposerAccount(page, false);
  let data: Record<string, string> = {}, revision = 0, puts = 0;
  await page.route("**/api/library", route => {
    if (route.request().method() === "PUT") { if (++puts === 1) return route.abort("failed"); const input = route.request().postDataJSON(); data = input.data; revision++; }
    return route.fulfill({ json: { data, revision } });
  });
  await page.addInitScript(raw => localStorage.setItem("abb:v1", raw), kitData("Recovered kit"));
  await page.goto(signIn ? "/sign-in" : "/sign-up"); await page.getByRole("button", { name: signIn ? "Sign in" : "Create a free account", exact: true }).click();
  const destination = await page.evaluate(signIn => { const options = JSON.parse(sessionStorage.getItem(signIn ? "fixture:redirect" : "fixture:signup")!); return signIn ? options.signInForceRedirectUrl : options.signUpForceRedirectUrl; }, signIn);
  await page.evaluate(() => (window as any).__switchMindAccount("alice")); await page.goto(destination);
  await expect(page.getByRole("button", { name: /Recovered kit/ })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId("account-page")).toHaveAttribute("data-save-status", "saved");
  expect(puts).toBe(2); expect(JSON.parse(data["abb:v1"]).browserSaves).toHaveLength(1);
});

test("creating an account from the sign-in flow also transfers browser saves", async ({ page }) => {
  await mockComposerAccount(page, false);
  let data: Record<string, string> = {}, revision = 0;
  await page.route("**/api/library", route => {
    if (route.request().method() === "PUT") { data = route.request().postDataJSON().data; revision++; }
    return route.fulfill({ json: { data, revision } });
  });
  await page.addInitScript(raw => localStorage.setItem("abb:v1", raw), kitData("Signup from sign-in"));
  await page.goto("/sign-in"); await page.getByRole("button", { name: "Sign in", exact: true }).click();
  const options = await page.evaluate(() => JSON.parse(sessionStorage.getItem("fixture:redirect")!));
  expect(new URL(options.signInForceRedirectUrl).searchParams.has("browser_save")).toBe(true);
  expect(new URL(options.signUpForceRedirectUrl).searchParams.has("browser_save")).toBe(true);
  await page.evaluate(() => (window as any).__switchMindAccount("alice"));
  await page.goto(options.signUpForceRedirectUrl);
  await expect(page.getByRole("button", { name: /Signup from sign-in/ })).toBeVisible();
  await expect(page.getByTestId("account-page")).toHaveAttribute("data-save-status", "saved");
});

test("sign-out waits for saving and another device restores kits, workflows and custom skills exactly", async ({ page, browser }) => {
  const flow = { id: "device-flow", name: "Exact device workflow", nodes: [{ id: "node", slug: "fact-based-ad-copy-writer" }], edges: [], updated: 1, customSkills: [{ slug: "device-private", name: "Exact custom skill", markdown: "All private instructions stay intact" }] };
  let data = { "abb:v1": JSON.stringify({ ...JSON.parse(kitData("Device kit")), flows: [flow], draft: { ...flow, id: "draft", name: "Exact draft" } }), "abb:business": JSON.stringify({ name: "Exact details" }), "abb:composer": JSON.stringify({ plan: { title: "Exact plan" } }), "aib-council-draft": JSON.stringify(["mind-one"]) }, revision = 3, puts = 0;
  let acknowledge!: () => void;
  const delayed = new Promise<void>(resolve => { acknowledge = resolve; });
  const attach = async (target: typeof page, slow = false) => {
    await mockComposerAccount(target, true, "alice", "alice");
    await target.route("**/api/library", async route => {
      if (route.request().method() === "PUT") { puts++; const input = route.request().postDataJSON(); expect(input.revision).toBe(revision); if (slow) await delayed; data = input.data; revision++; }
      return route.fulfill({ json: { data, revision } });
    });
  };
  await attach(page, true); await page.goto("/account");
  await page.getByRole("button", { name: "Manage my kits →", exact: true }).click();
  const name = page.getByRole("textbox", { name: "Kit name", exact: true }).last(); await name.fill("Last edit before sign-out");
  await page.getByRole("button", { name: "Close", exact: true }).first().click();
  await page.getByRole("link", { name: "Settings", exact: true }).click(); await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page.getByRole("button", { name: "Saving before sign-out…", exact: true })).toBeDisabled();
  expect(await page.evaluate(() => sessionStorage.getItem("fixture:signout"))).toBeNull();
  acknowledge(); await expect(page.getByTestId("account-page")).toHaveAttribute("data-account", "guest");
  expect(await page.evaluate(() => sessionStorage.getItem("fixture:signout"))).toBe("called");
  const saved = JSON.parse(data["abb:v1"]); expect(saved.kits[0].name).toBe("Last edit before sign-out"); expect(saved.flows).toEqual([flow]);
  const fresh = await browser.newContext(), other = await fresh.newPage();
  try {
    await attach(other); await other.goto(new URL("/account", page.url()).href);
    await expect(other.getByTestId("account-page")).toHaveAttribute("data-save-status", "saved");
    await expect(other.getByRole("button", { name: /Last edit before sign-out/ })).toBeVisible();
    await expect(other.getByRole("button", { name: flow.name, exact: true })).toBeVisible();
    await expect(other.getByRole("button", { name: /Exact custom skill/ })).toBeVisible();
    expect(await other.evaluate(() => localStorage.getItem("abb:v1"))).toBeNull();
    await other.reload(); await expect(other.getByTestId("account-page")).toHaveAttribute("data-save-status", "saved"); expect(puts).toBe(1);
    expect(JSON.parse(data["abb:v1"]).flows[0].customSkills).toEqual(flow.customSkills);
  } finally { await fresh.close(); }
});

test("failed saving keeps the user signed in until their latest work reaches the account", async ({ page }) => {
  await mockComposerAccount(page, true, "alice", "alice");
  let data = { "abb:v1": kitData("Original kit") }, revision = 1, offline = true;
  await page.route("**/api/library", async route => {
    if (route.request().method() === "PUT") { if (offline) return route.abort("failed"); const input = route.request().postDataJSON(); expect(input.revision).toBe(revision); data = input.data; revision++; }
    return route.fulfill({ json: { data, revision } });
  });
  await page.goto("/account"); await page.getByRole("button", { name: "Manage my kits →", exact: true }).click();
  await page.getByRole("textbox", { name: "Kit name", exact: true }).last().fill("Offline last edit");
  await page.getByRole("button", { name: "Close", exact: true }).first().click();
  await page.getByRole("link", { name: "Settings", exact: true }).click(); await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page.getByRole("button", { name: "Sign out", exact: true })).toBeEnabled();
  expect(await page.evaluate(() => sessionStorage.getItem("fixture:signout"))).toBeNull();
  await expect(page.getByTestId("account-page")).toHaveAttribute("data-account", "alice"); expect(JSON.parse(data["abb:v1"]).kits[0].name).toBe("Original kit");
  offline = false; await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page.getByTestId("account-page")).toHaveAttribute("data-account", "guest"); expect(JSON.parse(data["abb:v1"]).kits[0].name).toBe("Offline last edit");
});
