import { test, expect } from "./fixtures/composer-staging-test";
import { mockComposerAccount } from "./fixtures/composer-account";
import { type Page } from "@playwright/test";
import fs from "node:fs";
import { unzipSync, strFromU8 } from "fflate";
const sample = { slug: "my-mind-device-voice", name: "My account writing voice", specialty: "Write clear customer emails", voice: "Warm, short and concrete", principles: "Check claims", avoid: "Jargon", examples: "A private writing example." };
type Library = {minds: any[]; revision: number};
function fixtureStore() {
  const libraries = new Map<string,Library>(); let puts=0,fail=false;
  const attach = async (page:Page,user="account-a") => {
    await mockComposerAccount(page,true,user,user);
    await page.route("**/api/minds",async route=>{
      const account=route.request().headers().authorization?.replace("Bearer ","")??"";
      if(!account)return route.fulfill({status:401,json:{error:"Sign in"}});
      const current=libraries.get(account)??{minds:[],revision:0};
      if(route.request().method()==="GET")return route.fulfill({json:current});
      puts++;if(fail)return route.fulfill({status:503,json:{error:"Your account minds could not be saved. Try again; your draft is still here."}});
      const body=route.request().postDataJSON();if(body.revision!==current.revision)return route.fulfill({status:409,json:{error:"Your minds changed on another device. Refresh the library and review the latest version."}});
      const next={minds:body.minds,revision:current.revision+1};libraries.set(account,next);return route.fulfill({json:next});
    });
  };
  return {attach,libraries,get puts(){return puts;},set fail(value:boolean){fail=value;}};
}
async function openLibrary(page:Page,path="/minds?view=my") {
  await page.goto(path); if (path !== "/minds?view=my") await page.getByTestId("my-minds").locator("summary").click();
  await expect(page.getByTestId("mind-account-status")).toContainText("Your private account library");
}
async function importProfile(page:Page,profile=sample) {
  await page.getByLabel("Import mind file").setInputFiles({name:"mind.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify({format:"ai-blocks-mind/1",mind:profile}))});
  await page.getByRole("button",{name:"Save mind",exact:true}).click();
}
test("account mind saved on device A is available on device B and in workflow downloads",async({page,browser},info)=>{
  const server=fixtureStore();await server.attach(page);await openLibrary(page);await importProfile(page);
  await expect(page.getByTestId("my-minds").getByRole("status")).toContainText("saved to your account");
  expect(await page.evaluate(()=>localStorage.getItem("abb:my-minds/1"))).toBeNull();
  const deviceB=await browser.newContext(), second=await deviceB.newPage();await server.attach(second);
  await second.goto(new URL("/compose",page.url()).href); await second.getByTestId("my-minds").locator("summary").click();
  await expect(second.getByRole("button",{name:`Edit ${sample.name}`,exact:true})).toBeVisible();
  await second.getByRole("tab",{name:"Free assembly"}).click();await second.getByTestId("compose-goal").fill("Build a landing page from scratch and deliver source code");await second.getByTestId("compose-submit").click();
  await second.getByTestId("flow-node").first().click();await second.getByTestId("step-mind").getByRole("button",{name:sample.name,exact:true}).click();
  await second.getByTestId("step-panel").getByRole("button",{name:"Close",exact:true}).click();
  const event=second.waitForEvent("download");await second.getByTestId("compose-download").click();const download=await event,file=info.outputPath(download.suggestedFilename());await download.saveAs(file);
  const files=unzipSync(fs.readFileSync(file));expect(strFromU8(files[`skills/${sample.slug}/SKILL.md`])).toContain(sample.voice);expect(files[`minds/${sample.slug}.json`]).toBeTruthy();
  await second.getByRole("button",{name:`Edit ${sample.name}`,exact:true}).click();await second.getByLabel("Voice and writing style",{exact:true}).fill("A revised voice from device B");await second.getByRole("button",{name:"Save mind",exact:true}).click();
  await page.getByRole("button",{name:"Refresh account minds",exact:true}).click();await page.getByRole("button",{name:`Edit ${sample.name}`,exact:true}).click();await expect(page.getByLabel("Voice and writing style",{exact:true})).toHaveValue("A revised voice from device B");
  await page.screenshot({path:"../reports/account-minds-desktop.png",fullPage:true});await deviceB.close();
});
test("browser minds copy only on request and account switching clears cloud profiles",async({page})=>{
  const server=fixtureStore();const privateMind={...sample,slug:"my-mind-account-only",name:"Private account-only voice"};server.libraries.set("account-a",{minds:[privateMind],revision:1});await server.attach(page);await page.addInitScript(profile=>localStorage.setItem("abb:my-minds/1",JSON.stringify([profile])),sample);await openLibrary(page);
  expect(server.puts).toBe(0);await expect(page.getByRole("button",{name:"Copy browser minds to account",exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Copy browser minds to account",exact:true}).click();await expect(page.getByRole("button",{name:`Edit ${sample.name}`,exact:true})).toBeVisible();expect(server.puts).toBe(1);
  await page.getByRole("button",{name:`Edit ${sample.name}`,exact:true}).click();
  await page.evaluate(()=>(window as any).__switchMindAccount("account-b"));await expect(page.getByRole("button",{name:`Edit ${sample.name}`,exact:true})).toHaveCount(0);expect(server.libraries.has("account-b")).toBe(false);
  await expect(page.getByTestId("my-minds")).not.toContainText(privateMind.name);await expect(page.locator(".my-minds-list")).toHaveCount(0);await expect(page.getByLabel("Voice and writing style",{exact:true})).toHaveCount(0);
  expect((await page.evaluate(()=>JSON.parse(localStorage.getItem("abb:my-minds/1")!)))[0].name).toBe(sample.name);
  await page.evaluate(()=>(window as any).__switchMindAccount("account-a"));await expect(page.getByRole("button",{name:`Edit ${sample.name}`,exact:true})).toBeVisible();
});
test("failed saves and changes on another device keep the draft and require review",async({page})=>{
  const server=fixtureStore();server.libraries.set("account-a",{minds:[sample],revision:1});await server.attach(page);await openLibrary(page);
  await page.getByRole("button",{name:`Edit ${sample.name}`,exact:true}).click();const voice=page.getByLabel("Voice and writing style",{exact:true});await voice.fill("My unsaved voice");
  server.fail=true;await page.getByRole("button",{name:"Save mind",exact:true}).click();await expect(voice).toHaveValue("My unsaved voice");await expect(page.getByTestId("my-minds").getByRole("status")).toContainText("draft is still here");
  server.fail=false;server.libraries.set("account-a",{minds:[{...sample,voice:"Latest other-device voice"}],revision:2});await page.getByRole("button",{name:"Save mind",exact:true}).click();await expect(voice).toHaveValue("My unsaved voice");
  await page.getByRole("button",{name:"Refresh account minds",exact:true}).click();await expect(page.getByRole("button",{name:"Save my version instead",exact:true})).toBeVisible();await expect(page.locator(".mind-conflict")).toContainText("Latest other-device voice");
  await page.getByRole("button",{name:"Save my version instead",exact:true}).click();await expect(page.getByRole("button",{name:`Edit ${sample.name}`,exact:true})).toBeVisible();expect(server.libraries.get("account-a")!.minds[0].voice).toBe("My unsaved voice");
});
test("@mobile account library supports importing and reusing a saved writing voice",async({page})=>{
  const server=fixtureStore();await server.attach(page);await openLibrary(page,"/compose");await importProfile(page);await expect(page.getByTestId("my-minds").getByRole("status")).toContainText("saved to your account");await page.reload();await page.getByTestId("my-minds").locator("summary").click();await expect(page.getByRole("button",{name:`Edit ${sample.name}`,exact:true})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();await page.screenshot({path:"../reports/account-minds-mobile.png",fullPage:true});
});
test("removing an account mind syncs across sessions and offers undo",async({page})=>{
  const server=fixtureStore();server.libraries.set("account-a",{minds:[sample],revision:1});await server.attach(page);await openLibrary(page);
  await page.getByRole("button",{name:`Remove ${sample.name}`,exact:true}).click();await expect(page.getByRole("button",{name:`Edit ${sample.name}`,exact:true})).toHaveCount(0);expect(server.libraries.get("account-a")!.minds).toHaveLength(0);
  await page.getByRole("button",{name:`Undo removal of ${sample.name}`,exact:true}).click();await expect(page.getByRole("button",{name:`Edit ${sample.name}`,exact:true})).toBeVisible();expect(server.libraries.get("account-a")!.minds).toHaveLength(1);
});
test("a new mind draft survives the sign-in redirect without uploading automatically",async({page})=>{
  await mockComposerAccount(page,false);let writes=0;page.on("request",r=>{if(r.method()==="PUT"&&r.url().includes("/api/minds"))writes++;});await page.goto("/minds?view=my");
  await page.getByRole("button",{name:"Create a mind",exact:true}).click();await page.getByLabel("Name",{exact:true}).fill("My pending voice");await page.getByLabel("Voice and writing style",{exact:true}).fill("Keep my unsaved style notes.");
  await page.getByRole("button",{name:"Sign in to save minds",exact:true}).click();await expect.poll(()=>page.evaluate(()=>sessionStorage.getItem("fixture:redirect"))).toBeTruthy();
  await page.reload();await expect(page.getByLabel("Name",{exact:true})).toHaveValue("My pending voice");await expect(page.getByLabel("Voice and writing style",{exact:true})).toHaveValue("Keep my unsaved style notes.");expect(writes).toBe(0);
});
