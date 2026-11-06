# Publish recipes online

**Trigger:** Tested recipes are ready for the client's website or blog, or old recipe posts need fixing.

**Cadence:** Per post, or on a weekly or fortnightly publishing schedule the client sets.

**Access:** Level 1 (read) on the site and Search Console is enough to plan and write. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits (for example: "publish approved posts in the Baking and Bread categories on Tuesdays at 9 am; update existing recipe cards with an update note; no deleting, no changes to sponsor disclosures").

## Steps

1. **Pick the posts.** From the client's tested recipes and Search Console queries, choose what to publish or fix first. *Approval: the client agrees the list and order.*
2. **Write the post.** Run the `recipe-blog-post` skill or prompt: disclosure if needed, headnote, card, tips and swaps, FAQ from real questions, markup fields, alt text and originality note. Safety temperatures come from the official source: check this with your local food safety authority.
3. **Build it on the site.** [L2] Create the draft post and the unpublished recipe card in the recipe plugin, with the markup fields filled from the card.
4. **Check before publishing.** Card matches the tested master; disclosure present where needed; allergen notes copied exactly; no health or nutrition claims; no step numbers inside the markup instructions; credit for any adapted recipe. *Approval: the client approves the post, or approves the batch under level 3 limits.*
5. **Publish.** [L3] Publish or schedule in the agreed category and time, and log it.
6. **Fix old posts.** [L3] Update cards and markup on old posts within the limits, adding an "updated" note with the date and what changed.
7. **Watch the comments.** Collect reader questions and failure reports each week. Repeated failures start the `recipe-development-cycle` workflow for that recipe. Any report of a reaction or illness goes to the client at once.

## Outputs

- Published or scheduled posts with matching recipe cards and markup
- Updated old posts with dated notes
- A log of every live change
- A list of reader questions and failures for the next round

## Needs the client's approval

The publishing list and order; each post or batch of posts; any sponsored or affiliate post and its disclosure; any brand agreement (the client signs); allergen, dietary and nutrition information; deleting or unpublishing anything; posting in a new category or site.
