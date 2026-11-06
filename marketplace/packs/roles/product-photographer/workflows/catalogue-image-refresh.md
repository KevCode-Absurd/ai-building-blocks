# Catalogue image refresh

**Cadence:** each quarter, and whenever a channel announces a change to its image rules (for example, Google Merchant Center's 500 x 500 pixel minimum for all products from 31 January 2027). For sellers with an existing catalogue on one or more channels.

## Steps

1. **Access check.** Confirm the level for each store, marketplace and feed, and record it under "Access I have", with level 3 limits. Until the client answers, level 1.
2. **Re-check the rules (skill: channel-image-spec-and-ai-check, step 1).** Open each channel's image rule page, update the spec sheet, and list what changed since the last refresh with dates.
3. **Pull the image errors (level 1).** Screenshots or exports of image warnings, disapprovals and suppressed listings from each channel.
4. **Find the gaps.** For the busiest products first, run the prompt `listing-image-audit`: images that break a rule, buyer questions no image answers, colour complaints in reviews and returns.
5. **Check consistency.** Lay out one collection's main images side by side. Flag any that break the style guide (light, angle, background, crop).
6. **Check AI images.** List every AI-edited or AI-generated image in use. Confirm each keeps its metadata, is not a marketplace main image, and still matches the product. Flag any EU-facing realistic AI scenes for the client to check against Article 50 of the EU AI Act.
7. **Plan the fixes.** Group them: re-export (size, colour space, metadata), re-edit from the master, reshoot (missing scale, detail or colour), or remove. Estimate the reshoot list as a mini shot list (skill: shot-list-and-shoot-brief).
   **Approval point 1:** the client approves the fix list, any reshoot, and any AI edits.
8. **Apply.**
   - Level 1: deliver corrected files, order and alt text.
   - Level 2: upload corrected images to drafts; save edits as new files.
   - Level 3: show the action list (each listing, slot, file) and limits, get a yes, then replace within them. For Google, give changed images new URLs. Log each action.
9. **Watch and report.** Check for new image errors over the following days; stop and tell the client if any appear. Report what changed, the action log, rule changes found, and the reshoot list for next time.

## Outputs

- Updated, dated channel spec sheet and a list of rule changes.
- Audit results for the busiest products, consistency notes and an AI image register.
- Fix list grouped by type, with a mini shot list for reshoots.
- Corrected drafts or live listings, with the action log.

## Needs the client's approval

- The access level per tool and, for level 3, the limits.
- The fix list, reshoots and AI edits (point 1).
- Removing images, replacing main images on best sellers, or touching listings outside the limits, asked again each time.
