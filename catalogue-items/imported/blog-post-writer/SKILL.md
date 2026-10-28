---
name: blog-post-writing
description: Write high-quality, SEO-optimized blog posts in multiple formats including how-to guides, listicles, opinion pieces, and case studies, with structured outlines, hooks, and calls-to-action. Use when the user requests blog post writing or provides relevant inputs for this workflow.
license: MIT
metadata:
  author: awesome-ai-agent-skills
  version: 1.0.0
---

# Blog Post Writing

This skill enables an AI agent to write well-structured, engaging, and SEO-optimized blog posts across multiple content types — how-to guides, listicles, opinion pieces, case studies, and thought leadership articles. The agent handles the full lifecycle from topic research and outlining through drafting, SEO optimization, and final review, producing publish-ready content tailored to the target audience and brand voice.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A brief** (yours): what the work is for, who it's for and what a good result looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a brief. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Workflow

1. **Research the Topic and Keywords**
   Investigate the topic to understand its scope, current discourse, and search intent. Identify a primary keyword and 3-5 secondary keywords to target. Analyze the top-ranking content for the primary keyword to understand what angle, depth, and format performs well. This step needs web search, or top search results that the user pastes in. If neither is available, say so and skip the ranking analysis rather than guessing. Flag any figure you cannot source, and do not put it in the draft. Determine whether the search intent is informational ("how to set up CI/CD"), navigational ("GitHub Actions docs"), or transactional ("best CI/CD tools 2025").

2. **Choose the Content Format**
   Select the blog post format that best matches the topic and search intent. Use a **how-to guide** for process-oriented queries. Use a **listicle** for comparison or round-up queries. Use an **opinion piece** for thought leadership and brand positioning. Use a **case study** for showcasing results and building credibility. The format determines the structural template for the outline.

3. **Build the Outline**
   Create a detailed outline with the title (including the primary keyword), a hook for the introduction, H2 and H3 subheadings for the body, and a conclusion with a call-to-action. Ensure headings are descriptive and incorporate secondary keywords naturally. Plan where to place supporting elements — code blocks, images, blockquotes, statistics, and internal/external links.

4. **Write the Draft**
   Expand the outline into full prose. Open with a hook that creates curiosity, states a surprising fact, or directly addresses the reader's pain point. Follow with a clear thesis sentence that tells the reader what they will gain from the post. Write body sections in a logical progression, using transitions between sections. Close with a summary of key takeaways and a specific CTA — subscribe, download, try the product, or read a related post.

5. **Optimize for SEO**
   Place the primary keyword in the title, first paragraph, at least one H2, and the meta description. Use secondary keywords in subheadings and body text where they fit naturally — never force them. Write a meta description (150-160 characters) that summarizes the post and includes the primary keyword. Add alt text descriptions for any images. Ensure the URL slug is short and keyword-rich.

6. **Review and Polish**
   Proofread for grammar, spelling, and punctuation. Verify all statistics and claims have credible sources. Check that all links work and point to the correct destinations. Read the post aloud (or simulate doing so) to catch awkward phrasing. Ensure the post meets the target word count and that no section feels thin or padded.

## Usage

Provide the agent with:

- **Topic** — the subject or working title for the blog post
- **Target keyword** — the primary SEO keyword (optional; agent can research)
- **Content format** — how-to, listicle, opinion, case study, or let the agent recommend
- **Audience** — who will read this (developers, marketers, executives, general public)
- **Tone** — professional, casual, conversational, authoritative, witty
- **Word count** — target length (e.g., 800, 1500, 2500 words)
- **CTA** — what action readers should take after reading

Example prompt: "Write a 1,500-word how-to blog post about setting up a CI/CD pipeline with GitHub Actions. Target keyword: 'GitHub Actions CI/CD tutorial.' Audience: junior developers. Tone: friendly and encouraging."

## Examples

### Example 1: Complete Blog Post Outline with Filled-In Sections

**Input:** "Write an outline for a listicle: '7 VS Code Extensions Every Python Developer Needs in 2025.' Audience: intermediate Python developers. Fill in the intro and one list item as examples."

**Output:**

> **Title:** 7 VS Code Extensions Every Python Developer Needs in 2025
>
> **Meta description:** Boost your Python workflow with these 7 essential VS Code extensions for linting, testing, debugging, and more. Updated for 2025.
>
> **Target keyword:** VS Code extensions Python
>
> ---
>
> **Introduction (filled in):**
>
> Visual Studio Code is a popular editor among Python developers for good reason — it is fast, free, and highly customizable. (If you claim it is *the most* popular, cite a current developer survey.) But a stock VS Code install only scratches the surface. The right extensions can turn it into a full-featured Python IDE with intelligent autocomplete, real-time linting, one-click debugging, and seamless virtual environment management. Here are seven extensions that will save you real time every single day in 2025.
>
> **1. Pylance — Supercharged IntelliSense (filled in):**
>
> Pylance replaces the default Python language server with a blazing-fast type checker and autocomplete engine built on Pyright. It catches type errors before you run your code, surfaces inline documentation as you type, and handles complex type annotations that the default extension misses entirely. If you write any amount of typed Python — and you should — Pylance is non-negotiable. Install it once and you will wonder how you ever coded without it.
>
> **2. Ruff — Lightning-Fast Linting and Formatting** [to be filled]
>
> **3. Python Test Explorer — Visual Test Runner** [to be filled]
>
> **4. GitLens — Git History in Your Editor** [to be filled]
>
> **5. Docker — Container Management** [to be filled]
>
> **6. Jupyter — Interactive Notebooks Inside VS Code** [to be filled]
>
> **7. autoDocstring — One-Click Docstrings** [to be filled]
>
> **Conclusion:** Recap the extensions, emphasize that a well-configured editor is a productivity multiplier, and CTA: "Share your favorite Python extension in the comments."

### Example 2: Writing an Intro Paragraph with a Hook

**Input:** "Write an intro paragraph for a blog post titled 'Why Your Startup Should Adopt Infrastructure as Code on Day One.' Audience: non-technical startup founders. Hook style: surprising statistic."

**Output:**

> [STATISTIC ABOUT OUTAGES CAUSED BY CONFIGURATION MISTAKES — placeholder. Find it, check the original report, and add the source and year. If you cannot trace one, open with the reader's problem instead.] When an outage comes from manual server setup, someone has usually mistyped a setting, forgotten to open a port, or been unable to rebuild the production environment when it mattered. Infrastructure as Code (IaC) cuts that risk by treating your servers, networks, and deployments as version-controlled code — code that can be reviewed, tested, and rolled back like the software it runs. It will not stop every mistake, but it makes them easier to spot and undo. You do not need a dedicated DevOps team to get started, and the earlier you adopt it, the less clean-up you face later. In this post, we will break down what IaC is, why it matters even at the five-person stage, and how to take a first small step.

*(Illustrative example only. The bracket is a placeholder, not a real finding, and no statistic or source is given here. Never publish a number you cannot trace to its original source.)*

## Best Practices

- **Start with the hook, not the backstory.** Readers decide in the first two sentences whether to keep reading. Open with a surprising fact, a provocative question, or a direct statement of the reader's problem. Save the context for the second paragraph.
- **Use descriptive, keyword-rich headings.** "Step 3: Configure the Database Connection" is better than "Step 3: Configuration." Headings should be useful on their own when someone skims.
- **Break up long sections.** No paragraph should exceed 4-5 sentences in a blog post. Use subheadings, bullet points, code blocks, and pull quotes to create visual rhythm and let readers scan.
- **Link internally and externally.** Internal links keep readers on your site and improve SEO. External links to credible sources build trust. Aim for 2-3 internal links and 1-2 external links per 1,000 words.
- **End with a clear CTA.** Every blog post should ask the reader to do something: subscribe, try the product, leave a comment, read the next post. A post without a CTA is a missed opportunity.
- **Write for the featured snippet.** Structure one section as a concise, direct answer to the primary keyword query. Use a definition paragraph, a numbered list, or a table that Google can pull into a featured snippet.

## Edge Cases

- **Topics with no search volume:** For thought leadership or opinion pieces targeting niche audiences, SEO optimization is secondary to originality and depth. Focus on unique insights rather than keyword density.
- **Highly competitive keywords:** When the top results are all from high-authority domains, target a long-tail variant of the keyword (e.g., "GitHub Actions CI/CD tutorial for monorepos" instead of "CI/CD tutorial") to find a rankable niche.
- **Time-sensitive content:** Posts referencing specific tool versions, pricing, or events should include a "Last updated" date and a note that details may have changed. Plan for periodic content refreshes.
- **Multi-author blogs:** When writing for a blog with an established voice, review 2-3 recent published posts to match the existing tone, sentence style, and formatting conventions.
- **Very long posts (3,000+ words):** Include a table of contents with anchor links at the top. Consider whether the post should be split into a series for better readability and sustained engagement.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Pre-publish content checker](https://useaiblocks.com/skills/pre-publish-content-checker). It takes the draft.
- The [Dialogue editor](https://useaiblocks.com/skills/dialogue-ear-checker). It takes the draft.
- The [Draft proofreader](https://useaiblocks.com/skills/draft-proofreader). It takes the draft.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
