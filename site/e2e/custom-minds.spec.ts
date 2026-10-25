import { choosePlanner, submitPlan, editStepOptions } from "./fixtures/workflow-ui";
import { test, expect } from "./fixtures/composer-staging-test";
import fs from "node:fs";
import { unzipSync, strFromU8 } from "fflate";

test.beforeEach(async ({ page }, info) => { if (info.project.name === "desktop") await page.addInitScript(() => localStorage.setItem("abb:workflow-view", "diagram")); });

const profile = { slug: "my-mind-own-voice", name: "My writing voice", specialty: "Write clear copy", voice: "Warm, brief and specific", principles: "Check every claim", avoid: "Jargon", examples: "A small useful change. Then another." };
async function createMind(page: any) {
  if (new URL(page.url()).pathname === "/compose") await page.getByText("Customize: planner, minds and imports", { exact: true }).click();
  const library = page.getByTestId("my-minds"); if (!new URL(page.url()).searchParams.has("view")) await library.locator("summary").click();
  await library.getByRole("button", { name: "Create a mind", exact: true }).click();
  await library.getByLabel("Name", { exact: true }).fill(profile.name);
  await library.getByLabel("What should this mind help with?", { exact: true }).fill(profile.specialty);
  await library.getByLabel("Voice and writing style", { exact: true }).fill(profile.voice);
  await library.getByLabel("How this mind works", { exact: true }).fill(profile.principles);
  await library.getByLabel("Things to avoid", { exact: true }).fill(profile.avoid);
  await library.getByLabel("Writing samples or reference notes", { exact: false }).fill(profile.examples);
  await library.getByRole("button", { name: "Save mind", exact: true }).click();
  await expect(library.getByRole("status")).toContainText("is saved");
}
async function downloadPack(page: any, info: any) {
  const event = page.waitForEvent("download"); await page.getByTestId("compose-download").click(); const dl = await event;
  const file = info.outputPath(dl.suggestedFilename()); await dl.saveAs(file); return unzipSync(fs.readFileSync(file));
}
test("custom mind plus recommended council survives reload, complete ZIP and import on another browser", async ({ page, browser }, info) => {
  let providerCalls = 0; page.on("request", r => { if (r.method() === "POST" && /\/api\/(compose|transcribe)/.test(r.url())) providerCalls++; });
  await page.goto("/compose"); await createMind(page);
  // An unrelated personal sample must never hitchhike in an exported workflow.
  await page.getByLabel("Import mind file").setInputFiles({name:"mind.json", mimeType:"application/json", buffer:Buffer.from(JSON.stringify({format:"ai-blocks-mind/1", mind:{...profile, slug:"my-mind-unrelated", name:"Unrelated private sample", examples:"DO-NOT-EXPORT-THIS-SAMPLE"}}))});
  await page.getByRole("button", {name:"Save mind",exact:true}).click();
  await choosePlanner(page, "free");
  await page.getByTestId("compose-goal").fill("Build a landing page from scratch and deliver source code"); await submitPlan(page);
  await page.getByTestId("flow-node").first().click(); await editStepOptions(page);
  const panel=page.getByTestId("step-mind");
  await panel.getByRole("button", {name:profile.name,exact:true}).click();
  await expect(panel.getByTestId("mind-idea")).toHaveCount(2);
  await panel.getByTestId("mind-idea").nth(0).click(); await panel.getByTestId("mind-idea").nth(1).click();
  await expect(page.getByTestId("task-council")).toContainText("Council of 3");
  await page.getByTestId("step-instructions").fill("Keep the reader's strongest question first.");
  await page.getByTestId("step-panel").getByRole("button",{name:"Close",exact:true}).click();
  await page.reload(); await expect(page.getByTestId("flow-node").first()).toContainText("Council of 3");
  const files=await downloadPack(page,info), machine=JSON.parse(strFromU8(files["workflow.json"]));
  expect(machine.steps[0].minds).toHaveLength(3); expect(machine.steps[0].council.protocol).toBe("TASK-COUNCIL.md");
  expect(machine.steps[0].your_notes).toContain("strongest question");
  expect(strFromU8(files["TASK-COUNCIL.md"])).toContain("one challenge round");
  expect(strFromU8(files["HANDOFF.md"])).toContain("Task council");
  expect(strFromU8(files[`skills/${machine.steps[0].skill}/SKILL.md`])).toBe(fs.readFileSync(`public/skills/${machine.steps[0].skill}/SKILL.md`, "utf8").replace(/\r\n?/g, "\n"));
  expect(machine.steps[0].skill_sha256).toMatch(/^[a-f0-9]{64}$/);
  for(const mind of machine.steps[0].minds) expect(files[`skills/${mind}/SKILL.md`]).toBeTruthy();
  expect(Object.keys(files).filter(s=>s.startsWith("minds/"))).toHaveLength(1);
  expect(Object.values(files).some(bytes=>strFromU8(bytes).includes("DO-NOT-EXPORT-THIS-SAMPLE"))).toBe(false);
  const fresh = await browser.newContext(), imported = await fresh.newPage();
  await imported.goto(new URL("/compose",page.url()).href);
  await imported.getByText("Customize: planner, minds and imports", { exact: true }).click();
  await imported.getByLabel("Import workflow JSON").setInputFiles({name:"workflow.edit.json",mimeType:"application/json",buffer:Buffer.from(files["workflow.edit.json"])});
  await imported.getByTestId("workflow-diagram-view").click();
  await expect(imported.getByTestId("flow-node").first()).toContainText("Council of 3");
  await imported.getByTestId("flow-node").first().click(); await editStepOptions(imported);
  await expect(imported.getByTestId("step-mind").getByRole("button",{name:`Remove ${profile.name} from task`,exact:true})).toBeVisible();
  await imported.getByTestId("step-panel").getByRole("button",{name:"Close",exact:true}).click();
  const roundtrip=await downloadPack(imported,info); expect(strFromU8(roundtrip["HANDOFF.md"])).toContain(profile.name);
  await fresh.close(); expect(providerCalls).toBe(0);
  await page.screenshot({path:"../reports/custom-minds-desktop.png",fullPage:true});
});

test("@mobile build a mind in Minds, reuse in Compose and keep councils while reordering tasks", async ({page},info)=>{
  // This full create/reuse/reorder/export flow also captures a tall mobile screenshot.
  test.setTimeout(60_000);
  await page.goto("/minds?view=my"); await createMind(page); await page.reload();
  await expect(page.getByTestId("my-minds")).toContainText(profile.name);
  await page.goto("/compose"); await choosePlanner(page, "free");
  await page.getByTestId("compose-goal").fill("Build a landing page from scratch and deliver source code"); await submitPlan(page);
  await page.getByTestId("step-open").first().click(); await editStepOptions(page); const panel=page.getByTestId("step-mind");
  await panel.getByRole("button",{name:profile.name,exact:true}).click(); await panel.getByTestId("mind-idea").first().click();
  await expect(page.getByTestId("task-council")).toContainText("Council of 2");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.screenshot({path:"../reports/custom-minds-mobile.png",fullPage:true});
  await page.getByTestId("step-panel").getByRole("button",{name:"Close",exact:true}).click();
  await page.getByTestId("step-down").first().click();
  const files=await downloadPack(page,info), machine=JSON.parse(strFromU8(files["workflow.json"]));
  expect(machine.steps.some((s:any)=>s.minds.length===2)).toBe(true);
  expect(Object.keys(files).some(s=>s.startsWith("minds/"))).toBe(true);
});

test("mind import errors stay usable and writing sample is reviewed before saving",async({page})=>{
  await page.goto("/compose"); await page.getByText("Customize: planner, minds and imports", { exact: true }).click(); const library=page.getByTestId("my-minds"); await library.locator("summary").click();
  await page.getByLabel("Import mind file").setInputFiles({name:"wrong.json",mimeType:"application/json",buffer:Buffer.from('{"format":"wrong"}')});
  await expect(library.getByRole("status")).toContainText("exported AI Blocks");
  await page.getByLabel("Import mind file").setInputFiles({name:"My voice.txt",mimeType:"text/plain",buffer:Buffer.from("Here is a sample of my writing.")});
  await expect(library.getByLabel("Writing samples or reference notes",{exact:false})).toHaveValue("Here is a sample of my writing.");
  await library.getByRole("button",{name:"Save mind",exact:true}).click(); await expect(library.getByRole("status")).toContainText("purpose");
  await library.getByLabel("What should this mind help with?",{exact:true}).fill("Write replies"); await library.getByRole("button",{name:"Save mind",exact:true}).click();
  const event=page.waitForEvent("download"); await library.getByRole("button",{name:"Export My voice",exact:true}).click(); const file=await event; expect(file.suggestedFilename()).toMatch(/my-mind.*\.json$/);
});
