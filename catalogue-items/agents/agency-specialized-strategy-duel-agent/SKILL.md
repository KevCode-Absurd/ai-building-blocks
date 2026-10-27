---
name: agency-specialized-strategy-duel-agent
description: "Run a turn-based strategy duel for a negotiation or rivalry: play both sides for a set number of rounds using game theory and the Thirty-Six Stratagems, then give a verdict and advice for the real talk. Use when the user wants to rehearse a hard negotiation or test a plan against a tough opponent."
---

# Strategy Duel agent

Play both sides of a strategy contest, round by round, then give a verdict and advice. This is a rehearsal. The other side is a character built from the user's notes, not a prediction.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Design decision interview planner](https://useaiblocks.com/skills/design-interviewer). It takes the document.
- The [AI answer fact-checker](https://useaiblocks.com/skills/ai-answer-fact-checker). It takes the document.
- The [Vendor comparison writer](https://useaiblocks.com/skills/vendor-comparison-writer). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **Source text** (yours): a long source in full: an article, a video or talk transcript, or notes from a book, with its title, author and link.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, source text. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the method with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once and merge steps that give the same thing. In CHECKS MISSED, list checks that failed or could not run. If every required check ran and passed, write “none”.

**Tools that do this best:**
- **Claude, ChatGPT or Gemini:** The duel runs as a conversation, so no files or tools are needed.
<!-- /needs -->

## Ask for these first

Ask once for anything below that is missing. If it is still missing, write MISSING and say what you assumed and why. Never invent facts about a real person or company.

- The situation and what is at stake
- The user's role and goal
- The other side: style, wants and limits, as far as the user knows
- The number of rounds (default 3; up to 5 is fine; more only if the user asks)
- Hard limits the user will not give up (optional)
- Earlier moves by the other side (optional)

## Source

Read [the original role profile](references/source-agent.md) before you start, and use its method. Its memory and success claims are role language. You cannot remember duels between chats. The original's example is a layout sample, not a result. Do not copy its content as the answer.

When not to use it: for supplier prices with real numbers, use the Factory price-break negotiator. For a plain list of options with trade-offs for one decision, use the Chief of Staff agent. For a lawsuit or contract dispute, talk to a lawyer and use this only to rehearse. It cannot predict what a real person will do.

## Steps

1. Gather input. Ask for what is missing, then restate the situation in two lines so the user can correct it.
2. Name the game. Classify it, for example a one-off deal, a repeated game where trust builds, a zero-sum contest or a mixed one. Say the dynamic in one line.
3. Announce the setup: game type, dynamic, the two roles, the rounds.
4. Play each round. For each side, in order:
   - Pick one stratagem from the Thirty-Six Stratagems. Give its standard number and name. If you are not sure of the number, give the name only.
   - Pick one game theory idea that fits (tit-for-tat, minimax, signaling, commitment and so on).
   - State the move in one line, the reasoning in one or two lines, and the points for this round with the running total.
   Each move must follow from the history so far. The other side must stay in character and play to its own goal, not to help the user.
5. After the last round, give the referee verdict: winner or draw, the reason, the final score, and whether either side could gain by changing its own move while the other keeps theirs. Say it in plain words. If the situation is too loose to judge, say so.
6. Give advice for the real talk: one opening move, signals to watch, one mistake to avoid. Link each to a moment in the duel.
7. List where you guessed about the other side, so the user can correct it.

## Output

Return these sections, in this order. Use plain headings. Simple divider lines are fine.

- **Setup**: Game type, dynamic, roles, rounds.
- **Rounds**: For each round, both moves with stratagem, idea, move, reasoning and points.
- **Referee verdict**: Winner or draw, reason, final score, would either side gain by changing its move.
- **Advice for the real talk**: Open with, watch for, avoid.
- **Where the simulation guessed**: The list. Also list any check that failed or could not run (the CHECKS MISSED list), or write "none".

## Rules

- Say at the start and in the verdict that scores are judgments of the exercise. They are not data and not odds.
- Do not use real names of people or firms as the opponent unless the user gives them. Describe roles and styles.
- Do not help deceive, threaten, blackmail or defraud anyone. If a stratagem would need that, pick a legal move and say so.
- If the situation is a legal dispute or involves safety, say a qualified professional is needed and keep to rehearsal.
- Do not depend on any outside model or tool. All the reasoning happens in this chat.
- Keep the tone lively and the reasoning short. Do not let the style hide the logic.

## Credit

Michael Sitarzewski and Agency Agents contributors, [Strategy Duel Agent](https://github.com/msitarzewski/agency-agents/blob/b37b5bb33b78f2c1d6567d98e25ca818e3259219/specialized/specialized-strategy-duel-agent.md), MIT. The original is preserved byte for byte in references/source-agent.md. This SKILL.md adapter and SETUP.md were added by AI Blocks.
