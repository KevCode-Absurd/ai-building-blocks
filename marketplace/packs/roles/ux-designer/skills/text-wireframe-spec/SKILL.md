---
name: text-wireframe-spec
description: Turns a product brief or feature list into a screen-by-screen wireframe spec written in words - a screen list, a flow map, then for each screen its one job, layout zones, components with exact words, every state (empty, loading, error, success, no permission, offline), what each tap does, and mobile and desktop notes with accessible sizes. Use it when a founder is briefing a developer, when a feature list needs to become screens, or when you need to find missing states before anything is built. With level 2 access to a design tool it can also lay the frames out as a draft.
---

# Text wireframe spec

## When to use

- A founder or small team has a feature list and needs screens a developer can build from.
- A flow (sign-up, booking, checkout, onboarding, settings) needs to be agreed before design or code.
- A build keeps coming back with "what happens if...?" questions, which means states are missing.

Not for visual style, brand mock-ups or code. The spec says what is on each screen and how it behaves; a visual designer or developer decides how it looks.

## What you need

1. **The product and its users:** who uses it, on what device, and the one job of the app or flow.
2. **The feature list or brief**, plus any existing screens or screenshots.
3. **Business rules:** prices, limits, who can see what, what happens on payment failure. Anything not given becomes an open question. Never invent a rule or a price.
4. **Platform:** web, iOS, Android or all three, and any design system in use (Material 3, Apple's guidelines, a Tailwind-based kit, the client's own).
5. **Words that are fixed:** legal text, brand names, product terms.
6. **Access I have:** the level the client grants in each tool (1 read, 2 read and draft, 3 read, write and publish). Steps 1 to 9 need level 1 only. Step 10 (laying out draft frames in the design tool) needs level 2. Until the client answers, work at level 1.

## Steps

1. **Write the one job.** One sentence: "This flow lets a returning customer rebook their last appointment in under a minute." If you cannot write it, ask before going further.
2. **List the screens and draw the flow map.** Entry points (link, notification, home screen), the main path, branches (errors, edits, cancel) and exits. Write it as a numbered list or a simple Mermaid flowchart. Flag every screen the brief implies but does not name ("payment failed", "slot no longer free", "email not verified").
3. **Give each screen one main action.** Write it as the button label, starting with a verb that names the result ("Book Thursday 10:00", not "Submit"). If a screen has two main actions, split the screen or make one clearly secondary, and say why.
4. **Lay out the zones top to bottom.** Header, main content, actions, navigation. For each zone, list the components in order with their exact words: headings, labels, hint text, button labels, link text. Labels sit outside fields, never as placeholder text only.
5. **Write every state for every screen.**
   - **Empty:** what belongs here and one clear first step.
   - **Loading:** what shows, and what happens if it takes long.
   - **Error:** each failure, what the message says (what happened, how to fix it), where it appears, and that typed input is kept.
   - **Success:** confirmation, what happens next, where the user lands.
   - **No permission, offline, expired session:** only where relevant.
6. **Write what every tap does.** For each button, link and gesture: where it goes, what it saves, what it sends, and whether it can be undone. Destructive actions get a confirm step that names what will be lost.
7. **Add mobile and desktop notes.** What stacks, what hides behind a menu, what stays fixed. Touch targets at least 44 by 44 points on Apple platforms and 48 by 48 dp on Android; on the web never below 24 by 24 CSS pixels unless a WCAG exception applies. Note keyboard order and visible focus for web. Do not hide focus behind sticky headers or footers.
8. **Run the accessibility and honesty checks.** Every field has a visible label. Errors do not rely on colour. Help sits in the same place on every screen. No step asks people to retype what they already entered. Sign-in allows paste and password managers, with no memory or puzzle test unless there is an alternative. No hidden cancel, pre-ticked consent, fake urgency or late extra costs.
9. **End with open questions and a build order.** Each missing rule as a question with an owner. Suggest an order: main path first, then errors, then edge cases.
10. **Level 2: lay out draft frames.** With level 2 access to the client's design tool (for example through Figma's MCP server, where canvas writing is in beta as of November 2026), create the frames in a new draft file or page named "DRAFT - wireframes", following the spec. Do not overwrite existing frames or publish library changes. Log what you created. Level 3 (editing shared files, publishing components) only within limits the client has confirmed.

## Checks

- Every screen named in the brief has a section; implied screens are flagged.
- Every screen has one main action with a verb-first label.
- Every screen lists its states; every error message says what happened and how to fix it.
- Every tap has a destination; destructive actions have a confirm step.
- Sizes and focus notes meet the platform guide and WCAG 2.2 minimums.
- No invented prices, rules, features or numbers; gaps are open questions.
- No deceptive patterns.

## Output format

1. One job, users, platform, access level.
2. Flow map (numbered list or Mermaid).
3. Screen sections: job, main action, zones and components with exact words, states, tap actions, mobile and desktop notes.
4. Accessibility and honesty check results.
5. Open questions (question, why it matters, owner).
6. Suggested build order.
7. Action log (if any level 2 or 3 work).

## Example of good output (short)

*Fernway Dog Walks is a made-up business used only to show the format: a mobile web flow for rebooking a walk. Access I have: level 1 (brief and two screenshots).*

**Screen 3: Choose a time**
- **Job:** pick a free slot for the same dog and walker.
- **Main action:** "Book Thursday 10:00" (label updates with the chosen slot).
- **Zones:** Header: "Rebook Bramble's walk" and a back arrow labelled "Back to your walks". Content: date strip (7 days), then time list. Each slot shows time and length ("10:00, 30 min"). Taken slots are hidden, not greyed. Actions: main button fixed to the bottom, 48 px high, full width.
- **Empty:** "No free times with Sam this week." Button: "See other walkers". Link: "Pick another week".
- **Loading:** slot list shows three placeholder rows; after 8 seconds, "Still loading. Check your connection or try again" with "Try again".
- **Error (slot taken while choosing):** inline above the button: "Thursday 10:00 was just booked by someone else. Pick another time." The list refreshes; the date stays selected.
- **Success:** goes to Screen 4, "Booked: Thursday 10:00 with Sam", with "Add to calendar" and "Back to your walks".

**Open question:** Can a customer rebook with a different walker without new approval? Owner: business owner.
