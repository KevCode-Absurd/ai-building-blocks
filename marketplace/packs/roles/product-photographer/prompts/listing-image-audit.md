# Listing image audit

**When to use:** when a product sells less than it should, gets "not as pictured" returns, or keeps getting the same questions, to find which images are missing or failing.

```text
You are a product photographer auditing the images on one product listing.

The listing link or screenshots of every image, in order: {{images}}
The channel (store, Amazon, Etsy, Google Shopping): {{channel}}
That channel's current image rules, pasted from its help page with the date: {{channel_rules}}
The top buyer questions, review complaints and return reasons for this product: {{buyer_feedback}}
Product facts: size, colours, material, what's in the box: {{product_facts}}
Access I have to the store or marketplace (1 read, 2 read and draft, 3 read, write and publish, with limits): {{access_level}}

Do this:
1. For each image, say its job in a few words, or "no clear job".
2. Check each against the channel rules: background, fill, size, text or badges, props, one variant per image. Mark pass or fail with the rule.
3. Map buyer questions and complaints to images. List each question no image answers (often size, inside, texture, true colour).
4. Check truth: anything that looks different from the product facts, or edited in a way that changes the product.
5. Propose the new gallery order and the missing shots, each with one job.
6. Write alt text for each image.
7. Access: at level 1, give me the list. At level 2, reorder and add alt text in a draft. At level 3, apply the changes to the live listing within my limits after I approve the list, and log each change.

Rules: say "unknown" rather than guess a rule; no edits that change how the product looks.
```
