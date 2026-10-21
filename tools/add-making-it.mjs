// Claude writes prompts but can't draw. Every skill that hands back an image or video prompt says so at the start
// and tells the person how to finish it: ChatGPT, Gemini, Higgsfield, or an API key in Claude Code.
// Writes one marked section after "## What you need" in each SKILL.md, so running it again only refreshes it.
// Run from the repo root after `npm --prefix site run index`:  node tools/add-making-it.mjs
import fs from "node:fs";
import path from "node:path";

const VIDEO = new Set(["video_prompt", "video_ads"]);
const IMAGE = new Set(["image_prompt", "avatar_sheet", "static_ads", "photo_set", "pdp_images", "upscaled_image"]);
/** "video", "image" or null: what a block needs a picture or video tool for. Same rule as rendersOf() on the site. */
export const rendersOf = (outputs) => (outputs.some((o) => VIDEO.has(o.type)) ? "video" : outputs.some((o) => IMAGE.has(o.type)) ? "image" : null);

const START = "<!-- making-it -->", END = "<!-- /making-it -->";
const KEYS = "Keys: platform.openai.com/api-keys (OpenAI) or aistudio.google.com/apikey (Google). OpenAI or Google bills each picture.";
const SECTION = {
  image: [
    "## Making the picture",
    "If you can make images in this chat (ChatGPT and Gemini can), make the picture from your prompt once the prompt passes its checks, then check the picture against the same list and say what to fix. If you can't (Claude can't draw unless an image tool is connected), say that once, in one line, before you start, so nobody waits for a picture that won't come. Hand back the prompt, and at the end tell them how to finish it:",
    "- **ChatGPT or Gemini:** paste the image prompt into a chat and ask for the picture, or paste this whole skill there so it writes the prompt and makes the picture in one go. ChatGPT uses GPT Image, Gemini uses Nano Banana. Free plans have tight daily limits. Codex on a paid ChatGPT plan can make it too.",
    "- **Higgsfield:** paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.",
    `- **Claude Code:** with an OpenAI or Google key saved as \`OPENAI_API_KEY\` or \`GEMINI_API_KEY\`, offer to send the prompt to that image API and save the file. ${KEYS}`,
    "If an image tool is connected, offer to make the picture with it, and ask before you spend credits.",
  ],
  video: [
    "## Making the video",
    "You write the prompts. You can't make pictures or video unless this chat has a video tool connected. Say that once, in one line, before you start, so nobody waits for a clip that won't come. At the end, tell them how to finish it:",
    "- **Each clip starts from a picture.** Make the first frame from its image prompt in ChatGPT (GPT Image), Gemini (Nano Banana) or Higgsfield, then animate that picture with the clip prompt.",
    "- **Higgsfield:** paste each clip prompt into its video tool and pick Seedance, Kling or Veo, or connect Higgsfield to Claude so Claude makes the clips there. It runs on paid credits.",
    "- **Gemini:** paid Google AI plans include Veo video in the Gemini app, with a few clips a day.",
    `- **Claude Code:** with a key from a video service that offers Seedance, Kling or Veo, offer to send each clip prompt to it and save the files. Pictures alone need an OpenAI or Google key. ${KEYS}`,
    "If a video tool is connected, offer to make the clips with it, and ask before you spend credits.",
  ],
};

const blocks = JSON.parse(fs.readFileSync("site/public/data/blocks.json", "utf8")).blocks;
// blocks.json keeps ports short ("brief", "photos?"); turn them back into {type, required}.
const port = (p) => (typeof p === "string" ? { type: p.replace(/\?$/, ""), required: !p.endsWith("?") } : p);
// It also leaves out default values and sends a passed test as tested: 1; put those back the way lib/data.ts does.
const DEFAULTS = { category: "general", type: "skill", role: "make", job: "ops", level: "intermediate", thinking: "medium", origin: "own", version: "1.0.0" };
for (const b of blocks) {
  for (const [k, d] of Object.entries(DEFAULTS)) b[k] ??= d;
  b.inputs = (b.inputs ?? []).map(port); b.outputs = (b.outputs ?? []).map(port);
  if (b.tested === 1) b.tested = { result: "pass" };
  if (typeof b.usedIn === "number") b.usedIn = Array(b.usedIn).fill("");
}
const dirOf = (slug) => ["general", "ecommerce", "orchestrators", "agents"].map((c) => path.join("catalogue-items", c, slug)).find((d) => fs.existsSync(path.join(d, "SKILL.md")));
let changed = 0, kinds = { image: 0, video: 0 };
for (const b of blocks) {
  const kind = rendersOf(b.outputs);
  const dir = dirOf(b.slug);
  if (!dir) continue;
  const f = path.join(dir, "SKILL.md");
  const text = fs.readFileSync(f, "utf8");
  const nl = text.includes("\r\n") ? "\r\n" : "\n";
  let next = text.split(START).length > 1 ? text.slice(0, text.indexOf(START)) + text.slice(text.lastIndexOf(END) + END.length).replace(/^(\r?\n){1,2}/, "") : text;
  if (kind) {
    const [title, lead, ...rest] = SECTION[kind];
    const last = rest.pop();
    const block = [START, title, "", lead, ...rest, "", last, END].join(nl);
    // The first section after "What you need" ("Before you start", written by add-needs.mjs, sits before it).
    const need = next.search(/^## What you need/m);
    const after = need === -1 ? -1 : next.slice(need + 3).search(/^## /m);
    const at = need === -1 ? next.search(/^## (?!Before you start)/m) : after === -1 ? -1 : need + 3 + after;
    next = at === -1 ? `${next.trimEnd()}${nl}${nl}${block}${nl}` : `${next.slice(0, at)}${block}${nl}${nl}${next.slice(at)}`;
    kinds[kind]++;
  }
  if (next !== text) { fs.writeFileSync(f, next); changed++; }
}
console.log(`making-it: ${kinds.image} picture skills, ${kinds.video} video skills, ${changed} files changed`);
