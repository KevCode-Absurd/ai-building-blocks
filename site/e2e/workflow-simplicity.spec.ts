import { test, expect } from "./fixtures/staging-aware-test";
import fs from "node:fs";
import { unzipSync, strFromU8, inflateSync, deflateSync, strToU8 } from "fflate";
const fixture = JSON.parse(fs.readFileSync(new URL("../test/fixtures/composer-plans.json", import.meta.url), "utf8")).cases[0];

async function importPlan(page: import("@playwright/test").Page) {
  await page.route("**/api/compose", route => route.fulfill({ json: { enabled: false } }));
  await page.goto("/compose");
  await page.getByText("More options: plan type, minds and imports", { exact: true }).click();
  await page.getByLabel("Import workflow JSON").setInputFiles({ name: "workflow.edit.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ format: "ai-blocks-composition/1", goal: fixture.goal, context: "", choices: {}, plan: fixture.plan, model: fixture.model, cost: fixture.cost })) });
  await expect(page.getByTestId("plan-ready")).toContainText("No steps have run");
  // These tests exercise list editing explicitly; new builders default to Diagram view.
  await page.getByTestId("workflow-list-view").click();
}

test("goal comes before settings, the free plan says it is made in the browser, and an unavailable AI plan is never sent", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  let posts = 0;
  await page.route("**/api/compose", route => { if (route.request().method() === "POST") posts++; return route.fulfill({ json: { enabled: false } }); });
  await page.goto("/compose");
  await expect(page.getByTestId("compose-account")).toHaveCount(0);
  await expect(page.getByRole("tab", { name: "Quick plan" })).not.toBeVisible();
  await page.getByTestId("compose-goal").fill("Build a landing page from scratch and deliver source code");
  await expect(page.getByTestId("compose-plan-note")).toContainText("Made in your browser");
  await page.getByText("More options: plan type, minds and imports", { exact: true }).click();
  await page.getByRole("tab", { name: "AI plan" }).click();
  await expect(page.getByTestId("compose-submit")).toBeDisabled();
  await expect(page.getByTestId("compose-plan-note")).toContainText("AI plans are not available right now");
  await page.getByRole("tab", { name: "Quick plan" }).click();
  await page.getByTestId("compose-submit").click();
  await expect(page.getByTestId("plan-ready")).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId("compose-steps")).toBeVisible();
  expect(errors).toEqual([]);
  expect(posts).toBe(0);
});

for (const tag of ["desktop", "@mobile"]) test(`list and diagram preserve edits and complete packs ${tag}`, async ({ page }, info) => {
  await importPlan(page);
  const steps = page.getByTestId("compose-steps");
  await expect(steps.getByTestId("step-open")).toHaveCount(fixture.plan.steps.length);
  const selectedView = steps.getByTestId("workflow-list-view");
  const otherView = steps.getByTestId("workflow-diagram-view");
  await expect(selectedView).toHaveAttribute("aria-pressed", "true");
  await expect(otherView).toHaveAttribute("aria-pressed", "false");
  expect(await selectedView.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(await otherView.evaluate(el => getComputedStyle(el).backgroundColor));
  const startCard = steps.getByTestId("list-start");
  expect(await startCard.evaluate(el => parseFloat(getComputedStyle(el).borderRadius))).toBeLessThanOrEqual(16);
  expect(await startCard.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  await steps.getByTestId("step-open").first().click();
  await page.getByText("Edit instructions and expert perspectives", { exact: true }).click();
  await page.getByTestId("step-instructions").fill("Keep the supplied facts and review every required check.");
  await page.getByTestId("step-panel").getByRole("button", { name: "Close", exact: true }).click();
  await expect.poll(async () => page.evaluate(() => {
    const stored = Object.keys(localStorage).map(key => localStorage.getItem(key) || "");
    return stored.some(raw => raw.includes("Keep the supplied facts"));
  })).toBe(true);
  await steps.getByTestId("workflow-diagram-view").click();
  await expect(otherView).toHaveAttribute("aria-pressed", "true");
  await expect(selectedView).toHaveAttribute("aria-pressed", "false");
  expect(await selectedView.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(await otherView.evaluate(el => getComputedStyle(el).backgroundColor));
  await expect(steps.getByTestId("flow-node")).toHaveCount(fixture.plan.steps.length);
  await steps.getByTestId("workflow-list-view").click();
  await expect(steps.getByTestId("step-open")).toHaveCount(fixture.plan.steps.length);
  await page.getByText("Other formats", { exact: true }).click();
  const editingDownload = page.waitForEvent("download"); await page.getByTestId("compose-export").click();
  const editing = await editingDownload; const editingPath = info.outputPath("editing.json"); await editing.saveAs(editingPath);
  const envelope = JSON.parse(fs.readFileSync(editingPath, "utf8"));
  expect(envelope.flowCode).toBeTruthy();
  const code = envelope.flowCode.replace(/-/g, "+").replace(/_/g, "/");
  const packed = JSON.parse(strFromU8(inflateSync(Buffer.from(code, "base64"))));
  expect(packed.s).toEqual(fixture.plan.steps.map((step: { slug: string }) => step.slug));
  expect(packed.o[0]).toContain("supplied facts");
  expect(packed.b.flat().length).toBe(fixture.plan.bindings.length);
  expect(envelope.plan.bindings).toEqual(fixture.plan.bindings); expect(envelope.plan.steps).toEqual(fixture.plan.steps);
  const packDownload = page.waitForEvent("download"); await page.getByTestId("compose-download").click();
  const pack = await packDownload; const packPath = info.outputPath("workflow.zip"); await pack.saveAs(packPath);
  const files = unzipSync(fs.readFileSync(packPath));
  await expect(page.getByTestId("transfer-guide")).toBeVisible();
  for (const name of ["HANDOFF.md", "workflow.json", "workflow.edit.json", "README.md", "inputs.json"]) expect(files[name], name).toBeTruthy();
  const machine = JSON.parse(strFromU8(files["workflow.json"]));
  expect(machine.steps[0].your_notes).toContain("supplied facts"); expect(machine.steps).toHaveLength(fixture.plan.steps.length);
  for (const step of fixture.plan.steps) expect(files[`skills/${step.slug}/SKILL.md`]).toBeTruthy();
  await page.reload(); await expect(page.getByTestId("step-list")).toBeVisible();
  await expect(page.getByTestId("workflow-list-view")).toHaveAttribute("aria-pressed", "true");
  await page.getByTestId("workflow-diagram-view").click(); await page.reload();
  await expect(page.getByTestId("workflow-diagram-view")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("flow-node")).toHaveCount(fixture.plan.steps.length);
});


test("advanced graph fields and custom files survive view switching and export", async ({ page }, info) => {
  await importPlan(page);
  await page.getByText("Other formats", { exact: true }).click();
  const download = page.waitForEvent("download"); await page.getByTestId("compose-export").click();
  const original = await download; const sourcePath = info.outputPath("source.json"); await original.saveAs(sourcePath);
  const envelope = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  const graph = JSON.parse(strFromU8(inflateSync(Buffer.from(envelope.flowCode.replace(/-/g, "+").replace(/_/g, "/"), "base64"))));
  graph.cm = [{ slug: "my-mind-workflow-check", name: "My reviewer", specialty: "Review the task", voice: "Clear and direct", principles: "Preserve facts", avoid: "Invented claims", examples: "" }];
  graph.ks = graph.s.map(() => []); graph.ks[0] = [graph.cm[0].slug];
  graph.k = graph.s.map(() => ""); graph.k[0] = graph.cm[0].slug;
  graph.ov = graph.cm[0].slug; graph.t = [graph.cm[0].slug]; graph.tm = "together";
  graph.r = graph.s.map(() => ""); graph.r[0] = "Fact reviewer";
  graph.o = graph.s.map(() => ""); graph.o[0] = "Keep this note and every binding.";
  graph.gn = "Keep the full execution contract.";
  graph.cs = [{ slug: "custom-workflow-check", name: "My final check", summary: "Review the supplied work", markdown: "# My final check\nCheck supplied facts. Report missing evidence. Ask before publishing.", role: "check", inputs: [], outputs: [] }];
  graph.s.push(graph.cs[0].slug); graph.p.push([120, 50]); graph.e.push([graph.s.length - 2, graph.s.length - 1]); graph.ks.push([]); graph.k.push(""); graph.r.push(""); graph.o.push(""); graph.b.push([]);
  const encode = (value: unknown) => Buffer.from(deflateSync(strToU8(JSON.stringify(value)))).toString("base64url");
  envelope.flowCode = encode(graph); envelope.customSkills = graph.cs;
  await page.getByLabel("Import workflow JSON").setInputFiles({ name: "workflow.edit.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(envelope)) });
  await expect(page.getByTestId("step-open")).toHaveCount(graph.s.length);
  await page.getByTestId("workflow-diagram-view").click(); await expect(page.getByTestId("flow-node")).toHaveCount(graph.s.length);
  await page.getByTestId("workflow-list-view").click();
  const roundTripDownload = page.waitForEvent("download"); await page.getByTestId("compose-export").click();
  const roundTrip = await roundTripDownload; const roundTripPath = info.outputPath("roundtrip.json"); await roundTrip.saveAs(roundTripPath);
  const after = JSON.parse(fs.readFileSync(roundTripPath, "utf8"));
  const actual = JSON.parse(strFromU8(inflateSync(Buffer.from(after.flowCode.replace(/-/g, "+").replace(/_/g, "/"), "base64"))));
  for (const key of ["s", "p", "e", "b", "r", "o", "k", "ks", "cm", "cs", "ov", "t", "tm", "g", "gn"]) expect(actual[key], key).toEqual(graph[key]);
  const packDownload = page.waitForEvent("download"); await page.getByTestId("compose-download").click();
  const pack = await packDownload; const packPath = info.outputPath("custom-workflow.zip"); await pack.saveAs(packPath);
  const files = unzipSync(fs.readFileSync(packPath));
  expect(strFromU8(files["skills/custom-workflow-check/SKILL.md"])).toContain("Ask before publishing");
  expect(files["minds/my-mind-workflow-check.json"]).toBeTruthy();
  expect(strFromU8(files["HANDOFF.md"])).toContain("Action boundaries");
});


test("standalone transfer instructions remain after closing the download dialog", async ({ page }) => {
  const code = Buffer.from(deflateSync(strToU8(JSON.stringify({ v: 1, n: "Reply plan", g: "Draft a clear reply", s: ["executive-email-draft"], p: [[4, 11]], e: [], m: [] })))).toString("base64url");
  await page.goto(`/?flow=${code}#build`);
  const builder=page.getByTestId("builder");
  await builder.getByTestId("download-handoff").click();
  const download=page.waitForEvent("download"); await page.getByTestId("needs-download").click(); await download;
  const dialog=page.getByTestId("needs"); await dialog.getByText("Chat · Change", {exact:true}).click(); await dialog.getByTestId("next-code").click();
  await page.getByTestId("next-done").click(); await expect(page.getByTestId("needs")).toHaveCount(0);
  const guide=builder.getByTestId("transfer-guide"); await expect(guide).toBeVisible();
  await expect(guide).toContainText("START_HERE.txt"); await expect(guide).toContainText("HANDOFF.md");
  await expect(guide.getByText("Coding assistant · Change", {exact:true})).toBeVisible();
  await expect(guide).toContainText("Open that folder in your AI coding assistant");
  await builder.getByTestId("workflow-diagram-view").click(); await expect(guide).toBeVisible();
});
