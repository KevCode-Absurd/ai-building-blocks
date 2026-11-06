# UI polish pass on a live product

**Trigger:** a product works but "looks off", before a launch, demo or funding round, or after a scan flags low contrast. Can repeat each quarter. About one to two weeks for the main screens.

## Steps

1. **Intake and access.** Confirm the main task, platforms, themes and the screens that matter most (by traffic or revenue if the client knows). Ask which access level the client grants in each tool and record it. Until they answer, work at level 1.
2. **Take stock (prompt: extract-styles-from-screenshots).** List the sizes, colours, spacings and component versions really in use. Level 1.
3. **Review (skill: ui-review-before-after).** Before-and-after notes per screen, ranked with the main task first. Level 1.
4. **Contrast and dark mode (skill: contrast-and-dark-mode-check).** Every pair measured, with fixes. Level 1.
   **Approval point 1:** the client picks which fixes to make now, which later, and which not at all.
5. **Set or tighten foundations (skill: ui-foundations-and-component-sheet).** Only if the review shows there are no shared values; otherwise map fixes to the existing ones.
6. **Apply fixes.**
   - Level 2: open a pull request with the CSS or theme changes, or make the changes on a staging site or unpublished draft in the site builder; add notes as comments in the design file; prepare tickets as a draft list.
   - Level 3: after the client confirms the action list and limits (which screens, which kinds of change such as "colours and spacing only", until when), merge the approved pull request or publish the style changes on the named pages, and create the tickets; log each action. Ask again before touching screens outside the list.
   **Approval point 2:** the client checks the staging or preview version before anything goes live.
7. **Recheck.** Measure contrast again on the live screens and compare before and after screenshots.

## Outputs

- Style inventory of what is in use.
- Ranked review with before-and-after values.
- Contrast table and dark mode notes.
- Pull request, staging changes or tickets (level 2), or published changes (level 3).
- Before-and-after screenshots and the action log.

## Needs the client's approval

- The access level for each tool and the level 3 limits.
- Which fixes to make (point 1).
- The preview before go-live (point 2).
- A fresh yes for anything outside the named screens or change types, and for any deletion.
