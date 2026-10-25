import { test, expect, type Page } from "@playwright/test";

const original = {
  id: "chain-e2e", name: "Check a real ad test", goal: "", notes: "Keep this global instruction", ended: true, updated: 1,
  nodes: [
    { id: "a", slug: "split-run-test-planner", x: 40, y: 110, notes: "Keep the test constraints" },
    { id: "b", slug: "test-reply-offer-planner", x: 400, y: 110, role: "Review the offer", notes: "Use only the approved offer facts" },
    { id: "c", slug: "split-run-result-reader", x: 760, y: 110, notes: "Keep the original winner rule" },
  ],
  edges: [{ id: "ab", from: "a", to: "b" }, { id: "bc", from: "b", to: "c" }, { id: "ac", from: "a", to: "c" }],
};
const readDraft = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem("abb:v1") || "{}").draft);
const node = (page: Page, id: string) => page.locator(`.react-flow__node[data-id="${id}"]`);
const fits = async (page: Page) => expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);

test.beforeEach(async ({ page }) => {
  await page.route("**/api/auth*", r => r.fulfill({ json: { configured: false } }));
  await page.route("**/api/comments*", r => r.fulfill({ json: { enabled: false, comments: [] } }));
  await page.route("**/api/compose*", r => r.request().method() === "GET" ? r.fulfill({ json: { enabled: false, defaultModel: "luna", models: [] } }) : r.abort());
  // The suite only edits this fresh browser's guest draft. No provider or account writes.
});

async function open(page: Page, flow: typeof original | null = original) {
  await page.addInitScript(seed => {
    if (sessionStorage.getItem("chain-e2e-seeded")) return;
    sessionStorage.setItem("chain-e2e-seeded", "1");
    localStorage.setItem("abb:v1", JSON.stringify({ kits: [], flows: [], recent: [], currentFlow: null, draft: seed }));
    localStorage.setItem("abb:workflow-view", "diagram");
  }, flow);
  await page.goto("/#build");
  await page.getByTestId("builder").waitFor();
  await page.locator("#app-loader").waitFor({ state: "hidden" });
  const reject = page.getByRole("button", { name: /Reject.*cookies|Reject optional/i });
  if (await reject.isVisible()) await reject.click();
  await expect(page.getByTestId("workflow-customize")).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByTestId("workflow-diagram-view")).toHaveAttribute("aria-pressed", "true");
  if (flow) await expect(page.getByTestId("flow-node")).toHaveCount(flow.nodes.length);
}

async function selectAnchor(page: Page) {
  await page.getByTestId("view-fit-to-screen").click();
  await node(page, "b").click({ position: { x: 35, y: 40 } });
  await expect(page.locator(".chain-context")).toContainText("Ad response incentive planner");
  const panel = page.getByTestId("step-panel");
  if (await panel.isVisible()) await panel.getByRole("button", { name: "Close", exact: true }).click();
  await expect(page.locator(".chain-context")).toContainText("Ad response incentive planner");
}

for (const tag of ["", "@mobile "]) {
  test(tag + "customization starts open and choosing a first suggestion adds exactly one step", async ({ page }) => {
    await open(page, null);
    const first = page.getByTestId("chain-start");
    await expect(first.locator(".chain-card")).toHaveCount(5);
    await expect(page.getByTestId("chain-goal")).toHaveAttribute("maxlength", "3000");
    await page.getByTestId("chain-goal").fill("move business data between tools");
    const suggestion = first.locator('.chain-card[data-slug="business-data-move-runbook"]');
    await expect(suggestion).toBeVisible();
    await suggestion.getByRole("button", { name: /^Use first:/ }).click();
    await expect(page.getByTestId("flow-node")).toHaveCount(1);
    await expect.poll(async () => (await readDraft(page))?.nodes?.length).toBe(1);
    const draft = await readDraft(page);
    expect(draft.nodes[0].slug).toBe("business-data-move-runbook"); expect(draft.edges).toEqual([]);
    await expect(page.getByTestId("chain-after")).toBeVisible();
    await page.getByTestId("palette-all").click(); await expect(page.getByTestId("palette-search")).toBeVisible();
    await page.getByTestId("palette-kits").click(); await expect(page.locator(".chain-empty")).toContainText("No saved blocks");
    await page.locator(".chain-templates > summary").click(); await expect(page.locator(".chain-templates .tpl").first()).toBeVisible();
    await fits(page);
  });

  test(tag + "before and after choices add one connected step while retaining branches and notes", async ({ page }) => {
    await open(page); await selectAnchor(page);
    for (const direction of ["before", "after"] as const) {
      await selectAnchor(page);
      const section = page.getByTestId(`chain-${direction}`);
      const card = section.locator(".chain-card").first();
      const slug = await card.getAttribute("data-slug");
      const previous = await readDraft(page);
      await card.getByRole("button", { name: direction === "before" ? /^Add before:/ : /^Add after:/ }).click();
      await expect.poll(async () => (await readDraft(page)).nodes.length).toBe(previous.nodes.length + 1);
      const next = await readDraft(page), added = next.nodes.find((n: any) => !previous.nodes.some((old: any) => old.id === n.id));
      expect(added.slug).toBe(slug);
      for (const n of original.nodes) expect(next.nodes.find((x: any) => x.id === n.id)).toEqual(n);
      for (const e of original.edges) expect(next.edges.find((x: any) => x.id === e.id)).toEqual(e);
      expect(next.edges.some((e: any) => direction === "before" ? e.from === added.id && e.to === "b" : e.from === "b" && e.to === added.id)).toBe(true);
      expect(next.notes).toBe(original.notes);
    }
    await fits(page);
  });

  test(tag + "replacement choices expand to five and replace in place without losing branches or instructions", async ({ page }) => {
    await open(page); await selectAnchor(page);
    const section = page.getByTestId("chain-replace");
    await expect(section.locator(".chain-card")).toHaveCount(3);
    await section.getByRole("button", { name: "View more: Replace this step" }).click();
    await expect(section.locator(".chain-card")).toHaveCount(5);
    const card = section.locator(".chain-card").first(), slug = await card.getAttribute("data-slug"), replacementName = await card.locator("b").innerText();
    await card.getByRole("button", { name: /^Replace:/ }).click();
    await expect.poll(async () => (await readDraft(page)).nodes.find((n: any) => n.id === "b").slug).toBe(slug);
    await expect(page.locator(".chain-context")).toHaveText(`Selected: ${replacementName}`);
    const draft = await readDraft(page);
    expect(draft.nodes).toHaveLength(3); expect(draft.edges).toEqual(original.edges); expect(draft.notes).toBe(original.notes);
    expect(draft.nodes.find((n: any) => n.id === "b")).toEqual({ ...original.nodes[1], slug });
    await fits(page);
  });
}

test("dragging before and after recommendations adds one correctly connected step each", async ({ page }) => {
  await open(page);
  for (const direction of ["before", "after"] as const) {
    await selectAnchor(page);
    const card = page.getByTestId(`chain-${direction}`).locator(".chain-card").first(), slug = await card.getAttribute("data-slug"), previous = await readDraft(page);
    const target = page.locator(".react-flow__pane");
    await card.scrollIntoViewIfNeeded(); await target.scrollIntoViewIfNeeded();
    const targetBox = await target.boundingBox();
    // Both scrollable panels must be visible before the native mouse gesture starts.
    await expect(card).toBeInViewport();
    expect(await page.evaluate(({ x, y }) => !!document.elementFromPoint(x, y)?.closest(".react-flow"), { x: targetBox!.x + 120, y: targetBox!.y + 200 })).toBe(true);
    await card.dragTo(target, { sourcePosition: { x: 20, y: 20 }, targetPosition: { x: 120, y: 200 } });
    await expect.poll(async () => (await readDraft(page)).nodes.length).toBe(previous.nodes.length + 1);
    const draft = await readDraft(page), added = draft.nodes.find((n: any) => !previous.nodes.some((old: any) => old.id === n.id));
    expect(added.slug).toBe(slug); expect(draft.edges.some((e: any) => direction === "before" ? e.from === added.id && e.to === "b" : e.from === "b" && e.to === added.id)).toBe(true);
    for (const e of original.edges) expect(draft.edges.find((x: any) => x.id === e.id)).toEqual(e);
  }
});

test("mouse selection, delete, undo and space-pan work without diagram toolbar controls", async ({ page }) => {
  await open(page);
  await page.getByTestId("workflow-customize").click();
  await page.getByTestId("view-fit-to-screen").click();
  const pane = page.locator(".react-flow__pane"); await pane.scrollIntoViewIfNeeded();
  await expect(page.locator(".diagram-tools")).toHaveCount(0);
  const boxes = await Promise.all([node(page, "a").boundingBox(), node(page, "b").boundingBox()]);
  expect(boxes.every(Boolean)).toBe(true);
  const left = Math.min(...boxes.map(b => b!.x)) - 12, top = Math.min(...boxes.map(b => b!.y)) - 12;
  const right = Math.max(...boxes.map(b => b!.x + b!.width)) + 12, bottom = Math.max(...boxes.map(b => b!.y + b!.height)) + 12;
  await page.mouse.move(left, top); await page.mouse.down(); await page.mouse.move(right, bottom, { steps: 14 }); await page.mouse.up();
  await expect(page.locator(".react-flow__node.selected")).toHaveCount(2);
  const prior = await readDraft(page), box = await node(page, "a").boundingBox();
  await page.mouse.move(box!.x + 30, box!.y + 35); await page.mouse.down(); await page.mouse.move(box!.x + 65, box!.y + 85, { steps: 12 }); await page.mouse.up();
  await expect.poll(async () => (await readDraft(page)).nodes.find((n: any) => n.id === "a").x).not.toBe(prior.nodes[0].x);
  const moved = await readDraft(page), deltas = ["a", "b"].map(id => { const p = prior.nodes.find((n: any) => n.id === id), n = moved.nodes.find((n: any) => n.id === id); return [n.x - p.x, n.y - p.y]; });
  expect(deltas[0]).toEqual(deltas[1]); expect(moved.nodes.find((n: any) => n.id === "c")).toEqual(prior.nodes[2]);
  await page.keyboard.press("Delete"); await expect(page.getByTestId("flow-node")).toHaveCount(1);
  await expect(page.getByTestId("view-undo")).toBeEnabled(); await page.getByTestId("view-undo").click(); await expect(page.getByTestId("flow-node")).toHaveCount(3);
  await expect.poll(async () => (await readDraft(page)).edges.length).toBe(3);
  const viewport = page.locator(".react-flow__viewport"), beforePan = await viewport.getAttribute("style"), area = await pane.boundingBox();
  await page.keyboard.down("Space");
  await page.mouse.move(area!.x + area!.width - 30, area!.y + 30); await page.mouse.down(); await page.mouse.move(area!.x + area!.width - 75, area!.y + 75, { steps: 10 }); await page.mouse.up();
  await page.keyboard.up("Space");
  await expect.poll(() => viewport.getAttribute("style")).not.toBe(beforePan);
  expect((await readDraft(page)).nodes).toHaveLength(3);
  await page.getByTestId("workflow-customize").click(); await page.getByTestId("chain-goal").fill("Keep all stepsX"); await page.getByTestId("chain-goal").press("Backspace");
  await expect(page.getByTestId("chain-goal")).toHaveValue("Keep all steps"); await expect(page.getByTestId("flow-node")).toHaveCount(3);
});

test("Start and End cannot be dragged or deleted", async ({ page }) => {
  await open(page);
  await page.getByTestId("workflow-customize").click(); await page.getByTestId("view-fit-to-screen").click();
  for (const id of ["__start", "__end"]) {
    const terminal = node(page, id); await terminal.scrollIntoViewIfNeeded();
    const position = await terminal.getAttribute("style"), b = await terminal.boundingBox();
    await page.mouse.move(b!.x + 20, b!.y + 20); await page.mouse.down(); await page.mouse.move(b!.x + 80, b!.y + 60, { steps: 8 }); await page.mouse.up();
    await expect(terminal).toHaveAttribute("style", position!);
    const panel = page.locator(".step-panel"); if (await panel.isVisible()) await panel.getByRole("button", { name: "Close", exact: true }).click();
    await terminal.focus(); await page.keyboard.press("Delete"); await expect(terminal).toBeVisible(); await expect(page.getByTestId("flow-node")).toHaveCount(3);
  }
});

