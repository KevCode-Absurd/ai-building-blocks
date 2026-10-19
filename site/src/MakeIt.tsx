import type { Block } from "./lib/data";

// Claude writes image and video prompts but can't draw them. Visual skills say plainly what finishes the job,
// so nobody runs one in Claude and waits for a picture. The SKILL.md says the same (tools/add-making-it.mjs).
const KEYS = (
  <>
    <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">Get an OpenAI key</a>
    <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">Get a Google key</a>
  </>
);
const OPTIONS = {
  image: [
    { who: "You use ChatGPT", how: <>Paste the image prompt into a chat and ask for the picture. It uses GPT Image. Free plans have tight daily limits. On a paid plan, Codex can make it too.</>, links: <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer">Open ChatGPT</a> },
    { who: "You use Gemini", how: <>Paste the prompt into Gemini and ask for the picture. It uses Nano Banana. Free accounts get a few a day.</>, links: <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer">Open Gemini</a> },
    { who: "You use Higgsfield", how: <>Paste the prompt into its image tool and pick Nano Banana or GPT Image. Or connect Higgsfield to Claude, and Claude makes the picture right in your chat. It needs a paid Higgsfield plan.</>, links: <a href="https://higgsfield.ai" target="_blank" rel="noopener noreferrer">Open Higgsfield</a> },
    { who: "You only have Claude or Claude Code", how: <>Claude can't make pictures by itself. In Claude Code, get an API key from OpenAI or Google, save it as <code>OPENAI_API_KEY</code> or <code>GEMINI_API_KEY</code>, and ask Claude Code to make the picture. OpenAI or Google charges you for each one. In the Claude app, copy the prompt into ChatGPT or Gemini instead.</>, links: KEYS },
  ],
  video: [
    { who: "First, the pictures", how: <>Each clip starts from a still picture. Make it from its image prompt in ChatGPT (GPT Image), Gemini (Nano Banana) or Higgsfield, then turn it into a clip below.</>, links: null },
    { who: "You use Higgsfield", how: <>Paste each clip prompt into its video tool with the first picture, and pick Seedance, Kling or Veo. Or connect Higgsfield to Claude, and Claude makes the clips right in your chat. It runs on paid credits.</>, links: <a href="https://higgsfield.ai" target="_blank" rel="noopener noreferrer">Open Higgsfield</a> },
    { who: "You pay for Gemini", how: <>Paid Google AI plans include Veo video in the Gemini app, a few clips a day. Free Gemini accounts can't make video.</>, links: <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer">Open Gemini</a> },
    { who: "You only have Claude or Claude Code", how: <>Claude can't make pictures or video by itself. In Claude Code, add a key from a video service that offers Seedance, Kling or Veo, and Claude Code sends the clip prompts for you. For the pictures alone, an OpenAI or Google key is enough.</>, links: KEYS },
  ],
};

export const makeTitle = (kind: "image" | "video") => (kind === "image" ? "Turn the prompt into a picture" : "Turn the prompts into a video");

/** The short line at the top of a visual skill's page. */
export function MakeNote({ kind }: { kind: "image" | "video" }) {
  return (
    <p className="bp-needs" data-testid="make-note">
      {kind === "image"
        ? "Your AI writes the image prompt. To get the picture you need ChatGPT, Gemini, Higgsfield or an API key."
        : "Your AI writes the prompts. To get the video you need Higgsfield, a paid Gemini plan or an API key."}{" "}
      <a href="#make">What you need</a>
    </p>
  );
}

/** The section that says what finishes the job, and shows a finished picture when we have one. */
export function MakeIt({ kind }: { kind: "image" | "video" }) {
  return (
    <ul className="make-list" data-testid="make-it">
      {OPTIONS[kind].map((o) => (
        <li key={o.who}>
          <b>{o.who}</b>
          <p>{o.how}</p>
          {o.links && <p className="make-links">{o.links}</p>}
        </li>
      ))}
    </ul>
  );
}

/** One finished picture, so people see what the prompt turns into before they run it. */
export function Look({ b, kind }: { b: Block; kind: "image" | "video" | null }) {
  if (!b.look) return null;
  const wide = /storyboard|character-sheet/.test(b.look.src);
  return (
    <figure className={`look${wide ? " wide" : ""}`} data-testid="look">
      <h3>{wide ? "What it looks like when it's made" : kind === "video" ? "What a first picture for the clips looks like" : "What the finished picture looks like"}</h3>
      <a href={b.look.src} target="_blank" rel="noopener" title="Open full size"><img src={b.look.src} alt={b.look.alt} loading="lazy" decoding="async" /></a>
      <figcaption>Made with a prompt like this one, from our own ad library. Brand names are hidden.</figcaption>
    </figure>
  );
}
