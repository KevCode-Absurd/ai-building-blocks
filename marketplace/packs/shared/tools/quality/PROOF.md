# Proof step: prove it, don't say it

Run on the finished deliverable, after the check and before delivery. Ship evidence, not "I verified it".

## 1. Run the tool

`node tools/quality/proof.cjs <deliverable> --sources <job research file> <company memory files>`

Add `--allow-external` only when the page is meant to load outside scripts or styles.

## 2. Fix every FAIL (exit code 1 until you do)

- **Dead link**: swap in a live page that says the same thing, or drop the claim.
- **Sum off by more than 1%**: recalculate; fix the number everywhere it repeats.
- **HTML**: add the missing id, viewport tag or single h1.

## 3. Resolve every WARN

- **Figure not in sources**: confirm it on the live source (add URL and date to research), correct it, or label it in the text: "estimate", "proposal", "our calculation: A ÷ B". A "maybe derived" hint is a lead, not proof: redo the sum.
- **Proposed dates, targets, budgets**: keep, but make them read as proposals.
- **Link 401/403/429 or timeout**: open it in a browser; keep it only if a person can reach it.
- **HTML** (alt, labels, nesting, outside files): fix unless the brief says otherwise.

## 4. Prove what the tool cannot

- **Code**: run it; quote the real output.
- **Spreadsheet**: recalculate every formula; confirm totals.
- **Key links**: open them; confirm each page says what the text claims.

Re-run until 0 FAIL and every WARN is confirmed, fixed or labelled.
