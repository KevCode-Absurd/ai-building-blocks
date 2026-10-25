// Keep essential transfer help available to readers before JavaScript opens.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const sections = {
  'how-it-works.html': `<section id="use-in-ai" aria-labelledby="use-in-ai-title"><h2 id="use-in-ai-title">Use your request or files in your AI</h2><h3>Copied a request?</h3><ol><li>Open your AI chat and paste the whole request.</li><li>Add any source files it asks for, then send it.</li><li>Review the result in your AI chat or workspace.</li></ol><h3>Downloaded a pack?</h3><ol><li>Unzip it and keep all the files together.</li><li>Open the folder in your AI coding assistant, or attach the files in your AI chat.</li><li>Ask your AI to follow HANDOFF.md. Review its plan before it starts.</li></ol><p>Copying or downloading prepares instructions. Your AI makes the result. <a href="/#library">Find a task</a> or <a href="/support">get help</a>.</p></section>`,
  'from-a-source.html': `<section id="source-help" aria-labelledby="source-help-title"><h2 id="source-help-title">Prepare your source for the workflow</h2><p>Paste the full article, transcript or notes. A link is for credit; it does not load the content. Title, author and link are optional.</p><ol><li>Paste your source text and download the pack.</li><li>Unzip it and keep all the files together.</li><li>Give the files to your AI and ask it to follow HANDOFF.md.</li><li>Review the steps your AI finds before it writes the skills and workflow.</li></ol><p>Your source draft stays in this browser and is not synced to your account. Your AI makes the result in your chat or workspace. <a href="/how-it-works#use-in-ai">Get help using the files</a>.</p></section>`,
};
export async function buildUsabilityHelp(directory = 'dist') {
  const updated = [];
  for (const [file, originalSection] of Object.entries(sections)) {
    const setup = `<h3>Set up your AI</h3><ul><li><b>ChatGPT:</b> Paste the copied instructions in a chat. For supporting files, unzip the download and attach SKILL.md and the files it needs. To reuse it, add the files to a project's Sources and mention them in project instructions. <a href="https://learn.chatgpt.com/docs/projects">Official guide</a>.</li><li><b>Claude:</b> In Customize → Skills, choose + → Create skill → Upload a skill. Upload the skill ZIP and enable it. <a href="https://support.claude.com/en/articles/12512180-use-skills-in-claude">Official guide</a>.</li><li><b>Claude Code:</b> Unzip the skill folder into .claude/skills/ in your project, keeping SKILL.md and supporting files together. Type /skill-name to use it. <a href="https://code.claude.com/docs/en/skills">Official guide</a>.</li><li><b>Codex:</b> Unzip the skill folder into .agents/skills/ in your project. Ask Codex to use it by name. Restart if it does not appear. <a href="https://developers.openai.com/codex/skills/">Official guide</a>.</li></ul><p>A workflow or agent pack contains several skills. Keep the complete pack together and follow START_HERE.txt and HANDOFF.md; do not upload the whole pack as one installed skill.</p>`;
    const section = file === 'how-it-works.html' ? originalSection.replace('</section>', `${setup}</section>`) : originalSection;
    const target = path.join(directory, file);
    const original = await fs.readFile(target, 'utf8');
    const html = original.replace(/<!-- USABILITY_HELP_START -->[\s\S]*?<!-- USABILITY_HELP_END -->/g, '');
    assert(html.includes('data-prerendered') && /<footer\b/.test(html), 'Expected a published public page: ' + file);
    const next = html.replace(/<footer\b/, `<!-- USABILITY_HELP_START -->${section}<!-- USABILITY_HELP_END --><footer`);
    await fs.writeFile(target, next);
    updated.push(file);
  }
  return updated;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log('Public transfer help: ' + (await buildUsabilityHelp(process.argv[2])).join(', '));
}
