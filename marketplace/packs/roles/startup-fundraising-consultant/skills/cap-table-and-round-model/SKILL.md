---
name: cap-table-and-round-model
description: Builds and checks a startup cap table from the share register, option grants, SAFEs and notes, listing every conflict between the records before building anything; shows issued and fully diluted ownership; models the next round from the terms given (amount, pre-money, option pool top-up and where it sits) with each SAFE or note converted on its own terms, step by step; and compares up to four versions of the round side by side with what founders keep. Ends with a plain-words founder summary and questions for the lawyer. Use it before signing a term sheet, after a SAFE round, or to check a cap table someone else built. It does the maths on the terms given; it does not value the company or say whether to accept a deal.
---

# Cap table and round model

## When to use

- Founders are discussing a priced round and want to see who owns what before and after.
- SAFEs or notes are outstanding and the founder wants to know how they convert.
- Two term sheets differ on valuation, amount or pool size and the founder wants the numbers side by side.
- A cap table built by someone else needs checking against the documents.
- Moving from one equity tool to another (for example, Pulley says it is shutting down on 8 December 2026).

Share documents are legal documents, and the instrument's own wording decides every conversion. I do the maths on the terms given; the founder's lawyer checks the documents and the founder decides with them. Tax questions about shares and options go to an accountant. Check this with local rules and ask a qualified accountant or lawyer.

## What you need

1. The share register or cap table export: every holder, share class and number of shares.
2. Option plan size, grants (holder or role, number, date, vesting) and the unallocated pool.
3. Every SAFE and note: amount, date, type (post-money or pre-money SAFE, note), valuation cap, discount, interest, MFN or side letters.
4. Warrants or other rights.
5. The round being discussed: amount, pre-money valuation, option pool target and whether the top-up comes before the new money, and any other terms that change share counts.
6. The documents themselves where possible, not just a summary.

**Access:** level 1 to read the cap table tool or exports; level 2 to model the round in a copy or draft scenario; level 3 to update holder records to match documents the lawyer has confirmed. Issuing shares or options and sending documents for signature need a fresh yes each time and the lawyer's sign-off.

## Steps

### 1. List conflicts before building

Compare the register, grant letters, board approvals and SAFE documents. List every mismatch: share totals, grant counts, dates, terms. If a conflict changes percentages, stop and ask the lawyer which record is right.

### 2. Build the current table

One row per holder and class: shares or options, source document, issued %, fully diluted %. Fully diluted counts all issued shares, granted options, the unallocated pool and warrants. Show SAFEs and notes separately as "not yet converted", with their terms.

### 3. Convert each SAFE or note on its own terms

For a post-money SAFE with a valuation cap, YC's user guide gives the logic: the share sold is the amount divided by the post-money cap, and the cap counts all SAFE money and the existing options and pool but not the new round's money or new pool. Work out the SAFE price from the cap and the capitalisation the document defines, compare with any discount price and the round price, and use the one the document says applies. For a note, add accrued interest as the note defines it, then apply the cap or discount. Show every step in order, with the clause it comes from.

### 4. Model the round

From the terms: new money, pre-money valuation, option pool target (as a share of the post-round total) and whether the top-up sits in the pre-money. Solve for the pool top-up, the new investors' shares and the price per share together, so that the post-round pool hits the target. Show the top-up as its own line, because it dilutes existing holders, not the new investors, when it sits in the pre-money.

### 5. Build the post-round table

Each holder before and after, issued and fully diluted, and the change in points. Check that shares add to the total and percentages to 100.

### 6. Compare versions (if asked)

Up to four versions: different amounts, valuations or pool sizes. One table: founders' combined %, each founder's %, new investors' %, SAFE holders' %, pool %. No view on which is better.

### 7. Write the founder summary

One page in plain words: what changes, who owns what, the price per share, and the questions for the lawyer (for example: does the pool target count promised grants? Does any side letter give pro rata rights in this round?).

## Checks

- Conflicts listed first; none silently resolved.
- Every row has a source document.
- Each conversion follows its own document, step by step.
- The pool top-up is shown separately, and the pool hits its target after the round.
- Shares and percentages tie.
- No valuation advice and no view on accepting terms.
- The summary ends with: *Maths on the terms given. Your lawyer checks the documents. Check this with local rules and ask a qualified accountant or lawyer.*

## Output format

1. Conflicts and gaps list.
2. Current cap table (issued and fully diluted, source column).
3. Conversion steps for each SAFE or note.
4. Round model: price per share, pool top-up, new shares.
5. Before and after table.
6. Version comparison (if asked).
7. Founder summary and lawyer questions.

## Example of good output (short)

Made-up company for illustration: two founders with 4,500,000 shares each; 600,000 options granted and 400,000 unallocated; one post-money SAFE of 500,000 at a 5,000,000 cap. The round: 2,000,000 at an 8,000,000 pre-money, with the unallocated pool topped up to 10% of the post-round total inside the pre-money.

> **SAFE:** 500,000 / 5,000,000 = 10% of the capitalisation before the round, so 1,111,111 shares (10,000,000 existing fully diluted shares, plus the SAFE shares). SAFE price 0.45; round price 0.6535; the cap applies.
>
> **Round:** post-round total 15,301,587 shares; pool top-up 1,130,159; new investors 3,060,317 shares for 2,000,000.
>
> | Holder | Before (as converted) | After |
> |---|---|---|
> | Founders (together) | 81.0% | 58.8% |
> | Options granted | 5.4% | 3.9% |
> | Unallocated pool | 3.6% | 10.0% |
> | SAFE holder | 10.0% | 7.3% |
> | New investors | none | 20.0% |
>
> **For your lawyer:** does the SAFE's capitalisation definition count the 400,000 unallocated options as we have? Is the 10% pool target measured on the post-round total?
>
> *Maths on the terms given. Your lawyer checks the documents. Check this with local rules and ask a qualified accountant or lawyer.*
