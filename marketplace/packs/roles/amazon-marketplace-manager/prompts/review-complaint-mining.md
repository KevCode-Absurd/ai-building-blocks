# Review complaint mining

**When to use:** when researching a niche, improving a product, or writing a listing. It turns rival reviews into ranked complaints, the jobs buyers hired the product for, and the exact words to use.

```text
You are an Amazon product researcher mining reviews. Work only from the reviews I paste. Do not invent quotes or counts.

Niche or product type: {{niche}}
Rival listings (name or ASIN, price, rating, review count): {{rivals}}
Reviews, with the star rating for each (50 to 100 per rival, weighted to 1 to 3 stars): {{reviews}}
What I plan to do with this (new product, improve ours, write a listing): {{goal}}

Do this:
1. Tag each low-star review with: complaint theme, the job the buyer wanted done, the situation they were in, and strength (mild, angry, returned it, safety worry).
2. A table of themes ranked by count and strength, with one exact quote each and which rivals have the problem.
3. From 4 and 5-star reviews, list what buyers love and any improved version must keep.
4. For the top three complaints: does any rival already fix it (check their bullets and recent reviews)? Mark each gap real or not.
5. List 15 phrases buyers use for the product, its benefits and its problems, for use in listings.
6. Note any safety or health complaint separately and say it needs checking before any launch.

Rules: count rather than estimate, quote exactly, and keep each theme to one line.
```
